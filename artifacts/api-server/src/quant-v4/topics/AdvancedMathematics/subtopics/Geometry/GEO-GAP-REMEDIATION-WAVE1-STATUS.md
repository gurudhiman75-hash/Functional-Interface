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
**Wave-1 diagram remediation review:** `APPROVED`  
**Approved renderer contract:** `EXAMTREE_GEOMETRY_SVG_V2`

## Wave decision

Wave 1 remediates four high-priority source-observed Geometry gaps without claiming source saturation or allocating permanent identities.

| CP | Temporary remediation prototype | Gap target | Diagram disposition | Diagram review |
|---|---|---|---|---|
| GEO-CP-006 | `GEO-TMP-GAP-CP006-CIRCUMCENTRE-IDENTIFY-V1` | centre identification through perpendicular-bisector concurrency | `REQUIRED_STEM_DIAGRAM` | APPROVED V2 |
| GEO-CP-011 | `GEO-TMP-GAP-CP011-SEMICIRCLE-ANGLE-V1` | angle in a semicircle | `REQUIRED_STEM_DIAGRAM` | APPROVED V2 |
| GEO-CP-012 | `GEO-TMP-GAP-CP012-ANGLE-BETWEEN-TANGENTS-V1` | angle between two tangents from a central angle | `REQUIRED_STEM_DIAGRAM` | APPROVED V2 |
| GEO-CP-012 | `GEO-TMP-GAP-CP012-TANGENT-CHORD-V1` | tangent–chord / alternate-segment angle | `REQUIRED_STEM_DIAGRAM` | APPROVED V2 |

## Shared-authority additions

- triangle-centre concurrency is now a shared inference primitive rather than CP-private text logic;
- the theorem registry contains a natural learner-facing circumcentre concurrency theorem identity;
- circle inference exposes exact helpers for angle in a semicircle, angle between tangents from the central angle and tangent–chord equality;
- angle-between-tangents is solved transparently from two radius–tangent right angles plus the quadrilateral angle sum rather than hidden behind an unexplained formula;
- `EXAMTREE_GEOMETRY_SVG_V2` is the approved Wave-1 renderer contract for these reviewed temporary prototypes.

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
- exact visual-topology checks for required incidence/contact/perpendicular relations;
- label-collision QA;
- required angle-arc/sign QA;
- all product lifecycle locks retained.

## Approved Diagram V2 remediation

The approved rule is now explicit:

> **Stated geometric incidence/contact/topology must be drawn faithfully. Anti-leak protection must withhold unstated semantic marks or answer values; it must never make the visible geometry false.**

The approved four diagrams satisfy this rule:

- **Circumcentre:** both perpendicular-bisector constructions pass through their actual side midpoints and visibly intersect at `O`; midpoint and right-angle marks correspond to true drawn relations; no answer-leaking circumcircle centred at `O` is drawn.
- **Semicircle:** `A`, `B` and `P` genuinely lie on the drawn circle and `AB` is a diameter; the target angle has a clear angle arc and `x` label; no `90°` value or right-angle square is supplied in the stem.
- **Two tangents:** `PA` and `PB` genuinely touch the circle at `A` and `B`; the stated `124°` central angle and target `x` both have clear angle arcs; derived radius–tangent right-angle squares and equal-tangent marks remain omitted.
- **Tangent–chord:** the tangent is rendered as a true ray through contact point `T`; `T`, `A` and `B` genuinely lie on the circle; the supplied `38°` and target `x` have clear separated angle arcs/labels; no derived right-angle square is supplied.

Point labels, angle values and target labels are placed using collision-aware V2 placement rather than the former fixed `(+4,-4)` text offset.

## Review approval record

The user reviewed the regenerated V2 HTML after requesting corrections for:

- incorrect/missing intersections;
- points not lying on or touching intended geometry;
- overlapping point/angle text;
- insufficiently clear angle signs.

After the V2 renderer/topology remediation and green retained CI, the user explicitly marked the result **Approved** on 19 August 2026.

This approval freezes the **Wave-1 diagram review result and renderer behavior for these four temporary prototypes**. It does **not** freeze permanent QL identities, solve modes, source saturation or product publication gates.

## Closure status

This wave **does not reduce the Source Saturation Audit V1 baseline count by fiat**. The audit remains an immutable baseline of 52 discovered gap candidates.

At executable-remediation level:

- `ANGLE_IN_SEMICIRCLE` is now represented;
- `ANGLE_BETWEEN_TANGENTS` is now represented;
- `TANGENT_CHORD_ALTERNATE_SEGMENT` is now represented;
- `CENTRE_IDENTIFICATION` is **partially remediated** by the circumcentre path; the shared centre inference also defines centroid/incentre/orthocentre concurrency, but those representations still need source-led merge/split review before the broad centre-identification gap can be closed.

## Gates

```text
wave1DiagramReviewApproved      = true
wave1RendererContract           = EXAMTREE_GEOMETRY_SVG_V2
sourceSaturationClaimAllowed    = false
permanentQlAllocationAllowed    = false
solveModeFreezeAllowed          = false
questionStudioActivationAllowed = false
questionBankWriteAllowed        = false
testEligibilityAllowed          = false
publicPublicationAllowed        = false
```

## Next remediation priority

Continue with source-observed architecture gaps rather than wrappers first:

1. CP-012 common tangent between two circles;
2. CP-014 common-tangent + similarity synthesis;
3. CP-014 central/inscribed-angle + tangent synthesis;
4. CP-006 remaining centre-identification/property representations;
5. CP-005 perimeter-ratio similarity scale.
