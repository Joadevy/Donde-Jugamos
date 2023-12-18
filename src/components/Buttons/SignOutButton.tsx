"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */
import {signOut} from "next-auth/react";

import {Button} from "@/components/ui/button";

function SignOutButton() {
  return (
    <Button onClick={() => signOut({callbackUrl: process.env.NEXT_PUBLIC_URL})}>
      Cerrar sesion
    </Button>
  );
}

export default SignOutButton;
