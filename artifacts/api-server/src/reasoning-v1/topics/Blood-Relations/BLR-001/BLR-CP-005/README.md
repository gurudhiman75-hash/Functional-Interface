# BLR-CP-005 — Determinacy, Possibility and Uncertainty

Status: **English discovery frozen at `BLR-QL-018..BLR-QL-025`; exam-grade editorial remediation applied; review-only runtime available; release and merge locked**.

## Permanent QLs

```text
BLR-QL-018  RESOLVE_INVARIANT_RELATION
BLR-QL-019  RESOLVE_RELATION_UNCERTAINTY
BLR-QL-020  SELECT_CLAIM_BY_MODEL_STATUS
BLR-QL-021  IDENTIFY_PERSON_BY_MODEL_STATUS
BLR-QL-022  RESOLVE_PERSON_IDENTITY_UNCERTAINTY
BLR-QL-023  DETERMINE_COUNT_BOUND
BLR-QL-024  SELECT_COUNT_BY_MODEL_STATUS
BLR-QL-025  RESOLVE_COUNT_DETERMINACY
```

Next available Blood Relations identity: `BLR-QL-026`.

## Runtime inventory

```text
184 English review questions
80 shared model-space groups
10 source scenarios
10 model-space topologies
23 source prototypes
8 permanent solve authorities
432 exhaustively enumerated family models
184 / 184 unique learner-item signatures
```

## Editorial standard

Every frozen question now contains:

- a clean exam-style prompt and stem without learner-facing meta-spoonfeeding;
- a QL-specific multi-model core concept;
- an explicit audit line for every valid family model;
- an aggregate outcome, identity-status or attainable-count audit;
- a five-second exam shortcut;
- four option-specific explanations ending in bracketed diagnostic misconception codes;
- one family-tree diagram per valid model, with ASCII fallback.

The editorial remediation does not change graph logic, answer semantics, permanent QL ownership or release locks. See `BLR-CP-005-EDITORIAL-REMEDIATION.md`.

## Files

- `cp005-model.ts` — contracts, model-space domain, truth semantics and diagram model;
- `cp005-scenarios.ts` — bounded source scenarios and 23 discovered prototypes;
- `cp005-solver.ts` — production all-model solver;
- `cp005-options.ts` — deterministic option construction;
- `cp005-editorial.ts` — exam-grade prompt, stem and four-tier explanation renderer;
- `cp005-bank.ts` — reviewed permanent question bank and telemetry;
- `cp005-independent-verifier.ts` — diagram-reconstructed independent proof;
- `cp005-runtime.ts` — deterministic QL and shared model-space runtime;
- `cp005-runtime.test.ts` — complete 184-question/432-model regression;
- `cp005-editorial-remediation.test.ts` — learner-text and explanation-quality gate;
- `cp005-final-freeze.ts` — source, boundary, merge/split, inverse and overlap freeze;
- `cp005-final-freeze.test.ts` — final freeze proof;
- `export-cp005-final-freeze.ts` — JSONL, CSV, HTML and summary exporter;
- `BLR-CP-005-FINAL-DISCOVERY-FREEZE.md` — authoritative checkpoint record;
- `BLR-CP-005-EDITORIAL-REMEDIATION.md` — owner-suite audit and canonical mapping record.

## Release lock

Question Studio, Question Bank, mock tests, Hindi/Punjabi localisation, public publication, production staging and merge remain disabled.
