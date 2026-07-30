# BLR-CP-003 — Human Review Approval V5

Status: **human review approved with a visual-polish condition; sibling-arrow remediation reopened for confirmation**.

## Approval record

Approval was provided on 2026-07-29 for the English V5 competitive SVG review pack.

Reviewer decision:

> Approved with minor polish. Siblings dotted line should have arrows at the end to make it clearer.

This is an explicit human approval. It is not an assistant self-approval.

After the first marker-only implementation, the reviewer reported:

> arrows not pointing to siblings properly

The content approval remains recorded, but the accepted visual condition is not considered closed until the corrected replacement HTML is reviewed.

## Corrected remediation

The marker-only horizontal line has been replaced with a routed dotted bracket:

```text
          ↑ sibling A                  sibling B ↑
          └·········· SIBLINGS ··········┘
```

The corrected geometry:

- targets the inner bottom edge of each sibling card rather than the space beside the cards;
- offsets each target away from the central parent-child lineage connector;
- keeps both arrowheads fixed upward with `orient="-90"`;
- leaves an 8-pixel visual clearance beneath each card so the card fill cannot hide the arrowheads;
- keeps the horizontal dotted segment below the spouse and lineage connectors;
- preserves the symmetric, bidirectional meaning of siblinghood.

## Implementation evidence

Student application:

- `src/components/blood-relations/RoutedFamilyTreeDiagram.tsx` converts the legacy horizontal sibling line into the inner-card-bottom bracket;
- `src/components/learning/LogicPlaybackRouter.tsx` lazy-loads the routed renderer;
- the renderer uses native React and SVG only;
- no external SVG or graph library is introduced.

Review/export layer:

- `cp003-svg-family-tree-markup-v3.ts` produces the same routed bracket in exported HTML;
- `cp003-svg-family-tree.ts` promotes the V3 markup renderer;
- `cp003-competitive-svg-review.test.ts` checks route geometry, upward orientation, inner-card targets and visible clearance.

Compiled application gate:

- `scripts/verify-family-tree-chunk.mjs` verifies that the production bundle includes the inner-card route, both markers, fixed upward orientation and the visibility-clearance contract;
- the integration must remain outside the main student bundle.

## Exact corrected artifact inventory

```text
SVG diagrams                              128
Dotted sibling-path routes                 56
Inner-card target declarations             56
Visible-clearance declarations             56
Sibling marker-start attributes            56
Sibling marker-end attributes              56
Legacy horizontal dotted sibling lines      0
```

## Review boundary

The reviewer must inspect the corrected replacement HTML before the visual-polish condition is closed.

Until then, this record does not authorize:

- final discovery freeze;
- allocation of `BLR-QL-009` or any permanent CP-003 solve identity;
- Question Studio visibility;
- Question Bank or mock-test delivery;
- Hindi or Punjabi localization;
- merging draft PR #308.

## Next mandatory gate

```text
review corrected sibling-arrow HTML
  -> close visual-polish condition
  -> rerun post-human confirmation if accepted
  -> final discovery freeze
  -> sequential permanent QL allocation, only if supported
```
