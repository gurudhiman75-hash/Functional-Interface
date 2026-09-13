# Quant V4 — TRG Exact-Surface + Source-Fidelity Audit, Checkpoint 4 (P2)

Authority: `QUANT-V4-TRG-EXACT-SURFACE-AND-SOURCE-FIDELITY-CHECKPOINT4-P2`

## Why this checkpoint exists

Earlier TRG real-exam coverage work was intentionally family-level. That was useful for locating broad package gaps, but it is not strong enough for the final ExamTree audit.

A question is not proven generatable merely because its ingredients live in two or three different QLs.

For final exam-readiness the audit now separates:

- `COVERED_EXACT` — one active runtime role can generate the observed structural question family, allowing the role's actual parameter variation;
- `COVERED_CORE` — the engine contains the required mathematical ingredients, but no single active role was located that can generate the observed material composition/surface;
- `MISSING_ARCHETYPE` — the observed reasoning structure or answer representation itself is absent;
- `SOURCE_FIDELITY_HOLD` — available evidence transcriptions conflict materially, so no coverage penalty should be assigned until the exact source form is normalized.

This stricter vocabulary supersedes broad family-home assumptions for the rows inspected below.

## Finding 1 — 26 Jul 2023 Shift 2 Q59 has a source-fidelity defect in the stored audit note

Stored observation:

- representation: `RIGHT_TRIANGLE_COMPLEMENTARY_TRIG_EXPRESSION_MCQ`;
- note currently says `B=90°`, `C=90°-A`, `sin C=cos A`, then reduces using a tangent value.

Companion official-paper mirrors instead reproduce the question as a right triangle with `B=90°` and target:

`sin A cos C + cos A sin C`.

That target collapses directly to:

`sin(A+C) = sin90° = 1`.

The supplied tangent value is redundant to the shortest solution.

One secondary source currently linked by the corpus also renders the expression/tangent differently. Therefore the stored note is not a trustworthy exact-surface description even though the broad package assignment remains TRG-001.

Decision:

- set exact-surface status to **`SOURCE_FIDELITY_HOLD`**;
- do not use this row as proof that `CP-003 + CP-001` cross-family composition is generatable;
- do not penalize the runtime for an exact mismatch until the evidence row is normalized against a stable companion transcription;
- once normalized, the expected reasoning family is right-triangle angle complement + sine angle-sum recognition, not tangent-based side recovery.

### Pipeline lesson

Frequency observations can survive with a coarse topic label, but **coverage-gap auditing cannot**.

For future exact-surface audits, a representation row should preserve enough source structure to reconstruct the demanded operations. A paraphrased solution note is not sufficient evidence when different source renderings exist.

## Finding 2 — `cosec 75°` is only core-covered, not exact-covered

Evidence:

- SSC CGL Tier-I, 25 Jul 2023 Shift 1 Q52;
- question explicitly supplies/uses a cosecant angle-addition identity and asks for `cosec75°`.

Current runtime evidence:

- TRG-001 has explicit sine angle-sum expansion / `sin75°` roles;
- QL-122/angle-sum proof material shows `sin75°=sin45°cos30°+cos45°sin30°`;
- the old MVP angle-sum exact-value role also computes `sin75°`;
- repository search found the `cosec75°` string only in the PYQ observation, not in an active TRG-001 generation role.

Decision: **`COVERED_CORE`**.

The engine knows the angle-sum mathematics and reciprocal relation, but no single role located in this audit can generate the observed `cosec75°` target.

Preferred remediation:

- extend the existing controlled angle-sum exact-value role to a small, safe target-function parameter set (`sin`, `cos`, `tan`, `cosec` where defined);
- do not create a cosmetic new QL solely for the reciprocal target if the existing role can be parameterized and independently verified.

## Finding 3 — 25 Jul 2023 Shift 1 Q74 is core-covered, not exact-covered

Evidence form:

- `cot A = 1`;
- `sin B = 1/√2`;
- infer acute `A=B=45°`;
- evaluate `sin(A+B) − cot(A+B)`.

Current runtime has the ingredients:

- standard-value recognition;
- controlled angle-sum/difference roles;
- cotangent and sine exact values;
- controlled equations/relations.

But repository search did not locate a single permanent role that:

1. infers two angles from two different trig givens;
2. forms their sum; and
3. evaluates a mixed two-function expression at that derived angle.

Decision: **`COVERED_CORE`**.

This is an important example of why “two component QLs exist” is not proof of Question Studio coverage.

Preferred remediation: parameterize a controlled derived-angle composite role rather than add one role for this literal PYQ.

## Finding 4 — 17 Sep 2024 Shift 1 Q1 is a new missing reasoning/representation archetype

Evidence form:

- given `cos24° = m/n`;
- evaluate `cosec24° − cos66°` in terms of `m,n`;
- use `cos66° = sin24°`;
- reduce `cosec24° − sin24° = cos²24°/sin24°`;
- derive `sin24° = √(n²−m²)/n` from the symbolic cosine ratio;
- return a symbolic expression in `m,n`.

Current TRG-001 authority contains complementary relations, reciprocal identities, Pythagorean recovery and numeric/exact-surd expression roles.

However:

- no active runtime role was located that accepts a symbolic ratio such as `m/n` and returns a symbolic expression in those parameters;
- repository search found no `m/n` TRG-001 generation role;
- composing separate numeric QLs cannot create this symbolic Question Studio question.

Decision: **`MISSING_ARCHETYPE`**.

Proposed solve-role family:

`deriveSymbolicTrigExpressionFromGivenRatio`

Required capabilities:

- safe symbolic numerator/denominator variables;
- acute-angle/domain contract where needed;
- Pythagorean radical reconstruction;
- complementary-function substitution;
- reciprocal simplification;
- canonical symbolic answer verification;
- distractors from sign/radical/numerator-denominator mistakes, not random expressions.

This raises the externally demonstrated TRG-001 missing-reasoning set to at least three:

1. cubic trigonometric difference-of-cubes factorisation;
2. higher-power expression from an imposed trig relation;
3. symbolic trig-expression derivation from a given symbolic ratio.

## Finding 5 — 17 Sep 2024 Shift 1 Q21 is core-covered, not exact-covered

Evidence form:

- `secθ = 29/20` in the relevant quadrant;
- reconstruct the 20-21-29 triangle;
- evaluate `3cosecθ + 3cotθ`.

The runtime has strong exact right-triangle reconstruction and derived-ratio roles, including cosecant/cotangent relations.

No single active role was located that produces the scaled combined target `3cosecθ+3cotθ` after secant reconstruction.

Decision: **`COVERED_CORE`**.

Preferred remediation: controlled expression-wrapper parameterization over the existing reconstruction role; do not allocate a permanent QL merely for coefficient `3`.

## Finding 6 — 17 Sep 2024 Shift 1 Q22 is core-covered, not exact-covered

Evidence form:

- `tan A = 1`;
- evaluate `4 sin A cos A`.

QL-094 explicitly proves the mathematical core:

- given tangent;
- reconstruct the right triangle;
- compute `sinθ cosθ`;
- plausible distractors are already based on double-angle / `sin²` / `cos²` confusions.

The active role does not expose the outer scalar coefficient seen in the PYQ.

Decision: **`COVERED_CORE`**, not `COVERED_EXACT`.

Preferred remediation: allow a controlled small non-zero integer multiplier on the target expression and propagate that multiplier through answer/distractor generation.

## Finding 7 — two previously identified gaps remain `MISSING_ARCHETYPE`

### A. Cubic factorisation

Observed:

`(sin³A−cos³A)/(sinA−cosA)`.

Needs algebraic difference-of-cubes factorisation followed by the Pythagorean identity.

No explicit role located.

Status: **`MISSING_ARCHETYPE`**.

### B. Imposed relation -> higher trig powers

Observed:

`cos A + cos²A = 1`, then evaluate `sin⁴A + sin⁶A`.

Needs derivation of `sin²A=cosA` from the imposed relation and the fundamental identity, then power propagation.

No explicit role located.

Status: **`MISSING_ARCHETYPE`**.

## Finding 8 — direct relation/recovery forms remain genuinely strong

Not every old `COVERED` result collapses under the stricter standard.

Examples with explicit single-role runtime support include:

- linear sine/cosine relation -> cotangent;
- sine -> cosine Pythagorean recovery;
- tangent -> secant / secant-square identity families;
- direct right-triangle ratio/recovery roles;
- sec±tan and cosec±cot conjugate/recovery roles.

These should remain the baseline model for what “covered” means: a single role with a direct solve contract, not an inference that multiple unrelated roles could theoretically be combined.

## Revised decision rule for the rest of Quant V4

For every real-PYQ row in a package audit, require all three layers:

1. **reasoning coverage** — does a role implement the required chain of operations?
2. **surface coverage** — can that role actually produce the material target structure, not merely its ingredients?
3. **state depth** — does the role possess enough parameter/state variation to produce genuinely distinct questions rather than seed/wording variants of one fixed mathematical state?

A package is not externally exhaustive until all three are acceptable.

This rule should be reused for ALG-001, TMW-001, PNL-001 and subsequent package audits.

## TRG-001 remediation queue after Checkpoint 4

### System-level blockers already staged as inactive candidates

1. remove forced Shortcut/Common-trap text from the default learner explanation while preserving editorial metadata;
2. enforce semantic batch uniqueness / explicit capacity exhaustion.

### Missing reasoning archetypes

3. cubic trig difference-of-cubes;
4. imposed-relation -> higher-power trig expression;
5. symbolic expression from a symbolic trig ratio.

### Surface-depth extensions

6. controlled reciprocal target for angle-sum exact values (`cosec75°` family);
7. derived-angle mixed composite expression (`sin(A+B)−cot(A+B)` family);
8. scaled cosecant/cotangent combination after ratio reconstruction;
9. scaled `sinθ cosθ` product after tangent reconstruction.

### Evidence hygiene

10. normalize the conflicting 26 Jul 2023 Shift 2 Q59 source row before using it for exact-surface coverage.

## Authority strategy

Do not add four or five cosmetic QLs.

The audit now distinguishes:

- **new reasoning roles**, which may justify a deliberate authority expansion/reallocation;
- **surface parameterization**, which should preferably deepen an existing role without consuming a new permanent ID;
- **Question Studio systemic quality**, which belongs at the generation boundary and should not be solved by adding QLs.

The permanent authority amendment should be made once after the remaining TRG rows are inspected, not piecemeal after every PYQ.

## Gate state

Unchanged:

- this checkpoint does not activate either quality-remediation candidate;
- current post-Final5 internal frozen authority is not mutated;
- public release remains disabled;
- frequency weighting remains audit-only;
- no TypeScript/CI execution is claimed for the staged remediation candidates.