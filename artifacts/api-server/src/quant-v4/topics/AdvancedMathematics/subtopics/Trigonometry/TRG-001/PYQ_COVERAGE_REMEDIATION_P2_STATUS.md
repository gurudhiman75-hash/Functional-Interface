# TRG-001 — PYQ Coverage Remediation P2

Status: **AUDIT CANDIDATE — NOT ACTIVATED — EXECUTION EVIDENCE PENDING**

Authority: `TRG-001-PYQ-COVERAGE-REMEDIATION-P2`

## Audit outcome so far

The real-paper comparison has identified three places where the 144-QL internal authority did not fully prove SSC construction coverage.

### `TRG-001-QL-024` — acute-interval sine/cosine ordering

SSC anchor: **10 Sep 2024 Shift 1**.

The existing comparison family mainly derives `sin θ` versus `cos θ` from a supplied tangent/right-triangle ratio. The SSC construction gives the acute interval directly around 45°.

Audit candidate solve mode:

`compareSinCosFromAcuteInterval`

Reachable mathematical states:

- `0° < θ < 45°` → `sin θ < cos θ`;
- `45° < θ < 90°` → `sin θ > cos θ`.

This broadens an existing comparison role; it does not add a permanent QL.

### `TRG-001-QL-126` — trig relation to higher powers

SSC anchor: **26 Jul 2023 Shift 1**.

Observed form starts from a relation such as:

`cos θ + cos² θ = 1`

and requires transforming a higher-power sine expression.

Current `QL-126` already owns genuine mixed-identity work, including fourth-power tan/cot constructions, so this is classified as **WEAK/BROAD coverage**, not a missing family.

The complete audit wrapper therefore keeps the existing QL-126 role reachable for some seeds and adds a sibling solve mode for other seeds:

`deriveHigherPowerFromTrigQuadraticRelation`

Sibling states include:

- `cos θ + cos² θ = 1` → higher powers of sine;
- mirrored `sin θ + sin² θ = 1` → higher powers of cosine.

The exact SSC cosine-relation form remains explicitly reachable.

### `TRG-001-QL-143` — cubic trigonometric factorization

SSC anchor: **09 Sep 2024 Shift 2**.

Observed form:

`(sin³A − cos³A)/(sin A − cos A)`

The current authority has broad terminal composite coverage but no explicit cubic-factorization role. `QL-143` is the best candidate permanent slot because its current authority surface overlaps more strongly with identity work already covered elsewhere, while `QL-142` and `QL-144` retain distinct hardened roles.

Candidate solve mode:

`simplifyTrigCubicFactorization`

The audit family now supports:

- difference of cubes;
- sum of cubes;
- sine-first and cosine-first order;
- multiple stem surfaces;
- explicit denominator/domain restriction;
- misconception-based distractors;
- beginner-readable factorization → cancellation → Pythagorean-identity explanations.

## Complete audit runtime

Base PYQ overlay:

- `pyq-coverage-remediated-runtime-p2.ts`
- `pyq-coverage-remediated-runtime-p2.test.ts`

Complete wrapper retaining the valid legacy QL-126 role while adding its PYQ sibling:

- `pyq-coverage-remediated-runtime-p2-complete.ts`
- `pyq-coverage-remediated-runtime-p2-complete.test.ts`

Complete remediation set:

- `TRG-001-QL-024`
- `TRG-001-QL-126`
- `TRG-001-QL-143`

No new permanent IDs are introduced.

## Realism and novelty rules applied

The remediation deliberately avoids one-off PYQ cloning.

- QL-024 generates both sides of the 45° interval boundary.
- QL-126 retains the previous mixed-identity construction and adds mirrored sine/cosine higher-power relations.
- QL-143 generates sum/difference cubic forms and both operand orders.
- stems stay compact and exam-like;
- explanations show the actual transformations without shortcut-only reasoning;
- distractors correspond to realistic sign, identity and premature-simplification errors.

## Question Studio / governance boundary

The internal Question Studio currently remains bound to the previously approved/frozen post-Final5 runtime, not this audit candidate.

Repository lineage check confirms that the post-Final5 freeze explicitly binds the approved English candidate to `TRG001_POST_FREEZE_REMEDIATION_V1`; therefore the existing internal activation is not an unbound-content activation. The source generator's local `PENDING/NOT_FROZEN` metadata is stale relative to the later freeze record, but the later freeze and activation artifacts bind the approved version.

The new P2 remediation surfaces are **not** covered by that historical freeze. They must remain inactive until a new authority amendment, review/freeze decision and explicit Question Studio rebind occur.

## Safety invariants retained

The audit candidate does not change:

- package count;
- CP count;
- 144 permanent-Ql envelope;
- Question Studio activation;
- test-builder eligibility;
- question-bank writing;
- public publication;
- Quant whole-section frequency promotion.

## Execution evidence

The new regression sources are committed but have **not been executed in this chat environment**.

No claim is made for:

- strict TypeScript compile;
- runtime test pass;
- full production-authority sweep;
- GitHub Actions pass;
- human approval;
- new freeze eligibility.

## Next checkpoint

The structural/PYQ coverage pass for TRG-001 is now focused enough to stop adding speculative roles. The next pass should review already-covered high-frequency PYQ families for learner-surface quality only:

1. stem realism versus SSC wording;
2. distractor strength;
3. explanation simplicity and completeness;
4. difficulty calibration;
5. whether generated variation changes mathematical state rather than only numbers/phrasing.

Only confirmed defects from that pass should be added to this remediation set.
