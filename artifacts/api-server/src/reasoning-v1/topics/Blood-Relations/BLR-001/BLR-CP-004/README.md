# BLR-CP-004 — Counts and Family Composition

Status: **English discovery frozen at `BLR-QL-013..BLR-QL-017`; Hindi/Punjabi machine-proved review candidates complete; delivery surfaces locked pending human language review**.

## Frozen authorities

```text
BLR-QL-013  COUNT_MEMBERS_BY_FILTER
BLR-QL-014  COUNT_RELATIVES_OF_REFERENCE
BLR-QL-015  COUNT_RELATION_PAIRS
BLR-QL-016  COUNT_GENERATIONS
BLR-QL-017  SELECT_FAMILY_COMPOSITION_PROFILE
```

## Executable evidence

- `cp004-model.ts` — permanent contracts and common count model;
- `cp004-bank.ts` — 612-question frozen English bank over 102 family groups;
- `cp004-independent-verifier.ts` and `cp004-verifier.ts` — graph-independent answer recomputation;
- `cp004-runtime.ts` — deterministic QL and grouped-passage generation;
- `cp004-runtime.test.ts` — complete bank, option, lifecycle and verifier proof;
- `cp004-final-freeze.ts` — source, merge/split, inverse and overlap audit;
- `cp004-final-freeze.test.ts` — permanent freeze regression;
- `localization/cp004-language-pack.ts` — deterministic Hindi/Punjabi count, relation, option and explanation language;
- `localization/cp004-localizer.ts` — 612 + 612 localized review-candidate runtime with canonical semantic projection;
- `localization/cp004-language-leak-audit.ts` — fail-closed target-script, residual-English and placeholder audit;
- `localization/cp004-localizer.test.ts` — 1,224-record semantic-parity and release-lock proof;
- `localization/cp004-localized-review-runtime.ts` — review telemetry only;
- `.github/workflows/reasoning-blr-001-cp004-localization.yml` — English regression, multilingual proof, admin typecheck and API build gate;
- `export-cp004-final-freeze.ts` — review artifact exporter;
- `BLR-CP-004-FINAL-DISCOVERY-FREEZE.md` — final English checkpoint record;
- `../BLR-001-MANIFEST-AMENDMENT-CP004.md` — permanent sequential identity allocation.

## Multilingual review-candidate boundary

```text
canonical English records                  612
Hindi machine review candidates            612
Punjabi machine review candidates          612
total localized review candidates         1224
shared-passage groups                      102
permanent QLs                                5
range                           BLR-QL-013..017
localized semantic parity               proved
Hindi residual-English records               0
Punjabi residual-English records             0
target-script gaps                           0
placeholder leaks                            0
explicit zero-answer cases                   1
localized human language review       required
localized product delivery               locked
```

The localized candidates preserve permanent QL ownership, source identity, answer objects, counted member/pair identities, option semantic keys, correct answer positions, family-tree semantics and canonical semantic fingerprints. Hindi/Punjabi learner text is machine-proved but **not human-language-approved**.

The chapter index and QL allocation remain unchanged. `BLR-QL-018` is owned by CP-005; CP-004 does not allocate any new QL for localization.

Question Studio visibility, Question Bank eligibility, mock-test eligibility, public publication and production staging remain disabled for these localized review candidates. Product delivery may only be unlocked by a later explicit human Hindi/Punjabi review and approval/freeze step.
