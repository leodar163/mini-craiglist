import {NextRequest, NextResponse} from "next/server";
import {getSession} from "@/app/actions/auth";

export default async function proxy(request: NextRequest) {
    const session = await getSession();
    if (!session.success) {
        const url = new URL("/login", request.nextUrl);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!login|api/test|_next/static|_next/image|.*\\.png$).*)'
}