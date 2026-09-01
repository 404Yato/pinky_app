import { useDeferredValue, useMemo, useState } from "react";
import { Plus } from "@phosphor-icons/react";

import { BookFilters } from "@/components/books/BookFilters";
import { BookGrid } from "@/components/books/BookGrid";
import { LibraryEmptyState, LibraryErrorState } from "@/components/books/LibraryState";
import { LoadingBookGrid } from "@/components/books/LoadingBookGrid";
import { Button } from "@/components/ui/button";
import { DEFAULT_BOOK_QUERY } from "@/constants/books";
import { useBooks } from "@/hooks/useBooks";

export function LibraryPage({ onSelectBook, onCreateBook }) {
  const [filters, setFilters] = useState({ ...DEFAULT_BOOK_QUERY });
  const deferredSearch = useDeferredValue(filters.search);
  const query = useMemo(() => ({ ...filters, search: deferredSearch }), [filters, deferredSearch]);
  const { books, status, retry } = useBooks(query);

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.favorite !== null || filters.genre);

  const handleChange = (field, value) => {
    setFilters((current) => field === "sort" ? { ...current, ...value } : { ...current, [field]: value });
  };

  const resetFilters = () => setFilters({ ...DEFAULT_BOOK_QUERY });

  return (
    <div>
      <header className="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Tu colección</p>
          <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Biblioteca</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">Historias leídas, pendientes y en curso, reunidas en un solo lugar.</p>
        </div>
        <Button onClick={onCreateBook} className="h-11 shrink-0 gap-2 px-4 text-sm"><Plus aria-hidden="true" /> Agregar libro</Button>
      </header>

      <BookFilters filters={filters} onChange={handleChange} onReset={resetFilters} hasActiveFilters={hasActiveFilters} />

      {status === "loading" && <LoadingBookGrid />}
      {status === "error" && <LibraryErrorState onRetry={retry} />}
      {status === "success" && books.length === 0 && <LibraryEmptyState filtered={hasActiveFilters} onReset={resetFilters} />}
      {status === "success" && books.length > 0 && (
        <section aria-labelledby="library-results-title">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 id="library-results-title" className="font-heading text-xl font-semibold text-foreground">Todos los libros</h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">{books.length} {books.length === 1 ? "libro" : "libros"}</p>
          </div>
          <BookGrid books={books} onSelectBook={onSelectBook} />
        </section>
      )}
    </div>
  );
}
