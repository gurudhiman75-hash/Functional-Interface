# Quant V4 Empirical Difficulty Telemetry Bridge — P3

**Authority:** `QUANT-V4-EMPIRICAL-DIFFICULTY-TELEMETRY-BRIDGE-P3`

## Gap closed

Quant V4 already had:

- canonical attempt/response persistence;
- a source-code telemetry guard;
- empirical difficulty calibration math.

What was missing was the normalization bridge between stored test telemetry and `EmpiricalDifficultyObservation[]`.

P3 adds that bridge.

## Canonical extraction surface

The extraction contract joins:

- `learning.attempt_responses`;
- `learning.attempts`;
- `assessment.test_publications`;
- `assessment.tests`;
- `assessment.test_versions`;
- `catalog.exam_versions`;
- `catalog.exams`;
- `catalog.exam_families`.

It returns question-version identity, learner/attempt identity, correctness, per-question seconds, evaluated timestamp, final score, REAL/PRACTICE context, and catalog exam identity.

## Profile resolution remains fail-closed

The repository does not yet contain an authoritative mapping from catalog exam identity to every Quant V4 exam profile.

The bridge therefore requires an explicit resolver and rejects unresolved rows from calibration input.

It must not infer `SSC_CGL_TIER_I`, `BANKING_PRELIMS`, `PUNJAB_STATE`, or any other profile from free-text titles.

## REAL versus PRACTICE

The result snapshot's persisted `attemptType` is authoritative when present.

For older rows where it is absent, the canonical attempt status is used:

- `practice_evaluated` -> PRACTICE;
- `evaluated` -> REAL.

The downstream P2 calibrator already excludes PRACTICE evidence.

## Remaining blocker

The next real integration task is to adopt an explicit catalog-identity -> Quant-profile resolver.

Until then:

- telemetry extraction is available;
- normalization is available;
- calibration math is available;
- production profile-scoped learner calibration remains fail-closed.

No production difficulty thresholds or automatic question difficulty mutations are enabled.
