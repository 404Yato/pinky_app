import { Books, Coffee } from "@phosphor-icons/react";

export function HomePage() {
  return (
    <>
      <section aria-labelledby="welcome-title" className="max-w-3xl">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          <Coffee aria-hidden="true" className="size-4" weight="duotone" />
          Tu rincón de lectura
        </p>
        <h1 id="welcome-title" className="font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">Bienvenido a tu biblioteca.</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">Pinky será el lugar donde podrás descubrir, organizar y volver a cada historia que forma parte de ti.</p>
      </section>

      <section aria-labelledby="library-preview-title" className="mt-12 border-t border-border pt-10 sm:mt-16 sm:pt-12">
        <div className="flex max-w-3xl items-start gap-4 rounded-lg border border-border bg-card p-5 sm:p-7">
          <span className="grid size-12 shrink-0 place-items-center rounded-md bg-secondary text-primary"><Books aria-hidden="true" className="size-6" weight="duotone" /></span>
          <div>
            <h2 id="library-preview-title" className="font-heading text-xl font-semibold text-card-foreground sm:text-2xl">Tu colección empieza aquí</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">Explora tu biblioteca para reencontrarte con las historias que has reunido.</p>
          </div>
        </div>
      </section>
    </>
  );
}
