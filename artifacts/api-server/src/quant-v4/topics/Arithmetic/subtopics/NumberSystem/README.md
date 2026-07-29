# ExamTree Quant V4 — Number System

## Current authority

The Number System chapter is fully designed at architecture and checkpoint-ownership level.

```text
Student-facing chapter: Number System
Runtime packages:       NUM-001, NUM-002
Checkpoint range:       NUM-CP-001..NUM-CP-014
Approved checkpoint:    NUM-CP-003
Permanent QLs:          NUM-QL-001..NUM-QL-017
Next QL identity:       NUM-QL-018
Remaining CP counts:    open until executable discovery closes
Question Studio:        disabled
Public delivery:        disabled
```

## Read in this order

1. [`NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY.md`](./NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY.md) — current chapter truth and final architecture.
2. [`NUM-001-COMPLETE-CHECKPOINT-DESIGN.md`](./NUM-001-COMPLETE-CHECKPOINT-DESIGN.md) — detailed CP-001 through CP-006 design.
3. [`NUM-002-COMPLETE-CHECKPOINT-DESIGN.md`](./NUM-002-COMPLETE-CHECKPOINT-DESIGN.md) — detailed CP-007 through CP-014 design.
4. [`NUMBER-SYSTEM-CROSS-CP-OWNERSHIP-AND-DEPENDENCY-MATRIX.md`](./NUMBER-SYSTEM-CROSS-CP-OWNERSHIP-AND-DEPENDENCY-MATRIX.md) — collision rules, cross-chapter boundaries and implementation lanes.
5. [`NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md`](./NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md) — non-quota discovery and permanent-allocation process.
6. [`NUMBER-SYSTEM-SOURCE-AND-OWNERSHIP-AUDIT.md`](./NUMBER-SYSTEM-SOURCE-AND-OWNERSHIP-AUDIT.md) — source, legacy and ownership evidence.
7. [`NUM-001-NUM-002-END-TO-END-DESIGN.md`](./NUM-001-NUM-002-END-TO-END-DESIGN.md) — original broad design hypothesis retained as discovery evidence.

## Machine authority

```text
design/number-system-design-registry.ts
design/number-system-design-registry.test.ts
```

The design audit proves:

- all fourteen CP identities are present and unique;
- the package split is `6 + 8`;
- every CP declares tasks, inverses, semantics, edges, representations, misconceptions, dependencies and competing owners;
- the dependency graph is acyclic;
- only CP-003 has permanent identities and a frozen solve-mode count;
- all remaining counts remain null/open;
- the next chapter identity is `NUM-QL-018`;
- no design row is active or exposed.

## Next implementation checkpoint

```text
NUM-CP-004 — Prime Structure and Factorisation
```

It begins open executable discovery with no predetermined QL or solve-mode count.
