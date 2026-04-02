import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isFeatureEnabled, isPremiumEnforced, isPremiumUserEmail } from "@/lib/monetization/feature-flags";

const premiumRoutePrefixes = ["/knowledge", "/api/ai", "/api/knowledge/search"];

function isPremiumPath(pathname: string) {
  return premiumRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isFeatureEnabled("premium_route_guards") || !isPremiumPath(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });

  if (!token?.sub) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPremiumEnforced() && !isPremiumUserEmail(typeof token.email === "string" ? token.email : null)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Premium subscription required",
          code: "PREMIUM_REQUIRED",
          upgradeUrl: "/pricing",
        },
        { status: 402 }
      );
    }

    const pricingUrl = new URL("/pricing", request.url);
    pricingUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(pricingUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};