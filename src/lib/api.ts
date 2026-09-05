import { getSessionUser } from "@/lib/session-user";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "/api";

const ATTEMPT_HANDOFF_PREFIX = "examtree.attempt.handoff.";
const ATTEMPT_STORAGE_PROBE = "examtree.attempt.storage-probe";
const ACTIVE_TEST_SESSIONS_KEY = "active_test_sessions";
const ATTEMPT_HANDLE_PREFIX = "examtree.canonical-attempt.";

interface CanonicalAttemptHandle {
  attemptId: string;
  testId: string;
  revision: number;
  seriesId: string | null;
  updatedAt: string;
}

interface CanonicalAttemptSessionResponse {
  id: string;
  testId: string;
  revision: number;
  seriesId: string | null;
  updatedAt: string;
  state: Record<string, unknown> | null;
}

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
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
  return {
    ...value,
    questionReview: undefined,
  } as T;
}

function reserveLocalAttemptStorage(value: unknown): void {
  if (typeof window === "undefined") return;

  const serialized = JSON.stringify(value);
  try {
    window.localStorage.setItem(ATTEMPT_STORAGE_PROBE, serialized);
    window.localStorage.removeItem(ATTEMPT_STORAGE_PROBE);
    return;
  } catch {
    // Local result history is only a convenience cache. Canonical attempts are
    // authoritative on the server and the full just-submitted result is already
    // in sessionStorage, so stale local history may be trimmed safely.
  }

  try {
    const rawAttempts = window.localStorage.getItem("attempts");
    const attempts = rawAttempts ? JSON.parse(rawAttempts) : [];
    if (Array.isArray(attempts)) {
      window.localStorage.setItem("attempts", JSON.stringify(attempts.slice(0, 10)));
    }
    window.localStorage.setItem(ATTEMPT_STORAGE_PROBE, serialized);
    window.localStorage.removeItem(ATTEMPT_STORAGE_PROBE);
    return;
  } catch {
    // Continue to the stronger cleanup below.
  }

  try {
    window.localStorage.removeItem("attempts");
    window.localStorage.removeItem("question_responses");
    window.localStorage.removeItem("attempt_records");
    window.localStorage.removeItem(ACTIVE_TEST_SESSIONS_KEY);
    window.localStorage.removeItem(ATTEMPT_STORAGE_PROBE);
  } catch {
    // Storage can be disabled entirely in some browsers. The server/session
    // result path must still continue, so local cleanup is best-effort only.
  }
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

function requestMayNeedFirebaseAuth(): boolean {
  if (getSessionUser()) return true;
  if (typeof window === "undefined") return false;
  // The first canonical profile request after Firebase login happens before
  // setUser() writes the lightweight local session marker. Limit this exception
  // to login routes so anonymous acquisition/catalog requests remain Firebase-free.
  return window.location.pathname === "/login" || window.location.pathname.startsWith("/login/");
}

async function getAuthHeader(): Promise<Record<string, string>> {
  if (!requestMayNeedFirebaseAuth()) return {};

  const { getFirebaseAuth } = await import("@/lib/firebase");
  const currentUser = getFirebaseAuth()?.currentUser;
  if (!currentUser) return {};

  try {
    const token = await currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

function currentSeriesId(): string | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("seriesId")?.trim();
  return value || null;
}

function handleStorageKey(testId: string): string {
  return `${ATTEMPT_HANDLE_PREFIX}${testId}`;
}

function readCanonicalAttemptHandle(testId: string): CanonicalAttemptHandle | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(handleStorageKey(testId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed) || typeof parsed.attemptId !== "string") return null;
    return {
      attemptId: parsed.attemptId,
      testId,
      revision: Math.max(0, Number(parsed.revision ?? 0)),
      seriesId: typeof parsed.seriesId === "string" ? parsed.seriesId : null,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function writeCanonicalAttemptHandle(handle: CanonicalAttemptHandle): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(handleStorageKey(handle.testId), JSON.stringify(handle));
}

export function hasCanonicalAttemptSession(testId: string): boolean {
  return readCanonicalAttemptHandle(testId) != null;
}

export function clearAllCanonicalAttemptSessions(): void {
  if (typeof window === "undefined") return;
  for (let index = window.sessionStorage.length - 1; index >= 0; index -= 1) {
    const key = window.sessionStorage.key(index);
    if (key?.startsWith(ATTEMPT_HANDLE_PREFIX)) window.sessionStorage.removeItem(key);
  }
}

function readLocalDrafts(): Record<string, Record<string, unknown>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ACTIVE_TEST_SESSIONS_KEY);
    const parsed = raw ? JSON.parse(raw) as unknown : {};
    return isRecord(parsed) ? parsed as Record<string, Record<string, unknown>> : {};
  } catch {
    return {};
  }
}

function writeLocalDraft(testId: string, state: Record<string, unknown> | null): void {
  if (typeof window === "undefined") return;
  const drafts = readLocalDrafts();
  if (state) drafts[testId] = state;
  else delete drafts[testId];
  window.localStorage.setItem(ACTIVE_TEST_SESSIONS_KEY, JSON.stringify(drafts));
}

async function performJsonRequest<T>(endpoint: string, options?: RequestInit): Promise<{ body: T; status: number }> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
      ...(options?.headers as Record<string, string> | undefined),
    },
  });
  const text = response.status === 204 ? "" : await response.text().catch(() => "");
  let body: unknown = undefined;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = { error: text };
    }
  }
  if (!response.ok) {
    throw new ApiError(response.status, body, getApiErrorMessage(body) ?? text);
  }
  return { body: body as T, status: response.status };
}

const pendingDrafts = new Map<string, Record<string, unknown>>();
const draftTimers = new Map<string, ReturnType<typeof setTimeout>>();
const draftRequests = new Set<string>();

function scheduleDraftFlush(testId: string, delay: number): void {
  const existing = draftTimers.get(testId);
  if (existing) clearTimeout(existing);
  draftTimers.set(testId, setTimeout(() => {
    draftTimers.delete(testId);
    void flushCanonicalAttemptDraft(testId);
  }, delay));
}

async function flushCanonicalAttemptDraft(testId: string): Promise<void> {
  if (draftRequests.has(testId)) return;
  const state = pendingDrafts.get(testId);
  const handle = readCanonicalAttemptHandle(testId);
  if (!state || !handle) return;
  pendingDrafts.delete(testId);
  draftRequests.add(testId);

  try {
    const { body } = await performJsonRequest<CanonicalAttemptSessionResponse>(
      `/attempt-sessions/${encodeURIComponent(handle.attemptId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ expectedRevision: handle.revision, state }),
      },
    );
    writeCanonicalAttemptHandle({
      attemptId: body.id,
      testId: body.testId,
      revision: body.revision,
      seriesId: body.seriesId,
      updatedAt: body.updatedAt,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 409 && isRecord(error.body)) {
      const session = error.body.session;
      if (isRecord(session) && typeof session.id === "string" && typeof session.testId === "string") {
        writeCanonicalAttemptHandle({
          attemptId: session.id,
          testId: session.testId,
          revision: Math.max(0, Number(session.revision ?? 0)),
          seriesId: typeof session.seriesId === "string" ? session.seriesId : null,
          updatedAt: typeof session.updatedAt === "string" ? session.updatedAt : new Date().toISOString(),
        });
        writeLocalDraft(testId, isRecord(session.state) ? session.state : null);
        if (typeof window !== "undefined") {
          window.alert("This test was updated in another tab or device. The latest saved progress will now be loaded.");
          window.location.reload();
        }
        return;
      }
    }
    console.warn("Attempt progress is saved locally and will be retried", error);
    if (!pendingDrafts.has(testId)) pendingDrafts.set(testId, state);
    scheduleDraftFlush(testId, 5_000);
  } finally {
    draftRequests.delete(testId);
    if (pendingDrafts.has(testId) && !draftTimers.has(testId)) scheduleDraftFlush(testId, 150);
  }
}

export function queueCanonicalAttemptDraft(state: unknown): void {
  if (!isRecord(state) || typeof state.testId !== "string") return;
  if (!readCanonicalAttemptHandle(state.testId)) return;
  pendingDrafts.set(state.testId, state);
  scheduleDraftFlush(state.testId, 900);
}

function hydrateCanonicalDraft(session: CanonicalAttemptSessionResponse): void {
  const local = readLocalDrafts()[session.testId];
  const server = isRecord(session.state) ? session.state : null;
  const localUpdatedAt = Number(local?.updatedAt ?? 0);
  const serverUpdatedAt = Number(server?.updatedAt ?? 0);

  if (local && localUpdatedAt > serverUpdatedAt) {
    queueCanonicalAttemptDraft(local);
    return;
  }
  if (server) writeLocalDraft(session.testId, server);
}

async function establishCanonicalAttemptSession(testId: string): Promise<void> {
  const { body } = await performJsonRequest<CanonicalAttemptSessionResponse>("/attempt-sessions", {
    method: "POST",
    body: JSON.stringify({ testId, seriesId: currentSeriesId() }),
  });
  writeCanonicalAttemptHandle({
    attemptId: body.id,
    testId: body.testId,
    revision: body.revision,
    seriesId: body.seriesId,
    updatedAt: body.updatedAt,
  });
  hydrateCanonicalDraft(body);
}

function completeCanonicalAttempt(testId: string): void {
  if (typeof window === "undefined") return;
  pendingDrafts.delete(testId);
  const timer = draftTimers.get(testId);
  if (timer) clearTimeout(timer);
  draftTimers.delete(testId);
  window.sessionStorage.removeItem(handleStorageKey(testId));
  writeLocalDraft(testId, null);
}

function applySeriesContext(endpoint: string, method: string, options?: RequestInit): {
  endpoint: string;
  options?: RequestInit;
} {
  const seriesId = currentSeriesId();
  if (!seriesId) return { endpoint, options };

  if (method === "GET" && /^\/tests\/[^/?#]+$/.test(endpoint)) {
    const separator = endpoint.includes("?") ? "&" : "?";
    return {
      endpoint: `${endpoint}${separator}seriesId=${encodeURIComponent(seriesId)}`,
      options,
    };
  }

  if (method === "POST" && endpoint === "/attempts" && typeof options?.body === "string") {
    try {
      const parsed = JSON.parse(options.body) as unknown;
      if (isRecord(parsed) && typeof parsed.seriesId !== "string") {
        return {
          endpoint,
          options: {
            ...options,
            body: JSON.stringify({ ...parsed, seriesId }),
          },
        };
      }
    } catch {
      // Preserve the original body; the API will return its normal validation error.
    }
  }

  return { endpoint, options };
}

function applyAttemptContext(endpoint: string, method: string, options?: RequestInit): RequestInit | undefined {
  if (method !== "POST" || endpoint !== "/attempts" || typeof options?.body !== "string") return options;
  try {
    const parsed = JSON.parse(options.body) as unknown;
    if (!isRecord(parsed) || typeof parsed.testId !== "string") return options;
    const handle = readCanonicalAttemptHandle(parsed.testId);
    if (!handle || typeof parsed.attemptId === "string") return options;
    return {
      ...options,
      body: JSON.stringify({ ...parsed, attemptId: handle.attemptId }),
    };
  } catch {
    return options;
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

  const contextual = applySeriesContext(endpoint, method, options);
  const finalOptions = applyAttemptContext(endpoint, method, contextual.options);
  const { body } = await performJsonRequest<T>(contextual.endpoint, finalOptions);

  if (method === "GET" && /^\/tests\/[^/?#]+$/.test(endpoint) && isRecord(body) && typeof body.id === "string") {
    await establishCanonicalAttemptSession(body.id);
  }

  if (method === "POST" && endpoint === "/attempts") {
    saveAttemptHandoff(body);
    const compact = compactAttemptForLocalStorage(body);
    reserveLocalAttemptStorage(compact);
    if (typeof finalOptions?.body === "string") {
      try {
        const submitted = JSON.parse(finalOptions.body) as unknown;
        if (isRecord(submitted) && typeof submitted.testId === "string") {
          completeCanonicalAttempt(submitted.testId);
        }
      } catch {
        // The result remains durable even if local cleanup is unavailable.
      }
    }
    return compact;
  }

  return body;
}
