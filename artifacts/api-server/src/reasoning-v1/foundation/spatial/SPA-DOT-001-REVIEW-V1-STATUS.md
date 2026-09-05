# SPA DOT-001 Review V1 Status

## Status

DOT-001 V1 is **product-owner approved**. The reviewed learner runtime is frozen and the chapter is now activated for the internal Question Studio / Question Bank / internal test-builder lifecycle. Mock-test delivery, public release, student delivery and automatic publication remain closed.

## Approved review evidence

- Pull request: `#1421`.
- Approved review head: `0e89c0173974371f06a34d3238bb714ac2d220af`.
- Workflow: `Validate SPA DOT-001 Review V1`.
- Successful review run: `33961956914`.
- Artifact: `spa-dot-001-review-v1` / `9968230353`.
- Artifact digest: `sha256:e0575676cea7bc58f079d081256824929fe5e349b93b9b8abd7bc152d6706c4d`.
- Product-owner approval date: `2026-09-05`.

## Frozen semantic and visual contract

- Permanent semantic QL: `SPA-QL-054` / `DOT-PROP-01`.
- One semantic QL; 1–3 dots and 2–4 active shapes remain generation parameters, not separate QLs.
- Supported shape kinds: circle, square, triangle and rectangle.
- The complete inside/outside membership signature is semantic authority; exclusions are binding.
- Geometry is recomputed from the rendered shape model and dots must maintain at least the approved 4.5-unit boundary-clearance margin.
- Exactly four options are required with one semantic answer; near-miss distractors fail a required membership relation.
- English/Hindi/Punjabi preserve geometry, option ownership, answer and membership signatures.
- Exam rendering remains white-background with the Spatial 1.35px stroke contract and exact square geometry.
- Explanation retains the per-dot membership table, explicit distractor failures and a solution illustration placing the dots in the correct option.

## Freeze and activation authorities

`dot-situation-freeze-v1.ts` records:

- `SPA-DOT-001-PRODUCT-OWNER-APPROVAL-V1`;
- `SPA-DOT-001-FREEZE-V1`;
- `SPA-DOT-001-INTERNAL-ACTIVATION-V1`.

The frozen learner runtime is immutable unless a later reviewed authority explicitly supersedes it.

## Question Studio integration

The current Spatial package is extended by `spatial-question-studio-integration-v7.ts` to **49 production QLs**, adding `SPA-QL-054` / `DOT-001`. `spatial-question-studio-production-v7.ts` routes the approved DOT runtime through the standard Question Studio lifecycle. Compatibility aliases in the existing V6 gateway expose the new V7 package without invalidating the immutable FFM V6 checkpoint.

DOT items are now:

- Question Studio discoverable: **true**
- generation enabled: **true**
- persistence / Question Bank writable: **true**
- internal test-builder eligible: **true**
- manual approval required: **true**
- manual question publication required: **true**

They remain:

- mock-test eligible: **false**
- public release authorized: **false**
- student delivery authorized: **false**
- automatic student publication: **false**

## CI authority

The former review workflow `.github/workflows/spa-dot-001-review-v1.yml` is now manual-only historical evidence. The active automatic checkpoint authority is `.github/workflows/spa-dot-001-freeze-question-studio-v1.yml`, which builds the API, typechecks the admin UI, runs the approved freeze/Question Studio proof and uploads integration evidence.

## Next checkpoint

Land the approved freeze/Question Studio integration after the exact current PR head is green. After merge, continue the Spatial secondary-chapter sequence with `FMT-001`, then `IDF-001`.
