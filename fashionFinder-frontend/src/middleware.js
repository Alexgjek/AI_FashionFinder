import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register' || path === '/';
  const token = request.cookies.get("token")?.value || '';
  const shareToken = request.nextUrl.searchParams.get("token") || ''; 

  if (shareToken) {
    return NextResponse.next();
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/chat', request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/login',
    '/register',
    '/albums/:path*',
    '/chat',
    '/about',
    '/contact',
  ],
};
