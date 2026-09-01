export function BookDetailSkeleton() {
  return (
    <div role="status" aria-label="Cargando detalle del libro" className="grid gap-8 md:grid-cols-[minmax(14rem,20rem)_1fr] lg:gap-12">
      <span className="sr-only">Cargando detalle del libro.</span>
      <div className="aspect-[2/3] animate-pulse rounded-lg bg-secondary" />
      <div className="space-y-5 py-3" aria-hidden="true">
        <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
        <div className="h-12 w-4/5 animate-pulse rounded bg-secondary" />
        <div className="h-5 w-2/5 animate-pulse rounded bg-secondary" />
        <div className="h-24 w-full animate-pulse rounded bg-secondary" />
        <div className="h-32 w-full animate-pulse rounded bg-secondary" />
      </div>
    </div>
  );
}
