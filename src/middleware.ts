import {withAuth} from "next-auth/middleware";
import {getToken} from "next-auth/jwt";
import {NextResponse} from "next/server";

export default withAuth(async (req) => {
  const token = await getToken({req});

  if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (req.nextUrl.pathname.startsWith("/propietario") && token?.role !== "propietary") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {matcher: ["/admin:path*", "/propietario:path*"]};
