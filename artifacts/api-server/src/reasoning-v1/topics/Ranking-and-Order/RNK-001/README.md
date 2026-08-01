# RNK-001 — Ranking and Order

Status: **authoritative chapter design launched; CP-001 executable discovery active; permanent QL count open**.

Student-facing chapter: **Ranking and Order**  
Reasoning V1 package: `RNK-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `RNK-001-END-TO-END-DESIGN.md`;
4. `rnk-001-open-ql-discovery.md`;
5. checkpoint-specific source, prototype, merge/split, gap, freeze and review records;
6. future manifest amendments only after an executable discovery freeze.

## Core construction model

```text
construct a valid hidden total order
  -> derive only the evidence intended for the learner
  -> solve the displayed evidence independently
  -> reject ambiguity or inconsistent rank arithmetic
  -> construct misconception-owned options
  -> render question-specific teaching
  -> expose review metadata while delivery remains locked
```

The hidden order and normalized rank state are the logic authority. Learner-facing wording is a renderer and must never determine the answer.

## Provisional checkpoint map

| Checkpoint | Provisional ownership | State |
|---|---|---|
| `RNK-CP-001` | one-person rank arithmetic and opposite-end conversion | executable discovery active |
| `RNK-CP-002` | two-person rank difference and people-between questions | planned |
| `RNK-CP-003` | interchange, movement and changed-rank questions | planned |
| `RNK-CP-004` | comparative ordering of several named entities | planned |
| `RNK-CP-005` | row, queue, merit-list and finishing-order presentations | planned ownership audit |
| `RNK-CP-006` | height, age, marks and other attribute-led ranking | planned ownership audit |
| `RNK-CP-007` | partial-order, definite/possible and uniqueness semantics | planned |
| `RNK-CP-008` | shared passages and advanced synthesis | planned |

Checkpoint boundaries are provisional. They may merge or split after executable source and ownership audits. Counts are not quotas.

## CP-001 first executable frontier

The architecture-establishing first wave contains six provisional prototypes:

```text
RNK-CP001-PROT-OPPOSITE-END-RANK
RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS
RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK
RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK
RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE
RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL
```

These are discovery identities, not permanent QLs. They may compress into fewer learner contracts or widen after the source-gap audit.

## Ownership boundaries

RNK-001 owns questions whose primary burden is position in an ordered set, including rank from either end, total count, count before/after, relative rank, interchange and order reconstruction.

Excluded or reassigned when another burden dominates:

- dictionary or lexicographic ordering -> Word and Dictionary Order;
- clue-heavy seating placement -> Seating Arrangement;
- profession/city/day/colour multi-attribute assignment -> Logic Puzzles;
- race scoring, league tables or tournament mechanics -> Games and Tournament;
- age calculation before ranking -> the relevant Quant chapter unless ranking remains the decisive task;
- statement-wise sufficiency labels -> Data Sufficiency;
- alphabet-position arithmetic without an ordered group -> Alphabet Test;
- public generation, Question Bank, tests or publication before separate release gates.

## Current lifecycle

```text
permanent QLs:              0
frozen solve modes:         0
English editorial approval: false
Hindi/Punjabi:              not started
Question Studio:            disabled
Question Bank:              disabled
test eligibility:           disabled
public publication:         disabled
```

The next permanent identity would be `RNK-QL-001`, but it is not reserved or allocated by this design launch.
