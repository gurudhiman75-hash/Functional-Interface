# BLR-CP-007 — Coded Relation Construction

Status: **permanent identities `BLR-QL-031..BLR-QL-035` discovery-frozen; V3 semantic English review is executable; human approval, release and merge locked**.

## Permanent QLs

- `BLR-QL-031 — SELECT_CODED_EXPRESSION`
- `BLR-QL-032 — COMPLETE_MISSING_CODE_TOKEN`
- `BLR-QL-033 — COMPLETE_ORDERED_CODE_TOKEN_PAIR`
- `BLR-QL-034 — COMPLETE_MISSING_PERSON`
- `BLR-QL-035 — SELECT_CODED_STATEMENT_BY_VALIDITY`

Next available Blood Relations identity: `BLR-QL-036`.

## Current review authority

```text
BLR_CP007_ENGLISH_EDITORIAL_REVIEW_V3
```

V1 graph-solver and QL-ownership evidence remains valid. V2 engineering remediation evidence remains valid, but the V2 learner-facing review is superseded because it still relied heavily on token reskins.

## V3 inventory

```text
168 English review questions
168 semantic scenarios
21 prototype families
8 distinct constructions per prototype
672 option analyses
42 / 42 / 42 / 42 answer positions
504 graph-valid wrong options
0 invalid option graphs
75 / 75 / 18 male / female / neutral targets
126 / 29 / 13 symbol / letter / word keys
32 / 88 / 48 Easy / Medium / Hard
84 standalone and 84 shared-set questions
P / Q / R / S correct 8 times each in QL-034
```

## Student-facing guarantees

- Every code meaning is explicit and every pair is read left to right.
- Every displayed token has one unique relation meaning within its question.
- Eight records in a prototype represent eight semantic constructions, not token-only reskins.
- Male and female target relations are balanced; neutral relations are also covered.
- Every option forms a valid family graph and wrong choices fail for a precise reasoning reason.
- All four QL-034 candidates appear in meaningful clues; absence or repeated-letter matching cannot identify the answer.
- QL-033 states the final kinship target without supplying both local links.
- Difficulty is determined by reasoning depth, inverse use, affinal structure and option work—not token style.
- Student explanations do not expose internal diagnostic labels.
- Validity explanations decode the actual option before applying question polarity.
- Direct diagrams are hidden when unnecessary; multi-link and affinal diagrams remain available.
- Standalone and shared-set delivery contracts are both represented.
- Gender comes only from explicit evidence, never from names or letters.

## V3 files

- `cp007-editorial-v3-model.ts` — V3 review, delivery and telemetry contracts;
- `cp007-editorial-v3-scenarios.ts` — semantic relation and missing-person scenario pools;
- `cp007-editorial-v3-scenario-corrections.ts` — explicit graph-safe scenario corrections;
- `cp007-editorial-v3-endpoint-compatibility.ts` — exact reverse-query authority;
- `cp007-editorial-v3-gender-evidence.ts` — candidate-neutral target-gender evidence;
- `cp007-editorial-v3.ts` — semantic question generation foundation;
- `cp007-editorial-v3-final.ts` — final validity diversification, explanation polish and difficulty calibration;
- `cp007-editorial-v3-final.test.ts` — executable exam-readiness gates;
- `cp007-editorial-v3-authority.test.ts` — ordered authority loader;
- `export-cp007-editorial-v3-review.ts` — JSONL, CSV, HTML and Markdown review exporter;
- `BLR-CP-007-EDITORIAL-V3-PLAN.md` — current V3 authority and lifecycle record.

## Retained baselines

The V1 runtime and V2 editorial-remediation files remain in regression coverage. They retain source, solver and engineering evidence but are not the current student-facing editorial authority.

## Boundary

Pure decoding remains CP-006. Open-ended code induction and Data Sufficiency remain outside CP-007 V1.

Human review of the V3 artifact is the next gate. Only after approval may the chapter-wide English audit be rerun. Hindi/Punjabi localisation, Question Studio, Question Bank, mock tests, publication, staging and merge remain disabled.
