# ENG-001 CP008 — Nouns & Quantifiers — Source Audit V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY_REGISTERED__PRODUCTION_LOCKED`

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
- verified QL001 source-answer spread: A=9, B=24, C=19, D=8
- QL002 exercises A, B and C
- difficulty comes from structural distance and sentence complexity rather than obscure vocabulary
- explanations state the sentence-specific rule and full corrected sentence
- no option-by-option analysis or test-taking jargon

## Approved review authority

- Human editorial approval: explicit, 2026-09-13
- Review artifact: `ENG-001-CP008-REVIEW-V1.md`
- Review SHA-256: `d700c67cfa22a1573cd381e2000f84d3d24200354b877d93c0ac2c9736bf36c0`
- Approved content head: `72c9d800c7787da29dca5703101a0a3e9714bc8e`
- Authority: `ENG-001-CP008-HUMAN-EDITORIAL-APPROVAL-V1`

## Automated validation

The approved source passed 9,000 deterministic stress generations, the complete rule × difficulty × QL matrix, 60-scene exact-one-mutation validation, deterministic review export, CP007 generator regression and API build. The post-approval integration gate additionally verifies the CP008 Question Studio adapter, CP007 Question Studio regression, API build and admin typecheck.

## Runtime lifecycle

CP008 is registered in shared `language-v1 / ENG-001` for Question Studio review generation only. Question Bank writes, test eligibility, mock-test eligibility, public publication, automatic learner delivery and production release remain locked. Defects must be fixed in the source generator and regenerated; the approved review output is not an editable source of truth.

Merge remains blocked until the post-approval Question Studio integration gate is green on the current head.
