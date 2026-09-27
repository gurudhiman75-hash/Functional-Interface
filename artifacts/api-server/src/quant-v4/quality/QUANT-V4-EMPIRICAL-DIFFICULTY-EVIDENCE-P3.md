# Quant V4 Empirical Difficulty Evidence — P3

**Status:** evidence infrastructure only  
**Selection calibration:** not promoted  
**Novelty:** out of scope

## Purpose

Quant V4 previously treated difficulty calibration as unavailable without a first-class way to record empirical difficulty evidence.

This checkpoint adds a provenance-safe observation contract. It does **not** label existing PYQs as easy, medium or hard.

## Allowed empirical difficulty evidence

A PYQ observation may optionally carry:

- `empiricalDifficulty`: `EASY`, `MEDIUM` or `HARD`;
- `empiricalDifficultyBasis`:
  - `SOURCE_LABEL`; or
  - `RATIFIED_RUBRIC`;
- `difficultyEvidenceRef`: the auditable source/rubric reference supporting that label.

All three fields must be present together.

## Forbidden shortcut

Generator difficulty, chapter difficulty defaults, question-language labels, or model judgment must not be copied into empirical PYQ difficulty.

A generated question being configured as `Hard` does not prove that a historical exam question belongs to the empirical `HARD` bucket.

## Current state

The existing registered SSC CGL Tier-I specialized evidence for:

- AVG-001;
- MAL-001;
- NUM-001;
- TMW-001

contains **no normalized empirical-difficulty labels**.

Calibration readiness therefore reports:

- `difficultyMappedObservationCount = 0`;
- `difficultyMappingCompleteness = 0`;
- `difficultyEvidenceAvailable = false`;
- blocker `DIFFICULTY_EVIDENCE_NOT_NORMALIZED`.

## How the blocker can be cleared

Difficulty may become calibration-usable only after one of two auditable paths exists:

1. the source itself carries a trustworthy difficulty label; or
2. Examtree adopts a documented difficulty rubric and applies it to the PYQ corpus with explicit rubric evidence references.

Until then, package/profile difficulty selection remains uncalibrated.

## Governance

Adding difficulty evidence does not by itself authorize:

- CP/QL selection weights;
- profile-selection promotion;
- simulator frequency mutation;
- test/public lifecycle promotion.

Those remain separate gates.
