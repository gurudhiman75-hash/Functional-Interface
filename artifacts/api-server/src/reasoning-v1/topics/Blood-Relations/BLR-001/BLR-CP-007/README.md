# BLR-CP-007 — Coded Relation Construction

Status: **English discovery frozen at `BLR-QL-031..BLR-QL-035`; permanent review runtime available; release and merge locked**.

## Permanent QLs

- `BLR-QL-031 — SELECT_CODED_EXPRESSION`
- `BLR-QL-032 — COMPLETE_MISSING_CODE_TOKEN`
- `BLR-QL-033 — COMPLETE_ORDERED_CODE_TOKEN_PAIR`
- `BLR-QL-034 — COMPLETE_MISSING_PERSON`
- `BLR-QL-035 — SELECT_CODED_STATEMENT_BY_VALIDITY`

Next available Blood Relations identity: `BLR-QL-036`.

## Frozen inventory

```text
168 English review questions
21 source prototypes
21 source topologies
5 permanent solve authorities
296 completed coded assertions
672 diagnostic option analyses
168 / 168 unique learner signatures
42 / 42 / 42 / 42 answer-position balance
```

## Learner-facing guarantees

- Every code meaning is supplied explicitly.
- Symbols and words are never interpreted as arithmetic.
- Every coded pair is read from left to right.
- One-token and two-token blanks preserve exact position and order.
- Missing-person candidates are checked through the complete family graph.
- Validity options are independently decoded before their claims are assessed.
- Every displayed expression matches the structured assertion used by the verifier.
- Gender comes only from explicit gender-bearing relations, never from a letter or name.
- Every question has four options, diagnostic option analysis, a family diagram and ASCII fallback.

## Files

- `cp007-model.ts` — permanent contracts and construction question domain;
- `cp007-prototypes.ts` — 21 discovered source prototypes;
- `cp007-runtime.ts` — deterministic generation, solving and teaching;
- `cp007-independent-verifier.ts` — materially separate graph reconstruction and answer proof;
- `cp007-runtime.test.ts` — complete 168-question regression;
- `cp007-final-freeze.ts` — consolidation and boundary record;
- `cp007-final-freeze.test.ts` — final freeze proof;
- `export-cp007-final-freeze.ts` — JSONL, CSV, HTML and summary exporter;
- `BLR-CP-007-FINAL-DISCOVERY-FREEZE.md` — authoritative checkpoint record.

## Boundary

Pure decoding remains CP-006. Open-ended code induction, Data Sufficiency, Question Studio, Question Bank, Hindi/Punjabi localisation, tests, public publication, production staging and merge remain disabled.
