# BLR-001 Manifest Amendment — CP-005

Status: **permanent English review identity allocation approved; delivery remains disabled**.

Freeze version: `BLR_CP005_ENGLISH_DISCOVERY_FREEZE_V1`  
Runtime version: `blr-cp005-permanent-runtime-v1`  
Owner directive: `APPROVED_CONTINUE`

## Sequential allocation

The previously frozen range ends at `BLR-QL-017`. CP-005 receives the next eight identities:

```text
BLR-QL-018  RESOLVE_INVARIANT_RELATION
BLR-QL-019  RESOLVE_RELATION_UNCERTAINTY
BLR-QL-020  SELECT_CLAIM_BY_MODEL_STATUS
BLR-QL-021  IDENTIFY_PERSON_BY_MODEL_STATUS
BLR-QL-022  RESOLVE_PERSON_IDENTITY_UNCERTAINTY
BLR-QL-023  DETERMINE_COUNT_BOUND
BLR-QL-024  SELECT_COUNT_BY_MODEL_STATUS
BLR-QL-025  RESOLVE_COUNT_DETERMINACY
```

Next available chapter identity: `BLR-QL-026`.

## Identity meaning

- `BLR-QL-018` answers one exact or broad relation invariant across all valid models.
- `BLR-QL-019` answers a formal relation set or indeterminate result when exact outcomes vary.
- `BLR-QL-020` selects a relation claim by definite, possible or impossible status.
- `BLR-QL-021` selects one named person by definite, possible or impossible role status.
- `BLR-QL-022` answers a formal person set or indeterminate identity.
- `BLR-QL-023` returns the minimum or maximum of the attainable count set.
- `BLR-QL-024` selects a possible or impossible count.
- `BLR-QL-025` returns an invariant exact count or an indeterminate result when counts differ.

Names, family wording, pointer/shared-passage presentation, model count, open variable, relation vocabulary, requested truth status, count filter, minimum/maximum direction, option order and difficulty remain instance properties.

## Frozen proof

```text
English review questions                184
shared model-space groups                80
source prototypes                        23
permanent authorities                     8
complete family models enumerated       432
unique learner-item signatures      184/184
```

Every answer is independently recomputed after reconstructing each model from exported family-tree nodes and edges.

## Immutability

These QL IDs must not be renumbered or reused by CP-006 or CP-007. Future source-backed additions inside CP-005 must receive later unused BLR identities and an explicit manifest amendment; they must not mutate the semantic contract of `BLR-QL-018..025`.

## Delivery lock

```text
Question Studio             disabled
Question Bank               disabled
mock-test eligibility       disabled
Hindi/Punjabi               not started
public publication          disabled
production staging          disabled
merge                       not authorised
```
