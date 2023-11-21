import SignOutButton from "../Buttons/SignOutButton";
import SignInButton from "../Buttons/SignInButton";

import MenuNavigationLinks from "./MenuNavigationLinks";

interface Session {
  user:
    | {
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        image: string | null;
        role: string | null;
        registerDate: Date;
        CBU: string | null;
        Alias: string | null;
      }
    | undefined;
}

const CUSTOMER_LINKS = [{href: "/reservas", text: "Mis Reservas"}];
const PROPIETARY_LINKS = [
  {href: "/propietario", text: "Mi establecimiento"},
  {href: "/turnos", text: "Mis solicitudes"},
];
const ADMIN_LINKS = [{href: "/solicitudes", text: "Solicitudes de alta"}];

function LoginAndNavigationOptions({user}: Session) {
  const userRole = user?.role ?? "customer";

  return (
    <li className="flex items-center gap-4">
      {user ? (
        <div className="flex gap-1 items-center justify-center">
          {userRole === "customer" ? (
            <MenuNavigationLinks
              image={user.image ?? ""}
              links={CUSTOMER_LINKS}
              username={user.name ?? ""}
            />
          ) : userRole === "propietary" ? (
            <MenuNavigationLinks
              image={user.image ?? ""}
              links={PROPIETARY_LINKS}
              username={user.name ?? ""}
            />
          ) : userRole === "admin" ? (
            <MenuNavigationLinks
              image={user.image ?? ""}
              links={ADMIN_LINKS}
              username={user.name ?? ""}
            />
          ) : null}
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </li>
  );
}

export default LoginAndNavigationOptions;
