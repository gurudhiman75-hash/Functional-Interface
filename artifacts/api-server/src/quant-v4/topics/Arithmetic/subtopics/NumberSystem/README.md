# ExamTree Quant V4 — Number System

## Current authority

The Number System chapter is fully designed at architecture and checkpoint-ownership level. `NUM-CP-003` and `NUM-CP-004` now have inactive permanent English allocations.

```text
Student-facing chapter: Number System
Runtime packages:       NUM-001, NUM-002
Checkpoint range:       NUM-CP-001..NUM-CP-014
Completed checkpoints:  NUM-CP-003, NUM-CP-004
Permanent QLs:          NUM-QL-001..NUM-QL-045
Next QL identity:       NUM-QL-046
Remaining CP counts:    open until their executable discovery closes
Question Studio:        disabled for Number System
Public delivery:        disabled
```

## Read in this order

1. [`NUMBER-SYSTEM-CP004-COMPLETION-AMENDMENT.md`](./NUMBER-SYSTEM-CP004-COMPLETION-AMENDMENT.md) — current allocation truth after CP-004 completion.
2. [`NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY.md`](./NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY.md) — chapter architecture and final ownership design.
3. [`NUM-001/NUM-CP-004/NUM-CP-004-COMPLETION-AND-ENGLISH-FREEZE-RECORD.md`](./NUM-001/NUM-CP-004/NUM-CP-004-COMPLETION-AND-ENGLISH-FREEZE-RECORD.md) — CP-004 permanent range and proof contract.
4. [`NUM-001-COMPLETE-CHECKPOINT-DESIGN.md`](./NUM-001-COMPLETE-CHECKPOINT-DESIGN.md) — detailed CP-001 through CP-006 design.
5. [`NUM-002-COMPLETE-CHECKPOINT-DESIGN.md`](./NUM-002-COMPLETE-CHECKPOINT-DESIGN.md) — detailed CP-007 through CP-014 design.
6. [`NUMBER-SYSTEM-CROSS-CP-OWNERSHIP-AND-DEPENDENCY-MATRIX.md`](./NUMBER-SYSTEM-CROSS-CP-OWNERSHIP-AND-DEPENDENCY-MATRIX.md) — collision rules and dependencies.
7. [`NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md`](./NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md) — non-quota discovery and allocation process.
8. [`NUMBER-SYSTEM-SOURCE-AND-OWNERSHIP-AUDIT.md`](./NUMBER-SYSTEM-SOURCE-AND-OWNERSHIP-AUDIT.md) — source and legacy evidence.

## Machine authority

```text
design/number-system-design-registry.ts
design/number-system-design-registry.test.ts
design/number-system-current-allocation-registry.ts
design/number-system-current-allocation-registry.test.ts
```

The architecture registry defines all fourteen checkpoint contracts. The current-allocation registry is the authoritative overlay for completed checkpoint ranges and the next chapter identity.

It proves:

- all fourteen CP identities remain unique and dependency-safe;
- `NUM-CP-003` owns `NUM-QL-001..NUM-QL-017`;
- `NUM-CP-004` owns `NUM-QL-018..NUM-QL-045`;
- permanent chapter identities are continuous through `NUM-QL-045`;
- the next identity is `NUM-QL-046`;
- all completed allocations are inactive and unexposed.

## Next implementation checkpoint

```text
NUM-CP-005 — Divisors and Divisor Functions
```

Its count remains open until executable discovery and gap audits close.
