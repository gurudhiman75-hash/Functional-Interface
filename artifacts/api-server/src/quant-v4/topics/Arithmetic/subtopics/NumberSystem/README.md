# ExamTree Quant V4 — Number System

## Current authority

Number System is fully implemented at permanent-allocation level across all fourteen checkpoints.

```text
Student-facing chapter: Number System
Runtime packages:       NUM-001, NUM-002
Checkpoint range:       NUM-CP-001..NUM-CP-014
Completed checkpoints:  NUM-CP-001..NUM-CP-014
Permanent QLs:          NUM-QL-001..NUM-QL-253
Next QL identity:       NUM-QL-254
Question Studio:        CP008..CP014 shared NUM-002 review surface; earlier CPs keep checkpoint-specific release state
Question Bank:          locked unless separately authorized
Scored tests/mocks:     locked unless separately authorized
Public delivery:        locked
```

The current chapter truth is governed by
[`NUMBER-SYSTEM-FINAL-IMPLEMENTATION-AUTHORITY.md`](./NUMBER-SYSTEM-FINAL-IMPLEMENTATION-AUTHORITY.md)
and
[`design/number-system-final-allocation-authority.ts`](./design/number-system-final-allocation-authority.ts).

Historical design/completion records remain evidence of how each checkpoint reached freeze, but their older “next QL”, “open discovery”, or partial-completion status lines are not current chapter status.

## Final permanent ledger

| Checkpoint | Package | Permanent range | QLs |
|---|---|---|---:|
| NUM-CP-003 | NUM-001 | NUM-QL-001..017 | 17 |
| NUM-CP-004 | NUM-001 | NUM-QL-018..045 | 28 |
| NUM-CP-005 | NUM-001 | NUM-QL-046..069 | 24 |
| NUM-CP-006 | NUM-001 | NUM-QL-070..097 | 28 |
| NUM-CP-007 | NUM-002 | NUM-QL-098..123 | 26 |
| NUM-CP-001 | NUM-001 | NUM-QL-124..144 | 21 |
| NUM-CP-002 | NUM-001 | NUM-QL-145..165 | 21 |
| NUM-CP-008 | NUM-002 | NUM-QL-166..184 | 19 |
| NUM-CP-009 | NUM-002 | NUM-QL-185..196 | 12 |
| NUM-CP-010 | NUM-002 | NUM-QL-197..212 | 16 |
| NUM-CP-011 | NUM-002 | NUM-QL-213..225 | 13 |
| NUM-CP-012 | NUM-002 | NUM-QL-226..236 | 11 |
| NUM-CP-013 | NUM-002 | NUM-QL-237..247 | 11 |
| NUM-CP-014 | NUM-002 | NUM-QL-248..253 | 6 |

Total permanent authorities: **253**. The allocation is contiguous with no duplicate or skipped identities.

## Read in this order

1. [`NUMBER-SYSTEM-FINAL-IMPLEMENTATION-AUTHORITY.md`](./NUMBER-SYSTEM-FINAL-IMPLEMENTATION-AUTHORITY.md) — current final chapter ledger and lifecycle boundary.
2. [`design/number-system-final-allocation-authority.ts`](./design/number-system-final-allocation-authority.ts) — executable final allocation authority.
3. [`design/number-system-current-allocation-registry.ts`](./design/number-system-current-allocation-registry.ts) — backward-compatible live allocation overlay.
4. [`NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY.md`](./NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY.md) — mathematical checkpoint ownership design.
5. [`NUM-001-COMPLETE-CHECKPOINT-DESIGN.md`](./NUM-001-COMPLETE-CHECKPOINT-DESIGN.md) — detailed CP001..006 design.
6. [`NUM-002-COMPLETE-CHECKPOINT-DESIGN.md`](./NUM-002-COMPLETE-CHECKPOINT-DESIGN.md) — detailed CP007..014 design.
7. [`NUMBER-SYSTEM-CROSS-CP-OWNERSHIP-AND-DEPENDENCY-MATRIX.md`](./NUMBER-SYSTEM-CROSS-CP-OWNERSHIP-AND-DEPENDENCY-MATRIX.md) — collision rules and dependencies.

## Audit state

The chapter-wide systematic audit covers all **14 checkpoints / 253 permanent QLs**. CP-specific remediation gates now distinguish genuine breadth defects from legitimate finite conceptual/classification answer spaces.

The final CP014 surface additionally enforces:
- HARD-only synthesis difficulty;
- multi-engine component evidence;
- ablation evidence;
- `FULL_DERIVATION_AND_EXAM_SHORTCUT_V1` explanation structure;
- closed downstream publication gates.

## Lifecycle boundary

Permanent allocation does not itself authorize product delivery.

Unless a later checkpoint-specific release authority explicitly opens a gate:
- `active = false`;
- Question Bank writes remain disabled;
- scored-test and mock-test eligibility remain disabled;
- public and automatic student publication remain disabled.

Question Studio visibility is governed separately by checkpoint-specific integration/release records.

## Next identity

`NUM-QL-254` is unallocated. It may be consumed only by an explicit post-design authority amendment. There is no designed `NUM-CP-015`.
