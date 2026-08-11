# INT-001 / INT-CP-001 Multilingual V2 Approval Record

Hindi release: `INT-CP-001-HI-v2`  
Punjabi release: `INT-CP-001-PA-v2`  
English authority: `INT-CP-001-EN-v3`  
Editorial standard: `FOUR_TIER_GOLD_MULTILINGUAL_V2`  
Permanent QL range: `INT-QL-001..INT-QL-021`  
Human approval recorded: **2026-07-29**  
Status: **APPROVED MULTILINGUAL V2 CONTRACT**

## Approval decision

The cash-flow-corrected Hindi and Punjabi V2 review candidates have received explicit human approval.

Approval covers:

- all 21 permanent QLs;
- borrower-versus-investor context classification;
- direction-aware interest wording;
- explicit payable-amount wording for loan scenarios;
- corrected source openings for business advances, community loans, personal lending and post-office deposits;
- Hindi and Punjabi learner-facing stems, options and four-tier explanations;
- exact mathematical, answer-index and misconception parity with approved English V3.

## Supersession

`INT-CP-001-HI-v1` and `INT-CP-001-PA-v1` remain immutable historical approved artefacts. They are superseded for future release use by V2 because V1 allowed transaction-direction contradictions in some generated stems.

## Approval architecture

Approved runtime:

`cp001-localized-runtime-v2-approved.ts`

The V2 candidate runtime remains immutable. Approval changes only:

```text
maturity
reviewStatus
localeReviewStatus
```

All learner content, mathematical state, options, answer ownership, explanations and provenance remain identical to the reviewed V2 candidate.

## Approved lifecycle

```text
maturity:                     APPROVED_MULTILINGUAL_CONTRACT_V2
reviewStatus:                 APPROVED_MULTILINGUAL_CONTRACT_V2
localeReviewStatus:           APPROVED_HUMAN_REVIEW
questionBankStatus:           NOT_STORED
testEligibility:              INELIGIBLE
publiclyPublishable:          false
questionStudioDiscoverable:   false
```

Language approval does not authorise storage, test use, publication, routing or merging.

## Exact approval proof

```text
Implementation head: b447c63644979bae958f8bc06ca802adf1c40982
Workflow:            Validate INT-CP-001 multilingual V2 cash-flow direction
Run:                 30419940508
Conclusion:          PASS
Artifact:            8711532603
Digest:              sha256:f15f64e22406c12b8160c1c7d12380c1f27651d7ae534e675f9c3ce82b8bfacd
```

```text
Approved localized questions:       3,360
Candidate-to-approved identity:     3,360
English parity checks:              3,360
Deterministic checks:               3,360
Lifecycle checks:                   3,360
Distractor checks:                 10,080
Approved review samples:              126
```

The workflow also reran the approved English regression and the exhaustive V2 cash-flow candidate audit.

## Safety boundary

The following remain separate deliberate gates:

- registering an inactive production provider;
- enabling Question Studio discovery;
- storing generated questions in Question Bank;
- enabling mock-test eligibility;
- making any locale publicly publishable;
- merging the stacked pull-request chain.

This approval record performs none of those actions.
