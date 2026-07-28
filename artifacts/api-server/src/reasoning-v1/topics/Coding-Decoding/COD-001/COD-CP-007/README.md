# COD-CP-007 — Digit, Symbol and Alphanumeric Coding

Status: **English discovery frozen; `COD-QL-169..172` implemented at runtime-proof maturity; review-only**.

## Read in this order

1. `../cod-001-open-ql-discovery-amendment.md`
2. `COD-CP-007-SOURCE-AND-BOUNDARY-AUDIT.md`
3. `COD-CP-007-END-TO-END-DESIGN.md`
4. `COD-CP-007-QL-DISCOVERY-AUDIT.md`
5. `COD-CP-007-UNIFORM-DIGIT-PROTOTYPE-STATUS.md`
6. `COD-CP-007-FINAL-DISCOVERY-FREEZE.md`
7. `../COD-001-MANIFEST-AMENDMENT-CP007.md`
8. `COD-CP-007-IMPLEMENTATION-REPORT.md`

## Frozen family

```text
UNIFORM_MODULAR_DIGIT_TRANSLATION
```

Each digit is transformed independently by one non-zero decimal shift. Ordered digit strings preserve leading zeroes and never become whole-number arithmetic values.

## Permanent solve contracts

| QL | Authority |
|---|---|
| `COD-QL-169` | apply a stated forward digit shift |
| `COD-QL-170` | infer and apply the inverse shift |
| `COD-QL-171` | recover one missing coded digit |
| `COD-QL-172` | infer the shift and code the target |

Choose-matching-code is a presentation variant of `COD-QL-172`, not a separate QL.

## Ownership closure

- conditional number/symbol tables → COD-CP-010;
- arbitrary token substitution → COD-CP-001;
- pure permutation → COD-CP-005;
- two-symbol positional numerals → Number System;
- position-dependent digit and mixed alphanumeric candidates → excluded for recurring standalone source gap.

## Runtime proof

The permanent English audit covers 100 seeds per QL and checks deterministic generation, independent ambiguity proof, option uniqueness, answer positions, all renderers, Easy/Medium/Hard reach, decimal wrap, leading zeroes and all missing-token positions.

## Safety boundary

- permanent QLs: `COD-QL-169..172`;
- next available chapter ID: `COD-QL-173`;
- Question Studio: disabled;
- localisation: not started;
- public publication: false.

## Next action

Begin exhaustive discovery for COD-CP-008 before allocating any later checkpoint IDs.
