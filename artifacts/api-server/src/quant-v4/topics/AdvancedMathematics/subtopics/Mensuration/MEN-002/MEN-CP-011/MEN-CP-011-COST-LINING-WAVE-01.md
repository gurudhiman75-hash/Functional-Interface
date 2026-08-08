# MEN-CP-011 Cost and Lining — Wave 01

## Authority

```text
MEN-CP011-COST-LINING-WAVE-01-V1
```

## Scope

This wave implements the next two initial discovery candidates:

```text
MEN-CP011-PROT-OPEN-CONTAINER-SHEET-COST
MEN-CP011-PROT-INNER-LINING-COST
```

The wave adds a rate layer to existing exposure reasoning rather than creating a second geometry authority.

## Open-container sheet cost

The physical container is a cylinder open at the top and closed at the bottom.

```text
sheet area = curved wall + one base
           = 2πrh + πr²
           = πr(2h + r)

sheet cost = sheet area × rate per m²
```

The missing lid is absent and contributes zero sheet area.

## Inner-lining cost

The inside of an open cylindrical tank is lined on the inner curved wall and inner bottom.

```text
lining area = inner curved wall + inner bottom
            = 2πrh + πr²

lining cost = lining area × rate per m²
```

The open mouth is not an internal material face and receives no lining.

Although the two families share an area expression, they remain separate temporary prototypes until final compression because their physical ownership, contexts and misconception contracts differ.

## Exact π and currency policy

The wave uses declared numeric π policies only:

```text
PI_22_OVER_7
PI_3_14
```

Declared `3.14` is represented exactly as `157/50`. Every rate is a multiple of ₹350/m² so both policies produce exact rupee answers without floating-point equality or artificial ₹π presentation.

## Runtime and review coverage

```text
Runtime prototypes:                  2
Deterministic packages per family: 128
Total deterministic packages:      256
Balanced review records:            32
Records per family:                 16
Pi policies:                         2
Records per family/pi cell:          8
Correct positions:                A8 B8 C8 D8
Distinct review physical states:    32
```

Eight radius-height-rate fixtures are exercised under both declared π policies.

## Option authority

### Open sheet

```text
STOPPED_AT_SHEET_AREA_WITHOUT_RATE
ADDED_MISSING_LID_TO_SHEET_COST
OMITTED_EXISTING_BASE_FROM_SHEET_COST
```

### Inner lining

```text
OMITTED_INNER_BASE_FROM_LINING
ADDED_OPEN_MOUTH_TO_LINING
OMITTED_FACTOR_TWO_IN_INNER_CURVED_AREA
```

All options are exact currency values, structurally unique, dimensionally valid and linked to their actual calculations.

## Explanation contract

Every learner solution includes:

1. a physical surface ledger before the formula;
2. explicit identification of the absent open face;
3. calculation of the included square-metre area;
4. multiplication by the ₹/m² rate with unit cancellation;
5. the factored shortcut `πr(2h+r)`;
6. natural analysis of all three displayed wrong options.

## Diagram contract

The responsive open-cylinder diagram shows:

- dashed open mouth marked as an absent face;
- curved wall;
- one existing bottom;
- centre-connected radius and external height;
- rate in ₹/m²;
- context-specific outer-sheet or inner-lining surface location;
- separate prompt and solution roles;
- no fixed SVG width and `min-width: 0`;
- text-complete attempt mode without a diagram.

## Validation

The runtime rejects:

- non-positive dimensions or rate;
- a surface ledger other than curved wall plus one base;
- duplicate exact options or multiple correct answers;
- diagram/context mismatch;
- unbalanced learner MathJax;
- learner-visible internal codes;
- lifecycle or publication leakage.

## Lifecycle

```text
Permanent QLs:                0
Question Studio:              disabled
Question Bank:                NOT_STORED
Test eligibility:             INELIGIBLE
Public publication:           false
Direct source normalisation:  pending
Manual English review:        pending
```

This wave resolves two additional initial candidates but does not freeze chapter coverage, English or permanent QLs.
