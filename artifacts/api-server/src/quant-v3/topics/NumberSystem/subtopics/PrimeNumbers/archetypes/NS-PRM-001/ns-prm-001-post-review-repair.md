# NS-PRM-001 Post-Review Repair

## Status

Repair Type: Specification and library update only

Runtime Implementation Status: NOT IMPLEMENTED

Repair Verdict: IMPLEMENTATION READY AFTER DESIGN REPAIR

## Applied Repairs

### 1. Number = 1 Rule

Applied.

Documented rule:

1 is neither Prime nor Composite.

1 is not a valid generated value for:

- CP-001
- CP-006
- CP-007

Future runtime validation must reject 1 for these canonical problems.

Updated:

- archetype.md
- canonical-problems.md
- implementation-plan.md
- library-authority-map.md
- variable-ranges.library.json

### 2. CP-007 Minimum Input

Applied.

Documented rule:

number >= 3

Reason:

A previous prime must exist.

Updated:

- canonical-problems.md
- implementation-plan.md
- variable-ranges.library.json

### 3. QL-017 Repair

Applied.

Previous wording:

Find the {position}th prime number.

Repaired wording:

Find the prime number at position {position}.

QL-018 remains unchanged.

Updated:

- question-language.library.json

### 4. Range Coverage Buckets

Applied.

Numeric buckets:

- small: rangeWidth 5-50
- medium: rangeWidth 51-250
- large: rangeWidth 251-1000

Updated:

- coverage-targets.library.json
- distribution-targets.library.json
- implementation-plan.md

### 5. Prime / Composite Balancing

Applied.

Coverage target:

- Prime: 50%
- Composite: 50%

This is a coverage target, not a generation guarantee.

Updated:

- coverage-targets.library.json
- distribution-targets.library.json
- implementation-plan.md

### 6. Empty Prime Range Policy

Applied.

CP-002 and CP-005:

- May contain zero primes.
- Allowed answer: 0.

CP-003 and CP-004:

- Must contain at least one prime.
- Future generation must regenerate invalid ranges.

Updated:

- canonical-problems.md
- implementation-plan.md

### 7. Exactly-One-Prime Policy

Applied.

Allowed for:

- CP-002
- CP-003
- CP-004
- CP-005

Expected behavior:

- CP-002 -> 1
- CP-003 -> that prime
- CP-004 -> that prime
- CP-005 -> that prime

Updated:

- canonical-problems.md
- implementation-plan.md

## Runtime Scope Check

No runtime implementation was performed.

No generators, solvers, validators, reasoning graphs, pipelines, tests, or audits were created.

## Final Status

NS-PRM-001 design package is fully implementation-ready after this repair pass.
