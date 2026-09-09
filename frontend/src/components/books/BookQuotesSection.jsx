import { useState } from "react";
import { NotePencil, PencilSimple, Plus, Quotes, Trash, WarningCircle } from "@phosphor-icons/react";

import { BookQuoteDialog } from "@/components/books/BookQuoteDialog";
import { DeleteQuoteDialog } from "@/components/books/DeleteQuoteDialog";
import { Button } from "@/components/ui/button";
import { StatusNotice } from "@/components/feedback/StatusNotice";
import { useBookQuotes } from "@/hooks/useBookQuotes";

export function BookQuotesSection({ bookId }) {
  const { quotes, status, retry, createQuote, updateQuote, removeQuote } = useBookQuotes(bookId);
  const [editor, setEditor] = useState(null);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [success, setSuccess] = useState("");

  const saveQuote = async (values) => {
    if (editor?.quote) {
      await updateQuote(editor.quote.id, values);
      setSuccess("Cita actualizada.");
    } else {
      await createQuote(values);
      setSuccess("Cita guardada.");
    }
  };

  const deleteQuote = async () => {
    await removeQuote(quoteToDelete.id);
    setQuoteToDelete(null);
    setSuccess("Cita eliminada.");
  };

  return (
    <section aria-labelledby="quotes-title" className="mt-12 border-t border-border pt-10 sm:mt-16 sm:pt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary"><Quotes aria-hidden="true" className="size-4" weight="duotone" /> Diario de lectura</p>
          <h2 id="quotes-title" className="mt-2 font-heading text-3xl font-semibold">Fragmentos guardados</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Palabras de este libro que merecen un lugar al que volver.</p>
        </div>
        <Button type="button" onClick={() => setEditor({ quote: null })} className="h-11 w-full gap-2 px-5 text-sm sm:w-auto"><Plus aria-hidden="true" /> Agregar cita</Button>
      </div>

      {success && <StatusNotice onDismiss={() => setSuccess("")} className="mt-6">{success}</StatusNotice>}

      {status === "loading" && (
        <div role="status" aria-label="Cargando citas" className="mt-6 grid gap-4 sm:grid-cols-2">
          {[0, 1].map((item) => <div key={item} className="h-36 animate-pulse rounded-lg border border-border bg-card motion-reduce:animate-none" />)}
        </div>
      )}

      {status === "error" && (
        <div role="alert" className="mt-6 rounded-lg border border-destructive/25 bg-card p-6 text-center">
          <WarningCircle aria-hidden="true" className="mx-auto size-8 text-destructive" weight="duotone" />
          <p className="mt-3 font-heading text-xl font-semibold">No pudimos cargar tus citas.</p>
          <p className="mt-1 text-sm text-muted-foreground">El resto del libro sigue disponible.</p>
          <Button type="button" variant="outline" onClick={retry} className="mt-5 h-10 px-4 text-sm">Reintentar</Button>
        </div>
      )}

      {status === "success" && quotes.length === 0 && (
        <div className="mt-6 rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center">
          <NotePencil aria-hidden="true" className="mx-auto size-9 text-primary" weight="duotone" />
          <p className="mt-3 font-heading text-xl font-semibold">Todavía no has guardado ningún fragmento.</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Cuando una frase te acompañe, puedes conservarla aquí.</p>
        </div>
      )}

      {status === "success" && quotes.length > 0 && (
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {quotes.map((quote) => (
            <li key={quote.id} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5 shadow-[0_5px_18px_rgb(59_42_32_/_0.06)] sm:p-6">
              <blockquote className="min-w-0 flex-1 whitespace-pre-line break-words font-heading text-lg leading-8 text-foreground">
                <span aria-hidden="true" className="mr-1 text-2xl text-primary">❝</span>{quote.text}
              </blockquote>
              <div className="mt-5 flex min-h-10 items-end justify-between gap-3 border-t border-border pt-4">
                {quote.page !== null && quote.page !== undefined ? <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Página {quote.page}</p> : <span />}
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="icon-lg" aria-label="Editar cita" onClick={() => setEditor({ quote })}><PencilSimple aria-hidden="true" /></Button>
                  <Button type="button" variant="ghost" size="icon-lg" aria-label="Eliminar cita" onClick={() => setQuoteToDelete(quote)} className="text-destructive hover:text-destructive"><Trash aria-hidden="true" /></Button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      <BookQuoteDialog open={Boolean(editor)} quote={editor?.quote ?? null} onClose={() => setEditor(null)} onSubmit={saveQuote} />
      <DeleteQuoteDialog open={Boolean(quoteToDelete)} onClose={() => setQuoteToDelete(null)} onConfirm={deleteQuote} />
    </section>
  );
}
