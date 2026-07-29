# BLR-CP-003 — Source and Boundary Audit

Status: **open English discovery; no permanent QL allocated**.

## Purpose

`BLR-CP-003` owns graph-first family passages in which one compact clue block is solved once and reused by several kinship questions.

The checkpoint must prove a true group runtime:

```text
valid hidden family graph
  -> compact shared clue and explicit-fact set
  -> clue-only graph reconstruction
  -> several independently solved items
  -> item-specific options and explanations
```

The next available chapter identity remains `BLR-QL-009`, but it is unclaimed until discovery freezes.

## Source evidence

Reasoning references repeatedly use a direction block followed by two or more questions over the same family. Source-backed item forms now represented by executable prototypes include:

- relation between two named members;
- identify a member by a broad or exact relation;
- identify a married couple;
- identify a sibling or parent-child pair;
- determine gender;
- compare generations, including a three-level difference;
- select a true or false relation claim;
- identify all members satisfying a relation;
- determine or identify explicit marital status;
- distinguish paternal and maternal grandparent, aunt and uncle paths;
- solve great-grandparent and great-grandchild relations in a four-generation passage.

Some source passages combine kinship with professions, heights, colours or other assignments. Those examples prove the shared-passage format but not BLR ownership of the added attribute puzzle.

## Included boundary

- named family members only;
- direct parent, child, sibling and spouse clues;
- explicit marital facts where supplied by the passage;
- derived grandparent, great-grandparent, uncle/aunt, nephew/niece, cousin and common in-law relations;
- exact paternal and maternal lineage labels;
- two- to four-generation connected graphs;
- one or more items sharing one prompt;
- exact relation, identity, pair, gender, generation, explicit marital-status and relation-claim items;
- a name-set answer where all matching members must be selected;
- clue and fact minimisation through contribution proof;
- family-tree and generation-row explanation data generated from the solved graph.

## Excluded or deferred

- profession, height, colour, city, floor, schedule or seating assignments needed to solve the item — General Puzzles;
- numerical member/couple/child counts — `BLR-CP-004`;
- possible, impossible, one-of-two or cannot-determine answers — `BLR-CP-005`;
- coded kinship — `BLR-CP-006` and `BLR-CP-007`;
- Data Sufficiency answer contracts;
- marital status inferred only from the absence of a displayed spouse;
- spouse-to-co-parent inference without an explicit parent clue;
- public delivery or localisation before freeze.

## Current non-permanent item inventory

```text
BLR-CP003-PROT-SHARED-RELATION
BLR-CP003-PROT-SHARED-IDENTIFY-PERSON
BLR-CP003-PROT-SHARED-IDENTIFY-BY-RELATION
BLR-CP003-PROT-SHARED-MARRIED-PAIR
BLR-CP003-PROT-SHARED-SIBLING-PAIR
BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR
BLR-CP003-PROT-SHARED-GENDER
BLR-CP003-PROT-SHARED-GENERATION
BLR-CP003-PROT-SHARED-THREE-GENERATION-COMPARE
BLR-CP003-PROT-SHARED-TRUE-CLAIM
BLR-CP003-PROT-SHARED-FALSE-CLAIM
BLR-CP003-PROT-SHARED-MEMBER-SET
BLR-CP003-PROT-SHARED-MARITAL-STATUS
BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS
BLR-CP003-PROT-SHARED-EXACT-LINEAGE
BLR-CP003-PROT-SHARED-IDENTIFY-BY-EXACT-LINEAGE
BLR-CP003-PROT-SHARED-GREAT-RELATION
```

Temporary group assembly handle:

```text
BLR-CP003-PROT-MULTI-ITEM-GROUP
```

These are discovery handles, not proposed permanent QLs.

## Current executable milestone

```text
Executable scenarios                    7
Temporary item handles                 17
Temporary assembly handles              1
Deterministic groups                   660
Independently solved items           4,140
Hidden-graph agreement checks          660
Input-contribution checks              660
Permanent QLs                            0
```

The milestone includes 600 item records that explicitly reuse the frozen CP-001 exact-lineage solver. Counts remain open and must not be treated as a freeze inventory.

## Group invariants

Every generated group must satisfy all of the following:

1. the hidden graph passes family validity;
2. the graph reconstructed from displayed clues yields the same answers;
3. every item has one unique answer;
4. every option is type-compatible and unique;
5. each displayed clue or explicit fact contributes to at least one retained answer;
6. all items use the same shared prompt and person mapping;
7. no generated item reads hidden graph answers while rendering;
8. names, item order and option order are deterministic for the seed;
9. a member-set answer contains every match and no non-match;
10. `UNMARRIED` requires an explicit unmarried fact;
11. paternal and maternal labels are derived from the intermediate parent’s entailed gender;
12. Question Studio, Question Bank, mock-test and publication gates remain disabled.

## Discovery questions still open

- whether the shared-prompt group renderer creates a permanent solve identity or only an assembly contract;
- which item handles merge into frozen CP-001 authorities when embedded in a group;
- whether the member-set answer contract remains distinct after source and inverse audits;
- whether marital-status selection creates a separate solve identity or a fact-selection variant;
- how clue minimisation should preserve natural exam wording without keeping decorative facts;
- which less-common affinal or multi-branch topologies remain source-significant;
- Hindi and Punjabi passage-level pronoun and agreement risks.

No permanent allocation is permitted until source saturation, executable proof, editorial review, merge/split, inverse, human-review and second-gap audits are complete.
