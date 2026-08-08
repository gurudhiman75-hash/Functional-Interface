# RNK-CP-005 — Source and Ownership Audit

Status: **PASS — presentation-led shared-set ownership consolidated.**

## Objective

CP-005 must add an exam feature that CP-004 does not provide: one displayed ranking set reused across several linked questions and rendered through structured table, ledger or clue-passage formats.

The checkpoint does not create a new QL merely because a standalone ranking question is reworded as a row, queue, merit list or race. Permanent identity is justified by the shared evidence lifecycle and linked-question contract.

## Audited source families

| Source family | Included | Reason |
|---|---:|---|
| row or queue common passage | yes | shared start/end direction and linked questions |
| merit-list rank table | yes | structured rank rows reused by several queries |
| race result or finishing ledger | yes | first-to-last shared order |
| interview shortlist | yes | exam-natural top-to-bottom ranking context |
| performance order | yes | ranking is decisive; no attribute calculation |
| complete comparison-clue passage | yes | reconstruct once, answer linked queries |
| standalone comparison chain | no | CP-004 |
| rank arithmetic from two numbers | no | CP-001/CP-002 |
| movement or interchange | no | CP-003 |
| marks, height or age calculation | no | CP-006 or arithmetic owner |
| multiple valid orders | no | CP-007 |
| statement-wise data sufficiency | no | Data Sufficiency |
| seating/facing geometry | no | Seating Arrangement |

## Presentation audit

Three materially different evidence contracts remain after consolidation:

### `RANK_TABLE`

The rows may be displayed in any order, but each entity has one explicit rank. The solver sorts by `rankFromStart` and rejects duplicate, missing or out-of-range positions.

### `ORDER_LEDGER`

The displayed ledger already runs from the stated start side to the end side. The learner reads and reuses the line. This supports easier shared-set questions without inventing a different solve authority.

### `COMPARISON_CLUES`

Adjacent comparisons are displayed in shuffled sentence order. A unique topological reconstruction is required. Cycles and multiple available next entities are rejected.

## Context audit

The same structural order is adapted to six contexts:

```text
ROW                   left → right
QUEUE                 front → back
MERIT_LIST            top → bottom
RACE_FINISH           first → last
INTERVIEW_SHORTLIST   top → bottom
PERFORMANCE_ORDER     highest → lowest
```

Context does not create a QL. It is a controlled language and renderer parameter.

## Authority consolidation

The source families reduce to eight linked-query authorities:

```text
SHARED_ENDPOINT_ENTITY
SHARED_ENTITY_AT_POSITION
SHARED_RANK_OF_ENTITY
SHARED_PAIR_RELATION
SHARED_RANK_GAP
SHARED_IMMEDIATE_NEIGHBOUR
SHARED_COMPLETE_ORDER
SHARED_TRUE_STATEMENT
```

Endpoint direction, opposite-end position, reverse complete order and context vocabulary are parameters, not duplicate authorities.

## Shared-set validity rules

Reject any set with:

- fewer than six or more than eight entities;
- duplicate entity names;
- duplicate or missing ranks;
- rank outside `1..N`;
- unknown entity in a comparison;
- self comparison;
- comparison cycle;
- more than one valid reconstructed order;
- linked questions using different passage fingerprints;
- an unavailable immediate neighbour;
- fewer or more than four unique options;
- more than one correct option;
- an explanation that rebuilds a different order from the displayed evidence.

## Distractor ownership

Wrong options are generated from explicit learner errors:

- opposite-end counting;
- off-by-one position;
- people-between count used as rank gap;
- extra boundary included;
- reversed pair relation;
- reversed complete-order direction;
- adjacent rows swapped;
- linear order treated as circular;
- wrong shared row selected.

Random unrelated offsets are not used as the primary distractor route.

## Review decision

CP-005 is distinct from CP-004 because the permanent contract includes:

- stable shared-set identity;
- one passage fingerprint across linked questions;
- renderer class and presentation metadata;
- recommended linked-set assembly size;
- passage-level reconstruction reuse;
- linked-question consistency gates.

The next free permanent identity after consolidation is `RNK-QL-044`.
