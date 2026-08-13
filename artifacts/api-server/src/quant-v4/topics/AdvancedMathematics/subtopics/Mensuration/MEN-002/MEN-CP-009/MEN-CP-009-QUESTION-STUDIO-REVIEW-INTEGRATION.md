# MEN-CP-009 Question Studio Review Integration

## Status

`REGISTERED_REVIEW_ONLY__DOWNSTREAM_RELEASE_LOCKED`

MEN-CP-009 is registered in Question Studio only for preview, review-queue persistence and editorial review.

The adapter consumes the product-owner-approved multilingual teaching freeze:

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
- Punjabi `ਸਤ੍ਹਾ` orthography, with `ਸਤਹ` rejected;
- source lifecycle remaining inactive below the adapter.

## Question Studio lifecycle

The adapter grants a narrow review surface without modifying the frozen source lifecycle.

```text
questionStudioRegistrationStatus: REGISTERED_REVIEW_ONLY
questionStudioStagingStatus:      REVIEW_QUEUE_ENABLED
questionStudioVisible:            true
questionStudioDiscoverable:       true
persistenceAllowed:               true
questionBankStatus:               NOT_STORED
questionBankWritable:             false
testEligibility:                  INELIGIBLE
testEligible:                     false
mockTestEligible:                 false
publiclyPublishable:              false
automaticStudentPublication:      false
```

Review items may be persisted into the normal `content.generation_runs` / review queue for editorial operations. That persistence is not Question Bank storage.

## Admin surface

Question Studio Operations exposes a dedicated MEN-CP-009 panel with:

- language selector: English / Hindi / Punjabi;
- QL selector across all 28 permanent QLs;
- Easy / Medium / Hard filter;
- deterministic seed input;
- preview up to 20 questions;
- review-run creation up to 50 questions;
- current review-queue and Question Bank counts.

## Release boundary

This registration does not authorize Question Bank conversion, scored tests, mock tests or public/student delivery. Those remain separate product-release gates.
