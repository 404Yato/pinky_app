import { FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";

import { BOOK_SORT_FIELD, READING_STATUS, SORT_DIRECTION } from "@/constants/books";
import { cn } from "@/lib/utils";

const controlClassName = "h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20";

export function BookFilters({ filters, onChange, onReset, hasActiveFilters, showStatus = true, showFavorite = true }) {
  return (
    <section aria-labelledby="library-filters-title" className="mb-8 rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="library-filters-title" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FunnelSimple aria-hidden="true" className="size-4 text-primary" />
          Explorar la colección
        </h2>
        {hasActiveFilters && (
          <button type="button" onClick={onReset} className="flex min-h-11 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <X aria-hidden="true" className="size-3.5" />
            Limpiar
          </button>
        )}
      </div>

      <div className={cn(
        "grid gap-3 md:grid-cols-2",
        showStatus && showFavorite
          ? "xl:grid-cols-[minmax(16rem,1fr)_12rem_12rem_13rem]"
          : "xl:grid-cols-[minmax(16rem,1fr)_12rem_13rem]",
      )}>
        <label className="relative block">
          <span className="sr-only">Buscar libros</span>
          <MagnifyingGlass aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="Buscar por título o autor…"
            className={`${controlClassName} pl-10`}
          />
        </label>

        {showStatus && <label>
          <span className="sr-only">Estado de lectura</span>
          <select value={filters.status ?? ""} onChange={(event) => onChange("status", event.target.value || null)} className={controlClassName}>
            <option value="">Todos los estados</option>
            <option value={READING_STATUS.READING}>Leyendo</option>
            <option value={READING_STATUS.PENDING}>Pendientes</option>
            <option value={READING_STATUS.READ}>Leídos</option>
          </select>
        </label>}

        {showFavorite && <label>
          <span className="sr-only">Favoritos</span>
          <select value={filters.favorite ?? ""} onChange={(event) => onChange("favorite", event.target.value === "" ? null : event.target.value === "true")} className={controlClassName}>
            <option value="">Todos los libros</option>
            <option value="true">Solo favoritos</option>
            <option value="false">No favoritos</option>
          </select>
        </label>}

        <label>
          <span className="sr-only">Ordenar libros</span>
          <select
            value={`${filters.sortBy}:${filters.sortDirection}`}
            onChange={(event) => {
              const [sortBy, sortDirection] = event.target.value.split(":");
              onChange("sort", { sortBy, sortDirection });
            }}
            className={controlClassName}
          >
            <option value={`${BOOK_SORT_FIELD.CREATED_AT}:${SORT_DIRECTION.DESCENDING}`}>Añadidos recientemente</option>
            <option value={`${BOOK_SORT_FIELD.TITLE}:${SORT_DIRECTION.ASCENDING}`}>Título: A–Z</option>
            <option value={`${BOOK_SORT_FIELD.AUTHOR}:${SORT_DIRECTION.ASCENDING}`}>Autor: A–Z</option>
            <option value={`${BOOK_SORT_FIELD.PUBLICATION_YEAR}:${SORT_DIRECTION.DESCENDING}`}>Publicación: reciente</option>
            <option value={`${BOOK_SORT_FIELD.PUBLICATION_YEAR}:${SORT_DIRECTION.ASCENDING}`}>Publicación: antigua</option>
          </select>
        </label>
      </div>
    </section>
  );
}
