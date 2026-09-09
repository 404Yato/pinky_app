import { NotePencil } from "@phosphor-icons/react";

import { MarkdownContent } from "@/components/content/MarkdownContent";

export function BookComments({ comments }) {
  if (!comments?.trim()) return null;

  return (
    <section aria-labelledby="comments-title" className="mt-10">
      <h2 id="comments-title" className="flex items-center gap-2 font-heading text-2xl font-semibold">
        <NotePencil aria-hidden="true" className="size-5 text-primary" weight="duotone" />
        Comentarios personales
      </h2>
      <MarkdownContent className="mt-4 rounded-lg border border-border bg-[#fbf4ea] p-5 text-sm text-muted-foreground sm:p-6 sm:text-base">
        {comments}
      </MarkdownContent>
    </section>
  );
}
