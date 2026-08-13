# RNK-CP-003 — Interchange, Movement and Changed Ranks

Status: **English discovery frozen; permanent range `RNK-QL-018..026`**.

This checkpoint owns transformations of an already ranked order:

- direct or inverse ranks after two people interchange positions;
- total count inferred from an interchange-driven rank change;
- direct or inverse own rank after one movement;
- people passed or overtaken;
- target-rank effects of insertion and removal;
- rank after sequential movements;
- target-rank effects when another person crosses the target;
- movement combined with people joining or leaving from an end;
- rejection of impossible, out-of-bound or target-removal narratives.

## Frozen evidence

```text
initial prototypes:                     9
initial runtime questions:          2,160
supplementary prototypes:               4
supplementary runtime questions:       960
combined discovery:        13 prototypes / 3,120 questions
approved English corpus:               78
permanent authorities:                  9
permanent runtime questions:        1,728
open source dimensions:                 0
permanent range:              RNK-QL-018..026
next available identity:      RNK-QL-027
```

## Permanent authorities

```text
RNK-QL-018  interchange ranks, direct or inverse
RNK-QL-019  total from interchange rank change
RNK-QL-020  own rank before or after one movement
RNK-QL-021  people passed from rank change
RNK-QL-022  target rank after insertion
RNK-QL-023  target rank after removal
RNK-QL-024  own rank after sequential moves
RNK-QL-025  target-rank effect of another person’s move
RNK-QL-026  own rank with movement and membership change
```

Direct/inverse forms merge when they replay the same transformation. Insertion and removal remain separate because they change group size in opposite directions and own different invalid-state and distractor contracts.

## Approved English projection

```text
sha256:6457a50fdde7673f9e66fe607a47a5c38a4c921489ed387b72c87ef8a22947d5
```

## Construction model

```text
construct a valid ranked state
  -> apply or reverse the stated transformation
  -> normalize mixed-end ranks
  -> independently replay displayed evidence
  -> reject invalid intermediate states
  -> build misconception-owned options
  -> render question-specific English teaching
  -> expose permanent review identity while delivery stays locked
```

## Authoritative records

- `RNK-CP-003-SOURCE-GAP-AUDIT.md`;
- `RNK-CP-003-ENGLISH-MANUAL-REVIEW.md`;
- `RNK-CP-003-FINAL-DISCOVERY-FREEZE.md`;
- `RNK-CP-003-IMPLEMENTATION-REPORT.md`;
- `cp003-consolidation.test.ts`;
- `cp003-final-source-gap.test.ts`;
- `cp003-permanent-runtime.test.ts`;
- `cp003-final-discovery-freeze.test.ts`.

## Safety boundary

```text
English discovery frozen:       true
English review-only:             true
Hindi/Punjabi:                  not started
Question Studio:                disabled
Question Bank:                  NOT_STORED
test eligibility:               INELIGIBLE
public publication:             false
```
