import Link from "next/link";

import SignInOutButtons from "../Buttons/SignInOutButtons";

function Navbar() {
  return (
    <nav className="border p-2 shadow-sm">
      <ul className="flex items-center justify-between">
        <Link href="/">
          <p>DondeJugamos</p>
        </Link>

        <SignInOutButtons />
      </ul>
    </nav>
  );
}

export default Navbar;
