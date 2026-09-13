# ENG-001 CP009 — Gerunds, Infinitives & Participles — Source Audit V1

Status: `REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

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

## Depth and quality target

- 60 authored semantic scenes: 20 Easy, 20 Medium, 20 Hard
- two scenes per rule per difficulty
- QL001, QL002 and QL007 supported
- deterministic generation and replay
- exactly one canonical mutation per invalid scene
- four-part authored source segmentation; QL002 deterministically reshapes to three learner-visible parts
- QL001 source-answer spread intentionally bounded across A/B/C/D
- difficulty comes from dependency distance, clause structure and meaning discrimination rather than obscure vocabulary
- explanations name the sentence-specific rule and show the full corrected sentence
- no option-by-option analysis, shortcut language or test-taking jargon

## Ambiguity controls

- verbs that freely accept both gerund and infinitive with little or no meaning difference are excluded from rules that require a single form;
- meaning-shift questions use explicit chronology or purpose cues;
- the preposition is held constant in GR-GIP-006 so CP005 is not retested;
- active `make/let` structures are used so passive causative behavior does not overlap later voice work;
- participle questions test form only; attachment and dangling-modifier defects remain CP010.

## Runtime lifecycle

CP009 V1 is a human-review candidate only. It is not registered in Question Studio and is not eligible for Question Bank writes, tests, mocks, public publication, automatic learner delivery or production release.

Any human-review defect must be corrected at source/generator level and the review artifact regenerated. Human approval is required before Question Studio review-only registration or merge to `New-main`.
