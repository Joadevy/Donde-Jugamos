"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */
import {signIn} from "next-auth/react";

import {Button} from "@/components/ui/button";

function SignInButton() {
  return <Button onClick={() => signIn()}>Iniciar sesion</Button>;
}

export default SignInButton;
