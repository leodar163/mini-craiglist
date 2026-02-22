import {NextRequest, NextResponse} from "next/server";
import {getSession} from "@/app/actions/auth";

export default async function proxy(request: NextRequest) {
    const session = await getSession();
    if (!session.success) {
        const params = new URLSearchParams( {redirect: request.nextUrl.pathname + request.nextUrl.search });
        const url = new URL(`/login?${params.toString()}`, request.nextUrl);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!login|api/test|_next/static|_next/image|.*\\.png$).*)'
}