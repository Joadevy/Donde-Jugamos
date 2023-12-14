import Link from "next/link";

import {buttonVariants} from "@/components/ui/button";

function DashboardPage() {
  return (
    <div className="my-5 container mx-auto h-fit w-full flex flex-col lg:flex-row gap-4 relative">
      <div className="flex-auto flex flex-col lg:flex-row gap-4 justify-center lg:border">
        <section className="relative py-4 lg:w-3/4">
          <h1 className="font-bold text-xl lg:text-2xl text-primary lg:absolute lg:top-2">
            Dashboard de gestion
          </h1>

          <div className="lg:mt-8">
            <section>
              <Link className={buttonVariants({variant: "default"})} href="/admin/deportes">
                Gestionar deportes
              </Link>
            </section>
          </div>
        </section>
      </div>

      <aside className="border flex flex-col gap-2 py-2 px-4 order-1 lg:order-2">
        <Link className={buttonVariants({variant: "default"})} href="/admin/solicitudes">
          Solicitudes
        </Link>

        <Link className={buttonVariants({variant: "default"})} href="/admin/establecimientos">
          Establecimientos
        </Link>
      </aside>
    </div>
  );
}

export default DashboardPage;
