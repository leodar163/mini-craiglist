import { NextResponse } from "next/server";
import {getSession, login, register} from "@/app/actions/auth";

export async function GET() {
    const email = "dubuntu@yahoo.com";
    const password = "truc";

    const registerResponse = await register(email, password);
    if (!registerResponse.success) {
        return NextResponse.json(registerResponse.error.message);
    }
    const loginResponse = await login(email, password);
    if (!loginResponse.success) {
        return NextResponse.json(loginResponse.error.message);
    }

    const sessionResponse = await getSession();
    if (!sessionResponse.success) {
        return NextResponse.json(sessionResponse.error.message);
    }

    return NextResponse.json(sessionResponse.value);
}