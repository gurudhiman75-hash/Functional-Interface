# ENG-003-CP008 — Grammar Fillers: Nouns and Quantifiers — Source Audit V1

Status: `HUMAN_APPROVED_V1__QUESTION_STUDIO_REVIEW_ONLY__LEARNER_RELEASE_LOCKED`

## Boundary

ENG-003 CP008 implements **Nouns and Quantifiers Grammar Fillers** by reusing the closed ENG-001 CP008 and approved ENG-002 CP008 layer.

Reused rules `GR-NQN-001..010` cover:

- many / much
- few / little
- fewer / less
- number / amount
- mass nouns
- irregular plurals
- plural-only nouns
- unit expressions for uncountable nouns
- group nouns after `each of the` / `one of the`

No noun/quantifier rule is re-authored here.

## Filler transformation

ENG-002 CP008 already normalizes tricky surfaces such as:

- `a pair of scissors`
- `two pairs of trousers`
- `pieces of information`
- `items of equipment`
- `one of the members`

ENG-003 preserves the approved focused target and replaces it with exactly one `_____` blank. The verified correction becomes the right answer and the same approved donor logic supplies three safe distractors.

Phrase-level targets stay intact when the grammar rule depends on the whole phrase; this avoids unnatural token chopping.

## Quality guards

The checkpoint rejects duplicate choices, mechanical quantifier phrases, malformed countability surfaces, multiple blanks, Error Spotting slash segmentation, answer-reconstruction drift and explanation loss.

## Difficulty and coverage

The donor catalog contains **20 curated scenes per difficulty**. The 6,000-question soak must exercise every eligible rule family, semantic domain and donor scene, while passing deterministic replay, exact reconstruction and answer-position balance.

## Review batch

The deterministic review exporter produces **30 questions**:

- 10 Easy
- 10 Medium
- 10 Hard

Rule-family breadth is prioritized before additional scene variety.

## Lifecycle

CP008 remains review-only until explicit human editorial approval. It is not registered in Question Studio and is not eligible for Question Bank writes, tests, mocks, learner/public publication, automatic student delivery or production release.

## Human approval

Approved on **2026-09-18**.

- Approval authority: `ENG-003-CP008-HUMAN-EDITORIAL-APPROVAL-V1`
- Approved generator head: `aeea5895ad50a7441bfbc9488d443beccd2add72`
- Review SHA-256: `a5d6cc62b789a4df4e50cd5150fc206904c64cdf9f74c20dd8a8605c560955bb`
- Workflow artifact digest: `sha256:5c4b23b87eff5688d4928321b78b448eaef4492eef6ede96fcfb519efdde1334`

Question Studio registration is review-only. Learner/test/mock/public release remains locked.
