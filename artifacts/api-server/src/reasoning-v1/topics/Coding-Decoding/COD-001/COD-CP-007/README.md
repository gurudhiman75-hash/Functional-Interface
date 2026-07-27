# COD-CP-007 — Digit, Symbol and Alphanumeric Coding

Status: **open English discovery; one source-backed family saturated; five prototype tasks resolve to three provisional solve contracts; no permanent QLs**.

## Read in this order

1. `../cod-001-open-ql-discovery-amendment.md`
2. `COD-CP-007-SOURCE-AND-BOUNDARY-AUDIT.md`
3. `COD-CP-007-END-TO-END-DESIGN.md`
4. `COD-CP-007-QL-DISCOVERY-AUDIT.md`
5. `COD-CP-007-IMPLEMENTATION-PLAN.md`
6. `COD-CP-007-UNIFORM-DIGIT-PROTOTYPE-STATUS.md`
7. `COD-CP-007-TARGETED-SOURCE-EXPANSION.md`
8. `COD-CP-007-UNIFORM-DIGIT-MERGE-SPLIT.md`

## Current admitted family

```text
UNIFORM_MODULAR_DIGIT_TRANSLATION
```

Example form:

```text
35674 → 57896
4213  → ?
```

Each digit is transformed independently by the same decimal shift. Code strings preserve leading zeroes and are never coerced into whole numbers.

The old manifest's exact 24-QL reservation remains revoked. CP-007 will discover its final inventory exhaustively.

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

## Provisional task merge/split

The five prototype tasks currently resolve to three provisional solve contracts:

```text
FORWARD_UNIFORM_DIGIT_TRANSLATION
INVERSE_UNIFORM_DIGIT_TRANSLATION
MISSING_MEMBER_UNIFORM_DIGIT_TRANSLATION
```

Current decisions:

- explicit-rule encode merges into the forward contract as a difficulty/presentation variant;
- infer-and-encode is the source-backed forward authority;
- choose-matching merges into the forward contract because the answer predicate is unchanged;
- inverse decode remains separate;
- missing-token completion remains separate because the answer type and proof obligation differ.

These are provisional design fingerprints, not permanent QLs.

## Targeted source-expansion result

No additional family is admitted in the current cycle.

- arbitrary digit substitution remains source-pending and collides with CP-001 direct mapping;
- digit-to-symbol coding remains source-pending unless the digit domain creates material semantics;
- position-dependent digit transforms remain source/collision-pending against CP-004;
- pure digit permutation is excluded as a separate CP-007 family and remains owned by CP-005;
- alphanumeric dual-channel transformation remains source-pending and may collide with CP-003/004/006;
- mixed-token direct substitution presumptively merges with CP-001.

The File Library retrieval path was unavailable during this targeted pass. That failure is not treated as negative source evidence; pending candidates may be reopened with an approved concrete exam-source pack.

## Safety boundary

- permanent QLs: `0`;
- next available chapter ID: `COD-QL-169`, not reserved;
- Question Studio: disabled;
- localisation: not started;
- public publication: false.

## Next action

Run the exact-head merge/split workflow. CP-007 remains open until the uploaded-source retrieval path is restored or a replacement source pack closes the pending family questions. Do not allocate permanent IDs yet.
