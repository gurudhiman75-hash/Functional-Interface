# Canonical attempt reliability release

Date: 2026-07-20

## Delivered boundary

- One authenticated `in_progress` attempt is created or reused per student and published test.
- The existing browser draft remains an offline recovery cache and is mirrored to the canonical attempt with optimistic revisions.
- Stale tabs cannot silently overwrite a newer draft.
- Submission locks and finalises the same canonical attempt row transactionally.
- Concurrent or repeated submissions return the stored result instead of creating duplicates.
- Real and practice completions are stored separately; only real evaluated attempts advance Test Series progression.
- The result page reads the committed result snapshot and no longer calls retired leaderboard, package, daily-challenge or weak-area services.
- Series context is preserved in the result and return journey.

## Database impact

No schema migration is required. The release uses the existing `learning.attempts` lifecycle, timestamps, scores and `result_snapshot` fields.

## Remaining operational verification

- Deploy the merged release to the real Firebase and API environments.
- Smoke-test login, start, refresh/resume, offline retry, concurrent tabs, duplicate submit, result refresh and Test Series unlock.
- Add browser-driven end-to-end coverage for the same journey.
- Add telemetry for repeated draft-sync failures and explicit multi-device takeover controls.
