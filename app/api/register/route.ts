import { NextResponse } from "next/server";
import { db, connectDB } from "@/lib/db/surrealdb";
import bcrypt from "bcrypt";
import {Table} from "surrealdb";

export async function POST(req: Request) {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);

    try {
        const [user] = await db.insert(new Table("user"), {
            email,
            password_hash: hash,
        });

        return NextResponse.json({ success: true, user });
    } catch (e) {
        return NextResponse.json(
            { error: "Email already exists" },
            { status: 400 }
        );
    }
}