# BLR-CP-007 — Coded Relation Construction

Status: **permanent identities `BLR-QL-031..BLR-QL-035` discovery-frozen; V2 English editorial remediation is an executable human-review candidate; release and merge locked**.

## Permanent QLs

- `BLR-QL-031 — SELECT_CODED_EXPRESSION`
- `BLR-QL-032 — COMPLETE_MISSING_CODE_TOKEN`
- `BLR-QL-033 — COMPLETE_ORDERED_CODE_TOKEN_PAIR`
- `BLR-QL-034 — COMPLETE_MISSING_PERSON`
- `BLR-QL-035 — SELECT_CODED_STATEMENT_BY_VALIDITY`

Next available Blood Relations identity: `BLR-QL-036`.

## Authority status

The V1 graph solver, source discovery and five-Ql ownership remain valid. The V1 learner-facing final-freeze review is superseded and must not be used for manual freeze, localisation or release.

The current review authority is:

```text
BLR_CP007_ENGLISH_EDITORIAL_REVIEW_V2
```

It remains explicitly `HUMAN_REVIEW_REQUIRED`.

## V2 review inventory

```text
168 English review questions
21 source prototypes
5 permanent solve authorities
672 option analyses
168 / 168 unique learner signatures
41 / 45 / 42 / 40 answer positions
504 graph-valid wrong options
0 invalid option graphs
P / Q / R / S correct 8 times each in QL-034
16 incorrect-statement answers with correct polarity
48 valid unselected statements correctly described
```

## Learner-facing guarantees

- Every code meaning is supplied explicitly.
- Symbols and words are never interpreted as arithmetic.
- Every coded pair is read from left to right.
- Seeded option ordering rejects the V1 prototype-local answer cycles.
- Statement validity is stored separately from correctness for the requested task.
- Every wrong option has one exact diagnostic code and question-specific explanation.
- All four options form valid family graphs.
- Missing-person candidates are balanced and checked through the complete graph.
- Semicolon formatting occurs in both correct and wrong options.
- Explanations are selected by reasoning need rather than a forced audit template.
- Diagrams label relation direction, highlight the decisive path and distinguish directly coded from inferred edges.
- Accessibility summaries state the actual relation path and use correct singular/plural grammar.
- Gender comes only from explicit gender-bearing relations, never from a letter or name.
- The chapter uses `FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED`; half-relations remain outside V1.
- Every review card exposes immutable proof metadata and remains marked for human review.

## V2 files

- `cp007-editorial-v2-model.ts` — V2 option, explanation, diagram and review-proof contracts;
- `cp007-editorial-v2.ts` — seeded ordering, precise diagnostics and adaptive explanation foundation;
- `cp007-editorial-v2-review.ts` — hardened review contracts;
- `cp007-editorial-v2-final-review.ts` — natural QL-034 and final learner surface;
- `cp007-editorial-v2-exam-review.ts` — valid-but-wrong distractor reconstruction;
- `cp007-editorial-v2-exam-review-final.ts` — graph-friendly token-key remediation;
- corresponding V2 test files — answer security, polarity, naturalness, length, diagram and graph-valid option gates;
- `export-cp007-editorial-v2-exam-review-final.ts` — current human-review exporter;
- `BLR-CP-007-EDITORIAL-V2-REMEDIATION.md` — remediation and lifecycle authority.

## V1 files retained for solver regression

- `cp007-model.ts`;
- `cp007-prototypes.ts`;
- `cp007-runtime.ts`;
- `cp007-independent-verifier.ts`;
- `cp007-runtime.test.ts`;
- `cp007-final-freeze.ts`;
- `cp007-final-freeze.test.ts`;
- `export-cp007-final-freeze.ts`;
- `BLR-CP-007-FINAL-DISCOVERY-FREEZE.md`.

These retain source and solver evidence, but their learner-facing review output is not the current editorial authority.

## Boundary

Pure decoding remains CP-006. Open-ended code induction, Data Sufficiency, Question Studio, Question Bank, Hindi/Punjabi localisation, mock tests, public publication, production staging and merge remain disabled.

The next required gate is manual review and approval of the V2 English artifact, followed by a new chapter-wide English audit.
