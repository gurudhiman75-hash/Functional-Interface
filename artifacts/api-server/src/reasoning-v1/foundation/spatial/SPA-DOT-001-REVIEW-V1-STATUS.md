# SPA DOT-001 Review V1 Status

## Status

DOT-001 has moved from source discovery into a deterministic review-only runtime. The chapter is intentionally not registered in Question Studio and no learner/public release gate is open.

## Semantic boundary

The chapter owns preservation of each dot's complete region-membership signature across rearranged copies of the same shape identities. Absolute coordinates are not authority. Every dot is represented by a full inside/outside signature, including exclusions.

## V1 implementation

- Permanent semantic QL: `SPA-QL-054` / `DOT-PROP-01`.
- One semantic QL; one/two/three dots and two/three/four shapes are parameters, not separate QLs.
- Supported shape kinds: circle, square, triangle, rectangle.
- Deterministic geometry pool and seed-driven question generation.
- Geometry re-evaluates whether each required signature exists.
- Minimum boundary-clearance rule prevents dots from sitting on or near an edge.
- Exactly four learner options, with one semantic answer and three distractors that each fail at least one required signature.
- English/Hindi/Punjabi stems and explanations preserve the same geometry and answer.
- Explanations include a per-dot membership table and explicit distractor failure checks.
- Exam-style SVG uses white background and the Spatial 1.35px stroke contract.

## Review proof

`dot-situation-dot-001-review-v1.test.ts` exercises 72 deterministic seeds in EN/HI/PA and requires coverage of:

- easy, moderate and hard bands;
- one, two and three dots;
- two, three and four shapes;
- exact-only membership exclusions;
- unique answer and semantic distractor failures;
- language-neutral geometry fingerprints;
- closed Question Studio/mock/public/student gates.

`dot-situation-dot-001-visual-review-v1.ts` generates a 12-question HTML review pack with question figure, four options, answer, membership table, explanation and solver evidence.

## CI policy

`.github/workflows/spa-dot-001-review-v1.yml` is the current active DOT-001 checkpoint authority. It runs on relevant pull-request changes and also supports `workflow_dispatch`. Concurrency cancellation prevents stale DOT runs from competing. Once a later DOT freeze/integration authority supersedes this checkpoint, this review workflow must be converted back to manual-only in accordance with the repository CI fanout policy.

The uploaded `spa-dot-001-review-v1` artifact retains the semantic evidence JSON, semantic run log, HTML/JSON visual review pack, and visual-pack generation log.

## Gates intentionally closed

- learner content frozen: **false**
- Question Studio discoverable: **false**
- persistence/question bank writable: **false**
- test/mock-test eligible: **false**
- public release authorized: **false**
- student delivery authorized: **false**
- automatic student publication: **false**

## Next checkpoint

Run the V1 semantic/visual review workflow, inspect the generated review artifact, fix any exam-realness or visual defects, then create the DOT-001 review authority/freeze only after product-owner approval. Question Studio integration must wait for that approval.
