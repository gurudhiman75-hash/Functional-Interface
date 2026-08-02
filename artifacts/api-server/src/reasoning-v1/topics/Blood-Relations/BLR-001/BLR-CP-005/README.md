# BLR-CP-005 — Determinacy, Possibility and Uncertainty

Status: **English discovery frozen at `BLR-QL-018..BLR-QL-025`; review-only runtime available; exam-grade editorial and explicit-gender-evidence remediation complete; release and merge locked**.

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

## Learner-facing guarantees

- no answer may infer gender from a person's name;
- every fixed gender used by the solver has an explicit clue such as husband, wife, brother, sister, father, mother, son, daughter, man or woman;
- deliberately open genders vary across the bounded model space;
- irrelevant unstated genders are stored and rendered as `UNKNOWN`;
- all 184 questions retain exam-grade stems and complete four-tier explanations;
- all 736 option analyses retain diagnostic misconception codes;
- all 432 family models retain SVG-compatible diagrams and ASCII fallbacks.

## Files

- `cp005-model.ts` — contracts, model-space domain, truth semantics and diagram model;
- `cp005-scenarios.ts` — bounded source scenarios and 23 discovered prototypes;
- `cp005-gender-evidence.ts` — explicit gender-clue remediation, unknown-gender normalisation and regression audit;
- `cp005-solver.ts` — production all-model solver;
- `cp005-bank.ts` — reviewed permanent question bank and telemetry;
- `cp005-editorial.ts` — exam-grade stems and four-tier explanations;
- `cp005-editorial-polish.ts` — relation prose and claim-preservation polish;
- `cp005-editorial-remediation.test.ts` — learner-text, diagnostic-code, claim-preservation and gender-evidence gate;
- `cp005-independent-verifier.ts` — diagram-reconstructed independent proof;
- `cp005-runtime.ts` — deterministic QL and shared model-space runtime;
- `cp005-runtime.test.ts` — complete 184-question/432-model regression;
- `cp005-final-freeze.ts` — source, boundary, merge/split, inverse and overlap freeze;
- `cp005-final-freeze.test.ts` — final freeze proof;
- `export-cp005-final-freeze.ts` — JSONL, CSV, HTML and summary exporter;
- `BLR-CP-005-FINAL-DISCOVERY-FREEZE.md` — authoritative checkpoint record.

## Release lock

Question Studio, Question Bank, mock tests, Hindi/Punjabi localisation, public publication, production staging and merge remain disabled.
