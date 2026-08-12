# TRG-001 144-QL Authority-Aligned Production Candidate

Status: **IMPLEMENTED AS AUTHORITY-ALIGNED CANDIDATE — EDITORIAL RE-REVIEW REQUIRED**

## Why a reconciliation layer was necessary

The first 144-QL engineering surface reached the correct package and CP counts, but a production review found that many permanent QL IDs had drifted away from the detailed Phase 0 family ranges in `TRG-001/ql-ledger.md`.

This was treated as a design-authority defect, not a cosmetic numbering issue.

The Phase 0 ledger was **not weakened or rewritten to match the code**. Instead, the production branch now contains an authority-aligned candidate layer.

## Candidate files

- `production-authority-runtime.ts`
- `production-authority-candidate-runtime.ts`
- `production-authority.test.ts`
- `PRODUCTION_AUTHORITY_AUDIT.md`

The earlier proof/MVP/production runtime files remain intact as trace evidence.

## Reconciliation strategy

The corrected candidate contains all permanent IDs:

- `TRG-001-QL-001...144`
- 24 QLs per CP
- 144 total

To avoid unnecessary generator churn:

- **114** mathematically sound trace templates are reused exactly once under the Phase 0 family position where their role belongs;
- **30** QLs are newly authored because the locked family did not have an adequate unique role in the engineering trace surface;
- no trace template is reused twice in the authority candidate;
- custom roles are deterministic and misconception-distractor based.

## Phase 0 family counts restored

### TRG-CP-001 — 24
- side-role recognition: 4
- direct side ratios: 4
- Pythagorean recovery then ratio: 4
- side recovery from known ratio: 4
- derived ratios from one known ratio: 6
- reciprocal/comparison: 2

### TRG-CP-002 — 24
- single standard values: 4
- reciprocal-function standard values: 4
- standard products/quotients: 5
- powers/squares: 3
- sums/differences: 4
- mixed standard expressions: 2
- domain/comparison forms: 2

### TRG-CP-003 — 24
- degree/radian conversions: 4
- complementary relations: 6
- 90°/180° reductions: 5
- 270°/360° reductions: 3
- quadrant/reference-sign reasoning: 3
- mixed periodic/reduction: 3

### TRG-CP-004 — 24
- sin²+cos² family: 4
- sec²−tan² family: 3
- cosec²−cot² family: 3
- reciprocal/quotient identities: 4
- rational-expression simplification: 5
- expression from one known ratio: 4
- equivalence recognition: 1

### TRG-CP-005 — 24
- derived ratio/expression: 4
- sec±tan relations: 4
- cosec±cot relations: 4
- sin±cos relations: 4
- linear sine/cosine relations: 4
- controlled finite standard-angle equations: 4

### TRG-CP-006 — 24
- mixed identity expressions: 6
- angle-sum/difference applications: 4
- double-angle applications: 3
- standard-value series/products: 4
- maximum/minimum: 2
- triangle area via 1/2 ab sin C: 2
- equivalence/verification/composite forms: 3

## New custom authority roles

Exactly 30 permanent QLs required newly authored roles:

`001, 002, 003, 004, 011, 012, 024, 032, 038, 039, 040, 045, 046, 057, 058, 062, 063, 066, 093, 094, 112, 115, 116, 119, 120, 134, 135, 136, 137, 144`.

These fill missing or underrepresented Phase 0 roles rather than padding the chapter with cosmetic variants.

## Defect caught during reconciliation

`TRG-001-QL-135` initially had two equivalent distractors:

- `1/2`
- `sin30°`

Both represent the same mathematical value.

The authority candidate hardening replaces the second duplicate with a distinct reciprocal-function misconception and keeps the canonical option-equivalence gate active.

## Authority gate suite

`production-authority.test.ts` is committed to enforce:

- exactly 144 permanent QL IDs;
- exactly 24 QLs per CP;
- exact Phase 0 family counts across all 39 locked subfamilies;
- 144 distinct solve modes;
- 114 unique trace-template reuses;
- 30 custom missing-role QLs;
- deterministic regeneration;
- 12 canonical seeds per QL = **1,728 target cases**;
- at least two distinct generated stems per QL across the canonical seeds;
- independent/theorem verification;
- four mathematically unique options;
- one correct option and correct-index integrity;
- difficulty-sensitive explanation depth;
- no internal assignment-style stem leakage;
- AI/human review reset after reconciliation;
- activation locks;
- 50-seed full sweep = **7,200 target cases**.

These are **committed executable gates**. No execution result is claimed unless an actual run is observed.

## Editorial consequence

Because permanent IDs and family roles were reconciled, the earlier row-level editorial status cannot simply be carried forward.

Authority candidate status:

- engineering QL coverage: **144 / 144**
- Phase 0 family allocation: **144 / 144 aligned by construction**
- AI editorial review on reconciled surface: **0 / 144 PENDING**
- human review: **0 / 144 PENDING**

The previously reviewed content remains useful evidence, but it is not counted as a final row-level freeze after reassignment.

## Activation state

Still locked:

- Question Studio discovery: OFF
- Test Builder eligibility: OFF
- question-bank storage: OFF
- public publication: OFF
- Hindi/Punjabi runtime: OFF

No registration or activation change is authorized.

## Next checkpoint

Run/verify the authority gate suite where execution is available, then perform the **full 144-QL AI exam-readiness/editorial review on the authority-aligned candidate**. Only after that should the human-review/freeze gate be considered.