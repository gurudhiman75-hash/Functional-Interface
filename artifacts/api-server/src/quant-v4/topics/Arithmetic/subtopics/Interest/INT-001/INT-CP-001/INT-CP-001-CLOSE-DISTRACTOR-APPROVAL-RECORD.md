# INT-001 / INT-CP-001 Close-Distractor Approval Record

English release: `INT-CP-001-EN-v5`  
Hindi release: `INT-CP-001-HI-v4`  
Punjabi release: `INT-CP-001-PA-v4`  
Editorial standard: `FOUR_TIER_GOLD_CLOSE_DISTRACTORS_V1`  
Permanent QL range: `INT-QL-001..INT-QL-021`  
Human approval recorded: **2026-07-30**  
Status: **APPROVED CLOSE-DISTRACTOR CONTRACT**

## Approval decision

The close-distractor candidates frozen in `INT-CP-001-CLOSE-DISTRACTOR-REVIEW-CANDIDATE.md` have received explicit human approval.

Approval covers:

- all 21 permanent QLs;
- the English V5, Hindi V4 and Punjabi V4 option sets;
- the tightened wrong-option proximity policy;
- exact correct-answer values and correct option positions;
- retained misconception ownership where the concept-linked trap lies within 15%;
- generated numerical near misses and their trap explanations;
- exact option-value and option-position parity across English, Hindi and Punjabi.

## Immutable candidate evidence

The reviewed candidate runtime and candidate record remain frozen with their original pending-review lifecycle fields.

Approval is applied through a separate wrapper:

`cp001-close-distractor-runtime-approved.ts`

The approval audit proves that removing these three lifecycle fields produces byte-equivalent candidate and approved objects:

```text
maturity
reviewStatus
localeReviewStatus
```

No approved question differs from the reviewed candidate in its QL identity, source state, mathematical fingerprint, stem, structured presentation, options, correct index, misconception ownership, explanations, validation trace or provenance.

## Approved lifecycle

```text
maturity:                    APPROVED_CLOSE_DISTRACTOR_CONTRACT
reviewStatus:                APPROVED_CLOSE_DISTRACTOR_CONTRACT
localeReviewStatus:          APPROVED_HUMAN_REVIEW
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
questionStudioDiscoverable:  false
```

Human approval does not authorise publication, storage or routing.

## Approved selection contract

1. Every option set contains at least one wrong value below and one above the exact answer.
2. At most one existing concept-linked trap may be retained.
3. A retained concept-linked trap must be within 15% of the exact answer.
4. Remaining wrong options are deterministic answer-scaled numerical near misses.
5. Money near misses remain within 15%.
6. Rate near misses remain within two percentage points.
7. Time near misses use representation-aware half-month, one-month, three-month, six-month or one-year steps under the recorded guards.
8. Ratio and amount-multiple near misses use denominator-aware or 0.05-scale values under the ratio guard.
9. English, Hindi and Punjabi retain exact option-value and option-position parity.
10. Each wrong option has a synchronised trap-analysis item.

## Pre-record approval proof

The approval wrapper and approval audit passed before this record was added:

```text
Head:       11459dfa53ecb1ad4183623d89bc3cb490708d67
Workflow:   Validate INT-CP-001 close distractors
Run:        30506774372
Conclusion: PASS
Artifact:   8745635944
Digest:     sha256:db9b9e4fc5f6f8949160952c7e3e24ac841bf65b9388f81be4bbd8faa56400f1
```

## Exhaustive approval audit

```text
21 QLs × 80 seeds × 3 languages = 5,040 approved questions
Candidate-to-approved identity checks:   5,040
Deterministic approved checks:           5,040
Approved lifecycle checks:               5,040
Cross-language value/position checks:    3,360
Approved wrong options checked:         15,120
```

Language coverage:

```text
English approved questions: 1,680
Hindi approved questions:   1,680
Punjabi approved questions: 1,680
Wrong options per language: 5,040
```

## Record-inclusive verification

The workflow must pass again on the commit containing this record. The resulting exact head, workflow run, artifact and digest are recorded in PR #330 so this approval record remains immutable after its creation.

The record-inclusive run repeats:

1. readable-stem regression;
2. tightened candidate audit;
3. candidate-to-approved identity and lifecycle audit;
4. multilingual review-pack generation;
5. evidence upload.

## Safety boundary

The following remain separate deliberate release gates:

- storing generated questions in Question Bank;
- enabling mock-test eligibility;
- making any release publicly publishable;
- exposing INT-001 through Question Studio;
- marking the pull request ready for review;
- merging the stacked pull request chain.

This approval record performs none of those actions.

## Final boundary

English V5, Hindi V4 and Punjabi V4 are now human-approved close-distractor contracts. They remain deliberately unavailable to Question Bank, mock tests, public publication and Question Studio until those downstream lifecycle gates are explicitly authorised.
