import { useEffect, useRef, useState } from "react";
import { Trash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { deleteBook } from "@/services/mock/books";

export function DeleteBookDialog({ book, open, onClose, onDeleted }) {
  const dialogRef = useRef(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setError("");
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await deleteBook(book.id);
      onClose();
      onDeleted();
    } catch {
      setError("No pudimos eliminar el libro. Intenta nuevamente.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <dialog ref={dialogRef} aria-labelledby="delete-book-title" aria-describedby="delete-book-description" onCancel={onClose} onClose={onClose} className="modal-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100%-2rem))] max-w-none overflow-y-auto rounded-lg border border-border bg-card p-0 text-foreground shadow-2xl">
      <div className="p-5 sm:p-7">
        <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive"><Trash aria-hidden="true" className="size-6" weight="duotone" /></span>
        <h2 id="delete-book-title" className="mt-5 font-heading text-2xl font-semibold">¿Eliminar este libro?</h2>
        <p id="delete-book-description" className="mt-2 text-sm leading-6 text-muted-foreground">“{book.title}” dejará de aparecer en tu biblioteca durante esta sesión.</p>
        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={deleting} className="h-11 px-5 text-sm">Conservar libro</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting} className="h-11 px-5 text-sm">{deleting ? "Eliminando…" : "Eliminar libro"}</Button>
        </div>
      </div>
    </dialog>
  );
}
