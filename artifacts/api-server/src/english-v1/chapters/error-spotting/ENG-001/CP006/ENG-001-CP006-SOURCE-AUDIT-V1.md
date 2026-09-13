# ENG-001 CP006 — Adjectives, Adverbs and Comparison — Source and Coverage Audit V1

Status: `AUTOMATED_VALIDATION_PASSED__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Scope

CP006 implements exam-standard adjective, adverb and degree-of-comparison error spotting through a verified correct construction followed by exactly one registered invalid transformation. It does not use a free-form LLM to decide grammatical correctness.

Covered rule families:

1. `GR-CMP-001` — adverb of manner after an action verb
2. `GR-CMP-002` — adjective after a linking verb
3. `GR-CMP-003` — positive degree in `as ... as`
4. `GR-CMP-004` — comparative degree with `than`
5. `GR-CMP-005` — definite article with ordinary superlatives
6. `GR-CMP-006` — `one of the + superlative + plural noun`
7. `GR-CMP-007` — no double comparative
8. `GR-CMP-008` — no double superlative
9. `GR-CMP-009` — standard comparative intensifiers
10. `GR-CMP-010` — high-frequency irregular degrees of comparison

## Ownership boundaries

CP006 deliberately does not absorb nearby grammar that belongs elsewhere in the English blueprint:

- `fewer/less`, `many/much`, `few/a few`, `little/a little` and other quantifier-number rules remain CP008.
- dangling, misplaced and squinting modifiers remain CP010.
- adjective/preposition collocations remain CP005.
- coordination and parallel comparison structures remain CP007 where conjunction/parallelism is the governing error.

This prevents duplicate rule ownership and contradictory mutations across checkpoints.

## Deliberate exclusions

V1 excludes disputed gradability of absolute adjectives, farther/further style distinctions, elder/older contextual conventions, informal intensifier patterns, literary double comparatives, dialect-sensitive adjective/adverb choices, and constructions whose correctness depends mainly on meaning not recoverable from the sentence.

## Sentence inventory and editorial hardening

The final V4 catalog contains 60 authored semantic scenes:

- Easy: 20
- Medium: 20
- Hard: 20

Scenes use ordinary competitive-exam contexts across education, banking, administration, healthcare, agriculture, transport, technology, audit, research, manufacturing, infrastructure, public service, commerce, environment, planning and other neutral domains. No local city-name pool is used.

V4 includes the completed editorial hardening pass. It removes fabricated or giveaway irregular forms, rejects awkward comparison wording, replaces runtime word-splitting with authored learner-facing part boundaries, and keeps final sentence order natural even when that means answer positions are not mathematically identical in frequency.

QL001 source answer positions on the final validated catalog are:

- A: 9
- B: 14
- C: 23
- D: 14

All four positions remain materially represented. QL002 validation exercises A, B and C after deterministic whole-part merging; the keyed error part is never merged away.

## Difficulty policy

Difficulty is structural rather than lexical:

- Easy structural score: 6
- Medium structural score: 11
- Hard structural score: 16
- Hard lexical load: 1

Easy questions keep the governing relation close. Medium questions introduce more competing descriptive material. Hard questions use longer dependencies and closer grammatical distractors while retaining ordinary vocabulary. Rules that are intrinsically easy to spot, such as double comparison forms, are not made artificially difficult through obscure vocabulary.

## Question-family mapping

CP006 supports the shared ENG-001 families:

- `ENG-001-QL001` — identify the erroneous part
- `ENG-001-QL002` — identify the erroneous part with No error option
- `ENG-001-QL007` — verified valid sentence / No error

Fixed exam-style stems are retained. QL002 deterministically reduces four authored segments to three learner-visible parts without losing the keyed error. QL007 uses the verified correct base sentence.

## Explanation policy

Explanations are sentence-specific and beginner-readable. They identify the keyed part, explain the applicable grammar in plain language, and show the full corrected sentence. They do not use option-by-option analysis, shortcut language, trap language or test-taking jargon.

## Validation result

Final validation passed on branch `feature/eng-001-cp006-adj-adv-comparison-v1`.

The enforced gate includes:

- 3,000 deterministic generations per difficulty: 9,000 total.
- deterministic replay.
- rule × difficulty × QL matrix coverage.
- exactly-one-mutation and error-index integrity.
- QL001/QL002/QL007 contracts.
- answer-position coverage checks.
- heavy-vocabulary and artificial-form bans.
- explicit editorial regression bans for defects found during review.
- deterministic 60-question human-review artifact exposing all 60 authored invalid mutations.
- approved CP005 generator regression.
- API server build.
- admin-app TypeScript check.

All CP006 workflow steps passed on the final source head.

## Human-review gate

CP006 remains outside Question Studio registration and all learner-facing routes until the deterministic review artifact receives explicit human editorial approval. Defects must be corrected in the grammar rule, source catalog, generator or validator and then regenerated; review output must never be hand-patched.

## Lifecycle gate

Current gate:

`CP006_V1_AUTOMATED_VALIDATION_PASSED__HUMAN_REVIEW_PENDING__READY_FOR_EDITORIAL_APPROVAL__NOT_QUESTION_STUDIO_REGISTERED`

Locked until approval:

- Question Studio registration
- Question Bank writes
- test eligibility
- mock-test eligibility
- public publication
- automatic learner delivery
- production release
