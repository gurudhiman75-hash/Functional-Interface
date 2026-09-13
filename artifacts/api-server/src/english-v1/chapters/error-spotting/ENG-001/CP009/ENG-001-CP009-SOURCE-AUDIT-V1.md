# ENG-001 CP009 — Gerunds, Infinitives & Participles — Source Audit V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY_REGISTERED__PRODUCTION_LOCKED`

## Ownership

CP009 owns non-finite verb-form selection: gerund complements, to-infinitive complements, bare infinitives, purpose infinitives, the `used to` / `be used to` contrast, meaning-sensitive gerund-vs-infinitive patterns, and participle form inside otherwise well-attached non-finite structures.

CP009 does **not** own:
- preposition choice itself (CP005);
- adjective/adverb comparison (CP006);
- conjunction or parallelism (CP007);
- noun/quantifier rules (CP008);
- modifier placement, attachment or dangling modifiers (CP010);
- finite voice/narration transformations (CP012).

This boundary is deliberate: a CP009 mutation may change the verb form after an already-correct preposition, but it must not create a second keyed preposition error or a modifier-placement error.

## Source-audit inputs

The V1 rule inventory was checked against:
- Cambridge English Grammar Today, **Verb patterns: verb + infinitive or verb + -ing?**
- Cambridge English Grammar Today, **Infinitives with and without to**
- Cambridge English Grammar Today, **Verb forms**
- competitive-exam error-spotting material, including an SSC GD 2026 official-paper item surfaced by Testbook in which the tested defect was an invalid verb-complement pattern;
- Testbook/S. Chand error-spotting material showing the common `object + to-infinitive` competitive-exam pattern.

These sources confirm that real competitive-exam error spotting tests complement form, bare/to-infinitive selection, gerund selection and closely related non-finite constructions. V1 does not copy source questions; it uses independently authored semantic scenes.

## Rule coverage

- GR-GIP-001: verbs that require a gerund complement
- GR-GIP-002: verbs that require a to-infinitive complement
- GR-GIP-003: verb + object + to-infinitive
- GR-GIP-004: make/let + object + bare infinitive in active constructions
- GR-GIP-005: modal + bare infinitive
- GR-GIP-006: gerund after an already-correct preposition
- GR-GIP-007: `used to + base` vs `be/get/become used to + gerund`
- GR-GIP-008: to-infinitive of purpose
- GR-GIP-009: meaning-sensitive `remember` / `stop` gerund-vs-infinitive patterns
- GR-GIP-010: participle form in non-finite structures, without testing modifier placement

## Depth and quality

- 60 authored semantic scenes: 20 Easy, 20 Medium, 20 Hard
- two scenes per rule per difficulty
- QL001, QL002 and QL007 supported
- deterministic generation and replay
- exactly one canonical mutation per invalid scene
- four-part authored source segmentation; QL002 deterministically reshapes to three learner-visible parts
- exact QL001 source-answer spread at every difficulty: A=5, B=5, C=5, D=5
- difficulty comes from dependency distance, clause structure and meaning discrimination rather than obscure vocabulary
- explanations name the sentence-specific rule and show the full corrected sentence
- no option-by-option analysis, shortcut language or test-taking jargon

## Ambiguity controls

- verbs that freely accept both gerund and infinitive with little or no meaning difference are excluded from rules that require a single form;
- meaning-shift questions use explicit chronology or purpose cues;
- the preposition is held constant in GR-GIP-006 so CP005 is not retested;
- active `make/let` structures are used so passive causative behavior does not overlap later voice work;
- participle questions test form only; attachment and dangling-modifier defects remain CP010;
- ambiguous participial parses found during the V1 self-audit were removed at source level before V2 human review.

## Approved review authority

- Human editorial approval: explicit, 2026-09-13
- Review artifact: `ENG-001-CP009-REVIEW-V2.md`
- Review SHA-256: `6a59e8cdbc1b1b061205a55690e68fc76724ffd7b24f2cecfdce8de5368e465f`
- Approved generator head: `044ec531bbe9f3c0efd6a39596359bab4bd30857`
- Authority: `ENG-001-CP009-HUMAN-EDITORIAL-APPROVAL-V1`
- CI regenerates the V2 artifact and verifies this SHA byte-for-byte.

## Automated validation

The approved source passed the 9,000 deterministic stress-generation matrix, the complete rule × difficulty × QL matrix, exact-one-mutation validation across all 60 scenes, CP008 generator regression and API build. The post-approval gate additionally verifies the CP009 Question Studio adapter, CP008 Question Studio regression, the approved V2 review SHA, API build and admin typecheck.

## Runtime lifecycle

CP009 is registered in shared `language-v1 / ENG-001` for Question Studio review generation only. Question Bank writes, test eligibility, mock-test eligibility, public publication, automatic learner delivery and production release remain locked. Review approval does not convert an item into learner-facing content.

Defects must be fixed in the source generator and regenerated. The approved review artifact is an immutable audit target, not an editable source of truth.
