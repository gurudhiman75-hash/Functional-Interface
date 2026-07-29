# BLR-CP-003 — Lineage and Generation Saturation Audit V1

Status: **open English discovery; non-permanent grouped prototype proof**.

## Source finding

Family-set passages commonly combine several generations and ask broad or exact branch questions. Paternal means the path passes through the father; maternal means it passes through the mother. Public preparation material also uses shared multi-generation passages rather than limiting every item to an isolated relation chain.

## Runtime decision

The grouped runtime reuses the frozen CP-001 exact-lineage solver for:

- paternal grandfather;
- paternal grandmother;
- maternal grandfather;
- maternal grandmother;
- paternal aunt identification;
- maternal uncle identification.

The grouped passage does not implement a second lineage algorithm. Its new responsibility is assembly: reconstruct one shared family, invoke the existing solver for each item and preserve common explanation rows.

A separate four-generation passage proves:

- great-grandfather;
- great-granddaughter;
- identify a member by a great-generation relation;
- three generations above;
- three generations below;
- a definitely true direct relation claim.

## Executable scenarios

```text
BLR-CP003-SCN-DUAL-MATERNAL-PATERNAL-BRANCH
BLR-CP003-SCN-FOUR-GENERATION-DIRECT-LINE
```

Temporary handles explored:

```text
BLR-CP003-PROT-SHARED-EXACT-LINEAGE
BLR-CP003-PROT-SHARED-IDENTIFY-BY-EXACT-LINEAGE
BLR-CP003-PROT-SHARED-GREAT-RELATION
BLR-CP003-PROT-SHARED-IDENTIFY-BY-RELATION
BLR-CP003-PROT-SHARED-THREE-GENERATION-COMPARE
BLR-CP003-PROT-SHARED-TRUE-CLAIM
```

## Proof obligations

The deterministic gate requires:

- hidden graph and clue-only answers to agree;
- every displayed clue to affect at least one retained answer;
- aunt and uncle gender to be entailed by displayed daughter/son clues;
- exact-lineage items to call the frozen CP-001 solver;
- four unique semantic options with one correct answer;
- balanced answer positions;
- stable semantic fingerprints independent of names and seeds;
- deterministic generation-row explanation rendering;
- all delivery and localisation locks to remain closed.

## Merge/split implication

Current evidence suggests that exact-lineage, named-person relation, person identification, generation comparison and true-claim items may merge back into frozen CP-001 solve authorities when embedded in a passage. The shared passage itself may remain an assembly contract rather than a student solve identity.

This is a provisional inference only. No permanent QL is allocated, and `BLR-QL-009` remains unclaimed until the complete CP-003 merge/split, inverse, editorial, human and second-gap sequence is complete.
