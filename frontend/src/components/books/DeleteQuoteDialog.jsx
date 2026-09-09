import { useEffect, useRef, useState } from "react";
import { Trash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function DeleteQuoteDialog({ open, onClose, onConfirm }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setError("");
      dialog.showModal();
      window.requestAnimationFrame(() => cancelRef.current?.focus());
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = (event) => {
    if (deleting) {
      event?.preventDefault();
      return;
    }
    onClose();
  };

  const confirm = async () => {
    setDeleting(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch {
      setError("No pudimos eliminar la cita. Intenta nuevamente.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <dialog ref={dialogRef} aria-labelledby="delete-quote-title" aria-describedby="delete-quote-description" aria-busy={deleting} onCancel={close} className="modal-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100%-2rem))] max-w-none overflow-y-auto rounded-lg border border-border bg-card p-0 text-foreground shadow-2xl">
      <div className="p-5 sm:p-7">
        <span className="grid size-11 place-items-center rounded-full bg-destructive/10 text-destructive"><Trash aria-hidden="true" className="size-5" weight="duotone" /></span>
        <h2 id="delete-quote-title" className="mt-4 font-heading text-2xl font-semibold">¿Eliminar esta cita?</h2>
        <p id="delete-quote-description" className="mt-2 text-sm leading-6 text-muted-foreground">Este fragmento dejará de formar parte de tus recuerdos del libro.</p>
        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} type="button" variant="outline" onClick={close} disabled={deleting} className="h-11 px-5 text-sm">Conservar cita</Button>
          <Button type="button" variant="destructive" onClick={confirm} disabled={deleting} className="h-11 px-5 text-sm">{deleting ? "Eliminando…" : "Eliminar cita"}</Button>
        </div>
      </div>
    </dialog>
  );
}
