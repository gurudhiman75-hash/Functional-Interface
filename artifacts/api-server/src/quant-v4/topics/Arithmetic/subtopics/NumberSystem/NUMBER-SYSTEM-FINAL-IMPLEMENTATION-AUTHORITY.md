# ExamTree Number System — Final Implementation Authority

**Status:** `FINAL_IMPLEMENTATION_RECONCILIATION_CANDIDATE`  
**Canonical checkpoint range:** `NUM-CP-001..NUM-CP-014`  
**Permanent chapter range:** `NUM-QL-001..NUM-QL-253`  
**Next free Number System identity:** `NUM-QL-254`  
**Additional designed checkpoint:** none (`NUM-CP-015` does not exist)

This record supersedes historical status lines in earlier design-completion documents that describe only the implementation state available when those documents were written. The mathematical checkpoint definitions remain valid; current permanent-allocation truth is governed by `design/number-system-final-allocation-authority.ts`.

## Final permanent ledger

| Allocation order | Checkpoint | Package | Permanent range | QLs | Frozen solve modes |
|---:|---|---|---|---:|---:|
| 1 | NUM-CP-003 | NUM-001 | NUM-QL-001..017 | 17 | 7 |
| 2 | NUM-CP-004 | NUM-001 | NUM-QL-018..045 | 28 | 28 |
| 3 | NUM-CP-005 | NUM-001 | NUM-QL-046..069 | 24 | 24 |
| 4 | NUM-CP-006 | NUM-001 | NUM-QL-070..097 | 28 | 28 |
| 5 | NUM-CP-007 | NUM-002 | NUM-QL-098..123 | 26 | 26 |
| 6 | NUM-CP-001 | NUM-001 | NUM-QL-124..144 | 21 | 21 |
| 7 | NUM-CP-002 | NUM-001 | NUM-QL-145..165 | 21 | 21 |
| 8 | NUM-CP-008 | NUM-002 | NUM-QL-166..184 | 19 | 19 |
| 9 | NUM-CP-009 | NUM-002 | NUM-QL-185..196 | 12 | 12 |
| 10 | NUM-CP-010 | NUM-002 | NUM-QL-197..212 | 16 | 16 |
| 11 | NUM-CP-011 | NUM-002 | NUM-QL-213..225 | 13 | 13 |
| 12 | NUM-CP-012 | NUM-002 | NUM-QL-226..236 | 11 | 11 |
| 13 | NUM-CP-013 | NUM-002 | NUM-QL-237..247 | 11 | 11 |
| 14 | NUM-CP-014 | NUM-002 | NUM-QL-248..253 | 6 | 6 |

The allocation is contiguous. There are no duplicated or skipped permanent identities from `NUM-QL-001` through `NUM-QL-253`.

## Final checkpoint boundary

The complete Number System design contains exactly fourteen checkpoints:

- `NUM-CP-001..006` in `NUM-001`;
- `NUM-CP-007..014` in `NUM-002`.

`NUM-CP-014 — Mixed Inverse, Optimisation and Number-Theory Synthesis` is the final designed checkpoint. A future `NUM-QL-254` may be allocated only by an explicit post-design authority amendment; it must not be consumed merely by continuing implementation after CP014.

## Question Studio state

Permanent allocation and Question Studio exposure are separate lifecycle dimensions.

The shared `NUM-002` review surface currently includes the frozen CP008..CP014 sequence `NUM-QL-166..NUM-QL-253`, with package-only fallback preserved. Earlier Number System checkpoints retain their own release histories and must not be inferred to be Studio-visible solely because they own permanent QLs.

CP014 also preserves the later Trigonometry Question Studio aggregate and the specialized route ordering certified during its landing.

## Lifecycle locks

This chapter-level reconciliation does not open downstream delivery gates. Unless a checkpoint-specific later authority explicitly says otherwise:

- permanent identity: frozen;
- Question Bank write authorization: not granted by this record;
- scored-test eligibility: not granted by this record;
- mock-test eligibility: not granted by this record;
- public publication: not granted by this record;
- automatic student publication: not granted by this record.

Data Sufficiency remains owned by `DSF-001`; final Number System reconciliation creates no DS authority.

## Audit contract

Chapter closure must fail if any of the following occurs:

1. any of the fourteen checkpoint identities disappears or a fifteenth appears without an authority amendment;
2. package ownership changes from CP001..006=`NUM-001`, CP007..014=`NUM-002`;
3. a permanent range overlaps another range;
4. any identity in `NUM-QL-001..253` is skipped;
5. `NUM-QL-254` is silently allocated;
6. checkpoint titles/package identities drift between the mathematical design blueprint and the live allocation authority;
7. allocation reconciliation opens Question Bank/test/public gates.

The executable authorities are:

- `design/number-system-final-allocation-authority.ts`
- `design/number-system-current-allocation-registry.ts`
- `design/number-system-current-allocation-registry.test.ts`
- `design/number-system-design-registry.test.ts`

## Historical-document rule

Earlier records remain evidence for how each checkpoint reached freeze. Their old phrases such as “next QL 18”, “next QL 46”, or “discovery open” are historical snapshots, not current chapter truth. When a status conflict exists, this final authority and the executable final-allocation registry take precedence.
