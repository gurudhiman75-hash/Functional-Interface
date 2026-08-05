# SER-CP-007 full English editorial audit

## Result

```text
Status: PASS_SER_CP007_ENGLISH_EDITORIAL_AUDIT_REMODEL_REQUIRED
Temporary templates reviewed: 140
Authorities represented:       17
Sampled seeds per template:     3
Sampled learner reviews:      420
English discovery freeze: BLOCKED
Permanent QLs:               0
```

The mathematics and source ledger are ready for editorial review. The present learner-facing output is not ready for freeze.

## P0 blockers

### 1. Every explanation is forced into the same four-section shell

All 420 sampled reviews contain exactly:

```text
Rule
Solution
Quick Method
Common Mistake
```

This is useful as discovery evidence but unsuitable as a universal student explanation model. A simple fixed-step series does not always need four separate blocks, while an interleaved or marker series may need a compact row/table representation instead.

**Required change:** explanation structure must be selected by the question’s proof needs, not imposed globally.

### 2. Internal trap codes are visible to students

All 420 sampled reviews expose an internal code such as:

```text
[ONLY_FIRST_LETTER_MOVED]
[FOUR_ROWS_MIXED]
[ROTATION_APPLIED_BEFORE_COMPLEMENT]
```

These are analytics metadata, not learner language.

**Required change:** keep `trapCode` in hidden metadata and render only a natural misconception explanation when it genuinely helps.

### 3. `WRONG_TERM` is semantically mislabeled

The chapter contains:

```text
WRONG_TERM generated questions: 3,960
Temporary templates:                33
Audit samples:                       99
```

But their stem asks:

```text
Which letter group should replace the incorrectly placed group?
```

The answer is the corrected replacement, not the displayed wrong term or its position.

**Required split:**

```text
IDENTIFY_WRONG_TERM
  answer = displayed wrong term or position

REPLACE_WRONG_TERM
  answer = corrected cluster

WRONG_AND_REPLACEMENT
  answer = wrong cluster → corrected cluster
```

Task metadata, stem, answer semantic and analytics must agree.

### 4. Explanation length is driven by generator mechanics rather than proof sufficiency

Some families list every transition across a long canonical sequence. Others use a short family statement even when the learner needs row separation or position tracking.

**Required change:** show the minimum complete proof:

```text
- enough transitions to establish the rule;
- the transition that produces the answer;
- a compact verification;
- no repeated mechanical transitions after the rule is proven.
```

The goal is neither maximum brevity nor maximum detail. It is complete, easy-to-follow reasoning for that exact question.

## P1 major issues

### 5. Stem language is too uniform

Term tasks rely heavily on a small set of identical openers. The sequence changes, but the exam-facing language does not.

Required stem pool examples:

```text
Find the next group in the series.
Which group completes the series?
Choose the group that should replace the question mark.
Identify the incorrect group.
Which group should replace the incorrect term?
Select the missing pair of groups.
```

Variation must preserve answer semantics and should not become decorative paraphrasing.

### 6. Previous-term capability is overrepresented relative to exam realism

```text
PREVIOUS_TERM generated questions: 3,480
Temporary templates:                  29
Audit samples:                         87
```

Previous-term generation is mathematically useful, but it should not automatically receive the same product weight as common next-term, missing-term and wrong-term exam forms.

**Required change:** retain it as a supported task direction, but calibrate production frequency from exam evidence. Task direction must not create a separate permanent authority.

### 7. Options are structurally valid but not consistently misconception-specific

Generic letter mutation, shift and reversal candidates guarantee unique options, but they do not always represent the most likely student errors for the exact rule.

Required distractor sources:

```text
wrong direction
wrong step size
compare neighbouring terms instead of interleaved rows
move only one column
rotate instead of regenerate the frame
change width instead of substitute positions
delete from the wrong edge
continue the wrong repeated block
identify the wrong term but fail to correct it
```

Every visible “common mistake” must correspond to at least one actual option or be omitted.

### 8. Quick Method is not universally useful

For many easy fixed-shift questions, the quick method repeats the rule. For complex questions, a one-line shortcut may hide necessary reasoning.

**Required change:** render a shortcut only when it is shorter than the main proof and remains safe across the generated parameter range.

## Adaptive explanation models

### Model A — direct column movement

Use a short position table only when multiple columns move differently:

```text
Position 1: B → D → F → H
Position 2: A → B → C → D
Position 3: Z → Y → X → W
```

For a uniform shift, one demonstrated transition and the answer step are enough.

### Model B — interleaved rows

Separate rows explicitly:

```text
Odd positions : ABC → DEF → GHI
Even positions: PQR → STU → VWX
```

Then continue only the row containing the blank.

### Model C — permutation or rotation

Show positional movement once:

```text
ABCD → BADC
swap positions 1↔2 and 3↔4
```

Do not list the same mapping repeatedly after it is established.

### Model D — deletion, growth or insertion

Highlight what is removed or added:

```text
REGULAR → EGULAR  remove first letter
EGULAR  → EGULA   remove last letter
```

For insertion, preserve the old letters visually and mark the inserted letter.

### Model E — continuous gap completion

First reconstruct the block boundary:

```text
AACCBB | AACCBB | AACCBB
```

Then read the missing letters in blank order. Do not explain it as a term sequence when it is a continuous block.

### Model F — marker movement or positional substitution

Show marker/boundary positions rather than treating the token as ordinary letter shifts:

```text
marker positions: 1 → 3 → 5 → 7 → 2
```

or

```text
source/target boundary: 1 → 2 → 3 → 4
```

This is the clearest distinction introduced by Wave E.

## Final explanation contract

A final explanation may contain only the blocks it needs:

```text
Pattern
Worked application
Verification
Shortcut          optional
Why another option fails   optional
```

Rules:

```text
- no visible internal codes;
- no compulsory heading set;
- no unexplained answer jump;
- no repeated transitions after the pattern is proven;
- no shortcut that replaces required proof;
- no generic common-mistake paragraph unrelated to options;
- use tables/rows only when they reduce cognitive load;
- preserve exact question-specific values and answer direction.
```

## Required implementation sequence

1. Split wrong-term task semantics and update stems/answers.
2. Introduce adaptive explanation renderers by proof model.
3. Hide trap codes and analytics metadata.
4. Build exam-style stem pools with semantic locks.
5. Remodel distractors around actual misconceptions.
6. Re-export all 140 templates for manual review.
7. Run repetition, length, terminology and option-quality audits.
8. Perform the final 17-authority merge/split decision.
9. Allocate permanent QLs only after manual English approval.

## Lifecycle

```text
Source ledger:             COMPLETE
Mathematical saturation:   PROVISIONALLY_COMPLETE_AFTER_SOURCE_CLOSE
English editorial audit:   COMPLETE_REMODEL_REQUIRED
English discovery freeze:  BLOCKED
Permanent QLs:             0
Question Studio:           disabled
Question Bank:             disabled
CP-008:                    blocked
```

## Next authority

```text
SER_CP007_ADAPTIVE_EXPLANATION_AND_TASK_SEMANTICS_REMODEL
```
