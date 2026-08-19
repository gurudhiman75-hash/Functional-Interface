# NUM-CP-008 Permanent Allocation and English Freeze

## Final authority decision

The owner explicitly approved the final source-saturated count of **19 permanent authorities** from **26 discovery prototypes**.

Permanent identities are allocated contiguously as:

- first: `NUM-QL-166`
- last: `NUM-QL-184`
- next free Number System identity: `NUM-QL-185`

The approved merge/split is the exact 26→19 authority proposal from the final source-saturation audit. Six merge groups are preserved and all protected non-merges remain intact.

## English permanent runtime

The permanent English runtime is an adapter over the final reviewed Wave 01–04 generators. It does not fork the underlying mathematics. Each permanent QL selects only from the discovery prototypes approved for that authority; merged authorities rotate deterministically through their approved source modes by seed.

English lifecycle status is now:

- maturity: `PERMANENT_AUTHORITY`
- review status: `ENGLISH_FROZEN`
- permanent identities allocated: true
- English runtime frozen: true

Downstream product lifecycle remains closed:

- active: false
- Question Studio discoverable: false
- Question Bank writable: false
- test/mock eligible: false
- publicly publishable: false

## Exact-head executable proof

Exact branch head: `5cf6c194d32e507c39d3a21b803b5c57b084a375`

Dedicated workflow: `Validate NUM-CP-008 permanent allocation and English freeze`

Run: `32257238018` — **SUCCESS**

The run proved:

- final source saturation: PASS
- discovered prototypes: 26
- permanent authorities: 19
- merge groups: 6
- singleton authorities: 13
- routine source gaps: 0
- permanent allocation invariant: PASS
- permanent range: `NUM-QL-166..NUM-QL-184`
- next free identity: `NUM-QL-185`
- source-prototype once-only coverage: 26
- permanent English runtime: PASS
- English packages exercised: 2,280 (`19 × 120`)
- deterministic replay checks: 2,280
- verifier parity checks: 2,280
- option binding checks: 2,280
- explanation binding / learner-text hygiene checks: 2,280
- every approved merged source mode reached
- at least two difficulty bands reached per permanent QL
- distinct mathematical fingerprints per QL: minimum 69, maximum 120
- Question Studio / Question Bank / test / public lifecycle activations: 0

Evidence artifact:

- ID: `9366778708`
- name: `num-cp008-permanent-allocation-en-freeze`
- digest: `sha256:37051a9d76e8aee1afe869a11a54bf3693c0557acaa6d01589481570b1d1e8d8`

## Current gate

**CP008 permanent allocation and English authority freeze are complete.**

Hindi/Punjabi localization and downstream Question Studio integration remain separate later gates. This freeze does not authorize Question Bank writes, mock/test inclusion, or public publication.
