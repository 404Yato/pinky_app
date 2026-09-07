export function normalizeLoginValues(values = {}) {
  return {
    username: String(values.username ?? "").trim(),
    password: String(values.password ?? ""),
  };
}

export function validateLoginValues(values = {}) {
  const normalized = normalizeLoginValues(values);
  const errors = {};

  if (!normalized.username) errors.username = "Escribe tu nombre de usuario.";

  if (!normalized.password) errors.password = "Escribe tu contraseña.";

  return { values: normalized, errors, valid: Object.keys(errors).length === 0 };
}
