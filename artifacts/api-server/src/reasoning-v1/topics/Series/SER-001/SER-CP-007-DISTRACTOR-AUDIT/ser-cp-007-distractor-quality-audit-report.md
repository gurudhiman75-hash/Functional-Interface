# SER-CP-007 distractor quality baseline audit

## Purpose

This audit checks whether the four-option structure is mathematically valid and whether distractors visibly correspond to the misconception described by the question’s explanation.

It is a baseline diagnostic, not a claim that the current distractors are freeze-ready.

## Scope

```text
Temporary templates:        140
Sampled seeds per template:   3
Sampled questions:          420
Distractors per question:     3
Sampled distractors:       1,260
Permanent QLs:                0
```

All Waves A–E and every editorial task are included.

## Hard validity checks

Every sampled question must prove:

```text
exactly four options
four unique option values
correct option at correctIndex
correct answer appears exactly once
WRONG_TERM is presented as REPLACE_WRONG_TERM
```

These checks protect answer integrity but do not establish distractor quality.

## Structural distractor families

The audit detects the following visible relationships to the correct answer:

```text
SINGLE_POSITION_MUTATION
TWO_POSITION_MUTATION
UNIFORM_SHIFT_FORWARD
UNIFORM_SHIFT_BACKWARD
WHOLE_REVERSAL
CYCLIC_ROTATION
PAIRWISE_ADJACENT_SWAP
LENGTH_PLUS_ONE
LENGTH_MINUS_ONE
SAME_PREFIX_WRONG_END
SAME_SUFFIX_WRONG_START
ORDERED_PAIR_SWAPPED
ONE_COMPONENT_WRONG
WRONG_TO_REPLACEMENT_LEFT_FIXED
UNKNOWN
```

A distractor may belong to more than one family.

`UNKNOWN` means that this audit cannot explain the distractor using the visible structural families. It does not automatically mean the option is invalid, but it requires manual inspection or an authority-specific classifier.

## Misconception-alignment check

The current explanation stores a learner-facing `commonMistake` and an internal `trapCode`.

The audit extracts an expected distractor family from learner-visible wording such as:

```text
reverse the whole group
move in the wrong direction
change only one edge
mix odd/even rows
use the wrong answer order
choose the wrong replacement
make the group one letter too long or short
```

A question is counted as aligned when at least one distractor visibly represents an expected family.

Some common-mistake statements cannot be safely mapped by generic text rules. Those are counted as `unauditableCommonMistakeQuestions` and must be handled by authority-specific misconception metadata in the remodel.

## Why this gate is necessary

A common-mistake paragraph is useful only when it explains an error a learner could actually make in the presented options.

The chapter must not freeze when:

```text
- options are arbitrary mutations unrelated to the taught trap;
- the explanation warns about a mistake absent from all options;
- a plausible exam misconception is missing;
- grouped answers lose their order semantics;
- replacement questions vary both the wrong term and replacement without intent;
- the same generic shift distractors appear across unrelated authorities.
```

## Baseline status contract

The workflow returns:

```text
PASS_SER_CP007_DISTRACTOR_AUDIT_REMODEL_REQUIRED
```

A passing baseline means the audit completed and the diagnostic counts are internally consistent. It does **not** approve the distractors.

The result remains `REMODEL_REQUIRED` until:

1. Every retained authority has an explicit misconception catalogue.
2. Each template selects three distinct misconception roles.
3. Generated options are independently validated against those roles.
4. The learner-facing Check is rendered only when its misconception is represented.
5. Multi-answer and replacement semantics receive dedicated option constructors.
6. The complete option pack receives manual exam-realism review.

## Lifecycle

```text
Source ledger:                    COMPLETE
Mathematical saturation:          PROVISIONALLY_COMPLETE_AFTER_SOURCE_CLOSE
Adaptive English V2:              EXECUTABLE_TARGETED_SPOT_REVIEW_PASS
Authority recommendation:         13 WITH 14 FALLBACK
Distractor baseline audit:        EXECUTABLE_PENDING_CI
Distractor remodel:               NOT_STARTED
Full manual English review:       PENDING
English discovery freeze:         BLOCKED
Permanent QLs:                    0
Question Studio:                  disabled
Question Bank:                    disabled
CP-008:                           blocked
```

## Next authority

```text
SER_CP007_DISTRACTOR_MISCONCEPTION_REMODEL_AND_MANUAL_REVIEW
```
