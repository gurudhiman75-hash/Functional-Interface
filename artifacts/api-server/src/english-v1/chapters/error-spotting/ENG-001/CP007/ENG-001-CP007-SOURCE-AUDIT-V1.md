# ENG-001 CP007 — Conjunctions & Parallelism — Source Audit V1

Status: `HUMAN_APPROVED__AUTOMATED_VALIDATION_GREEN__QUESTION_STUDIO_REVIEW_ONLY_REGISTERED__MERGE_READY`

## Scope

CP007 owns conjunction choice, standard correlative conjunction pairs, because/because of, despite/although, and parallel structure in coordinated or correlative constructions.

It does **not** own subject–verb agreement after either/or or neither/nor (CP001), adjective/preposition collocations (CP005), modifier placement (CP010), or noun/quantifier rules (CP008).

## Rule coverage

- GR-CON-001: coordinating conjunction by relation
- GR-CON-002: both ... and
- GR-CON-003: either ... or
- GR-CON-004: neither ... nor
- GR-CON-005: not only ... but also
- GR-CON-006: although/though without redundant but
- GR-CON-007: because vs because of
- GR-CON-008: despite/in spite of vs although
- GR-CON-009: parallel structure in coordinated lists
- GR-CON-010: parallel structure after correlative conjunctions

## Authored source depth

- 60 semantic scenes total
- 20 Easy
- 20 Medium
- 20 Hard
- 10 rule families
- QL001, QL002 and QL007 supported
- deterministic seed replay
- review-only metadata
- source-level exact-one-mutation contract
- full corrected sentence in explanations
- curated V2 learner-facing part boundaries

## Approved review authority

Human editorial approval was explicitly given on 2026-09-13.

- artifact: `ENG-001-CP007-REVIEW-V1.md`
- artifact SHA-256: `c7443c9deaf95b91855d67c44d42f856e5eb916ef3cf41bc1578a29c444c8817`
- approved content head: `5d8834a241c44b65ce1c95988afba7b05e054543`
- authority: `ENG-001-CP007-HUMAN-EDITORIAL-APPROVAL-V1`

## Automated validation

Final V2 and post-approval integration gates are green:
- 9,000 deterministic stress generations across Easy/Medium/Hard
- deterministic replay
- rule × difficulty × QL matrix
- all 60 source mutations verified as exactly one changed canonical segment
- QL001 source-answer spread: A=7, B=22, C=17, D=14
- QL002 answer positions exercise A, B and C
- deterministic 60-question human-review artifact generated successfully
- CP007 Question Studio adapter integration green
- approved CP006 regression green
- older ENG-001 package regressions updated and green
- API build green
- admin TypeScript check green
- integrated-admin production safeguards and full build green

## Question Studio lifecycle

CP007 is registered in the shared `language-v1 / ENG-001` package for review-only generation. The package now exposes CP001–CP007 and all ten `GR-CON-*` rules for CP007.

The following remain locked:
- Question Bank writes
- test eligibility
- mock-test eligibility
- public publication
- automatic learner delivery
- production release

Any future CP007 defect must be fixed in source/generator code and regenerated; the approved review artifact is immutable evidence of the reviewed candidate.
