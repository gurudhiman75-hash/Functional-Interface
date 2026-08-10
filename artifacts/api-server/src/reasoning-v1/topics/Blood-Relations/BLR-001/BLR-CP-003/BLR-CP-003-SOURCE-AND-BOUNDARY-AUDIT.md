# BLR-CP-003 — Source and Boundary Audit

Status: **technical pre-human English discovery complete; no permanent QL allocated**.

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
- identify a person from a supplied gender and candidate set;
- identify a married couple;
- identify a sibling or parent-child pair;
- determine a named member's gender;
- compare generations, including a three-level difference;
- select a true or false relation claim;
- identify all members satisfying a relation;
- determine or identify explicit marital status;
- distinguish paternal and maternal grandparent, aunt and uncle paths;
- solve great-grandparent and great-grandchild relations in a four-generation passage;
- use compact couple and joint-parent wording when every parent edge is explicitly represented.

Some source passages combine kinship with professions, heights, colours or other assignments. Those examples prove the shared-passage format but not BLR ownership of the added attribute puzzle.

## Included boundary

- named family members only;
- direct parent, child, sibling and spouse clues;
- explicit marital facts where supplied by the passage;
- compact `their son`, `their daughter` and `son of X and Y` wording backed by both parent edges;
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
- numerical member/couple/child counts and only-child composition facts — `BLR-CP-004`;
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
BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER
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
Executable scenarios                    8
Temporary item handles                 18
Temporary assembly handles              1
Deterministic groups                   760
Independently solved items           4,940
Hidden-graph agreement checks          760
Input-contribution checks              760
Permanent QLs                            0
```

The milestone includes 600 item records that explicitly reuse the frozen CP-001 exact-lineage solver and 100 grouped person-by-gender items mapped to frozen `BLR-QL-003`. Counts remain open until human review and post-human confirmation complete.

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
12. joint-parent wording is permitted only when both parent edges are represented;
13. Question Studio, Question Bank, mock-test and publication gates remain disabled.

## Technical merge/split result

```text
handles merged into frozen QLs   10
provisional new handles            8
provisional new authorities        6
assembly-only handles              1
```

The shared passage remains assembly-only. The grouped person-by-gender handle merges into frozen `BLR-QL-003`; the determine-gender label task remains provisionally separate.

## Remaining questions for human review

- whether the shared-prompt wording is natural across all eight scenario families;
- whether the six provisional authorities remain intuitively distinct to an editor;
- whether the member-set and unordered-pair options are easy to compare;
- whether maternal/paternal explanations are clear without over-teaching;
- whether compact joint-parent wording remains unambiguous;
- Hindi and Punjabi passage-level pronoun and agreement risks.

No permanent allocation is permitted until human review, accepted remediation, deterministic reruns, post-human source-gap confirmation and final freeze are complete.
