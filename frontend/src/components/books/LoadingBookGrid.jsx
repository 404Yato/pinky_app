function LoadingBookCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card" aria-hidden="true">
      <div className="aspect-[2/3] animate-pulse bg-secondary" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-4/5 animate-pulse rounded bg-secondary" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-secondary" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-secondary" />
      </div>
    </div>
  );
}

export function LoadingBookGrid() {
  return (
    <div role="status" aria-label="Cargando libros">
      <span className="sr-only">Cargando tu biblioteca.</span>
      <div className="@container">
        <div className="grid grid-cols-1 gap-4 @min-[22rem]:grid-cols-2 @min-[36rem]:grid-cols-3 @min-[52rem]:grid-cols-4 sm:gap-5 xl:gap-6">
          {Array.from({ length: 8 }, (_, index) => <LoadingBookCard key={index} />)}
        </div>
      </div>
    </div>
  );
}
