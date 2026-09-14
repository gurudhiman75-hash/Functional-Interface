# ENV-CP-005 — Major Ecosystems & Biomes

**Chapter:** ENV-001 Environment & Ecology  
**CP:** ENV-CP-005 Major Ecosystems & Biomes  
**Lifecycle:** REVIEW CANDIDATE  
**Runtime registration:** blocked pending human approval  

## Scope

Included:
- forest, grassland and desert ecosystems
- freshwater and marine ecosystems
- tundra and taiga biomes
- broad climate and vegetation traits
- basic freshwater vs marine distinctions
- basic terrestrial-biome comparison
- simple applied biome identification

Deferred:
- biodiversity terminology and hotspots (ENV-CP-006 onward)
- protected areas and conservation
- pollution and climate-change impacts
- detailed species distributions or mutable protected-area facts

## Design rules

1. Stems stay short and exam-like.
2. Explanations state the identifying feature directly.
3. Questions test broad, stable biome/ecosystem characteristics rather than obscure regional trivia.
4. Desert is identified by low precipitation, not by temperature alone.
5. Tundra is characterised by very cold conditions, short growing season and permafrost; taiga by conifer-dominated boreal forest.
6. Freshwater has low salinity; marine ecosystems have high salinity and include seas and oceans.
7. Grasslands are dominated mainly by grasses; forests by tree cover.
8. Standard instruction stems may repeat when the tested relation differs.
9. All review questions remain `runtimeRegistered: false` until approval.

## QL inventory

| QL | Family | Difficulty |
|---|---|---|
| ENV-005-QL-001 | Ecosystem identification | Easy |
| ENV-005-QL-002 | Forest ecosystem | Easy |
| ENV-005-QL-003 | Grassland and desert | Easy |
| ENV-005-QL-004 | Freshwater ecosystem | Medium |
| ENV-005-QL-005 | Marine ecosystem | Medium |
| ENV-005-QL-006 | Tundra biome | Medium |
| ENV-005-QL-007 | Taiga biome | Medium |
| ENV-005-QL-008 | Biome comparison | Medium |
| ENV-005-QL-009 | Correct pair | Medium |
| ENV-005-QL-010 | Incorrect pair | Medium |
| ENV-005-QL-011 | Statement evaluation | Hard |
| ENV-005-QL-012 | Applied biome identification | Hard |

## Review gate

- exactly 48 questions;
- four questions per QL;
- Easy, Medium and Hard represented;
- all four answer positions used within each four-question QL set;
- four unique options per question;
- canonical answer equals the option at `correctIndex`;
- source IDs and source-fact IDs retained;
- no duplicate semantic question signatures;
- concise stems and explanations;
- no `associated with` filler;
- runtime blocked until project-owner approval.

## Source policy

Stable ecosystem and biome concepts are anchored to standard NCERT Biology and school-level ecology references. No mutable counts or current-status facts are used.