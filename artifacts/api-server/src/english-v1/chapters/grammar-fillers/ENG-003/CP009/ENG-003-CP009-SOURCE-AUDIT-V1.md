# ENG-003-CP009 — Grammar Fillers: Gerunds, Infinitives and Participles — Source Audit V1

Status: `HUMAN_APPROVED_V1__QUESTION_STUDIO_REVIEW_ONLY__LEARNER_RELEASE_LOCKED`

## Boundary

ENG-003 CP009 implements **Non-finite Grammar Fillers** by reusing the closed ENG-001 CP009 and approved ENG-002 CP009 layer.

Reused rules `GR-GIP-001..010` cover:

- verbs followed by gerunds;
- verbs followed by to-infinitives;
- object + to-infinitive;
- make / let + bare infinitive;
- modals + bare infinitive;
- verb after a preposition;
- `used to` vs `be/get used to`;
- infinitive of purpose;
- meaning-sensitive `remember` / `stop` patterns;
- participle and perfect-participle forms.

No non-finite rule is re-authored in ENG-003.

## Filler transformation

ENG-002 CP009 already isolates the smallest meaningful non-finite target. ENG-003 preserves that approved focus and replaces it with exactly one `_____` blank.

To make the filler surface more exam-like, shared words across all four choices are factored back into the sentence. Examples:

- `enjoys _____ novels` rather than repeating `reading novels / to read novels / ...`;
- `must _____` for a modal + bare infinitive;
- `used to _____ urgent queries`;
- `Having _____ the assignment`.

The verified correction is the right answer; three safe alternatives come from the same approved donor logic.

## Quality guards

The checkpoint rejects:

- duplicate choices;
- `No improvement` leakage;
- multiple blanks;
- Error Spotting slash segmentation;
- duplicated surfaces such as `to to` or `having having`;
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

CP009 remains review-only until explicit human editorial approval. It is not registered in Question Studio and is not eligible for Question Bank writes, tests, mocks, learner/public publication, automatic student delivery or production release.

## Human approval

Approved on **2026-09-18**.

- Approval authority: `ENG-003-CP009-HUMAN-EDITORIAL-APPROVAL-V1`
- Approved generator head: `37774dfdade6f3b814ffb15f2ad18be6a66539ea`
- Review SHA-256: `4bf50dfaddbf384c1f8254809c11f2758940d4ea3ba3d72117a3429de320ecb4`
- Workflow artifact digest: `sha256:05725b50d3f1cb6531d45191fb318b5ebb72d0d3ea55a53d59a4799ccf8db2e1`

Question Studio registration is review-only. Learner/test/mock/public release remains locked.
