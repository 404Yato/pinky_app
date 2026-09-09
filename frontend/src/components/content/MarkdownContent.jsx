import { lazy, Suspense } from "react";

const ReactMarkdown = lazy(() => import("react-markdown"));

export function MarkdownContent({ children, className = "" }) {
  return (
    <div className={className}>
      <Suspense fallback={<p className="whitespace-pre-wrap leading-7">{children}</p>}>
        <ReactMarkdown
          components={{
            h1: ({ children: content }) => <h3 className="mb-3 mt-6 font-heading text-2xl font-semibold first:mt-0">{content}</h3>,
            h2: ({ children: content }) => <h3 className="mb-3 mt-6 font-heading text-xl font-semibold first:mt-0">{content}</h3>,
            h3: ({ children: content }) => <h4 className="mb-2 mt-5 font-heading text-lg font-semibold first:mt-0">{content}</h4>,
            p: ({ children: content }) => <p className="my-3 leading-7 first:mt-0 last:mb-0">{content}</p>,
            ul: ({ children: content }) => <ul className="my-3 list-disc space-y-1 pl-6">{content}</ul>,
            ol: ({ children: content }) => <ol className="my-3 list-decimal space-y-1 pl-6">{content}</ol>,
            blockquote: ({ children: content }) => <blockquote className="my-4 border-l-4 border-primary/45 bg-secondary/55 px-4 py-2 font-heading italic text-foreground">{content}</blockquote>,
            a: ({ children: content, href }) => <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{content}</a>,
            strong: ({ children: content }) => <strong className="font-semibold text-foreground">{content}</strong>,
          }}
        >
          {children}
        </ReactMarkdown>
      </Suspense>
    </div>
  );
}
