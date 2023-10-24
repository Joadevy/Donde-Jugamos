"use client";

import type {ReactNode} from "react";

import {SessionProvider} from "next-auth/react";

interface Iprops {
  children: ReactNode;
}

export function NextAuthProvider({children}: Iprops) {
  return <SessionProvider>{children}</SessionProvider>;
}
