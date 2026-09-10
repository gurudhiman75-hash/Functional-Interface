# ENG-001-CP001 — V4 Production-Scale Diversity Audit

Status: `V4_CAPACITY_GATE__CI_GREEN__HUMAN_REVIEW_PENDING`

## Purpose

V4 makes sentence diversity a generator-level contract rather than a review-file preference. It is the production candidate for ENG-001 CP001 and replaces the earlier exploratory V1–V3 implementations.

## What counts as a semantic scene

A semantic scene contains a coherent subject, singular/plural verb pair, object or complement, sentence tail, and compatible modifier choices. Merely replacing one noun with another in the same sentence frame is not counted as a new semantic scene.

V4 stores 8 subject families in each of 20 unrelated standard domains. Every family contains 4 different predicate situations. This creates **640 complete semantic scenes** before grammar-rule transformation.

The production generator does **not** append generic context suffixes merely to inflate surface count. Each authored scene carries its own meaningful context.

## Semantic domains

1. Education
2. Transport
3. Commerce
4. Science
5. Sports
6. Public service
7. Technology
8. Environment
9. Hospitality
10. Healthcare
11. Agriculture
12. Media
13. Household
14. Infrastructure
15. Banking
16. Manufacturing
17. Energy
18. Postal
19. Culture
20. Emergency service

Local city/place names are excluded.

## Structural catalogs

Rules that cannot safely reuse a normal subject/action scene have dedicated V4 catalogs:

- additive agreement (`along with`, `together with`, `as well as`): **80 pair scenes**;
- proximity agreement (`either...or`, `neither...nor`): the same 80 semantically compatible pair scenes, with controlled nearer-subject realizations;
- `the number of`: controlled count structures derived from compatible scene material;
- intervening-subject agreement: **80 dedicated scenes**;
- collective nouns: **12 explicit unit-reading scenes + 12 explicit member-reading scenes**.

## Canonical capacity

The current deterministic V4 engine exposes a conservative lower bound of:

**13,464 canonical candidate variants before QL shaping.**

This figure deliberately does not multiply by instruction wording, option layout, or cosmetic context suffixes. It therefore represents structural/question-content capacity rather than presentation inflation.

The latest 20,000-seed CI diagnostics observed the following distinct corrected sentence surfaces in the sampled generator space:

| Difficulty | Distinct observed surfaces | Semantic domains represented |
| --- | ---: | ---: |
| Easy | 1,920 | 20 |
| Medium | 3,546 | 20 |
| Hard | 1,915 | 20 |

The domain distribution remained broad in every difficulty sample; no single domain approached a dominant share.

## Question directions

Direction wording is intentionally standardized instead of treated as a diversity source:

- QL001: `Identify the part of the sentence that contains an error.`
- QL002 / QL007: the same instruction plus `If there is no error, select 'No error'.`

The diversity budget is spent on actual sentence situations and grammatical structures, not superficial instruction rewrites.

## Difficulty and editorial policy

- Easy uses direct agreement with little structural concealment.
- Medium introduces stronger distractors, distance, or agreement constructions.
- Hard derives difficulty from dependency distance, competing nouns, proximity structures, collective readings, and rule complexity.
- Obscure vocabulary is not used to manufacture Hard questions.
- `lexicalLoad` remains a guardrail rather than a positive difficulty signal.
- A dedicated plain-language realization layer removes avoidable domain jargon and selected awkward collocations without changing the agreement target.
- Error explanations use one short reason followed by `Use “...”`; No-error explanations explicitly state that the existing verb is correct.

## Automated gates

The V4 workflow currently passes all of the following:

- at least 640 complete semantic scenes;
- all 20 semantic domains;
- at least 32 base scenes per domain;
- at least 80 pair scenes;
- at least 80 intervening scenes;
- separate collective-unit and collective-member pools;
- at least 13,000 canonical variants;
- deterministic regeneration;
- exactly one registered mutation;
- rule/mutation consistency;
- structural difficulty derivation;
- Hard lexical-load ceiling;
- fixed exam-style instruction stems;
- QL002 error-segment preservation;
- calibrated No-error admission;
- non-empty visible segments;
- heavy-vocabulary and explanation-jargon guardrails;
- concise direct correction wording;
- explanation/corrected-sentence consistency;
- machine-like repeated-predicate checks;
- selected awkward-collocation regression checks found during human-style review;
- large-sample diversity thresholds;
- all 20 domains in each difficulty stress sample;
- domain-balance guardrails;
- byte-for-byte equality between the deterministic review exporter and the frozen review artifact.

## Human review artifact

The V4 review exporter produces **60 questions: 20 Easy, 20 Medium, 20 Hard**. It targets all 20 semantic domains once in each difficulty section before a domain is reused.

The final frozen sample incorporates the plain-language human-style review pass. Question Studio/publication wiring remains blocked until this V4 review is explicitly approved.
