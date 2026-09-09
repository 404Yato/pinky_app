import { Heart, MapPin, Quotes, User } from "@phosphor-icons/react";

import { BookCover } from "@/components/books/BookCover";
import { BookStatus } from "@/components/books/BookStatus";
import { READING_STATUS } from "@/constants/books";

const previewBooks = [
  { id: 1, title: "Cien años de soledad", author: "Gabriel García Márquez", coverUrl: null, readingStatus: READING_STATUS.READ, favorite: true },
  { id: 5, title: "Piranesi", author: "Susanna Clarke", coverUrl: null, readingStatus: READING_STATUS.READING, favorite: false },
  { id: 3, title: "La mano izquierda de la oscuridad", author: "Ursula K. Le Guin", coverUrl: null, readingStatus: READING_STATUS.PENDING, favorite: false },
];

export function LandingPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl" aria-label="Vista previa de Pinky">
      <div aria-hidden="true" className="absolute -inset-4 -z-10 rotate-1 rounded-[2rem] bg-primary/10 sm:-inset-6" />
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_70px_rgb(59_42_32_/_0.16)]">
        <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 text-sidebar-foreground sm:px-6">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#dfa574]" />
            <p className="font-heading text-sm font-semibold sm:text-base">Mi biblioteca</p>
          </div>
          <p className="text-xs text-sidebar-foreground/65">20 historias</p>
        </div>

        <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,1.25fr)_minmax(12rem,0.75fr)] sm:p-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {previewBooks.map((book) => (
              <article key={book.id} className="min-w-0 overflow-hidden rounded-md border border-border bg-background shadow-[0_4px_14px_rgb(59_42_32_/_0.08)]">
                <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
                  <BookCover book={book} />
                  {book.favorite && <span aria-label="Favorito" className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-card/90 text-accent shadow-sm"><Heart aria-hidden="true" className="size-3.5" weight="fill" /></span>}
                </div>
                <div className="p-2.5">
                  <p className="truncate font-heading text-xs font-semibold sm:text-sm">{book.title}</p>
                  <div className="mt-2 origin-left scale-[0.82] sm:scale-90"><BookStatus status={book.readingStatus} /></div>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-3">
            <div className="rounded-md border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Tu ejemplar</p>
              <p className="mt-3 flex items-start gap-2 text-sm font-medium"><User aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" /> Prestado a Nicolás</p>
              <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> Librero del living · Repisa 2</p>
            </div>
            <blockquote className="rounded-md border border-border bg-[#f7ecdf] p-4 text-sm leading-6 text-foreground">
              <Quotes aria-hidden="true" className="mb-2 size-5 text-primary" weight="fill" />
              <p className="font-heading">“Cada lector encuentra una casa distinta dentro del mismo libro.”</p>
              <footer className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Página 42</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
