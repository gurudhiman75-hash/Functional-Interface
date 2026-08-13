# MEN-CP-009 Question Studio Integration

## Status

`REGISTERED_GENERATE_REVIEW_APPROVE_TO_BANK`

MEN-CP-009 must follow the standard examtree Question Studio lifecycle:

```text
generate
→ persist as unreviewed
→ human/admin review
→ approved
→ Question Bank
```

The product-owner-approved multilingual teaching freeze remains the content authority:

- freeze: `MEN-CP009-TEACHING-V4-MULTILINGUAL-v1-frozen`
- package: `MEN-002`
- checkpoint: `MEN-CP-009`
- permanent QLs: `MEN-002-QL-096..MEN-002-QL-123`
- QLs: 28/28
- English approved review questions: 110
- Hindi approved review questions: 110
- Punjabi approved review questions: 110
- reviewed total: 330
- reviewed source head: `26b6d2b8fb4effa33f1e89ba7b555817e5132888`
- reviewed artifact digest: `sha256:599164b47c282aa99218822d3685f8d4cf316b11b258f655b8e057f58febedfc`

## Learner contract

Question Studio previews are regenerated through the approved teaching presentation and fail closed unless they retain:

- four distinct options and exactly one correct answer;
- unchanged QL and correct-index ownership;
- source validation and independent verification;
- 4–5 connected teaching steps;
- visible middle calculation/algebra;
- explicit numerical π substitution when the source question requires `22/7` or `3.14`;
- approved simple Hindi/Punjabi wording;
- Punjabi `ਸਤ੍ਹਾ` orthography, with `ਸਤਹ` rejected.

## Question Studio lifecycle

The frozen source remains immutable. Question Studio is the operational layer around it.

Generated items first enter the normal review queue as `unreviewed`. They are not written to Question Bank at generation time. A reviewer can mark an item `needs_fix`, `rejected` or `approved`.

For a production-intended approved MEN-CP-009 item, **`approved` is the authorization to convert that exact reviewed item into Question Bank storage**. There is no second manual "activate Question Bank" gate after Question Studio approval.

This follows the project-wide authority `QUESTION-STUDIO-GENERATE-REVIEW-BANK-AUTHORITY.md`.

## Admin surface

Question Studio Operations exposes MEN-CP-009 with:

- language selector: English / Hindi / Punjabi;
- QL selector across all 28 permanent QLs;
- Easy / Medium / Hard filter;
- deterministic seed input;
- preview up to 20 questions;
- review-run creation up to 50 questions;
- current review-queue and Question Bank counts.

## Downstream boundary

Question Bank conversion is part of editorial approval. Automatic student publication is still prohibited. Any separate test-series, mock-test or public-delivery policy must be enforced downstream and must never bypass Question Studio review.
