# ENG-003-CP011 — Grammar Fillers: Conditionals — Source Audit V1

Status: `IMPLEMENTED_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Boundary

ENG-003 CP011 implements **Conditional Grammar Fillers** by reusing the closed ENG-001 CP011 layer and the human-approved ENG-002 CP011 **reviewed** generator.

Reused rule IDs:

- `GR-CND-001` zero conditional
- `GR-CND-002` first conditional result
- `GR-CND-003` present tense in an ordinary future if-clause
- `GR-CND-004` second conditional
- `GR-CND-005` third conditional
- `GR-CND-006` past-condition / present-result mixed conditional
- `GR-CND-007` present-state / past-result mixed conditional
- `GR-CND-008` unless without double negation
- `GR-CND-009` inverted `Had + subject + participle`
- `GR-CND-010` formal `Should` / `Were` inversion

No conditional rule is re-authored in ENG-003.

## Reviewed-source requirement

CP011 deliberately calls `generateEng002Cp011ReviewedQuestionV1`, not the raw CP011 generator. This preserves the approved editorial remediation for:

- malformed mixed-conditional participles;
- incorrect `would + participle` surfaces;
- bare passive `If ... been ...` distractors in inversion questions.

## Filler transformation

The sentence-improvement target is converted into one filler blank. Shared words across all four choices are factored back into the sentence wherever safe so the options focus on the tense/modal/inversion contrast.

Examples of intended surfaces include:

- `If the temperature _____ below zero, ...`
- `If the application arrives today, we _____ it tomorrow.`
- `Unless the fee _____, ...`
- `_____ the report been filed earlier, ...`
- `_____ the rates change, ...`

For formal inversion or mixed-conditionals, a phrase-level blank remains when the whole phrase is necessary to preserve the tested structure.

## Quality guards

The checkpoint rejects:

- duplicate choices;
- `No improvement` leakage;
- duplicated conditional markers;
- malformed auxiliaries or participles;
- bare passive inversion distractors;
- multiple blanks;
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

CP011 remains review-only until explicit human editorial approval. It is not registered in Question Studio and is not eligible for Question Bank writes, tests, mocks, learner/public publication, automatic student delivery or production release.
