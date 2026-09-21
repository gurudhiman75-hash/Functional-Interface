# ENV-001 Question Studio Integration V1

## Status

**QUESTION_STUDIO_INTEGRATED / REVIEW_ONLY**

ENV-001 Environment & Ecology is registered in the shared `knowledge-v1` Question Studio engine.

## Registered scope

- Package: `ENV-001`
- CPs: `ENV-CP-001` through `ENV-CP-020`
- Permanent QLs: 255
- Frozen questions per language: 1,020
- Languages: `en`, `hi`, `pa`
- Total frozen multilingual surfaces: 3,060
- Supported difficulties: Easy / Medium / Hard
- Runtime mode: `review-only`

The same seed, selectors and difficulty filter preserve the same underlying English question identities across English, Hindi and Punjabi.

## Workflow

Question Studio capabilities expose ENV-001 through the existing multi-engine registry.

Generation supports:
- package-level review batches;
- CP selection through `canonicalProblemId` / `cpId`;
- QL selection through `patternId` / `questionLanguageId`;
- Easy / Medium / Hard / Mixed filtering;
- deterministic seeded selection without replacement;
- EN / HI / PA frozen learner surfaces.

Generated runs use the established admin Question Studio persistence workflow and enter the normal human review queue.

## Release locks

ENV-001 uses `QUESTION-STUDIO-STANDARD-REVIEW-ONLY-V1`.

Therefore:
- review-run persistence: enabled;
- manual review: required;
- Question Bank storage: disabled;
- canonical-question conversion: disabled;
- test eligibility: disabled;
- mock-test eligibility: disabled;
- public publication: disabled;
- automatic student publication: disabled;
- production release: disabled.

Approving an ENV-001 generated item remains an editorial review approval only. The shared bulk approval policy sees `questionBankStatus=NOT_STORED` and `questionBankWritable=false`, so it skips Question Bank conversion.

## Content authority

Question Studio reads only the approved/frozen Environment localization authorities. The source localization artifacts remain `reviewOnly: true` and `runtimeRegistered: false`; the Question Studio adapter adds runtime registration metadata only to the generated review payload.

Content changes must be made in the owning ENV source/localization authority and re-audited. The Question Studio adapter is not an alternate authoring surface.
