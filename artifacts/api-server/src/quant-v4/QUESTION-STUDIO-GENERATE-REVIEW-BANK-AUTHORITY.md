# Question Studio Generate → Review → Question Bank Authority

## Status

This file is the default lifecycle authority for examtree chapter integrations.

## Mandatory chapter flow

Every production-intended Quant or Reasoning chapter must be fully integrated into Question Studio using this sequence:

1. **Generate in Question Studio.**
2. Persist each generated item to the normal Question Studio review queue as `unreviewed`.
3. **Human/admin review is mandatory before Question Bank conversion.**
4. `needs_fix` and `rejected` items remain outside Question Bank.
5. When a reviewer marks an item `approved`, that approval authorizes conversion of the exact reviewed item into Question Bank storage.
6. Question Bank conversion must preserve the reviewed stem, options, correct answer, explanation, language, difficulty and source traceability.

## Meaning of review-only

`review-only` describes the **pre-approval state of a generated item**. It is not the normal permanent end-state for a production-intended chapter.

A chapter is not fully integrated when it can generate and preview questions but approved items are intentionally prevented from reaching Question Bank.

## No direct generation-to-bank path

Question Bank entry is never allowed directly from generation. The required path is:

```text
chapter runtime
→ Question Studio generation
→ unreviewed review item
→ human review
→ approved
→ Question Bank
```

## Downstream delivery

Question Bank conversion is part of the editorial workflow. Automatic student publication must still remain controlled. Test-series, mock-test and public-delivery policies may have their own downstream gates, but none may bypass Question Studio review.

## Exceptions

A permanent no-bank state such as `questionBankStatus: NOT_STORED` is reserved for prototypes, experimental/dynamic candidates, evidence-only artifacts or another explicitly documented non-production surface. It must not be used merely because a production chapter has not yet been reviewed.

## Implementation consequence

From this authority onward, chapter implementation is expected to include full Question Studio integration. The normal completion path is generate → review → approve → Question Bank, not generate → permanent review-only.
