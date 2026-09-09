import { ArrowRight } from "@phosphor-icons/react";

import { BookGrid } from "@/components/books/BookGrid";
import { Button } from "@/components/ui/button";

export function DashboardBookSection({ id, title, description, books, emptyMessage, onSelectBook, onBrowse }) {
  return (
    <section aria-labelledby={id}>
      <div className="mb-5 flex items-start justify-between gap-3 border-b border-border pb-3 sm:items-end sm:gap-4">
        <div>
          <h2 id={id} className="font-heading text-2xl font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <Button variant="link" onClick={onBrowse} className="hidden shrink-0 gap-1 px-0 text-sm sm:inline-flex">
          Ver todos <ArrowRight aria-hidden="true" />
        </Button>
      </div>
      {books.length > 0 ? (
        <BookGrid books={books} onSelectBook={onSelectBook} />
      ) : (
        <p className="rounded-lg border border-dashed border-border bg-card/50 px-5 py-8 text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
