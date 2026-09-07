import { useEffect } from "react";
import { BookOpenText } from "@phosphor-icons/react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export function RegisterPage({ onRegister }) {
  useEffect(() => { document.title = "Crear cuenta | Pinky"; }, []);

  return (
    <AuthLayout contentId="register-content" labelledBy="register-title">
      <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary"><BookOpenText aria-hidden="true" className="size-4" /> Tu biblioteca comienza aquí</p>
      <h1 id="register-title" className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground min-[380px]:text-4xl sm:text-5xl">Crea tu cuenta</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">Prepara un rincón propio para organizar tus próximas historias.</p>
      <RegisterForm onSubmit={onRegister} />
      <p className="mt-6 text-center text-sm text-muted-foreground">¿Ya tienes una cuenta? <a href="#/login" className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Inicia sesión</a></p>
    </AuthLayout>
  );
}
