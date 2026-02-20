import { NextResponse } from "next/server";
import { db, connectDB } from "@/lib/db/surrealdb";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import {User} from "@/lib/types/user";
import {Session} from "@/lib/types/session";
import {Table} from "surrealdb";

export async function POST(req: Request) {
    await connectDB();

    const { email, password } = await req.json();

    const [result] = await db.query<[User]>(
        "SELECT * FROM user WHERE email = $email LIMIT 1",
        { email }
    ).responses();

    if(!result.success) return NextResponse.json({ success: false });

    const user = result.result;

    if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // créer session
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const [session] = await db.insert<Session>(new Table("session"), {
        user: user,
        expiresAt: expires.toISOString(),
    });

    const cookieStore = await cookies();
    cookieStore.set({
        name: 'session',
        value: session.id.id.toString(),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: expires,
        path: '/',
    });

    return NextResponse.json({ success: true });
}