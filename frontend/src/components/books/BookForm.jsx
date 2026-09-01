import { useState } from "react";

import { Button } from "@/components/ui/button";
import { READING_STATUS } from "@/constants/books";

const inputClassName = "mt-2 h-11 w-full rounded-md border border-input bg-background px-3 font-normal text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

const emptyBook = {
  title: "",
  author: "",
  description: "",
  isbn: "",
  publisher: "",
  pages: "",
  publicationYear: "",
  genre: "",
  readingStatus: READING_STATUS.PENDING,
  favorite: false,
};

function getInitialValues(book) {
  if (!book) return emptyBook;
  return Object.fromEntries(Object.keys(emptyBook).map((field) => [field, book[field] ?? emptyBook[field]]));
}

export function BookForm({ book = null, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => getInitialValues(book));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.title.trim()) nextErrors.title = "Escribe el título del libro.";
    if (values.pages !== "" && (!Number.isInteger(Number(values.pages)) || Number(values.pages) <= 0)) {
      nextErrors.pages = "Ingresa un número entero mayor que cero.";
    }
    if (values.publicationYear !== "" && (!Number.isInteger(Number(values.publicationYear)) || Number(values.publicationYear) < 1)) {
      nextErrors.publicationYear = "Ingresa un año válido.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting || !validate()) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(error?.message || "No pudimos guardar el libro. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, props = {}) => (
    <label className="block text-sm font-semibold text-foreground">
      {label}
      <input
        {...props}
        value={values[name]}
        onChange={(event) => updateField(name, event.target.value)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className={inputClassName}
      />
      {errors[name] && <span id={`${name}-error`} className="mt-1.5 block text-xs font-normal text-destructive">{errors[name]}</span>}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <fieldset className="rounded-lg border border-border bg-card p-5 sm:p-7">
        <legend className="px-2 font-heading text-xl font-semibold">Información principal</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-foreground sm:col-span-2">
            Título <span aria-hidden="true" className="text-destructive">*</span>
            <input autoFocus value={values.title} onChange={(event) => updateField("title", event.target.value)} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "title-error" : undefined} className={inputClassName} />
            {errors.title && <span id="title-error" className="mt-1.5 block text-xs font-normal text-destructive">{errors.title}</span>}
          </label>
          {field("author", "Autor")}
          {field("genre", "Género")}
          <label className="block text-sm font-semibold text-foreground sm:col-span-2">
            Descripción
            <textarea value={values.description} onChange={(event) => updateField("description", event.target.value)} rows="6" className="mt-2 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-normal leading-7 text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20" />
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-border bg-card p-5 sm:p-7">
        <legend className="px-2 font-heading text-xl font-semibold">Datos de la edición</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {field("publisher", "Editorial")}
          {field("isbn", "ISBN", { inputMode: "numeric" })}
          {field("publicationYear", "Año de publicación", { type: "number", min: "1", inputMode: "numeric" })}
          {field("pages", "Número de páginas", { type: "number", min: "1", inputMode: "numeric" })}
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-border bg-card p-5 sm:p-7">
        <legend className="px-2 font-heading text-xl font-semibold">Tu lectura</legend>
        <div className="grid items-end gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-foreground">
            Estado de lectura
            <select value={values.readingStatus} onChange={(event) => updateField("readingStatus", event.target.value)} className={inputClassName}>
              <option value={READING_STATUS.PENDING}>Pendiente</option>
              <option value={READING_STATUS.READING}>Leyendo</option>
              <option value={READING_STATUS.READ}>Leído</option>
            </select>
          </label>
          <label className="flex min-h-11 items-center gap-3 rounded-md border border-input bg-background px-3 text-sm font-semibold text-foreground">
            <input type="checkbox" checked={values.favorite} onChange={(event) => updateField("favorite", event.target.checked)} className="size-4 accent-primary" />
            Marcar como favorito
          </label>
        </div>
      </fieldset>

      {submitError && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{submitError}</p>}

      <div className="sticky bottom-4 flex flex-col-reverse gap-3 rounded-lg border border-border bg-background/95 p-3 shadow-[0_8px_30px_rgb(59_42_32_/_0.12)] backdrop-blur-sm sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting} className="h-11 px-5 text-sm">Cancelar</Button>
        <Button type="submit" disabled={submitting} className="h-11 px-5 text-sm">{submitting ? "Guardando…" : book ? "Guardar cambios" : "Agregar a mi biblioteca"}</Button>
      </div>
    </form>
  );
}
