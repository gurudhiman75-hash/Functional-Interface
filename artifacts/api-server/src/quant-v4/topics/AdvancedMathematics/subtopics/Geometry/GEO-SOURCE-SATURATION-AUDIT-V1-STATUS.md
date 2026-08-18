# Geometry Source Saturation Audit V1 — Status

**Authority:** Composite Geometry Revision 3  
**Lifecycle:** `DISCOVERY`  
**Current temporary prototypes:** `38`  
**Permanent QLs:** `0`  
**Frozen solve modes:** `0`  
**Question Studio / Question Bank / test / public gates:** locked

## Decision

Wave 1 of the external source audit is complete **with material gaps**.

Geometry is **not source-saturated** and is **not ready for permanent QL allocation or solve-mode freeze**.

The audit normalizes the existing 38 executable prototypes into **30 provisional learner archetypes** and records **52 explicit gap candidates** across GEO-CP-001..014. Every current prototype is mapped exactly once. Diagram disposition is now recorded at learner-archetype level, but remains provisional until freeze review under the Revision-3 diagram policy.

## Exam-scope result

| Exam scope | Result |
|---|---|
| SSC | Direct syllabus + CGL/CHSL PYQ evidence present; saturation **not closed** |
| Banking | Geometry eligibility **not established**; do not infer it from generic Quantitative Aptitude |
| Punjab state recruitment | Dedicated recruitment/PYQ saturation **not established** |
| Punjab school curriculum | Useful for theorem/terminology baseline only; not recruitment-exam saturation evidence |

SSC syllabus references explicitly include triangle centres, congruence and similarity, circles/chords/tangents, chord-angle relations and common tangents. The PYQ evidence sampled in this wave also exposes families not represented by the current 38 prototypes, including tangent-chord/alternate-segment reasoning, angle between two tangents, semicircle/cyclic chains, centre identification/properties, perimeter-ratio similarity and common-tangent synthesis.

No source question wording is copied into Examtree authority; only learner-task/topology evidence is retained.

## Checkpoint summary

| CP | Current anchors | Normalized archetypes | Open gaps | Primary audit pressure |
|---|---:|---:|---:|---|
| GEO-CP-001 | 2 | 2 | 3 | around-point, inverse-x, complementary/supplementary |
| GEO-CP-002 | 2 | 1 | 3 | alternate angles, converse parallelism, multi-transversal chains |
| GEO-CP-003 | 4 | 3 | 4 | converse isosceles, ordering, integer inequality, classification |
| GEO-CP-004 | 2 | 2 | 4 | wider congruence criteria, insufficiency, CPCT consequence |
| GEO-CP-005 | 3 | 3 | 5 | SAS/SSS, BPT converse, perimeter/area ratio, nested similarity |
| GEO-CP-006 | 3 | 3 | 5 | centre identification/properties, perpendicular bisector, inverse forms |
| GEO-CP-007 | 2 | 2 | 2 | right-triangle circumcentre and reverse/claim forms |
| GEO-CP-008 | 3 | 3 | 5 | rectangle/square/kite/trapezium and converse classification |
| GEO-CP-009 | 4 | 2 | 3 | interior sum, general exterior sum, mixed polygon chains |
| GEO-CP-010 | 2 | 2 | 3 | equal chords/central angles, chord-distance converse, inverse layout |
| GEO-CP-011 | 2 | 2 | 5 | semicircle, same segment, cyclic exterior/converse, mixed chain |
| GEO-CP-012 | 2 | 2 | 4 | angle between tangents, tangent-chord, common tangents, incircle representation |
| GEO-CP-013 | 3 | 1 | 2 | reverse/unknown-position and recognition wrappers |
| GEO-CP-014 | 4 | 4 | 4 | tangent-circle synthesis, common-tangent similarity, congruence+parallel, DS/statement wrappers |
| **Total** | **38** | **30** | **52** | |

## Merge/split findings worth preserving

- CP002 corresponding and co-interior direct transfers are merge candidates under a relation-kind parameter; converse parallelism remains a different learner task.
- CP003 interior/exterior angle completion may share one parameterized authority; triangle inequality remains separate.
- CP004 valid congruence criteria can parameterize criterion selection, but criterion selection and CPCT consequence remain separate.
- CP005 AA/SAS/SSS are evidence modes rather than automatic permanent QL splits; BPT direct and converse remain directionally distinct.
- CP009 regular interior/exterior angle and side-count inversions are strong merge candidates; diagonal counting remains separate.
- CP013 intersecting-chord, secant-secant and tangent-secant contracts implement one power invariant and are a merge candidate under topology, subject to distractor and diagram-contract comparison.
- CP014 is a synthesis container only. Materially different theorem graphs must not be collapsed into one permanent QL simply because they are all mixed Geometry.

## Diagram disposition audit

Revision 3 is now operational in saturation review rather than merely documented.

Every normalized learner archetype has one provisional disposition chosen from:

- `NO_DIAGRAM`
- `OPTIONAL_STEM_DIAGRAM`
- `REQUIRED_STEM_DIAGRAM`
- `REQUIRED_SOLUTION_DIAGRAM`
- `REQUIRED_BOTH`

The key current decisions are:

- parallel/transversal, chord, tangent, cyclic, BPT, quadrilateral-property and mixed-synthesis topology generally require a stem diagram;
- pure triangle inequality, Pythagorean-converse classification, quadrilateral angle sum and polygon arithmetic are currently `NO_DIAGRAM` candidates;
- several triangle/congruence/similarity families remain `OPTIONAL_STEM_DIAGRAM` until source representation frequency and semantic-necessity review are complete.

These are **not frozen production decisions**. Every surviving family must still pass semantic parity, visual anti-leak, mobile, accessibility and Hindi/Punjabi review before permanent allocation.

## Ownership findings

- Coordinate Geometry remains excluded from GEO-001/GEO-002.
- Mensuration owns requested area/perimeter/surface/volume computation unless the geometry theorem itself is the learner decision. Similarity area-ratio evidence therefore requires an explicit ownership decision before implementation.
- Trigonometry owns trig-ratio solves and heights/distances.
- A shape appearing in a question does not by itself make the question Geometry-owned.

## Gate result

```text
externalSourceAuditWave1       = COMPLETED_WITH_GAPS
archetypeMergeSplitAudit       = COMPLETED_PROVISIONAL
diagramDispositionAudit        = PROVISIONAL_COMPLETE_FREEZE_REVIEW_REQUIRED
sourceSaturationClaimAllowed   = false
permanentQlAllocationAllowed   = false
solveModeFreezeAllowed         = false
questionStudioActivationAllowed= false
questionBankWriteAllowed       = false
testEligibilityAllowed         = false
publicPublicationAllowed       = false
```

## Next gate

`GEO-GAP-AUTHORITY-AND-RUNTIME-REMEDIATION-V1`

The next implementation wave should **not** attempt all 52 gaps at once. It should prioritize source-observed architecture gaps first, especially GEO-CP-006 and GEO-CP-010..012/014, then re-audit merge/split behavior before broadening lower-priority representation gaps.
