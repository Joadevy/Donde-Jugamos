import {withAuth} from "next-auth/middleware";

export default withAuth({
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/require-await
    authorized: async ({req, token}) => {
      if (req.nextUrl.pathname.startsWith("/admin")) return token?.role === "admin";
      if (req.nextUrl.pathname.startsWith("/propietario")) return token?.role === "propietary";

      return !!token; // Si no esta logeado, lo manda a iniciar sesion
    },
  },
});

export const config = {matcher: ["/admin:path*", "/propietario:path*"]};
