# ENG-003-CP010 — Grammar Fillers: Modifiers and Placement — Source Audit V1

Status: `HUMAN_APPROVED_V1__QUESTION_STUDIO_REVIEW_ONLY__LEARNER_RELEASE_LOCKED`

## Boundary

ENG-003 CP010 implements **Modifiers and Placement Grammar Fillers** by reusing the closed ENG-001 CP010 and approved ENG-002 CP010 layer.

Reused rules `GR-MOD-001..010` cover dangling introductory modifiers, attachment of participial/adjective phrases, relative-clause attachment, focus modifiers such as `only`, degree modifiers such as `almost/nearly`, `even` in negative perfect structures, frequency-adverb placement, manner-adverb placement, and noun-phrase modifier attachment.

No modifier rule is re-authored in ENG-003.

## Filler transformation

Modifier questions cannot always be reduced to a single word without changing the tested meaning. ENG-003 therefore keeps the **smallest natural phrase that carries the placement contrast**.

Shared words across all four options are factored back into the sentence wherever safe. This produces surfaces such as:

- `Walking through the warehouse, _____ near the loading bay ...`
- `The clerk checked _____, not the figures ...`
- `reduced the marked price by _____ twenty per cent`
- `the committee had not _____ discussed ...`
- `the instructor explained _____ before the machine was switched on`

For attachment questions, a larger phrase remains blank when the grammar depends on the phrase's position relative to its noun or subject.

The verified correction is the correct choice. Three safe distractors come from the approved ENG-002 modifier logic. `GR-MOD-007`, whose ENG-002 no-improvement mode is intentionally disabled, receives its third distractor by applying the same approved `even` placement transformation to the visible error target.

## Quality guards

The checkpoint rejects:

- duplicate options;
- `No improvement` leakage;
- multiple blanks;
- Error Spotting slash segmentation;
- mechanical modifier distractors;
- duplicated modifiers;
- answer-reconstruction drift;
- explanation loss.

## Difficulty and coverage

The donor catalog contains **20 curated scenes per difficulty**. The 6,000-question soak must exercise every eligible rule family, semantic domain and donor scene, while passing deterministic replay, exact reconstruction and answer-position balance.

## Review batch

The deterministic review exporter produces **30 questions**:

- 10 Easy
- 10 Medium
- 10 Hard

Rule-family breadth is prioritized before additional scene variety.

## Lifecycle

CP010 remains review-only until explicit human editorial approval. It is not registered in Question Studio and is not eligible for Question Bank writes, tests, mocks, learner/public publication, automatic student delivery or production release.

## Human approval

Approved on **2026-09-19**.

- Approval authority: `ENG-003-CP010-HUMAN-EDITORIAL-APPROVAL-V1`
- Approved generator head: `3b27d68d31680475cd65ab2d4cb0c141b6613735`
- Review SHA-256: `a6d23f8856186def4e62326616956a8c800aad70bd26e119c5ce25bf3dc82480`
- Workflow artifact digest: `sha256:3a8af2a1f368ead846096724b894881e712a1a742a927ae8e69b58bb84e8426e`

Question Studio registration is review-only. Learner/test/mock/public release remains locked.
