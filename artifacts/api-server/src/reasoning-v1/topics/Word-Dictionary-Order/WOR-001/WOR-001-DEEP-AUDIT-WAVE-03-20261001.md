# WOR-001 — Deep Audit Wave 03: Difficulty Realism

Date: 2026-10-01

Status: `DIFFICULTY_REALISM_AUDIT_IN_PROGRESS`

## Purpose

Existing WOR-001 tests prove that requested difficulty labels are honored and recomputed from structural features. Wave 03 adds a chapter-level learner-work comparison so the bands cannot differ only by metadata.

## Classic dictionary-order calibration

Across the frozen classic prototypes, the large-sample gate compares:

- mean derived difficulty score;
- visible word count;
- maximum common-prefix depth;
- mean common-prefix depth;
- late-decision frequency;
- share of questions requiring at least one same-first-letter comparison.

Expected ordering:

- Medium > Easy;
- Hard > Medium;

for the principal structural metrics.

Easy is not allowed to collapse into entirely first-letter-only sorting. At least the already-established 18% shared-prefix floor is retained.

## Banking calibration

For CP005:

- Hard mean derived score must exceed Medium;
- the plain-cluster positional authority keeps the intended visible progression:
  - Easy: five distinct first letters;
  - Medium: at least one first-letter tie;
  - Hard: all five groups share the first letter.

This directly checks what the learner sees rather than only the pool labels.

## Boundary

The audit does not force every prototype to support every band. Hard-only advanced common-prefix authorities remain Hard-only, and the deeper Banking composite roots remain Medium/Hard where already frozen.

If this gate passes, no difficulty redesign is justified. If it fails, remediate the generating structure rather than relabeling questions.
