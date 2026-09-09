import { Books, Coffee, Plus } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function DashboardHeader({ onBrowse, onCreateBook }) {
  return (
    <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <div className="max-w-3xl">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          <Coffee aria-hidden="true" className="size-4" weight="duotone" />
          Tu rincón de lectura
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground min-[380px]:text-4xl sm:text-5xl">
          Bienvenido a tu biblioteca.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Un vistazo tranquilo a las historias que has reunido y a las que aún te esperan.
        </p>
      </div>
      <div className="flex w-full flex-wrap gap-3 sm:w-auto sm:justify-end">
        <Button variant="outline" onClick={onBrowse} className="h-11 flex-1 gap-2 px-4 text-sm sm:flex-none">
          <Books aria-hidden="true" /> Ver biblioteca
        </Button>
        <Button onClick={onCreateBook} className="h-11 flex-1 gap-2 px-4 text-sm sm:flex-none">
          <Plus aria-hidden="true" /> Agregar libro
        </Button>
      </div>
    </header>
  );
}
