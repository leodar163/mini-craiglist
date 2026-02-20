import { connectDB, db } from "@/lib/db/surrealdb";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();

    const result = await db.query("RETURN 'Hello SurrealDB'");

    return NextResponse.json(result);
}