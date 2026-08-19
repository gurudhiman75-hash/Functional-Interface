# Geometry Gap Authority & Runtime Remediation — Wave 3 Status

**Authority:** Composite Geometry Revision 3  
**Renderer contract:** `EXAMTREE_GEOMETRY_SVG_V2`  
**Predecessors:** approved Wave 1 and approved Wave 2 discovery remediation  
**Lifecycle:** `DISCOVERY`

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
Current temporary executable count after Wave 3 implementation = **49**.

Permanent QLs = **0**.  
Frozen solve modes = **0**.

## Source basis

1. `SRC-TESTBOOK-CGL-INCENTRE-IDENTIFICATION-PYQ-2017` — SSC CGL, 16 Aug 2017: internal angle-bisector concurrency identifies the incentre.
2. `SRC-TESTBOOK-CPO-RIGHT-TRIANGLE-ORTHOCENTRE-PYQ-2025` — SSC CPO, 12 Dec 2025: the orthocentre of a right triangle lies at the right-angled vertex.
3. `SRC-TESTBOOK-CGL-INCENTRE-ANGLE-DIRECT-PYQ-2021` — SSC CGL 2021 Tier I, held 20 Apr 2022: given ∠A, find ∠BIC for incentre I.
4. `SRC-TESTBOOK-CHSL-INCENTRE-ANGLE-INVERSE-PYQ-2018` — SSC CHSL, 24 Mar 2018: given ∠BIC, recover ∠BAC.

SATHEE's current SSC Geometry guide independently lists centroid, circumcentre, incentre and orthocentre as core triangle-centre coverage. Source saturation is still not claimed.

## Shared exact additions

`triangle-centre-inference.ts` now supports:

- concurrency → centre identification for medians, angle bisectors, perpendicular bisectors and altitudes;
- exact incentre opposite-angle recovery: vertex angle → `90° + half the vertex angle`;
- exact inverse recovery: incentre opposite angle → vertex angle;
- right-triangle orthocentre location at the right-angled vertex.

New theorem-registry entries keep learner-facing names natural and classify all Wave-3 centre rules under `TRIANGLE_CENTRES`.

## Representation quality

All four prototypes inherit the approved Renderer-V2 contract:

- stated angle-bisector concurrency is visually faithful;
- the right-triangle stem visibly shows the supplied right-angle mark;
- direct and inverse incentre-angle diagrams show the supplied angle and the target angle with explicit angle arcs;
- point and angle labels are collision checked by the runtime validator when CI executes;
- diagrams use independent high-precision geometry verification;
- `notToScale = true` remains mandatory;
- internal theorem IDs never appear in learner explanations.

An independent geometry/self-review pass confirmed the intended layouts are topologically correct. During that pass a distractor collision in one incentre-angle seed was found and fixed before review handoff.

## CI execution state

A dedicated workflow exists: `Validate Geometry Gap Remediation Wave 3`.

Current GitHub Actions runs on the implementation head terminate before any workflow step executes. The Wave-3 run therefore provides **no code-test evidence** yet and must not be counted as a failed Wave-3 proof. The same pre-step termination affected unrelated workflows on the same head.

Until an Actions run actually executes the workflow steps:

```text
wave3ImplementationComplete = true
wave3RuntimeProofPassed      = false
wave3ReviewReady             = false
wave3Approved                = false
```

No CI result will be fabricated or inferred from the independent self-review.

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
