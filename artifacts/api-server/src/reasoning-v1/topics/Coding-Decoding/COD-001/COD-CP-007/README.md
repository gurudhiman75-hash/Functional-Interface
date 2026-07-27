# COD-CP-007 — Digit, Symbol and Alphanumeric Coding

Status: **open English discovery; first source-proven prototype selected; no permanent QLs**.

## Read in this order

1. `../cod-001-open-ql-discovery-amendment.md`
2. `COD-CP-007-SOURCE-AND-BOUNDARY-AUDIT.md`
3. `COD-CP-007-END-TO-END-DESIGN.md`
4. `COD-CP-007-QL-DISCOVERY-AUDIT.md`
5. `COD-CP-007-IMPLEMENTATION-PLAN.md`

## Current decision

The old manifest's exact 24-QL reservation is revoked. CP-007 will discover its contracts exhaustively.

The first directly source-supported family is:

```text
UNIFORM_MODULAR_DIGIT_TRANSLATION
```

Example form:

```text
35674 → 57896
4213  → ?
```

Each digit is transformed independently by the same decimal shift. Code strings preserve leading zeroes and are never coerced into whole numbers.

## Open candidates

The following remain source- or collision-pending:

- arbitrary digit substitution;
- digit-to-symbol bijection;
- position-dependent digit transformation;
- pure digit permutation;
- alphanumeric dual-channel transformation;
- mixed-token substitution.

Formal symmetry does not create a QL. Each candidate must have recurring exam evidence and survive collision testing against CP-001 through CP-006 and CP-010.

## Safety boundary

- permanent QLs: `0`;
- next available chapter ID: `COD-QL-169`, not reserved;
- Question Studio: disabled;
- localisation: not started;
- public publication: false.

## Next action

Implement the token-string foundation and the non-permanent English prototype for uniform modular digit translation.
