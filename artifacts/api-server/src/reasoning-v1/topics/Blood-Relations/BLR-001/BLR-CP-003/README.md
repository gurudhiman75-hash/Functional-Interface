# BLR-CP-003 — Family-Set Passages and Shared Graphs

Status: **English visual teacher remediation complete; V3 human review pending; zero permanent QLs**.

## Ownership

This checkpoint owns pure-kinship shared passages. One hidden family graph yields one compact clue block, and clue-only reconstruction supports several independently solved items.

The current executable slice covers:

- eight graph-first family scenarios across ordinary, affinal, sibling-set, explicit-marital, dual-lineage, four-generation and compact joint-parent structures;
- eighteen temporary item handles plus one temporary group-assembly handle;
- relation between named members and identification by relation;
- identification from a supplied gender and candidate set;
- married, sibling and parent-child pair selection;
- determine-gender and generation questions, including three-generation distance;
- definitely true and definitely false claims;
- complete sets of all members satisfying a relation;
- explicit married and unmarried status without closed-world inference;
- paternal and maternal grandparent, aunt and uncle resolution through the frozen CP-001 exact-lineage solver;
- great-grandparent and great-grandchild paths;
- compact couple and joint-parent rendering with every co-parent edge explicitly modelled;
- six to eight questions per shared passage;
- hidden-graph versus clue-only answer agreement;
- standard visual family-tree diagrams;
- conversational four-tier teacher explanations;
- option-by-option learner guidance;
- subject-to-reference direction verification;
- item-specific four-option construction;
- per-clue and per-status-fact contribution rejection;
- deterministic names, prompts, answers and option order;
- release locks on every group.

## Current executable inventory

```text
Base graph-first scenarios                    3
Extended sibling/set scenarios                1
Explicit marital-status scenarios             1
Lineage and four-generation scenarios         2
Compact joint-parent source-gap scenarios     1
---------------------------------------------------
Executable discovery scenarios                8
Temporary item handles                       18
Temporary group-assembly handles              1
Deterministic groups                        760
Independently solved items                4,940
Hidden-graph agreement checks               760
Per-group input-contribution checks         760
Permanent QLs                                 0
```

These figures describe a technical pre-freeze milestone, not a frozen inventory.

## Active English review candidate

```text
Review pack version                 V3
Shared-family groups                32
Learner-facing records             208
Scenario/topology count              8
Temporary item handles              18
Visual family-tree diagrams        208
Option-by-option analyses          208
Answer positions       [57, 53, 49, 49]
```

V3 supersedes V2 as the active human-review candidate. Every question now contains:

```text
📌 Core Concept
📝 Step-by-Step Solution & Family Tree
💡 10-Second Exam Speed Shortcut
⚠️ Common Traps & Mistakes
```

The visual renderer uses:

```text
(+)       male, when stated
(-)       female, when stated
========  married couple
│         parent-child lineage
──        siblings
```

An unstated gender is left unmarked rather than guessed. Learner-visible V3 records contain no raw semantic keys, internal error labels or graph-engine wording.

V3 is ready for human review but is not approved or frozen.

## Current compression hypothesis

```text
Handles merged into frozen QLs        10
Provisional new handles                 8
Provisional new solve authorities       6
Assembly-only handles                   1
Permanent CP-003 QLs                    0
```

Frozen QLs reused by grouped items:

```text
BLR-QL-001
BLR-QL-002
BLR-QL-003
BLR-QL-005
BLR-QL-006
BLR-QL-007
```

Provisional new authorities:

```text
DETERMINE_MEMBER_GENDER
SELECT_UNORDERED_FAMILY_PAIR
IDENTIFY_ALL_MEMBERS_BY_RELATION
DETERMINE_MEMBER_MARITAL_STATUS
IDENTIFY_MEMBER_BY_MARITAL_STATUS
IDENTIFY_PERSON_BY_EXACT_LINEAGE
```

## Main audit records

- `BLR-CP-003-SOURCE-AND-BOUNDARY-AUDIT.md`
- `BLR-CP-003-MARITAL-STATUS-AUDIT-V1.md`
- `BLR-CP-003-LINEAGE-SATURATION-AUDIT-V1.md`
- `BLR-CP-003-MERGE-SPLIT-AUDIT-V1.md`
- `BLR-CP-003-INVERSE-AUDIT-V1.md`
- `BLR-CP-003-SECOND-SOURCE-GAP-PRE-HUMAN.md`
- `BLR-CP-003-ENGLISH-EDITORIAL-READINESS-V2.md`
- `BLR-CP-003-HUMAN-EDITORIAL-REMEDIATION-V3.md`

## Main V3 files

- `cp003-visual-tree-renderer.ts`
- `cp003-teacher-editorial.ts`
- `cp003-teacher-editorial-finalizer.ts`
- `cp003-teacher-editorial.test.ts`
- `export-cp003-review-v3.ts`

## Current temporary item handles

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

Assembly handle:

```text
BLR-CP003-PROT-MULTI-ITEM-GROUP
```

These IDs are discovery handles, not proposed permanent identities. `BLR-QL-009` remains unclaimed.

## Key semantic boundaries

```text
named spouse edge or explicit married fact -> MARRIED
explicit unmarried fact                    -> UNMARRIED
missing spouse edge alone                  -> no status conclusion
marriage alone                              -> no co-parent conclusion
joint-parent wording                        -> both parent edges required
unstated gender                             -> no learner marker
```

Only-child and family-composition facts remain in CP-004. Possible, impossible and cannot-determine semantics remain in CP-005.

## Remaining mandatory work

- human review of the 208-record V3 pack;
- accepted follow-up remediation, if any;
- rerun of every affected deterministic gate;
- post-human source-gap confirmation;
- final discovery freeze;
- sequential QL allocation only after freeze.

## Release boundary

- English review-only: true;
- Question Studio visibility: disabled;
- Question Bank eligibility: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled.
