# TSD CP-001 and CP-002 — Cross-QL Authority Audit

**Status:** `DECIDED_NOT_IMPLEMENTED`  
**English lifecycle:** `UNFROZEN / EDITORIAL_REVIEW_REQUIRED`  
**Permanent IDs assigned by this audit:** `0`  
**Governing change authority:** `TSD-CP001-CP002-DETAILED-CHANGE-SPECIFICATION.md`

## Purpose

This audit resolves the overlap and authority-purity questions that remained after the P0 editorial remodel. It evaluates the essential learner operation, not story wording or the convenience of sharing one solver.

The audit does not refreeze any record and does not itself alter permanent QL IDs. The current `TSD-QL-001..037` labels remain review mappings until the approved decisions are implemented and proved.

## Final decisions

### QL-017 — keep as a distinct hidden-reference-rate distance authority

Target authority key: `referenceTripDistanceAtChangedConditions`

This task is not the same as direct `distance = speed × time` in QL-001. QL-001 supplies the operative speed directly. QL-017 supplies a reference trip and requires the learner to infer or compare the latent rate before scaling the target distance.

The current review shows only same-speed scaling. Before refreeze it must also show a changed-speed target because the canonical solver already supports both target-speed and target-time factors.

### QL-018 — keep as a distinct hidden-reference-rate time authority

Target authority key: `referenceTripTimeAtChangedConditions`

This task is not the same as direct `time = distance ÷ speed` in QL-003. It starts from a reference journey and scales time by both target-distance and inverse target-speed factors.

Required representations:

- same-speed changed-distance scaling;
- changed-speed, same-distance time scaling.

### QL-032 — keep as a distinct multi-leg time-sum authority

Target authority key: `roundTripLegTimeSum`

The one-way distance is repeated across outward and return legs, but the speeds and therefore the times differ. The essential task is to calculate two leg times and add them. That multi-leg structure is not present in QL-003 and belongs in the segmented-journey checkpoint.

### QL-033 — merge into QL-001 as a representation

Target representation: `distanceFromSpeedAndTime:OVERALL_AVERAGE_AS_EFFECTIVE_SPEED`

The record supplies an overall average speed and a complete travelling time, then asks for total distance. No segment is reconstructed or used. The learner operation is exactly `distance = supplied effective speed × time`; the words “overall average” do not justify a separate authority.

The source candidate `findTotalDistanceFromAverageSpeedAndTotalTime` must move to the direct-distance authority. CP-002 should not retain a separate learner QL for it.

### QL-029 — split by governing equation

Target authorities:

- `unknownDistanceShareFromAverageSpeed`;
- `unknownTimeShareFromAverageSpeed`.

Distance share uses reciprocal-speed weighting:

```text
1/A = x/v₁ + (1−x)/v₂
```

Time share uses direct-speed weighting:

```text
A = xv₁ + (1−x)v₂
```

The equations, shortcuts and misconception families differ. Explicit submodes are acceptable during the remodel, but final discovery must create two learner authorities.

### QL-034 — retain one parameterized allocation authority

Target authority key: `segmentAllocationFromTotalsAndSpeeds`

All representations solve the same system:

```text
t₁ + t₂ = T
v₁t₁ + v₂t₂ = D
```

The requested result may be first/second time or first/second distance, but it is only a projection from the same solved state. Keep one authority with mandatory `requestedQuantity` submodes:

- `FIRST_DISTANCE`;
- `SECOND_DISTANCE`;
- `FIRST_TIME`;
- `SECOND_TIME`.

### QL-035 — split by governing equation

Target authorities:

- `distanceRatioFromAverageAndSpeeds`;
- `timeRatioFromAverageAndSpeeds`.

For lower speed `v₁`, average `A` and higher speed `v₂`:

```text
Time ratio at v₁:v₂
= (v₂−A):(A−v₁)
```

```text
Distance ratio at v₁:v₂
= v₁(v₂−A):v₂(A−v₁)
```

The prior shared authority attached the time-ratio shortcut to distance-ratio items. The P0 remodel fixed the displayed shortcut through submodes; the final registry must now split the authorities.

## Projected authority count

Current review mappings:

- CP-001 learner mappings: 23;
- CP-002 learner mappings: 14;
- combined: 37.

Audit arithmetic:

- QL-033 merge: CP-002 `−1`;
- QL-029 split: CP-002 `+1` net;
- QL-035 split: CP-002 `+1` net.

Projected final discovery boundary:

- CP-001 learner authorities: 23;
- CP-002 learner authorities: 15;
- combined learner authorities: 38;
- internal QA authorities: 4;
- combined mathematical authorities: 42.

These are projected authority counts, not permanent QL assignments.

## Implementation sequence

1. Add changed-speed representation states to the QL-017 and QL-018 runtimes.
2. Move `findTotalDistanceFromAverageSpeedAndTotalTime` and its review surfaces into the direct-distance authority.
3. Split QL-029 discovery, solver adapters, option contracts and review quotas into distance-share and time-share authorities.
4. Retain QL-034 with explicit requested-quantity coverage and one shared simultaneous-equation solver.
5. Split QL-035 discovery and review quotas into distance-ratio and time-ratio authorities.
6. Keep QL-032 in CP-002 and strengthen its multi-leg representation label.
7. Run source-ownership, gap and duplicate-authority proofs.
8. Assign a new contiguous permanent QL range only after the implemented registry passes all proofs.

## Delivery boundary

Until implementation and blind editorial review are complete:

- English freeze remains `UNFROZEN`;
- Question Bank remains `NOT_STORED`;
- test eligibility remains `INELIGIBLE`;
- public delivery remains `false`;
- Hindi and Punjabi localization remain blocked.
