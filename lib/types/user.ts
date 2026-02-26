import {RecordId} from "surrealdb";

export interface User {
    id: string;
    email: string;
    password: string;
    pseudo: string;
    town: string;
    bio: string;
}

export interface CreateUser {
    email: string;
    password: string;
    pseudo: string;
    town: string;
    bio: string;
}

export interface UpdateUser {
    pseudo?: string;
    town?: string;
    bio?: string;
}

export interface UserDB {
    id: RecordId;
    email: string;
    password: string;
    pseudo: string;
    town: string;
    bio: string;
}

export function convertUserFromDB(...users: UserDB[]): User[] {
    return users.map(user => ({
        ...user,
        id: user.id.id.toString(),
    }))
}