import { useRef, useState } from "react";
import { UserPlus, WarningCircle } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { registrationErrorsFromApi, validateRegistrationValues } from "@/lib/registration";

const inputClassName = "mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20";
const initialValues = { username: "", email: "", password: "", confirmPassword: "" };

export function RegisterForm({ onSubmit }) {
  const formRef = useRef(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError("");
  };

  const focusFirstInvalid = () => window.requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const validation = validateRegistrationValues(values);
    setErrors(validation.errors);
    if (!validation.valid) {
      focusFirstInvalid();
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      await onSubmit(validation.values);
    } catch (error) {
      const mapped = registrationErrorsFromApi(error);
      setErrors(mapped.fieldErrors);
      setFormError(mapped.formError);
      if (Object.keys(mapped.fieldErrors).length > 0) focusFirstInvalid();
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, props) => (
    <label className="block text-sm font-semibold text-foreground">
      {label}
      <input {...props} required aria-required="true" value={values[name]} onChange={(event) => updateField(name, event.target.value)} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `register-${name}-error` : undefined} className={inputClassName} />
      {errors[name] && <span id={`register-${name}-error`} className="mt-1.5 block text-xs font-normal text-destructive">{errors[name]}</span>}
    </label>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={submitting} className="mt-8 space-y-5">
      {Object.keys(errors).length > 0 && <p role="alert" className="sr-only">Revisa los campos indicados antes de crear tu cuenta.</p>}
      {field("username", "Nombre de usuario", { type: "text", autoComplete: "username", autoFocus: true, placeholder: "tu_usuario" })}
      {field("email", "Correo electrónico", { type: "email", autoComplete: "email", placeholder: "tu@correo.com" })}
      {field("password", "Contraseña", { type: "password", autoComplete: "new-password" })}
      {field("confirmPassword", "Confirmar contraseña", { type: "password", autoComplete: "new-password" })}

      {formError && <p role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-3 text-sm leading-6 text-destructive"><WarningCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" /> {formError}</p>}

      <Button type="submit" disabled={submitting} aria-busy={submitting} className="h-11 w-full gap-2 text-sm">
        <UserPlus aria-hidden="true" /> {submitting ? "Creando cuenta…" : "Crear mi cuenta"}
      </Button>
    </form>
  );
}
