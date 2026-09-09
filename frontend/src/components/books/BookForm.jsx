import { CircleNotch, MagnifyingGlass } from "@phosphor-icons/react";
import { useRef, useState } from "react";

import { BookCover } from "@/components/books/BookCover";
import { MarkdownEditor } from "@/components/forms/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { READING_STATUS } from "@/constants/books";
import { POSSESSION_STATUS, POSSESSION_STATUS_LABEL } from "@/constants/items";
import { isValidCoverUrl } from "@/lib/bookCover";
import { fillEmptyBookFields, isValidIsbn, normalizeIsbn } from "@/lib/isbn";
import { getBookMetadataByISBN } from "@/services/bookMetadata";

const inputClassName = "mt-2 h-11 w-full rounded-md border border-input bg-background px-3 font-normal text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

const emptyBook = {
  title: "",
  author: "",
  description: "",
  comments: "",
  isbn: "",
  publisher: "",
  pages: "",
  publicationYear: "",
  genre: "",
  readingStatus: READING_STATUS.PENDING,
  favorite: false,
  possessionStatus: POSSESSION_STATUS.OWNED,
  location: "",
  loanedTo: "",
  coverUrl: "",
};

function getInitialValues(book) {
  if (!book) return emptyBook;
  return Object.fromEntries(Object.keys(emptyBook).map((field) => [field, book[field] ?? emptyBook[field]]));
}

export function BookForm({ book = null, onSubmit, onCancel }) {
  const formRef = useRef(null);
  const [values, setValues] = useState(() => getInitialValues(book));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lookupStatus, setLookupStatus] = useState("idle");
  const [lookupMessage, setLookupMessage] = useState("");

  const updateField = (field, value) => {
    setValues((current) => ({
      ...current,
      [field]: value,
      ...(field === "possessionStatus" && value !== POSSESSION_STATUS.LOANED ? { loanedTo: "" } : {}),
    }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (field === "isbn") {
      setLookupStatus("idle");
      setLookupMessage("");
    }
  };

  const handleIsbnLookup = async () => {
    if (lookupStatus === "loading") return;
    if (!isValidIsbn(values.isbn)) {
      setErrors((current) => ({ ...current, isbn: "Ingresa un ISBN-10 o ISBN-13 válido." }));
      setLookupStatus("error");
      setLookupMessage("Ingresa un ISBN-10 o ISBN-13 válido.");
      return;
    }

    const isbn = normalizeIsbn(values.isbn);
    setValues((current) => ({ ...current, isbn }));
    setErrors((current) => ({ ...current, isbn: undefined }));
    setLookupStatus("loading");
    setLookupMessage("Buscando información del libro…");

    try {
      const metadata = await getBookMetadataByISBN(isbn);
      setValues((current) => fillEmptyBookFields(current, metadata));
      setLookupStatus("success");
      setLookupMessage("Información del libro encontrada. Revisa los datos antes de guardar.");
    } catch (error) {
      setLookupStatus("error");
      setLookupMessage(error?.code === "NOT_FOUND"
        ? "No encontramos información para este ISBN. Puedes completar los datos manualmente."
        : "No pudimos consultar la información del libro. Inténtalo nuevamente o completa los datos manualmente.");
    }
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
    if (!isValidCoverUrl(values.coverUrl)) nextErrors.coverUrl = "Ingresa una URL completa, por ejemplo https://example.com/portada.jpg.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
    }
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
      setSubmitError(error?.code === "VALIDATION_ERROR" ? "Revisa los datos del libro e intenta nuevamente." : "No pudimos guardar el libro. Intenta nuevamente.");
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
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={submitting} className="space-y-8">
      {Object.keys(errors).length > 0 && <p role="alert" className="sr-only">Revisa los campos indicados antes de guardar el libro.</p>}
      <fieldset className="min-w-0 rounded-lg border border-border bg-secondary/35 p-4 sm:p-6">
        <legend className="px-2 font-heading text-lg font-semibold">Buscar por ISBN</legend>
        <div className="grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="block text-sm font-semibold text-foreground">
            ISBN
            <input
              value={values.isbn}
              onChange={(event) => updateField("isbn", event.target.value)}
              disabled={lookupStatus === "loading"}
              inputMode="text"
              autoComplete="off"
              aria-invalid={Boolean(errors.isbn)}
              aria-describedby={errors.isbn ? "isbn-error isbn-help" : "isbn-help"}
              className={inputClassName}
              placeholder="978-84-376-0494-7"
            />
            {errors.isbn && <span id="isbn-error" className="mt-1.5 block text-xs font-normal text-destructive">{errors.isbn}</span>}
          </label>
          <Button type="button" variant="outline" onClick={handleIsbnLookup} disabled={lookupStatus === "loading"} className="mt-0 h-11 w-full gap-2 px-4 text-sm sm:mt-7 sm:w-auto" aria-describedby="isbn-help" aria-busy={lookupStatus === "loading"}>
            {lookupStatus === "loading" ? <CircleNotch aria-hidden="true" className="animate-spin" /> : <MagnifyingGlass aria-hidden="true" />}
            {lookupStatus === "loading" ? "Buscando…" : "Buscar libro"}
          </Button>
        </div>
        <p id="isbn-help" className="mt-2 text-xs leading-5 text-muted-foreground">Pinky puede intentar completar automáticamente los datos de esta edición. Tú decides qué conservar.</p>
        {lookupMessage && (
          <p role={lookupStatus === "error" ? "alert" : "status"} aria-live="polite" className={`mt-3 rounded-md border px-3 py-2 text-sm ${lookupStatus === "success" ? "border-primary/20 bg-primary/5 text-primary" : lookupStatus === "error" ? "border-destructive/25 bg-destructive/5 text-destructive" : "border-border bg-background text-muted-foreground"}`}>
            {lookupMessage}
          </p>
        )}
      </fieldset>

      <fieldset className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-7">
        <legend className="px-2 font-heading text-xl font-semibold">Información principal</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-foreground sm:col-span-2">
            Título <span aria-hidden="true" className="text-destructive">*</span>
            <input autoFocus required aria-required="true" value={values.title} onChange={(event) => updateField("title", event.target.value)} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "title-error" : undefined} className={inputClassName} />
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

      <fieldset className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-7">
        <legend className="px-2 font-heading text-xl font-semibold">Tu ejemplar</legend>
        <p className="mb-5 text-sm leading-6 text-muted-foreground">Guarda dónde suele estar y si alguien lo tiene prestado.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-foreground">
            Posesión
            <select value={values.possessionStatus} onChange={(event) => updateField("possessionStatus", event.target.value)} className={inputClassName}>
              {Object.entries(POSSESSION_STATUS_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          {field("location", values.possessionStatus === POSSESSION_STATUS.LOANED ? "Ubicación habitual" : "Ubicación", { maxLength: 255, placeholder: "Librero dormitorio · Repisa 2" })}
          {values.possessionStatus === POSSESSION_STATUS.LOANED && field("loanedTo", "Prestado a", { maxLength: 255, placeholder: "Nombre de la persona" })}
        </div>
        <p className="sr-only" aria-live="polite">{values.possessionStatus === POSSESSION_STATUS.LOANED ? "El campo Prestado a está disponible." : "El campo Prestado a está oculto."}</p>
      </fieldset>

      <fieldset className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-7">
        <legend className="px-2 font-heading text-xl font-semibold">Datos de la edición</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {field("publisher", "Editorial")}
          {field("publicationYear", "Año de publicación", { type: "number", min: "1", inputMode: "numeric" })}
          {field("pages", "Número de páginas", { type: "number", min: "1", inputMode: "numeric" })}
          <div className="min-w-0 sm:col-span-2">
            <label className="block text-sm font-semibold text-foreground">
              URL de portada
              <input
                type="url"
                maxLength="200"
                inputMode="url"
                autoComplete="url"
                value={values.coverUrl}
                onChange={(event) => updateField("coverUrl", event.target.value)}
                aria-invalid={Boolean(errors.coverUrl)}
                aria-describedby={errors.coverUrl ? "coverUrl-error coverUrl-help" : "coverUrl-help"}
                className={inputClassName}
                placeholder="https://example.com/book-cover.jpg"
              />
              <span id="coverUrl-help" className="mt-1.5 block text-xs font-normal leading-5 text-muted-foreground">Pega una URL completa que apunte a la imagen de portada.</span>
              {errors.coverUrl && <span id="coverUrl-error" className="mt-1.5 block text-xs font-normal text-destructive">{errors.coverUrl}</span>}
            </label>
            {isValidCoverUrl(values.coverUrl) && values.coverUrl.trim() && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Vista previa</p>
                <div className="aspect-[2/3] w-28 overflow-hidden rounded-md border border-border bg-secondary shadow-[0_5px_18px_rgb(59_42_32_/_0.08)] sm:w-32">
                  <BookCover book={{ id: book?.id ?? 0, title: values.title || "Nuevo libro", author: values.author, coverUrl: values.coverUrl.trim() }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-7">
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

      <fieldset id="comments" className="min-w-0 scroll-mt-24 rounded-lg border border-border bg-card p-4 sm:p-7">
        <legend className="px-2 font-heading text-xl font-semibold">Comentarios personales</legend>
        <p id="comments-help" className="mb-4 text-sm leading-6 text-muted-foreground">Guarda aquí recuerdos, impresiones o notas personales sobre este libro. Puedes darles formato con la barra sin aprender Markdown.</p>
        <label htmlFor="comments-editor" className="sr-only">Comentarios personales</label>
        <MarkdownEditor
          id="comments-editor"
          value={values.comments}
          onChange={(comments) => updateField("comments", comments)}
          disabled={submitting}
          aria-describedby="comments-help"
          placeholder="Por ejemplo: quién te lo regaló, dónde lo leíste o qué te hizo sentir…"
        />
      </fieldset>

      {submitError && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{submitError}</p>}

      <div className="sticky bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[5] flex flex-col-reverse gap-3 rounded-lg border border-border bg-background/95 p-3 shadow-[0_8px_30px_rgb(59_42_32_/_0.12)] backdrop-blur-sm sm:bottom-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting} className="h-11 px-5 text-sm">Cancelar</Button>
        <Button type="submit" disabled={submitting} className="h-11 px-5 text-sm">{submitting ? "Guardando…" : book ? "Guardar cambios" : "Agregar a mi biblioteca"}</Button>
      </div>
    </form>
  );
}
