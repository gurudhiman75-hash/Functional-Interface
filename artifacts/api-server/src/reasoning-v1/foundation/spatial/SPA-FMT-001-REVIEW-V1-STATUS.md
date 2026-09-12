# SPA FMT-001 Approved Freeze + Question Studio V1 Status

## Status

FMT-001 Figure Matrix V2.4 is **product-owner approved** for permanent QLs `SPA-QL-055..SPA-QL-060`.

The approved learner/runtime contract is now frozen by `SPA-FMT-001-FREEZE-V1` and exposed internally by `SPA-FMT-001-INTERNAL-ACTIVATION-V1`. Question Studio generation, persistence, Question Bank writes and internal Test Builder eligibility are open. Mock-test eligibility, public release, student delivery and automatic student publication remain closed.

## Approved review evidence

Product-owner approval was given on **2026-09-06** against the exact V2.4 review checkpoint:

- reviewed PR: `#1432`;
- reviewed head: `f4c13d4be6d190d8f64737f26749aea157ae916f`;
- workflow: `Validate SPA FMT-001 Review V1`;
- run: `34017570536` — **green**;
- artifact: `spa-fmt-001-review-v1` / `9984396659`;
- artifact digest: `sha256:fc5c5844e9d06ff0cd8e4ac949da537287a41db39f242c351a89520a7659d4a2`;
- reviewed 27-card HTML SHA-256: `9d3d0cddae1332830228ebf27ee7d299cabbb8e2af9db23fafca4c9931d4bd85`.

## Frozen semantic allocation

- `SPA-QL-055` / `FMT-PROP-01` — repeated figure transformation;
- `SPA-QL-056` / `FMT-PROP-02` — binary figure composition;
- `SPA-QL-057` / `FMT-PROP-03` — quantitative count relation;
- `SPA-QL-058` / `FMT-PROP-04` — cyclic distribution / permutation;
- `SPA-QL-059` / `FMT-PROP-05` — orthogonal row-column attributes;
- `SPA-QL-060` / `FMT-PROP-06` — compound matrix rule.

`SPA-QL-061` remains the next available Spatial permanent identity.

## Approved V2.4 contract

The freeze preserves the complete source-saturated V2.4 coverage: 2×2, 3×3 and 4×4 matrices; repeated rotation/removal/reflection/position/fill transforms; union/intersection/cancellation/directional subtraction; count relations and progressions; motif/position/orientation/fill cycles; orthogonal row-column attributes; and compound rotate/move/reflect/count/removal rules.

The approved visual/editorial contract remains immutable:

- semantic cell state plus the declared row/column rule is authority; SVG is presentation;
- exactly four options and one solver-valid semantic answer;
- perceptually equivalent options are rejected;
- `ORIENTATION_CYCLE` uses the approved asymmetric arrow so 0°/120°/240° states remain visibly distinct;
- white background and 1.35px Spatial exam strokes;
- consistent matrix/option scale and explicit missing-cell marker;
- no clipped/broken geometry;
- EN/HI/PA geometry, option-order and answer parity;
- learner explanation retains worked rule application, explicit distractor checks and a completed-matrix solution illustration.

## Question Studio integration

The current Spatial Question Studio package advances from 49 to **55 production QLs** through `spatial-question-studio-integration-v8.ts` and `spatial-question-studio-production-v8.ts`.

`figure-matrix-question-studio-v1.ts` adapts the frozen V2.4 runtime without changing its geometry or answer authority. It exposes the matrix as the stimulus, keeps the four approved option SVGs, normalizes the learner explanation into the shared Spatial review shape and persists the completed-matrix solution illustration.

The compatibility-safe V1 aliases exported through the existing V6 gateway now resolve the 55-QL current package/runtime, while the named V6 and V7 checkpoints remain immutable historical FFM/DOT authorities.

The admin Spatial review UI exposes **Figure Matrix**, displays the matrix at wide scale and labels the explanation illustration `Solution: completed matrix with the missing cell filled`.

## Validation authority

`.github/workflows/spa-fmt-001-freeze-question-studio-v1.yml` is now the single active automatic FMT checkpoint authority. It builds the API, typechecks the admin Question Studio UI and runs `figure-matrix-fmt-001-freeze-question-studio-v1.test.ts`.

The proof covers 36 approved production questions across all six FMT QLs and EN/HI/PA, current-alias parity, localization geometry/answer parity, the V2.4 asymmetric-arrow perceptual guard, 18-question FMT batch generation, persistence of the completed-matrix solution illustration and closed downstream release gates.

The superseded FMT review workflow is manual-only historical evidence. The superseded DOT freeze workflow is also manual-only.

## Lifecycle gates

- learner content frozen: **true**
- Question Studio discoverable: **true**
- persistence allowed: **true**
- Question Bank writable: **true**
- internal Test Builder eligible: **true**
- manual Question Studio approval required: **true**
- manual question publication required: **true**
- mock-test eligible: **false**
- public release authorized: **false**
- student delivery authorized: **false**
- automatic student publication: **false**

## Next checkpoint

Require the exact current PR head to pass the FMT freeze/Question Studio workflow, CI-hygiene and integrated admin checks. After those are green, bind the run/artifact evidence into PR #1432 and merge. Then continue the Spatial closure sequence with `IDF-001`.
