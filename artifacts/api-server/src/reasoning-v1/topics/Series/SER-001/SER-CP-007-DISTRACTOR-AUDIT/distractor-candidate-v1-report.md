# SER-CP-007 distractor candidate V1

## Goal

Replace arbitrary option mutations with three explicit misconception roles for every generated question.

The candidate does not modify permanent identities or enable product visibility.

## Scope

```text
Temporary templates:        140
Sampled seeds per template:   3
Sampled questions:          420
Candidate distractors:    1,260
Permanent QLs:                0
```

## Candidate roles

### Single-answer roles

```text
UNIFORM_SHIFT_FORWARD
UNIFORM_SHIFT_BACKWARD
SINGLE_POSITION_MUTATION
WHOLE_REVERSAL
CYCLIC_ROTATION_LEFT
CYCLIC_ROTATION_RIGHT
LENGTH_PLUS_ONE
LENGTH_MINUS_ONE
```

The proof model controls which roles are preferred:

```text
DIRECT_COLUMN_MOVEMENT
  opposite-direction shifts + one-position error

INTERLEAVED_ROWS
  one-position row error + direction/reversal traps

POSITION_TRANSFORMATION
  whole reversal + wrong rotation + local mutation

LENGTH_OR_CONTENT_CHANGE
  one letter too long + one letter too short + local content error

CONTINUOUS_GAP_COMPLETION
  reversed answer order + local mutation + systematic shift

MARKER_OR_BOUNDARY_MOVEMENT
  marker/group rotated left + rotated right + local marker error
```

### Ordered-pair roles

```text
ORDERED_PAIR_SWAPPED
FIRST_COMPONENT_MUTATED
SECOND_COMPONENT_MUTATED
```

Both correct groups remain visible in the swapped-order trap. The other two options isolate which component is wrong.

### Wrong → replacement roles

```text
REPLACEMENT_SHIFT_FORWARD
REPLACEMENT_SHIFT_BACKWARD
REPLACEMENT_SINGLE_POSITION_MUTATION
```

The displayed wrong group stays fixed in all options. Only the proposed replacement changes.

This avoids mixing “which term is wrong?” with “what should replace it?” in one option set.

## Independent role validation

Every generated distractor is validated independently from its constructor.

Examples:

```text
UNIFORM_SHIFT_FORWARD
  every letter must equal the correct answer shifted +1

LENGTH_MINUS_ONE
  candidate must contain exactly one fewer letter

ORDERED_PAIR_SWAPPED
  first and second answer groups must be exchanged

REPLACEMENT_SINGLE_POSITION_MUTATION
  wrong displayed group must stay fixed;
  replacement must differ in exactly one position
```

The test does not accept a role label merely because the constructor emitted it.

## Learner-facing Check alignment

Each role has one natural learner-facing explanation. Internal trap codes and taxonomy terms are prohibited.

A final review renderer can select a Check directly from the distractor roles actually present in the options. This removes the baseline mismatch where an explanation can warn about a mistake absent from every option.

## Acceptance contract

Candidate V1 must prove:

```text
420 questions retain the original correct answer and answer index
1,260 distractors pass independent role validation
three distinct roles per question
four unique option values per question
1,260 learner-safe Check texts
all six proof models represented
ordered-pair constructor used for all pair answers
replacement constructor used for all wrong → replacement answers
```

## Remaining manual gate

Structural role correctness is necessary but not sufficient. The complete candidate pack still requires exam-realism review for:

1. Whether the traps are plausible for SSC, Banking and Punjab exams.
2. Whether two options become visually too similar or too easy to eliminate.
3. Whether a role matches the exact source rule rather than only the broad proof model.
4. Whether difficulty changes when a distractor is length-based or a one-letter mutation.
5. Whether option order and answer-position balance remain natural.
6. Whether authority-specific misconception catalogues should replace any shared role.

## Lifecycle

```text
Distractor baseline audit:     COMPLETE_REMODEL_REQUIRED
Distractor Candidate V1:       EXECUTABLE_PENDING_CI
Manual exam-realism review:    PENDING
Adaptive English V2:           EXECUTABLE_TARGETED_SPOT_REVIEW_PASS
Authority recommendation:      13 WITH 14 FALLBACK
English discovery freeze:      BLOCKED
Permanent QLs:                 0
Question Studio:               disabled
Question Bank:                 disabled
CP-008:                        blocked
```

## Next authority

```text
SER_CP007_DISTRACTOR_CANDIDATE_V1_MANUAL_EXAM_REALISM_REVIEW
```
