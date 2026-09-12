# ENG-001 CP005 — Prepositions — Source and Coverage Audit V1

Status: `SOURCE_AUDIT_V1__IMPLEMENTED__CI_PENDING__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Scope

CP005 implements exam-standard preposition error spotting through verified correct sentence construction followed by exactly one registered invalid transformation. The implementation does not use a free-form LLM grammar judge.

Covered rule families:

1. `GR-PRP-001` — time: at / on / in
2. `GR-PRP-002` — place: at / on / in
3. `GR-PRP-003` — since / for
4. `GR-PRP-004` — by / until
5. `GR-PRP-005` — between / among
6. `GR-PRP-006` — in / into
7. `GR-PRP-007` — beside / besides
8. `GR-PRP-008` — adjective + preposition complements
9. `GR-PRP-009` — verb + preposition complements
10. `GR-PRP-010` — noun + preposition complements

## Deliberate exclusions

V1 excludes disputed or strongly dialect-dependent choices, loose idioms with multiple accepted prepositions, literary constructions, phrasal-verb questions whose primary test is lexical meaning rather than preposition grammar, and rare collocations that would make difficulty depend on vocabulary recall.

## Sentence-pattern inventory

The catalog contains 60 authored semantic scenes:

- Easy: 20
- Medium: 20
- Hard: 20

The scenes cover more than 20 ordinary exam domains including education, banking, transport, administration, healthcare, agriculture, technology, regulation, public service, research, infrastructure, safety, planning, labour and commerce.

No local city-name pool is used.

## Difficulty policy

Difficulty is structural rather than lexical:

- Easy structural score: 6
- Medium structural score: 11
- Hard structural score: 16
- Hard lexical load: 1

Hard questions use longer dependency spans and closer grammatical distractors while keeping vocabulary ordinary.

## Question-family mapping

CP005 supports the shared ENG-001 families:

- `ENG-001-QL001` — identify the erroneous part
- `ENG-001-QL002` — identify the erroneous part with No error option
- `ENG-001-QL007` — valid sentence / No error

Fixed exam-style stems are used. QL002 deterministically reduces four canonical segments to three learner-visible parts without losing the keyed error. QL007 uses the verified correct base sentence.

## Explanation policy

Explanations are question-specific and concise. They:

- identify the keyed part when an error exists;
- state the simple rule as it applies to that sentence;
- state the exact correction;
- show the full corrected sentence;
- avoid shortcut, trap and distractor-analysis language.

## Automated validation

The CP005 validator checks:

- exact CP and rule family;
- rule-to-mutation mapping;
- one changed canonical segment;
- error-index integrity;
- correction linkage;
- QL option contracts;
- full corrected-sentence integrity;
- explanation linkage;
- structural difficulty bands;
- Hard lexical-load ceiling;
- heavy-vocabulary and test-taking-jargon bans.

The stress test generates 3,000 questions per difficulty, verifies deterministic replay, validates every generated item and checks surface/rule/domain diversity. The matrix test covers every available rule × difficulty × QL combination.

## Human-review artifact

A deterministic exporter produces a 60-question Markdown review batch with 20 Easy, 20 Medium and 20 Hard questions. The review artifact is generated in CI and remains a review candidate until explicit human approval.

## Lifecycle gate

Current gate:

`CP005_V1_IMPLEMENTED__CI_PENDING__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

CP005 must not be registered in Question Studio, promoted to the Question Bank, used in tests or mock tests, or made publicly publishable before explicit human approval and the subsequent integration checkpoint.

Any defect found in human review must be corrected in the source catalog, grammar rule, generator or validator and then regenerated. Direct patching of review output is not an accepted revision path.
