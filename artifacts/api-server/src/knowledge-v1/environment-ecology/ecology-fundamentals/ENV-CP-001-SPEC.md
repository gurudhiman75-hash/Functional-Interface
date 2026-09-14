# ENV-CP-001 — Ecology Fundamentals Implementation Spec

**Chapter:** ENV-001 Environment & Ecology  
**CP:** ENV-CP-001 Ecology Fundamentals  
**Lifecycle:** APPROVED / CONTENT-FROZEN  
**Approved review version:** V4 simplified language  
**Runtime registration:** eligible for shared Environment package binding  
**Languages in this checkpoint:** English review surface only; canonical facts are locale-neutral.

## Scope

This CP establishes the vocabulary and levels of ecological organisation needed by the rest of the Environment chapter.

Included:
- ecology and environment
- organism, species, population and community
- ecosystem, biome and biosphere
- habitat and ecological niche
- ecotone and edge effect
- ecological organisation from organism to biosphere

Explicitly deferred to later CPs:
- ecosystem producers/consumers/decomposers (ENV-CP-002)
- food chains, food webs and trophic levels (ENV-CP-003)
- nutrient cycles (ENV-CP-004)
- biome-specific climate/vegetation facts (ENV-CP-005)
- biodiversity categories and conservation status (ENV-CP-006 onward)

## Design goals

1. Questions use short competitive-exam language rather than textbook-heavy wording.
2. Closely related terms are distinguished by meaning, not giveaway distractors.
3. Population questions retain the same-species condition; community questions require multiple populations/species.
4. Habitat is the place an organism lives; niche is its functional role, resource use and interactions.
5. Ecosystem includes interaction with the physical environment; community alone does not.
6. Biome is a large regional ecological unit; biosphere is the global zone of life.
7. Ecotone is the transition zone between adjoining ecological communities/ecosystems; edge effect is the boundary-related ecological change.
8. Standard instruction stems may repeat, but the underlying tested relation must not be duplicated.
9. V4 is the approved learner-facing wording baseline for stems and explanations.

## QL inventory

| QL | Family | Primary operation | Difficulty |
|---|---|---|---|
| ENV-001-QL-001 | Term identification | definition → ecological term | Easy |
| ENV-001-QL-002 | Definition identification | term → definition | Easy |
| ENV-001-QL-003 | Ecological level from scenario | scenario → organism/population/community/ecosystem | Easy/Medium |
| ENV-001-QL-004 | Habitat vs niche | clue → habitat/niche | Medium |
| ENV-001-QL-005 | Organisation order | arrange ecological levels | Medium |
| ENV-001-QL-006 | Neighbouring-level relation | compare adjacent levels | Medium |
| ENV-001-QL-007 | Ecotone and edge effect | boundary clue → concept | Medium |
| ENV-001-QL-008 | Correct pair | term ↔ meaning | Medium |
| ENV-001-QL-009 | Incorrect pair | detect wrong term ↔ meaning | Medium |
| ENV-001-QL-010 | Two-statement evaluation | verify related concepts | Medium |
| ENV-001-QL-011 | Three-statement count | evaluate three concepts | Hard |
| ENV-001-QL-012 | Concept distinction | distinguish confusing pairs | Hard |

## Canonical organisation order

`Organism → Population → Community → Ecosystem → Biome → Biosphere`

Species is a taxonomic/biological grouping used in population definition and is not inserted as a spatial ecological level in this sequence.

## Fact integrity rules

- Every canonical term has one primary definition and a compact review definition.
- Distractors come from the same ecology-fundamentals term pool.
- Scenario questions are stored separately from definitions so wording does not distort canonical facts.
- No current count, office-holder, protected-area status or mutable conservation fact is present.
- All facts in this CP are classified as stable/immutable for generation.

## Approved review gate

The approved V4 surface satisfies:
- 48 review questions;
- all 12 QLs represented;
- Easy, Medium and Hard coverage;
- all four correct-option positions used;
- no duplicate options inside a question;
- source IDs and source-fact IDs retained;
- no repetitive filler such as `associated with`;
- concise stems and explanations;
- human approval on 2026-09-14.

Review-only artifacts may continue to carry `runtimeRegistered: false`; production/package registration is handled separately from review rendering.

## Source policy

The CP uses standard school-level ecology definitions as the canonical layer, anchored to NCERT Biology ecology chapters. These concepts are stable; later Environment CPs containing counts, protected-area notifications or conservation-status data will use update-sensitive source controls.
