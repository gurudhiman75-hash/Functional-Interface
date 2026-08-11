# MAL-CP-005 Wave 04 — Permanent QL Allocation

## Allocation decision

The 13 product-approved English task contracts are assigned permanent learner identities while remaining inactive for delivery.

```text
allocation ID:               MAL-CP005-EN-PERMANENT-ALLOCATION-V1
permanent QL range:          MAL-QL-048..MAL-QL-060
permanent QLs:               13
permanent task solve modes:  13
shared mathematical cores:   3
language:                    English only
permanent identity:          frozen
Question Studio permanent:   disabled
Question Bank:               disabled
test/mock delivery:          disabled
public publication:          disabled
Hindi/Punjabi:               not authorized
```

`MAL-QL-048` begins immediately after the released CP-004 range ending at `MAL-QL-047`.

## Permanent allocation

| QL | Solve mode | Shared mathematical core | Permanent learner contract |
|---|---|---|---|
| `MAL-QL-048` | `MAL-CP005-SM-001` | `FREE_ADULTERANT_AT_PURE_COST` | Profit percentage from paid pure quantity and free-adulterant quantity |
| `MAL-QL-049` | `MAL-CP005-SM-002` | `FREE_ADULTERANT_AT_PURE_COST` | Pure-product : free-adulterant ratio from target profit at cost price |
| `MAL-QL-050` | `MAL-CP005-SM-003` | `FREE_ADULTERANT_AT_PURE_COST` | Free-adulterant quantity from pure quantity and target profit |
| `MAL-QL-051` | `MAL-CP005-SM-004` | `FREE_ADULTERANT_AT_PURE_COST` | Original pure quantity from free-adulterant quantity and target profit |
| `MAL-QL-052` | `MAL-CP005-SM-005` | `FREE_ADULTERANT_AT_PURE_COST` | Free-adulterant percentage of final mixture from target profit |
| `MAL-QL-053` | `MAL-CP005-SM-006` | `FREE_ADULTERANT_AT_PURE_COST` | Profit percentage from free-adulterant percentage of final mixture |
| `MAL-QL-054` | `MAL-CP005-SM-007` | `FREE_ADULTERANT_COMMERCIAL_RATE` | Profit percentage from a free-adulterant blend and independent selling price |
| `MAL-QL-055` | `MAL-CP005-SM-008` | `FREE_ADULTERANT_COMMERCIAL_RATE` | Pure-product : free-adulterant ratio from cost price, selling price and target profit |
| `MAL-QL-056` | `MAL-CP005-SM-009` | `FREE_ADULTERANT_COMMERCIAL_RATE` | Selling price from free-adulterant ratio and target profit |
| `MAL-QL-057` | `MAL-CP005-SM-010` | `PAID_CHEAPER_INGREDIENT_COMMERCIAL` | Profit percentage from a cheaper-ingredient blend and selling price |
| `MAL-QL-058` | `MAL-CP005-SM-011` | `PAID_CHEAPER_INGREDIENT_COMMERCIAL` | High-cost : cheaper-ingredient ratio for a target profit |
| `MAL-QL-059` | `MAL-CP005-SM-012` | `PAID_CHEAPER_INGREDIENT_COMMERCIAL` | Selling price from cheaper-ingredient ratio and target profit |
| `MAL-QL-060` | `MAL-CP005-SM-013` | `FREE_ADULTERANT_COMMERCIAL_RATE` | Total monetary profit after free adulteration and a selling-price increase above cost price |

## Why 13 QLs but only 3 mathematical cores

A permanent QL represents the learner-facing given/unknown contract, not a separate mathematical engine. Forward, inverse and reconstruction directions can share a core while still requiring distinct learner reasoning and answer semantics.

The core split is therefore:

- `FREE_ADULTERANT_AT_PURE_COST`: 6 QLs;
- `FREE_ADULTERANT_COMMERCIAL_RATE`: 4 QLs;
- `PAID_CHEAPER_INGREDIENT_COMMERCIAL`: 3 QLs.

`MAL-QL-060` is retained separately from `MAL-QL-054`. Both use the free-commercial core, but `MAL-QL-054` asks for profit percentage while `MAL-QL-060` asks for total monetary profit. Scaling the paid quantity changes the monetary answer without changing the percentage answer.

## Terminology policy

Learner-facing text must use **cost price** when referring to the original per-unit CP. `Buying rate` and `purchase rate` are not accepted substitutes for that meaning.

Normal transaction wording such as `buys 20 litres at ₹15 per litre` remains valid; the percentage relationship must be expressed as, for example, `10% above the cost price per unit`.

## Ownership boundaries

Permanent allocation does not absorb neighboring families:

- neutral paid-blend quantity or missing-cost reconstruction remains `MAL-CP-001`;
- repeated replacement mechanics remain `MAL-CP-003`;
- false measure, false weight and short delivery remain `PNL-CP-005`;
- target-loss and broad markup/discount symmetry remain unallocated without direct source authority.

## Lifecycle boundary

This is an **identity allocation**, not a delivery activation.

All 13 permanent allocation entries are frozen with:

```text
active:                     false
publiclyPublishable:        false
questionStudioDiscoverable: false
questionBankWritable:       false
testEligible:               false
```

The already-approved review runtimes remain available only under their existing review semantics. Activating the permanent identities requires a later explicit release gate.
