# Question Studio Generate → Review → Question Bank Authority

## Status

This file is the default lifecycle authority for examtree chapter integrations.

## Mandatory chapter flow

Every production-intended Quant or Reasoning chapter must be fully integrated into Question Studio using this sequence:

1. **Generate in Question Studio.**
2. Persist each generated item to the normal Question Studio review queue as `unreviewed`.
3. **Human/admin review is mandatory before Question Bank conversion.**
4. `needs_fix` and `rejected` items remain outside Question Bank.
5. When a reviewer marks an item `approved`, that approval is the authorization to convert the reviewed item into Question Bank storage.
6. Question Bank conversion must preserve the reviewed stem, options, correct answer, explanation, language, difficulty and source traceability.

## Meaning of review-only

`review-only` describes the **pre-approval state of a generated item**. It must not be used as the normal permanent end-state for a production-intended chapter.

A chapter is not considered fully integrated when it can generate and preview questions but approved items are intentionally prevented from reaching Question Bank.

## Question Bank is not public release

Moving an approved Question Studio item into Question Bank is part of the editorial workflow. It is **not** the same as enabling:

- scored tests or mocks;
- automatic test assembly;
- public/student publication;
- automatic publication.

Those remain separate downstream gates. Therefore a generated item may be eligible for Question Bank conversion after human approval while still carrying `testEligibility: INELIGIBLE` and `publiclyPublishable: false`.

## Default integration contract

For production-intended chapter integrations, persisted Question Studio payloads should use an explicit pre-approval bank state such as:

```text
questionBankStatus:        PENDING_REVIEW
questionBankApprovalMode:  ON_HUMAN_APPROVAL
manualApprovalRequired:    true
automaticStudentPublication: false
```

The approval path must convert the item only after its Question Studio status becomes `approved`.

## Exceptions

A permanent no-bank state such as `questionBankStatus: NOT_STORED` is reserved for prototypes, experimental/dynamic candidates, evidence-only artifacts or another explicitly documented non-production surface. Such an exception must not be used merely because a chapter has not yet been reviewed.

## Consequence for implementation work

From this authority onward, chapter completion work should include Question Studio registration as part of implementation. The expected lifecycle is:

```text
chapter runtime
→ Question Studio generation
→ unreviewed review item
→ human review
→ approved
→ Question Bank
```

Question Bank entry is never allowed directly from generation without review.
