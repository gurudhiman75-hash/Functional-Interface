# TRG-001 Archetype — Trigonometric Ratios, Exact Values & Identities

Status: **Phase 0 design lock**. No runtime completion is claimed.

## Package purpose

`TRG-001` owns exact competitive-exam trigonometry that can be solved from right-triangle ratios, standard-angle values, angle transformations, identities and controlled algebraic relations.

It deliberately does not own physical line-of-sight word problems; those belong to `TRG-002`.

## Canonical problems

### `TRG-CP-001` — Right-Triangle Ratios, Reciprocals & Side Recovery

Target: 24 QLs (`TRG-001-QL-001...024`).

Coverage:

- identify opposite/adjacent/hypotenuse relative to a named acute angle;
- evaluate `sin`, `cos`, `tan`, `cot`, `sec`, `cosec` from sides;
- recover a missing side using Pythagoras when the target remains trigonometric;
- recover a side from a given ratio;
- derive all six ratios from one ratio;
- use reciprocal/quotient relationships;
- controlled comparison of ratios.

Representative solve-mode contract:

- `identifySidesRelativeToAngle`
- `findTrigRatioFromSides`
- `findMissingSideThenRatio`
- `findSideFromSin`
- `findSideFromCos`
- `findSideFromTan`
- `deriveAllRatiosFromSin`
- `deriveAllRatiosFromCos`
- `deriveAllRatiosFromTan`
- `findReciprocalTrigRatio`
- `compareTrigRatiosFromTriangle`

### `TRG-CP-002` — Standard Angles & Exact Evaluation

Target: 24 QLs (`TRG-001-QL-025...048`).

Coverage:

- exact values at `0°`, `30°`, `45°`, `60°`, `90°`;
- reciprocal-function values;
- products, quotients, powers, sums and differences;
- mixed standard-value expressions;
- simple finite standard-angle equations;
- comparison/ranking;
- intentionally defined domain/undefined-value questions.

Accidentally undefined generated expressions are invalid. Questions explicitly asking which value is undefined are valid.

### `TRG-CP-003` — Angle Measures, Complementary Relations & Reduction

Target: 24 QLs (`TRG-001-QL-049...072`).

Coverage:

- degree/radian conversion;
- exact standard radian forms;
- complementary-function relations;
- reduction through `90° ± theta`, `180° ± theta`, `270° ± theta`, `360° ± theta`;
- periodic reduction;
- quadrant sign/reference-angle reasoning;
- mixed reduction to exact familiar values.

### `TRG-CP-004` — Fundamental Identities & Expression Simplification

Target: 24 QLs (`TRG-001-QL-073...096`).

Authority identities:

- `sin^2(theta) + cos^2(theta) = 1`
- `1 + tan^2(theta) = sec^2(theta)`
- `1 + cot^2(theta) = cosec^2(theta)`
- `tan(theta) = sin(theta)/cos(theta)`
- `cot(theta) = cos(theta)/sin(theta)`
- reciprocal identities.

Coverage includes missing values, direct substitution, rational simplification, squared-ratio forms and expression equivalence.

### `TRG-CP-005` — Derived Ratios, Algebraic Relations & Controlled Equations

Target: 24 QLs (`TRG-001-QL-097...120`).

Coverage:

- derive one ratio from another;
- expressions from known `sin`, `cos` or `tan`;
- `sec(theta) ± tan(theta)`;
- `cosec(theta) ± cot(theta)`;
- `sin(theta) ± cos(theta)`;
- `a sin(theta) = b cos(theta)`;
- controlled equations whose intended answers lie in a finite standard-angle domain.

No general trigonometric-equation theory is authorized.

### `TRG-CP-006` — Mixed Exam Expressions & Controlled Applications

Target: 24 QLs (`TRG-001-QL-121...144`).

Coverage:

- multi-identity exact expressions;
- standard-angle series/products;
- controlled angle-sum/difference applications;
- controlled double-angle applications;
- simple maximum/minimum results when directly exam-relevant;
- triangle area through `1/2 ab sin C`;
- statement/equivalence questions;
- composite SSC-style expressions.

Unusual advanced forms may exist only as evidence-supported extended coverage; they must not dominate generated exam mixes.

## Exact mathematical primitives required before runtime proof

- normalized integer and rational;
- normalized surd and rational-surd;
- rational multiple of `pi`;
- intentional undefined trig state;
- exact arithmetic and equivalence;
- rationalization/canonical display rules;
- canonical angle in degree or exact `pi`-radian form;
- standard-value authority;
- expression tree with constant, trig call, add, subtract, multiply, divide, power and negate.

## Standard triangle authority

Use exact special triangles:

- `1 : 1 : sqrt(2)` for `45°`;
- `1 : sqrt(3) : 2` for `30°/60°`.

Trusted integer right-triangle pools may include scaled versions of:

- `3-4-5`
- `5-12-13`
- `7-24-25`
- `8-15-17`
- `9-40-41`
- `12-35-37`
- `20-21-29`

Avoid arbitrary triples that turn an exact-ratio question into calculator arithmetic.

## Difficulty contract

Difficulty is based on reasoning transformations, not number magnitude.

- Easy: one direct ratio/value/identity step.
- Medium: two linked transformations or reconstruction plus evaluation.
- Hard: non-obvious identity choice, algebraic reconstruction, reduction plus evaluation, or multiple exact transformations.

## Stem contract

Symbolic stems should remain compact and exam-like.

Typical target ranges:

- Easy: 8–25 words;
- Medium: 12–35 words;
- Hard: 18–50 words.

Do not lengthen a mathematically direct question merely to satisfy a prose template.

## Explanation contract

Reasoning nodes may include:

- `INTERPRET_GIVEN`
- `IDENTIFY_TRIANGLE_OR_RELATION`
- `SELECT_RATIO`
- `SELECT_IDENTITY`
- `CONVERT_ANGLE`
- `REDUCE_ANGLE`
- `LOOK_UP_EXACT_VALUE`
- `CONSTRUCT_TRIANGLE`
- `SUBSTITUTE`
- `ALGEBRAIC_TRANSFORM`
- `SIMPLIFY_EXACT_FORM`
- `SANITY_CHECK`

The renderer selects only meaningful nodes. Explanations must use the generated values and avoid generic shells.

## Distractor contract

Approved misconception families include:

- sine/cosine swap;
- tangent reciprocal;
- reciprocal-function confusion;
- opposite/adjacent swap;
- wrong standard value;
- complementary function not changed;
- wrong quadrant sign;
- degree/radian conversion inverted;
- identity sign error;
- identity square dropped;
- tangent written as cosine/sine;
- failed rationalization;
- partial simplification.

All options must be normalized mathematically before uniqueness checks.

## Verification contract

Independent verification is mandatory for every production QL/seed case.

The verifier must not simply call the same lookup/solver path as the primary solution.

## Activation

`TRG-001` remains inactive and unregistered throughout Phase 0 and subsequent implementation until explicit approval after production QA.
