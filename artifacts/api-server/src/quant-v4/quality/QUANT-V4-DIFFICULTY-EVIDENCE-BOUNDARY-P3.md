# Quant V4 Difficulty Evidence Boundary — P3

## Purpose

Quant V4 now has three distinct difficulty concepts. They must remain separate.

## 1. Authored difficulty

This is the pre-publication design label used by generators and Question Studio.

It may guide generation, review and internal balancing, but it is **not empirical evidence** that a historical PYQ or a live learner population experiences the item at that level.

## 2. PYQ/source empirical difficulty

Authority: the provenance-safe PYQ observation fields introduced by the empirical difficulty evidence checkpoint.

A historical exam observation may carry `EASY`, `MEDIUM` or `HARD` only when the label is backed by:

- a source-provided difficulty label; or
- an explicitly ratified rubric;
- plus an auditable evidence reference.

This layer characterizes source evidence before learner telemetry is available.

It must never be filled from generator difficulty or model judgment.

## 3. Learner-performance empirical difficulty

Authority: `QUANT-V4-EMPIRICAL-DIFFICULTY-CALIBRATION-P2`.

This layer is post-attempt evidence scoped by:

- immutable question version;
- explicit Quant exam profile;
- real learner attempts;
- correctness;
- valid response time;
- learner de-duplication;
- optional score/ability context.

The P3 telemetry adapter bridges canonical stored attempt rows into the existing P2 calibration observation format.

## Canonical telemetry bridge

The adapter reads the canonical relationship:

- `learning.attempt_responses`;
- `learning.attempts`;
- `assessment.test_publications`;
- `assessment.tests`;
- `catalog.exam_versions`;
- `catalog.exams`.

It extracts:

- question-version identity;
- learner identity;
- attempt identity;
- immutable REAL/PRACTICE classification from the attempt snapshot;
- correctness;
- response seconds;
- evaluated timestamp;
- attempt score percentage;
- catalog exam code.

The caller must provide the Quant exam profile and the allowed catalog exam codes explicitly. The adapter does not infer a Quant profile from free-text exam names.

## Important separation

Passing one layer must not silently satisfy another.

Examples:

- authored `Hard` does not create PYQ empirical difficulty;
- a source-labelled `Hard` PYQ does not prove live learner difficulty;
- a learner-performance `Hard` candidate does not rewrite the Question Bank automatically;
- neither empirical layer by itself authorizes specialized CP/QL selection weights.

## Current state

- authored difficulty: active throughout Question Studio;
- PYQ/source empirical difficulty schema: available, current specialized CGL observations remain unlabeled;
- learner calibration mathematics: implemented in P2;
- canonical telemetry persistence: implemented;
- canonical telemetry extraction/normalization adapter: implemented by this P3 checkpoint;
- production learner-difficulty policies: not adopted;
- automatic difficulty mutation: disabled.

## Next gate

A real learner-performance calibration run requires:

1. an explicitly adopted exam-profile difficulty policy;
2. an explicit catalog-exam-code to Quant-profile mapping for that run;
3. enough evaluated REAL attempts;
4. a valid profile median-time baseline;
5. review of candidate labels before any content mutation.
