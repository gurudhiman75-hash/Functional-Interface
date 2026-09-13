# ENG-001 CP007 — Conjunctions & Parallelism — Source Audit V1

Status: `IMPLEMENTED_V1__AUTOMATED_VALIDATION_GREEN__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

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

## Automated validation

Final V2 gate is green:
- 9,000 deterministic stress generations across Easy/Medium/Hard
- deterministic replay
- rule × difficulty × QL matrix
- all 60 source mutations verified as exactly one changed canonical segment
- QL001 source-answer spread: A=7, B=22, C=17, D=14
- QL002 answer positions exercise A, B and C
- deterministic 60-question human-review artifact generated successfully
- approved CP006 regression green
- API build green

Review artifact: `ENG-001-CP007-REVIEW-V1.md`.

## Quality contract

Questions should read like normal SSC/Banking error-spotting sentences. Difficulty comes from structural dependency, sentence length and distractor similarity rather than obscure vocabulary. Explanations state the sentence-specific grammar reason and the full corrected sentence without option-by-option analysis or test-taking jargon.

The automated gate is complete, but human editorial approval is still required. Question Studio registration, Question Bank writes, tests, mock tests and learner publication remain locked until the separate approval/integration gate is deliberately opened.
