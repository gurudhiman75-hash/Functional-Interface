# ALP-001 CP-001–CP-005 End-to-End Design

## Architecture

```text
QL lookup
  -> deterministic parameter construction
  -> explicit sequence or word transformation
  -> independent solver
  -> ambiguity audit
  -> misconception distractors
  -> balanced answer placement
  -> localized rendering
  -> final contract validation
```

The answer is never accepted merely because the generator produced it.

## CP-001 — Fundamental Alphabet Positions

Covers left/right ranks, rank conversion, opposite letters, joint rank identity and selection of the only opposite pair. Core identities are `leftRank + rightRank = 27` and `leftRank(letter) + leftRank(opposite) = 27`.

## CP-002 — Relative Letter Positions

Covers bounded movement from named or rank-based anchors, inverse anchor recovery, offset recovery, direction-plus-offset recovery, ordered two-stage movement, final left/right rank and explicit cyclic movement. Bounded questions reject wrapping; cyclic questions deliberately exercise it.

## CP-003 — Gaps, Distance and Middle Positions

Keeps three quantities separate: absolute position distance, letters strictly between and inclusive span. It also covers single/double midpoints, pair selection, endpoint recovery, endpoints from midpoint, interval comparison and outside/before/after counts.

## CP-004 — Modified Alphabet Arrangements

Uses declarative transforms rather than stored arbitrary rows. Fourteen transforms include reversal, half reversal, half interchange, cyclic rotation, odd/even regrouping, alternating-end selection, vowel/consonant filtering, adjacent swaps and block reversal. Every transform supports a direct position query and an inverse letter-position query.

## CP-005 — Positions and Rearrangement Within a Word

Covers direct and inverse word positions, relative positions, middle letters, reversal, stable ascending/descending sorting, vowels-first/consonants-first stable partitions, odd/even regrouping, adjacent swaps, selected-range reversal and unchanged-position tasks. Duplicate letters carry occurrence numbers throughout the transform.

## Quality gates

- continuous QL IDs and exact checkpoint allocation;
- deterministic generation;
- independent solver parity;
- four unique options and exactly one answer;
- answer-position balance;
- explicit boundary and midpoint ambiguity checks;
- transformed sequence reconstruction;
- occurrence-aware inverse mapping;
- English, Hindi and Punjabi parity;
- script and rejected-terminology audits;
- no internal identifiers in learner-facing text.
