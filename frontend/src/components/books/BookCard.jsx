import { Heart } from "@phosphor-icons/react";

import { BookCover } from "@/components/books/BookCover";
import { BookStatus } from "@/components/books/BookStatus";

export function BookCard({ book, onSelect }) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-[0_4px_16px_rgb(59_42_32_/_0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(59_42_32_/_0.1)] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
      <button type="button" onClick={() => onSelect(book.id)} aria-label={`Ver detalles de ${book.title}`} className="block w-full text-left outline-none">
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
        <BookCover book={book} />
        {book.favorite && (
          <span
            className="absolute right-2.5 top-2.5 grid size-9 place-items-center rounded-full border border-white/50 bg-card/90 text-accent shadow-sm backdrop-blur-sm"
            aria-label="Libro favorito"
            title="Favorito"
          >
            <Heart aria-hidden="true" className="size-4" weight="fill" />
          </span>
        )}
      </div>

      <div className="p-3.5 sm:p-4">
        <h2 className="font-heading text-base font-semibold leading-snug text-card-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-lg">
          {book.title}
        </h2>
        <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">{book.author || "Autor desconocido"}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <BookStatus status={book.readingStatus} />
          {book.publicationYear && <span className="text-xs text-muted-foreground">{book.publicationYear}</span>}
        </div>
      </div>
      </button>
    </article>
  );
}
