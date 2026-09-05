# SPA FMT-001 Review V2.1 Status

## Status

FMT-001 Figure Matrix remains a deterministic **review-only** chapter across permanent QLs `SPA-QL-055..SPA-QL-060`.

V1/V1.1 established the six-family semantic architecture and fixed learner-facing editorial leakage, but a second source pass found that the runtime itself did not yet exercise several source-observed subtypes. V2.1 closes that runtime-coverage gap before any product-owner approval is requested.

Question Studio discoverability, persistence, test-builder/mock eligibility, public release, student delivery and automatic publication remain closed.

## Source-gap correction in V2.1

The uploaded Figure Matrix reference explicitly exposes 2×2, 3×3 and 4×4 matrices and examples/solutions based on outer-element removal, perpendicular-line removal followed by inner-element removal, inversion/reflection, compound rotate+invert rules, line composition and count changes. The discovery contract had already recorded these as legitimate FMT parameters/subtypes, but the V1 runtime was much narrower.

V2.1 therefore makes the review corpus prove the source surface instead of merely declaring it.

### `SPA-QL-055` — repeated figure transformation

Runtime variants:
- repeated rotation;
- **2×2 outer-element removal**;
- **staged perpendicular-line removal followed by central-element removal**;
- **reflection / inversion of an asymmetric arrow-marker composite**;
- position shift;
- shading-state change.

### `SPA-QL-056` — figure composition

Runtime variants:
- union / superimposition;
- intersection / common parts;
- symmetric difference / cancellation;
- **directional subtraction / difference**.

### `SPA-QL-057` — count relation

Runtime variants:
- sum across cells;
- absolute difference;
- `2×first + second`;
- **add-constant progression**;
- **multiply-constant progression**;
- **balanced count relation**.

### `SPA-QL-058` — cyclic distribution

Runtime variants:
- motif permutation;
- 4×4 position cycle;
- orientation cycle;
- **fill-state cycle**.

### `SPA-QL-059` — orthogonal row-column attributes

Runtime variants:
- row controls shape + column controls fill;
- row controls count + column controls orientation;
- row controls position + column controls motif.

Each missing cell must satisfy two independent axes simultaneously.

### `SPA-QL-060` — compound matrix rule

Runtime variants:
- rotate + move element;
- **rotate + reflect**;
- **count change + position change**;
- **element removal + orientation change**.

## Semantic authority

`figure-matrix-review-runtime-v2.ts` represents matrix cells as language-neutral semantic feature state, including figure identity, orientation, position, line sets, count, fill state, nested inner/outer elements and asymmetric marker position. SVG remains output only.

`figure-matrix-review-runtime-v2-1.ts` hardens two source variants with dedicated near-miss construction:
- union/superimposition options are guaranteed semantically distinct even when source line sets overlap;
- rotate+reflect distractors independently miss orientation, reflected marker position, or both.

Every item requires:
- four semantically distinct options;
- exactly one solver-valid answer;
- a declared semantic failure for each distractor;
- deterministic replay;
- language-neutral geometry/answer parity across EN/HI/PA;
- 1.35px Spatial exam stroke contract;
- a completed-matrix solution illustration.

## Editorial contract

Learner-facing explanations use normal exam language. Internal implementation names and raw line/position codes remain solver evidence only. Hindi and Punjabi use dedicated localized prose rather than English worked text wrapped by localized labels.

Each question explains:
1. the governing rule;
2. evidence from a completed row/column;
3. direct application to the missing cell;
4. a consistency/second-axis check where relevant;
5. why each distractor fails;
6. the completed matrix as an illustration.

## Proof corpus

`figure-matrix-fmt-001-review-v1.test.ts` now drives **24 deterministic seeds per QL = 144 English semantic questions**, with EN/HI/PA parity replay for every seed.

The proof requires:
- Easy, Moderate and Hard coverage;
- all source-observed matrix sizes **2×2, 3×3 and 4×4**;
- all four answer positions;
- material both-axis reasoning;
- every source variant declared by `FMT_V2_SOURCE_VARIANTS` to appear in runtime output;
- explicit 2×2, element-removal, reflection, fill-cycle, directional-subtraction and compound-rule coverage;
- no internal rule-token leakage in learner explanations;
- all release gates closed.

`figure-matrix-fmt-001-visual-review-v1.ts` now generates **27 review questions — one explicit specimen for every declared V2.1 source variant** across the six permanent QLs. The output filenames remain stable so the existing review workflow continues to upload the same artifact name.

## CI authority

`.github/workflows/spa-fmt-001-review-v1.yml` remains the single current automatic FMT checkpoint authority. It builds the API server, bundles/runs the semantic proof, regenerates the exhaustive visual pack, persists semantic evidence JSON and uploads `spa-fmt-001-review-v1`.

Earlier FMT discovery and superseded DOT freeze workflows remain manual-only per `docs/CI-FANOUT-POLICY.md`.

## Base synchronization

The FMT branch has been merged forward onto `New-main` head `4fef17cbf960a65dc1b7850ff87c720ba8211a4e` and was confirmed zero commits behind at that checkpoint.

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

Run the exact-head V2.1 semantic/editorial/visual authority. Inspect all 27 source-variant cards for exam realness, proportion, option quality and explanation depth. Fix any remaining defect before requesting product-owner approval. Freeze and Question Studio integration are explicitly out of scope until that approval.
