# MAL-CP-006 Wave 05 Status

## Gate

`PERMANENT_IDENTITY_ALLOCATION_APPROVED_AND_IMPLEMENTED_PENDING_EXACT_HEAD_PROOF`

## Frozen English identities

- allocation: `MAL-CP006-EN-PERMANENT-ALLOCATION-V1`
- permanent QL range: `MAL-QL-061..MAL-QL-067`
- permanent QLs: 7
- permanent solve modes: 7
- shared mathematical cores: 2
- language: English only

## Mapping

1. `MAL-QL-061` / `MAL-CP006-SM-001` — forward transfer-return final ratio
2. `MAL-QL-062` / `MAL-CP006-SM-002` — equal exchange amount for equal final concentrations
3. `MAL-QL-063` / `MAL-CP006-SM-003` — three-vessel cycle final concentration
4. `MAL-QL-064` / `MAL-CP006-SM-004` — source refill and retransfer destination ratio
5. `MAL-QL-065` / `MAL-CP006-SM-005` — round-trip cross-vessel component ratio
6. `MAL-QL-066` / `MAL-CP006-SM-006` — inverse transfer-return target ratio, including asymmetric return
7. `MAL-QL-067` / `MAL-CP006-SM-007` — changed-source linear chain remaining component

Shared cores:

- `STAGED_VESSEL_LEDGER`: QLs `061`, `063`, `064`, `065`, `066`, `067`
- `SIMULTANEOUS_EQUAL_EXCHANGE`: QL `062`

## Boundary locks

- common-final-concentration equal exchange remains held at the CP001 weighted-blend boundary;
- Wave04 longer alternating forward forms remain inside `MAL-QL-061`;
- Wave04 asymmetric inverse-return forms remain inside `MAL-QL-066`;
- alligation cross remains non-core for CP006.

## Lifecycle

```text
permanentIdentityFrozen:     true
active:                      false
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
Hindi authorized:            false
Punjabi authorized:          false
```

No merge or release activation is authorized by this status. Exact-head workflow evidence must pass before Wave05 is considered technically closed.
