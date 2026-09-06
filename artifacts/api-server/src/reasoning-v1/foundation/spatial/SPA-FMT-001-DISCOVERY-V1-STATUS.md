# SPA FMT-001 Discovery V1 Status

## Status

FMT-001 Figure Matrix has completed source-saturated discovery and permanent semantic allocation. The chapter is intentionally not registered in Question Studio yet. No learner freeze, persistence, mock-test, public-release or student-delivery gate is opened by this checkpoint.

## Semantic boundary

FMT-001 owns missing-cell inference in a two-dimensional figure matrix governed by repeated row rules, repeated column rules, or simultaneous row-and-column constraints.

It does not absorb:

- one-dimensional Figure Series progression (`FSR-001`);
- a pure pairwise A:B::C:? Figure Analogy unless the grid supplies genuine independent matrix constraints;
- numbered figure-grouping tasks, which remain for `IDF-001` discovery;
- arithmetic-only number matrices whose answer does not depend on figure attributes.

## Source saturation

Cross-target repository evidence already establishes Figure Matrix in Punjab-state, Banking and SSC reasoning coverage. Product-owner uploaded reasoning material was also reviewed for question stems, variety, visual conventions and explanation depth.

The uploaded Figure Matrix material directly exposes 2x2, 3x3 and 4x4 matrices and recurring rules including element removal, inversion/reflection, rotation, rotation plus reflection, dot-count progression, common-part/composition logic, cyclic element movement and nested-size recombination. The same source chapter later includes figure-grouping questions; those are treated as a source-book taxonomy leak and are deliberately routed out of FMT-001.

## Permanent semantic allocation

Six consolidated semantic QLs are allocated in `spatial-permanent-ql-allocation-v12.ts`:

| QL | Proposal | Skill |
| --- | --- | --- |
| `SPA-QL-055` | `FMT-PROP-01` | repeated unary transform |
| `SPA-QL-056` | `FMT-PROP-02` | binary figure composition |
| `SPA-QL-057` | `FMT-PROP-03` | quantitative count relation |
| `SPA-QL-058` | `FMT-PROP-04` | cyclic distribution / permutation |
| `SPA-QL-059` | `FMT-PROP-05` | orthogonal row-column attributes |
| `SPA-QL-060` | `FMT-PROP-06` | compound matrix rule |

Matrix size, governing axis, motif choice, exact rotation angle, count values and missing-cell location are parameters rather than separate QLs.

The Spatial permanent range is therefore extended to `SPA-QL-001..SPA-QL-060`; the next available permanent identity is `SPA-QL-061`.

## Runtime contract pinned before implementation

The review runtime must use language-neutral semantic cell state rather than treating SVG pixels as authority. It must independently recompute the missing cell, require the correct option to satisfy every evidential row/column constraint, reject duplicate semantic options and attach a declared semantic failure to every distractor.

The visual contract retains the approved Spatial exam style: white background, 1.35px strokes, consistent matrix-cell and option scale, explicit missing-cell marker, high-contrast shading and no broken/clipped geometry.

The explanation contract requires the governing axis/rule, a worked completed row or column, application to the missing cell, a second-axis check whenever available, explicit attribute changes and near-miss distractor failures. Transform/composition families must include a solution illustration rather than an assertion-only answer.

## CI authority

`.github/workflows/spa-fmt-001-discovery-v1.yml` is the current automatic FMT discovery authority. It builds the API server and executes `figure-matrix-fmt-001-discovery-v1.test.ts`.

The superseded DOT freeze workflow has been returned to manual-only historical evidence in accordance with `docs/CI-FANOUT-POLICY.md`.

## Gates intentionally closed

- review runtime implemented: **false**
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

Implement the deterministic FMT-001 review runtime across all six QLs, generate a balanced visual review pack with Easy/Moderate/Hard questions and source-real rule variety, and validate exam realness before any freeze or Question Studio integration.
