# ENG-001 CP008 — Nouns & Quantifiers — Source Audit V1

Status: `IMPLEMENTED_V1__AUTOMATED_VALIDATION_PENDING__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Ownership

CP008 owns noun countability, noun number forms and quantifier–noun compatibility. It does not own subject–verb agreement (CP001), article selection (CP003), comparison structures (CP006), conjunction/parallelism (CP007), or modifier placement (CP010).

## Rule coverage

- GR-NQN-001: many vs much
- GR-NQN-002: few/a few with plural countable nouns
- GR-NQN-003: little/a little with uncountable nouns
- GR-NQN-004: fewer vs less
- GR-NQN-005: number vs amount
- GR-NQN-006: uncountable nouns without ordinary plurals
- GR-NQN-007: irregular plural forms
- GR-NQN-008: plural-only nouns and pair(s) of
- GR-NQN-009: unit expressions with mass nouns
- GR-NQN-010: each/one of the + plural group noun

## Depth and quality

- 60 authored semantic scenes: 20 Easy, 20 Medium, 20 Hard
- two scenes per rule per difficulty
- QL001, QL002 and QL007 supported
- deterministic generation and replay
- exactly one canonical mutation per invalid scene
- curated four-part learner boundaries
- QL001 authored position target: A=8, B=22, C=22, D=8
- difficulty comes from structural distance and sentence complexity rather than obscure vocabulary
- explanations state the sentence-specific rule and full corrected sentence
- no option-by-option analysis or test-taking jargon

Question Studio registration, Question Bank writes, tests, mocks, public publication and production release remain locked until human editorial approval and the separate integration gate.
