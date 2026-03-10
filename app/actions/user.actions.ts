'use server';


import {ServerActionResponse} from "@/lib/types/actions";
import {convertUserDB, UpdateUser, User, UserDB} from "@/lib/types/user";
import {getSession} from "@/app/actions/auth.actions";
import {DBTables, getDB} from "@/lib/db/surrealdb";
import {inside, RecordId, RecordIdRange} from "surrealdb";

export async function getUser(userId: string): ServerActionResponse<User> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();
    const user = await db.select<UserDB>(new RecordId(DBTables.user, userId));
    db.close();

    if (!user) {
        return {
            success: false,
            error: new Error(`Can't find user of id ${userId}. It may not exist`)
        };
    }

    return {
        success: true,
        value: convertUserDB(user)[0]
    };
}

export async function getMultipleUsers(userIds: string[]): ServerActionResponse<User[]> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const ids = userIds.map(id => new RecordId(DBTables.user, id));

    const db = await getDB();
    try {
        const usersResult = await db.select<UserDB>(DBTables.user).where(inside("id", ids));

        return {
            success: true,
            value: convertUserDB(...usersResult)
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? new Error(error.message) : new Error("Unknown DB error")
        }
    }
    finally {
        db.close();
    }
}

export async function updateUser(userId: string, update: UpdateUser): ServerActionResponse<User> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }
    const db = await getDB();
    const user = await db.update<UserDB>(new RecordId(DBTables.user, userId)).merge({...update});
    db.close();

    if (!user) {
        return {
            success: false,
            error: new Error(`Can't find user of id ${userId}. It may not exist`)
        };
    }

    return {
        success: true,
        value: convertUserDB(user)[0]
    };
}

export async function deleteUser(userId: string): ServerActionResponse<undefined> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }
    const db = await getDB();
    const user = await db.delete<UserDB>(new RecordId(DBTables.user, userId));
    db.close();

    if (!user) {
        return {
            success: false,
            error: new Error(`Can't find user of id ${userId}. It may not exist`)
        }
    }

    return {
        success: true,
        value: undefined
    };
}