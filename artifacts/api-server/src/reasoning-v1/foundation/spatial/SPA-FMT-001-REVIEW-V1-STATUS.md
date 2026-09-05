# SPA FMT-001 Review V1 Status

## Status

FMT-001 Figure Matrix has moved from source discovery into a deterministic review-only runtime across all six permanent semantic QLs, `SPA-QL-055..SPA-QL-060`.

Question Studio discoverability, persistence, test-builder/mock eligibility, public release, student delivery and automatic publication remain closed. This checkpoint exists only to review semantics, exam realness, visuals and explanations.

## Review runtime coverage

| QL | Family | Review variants |
| --- | --- | --- |
| `SPA-QL-055` | repeated unary transform | 45°, 90° and 135° repeated rotations |
| `SPA-QL-056` | binary figure composition | union, XOR/cancellation and intersection/common-parts |
| `SPA-QL-057` | quantitative count relation | sum, absolute difference and `2×first + second` |
| `SPA-QL-058` | cyclic distribution / permutation | motif cycles, 4×4 position cycles and orientation cycles |
| `SPA-QL-059` | orthogonal row-column attributes | row shape + column orientation/position/count |
| `SPA-QL-060` | compound matrix rule | simultaneous rotation and position movement |

## Semantic authority and validation

Each matrix is generated from language-neutral semantic cell state. SVG is output only. The runtime independently recomputes the missing-cell state from completed matrix evidence before constructing options.

Every learner item requires:

- four semantically distinct options;
- one and only one option matching the solver result;
- an explicit semantic failure for each distractor;
- deterministic seed replay;
- language-neutral geometry and answer parity across EN/HI/PA;
- the correct option to satisfy every governing row/column constraint exposed by the family.

## Visual contract

- white background;
- 1.35px Spatial exam strokes;
- consistent scale within matrix cells and answer options;
- explicit `?` missing-cell marker;
- no clipped or broken figures;
- 3×3 as the primary surface with 4×4 cyclic coverage retained for source-real variety;
- no visual-pixel comparison is used as answer authority.

## Explanation contract implemented

Each question carries:

1. the governing row/column rule;
2. a worked completed-row/column statement;
3. direct application to the missing cell;
4. a second-axis/consistency verification where relevant;
5. three distractor-failure checks;
6. a completed-matrix solution illustration.

This deliberately improves on short assertion-only source explanations.

## Proof corpus

`figure-matrix-fmt-001-review-v1.test.ts` exercises 18 deterministic seeds per QL = **108 English semantic questions**, with EN/HI/PA parity replay for every seed. It requires Easy, Moderate and Hard coverage, 3×3 and 4×4 surfaces, material both-axis reasoning, varied answer placement and multi-operation coverage in composition/count families.

`figure-matrix-fmt-001-visual-review-v1.ts` generates an **18-question HTML visual review pack**, three questions from every permanent QL. Each card shows the problem matrix, four options, answer, worked explanation, completed-matrix solution illustration and semantic solver evidence.

## CI authority

`.github/workflows/spa-fmt-001-review-v1.yml` is now the current automatic FMT review authority. It builds the API server, runs the semantic proof, generates the visual pack, persists semantic evidence JSON and uploads the complete `spa-fmt-001-review-v1` artifact.

The earlier FMT discovery workflow and the superseded DOT freeze workflow are manual-only historical evidence in accordance with `docs/CI-FANOUT-POLICY.md`.

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

Make the V1 semantic/visual review workflow green and inspect the generated 18-question artifact for exam realness. Any visual or editorial defects are corrected in review revisions. Only product-owner approval can authorize FMT freeze and Question Studio integration.
