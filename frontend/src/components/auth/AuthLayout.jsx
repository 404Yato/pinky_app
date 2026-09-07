import { useRef } from "react";
import { Books, Coffee } from "@phosphor-icons/react";

export function AuthLayout({ contentId, labelledBy, children }) {
  const mainRef = useRef(null);

  const handleSkip = (event) => {
    event.preventDefault();
    mainRef.current?.focus();
  };

  return (
    <>
      <a href={`#${contentId}`} onClick={handleSkip} className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background motion-reduce:transition-none">Saltar al formulario</a>
      <main ref={mainRef} id={contentId} tabIndex="-1" className="grid min-h-dvh min-w-0 bg-background focus:outline-none lg:grid-cols-[minmax(20rem,0.8fr)_minmax(28rem,1.2fr)] xl:grid-cols-[minmax(24rem,0.8fr)_minmax(30rem,1.2fr)]">
        <section className="relative hidden overflow-hidden bg-sidebar px-10 py-12 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between xl:px-16">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"><Books aria-hidden="true" className="size-6" weight="duotone" /></span>
            <div><p className="font-heading text-2xl font-semibold leading-none">Pinky</p><p className="mt-1 text-xs text-sidebar-foreground/65">Tu biblioteca personal</p></div>
          </div>
          <div className="max-w-lg py-16">
            <Coffee aria-hidden="true" className="size-10 text-sidebar-ring" weight="duotone" />
            <p className="mt-7 font-heading text-4xl font-semibold leading-tight xl:text-5xl">Cada historia merece un lugar al que volver.</p>
            <p className="mt-5 max-w-md text-base leading-8 text-sidebar-foreground/75">Organiza tus libros, acompaña tus lecturas y conserva cerca las historias que forman parte de ti.</p>
          </div>
          <p className="text-xs text-sidebar-foreground/55">Un rincón tranquilo para tus historias.</p>
        </section>
        <section className="flex min-w-0 items-center justify-center overflow-y-auto px-4 py-8 min-[380px]:py-10 sm:px-8 lg:px-10 xl:px-12" aria-labelledby={labelledBy}>
          <div className="w-full max-w-md">
            <div className="mb-9 flex items-center gap-3 lg:hidden">
              <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground"><Books aria-hidden="true" className="size-5" weight="duotone" /></span>
              <p className="font-heading text-2xl font-semibold">Pinky</p>
            </div>
            {children}
          </div>
        </section>
      </main>
    </>
  );
}
