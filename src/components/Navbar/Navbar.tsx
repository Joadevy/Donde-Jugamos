import Link from "next/link";
import {getServerSession} from "next-auth";

import {authOptions} from "@/app/api/auth/[...nextauth]/route";

import SignInOutButtons from "../Buttons/SignInOutButtons";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <nav className="border p-2 shadow-sm">
      <ul className="flex items-center justify-between">
        <Link href="/">
          <p>DondeJugamos</p>
        </Link>

        <SignInOutButtons session={session} />
      </ul>
    </nav>
  );
};

export default Navbar;
