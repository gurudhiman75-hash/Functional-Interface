# GEO-001 / GEO-QL-021 — approved source-pattern restoration

**Status:** regression remediation; no new localization template or previously unapproved Hindi/Punjabi wording.

## Evidence
The Geometry integration job failed for `GEO-QL-021` because the expanded English source-runtime pool generated a shortened eight-number explanation, but the frozen multilingual V2 authority accepts the previously approved ten-number explanation pattern:

```text
The scale factor from ABC to PQR is PQ/AB = {{0}}/{{1}} = {{2}}/{{3}}. Therefore PR = AC × {{4}}/{{5}} = {{6}} × {{7}}/{{8}} = {{9}} cm.
```

The original approved source commit `aa94efa28a51724f1c0f5416a4d4f9bee9703f19` generated:
```text
The scale factor from ABC to PQR is PQ/AB = 9/6 = 3/2. Therefore PR = AC × 3/2 = 8 × 3/2 = 12 cm.
```

The current generator had shortened that to `PQ/AB = 9/6`, bypassing the simplified ratio line, so Hindi/Punjabi frozen rendering correctly failed closed. The corrected generator restores the approved expression shape and calculates the simplified fraction exactly via the existing rational utility, for all five source-value states. This is an English explanation-renderer correction **toward the originally approved pattern**, not a new translation approval.

## Invariants
- Preserve existing 91 approved localization variants, 75 Geometry QLs, 81 mapped prototype variants, artifact ID/digest, Hindi/Punjabi wording, source checkpoints, solve-mode identities, options and answers.
- Keep full exact V2 template matching; no catch-all translation fallback or loosened verifier.
- Verify mathematical equality of `PQ/AB`, the reduced ratio, and `PR/AC`, including the `10/6 = 5/3` source variant.
- Require green Geometry and universal worker CI with the 3-question `GEO-CP-001` Mixed regression. Do not merge with failing checks.
- Even after merge, rebuilding the universal staging worker as a new zero-traffic revision and verifying live generation are separate release gates. Scheduler and Cloud Tasks remain paused and production is unchanged.
