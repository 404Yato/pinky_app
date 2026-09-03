import { useDeferredValue, useMemo, useState } from "react";
import { BookmarkSimple, CheckCircle, Clock, Heart } from "@phosphor-icons/react";

import { BookFilters } from "@/components/books/BookFilters";
import { BookGrid } from "@/components/books/BookGrid";
import { LibraryEmptyState, LibraryErrorState } from "@/components/books/LibraryState";
import { LoadingBookGrid } from "@/components/books/LoadingBookGrid";
import { StatusNotice } from "@/components/feedback/StatusNotice";
import { DEFAULT_BOOK_QUERY } from "@/constants/books";
import { useBooks } from "@/hooks/useBooks";

const collectionIcons = {
  favorite: Heart,
  read: CheckCircle,
  reading: BookmarkSimple,
  pending: Clock,
};

export function FocusedCollectionPage({ collection, onSelectBook, successMessage, onDismissSuccess }) {
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_BOOK_QUERY, ...collection.query }));
  const deferredSearch = useDeferredValue(filters.search);
  const query = useMemo(() => ({ ...filters, ...collection.query, search: deferredSearch }), [collection, filters, deferredSearch]);
  const { books, status, retry } = useBooks(query);
  const fixedStatus = collection.query.status !== undefined;
  const fixedFavorite = collection.query.favorite !== undefined;
  const hasActiveFilters = Boolean(filters.search || (!fixedStatus && filters.status) || (!fixedFavorite && filters.favorite !== null));

  const handleChange = (field, value) => {
    setFilters((current) => field === "sort" ? { ...current, ...value } : { ...current, [field]: value });
  };

  const resetFilters = () => setFilters({ ...DEFAULT_BOOK_QUERY, ...collection.query });
  const Icon = collectionIcons[collection.icon];

  return (
    <div>
      {successMessage && <StatusNotice onDismiss={onDismissSuccess} className="mb-6">{successMessage}</StatusNotice>}
      <header className="mb-8 max-w-3xl">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          <Icon aria-hidden="true" className="size-4" weight="duotone" /> {collection.eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground min-[380px]:text-4xl sm:text-5xl">{collection.title}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{collection.description}</p>
      </header>

      <BookFilters filters={filters} onChange={handleChange} onReset={resetFilters} hasActiveFilters={hasActiveFilters} showStatus={!fixedStatus} showFavorite={!fixedFavorite} />

      {status === "loading" && <LoadingBookGrid />}
      {status === "error" && <LibraryErrorState onRetry={retry} />}
      {status === "success" && books.length === 0 && (
        <LibraryEmptyState filtered={hasActiveFilters} onReset={resetFilters} title={collection.emptyTitle} description={collection.emptyDescription} Icon={Icon} />
      )}
      {status === "success" && books.length > 0 && (
        <section aria-labelledby="focused-results-title">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 id="focused-results-title" className="font-heading text-xl font-semibold text-foreground">En este estante</h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">{books.length} {books.length === 1 ? "libro" : "libros"}</p>
          </div>
          <BookGrid books={books} onSelectBook={onSelectBook} />
        </section>
      )}
    </div>
  );
}
