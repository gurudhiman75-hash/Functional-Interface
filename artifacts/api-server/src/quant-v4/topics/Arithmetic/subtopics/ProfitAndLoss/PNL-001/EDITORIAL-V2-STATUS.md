# PNL-001 Editorial V2 Status

Status: ENGLISH REVIEW CANDIDATE

Branch: `feat/pnl-001-editorial-structured-review`

Draft pull request: #173

## Scope

The editorial layer for `PNL-QL-095` through `PNL-QL-186` has been reopened and re-authored. The validated mathematical solvers, answer semantics, independent verifiers and CP runtime proofs remain unchanged.

Packages covered:

- CP-004: 26 English editorial entries
- CP-005: 29 English editorial entries
- CP-006: 37 English editorial entries
- Total: 92 English editorial entries

## Editorial V2 model

The new content model supports:

- paragraph blocks;
- real tables with runtime row binding;
- multi-paragraph caselets with runtime paragraph binding;
- statement sets;
- two-statement data sufficiency;
- display and inline LaTeX equations;
- friendly structured explanations;
- explicit difficulty rationale.

Each friendly explanation contains:

1. a natural opening;
2. a short key idea;
3. ordered reasoning steps;
4. a clear conclusion;
5. a learner-facing common mistake;
6. an optional quick check where useful.

## Audit result

The focused `Validate PNL Editorial V2` workflow passes on the branch.

Validated results:

- QL count: 92
- distinct context families: 92
- generic article/dealer/trader openings: 10
- Hard questions before migration: 59
- Hard questions after migration: 45
- difficulty recalibrations: 15
- old average explanation length in the rendered review set: 20.4 words
- new average explanation length: 102.7 words
- real table renderer proof: passed
- real caselet renderer proof: passed
- friendly explanation renderer proof: passed
- difficulty-calibration proof: passed

The original CP-006 runtime proof and structural audit also pass unchanged.

## Difficulty corrections

The migration corrects inflated difficulty where the mathematical path is visible and direct. Examples include:

- three visible forward transaction stages: Hard to Medium;
- two-stage reverse multiplier recovery: Hard to Medium;
- single commission reversal: Hard to Medium;
- direct target-profit quantity: Hard to Medium;
- break-even revenue/ratio direct inverses: Hard to Medium;
- margin-of-safety amount: Medium to Easy.

Hard remains reserved for coupled inverses, changing hidden bases, multi-ledger comparisons, weighted product mixes, algebraic reconstruction, caselet dependency and data sufficiency.

## Rendering policy

- Ordinary prose retains readable forms such as `₹10,000`, `20%` and `500 units`.
- Equations and final mathematical results use LaTeX blocks.
- Legacy raw glyphs such as multiplication and division signs are normalized before student display.
- TABLE, CASELET, STATEMENT, ALGEBRAIC and DATA_SUFFICIENCY labels must correspond to real structured blocks.

## Language status

English is ready for human review.

Hindi and Punjabi editorial-v2 authoring remains intentionally blocked until the English review is approved. Existing Hindi and Punjabi libraries remain structurally available but are not considered editorially frozen against the new English layer.

## Merge rule

PR #173 must remain draft until:

1. the English comparison workbook is reviewed;
2. requested corrections are applied;
3. the English editorial layer is approved;
4. the subsequent Hindi and Punjabi migration plan is accepted.

The PR must not be merged merely because automated checks pass.
