# Geometry Gap Authority & Runtime Remediation — Wave 2 Status

**Authority:** Composite Geometry Revision 3  
**Renderer contract:** `EXAMTREE_GEOMETRY_SVG_V2`  
**Predecessor:** approved Wave-1 diagram-quality remediation  
**Lifecycle:** `DISCOVERY`  
**Review decision:** `APPROVED` on 19 August 2026  
**Temporary review state:** `FROZEN`

## Wave decision

Wave 2 adds three temporary source-observed Geometry prototypes without allocating permanent QLs or claiming source saturation.

| CP | Temporary prototype | Source gap | Diagram disposition |
|---|---|---|---|
| GEO-CP-012 | `GEO-TMP-GAP-W2-CP012-DIRECT-COMMON-TANGENT-V1` | `COMMON_TANGENT_TWO_CIRCLES` | `REQUIRED_STEM_DIAGRAM` |
| GEO-CP-014 | `GEO-TMP-GAP-W2-CP014-COMMON-TANGENT-SIMILARITY-V1` | `COMMON_TANGENT_PLUS_SIMILARITY_SYNTHESIS` | `REQUIRED_STEM_DIAGRAM` |
| GEO-CP-014 | `GEO-TMP-GAP-W2-CP014-TANGENT-CENTRAL-INSCRIBED-V1` | `CENTRAL_OR_INSCRIBED_PLUS_TANGENT_SYNTHESIS` | `REQUIRED_STEM_DIAGRAM` |

Baseline executable discovery remains 38 temporary prototypes. Wave 1 added 4. Wave 2 adds 3, so the current temporary executable count is **45**.

Permanent QLs = **0**.  
Frozen solve modes = **0**.

## Approval record

The Wave-2 nine-question HTML review was explicitly approved by the user on **19 August 2026** after the final visual self-review and label-anchor correction.

This approval freezes the **reviewed temporary Wave-2 prototype set and its Renderer-V2 representation contract** for continued discovery work:

- `GEO-TMP-GAP-W2-CP012-DIRECT-COMMON-TANGENT-V1`
- `GEO-TMP-GAP-W2-CP014-COMMON-TANGENT-SIMILARITY-V1`
- `GEO-TMP-GAP-W2-CP014-TANGENT-CENTRAL-INSCRIBED-V1`

Approved review evidence:

- CI run: `32212235659`
- CI job: `95947038971`
- runtime head: `4231c285fbeeab9221576e852baa3c18d9f7703c`
- review artifact id: `9351143154`
- artifact digest: `sha256:461358fc8328dc45b0360738e19e4c0cf6b7997bb6501f7b1f94b2fd41691f41`

The approval does **not** freeze permanent QL identities, solve modes, source saturation, package publication, or product gates.

## Source basis

Wave 2 uses source-specific evidence in addition to the immutable Source Saturation Audit V1 baseline:

1. `SRC-OLIVEBOARD-CGL-DIRECT-COMMON-TANGENT-PYQ-2024` — SSC CGL Tier I, 10 Sep 2024: direct common tangent length for two externally touching circles.
2. `SRC-TESTBOOK-CGL-COMMON-TANGENT-SIMILARITY-PYQ-2018` — SSC CGL Tier 2 Quant, 19 Feb 2018: common tangents plus similar right triangles to recover the smaller radius.
3. `SRC-TESTBOOK-CGL-TANGENT-INSCRIBED-SYNTHESIS-PYQ-2025` — SSC CGL, 25 Sep 2025: angle between tangents → central angle → angle subtended at the circumference.

These observations support the current split: direct common-tangent measurement is a CP012 learner decision, while the similarity and central/inscribed chains are materially multi-theorem CP014 syntheses.

## Shared exact additions

`common-tangent-inference.ts` provides:

- externally tangent centre distance = sum of radii;
- direct common-tangent squared length;
- exact direct common-tangent length when rational;
- transverse common-tangent squared length;
- exact smaller-radius recovery for the external-homothety/common-tangent similarity configuration.

It reuses the canonical exact rational-square-root helper already owned by the circle engine.

The Wave-2 runtime does not use floating-point arithmetic as the primary solve authority. Floating/high-precision coordinate geometry is retained as an independent verifier.

## Representation quality

All three prototypes inherit the approved V2 diagram contract:

- stated incidence/tangency/contact geometry is visually faithful;
- common tangent contact points genuinely lie on the corresponding circles;
- tangency lines are actually perpendicular to radius directions in verifier/layout geometry;
- externally touching circles genuinely meet at their contact point;
- required target/given angle regions carry visible angle arcs and labels;
- derived right-angle marks remain withheld unless supplied as givens;
- point and angle label placement is collision checked;
- `notToScale = true` remains mandatory.

The three review seeds for every Wave-2 prototype intentionally vary both wording and numeric target. This prevents a review corpus made of three identical stems with merely shuffled options.

## CP014 synthesis discipline

Both new CP014 prototypes require at least two distinct non-generic theorem families:

- common tangent + similarity: tangent geometry + similarity + right-triangle recovery;
- tangent/central/inscribed: tangent geometry + quadrilateral angle sum + circle central/inscribed relation.

They must not be merged into one QL merely because both contain a tangent.

## Source-audit accounting

The Source Saturation Audit V1 gap count remains an immutable discovery baseline. Wave 2 records executable remediation separately and does **not** silently decrement the baseline count.

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

## Next remediation priority

1. CP006 remaining centre-identification/property representations;
2. CP005 perimeter-ratio similarity scale;
3. CP014 congruence + parallel synthesis;
4. remaining source-observed CP011/CP010 gaps;
5. only after further source remediation, perform merge/split and permanent-QL freeze review.
