import { Books, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function LibraryEmptyState({ filtered, onReset }) {
  const Icon = filtered ? MagnifyingGlass : Books;

  return (
    <section className="rounded-lg border border-dashed border-border bg-card/60 px-6 py-16 text-center" aria-labelledby="empty-library-title">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary">
        <Icon aria-hidden="true" className="size-7" weight="duotone" />
      </span>
      <h2 id="empty-library-title" className="mt-5 font-heading text-2xl font-semibold text-foreground">
        {filtered ? "No encontramos libros con esos criterios." : "Tu biblioteca está esperando su primera historia."}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {filtered ? "Prueba con otro título, autor o una combinación diferente de filtros." : "Agrega un libro para comenzar."}
      </p>
      {filtered && <Button className="mt-6 h-10 px-4 text-sm" onClick={onReset}>Limpiar filtros</Button>}
    </section>
  );
}

export function LibraryErrorState({ onRetry }) {
  return (
    <section className="rounded-lg border border-border bg-card px-6 py-16 text-center" role="alert">
      <WarningCircle aria-hidden="true" className="mx-auto size-10 text-destructive" weight="duotone" />
      <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground">No pudimos cargar tu biblioteca.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Intenta nuevamente.</p>
      <Button className="mt-6 h-10 px-4 text-sm" onClick={onRetry}>Reintentar</Button>
    </section>
  );
}
