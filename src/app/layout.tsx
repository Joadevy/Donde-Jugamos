import type {Metadata} from "next";

import {Inter} from "next/font/google";

import "./globals.css";
import {NextAuthProvider} from "@/components/Providers/NextAuthProvider";
import Navbar from "@/components/Navbar/Navbar";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Seminario app",
  description: "Alquiler de canchas deportivas",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Navbar />
          <main className="">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
