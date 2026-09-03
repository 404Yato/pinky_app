import { Books, WarningCircle } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function DashboardLoadingState() {
  return (
    <div role="status" aria-label="Cargando resumen de la biblioteca" className="space-y-10">
      <h1 className="sr-only">Cargando tu biblioteca</h1>
      <span className="sr-only">Preparando tu biblioteca.</span>
      <div className="max-w-2xl space-y-4">
        <div className="h-4 w-40 animate-pulse rounded bg-secondary" />
        <div className="h-12 w-4/5 animate-pulse rounded bg-secondary" />
        <div className="h-5 w-full animate-pulse rounded bg-secondary" />
      </div>
      <div className="grid grid-cols-1 gap-5 border-y border-border py-7 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-12 animate-pulse rounded bg-secondary" />)}
      </div>
      <div className="grid grid-cols-1 gap-4 min-[22rem]:grid-cols-2 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="aspect-[2/3] animate-pulse rounded-lg bg-secondary" />)}
      </div>
    </div>
  );
}

export function DashboardErrorState({ onRetry }) {
  return (
    <section className="rounded-lg border border-border bg-card px-6 py-16 text-center" role="alert">
      <WarningCircle aria-hidden="true" className="mx-auto size-10 text-destructive" weight="duotone" />
      <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">No pudimos preparar tu biblioteca.</h1>
      <p className="mt-2 text-sm text-muted-foreground">Intenta nuevamente para volver a tus historias.</p>
      <Button onClick={onRetry} className="mt-6 h-10 px-4 text-sm">Reintentar</Button>
    </section>
  );
}

export function DashboardEmptyState({ onCreateBook }) {
  return (
    <section className="rounded-lg border border-dashed border-border bg-card/60 px-6 py-16 text-center" aria-labelledby="empty-dashboard-title">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary">
        <Books aria-hidden="true" className="size-7" weight="duotone" />
      </span>
      <h2 id="empty-dashboard-title" className="mt-5 font-heading text-2xl font-semibold text-foreground">Tu biblioteca está esperando su primera historia.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Agrega un libro para comenzar a construir tu rincón de lectura.</p>
      <Button onClick={onCreateBook} className="mt-6 h-10 px-4 text-sm">Agregar primer libro</Button>
    </section>
  );
}
