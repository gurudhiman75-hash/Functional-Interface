# NS-PF-001 Design Review

## Review Status

Review Type: Specification and educational review only

Runtime Implementation: NOT PERFORMED

Generators Created: NO

Solvers Created: NO

Validators Created: NO

Reasoning Graphs Created: NO

Pipelines Created: NO

Tests Created: NO

Runtime Audits Created: NO

## Implementation Readiness Verdict

Verdict: READY WITH MINOR CHANGES

NS-PF-001 has a strong educational structure and a reusable shared prime-factorization abstraction. The canonical problem set is mostly ready for implementation, but implementation should not begin until the listed specification adjustments are made.

The highest-priority fixes are:

- Clarify CP-006 question language so it always asks for a prime power, not an exponent.
- Add prime input numbers as an explicit valid input and coverage category.
- Strengthen explanation templates so every explanation displays the computed prime factorization.

## Strengths

- The package correctly models prime factorization as an ordered prime-exponent vector:

  number = p1^e1 x p2^e2 x ... x pk^ek

- CP-001 through CP-007 are organized as projections of that factorization object.
- The shared abstraction in implementation-plan.md is appropriate and avoids future duplicated logic.
- The package correctly separates total prime factor count from distinct prime factor count.
- CP-004 and CP-005 have distinct extremum outputs.
- Variable ranges cover small, medium, and large composites.
- Repeated-prime, mixed-prime, prime-power, and distinct-factor coverage are present.
- Question language is simple, government-exam style, and mostly self-contained.
- The package clearly forbids runtime implementation until human approval.

## Weaknesses

### 1. CP-006 and CP-007 are distinct only if CP-006 returns a prime power

Current design distinction:

- CP-006 output: highestPrimePower
- CP-007 output: exponent

This distinction is mathematically valid.

Example:

- number = 360
- prime = 2
- factorization = 2^3 x 3^2 x 5
- CP-006 answer = 8
- CP-007 answer = 3

This makes CP-006 and CP-007 educationally distinct.

However, QL-015 currently says:

Find the greatest exponent of {prime} in the prime factorization of {number}.

That stem asks for an exponent, not a prime power. If QL-015 remains under CP-006, CP-006 partly collapses into CP-007.

Recommendation:

- Keep CP-006 output as highestPrimePower.
- Keep CP-006 answer for 360 and prime 2 as 8.
- Move QL-015 to CP-007, or replace it with a CP-006-safe stem such as: "Find the highest power of {prime} that divides {number}."

### 2. Prime input numbers are currently excluded by default

variable-ranges.library.json has:

- minimum = 2
- defaultCompositeOnly = true
- note says prime-only factorization values are excluded unless future human approval permits them

This creates a specification mismatch. Prime numbers are mathematically valid inputs for prime factorization tasks.

Expected outputs for prime input p:

| CP | Example Input | Expected Output |
| --- | --- | --- |
| CP-001 | number = 13 | 13 |
| CP-002 | number = 13 | 1 |
| CP-003 | number = 13 | 1 |
| CP-004 | number = 13 | 13 |
| CP-005 | number = 13 | 13 |
| CP-006 | number = 13, prime = 13 | 13 |
| CP-007 | number = 13, prime = 13 | 1 |

Prime input numbers should be valid for all seven CPs, with CP-006 and CP-007 requiring selected prime = number when the input number is prime.

Recommendation:

- Change prime inputs from excluded-by-default to approved.
- Add Prime Input Numbers as a required coverage category.
- Keep composite numbers as the dominant generation category if desired, but do not exclude primes.

### 3. Explanation templates do not consistently display factorization evidence

The review requirement says explanations should explicitly display the prime factorization result, for example:

360 = 2^3 x 3^2 x 5

Current ES-001 includes {factorization}.

Current ES-002 through ES-007 tell the learner to write the factorization but do not include {factorization}. That creates hidden reasoning in explanations for CP-002 through CP-007.

Recommendation:

- Add {factorization} to ES-002 through ES-007.
- For CP-006, include the selected prime exponent and the resulting prime power.
- For CP-007, include the selected prime exponent.

### 4. CP-007 selected prime policy may be too narrow

The current design requires the selected prime to be a factor of number for CP-007.

That is valid for a basic exponent lookup design, but a full exponent lookup topology often allows absent primes with exponent 0.

Example:

- number = 360
- prime = 7
- exponent of 7 = 0

Recommendation:

- Decide explicitly whether CP-007 allows exponent 0.
- If exponent 0 is allowed, add coverage for absent selected primes.
- If exponent 0 is not allowed, keep the current rule and state that CP-007 is positive-exponent lookup only.

This is not a blocker if the educational intent is beginner-friendly positive lookup.

## Canonical Problems Review

### CP-001 Prime Factorization

Status: Mathematically correct.

Topology: Full factorization vector.

Output: factorization.

Distinctness: Non-redundant. No other CP outputs the complete factorization.

Prime input behavior:

- number = 13
- answer = 13

Adjustment needed:

- Prime inputs should be allowed and covered.

### CP-002 Count Prime Factors

Status: Mathematically correct.

Topology: Total multiplicity count.

Output: totalPrimeFactorCount.

Distinctness: Non-redundant. It counts repeated factors.

Prime input behavior:

- number = 13
- answer = 1

Adjustment needed:

- Explanation should display the factorization.

### CP-003 Count Distinct Prime Factors

Status: Mathematically correct.

Topology: Distinct support count.

Output: distinctPrimeFactorCount.

Distinctness: Non-redundant. It ignores repetition.

Prime input behavior:

- number = 13
- answer = 1

Adjustment needed:

- Explanation should display the factorization.

### CP-004 Largest Prime Factor

Status: Mathematically correct.

Topology: Maximum prime base.

Output: largestPrimeFactor.

Distinctness: Non-redundant.

Prime input behavior:

- number = 13
- answer = 13

Adjustment needed:

- Add explicit largest-prime-factor size coverage to coverage targets, not only primeBaseCoverage.

### CP-005 Smallest Prime Factor

Status: Mathematically correct.

Topology: Minimum prime base.

Output: smallestPrimeFactor.

Distinctness: Non-redundant.

Prime input behavior:

- number = 13
- answer = 13

Adjustment needed:

- Add explicit smallest-prime-factor coverage or state that primeBaseCoverage is sufficient.

### CP-006 Highest Power Of A Prime

Status: Correct only if answer is a prime power.

Topology: Selected prime power lookup.

Output should remain: highestPrimePower.

Example:

- number = 360
- prime = 2
- factorization = 2^3 x 3^2 x 5
- highestPrimePower = 2^3 = 8
- answer = 8

Distinctness: Non-redundant if output is 8. Redundant with CP-007 if output is 3.

Adjustment needed:

- Remove or move QL-015 because it asks for exponent, not highest prime power.
- ES-006 should display the factorization and the selected prime power.

### CP-007 Prime Exponent Lookup

Status: Mathematically correct.

Topology: Selected exponent lookup.

Output: exponent.

Example:

- number = 360
- prime = 2
- factorization = 2^3 x 3^2 x 5
- exponent = 3
- answer = 3

Distinctness: Non-redundant if CP-006 returns prime power.

Adjustment needed:

- QL-017 says "Find the power of {prime} in {number}." This may be ambiguous because "power" can mean exponent or prime power.
- Prefer "Find the exponent of {prime} in {number}." if exact wording is still open.

## Variable Ranges Review

Status: Mostly sound, but missing prime input coverage.

Easy:

- Range 4 to 200 is reasonable for small composites.
- Gap: excludes prime inputs 2 and 3.

Medium:

- Range 201 to 5000 is reasonable.
- Composite coverage is adequate.
- Prime-heavy and mixed-prime categories are included.

Hard:

- Range 5001 to 100000 is reasonable.
- Hard maxExponent 10 is adequate.
- Hard distinctPrimeFactorCount minimum 3 may unintentionally exclude hard prime powers and hard semiprimes.

Dead zones:

- No numeric dead zones between difficulty bands.
- Prime input numbers are a conceptual dead zone because they are excluded by default.

Recommended adjustments:

- Allow prime input numbers across all difficulty bands.
- Add a prime_input number shape.
- Consider allowing Hard distinctPrimeFactorCount 1 to 5, because hard prime powers such as 2^16 or large-prime powers are educationally useful.
- Add explicit exponent-size buckets beyond "4+" if hard exponent coverage matters.

## Question Language Review

Overall status: Mostly self-contained.

All entries contain the required visible variables:

- CP-001 through CP-005 include {number}.
- CP-006 and CP-007 include both {prime} and {number}.

Issues:

| ID | Issue | Recommendation |
| --- | --- | --- |
| QL-015 | Asks for greatest exponent but belongs to CP-006 highestPrimePower. | Move to CP-007 or replace with a highest-prime-power stem. |
| QL-017 | "Find the power of {prime} in {number}" is ambiguous. | Use "exponent" if CP-007 returns exponent. |

No stem has hidden variables.

No stem is placeholder-only.

Runtime risk:

- If QL-015 remains in CP-006, the runtime may render an exponent question but expect a prime-power answer.

## Explanation Language Review

Overall status: Needs minor strengthening before implementation.

Strong:

- Simple wording.
- Short step-by-step style.
- ES-001 includes {factorization}.

Weak:

- ES-002 through ES-007 do not display {factorization}.
- ES-006 does not explicitly show selectedPrime^selectedExponent or the prime power value.
- ES-007 does not show the factorization evidence for the exponent.

Recommendation:

- Add {factorization} to every explanation family.
- Add explicit evidence lines:

  For CP-006:

  The exponent of {prime} is {exponent}.

  So the highest power is {prime}^{exponent} = {answer}.

  For CP-007:

  In the factorization, the exponent of {prime} is {answer}.

## Coverage Targets Review

Coverage exists for:

- Repeated-prime numbers.
- Prime-power numbers through exponent buckets.
- Mixed-prime numbers through numberShapeCoverage.
- Distinct-prime-factor counts.
- Exponent sizes.
- Difficulty bands.
- Question language IDs.
- Explanation IDs.

Blind spots:

- Prime input numbers are not a coverage category.
- Composite numbers are implied by numberShapeCoverage but not explicit.
- Highest-prime-factor size coverage is implied by primeBaseCoverage but not separately required for CP-004.
- Smallest-prime-factor coverage is implied by primeBaseCoverage but not separately required for CP-005.
- CP-007 does not decide whether exponent 0 is allowed or excluded.

Recommended coverage additions:

- primeInputCoverage
- compositeInputCoverage
- largestPrimeFactorCoverage
- smallestPrimeFactorCoverage
- selectedPrimeCoverage
- selectedExponentCoverage
- absentSelectedPrimeCoverage only if CP-007 allows exponent 0

## Risks

- CP-006 may collapse into CP-007 if QL-015 is used without changing the expected answer.
- Prime inputs may be incorrectly rejected even though they are mathematically valid.
- Explanation rendering may pass structurally while hiding the actual factorization evidence from learners.
- Future coverage reporting may miss prime input numbers and extremum-specific factor coverage.
- Ambiguous "power" language may cause answer-format inconsistency.

## Recommended Adjustments

1. Keep CP-006 as highestPrimePower.
2. Define CP-006 answer for number = 360 and prime = 2 as 8.
3. Move QL-015 to CP-007 or replace it with unambiguous prime-power wording.
4. Clarify QL-017 or replace "power" with "exponent."
5. Allow prime input numbers for all CPs.
6. Add prime_input as a required number shape and coverage target.
7. Add compositeInputCoverage explicitly.
8. Add {factorization} to ES-002 through ES-007.
9. Add explicit CP-006 explanation evidence showing p^e and its value.
10. Decide whether CP-007 supports exponent 0 for selected primes that do not divide the number.

## Final Verdict

NS-PF-001 is READY WITH MINOR CHANGES.

The core mathematical design is correct and the seven CPs can remain active. The package should not move to implementation until the CP-006 wording conflict, prime input policy, and explanation evidence gaps are corrected.
