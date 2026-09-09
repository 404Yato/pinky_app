export function isValidCoverUrl(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return true;
  try {
    const url = new URL(normalized);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}
