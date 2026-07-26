# PNL-001 Editorial V2 Status

Status: ENGLISH REVIEW CANDIDATE

Branch: `feat/pnl-001-editorial-structured-review`

Draft pull request: #173

## Scope

Editorial V2 now covers all 186 English QLs in PNL-001 while preserving the validated mathematical solvers, answer semantics, independent verifiers and runtime proofs.

Packages covered:

- CP-001: 36 entries, `PNL-QL-001` through `PNL-QL-036`
- CP-002: 34 entries, `PNL-QL-037` through `PNL-QL-070`
- CP-003: 24 entries, `PNL-QL-071` through `PNL-QL-094`
- CP-004: 26 entries, `PNL-QL-095` through `PNL-QL-120`
- CP-005: 29 entries, `PNL-QL-121` through `PNL-QL-149`
- CP-006: 37 entries, `PNL-QL-150` through `PNL-QL-186`

## Editorial V2 model

The content model supports:

- contextual paragraph blocks;
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

The focused `Validate PNL Editorial V2` workflow validates all six CPs.

CP-001 through CP-003 results:

- QL count: 94
- distinct context families: 94
- generic article/dealer/trader openings: 2
- Hard questions before migration: 42
- Hard questions after migration: 19
- difficulty recalibrations: 23
- old average explanation length in the rendered review set: 15.3 words
- new average explanation length: 115.6 words
- committed JSON parity with normalized generator output: passed

CP-004 through CP-006 results:

- QL count: 92
- distinct context families: 92
- generic article/dealer/trader openings: 10
- Hard questions before migration: 59
- Hard questions after migration: 45
- difficulty recalibrations: 15
- old average explanation length: 20.4 words
- new average explanation length: 102.7 words

Chapter-wide representation, explanation and renderer gates cover:

- contiguous QL IDs;
- registry placeholder equality;
- real TABLE, CASELET, STATEMENT, ALGEBRAIC and DATA_SUFFICIENCY blocks;
- friendly explanation depth and common-trap guidance;
- valid rendered LaTeX without damaged escape sequences;
- context diversity and generic-opening limits;
- reasoning-based difficulty distribution;
- representative table, caselet, algebraic and data-sufficiency rendering.

The original CP-006 runtime proof and structural audit pass unchanged.

## Rendering policy

- Ordinary prose retains readable forms such as `₹10,000`, `20%` and `500 units`.
- Equations and final mathematical results use LaTeX blocks.
- Legacy raw calculation glyphs are normalized before student display.
- Representation labels must correspond to real structured blocks.

## Language status

English is ready for human review across all 186 QLs.

Hindi and Punjabi Editorial V2 authoring remains intentionally blocked until the complete English layer is approved. Existing Hindi and Punjabi libraries remain structurally available but are not editorially frozen against the new English layer.

## Merge rule

PR #173 must remain draft until:

1. both English comparison workbooks are reviewed;
2. requested corrections are applied;
3. the complete English Editorial V2 layer is approved;
4. the subsequent Hindi and Punjabi migration plan is accepted.

The PR must not be merged merely because automated checks pass.
