# SER-CP-007 adaptive English candidate V2

## Why V2 was required

Candidate V1 passed its mechanical gates and improved the baseline substantially:

```text
Average words:          152.22 -> 114.46
Maximum words:          226    -> 161
Reviews over 180 words: 113    -> 0
Distinct opening lines: 10     -> 19
Visible trap codes:     420    -> 0
Forced old headings:    420    -> 0
```

However, manual review found three proof-quality problems:

1. A missing-term explanation could show the first two transitions and the final series transition instead of the transition producing the missing answer.
2. A mixed-column question could display only some position rows, leaving middle letters unproved.
3. Shortcut and Check blocks remained too frequent:

```text
V1 shortcuts: 363 / 420
V1 checks:    366 / 420
```

V2 corrects these issues rather than treating V1’s lower word count as sufficient.

## V2 proof-selection rules

### Decisive answer transition

For single-cluster tasks, the worked proof must contain a transition or reconstruction step that includes the actual correct answer.

This prevents a missing-term explanation such as:

```text
first transition
second transition
unrelated final transition
therefore missing answer
```

### Complete position tables

When the generator provides `Position 1`, `Position 2`, and so on, V2 retains every position row. It does not compress a five-letter proof to positions 1, 2 and 5.

The table may be longer, but every answer letter is then justified.

### Removal of generator bookkeeping

V2 removes lines such as:

```text
First write the correct series: ...
First check the shown groups: ...
```

when the structural proof itself is sufficient. The natural conclusion still identifies the incorrect group and replacement.

### Previous-term proof

A previous-term explanation keeps:

```text
move one step backward using the same rule
one decisive backward/forward verification involving the answer
```

It does not repeat a long forward series merely because the generator stored it.

## Selective support blocks

### Shortcut

V2 permits shortcuts only for proof models where a safe alternative view adds value:

```text
interleaved rows
continuous gap completion
marker/boundary movement
multi-position direct movement
```

Simple deletion, ordinary rotation and uniform shifts normally use the main proof only.

### Check

V2 renders a Check only for:

```text
REPLACE_WRONG_TERM
WRONG_AND_REPLACEMENT
```

This reduces generic caution text and keeps checks attached to a task where identifying the exact correction is central.

Expected check count across the 420-sample audit is exactly 102.

## Executable V2 gates

Candidate V2 must prove:

```text
420 deterministic sampled reviews
6 proof models
99 missing-term answer proofs
99 compressed replacement proofs
all available position rows retained
no old headings
no visible trap codes
no learner-visible internal metadata
shortcuts between 50 and 260
checks exactly 102
average review length below 120 words
maximum review length below 190 words
fewer than 40 reviews above 160 words
```

The V1 regression test remains active so V2 cannot reintroduce the original editorial failures.

## Manual review focus

After CI, the V2 pack must still be inspected for:

1. Naturalness of the worked-action label.
2. Whether complete position tables become visually dense for long groups.
3. Whether interleaved K-row proofs include the decisive row without unnecessary rows.
4. Whether the answer transition is pedagogically clear, not merely textually present.
5. Whether wrong-term checks correspond to realistic distractors.
6. Whether any authority needs a bespoke diagram/table renderer.
7. Whether explanation length remains sufficient rather than merely short.

## Lifecycle

```text
Source ledger:              COMPLETE
Mathematical saturation:    PROVISIONALLY_COMPLETE_AFTER_SOURCE_CLOSE
Baseline English audit:     COMPLETE_REMODEL_REQUIRED
Adaptive candidate V1:      EXECUTABLE_NOT_APPROVED
Adaptive candidate V2:      EXECUTABLE_PENDING_CI_AND_MANUAL_REVIEW
Manual English approval:    PENDING
English discovery freeze:   BLOCKED
Permanent QLs:              0
Question Studio:            disabled
Question Bank:              disabled
CP-008:                     blocked
```

## Next authority

```text
SER_CP007_ADAPTIVE_ENGLISH_CANDIDATE_V2_MANUAL_REVIEW
```
