# NS-PRM-001 Design Review

## Review Status

Review Type: Educational and specification review only

Runtime Implementation Status: NOT IMPLEMENTED

Review Verdict: READY WITH MINOR CHANGES

## 1. Canonical Problems

### Findings

CP-001 through CP-008 are mathematically distinct.

The approved canonical problem set covers these distinct topologies:

- CP-001: Prime Classification
- CP-002: Range Counting
- CP-003: Range Search Minimum
- CP-004: Range Search Maximum
- CP-005: Range Summation
- CP-006: Forward Prime Search
- CP-007: Backward Prime Search
- CP-008: Prime Enumeration / Position Lookup

### Redundancy Review

No direct mathematical redundancy was found.

CP-003 and CP-004 share the same range-prime enumeration abstraction, but they ask for opposite extremal values and produce different answer rules.

CP-006 and CP-007 are directional search problems. They overlap conceptually with CP-003 and CP-004, but their input structure is different:

- CP-003 and CP-004 are bounded range problems.
- CP-006 and CP-007 are unbounded directional search problems from a given number.

This is a valid educational distinction.

### Missing Major Topologies

No mandatory foundational prime-number topology is missing for this archetype's stated scope.

Prime factorization, HCF/LCM through primes, advanced modular arithmetic, and olympiad-style prime reasoning are correctly excluded from NS-PRM-001.

## 2. Variable Ranges

### Easy

Approved ranges:

- number: 2-100
- lowerBound: 2-100
- upperBound: 10-200
- rangeWidth: 5-50
- position: 1-25

Assessment:

Easy range is suitable for basic prime recognition, small range enumeration, and small nth-prime lookup.

### Medium

Approved ranges:

- number: 101-1000
- lowerBound: 50-1000
- upperBound: 100-2000
- rangeWidth: 25-250
- position: 26-100

Assessment:

Medium range provides a reasonable step up from Easy without an unrealistic jump.

### Hard

Approved ranges:

- number: 1001-5000
- lowerBound: 500-5000
- upperBound: 1000-6000
- rangeWidth: 100-1000
- position: 101-500

Assessment:

Hard range is implementation-feasible and educationally suitable for competitive-exam style generation. The 500th prime remains computationally modest for a future runtime implementation.

### Range Review

No major dead zones were found.

The ranges provide adequate coverage for:

- small prime checks
- medium prime checks
- large prime checks
- short ranges
- moderate ranges
- large ranges
- nth-prime lookup through position 500

### Minor Risk

The global Easy number range begins at 2, which excludes number = 1. This is mathematically clean for Prime/Composite output because 1 is neither prime nor composite, but the edge case should be explicitly documented as an invalid input or excluded value during implementation.

## 3. Prime Edge Cases

### Number = 1

Current expected behavior:

1 is outside the approved number range.

Review finding:

This is acceptable, but future validation must explicitly reject 1 for CP-001, CP-006, and CP-007 rather than silently classifying it.

### Number = 2

Current expected behavior:

2 is included in Easy number range.

Review finding:

2 should classify as Prime for CP-001. For CP-007, the CP-specific minimum number is 3, so 2 must not be generated for Previous Prime.

### Number = 3

Current expected behavior:

3 is included in Easy number range.

Review finding:

3 should classify as Prime for CP-001. For CP-007, previous prime should be 2. This is a required future validation case.

### Ranges With No Primes

Current expected behavior:

Allowed for CP-002 and CP-005 only.

Review finding:

Correct. Count may be 0 and sum may be 0. These should be audit signals and should not dominate generation.

### Ranges With Exactly One Prime

Current expected behavior:

Allowed for CP-002 through CP-005.

Review finding:

Correct. These are important edge cases:

- CP-002 answer is 1.
- CP-003 and CP-004 return the same prime.
- CP-005 returns that prime.

This is not redundancy; it is a valid edge-case convergence.

### Large Prime Positions

Current expected behavior:

CP-008 supports positions up to 500.

Review finding:

Implementation-ready. The approved position buckets are adequate:

- 1-25
- 26-50
- 51-100
- 101-250
- 251-500

## 4. Question Language

### Strengths

All QL entries are self-contained.

All range entries visibly include:

- lowerBound
- upperBound

All number-based entries visibly include:

- number

All position-based entries visibly include:

- position

The wording is short, simple, and close to government-exam style.

### Unused Variables

No unused required variables were found in the question language library.

### Ambiguous Wording

The earlier ambiguous "given range" language has been repaired in the approved design package.

### Potential Language Defect

QL-017 uses:

Find the {position}th prime number.

This can render awkward forms such as:

- 1th
- 2th
- 3th
- 21th

Recommendation:

Before runtime implementation, either:

- treat ordinal suffix rendering as a renderer responsibility, or
- replace QL-017 with wording that avoids ordinal suffixes.

Example repair direction:

Find the prime number at position {position}.

## 5. Explanation Language

### Strengths

The explanation library is simple and aligned with government-exam solution style.

Every CP has an explanation family:

- CP-001 Prime answer
- CP-001 Composite answer
- CP-002 Range Counting
- CP-003 Smallest Prime In Range
- CP-004 Greatest Prime In Range
- CP-005 Range Summation
- CP-006 Next Prime
- CP-007 Previous Prime
- CP-008 Prime Position

### Mathematical Correctness

The explanation language is mathematically correct at the template level.

### Weak Explanation Patterns

Several explanation templates are intentionally short but educationally thin.

Examples:

- "List all prime numbers in the given range. Count them."
- "List prime numbers in order."
- "Check numbers greater than {number} one by one."

These are acceptable as minimal exam-style explanations, but future runtime should use the reasoning graph to supply the actual mathematical evidence behind the template.

### Potential Explanation Defect

ES-008 says:

"The first prime number obtained is {answer}."

For a backward search, this is only clear if the implied checking direction is descending. The previous line says "Check numbers smaller than {number} one by one", so the template is usable, but "greatest prime smaller than {number}" would be clearer.

## 6. Coverage Targets

### Strengths

Coverage targets include all required categories:

- Prime coverage
- Composite coverage
- Range coverage
- Position coverage
- Difficulty coverage
- Question language coverage
- Explanation coverage

CP-001 answer distribution is explicitly represented:

- Prime
- Composite

CP-008 position coverage buckets are explicitly represented:

- 1-25
- 26-50
- 51-100
- 101-250
- 251-500

### Blind Spots

The range coverage buckets are named:

- small
- medium
- large

The design does not yet define numeric thresholds for these buckets.

Recommendation:

Before implementation, define how range width or bound size maps to small, medium, and large.

### Audit Readiness

The package is auditable, but future implementation should report:

- CP-001 Prime/Composite distribution
- range bucket distribution
- zero-prime range frequency for CP-002 and CP-005
- exactly-one-prime range frequency for CP-002 through CP-005
- CP-008 position bucket distribution
- question language usage
- explanation usage
- difficulty distribution

## Strengths

- Canonical problem set is non-redundant and implementation-ready.
- Scope boundaries are clear.
- Human-owned libraries are separated from runtime responsibilities.
- Question language is self-contained after range wording repair.
- CP-001 answer distribution target is present.
- CP-008 position coverage buckets are present.
- Prime/composite definitions are clear.
- The package follows the NS-DIV-001, NS-REM-001, and NS-REM-002 architectural pattern.

## Weaknesses

- Number = 1 is excluded but not prominently documented as a validation rejection case in every relevant location.
- QL-017 can render incorrect ordinal English.
- Range coverage buckets are named but not numerically defined.
- Explanations are correct but minimal; runtime must rely on reasoning graph evidence to avoid overly generic explanations.
- CP-007 needs explicit runtime enforcement of number >= 3 because the general Easy number range begins at 2.

## Risks

- If CP-001 generation does not control answer distribution, Composite answers may dominate because composites are more frequent than primes in larger ranges.
- If range generation is naive, CP-003 and CP-004 may generate empty-prime ranges despite the current generation requirement.
- If CP-008 uses QL-017 without ordinal handling, question language may look unpolished.
- If explanations are rendered without graph-backed details, solutions may feel repetitive.

## Recommended Adjustments

1. Explicitly document number = 1 as invalid for NS-PRM-001 runtime generation and validation.

2. Add a CP-007-specific validation rule:

   number must be at least 3.

3. Define numeric range coverage buckets for small, medium, and large.

4. Repair or renderer-handle QL-017 ordinal suffixes before runtime generation.

5. During implementation, ensure CP-001 generation balances Prime and Composite outputs rather than sampling numbers uniformly.

6. During implementation, ensure CP-003 and CP-004 regenerate ranges that contain no prime.

7. During implementation, audit zero-prime and exactly-one-prime ranges for CP-002 through CP-005.

## Implementation Readiness Verdict

Verdict:

READY WITH MINOR CHANGES

Rationale:

NS-PRM-001 has a complete design package, a non-redundant CP architecture, approved educational libraries, and clear implementation boundaries.

No architectural blocker prevents implementation.

Minor specification refinements are recommended before runtime work begins, especially:

- explicit handling of number = 1
- QL-017 ordinal rendering
- numeric definition of range coverage buckets
- CP-007 minimum input enforcement

Once these are resolved or accepted as implementation-time validation requirements, NS-PRM-001 can proceed to runtime implementation.
