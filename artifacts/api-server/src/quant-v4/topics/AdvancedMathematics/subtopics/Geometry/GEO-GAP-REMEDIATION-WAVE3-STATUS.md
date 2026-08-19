# Geometry Gap Authority & Runtime Remediation — Wave 3 Status

**Authority:** Composite Geometry Revision 3  
**Renderer contract:** `EXAMTREE_GEOMETRY_SVG_V2`  
**Predecessors:** approved Wave 1 and approved Wave 2 discovery remediation  
**Lifecycle:** `DISCOVERY`  
**Wave 3 state:** `REVIEW_READY_CANDIDATE`

## Wave decision

Wave 3 continues `GEO-CP-006` source-observed triangle-centre remediation with four temporary prototypes:

| Temporary prototype | Learner decision | Source gap | Diagram disposition |
|---|---|---|---|
| `GEO-TMP-GAP-W3-CP006-INCENTRE-IDENTIFY-V1` | identify the incentre from angle-bisector concurrency | `CENTRE_IDENTIFICATION` | `REQUIRED_STEM_DIAGRAM` |
| `GEO-TMP-GAP-W3-CP006-RIGHT-TRIANGLE-ORTHOCENTRE-V1` | locate the orthocentre in a right triangle | `CENTRE_IDENTIFICATION_ORTHOCENTRE_RIGHT_TRIANGLE` | `REQUIRED_STEM_DIAGRAM` |
| `GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-DIRECT-V1` | vertex angle → opposite angle at incentre | `CIRCUMCENTRE_OR_INCENTRE_ANGLE_PROPERTY` | `REQUIRED_STEM_DIAGRAM` |
| `GEO-TMP-GAP-W3-CP006-INCENTRE-ANGLE-INVERSE-V1` | angle at incentre → opposite vertex angle | `CIRCUMCENTRE_OR_INCENTRE_ANGLE_PROPERTY_INVERSE` | `REQUIRED_STEM_DIAGRAM` |

Baseline temporary executable discovery = 38.  
Wave 1 = +4.  
Wave 2 = +3.  
Wave 3 = +4.  
Current temporary executable count after Wave 3 = **49**.

Permanent QLs = **0**.  
Frozen solve modes = **0**.

## Source basis

1. `SRC-TESTBOOK-CGL-INCENTRE-IDENTIFICATION-PYQ-2017` — SSC CGL, 16 Aug 2017: internal angle-bisector concurrency identifies the incentre.
2. `SRC-TESTBOOK-CPO-RIGHT-TRIANGLE-ORTHOCENTRE-PYQ-2025` — SSC CPO, 12 Dec 2025: the orthocentre of a right triangle lies at the right-angled vertex.
3. `SRC-TESTBOOK-CGL-INCENTRE-ANGLE-DIRECT-PYQ-2021` — SSC CGL 2021 Tier I, held 20 Apr 2022: given ∠A, find ∠BIC for incentre I.
4. `SRC-TESTBOOK-CHSL-INCENTRE-ANGLE-INVERSE-PYQ-2018` — SSC CHSL, 24 Mar 2018: given ∠BIC, recover ∠BAC.

Source saturation is still not claimed.

## Shared exact additions

`triangle-centre-inference.ts` supports:

- concurrency → centre identification for medians, angle bisectors, perpendicular bisectors and altitudes;
- exact incentre opposite-angle recovery: vertex angle → `90° + half the vertex angle`;
- exact inverse recovery: incentre opposite angle → vertex angle;
- right-triangle orthocentre location at the right-angled vertex.

The theorem registry keeps learner-facing names natural and classifies the new centre rules under `TRIANGLE_CENTRES`.

## Representation quality

All four prototypes inherit the approved Renderer-V2 contract:

- stated angle-bisector concurrency is visually faithful;
- the right-triangle stem visibly shows the supplied right-angle mark;
- direct and inverse incentre-angle diagrams show supplied/target angles with explicit arcs;
- point and angle labels are collision checked;
- Wave-3 finalization deterministically expands angle-label radii when needed and rejects any residual collision;
- diagrams use independent high-precision geometry verification;
- `notToScale = true` remains mandatory;
- internal theorem IDs never appear in learner explanations.

A human visual self-review of all 12 exported questions passed after the runtime caught an inverse incentre-angle label collision. That collision was fixed at source/runtime level, then the entire proof was rerun.

## CI evidence — PASS

`Validate Geometry Gap Remediation Wave 3` — **PASS**

- run: `32257896830`
- job: `96083851423`
- head: `fa0f330b8a3d598559e14d783264600779137d02`
- API build: PASS
- retained Source Saturation Audit V1: PASS
- retained Geometry Phases 0–5: PASS
- retained Wave 1 proof: PASS
- retained Wave 2 proof: PASS
- Wave 3 proof: PASS
- review export: PASS
- artifact upload: PASS

Review artifact:

- id: `9367035341`
- digest: `sha256:f6640b587ae7664a83829b0589e655f6719c27a2d1aff7832ccbf44aecb274b2`
- four temporary prototypes × three review seeds = **12 review questions**

```text
wave3ImplementationComplete = true
wave3RuntimeProofPassed      = true
wave3ReviewReady             = true
wave3Approved                = false
```

## Merge/split discipline

Direct and inverse incentre-angle forms remain separate temporary prototypes because the learner's unknown and algebraic direction are materially different. Wave 3 does not decide their eventual permanent-QL merge/split status.

## Gates

```text
sourceSaturationClaimAllowed    = false
permanentQlAllocationAllowed    = false
solveModeFreezeAllowed          = false
questionStudioActivationAllowed = false
questionBankWriteAllowed        = false
testEligibilityAllowed          = false
publicPublicationAllowed        = false
```

## Next priority after Wave 3 review

1. CP005 perimeter-ratio similarity scale;
2. CP014 congruence + parallel synthesis;
3. CP006 remaining perpendicular-bisector equal-distance / centroid inverse / midpoint-converse representations;
4. remaining source-observed CP010/011 gaps;
5. only after further source remediation, perform merge/split and permanent-QL freeze review.
