import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/profile" ||
    pathname === "/bookshelf" ||
    pathname.startsWith("/bookshelf/") ||
    pathname === "/learning-paths" ||
    pathname.startsWith("/learning-paths/") ||
    pathname === "/library" ||
    pathname.startsWith("/library/") ||
    pathname === "/feed" ||
    pathname.startsWith("/feed/") ||
    pathname === "/clubs" ||
    pathname.startsWith("/clubs/") ||
    pathname === "/discussions" ||
    pathname.startsWith("/discussions/") ||
    pathname === "/knowledge" ||
    pathname.startsWith("/knowledge/");

  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
