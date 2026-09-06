# SPA FMT-001 Review V2.2 Status

## Status

FMT-001 Figure Matrix remains a deterministic **review-only** chapter across permanent QLs `SPA-QL-055..SPA-QL-060`.

V2.1 closed the source-coverage and editorial gaps. Exact-head CI then exposed one additional generator defect: some valid source-family seeds could collapse two intended distractors into the same semantic answer state, leaving fewer than four distinct options. V2.2 fixes that review-runtime failure without changing semantic-family ownership.

Question Studio discoverability, persistence, test-builder/mock eligibility, public release, student delivery and automatic publication remain closed.

## Source-real rule variety

### `SPA-QL-055` — repeated figure transformation
- repeated rotation;
- 2×2 outer-element removal;
- staged perpendicular-line removal followed by central-element removal;
- reflection / inversion of an asymmetric arrow-marker composite;
- position shift;
- shading-state change.

### `SPA-QL-056` — figure composition
- union / superimposition;
- intersection / common parts;
- symmetric difference / cancellation;
- directional subtraction / difference.

### `SPA-QL-057` — count relation
- sum across cells;
- absolute difference;
- `2×first + second`;
- add-constant progression;
- multiply-constant progression;
- balanced count relation.

### `SPA-QL-058` — cyclic distribution
- motif permutation;
- 4×4 position cycle;
- orientation cycle;
- fill-state cycle.

### `SPA-QL-059` — orthogonal row-column attributes
- row controls shape + column controls fill;
- row controls count + column controls orientation;
- row controls position + column controls motif.

### `SPA-QL-060` — compound matrix rule
- rotate + move element;
- rotate + reflect;
- count change + position change;
- element removal + orientation change.

## Semantic authority

`figure-matrix-review-runtime-v2.ts` represents matrix cells as language-neutral semantic feature state. SVG remains presentation only.

`figure-matrix-review-runtime-v2-1.ts` supplies source-real editorial and near-miss hardening for the variants that require dedicated construction.

`figure-matrix-review-runtime-v2-2.ts` adds deterministic same-family recovery when the underlying candidate set collapses into duplicate semantic options. The retry seed changes only geometry/distractor details and is forced to the same declared source variant. The learner seed, QL ownership and source family remain unchanged. The generated item records the internal review-generation seed and retry count in solver evidence.

Every item requires:
- four semantically distinct and visibly distinct options;
- exactly one solver-valid answer;
- a declared semantic failure for each distractor;
- deterministic replay;
- source-family preservation if retry is needed;
- language-neutral geometry/answer parity across EN/HI/PA;
- 1.35px Spatial exam stroke contract;
- a completed-matrix solution illustration.

## Editorial contract

Learner-facing explanations use normal exam language. Internal implementation names and raw line/position codes remain solver evidence only. Hindi and Punjabi use dedicated localized prose rather than English worked text wrapped by localized labels.

Each question explains the governing rule, evidence from a completed row/column, direct application to the missing cell, a consistency/second-axis check where relevant, why each distractor fails, and the completed matrix as an illustration.

## Proof corpus

`figure-matrix-fmt-001-review-v1.test.ts` drives **24 deterministic seeds per QL = 144 English semantic questions**, with EN/HI/PA parity replay for every seed.

The proof requires Easy/Moderate/Hard coverage; 2×2, 3×3 and 4×4 matrices; all four answer positions; material both-axis reasoning; every declared source variant; no internal rule-token leakage; all lifecycle gates closed; and at least one exercised deterministic duplicate-option recovery path.

`figure-matrix-fmt-001-visual-review-v1.ts` generates **27 review questions — one explicit specimen for every declared source-real runtime variant** across the six permanent QLs. V2.2 records any retry count in review metadata while keeping the learner-facing card clean.

## CI authority

`.github/workflows/spa-fmt-001-review-v1.yml` remains the single current automatic FMT checkpoint authority. It builds the API server, bundles/runs the semantic proof, regenerates the exhaustive visual pack, persists semantic evidence JSON and uploads `spa-fmt-001-review-v1`.

Earlier FMT discovery and superseded DOT freeze workflows remain manual-only per `docs/CI-FANOUT-POLICY.md`.

## Exact-head remediation

The prior exact-head FMT review run `34008233378` failed in the semantic proof with `FMT-001 V2 failed to construct four semantically distinct options.` V2.2 was introduced specifically to make this failure impossible to silently pass: the generator deterministically retries within the same source variant, and the 144-question proof asserts both four-way semantic uniqueness and that the retry path is materially exercised.

## Gates intentionally closed

- review only: **true**
- learner content frozen: **false**
- Question Studio discoverable: **false**
- persistence allowed: **false**
- Question Bank writable: **false**
- test-builder eligible: **false**
- mock-test eligible: **false**
- public release authorized: **false**
- student delivery authorized: **false**
- automatic student publication: **false**

## Next checkpoint

Make the exact-head V2.2 semantic/editorial/visual authority green, inspect all 27 source-variant cards for exam realness, proportion, option quality and explanation depth, and fix any remaining defect before requesting product-owner approval. Freeze and Question Studio integration remain out of scope until that approval.
