# Published test runner boundary

Published Neon tests are adapted to the existing student runner through `/api/tests/:id`.
The load payload deliberately contains `correct: -1` and no explanations. The
`/api/attempts` compatibility handler reloads the immutable published version,
scores the submitted option indexes server-side, and returns answer review data
only after submission.

Canonical attempt persistence is a follow-up migration. Until then the existing
student client stores the returned authoritative result locally, matching its
existing offline fallback behavior.
