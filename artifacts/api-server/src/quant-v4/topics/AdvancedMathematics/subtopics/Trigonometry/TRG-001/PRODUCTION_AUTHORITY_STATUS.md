# TRG-001 144-QL Authority-Aligned Production Candidate

Status: **AUTHORITY RECONCILIATION IMPLEMENTED — FULL EDITORIAL RE-REVIEW REQUIRED**

## Why reconciliation was necessary

The first 144-QL engineering surface reached the correct package and CP counts, but a production review found that a number of permanent QL IDs had drifted away from the detailed Phase 0 family ranges in `TRG-001/ql-ledger.md`.

This was treated as a design-authority defect, not a cosmetic numbering issue. The Phase 0 ledger was **not weakened or rewritten to match implementation drift**.

## Active candidate

The active 144-QL candidate is now:

- `production-authority-runtime.ts`
- `production-authority-candidate-runtime.ts`
- `production-authority.test.ts`
- `production-authority.manifest.json`

The earlier proof/MVP/production generators remain in the branch as trace evidence.

## Reconciliation result

The candidate contains:

- `TRG-001-QL-001...144`
- 24 permanent QLs per CP
- all **39** detailed Phase 0 subfamilies at their locked counts
- **112** mathematically sound trace templates reused exactly once
- **32** custom authority roles authored where reuse would leave a family missing, weak or semantically misplaced

No trace template is intentionally reused twice in the authority candidate.

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
- triangle area via `1/2 ab sin C`: 2
- equivalence/verification/composite forms: 3

## Custom authority roles

The final 32 custom IDs are:

`001, 002, 003, 004, 011, 012, 024, 032, 038, 039, 040, 045, 046, 057, 058, 062, 063, 066, 093, 094, 095, 098, 112, 115, 116, 119, 120, 134, 135, 136, 137, 144`.

These are not filler. They close missing or underrepresented Phase 0 roles.

## Additional semantic hardening found during the authority audit

The second pass found four defects worth correcting before editorial review:

1. **QL-066** — the 270°/360° locked family was represented only by 360°-style cases. The candidate now includes a genuine `sin(270°+θ)` reduction.
2. **QL-095** — the mapped item was a generic identity rather than an expression evaluated from a given ratio. It is now a multi-step `tanθ+cotθ` question derived from a given sine ratio.
3. **QL-098** — the mapped item used a supplied `sinθ+cosθ` relation rather than deriving an expression from known sin/cos/tan data. It is now `secθ+cosθ` derived from a tangent ratio.
4. **QL-135** — two distractors (`1/2` and `sin30°`) were mathematically equivalent. The duplicate was replaced by a distinct reciprocal-function misconception.

The QL-095 and QL-098 parameter pools were checked across all five Pythagorean triples used by the candidate; their four-option sets remain mathematically distinct for every allowed triple.

## Authority gate suite

`production-authority.test.ts` is committed to enforce:

- exactly 144 permanent QL IDs;
- exactly 24 QLs per CP;
- exact Phase 0 family counts across all 39 locked subfamilies;
- 144 distinct solve modes;
- 112 unique trace-template reuses;
- 32 custom authority roles;
- deterministic regeneration;
- 12 canonical seeds per QL = **1,728 target cases**;
- at least two distinct generated stems per QL across the canonical seeds;
- independent/theorem verification;
- four mathematically unique options;
- one correct option and correct-index integrity;
- difficulty-sensitive explanation depth;
- no internal assignment-style stem leakage;
- row-level AI/human review reset after reconciliation;
- all activation locks;
- 50-seed full sweep = **7,200 target cases**.

These are **committed executable gates**. No execution result is claimed unless an actual run is observed.

## Editorial state

Permanent QL roles changed during reconciliation, so the earlier row-level AI approval cannot simply be inherited by ID.

Current authority-candidate review state:

- engineering coverage: **144 / 144**
- Phase 0 family allocation: **144 / 144 aligned by construction**
- AI editorial review on reconciled surface: **0 / 144 PENDING**
- mandatory human review: **0 / 144 PENDING**

Previously reviewed templates remain useful evidence, but not final row-level approval.

## Activation state

Still locked:

- Question Studio discovery: OFF
- Test Builder eligibility: OFF
- question-bank storage: OFF
- public publication: OFF
- Hindi/Punjabi runtime: OFF

No registration or activation change is authorized.

## Next checkpoint

Observe/execute the authority gate suite where execution is available, then perform the **full 144-QL AI exam-readiness/editorial review on this authority-aligned candidate**. Human review remains a separate mandatory freeze gate.