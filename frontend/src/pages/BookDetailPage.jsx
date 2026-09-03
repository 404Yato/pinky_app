import { useState } from "react";
import { ArrowLeft, CheckCircle, Heart, PencilSimple, Trash, WarningCircle } from "@phosphor-icons/react";

import { BookCover } from "@/components/books/BookCover";
import { BookDetailSkeleton } from "@/components/books/BookDetailSkeleton";
import { BookStatus } from "@/components/books/BookStatus";
import { DeleteBookDialog } from "@/components/books/DeleteBookDialog";
import { Button } from "@/components/ui/button";
import { READING_STATUS } from "@/constants/books";
import { useBook } from "@/hooks/useBook";
import { toggleFavorite, updateReadingStatus } from "@/services/mock/books";

function DetailState({ notFound, onBack, onRetry }) {
  return (
    <section className="rounded-lg border border-border bg-card px-6 py-16 text-center" role={notFound ? undefined : "alert"}>
      <WarningCircle aria-hidden="true" className="mx-auto size-10 text-primary" weight="duotone" />
      <h1 className="mt-4 font-heading text-3xl font-semibold">{notFound ? "No encontramos ese libro." : "No pudimos cargar el libro."}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{notFound ? "Es posible que ya no forme parte de tu biblioteca." : "Intenta nuevamente."}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button variant="outline" className="h-11 px-4 text-sm" onClick={onBack}>Volver a la biblioteca</Button>
        {!notFound && <Button className="h-11 px-4 text-sm" onClick={onRetry}>Reintentar</Button>}
      </div>
    </section>
  );
}

export function BookDetailPage({ bookId, onBack, onEdit, onDeleted, successMessage }) {
  const { book, setBook, status, retry } = useBook(bookId);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const [updating, setUpdating] = useState(false);

  if (status === "loading") return <BookDetailSkeleton />;
  if (status === "not-found") return <DetailState notFound onBack={onBack} />;
  if (status === "error") return <DetailState onBack={onBack} onRetry={retry} />;
  if (!book) return null;

  const handleFavorite = async () => {
    setUpdating(true);
    setActionError("");
    try {
      setBook(await toggleFavorite(book.id));
    } catch {
      setActionError("No pudimos actualizar el favorito.");
    } finally {
      setUpdating(false);
    }
  };

  const handleStatus = async (event) => {
    setUpdating(true);
    setActionError("");
    try {
      setBook(await updateReadingStatus(book.id, event.target.value));
    } catch {
      setActionError("No pudimos actualizar el estado de lectura.");
    } finally {
      setUpdating(false);
    }
  };

  const metadata = [
    ["ISBN", book.isbn],
    ["Editorial", book.publisher],
    ["Año de publicación", book.publicationYear],
    ["Páginas", book.pages],
    ["Género", book.genre],
  ];

  return (
    <div>
      {successMessage && (
        <div role="status" className="mb-6 flex items-start gap-3 rounded-md border border-[#b9c8aa] bg-[#e4eadc] px-4 py-3 text-sm font-medium text-[#46543b]">
          <CheckCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" weight="fill" />
          {successMessage}
        </div>
      )}
      <button type="button" onClick={onBack} className="mb-7 inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-semibold text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft aria-hidden="true" className="size-4" /> Volver a la biblioteca
      </button>

      <article className="grid min-w-0 gap-7 md:grid-cols-[minmax(12rem,17rem)_minmax(0,1fr)] md:gap-8 xl:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)] xl:gap-12">
        <div className="mx-auto w-full max-w-64 overflow-hidden rounded-lg border border-border bg-secondary shadow-[0_10px_30px_rgb(59_42_32_/_0.12)] min-[420px]:max-w-72 md:mx-0 md:max-w-none">
          <BookCover book={book} />
        </div>

        <div className="min-w-0 py-1">
          <div className="flex flex-wrap items-center gap-3">
            <BookStatus status={book.readingStatus} />
            {book.favorite && <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent"><Heart aria-hidden="true" className="size-4" weight="fill" /> Favorito</span>}
          </div>
          <h1 className="mt-5 break-words font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground min-[380px]:text-4xl xl:text-5xl">{book.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground sm:text-xl">{book.author || "Autor desconocido"}</p>

          <div className="mt-7 flex flex-col gap-3 border-y border-border py-5 min-[420px]:flex-row min-[420px]:flex-wrap">
            <Button type="button" onClick={onEdit} variant="outline" className="h-11 w-full gap-2 px-4 text-sm min-[420px]:w-auto"><PencilSimple aria-hidden="true" /> Editar</Button>
            <Button type="button" onClick={handleFavorite} disabled={updating} variant={book.favorite ? "secondary" : "outline"} className="h-11 w-full gap-2 px-4 text-sm min-[420px]:w-auto"><Heart aria-hidden="true" weight={book.favorite ? "fill" : "regular"} /> {book.favorite ? "Quitar favorito" : "Marcar favorito"}</Button>
            <Button type="button" onClick={() => setDeleteOpen(true)} variant="destructive" className="h-11 w-full gap-2 px-4 text-sm min-[420px]:w-auto"><Trash aria-hidden="true" /> Eliminar</Button>
          </div>

          <div className="mt-7 w-full sm:max-w-xs">
            <label htmlFor="reading-status" className="text-sm font-semibold text-foreground">Estado de lectura</label>
            <select id="reading-status" value={book.readingStatus} onChange={handleStatus} disabled={updating} className="mt-2 h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20">
              <option value={READING_STATUS.PENDING}>Pendiente</option>
              <option value={READING_STATUS.READING}>Leyendo</option>
              <option value={READING_STATUS.READ}>Leído</option>
            </select>
          </div>
          {actionError && <p role="alert" className="mt-3 text-sm text-destructive">{actionError}</p>}

          <section aria-labelledby="description-title" className="mt-10">
            <h2 id="description-title" className="font-heading text-2xl font-semibold">Sobre este libro</h2>
            <p className="mt-3 max-w-3xl whitespace-pre-line text-base leading-8 text-muted-foreground">{book.description || "Todavía no has agregado una descripción para este libro."}</p>
          </section>

          <section aria-labelledby="details-title" className="mt-10">
            <h2 id="details-title" className="font-heading text-2xl font-semibold">Detalles de la edición</h2>
            <dl className="mt-4 grid gap-x-8 gap-y-5 rounded-lg border border-border bg-card p-5 sm:grid-cols-2 sm:p-6">
              {metadata.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</dt>
                  <dd className="mt-1 break-words text-sm font-medium text-foreground">{value || "No disponible"}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </article>

      <DeleteBookDialog book={book} open={deleteOpen} onClose={() => setDeleteOpen(false)} onDeleted={onDeleted} />
    </div>
  );
}
