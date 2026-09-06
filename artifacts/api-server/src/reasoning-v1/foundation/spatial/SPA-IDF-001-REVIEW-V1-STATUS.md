# SPA IDF-001 Review V1 Status

## Status

IDF-001 is now implemented as a deterministic review-only Spatial chapter. It is intentionally not registered in Question Studio and no learner/public release gate is open.

## Source saturation

The uploaded Radian `Reasoning for Competitions` material contains a distinct numbered-bank grouping surface after Figure Matrix: each figure is used once to form three groups. The source solutions group figures by stable outer shape, containment/intersection relation, and inner/partition structure. That surface is routed to `IDF-001` instead of being absorbed into Figure Matrix.

The adjacent Figure Classification material also repeatedly uses rotation equivalence, but its task is odd-one-out. IDF therefore owns full-bank equivalence grouping, while FCL keeps odd-one-out classification.

## Permanent semantic allocation

- `SPA-QL-061` / `IDF-PROP-01` — component identity grouping.
- `SPA-QL-062` / `IDF-PROP-02` — topological relation grouping.
- `SPA-QL-063` / `IDF-PROP-03` — transform-equivalence grouping under an explicit rotation/reflection policy.

Group ordering, exact motif choice, rotation angle and difficulty are parameters rather than separate QLs. `SPA-QL-064` remains next available.

## V1 runtime

- Nine numbered figures are partitioned into three groups of three.
- Every answer option uses all nine figures exactly once.
- Group membership is recomputed from semantic state rather than SVG resemblance.
- The correct partition is unique.
- Each distractor contains at least one deliberately mixed semantic group.
- Transform questions canonicalize asymmetric slot motifs under either rotation-only or rotation-plus-reflection policy.
- Component grouping covers outer identity, inner identity and partition skeleton.
- Topology grouping covers complete containment, partial overlap and crossing intersection.
- White background and the approved Spatial `1.35px` exam stroke are retained.
- EN/HI/PA share identical geometry, grouping and answer.
- Explanations list every correct group, state why its members belong together, identify mixed distractor groups and include a grouped solution illustration.

## Review proof

`identical-figure-idf-001-review-v1.test.ts` exercises 96 deterministic seeds per QL and verifies EN/HI/PA parity, four unique answer options, exact use-once partitioning, unique semantic answer, all component/topology/transform variants and closed release gates.

`identical-figure-idf-001-visual-review-v1.ts` generates a 15-question HTML review pack spanning all three QLs and both transform policies.

## CI authority

`Validate SPA IDF-001 Review V1` is the current automatic IDF checkpoint authority and also supports manual dispatch. The superseded FMT freeze workflow is manual-only historical evidence on this branch.

## Gates intentionally closed

- learner content frozen: **false**
- Question Studio discoverable: **false**
- persistence/question bank writable: **false**
- internal test-builder eligible: **false**
- mock-test eligible: **false**
- public release authorized: **false**
- student delivery authorized: **false**
- automatic student publication: **false**

## Next checkpoint

Run the exact-head semantic/visual review workflow and inspect the `spa-idf-001-review-v1` artifact for exam realness, source variety, transform-policy clarity and explanation quality. Freeze and Question Studio integration must wait for product-owner review approval.
