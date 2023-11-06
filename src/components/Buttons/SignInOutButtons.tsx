"use client";

import {signIn, signOut, useSession} from "next-auth/react";

import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

function SignInOutButtons() {
  const {data: session} = useSession();

  return (
    <li className="flex items-center gap-4">
      {session ? (
        <>
          <div className="flex gap-1 items-center justify-center">
            {session.user.image ? (
              <Avatar>
                <AvatarImage src={session.user.image} />
                <AvatarFallback>W</AvatarFallback>
              </Avatar>
            ) : null}
            <p className="">{session.user.name}</p>
          </div>
          {/*eslint-disable-next-line @typescript-eslint/no-misused-promises*/}
          <Button onClick={() => signOut()}>Cerrar sesion</Button>
        </>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <Button onClick={() => signIn()}>Iniciar sesion</Button>
      )}
    </li>
  );
}

export default SignInOutButtons;
