import { mockCurrentUser } from "../../data/mockUser.js";
import { normalizeLoginValues } from "../../lib/auth.js";

export const DEMO_CREDENTIALS = Object.freeze({
  email: "cristian@pinky.app",
  password: "pinky123",
});

export class MockAuthError extends Error {
  constructor(message, code = "MOCK_AUTH_ERROR") {
    super(message);
    this.name = "MockAuthError";
    this.code = code;
  }
}

export async function login(input) {
  const credentials = normalizeLoginValues(input);
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (credentials.email !== DEMO_CREDENTIALS.email || credentials.password !== DEMO_CREDENTIALS.password) {
    throw new MockAuthError("El correo o la contraseña no coinciden.", "INVALID_CREDENTIALS");
  }

  return structuredClone(mockCurrentUser);
}
