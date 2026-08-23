# Geometry Gap Authority & Runtime Remediation — Wave 8 Status

**Authority:** Composite Geometry Revision 3 + Solution-Diagram Dimension Policy Addendum  
**Predecessors:** approved Waves 1–7 discovery remediation  
**Lifecycle:** `DISCOVERY`  
**Wave 8 state:** `IMPLEMENTED_REVIEW_PENDING`

Wave 8 addresses the three residual `GEO-CP-009` polygon gap families identified by Source Saturation Audit V1:

1. `GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-TO-SIDES-V1`
   - interior-angle sum → polygon side count
   - `GEO-CP-009/INTERIOR_SUM_AND_INVERSE`
   - `NO_DIAGRAM`
2. `GEO-TMP-GAP-W8-CP009-EXTERIOR-SUM-INVARIANT-V1`
   - one consistently directed exterior angle at each convex-polygon vertex → invariant total 360°
   - `GEO-CP-009/GENERAL_EXTERIOR_SUM_OR_MISSING_ANGLE`
   - `NO_DIAGRAM`
3. `GEO-TMP-GAP-W8-CP009-INTERIOR-SUM-ANGLE-DIFFERENCE-V1`
   - interior-angle sum → side count → regular exterior angle → regular interior angle → requested difference
   - `GEO-CP-009/MIXED_POLYGON_ANGLE_CHAIN_OR_CLAIM`
   - `NO_DIAGRAM`

Approved Waves 1–7 contain **63** temporary executable prototypes. Wave 8 adds **3 review candidates**, so the current temporary executable candidate count is **66**.

Permanent QLs = **0**.  
Frozen permanent solve modes = **0**.

## Exact source ownership

Wave 8 uses two secondary SSC PYQ repository records and does not claim official publisher provenance:

- **SSC CGL Tier 2, 12 Sep 2019** — the same question first requires inverse recovery of `n = 9` from a 1260° interior-angle sum and then asks for the regular polygon's interior/exterior-angle difference. This exact source owns both the inverse prototype and the mixed-chain prototype.
- **SSC CGL 2025, 18 Sep 2025 Shift 3** — directly asks for the total of one exterior angle at each polygon vertex and establishes the invariant total as 360°. This exact source owns the exterior-sum prototype.

Broader polygon PYQ patterns are not attached as owners merely because they use adjacent theorems. Wave 8 source IDs are intentionally restricted to the records that materially match the implemented learner decisions.

## Representation decision

All three Wave-8 candidates use `NO_DIAGRAM`.

Reason:
- the learner decision is completely specified by the supplied angle relation or angle sum;
- no incidence, parallelism, tangency, contact, topology or geometric placement must be inferred from a figure;
- adding a polygon sketch would be decorative and would not contribute semantic evidence.

This is consistent with Revision 3's rule that diagrams are representation contracts, not automatic illustrations.

## Executable contracts

Each prototype currently provides:

- three materially varied review stems;
- deterministic seed behavior;
- exactly four unique options;
- one correct answer;
- named, operation-specific misconception ownership for every distractor;
- natural learner explanations with no internal theorem-ID leakage;
- remove-one-displayed-clue minimality proof;
- independent definition-level verification;
- exact source-evidence IDs;
- canonical fingerprints;
- all product lifecycle locks retained.

The exterior-angle-sum prototype intentionally keeps the answer invariant at `360°` across its three review seeds while varying polygon order and wording. The invariant answer is the theorem under review rather than an editorial deficiency.

## Review boundary

Wave 8 is **not yet approved or frozen**.

No user approval is recorded for these three prototypes. They must pass the dedicated Wave-8 CI chain and review-artifact inspection before any discovery freeze record is added.

This implementation does **not** authorize:

- source-saturation or no-known-gap claims;
- permanent QL allocation;
- permanent solve-mode freeze;
- Question Studio activation;
- Question Bank writes;
- test eligibility;
- public publication;
- PR merge.

```text
wave8ImplementationComplete = true
wave8RuntimeProofPassed = false
wave8ReviewReady = false
wave8Approved = false
wave8FrozenForDiscovery = false
sourceSaturationClaimAllowed = false
permanentQlAllocationAllowed = false
solveModeFreezeAllowed = false
questionStudioActivationAllowed = false
questionBankWriteAllowed = false
testEligibilityAllowed = false
publicPublicationAllowed = false
```

## Next gate

Run the dedicated Wave-8 proof, inspect the exported nine-question review corpus, remediate any executable/editorial issue found, and only then record an approval/freeze decision.
