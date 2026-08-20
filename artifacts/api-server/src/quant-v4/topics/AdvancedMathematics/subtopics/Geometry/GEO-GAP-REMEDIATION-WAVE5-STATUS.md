# Geometry Gap Authority & Runtime Remediation — Wave 5 Status

**Authority:** Composite Geometry Revision 3 + Solution-Diagram Dimension Policy Addendum  
**Predecessors:** approved Waves 1–4 discovery remediation  
**Lifecycle:** `DISCOVERY`  
**Wave 5 state:** `IMPLEMENTED_AWAITING_CI_AFTER_SOLUTION_DIAGRAM_POLICY`

Wave 5 addresses `GEO-CP-014/CONGRUENCE_PLUS_PARALLEL_SYNTHESIS` with two temporary prototypes:

1. `GEO-TMP-GAP-W5-CP014-PARALLELOGRAM-EXTENSION-MIDPOINT-V1`
   - parallel-line angle transfer → ASA congruence → CPCT midpoint consequence
   - `REQUIRED_BOTH`
2. `GEO-TMP-GAP-W5-CP014-EQUAL-PARALLEL-DIAGONAL-CPCT-V1`
   - alternate interior angle → SAS congruence → CPCT corresponding-side consequence
   - `REQUIRED_BOTH`

Current temporary executable count: **53**. Permanent QLs: **0**. Frozen permanent solve modes: **0**.

## Solution-diagram authority

New Rev-3 addendum:
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

## Wave-5 application

The previously review-ready stem-only representation is superseded for review by this richer `REQUIRED_BOTH` candidate.

Parallelogram-extension solution figure:
- preserves M,N,O,P,Q,R topology;
- shows the solve-relevant whole dimension `ON`;
- after congruence/CPCT, marks `OR = RN` and displays the solved halves (`OR = RN = answer`);
- shows derived parallelogram parallelism needed for the explanation;
- keeps all derived answer-bearing dimensions absent from the stem.

Equal-parallel-diagonal solution figure:
- preserves A,B,C,D and diagonal AC;
- keeps `AB ∥ CD` visible;
- restores `AB = CD` as a readable solution annotation rather than stacking an equal-length tick on the parallel mark;
- visually marks the alternate-angle pair used for SAS;
- displays the given `AD` dimension and the CPCT-derived `BC` target dimension;
- keeps `BC` absent from the stem.

## Prior corrected stem-only evidence

Prior CI passed before this policy expansion:
- run `32324466545`
- job `96292787939`
- proof head `48ccf2a35b2cb0956b2c43fce9c15e61b329ed40`
- artifact `9391000694`
- digest `sha256:d672c0432a84c7770ea2222be77ef546ca1ffac20f0c4ee78d3355739cf6fecd`

That artifact is now **superseded for Wave-5 review** because the representation contract has materially changed from `REQUIRED_STEM_DIAGRAM` to `REQUIRED_BOTH`.

```text
wave5ImplementationComplete = true
wave5RuntimeProofPassedForCurrentRepresentation = false
wave5ReviewReady = false
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

Next gate: full retained source audit + Geometry Phases 0–5 + approved Waves 1–4 + Wave-5 REQUIRED_BOTH proof + six-question stem/solution visual review export.
