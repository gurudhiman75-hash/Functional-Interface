# SER-001 numeric Wave B1 — higher-order and recurrence discovery

## Scope

Wave B1 extends numeric discovery into higher-order finite differences and richer stateful recurrences. It remains an open-discovery layer: no permanent QLs are allocated and no product surface is activated.

## Source-shaped families

```text
CONSTANT_NONZERO_FOURTH_DIFFERENCE
CONSTANT_NONZERO_FIFTH_DIFFERENCE
ADD_PREVIOUS_TWO_REPROBE
DIFFERENCE_PREVIOUS_TWO
WEIGHTED_PREVIOUS_TWO
AFFINE_PREVIOUS_TWO_PLUS_CONSTANT
ADD_PREVIOUS_THREE
WEIGHTED_PREVIOUS_THREE
```

Each family is exercised through next-term, interior-missing, previous-term and wrong-term tasks.

## Collision and compression result

The eight source families compress into two provisional canonical authorities:

```text
CONSTANT_HIGHER_ORDER_FINITE_DIFFERENCE
LINEAR_STATEFUL_RECURRENCE
```

Ownership decisions:

```text
Fourth- and fifth-difference sources
  -> provisional extension of SER-CP-003

ADD_PREVIOUS_TWO_REPROBE
  -> previous CP-004 authority is provisionally generalised
     into LINEAR_STATEFUL_RECURRENCE

Difference, weighted and affine previous-two sources
Additive and weighted previous-three sources
  -> LINEAR_STATEFUL_RECURRENCE
```

The complete candidate pool found that previous-two and previous-three source descriptions can project to the same displayed sequence. They therefore cannot be frozen as separate QLs at this stage. Equivalent coefficient descriptions are retained as representation evidence but count as one canonical projection.

## Executable proof

```text
Temporary templates:                       32
Source-shaped families:                     8
Provisional canonical authorities:          2
Generated questions:                    3,840
Deterministic replay checks:             3,840
Independent solver checks:               3,840
Lifecycle checks:                        3,840
Higher-order finite-difference checks:      960
Previous-two recurrence checks:           1,920
Previous-three recurrence checks:           960
CP-004 generalisation checks:               480
Questions per source family:                480
Questions per task direction:               960
Answer positions:            [960, 960, 960, 960]
Difficulty/template:          40 easy / 40 medium / 40 hard
English review export:                      64
Permanent QLs:                               0
```

The higher-order solver fits order-four and order-five Newton-basis coefficients from visible positions. The recurrence solver evaluates affine previous-two and linear previous-three candidates in one pool, groups identical projections by canonical authority, and rejects unresolved ambiguity.

## Chapter status after Wave B1

```text
Combined temporary templates:             144
Combined source-shaped families:           36
Provisional canonical authorities:         15
Generated-question volume:             17,280
Signed-parity representation proofs:    8,880
Combined executable evidence:          26,160
```

Gap movement:

```text
Covered: 14
Partial:  3
Open:     9
Permanent-freeze blockers: 12
```

Wave B1 moves these dimensions from open to partial:

```text
FOURTH_AND_HIGHER_FINITE_DIFFERENCES
RICHER_STATEFUL_RECURRENCES
```

They remain blockers because higher-order ceilings, broader recurrence grammars and source saturation are not yet closed.

## Lifecycle boundary

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

## Next implementation authority

```text
WAVE_B2_SPECIAL_NUMBER_CHANGING_POWER_AND_ALTERNATING_OPERATOR_DISCOVERY
```
