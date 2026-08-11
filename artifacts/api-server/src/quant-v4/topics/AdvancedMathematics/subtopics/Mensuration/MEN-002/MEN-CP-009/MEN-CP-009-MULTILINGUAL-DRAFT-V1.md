# MEN-CP-009 Multilingual Draft V1

## Authority

`MEN-CP009-MULTILINGUAL-DRAFT-V1`

Parent English authority:

- release: `MEN-CP009-EN-V3-APPROVED`
- learner authority: `MEN-CP009-STUDENT-VIEW-V3`
- permanent QLs: `MEN-002-QL-096..MEN-002-QL-123`
- permanent QL count: 28
- approved English semantic review artifact: 110 questions

## Purpose

This checkpoint adds deterministic Hindi and Punjabi learner-presentation drafts over the already approved MEN-CP-009 English learner surface.

The native layer is presentation-only. It cannot alter:

- QL identity;
- family or solve-mode identity;
- seed;
- difficulty/target ownership;
- mathematical state;
- option order;
- correct option;
- answer mathematics;
- source validation;
- independent verification.

## Native inventory

The exact 110-question approved English semantic review corpus is projected into both native languages:

```text
Hindi review surfaces:    110
Punjabi review surfaces:  110
Total native review:      220
Permanent QLs/language:    28
```

A broader deterministic regression also exercises every QL in both languages across multiple seeds and all answer positions.

## Editorial principles

Hindi and Punjabi stems are family-aware native templates rather than machine-translated copies of complete rendered English strings. Generated values and symbolic mathematics are bound from the approved English runtime.

The draft uses exam-facing terminology for:

- sphere / hemisphere;
- radius / diameter;
- curved and total surface area;
- volume and capacity;
- painting / polishing cost;
- ratio and inverse ratio;
- percentage change;
- surface-area-to-volume relations.

Options preserve the English mathematical values and positions. Learner words such as `times` and `litres` are localized while parity compares their language-neutral mathematical forms.

Explanations remain concise:

1. native formula or governing rule;
2. calculation/relation step when present;
3. native final-answer line.

## Parity contract

Every native item must prove:

- approved English V3 source validation is green;
- approved English V3 independent verification is green;
- four-option count is preserved;
- option mathematical values are preserved in the same order;
- correct-index ownership is unchanged;
- correct-option flags are unchanged;
- answer mathematical value is unchanged;
- deterministic replay is exact;
- native script is present in stem and explanation;
- known English learner-prose terms do not leak into native stem/explanation;
- product lifecycle locks remain closed.

## Human-review boundary

This checkpoint does **not** claim Hindi or Punjabi human editorial approval.

```text
reviewStatus:          PENDING_NATIVE_EDITORIAL
humanReviewStatus:     PENDING_HUMAN_REVIEW
```

The generated `MEN-CP-009-HI-PA-REVIEW-V1.html` artifact is the review surface for the next checkpoint. Native wording corrections, if any, must be committed and parity rerun before a human freeze can be recorded.

## Lifecycle boundary

```text
active:                      false
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
questionBankWritable:        false
testEligibility:             INELIGIBLE
testEligible:                false
publiclyPublishable:         false
```

Question Studio review registration, Question Bank storage, mock-test eligibility and public release remain separate later gates.

## Verdict

`NATIVE_DRAFT_IMPLEMENTED__AUTOMATED_PARITY_REQUIRED__HUMAN_REVIEW_PENDING__ACTIVATION_LOCKED`
