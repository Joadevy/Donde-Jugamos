/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import SignInButton from "@/components/Buttons/SignInButton";

function Page() {
  return (
    <main className="min-h-screen -mt-16 grid place-items-center">
      <div className="relative w-10/12 lg:w-1/2 flex flex-col gap-4">
        <div className="border p-3 shadow-lg border-gray-400 rounded-md">
          <header className="mb-2 text-center">
            <h1 className="text-2xl font-bold text-primary">Donde jugamos?</h1>
            <p>Inicia sesion para reservar turnos en tus canchas favoritas!</p>
          </header>

          <div className="flex flex-col items-center gap-2">
            <SignInButton redirect text="Inicia sesion con Google" />
            <p className="text-gray-400 italic text-center">
              Solo tu direccion de correo, nombre y avatar de google seran provistas a nosotros.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
