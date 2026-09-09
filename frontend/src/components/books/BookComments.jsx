import { NotePencil, PencilSimple } from "@phosphor-icons/react";

import { MarkdownContent } from "@/components/content/MarkdownContent";
import { Button } from "@/components/ui/button";

export function BookComments({ comments, onEdit }) {
  const hasComments = Boolean(comments?.trim());

  return (
    <section aria-labelledby="comments-title" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="comments-title" className="flex items-center gap-2 font-heading text-2xl font-semibold">
          <NotePencil aria-hidden="true" className="size-5 text-primary" weight="duotone" />
          Comentarios personales
        </h2>
        <Button type="button" variant="ghost" size="lg" onClick={onEdit} aria-label={hasComments ? "Editar comentarios personales" : "Agregar comentarios personales"} className="h-9 gap-2 px-3 text-sm text-primary">
          <PencilSimple aria-hidden="true" /> {hasComments ? "Editar" : "Agregar comentario"}
        </Button>
      </div>

      {hasComments ? (
        <MarkdownContent className="pinky-scrollbar mt-4 max-h-80 overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border border-border bg-[#fbf4ea] p-5 text-sm text-muted-foreground sm:max-h-96 sm:p-6 sm:text-base">
          {comments}
        </MarkdownContent>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-card px-4 py-4 sm:px-5">
          <p className="text-sm leading-6 text-muted-foreground">Aún no has agregado comentarios sobre este libro.</p>
        </div>
      )}
    </section>
  );
}
