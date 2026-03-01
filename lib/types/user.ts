import {Common, CommonDB} from "@/lib/types/common";

export interface User extends Common{
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

export interface UserDB extends CommonDB{
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
        createdAt: user.createdAt.toDate(),
        updatedAt: user.updatedAt.toDate(),
    }))
}