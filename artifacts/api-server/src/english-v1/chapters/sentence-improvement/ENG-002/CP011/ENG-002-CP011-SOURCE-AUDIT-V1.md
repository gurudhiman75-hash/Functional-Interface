# ENG-002 CP011 — Sentence Improvement: Conditionals — Source Audit V1

Status: `IMPLEMENTED__AUTOMATED_REVIEW_GATE_PENDING__HUMAN_REVIEW_REQUIRED__NOT_QUESTION_STUDIO_REGISTERED`

## Grammar authority

ENG-002 CP011 reuses the canonical human-approved ENG-001 CP011 conditional grammar and its 60 closure-remediated semantic scenes. The older ENG-001 source-audit status text is stale; the canonical authority is `ENG-001-CP011-HUMAN-EDITORIAL-APPROVAL-V1`, which pins the approved donor generator/review and authorizes Question Studio review-only use.

ENG-001 owns the grammar/scene authority. ENG-002 owns the intact-sentence improvement surface, replacement distractors, No improvement balance, explanations and review artifact.

## Covered rule families

1. `GR-CND-001` — zero conditional / standing rule
2. `GR-CND-002` — first conditional real-future result
3. `GR-CND-003` — neutral future reference inside an if-clause
4. `GR-CND-004` — second conditional / unreal present or future
5. `GR-CND-005` — third conditional / unreal past
6. `GR-CND-006` — mixed past condition → present result
7. `GR-CND-007` — mixed present state → past result
8. `GR-CND-008` — `unless` as a negative condition
9. `GR-CND-009` — inverted third conditional with `Had`
10. `GR-CND-010` — formal `Should/Were` inversion

Easy uses only the donor-approved core families `001–005` and `008`. Mixed conditionals and formal inversion remain Medium/Hard only.

## Learner surface

- one intact sentence with one underlined conditional clause/result segment;
- the full authored segment is retained when shrinking the target would hide the time relationship or inversion structure;
- three real-word replacement choices plus D. `No improvement`;
- deterministic approximately 25% No improvement and exactly five of twenty per difficulty in the review corpus;
- no slash segmentation and no fabricated forms.

## Distractor policy

Distractors stay within the conditional relationship being tested. They vary tense/modal structure, time relation, `unless` polarity or inversion structure. Alternative forms that would create a defensible second interpretation must be rejected during learner-facing review and fixed in the generator source before regeneration.

## Explanation standard

Every explanation follows: error/no-improvement → simple conditional concept → sentence-specific application → complete corrected sentence. No option-by-option analysis, shortcut language or generic closing clutter.

## Review and validation

The deterministic review uses all 60 approved donor scenes: 20 Easy, 20 Medium and 20 Hard. Stress validation generates 2,000 questions per difficulty and checks deterministic replay, four unique options, No-improvement distribution, answer-position balance, rule/domain reachability and explanation/learner-surface integrity.

## Lifecycle

Review-only until explicit human editorial approval of the generated ENG-002 CP011 review artifact. CP011 must not be registered in Question Studio, written to Question Bank, used in tests/mocks, published publicly or released to production before that approval. Revisions are source-generator-only.
