"use client";

import type {Session} from "next-auth";

import {signIn, signOut} from "next-auth/react";

import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface Iprops {
  session: Session | null;
}

function SignInOutButtons({session}: Iprops) {
  return (
    <li className="flex items-center gap-3">
      {session ? (
        <>
          <div className="flex gap-1 items-center justify-center">
            {session.user?.image ? (
              <Avatar>
                <AvatarImage src={session.user.image} />
                <AvatarFallback>W</AvatarFallback>
              </Avatar>
            ) : null}
            <p className="">{session.user?.name}</p>
          </div>
          {/*eslint-disable-next-line @typescript-eslint/no-misused-promises*/}
          <Button onClick={() => signOut()}>Log out</Button>
        </>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <Button onClick={() => signIn()}>Sign In</Button>
      )}
    </li>
  );
}

export default SignInOutButtons;
