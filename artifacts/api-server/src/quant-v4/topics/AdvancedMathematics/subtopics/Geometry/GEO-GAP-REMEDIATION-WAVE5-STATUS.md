# Geometry Gap Authority & Runtime Remediation — Wave 5 Status

**Authority:** Composite Geometry Revision 3 + Solution-Diagram Dimension Policy Addendum  
**Predecessors:** approved Waves 1–4 discovery remediation  
**Lifecycle:** `DISCOVERY`  
**Wave 5 state:** `REVIEW_READY_CANDIDATE`

Wave 5 addresses `GEO-CP-014/CONGRUENCE_PLUS_PARALLEL_SYNTHESIS` with two temporary prototypes:

1. `GEO-TMP-GAP-W5-CP014-PARALLELOGRAM-EXTENSION-MIDPOINT-V1`
   - parallel-line angle transfer → ASA congruence → CPCT midpoint consequence
   - `REQUIRED_BOTH`
2. `GEO-TMP-GAP-W5-CP014-EQUAL-PARALLEL-DIAGONAL-CPCT-V1`
   - alternate interior angle → SAS congruence → CPCT corresponding-side consequence
   - `REQUIRED_BOTH`

Current temporary executable count: **53**. Permanent QLs: **0**. Frozen permanent solve modes: **0**.

## Solution-diagram authority

Active Rev-3 addendum:
`design-authority-rev3/solution-diagram-dimension-policy.md`

SHA-256:
`be0d398452b934b98adeaea0319722b74f1046ea810da612ab080d8c26011dcb`

The original Rev-3 diagram-policy amendment remains unchanged/hash-locked. The addendum supplements solution-diagram disclosure only and does not weaken stem anti-leak.

Core contract:
- stem diagram = minimum semantic evidence needed to solve;
- solution diagram = teaching projection;
- metric solution diagrams normally show solve-relevant given dimensions, key derived dimensions, and the solved target after derivation;
- stem and solution semantic fingerprints are recorded separately;
- both figures require Renderer-V2 zero-collision proof and human visual QA.

## Wave-5 REQUIRED_BOTH application

Parallelogram-extension solution figure:
- preserves M,N,O,P,Q,R topology;
- shows solve-relevant `ON` dimension;
- after congruence/CPCT, marks `OR = RN` and displays the solved halves (`OR = RN = answer`);
- shows the derived parallelogram parallel relation used in the teaching explanation;
- keeps all derived answer-bearing dimensions absent from the stem.

Equal-parallel-diagonal solution figure:
- preserves A,B,C,D and diagonal AC;
- keeps `AB ∥ CD` visible;
- restores `AB = CD` as a readable solution annotation rather than stacking an equal-length tick on the parallel mark;
- visually marks the alternate-angle pair used for SAS;
- displays the given `AD` dimension and the CPCT-derived `BC` target dimension;
- keeps `BC` absent from the stem.

## REQUIRED_BOTH QA history

The first REQUIRED_BOTH run correctly failed because the new `ON` dimension label collided with point O's label region. The zero-collision rule was retained; the dimension annotation was moved to clear whitespace and the full chain was rerun.

### Final REQUIRED_BOTH CI — PASS

`Validate Geometry Gap Remediation Wave 5`

- run `32347922917`
- job `96360537130`
- proof head `fd362587849ee458fa2ba01064fa191a1169d34d`
- API build: PASS
- retained Geometry Source Saturation Audit V1: PASS
- retained Geometry Phases 0–5: PASS
- retained approved Waves 1–4: PASS
- Wave 5 REQUIRED_BOTH proof: PASS
- stem Renderer-V2 collision QA: PASS
- solution Renderer-V2 collision QA: PASS
- solution-dimension coverage regressions: PASS
- forbidden stem-leak regressions: PASS
- review export/upload: PASS

Final REQUIRED_BOTH review artifact:
- id `9398730665`
- digest `sha256:fc686a72dede646c47b2d65226b4840d93596ff331644881385dc2a49773da54`
- 2 prototypes × 3 seeds = **6 questions / 12 runtime figures**

Artifacts `9390786157` and `9391000694` are superseded for Wave-5 review.

Human visual review of all 12 runtime figures: **PASS** for topology, point/label clearance, dimension readability, stem/solution disclosure separation, semantic-mark separation, anti-leak, and exam-standard readability.

```text
wave5ImplementationComplete = true
wave5RuntimeProofPassedForCurrentRepresentation = true
wave5ReviewReady = true
wave5Approved = false
solutionDiagramDimensionPolicyActive = true
sourceSaturationClaimAllowed = false
permanentQlAllocationAllowed = false
solveModeFreezeAllowed = false
questionStudioActivationAllowed = false
questionBankWriteAllowed = false
testEligibilityAllowed = false
publicPublicationAllowed = false
```

Wave 5 is review-ready only. Explicit user approval is required before discovery freeze.
