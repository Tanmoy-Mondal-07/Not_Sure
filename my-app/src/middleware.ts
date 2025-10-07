import { NextResponse, NextRequest } from 'next/server'
// export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request})
    // console.log("token", token);
    const url = request.nextUrl

    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/signUp') ||
        url.pathname.startsWith('/verify')
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
    matcher: [
        '/sign-in',
        '/signUp',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}