# SEA-001 — Seating Arrangement Foundations

Executable discovery implementation plus permanent inactive multilingual freeze layer, governed solely by **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

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
- fingerprint-locked human approval for all 100 reviewed English caselets;
- permanent QL allocation `SEA-QL-001..SEA-QL-020`;
- frozen solve inventory, query mix and approved English presentation;
- approved Hindi/Punjabi explanation-parity review corpora, 100 caselets per language;
- multilingual freeze pinned to the exact reviewed Hindi/Punjabi learner and semantic fingerprints;
- fail-closed delivery locks after multilingual freeze.

Latest editorial hardening includes:

- CP-001 5–8 person support and thirteen reachable query-contract families;
- V3 QC016 statement-true, QC017 statement-false and QC019 odd-pair/group queries;
- question-specific correct-option explanations across all checkpoints;
- value-specific fallback distractor explanations and rejection of fallback person/pair options that reuse a queried participant;
- natural mixed-facing relation wording and visible option uniqueness checks;
- plain teacher-style solution language across shared explanations, answer explanations and option explanations;
- diversified `SEA-PBA-020` conditional-orientation passages combining conditional facing, reference-facing left/right work and physical cyclic placement instead of a near-complete direct clockwise chain;
- PBA-020 displayed clue cap of 9;
- Hindi/Punjabi explanation parity with the approved English teaching path, including case formation, accept/reject decisions, clue order and option-specific misconception rationales.

See:

- `WAVE5-SATURATION-AUDIT-EVIDENCE.md` for automated/source evidence;
- `SEA-001-EDITORIAL-REVIEW-EVIDENCE.md` for the 100-caselet English editorial findings, remediation and approval;
- `review/approved-review.ts` for the fingerprint-locked signed English review record;
- `permanent/registry.ts` for permanent `SEA-QL-001..SEA-QL-020` ownership;
- `permanent/freeze.ts` for solve-inventory, query-mix and English freeze authorities;
- `SEA-001-PERMANENT-ALLOCATION-FREEZE-EVIDENCE.md` for permanent allocation/freeze evidence;
- `localization/readiness.ts` for the historical localization-foundation contract and protected semantic fields;
- `localization/multilingual-freeze.ts` for the approved Hindi/Punjabi freeze wrapper and delivery locks;
- `localization/multilingual-freeze-pins.ts` for immutable approved learner/semantic fingerprints;
- `SEA-001-MULTILINGUAL-FREEZE-EVIDENCE.md` for human approval and executable multilingual-freeze evidence.

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
node --experimental-strip-types sea-001-localization-readiness-proof.test.ts
node --experimental-strip-types sea-001-localized-review-candidate-proof.test.ts
node --experimental-strip-types sea-001-multilingual-freeze-proof.test.ts
```

## Lifecycle state

This package is **permanent, multilingual-frozen and inactive**. Historical discovery/localization generators remain reproducible; permanent ownership and approval are represented by separate fail-closed freeze layers.

```text
Permanent QLs:                 20 (SEA-QL-001..SEA-QL-020)
Next permanent QL:             SEA-QL-021
Signed English review:         APPROVED (100/100 ACCEPT)
Permanent allocation:          APPLIED
Solve-inventory freeze:        FROZEN
Query-mix freeze:              FROZEN
English freeze:                FROZEN
Hindi human review:            APPROVED
Punjabi human review:          APPROVED
Multilingual freeze:           FROZEN
Question Studio registration:  false
Question Bank writes:          false
Mock-test eligibility:         false
Production staging:            false
Public publication:            false
```

The signed English review is content-fingerprint locked. Any change to the reviewed 100-caselet English corpus invalidates the approval and reopens the English gate automatically.

The multilingual freeze is likewise fail-closed. The approved Hindi learner fingerprint is `78ce46895d77871330681d36b5c7929c52dfc9247285abd16fa5c8754de19a28`; the approved Punjabi learner fingerprint is `b8634795ec0e19981aaacc8c9f2a356cfc0a67347c6685fe22c511c85294d81e`; both share semantic fingerprint `d8b60a8d1c61128a71d7abbf7b902f0a7a8fae38473312fa83843c8d29591fe4`. Any learner-text or semantic drift reopens the multilingual gate.

Multilingual freeze does **not** authorize activation. Downstream Question Studio / Question Bank / test / production-staging / public activation remain separate gates. Native runtime diagram support also remains a downstream product-integration concern.

Do not bypass `assertSea001ActivationAllowed`.
