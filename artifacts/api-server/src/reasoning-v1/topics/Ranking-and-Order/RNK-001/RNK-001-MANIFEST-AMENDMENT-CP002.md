# RNK-001 Manifest Amendment — CP-002

Amendment version: `RNK_001_MANIFEST_AMENDMENT_CP002_V1`

## Permanent identity allocation

```text
RNK-QL-010  PEOPLE_BETWEEN_NORMALIZED_POSITIONS
RNK-QL-011  POSITION_GAP_NORMALIZED_POSITIONS
RNK-QL-012  TARGET_RANK_FROM_REFERENCE_AND_SEPARATION
RNK-QL-013  COMPARE_NORMALIZED_POSITIONS
RNK-QL-014  TOTAL_FROM_MIXED_ENDS_KNOWN_ORDER
RNK-QL-015  EXTREME_TOTAL_UNKNOWN_ORDER
RNK-QL-016  EXACT_TOTAL_OR_INDETERMINATE
RNK-QL-017  PROPOSED_TOTAL_ORDER_STATUS
```

Previous frozen range: `RNK-QL-001..009` from CP-001.  
New cumulative frozen range: `RNK-QL-001..017`.  
Next available RNK-001 identity: `RNK-QL-018`.

## Checkpoint ownership

- `RNK-CP-001` owns one-person rank arithmetic and exact-middle reconstruction.
- `RNK-CP-002` owns relationships between two distinct positions where neither person moves or swaps.
- `RNK-CP-003` retains all movement, overtaking, insertion/removal and interchange contracts.

## Identity rules

The following do not create additional QLs:

- same-end versus mixed-end evidence after normalization;
- start/end, top/bottom, left/right or front/back renderer changes;
- first-person versus second-person role reversal;
- direct offset versus people-between-plus-one representation for target-rank recovery;
- higher/lower/nearer wording for normalized comparison;
- minimum versus maximum as an extremum parameter;
- yes/no possibility as a projection of proposed-total order status.

## Lifecycle

All eight identities are English review-only and remain unavailable to product delivery:

```text
questionStudioDiscoverable: false
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
Hindi/Punjabi:              not started
```
