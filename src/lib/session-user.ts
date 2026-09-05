export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role?: "admin" | "student";
}

export function getSessionUser(): SessionUser | null {
  try {
    return JSON.parse(localStorage.getItem("user") ?? "null") as SessionUser | null;
  } catch {
    return null;
  }
}
