import {withAuth} from "next-auth/middleware";
import {getToken} from "next-auth/jwt";
import {NextResponse} from "next/server";

export default withAuth(async (req) => {
  const token = await getToken({req});

  if (!token) return NextResponse.redirect(new URL("/", req.url));
  else if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (req.nextUrl.pathname.startsWith("/establecimientos") && token.role !== "propietary") {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (req.nextUrl.pathname.startsWith("/api/propietary") && token.role !== "propietary") {
    NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/establecimientos/:path*", "/api/propietary/:path*", "/sumate"],
};
