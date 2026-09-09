import { useEffect } from "react";
import { BookOpenText } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { StatusNotice } from "@/components/feedback/StatusNotice";

export function LoginPage({ onLogin, successMessage, onDismissSuccess }) {
  useEffect(() => {
    document.title = "Iniciar sesión | Pinky";
  }, []);

  return (
    <AuthLayout contentId="login-content" labelledBy="login-title">
          {successMessage && <StatusNotice onDismiss={onDismissSuccess} className="mb-7">{successMessage}</StatusNotice>}
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary"><BookOpenText aria-hidden="true" className="size-4" /> Bienvenido de vuelta</p>
          <h1 id="login-title" className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground min-[380px]:text-4xl sm:text-5xl">Entra a tu biblioteca</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">Continúa donde dejaste tus historias.</p>

          <LoginForm onSubmit={onLogin} />
          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">Usa las credenciales de tu cuenta de Pinky para continuar.</p>
          <p className="mt-4 text-center text-sm text-muted-foreground">¿Aún no tienes una cuenta? <Link to="/register" className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Regístrate</Link></p>
    </AuthLayout>
  );
}
