# RNK-CP-004 — Exam-Readiness Remediation

Status: **English remodel implemented and executable review pending**.

Basis: the critical review of the original 60-question English pack found a mathematically sound ordering engine but an unsafe and over-templated candidate-facing layer.

## Release blockers closed

### Pair-relation options

All options now answer the same named-pair query. Unrelated but factually true comparisons are no longer used as distractors.

The selected pair is required to be indirect and its correct relation cannot duplicate a displayed clue.

### Sufficient-comparison explanations

The explanation now follows the correct logical order:

```text
show separate base blocks
  -> count the valid base orders
  -> test every added comparison
  -> explain remaining ambiguity or contradiction
  -> apply the one sufficient comparison
  -> show the final unique order
```

The final chain is never displayed before the added premise is applied.

### Answer-key security

The 60-question review pack uses a deterministic balanced answer schedule:

```text
A: 15
B: 15
C: 15
D: 15
```

No four-answer sequence repeats anywhere in the pack.

### Stable review metadata

Each reviewed record now contains:

- stable question ID;
- prototype/authority candidate;
- seed;
- difficulty;
- competency;
- intended exam families;
- generation version;
- review state;
- lifecycle locks.

## Major editorial corrections

- clues render one per line for mobile readability;
- the false rule equating `cycle-free` with `unique` was removed;
- key rules and shortcuts are query-specific;
- conclusion questions require a non-direct transitive inference;
- complete-order distractors identify the exact violated clue;
- sufficiency distractors state the remaining number of valid orders or the contradiction;
- explanations no longer repeat the answer through multiple conclusion fields;
- difficulty is derived from entity count, clue density, query burden and relation distance rather than prototype alone.

## Immediate-neighbour design note

With strict pairwise comparison clues and one uniquely determined total order, two truly adjacent entities require a directed path between them. A path through a third entity would place that entity between them; therefore the adjacent relation must ultimately be represented by a direct edge.

The remodel does not pretend this edge can always be removed. Instead, the explanation distinguishes:

```text
direct comparison -> establishes direction
complete unique chain -> proves nobody lies between them
```

This family remains under manual review for difficulty calibration.

## Executable gates

The remodel gate audits all 2,400 generated questions and rejects:

- pair options that do not address the named pair;
- direct-clue leakage in pair and conclusion questions;
- multiple true conclusion options;
- circular sufficiency explanations;
- insufficient options falsely marked sufficient;
- complete-order distractors without an identifiable clue violation;
- repeated four-answer sequences;
- missing stable metadata;
- premature lifecycle activation.

## Current state

```text
raw discovery:                 10 prototypes / 2,400 questions
remodeled review pack:         60 questions
permanent QLs allocated:       0
next available RNK identity:   RNK-QL-027
English manual approval:       pending
source-gap expansion:          pending
merge/split consolidation:     blocked
Question Studio:               disabled
Question Bank:                 NOT_STORED
test eligibility:              INELIGIBLE
public publication:            false
```

The remodeled pack must receive manual English approval and then undergo source-gap and ownership expansion before any permanent QL allocation or discovery freeze.
