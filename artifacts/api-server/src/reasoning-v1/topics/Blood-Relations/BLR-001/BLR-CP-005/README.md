# BLR-CP-005 — Determinacy, Possibility and Uncertainty

Status: **English discovery frozen at `BLR-QL-018..BLR-QL-025`; Hindi/Punjabi machine-proved review candidates complete; delivery surfaces locked pending human language review**.

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

`BLR-QL-026` remains owned by CP-006. CP-005 localization allocates no new QL identity.

## Frozen English inventory

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

## Multilingual review-candidate boundary

```text
canonical English records                  184
Hindi machine review candidates            184
Punjabi machine review candidates          184
total localized review candidates          368
shared model-space groups                    80
exhaustively enumerated models              432
permanent QLs                                 8
range                           BLR-QL-018..025
localized semantic parity                proved
query specifications preserved           proved
model spaces preserved                   proved
canonical UNKNOWN diagram nodes             584
Hindi residual-English records                0
Punjabi residual-English records              0
target-script gaps                            0
placeholder leaks                             0
localized human language review         required
localized product delivery                locked
```

QL distribution remains exactly:

```text
BLR-QL-018   32
BLR-QL-019   16
BLR-QL-020   48
BLR-QL-021   24
BLR-QL-022   16
BLR-QL-023   16
BLR-QL-024   16
BLR-QL-025   16
```

## Learner-facing guarantees

- no answer may infer gender from a person's name;
- every fixed gender used by the solver has explicit clue evidence;
- deliberately open genders continue to vary across the bounded model space;
- irrelevant unstated genders remain `UNKNOWN`; the 584 canonical unknown-gender diagram-node occurrences are preserved in Hindi and Punjabi;
- truth status (`DEFINITE`, `POSSIBLE`, `IMPOSSIBLE`), query specifications, complete model spaces, model assignments and model fingerprints are unchanged by localization;
- localized per-model audits are regenerated from the frozen semantic model data rather than by translating English audit prose;
- all 184 localized questions per language retain question-specific core concepts, model audits, conclusions, shortcuts, option analyses and family-tree accessibility text;
- all product-delivery surfaces remain locked.

## Files

- `cp005-model.ts` — contracts, model-space domain, truth semantics and diagram model;
- `cp005-scenarios.ts` — bounded source scenarios and 23 discovered prototypes;
- `cp005-gender-evidence.ts` — explicit gender-clue remediation, unknown-gender normalisation and regression audit;
- `cp005-solver.ts` — production all-model solver;
- `cp005-bank.ts` — reviewed permanent question bank and telemetry;
- `cp005-editorial.ts` — exam-grade stems and four-tier English explanations;
- `cp005-editorial-polish.ts` — relation prose and claim-preservation polish;
- `cp005-editorial-remediation.test.ts` — learner-text, diagnostic-code, claim-preservation and gender-evidence gate;
- `cp005-independent-verifier.ts` — diagram-reconstructed independent proof;
- `cp005-runtime.ts` — deterministic QL and shared model-space runtime;
- `cp005-runtime.test.ts` — complete 184-question/432-model regression;
- `cp005-final-freeze.ts` — source, boundary, merge/split, inverse and overlap freeze;
- `cp005-final-freeze.test.ts` — final freeze proof;
- `localization/cp005-language-pack.ts` — Hindi/Punjabi relation, truth-status, count, stem and concept language;
- `localization/cp005-localizer.ts` — semantic model reconstruction and 184 + 184 localized review-candidate runtime;
- `localization/cp005-language-leak-audit.ts` — fail-closed residual-English, target-script and placeholder audit;
- `localization/cp005-localizer.test.ts` — exact query/model/answer/option/fingerprint parity and release-lock proof;
- `localization/cp005-localized-review-runtime.ts` — review telemetry only;
- `.github/workflows/reasoning-blr-001-cp005-localization.yml` — English regression, multilingual proof, admin typecheck and API build gate;
- `export-cp005-final-freeze.ts` — JSONL, CSV, HTML and summary exporter;
- `BLR-CP-005-FINAL-DISCOVERY-FREEZE.md` — authoritative English checkpoint record.

## Release lock

The Hindi/Punjabi records are **machine-proved review candidates, not human-language-approved production variants**. Question Studio visibility, Question Bank eligibility, mock-test eligibility, public publication, production staging and product delivery remain disabled. A later explicit human Hindi/Punjabi review and approval/freeze step is required before any release state may change.
