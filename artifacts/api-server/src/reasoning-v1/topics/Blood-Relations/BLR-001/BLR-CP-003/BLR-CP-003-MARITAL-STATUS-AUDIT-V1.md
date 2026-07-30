# BLR-CP-003 — Explicit Marital-Status Audit V1

Status: **open English discovery; non-permanent prototype proof**.

## Source finding

Shared blood-relation passages commonly provide marital status as an explicit fact, for example an explicitly unmarried son or an unmarried male member. These examples support a status fact in the passage; they do not support treating every member without a displayed spouse as unmarried.

Representative public source families reviewed:

- PracticeMock blood-relation practice PDF: explicit unmarried-son wording inside a multi-question family set;
- Oliveboard SBI Clerk blood-relation set: explicit unmarried-male wording;
- BankersAdda SBI Clerk blood-relation set: explicit unmarried-male wording.

## Formal decision

`MARRIED` may be entailed by either:

1. a displayed spouse edge; or
2. an explicit married-status fact.

`UNMARRIED` is entailed only by an explicit unmarried-status fact.

```text
no spouse edge shown
  != unmarried
```

A status fact is rejected when it references an unknown member, duplicates another fact for the same member, conflicts with another status fact, or marks a member unmarried while a spouse edge is present.

## Executable slice

```text
scenario: BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH
new temporary prototypes:
  BLR-CP003-PROT-SHARED-MARITAL-STATUS
  BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS
```

The shared passage also reuses relation, sibling-pair and parent-child-pair item handles so every displayed kinship clue contributes to at least one retained item.

The deterministic gate proves:

- explicit unmarried status;
- married status derived from a spouse edge;
- identify the unique unmarried member;
- rejection of unsupported status inference;
- rejection of contradictory spouse/status evidence;
- hidden-graph and clue-only answer agreement;
- contribution of every displayed relation clue and status fact;
- deterministic four-option construction and balanced answer positions;
- complete release locks.

## Merge/split state

No permanent identity is allocated.

The current evidence leaves open whether marital status becomes:

- a new permanent item authority;
- an instance property of a broader shared-family fact-selection authority; or
- a renderer-level adaptation of an existing identity contract.

That decision must wait for source saturation, inverse auditing, editorial review and the final merge/split pass. `BLR-QL-009` remains unclaimed.
