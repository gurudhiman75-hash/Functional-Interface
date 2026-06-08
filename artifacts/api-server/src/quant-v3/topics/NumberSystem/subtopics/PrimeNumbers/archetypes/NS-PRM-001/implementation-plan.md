# NS-PRM-001 Implementation Plan

## Status

Planning document only.

No runtime implementation is authorized by this package.

## Architecture Commitment

Future implementation must reuse the Number System architecture patterns from:

- NS-DIV-001
- NS-REM-001
- NS-REM-002

Future implementation must not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Audit Framework
- Coverage Framework
- Human Review Framework

## CP-001 Prime Check

Educational Objective:

Classify a number as prime or composite.

Inputs:

- number

Outputs:

- Prime or Composite

Variable Universe:

- number from approved difficulty band range

Shared Abstraction:

Prime Classification.

Solver Topology:

Determine whether the number has exactly two factors.

Difficulty Drivers:

- number size
- factor-check complexity
- prime/composite answer exposure

Coverage Requirements:

- difficulty coverage
- prime coverage
- composite coverage
- CP-001 answer distribution
- question language coverage
- explanation coverage

Required Parameters:

- number
- difficultyBand
- questionId
- traceability identifiers

Required Solver:

Return Prime or Composite.

Required Reasoning Graph:

Record number, classification rule, classification result, and final answer.

Required Validation:

Validate number range, answer class, explanation style, question language, and traceability.

Reject number = 1 because 1 is neither Prime nor Composite.

Required Audit Coverage:

Report prime/composite answer distribution.

Coverage target:

- Prime answers: 50%
- Composite answers: 50%

This is a coverage target, not a generation guarantee.

Traceability Requirements:

Every output must include archetype ID, CP ID, question ID, reasoning pattern ID, and source trace.

## CP-002 Count Primes In Range

Educational Objective:

Count prime numbers in an inclusive range.

Inputs:

- lowerBound
- upperBound

Outputs:

- integer count

Variable Universe:

- lowerBound from approved difficulty band range
- upperBound from approved difficulty band range
- rangeWidth from approved difficulty band range

Shared Abstraction:

Range Prime Enumeration.

Solver Topology:

Identify primes in [lowerBound, upperBound] and count them.

Difficulty Drivers:

- range width
- bound size
- number of primes in range

Coverage Requirements:

- difficulty coverage
- range coverage
- zero-prime range audit signal
- question language coverage
- explanation coverage

Required Parameters:

- lowerBound
- upperBound
- difficultyBand
- questionId
- traceability identifiers

Required Solver:

Return count of primes in the inclusive range.

Empty Prime Range Policy:

Ranges with zero primes are allowed.

Expected answer:

- 0

Exactly-One-Prime Policy:

Ranges with exactly one prime are allowed.

Expected answer:

- 1

Required Reasoning Graph:

Record range, prime list or prime count evidence, and final answer.

Required Validation:

Validate inclusive bounds, count correctness, question language, explanation, and traceability.

Required Audit Coverage:

Report range buckets and zero-prime range frequency.

Numeric range coverage buckets:

- small: rangeWidth 5-50
- medium: rangeWidth 51-250
- large: rangeWidth 251-1000

Traceability Requirements:

Every output must include archetype ID, CP ID, question ID, reasoning pattern ID, and source trace.

## CP-003 Smallest Prime In Range

Educational Objective:

Find the least prime in an inclusive range.

Inputs:

- lowerBound
- upperBound

Outputs:

- single prime integer

Variable Universe:

- lowerBound from approved difficulty band range
- upperBound from approved difficulty band range
- rangeWidth from approved difficulty band range

Shared Abstraction:

Range Prime Enumeration.

Solver Topology:

Identify primes in [lowerBound, upperBound] and select the smallest.

Difficulty Drivers:

- range width
- distance from lower bound to first prime
- bound size

Coverage Requirements:

- difficulty coverage
- range coverage
- at least one prime in generated range
- question language coverage
- explanation coverage

Required Parameters:

- lowerBound
- upperBound
- difficultyBand
- questionId
- traceability identifiers

Required Solver:

Return smallest prime in the inclusive range.

Empty Prime Range Policy:

Ranges with zero primes are not allowed.

Future generation must regenerate invalid ranges.

Exactly-One-Prime Policy:

Ranges with exactly one prime are allowed.

Expected answer:

- that prime

Required Reasoning Graph:

Record range, prime search result, smallest prime, and final answer.

Required Validation:

Validate range contains the answer, answer is prime, no smaller in-range prime exists, and traceability is complete.

Required Audit Coverage:

Report range buckets and answer distribution.

Numeric range coverage buckets:

- small: rangeWidth 5-50
- medium: rangeWidth 51-250
- large: rangeWidth 251-1000

Traceability Requirements:

Every output must include archetype ID, CP ID, question ID, reasoning pattern ID, and source trace.

## CP-004 Greatest Prime In Range

Educational Objective:

Find the greatest prime in an inclusive range.

Inputs:

- lowerBound
- upperBound

Outputs:

- single prime integer

Variable Universe:

- lowerBound from approved difficulty band range
- upperBound from approved difficulty band range
- rangeWidth from approved difficulty band range

Shared Abstraction:

Range Prime Enumeration.

Solver Topology:

Identify primes in [lowerBound, upperBound] and select the greatest.

Difficulty Drivers:

- range width
- distance from upper bound to last prime
- bound size

Coverage Requirements:

- difficulty coverage
- range coverage
- at least one prime in generated range
- question language coverage
- explanation coverage

Required Parameters:

- lowerBound
- upperBound
- difficultyBand
- questionId
- traceability identifiers

Required Solver:

Return greatest prime in the inclusive range.

Empty Prime Range Policy:

Ranges with zero primes are not allowed.

Future generation must regenerate invalid ranges.

Exactly-One-Prime Policy:

Ranges with exactly one prime are allowed.

Expected answer:

- that prime

Required Reasoning Graph:

Record range, prime search result, greatest prime, and final answer.

Required Validation:

Validate range contains the answer, answer is prime, no greater in-range prime exists, and traceability is complete.

Required Audit Coverage:

Report range buckets and answer distribution.

Numeric range coverage buckets:

- small: rangeWidth 5-50
- medium: rangeWidth 51-250
- large: rangeWidth 251-1000

Traceability Requirements:

Every output must include archetype ID, CP ID, question ID, reasoning pattern ID, and source trace.

## CP-005 Sum Of Primes In Range

Educational Objective:

Sum all primes in an inclusive range.

Inputs:

- lowerBound
- upperBound

Outputs:

- integer sum

Variable Universe:

- lowerBound from approved difficulty band range
- upperBound from approved difficulty band range
- rangeWidth from approved difficulty band range

Shared Abstraction:

Range Prime Enumeration.

Solver Topology:

Identify primes in [lowerBound, upperBound] and sum them.

Difficulty Drivers:

- range width
- bound size
- number of primes
- sum size

Coverage Requirements:

- difficulty coverage
- range coverage
- zero-prime range audit signal
- question language coverage
- explanation coverage

Required Parameters:

- lowerBound
- upperBound
- difficultyBand
- questionId
- traceability identifiers

Required Solver:

Return sum of all primes in the inclusive range.

Empty Prime Range Policy:

Ranges with zero primes are allowed.

Expected answer:

- 0

Exactly-One-Prime Policy:

Ranges with exactly one prime are allowed.

Expected answer:

- that prime

Required Reasoning Graph:

Record range, valid primes or summation evidence, and final answer.

Required Validation:

Validate inclusive bounds, sum correctness, question language, explanation, and traceability.

Required Audit Coverage:

Report range buckets and zero-prime range frequency.

Numeric range coverage buckets:

- small: rangeWidth 5-50
- medium: rangeWidth 51-250
- large: rangeWidth 251-1000

Traceability Requirements:

Every output must include archetype ID, CP ID, question ID, reasoning pattern ID, and source trace.

## CP-006 Next Prime

Educational Objective:

Find the first prime greater than the given number.

Inputs:

- number

Outputs:

- single prime integer

Variable Universe:

- number from approved difficulty band range

Shared Abstraction:

Directional Prime Search.

Solver Topology:

Check numbers greater than number until the first prime is found.

Difficulty Drivers:

- number size
- distance to next prime

Coverage Requirements:

- difficulty coverage
- number range coverage
- question language coverage
- explanation coverage

Required Parameters:

- number
- difficultyBand
- questionId
- traceability identifiers

Required Solver:

Return first prime greater than number.

Required Reasoning Graph:

Record start number, search direction, selected prime, and final answer.

Required Validation:

Validate answer is prime, answer is greater than number, no smaller prime greater than number exists, and traceability is complete.

Reject number = 1.

Required Audit Coverage:

Report difficulty and number-range exposure.

Traceability Requirements:

Every output must include archetype ID, CP ID, question ID, reasoning pattern ID, and source trace.

## CP-007 Previous Prime

Educational Objective:

Find the greatest prime smaller than the given number.

Inputs:

- number

Outputs:

- single prime integer

Variable Universe:

- number from approved difficulty band range
- number must be at least 3

Explicit Minimum Input Rule:

number >= 3

Reason:

A previous prime must exist.

Shared Abstraction:

Directional Prime Search.

Solver Topology:

Check numbers smaller than number until the first prime is found.

Difficulty Drivers:

- number size
- distance to previous prime

Coverage Requirements:

- difficulty coverage
- number range coverage
- question language coverage
- explanation coverage

Required Parameters:

- number
- difficultyBand
- questionId
- traceability identifiers

Required Solver:

Return greatest prime smaller than number.

Required Reasoning Graph:

Record start number, search direction, selected prime, and final answer.

Required Validation:

Validate answer is prime, answer is smaller than number, no greater prime smaller than number exists, and traceability is complete.

Reject number = 1.

Reject number < 3.

Required Audit Coverage:

Report difficulty and number-range exposure.

Traceability Requirements:

Every output must include archetype ID, CP ID, question ID, reasoning pattern ID, and source trace.

## CP-008 Prime Position

Educational Objective:

Find the nth prime number.

Inputs:

- position

Outputs:

- single prime integer

Variable Universe:

- position from approved difficulty band range

Shared Abstraction:

Prime Enumeration / Position Lookup.

Solver Topology:

Enumerate primes in order until the requested position is reached.

Difficulty Drivers:

- position size
- enumeration length

Coverage Requirements:

- difficulty coverage
- position coverage buckets
- question language coverage
- explanation coverage

Required Parameters:

- position
- difficultyBand
- questionId
- traceability identifiers

Required Solver:

Return the prime number at the requested position.

Required Reasoning Graph:

Record requested position, enumeration evidence, selected prime, and final answer.

Required Validation:

Validate position is approved, answer is prime, answer has the requested ordinal position, and traceability is complete.

Required Audit Coverage:

Report CP-008 position buckets: 1-25, 26-50, 51-100, 101-250, 251-500.

Traceability Requirements:

Every output must include archetype ID, CP ID, question ID, reasoning pattern ID, and source trace.
