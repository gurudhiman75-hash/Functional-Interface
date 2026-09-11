# GEO-RIV-001 CP012 — Important Cities/Places on Rivers — V1 Spec

Status: REVIEW CANDIDATE

## Scope

CP012 covers only exam-relevant, source-backed city/place ↔ river associations.

Canonical relation:
- `city_on_river`

This relation means the city is conventionally described by an authoritative geographic source as situated on, beside, or directly associated with the named river. It must not be inferred from basin membership, district drainage, nearby tributaries, or state-level river presence.

## V1 corpus

17 cities, 18 city–river relations covering major exam anchors across the Ganga, Yamuna, Godavari, Cauvery, Sabarmati, Tapi, Narmada, Mahanadi, Jhelum, Brahmaputra, Krishna and Hooghly rivers.

Prayagraj intentionally has two true relations: River Ganga and River Yamuna.

Reverse river→city tasks may use only cases that have one eligible answer in the current qualified pool. Multi-river or multi-city ambiguity must never be hidden by generator wording.

## QLs

- QL101 city → river
- QL102 river → city with unique-answer filtering
- QL103 correctly matched city–river pair
- QL104 incorrectly matched city–river pair
- QL105 city + state clue → river
- QL106 two cities sharing the same river
- QL107 Statement I/II
- QL108 three-statement count
- QL109 three-city match task

## Diversity contract

The review batch must contain six semantically distinct payloads per QL. Changing only distractors does not count as question variety.

QL107 and QL108 may not repeat the same city within a question. QL109 must use three distinct cities and three distinct rivers so that exactly one complete mapping is true.

## Display policy

Every learner-facing proper river name must use `River + name`, e.g. `River Ganga`, `River Yamuna`, `River Brahmaputra`.

The prefix rule applies to stems, options, matched pairs, canonical displayed answers and explanations. Internal canonical entity labels remain bare river names.

## Explanations

Explanations must state the city–river relation directly and add useful state/location context where it improves recall. They must remain concise and beginner-readable and must not contain implementation vocabulary such as corpus, source fact, review-only, trap or shortcut.

## Validation

Every generated question must pass:
- source provenance
- relation-direction validation
- unique-answer validation
- option distinctness
- distractor truth-collision checks
- six-distinct-payloads-per-QL audit
- no repeated city inside statement-composition questions
- learner-facing River-prefix audit
- explanation-answer consistency
- deterministic replay
- review-only lifecycle guard

Statement and match tasks must be recomputed independently from the canonical relation matrix.

## Lifecycle

Review-only until explicit human approval. No Question Studio registration, Question Bank promotion, test/mock eligibility, production publication or merge into `New-main` before approval.
