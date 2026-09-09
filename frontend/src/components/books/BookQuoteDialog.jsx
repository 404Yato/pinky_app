import { useEffect, useRef, useState } from "react";
import { Quotes } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

const initialValues = { text: "", page: "" };
const inputClassName = "mt-2 w-full rounded-md border border-input bg-background px-3 text-sm font-normal text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

export function BookQuoteDialog({ open, quote = null, onClose, onSubmit }) {
  const dialogRef = useRef(null);
  const textRef = useRef(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setValues(quote ? { text: quote.text, page: quote.page ?? "" } : initialValues);
      setErrors({});
      dialog.showModal();
      window.requestAnimationFrame(() => textRef.current?.focus());
    }
    if (!open && dialog.open) dialog.close();
  }, [open, quote]);

  const close = (event) => {
    if (submitting) {
      event?.preventDefault();
      return;
    }
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const nextErrors = {};
    if (!values.text.trim()) nextErrors.text = "Escribe el fragmento que quieres guardar.";
    if (values.page !== "" && (!Number.isInteger(Number(values.page)) || Number(values.page) < 0)) nextErrors.page = "Ingresa un número de página válido.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      window.requestAnimationFrame(() => dialogRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(values);
      setValues(initialValues);
      onClose();
    } catch (error) {
      const details = error?.details;
      setErrors({
        text: details?.text ? "Revisa el texto de la cita." : undefined,
        page: details?.page ? "Ingresa un número de página válido." : undefined,
        form: !details?.text && !details?.page ? "No pudimos guardar la cita. Intenta nuevamente." : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const title = quote ? "Editar cita" : "Agregar cita";
  return (
    <dialog ref={dialogRef} aria-labelledby="quote-dialog-title" aria-busy={submitting} onCancel={close} onClose={() => { if (!submitting && open) onClose(); }} className="modal-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(36rem,calc(100%-2rem))] max-w-none overflow-y-auto rounded-lg border border-border bg-card p-0 text-foreground shadow-2xl">
      <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-7">
        <span className="grid size-11 place-items-center rounded-md bg-secondary text-primary"><Quotes aria-hidden="true" className="size-5" weight="duotone" /></span>
        <h2 id="quote-dialog-title" className="mt-4 font-heading text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Conserva unas palabras a las que quieras volver.</p>
        <label className="mt-6 block text-sm font-semibold">
          Fragmento <span aria-hidden="true" className="text-destructive">*</span>
          <textarea ref={textRef} required rows="6" value={values.text} onChange={(event) => { setValues((current) => ({ ...current, text: event.target.value })); setErrors((current) => ({ ...current, text: undefined, form: undefined })); }} aria-invalid={Boolean(errors.text)} aria-describedby={errors.text ? "quote-text-error" : undefined} className={`${inputClassName} resize-y py-2 leading-7`} />
          {errors.text && <span id="quote-text-error" className="mt-1.5 block text-xs font-normal text-destructive">{errors.text}</span>}
        </label>
        <label className="mt-5 block max-w-40 text-sm font-semibold">
          Página <span className="font-normal text-muted-foreground">(opcional)</span>
          <input type="number" min="0" inputMode="numeric" value={values.page} onChange={(event) => { setValues((current) => ({ ...current, page: event.target.value })); setErrors((current) => ({ ...current, page: undefined, form: undefined })); }} aria-invalid={Boolean(errors.page)} aria-describedby={errors.page ? "quote-page-error" : undefined} className={`${inputClassName} h-11`} />
          {errors.page && <span id="quote-page-error" className="mt-1.5 block text-xs font-normal text-destructive">{errors.page}</span>}
        </label>
        {errors.form && <p role="alert" className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-3 text-sm text-destructive">{errors.form}</p>}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={close} disabled={submitting} className="h-11 px-5 text-sm">Cancelar</Button>
          <Button type="submit" disabled={submitting} className="h-11 px-5 text-sm">{submitting ? "Guardando…" : quote ? "Guardar cambios" : "Guardar cita"}</Button>
        </div>
      </form>
    </dialog>
  );
}
