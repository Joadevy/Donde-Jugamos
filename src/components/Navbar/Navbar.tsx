"use client";

import Link from "next/link";

import SignInOutButtons from "../Buttons/SignInOutButtons";
import {Button} from "../ui/button";

function Navbar() {
  return (
    <nav className="h-36 lg:h-16 border p-2 shadow-sm">
      <ul className="flex items-center justify-between flex-wrap gap-3 lg:gap-0">
        <Link href="/">
          <p>DondeJugamos</p>
        </Link>
        <div className="mx-4 flex items-center gap-2 flex-wrap">
          <Link href="/customer">
            <Button variant="secondary">Customer</Button>
          </Link>
          <Link href="/propietario">
            <Button variant="secondary">Propietario</Button>
          </Link>
          <Link href="/admin">
            <Button variant="secondary">Admin</Button>
          </Link>
          <SignInOutButtons />
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
