import {DateTime, RecordId} from "surrealdb";
import {convertUserFromDB, User, UserDB} from "@/lib/types/user";

export interface Session {
    id: string
    user: User;
    expiresAt: Date;
}

export interface SessionDB {
    id: RecordId,
    user: RecordId,
    expiresAt: DateTime,
}

export function convertSessionFromDB(sessions : SessionDB[], users: UserDB[]): Session[] {
    const newUsers: User[] = convertUserFromDB(...users);
    return sessions.map((session, index) => ({
        id: session.id.id.toString(),
        user: newUsers[index],
        expiresAt: session.expiresAt.toDate(),
    }));
}