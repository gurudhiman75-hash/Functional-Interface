# RNK-CP-002 Source and Inverse Saturation Audit

Status: **all currently evidenced two-person ranking contracts represented; English review pending**.

## Source evidence

The uploaded `reasoning_aggarwal.pdf` confirms the core opposite-end ambiguity pattern:

- one person is ranked from the start end;
- another person is ranked from the end;
- a fixed number of people lie between them;
- relative order is not stated;
- two different totals may be valid, so the exact total can be indeterminate.

The same source places shifting and interchange in later types. Those remain owned by `RNK-CP-003`, not CP-002.

## Executable discovery inventory

```text
foundation wave                       6 prototypes / 1,440 questions
source and inverse saturation wave    7 prototypes / 1,680 questions
-------------------------------------------------------------------
combined discovery                   13 prototypes / 3,120 questions
```

## Consolidated authorities

The 13 prototypes consolidate into eight authorities:

1. people between normalized positions;
2. position gap between normalized positions;
3. target rank from reference rank and directional separation;
4. compare normalized positions;
5. total from mixed-end ranks and known order;
6. minimum or maximum valid total under unknown order;
7. exact total or indeterminate outcome under unknown order;
8. relative-order status for a proposed total.

## Closed dimensions

| Dimension | Disposition |
|---|---|
| people between, same-end ranks | authority 1 |
| people between, mixed-end ranks with total | authority 1 |
| raw position gap, same-end ranks | authority 2 |
| raw position gap, mixed-end ranks with total | authority 2 |
| inverse offset from two ranks | authority 2 |
| target rank from an offset | authority 3 |
| target rank from people-between plus order | authority 3 |
| nearer/higher/lower comparison, same-end | authority 4 |
| nearer/higher/lower comparison, mixed-end with total | authority 4 |
| total from mixed-end ranks, gap and known order | authority 5 |
| minimum/maximum total when order is unknown | authority 6 |
| exact total versus cannot determine | authority 7 |
| unique-total boundary when reversed order is invalid | authority 7 |
| proposed total compatible with first-before-second | authority 8 |
| proposed total compatible with second-before-first | authority 8 |
| proposed total impossible under both orders | authority 8 |
| adjacent positions and zero people between | represented across authorities 1–3 |
| first/last endpoint positions | represented across authorities 1–4 |
| both-valid versus one-valid order branches | authorities 6–8 |
| top/bottom, left/right, front/back | renderer parameters |

## Merge decisions

### Clean merges

- same-end and mixed-end people-between questions merge after common-end normalization;
- same-end position difference, mixed-end position difference and inverse offset merge as one positional-gap authority;
- target rank from a direct offset and target rank from a people-between count merge through a separation-evidence parameter;
- same-end and mixed-end comparison questions merge after common-end normalization;
- minimum and maximum total remain one authority with an extremum parameter.

### Retained separately

- people-between and position-gap remain separate because one requires the endpoint subtraction and the other does not;
- target-rank reconstruction remains separate from separation recovery because the requested answer semantic and directional arithmetic differ;
- known-order total, unknown-order extreme total, exact-total determinacy and proposed-total status remain separate because their evidence, answer domains and validity logic differ materially.

## Derived variants that do not create new QLs

- number of possible totals is a projection of authority 7's valid-branch count;
- “is this total possible?” is a yes/no renderer over authority 8's order-status result;
- “which person is higher/lower/nearer?” is a renderer parameter of authority 4;
- first-person versus second-person target inversion is a name-role swap under authority 3;
- start/end, top/bottom, left/right and front/back are context parameters.

## Rejected or deferred ownership

```text
shift, move, pass, overtake, insert, remove    -> RNK-CP-003
interchange or swap positions                  -> RNK-CP-003
three-or-more-person comparative ordering      -> RNK-CP-004
shared ranking passages                        -> RNK-CP-005
partial-order possibility across many people   -> RNK-CP-007
statement-wise sufficiency labels              -> Data Sufficiency
facing/adjacency geometry                      -> Seating Arrangement
```

## Current verdict

```text
source prototypes:             13
provisional authorities:        8
open CP-002 source dimensions:  0
permanent QLs:                  0
English review complete:        false
freeze granted:                 false
```

The next gate is full English review of the 48-question eight-authority corpus, followed by a final no-new-gap confirmation and explicit discovery freeze.
