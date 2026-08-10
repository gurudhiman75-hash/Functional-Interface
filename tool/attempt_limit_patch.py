from pathlib import Path


def replace_once(path_str: str, old: str, new: str) -> None:
    path = Path(path_str)
    text = path.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{path_str}: expected one occurrence, found {count}: {old[:100]!r}')
    path.write_text(text.replace(old, new, 1))

lib = 'artifacts/api-server/src/lib/attempt-reliability.ts'
replace_once(
    lib,
    '''function numberMap(value: unknown, maximumEntries: number, minimum: number, maximum: number): Record<string, number> {
  const input = asRecord(value);
  return Object.fromEntries(
    Object.entries(input)
      .slice(0, maximumEntries)
      .map(([key, raw]) => [key.slice(0, 160), finiteInteger(raw, minimum, maximum)]),
  );
}
''',
    '''function numberMap(value: unknown, maximumEntries: number, minimum: number, maximum: number): Record<string, number> {
  const input = asRecord(value);
  return Object.fromEntries(
    Object.entries(input)
      .slice(0, maximumEntries)
      .map(([key, raw]) => [key.slice(0, 160), finiteInteger(raw, minimum, maximum)]),
  );
}

export function resolveAttemptLimit(settings: unknown, fallback = 99): number {
  const input = asRecord(settings);
  const parsed = Number(input.maxAttempts ?? input.max_attempts);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, 999);
}
''',
)

route = 'artifacts/api-server/src/routes/attempt-reliability.ts'
replace_once(
    route,
    '''  createAttemptSessionSnapshot,
  readAttemptSessionSnapshot,
  type AttemptSessionSnapshot,
''',
    '''  createAttemptSessionSnapshot,
  readAttemptSessionSnapshot,
  resolveAttemptLimit,
  type AttemptSessionSnapshot,
''',
)
replace_once(
    route,
    '''      version.title,
      version.duration_seconds AS "durationSeconds",
      publication.id::text AS "publicationId",
''',
    '''      version.title,
      version.duration_seconds AS "durationSeconds",
      version.settings,
      publication.id::text AS "publicationId",
''',
)
replace_once(
    route,
    '''      const attemptNumber = Number(sequenceRows[0]?.attemptNumber ?? 1);
      const snapshot = createAttemptSessionSnapshot({ testId, testVersionId, seriesId });
''',
    '''      const attemptNumber = Number(sequenceRows[0]?.attemptNumber ?? 1);
      const maxAttempts = resolveAttemptLimit(publication.settings);
      if (attemptNumber > maxAttempts) {
        throw new AttemptReliabilityError(
          "ATTEMPT_LIMIT_REACHED",
          `You have reached the ${maxAttempts}-attempt limit for this test`,
          409,
          { maxAttempts },
        );
      }
      const snapshot = createAttemptSessionSnapshot({ testId, testVersionId, seriesId });
''',
)
replace_once(
    route,
    '''  } catch (error) {
    console.error("Unable to start canonical attempt session", error);
    res.status(500).json({ error: "Unable to start this test safely", code: "ATTEMPT_SESSION_START_FAILED" });
  }
});
''',
    '''  } catch (error) {
    if (error instanceof AttemptReliabilityError) {
      const details = error.details && typeof error.details === "object" && !Array.isArray(error.details)
        ? error.details as Record<string, unknown>
        : {};
      res.status(error.statusCode).json({ error: error.message, code: error.code, ...details });
      return;
    }
    console.error("Unable to start canonical attempt session", error);
    res.status(500).json({ error: "Unable to start this test safely", code: "ATTEMPT_SESSION_START_FAILED" });
  }
});
''',
)

runner = 'artifacts/api-server/src/routes/published-test-runner.ts'
replace_once(
    runner,
    '''import { AttemptReliabilityError } from "../lib/attempt-reliability";
''',
    '''import { AttemptReliabilityError, resolveAttemptLimit } from "../lib/attempt-reliability";
''',
)
replace_once(
    runner,
    '''      attempts: 0, avgScore: 0, difficulty,
      sectionTimingMode: sectionTimings.length > 0 ? "fixed" : "none", sectionTimings,
''',
    '''      attempts: 0, avgScore: 0, difficulty,
      maxAttempts: resolveAttemptLimit(test.settings),
      sectionTimingMode: sectionTimings.length > 0 ? "fixed" : "none", sectionTimings,
''',
)

test_path = 'artifacts/api-server/src/lib/attempt-reliability.test.ts'
replace_once(
    test_path,
    '''  normalizeAttemptDraftState,
  readAttemptSessionSnapshot,
} from "./attempt-reliability";
''',
    '''  normalizeAttemptDraftState,
  readAttemptSessionSnapshot,
  resolveAttemptLimit,
} from "./attempt-reliability";
''',
)
replace_once(
    test_path,
    '''test("new sessions begin at revision zero without draft state", () => {
''',
    '''test("attempt limit resolves from canonical settings with a safe fallback", () => {
  assert.equal(resolveAttemptLimit({ maxAttempts: 3 }), 3);
  assert.equal(resolveAttemptLimit({ max_attempts: 5 }), 5);
  assert.equal(resolveAttemptLimit({ maxAttempts: 0 }), 99);
  assert.equal(resolveAttemptLimit({ maxAttempts: 4000 }), 999);
  assert.equal(resolveAttemptLimit(null), 99);
});

test("new sessions begin at revision zero without draft state", () => {
''',
)
