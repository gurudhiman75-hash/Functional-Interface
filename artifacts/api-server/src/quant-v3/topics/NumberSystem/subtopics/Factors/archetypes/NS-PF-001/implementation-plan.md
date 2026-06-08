# NS-PF-001 Implementation Plan

## Status

Plan Status: DESIGN PACKAGE CREATED

Implementation Status: NOT STARTED

## Summary

NS-PF-001 must implement only the approved non-redundant canonical problem set after human approval:

- CP-001 through CP-007

No implementation may begin until this design package is approved.

## Architecture To Reuse

Use the established Number System architecture from:

- NS-DIV-001
- NS-REM-001
- NS-REM-002
- NS-PRM-001

Future implementation must reuse:

- Library registry
- Parameter generator
- Solver
- Reasoning graph builder
- Explanation renderer
- Validator
- Pipeline
- Coverage auditor
- Traceability contract
- Maturity audit

Do not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Audit Framework
- Coverage Framework
- Human Review Framework

## Shared Abstraction

All CPs must share a prime factorization abstraction:

numberFactorization:

- number
- orderedPrimeBases
- exponentsByPrime
- factorizationText
- repeatedPrimeFactors
- totalPrimeFactorCount
- distinctPrimeFactorCount
- smallestPrimeFactor
- largestPrimeFactor

For CP-006 and CP-007:

- selectedPrime
- selectedExponent
- selectedPrimePower

The future solver, reasoning graph, explanation renderer, validator, and audit tooling must derive CP-specific answers from this shared abstraction.

Prime input policy:

- Prime numbers are valid generated inputs.
- For a prime input p, the factorization is p.
- For CP-006 and CP-007 with a prime input p, selectedPrime must be p.

Exponent zero policy:

- Approved policy: Option A.
- For CP-006 and CP-007, selectedPrime must divide number.
- selectedExponent is always positive.
- Exponent 0 cases are outside the active beginner-friendly implementation boundary.

CP-006 / CP-007 output distinction:

- CP-006 returns selectedPrimePower.
- CP-007 returns selectedExponent.
- For number = 360 and prime = 2, CP-006 returns 8 and CP-007 returns 3.

## CP-001 Prime Factorization

Educational Objective:

Output the complete prime factorization of a number.

Inputs:

- number

Outputs:

- factorization

Variable Universe:

- number from approved difficulty band ranges.
- number must be an integer greater than 1.
- prime input numbers are valid.
- composite input numbers are valid.

Shared Abstraction:

- numberFactorization
- factorizationText

Solver Topology:

- Build complete ordered prime factorization.
- Render prime powers in increasing prime order.

Difficulty Drivers:

- number size
- largest prime factor size
- total prime factor count
- maximum exponent
- number shape

Coverage Requirements:

- difficulty coverage
- prime base coverage
- prime power coverage
- distinct factor count coverage
- repeated factor coverage
- question language coverage
- explanation coverage

Required Parameters:

- cpId
- difficulty
- number
- questionLanguageId
- explanationStyleId

Required Future Solver:

- Prime factorization solver using shared abstraction.

Required Future Reasoning Graph:

- Record factorization steps, ordered prime bases, exponents, and final factorization.

Required Future Validation:

- Validate number range, composite policy, factorization correctness, ordered prime bases, and answer text.

Required Future Audit Coverage:

- Report difficulty, prime inputs, composite inputs, number shape, prime bases, prime powers, repeated factors, question language, and explanation language.

Traceability Requirements:

- Trace archetypeId, cpId, library IDs, selected difficulty band, question language ID, explanation style ID, and all generated variables.

## CP-002 Count Prime Factors

Educational Objective:

Count prime factors including repetition.

Inputs:

- number

Outputs:

- totalPrimeFactorCount

Variable Universe:

- number from approved difficulty band ranges.
- number must be an integer greater than 1.
- prime input numbers are valid.
- composite input numbers are valid.
- number must expose prime, repeated, and mixed factor cases across future coverage batches.

Shared Abstraction:

- numberFactorization
- exponentsByPrime
- totalPrimeFactorCount

Solver Topology:

- Build complete factorization.
- Sum all exponents.

Difficulty Drivers:

- total prime factor count
- maximum exponent
- number size
- number shape

Coverage Requirements:

- difficulty coverage
- prime base coverage
- prime power coverage
- repeated factor coverage
- question language coverage
- explanation coverage

Required Parameters:

- cpId
- difficulty
- number
- questionLanguageId
- explanationStyleId

Required Future Solver:

- Multiplicity-count solver derived from shared factorization abstraction.

Required Future Reasoning Graph:

- Record factorization and exponent sum.

Required Future Validation:

- Validate answer equals sum of exponents.

Required Future Audit Coverage:

- Report prime inputs, composite inputs, factor count buckets, and repeated-factor exposure.

Traceability Requirements:

- Trace archetypeId, cpId, library IDs, selected difficulty band, question language ID, explanation style ID, and all generated variables.

## CP-003 Count Distinct Prime Factors

Educational Objective:

Count different prime factors.

Inputs:

- number

Outputs:

- distinctPrimeFactorCount

Variable Universe:

- number from approved difficulty band ranges.
- number must be an integer greater than 1.
- prime input numbers are valid.
- composite input numbers are valid.
- number must expose approved distinct factor count buckets across future coverage batches.

Shared Abstraction:

- numberFactorization
- orderedPrimeBases
- distinctPrimeFactorCount

Solver Topology:

- Build complete factorization.
- Count distinct prime bases.

Difficulty Drivers:

- distinct prime factor count
- number size
- largest prime factor size
- number shape

Coverage Requirements:

- difficulty coverage
- prime base coverage
- distinct factor count coverage
- question language coverage
- explanation coverage

Required Parameters:

- cpId
- difficulty
- number
- questionLanguageId
- explanationStyleId

Required Future Solver:

- Distinct-support count solver derived from shared factorization abstraction.

Required Future Reasoning Graph:

- Record ordered prime bases and count.

Required Future Validation:

- Validate answer equals count of distinct prime bases.

Required Future Audit Coverage:

- Report prime inputs, composite inputs, and distinct factor count buckets.

Traceability Requirements:

- Trace archetypeId, cpId, library IDs, selected difficulty band, question language ID, explanation style ID, and all generated variables.

## CP-004 Largest Prime Factor

Educational Objective:

Find the largest prime factor of a number.

Inputs:

- number

Outputs:

- largestPrimeFactor

Variable Universe:

- number from approved difficulty band ranges.
- number must include at least one prime factor.
- prime input numbers are valid.
- composite input numbers are valid.

Shared Abstraction:

- numberFactorization
- orderedPrimeBases
- largestPrimeFactor

Solver Topology:

- Build complete factorization.
- Select maximum prime base.

Difficulty Drivers:

- largest prime factor size
- number size
- number shape

Coverage Requirements:

- difficulty coverage
- prime base coverage
- largest prime factor bucket coverage
- question language coverage
- explanation coverage

Required Parameters:

- cpId
- difficulty
- number
- questionLanguageId
- explanationStyleId

Required Future Solver:

- Prime-base maximum solver derived from shared factorization abstraction.

Required Future Reasoning Graph:

- Record factorization and selected largest prime base.

Required Future Validation:

- Validate answer is prime, divides number, and is the maximum prime factor.

Required Future Audit Coverage:

- Report prime inputs, composite inputs, and largest prime factor buckets.

Traceability Requirements:

- Trace archetypeId, cpId, library IDs, selected difficulty band, question language ID, explanation style ID, and all generated variables.

## CP-005 Smallest Prime Factor

Educational Objective:

Find the smallest prime factor of a number.

Inputs:

- number

Outputs:

- smallestPrimeFactor

Variable Universe:

- number from approved difficulty band ranges.
- number must include at least one prime factor.
- prime input numbers are valid.
- composite input numbers are valid.

Shared Abstraction:

- numberFactorization
- orderedPrimeBases
- smallestPrimeFactor

Solver Topology:

- Build complete factorization.
- Select minimum prime base.

Difficulty Drivers:

- smallest prime factor visibility
- number parity
- number size
- number shape

Coverage Requirements:

- difficulty coverage
- prime base coverage
- smallest prime factor bucket coverage
- question language coverage
- explanation coverage

Required Parameters:

- cpId
- difficulty
- number
- questionLanguageId
- explanationStyleId

Required Future Solver:

- Prime-base minimum solver derived from shared factorization abstraction.

Required Future Reasoning Graph:

- Record factorization and selected smallest prime base.

Required Future Validation:

- Validate answer is prime, divides number, and is the minimum prime factor.

Required Future Audit Coverage:

- Report prime inputs, composite inputs, and smallest prime factor buckets.

Traceability Requirements:

- Trace archetypeId, cpId, library IDs, selected difficulty band, question language ID, explanation style ID, and all generated variables.

## CP-006 Highest Power Of A Prime

Educational Objective:

Find the highest power of a selected prime that divides the number.

Inputs:

- number
- prime

Outputs:

- highestPrimePower

Variable Universe:

- number from approved difficulty band ranges.
- prime selected from the prime factors of number.
- selectedExponent must be at least 1.
- prime input numbers are valid when selectedPrime equals number.

Shared Abstraction:

- numberFactorization
- selectedPrime
- selectedExponent
- selectedPrimePower

Solver Topology:

- Build complete factorization.
- Locate selected prime exponent.
- Return selectedPrime^selectedExponent as a value.
- Do not return selectedExponent as the CP-006 answer.

Output Example:

- number = 360
- prime = 2
- factorization = 2^3 x 3^2 x 5
- selectedExponent = 3
- selectedPrimePower = 8
- answer = 8

Difficulty Drivers:

- selected prime size
- selected exponent
- number size
- number shape

Coverage Requirements:

- difficulty coverage
- prime base coverage
- prime power coverage
- repeated factor coverage
- question language coverage
- explanation coverage

Required Parameters:

- cpId
- difficulty
- number
- prime
- questionLanguageId
- explanationStyleId

Required Future Solver:

- Selected-prime-power solver derived from shared factorization abstraction.

Required Future Reasoning Graph:

- Record factorization, selected prime, selected exponent, selected power expression, and final answer.

Required Future Validation:

- Validate selected prime is prime, divides number, exponent is correct, and selected prime power divides number while the next higher power does not.
- Validate answer is selectedPrimePower, not selectedExponent.

Required Future Audit Coverage:

- Report prime inputs, composite inputs, selected prime buckets, selected exponent buckets, and prime power buckets.

Traceability Requirements:

- Trace archetypeId, cpId, library IDs, selected difficulty band, question language ID, explanation style ID, number, selected prime, and selected answer.

## CP-007 Prime Exponent Lookup

Educational Objective:

Find the exponent of a selected prime in the prime factorization of the number.

Inputs:

- number
- prime

Outputs:

- exponent

Variable Universe:

- number from approved difficulty band ranges.
- prime selected from the prime factors of number.
- selectedExponent must be at least 1.
- prime input numbers are valid when selectedPrime equals number.
- selectedPrime must divide number; exponent 0 is not active for NS-PF-001.

Shared Abstraction:

- numberFactorization
- selectedPrime
- selectedExponent

Solver Topology:

- Build complete factorization.
- Locate selected prime exponent.
- Return selectedExponent only.
- Do not return selectedPrimePower as the CP-007 answer.

Output Example:

- number = 360
- prime = 2
- factorization = 2^3 x 3^2 x 5
- answer = 3

Difficulty Drivers:

- selected prime size
- selected exponent
- number size
- number shape

Coverage Requirements:

- difficulty coverage
- prime base coverage
- prime power coverage
- repeated factor coverage
- question language coverage
- explanation coverage

Required Parameters:

- cpId
- difficulty
- number
- prime
- questionLanguageId
- explanationStyleId

Required Future Solver:

- Selected-exponent lookup solver derived from shared factorization abstraction.

Required Future Reasoning Graph:

- Record factorization, selected prime, selected exponent, and final answer.

Required Future Validation:

- Validate selected prime is prime, divides number, and answer equals the selected prime exponent.
- Validate answer is selectedExponent, not selectedPrimePower.

Required Future Audit Coverage:

- Report prime inputs, composite inputs, selected prime buckets, and selected exponent buckets.

Traceability Requirements:

- Trace archetypeId, cpId, library IDs, selected difficulty band, question language ID, explanation style ID, number, selected prime, and selected answer.

## Libraries Created In This Design Package

- variable-ranges.library.json
- coverage-targets.library.json
- question-language.library.json
- explanation.library.json
- distribution-targets.library.json

## Validation Requirements

Future validators must reject:

- Unknown CP IDs.
- Missing library entries.
- Non-self-contained rendered questions.
- Invalid number ranges.
- number <= 1.
- Non-prime selected prime.
- Selected prime not dividing number for CP-006 and CP-007.
- Exponent 0 cases for CP-006 and CP-007.
- Incorrect prime factorization.
- Incorrect multiplicity count.
- Incorrect distinct factor count.
- Incorrect smallest or largest prime factor.
- Incorrect highest prime power.
- Incorrect exponent lookup.

## Testing Requirements

Create tests only during future implementation.

No tests are authorized by this design package.

## Audit Requirements

Generate audits only during future implementation.

Future audit coverage must report:

- Difficulty Coverage
- Prime Input Coverage
- Composite Input Coverage
- Prime Base Coverage
- Largest Prime Factor Coverage
- Smallest Prime Factor Coverage
- Selected Prime Coverage
- Selected Exponent Coverage
- Prime Power Coverage
- Distinct Factor Count Coverage
- Repeated Factor Coverage
- Question Language Coverage
- Explanation Coverage
- Most Used
- Least Used
- Unused
- Coverage Gaps

## Implementation Gate

Implementation may begin only after:

1. This design package is approved.
2. Human-owned question language is confirmed.
3. Human-owned explanation language is confirmed.
4. Variable ranges and coverage targets are approved.
