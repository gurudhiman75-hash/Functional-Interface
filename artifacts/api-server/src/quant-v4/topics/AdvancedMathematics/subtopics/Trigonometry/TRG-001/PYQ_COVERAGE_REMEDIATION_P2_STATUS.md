# TRG-001 — PYQ Coverage Remediation P2

Status: **AUDIT CANDIDATE — NOT ACTIVATED — EXECUTION EVIDENCE PENDING**

Authority: `TRG-001-PYQ-COVERAGE-REMEDIATION-P2`

## Why this exists

The Quant V4 whole-section audit found two places where internal TRG-001 completeness did not fully prove external SSC-paper fidelity.

### 1. Cubic trigonometric factorization

Real SSC CGL anchor: 09 Sep 2024 Shift 2.

Observed form:

`(sin³A − cos³A)/(sin A − cos A)`

The intended solution requires difference-of-cubes factorization, cancellation under the stated domain condition, and `sin²A+cos²A=1`.

The current 144-QL authority has broad composite-expression coverage but no explicit cubic-factorization role.

### 2. Acute-interval sine/cosine ordering

Real SSC CGL anchor: 10 Sep 2024 Shift 1.

Observed concept: compare `sin θ` and `cos θ` when θ lies below or above 45° in the acute interval.

The current authority already has comparison roles, but the implemented comparison surface is driven mainly by a supplied tangent/right-triangle ratio. That covers the mathematical relationship but not the direct SSC interval construction.

## Remediation decisions

Do **not** increase the permanent 144-QL envelope.

### `TRG-001-QL-024`

Broaden the existing `RECIPROCAL_COMPARISON` role to include direct acute-interval comparison around the 45° equality boundary.

Candidate solve mode:

`compareSinCosFromAcuteInterval`

The audit surface generates both:

- `0° < θ < 45°` → `sin θ < cos θ`;
- `45° < θ < 90°` → `sin θ > cos θ`.

It uses compact exam-style stems, four plausible relation options and a short beginner-readable explanation based on the 45° comparison point.

### `TRG-001-QL-143`

Use the existing terminal `EQUIVALENCE_VERIFICATION_COMPOSITE` slot as the cubic-factorization candidate rather than adding `QL-145`.

Reason:

- `QL-142` is already a separately hardened composite-equivalence role;
- `QL-144` owns a double-angle equivalence role;
- the current `QL-143` authority surface overlaps more strongly with Pythagorean/reciprocal identity coverage already present elsewhere;
- replacing it preserves CP-006 and the permanent-ID envelope.

Candidate solve mode:

`simplifyTrigCubicFactorization`

The first audit version only changed wording around one fixed difference-of-cubes expression. That was insufficient for Examtree's novelty requirement. The candidate now exposes a controlled family:

- difference of cubes;
- sum of cubes;
- sine-first and cosine-first operand order;
- at least two stem surfaces per mathematical construction.

The exact SSC CGL difference-of-cubes construction remains explicitly reachable and tagged as the PYQ anchor.

## Candidate implementation

Audit overlay:

- `pyq-coverage-remediated-runtime-p2.ts`
- `pyq-coverage-remediated-runtime-p2.test.ts`

Only `QL-024` and `QL-143` are remediated. All other QLs delegate directly to the existing authority candidate.

The test source checks, without claiming execution:

- package/CP/QL identity;
- four unique options and one correct answer;
- both acute interval directions;
- both cubic operations;
- both sine/cosine operand orders;
- preservation of the exact SSC cubic anchor;
- multiple distinct stems rather than wording-only duplication;
- activation locks;
- neighbouring `QL-142` and `QL-144` remain unchanged.

## Question Studio boundary

The live/internal Question Studio runtime currently calls the previously frozen post-freeze runtime, not this audit overlay.

That is intentional. This remediation must not silently mutate already approved/frozen content. A later authority amendment, review/freeze update and explicit Question Studio rebinding are required before these surfaces can become active.

## What this remediation does not change

- package IDs;
- CP counts;
- total permanent QL count;
- Question Studio activation;
- test-builder eligibility;
- question-bank writing;
- public publication;
- production frequency authorization.

## Evidence still required

The new/updated regression source is committed but has **not been executed in this chat environment**.

Therefore this checkpoint does not claim:

- TypeScript compile pass;
- runtime test pass;
- production-authority gate pass;
- CI pass;
- human approval.

## Next audit step

Continue real-PYQ comparison across already-covered TRG families and distinguish:

- mathematically covered and exam-real;
- mathematically covered but stem construction too narrow;
- explanation too terse or unnecessarily complex;
- distractors weaker than SSC-style alternatives;
- difficulty label inconsistent with the transformations required;
- genuine remaining archetype gaps.

Only after that external-realism pass should a permanent TRG authority amendment be proposed.
