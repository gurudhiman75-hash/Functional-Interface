# SER-CP-007 Wave E — moving markers and positional substitution

## Status

```text
Authority: SER_CP007_WAVE_E_MOVING_MARKER_AND_POSITIONAL_SUBSTITUTION_DISCOVERY
Maturity:  SOURCE_BACKED_DISCOVERY_PLAN
Permanent QLs: 0
Question Studio: disabled
Question Bank: disabled
Test eligibility: disabled
Public publication: disabled
Localization: not started
```

Wave E is required because page-level source tracing found meaningful fixed-width letter-series modes that are not represented by the current Waves A–D inventory. It supersedes the previous English-freeze boundary. No permanent identity may be allocated until Wave E and the renewed source ledger are complete.

## Source trigger

The immediate source authority is `RADIAN-2022`, Chapter 6, printed pages `6-12` and `6-20`.

Directly traced stems include items `228–236`:

```text
228  moving CC marker block through an AB background
229  moving C marker through an AB background with step 2 and wrap
230  progressive PQ -> RS positional substitution
231  moving lowercase x marker through uppercase X background
232  moving interior Q marker with a fixed terminal Q
233  moving Z marker through a YX background with step 2 and wrap
234  moving lowercase-state marker through an uppercase recurring frame
235  moving lowercase aba marker block through an uppercase AB background
236  progressive CD -> AB positional substitution
```

Printed solution notes for items `221`, `222`, `225` and `227` corroborate fixed-step marker movement, progressive replacement and case-state movement. Their full stems remain a source-ledger task.

## Candidate authority compression

The source surfaces provisionally compress into two solve authorities:

```text
MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME
PROGRESSIVE_POSITIONAL_SUBSTITUTION
```

### 1. Marker/block position shift over a periodic frame

A marker token or marker block changes its position inside a fixed-width term while all other positions are regenerated from a bounded fixed or periodic background.

Provisional instance properties:

```text
marker token
marker width
background token or bounded period
left/right direction
step size
wrap or non-wrap domain
fixed edge markers
case-sensitive marker state
starting position
term width
```

The authority must not be split merely because the marker is one letter, several letters, uppercase/lowercase, or moves by one versus two positions.

### 2. Progressive positional substitution

Each step converts one or more additional positions from a bounded source pattern into a bounded target pattern while preserving total term width.

Provisional instance properties:

```text
source periodic pattern
target periodic pattern
left-to-right or right-to-left boundary motion
positions converted per step
starting boundary
term width
fixed prefix or suffix
```

The authority must distinguish a moving source/target boundary from cumulative token growth: no new positions are appended and the term width remains fixed.

## Source-shaped probes

Wave E must begin with these probes rather than permanent QLs:

```text
SINGLE_MARKER_FIXED_STEP
MARKER_BLOCK_FIXED_STEP
CASE_STATE_MARKER_FIXED_STEP
MARKER_SHIFT_WITH_FIXED_EDGE_TOKEN
MARKER_SHIFT_OVER_PERIODIC_BACKGROUND
PROGRESSIVE_PREFIX_SUBSTITUTION
PROGRESSIVE_SUFFIX_SUBSTITUTION
MOVING_PATTERN_BOUNDARY
```

These probes may merge further after complete-pool collision analysis. A different surface name does not justify a separate authority.

## Required task directions

Every direction must be enabled only when the displayed material determines one unique hidden sequence.

```text
NEXT_TERM       required
MISSING_TERM    required where the missing position is uniquely recoverable
WRONG_TERM      required where one displayed term can be uniquely corrected
PREVIOUS_TERM   conditional; reject when pre-history is not unique
NEXT_TWO_TERMS  later answer-semantic probe after the base solver is stable
```

For wrong-term tasks, the learner answer should remain the correct replacement unless a later answer-semantic audit explicitly tests a wrong-term/replacement pair.

## Collision matrix

Each generated instance must be evaluated against the complete eligible authority pool. Wave E must prove non-equivalence or collapse against:

```text
CYCLIC_CLUSTER_PERMUTATION
FIXED_POSITION_PERMUTATION_CLUSTER
COLUMNWISE_FIXED_CLUSTER_MOVEMENT
COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT
EDGE_DELETION_WORD_SEQUENCE
CUMULATIVE_PREFIX_CLUSTER
PATTERNED_INTERIOR_INSERTION_GROWTH
TWO_INTERLEAVED_CLUSTER_SERIES
K_INTERLEAVED_CLUSTER_SERIES
```

Key distinctions requiring executable proof:

- whole-token rotation moves the existing token; marker movement regenerates the non-marker background;
- one fixed permutation applies the same position map to the complete previous term; marker movement may require a position-state update plus background reconstruction;
- column-wise movement changes letter values in fixed positions; marker movement changes which position carries a distinguished state;
- deletion and insertion change term width; Wave E base families preserve width;
- cumulative prefix growth appends material; progressive substitution replaces existing positions;
- interleaving separates term rows; the Wave E rule acts within every consecutive term unless a source explicitly combines both mechanisms.

## Generator and solver requirements

Wave E implementation must include:

1. a deterministic generator for every retained source-shaped probe;
2. an independent solver that infers eligible marker/background or source/target-boundary parameters from visible terms;
3. complete-pool ambiguity rejection rather than generator-family self-recognition;
4. bounded term widths and alphabet/case domains safe for all renderers;
5. deterministic replay and stable mathematical fingerprints;
6. unique four-option sets with misconception-specific distractors;
7. balanced correct-answer positions;
8. Easy, Medium and Hard reach for every retained temporary template;
9. explicit rejection of underdetermined previous-term and missing-term instances;
10. lifecycle locks proving zero product exposure.

## Diversity requirements

A passing family must vary more than cosmetic letters. At minimum, the retained test corpus must cover:

```text
marker widths:           1 and multiple letters
movement directions:     left and right
step sizes:              1 and greater than 1
boundary modes:          wrap and non-wrap
background periods:      1 and greater than 1
case states:             case-neutral and case-sensitive
fixed edges:             absent and present
substitution direction:  prefix growth and suffix growth
source/target periods:   equal and different bounded periods where valid
```

Fingerprint thresholds must prevent one structural pattern with renamed letters from satisfying the diversity gate.

## Temporary template policy

The implementation should start with four task templates per source-shaped probe where all directions are valid, then remove invalid directions through explicit recoverability evidence.

```text
Seeds per retained template: 120
Permanent QLs:               0
Temporary IDs:               disposable
```

The number of source probes, templates and provisional authorities must be derived from the final implementation rather than frozen in this plan.

## Learner presentation standard

All exact English review questions must use:

```text
Choices: 1, 2, 3, 4
Headings: Rule, Solution, Quick Method, Common Mistake
A-D option labels: prohibited
Internal authority names: prohibited
```

Explanations should show the position movement or substitution boundary visibly. They must not rely on phrases such as “the pattern is clear” without demonstrating the relevant terms.

Recommended explanation shape for marker movement:

```text
Rule: identify the moving marker and the repeating background.
Solution: show marker positions term by term, then rebuild the next background.
Quick Method: track only the marker position after confirming the frame.
Common Mistake: rotating the complete term instead of moving the marker through the frame.
```

Recommended explanation shape for positional substitution:

```text
Rule: one more position changes from the old pattern to the new pattern.
Solution: mark the boundary after each term and move it by the stated amount.
Quick Method: compare the changed prefix/suffix length rather than every character independently.
Common Mistake: treating the term as growing when its length is unchanged.
```

## Source-ledger obligations after implementation

Wave E completion does not itself authorize freeze. The next source pass must:

- attach complete stems for corroborating Radian items `221`, `222`, `225` and `227`;
- split Radian items `133–141` into exact authority rows;
- resolve the Disha repeated-versus-alternating block items;
- search the remaining references for marker movement and progressive substitution variants;
- classify every Wave D saturation probe as source-backed or `SATURATION_ONLY`;
- rerun the chapter-wide merge/split audit with Wave E included.

## Acceptance boundary

Wave E may be declared green only when all of the following pass:

```text
source-shaped generation
independent complete-pool solving
collision proof against Waves A-D
ambiguity and recoverability rejection
option and answer-position proof
fingerprint diversity proof
natural English exact-review export
all lifecycle locks
post-Wave-E source-ledger audit
```

After Wave E, the next authority is not predetermined. It must be selected from the renewed source-ledger result:

```text
no meaningful uncovered modes -> full English editorial review and merge/split freeze
meaningful uncovered mode      -> another bounded discovery wave
```
