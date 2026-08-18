# Geometry Gap Authority & Runtime Remediation — Wave 1 Status

**Authority:** Composite Geometry Revision 3  
**Predecessor gate:** `GEO-SOURCE-SATURATION-AUDIT-V1`  
**Lifecycle:** `DISCOVERY`  
**Baseline temporary prototypes before remediation:** `38`  
**New temporary remediation prototypes:** `4`  
**Current temporary executable prototypes:** `42`  
**Permanent QLs:** `0`  
**Frozen solve modes:** `0`  
**Question Studio / Question Bank / test / public:** locked

## Wave decision

Wave 1 remediates four high-priority source-observed Geometry gaps without claiming source saturation or allocating permanent identities.

| CP | Temporary remediation prototype | Gap target | Diagram disposition |
|---|---|---|---|
| GEO-CP-006 | `GEO-TMP-GAP-CP006-CIRCUMCENTRE-IDENTIFY-V1` | centre identification through perpendicular-bisector concurrency | `REQUIRED_STEM_DIAGRAM` |
| GEO-CP-011 | `GEO-TMP-GAP-CP011-SEMICIRCLE-ANGLE-V1` | angle in a semicircle | `REQUIRED_STEM_DIAGRAM` |
| GEO-CP-012 | `GEO-TMP-GAP-CP012-ANGLE-BETWEEN-TANGENTS-V1` | angle between two tangents from a central angle | `REQUIRED_STEM_DIAGRAM` |
| GEO-CP-012 | `GEO-TMP-GAP-CP012-TANGENT-CHORD-V1` | tangent–chord / alternate-segment angle | `REQUIRED_STEM_DIAGRAM` |

## Shared-authority additions

- triangle-centre concurrency is now a shared inference primitive rather than CP-private text logic;
- the theorem registry contains a natural learner-facing circumcentre concurrency theorem identity;
- circle inference now exposes exact helpers for angle in a semicircle, angle between tangents from the central angle and tangent–chord equality;
- angle-between-tangents is solved transparently from two radius–tangent right angles plus the quadrilateral angle sum rather than hidden behind an unexplained formula.

## Verification discipline

Every remediation prototype has:

- deterministic seed behavior;
- four unique options with misconception ownership;
- remove-one-displayed-clue minimality;
- theorem trace with natural learner explanation;
- materially independent coordinate/high-precision verification;
- explicit source-evidence IDs from the Wave-1 source audit;
- explicit Rev-3 diagram disposition;
- semantic SVG fingerprint and canonical question fingerprint;
- all product lifecycle locks retained.

## Diagram-policy remediation

The stem diagrams intentionally distinguish **semantic givens** from **hidden verifier geometry**.

- Circumcentre: midpoint and perpendicular marks are shown because they are supplied facts; no circumcircle centred at O is drawn because that would leak the answer.
- Semicircle: no right-angle mark or `90°` label is shown; the not-to-scale learner layout is deliberately perturbed away from an exact 90° visual angle while the hidden verifier uses an exact diameter/circle realization.
- Two tangents: no derived radius–tangent right-angle marks and no derived equal-tangent marks are shown; the displayed learner layout is deliberately not the verifier geometry.
- Tangent–chord: tangency and the supplied 38° alternate-segment angle are shown, but derived radius perpendicularity is not marked; learner layout is perturbed from the exact 38° target.

## Closure status

This wave **does not reduce the Source Saturation Audit V1 baseline count by fiat**. The audit remains an immutable baseline of 52 discovered gap candidates.

At executable-remediation level:

- `ANGLE_IN_SEMICIRCLE` is now represented;
- `ANGLE_BETWEEN_TANGENTS` is now represented;
- `TANGENT_CHORD_ALTERNATE_SEGMENT` is now represented;
- `CENTRE_IDENTIFICATION` is **partially remediated** by the circumcentre path; the shared centre inference also defines centroid/incentre/orthocentre concurrency, but those representations still need source-led merge/split review before the broad centre-identification gap can be closed.

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

After Wave 1 proof/review, continue with source-observed architecture gaps rather than wrappers first:

1. CP-012 common tangent between two circles;
2. CP-014 common-tangent + similarity synthesis;
3. CP-014 central/inscribed-angle + tangent synthesis;
4. CP-006 remaining centre-identification/property representations;
5. CP-005 perimeter-ratio similarity scale.
