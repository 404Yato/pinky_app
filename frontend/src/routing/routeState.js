const SAFE_RETURN_PATHS = new Set(["/library", "/favorites", "/read", "/reading", "/pending"]);
const SUCCESS_MESSAGES = Object.freeze({
  created: "El libro se agregó a tu biblioteca.",
  updated: "Los cambios se guardaron correctamente.",
  deleted: "El libro se eliminó de tu biblioteca.",
});

export function getReturnTo(state) {
  return SAFE_RETURN_PATHS.has(state?.returnTo) ? state.returnTo : "/library";
}

export function getSuccessMessage(state) {
  return SUCCESS_MESSAGES[state?.success] ?? null;
}

export function getLoginDestination(state) {
  const destination = state?.from;
  if (typeof destination !== "string" || !destination.startsWith("/") || destination.startsWith("//")) return "/app";
  if (destination === "/" || destination === "/login" || destination === "/register") return "/app";
  return destination;
}

export function parseBookId(value) {
  if (!/^\d+$/.test(value ?? "")) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
