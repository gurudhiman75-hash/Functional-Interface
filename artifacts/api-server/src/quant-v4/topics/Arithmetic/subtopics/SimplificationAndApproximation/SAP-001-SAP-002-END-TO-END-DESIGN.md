# ExamTree Quant V4 — Simplification and Approximation
## SAP-001 and SAP-002 Exhaustive End-to-End Chapter Design Blueprint

**Design status:** `COMPLETE_FOR_CHECKPOINT_EXECUTABLE_DISCOVERY`  
**Student-facing chapter:** **Simplification and Approximation**  
**Runtime packages:** `SAP-001`, `SAP-002`  
**Canonical checkpoint range:** `SAP-CP-001..SAP-CP-012`  
**Permanent QL allocation:** none  
**Frozen solve modes:** none  
**Question Studio / Question Bank / tests / public routing:** disabled  
**Primary exams:** SSC CGL/CHSL/MTS/GD/CPO, Banking IBPS/SBI/RRB, Railway, PSSSB, PPSC, Punjab Police and other state competitive examinations  
**Runtime languages:** English (`en-IN`), Hindi (`hi-IN`), Punjabi (`pa-IN`)

This document is a design authority for executable discovery. It does not prescribe a final QL count, solve-mode count, checkpoint quota, difficulty quota or permanent ID range. Every inventory below remains open to source-backed addition, merge, split, reassignment or rejection until gap audits and executable proof are complete.

---

## 1. Executive decision

The learner sees one chapter, backed by two implementation packages:

```text
Simplification and Approximation
├── SAP-001 — Exact Expression Simplification
│   ├── SAP-CP-001 — Operation Order, Grouping and Signed Arithmetic
│   ├── SAP-CP-002 — Fractions, Mixed Numbers and Complex Rational Expressions
│   ├── SAP-CP-003 — Decimals, Percentages and Exact Representation Switching
│   ├── SAP-CP-004 — Numeric Powers, Roots, Factorials and Exact Special Forms
│   ├── SAP-CP-005 — Structural Cancellation, Product Chains and Telescoping Forms
│   └── SAP-CP-006 — Missing Values, Equality, Comparison and Exact Synthesis
└── SAP-002 — Approximation and Estimation
    ├── SAP-CP-007 — Rounding, Place Value and Significant-Figure Control
    ├── SAP-CP-008 — Approximate Sums, Differences and Mixed Operation Chains
    ├── SAP-CP-009 — Approximate Products, Quotients, Ratios and Percentages
    ├── SAP-CP-010 — Approximate Roots, Powers, Reciprocals and Derived Values
    ├── SAP-CP-011 — Nearest-Value Selection, Bounds, Error and Option-Led Estimation
    └── SAP-CP-012 — Reverse Approximation, Missing Values and Essential Synthesis
```

The package split is an implementation boundary only. Search, learner analytics and review tools may expose checkpoint families, but the public chapter remains unified.

A permanent QL exists only when a materially distinct exam task contract survives source saturation, executable generation, merge/split review, solver-verifier proof, editorial review and explicit allocation approval. A QL is not a wording template and a solve mode is not a quota.

---

## 2. Source and legacy basis

The design was checked against:

- the uploaded R.S. Aggarwal quantitative aptitude material, which contains a large dedicated Simplification chapter and separate chapters for square/cube roots and surds/indices;
- the uploaded Disha SSC Mathematics Guide, whose Fundamentals section explicitly defines BODMAS, bracket hierarchy, “of” and mixed arithmetic conventions;
- the uploaded Arun Sharma quantitative aptitude material for calculation shortcuts, ratio estimation and controlled approximation evidence;
- the repository’s legacy `fundamentals.ts` inventory, which mixes simplification, fractions, decimals, HCF/LCM, divisibility, unit digits, surds, indices and approximation;
- mature Quant V4 chapter rules from Number System, Average, Time & Work, Mensuration and Time, Speed & Distance;
- ExamTree’s deterministic generation, exact arithmetic, independent verification, human review and guarded publication workflow.

### 2.1 Legacy disposition

**Migrate after redesign:**

- BODMAS and bracket evaluation;
- exact fraction chains;
- decimal/fraction normalisation when embedded in evaluation;
- cancellation-first arithmetic;
- compact numeric powers and perfect roots;
- approximation and nearest-option estimation.

**Reassign to Number System:**

- divisibility rules;
- HCF/LCM and common-event alignment;
- unit/terminal digit cycles;
- prime structure and factorisation as the learner objective;
- decimal termination and recurring-decimal reconstruction as representation objectives;
- perfect-power classification, valuations and trailing zeroes.

**Reassign to Surds and Indices:**

- symbolic surd reduction;
- rationalisation;
- index-law manipulation with variables or symbolic bases;
- general fractional/negative exponent identities.

**Reassign to Percentage:**

- finding an unknown percentage, base or rate where percentage semantics are the objective;
- percentage change, successive change and application word problems.

**Reassign to Algebra:**

- general linear, quadratic or polynomial equation solving;
- symbolic identities whose main objective is algebraic transformation.

**Reassign to Reasoning Mathematical Operations:**

- coded operators;
- interchanged signs;
- arbitrary symbol-to-operator mapping;
- operator replacement puzzles.

Legacy motifs, audit PASS results and generated exports are evidence only. They do not receive automatic Quant V4 identity or release status.

---

## 3. Ownership rule

The chapter owns a question when its central learner contract is one of the following:

1. evaluate a fully specified arithmetic expression exactly;
2. exploit operation order, grouping, conversion or cancellation to simplify computation;
3. estimate a displayed arithmetic expression under a stated or exam-standard approximation policy;
4. recover a missing numeric value in a fixed arithmetic structure without requiring a general algebra engine;
5. select the nearest value, valid interval or error statement for an approximation.

Source chapter headings do not decide ownership. The governing inference does.

```text
Evaluate a long fraction-decimal expression
→ Simplification and Approximation

Convert 0.1 recurring to a fraction
→ Number System

Use 0.1 recurring inside a larger exact evaluation
→ Simplification, calling the shared exact-rational adapter

Find 25% of 480 inside an expression
→ Simplification

Find what percentage 120 is of 480
→ Percentage

Evaluate √144 + 3²
→ Simplification

Simplify √72 + √32 symbolically
→ Surds and Indices

Evaluate 8! / 6!
→ Simplification

Find the exponent of 5 in 100!
→ Number System

Find the number of arrangements represented by 8! / 6!
→ P&C

Find the missing number in 48 ÷ ? + 7 = 15
→ Simplification when fixed arithmetic inversion is sufficient

Solve 3x + 7 = 28 as an algebraic equation family
→ Algebra
```

---

## 4. Included scope

The chapter includes:

- generated arithmetic expression evaluation from a typed abstract syntax tree;
- parentheses, braces, brackets, vinculum/fraction bars and explicitly scoped radical bars;
- unary plus/minus and signed operands;
- multiplication, division, addition and subtraction with same-precedence left-to-right rules;
- explicitly rendered “of” as multiplication where exam-authentic and unambiguous;
- integers, reduced rationals, mixed numbers, terminating decimals and supported recurring-decimal values;
- percentage literals used as numeric factors;
- exact fraction addition, subtraction, multiplication, division and complex fractions;
- decimal/fraction/percentage switching when it is part of efficient evaluation;
- small exact powers, perfect square/cube/general integer roots and bounded factorial expressions;
- cancellation, factor extraction, product-chain compression and bounded telescoping structures;
- exact expression comparison and equivalent-value selection;
- fixed-structure missing-operand reconstruction;
- rounding to a declared place, decimal place or significant figures;
- term-wise and result-wise approximation under an explicit policy;
- compatible-number estimation for sums, products and quotients;
- approximate percentages, ratios, roots, powers and reciprocals;
- nearest-option selection with mathematically proven separation;
- interval, upper/lower bound and absolute/relative error tasks at exam-realistic depth;
- reverse approximation and missing-value tasks where the approximation contract is explicit;
- statement, table, data-sufficiency and mini-caselet wrappers only after ordinary solve authority is proven.

---

## 5. Excluded or delegated scope

The chapter does not own:

- arbitrary symbolic algebra;
- coded or interchanged operators;
- prime factorisation, HCF, LCM or divisibility as final objectives;
- symbolic surd and index theory;
- logarithmic approximation;
- trigonometric approximation;
- scientific numerical analysis, iterative methods or calculus-based error analysis;
- measurement significant-figure science beyond competitive-exam arithmetic;
- open-ended proof questions;
- approximation questions with unstated, conflicting or non-unique rounding conventions;
- decorative word problems whose actual objective belongs to another arithmetic chapter.

### 5.1 Shared authority, no duplicate learner QL

- `Rational`, gcd and decimal-string primitives come from shared exact-number infrastructure.
- Recurring-decimal conversion can be called from Number System without allocating a duplicate Simplification QL.
- Perfect-root recognition can call Number System helpers while the learner objective remains expression evaluation.
- Percentage and ratio chapters may call the approximation engine inside their own applied questions; that does not transfer learner ownership.
- Data Interpretation may reuse option-led estimation infrastructure, but DI caselet interpretation remains a separate learner contract.

---

## 6. Arithmetic language and precedence contract

Generated content must never depend on an ambiguous printed expression.

### 6.1 Canonical precedence

```text
1. Explicit grouping and scoped constructs:
   fraction/vinculum bar, parentheses, braces, brackets, radical scope, factorial scope
2. Powers and exact roots
3. Explicit “of” multiplication where present and fully scoped
4. Multiplication and division, evaluated left to right
5. Addition and subtraction, evaluated left to right
```

Rules:

- `×` and `÷` have equal precedence and associate left to right.
- `+` and `−` have equal precedence and associate left to right.
- unary signs belong to their operand and must be structurally represented;
- implicit multiplication is rendered only when there is no plausible alternate parse;
- expressions such as `a ÷ b(c)` are prohibited;
- “of” must be rendered with enough grouping to identify its complete left and right operands;
- every learner string is rendered from an AST; the string is not the source of mathematical truth.

### 6.2 Bracket authenticity

Books may state a traditional order among bar, round, curly and square brackets. ExamTree does not assign a different arithmetic precedence merely because bracket glyphs differ. Nesting defines scope. The renderer may use varied bracket shapes for readability, but the AST decides the grouping.

---

## 7. Canonical state model

```ts
type Rational = {
  numerator: bigint;
  denominator: bigint;
};

type ExactValue =
  | { kind: "INTEGER"; value: bigint }
  | { kind: "RATIONAL"; value: Rational };

type ExpressionNode =
  | { kind: "VALUE"; value: ExactValue; display?: NumericDisplay }
  | { kind: "NEGATE"; child: ExpressionNode }
  | { kind: "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE"; left: ExpressionNode; right: ExpressionNode }
  | { kind: "POWER"; base: ExpressionNode; exponent: bigint }
  | { kind: "EXACT_ROOT"; degree: bigint; radicand: ExpressionNode }
  | { kind: "FACTORIAL"; child: ExpressionNode }
  | { kind: "PERCENT_OF"; percent: ExpressionNode; quantity: ExpressionNode };

type NumericDisplay =
  | { kind: "INTEGER" }
  | { kind: "FRACTION" }
  | { kind: "MIXED_NUMBER" }
  | { kind: "TERMINATING_DECIMAL"; places: number }
  | { kind: "RECURRING_DECIMAL"; nonRepeating: string; repeating: string }
  | { kind: "PERCENT" };

type ApproximationPolicy = {
  stage: "ROUND_TERMS_FIRST" | "ROUND_FINAL_ONLY" | "COMPATIBLE_NUMBERS" | "BOUND_PRESERVING";
  rule: "NEAREST_INTEGER" | "PLACE_VALUE" | "DECIMAL_PLACES" | "SIGNIFICANT_FIGURES" | "NEAREST_OPTION";
  precision?: number;
  tieRule: "HALF_UP" | "HALF_AWAY_FROM_ZERO";
  allowedTransformations: readonly ApproximationTransformation[];
};

type ApproximationEvidence = {
  exactValue: Rational;
  transformedExpression: ExpressionNode;
  estimatedValue: Rational;
  lowerBound?: Rational;
  upperBound?: Rational;
  absoluteError?: Rational;
  relativeError?: Rational;
  selectedOption?: string;
  optionGapProof?: readonly Rational[];
};

type SapTarget =
  | "EXACT_VALUE"
  | "SIMPLIFIED_RATIONAL"
  | "MIXED_NUMBER"
  | "DECIMAL_VALUE"
  | "MISSING_OPERAND"
  | "COMPARISON_CLASS"
  | "EQUIVALENT_EXPRESSION"
  | "ROUNDED_VALUE"
  | "ESTIMATED_VALUE"
  | "NEAREST_OPTION"
  | "INTERVAL"
  | "ERROR_VALUE"
  | "TRUTH_VALUE"
  | "SUFFICIENCY_CLASS";
```

Every generated state also records:

- exact AST and exact canonical value;
- visible representation choices;
- target direction and answer semantic;
- approximation policy where applicable;
- canonical solution trace;
- independent verification trace;
- uniqueness and option-separation evidence;
- misconception-derived alternatives;
- source and ownership provenance;
- lifecycle status.

---

# Part A — SAP-001
## Exact Expression Simplification

## 8. SAP-CP-001 hypothesis — Operation order, grouping and signed arithmetic

**Ownership:** exact evaluation whose principal challenge is parse, grouping, precedence, associativity or signed-number handling.

### Current exhaustive solve-mode discovery baseline

```text
evaluateFlatMixedOperationExpression
evaluateMultiplicationDivisionLeftToRight
evaluateAdditionSubtractionLeftToRight
evaluateNestedParenthesesExpression
evaluateMixedBracketExpression
evaluateVinculumOrFractionBarGrouping
evaluateExpressionWithUnaryNegative
evaluateExpressionWithNegativeIntermediateValue
evaluateExpressionWithOfMultiplication
evaluateExpressionWithImplicitMultiplicationWhenUnambiguous
evaluateExpressionWithRepeatedGrouping
evaluateExpressionWithPowerBeforeArithmetic
evaluateExpressionWithFactorialBeforeArithmetic
compareResultsUnderTwoDifferentGroupings
selectCorrectlyParenthesisedEquivalentExpression
identifyFirstValidEvaluationStep
identifyIncorrectPrecedenceStep
findValueAfterOneDeclaredSubexpressionIsSimplified
```

### Design guards

- no ambiguous implicit multiplication;
- no reliance on the false rule that division always precedes multiplication;
- no decorative bracket type that changes meaning;
- at least one precedence or grouping decision must be material for Medium/Hard items;
- avoid long mechanical chains with no reasoning value.

---

## 9. SAP-CP-002 hypothesis — Fractions, mixed numbers and complex rational expressions

**Ownership:** exact rational arithmetic where fraction structure is the central computation.

### Current exhaustive solve-mode discovery baseline

```text
evaluateFractionSumOrDifference
evaluateFractionProductWithCancellation
evaluateFractionDivisionByReciprocal
evaluateMixedFractionOperationChain
convertMixedNumbersThenEvaluate
evaluateFractionOfFraction
evaluateNestedComplexFraction
evaluateContinuedFractionBounded
evaluateFractionExpressionWithIntegerPart
evaluateSignedFractionExpression
evaluateFractionExpressionWithBrackets
evaluateFractionExpressionWithDifferentDenominators
evaluateProductOfFractionSumAndFractionDifference
evaluateReciprocalExpression
evaluateFractionComplementExpression
findMissingNumeratorInFixedExpression
findMissingDenominatorInFixedExpression
findMissingFractionOperand
compareTwoEvaluatedFractionExpressions
selectEquivalentReducedFraction
selectIncorrectFractionSimplificationStep
```

### Boundary

- reducing or comparing a lone fraction as a representation task belongs to Number System;
- fraction arithmetic embedded in an expression belongs here;
- HCF/LCM of fractions remains Number System;
- algebraic rational expressions with variables belong to Algebra.

---

## 10. SAP-CP-003 hypothesis — Decimals, percentages and exact representation switching

**Ownership:** exact evaluation that becomes efficient by switching among terminating decimals, fractions and percentages.

### Current exhaustive solve-mode discovery baseline

```text
evaluateTerminatingDecimalExpression
evaluateDecimalFractionMixedExpression
evaluateDecimalProductByPlaceValue
evaluateDecimalDivisionByPowerOfTen
evaluateDecimalDivisionByCompatibleFactor
evaluatePercentageAsNumericFactor
evaluatePercentOfQuantityInsideExpression
evaluateMixedPercentFractionDecimalExpression
convertDisplayedTermsToFractionsThenEvaluate
convertDisplayedTermsToDecimalsThenEvaluate
useKnownFractionDecimalEquivalence
evaluateRecurringDecimalInsideExpression
evaluateComplementaryPercentageExpression
evaluateSuccessivePercentFactorsAsPureArithmetic
findMissingDecimalOperandInFixedExpression
findMissingPercentageLiteralInFixedArithmeticExpression
compareEquivalentFractionDecimalPercentResults
selectCorrectDecimalPlacement
identifyIncorrectRepresentationConversionStep
```

### Boundary

A task belongs here when conversion is a means to exact evaluation. Pure recurring-decimal reconstruction, termination classification or decimal-place theory belongs to Number System. Unknown-rate and percentage-change semantics belong to Percentage.

---

## 11. SAP-CP-004 hypothesis — Numeric powers, roots, factorials and exact special forms

**Ownership:** evaluate bounded numeric special forms inside an arithmetic expression without requiring symbolic theory.

### Current exhaustive solve-mode discovery baseline

```text
evaluateSmallIntegerPowerExpression
evaluatePowerWithZeroOrOneExponent
evaluateNegativeBaseIntegerPower
evaluatePerfectSquareRoot
evaluatePerfectCubeRoot
evaluateBoundedGeneralPerfectRoot
evaluateRootOfFractionWithPerfectComponents
evaluateRootThenMixedArithmetic
evaluatePowerAndRootCancellation
evaluateNestedPerfectRootBounded
evaluateSmallFactorial
evaluateFactorialRatioByCancellation
evaluateFactorialProductQuotient
evaluateFactorialInsideMixedExpression
evaluateDoubleFactorialOnlyIfSourceBacked
evaluatePowerOfFraction
evaluatePercentPowerRootMixedExpression
findMissingExponentByDirectBoundedEvaluation
findMissingPerfectRadicandInFixedExpression
compareTwoNumericPowerRootExpressions
identifyInvalidPowerRootFactorialStep
```

### Boundary

- symbolic exponent laws and surd manipulation belong to Surds and Indices;
- perfect-power structure and prime valuations belong to Number System;
- factorial counting interpretations belong to P&C;
- only exact roots are authoritative in SAP-001.

---

## 12. SAP-CP-005 hypothesis — Structural cancellation, product chains and telescoping forms

**Ownership:** exact evaluation where the exam-efficient route is structural reduction rather than raw arithmetic.

### Current exhaustive solve-mode discovery baseline

```text
cancelCommonFactorsBeforeMultiplication
cancelAcrossFractionProductChain
factorNumericTermsThenCancel
simplifyRatioOfProducts
simplifyConsecutiveIntegerProductRatio
simplifyFactorialRatioStructurally
simplifyProductOfReciprocals
simplifyDifferenceOfSquaresNumericProduct
simplifyConjugateNumericProductWhenExact
simplifyRepeatedCommonFactorExpression
simplifyNestedReciprocalChain
simplifyTelescopingDifferenceSumBounded
simplifyTelescopingProductBounded
simplifyPartialFractionTelescopingWithNumericPattern
simplifyProductOfOnePlusOrMinusUnitFractions
simplifySymmetricFractionPairExpression
simplifyRepeatedBlockExpression
findMissingFactorFromCancellationState
selectBestCancellationFirstStep
compareRawAndStructurallySimplifiedRoutes
identifyCancellationAcrossAdditionError
```

### Design guards

- cancellation is permitted only across factors, never across addition or subtraction;
- telescoping patterns must be visible and exam-realistic;
- no advanced series theory merely to create hard-looking content;
- the canonical explanation must expose the exact cancellation map.

---

## 13. SAP-CP-006 hypothesis — Missing values, equality, comparison and exact synthesis

**Ownership:** reverse or mixed exact arithmetic in a fixed expression structure after CP-001..005 authorities exist.

### Current exhaustive solve-mode discovery baseline

```text
findMissingAddendInFixedExpression
findMissingSubtrahendOrMinuend
findMissingFactorInFixedExpression
findMissingDividendOrDivisor
findMissingOperandInMixedOperationExpression
findMissingBracketedSubexpressionValue
findMissingIntegerFromFractionExpression
findMissingDecimalFromMixedExpression
findMissingPowerRootOrFactorialComponentBounded
findMissingValueWithTwoEquivalentExpressions
findValueMakingExactEqualityTrue
findValueMakingTwoExpressionSidesEqual
compareTwoExactExpressions
orderSeveralExactExpressions
selectEquivalentExactExpression
selectCorrectSimplificationStatement
selectIncorrectSimplificationStatement
resolveExactArithmeticDataSufficiency
resolveExactArithmeticStatementCombination
resolveExactArithmeticMiniTableOrCaselet
verifyCandidateBySubstitutionIntoExpression
```

### Boundary

This CP is not a general equation chapter. It retains a task only when the unknown can be recovered through direct inverse operations, bounded candidate verification or one fixed arithmetic structure. General equation families move to Algebra.

---

# Part B — SAP-002
## Approximation and Estimation

## 14. Approximation contract

Approximation questions must declare their policy. “Approximately” is not permission for arbitrary rounding.

### Supported policy families

```text
DECLARED_PLACE
- nearest integer, ten, hundred, thousand
- stated decimal places
- stated significant figures

TERM_WISE_EXAM_APPROXIMATION
- each displayed term is mapped to a declared nearby convenient value
- the transformed expression is then evaluated

COMPATIBLE_NUMBER_ESTIMATION
- values are selected to preserve the operation and create clean arithmetic
- every substitution is recorded and bounded

FINAL_ONLY_ROUNDING
- exact expression is evaluated first
- only the final value is rounded

NEAREST_OPTION
- exact value and a defensible estimate are both recorded
- one option must be uniquely nearest by a configured safety margin

BOUND_PRESERVING
- substitutions deliberately produce an upper bound, lower bound or enclosing interval
```

A generated item is invalid if two common defensible policies yield different option answers and the stem does not disambiguate them.

---

## 15. SAP-CP-007 hypothesis — Rounding, place value and significant-figure control

**Ownership:** apply, interpret or reverse an explicit rounding rule.

### Current exhaustive solve-mode discovery baseline

```text
roundIntegerToNearestTenHundredOrThousand
roundDecimalToNearestInteger
roundDecimalToDeclaredDecimalPlaces
roundValueToDeclaredSignificantFigures
roundPositiveAndNegativeValuesUnderDeclaredTieRule
identifyPlaceValueUsedForRounding
findRoundedValueFromDigitInspection
findRangeOfValuesThatRoundToTarget
findLeastOrGreatestValueWithDeclaredRoundedResult
findMissingDigitForDeclaredRoundingOutcome
compareRoundingAtDifferentPrecisions
findAbsoluteRoundingError
findMaximumPossibleRoundingError
findRelativeOrPercentageRoundingErrorBounded
selectCorrectRoundedRepresentation
identifyPrematureRoundingStep
identifyInvalidSignificantFigureCount
```

### Design guards

- the tie rule is explicit in system state and stable across locales;
- negative-value ties are not silently treated inconsistently;
- significant figures are used only when exam evidence supports them;
- displayed trailing zeroes must preserve intended precision.

---

## 16. SAP-CP-008 hypothesis — Approximate sums, differences and mixed operation chains

**Ownership:** estimate additive or mixed expressions through declared rounding or compatible values.

### Current exhaustive solve-mode discovery baseline

```text
approximateSumByRoundingTerms
approximateDifferenceByRoundingTerms
approximateSignedSumDifference
approximateBracketedAdditiveExpression
approximateDecimalSumOrDifference
approximateMixedAddMultiplyExpression
approximateMixedDivideAddExpression
approximateMultiTermBodmasExpression
approximateExpressionAfterGrouping
chooseCompatibleAddendsForTargetPlace
findMissingAddendUnderApproximateEquality
findMissingSubtrahendUnderApproximateEquality
selectNearestOptionForAdditiveEstimate
findUpperAndLowerBoundsForSum
findUpperAndLowerBoundsForDifference
compareTwoApproximateAdditiveExpressions
identifyOverestimateOrUnderestimate
identifyInvalidRoundingDirectionInChain
```

### Design guards

- subtraction items must control cancellation sensitivity;
- rounding may not erase the sign or make denominator zero;
- when close quantities are subtracted, use bound-preserving methods or reject the state.

---

## 17. SAP-CP-009 hypothesis — Approximate products, quotients, ratios and percentages

**Ownership:** estimate multiplicative arithmetic through compatible factors, scaled rounding or percentage landmarks.

### Current exhaustive solve-mode discovery baseline

```text
approximateProductByRoundingFactors
approximateDecimalProduct
approximateQuotientByCompatibleNumbers
approximateFractionValue
approximateRatioValue
approximatePercentageOfQuantity
approximateOneQuantityAsPercentageOfAnother
approximatePercentageFactorProduct
approximateProductQuotientChain
approximateScaledNumeratorAndDenominatorTogether
approximateUsingCommonFactorCancellation
approximateReciprocalThenMultiply
findMissingFactorUnderApproximateEquality
findMissingDivisorUnderApproximateEquality
selectNearestOptionForProductOrQuotient
compareApproximateRatios
findBoundsForPositiveProduct
findBoundsForPositiveQuotient
identifyScaleMismatchOrDecimalShift
identifyIndependentRoundingThatDistortsRatio
```

### Design guards

- denominator substitutions must remain non-zero and sign-consistent;
- ratio approximation should preserve common scale when beneficial;
- percentage estimation must not duplicate applied Percentage chapter contracts;
- option spacing must exceed the certified approximation uncertainty.

---

## 18. SAP-CP-010 hypothesis — Approximate roots, powers, reciprocals and derived values

**Ownership:** estimate non-perfect roots or bounded powers by nearby benchmark values or controlled interpolation.

### Current exhaustive solve-mode discovery baseline

```text
approximateSquareRootByNearbyPerfectSquares
approximateCubeRootByNearbyPerfectCubes
approximateBoundedGeneralRootByNearbyPerfectPowers
selectNearestIntegerSquareRoot
selectNearestTenthSquareRootWhenSourceBacked
approximateSmallDecimalPower
approximatePercentagePowerFactor
approximateReciprocalOfNearBenchmark
approximateRootProductOrQuotient
approximatePowerRootMixedExpression
approximateUsingFirstOrderDifferenceOnlyWhenExamBacked
findIntervalContainingRoot
findUpperOrLowerRootBound
findMissingRadicandUnderApproximateEquality
findMissingBaseInBoundedApproximatePower
selectNearestOptionForRootOrPower
compareTwoApproximateRootPowerValues
identifyWrongPerfectPowerBenchmark
identifyLinearInterpolationOutsideSafeRange
```

### Advanced hold

Newton-Raphson, logarithmic interpolation, binomial-series approximation and unrestricted Taylor methods remain excluded unless recurring exam evidence and a separate product decision justify them.

---

## 19. SAP-CP-011 hypothesis — Nearest-value selection, bounds, error and option-led estimation

**Ownership:** choose or justify the nearest answer while proving uniqueness and approximation safety.

### Current exhaustive solve-mode discovery baseline

```text
selectNearestOptionToExactExpression
selectNearestIntegerToExpression
selectNearestMultipleOfTenHundredOrThousand
selectNearestFractionOrDecimalOption
findOptionWithinDeclaredTolerance
findAbsoluteErrorOfEstimate
findRelativeErrorOfEstimate
findPercentageErrorOfEstimate
findErrorDirectionOverOrUnder
findCertifiedIntervalForExpression
findTightestValidDisplayedInterval
compareAccuracyOfTwoEstimates
chooseEstimateWithSmallerAbsoluteError
chooseEstimateWithSmallerRelativeError
findRequiredPrecisionToSeparateOptions
rejectAmbiguousEquidistantOptions
identifyOptionGapSafetyFailure
verifyApproximateOptionUsingExactOracle
```

### Option-separation rule

For each candidate option `o_i`, compute exact distance from the exact value. The correct option must be uniquely nearest. In addition, the distance gap between the best and second-best options must exceed the configured uncertainty of the approved approximation route. Otherwise the generated state is rejected.

---

## 20. SAP-CP-012 hypothesis — Reverse approximation, missing values and essential synthesis

**Ownership:** reverse or mixed approximation tasks that genuinely require more than one earlier approximation authority.

### Current exhaustive solve-mode discovery baseline

```text
findMissingOperandFromApproximateResult
findMissingRoundedTermInExpression
findOriginalRangeFromRoundedOperand
findUnknownBeforeAndAfterRounding
findMissingPercentageInApproximateExpression
findMissingRatioTermFromApproximateQuotient
findMissingRootOrPowerComponentApproximate
findValueSatisfyingApproximateEqualityWithinTolerance
findAllCandidateValuesWithinApproximationBand
classifyUniqueMultipleImpossibleOrIndeterminateApproximateOutcome
combineExactCancellationThenApproximation
combineApproximateTermsThenExactFinalOperation
chooseWhetherExactOrApproximateRouteIsRequired
resolveApproximationDataSufficiency
resolveApproximationStatementCombination
resolveApproximationMiniTableOrCaselet
verifyCandidateAgainstPolicyAndTolerance
selectCorrectApproximationStrategy
selectIncorrectApproximationClaim
```

CP-012 is not a dumping ground for hard items. A task remains in its primary checkpoint when a second operation is merely incidental.

---

## 21. Solve-mode identity and merge/split rules

A separate solve authority is justified when one or more of the following changes materially:

- expression parse or governing invariant;
- direct versus reverse direction;
- hidden-variable topology;
- exact versus approximate answer contract;
- rounding stage or policy;
- answer semantic;
- uniqueness or option-separation proof;
- efficient exam algorithm;
- misconception profile;
- independent-verification route.

The following do not automatically create new solve modes:

- different surface numbers;
- different bracket glyphs with the same AST;
- a different language;
- MCQ versus numeric answer;
- changing nearest ten to nearest hundred when one parameterised place-value engine fully owns both;
- changing fraction to decimal display when the same exact state and inference remain;
- changing a percentage literal from 25% to 20%;
- adding a decorative context;
- increasing raw arithmetic size without changing reasoning.

Every executable discovery wave must explicitly test over-merging and over-splitting.

---

## 22. Exact evaluator and independent verifier

### 22.1 Canonical evaluator

The canonical evaluator walks the generated AST and uses exact `bigint`/rational arithmetic. It must:

- reduce every rational;
- reject division by zero;
- reject factorials outside the declared non-negative bounded domain;
- reject non-exact roots in SAP-001;
- preserve display representation separately from exact value;
- emit a machine-readable trace for explanation rendering.

### 22.2 Independent verifier

The verifier must reconstruct from rendered givens and may not trust:

- canonical answer;
- option index;
- explanation text;
- hidden evaluator intermediates;
- approximation-selected option.

Suggested independent routes:

| CP | Canonical route | Independent route |
|---|---|---|
| CP-001 | AST evaluator | independently tokenised/render-map evaluation plus direct arithmetic |
| CP-002 | rational operations | common-denominator or exact numerator/denominator reconstruction |
| CP-003 | representation normalisation | decimal-string scaling and exact integer arithmetic |
| CP-004 | power/root/factorial primitives | repeated multiplication, direct perfect-power check or bounded product |
| CP-005 | structural cancellation | direct exact evaluation within bounded proof sizes |
| CP-006 | inverse operation solver | candidate substitution or bounded enumeration |
| CP-007 | rounding primitive | interval-membership reconstruction |
| CP-008 | approved transformed expression | exact oracle plus independently applied rounding policy |
| CP-009 | compatible-number route | exact rational oracle and error interval |
| CP-010 | benchmark/interpolation route | integer-power bracketing or high-precision decimal oracle |
| CP-011 | distance comparison | exact option-distance enumeration |
| CP-012 | composed approximation engines | bounded candidate search against policy and tolerance |

Floating point may be used only inside a clearly isolated high-precision approximation verifier when exact rational or integer bounds cannot represent the required non-perfect root. It must never decide exact equality and must carry a certified precision margin.

---

## 23. Valid-state-first generation

```text
construct a valid exact expression state
→ derive exact canonical value
→ choose direct, reverse or comparison target
→ choose display representations
→ for approximation, attach one explicit policy
→ derive approved transformed expression and uncertainty
→ prove answer domain, uniqueness and option separation
→ generate misconception-derived alternatives
→ render learner package and independent proof
```

Universal guards:

- deterministic regeneration from seed;
- no zero denominator or invalid factorial/root domain;
- no accidental alternate parse;
- no rounding-policy ambiguity;
- no equidistant nearest options;
- no accidental second missing value unless the answer semantic requests a set/count;
- no cancellation across addition/subtraction;
- no unsafe `number` conversion from large `bigint`;
- no excessive raw arithmetic;
- no rejection-loop collapse into a tiny repeated pool;
- no final answer precision unsupported by the stem;
- no approximate symbol on an exact answer or exact equality sign on an approximate claim.

---

## 24. Answer semantics

Each candidate declares one precise semantic:

```text
exact integer
reduced rational
mixed number
terminating decimal
percentage literal
missing operand
comparison class
ordered values
equivalent expression
rounded value
estimated value
nearest option
closed/open interval
absolute error
relative error
percentage error
overestimate/underestimate class
truth value
sufficiency class
complete admissible set
number of admissible values
```

The semantic controls option type, normalisation, equality, formatting, validation and explanation conclusion.

---

## 25. Difficulty model

Difficulty is derived from reasoning, not cosmetic magnitude.

Dimensions include:

- AST depth and branching;
- number of precedence pivots;
- representation switches;
- cancellation visibility;
- direct versus reverse direction;
- number of independent stages;
- signed intermediate values;
- denominator complexity;
- approximation policy complexity;
- sensitivity to rounding;
- option closeness;
- uniqueness burden;
- need for bounds rather than a point estimate;
- cross-check burden.

Suggested bands:

```text
CORE_EXAM_PATTERN
UPPER_EXAM_PRACTICE
ADVANCED_ENRICHMENT
```

No difficulty quota is frozen in advance. Large numbers alone do not create Hard content.

---

## 26. Distractor architecture

Wrong options must be recomputed from the live state and linked to a misconception.

Core exact-simplification families:

- addition before multiplication;
- division before multiplication instead of left to right;
- subtraction before addition instead of left to right;
- ignoring inner grouping;
- losing a unary negative;
- treating “of” as addition or applying it to the wrong span;
- adding fractions as `(a+c)/(b+d)`;
- multiplying by a divisor instead of its reciprocal;
- incorrect decimal place shift;
- treating `p%` as `p` rather than `p/100`;
- applying exponent rules across addition;
- taking `√(a+b)` as `√a+√b`;
- cancelling terms across addition;
- expanding factorials incorrectly;
- returning an unreduced or representation-mismatched answer;
- reversing an inverse operation.

Core approximation families:

- rounding the wrong digit;
- rounding every term in the wrong direction;
- rounding the final answer when terms-first was required;
- rounding terms when final-only was required;
- decimal-scale slip;
- replacing numerator and denominator independently in a ratio-distorting way;
- choosing the nearby perfect square/cube on the wrong side;
- confusing nearest option with the approximate transformed value;
- reporting the error with wrong sign;
- using relative error denominator incorrectly;
- ignoring an uncertainty interval;
- selecting an option that is close but not uniquely nearest.

Random nearby values are prohibited when misconception-derived values are available.

---

## 27. Explanation and pedagogy contract

Every English explanation is problem-specific and value-specific.

Required blocks:

1. **Core Concept** — exact precedence, conversion, cancellation or approximation rule;
2. **Read the Expression** — identify grouping and the required policy;
3. **Complete Step-by-Step Solution** — show decisive intermediate values;
4. **Exam Speed Shortcut** — only when valid for this state;
5. **Verification** — exact substitution, direct recomputation, bounds or option-distance check;
6. **Common Traps** — tied to displayed wrong options;
7. **Final Answer** — task-specific conclusion with exact/approximate notation.

Rules:

- do not recite BODMAS without applying it to the live expression;
- show left-to-right handling explicitly when it is the trap;
- show the reciprocal step in fraction division;
- show decimal/fraction/percentage conversion values;
- show cancellation factors before removing them;
- for approximation, show every substituted value and why it is allowed;
- distinguish `=` from `≈` throughout;
- show an error interval or option-gap proof when nearest-option correctness depends on it;
- never expose internal IDs;
- never use generic filler or unexplained answer jumps.

---

## 28. Representation and visual support

Most questions require no diagram. Useful deterministic reviewer/learner aids include:

- colour-neutral expression tree;
- bracket-scope highlighting;
- fraction cancellation map;
- decimal place-value grid;
- rounding number line;
- upper/lower-bound interval strip;
- exact-versus-estimated value comparison table;
- option-distance table.

A visual must be generated from the same state and may not introduce a new parse or rounding rule. Decorative visuals are prohibited.

---

## 29. Localisation

English is proven first. Hindi and Punjabi render from structured state and solve contract, not by translating completed English prose.

Locale requirements:

- natural competitive-exam wording;
- preserve Arabic numerals and mathematical symbols consistently;
- use `×` rather than relying on a grammatically ambiguous translation of “of” inside complex expressions when necessary;
- localise prose explanations, headings, table labels and trap analysis;
- preserve exact/approximate distinction;
- no English instructional fallback;
- no Devanagari/Gurmukhi cross-script leakage;
- correct-index, exact-value, approximation-policy and option-distance parity;
- human review before release.

Hindi and Punjabi terminology should favour familiar learner language over needlessly technical Sanskritised or literal wording.

---

## 30. Runtime file architecture

```text
SimplificationAndApproximation/
  SAP-001-SAP-002-END-TO-END-DESIGN.md
  SAP-SOURCE-AND-OWNERSHIP-AUDIT.md
  SAP-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md
  shared/
    types.ts
    expression-ast.ts
    exact-rational.ts
    decimal-display.ts
    expression-renderer.ts
    canonical-evaluator.ts
    independent-evaluator.ts
    approximation-policy.ts
    approximation-engine.ts
    bounds-and-error.ts
    option-separation.ts
    reasoning-graph.ts
    explanation-contract.ts
    source-ledger.ts
    lifecycle.ts
  SAP-001/
    foundation/
      parameter-generator.ts
      solver.ts
      independent-verifier.ts
      distractor-engine.ts
      explanation-renderer.ts
      validator.ts
      coverage-auditor.ts
      pipeline.ts
    SAP-CP-001/ ... SAP-CP-006/
    index.ts
  SAP-002/
    foundation/
      parameter-generator.ts
      solver.ts
      independent-verifier.ts
      distractor-engine.ts
      explanation-renderer.ts
      validator.ts
      coverage-auditor.ts
      pipeline.ts
    SAP-CP-007/ ... SAP-CP-012/
    index.ts
```

Human-owned libraries may include:

```text
task-registry.library.json
expression-language.en.json
expression-language.hi.json
expression-language.pa.json
numeric-display.library.json
approximation-policy.library.json
misconception.library.json
source-fixtures.library.json
explanation-strategy.library.json
coverage-ledger.md
```

---

## 31. Validation and audit requirements

Chapter-wide zero-tolerance counters should include:

```text
ambiguousExpressionParseCount
canonicalIndependentMismatchCount
invalidExactDomainCount
unsafeFloatEqualityCount
unreducedRationalCount
incorrectAssociativityCount
invalidCancellationCount
wrongDisplayPrecisionCount
missingApproximationPolicyCount
policyStemMismatchCount
exactApproxSymbolMismatchCount
approximationRouteAmbiguityCount
nearestOptionTieCount
insufficientOptionGapCount
uncertifiedRootApproximationCount
missingNumericSubstitutionCount
missingDecisiveCalculationCount
genericExplanationShellCount
distractorWithoutMisconceptionCount
duplicateMathematicalFingerprintCount
localeParityMismatchCount
scriptLeakageCount
prematureQuestionStudioExposureCount
```

All must be zero before the relevant freeze gate.

Coverage reports must span:

- AST shapes and depths;
- operator and grouping combinations;
- sign patterns;
- exact representation combinations;
- direct/reverse/comparison directions;
- answer semantics;
- approximation policies;
- rounding directions and tie cases;
- option-gap bands;
- difficulty dimensions;
- misconception families;
- locales and renderer forms.

---

## 32. Lifecycle and publication safety

All discovery and prototype outputs remain:

```text
permanentQlId: null
reviewStatus: UNREVIEWED_DISCOVERY_CANDIDATE
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
questionStudioDiscoverable: false
active: false
```

Question Studio exposure, Question Bank conversion, mock-test eligibility and public publication are separate deliberate releases after design, mathematical, editorial and localisation gates.

---

## 33. End-to-end implementation sequence

1. approve the two-package and twelve-checkpoint ownership hypothesis;
2. complete the source ledger and source-family extraction;
3. complete legacy Fundamentals recovery and disposition;
4. freeze the arithmetic-language and approximation-policy contracts;
5. implement shared exact AST/rational/renderer primitives with tests;
6. implement approximation, bounds and option-separation primitives with tests;
7. create non-permanent prototypes checkpoint by checkpoint;
8. export at least three mathematically distinct review states per prototype;
9. run direct, inverse, edge, representation, policy and misconception gap waves;
10. run CP-level and chapter-wide merge/split audits;
11. create a count-bearing QL proposal without permanent IDs;
12. obtain explicit product-owner allocation approval;
13. allocate permanent chapter-wide `SAP-QL-*` identities in a separate freeze gate;
14. complete English runtime, independent proof and editorial freeze;
15. generate Hindi and Punjabi candidates from structured state;
16. complete multilingual parity and human review;
17. add guarded Question Studio candidate routing;
18. only later consider Question Bank, tests and public publication.

---

## 34. Checkpoint implementation order

Recommended dependency order:

```text
Wave A — shared exact foundation
  expression AST, rational arithmetic, renderer, evaluator, verifier

Wave B — SAP-CP-001
  precedence and grouping prove the expression language

Wave C — SAP-CP-002 and SAP-CP-003 in parallel
  fractions; decimals/percentages

Wave D — SAP-CP-004 and SAP-CP-005 in parallel
  bounded special forms; structural cancellation

Wave E — SAP-CP-006
  exact inverse and synthesis after all exact engines exist

Wave F — shared approximation foundation
  policies, transformations, bounds, errors, option separation

Wave G — SAP-CP-007
  rounding semantics prove policy correctness

Wave H — SAP-CP-008 and SAP-CP-009 in parallel
  additive and multiplicative estimation

Wave I — SAP-CP-010 and SAP-CP-011 in parallel
  roots/powers; nearest-option and error proof

Wave J — SAP-CP-012
  reverse approximation and essential synthesis

Wave K — chapter-wide gap audit and freeze proposal
```

SAP-CP-001 and SAP-CP-007 are foundation checkpoints and should not be developed in parallel with unproven downstream semantics.

---

## 35. Design-completion gate

The design may enter executable discovery when:

- the two-package split is approved;
- all checkpoint boundaries are accepted as hypotheses;
- Number System, Percentage, Algebra, Surds/Indices, P&C, DI and Reasoning OPS boundaries are settled;
- arithmetic precedence and “of” rendering are approved;
- approximation policy and tie rules are approved;
- source and legacy audits contain no unclassified major family;
- open inventory and no-quota rules are preserved;
- all discovery content remains inactive and unpublished.

At this design stage:

```text
Permanent QLs: 0
Frozen solve modes: 0
Frozen CPs: 0
Implemented checkpoints: 0
Question Studio exposure: 0
Public content: 0
```
