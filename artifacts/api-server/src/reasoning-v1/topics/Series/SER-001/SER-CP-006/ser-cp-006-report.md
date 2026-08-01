# SER-001 / SER-CP-006 — single-letter alphabetic sequences

## Scope

CP-006 owns series whose displayed terms are single English letters and whose decisive invariant is sequential movement through the alphabet or an ordered alphabetic subset.

## Source-shaped families

```text
UNIFORM_FORWARD_SHIFT
UNIFORM_BACKWARD_SHIFT
PROGRESSIVE_FORWARD_SHIFT
PROGRESSIVE_BACKWARD_SHIFT
ALTERNATING_SHIFT_PAIR
TWO_INTERLEAVED_UNIFORM_LANES
VOWEL_SUCCESSOR_CYCLE
CONSONANT_SUCCESSOR_CYCLE
```

Each family supports next-term, interior-missing, previous-term and wrong-letter tasks.

## Representation compression

```text
UNIFORM_FORWARD_SHIFT
UNIFORM_BACKWARD_SHIFT
  -> UNIFORM_CYCLIC_LETTER_SHIFT

PROGRESSIVE_FORWARD_SHIFT
PROGRESSIVE_BACKWARD_SHIFT
  -> PROGRESSIVE_CYCLIC_LETTER_SHIFT

ALTERNATING_SHIFT_PAIR
TWO_INTERLEAVED_UNIFORM_LANES
  -> TWO_INTERLEAVED_CYCLIC_LETTER_LANES

VOWEL_SUCCESSOR_CYCLE
CONSONANT_SUCCESSOR_CYCLE
  -> ORDERED_LETTER_SUBSET_CYCLE
```

Direction, alphabet wrap, target position and task direction are instance properties rather than separate authorities.

## Executable proof

```text
Temporary templates:                 32
Source-shaped families:               8
Provisional authorities:              4
Generated questions:              3,840
Deterministic replay checks:       3,840
Independent projection checks:     3,840
Option and answer checks:           3,840
Lifecycle checks:                  3,840
Wrong-letter checks:                 960
Questions per family:                480
Questions per task:                  960
Questions per authority:             960
Answer positions:      [960, 960, 960, 960]
Difficulty/template:    40 easy / 40 medium / 40 hard
Exact review questions:               64
Permanent QLs:                         0
```

## Review gate

CP-006 implementation is complete but remains inactive. CP-007 must not begin until the user reviews and approves the exact English questions.
