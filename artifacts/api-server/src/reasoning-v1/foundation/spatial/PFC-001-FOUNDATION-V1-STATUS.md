# PFC-001 Foundation V1 Status

## Current stage

`PFC-001 — Paper Folding and Cutting` is at `PFC-CP0` foundation stage.

## Frozen boundary

- Existing Spatial permanent QLs remain `SPA-QL-001..034`.
- Next available coordinate is `SPA-QL-035`.
- No permanent PFC QLs are allocated yet.
- No PFC Question Studio registration, persistence, Question Bank write, test/mock eligibility or student publication is enabled.

## Implemented CP0 foundation

- arbitrary-line fold support using the shared Spatial reflection transform;
- convex polygon splitting by fold line;
- explicit moving/stationary fold side;
- per-layer fragment provenance;
- per-fragment reflection history;
- actual folded-layer coverage at the cut point;
- point-hole and boundary-notch semantic cuts;
- inverse mapping from folded cut to original-sheet coordinates;
- boundary/interior contact classification;
- deterministic unfolded semantic fingerprint;
- fail-closed invalid fold and cut handling.

## Fixed proof scenarios

The CP0 proof suite covers:

1. one axial fold + point hole;
2. two perpendicular folds + point hole;
3. one diagonal fold + point hole;
4. axial + diagonal order-sensitive unfolding;
5. boundary notch;
6. multiple cuts;
7. deterministic replay;
8. cut outside folded material rejected;
9. fold line outside active material rejected.

## Not yet implemented

The following remain for `PFC-CP1` discovery rather than being overclaimed in CP0:

- full polygon-cut subtraction/topology;
- partial/off-centre/corner fold production catalog;
- three-fold production catalog;
- learner SVG stage renderer and review pack;
- misconception option generator;
- 800-question discovery corpus;
- exam-source/taxonomy saturation audit;
- permanent QL allocation;
- English freeze;
- Hindi/Punjabi localization;
- Question Studio integration.

## Next gate

`PFC_CP0_FOUNDATION_CI_AND_REVIEW`
