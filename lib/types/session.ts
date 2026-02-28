import {DateTime, RecordId} from "surrealdb";
import {convertUserFromDB, User, UserDB} from "@/lib/types/user";
import {WithID, WithIdDB} from "@/lib/types/common";

export interface Session extends WithID {
    user: User;
    expiresAt: Date;
}

export interface SessionDB extends WithIdDB {
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