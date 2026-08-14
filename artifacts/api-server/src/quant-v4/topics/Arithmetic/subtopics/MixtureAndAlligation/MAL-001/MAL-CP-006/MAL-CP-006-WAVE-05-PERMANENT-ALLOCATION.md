# MAL-CP-006 Wave 05 — Permanent English QL Allocation

## Allocation decision

The seven product-approved CP006 learner contracts are now assigned permanent English learner identities. This is an **identity freeze only**. It does not activate Question Studio, Question Bank writes, test/mock delivery or public publication.

```text
allocation ID:               MAL-CP006-EN-PERMANENT-ALLOCATION-V1
permanent QL range:          MAL-QL-061..MAL-QL-067
permanent QLs:               7
permanent task solve modes:  7
shared mathematical cores:   2
language:                    English only
permanent identity:          frozen
Question Studio permanent:   disabled
Question Bank:               disabled
test/mock delivery:          disabled
public publication:          disabled
Hindi/Punjabi:               not authorized
```

`MAL-QL-061` begins immediately after the released CP005 range ending at `MAL-QL-060`. A final allocation-time collision check found no existing `MAL-QL-061`, `MAL-QL-067` or `MAL-CP006-SM-001` on `New-main` before this freeze.

## Permanent allocation

| QL | Solve mode | Shared mathematical core | Permanent learner contract |
|---|---|---|---|
| `MAL-QL-061` | `MAL-CP006-SM-001` | `STAGED_VESSEL_LEDGER` | Forward transfer-return to a final within-vessel component ratio, including longer alternating transfer-return forms |
| `MAL-QL-062` | `MAL-CP006-SM-002` | `SIMULTANEOUS_EQUAL_EXCHANGE` | Equal exchanged quantity required to make the final concentrations of two vessels equal |
| `MAL-QL-063` | `MAL-CP006-SM-003` | `STAGED_VESSEL_LEDGER` | Three-vessel current-source cycle to a requested final concentration |
| `MAL-QL-064` | `MAL-CP006-SM-004` | `STAGED_VESSEL_LEDGER` | Source transfer, pure refill of that source, retransfer and final destination ratio |
| `MAL-QL-065` | `MAL-CP006-SM-005` | `STAGED_VESSEL_LEDGER` | Round-trip transfer followed by a cross-vessel component-quantity ratio |
| `MAL-QL-066` | `MAL-CP006-SM-006` | `STAGED_VESSEL_LEDGER` | Inverse transfer-return: infer the unknown transfer/return quantity from a target final ratio, including equal and asymmetric return forms |
| `MAL-QL-067` | `MAL-CP006-SM-007` | `STAGED_VESSEL_LEDGER` | Changed-source A→B→C chain: infer the hidden scale from the downstream sample ratio and then the component remaining in the source vessel |

## Why seven QLs but only two mathematical cores

A permanent QL represents a stable learner-facing given/unknown contract, not a separate numerical engine. Six CP006 identities require the same fundamental staged-vessel ledger: after every transfer, the source and destination states change, and a later sample must use the source vessel's composition **at that moment**.

The equal-exchange identity is mathematically different enough to keep its own shared core because both vessels exchange the same quantity simultaneously and the target is equality of final concentrations.

Therefore:

- `STAGED_VESSEL_LEDGER`: 6 QLs — `061`, `063`, `064`, `065`, `066`, `067`;
- `SIMULTANEOUS_EQUAL_EXCHANGE`: 1 QL — `062`.

Shared machinery does not merge QLs whose unknown variable, requested answer, decisive state transition and learner reasoning direction differ.

## Wave04 generalisations remain inside existing QLs

Wave04 deliberately closed two source-backed gaps without creating new learner identities:

- asymmetric inverse return remains inside `MAL-QL-066`;
- the longer A→B → current B→A → current A→B forward chain remains inside `MAL-QL-061`.

The permanent-allocation audit regenerates both Wave04 variants and rejects any mapping that would split them into new QLs.

## Source and learner authority

The frozen identities are based on the approved CP006 learner authorities developed in Waves 01–04:

- Wave01 final learner authority covers QLs `061..065` except the later inverse/chain additions;
- Wave02 V4 covers the inverse and changed-source chain identities (`066`, `067`);
- Wave04 V2 extends `061` and `066` within those same identities;
- Wave03 merge/split analysis established seven retained identities, zero merges and zero splits.

Direct/supporting source witnesses include CAT, SSC CGL, IBPS RRB and bank-mains transfer/equalisation patterns already recorded in the CP006 discovery evidence.

## Ownership boundaries

Permanent allocation does not absorb neighboring families:

- a one-time weighted combination that can be solved without changing-vessel state tracking remains `MAL-CP-001`;
- the held common-final-concentration equal-exchange projection remains at the CP001 weighted-blend boundary;
- one-vessel repeated replacement remains `MAL-CP-003`;
- one-vessel dilution/strengthening or conserved-solute transformation remains `MAL-CP-004` unless distinct-vessel bookkeeping is essential;
- ordinary cross-alligation is not a CP006 core solve mode.

A useful ownership rule remains: if the whole question can be solved by ordinary cross-alligation without tracking how vessel composition changes after a transfer, it should not be assigned to CP006.

## Allocation proof policy

The dedicated Wave05 audit proves:

- exact seven-entry approved prototype coverage;
- contiguous `MAL-QL-061..067` allocation;
- unique `MAL-CP006-SM-001..007` solve modes;
- the held CP001-boundary identity is absent;
- shared-core counts are exactly 6 + 1;
- approved Wave01, Wave02 V4 and Wave04 learner authorities still generate valid questions;
- Wave04 asymmetric inverse and longer forward forms map to `066` and `061` respectively;
- review generators remain unmodified and unactivated;
- permanent identities are frozen while every delivery lifecycle flag remains off;
- language remains English only and Hindi/Punjabi remain unauthorized.

Exact workflow-run evidence is recorded on PR #748.

## Lifecycle boundary

This Wave05 state is permanent identity allocation, **not release activation**.

All seven permanent identities remain:

```text
permanentIdentityFrozen:     true
active:                      false
publiclyPublishable:         false
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
language:                    en
Hindi authorized:            false
Punjabi authorized:          false
```

No Question Studio adapter/registry entry, Question Bank write route, test/mock eligibility, public release or localization is authorized by this allocation. Those require a later explicit release/activation gate.
