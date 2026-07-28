# ExamTree Quant V4 — Number System
## NUM-001 and NUM-002 End-to-End Design Authority

**Status:** end-to-end design hypothesis under source-backed executable discovery  
**Student-facing chapter:** Number System  
**Runtime packages:** `NUM-001`, `NUM-002`  
**Permanent QLs:** 0  
**Frozen CPs:** 0  
**Frozen solve modes:** 0  
**Question Studio exposure:** disabled  
**Question Bank / test / public eligibility:** disabled

This document defines the intended chapter architecture from mathematical state through multilingual review and eventual Question Studio integration. It does **not** prescribe a final QL count, solve-mode count, difficulty quota or permanent ID range. Every inventory below is a current exhaustive discovery baseline and remains open to source-backed addition, merge, split, reassignment or rejection.

---

## 1. Executive decision

Number System will remain one student-facing chapter backed by two runtime packages:

```text
Number System
  NUM-001 — Number Structure, Divisibility, Factors and HCF/LCM
  NUM-002 — Remainders, Digits, Powers, Bases and Number-Theory Synthesis
```

The split is an implementation boundary, not a learner-facing separation.

`NUM-001` owns the structural description of numbers:

- number sets and representations;
- fractions and decimals as exact rational forms;
- divisibility;
- prime factorisation;
- divisor functions;
- HCF, LCM and common-alignment applications.

`NUM-002` owns stateful and cyclic number behaviour:

- the division algorithm and remainder transformations;
- congruences and simultaneous remainder constraints;
- unit-digit and terminal-digit cycles;
- digit structure and number reconstruction;
- factorial valuations and trailing zeroes;
- perfect powers;
- positional base systems;
- bounded multi-engine synthesis.

A QL is retained only when it represents a materially distinct exam task contract: a different given/unknown topology, governing inference, answer semantic, uniqueness predicate or misconception profile. Context, number size, wording, language, diagram choice and ordinary presentation variation do not by themselves create new QLs.

---

## 2. Design principles

### 2.1 Open inventory rule

QL and solve-mode totals remain open until all of the following close:

1. uploaded-source saturation;
2. SSC/PYQ pattern audit;
3. Quant V2 and Quant V3 legacy recovery;
4. direct, reverse and inverse task audit;
5. answer-semantic audit;
6. edge and boundary audit;
7. representation audit;
8. cross-CP and cross-chapter ownership audit;
9. executable prototype proof;
10. merge/split audit;
11. independent-verifier proof;
12. generated-corpus gap audit;
13. human English review.

No production count is to be chosen as a quota.

### 2.2 Source headings are evidence, not ownership authority

Competitive-exam books sometimes place fraction comparison, averages, elementary equations, arithmetic identities and word problems together under “Number System”. ExamTree will classify each item by the inference actually tested.

Examples:

```text
Compare exact fractions or determine decimal termination
→ Number System

Evaluate a long mixed arithmetic expression
→ Simplification and Approximation

Solve a general linear equation with no number-theory constraint
→ Algebra

Count how many digit arrangements satisfy a divisibility property
→ P&C owns the count; Number System supplies the property validator
```

### 2.3 One mathematical source of truth

The same structured state must drive:

- canonical solving;
- independent verification;
- option construction;
- explanations;
- diagrams and tables;
- localisation;
- reviewer evidence;
- coverage audits.

### 2.4 Exactness first

All authoritative arithmetic uses `bigint`, reduced rationals, prime-exponent maps or exact modular residues. Floating-point arithmetic must never decide equality, divisibility, factorisation, remainder, recurring-decimal identity, terminal digits or correctness.

---

## 3. Included scope

The chapter owns:

- natural, whole, integer, rational, irrational and real-number classification where exam-relevant;
- sign, parity, absolute value, ordering and interval membership;
- consecutive integer, consecutive odd and consecutive even structure when number properties are central;
- exact fraction/decimal comparison and conversion;
- terminating and recurring decimal structure;
- divisibility rules and composite divisibility tests;
- missing-digit divisibility;
- primes, composites, co-primes and prime factorisation;
- divisor count, proper divisors, odd/even divisors, divisor sums and divisor products;
- HCF/GCD, LCM and their direct, inverse and application forms;
- Euclidean algorithm and division-lemma relations;
- remainders of sums, differences, products and powers;
- modular cycles, simultaneous congruences and bounded CRT-style tasks;
- unit digit, last two digits and last three digits;
- digit sum, digital root, place value, reversal, interchange and number reconstruction;
- number of digits where exact computation is available without unsafe approximation;
- prime valuations in products and factorials;
- trailing zeroes and highest powers dividing a product or factorial;
- perfect-square, perfect-cube and general perfect-power structure;
- minimum multiplier/divisor/addition/subtraction needed for a perfect power;
- decimal, binary, octal, hexadecimal and bounded general-base conversion;
- arithmetic and digit validity inside a stated base;
- least/greatest number satisfying declared factor, remainder, digit or perfect-power constraints;
- statement, data-sufficiency, table and caselet representations after the ordinary solve authority is proven.

---

## 4. Excluded or delegated scope

The chapter does not own:

- long BODMAS or approximation calculations whose main task is expression evaluation;
- general algebraic equation systems without number-theory structure;
- logarithmic manipulation used only to estimate digits;
- general surd and index simplification;
- number series pattern recognition;
- set-theory counting;
- probability;
- counting arrangements or selections of digits;
- coded-number reasoning or symbol-substitution reasoning;
- Roman-numeral trivia unless a future source audit proves meaningful exam demand;
- cryptographic number theory, unbounded primality research or very large arbitrary factorisation;
- open-ended proof questions unsuitable for objective-exam generation.

### 4.1 Cross-chapter authority rules

```text
Digit property or hidden number reconstruction
→ Number System

Count of numbers that can be formed
→ P&C, using Number System validators where required

Arithmetic simplification of a numeric expression
→ Simplification and Approximation

Algebraic identity or general polynomial equation
→ Algebra

Number-theoretic divisibility of an expression
→ Number System

Pure exponent/surd manipulation
→ Surds and Indices

Prime-exponent parity needed to complete a square/cube
→ Number System

HCF/LCM event alignment, bells, lights or repeating departures
→ Number System

Worker schedules and productivity cycles
→ Time & Work
```

HCF and LCM will not be separately reimplemented. The product UI may expose them as a filter or subchapter, but `NUM-001` remains the single runtime authority.

---

## 5. Canonical mathematical state

```ts
type ExactInteger = bigint;

type Rational = {
  numerator: bigint;
  denominator: bigint;
};

type PrimeExponentMap = ReadonlyMap<bigint, bigint>;

type NumberRepresentation =
  | { kind: "INTEGER"; value: bigint }
  | { kind: "RATIONAL"; value: Rational }
  | { kind: "DECIMAL"; integerPart: string; nonRepeating: string; repeating: string }
  | { kind: "BASE_NUMERAL"; digits: readonly number[]; base: number };

type DivisibilityConstraint = {
  expressionId: string;
  divisor: bigint;
  polarity: "DIVISIBLE" | "NOT_DIVISIBLE";
};

type RemainderConstraint = {
  expressionId: string;
  modulus: bigint;
  residue: bigint;
};

type DigitState = {
  digits: readonly number[];
  base: number;
  leadingZeroAllowed: boolean;
};

type NumberSystemTarget =
  | "NUMBER"
  | "DIGIT"
  | "COUNT"
  | "REMAINDER"
  | "DIVISOR"
  | "MULTIPLE"
  | "PRIME"
  | "EXPONENT"
  | "BASE"
  | "FACTORISATION"
  | "BOOLEAN_CLAIM"
  | "SUFFICIENCY_CLASS";
```

Each generated state must also record:

- declared domain and conventions;
- visible givens;
- hidden variables;
- constraints;
- exact canonical answer;
- answer semantic and unit;
- canonical method;
- independent verification method;
- uniqueness evidence;
- misconception evidence;
- source and ownership provenance.

---

## 6. Shared exact-number library

Create one shared authority usable across both packages and by approved adapters in P&C or Probability:

```text
artifacts/api-server/src/quant-v4/shared/number-theory/
  bigint.ts
  rational.ts
  gcd-lcm.ts
  extended-gcd.ts
  prime-table.ts
  primality.ts
  prime-factorisation.ts
  divisor-functions.ts
  valuations.ts
  modular.ts
  modular-power.ts
  congruence.ts
  crt.ts
  digit-arithmetic.ts
  recurring-decimal.ts
  base-conversion.ts
  perfect-power.ts
  exact-enumeration.ts
  formatting.ts
```

Required safety rules:

- define mathematical modulo as a non-negative residue;
- reject zero divisors and invalid bases;
- reduce every rational;
- validate every numeral digit is below its base;
- prevent unsafe conversion from `bigint` to JavaScript `number`;
- bound all generation and verification domains deliberately;
- construct factorisations from known prime states instead of relying on difficult arbitrary factorisation;
- use deterministic primality checks for supported ranges;
- record the algorithm used in reviewer metadata.

---

# Part A — NUM-001
## Number Structure, Divisibility, Factors and HCF/LCM

## 7. NUM-CP-001 hypothesis — Number sets, order, parity and integer structure

**Ownership:** classification or comparison of exact number objects and elementary integer structure.

### Current exhaustive solve-mode discovery baseline

```text
classifyNumberBySmallestApplicableSet
selectNumberOutsideDeclaredSet
validateNaturalWholeIntegerRationalMembership
classifyRationalVersusIrrationalExpression
compareSignedIntegers
compareMixedExactRepresentations
orderFractionsDecimalsAndSignedValues
locateValueOnNumberLine
findDistanceBetweenNumberLineValues
resolveAbsoluteValueDistance
countIntegersInClosedInterval
countIntegersInOpenOrHalfOpenInterval
findLeastOrGreatestIntegerUnderBound
findIntegerBetweenTwoExactValues
determineParityOfExpression
determineParityFromFactorsOrPowers
findMissingParityCondition
findConsecutiveIntegersFromSum
findConsecutiveOddIntegersFromSum
findConsecutiveEvenIntegersFromSum
findMiddleOrEndpointOfConsecutiveBlock
findProductOrSumPropertyOfConsecutiveIntegers
verifyAlwaysDivisibleConsecutiveProductClaim
comparePositivePowersByCommonExponentOrBase
```

### Merge rules

- different number-set labels remain one QL when the task is the same classification contract;
- number-line diagrams are representations, not separate solve modes;
- generic linear-equation problems are reassigned to Algebra;
- fraction ordering may be owned by CP-002 when conversion or recurring structure is central.

---

## 8. NUM-CP-002 hypothesis — Fractions, decimals and recurring representations

**Ownership:** exact rational representation, comparison and decimal-termination structure.

### Current exhaustive solve-mode discovery baseline

```text
reduceFractionToLowestTerms
convertImproperAndMixedFraction
compareTwoFractionsByCrossMultiplication
orderMultipleFractions
compareFractionDecimalAndRecurringDecimal
findLargestOrSmallestExactRational
findFractionBetweenTwoFractions
convertTerminatingDecimalToFraction
convertPureRecurringDecimalToFraction
convertMixedRecurringDecimalToFraction
convertFractionToTerminatingDecimal
identifyTerminatingVersusRecurringDecimal
findRequiredPowerOfTenForTermination
findNumberOfTerminatingDecimalPlaces
findMissingDenominatorFactorForTermination
findLeastMultiplierForTerminatingDecimal
findLeastDivisorForTerminatingDecimal
reconstructFractionFromRecurringBlock
findRecurringBlockLengthByBoundedRemainderCycle
findReciprocalOrComplementUnderExactConstraint
findUnknownFractionFromSumDifferenceOrRatioEvidence
```

### Boundary

Expression-heavy fraction arithmetic belongs to Simplification. CP-002 owns representation, comparison, termination and reconstruction.

---

## 9. NUM-CP-003 hypothesis — Divisibility rules and missing-digit constraints

**Ownership:** decide or enforce divisibility through decimal/base-10 digit structure or algebraic divisibility identities.

### Current exhaustive solve-mode discovery baseline

```text
testDirectDivisibilityByPrimitiveRule
testCompositeDivisibilityByPrimePowerRules
selectDivisorOrNonDivisorOfNumber
findSingleMissingDigitForDivisibility
findAllSingleDigitsForDivisibility
findLargestOrSmallestMissingDigit
findTwoMissingDigitsForOneDivisibilityRule
findTwoMissingDigitsForMultipleRules
findDigitSumConditionForDivisibility
findAlternatingDigitSumCondition
findMissingDigitInArithmeticResultWithDivisibility
findDivisibilityOfLargeConcatenatedNumber
findDivisibilityOfRepeatedDigitOrRepeatedBlockNumber
findDivisibilityOfSumDifferenceOrProduct
findDivisibilityOfPowerExpression
findGuaranteedDivisorOfAlgebraicPowerDifference
findGuaranteedDivisorOfAlgebraicPowerSumUnderParity
findUnknownDivisorFromDivisibilityEvidence
countMultiplesInRange
countNumbersDivisibleByOneOrMoreDivisors
countNumbersDivisibleByOneButNotAnother
findLeastOrGreatestNumberInDigitRangeDivisibleByK
verifyMultiConditionDivisibilityClaim
```

Every missing-digit generator must enumerate the complete admissible digit domain and prove whether the intended answer is unique, multiple, impossible or a count/set predicate.

---

## 10. NUM-CP-004 hypothesis — Prime structure and factorisation

**Ownership:** prime/composite structure and exponent decomposition before divisor-function or HCF/LCM objectives.

### Current exhaustive solve-mode discovery baseline

```text
classifyPrimeCompositeUnitOrNeither
findPrimeNumbersInBoundedInterval
findLeastOrGreatestPrimeUnderConstraint
findNextOrPreviousPrime
findPrimeFactorisation
findLargestOrSmallestPrimeFactor
findDistinctPrimeFactorCount
findTotalPrimeFactorCountWithMultiplicity
findMissingPrimeFactor
findMissingPrimeExponent
findNumberFromPrimeFactorisation
compareNumbersByPrimeExponentStructure
determineCoPrimePairOrSet
findCoPrimeConditionForUnknown
findPrimePairFromSumDifferenceOrProduct
findPrimeTripleUnderBoundedConstraint
findPrimeDivisorOfExpression
findLeastPrimeDivisor
findCompositeNumberWithDeclaredPrimeStructure
verifyFundamentalFactorisationClaim
findEulerTotientFromFactorisationAdvanced
findCountOfIntegersCoPrimeToNAdvanced
```

Totient tasks belong to `ADVANCED_ENRICHMENT` until source evidence proves routine exam ownership.

---

## 11. NUM-CP-005 hypothesis — Divisors and divisor functions

**Ownership:** properties of the divisor set derived from prime exponents.

### Current exhaustive solve-mode discovery baseline

```text
findTotalNumberOfPositiveDivisors
findNumberOfProperDivisors
findNumberOfOddDivisors
findNumberOfEvenDivisors
findNumberOfDivisorsDivisibleByK
findNumberOfDivisorsNotDivisibleByK
findNumberOfSquareDivisors
findNumberOfCubeDivisors
findNumberOfPerfectPowerDivisors
findSumOfPositiveDivisors
findSumOfProperDivisors
findProductOfPositiveDivisors
findCommonDivisorCount
findGreatestOrLeastDivisorUnderConstraint
findNthOrPairedDivisorUnderBoundedState
findNumberWithExactlyDeclaredDivisorCount
findLeastNumberWithDeclaredDivisorCount
findLeastOddOrEvenNumberWithDeclaredDivisorCount
findMissingExponentFromDivisorCount
findPrimePowerFromDivisorCount
findSquareNumberFromOddDivisorCountProperty
classifyPerfectDeficientOrAbundantAdvanced
```

Inverse divisor-count tasks require bounded constructive or exhaustive uniqueness proof; a formula producing one candidate is insufficient.

---

## 12. NUM-CP-006 hypothesis — HCF, LCM and common-alignment applications

**Ownership:** greatest common divisibility, least common multiplicity and their direct/inverse applications.

### Current exhaustive solve-mode discovery baseline

```text
findHcfByPrimeExponents
findHcfByEuclideanAlgorithm
findLcmByPrimeExponents
findLcmByDivisionTable
findHcfAndLcmTogether
findMissingNumberFromHcfLcmProductRelation
findPairFromHcfLcmAndSumDifferenceRatioOrProduct
findThreeOrMoreNumberHcf
findThreeOrMoreNumberLcm
findMissingHcfOrLcmFromPartialExponentEvidence
findHcfOrLcmOfPowers
findHcfOrLcmOfFractions
findHcfOrLcmOfTerminatingDecimals
findGreatestMeasureForExactGrouping
findLeastQuantityForExactGrouping
findMaximumEqualGroupSize
findMinimumNumberOfGroupsOrContainers
findGreatestDivisorLeavingDeclaredRemainders
findGreatestDivisorLeavingSameRemainder
findLeastNumberDivisibleByDeclaredNumbers
findLeastNumberLeavingSameRemainderForSeveralDivisors
findLeastNumberLeavingDifferentDeclaredRemainders
findNextOrPreviousCommonMultiple
countCommonMultiplesInRange
findFirstCommonEventTime
findRepeatAlignmentOfBellsLightsDeparturesOrSchedules
findCoPrimeConsequencesForHcfLcm
verifyHcfLcmClaimFromFactorisation
```

The event context remains here only when the tested inference is a common multiple. Work-rate or motion reasoning remains in its own chapter.

---

# Part B — NUM-002
## Remainders, Digits, Powers, Bases and Number-Theory Synthesis

## 13. NUM-CP-007 hypothesis — Division algorithm and elementary remainder transformation

**Ownership:** one-stage division-lemma states and direct propagation of known remainders.

### Current exhaustive solve-mode discovery baseline

```text
findRemainderFromDividendDivisorAndQuotient
findDividendFromDivisorQuotientAndRemainder
findDivisorFromDividendQuotientAndRemainder
findQuotientFromDividendDivisorAndRemainder
findUnknownRelationWhenDivisorIsMultipleOfQuotientOrRemainder
validateDivisionAlgorithmState
findRemainderOfSumFromComponentRemainders
findRemainderOfDifferenceFromComponentRemainders
findRemainderOfProductFromComponentRemainders
findRemainderAfterScalingNumber
findRemainderUnderSmallerDivisorThatDividesKnownDivisor
findRemainderOfPolynomialFromInputRemainder
findSameRemainderDivisorFromDifferences
findNumberFromQuotientRemainderRelation
findNestedRemainderThroughCompatibleDivisors
findMinimumAdditionForExactDivisibility
findMinimumSubtractionForExactDivisibility
findNearestMultipleAboveOrBelow
findLeastOrGreatestNDigitMultiple
```

---

## 14. NUM-CP-008 hypothesis — Modular arithmetic and simultaneous congruences

**Ownership:** multiple modular constraints, modular equations or non-trivial congruence reasoning.

### Current exhaustive solve-mode discovery baseline

```text
normalisePositiveAndNegativeResidue
findModularSumDifferenceProduct
findModularPowerByRepeatedSquaring
findRemainderOfLargeExpression
findRemainderOfGeometricOrStructuredSum
solveLinearCongruenceSingleSolution
solveLinearCongruenceMultipleOrNoSolution
findModularInverseAdvanced
combineTwoCompatibleCongruences
combineSeveralCompatibleCongruences
classifyCompatibleVersusIncompatibleCongruences
findLeastPositiveSolutionOfCongruenceSystem
findGreatestSolutionBelowBound
countSolutionsInInterval
findNumberLeavingSameRemainderForSeveralModuli
findNumberLeavingSpecifiedDifferentRemainders
findMissingModulusOrResidueFromSystem
reconstructNumberFromRemainderAndRange
findRemainderAfterNestedExponentOrExpression
applyFermatOrEulerReductionAdvanced
applyWilsonStylePrimeRemainderAdvanced
verifyCandidateAgainstCongruenceSystem
```

CRT, Euler, Fermat, Wilson and modular inverse are source-backed advanced authorities, not automatic routine QLs.

---

## 15. NUM-CP-009 hypothesis — Cyclicity, unit digit and terminal digits

**Ownership:** periodic terminal behaviour of powers and structured expressions.

### Current exhaustive solve-mode discovery baseline

```text
findUnitDigitOfSinglePower
findUnitDigitOfPowerProduct
findUnitDigitOfPowerSumOrDifference
findUnitDigitOfNestedPower
findUnitDigitOfPowerTower
findUnitDigitWithFactorialOrStructuredExponent
findLastTwoDigitsOfPower
findLastTwoDigitsOfExpression
findLastThreeDigitsOfPower
findLastThreeDigitsOfExpression
findCycleLengthForUnitDigit
findCyclePositionFromHugeExponent
findMissingExponentClassFromTerminalDigit
findExponentCountProducingDeclaredTerminalDigit
findTerminalDigitsOfRepeatedBlockOrGeometricExpression
findTerminalDigitAfterModularReduction
findLastNonZeroDigitOfBoundedProduct
compareTerminalDigitClaims
```

The engine must map an exponent congruent to zero modulo the cycle length to the final cycle position rather than index zero.

---

## 16. NUM-CP-010 hypothesis — Digit structure, place value and number reconstruction

**Ownership:** decimal or stated-base digit equations where the number itself or one of its digits is unknown.

### Current exhaustive solve-mode discovery baseline

```text
findPlaceValueOrFaceValue
expandNumberFromDigits
findDigitSum
findDigitalRoot
findRepeatedDigitalSum
useDigitSumForRemainderModuloNine
findNumberOfDigitsOfExplicitBoundedInteger
findNumberOfDigitsInConcatenatedSequenceBounded
findUnknownDigitFromSumProductOrDifference
findNumberFromDigitSumAndPlaceRelation
findTwoDigitNumberFromDigitRelation
findThreeOrMoreDigitNumberFromDigitRelations
findOriginalNumberFromReversal
findDifferenceOrSumOfNumberAndReverse
findNumberAfterDigitInterchange
findMissingDigitInAdditionSubtractionMultiplication
findCarryOrBorrowDigit
findPalindromeUnderConstraint
findNearestPalindromeBounded
findNumberFromLeadingTrailingAndDivisibilityConstraints
findDigitOccurrenceCountInBoundedRange
findSumOfDigitsAcrossBoundedRangeAdvanced
validateDigitEquationCandidate
```

Counting permutations of available digits belongs to P&C. Reconstructing a number from digit equations belongs here.

---

## 17. NUM-CP-011 hypothesis — Factorials, prime valuations and trailing zeroes

**Ownership:** exponent of primes in products/factorials and consequences such as trailing zeroes or highest divisible powers.

### Current exhaustive solve-mode discovery baseline

```text
findPrimeValuationInProduct
findPrimeValuationInFactorial
findPrimeValuationInFactorialRatio
findHighestPowerOfPrimeDividingNumberOrProduct
findHighestPowerOfCompositeDividingNumberOrProduct
findHighestPowerOfPrimeDividingFactorial
findHighestPowerOfCompositeDividingFactorial
findTrailingZeroesInFactorialBaseTen
findTrailingZeroesInProduct
findTrailingZeroesInFactorialRatio
findTrailingZeroesInGeneralBase
findLeastNWithAtLeastDeclaredTrailingZeroes
findLeastNWithExactDeclaredValuation
classifyPossibleTrailingZeroCount
findFactorialDivisibility
findLeastFactorialContainingDeclaredFactor
findRemainderOfFactorialExpressionUnderBoundedModulus
findLastNonZeroDigitOfFactorialAdvanced
findValuationOfBinomialCoefficientAdvanced
```

Inverse trailing-zero tasks must distinguish “at least”, “exactly” and “possible/impossible” semantics.

---

## 18. NUM-CP-012 hypothesis — Perfect squares, cubes and general perfect powers

**Ownership:** prime-exponent structure required for an integer to be a square, cube or bounded general perfect power.

### Current exhaustive solve-mode discovery baseline

```text
identifyPerfectSquare
identifyPerfectCube
identifyGeneralPerfectPower
findIntegerSquareOrCubeRootExact
countPerfectSquaresInInterval
countPerfectCubesInInterval
findNearestPerfectSquareOrCube
findLeastMultiplierToMakePerfectSquare
findLeastDivisorToMakePerfectSquare
findLeastMultiplierToMakePerfectCube
findLeastDivisorToMakePerfectCube
findLeastAdditionOrSubtractionToReachSquare
findLeastAdditionOrSubtractionToReachCube
findMissingPrimeExponentForSquareOrCube
findLeastSquareMultipleOfNumber
findLeastCubeMultipleOfNumber
findGreatestSquareOrCubeDivisor
findSquareOrCubeDivisorCount
findPerfectPowerFromDivisorPattern
findNumberWhoseProductWithAnotherIsPerfectPower
findTrailingDigitCompatibilityOfSquareOrCube
findConsecutiveSquareOrCubeBoundary
verifyPerfectPowerClaimByFactorisation
```

General surd manipulation and algebraic identities remain outside this CP.

---

## 19. NUM-CP-013 hypothesis — Positional bases and numeral conversion

**Ownership:** value, validity and arithmetic of numerals in a stated positional base.

### Current exhaustive solve-mode discovery baseline

```text
convertBaseBToDecimal
convertDecimalIntegerToBaseB
convertBetweenTwoNonDecimalBases
convertFractionalTerminatingValueBetweenBasesAdvanced
findPlaceValueInBaseB
validateNumeralForBase
findMinimumPossibleBaseForNumeral
findUnknownDigitInBaseNumeral
findUnknownBaseFromNumeralEquality
findUnknownBaseFromArithmeticStatement
performAdditionInBaseB
performSubtractionInBaseB
performMultiplicationInBaseB
findRemainderOrDivisibilityInBaseB
findNumberOfDigitsInBaseB
findLargestOrSmallestNDigitNumberInBaseB
compareNumeralsAcrossBases
findBaseRepresentationWithDeclaredTerminalDigits
convertBinaryOctalHexadecimalThroughGrouping
verifyBaseConversionClaim
```

Bases are bounded to exam-realistic values and digits. Generated hexadecimal content must define or consistently use `A`–`F`.

---

## 20. NUM-CP-014 hypothesis — Mixed inverse, optimisation and synthesis

**Ownership:** questions whose essential solution genuinely combines two or more established engines and cannot be reduced to a single earlier CP.

### Current exhaustive solve-mode discovery baseline

```text
findLeastNumberSatisfyingDivisibilityAndDigitConstraints
findGreatestNumberSatisfyingFactorAndRangeConstraints
findNumberSatisfyingRemainderAndDigitSumConstraints
findNumberSatisfyingHcfLcmAndPrimeStructure
findNumberSatisfyingDivisorCountAndPerfectPowerConstraint
findMissingPrimeExponentFromHcfLcmAndDivisorEvidence
findLeastMultiplierUnderMultipleNumberTheoryConstraints
findGreatestDivisorUnderRemainderAndFactorConstraints
reconstructHiddenNumberFromMixedEvidence
reconstructHiddenDivisorFromMixedEvidence
reconstructHiddenExponentFromCycleAndFactorEvidence
classifyUniqueMultipleImpossibleOrIndeterminateOutcome
selectCorrectNumberTheoryClaim
selectIncorrectNumberTheoryClaim
resolveNumberTheoryDataSufficiency
resolveNumberTheoryStatementCombination
resolveNumberTheoryMiniTableOrCaselet
verifyCandidateAcrossIndependentConstraintClusters
```

CP-014 is not a dumping ground for hard questions. A mixed item remains in its primary CP when the second property is merely a parameter filter or simple validation step.

---

## 21. Solve-mode identity and merge/split rules

A candidate deserves a separate solve authority when one or more of these changes materially:

- mathematical invariant;
- direction of inference;
- hidden-variable topology;
- answer semantic;
- admissible-domain or uniqueness proof;
- algorithm required for an efficient exam solution;
- misconception profile;
- independent-verification route.

The following do not automatically create new solve modes:

- larger values;
- different names or contexts;
- a different language;
- number-line versus prose display;
- MCQ versus numeric answer;
- table, statement or caselet wrapping;
- changing the requested digit position while retaining one algorithm;
- changing divisor 3 to 9 when the same digit-sum contract applies;
- replacing square with cube when a parameterised exponent-completion engine fully owns both without changing pedagogy.

Every executable discovery wave must explicitly test both over-merging and over-splitting.

---

## 22. Answer semantics

Every candidate must declare a precise answer semantic, for example:

```text
classified number set
ordered list
integer value
digit or digit set
number of admissible digits
prime or prime factor
prime exponent
complete factorisation
divisor count
divisor sum
divisor product
HCF
LCM
remainder
residue class
least positive solution
greatest bounded solution
number of solutions
unit digit
last two or three digits
number of digits
trailing-zero count
highest divisible power
perfect-power multiplier or divisor
base
base numeral
truth value
sufficiency class
```

The semantic controls option type, formatting, validation and explanation conclusion.

---

## 23. Parameter generation

All generators are valid-state-first:

```text
construct a valid hidden number-theory state
→ derive exact consequences
→ choose a target direction
→ hide only the target evidence
→ prove the answer domain and uniqueness
→ generate misconception results
→ render the learner-facing package
```

Universal guards:

- declared convention for whether 0 is included in natural numbers;
- no divisor or modulus of zero;
- `0 ≤ remainder < divisor` for ordinary division;
- positive base greater than 1;
- every numeral digit below the base;
- no accidental second valid missing digit;
- no accidental multiple CRT solutions within a bounded answer interval unless intended;
- no hidden dependence on floating approximation;
- no impractically huge manual arithmetic;
- no trivial answer leaked by a visible factorisation unless intended Easy level;
- no rejection-loop collapse into a tiny repeated pool;
- deterministic regeneration from seed.

---

## 24. Canonical solver and independent verifier

The independent route must be materially separate and must reconstruct from rendered givens rather than hidden solver output.

| CP | Canonical route | Independent route |
|---|---|---|
| CP-001 | set/property rules | exact substitution and bounded enumeration |
| CP-002 | rational/recurring-decimal algebra | exact long division and reconstruction |
| CP-003 | divisibility shortcut | direct exact division or candidate enumeration |
| CP-004 | prime table/factorisation | independent trial division or constructed-factor proof |
| CP-005 | exponent formulas | explicit divisor enumeration for bounded proof states |
| CP-006 | prime exponent min/max | Euclidean algorithm or direct common-divisor/multiple checks |
| CP-007 | division lemma | direct arithmetic reconstruction |
| CP-008 | congruence solver/CRT | bounded residue enumeration |
| CP-009 | modular cycle | direct modular exponentiation |
| CP-010 | digit equations | string/digit reconstruction and direct evaluation |
| CP-011 | Legendre/valuation formulas | explicit factor accumulation for bounded states |
| CP-012 | exponent completion | direct square/cube/root verification |
| CP-013 | positional expansion | repeated division/multiplication reconstruction |
| CP-014 | composed canonical engines | independent bounded constraint search |

Neither solver nor verifier may trust the option index, explanation text or each other’s intermediate answer.

---

## 25. Difficulty model

Difficulty is derived from reasoning, not cosmetic size.

Dimensions include:

- number of independent constraints;
- direct versus reverse/inverse direction;
- visible versus hidden prime structure;
- factorisation burden;
- modulus and cycle topology;
- size of admissible candidate domain;
- representation switching;
- number of stages;
- need for case decomposition;
- uniqueness burden;
- cross-engine coupling;
- distractor closeness.

Suggested bands:

```text
CORE_EXAM_PATTERN
UPPER_EXAM_PRACTICE
ADVANCED_ENRICHMENT
```

Advanced methods such as CRT, totient, Fermat/Euler, Wilson, modular inverses, factorial-ratio valuations and non-decimal fractional bases require explicit source support and visible labelling in reviewer metadata.

No difficulty quota is frozen in advance.

---

## 26. Distractor architecture

Every wrong option must come from a declared misconception and must be recomputed from the generated state.

Common families:

- treating 1 as prime;
- confusing whole and natural-number conventions;
- comparing fractions by numerator or denominator alone;
- using digit sum for an unsupported divisor;
- forgetting a second divisibility condition;
- using exponent sums instead of exponent minima/maxima for HCF/LCM;
- using `a+b+…` instead of `(a+1)(b+1)…` for divisor count;
- counting proper divisors as all divisors;
- using divisor minus remainder in the wrong direction;
- failing to reduce a negative residue;
- treating cycle remainder 0 as the first cycle position;
- using only the last digit when last two digits are required;
- ignoring carry, borrow or leading-zero constraints;
- counting factors 10 instead of prime factors 2 and 5 for trailing zeroes;
- using the exponent of 5 alone in a non-decimal base without balancing all base primes;
- making prime exponents all equal rather than even/multiples of three for perfect powers;
- accepting a digit not valid in the stated base;
- reversing the base-conversion remainder order;
- selecting a candidate that satisfies only one constraint cluster.

Random nearby numbers are prohibited when task-derived misconception values can be produced.

---

## 27. Explanation and pedagogy contract

English explanations must be teacher-style, problem-specific and value-specific.

Required blocks:

1. **Core Concept** — the exact property or invariant;
2. **Given Data and Strategy** — translate the live stem into mathematical evidence;
3. **Complete Step-by-Step Solution** — enough arithmetic for independent checking;
4. **Exam Speed Shortcut** — only when valid for the generated state;
5. **Common Traps** — tied to the actual displayed wrong options;
6. **Final Answer** — direct task-specific conclusion.

Rules:

- preserve the project’s literal inline MathJax contract `\(...\)`;
- never emit raw internal IDs to learners;
- never use generic filler such as “the quantities match the equality”;
- show divisor conditions, prime exponents, cycle positions or digit equations explicitly;
- do not claim a shortcut that depends on an unstated condition;
- singular/plural grammar must follow the generated answer;
- options must carry semantic labels where needed, such as “remainder 3” only when plain `3` could be ambiguous.

---

## 28. Visual support

Visuals are optional and deterministic. Useful forms include:

- number line;
- fraction comparison strip;
- factor tree;
- prime-exponent table;
- divisor-pair table;
- Euclidean algorithm ladder;
- HCF/LCM exponent grid;
- remainder cycle table;
- place-value table;
- carry/borrow column layout;
- factorial valuation table;
- base-conversion repeated-division table.

A diagram must be generated from the same state and reasoning evidence as the answer. Decorative diagrams are prohibited.

---

## 29. Localisation

Runtime languages are:

```text
en-IN
hi-IN
pa-IN
```

The English authority is proven first. Hindi and Punjabi must render from the structured state and solve contract, not by translating completed English paragraphs.

Locale requirements:

- natural competitive-exam wording;
- standard Hindi and Punjabi mathematical vocabulary without needlessly technical phrasing;
- exact numerical and correct-index parity;
- unchanged artificial base digits and symbols where mathematical;
- localised table headings, diagram labels, shortcuts and trap explanations;
- no English instructional fallback;
- no Devanagari/Gurmukhi cross-script leakage;
- human review before release.

---

## 30. Runtime file architecture

```text
NumberSystem/
  NUM-001-NUM-002-END-TO-END-DESIGN.md
  NUMBER-SYSTEM-SOURCE-AND-OWNERSHIP-AUDIT.md
  NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md
  shared/
    types.ts
    state-model.ts
    task-registry.ts
    source-ledger.ts
    reasoning-graph.ts
    explanation-contract.ts
    lifecycle.ts
  NUM-001/
    foundation/
      parameter-generator.ts
      solver.ts
      independent-verifier.ts
      distractor-engine.ts
      explanation-renderer.ts
      diagram-renderer.ts
      validator.ts
      coverage-auditor.ts
      pipeline.ts
    NUM-CP-001/ ... NUM-CP-006/
    index.ts
  NUM-002/
    foundation/
      parameter-generator.ts
      solver.ts
      independent-verifier.ts
      distractor-engine.ts
      explanation-renderer.ts
      diagram-renderer.ts
      validator.ts
      coverage-auditor.ts
      pipeline.ts
    NUM-CP-007/ ... NUM-CP-014/
    index.ts
```

Human-owned libraries may include:

```text
task-registry.library.json
question-language.en.json
question-language.hi.json
question-language.pa.json
variable-ranges.library.json
source-fixtures.library.json
misconception.library.json
explanation-strategy.library.json
visual-strategy.library.json
coverage-ledger.md
```

---

## 31. Lifecycle and publication safety

All discovery and prototype outputs must remain:

```text
permanentQlId: null
reviewStatus: UNREVIEWED_DISCOVERY_CANDIDATE
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
questionStudioDiscoverable: false
```

Question Studio exposure, Question Bank conversion, mock-test eligibility and public publication are separate deliberate releases after design, mathematics, editorial and localisation gates.

---

## 32. End-to-end implementation sequence

1. approve this package/CP ownership hypothesis;
2. complete source ledger and chapter-boundary review;
3. complete Quant V2/V3 recovery and disposition;
4. implement shared exact number-theory primitives with independent tests;
5. create non-permanent prototypes checkpoint by checkpoint;
6. export three or more mathematically distinct review states per prototype;
7. perform source, inverse, edge, representation and misconception gap waves;
8. perform CP-level merge/split and ownership audits;
9. create a count-bearing QL-template proposal with no permanent IDs;
10. obtain explicit product-owner approval;
11. allocate permanent chapter-wide `NUM-QL-*` identities in a separate freeze gate;
12. complete English runtime and editorial freeze;
13. create Hindi and Punjabi review candidates from structured state;
14. complete multilingual parity and human approval;
15. add guarded Question Studio candidate routing;
16. only later consider Question Bank, tests and publication.

---

## 33. Design-completion gate

The design is ready to move into executable discovery only when:

- package split is approved;
- CP ownership boundaries are approved as hypotheses;
- HCF/LCM ownership is settled;
- fractions/decimals boundary with Simplification is settled;
- P&C digit-counting boundary is settled;
- advanced-enrichment policy is accepted;
- source and legacy audits contain no unclassified major family;
- the open-inventory and no-quota rule is preserved.

At this design stage:

```text
Permanent QLs: 0
Frozen solve modes: 0
Frozen CPs: 0
Implemented checkpoints: 0
Public content: 0
```
