import {User} from "@/lib/types/user";

export interface Session {
    user: User;
    expireAt: Date;
}