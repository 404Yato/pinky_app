import { useEffect } from "react";
import { BookOpenText, Books, Coffee } from "@phosphor-icons/react";

import { LoginForm } from "@/components/auth/LoginForm";
import { DEMO_CREDENTIALS } from "@/services/mock/auth";

export function LoginPage({ onLogin }) {
  useEffect(() => {
    document.title = "Iniciar sesión | Pinky";
  }, []);

  return (
    <>
      <a href="#login-content" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background motion-reduce:transition-none">Saltar al inicio de sesión</a>
      <main id="login-content" tabIndex="-1" className="grid min-h-dvh min-w-0 bg-background focus:outline-none lg:grid-cols-[minmax(20rem,0.8fr)_minmax(28rem,1.2fr)] xl:grid-cols-[minmax(24rem,0.8fr)_minmax(30rem,1.2fr)]">
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

      <section className="flex min-w-0 items-center justify-center overflow-y-auto px-4 py-8 min-[380px]:py-10 sm:px-8 lg:px-10 xl:px-12" aria-labelledby="login-title">
        <div className="w-full max-w-md">
          <div className="mb-9 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground"><Books aria-hidden="true" className="size-5" weight="duotone" /></span>
            <p className="font-heading text-2xl font-semibold">Pinky</p>
          </div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary"><BookOpenText aria-hidden="true" className="size-4" /> Bienvenido de vuelta</p>
          <h1 id="login-title" className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground min-[380px]:text-4xl sm:text-5xl">Entra a tu biblioteca</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">Continúa donde dejaste tus historias.</p>

          <div className="mt-7 rounded-lg border border-border bg-card px-4 py-3 text-sm leading-6 text-muted-foreground">
            <p className="font-semibold text-card-foreground">Acceso de demostración</p>
            <p className="mt-1"><span className="font-medium">Correo:</span> {DEMO_CREDENTIALS.email}</p>
            <p><span className="font-medium">Contraseña:</span> {DEMO_CREDENTIALS.password}</p>
          </div>

          <LoginForm onSubmit={onLogin} initialEmail={DEMO_CREDENTIALS.email} />
          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">Esta experiencia usa una sesión local de demostración. No se envían datos a ningún servidor.</p>
        </div>
      </section>
      </main>
    </>
  );
}
