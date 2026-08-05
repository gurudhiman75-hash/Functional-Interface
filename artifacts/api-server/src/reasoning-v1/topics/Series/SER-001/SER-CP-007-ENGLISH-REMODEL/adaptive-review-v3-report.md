# SER-CP-007 adaptive English and distractor Candidate V3

## Purpose

Candidate V3 combines:

```text
Adaptive English V2 proof selection
+
Distractor Candidate V1 misconception roles
```

The learner receives the same worked proof as refined V2, but the options are rebuilt from explicit misconception roles.

## Scope

```text
Temporary templates:        140
Sampled seeds per template:   3
Sampled learner reviews:    420
Candidate distractors:    1,260
Permanent QLs:                0
```

## Proof preservation

For every sampled question, V3 must preserve V2:

```text
editorial task
proof model
stem
worked proof steps
Shortcut decision
Check visibility decision
```

Options do not influence the mathematical proof.

## Option replacement

Candidate V3 keeps:

```text
correct answer
correct answer index
four-option layout
```

It replaces the three distractors with role-driven options from Distractor Candidate V1.

Each question must have:

```text
three distinct misconception roles
three independently validated distractors
four unique option values
one correct answer at the original index
```

## Check alignment

V2 shows a Check only for:

```text
REPLACE_WRONG_TERM
WRONG_AND_REPLACEMENT
```

V3 replaces the legacy common-mistake text with the learner-safe explanation attached to a distractor role actually present in that option set.

Expected visibility:

```text
Visible Check reviews: 102
Reviews without Check:  318
```

A visible Check must appear exactly once and must match one of the three presented distractors.

## Review pack

The V3 export contains one seed from all 140 templates and provides manual checks for:

```text
exam-realistic stem
proof sufficiency
three plausible misconceptions
option-format fairness
visible Check alignment
final wording
```

Internal role IDs are stored only in HTML comments for review traceability and never appear in learner-visible text.

## Remaining gate

Candidate V3 is not approved until the complete pack is manually reviewed for:

1. Whether every distractor is plausible in the target exams.
2. Whether the role is specific enough to the exact source rule.
3. Whether options are balanced in length and visual form.
4. Whether one option becomes obviously wrong because of case, width or punctuation.
5. Whether distractor difficulty matches the question difficulty.
6. Whether the visible Check teaches the most useful represented mistake.
7. Whether any authority needs a bespoke option constructor.

## Lifecycle

```text
Source ledger:              COMPLETE
Mathematical saturation:    PROVISIONALLY_COMPLETE_AFTER_SOURCE_CLOSE
Adaptive English V2:        EXECUTABLE_TARGETED_SPOT_REVIEW_PASS
Distractor baseline:        COMPLETE_REMODEL_REQUIRED
Distractor Candidate V1:    EXECUTABLE
Adaptive Candidate V3:      EXECUTABLE_PENDING_CI
Full manual review:         PENDING
Authority recommendation:   13 WITH 14 FALLBACK
English discovery freeze:   BLOCKED
Permanent QLs:              0
Question Studio:            disabled
Question Bank:              disabled
CP-008:                     blocked
```

## Next authority

```text
SER_CP007_ADAPTIVE_ENGLISH_V3_FULL_MANUAL_REVIEW
```
