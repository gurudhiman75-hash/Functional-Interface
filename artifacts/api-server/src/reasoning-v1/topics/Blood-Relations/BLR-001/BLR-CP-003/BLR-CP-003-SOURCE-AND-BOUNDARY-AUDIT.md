# BLR-CP-003 — Source and Boundary Audit

Status: **open English discovery; no permanent QL allocated**.

## Purpose

`BLR-CP-003` owns graph-first family passages in which one compact clue block is solved once and reused by one or more kinship questions.

The checkpoint must prove a true group runtime:

```text
valid hidden family graph
  -> compact shared clue set
  -> clue-only graph reconstruction
  -> several independently solved items
  -> item-specific options and explanations
```

The next available chapter identity remains `BLR-QL-009`, but it is unclaimed until discovery freezes.

## Source evidence

Uploaded reasoning references repeatedly use a direction block followed by two or more questions over the same family. Source-backed item forms include:

- relation between two named members;
- identify a married couple;
- identify a sibling or parent-child pair;
- determine gender;
- compare generations;
- identify a member by a stated relation;
- select a true or false relation claim.

Some source passages combine kinship with professions, heights, colours or other assignments. Those examples prove the shared-passage format but not BLR ownership of the added attribute puzzle.

## Included boundary

- named family members only;
- direct parent, child, sibling and spouse clues;
- derived grandparent, uncle/aunt, nephew/niece, cousin and common in-law relations;
- two- to four-generation connected graphs;
- one or more items sharing one prompt;
- exact relation, identity, pair, gender, generation, marital-status and relation-claim items;
- clue minimisation and per-clue contribution proof;
- family-tree explanation data generated from the solved graph.

## Excluded or deferred

- profession, height, colour, city, floor, schedule or seating assignments needed to solve the item — General Puzzles;
- numerical member/couple/child counts — `BLR-CP-004`;
- possible, impossible, one-of-two or cannot-determine answers — `BLR-CP-005`;
- coded kinship — `BLR-CP-006` and `BLR-CP-007`;
- Data Sufficiency answer contracts;
- public delivery or localisation before freeze.

## Initial non-permanent prototype inventory

The first executable slice explores:

```text
BLR-CP003-PROT-SHARED-RELATION
BLR-CP003-PROT-SHARED-MARRIED-PAIR
BLR-CP003-PROT-SHARED-GENDER
BLR-CP003-PROT-SHARED-GENERATION
BLR-CP003-PROT-SHARED-TRUE-CLAIM
BLR-CP003-PROT-MULTI-ITEM-GROUP
```

These are discovery handles, not proposed permanent QLs. Later source passes must still test person-by-relation, sibling pair, parent-child pair, marital status, false claim and all-members-satisfying-relation forms.

## Group invariants

Every generated group must satisfy all of the following:

1. the hidden graph passes family validity;
2. the graph reconstructed from displayed clues yields the same answers;
3. every item has one unique answer;
4. every option is type-compatible and unique;
5. each displayed clue contributes to graph uniqueness or at least one retained item;
6. all items use the same shared prompt and person mapping;
7. no item reads hidden graph data directly;
8. names, item order and option order are deterministic for the seed;
9. Question Studio, Question Bank, mock-test and publication gates remain disabled.

## Discovery questions still open

- whether the shared-prompt group renderer itself creates a permanent solve identity or only an assembly contract;
- whether relation, pair, gender, generation and claim items merge into already frozen CP-001 authorities when embedded in a group;
- whether identify-all-members has a materially different answer contract;
- how clue minimisation should preserve natural exam wording without keeping decorative facts;
- which family topologies are required for source saturation;
- Hindi and Punjabi passage-level pronoun and agreement risks.

No permanent allocation is permitted until source saturation, executable proof, editorial review, merge/split, inverse and second-gap audits are complete.
