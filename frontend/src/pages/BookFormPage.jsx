import { ArrowLeft, BookOpen, WarningCircle } from "@phosphor-icons/react";

import { BookDetailSkeleton } from "@/components/books/BookDetailSkeleton";
import { BookForm } from "@/components/books/BookForm";
import { Button } from "@/components/ui/button";
import { useBook } from "@/hooks/useBook";
import { createBook, updateBook } from "@/services/mock/books";

export function BookFormPage({ bookId = null, onCancel, onSaved }) {
  const editing = bookId !== null;
  const { book, status, retry } = useBook(bookId, { enabled: editing });

  if (editing && status === "loading") return <BookDetailSkeleton label="Cargando edición del libro" />;
  if (editing && (status === "not-found" || status === "error")) {
    return (
      <section className="rounded-lg border border-border bg-card px-6 py-16 text-center" role={status === "error" ? "alert" : undefined}>
        <WarningCircle aria-hidden="true" className="mx-auto size-10 text-primary" weight="duotone" />
        <h1 className="mt-4 font-heading text-3xl font-semibold">{status === "not-found" ? "No encontramos ese libro." : "No pudimos preparar la edición."}</h1>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" className="h-11 px-4 text-sm" onClick={onCancel}>Volver</Button>
          {status === "error" && <Button className="h-11 px-4 text-sm" onClick={retry}>Reintentar</Button>}
        </div>
      </section>
    );
  }

  const handleSubmit = async (values) => {
    const savedBook = editing ? await updateBook(bookId, values) : await createBook(values);
    onSaved(savedBook, editing ? "updated" : "created");
  };

  return (
    <div className="mx-auto min-w-0 max-w-4xl pb-20 sm:pb-16">
      <button type="button" onClick={onCancel} className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-semibold text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft aria-hidden="true" className="size-4" /> Volver
      </button>
      <header className="mb-8">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary"><BookOpen aria-hidden="true" className="size-4" /> {editing ? "Actualizar historia" : "Nueva historia"}</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight min-[380px]:text-4xl sm:text-5xl">{editing ? "Editar libro" : "Agregar un libro"}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{editing ? "Ajusta la información que quieras conservar en tu biblioteca." : "Comienza con lo esencial. Siempre podrás completar o corregir la información más adelante."}</p>
      </header>
      <BookForm key={book?.id ?? "new"} book={book} onSubmit={handleSubmit} onCancel={onCancel} />
    </div>
  );
}
