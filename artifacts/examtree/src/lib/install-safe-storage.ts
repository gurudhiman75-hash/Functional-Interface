import { Storage } from "@/lib/storage";

const originalSet = Storage.set.bind(Storage);

Storage.set = (key: string, value: unknown): void => {
  try {
    originalSet(key, value);
    return;
  } catch (error) {
    console.warn(`Unable to persist local cache key \"${key}\"`, error);
  }

  // Local browser storage is only a convenience cache. A quota/private-mode
  // failure must never turn a successful backend action into an application
  // failure. Free the bulky attempt caches and retry the requested write once.
  try {
    for (const cacheKey of [
      "attempts",
      "question_responses",
      "attempt_records",
      "active_test_sessions",
    ]) {
      if (cacheKey !== key) localStorage.removeItem(cacheKey);
    }
    originalSet(key, value);
  } catch (error) {
    console.warn(`Continuing without local cache key \"${key}\"`, error);
  }
};
