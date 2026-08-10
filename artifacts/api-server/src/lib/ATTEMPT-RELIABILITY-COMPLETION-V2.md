# Canonical Attempt Reliability Completion V2

This change keeps the server authoritative while completing two contracts used by the mobile test runner.

## Per-question timing

`questionTimeSecondsById` is normalized into the canonical attempt-session snapshot. It is bounded, persisted across revisions, and therefore survives server save/resume and device changes before final submission.

## Attempt limits

Published test details expose the configured `maxAttempts` value from immutable version settings, with the existing 99-attempt fallback for tests that do not configure a limit.

When no in-progress attempt exists, `POST /attempt-sessions` calculates the next attempt number and rejects creation when it exceeds the configured limit. Existing in-progress attempts are still resumed first, so the rule cannot block legitimate resume behavior.

The backend remains authoritative even though mobile also disables an obviously exhausted start action for better UX.
