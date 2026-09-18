# ENG-003-CP009 — Grammar Fillers: Gerunds, Infinitives and Participles — Source Audit V1

Status: `IMPLEMENTED_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

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
