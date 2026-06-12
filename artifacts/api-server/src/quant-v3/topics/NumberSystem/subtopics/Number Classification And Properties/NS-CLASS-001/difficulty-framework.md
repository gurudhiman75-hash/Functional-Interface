# NS-CLASS-001 Difficulty Framework

## Difficulty Model

Difficulty is based on the number of properties involved, the expression depth, whether a range or list must be scanned, and whether the final answer is direct classification, count or missing value.

## Easy

Typical features:

- direct even/odd classification
- direct positive/negative classification
- one arithmetic operation
- small positive integers
- short lists of 3 to 5 values
- two consecutive integers
- one condition only

Examples:

- Determine whether \(17+21\) is even or odd.
- Determine the sign of \((-4)\times 5\).
- Count the odd numbers in 1, 2, 3, 4, 5.
- Find the missing integer in 8, 9, x.

## Medium

Typical features:

- two or three operations
- parity after products or powers
- sign after multiple negative factors
- range counting with inclusive/exclusive endpoints
- three consecutive integers
- consecutive even or odd integers
- two combined conditions

Examples:

- Determine whether \(n^2+n\) is even when \(n\) is odd.
- Determine the sign of \((-2)^5 \times (-3)\).
- Count even integers from 24 to 86.
- Three consecutive odd integers have sum 45. Find the middle integer.

## Hard

Typical features:

- mixed parity and sign conditions
- property-based elimination from candidates
- longer ranges
- four or more consecutive terms
- missing number with multiple constraints
- expression sign requiring magnitude comparison
- classification from combined conditions

Examples:

- Find x from a candidate set if \(x+7\) is odd and x is negative.
- Count integers from \(-50\) to 75 that are positive and even.
- Determine whether \((-5)^4-700\) is positive, negative or zero.
- Find four consecutive even integers with a given sum.

## Difficulty Drivers By CP

| CP | Main Drivers |
| --- | --- |
| CP01 | number of operations, variable parity, powers, product length |
| CP02 | count of negative factors, exponent parity, zero handling, magnitude comparison |
| CP03 | sequence type, number of terms, sum/product condition, missing term position |
| CP04 | range size, endpoint inclusion, list length, combined property filters |
| CP05 | number of conditions, specificity of classification, power/parity implication |
| CP06 | number of constraints, candidate count, uniqueness requirement, condition mix |

## Validation Expectations

Future validators should verify:

- parity result independently
- sign result independently
- consecutive sequence step size
- count result from direct enumeration or formula
- classification consistency with all conditions
- uniqueness for missing-number questions
