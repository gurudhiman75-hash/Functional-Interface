# SER-001 numeric signed-descending parity audit

## Purpose

This audit closes the remaining Wave A edge-domain question: whether negative-valued and reverse-direction displays require new Series authorities.

The audit does not create production QLs, templates, source families or product exposure. It proves representation normalisation against the already-executable CP-002 through CP-005 solvers and relies on the completed Wave A evidence for `UNIFORM_ADDITIVE_STEP`.

## Representation transformations

```text
NEGATE_VALUES
  Every displayed numeric value is multiplied by -1.
  Target position and task direction remain unchanged.

REVERSE_DIRECTION
  The displayed sequence order is reversed.
  NEXT_TERM and PREVIOUS_TERM swap.
  MISSING_TERM and WRONG_TERM retain their task identity.
```

Both adapters are self-inverse. The audit normalises the transformed display, delegates to the existing canonical checkpoint solver, then maps the answer, replacement and target position back into the transformed representation.

## Applicability decisions

```text
Uniform additive
  Prior Wave A signed-descending evidence.

Uniform multiplicative and affine
  Sign inversion is a domain parameter.
  Descending affine evidence already exists in Wave A.

Second- and third-difference authorities
  Sign inversion and direction reversal preserve finite-difference order.

Square, cube, triangular and fixed-power source surfaces
  Their transformed displays remain owned by the previously proved CP-002/CP-003 canonical authorities.

Consecutive primes and factorials
  Direction reversal is a presentation parameter.
  Negating terms would no longer preserve the named source property and is therefore not required.

Previous-two sum recurrence
  Sign inversion preserves the recurrence exactly.
  Reverse order is not claimed as the same forward recurrence.

Alternating, interleaved and progressive composite authorities
  Sign inversion and direction reversal are normalised as representation parameters.
  Reversal swaps next/previous orientation and may change phase, but not canonical ownership.
```

Alternating-sign and changing-operator grammars remain a separate Wave B discovery dimension. Closing this domain blocker does not pre-judge that authority.

## Executable proof

```text
Audited temporary templates:          84
Seeds per template:                   60
Base questions inspected:          5,040
Transformed representation proofs: 8,880
Sign-inversion proofs:             4,560
Direction-reversal proofs:         4,320
Task proofs each:                  2,220
Canonical authorities covered:       14
Permanent QLs:                         0
```

All transformed representations retain inactive lifecycle boundaries. The audit checks canonical uniqueness, authority identity, answer mapping, replacement mapping, target-position mapping and self-inverse normalisation.

## Gap movement

```text
After Wave A
  Covered: 13
  Partial:  2
  Open:    11
  Freeze blockers: 13

After signed-descending parity
  Covered: 14
  Partial:  1
  Open:    11
  Freeze blockers: 12
```

Closed dimension:

```text
DESCENDING_AND_SIGNED_DOMAINS
```

Remaining partial dimension:

```text
SPECIAL_NUMBER_AND_RECURRENCE_SOURCE_SATURATION
```

## Lifecycle decision

```text
Permanent QLs:             0
Question Studio:           disabled
Question Bank:             disabled
Test eligibility:          disabled
Public publication:        disabled
Localization:              not started
Source saturation:         open
Freeze decision:           BLOCK_PERMANENT_QL_ALLOCATION
```

## Next authority

Wave A edge-domain expansion is closed. The next implementation authority is:

```text
WAVE_B_HIGHER_ORDER_AND_RECURRENCE_EXPANSION
```
