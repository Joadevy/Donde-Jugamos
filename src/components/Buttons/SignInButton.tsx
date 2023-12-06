"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";

interface Iprops {
  redirect?: boolean;
  text?: string;
}

function SignInButton({text, redirect}: Iprops) {
  const {data: session} = useSession();
  const router = useRouter();

  if (session) {
    router.push("/");

    return;
  }

  return (
    <Button
      onClick={redirect ? async () => await signIn("google", {redirect: true}) : () => signIn()}
    >
      {text ?? "Iniciar sesion"}
    </Button>
  );
}

export default SignInButton;
