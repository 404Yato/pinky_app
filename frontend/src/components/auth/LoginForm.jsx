import { useState } from "react";
import { Eye, EyeSlash, SignIn, WarningCircle } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { validateLoginValues } from "@/lib/auth";

const inputClassName = "mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

export function LoginForm({ onSubmit, initialEmail = "" }) {
  const [values, setValues] = useState({ email: initialEmail, password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const validation = validateLoginValues(values);
    setErrors(validation.errors);
    if (!validation.valid) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit(validation.values);
    } catch (error) {
      setSubmitError(error?.code === "INVALID_CREDENTIALS" ? "El correo o la contraseña no coinciden. Revisa los datos de acceso." : "No pudimos iniciar la sesión de demostración. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
      <label className="block text-sm font-semibold text-foreground">
        Correo electrónico
        <input type="email" autoComplete="email" autoFocus value={values.email} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined} className={inputClassName} placeholder="tu@correo.com" />
        {errors.email && <span id="login-email-error" className="mt-1.5 block text-xs font-normal text-destructive">{errors.email}</span>}
      </label>

      <label className="block text-sm font-semibold text-foreground">
        Contraseña
        <span className="relative mt-2 block">
          <input type={showPassword ? "text" : "password"} autoComplete="current-password" value={values.password} onChange={(event) => updateField("password", event.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "login-password-error" : undefined} className={`${inputClassName} mt-0 pr-12`} />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPassword} className="absolute right-0 top-0 grid size-11 place-items-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {showPassword ? <EyeSlash aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
          </button>
        </span>
        {errors.password && <span id="login-password-error" className="mt-1.5 block text-xs font-normal text-destructive">{errors.password}</span>}
      </label>

      {submitError && (
        <p role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-3 text-sm leading-6 text-destructive">
          <WarningCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" /> {submitError}
        </p>
      )}

      <Button type="submit" disabled={submitting} aria-busy={submitting} className="h-11 w-full gap-2 text-sm">
        <SignIn aria-hidden="true" /> {submitting ? "Entrando…" : "Entrar a mi biblioteca"}
      </Button>
    </form>
  );
}
