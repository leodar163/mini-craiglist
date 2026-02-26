import {RecordId} from "surrealdb";

export interface User {
    id: string;
    email: string;
    password: string;
}

export interface UpdateUser {

}

export interface UserDB {
    id: RecordId;
    email: string;
    password: string;
}

export function convertUserFromDB(...users: UserDB[]): User[] {
    return users.map(user => ({
        ...user,
        id: user.id.id.toString(),
    }))
}