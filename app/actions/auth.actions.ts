"use server";

import bcrypt from "bcrypt";
import {cookies} from "next/headers";
import {DBTables, getDB} from "@/lib/db/surrealdb";
import {DateTime, eq, RecordId} from "surrealdb";
import {CreateUser, UserDB} from "@/lib/types/user";
import {convertSessionFromDB, Session, SessionDB} from "@/lib/types/session";
import {ServerActionResponse} from "@/lib/types/actions";

export async function register(newUser: CreateUser): ServerActionResponse<undefined> {
    const db = await getDB();

    const hash = await bcrypt.hash(newUser.password, 12);

    try {
        await db.create<UserDB>(DBTables.user).content({
            ...newUser,
            password: hash,
        });

        return {success: true, value: undefined};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? new Error(error.message) : new Error("Unknown DB error")
        };
    } finally {
        await db.close();
    }
}

export async function login(email: string, password: string): ServerActionResponse<undefined> {
    let db = await getDB();

    const userResults = await db.select<UserDB>(DBTables.user).where(eq("email", email));
    await db.close();
    const user = userResults.length > 0 ? userResults[0] : null;

    if (user == null) {
        return {
            success: false,
            error: new Error("Cannot login as no user with those ids exists"),
        };
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        return {
            success: false,
            error: new Error("Cannot login as password is invalid"),
        };
    }
    db = await getDB();
    const sessionResults = await db.select<SessionDB>(DBTables.session).where(eq("user", user.id));
    await db.close();
    let session = sessionResults.length > 0 ? sessionResults[0] : null;

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    db = await getDB();
    if (session == null) {
        [session] = await db.create<SessionDB>(DBTables.session).content({
            user: user.id,
            expiresAt: new DateTime(expires),
        });
    } else {
        session = await db.update<SessionDB>(session.id).merge({expiresAt: new DateTime(expires)})
    }
    await db.close();

    if (session.expiresAt.toDate().getTime() <= Date.now()) {
        await db.delete(session.id);
    }

    (await cookies()).set({
        name: 'session',
        value: session.id.id.toString(),
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires,
        path: "/",
    });

    return {
        success: true,
        value: undefined,
    };
}

export async function logout() {
    const db = await getDB();

    const cookieStore = await cookies();

    const sessionId = cookieStore.get("session")?.value;

    if (sessionId) {
        await db.delete(new RecordId('session', sessionId));
    }

    cookieStore.delete("session");

    db.close();
}

export async function getSession(): ServerActionResponse<Session> {

    const cookieStore = await cookies();

    const sessionId = cookieStore.get("session")?.value;

    if (!sessionId) return {
        success: false,
        error: new Error("Cannot find session as you are not logged in"),
    };

    let db = await getDB();

    // const sessionResult = await db.query<[SessionDB[]]>(`SELECT * FROM session WHERE id = session:${sessionId};`).collect();
    // const session = sessionResult[0][0] ?? null;
    const session = await db.select<SessionDB>(new RecordId(DBTables.session, sessionId));
    await db.close();

    if (!session) {
        cookieStore.delete("session");
        return {
            success: false,
            error: new Error("Session not found"),
        };
    }

    db = await getDB();
    if (session.expiresAt.toDate() < new Date()) {
        await db.delete(new RecordId('session', sessionId));
        cookieStore.delete("session");
        return {
            success: false,
            error: new Error("Session expired"),
        };
    }
    await db.close();

    db = await getDB();
    const user = await db.select<UserDB>(session.user);
    if (user == null) return {
        success: false,
        error: new Error("cannot get session's user"),
    }
    db.close();

    return {
        success: true,
        value: convertSessionFromDB([session], [user])[0]
    };
}