# ENG-002 CP011 — Sentence Improvement: Conditionals — Source Audit V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY_REGISTERED__POST_APPROVAL_GATE_PENDING`

## Grammar authority

ENG-002 CP011 reuses the canonical human-approved ENG-001 CP011 conditional grammar and its 60 closure-remediated semantic scenes. The canonical donor authority is `ENG-001-CP011-HUMAN-EDITORIAL-APPROVAL-V1`.

ENG-001 owns the grammar/scene authority. ENG-002 owns the intact-sentence improvement surface, replacement distractors, No improvement balance, explanations and review artifact. Question Studio uses the reviewed/remediated CP011 generator so the source-level fixes accepted in human review remain active at runtime.

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

Distractors stay within the conditional relationship being tested. They vary tense/modal structure, time relation, `unless` polarity or inversion structure. Learner-facing review identified malformed mixed/inversion transformations in early artifacts; these were fixed in source and regression-locked before approval. The approved corpus is generated only after that remediation layer.

## Explanation standard

Every explanation follows: error/no-improvement → simple conditional concept → sentence-specific application → complete corrected sentence. No option-by-option analysis, shortcut language or generic closing clutter.

## Review and validation

The deterministic review uses all 60 approved donor scenes: 20 Easy, 20 Medium and 20 Hard. Stress validation generates 2,000 questions per difficulty and checks deterministic replay, four unique options, No-improvement distribution, answer-position balance, rule/domain reachability and explanation/learner-surface integrity.

The exact human-approved review is pinned by `ENG002_CP011_HUMAN_EDITORIAL_APPROVAL_V1` to reviewed generator head `6675cae8bc153173a82c7d51a3661622b6d85bf6`, Markdown SHA-256 `926e2b5589e1bb573d820e9bc3e9b3994e5754f37dce38e1d916283025468d98`, and workflow artifact digest `sha256:c5c12b905365763ae3bc5084470bfb507d5064ad85322d701888df2183db3cb9`.

## Lifecycle

Explicit human editorial approval was granted on 2026-09-16. Question Studio registration is review-only under `SOURCE_GENERATOR_ONLY`; Question Bank writes, tests, mocks, public publication, automatic student publication and production release remain locked. Merge remains gated on the post-approval generator + adapter + API validation.
