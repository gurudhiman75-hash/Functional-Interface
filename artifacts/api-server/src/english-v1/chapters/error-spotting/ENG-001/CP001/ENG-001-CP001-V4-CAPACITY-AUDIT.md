# ENG-001-CP001 — V4 Production-Scale Diversity Audit

Status: `V4_CAPACITY_GATE__SIX_FIGURE_REALIZATION__CI_PENDING`

## Why V4 exists

V3 solved the immediate office/recruitment-context repetition, but its observed surface count was still too small for a production English question bank. V4 therefore treats diversity as an engine-level contract rather than a review-file preference.

## What counts as a semantic scene

A semantic scene contains a coherent subject, singular/plural verb pair, object or complement, sentence tail, and compatible modifier choices. Changing only `student` to `candidate` inside the same sentence is not counted as a new semantic scene.

V4 stores 8 subject families in each of 20 unrelated standard domains. Every family contains 4 different predicate situations. This creates **640 complete semantic scenes** before grammar-rule transformation.

V4 now also has a **domain-aware context-realization layer**. Every one of the 20 domains has **8 short, coherent situation contexts**. The selected context is attached only to a non-error segment, so it changes the sentence situation without changing the registered SVA mutation or hiding the answer.

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

Local city/place names are not used.

## Structural catalogs

The rules that cannot safely reuse a normal subject/action scene have dedicated V4 catalogs:

- additive agreement (`along with`, `together with`, `as well as`): **80 pair scenes**
- proximity agreement (`either...or`, `neither...nor`): the same 80 semantically compatible pair scenes, with separate singular/plural-nearer realizations
- `the number of`: derived from the 80 pair scenes with domain-specific count contexts
- intervening-subject agreement: **80 dedicated scenes**
- collective nouns: **12 explicit unit-reading scenes + 12 explicit member-reading scenes**

## Capacity

Before QL shaping or direction-stem variation, the original V4 structural catalog exposes this conservative lower bound of canonical candidate fingerprints:

| Difficulty | Conservative canonical variants |
|---|---:|
| Easy | 3,200 |
| Medium | 6,492 |
| Hard | 4,012 |
| **Total** | **13,704** |

Each candidate can now be realized in **8 domain-appropriate semantic contexts**. Therefore the conservative sentence-realization floor is:

**13,704 × 8 = 109,632 domain-coherent candidate/context realizations.**

This figure still does **not** multiply by QL001/QL002/QL007 shaping or by direction wording. Those are presentation variations, not counted as additional semantic capacity.

## Why the context layer is not cosmetic inflation

The context realization is part of the sentence content and is selected from the same semantic domain as the candidate. For example, a science sentence receives a laboratory/research/observation context, while a transport sentence receives a route/service/operation context. Context is never borrowed across unrelated domains.

The context is added to a non-error segment only. The correct and mutated versions receive the same context, preserving the invariant that exactly one registered SVA mutation determines the answer.

## Question-stem diversity

V4 keeps direction language natural rather than manufacturing hundreds of superficial instruction rewrites:

- QL001: 14 exam-style direction stems
- QL002: 10 three-part + `No error` direction stems
- QL007: 10 calibrated `No error` direction stems

The main diversity budget is therefore spent on sentence content, not cosmetic directions.

## Automated gates

`eng-001-cp001-v4.test.ts` enforces:

- at least 640 complete semantic scenes
- at least 20 semantic domains
- at least 32 scenes in every domain
- 8 domain-aware context realizations per domain
- at least 80 pair scenes
- at least 80 intervening scenes
- separate collective-unit and collective-member pools
- at least 13,000 canonical structural variants
- at least 100,000 conservative candidate/context realizations
- deterministic regeneration
- exactly one registered mutation
- rule/mutation consistency
- structural difficulty derivation
- Hard lexical-load ceiling
- QL002 error-segment preservation
- calibrated No-error admission
- non-empty visible segments
- explanation/corrected-sentence consistency
- large-sample observed surface thresholds
- all 20 domains present in each difficulty stress sample
- no single semantic domain above a 10% share in the 20,000-question stress sample

## Human review gate

The V4 review exporter produces **60 questions: 20 Easy, 20 Medium, 20 Hard**. It attempts to show all 20 semantic domains once in each difficulty section before any domain can repeat.

Question Studio/publication wiring remains blocked until the V4 review is approved.
