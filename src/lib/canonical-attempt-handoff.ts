import type { TestAttempt } from "@/lib/storage";

const HANDOFF_KEY = "examtree.canonical-attempt.handoff";

export function saveCanonicalAttemptHandoff(attempt: TestAttempt): void {
  sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(attempt));
}

export function readCanonicalAttemptHandoff(testId?: string | null): TestAttempt | null {
  try {
    const raw = sessionStorage.getItem(HANDOFF_KEY);
    if (!raw) return null;
    const attempt = JSON.parse(raw) as TestAttempt;
    if (testId && attempt.testId !== testId) return null;
    return attempt;
  } catch {
    return null;
  }
}

export function clearCanonicalAttemptHandoff(): void {
  sessionStorage.removeItem(HANDOFF_KEY);
}
