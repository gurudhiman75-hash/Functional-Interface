# ENG-003-CP011 — Grammar Fillers: Conditionals — Source Audit V1

Status: `HUMAN_APPROVED_V1__QUESTION_STUDIO_REVIEW_ONLY__LEARNER_RELEASE_LOCKED`

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

## Human approval

Approved on **2026-09-19**.

- Approval authority: `ENG-003-CP011-HUMAN-EDITORIAL-APPROVAL-V1`
- Approved generator head: `c9367293638e24eee3e2cd26df57100756f3a275`
- Review SHA-256: `22d8002778df5c5a16ab0a7737beb676f357a330bbd5086b002b848afdbc7686`
- Workflow artifact digest: `sha256:0c714fd0f2c0669160e69165c69f82228901067661b92a9a6bd6de6fe46914ef`

The approved explanation pass uses simplified exam-friendly language. Question Studio registration is review-only. Learner/test/mock/public release remains locked.
