# INT-CP-008 — Final Authority Proposal V1

Status: **review-ready proposal; no permanent QL allocation**

Evidence inherited:
- Wave01 exact head `4a3e6825892cfcc889c70e2b3ca8c402207bf335` — run `32327170743` PASS.
- Post-Wave01 source saturation exact head `3dc218d75c0e30141ef6e13a05c55cbdc94cf14b` — run `32327510595` PASS.
- Source material gaps: **0**.

## Proposed final authority count: 9

| Slot | Proposed authority | Temporary prototypes | Decision |
|---|---|---|---|
| A01 | Equal end-of-period instalment | P001 + P006 | retain; merge down-payment context into P001 after financed balance is computed |
| A02 | Opening balance from equal periodic cash flow | P002 + P009 | retain; merge withdrawal/fund context into P002 |
| A03 | Outstanding balance after regular payments | P003 | retain |
| A04 | Final balancing payment | P004 | retain |
| A05 | Beginning-of-period equal instalment | P005 | retain because event order changes recurrence |
| A06 | Periodic rate from equal-instalment schedule | P007 | retain bounded exact inverse |
| A07 | Future fund from equal recurring deposits | P008 | retain |
| A08 | Missed instalment catch-up | P010 | retain explicit missed-event topology |
| A09 | Difference between instalments under two rates | P011 | retain comparison/difference answer semantic |

## Why P006 is not separate

The down payment occurs immediately. Once it is subtracted from the purchase price, the remaining financed balance follows exactly the P001 end-of-period equal-instalment recurrence. The audit proves answer equivalence under that transformation.

## Why P009 is not separate

A fund supporting equal periodic withdrawals asks for the same opening-balance inverse as P002. Deposit/withdrawal story language changes the interpretation, not the mathematical unknown or recurrence.

## Why P011 stays separate

P011 evaluates two complete equal-instalment schedules and asks for their difference. That is a comparison contract with `INSTALLMENT_DIFFERENCE` as the answer semantic, not a single P001 result. Keeping it separate follows the chapter’s existing practice of retaining comparison/difference logic when the asked quantity changes.

## Potential permanent range — not allocated

If the product owner approves the proposed count of 9, the next available contiguous range would be:

`INT-QL-116 .. INT-QL-124`

Those IDs are **not reserved, allocated or frozen by this proposal**.

## Lifecycle

```text
proposalStatus:              REVIEW_READY_NOT_ALLOCATED
proposedAuthorityCount:      9
permanentQlCount:            0
permanentQlAllocation:       NOT_AUTHORIZED
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

Next gate: explicit product-owner approval of the **9-authority count and merge/split decisions**. Only after that approval may permanent QL identities be allocated.
