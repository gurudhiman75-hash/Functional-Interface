# COD-CP-008 — English Runtime Implementation Report

Status: **two permanent English QLs implemented at runtime-proof maturity; review-only**.

## Permanent inventory

| QL | Rule family | Solve obligation |
|---|---|---|
| `COD-QL-173` | `DIRECT_RENAMED_LABEL` | The referent is stated directly; return its assigned renamed label. |
| `COD-QL-174` | `SEMANTIC_REFERENT_THEN_RENAME` | Resolve one curated fact, role, property, category or use; then return the assigned renamed label. |

## Runtime architecture

The permanent runtime wraps the frozen prototype generator and independent solver. It preserves:

- one-step renaming semantics;
- injective maps without identity edges;
- open-chain and cycle topologies;
- curated semantic facts only;
- misconception-labelled distractors;
- deterministic stems, options and explanations;
- review-only and non-publishable safety metadata.

The runtime does not repeatedly traverse a renaming chain. It first identifies the real referent and follows exactly one displayed renaming edge.

## Validation contract

The permanent audit generates 200 seeds for each QL, for 400 questions total. It enforces:

- permanent identity and solve-contract provenance;
- exact deterministic regeneration;
- independent solver agreement;
- four unique options and one correct answer;
- all four answer positions;
- all three renderers;
- open-chain and cycle coverage;
- Easy, Medium and Hard reach across the checkpoint;
- all 15 curated semantic facts and all four semantic categories;
- complete learner-facing explanations;
- no prototype, registry or solver language in candidate-facing text.

The frozen 400-question prototype suite remains a regression gate.

## Release boundary

- locale: English only;
- review-only: true;
- Question Studio visible: false;
- publicly publishable: false;
- Question Bank and mock-test eligibility: disabled;
- Hindi and Punjabi: deferred until the complete English chapter ownership is frozen.
