# INT-CP-008 — Permanent QL Allocation V1

Status: **product-owner approved authority count; permanent identity allocation implemented; learner content still open**

## Approval authority

The product owner continued from the exact-head green 9-authority proposal on 2026-08-20. For this checkpoint that continuation is recorded as approval of the reviewed authority count and merge/split decisions:

`PRODUCT_OWNER_APPROVED_CP008_9_AUTHORITY_STRUCTURE_2026_08_20`

This approval authorizes permanent identity allocation only. It does **not** authorize merge, Question Studio activation, Question Bank storage, test/mock eligibility or public delivery.

## Certified proposal evidence

- proposal: `INT-CP-008-AUTHORITY-PROPOSAL-v1`
- exact head: `9d6e6f5cf414ccd5c4f4127bb4bcd8752cf3efe1`
- workflow: `Validate INT-CP-008 Authority Proposal V1`
- run: `32327721843` — PASS
- job: `96302244170` — PASS
- artifact: `9391955740`
- digest: `sha256:30434d1a1d7d5b6a163870d2b741ced9639d8e0e74891b723ea0db021ce9ab55`
- temporary prototypes: 11
- final authority count: 9
- source material gaps: 0
- merge-equivalence checks: 400
- retain/distinction checks: 1,600
- canonical verifier checks: 2,200

## Permanent identities

| QL | Permanent contract | Canonical discovery prototype | Authority slot |
| --- | --- | --- | --- |
| `INT-QL-116` | Equal end-of-period instalment | `INT-CP008-PROT-001` | `CP008-A01` |
| `INT-QL-117` | Opening balance from equal periodic cash flow | `INT-CP008-PROT-002` | `CP008-A02` |
| `INT-QL-118` | Outstanding balance after regular payments | `INT-CP008-PROT-003` | `CP008-A03` |
| `INT-QL-119` | Final balancing payment | `INT-CP008-PROT-004` | `CP008-A04` |
| `INT-QL-120` | Beginning-of-period equal instalment | `INT-CP008-PROT-005` | `CP008-A05` |
| `INT-QL-121` | Periodic rate from equal-instalment schedule | `INT-CP008-PROT-007` | `CP008-A06` |
| `INT-QL-122` | Future fund from equal recurring deposits | `INT-CP008-PROT-008` | `CP008-A07` |
| `INT-QL-123` | Missed-instalment catch-up | `INT-CP008-PROT-010` | `CP008-A08` |
| `INT-QL-124` | Difference between instalments under two rates | `INT-CP008-PROT-011` | `CP008-A09` |

`INT-QL-125` becomes the next free Interest identity after successful exact-head allocation certification.

## Merged discovery prototypes

No permanent identity is created for:

- `INT-CP008-PROT-006` — down payment + equal instalments. It is a context/preprocessing variant of `INT-QL-116`: subtract the immediate down payment, then use the same recurring end-period instalment contract.
- `INT-CP008-PROT-009` — equal withdrawals/opening fund. It is a context/direction variant of `INT-QL-117`: the same opening-balance inverse supports equal withdrawals from a fund.

These variants may later contribute learner-facing representation diversity, but may not create duplicate permanent QLs.

## Runtime authority

Permanent runtime:

`INT-CP-008-v1-permanent-allocation`

Canonical solver continues to use exact finite geometric-sum identities. The independent verifier continues to rebuild the ordered balance/fund recurrence. Permanent state construction pins each QL to exactly one authority slot and canonical prototype.

## Freeze state

```text
permanentIdentityFrozen:     true
learnerContentFrozen:        false
runtimeEnabled:              false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
questionBankWritable:        false
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

Permanent identity freeze does not freeze English stems, options, distractor presentation or learner explanations. Those are the next authoring/review phase.

## Next gate

After exact-head permanent-allocation CI passes, proceed to **CP008 English learner-surface authoring and editorial review** over the frozen `INT-QL-116..124` identity structure.
