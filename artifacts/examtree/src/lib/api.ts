import { getFirebaseAuth } from "@/lib/firebase";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "/api";

const ATTEMPT_HANDOFF_PREFIX = "examtree.attempt.handoff.";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `Request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getAttemptIdFromEndpoint(endpoint: string): string | null {
  const match = endpoint.match(/^\/attempts\/([^/?#]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function readAttemptHandoff<T>(attemptId: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(`${ATTEMPT_HANDOFF_PREFIX}${attemptId}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveAttemptHandoff(value: unknown): void {
  if (typeof window === "undefined" || !isRecord(value)) return;
  const attemptId = value.id;
  if (typeof attemptId !== "string" || !attemptId) return;
  try {
    window.sessionStorage.setItem(
      `${ATTEMPT_HANDOFF_PREFIX}${attemptId}`,
      JSON.stringify(value),
    );
  } catch (error) {
    console.warn("Unable to cache submitted attempt in browser session", error);
  }
}

function compactAttemptForLocalStorage<T>(value: T): T {
  if (!isRecord(value)) return value;
  // The complete question review is already stored in sessionStorage above and
  // remains available to the result page through GET /attempts/:id. Omitting it
  // here prevents addAttempt() from overflowing localStorage and incorrectly
  // turning a successful server submission into the offline fallback path.
  return {
    ...value,
    questionReview: undefined,
  } as T;
}

export function getApiErrorCode(body: unknown): string | undefined {
  if (!isRecord(body)) return undefined;
  const code = body["code"];
  return typeof code === "string" ? code : undefined;
}

export function getApiErrorMessage(body: unknown): string | undefined {
  if (!isRecord(body)) return undefined;
  const err = body["error"];
  return typeof err === "string" ? err : undefined;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const auth = getFirebaseAuth();
  const currentUser = auth?.currentUser;
  if (!currentUser) return {};

  try {
    const token = await currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const method = (options?.method ?? "GET").toUpperCase();
  const requestedAttemptId = method === "GET" ? getAttemptIdFromEndpoint(endpoint) : null;

  if (requestedAttemptId) {
    const cached = readAttemptHandoff<T>(requestedAttemptId);
    if (cached) return cached;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
      ...(options?.headers as Record<string, string> | undefined),
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let body: unknown = text;
    if (text) {
      try {
        body = JSON.parse(text) as unknown;
      } catch {
        body = { error: text };
      }
    }
    const message = getApiErrorMessage(body) ?? text;
    throw new ApiError(response.status, body, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = (await response.json()) as T;
  if (method === "POST" && endpoint === "/attempts") {
    saveAttemptHandoff(body);
    return compactAttemptForLocalStorage(body);
  }
  return body;
}
