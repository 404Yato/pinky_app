export function userResponseToViewModel(response) {
  const name = response.username;
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return { id: response.id, name, username: response.username, email: response.email, initials: initials || "P" };
}
