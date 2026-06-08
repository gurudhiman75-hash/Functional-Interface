# NS-TRAIL-001 Difficulty Framework

## Difficulty Drivers

Difficulty is controlled by:

- size of n in factorial questions
- number of powers of 5 crossed
- number of factorial terms in an expression
- whether denominator cancellation is present
- target zero count in reverse-search questions
- factorization complexity of bases and products
- balance between factors of 2 and 5

## Easy

Features:

- small factorials
- one or two divisions by 5
- direct product factors
- bases such as 10, 20, 25, or 40
- no cancellation in factorial expressions

Expected learner work:

- count factors of 5
- count factors of 2 and 5 in simple products
- identify complete factor-of-10 pairs

## Medium

Features:

- medium factorials
- multiple powers of 5
- numerator-denominator factorial expressions
- bases with unequal 2 and 5 counts
- target zero counts requiring search around nearby multiples of 5

Expected learner work:

- apply floor divisions by 5, 25, and possibly 125
- subtract denominator contributions
- compare factor counts after exponent multiplication

## Hard

Features:

- large factorials
- several powers of 5
- cancellation cases
- powers where either 2s or 5s are excessive
- no-trailing-zero power cases
- reverse-search cases where no exact n exists

Expected learner work:

- organize repeated floor divisions
- distinguish nearest-below and nearest-above search values
- combine factor counts from several sources

## CP-Specific Notes

CP-001:

- Easy: smallFactorial.
- Medium: mediumFactorial.
- Hard: largeFactorial and multipleFivePowers.

CP-002:

- Easy: numeratorOnly.
- Medium: numeratorDenominator.
- Hard: cancellationCase.

CP-003:

- Easy: solutionExists with small zero count.
- Medium: nearestBelow and nearestAbove.
- Hard: larger target zero counts.

CP-004:

- Easy: balancedTwoFive.
- Medium: excessTwos or excessFives.
- Hard: noTrailingZero with misleading base.

CP-005:

- Easy: productCreatesZeros.
- Medium: productAddsZeros.
- Hard: productNoZeroChange with distracting factors.
