"use server";

import bcrypt from "bcrypt";
import {cookies} from "next/headers";
import {db, connectDB} from "@/lib/db/surrealdb";
import {DateTime, expr, RecordId, surql, Table} from "surrealdb";
import {UserDB} from "@/lib/types/user";
import {convertSessionFromDB, Session, SessionDB} from "@/lib/types/session";
import {ServerActionResponse} from "@/lib/types/actions";

export async function register(email: string, password: string): ServerActionResponse<undefined> {
    await connectDB();

    if (!email || !password) {
        return {success: false, error: new Error("Cannot register as fields are missing")};
    }

    const hash = await bcrypt.hash(password, 12);

    try {

        await db.create<UserDB>(new Table("user")).content({
            email,
            password: hash,
        });

        return {success: true, value: undefined};
    } catch (error) {
        return {success: false, error: error as Error};
        // return { success: false, error: new Error("Cannot register as email is already used") };
    }
}

export async function login(email: string, password: string): ServerActionResponse<undefined> {
    await connectDB();

    const result = await db
        .query(
            surql`SELECT *
                  FROM user
                  WHERE email = ${email} LIMIT 1`
        )
        .collect<[UserDB[]]>();

    const user = result[0][0] ?? null;

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

    const userId = user.id.id.toString();

    const sessionResult = await db.query(
        surql`SELECT *
              FROM session
              WHERE user = ${userId} LIMIT 1`,
    ).collect<[SessionDB[]]>();

    let session = sessionResult[0][0] ?? null;

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (session == null) {
        [session] = await db.create<SessionDB>(new Table("session")).content({
            user: user.id,
            expiresAt: new DateTime(expires),
        });
    } else {
        session = await db.update<SessionDB>(session.id).merge({expiresAt: new DateTime(expires)})
    }

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
    await connectDB();

    const cookieStore = await cookies();

    const sessionId = cookieStore.get("session")?.value;

    if (sessionId) {
        await db.delete(new RecordId('session', sessionId));
    }

    cookieStore.delete("session");
}

export async function getSession(): ServerActionResponse<Session> {

    const cookieStore = await cookies();

    const sessionId = cookieStore.get("session")?.value;
    if (!sessionId) return {
        success: false,
        error: new Error("Cannot find session as you are not logged in"),
    };

    await connectDB();

    const session = await db.select<SessionDB>(new RecordId('session', sessionId));
    if (!session) return {
        success: false,
        error: new Error("Session not found"),
    };

    if (session.expiresAt.toDate() < new Date()) {
        await db.delete(new RecordId('session', sessionId));
        cookieStore.delete("session");
        return {
            success: false,
            error: new Error("Session expired"),
        };
    }

    const user = await db.select<UserDB>(session.user);
    if (user == null) return {
        success: false,
        error: new Error("cannot get session's user"),
    }

    return {
        success: true,
        value: convertSessionFromDB([session], [user])[0]
    };
}