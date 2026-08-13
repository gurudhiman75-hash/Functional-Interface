# SEA-001 — Seating Arrangement Foundations

Executable discovery implementation plus permanent inactive freeze layer, governed solely by **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

## Implemented checkpoints

All five foundational checkpoints are executable:

- `SEA-CP-001` — single row, same facing;
- `SEA-CP-002` — single row, mixed facing;
- `SEA-CP-003` — circular, facing centre;
- `SEA-CP-004` — circular, facing outward;
- `SEA-CP-005` — circular, mixed facing.

All named authorities `SEA-PBA-001` through `SEA-PBA-020` are reachable and retained as separate solve authorities.

## Current exam-readiness state

The current package includes:

- production solver plus independently structured oracle checks;
- unique solution state/class enforcement;
- displayed-clue necessity checks;
- rotational canonicalisation where applicable;
- misconception-derived options and counterfactual checks;
- student-facing teaching explanations;
- source-coverage, merge/split, inverse and gap audits;
- a balanced 100-caselet English review corpus;
- fingerprint-locked human approval for all 100 reviewed caselets;
- permanent QL allocation `SEA-QL-001..SEA-QL-020`;
- frozen solve inventory, query mix and approved English presentation.

Latest editorial hardening includes:

- CP-001 5–8 person support and thirteen reachable query-contract families;
- V3 QC016 statement-true, QC017 statement-false and QC019 odd-pair/group queries;
- question-specific correct-option explanations across all checkpoints;
- value-specific fallback distractor explanations and rejection of fallback person/pair options that reuse a queried participant;
- natural mixed-facing relation wording and visible option uniqueness checks;
- plain teacher-style solution language across shared explanations, answer explanations and option explanations;
- diversified `SEA-PBA-020` conditional-orientation passages combining conditional facing, reference-facing left/right work and physical cyclic placement instead of a near-complete direct clockwise chain;
- PBA-020 displayed clue cap of 9.

See:

- `WAVE5-SATURATION-AUDIT-EVIDENCE.md` for automated/source evidence;
- `SEA-001-EDITORIAL-REVIEW-EVIDENCE.md` for the 100-caselet editorial findings, remediation and human approval status;
- `review/approved-review.ts` for the fingerprint-locked signed review record;
- `permanent/registry.ts` for permanent `SEA-QL-001..SEA-QL-020` ownership;
- `permanent/freeze.ts` for the solve-inventory, query-mix and English freeze authorities;
- `SEA-001-PERMANENT-ALLOCATION-FREEZE-EVIDENCE.md` for the permanent allocation/freeze evidence.

## Run proofs

```bash
node --experimental-strip-types foundation-proof.test.ts
node --experimental-strip-types cp002-proof.test.ts
node --experimental-strip-types cp003-proof.test.ts
node --experimental-strip-types cp004-proof.test.ts
node --experimental-strip-types cp005-proof.test.ts
node --experimental-strip-types wave4-verification-proof.test.ts
node --experimental-strip-types sea-001-saturation-proof.test.ts
node --experimental-strip-types sea-001-authority-audit-proof.test.ts
node --experimental-strip-types sea-001-review-readiness-proof.test.ts
node --experimental-strip-types sea-001-permanent-allocation-freeze-proof.test.ts
```

## Lifecycle state

This package is **permanent but inactive**. Historical discovery generators remain unchanged so their approved evidence stays reproducible; permanent ownership/freeze is represented by the separate permanent layer.

```text
Permanent QLs:                 20 (SEA-QL-001..SEA-QL-020)
Next permanent QL:             SEA-QL-021
Signed English review:         APPROVED (100/100 ACCEPT)
Permanent allocation:          APPLIED
Solve-inventory freeze:        FROZEN
Query-mix freeze:              FROZEN
English freeze:                FROZEN
Localization:                  NOT_STARTED
Question Studio registration:  false
Question Bank writes:          false
Mock-test eligibility:         false
Public publication:            false
```

The signed review is content-fingerprint locked. Any change to the reviewed 100-caselet corpus invalidates the approval and reopens the review gate automatically.

Permanent allocation and the English freeze do **not** authorize activation. Localization and downstream Question Studio / Question Bank / test / public activation remain separate gates.

Do not bypass `assertSea001ActivationAllowed`.
