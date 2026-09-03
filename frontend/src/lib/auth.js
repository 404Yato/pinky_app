export function normalizeLoginValues(values = {}) {
  return {
    email: String(values.email ?? "").trim().toLocaleLowerCase("es"),
    password: String(values.password ?? ""),
  };
}

export function validateLoginValues(values = {}) {
  const normalized = normalizeLoginValues(values);
  const errors = {};

  if (!normalized.email) {
    errors.email = "Escribe tu correo electrónico.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
    errors.email = "Ingresa un correo electrónico válido.";
  }

  if (!normalized.password) errors.password = "Escribe tu contraseña.";

  return { values: normalized, errors, valid: Object.keys(errors).length === 0 };
}
