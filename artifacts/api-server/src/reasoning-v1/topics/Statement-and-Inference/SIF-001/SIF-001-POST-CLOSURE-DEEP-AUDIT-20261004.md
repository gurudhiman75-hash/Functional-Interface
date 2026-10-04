# SIF-001 — Post-Closure Deep Audit

Status: **CLOSED — POST-CLOSURE ANSWER-INTEGRITY REMEDIATION COMPLETE**

Date: 2026-10-04

Supersedes as current-head authority:
`SIF-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md`

The September closure remains part of the historical audit trail. This document records defects found only when the already-frozen chapter was re-audited against candidate identity, answer-key independence, Banking difficulty fidelity and full presentation-order behavior.

## Scope

This pass re-audited the already-implemented Statement & Inference chapter:

- chapter: `SIF-001`
- CPs: `SIF-CP001..SIF-CP017`
- frozen semantic authority inventory: **630**
- locales: English / Hindi / Punjabi
- conventional novelty expansion: **not reopened**
- Matrix/Games/Tournament: **out of scope**
- learner release: **not authorized**

No permanent CP was added.

## Material defects found

### 1. Candidate storage order could disagree with displayed Inference I / II

The generator previously rendered:

`authority.candidates[0]` as Inference I and `authority.candidates[1]` as Inference II.

However, answer solving searched candidates by their semantic IDs `I` and `II`.

The frozen inventory contains **14 authorities stored physically as [II, I]**.

That meant a stored reversed-order authority could display the semantic II text in the learner's Inference I position while the keyed answer was still calculated from semantic candidate IDs.

This was an answer-integrity defect.

Remediation:

- candidate identity is now canonicalized by explicit `I` / `II` IDs before rendering;
- seeded presentation swapping occurs only after canonicalization;
- the approved V1 seed-parity presentation scheduler is preserved, so frozen review-pack balance remains unchanged;
- the direct renderer is tested in both presentation orders without changing production review scheduling.

### 2. The old solver trusted authored `follows` metadata

The previous solver returned the answer directly from candidate `follows` booleans, with EITHER additionally recognized from an authority-ID suffix.

That made authored answer metadata effectively the answer key.

Remediation authority:

`SIF_STRENGTH_BACKED_SUPPORT_V2_2026_10_04`

Ordinary candidate support is now independently derived from candidate strength:

- `CERTAIN` -> supported
- `STRONGLY_SUPPORTED` -> supported
- `POSSIBLE_ONLY` -> not established
- `UNSUPPORTED_OR_CONTRADICTED` -> not established

Legacy `follows` remains as redundant metadata and must agree with the strength-backed proof. A disagreement fails closed.

EITHER remains a controlled special semantic state, but it now requires both candidates to be `POSSIBLE_ONLY` and neither candidate to be individually marked certain.

### 3. Frozen explanations contained semantic I / II contradictions

The post-closure audit found concrete frozen explanations where the prose named the wrong inference even though the underlying candidate support state was correct.

Confirmed repaired examples included:

- `SIF-CP012-BANK-QUEUE`
- `SIF-CP014-PARTS-DELIVERY`
- `SIF-CP012-RAIL-REFUND`
- `SIF-CP012-MEDICINE-STOCK`
- `SIF-CP013-REGIONAL-TRAINING`
- `SIF-CP014-COURSE-ENROLMENT`

Examples of the defect class included statements equivalent to:

- “II does not follow. Only II follows.”
- calling I supported when the frozen supported candidate was II;
- rejecting II while also declaring Only II.

A chapter-wide explanation/answer consistency guard now rejects explicit contradictions in English, Hindi and Punjabi.

### 4. Banking three-inference difficulty filtering was not honored

The Question Studio Banking route accepted a requested difficulty but the three-inference generator selected from all five curated overlays.

Therefore a Hard request could silently produce a Medium authority.

Remediation:

- Banking three-inference authorities can now be filtered by `SifDifficulty`;
- Question Studio forwards the requested difficulty to the Banking generator;
- the requested count cannot exceed the number of distinct eligible Banking authorities;
- requesting a difficulty with no curated authority fails closed instead of silently substituting another difficulty.

### 5. Hindi/Punjabi Banking combination option grammar

Two-inference subsets in the Banking three-inference profile previously joined Hindi/Punjabi Roman labels with commas.

They now use natural conjunctions:

- Hindi: `I और II`
- Punjabi: `I ਅਤੇ II`

### 6. Pre-existing strict TypeScript defect in CP015–017 helper

The CP015–017 authority builder already used `r.explanation ?? fallback`, but the row type incorrectly required `explanation`.

Wave-2 authorities intentionally relying on the fallback therefore failed strict TypeScript compilation once this post-closure audit expanded the compile gate.

The type now reflects the actual design: `explanation?`.

## Preserved architecture

The audit deliberately did **not** reopen semantic breadth merely because the chapter was being revisited.

Still preserved:

- **17 CPs**
- **630 frozen authorities**
- all existing target-exam semantic mechanisms
- existing difficulty distributions
- controlled distractor provenance
- original Question Studio review-only package
- five curated Banking three-inference overlays
- approved V1 review-pack scenario selection and answer-position balance
- novelty deferred to the cross-chapter novelty pass

## Post-closure executable gate

New gate:

`sif-001-post-closure-audit-20261004.test.ts`

It verifies the entire frozen chapter:

`630 authorities × 3 locales × 2 direct presentation orders = 3,780 learner surfaces`

The gate proves:

- every authority passes the hardened structural validator;
- every explanation passes answer-consistency validation;
- candidate display order is derived from candidate IDs rather than raw array position;
- historically reversed storage is covered;
- both direct presentation orders are keyed correctly where presentation swapping is allowed;
- answer class and correct option index remain aligned after presentation swapping;
- strength-backed proof metadata is active;
- mutating legacy `follows` alone cannot silently alter the answer;
- Question Bank/test/mock/public release locks remain closed.

Current semantic digest:

`7b20ff4a660a10a1d8bb13bbd441ed30823a0adba4b3d9acd1798c5f6d7ff47b`

Audit observations:

- frozen authority count: **630**
- locales: **3**
- rendered post-closure surfaces: **3,780**
- historically reversed stored candidate orders: **14**
- non-CP002 authorities proved in both direct display orders: **580**

## Existing deep-audit gates preserved

All previous gates still pass:

### Wave 1

`17 CPs × 3 locales × 12 seeds = 612 learner surfaces`

Checks learner-surface hygiene, lifecycle locks, answer-code validity, non-trivial text, variation and no internal audit leakage.

### Wave 2

All **630 authorities** audited for:

- difficulty calibration
- controlled distractor provenance
- evidence anchors
- explanation specificity
- answer-class validity

Current frozen difficulty counts:

- Easy: **179**
- Medium: **317**
- Hard: **134**

Unsupported candidates audited: **646**

### Wave 3

`630 authorities × 3 locales = 1,890 semantic learner surfaces`

Results remain:

- zero exact normalized chapter-wide semantic surface duplicates;
- minimum authority count per CP: **13**.

## Banking three-inference validation

The Banking profile remains a presentation overlay, not a new permanent CP.

Current validation confirms:

- 5 curated overlays;
- three-inference rendering;
- five unique combination options;
- multilingual parity;
- answer-subset diversity;
- all five answer positions reachable;
- strength-backed candidate support;
- candidate-ID canonicalization;
- natural Hindi/Punjabi conjunctions;
- explicit difficulty filtering;
- review-only release boundary.

## Exact-head validation

Substantive code head:

`8b5360813ddbb8936acb6d49914d4ca38ae85538`

Workflow:

`Validate SIF-001 V1 Chapter Freeze` — run **#52**

Result: **SUCCESS**

The exact substantive head passed:

- chapter authority/review-pack proof;
- frozen multilingual Question Studio proof;
- Deep Audit Wave 1;
- Deep Audit Wave 2;
- Deep Audit Wave 3;
- strict TypeScript post-closure compile gate;
- 3,780-surface post-closure answer-integrity audit;
- Banking three-inference source-gap proof;
- normal Reasoning Question Studio registration/integration;
- production API build;
- release-boundary preservation.

Shared Reasoning current-head and global reconciliation gates also remained green during the remediation sequence.

## Final disposition

```text
semantic CP breadth:                      CLOSED — NO NEW CP REQUIRED
frozen authority inventory:              630
candidate I/II identity integrity:        CLOSED
answer proof redundancy:                 CLOSED — STRENGTH_BACKED_V2
legacy follows disagreement:             FAIL_CLOSED
explanation/answer consistency:           CLOSED
EN/HI/PA learner surfaces:                CLOSED
Banking three-inference difficulty:       CLOSED
Banking HI/PA combination wording:        CLOSED
Question Studio integration:              CLOSED
production API build:                     PASS
Question Bank writes:                     LOCKED
test/mock/public release:                 LOCKED
automatic publication:                   LOCKED
novelty:                                 DEFERRED_TO_FINAL_REASONING_PASS
post-closure deep-audit status:           CLOSED
```

Reopen SIF-001 only for:

- a newly evidenced recurring SSC/Banking/Punjab exam family not representable by the current contracts;
- a solver/proof regression;
- a candidate identity/presentation regression;
- an editorial/localization regression;
- a permanent audit-gate failure;
- or the intentionally deferred final novelty pass.
