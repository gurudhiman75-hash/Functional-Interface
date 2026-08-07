# SAP-CP-003 Permanent QL Allocation

## Approval basis

The product owner approved the compact 300-question SAP-CP-003 review candidate on 2026-08-07.

The approved review covered learner-facing questions, four options and correct answers. Explanations were intentionally excluded from the compact review, so this allocation does not claim a completed explanation freeze.

## Permanent range

`SAP-QL-034..SAP-QL-052`

| Permanent QL | Approved family |
|---|---|
| SAP-QL-034 | Terminating-decimal expression |
| SAP-QL-035 | Mixed decimal-and-fraction expression |
| SAP-QL-036 | Decimal product and place value |
| SAP-QL-037 | Decimal division by a power of ten |
| SAP-QL-038 | Decimal division by a compatible factor |
| SAP-QL-039 | Percentage as an exact numeric factor |
| SAP-QL-040 | Scoped percentage-of block |
| SAP-QL-041 | Mixed percentage, fraction and decimal expression |
| SAP-QL-042 | Convert displayed terms to fractions |
| SAP-QL-043 | Convert compatible terms to decimals |
| SAP-QL-044 | Known fraction-decimal equivalence |
| SAP-QL-045 | Recurring decimal inside an exact expression |
| SAP-QL-046 | Complementary percentage expression |
| SAP-QL-047 | Successive percentage factors |
| SAP-QL-048 | Missing decimal operand |
| SAP-QL-049 | Missing percentage literal |
| SAP-QL-050 | Compare fraction, decimal and percentage results |
| SAP-QL-051 | Select correct decimal placement |
| SAP-QL-052 | Identify first incorrect conversion step |

## Identity policy

- one permanent QL is allocated to each of the 19 approved executable families;
- the executable prototype remains the ancestry authority for its QL;
- the discovery layer remains historically unchanged with `permanentQlId: null`;
- the permanent runtime wraps the approved candidate with its allocated identity;
- the next available chapter identity becomes `SAP-QL-053`.

## Editorial status

```text
questions and answers: approved
permanent identities: allocated
explanation freeze: pending
localisation: pending
Question Studio activation: disabled
Question Bank writes: disabled
test eligibility: disabled
public publication: disabled
```

## Required proof

The allocation authority must validate:

- 19 contiguous, collision-free permanent IDs;
- exact one-to-one prototype-to-QL mapping;
- 1,900 deterministic packages across 100 seeds per family;
- canonical answer and option binding retained from the approved runtime;
- chapter registry continuity from `SAP-QL-001` through `SAP-QL-052`;
- inactive lifecycle for every package and registry entry;
- discovery evidence remaining ID-free.

This allocation does not activate or publish SAP-CP-003.
