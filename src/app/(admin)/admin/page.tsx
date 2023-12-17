import Link from "next/link";

import {buttonVariants} from "@/components/ui/button";
import PageWrapper from "@/components/Layout/PageWrapper";

function DashboardPage() {
  return (
    <PageWrapper
      aside={
        <>
          <Link className={buttonVariants({variant: "default"})} href="/admin/solicitudes">
            Solicitudes
          </Link>

          <Link className={buttonVariants({variant: "default"})} href="/admin/establecimientos">
            Establecimientos
          </Link>
        </>
      }
      main={
        <section className="relative py-4 lg:w-3/4">
          <h1 className="font-bold text-xl lg:text-2xl text-primary lg:absolute lg:top-2">
            Dashboard de gestion
          </h1>

          <div className="lg:mt-8">
            <section className="flex gap-2">
              <Link className={buttonVariants({variant: "default"})} href="/admin/deportes">
                Gestionar deportes
              </Link>

              <Link className={buttonVariants({variant: "default"})} href="/admin/ciudades">
                Gestionar ciudades
              </Link>
            </section>
          </div>
        </section>
      }
    />
  );
}

export default DashboardPage;
