const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeRegistrationValues(values = {}) {
  return {
    username: String(values.username ?? "").trim(),
    email: String(values.email ?? "").trim().toLocaleLowerCase("es"),
    password: String(values.password ?? ""),
    confirmPassword: String(values.confirmPassword ?? ""),
  };
}

export function validateRegistrationValues(values = {}) {
  const normalized = normalizeRegistrationValues(values);
  const errors = {};
  if (!normalized.username) errors.username = "Escribe un nombre de usuario.";
  if (!normalized.email) errors.email = "Escribe tu correo electrónico.";
  else if (!emailPattern.test(normalized.email)) errors.email = "Ingresa un correo electrónico válido.";
  if (!normalized.password) errors.password = "Escribe una contraseña.";
  if (!normalized.confirmPassword) errors.confirmPassword = "Confirma tu contraseña.";
  else if (normalized.confirmPassword !== normalized.password) errors.confirmPassword = "Las contraseñas no coinciden.";
  return { values: normalized, errors, valid: Object.keys(errors).length === 0 };
}

export function registrationErrorsFromApi(error) {
  const details = error?.details;
  if (!details || typeof details !== "object" || Array.isArray(details)) return { fieldErrors: {}, formError: "No pudimos crear tu cuenta. Intenta nuevamente." };

  const fieldErrors = {};
  if (details.username) fieldErrors.username = "Ese nombre de usuario ya está en uso.";
  if (details.email) fieldErrors.email = "Ese correo electrónico ya está registrado.";
  const recognized = Object.keys(fieldErrors).length > 0;
  return {
    fieldErrors,
    formError: recognized ? "" : "Revisa los datos e intenta nuevamente.",
  };
}
