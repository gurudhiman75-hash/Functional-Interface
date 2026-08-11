# Trigonometry Phase 1 Status

Status: **IMPLEMENTED — mathematical foundation only**

Branch: `feat/trg-phase1-foundation`

This phase implements the mathematical authority required before any TRG-001 runtime-proof QLs are authored. It does **not** activate Trigonometry in Question Studio, Test Builder, or production generation.

## Implemented foundation

### Exact arithmetic

`foundation/exact.ts` provides a canonical exact real-number representation as a reduced sum of rational radical terms:

`a + b√m + c√n + ...`

Capabilities:

- bigint-backed reduced rational arithmetic;
- square-free radical normalization;
- rational values;
- simple surds;
- rational+surd values;
- multi-surd values produced by exact trigonometric identities;
- exact addition/subtraction/multiplication;
- exact reciprocal and division through multiquadratic-field reconstruction;
- integer powers, including negative powers when defined;
- exact mathematical equality/key normalization;
- exact-vs-undefined result distinction;
- exact LaTeX/plain formatting;
- numeric conversion only for independent checking, never as answer authority.

The reciprocal solver is deliberately bounded to at most six independent radical primes (field degree <= 64) to prevent accidental combinatorial blow-ups. Planned SSC/state-exam Trigonometry domains are far below this limit.

### Angle authority

`foundation/angle.ts` provides:

- exact degree angles;
- exact rational multiples of pi;
- degree <-> radian-pi conversion;
- normalization modulo 360 degrees;
- reference-angle recovery;
- quadrant classification;
- quadrant sign authority;
- complementary/coterminal helpers.

No floating-point angle is required for primary solving.

### Standard trigonometric values

`foundation/standard-values.ts` provides exact authority for the six functions:

- sin;
- cos;
- tan;
- cot;
- sec;
- cosec.

The canonical reference-angle set is:

`0°, 30°, 45°, 60°, 90°`

Quadrant reduction extends those values to coterminal supported angles. Undefined values are represented explicitly rather than leaking `Infinity`, `NaN`, or a numerical approximation.

### Exact expression model

`foundation/expression.ts` implements the Phase 0 expression-tree contract:

- constants;
- trig calls;
- addition;
- subtraction;
- multiplication;
- division;
- integer powers;
- negation.

Evaluation returns a canonical exact value or an explicit undefined result.

### Independent verification

`foundation/independent-verifier.ts` deliberately does not call the primary standard-value authority when reconstructing standard trig values.

It reconstructs values from:

- coordinate-axis definitions for 0°/90°/180°/270°;
- the `1 : √3 : 2` triangle for 30°/60°;
- the `1 : 1 : √2` triangle for 45°;
- independent quadrant sign application;
- ratio/reciprocal reconstruction for tan/cot/sec/cosec.

A second numeric-expression checker uses native sine/cosine only as a verifier. It is never allowed to become published-answer authority.

## Verification evidence

`foundation/foundation.test.ts` currently covers:

- rational normalization;
- radical simplification;
- exact multiplication;
- denominator rationalization;
- generic √5 support;
- deterministic reciprocal stress over Q(√2, √3, √5);
- exact formatter behavior;
- degree/radian conversion;
- negative/large-angle normalization;
- reference angles;
- quadrant/sign behavior;
- exact standard values;
- undefined tan/cot domain cases;
- exact Pythagorean-identity evaluation;
- mixed rational+surd expression evaluation;
- independent reconstruction across 102 function/angle cases;
- independent numerical expression agreement.

Local strict TypeScript compilation passed.

Local foundation test result:

`102` standard-value verifier cases passed.

`149` deterministic exact-reciprocal stress cases passed.

## Deliberately not implemented in Phase 1

Phase 1 does not add:

- TRG-001 QL runtime contracts;
- solve-mode registry;
- QL templates;
- parameter generators;
- distractor runtime;
- explanations;
- diagrams;
- TRG-002 spatial runtime;
- Question Studio registration;
- Test Builder registration;
- production activation;
- Hindi/Punjabi content.

## Activation safety

No production registry or activation file is touched by this phase.

`TRG-001` and `TRG-002` remain inactive and unpublished.

## Next authorized implementation

Proceed to the **TRG-001 runtime proof** only after this foundation is accepted.

The runtime proof should force representative QLs across all six TRG-001 CPs and must exercise:

1. right-triangle side reconstruction;
2. exact standard values;
3. degree/radian conversion;
4. complementary/reduction relations;
5. all three fundamental Pythagorean identities;
6. derived ratio relations;
7. at least one controlled mixed expression;
8. exact option-equivalence collapse;
9. independent verification on every generated proof case.
