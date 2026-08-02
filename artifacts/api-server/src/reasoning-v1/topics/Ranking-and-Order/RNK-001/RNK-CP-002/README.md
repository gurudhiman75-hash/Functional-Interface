# RNK-CP-002 — Two-Person Positions

Status: **executable discovery opened; permanent QL count intentionally unset**.

Base checkpoint dependency: `RNK-CP-001` English discovery freeze at `5090b7d00ab7d288103221a862a9f19dbb62cfcd`.

## Purpose

Discover the complete solver and answer-contract surface for questions involving two distinct positions in one ordered group.

The checkpoint begins from a normalized two-person state:

```text
N                  total members
rA                 first person's rank from the start
rB                 second person's rank from the start
N - rA + 1         first person's rank from the end
N - rB + 1         second person's rank from the end
|rA - rB|          position gap
|rA - rB| - 1      members strictly between
```

Every question is constructed from a valid hidden state before learner evidence is rendered. An independent solver sees only the displayed evidence.

## First executable discovery wave

The foundation intentionally uses provisional prototype identities rather than permanent QLs:

```text
RNK-CP002-PROT-PEOPLE-BETWEEN-SAME-END-RANKS
RNK-CP002-PROT-POSITION-GAP-SAME-END-RANKS
RNK-CP002-PROT-SECOND-RANK-FROM-RELATIVE-OFFSET
RNK-CP002-PROT-PEOPLE-BETWEEN-MIXED-END-RANKS
RNK-CP002-PROT-TOTAL-FROM-MIXED-END-RANKS-KNOWN-ORDER
RNK-CP002-PROT-EXTREME-TOTAL-FROM-MIXED-END-RANKS-UNKNOWN-ORDER
```

These six probes do not imply six final QLs. Source, inverse, representation, edge, merge/split and ownership audits remain open.

## First-wave coverage

- two ranks measured from the same end;
- people strictly between versus raw position difference;
- second rank from a relative positional offset;
- mixed-end normalization with a known total;
- total from mixed-end ranks when relative order is stated;
- minimum/maximum possible total when relative order is not stated;
- top/bottom, left/right and front/back representations;
- adjacent, endpoint, reversed-order and wide-gap states;
- Rank, Count and Total answer semantics.

## Explicit exclusions

The following are not owned by this checkpoint:

- interchange or swapping positions → `RNK-CP-003`;
- movement, overtaking, insertion or removal → `RNK-CP-003`;
- reconstruction of three or more named entities → `RNK-CP-004`;
- shared passages → later RNK checkpoint;
- statement-wise sufficiency labels → Data Sufficiency;
- adjacency/facing/geometry → Seating Arrangement;
- multi-attribute matching → Logic Puzzles.

## Required discovery gates

Before permanent identity can be considered, CP-002 must complete:

1. source-pattern saturation;
2. direct and inverse query audit;
3. known-order and unknown-order validity audit;
4. min/max and impossible-state audit;
5. same-end versus mixed-end merge/split audit;
6. distractor ownership review;
7. full English editorial review;
8. post-review no-new-gap confirmation.

## Current lifecycle

```text
permanentQlId:              null
reviewStatus:               UNREVIEWED
questionStudioDiscoverable: false
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
Hindi/Punjabi:              not started
```
