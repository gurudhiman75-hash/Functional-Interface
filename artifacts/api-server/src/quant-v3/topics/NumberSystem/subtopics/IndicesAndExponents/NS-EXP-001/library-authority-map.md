# NS-EXP-001 Library Authority Map

## Ownership

- Ownership: HUMAN_OWNED
- Authority Type: Educational Authority
- Runtime Role: Runtime Consumption Only
- Source Authority: ns-exp-001-language-draft.md
- Runtime may load, validate, select, substitute, render, and audit approved content.
- Runtime may not invent stems, explanations, educational wording, alternate wording, or fallback wording.

## CP To Question Language

- CP01 Same-base exponent compression: QL-001, QL-002, QL-003, QL-004, QL-005, QL-006, QL-007, QL-008, QL-009, QL-010, QL-011, QL-012
- CP02 Same-base exponent equation: QL-021, QL-022, QL-023, QL-024, QL-025, QL-026, QL-027, QL-028, QL-029, QL-030, QL-031, QL-032
- CP03 Common-base transformation and exponent solving: QL-041, QL-042, QL-043, QL-044, QL-045, QL-046, QL-047, QL-048, QL-049, QL-050, QL-051, QL-052, QL-053
- CP04 Negative exponent normalization: QL-071, QL-072, QL-073, QL-074, QL-075, QL-076, QL-077, QL-078, QL-079, QL-080, QL-081
- CP05 Fractional exponent to root: QL-086, QL-087, QL-088, QL-089, QL-090, QL-091, QL-092, QL-093, QL-094, QL-095, QL-096, QL-097, QL-098
- CP06 Mixed exponent expression simplification: QL-101, QL-102, QL-103, QL-104, QL-105, QL-106, QL-107, QL-108, QL-109, QL-110, QL-111, QL-112, QL-113
- CP07 Exponential comparison by base alignment: QL-131, QL-132, QL-133, QL-134, QL-135, QL-136, QL-137, QL-138, QL-139, QL-140, QL-141, QL-142, QL-143
- CP09 Value substitution using a given power relation: QL-166, QL-167, QL-168, QL-169, QL-170, QL-171, QL-172, QL-173, QL-174, QL-175, QL-176, QL-177, QL-178

## CP To Explanation

- CP01 Same-base exponent compression: ES-001
- CP02 Same-base exponent equation: ES-002
- CP03 Common-base transformation and exponent solving: ES-003
- CP04 Negative exponent normalization: ES-004
- CP05 Fractional exponent to root: ES-005
- CP06 Mixed exponent expression simplification: ES-006
- CP07 Exponential comparison by base alignment: ES-007
- CP09 Value substitution using a given power relation: ES-008

## Coverage To CP

- CP01: multiplicationLaw, divisionLaw, powerLaw, mixedCompression
- CP02: directEquality, linearEquation, coefficientEquation
- CP03: baseConversionSimplification, baseConversionComparison, baseConversionEquation
- CP04: reciprocalForm, exponentCombination
- CP05: squareRootConversion, cubeRootConversion, fractionalPowerEvaluation
- CP06: mixedNegative, mixedFractional, mixedComposite
- CP07: comparison, ordering, greatestSelection, leastSelection
- CP09: exponentIncrease, exponentDecrease, exponentMultiplication

## Variable Range To CP

- CP01: base, firstExponent, secondExponent, thirdExponent, innerExponent, outerExponent, resultExponent
- CP02: base, targetExponent, coefficient, constant, divisor, answerExponent
- CP03: commonBase, transformationPower1, transformationPower2, visibleBase1, visibleBase2, visibleBase3, firstExponent, secondExponent, thirdExponent, targetExponent, shift, coefficient
- CP04: base, negativeExponent, positiveExponent, firstNegativeExponent, secondNegativeExponent
- CP05: base, fractionalExponentNumerator, fractionalExponentDenominator, rootDegree
- CP06: base, positiveExponent, negativeExponent, fractionalExponentNumerator, fractionalExponentDenominator, rootDegree, divisorBase
- CP07: commonBase, visibleBase1, visibleBase2, visibleBase3, firstExponent, secondExponent, thirdExponent
- CP09: base, knownValue, answerExponent, increment, decrement, multiplier, coefficient

## Active CP List

- CP01 Same-base exponent compression
- CP02 Same-base exponent equation
- CP03 Common-base transformation and exponent solving
- CP04 Negative exponent normalization
- CP05 Fractional exponent to root
- CP06 Mixed exponent expression simplification
- CP07 Exponential comparison by base alignment
- CP09 Value substitution using a given power relation
