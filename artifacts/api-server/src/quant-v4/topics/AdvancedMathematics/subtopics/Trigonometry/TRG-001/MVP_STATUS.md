# TRG-001 — 72-QL MVP Status

Status: **ENGINEERING MVP IMPLEMENTED — EDITORIAL FREEZE PENDING**

This checkpoint expands the 30-QL runtime proof to the planned 72-QL English MVP while preserving every activation lock from Phase 0 and Phase 1.

## Completion snapshot

- Runtime-proof anchors: **30 / 30**
- New MVP-expansion QLs: **42 / 42**
- TRG-001 engineering MVP: **72 / 72**
- TRG-001 production target: **72 / 144**
- Human editorial review: **0 / 72 approved; 72 rows pending**
- Question Studio activation: **OFF**
- Test Builder eligibility: **OFF**
- Question-bank storage: **OFF**
- Public publication: **OFF**

## CP coverage

| CP | MVP IDs | Count |
|---|---|---:|
| TRG-CP-001 | TRG-001-QL-001…012 | 12 |
| TRG-CP-002 | TRG-001-QL-025…036 | 12 |
| TRG-CP-003 | TRG-001-QL-049…060 | 12 |
| TRG-CP-004 | TRG-001-QL-073…084 | 12 |
| TRG-CP-005 | TRG-001-QL-097…108 | 12 |
| TRG-CP-006 | TRG-001-QL-121…132 | 12 |

All IDs remain inside the Phase 0 package-local allocation.

## Coverage added beyond the 30-QL proof

### TRG-CP-001

Adds direct tangent, cotangent, secant and cosecant; recovery of cosine from sine; tangent from cosine; and tangent from secant.

### TRG-CP-002

Adds cosine, tangent and cosecant standard values; standard-value sums, square sums and quotients; and direct exact evaluation from rational-π input.

### TRG-CP-003

Adds quadrant III/IV signs, radian reduction, complementary tangent, negative angles, angles beyond one full turn and secant reduction.

### TRG-CP-004

Adds Pythagorean-identity quotients, sec²/cosec² recovery from ratios, reciprocal-product simplification and quotient-identity simplification.

### TRG-CP-005

Adds sum/difference ratios from tangent, sec±tan and cosec±cot conjugate recovery, product recovery from sin+cos, and a controlled `a sinθ = b cosθ` relation.

### TRG-CP-006

Adds exact 75°/15° angle-sum/difference values, tangent addition, double-angle sine/cosine, a controlled maximum-value pattern and reverse triangle-area recovery using `1/2 ab sin C`.

## Runtime contract

The new 42 QLs use the Phase 1 exact-number, angle and expression authorities. Each generated MVP question carries:

- deterministic seeded canonical state;
- exact rational/surd answer authority;
- four answer options;
- misconception-tagged distractors;
- mathematical option-equivalence rejection;
- an independent verification result;
- generated learner explanation;
- final validation checks;
- deterministic fingerprint support;
- `UNREVIEWED` review status;
- `NOT_STORED` question-bank status;
- `INELIGIBLE` test status;
- `publiclyPublishable: false`;
- `questionStudioDiscoverable: false`.

The original 30 QLs remain `proofOnly: true`. The new 42 QLs carry `mvpOnly: true` and `proofOnly: false`.

## Executable MVP gates committed

`mvp-runtime.test.ts` requires:

- exactly 72 QLs;
- exactly 12 QLs per CP;
- 72 unique QL IDs;
- 72 distinct solve modes;
- preservation of all 30 proof anchors;
- package-local ID-range correctness;
- 12 canonical seeds per QL;
- **72 × 12 = 864** canonical deterministic generations;
- deterministic repeat fingerprints;
- independent verification on every canonical generation;
- exactly four rendered options;
- exactly one correct option;
- no rendered option duplicates;
- valid correct index;
- no unresolved placeholders;
- non-empty explanation reasoning;
- no approximate-decimal answer leakage;
- all activation locks;
- at least two distinct stems per QL over the canonical seed set;
- a 50-seed whole-MVP sweep;
- **72 × 50 = 3,600** sweep generations.

## Implementation audit evidence

Before commit, the 42 new QLs were checked independently from the runtime generator design:

1. **Strict TypeScript contract compile:** the new runtime and gate suite compiled under strict TypeScript against a local mirror of the Phase 1 public interfaces.
2. **Exact symbolic option audit:** all allowed parameter variants for the 42 new QLs were checked for mathematical option collisions using independent symbolic algebra.
3. **Two real defects were caught before commit:**
   - `TRG-001-QL-103` originally allowed a 30° state where `secθ−tanθ` collided with a `tanθ` distractor; its clean state pool was changed to 45°/60°.
   - `TRG-001-QL-129` originally used distractors that could equal the correct double-angle value at 30°/60°; they were replaced by distinct misconception forms.
4. **Canonical-seed diversity precheck:** every new QL reaches at least two stem states over the 12 canonical seeds.

The repository gate suite is committed as executable evidence. **No GitHub Actions execution is claimed for this branch because no workflow run has executed it.**

## Editorial gate

`mvp-review-baseline.csv` contains all 72 MVP QLs and intentionally begins with every row at `PENDING`.

Required review fields include:

- stem realism;
- mathematical validity;
- option quality;
- explanation quality;
- difficulty fit;
- notes/status.

This checkpoint therefore means **engineering MVP implemented**, not human-editorial freeze.

## Activation gate

No part of this checkpoint registers TRG-001 with production Question Studio, Test Builder, question-bank persistence or public delivery.

Activation remains prohibited until the later explicit approval gate.

## Next authorized work

1. Execute/inspect the 72-QL MVP review surface and remediate systematic editorial defects.
2. Preserve the 72 approved QLs as the MVP baseline.
3. Expand TRG-001 from **72 to 144 QLs** only after the MVP quality gate is satisfactory.
