# RNK-CP-004 — English Remodel V4 Remediation

Status: **implemented; manual English review pending; permanent QL count open**.

Source authority: `RNK-CP004-REMODEL-V3-CRITICAL-REVIEW.md`.

## Purpose

Remodel V4 retains the mathematically reliable V3 engine and corrects the remaining freeze blockers around metadata truthfulness, task-specific difficulty, topology reporting and learner-facing distractor help.

## Corrected contracts

### Clue-role accounting

Every displayed statement now receives exactly one role:

```text
ESSENTIAL_FOR_FULL_ORDER
ESSENTIAL_FOR_BLOCK_ORDER
CONFIRMATORY
REDUNDANT_OTHER
```

The executable invariant is:

```text
statementCount
  = essentialForFullOrder or essentialForBlockOrder
  + confirmatory
  + redundantOther
```

The 66-question review pack now reports:

```text
ordinary-question essential clues: 322
ordinary-question confirmatory clues: 45
unclassified clues: 0
```

### Edge distance versus proof role

`ADJACENT` and `NON_ADJACENT` describe where an edge lies in the completed order.

`ESSENTIAL` and `CONFIRMATORY` describe whether the clue is logically required.

These dimensions are stored separately.

### Core topology

Pairwise comparison questions that determine one unique total order are reported truthfully as:

```text
TOTAL_ORDER_CHAIN
```

Missing-comparison questions are reported as:

```text
TWO_ORDERED_BLOCKS
```

Non-adjacent transitive edges are reported as confirmatory added edges, not as a new transitive-reduction topology.

### Shortest answer proof

V4 adds `shortestAnswerProofClues` for every provisional authority. Difficulty uses the proof required by the actual question rather than one universal full-order measure.

### Progressive distractor help

The decisive proof remains visible by default. Wrong-option teaching is stored and rendered behind:

```text
Why are the other options wrong?
```

Pair-direction, exact-distance, complete-order, transitive-conclusion and missing-comparison records receive question-specific distractor explanations.

Missing-comparison explanations demonstrate ambiguity using two concrete valid orders for one wrong option.

### Position rendering

Numbered ranking explanations render in compact rows of at most four entries, with the requested entity highlighted.

### Direction-only pair safety

When immediate-neighbour distractors are present, the named pair must have rank difference greater than one. The 240-seed authority gate enforces this invariant.

## Executable evidence

```text
runtime provisional authorities:       11
runtime seeds per authority:          240
runtime questions:                  2,640
review questions:                      66
runtime clue-accounting failures:       0
review essential clues:               322
review confirmatory clues:              45
review unclassified clues:               0
average visible explanation words:   47.64
answer positions:                16/17/17/16
repeated four-answer sequences:          0
normalized semantic duplicates:          0
```

## Safety boundary

```text
English manual approval:       pending
English discovery frozen:      false
permanent QL count:            open
next available identity:       RNK-QL-027
Hindi/Punjabi:                 not started
Question Studio:               disabled
Question Bank:                 NOT_STORED
test eligibility:              INELIGIBLE
public publication:            false
```

No merge, freeze or release is authorized by this remediation record.
