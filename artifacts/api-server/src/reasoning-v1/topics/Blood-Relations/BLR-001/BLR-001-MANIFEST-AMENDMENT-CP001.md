# BLR-001 Manifest Amendment — BLR-CP-001

Status: **authoritative permanent identity allocation for BLR-CP-001 after final English discovery freeze**.

This amendment promotes the seven solve authorities frozen by `BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1`. It allocates stable identities only; every QL remains English review-only and unavailable to production surfaces.

## Permanent allocation

| QL ID | Solve authority | Included instance variation |
|---|---|---|
| `BLR-QL-001` | resolve a named person's relation to another named person | direct/reverse query direction; one-, two- and three-edge paths; linear/branching topology; broad kinship and great-generation outputs |
| `BLR-QL-002` | identify the unique person having a requested relation | relation value, reference person, family topology and difficulty |
| `BLR-QL-003` | identify the unique male or female using relation evidence | target gender and direct/spouse-derived evidence |
| `BLR-QL-004` | identify an ordered person pair having a requested relation | pair order, relation value and family topology |
| `BLR-QL-005` | select the relation claim matching the requested truth value | true/false target polarity, relation value and claim direction |
| `BLR-QL-006` | compare two people's generation positions | generation delta `-2..+2`, path topology and reference direction |
| `BLR-QL-007` | resolve an exact maternal or paternal relation | maternal/paternal side and grandfather, grandmother, uncle or aunt output |

## Identity effect

```text
Stable BLR-001 range after CP-001: BLR-QL-001..007
BLR-CP-001 permanent QLs:       7
Next available BLR-001 ID:       BLR-QL-008
Later checkpoint counts:         open
Final chapter total:             open
```

The seven identities come from solve authority, not from the eleven exploratory prototypes. Direct versus reverse, path length, branching topology, claim polarity, target gender, lineage side, names, clue order, renderer and difficulty remain instance properties.

The four source-gap outputs—great-grandfather, great-grandmother, great-grandson and great-granddaughter—belong to `BLR-QL-001`; they do not create additional identities.

## Release boundary

These identities are permanent after merge but remain locked:

- English review-only: true;
- Question Studio visibility: false;
- Question Bank write path: disabled;
- mock-test eligibility: false;
- public publishability: false;
- Hindi and Punjabi: not started.

A later editorial/localisation release may expand surface diversity without changing these identities. A new QL requires new source evidence and a new discovery-freeze version proving a materially distinct student solve authority.
