# COD-001 / COD-CP-006 Runtime-Proof Implementation

Status: `RUNTIME_PROOF`  
Publicly publishable: `false`

## Scope

- QL range: `COD-QL-137` through `COD-QL-168`
- QL count: 32
- Canonical composite families: 6
- Locale: English (`en-IN`)
- Question Studio/public discovery: intentionally disabled

## Implemented families

1. `REVERSE_THEN_INDEXED_SHIFT`
2. `PAIR_SWAP_THEN_ALTERNATING_SHIFT`
3. `HALF_SWAP_THEN_ODD_EVEN_SHIFT`
4. `ROTATE_THEN_CLASS_SHIFT`
5. `OPPOSITE_MAP_WITH_POSITION_PERMUTATION`
6. `TRANSFORM_THEN_RANK_SEQUENCE`

Equivalent commuting stage orders are normalized to one canonical pipeline. The runtime does not register duplicate swapped-order rules.

## Student-facing task coverage

- encode a target word or rank sequence;
- decode a uniquely invertible composite code;
- infer and apply a two-stage pipeline;
- choose the matching code;
- recover one visibly masked letter or numeric rank.

`ROTATE_THEN_CLASS_SHIFT` deliberately excludes decode tasks because vowel/consonant class shifts are not globally one-to-one. This is an audited mathematical boundary, not an implementation omission.

## Runtime contracts

- deterministic QL/seed output;
- exactly four unique options and one correct answer;
- both stages must be active in every displayed example and target;
- independent pipeline inference and reverse-stage decoding;
- rejection of simpler CP-003, CP-004 and CP-005 explanations;
- rejection of equal-priority competing CP-006 contexts;
- canonical normalization of commuting stage orders;
- exact `source → intermediate → final` explanation traces;
- missing-token explanations identify the precise code position and supplying letter/rank;
- option-specific misconception feedback;
- no production exposure before checkpoint freeze.

## Validation target

- checkpoint runtime audit: 32 QLs × 100 seeds = 3,200 questions;
- editorial audit: 32 QLs × 20 seeds = 640 questions;
- editorial review corpus: 32 QLs × 5 seeds = 160 questions.

The 100-seed difficulty distribution is calibrated to the frozen CP-006 target without fixing difficulty per QL: 404 easy, 1,576 medium and 1,220 hard instances.
