# ENG-002 CP013 — Sentence Improvement: Common Usage / Idiomatic Grammar — Source Audit V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY_REGISTERED__POST_APPROVAL_GATE_PENDING`

## Donor authority

ENG-002 CP013 reuses the explicitly human-reviewed ENG-001 CP013 grammar authority and all 60 authored donor scenes. The donor checkpoint is Common Usage / Idiomatic Grammar and contains nine controlled competitive-exam usage families.

## Rule coverage

- `GR-USG-001` — prefer X to Y
- `GR-USG-002` — senior/junior to
- `GR-USG-003` — conservative exam surface different from
- `GR-USG-004` — capable of + noun/-ing
- `GR-USG-005` — insist on + noun/-ing
- `GR-USG-006` — prevent + object + from + -ing
- `GR-USG-007` — despite / in spite of
- `GR-USG-008` — no sooner ... than
- `GR-USG-009` — hardly/scarcely ... when

All nine rules appear at Easy, Medium and Hard. Review coverage is 20 Easy + 20 Medium + 20 Hard.

## Ambiguity policy

This checkpoint inherits the donor ambiguity guards and does not revive coaching-book traps whose acceptability depends on dialect or construction.

- `different to` and `different than` are not keyed as errors or used as wrong distractors. Only clearly excluded variants such as `different with/of/against` are used.
- omission of `from` after `prevent` is not itself used as the keyed error; the donor scenes use an excluded to-infinitive construction.
- `would prefer ... rather than ...` and `prefer to do ... rather than ...` are outside this checkpoint.
- valid `insist that + clause` is outside the `insist on + noun/-ing` rule.

## Sentence Improvement transformation

Each donor scene becomes an intact Sentence Improvement item with:

- a focused donor-owned replacement target, except `despite / in spite of` where the full donor segment is retained to avoid misleading insertion/deletion spans;
- three deterministic rule-aware replacement choices;
- option D always `No improvement`;
- deterministic No-improvement cadence: every fourth scene, exactly 5 per difficulty;
- no slash segmentation.

The focused replacement-span remediation splits unchanged prefix/suffix text away from the learner target so the underlined text exactly matches the replacement choices. Punctuation remains outside the underlined target.

## Explanation policy

Every explanation follows:

1. correction or No-improvement decision;
2. simple `Concept:` statement from the canonical rule;
3. sentence-specific `Here:` explanation from the donor scene;
4. full `Correct sentence:`.

No option-by-option analysis or shortcut/trap language is used.

## Approval boundary

The exact human-approved review is pinned by `ENG002_CP013_HUMAN_EDITORIAL_APPROVAL_V1` to:

- reviewed generator head: `498f6f00cde937c2e43cd85d81c9a174ddabeec3`;
- approved review Markdown SHA-256: `1bb5ac9f566eced397ed6754eda4645762826d821c21a85a37ffb57c64b823bc`;
- approved workflow artifact digest: `sha256:b9e60267f76af420fe998a9683de2595216fa145f01a7957bf901dc61291b572`.

Explicit human editorial approval was granted on 2026-09-17. Any learner-facing generator change after the approved head requires a new review artifact and new approval.

## Automated validation

The dedicated CP013 post-approval gate validates:

- 2,000 deterministic generations per difficulty (6,000 total);
- deterministic replay;
- option uniqueness and answer-position balance;
- all nine rules and broad semantic-domain reachability;
- all 60 deterministic review scenes;
- exact focused target-span integrity;
- Question Studio review-only lifecycle behavior;
- review Markdown materialization; and
- the API server build.

## Lifecycle

Question Studio review-only registration is authorized. Learner-facing release remains locked.

- `questionStudioReviewOnlyAuthorized: true`
- `questionBankWritable: false`
- `testEligible: false`
- `mockTestEligible: false`
- `publiclyPublishable: false`
- `automaticStudentPublication: false`
- `productionReleaseAuthorized: false`
- revision policy: `SOURCE_GENERATOR_ONLY`
