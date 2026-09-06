# SPA FMT-001 Review V2.3 Status

## Status

FMT-001 Figure Matrix is a deterministic **review-only** chapter across permanent QLs `SPA-QL-055..SPA-QL-060`.

V2.2 fixed duplicate semantic option collapse through deterministic same-source-variant retry. V2.3 keeps that semantic/geometry authority unchanged and hardens learner explanation depth after the 27-card source/visual audit.

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

`figure-matrix-review-runtime-v2-1.ts` supplies dedicated source-real constructions where the generic runtime is not enough.

`figure-matrix-review-runtime-v2-2.ts` adds deterministic same-family recovery when candidate distractors collapse into duplicate semantic states. The learner seed, QL and source variant remain unchanged; only internal review generation details may retry.

`figure-matrix-review-runtime-v2-3.ts` is an editorial overlay. It does not alter geometry or answer semantics. It strengthens:
- composition explanations with the exact line operation and explicit missing/extra-line distractor differences;
- count explanations with completed-row numerical equations and the exact row-3 calculation;
- cyclic explanations with the learner-visible sequence written out explicitly;
- Hindi/Punjabi cycle-result wording so no English state labels leak into localized worked text.

Every item still requires four semantically and visibly distinct options, exactly one solver-valid answer, deterministic replay, EN/HI/PA geometry/answer parity, the 1.35px Spatial exam stroke contract and a completed-matrix solution illustration.

## Source and visual audit

The product-owner uploaded Figure Matrix reference was rechecked against the runtime. The source directly supports 2×2/3×3/4×4 matrix completion, repeated element removal, line removal, count relations, inversion/reflection, rotation and compound rotation/reflection, common-parts/composition and cyclic/position changes. Grouping-items that happen to follow the chapter in the source remain intentionally excluded because they are a different semantic task.

The regenerated visual pack contains **27 cards — one explicit specimen for every declared runtime source variant**. The inspected surfaces retain consistent matrix/option scale, white background, explicit missing-cell marker, thin exam-style geometry, four visible options and a completed-matrix explanation illustration.

## Proof corpus

`figure-matrix-fmt-001-review-v1.test.ts` drives **24 deterministic seeds per QL = 144 English semantic questions**, with EN/HI/PA parity replay for every seed.

The V2.3 proof requires:
- Easy/Moderate/Hard coverage;
- 2×2, 3×3 and 4×4 matrices;
- all four answer positions;
- material both-axis reasoning;
- every declared source variant;
- four-way semantic and visual option uniqueness;
- deterministic same-variant retry coverage;
- no internal rule-token leakage;
- localized explanation language purity;
- 24 explicit composition explanation checks;
- 24 explicit count explanation checks;
- 24 explicit cyclic-sequence checks;
- all lifecycle/release gates closed.

## Exact-head CI evidence

Current exact review head: `d5522a840eddcae93b0498a2f201c1278a1ebe39`.

`Validate SPA FMT-001 Review V1` run `34015524844` is **green**. Its review artifact is:
- name: `spa-fmt-001-review-v1`;
- artifact id: `9983775175`;
- digest: `sha256:0ad574f429bf4f5e1c99b0218fd2d208971c45e796e82af391dbbc1596418657`.

The semantic evidence records authority `SPA-FMT-001-REVIEW-V2.3`, 144 checked questions, all six QLs, all 27 source variants, all three matrix sizes, all answer positions, 72 hard questions, 48 both-axis questions, 8 two-by-two questions and 4 exercised deterministic option retries.

`.github/workflows/spa-fmt-001-review-v1.yml` remains the single current automatic FMT checkpoint authority. Earlier FMT discovery and superseded DOT freeze workflows remain manual-only under `docs/CI-FANOUT-POLICY.md`.

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

V2.3 is **product-owner review-ready**. Inspect the regenerated 27-card artifact and approve/reject the learner visuals and explanation style. Only after explicit product-owner approval should FMT-001 be frozen and integrated into Question Studio. No release gate should open as part of that freeze/integration step.
