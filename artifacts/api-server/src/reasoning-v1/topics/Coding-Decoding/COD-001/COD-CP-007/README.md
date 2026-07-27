# COD-CP-007 — Digit, Symbol and Alphanumeric Coding

Status: **open English discovery; uniform modular digit translation prototype mathematically and editorially saturated; no permanent QLs**.

## Read in this order

1. `../cod-001-open-ql-discovery-amendment.md`
2. `COD-CP-007-SOURCE-AND-BOUNDARY-AUDIT.md`
3. `COD-CP-007-END-TO-END-DESIGN.md`
4. `COD-CP-007-QL-DISCOVERY-AUDIT.md`
5. `COD-CP-007-IMPLEMENTATION-PLAN.md`
6. `COD-CP-007-UNIFORM-DIGIT-PROTOTYPE-STATUS.md`

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

## Executable prototype inventory

Five non-permanent task contracts are implemented:

1. encode a target with an explicit digit-wise rule;
2. infer and decode a coded digit string;
3. recover one missing code digit;
4. infer the shift and encode a target;
5. choose the only matching complete code.

The prototype provides:

- token-string parsing and serialization;
- forward and inverse decimal translation;
- leading-zero preservation;
- decimal-wrap and repeated-digit scenarios;
- eligible-rule rejection for whole-number arithmetic and reversal competitors;
- explicit acknowledgement that arbitrary substitution is a more complex compatible explanation, not the canonical winner;
- independent arithmetic verification;
- four misconception-labelled options with one correct answer;
- task-specific, evidence-based English explanations;
- mathematical and editorial audits over 500 questions each;
- a polished 25-question English review export;
- a checkpoint-local GitHub Actions workflow.

Exact proof metrics:

```text
Generated mathematical questions:           500
Distinct questions/stems:                500/500
Leading-zero source/code cases:          140/132
Wrapped targets:                              370
Missing first/middle/final:              22/55/23
Normalised explanation skeletons: 45/45/59/41/45
Cross-contract explanation collisions:          0
Permanent QLs:                                  0
```

These remain prototype contracts. They are not permanent QLs and are not discoverable in Question Studio.

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

Run targeted source expansion for the remaining candidate families, then perform a checkpoint-wide task and solve-mode merge/split audit. Do not allocate permanent IDs yet.
