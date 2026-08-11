# SAP-CP-005 — Structural Cancellation English Review Candidate

**Branch:** `feat/sap-cp005-structural-cancellation-foundation`  
**Base:** SAP-CP-004 English candidate `87fbcfab53df2c3143fa092a6e323f6ccf0e3ad2`  
**Current reviewed head:** `ad95c4d91e554f42f35b9303af7c11997e8f547c`  
**Lifecycle:** inactive review candidate / no permanent QL allocation

## Purpose

This checkpoint implements SAP-CP-005 from the frozen scope authority. CP-005 owns cases where recognising a cancellation map, repeated factor/block, bounded telescoping pattern, reciprocal structure or legal factorisation is the intended exam advantage.

The candidate deliberately does **not** activate Question Studio exposure or write any permanent QL registry entry while SAP-CP-004 remains a draft human-review candidate.

## Admitted routine scope — 20 solve modes

### Wave 1 — structural foundation

1. multi-fraction product-chain cancellation;
2. hidden numeric factor extraction followed by cancellation;
3. ratio of products;
4. consecutive-integer product ratios;
5. long factorial ratios;
6. bounded product/reciprocal cancellation chains;
7. numeric difference-of-squares reduction;
8. exact numeric conjugate products;
9. nested reciprocal chains;
10. bounded telescoping sums;
11. bounded telescoping products;
12. products of `1 ± 1/n` patterns;
13. missing factor recoverable from a cancellation state;
14. illegal cancellation across addition/subtraction diagnosis.

Candidate coordinates: `SAP-QL-072..SAP-QL-085`.

### Wave 2 — structural strategy and compression

15. common-factor cancellation before multiplication;
16. repeated common-factor blocks;
17. symmetric fraction-pair expressions;
18. repeated-block compression after legal factor extraction;
19. selecting the best first cancellation step;
20. comparing raw and structurally simplified routes.

Candidate coordinates: `SAP-QL-086..SAP-QL-091`.

## Executable proof

The two generator authorities remain green on the current reviewed head:

```text
SAP-CP-005 foundation authority passed: 1400 deterministic cases across 14 solve modes.
SAP-CP-005 wave-two authority passed: 600 deterministic cases across 6 solve modes.
```

Combined executable proof: **2,000 deterministic packages across 20 solve modes**.

The authorities verify exact rational arithmetic, deterministic generation, independent unsimplified evaluation, option uniqueness/correctness, misconception provenance, payload diversity, cancellation maps and inactive lifecycle safety.

## Editorial remediation

The first generated 300-question review surface exposed defects that structural CI alone could not detect. Those defects were corrected at generator level rather than patched in the export.

Remediation includes:

- family-specific misconception distractors instead of generic `answer ± 1` options;
- removal of impossible zero/negative distractors from positive-valued expressions;
- removal of method-giving stems such as “by extracting the common factor”;
- a hidden-factor construction for `SAP-QL-073` so the cancellation is not given away;
- completion of the final reduction step in ratio-of-products explanations;
- varied symmetric-pair answers in `SAP-QL-088` instead of a constant answer of `1`;
- 20 distinct learner-facing core concepts;
- normal exam-style wording for terse factorial/evaluation stems;
- bounded expression-length guards for reciprocal and telescoping families;
- redesigned `SAP-QL-077` with 36 deterministic short reciprocal-chain fixtures using 4–7 factors.

## 300-question human review candidate

`review-export.ts` now selects:

- **300 unique questions**;
- **20 admitted modes × 15 questions each**;
- exactly **75 correct answers in each A/B/C/D position**;
- no run of three identical answer positions;
- family-specific stem-length limits for long structural expressions.

`review-authority.test.ts` independently checks the displayed hidden-factor and symmetric-pair forms and the redesigned reciprocal chains in addition to the general option/explanation/lifecycle guards.

Current GitHub Actions proof:

```text
SAP-CP-005 editorial review authority passed: 300 unique records, 20 modes,
bounded exam-sized stems, independently verified reciprocal chains,
no impossible negative distractors, distinct core concepts,
balanced A/B/C/D positions.
```

The workflow generates and uploads:

- `SAP-CP-005-300-FULL-ENGLISH-REVIEW.md`;
- `SAP-CP-005-300-FULL-ENGLISH-REVIEW.html`;
- `SAP-CP-005-300-FULL-ENGLISH-REVIEW.json`;
- the authority log.

## Source-saturation decision

The frozen authority qualified numeric partial-fraction telescoping as **source-backed**. Repository and uploaded target-exam references did not establish a recurring SSC/banking routine family for it.

Therefore:

```text
source-backed numeric partial-fraction telescoping -> ADVANCED_HOLD / NOT CURRENTLY ADMITTED
```

See `SOURCE-SATURATION-DECISION.md`. It may be reconsidered only if a later source-gap pass finds recurring, visually verified target-exam evidence.

## Current release gate

CP-005 is now an **English human-review candidate**, not a released checkpoint.

Still required before release:

1. human semantic/exam-readiness approval of the 300-question artifact;
2. CP-004 dependency approval/merge handling;
3. permanent QL allocation for the approved CP-005 set;
4. Question Studio registration and lifecycle activation;
5. final integration/regression proof.

Until those gates are satisfied, `SAP-QL-072..SAP-QL-091` remain candidate coordinates only and every lifecycle object keeps `permanentQlId: null`.