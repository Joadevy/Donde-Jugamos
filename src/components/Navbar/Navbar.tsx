import Link from "next/link";
import {getServerSession} from "next-auth";

import {authOptions} from "@/app/api/auth/[...nextauth]/route";

import {buttonVariants} from "../ui/button";

import LoginAndNavigationOptions from "./LoginAndNavigationOptions";

async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="h-36 lg:h-16 border p-2 shadow-sm">
      <ul className="flex items-center justify-between flex-wrap gap-3 lg:gap-0">
        <Link className="hover:opacity-75" href="/">
          <svg height="2em" viewBox="0 0 24 24" width="2em" xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="M15.172 0h-4.176v5.932a7.21 7.21 0 0 0-1.816-.2C4.816 5.731 2 8.305 2 12.273c0 4.118 2.655 6.263 7.755 6.268c1.703 0 3.278-.15 5.417-.53V0ZM9.734 8.977c.516 0 .92.05 1.408.2v6.248c-.596.075-.972.1-1.434.1c-2.14 0-3.305-1.142-3.305-3.21c0-2.125 1.22-3.338 3.331-3.338Z"
              fill="#16a34a"
              fillRule="evenodd"
            />
            <path
              d="M22 15.233V6.215h-4.17v7.675c0 3.387-.188 4.674-.785 5.786c-.57 1.087-1.462 1.8-3.305 2.606L17.615 24c1.843-.862 2.735-1.643 3.412-2.88c.726-1.288.973-2.782.973-5.887ZM21.584 0H17.41v3.993h4.175V0Z"
              fill="#16a34a"
            />
          </svg>
        </Link>
        <div className="mx-4 flex items-center gap-2 flex-wrap">
          <Link className={buttonVariants({variant: "default"})} href="/sumate">
            Suma tu Cancha
          </Link>
          <LoginAndNavigationOptions user={session?.user} />
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
