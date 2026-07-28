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
- identify a member by relation;
- identify a married couple;
- identify a sibling or parent-child pair;
- determine gender;
- compare generations;
- select a true or false relation claim;
- identify all members satisfying a relation.

Some source passages combine kinship with professions, heights, colours or other assignments. Those examples prove the shared-passage format but not BLR ownership of the added attribute puzzle.

## Included boundary

- named family members only;
- direct parent, child, sibling and spouse clues;
- derived grandparent, uncle/aunt, nephew/niece, cousin and common in-law relations;
- two- to four-generation connected graphs;
- one or more items sharing one prompt;
- exact relation, identity, pair, gender, generation, explicit marital-status and relation-claim items;
- a name-set answer where all matching members must be selected;
- clue minimisation and per-clue contribution proof;
- family-tree explanation data generated from the solved graph.

## Excluded or deferred

- profession, height, colour, city, floor, schedule or seating assignments needed to solve the item — General Puzzles;
- numerical member/couple/child counts — `BLR-CP-004`;
- possible, impossible, one-of-two or cannot-determine answers — `BLR-CP-005`;
- coded kinship — `BLR-CP-006` and `BLR-CP-007`;
- Data Sufficiency answer contracts;
- marital status inferred only from the absence of a displayed spouse;
- public delivery or localisation before freeze.

## Current non-permanent prototype inventory

```text
BLR-CP003-PROT-SHARED-RELATION
BLR-CP003-PROT-SHARED-IDENTIFY-PERSON
BLR-CP003-PROT-SHARED-MARRIED-PAIR
BLR-CP003-PROT-SHARED-SIBLING-PAIR
BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR
BLR-CP003-PROT-SHARED-GENDER
BLR-CP003-PROT-SHARED-GENERATION
BLR-CP003-PROT-SHARED-TRUE-CLAIM
BLR-CP003-PROT-SHARED-FALSE-CLAIM
BLR-CP003-PROT-SHARED-MEMBER-SET
BLR-CP003-PROT-MULTI-ITEM-GROUP
```

These are discovery handles, not proposed permanent QLs.

The executable milestone currently proves four graph-first scenarios, 340 deterministic groups, 2,220 independently solved items and 340 hidden-graph agreement checks. These counts remain open and must not be treated as a freeze inventory.

## Group invariants

Every generated group must satisfy all of the following:

1. the hidden graph passes family validity;
2. the graph reconstructed from displayed clues yields the same answers;
3. every item has one unique answer;
4. every option is type-compatible and unique;
5. each displayed clue contributes to graph uniqueness or at least one retained item;
6. all items use the same shared prompt and person mapping;
7. no generated item reads hidden graph answers while rendering;
8. names, item order and option order are deterministic for the seed;
9. a member-set answer contains every match and no non-match;
10. Question Studio, Question Bank, mock-test and publication gates remain disabled.

## Discovery questions still open

- whether the shared-prompt group renderer creates a permanent solve identity or only an assembly contract;
- whether relation, person, pair, gender, generation and claim items merge into frozen CP-001 authorities when embedded in a group;
- whether the member-set answer contract remains distinct after source and inverse audits;
- how explicit unmarried facts should be represented without adopting closed-world assumptions;
- how clue minimisation should preserve natural exam wording without keeping decorative facts;
- which additional family topologies are required for source saturation;
- Hindi and Punjabi passage-level pronoun and agreement risks.

No permanent allocation is permitted until source saturation, executable proof, editorial review, merge/split, inverse, human-review and second-gap audits are complete.
