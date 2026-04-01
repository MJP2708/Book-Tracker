import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled, isPremiumEnforced } from "@/lib/monetization/feature-flags";

const premiumRoutePrefixes = ["/knowledge", "/api/ai", "/api/knowledge/search"];

function isPremiumPath(pathname: string) {
  return premiumRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isFeatureEnabled("premium_route_guards") || !isPremiumPath(pathname)) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("users")
    .select("premium")
    .eq("id", user.id)
    .maybeSingle();

  if (isPremiumEnforced() && !profile?.premium) {
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

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};