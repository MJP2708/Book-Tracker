export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/feed/:path*", "/profile/:path*"],
};
