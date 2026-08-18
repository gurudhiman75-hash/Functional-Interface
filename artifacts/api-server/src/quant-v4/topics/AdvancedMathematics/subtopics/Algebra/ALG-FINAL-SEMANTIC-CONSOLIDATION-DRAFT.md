# Algebra Final Semantic Consolidation — Draft

**Chapter:** Algebra  
**Input authority:** Revision-2 design + executable discovery + Source/PYQ Waves 1–3  
**Status:** CONSOLIDATION DRAFT / NOT A PERMANENT QL FREEZE  
**Current executable candidates:** 112  
**Permanent QLs:** 0  

---

## 1. Purpose

This document converts the executable candidate surface into a smaller set of **provisional semantic contracts**.

A semantic contract is the learner-facing mathematical inference that may eventually receive a permanent QL ID after source saturation.

This file deliberately separates:

- **CONTRACT** — a potentially permanent reasoning contract,
- **VARIANT** — representation / sign / target / edge state inside a contract,
- **MOVE** — learner-facing ownership belongs elsewhere,
- **ENGINE_ONLY** — infrastructure needed for correctness but not currently justified as a learner-facing QL,
- **HOLD** — source/ownership evidence is not yet strong enough for a final decision.

No IDs are allocated here.

---

## 2. ALG-001 semantic map

## CP-001 — Expressions / substitution

### `P-C001 — coefficient extraction`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `identifyCoefficientOfTerm`

### `P-C002 — simplify / expand algebraic expression`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `combineLikeTerms`
- `expandAndSimplifyExpression`

Variant dimensions:
- expansion required / not required,
- number of like-term groups,
- sign pattern,
- integer/rational coefficients.

### `P-C003 — evaluate one-variable algebraic expression`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `evaluateOneVariableExpression`

### `P-C004 — evaluate multi-variable algebraic expression`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `evaluateTwoVariableExpression`

### `P-H001 — infer missing coefficient from known evaluation`

Status: `HOLD`

Owns:
- `findMissingCoefficientFromKnownValue`

Open ownership comparison:
- CP-006 parameter equation,
- CP-005 polynomial parameter inference.

### `MOVE-DOMAIN-001 — detect undefined substitution`

Status: `MOVE → CP-008`

Owns:
- `detectUndefinedSubstitution`

Reason: denominator-definedness is original-domain evidence, not expression-evaluation identity.

---

## CP-002 — Two-variable identities / reciprocal transforms

### `P-C005 — square-sum identity from sum/product`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findSquareSumFromSumAndProduct`

### `P-C006 — cube-sum identity from sum/product`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findCubeSumFromSumAndProduct`

### `P-C007 — reciprocal square transform`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findReciprocalSquareFromPlus`
- `findReciprocalSquareFromMinus`

Variant dimensions:
- input sign `PLUS | MINUS`,
- sign/magnitude of given relation.

### `P-C008 — reciprocal cube transform`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findReciprocalCubeFromPlus`
- `findReciprocalCubeFromMinus`

Variant dimensions:
- input sign,
- target sign implied by identity.

### `P-C009 — higher reciprocal power / recurrence`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findReciprocalHigherPowerFromPlus`

Future variant scope should allow sign/input topology only when the recurrence proof remains exact.

### `P-C010 — scaled reciprocal square transform`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findScaledReciprocalSquare`

Reason: source evidence shows `px + q/x` topology not safely reducible to the unscaled `x±1/x` generator surface.

### `P-H002 — difference of squares from sum/difference givens`

Status: `HOLD`

Owns:
- `findDifferenceOfSquaresFromSumAndDifference`

---

## CP-003 — Three-variable symmetric identities

### `P-C011 — symmetric square / pairwise-product conversion`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findPairwiseProductSumFromSumAndSquareSum`
- `findSquareSumFromSumAndPairwiseProduct`
- `findPairwiseProductSumWhenTotalSumIsZero`

Variant dimensions:
- target direction,
- general sum versus special `a+b+c=0` constraint.

### `P-C012 — zero-sum cubic identity`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findCubeSumWhenTotalSumIsZero`

### `P-H003 — pairwise-difference-square target`

Status: `HOLD`

Owns:
- `findPairwiseDifferenceSquareSum`

### `P-H004 — cyclic reciprocal relation`

Status: `HOLD / SOURCE-DISCOVERED OWNERSHIP GAP`

No permanent owner yet.

Candidate evidence must be compared across:
- CP-002 reciprocal transforms,
- CP-003 multi-variable symmetry,
- CP-015 synthesis.

---

## CP-004 — Factorisation

### `P-C013 — identity-form factorisation: difference of squares`

Status: `CONTRACT / PROVISIONAL`

Owns:
- `factorDifferenceOfSquares`

### `P-H005 — perfect-square trinomial recognition/factorisation`

Status: `HOLD`

Owns:
- `factorPerfectSquareTrinomial`

Freeze question:
- independent recognition contract,
- or variant of generic quadratic factorisation?

### `P-C014 — generic quadratic factorisation`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `factorMonicQuadratic`
- `factorNonMonicQuadratic`
- common integer content as pre-step when present.

`factorCommonIntegerContent` is `VARIANT / PRE_STEP`, not a standalone permanent contract.

---

## CP-005 — Remainder / Factor Theorem

### `P-C015 — remainder under a linear divisor`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findRemainderForXMinusK`
- `findRemainderForXPlusK`
- `findRemainderForGeneralLinearDivisor`

Variant dimensions:
- divisor `x-k | x+k | ax+b`,
- integer/rational zero of divisor,
- polynomial degree.

### `P-C016 — parameter from remainder/factor condition`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findUnknownCoefficientFromFactorCondition`
- `findUnknownCoefficientFromGivenRemainder`
- `verifyDeclaredLinearFactor` as Boolean/presentation variant.

Variant dimensions:
- remainder zero/nonzero,
- answer target parameter/Boolean evidence.

### `P-C017 — two parameters from two independent remainder/factor conditions`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findTwoCoefficientsFromTwoRemainderConditions`

### `P-C018 — parameter plus common remainder across two polynomials`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findParameterAndCommonRemainderAcrossPolynomials`

---

## 3. ALG-002 equation / quadratic semantic map

## CP-006 — One-variable linear equations

### `P-C019 — solve one-variable linear equation`

Status: `CONTRACT / PROVISIONAL`

Owns:
- `solveDirectLinearEquation`
- `solveVariablesOnBothSides`
- `solveAfterBracketExpansion`
- `solveFractionalCoefficientEquation`

Variant dimensions:
- variable location,
- bracket expansion,
- coefficient domain,
- sign topology.

### `P-H006 — classify degenerate linear equation`

Status: `HOLD`

Owns:
- `classifyNoSolutionEquation`
- `classifyInfiniteSolutionEquation`

No/infinite are edge states of one degeneration test.

### `P-H007 — parameter from known linear-equation solution`

Status: `HOLD / OWNERSHIP REVIEW`

Owns:
- `findParameterFromKnownSolution`

---

## CP-007 — Simultaneous linear equations

### `P-C020 — solve unique 2×2 linear system`

Status: `CONTRACT / PROVISIONAL`

Owns:
- `solveSystemForOrderedPair`
- `solveSystemForSum`
- `solveSystemForDifference`
- `solveSystemForOneVariable`

Variant dimensions:
- target `(x,y) | x | y | x+y | x-y | other supported expression`,
- coefficient topology.

### `P-H008 — classify degenerate 2×2 system`

Status: `HOLD`

Owns:
- `classifyNoSolutionSystem`
- `classifyInfiniteSolutionSystem`

### `P-H009 — parameter for system consistency/inconsistency`

Status: `HOLD`

Owns:
- `findParameterForInconsistentSystem`

---

## CP-008 — Rational equations / domain

### `P-C021 — original-domain / excluded-value evidence`

Status: `CONTRACT / PROVISIONAL`

Owns:
- `identifyExcludedValue`
- CP-001 moved `detectUndefinedSubstitution` as a presentation/evidence variant.

### `P-C022 — solve rational equation with original-domain filtering`

Status: `CONTRACT / PROVISIONAL`

Owns:
- `solveSingleFractionLinearEquation`
- `solveTwoFractionLinearEquation`
- `rejectCancelledExcludedRoot`
- `classifyNoValidRootAfterDomainFilter`

Variant dimensions:
- number of fractions,
- cancellation,
- number of surviving roots,
- empty valid-root set.

### `P-C023 — reciprocal rational equation with multiple roots`

Status: `CONTRACT / PROVISIONAL`

Owns:
- `solveReciprocalEquationWithTwoRoots`

### `P-H010 — identity true on allowed domain`

Status: `HOLD`

Owns:
- `classifyIdentityOnAllowedDomain`

---

## CP-009 — Quadratic equations

### `P-C024 — solve / classify quadratic across root states`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `solveQuadraticWithRationalRoots`
- `solveRepeatedRootQuadratic`
- `solveQuadraticWithIrrationalRoots`
- `classifyQuadraticWithNoRealRoots`

Variant dimensions:
- two rational roots,
- repeated root,
- two irrational roots,
- no real roots,
- exact output representation.

### `P-C025 — parameter for equal roots`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findParameterForEqualRoots`

### `P-H011 — coefficient from one known quadratic root`

Status: `HOLD / PROVISIONAL`

Owns:
- `findCoefficientFromKnownRoot`

---

## CP-010 — Vieta / root transforms

### `P-C026 — direct Vieta invariant`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findSumOfRootsByVieta`
- `findProductOfRootsByVieta`

Target state: `SUM | PRODUCT`.

### `P-C027 — derived symmetric root expression`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findSquareSumOfRootsByVieta`
- `findReciprocalSumOfRootsByVieta`
- `findCubeSumOfRootsByVieta`

Target expression is metadata; reciprocal target carries nonzero-product domain evidence.

### `P-C028 — equation from supplied/root-derived sum and product`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `constructEquationFromSumAndProduct`

### `P-C029 — transformed-root quadratic equation`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `constructEquationWithShiftedRoots`
- `constructEquationWithReciprocalRoots`
- `constructEquationWithProductPlusMinusSumRoots`
- `constructEquationWithReciprocalThenShiftedRoots`

Permanent generator should use a controlled transform algebra rather than one QL per transform.

### `P-C030 — infer other root from one known root`

Status: `CONTRACT / PROVISIONAL`

Owns:
- `findOtherRootFromKnownRoot`

---

## CP-011 — Banking quadratic comparison

### `P-C031 — Banking compare roots of two quadratic equations`

Status: `CONTRACT / SOURCE_BACKED`

Owns all CP-011 candidates:
- strict greater,
- strict less,
- greater-or-equal,
- less-or-equal,
- equality,
- relation cannot be established,
- irrational-root representation.

Variant dimensions:
- answer relation,
- repeated/distinct roots,
- rational/irrational roots,
- interval overlap topology.

Engine HOLD:
- surd coefficients in input equations,
- unlike-radicand comparison unless source evidence requires it.

---

## 4. ALG-002 inequality / evidence semantic map

## CP-012 — Inequalities / extrema

### `P-C032 — solve linear inequality`

Status: `CONTRACT / PROVISIONAL`

Owns:
- `solveLinearInequality`
- `solveLinearInequalityWithNegativeCoefficient`

### `P-C033 — solve compound linear inequality`

Status: `CONTRACT / PROVISIONAL`

Owns:
- `solveCompoundLinearInequality`

### `P-C034 — solve quadratic inequality / sign region`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `solveQuadraticPositiveRegion`
- `solveQuadraticNonPositiveRegion`
- `solveRepeatedRootQuadraticInequality`
- `countIntegerSolutionsInQuadraticInterval` as target variant.

### `P-C035 — find quadratic extremum`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findQuadraticMinimum`
- `findQuadraticMaximum`

### `P-C036 — parameter range for global quadratic sign`

Status: `CONTRACT / SOURCE_BACKED`

Owns:
- `findParameterRangeForGlobalQuadraticSign`

---

## CP-013 — Absolute value

### `P-H012 — solve absolute-value equation`

Status: `HOLD / ENGINE IMPLEMENTED`

Owns:
- `solveSimpleAbsoluteEquation`
- `solveAffineAbsoluteEquation`
- `solveZeroRhsAbsoluteEquation`
- `rejectNegativeRhsAbsoluteEquation`

### `P-H013 — solve absolute-value inequality`

Status: `HOLD / ENGINE IMPLEMENTED`

Owns:
- `solveBoundedAbsoluteInequality`
- `solveExteriorAbsoluteInequality`
- `solveZeroBoundaryAbsoluteInequality`
- `countIntegerSolutionsToAbsoluteInequality` as target variant.

### `P-H014 — equal absolute distances`

Status: `HOLD`

Owns:
- `solveEqualAbsoluteDistances`

No permanent CP-013 allocation until direct target-exam evidence clears these HOLDs.

---

## CP-014 — Quantity comparison / data sufficiency

### `P-C037 — quantity comparison across admissible states`

Status: `CONTRACT / PROVISIONAL`

Owns:
- `compareExactQuantities`
- `compareDeterminatePossibilitySets`
- `compareIndeterminatePossibilitySets`

Relation outcome is answer state.

### `P-C038 — data sufficiency`

Status: `CONTRACT / SOURCE_BACKED`

Owns all five DS verdict candidates:
- Statement I alone,
- Statement II alone,
- either alone,
- both together,
- not sufficient.

Verdict is output state, not QL identity.

---

## CP-015 — Mixed synthesis

Status: `COMPOSITION / PRESENTATION LAYER`

No permanent CP-015 contract is currently justified.

Mappings:
- `linearThenReciprocalTarget` → CP-006 + CP-002,
- `systemThenQuantityComparison` → CP-007 + CP-014,
- `quadraticThenAbsoluteRootGap` → CP-009 + CP-013,
- `rationalEquationThenAbsoluteTarget` → CP-008 + CP-013,
- `factorDivisionThenEvaluateQuotient` → CP-005 + CP-001,
- `sharedSystemDerivedCaselet` → CP-007 + presentation/caselet layer.

These generators remain useful for mixed/caselet production after the owning contracts are frozen.

---

## 5. Consolidation result

The 112 executable candidates currently collapse into:

- **38 provisional semantic contract anchors (`P-C001`…`P-C038`)**, plus
- **14 explicit HOLD groups (`P-H001`…`P-H014`)**, plus
- moves / engine-only / composition variants that should never become permanent QLs by themselves.

This **does not mean the final Algebra chapter will have 38 or 52 permanent QLs**.

Why not:

- some `P-C` anchors are still only provisional rather than fully source-backed,
- some HOLD groups may be dropped or merged,
- source saturation may expose additional missing contracts,
- cross-chapter ownership can still move contracts,
- a later split may be justified where source evidence proves materially different reasoning.

---

## 6. Freeze blockers

Before any permanent QL ID allocation:

1. resolve all `P-H` groups,
2. strengthen source evidence for provisional CP-006–008 and QC anchors,
3. resolve surd-coefficient Banking input support,
4. complete source fixture ledger with exam/date/shift provenance,
5. run cross-chapter ownership review,
6. search again for missing contracts after consolidation,
7. convert this draft into a final semantic freeze authority.

---

## 7. Current decision

**Executable candidates:** 112.  
**Provisional semantic anchors:** 38.  
**Explicit HOLD groups:** 14.  
**Permanent QLs:** 0.  
**CP-015 permanent ownership:** 0.  
**Source saturation:** NOT COMPLETE.  
**Question Studio / Question Bank / release:** LOCKED.
