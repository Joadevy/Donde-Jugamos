"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */

import {signIn} from "next-auth/react";

import {Badge} from "../ui/badge";

interface Iprops {
  children: React.ReactNode;
}

function SignInClip({children}: Iprops) {
  return (
    <Badge
      className="hover:cursor-pointer flex items-center justify-center text-center"
      role="button"
      variant="default"
      onClick={() => signIn()}
    >
      {children}
    </Badge>
  );
}

export default SignInClip;
