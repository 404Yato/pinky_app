import { useEffect } from "react";
import { ArrowRight, Books, BookmarkSimple, Heart, MapPin, Quotes, Record } from "@phosphor-icons/react";

import { LandingPreview } from "@/components/landing/LandingPreview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  { icon: Books, title: "Organiza tu colección", text: "Reúne tus libros y conserva la historia particular de cada ejemplar." },
  { icon: MapPin, title: "Recuerda dónde está", text: "Guarda su lugar habitual y anota a quién se lo prestaste." },
  { icon: BookmarkSimple, title: "Acompaña tus lecturas", text: "Distingue lo pendiente, lo que estás leyendo y las historias terminadas." },
  { icon: Quotes, title: "Conserva tus fragmentos", text: "Guarda citas y páginas para volver a esas palabras cuando quieras." },
];

const primaryLink = "h-11 gap-2 px-5 text-sm shadow-[0_8px_22px_rgb(104_67_43_/_0.18)]";
const secondaryLink = "h-11 px-5 text-sm";

export function LandingPage({ authenticated = false }) {
  useEffect(() => { document.title = "Pinky | Tu colección, a tu manera"; }, []);
  const primaryHref = authenticated ? "#/app" : "#/register";
  const primaryLabel = authenticated ? "Ir a mi biblioteca" : "Crear mi cuenta";

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <a href="#landing-main" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background motion-reduce:transition-none">Saltar al contenido</a>

      <header className="border-b border-border/80 bg-background/95 backdrop-blur-sm">
        <nav aria-label="Navegación de presentación" className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
          <a href="#/" aria-label="Pinky, inicio" className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"><Books aria-hidden="true" className="size-5" weight="duotone" /></span>
            <span className="font-heading text-xl font-semibold">Pinky</span>
          </a>
          <div className="ml-auto hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
            <a href="#landing-main" className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Inicio</a>
            <a href="#caracteristicas" className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Características</a>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-3">
            {!authenticated && <a href="#/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden h-10 px-3 text-sm min-[400px]:inline-flex")}>Iniciar sesión</a>}
            <a href={primaryHref} className={cn(buttonVariants(), "h-10 px-3 text-sm sm:px-4")}>{authenticated ? "Ir a Pinky" : "Crear cuenta"}</a>
          </div>
        </nav>
      </header>

      <main id="landing-main">
        <section className="relative isolate overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-32 lg:pt-24">
          <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[34rem] w-[54rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,130,75,0.18),transparent_68%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(30rem,1.1fr)] lg:gap-16">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary"><Heart aria-hidden="true" className="size-4" weight="fill" /> Tu espacio personal</p>
              <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.08] tracking-tight min-[400px]:text-5xl sm:text-6xl xl:text-7xl">Tu colección,<br /><span className="text-primary">a tu manera.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">Organiza tus libros, recuerda dónde están, guarda tus fragmentos favoritos y lleva contigo la historia de cada ejemplar.</p>
              <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row">
                <a href={primaryHref} className={cn(buttonVariants(), primaryLink)}>{primaryLabel}<ArrowRight aria-hidden="true" /></a>
                {!authenticated && <a href="#/login" className={cn(buttonVariants({ variant: "outline" }), secondaryLink)}>Iniciar sesión</a>}
              </div>
              <p className="mt-6 text-sm text-muted-foreground">Sin feeds. Sin seguidores. Solo tus libros y la forma en que viven contigo.</p>
            </div>
            <LandingPreview />
          </div>
        </section>

        <section id="caracteristicas" aria-labelledby="features-title" className="border-y border-border bg-card px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Lo que importa, cerca</p>
              <h2 id="features-title" className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Un lugar tranquilo para tu biblioteca.</h2>
            </div>
            <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, text }) => (
                <article key={title} className="flex gap-4 border-t border-border pt-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary"><Icon aria-hidden="true" className="size-5" weight="duotone" /></span>
                  <div><h3 className="font-heading text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <p className="font-heading text-3xl font-semibold leading-tight sm:text-4xl">Tu colección no necesita una audiencia.</p>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">Pinky está pensado para las cosas que eliges conservar: dónde descansan, a quién se las prestaste y por qué quieres volver a ellas. Sin ruido social ni números que perseguir.</p>
            </div>
            <div className="rounded-xl border border-sidebar-border bg-sidebar p-7 text-sidebar-foreground shadow-[0_18px_50px_rgb(59_42_32_/_0.15)] sm:p-10">
              <Record aria-hidden="true" className="size-8 text-sidebar-ring" weight="duotone" />
              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/60">Una colección que puede crecer</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold">Hoy libros.<br />Mañana, el resto de tu colección.</h2>
              <p className="mt-4 text-sm leading-7 text-sidebar-foreground/70">Pinky empieza por las historias impresas y está pensado para recibir otros objetos queridos, como tus vinilos, en el futuro.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-secondary px-4 py-20 text-center sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <Books aria-hidden="true" className="mx-auto size-10 text-primary" weight="duotone" />
            <h2 className="mt-5 font-heading text-3xl font-semibold sm:text-4xl">Hazle un lugar a tus historias.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">Tu biblioteca personal puede empezar con un solo libro.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 min-[400px]:flex-row">
              <a href={primaryHref} className={cn(buttonVariants(), primaryLink)}>{primaryLabel}</a>
              {!authenticated && <a href="#/login" className={cn(buttonVariants({ variant: "outline" }), secondaryLink)}>Entrar a Pinky</a>}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-sidebar-border bg-sidebar px-4 py-7 text-sidebar-foreground sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-heading font-semibold">Pinky</p>
          <p className="text-xs text-sidebar-foreground/55">Un rincón tranquilo para las cosas que coleccionas.</p>
        </div>
      </footer>
    </div>
  );
}
