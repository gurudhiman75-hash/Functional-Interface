# INT-CP-001 Readable-Stem Review Candidate

Status: **FROZEN FOR HUMAN REVIEW — NOT APPROVED — NOT PUBLISHED**

## Scope

This record freezes the readability-refactored learner-facing stem candidates for:

`INT-CP-001 — Simple-Interest Fundamentals and Direct Inverses`

```text
English candidate:  INT-CP-001-EN-v4
Hindi candidate:    INT-CP-001-HI-v3
Punjabi candidate:  INT-CP-001-PA-v3
Editorial standard: FOUR_TIER_GOLD_READABLE_STEMS_V1
Permanent QLs:      INT-QL-001..INT-QL-021
QL count:           21
```

The currently approved authorities remain immutable and active only as non-published contracts until these candidates receive explicit human approval:

```text
English authority:  INT-CP-001-EN-v3
Hindi authority:    INT-CP-001-HI-v2
Punjabi authority:  INT-CP-001-PA-v2
```

## Editorial correction

The candidate stems are generated from structured financial state and source context rather than by joining isolated fact declarations. They implement:

- active person-and-action openings;
- continuous one-pass narration;
- explicit borrower-versus-investor cash-flow verbs;
- payable-amount language for loans and receipt/earning language for deposits;
- explicit time ordering in two-amount and unknown-time ratio questions;
- natural English, Hindi and Punjabi duration questions;
- scan anchors for principal, rate, time, interest, amount and ratio values.

## Presentation contract

The canonical stem remains clean plain text. Numerical emphasis is stored separately as structured presentation metadata:

```text
stemPresentation.plainText
stemPresentation.richTextHtml
stemPresentation.emphasisSpans[]
```

Each emphasis span contains:

```text
semantic: PRINCIPAL | RATE | TIME | INTEREST | AMOUNT | RATIO
text
start
end
```

The rich representation uses sanitised `<strong>` elements. Raw Markdown `**` markers are never stored in the canonical stem.

## Frozen change boundary

The readability wave may change only:

```text
releaseId
maturity
reviewStatus
localeReviewStatus
stem
validation
stemPresentation
readabilityEditorialTrace
```

It must preserve exactly:

- permanent QL and solve-contract identity;
- source parameters and hidden state;
- mathematical fingerprint;
- canonical solution;
- all four option-result values;
- correct option index;
- misconception ownership;
- four-tier explanations;
- source adapter and provenance;
- Question Bank, test, publication and routing locks.

## Exhaustive candidate proof

Content head:

```text
Head:       03e81373dbc2af8c014b9b3d018d0618b448ba51
Workflow:   Validate INT-CP-001 readable stems
Run:        30441694378
Conclusion: PASS
Artifact:   8719719271
Digest:     sha256:d11fcd0504000fb7e3d014081427a5fe3e55f73c39415e8a53e20c8b24d5cb81
```

```text
21 QLs × 80 seeds × 3 languages = 5,040 candidates
Approved-to-candidate invariant checks: 5,040
Deterministic checks:                    5,040
Structured-presentation checks:         5,040
Cash-flow trace checks:                  5,040
Lifecycle-lock checks:                   5,040
Readability-load checks:                 5,040
Distractor checks:                      15,120
Hindi/Punjabi exact collisions:              0
```

Every language covered all 21 QLs, all eleven source scenario families and all four answer positions.

## Readability-load policy

```text
Maximum words per stem:                 45
Maximum characters per stem:           260
Maximum average words per language:     30
Maximum average characters per language: 175
```

Observed candidate metrics:

```text
English: average 28.48 words; maximum 41 words; average 164.11 characters
Hindi:   average 27.38 words; maximum 44 words; average 134.02 characters
Punjabi: average 27.98 words; maximum 45 words; average 138.78 characters
```

Hindi word load is 7.42% below its approved baseline. Punjabi word load is 7.34% below its approved baseline. English is 12.49% longer than the compressed approved baseline because it replaces administrative fragments with complete active narration; it remains below every absolute readability ceiling and requires human editorial review rather than automatic approval.

No claim of a specific percentage reduction in learner reading time is made because no timed learner study has been conducted.

## Review evidence

The workflow exports 63 before-and-after rows per language:

```text
21 QLs × 3 review seeds = 63 English rows
21 QLs × 3 review seeds = 63 Hindi rows
21 QLs × 3 review seeds = 63 Punjabi rows
Total review rows: 189
```

Bold text in the Markdown review packs is derived from structured emphasis spans. It is not embedded in the canonical question stem.

## Lifecycle boundary

Every candidate remains:

```text
maturity:                    READABLE_STEM_EDITORIAL_CANDIDATE
reviewStatus:                PENDING_MULTILINGUAL_READABILITY_REVIEW
localeReviewStatus:          PENDING_HUMAN_REVIEW
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
questionStudioDiscoverable:  false
```

This record does not approve the candidates, replace the approved runtime, merge any pull request, register `INT-001` in Question Studio, store questions, enable mock-test use or permit public publication.
