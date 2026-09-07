# SPA IDF-001 Review V1.1 Status

## Status

IDF-001 remains review-only. V1.1 keeps the green V1 semantic contract intact and remediates the learner-facing review surface before product-owner approval.

## Frozen-for-review semantic scope

- `SPA-QL-061` / `IDF-PROP-01` — component identity grouping.
- `SPA-QL-062` / `IDF-PROP-02` — topological relation grouping.
- `SPA-QL-063` / `IDF-PROP-03` — transform-equivalence grouping under an explicit rotation/reflection policy.
- Nine numbered figures are partitioned into three groups of three.
- Every option uses all nine figures exactly once.
- The correct partition is recomputed from semantic state and is unique.
- Every distractor contains at least one mixed group.
- EN/HI/PA preserve geometry, grouping and answer.

## V1.1 learner remediation

Internal inspection of the green V1 artifact found that each bank number was painted before a nested white figure canvas, causing most of labels 1–9 to be hidden. V1.1 paints compact number labels as the final SVG layer, after all figure artwork, without changing figure state, grouping, options or answers.

V1.1 also replaces implementation-facing explanation phrases with learner-facing wording while retaining:
- all three correct groups;
- the reason each group belongs together;
- explicit mixed-group failures for distractors;
- the grouped solution illustration.

The V1.1 proof compares every remediated question with V1 and requires semantic geometry, options, answer, correct partition and solution illustration to remain unchanged.

## Review proof target

`identical-figure-idf-001-review-v1-1.test.ts` checks 96 deterministic seeds for each of the three QLs across EN/HI/PA, including nine visible number overlays per bank and all closed lifecycle gates.

`identical-figure-idf-001-visual-review-v1-1.ts` produces a 15-question review pack spanning component, topology and transform-equivalence grouping and both transform policies.

## CI authority

`Validate SPA IDF-001 Review V1.1` is the single active automatic IDF review checkpoint authority and also supports manual dispatch. `Validate SPA IDF-001 Review V1` is manual-only historical evidence. The superseded FMT freeze workflow remains historical/manual-only on this branch.

## Gates intentionally closed

- learner content frozen: **false**
- Question Studio discoverable: **false**
- persistence allowed: **false**
- Question Bank writable: **false**
- internal Test Builder eligible: **false**
- mock-test eligible: **false**
- public release authorized: **false**
- student delivery authorized: **false**
- automatic student publication: **false**

## Next checkpoint

Require a green exact-head V1.1 workflow and inspect the generated `spa-idf-001-review-v1-1` artifact for number readability, figure quality, source realism, grouping ambiguity, transform-policy clarity and explanation quality. Freeze and Question Studio integration must wait for product-owner approval.
