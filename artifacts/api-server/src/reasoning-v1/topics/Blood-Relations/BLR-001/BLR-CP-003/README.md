# BLR-CP-003 — Family-Set Passages and Shared Graphs

Status: **English open discovery; graph-first grouped runtime active; zero permanent QLs**.

## Ownership

This checkpoint owns pure-kinship shared passages. One hidden family graph yields one compact clue block, and clue-only reconstruction supports several independently solved items.

The current executable slice covers:

- seven graph-first family scenarios across ordinary, affinal, sibling-set, explicit-marital, dual-lineage and four-generation structures;
- seventeen temporary item handles plus one temporary group-assembly handle;
- relation between named members and identification by relation;
- married, sibling and parent-child pair selection;
- gender and generation questions, including three-generation distance;
- definitely true and definitely false claims;
- complete sets of all members satisfying a relation;
- explicit married and unmarried status without closed-world inference;
- paternal and maternal grandparent, aunt and uncle resolution through the frozen CP-001 exact-lineage solver;
- great-grandparent and great-grandchild paths;
- six or seven questions per shared passage;
- hidden-graph versus clue-only answer agreement;
- deterministic generation-row explanation data;
- item-specific four-option construction;
- per-clue and per-status-fact contribution rejection;
- deterministic names, prompts, answers and option order;
- release locks on every group.

## Current executable inventory

```text
Base graph-first scenarios                 3
Extended sibling/set scenarios             1
Explicit marital-status scenarios          1
Lineage and four-generation scenarios      2
------------------------------------------------
Executable discovery scenarios             7
Temporary item handles                    17
Temporary group-assembly handles           1
Deterministic groups                     660
Independently solved items             4,140
Hidden-graph agreement checks            660
Per-group input-contribution checks      660
Permanent QLs                              0
```

These figures describe an open-discovery milestone, not freeze targets.

## Main files

- `BLR-CP-003-SOURCE-AND-BOUNDARY-AUDIT.md`
- `BLR-CP-003-MARITAL-STATUS-AUDIT-V1.md`
- `BLR-CP-003-LINEAGE-SATURATION-AUDIT-V1.md`
- `cp003-types.ts`
- `cp003-scenario-library.ts`
- `cp003-solver.ts`
- `cp003-generator.ts`
- `cp003-prototype.test.ts`
- `cp003-extended-types.ts`
- `cp003-extended-scenario.ts`
- `cp003-extended-solver.ts`
- `cp003-extended-generator.ts`
- `cp003-extended.test.ts`
- `cp003-marital-types.ts`
- `cp003-marital-scenario.ts`
- `cp003-marital-solver.ts`
- `cp003-marital-generator.ts`
- `cp003-marital.test.ts`
- `cp003-lineage-types.ts`
- `cp003-lineage-scenarios.ts`
- `cp003-lineage-solver.ts`
- `cp003-lineage-generator.ts`
- `cp003-lineage.test.ts`

## Current temporary item handles

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

Assembly handle:

```text
BLR-CP003-PROT-MULTI-ITEM-GROUP
```

These IDs are discovery handles, not proposed permanent identities. Several are expected to merge into frozen CP-001 solve authorities after the formal merge/split audit. `BLR-QL-009` remains unclaimed.

## Explicit marital-status rule

```text
named spouse edge or explicit married fact -> MARRIED
explicit unmarried fact                    -> UNMARRIED
missing spouse edge alone                  -> no status conclusion
```

The runtime rejects contradictory status facts and an unmarried fact that conflicts with a spouse edge.

## Lineage and four-generation rule

Exact maternal and paternal items call the frozen CP-001 lineage solver. The group layer reconstructs the shared graph and renders common generation rows; it does not define a second lineage algorithm.

## Remaining discovery work

- wider source saturation for less-common affinal and multi-branch passage structures;
- clue minimisation beyond answer-contribution checks;
- shared-prompt English editorial saturation;
- family-tree explanation rendering and review export;
- source-backed option-style widening;
- formal merge/split audit against frozen CP-001 item authorities;
- inverse-contract audit;
- human review and remediation;
- post-human second source-gap confirmation;
- final freeze and allocation only after all gates close.

## Release boundary

- English review-only: true;
- Question Studio visibility: disabled;
- Question Bank eligibility: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled.
