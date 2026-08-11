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

The approval audit proves, for every generated item, that removing these three lifecycle fields produces byte-equivalent candidate and approved objects:

```text
maturity
reviewStatus
localeReviewStatus
```

No approved question differs from the reviewed candidate in its QL identity, hidden state, mathematics, stem, options, correct index, misconception ownership, explanation or provenance.

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

Validated approval implementation head before this record update:

`48c341cfcf4f0c0809611fb31a97127df54a6358`

## Exact approval proof

Workflow:

```text
Validate INT-CP-001 multilingual parity
Run:        30355301336
Conclusion: PASS
```

Evidence artifact:

```text
Artifact ID: 8686547779
Digest: sha256:6816c44a70058e9daa3ab51c3a1f3930e43f3abefd907ad0304d8cc5ab98d6c6
```

Every workflow stage passed:

1. approved English V3 regression;
2. approved Hindi/Punjabi parity and lifecycle audit;
3. approved Hindi evidence export;
4. approved Punjabi evidence export;
5. evidence upload.

## Exhaustive approval audit

```text
21 QLs × 80 seeds × 2 locales = 3,360 approved localized questions
Exact English parity checks:         3,360
Candidate-to-approved identity:      3,360
Distractor checks:                  10,080
Cross-locale exact collisions:           0
```

Observed coverage:

```text
Hindi generated:                 1,680
Hindi distinct stems:            1,644
Hindi distinct answers:            332
Hindi answer positions:      421/419/419/421
Hindi source adapters:              32

Punjabi generated:               1,680
Punjabi distinct stems:          1,646
Punjabi distinct answers:          332
Punjabi answer positions:    421/419/419/421
Punjabi source adapters:            32
```

Approved evidence packs contain 63 Hindi and 63 Punjabi samples, covering all 21 permanent QLs with three review seeds each.

## Record-inclusive verification

The approval record itself is included in the final validated head:

```text
Head:       a49f42aec52f4b0a32240a6036dc2ee764215f8a
Workflow:   30355512795
Conclusion: PASS
Artifact:   8686627047
Digest:     sha256:8c3187301ca9e7aff2da9ca7db24059f685678fcc0280631605fc9cbba85fda2
```

## Final boundary

Hindi and Punjabi are now human-approved multilingual contracts. They remain deliberately unavailable to Question Bank, mock tests, public publication and Question Studio until those downstream lifecycle gates are explicitly authorised.
