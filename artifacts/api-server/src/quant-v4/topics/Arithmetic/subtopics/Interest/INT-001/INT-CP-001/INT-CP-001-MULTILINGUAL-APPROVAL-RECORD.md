# INT-001 / INT-CP-001 Multilingual Approval Record

Hindi release: `INT-CP-001-HI-v1`  
Punjabi release: `INT-CP-001-PA-v1`  
Editorial standard: `FOUR_TIER_GOLD_MULTILINGUAL_V1`  
English authority: `INT-CP-001-EN-v3`  
Permanent QL range: `INT-QL-001..INT-QL-021`  
Human approval recorded: **2026-07-28**  
Status: **APPROVED MULTILINGUAL CONTRACT**

## Approval decision

The Hindi and Punjabi review candidates frozen in `INT-CP-001-MULTILINGUAL-REVIEW-CANDIDATE.md` have received explicit human approval.

Approval covers:

- all 21 permanent QLs;
- Hindi learner-facing stems, options and four-tier explanations;
- Punjabi learner-facing stems, options and four-tier explanations;
- mathematical and option-level parity with the approved English V3 authority;
- natural competitive-exam language and the recorded terminology decisions;
- all reviewed distractor explanations and MathJax workings.

## Immutable candidate evidence

The candidate runtime and candidate record remain frozen with their original pending-review lifecycle fields. Approval is applied through a separate wrapper so the reviewed learner content is not rewritten after approval.

The approval audit must prove, for every generated item, that removing these three lifecycle fields produces byte-equivalent candidate and approved objects:

```text
maturity
reviewStatus
localeReviewStatus
```

No approved question may differ from the reviewed candidate in its QL identity, hidden state, mathematics, stem, options, correct index, misconception ownership, explanation or provenance.

## Approved lifecycle

```text
maturity:                     APPROVED_MULTILINGUAL_CONTRACT
reviewStatus:                 APPROVED_MULTILINGUAL_CONTRACT
localeReviewStatus:           APPROVED_HUMAN_REVIEW
questionBankStatus:           NOT_STORED
testEligibility:              INELIGIBLE
publiclyPublishable:          false
questionStudioDiscoverable:   false
```

Language approval does not authorise publication or routing.

## Safety boundary

The following remain separate deliberate release gates:

- storing generated questions in Question Bank;
- enabling mock-test eligibility;
- making either locale publicly publishable;
- exposing either locale through Question Studio;
- merging the stacked pull request chain.

This approval record does not perform any of those actions.

## Implementation authority

Approved runtime:

`cp001-localized-runtime-approved.ts`

Pre-record approval implementation head:

`0c046fc1dad359ccef0f64036040f5e52498a565`

The record-inclusive exact-head workflow evidence is appended after the approval audit passes.
