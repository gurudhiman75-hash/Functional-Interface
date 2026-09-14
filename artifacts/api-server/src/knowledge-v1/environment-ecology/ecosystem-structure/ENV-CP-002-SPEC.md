# ENV-CP-002 — Ecosystem Structure Implementation Spec

**Chapter:** ENV-001 Environment & Ecology  
**CP:** ENV-CP-002 Ecosystem Structure  
**Lifecycle:** APPROVED / CONTENT-FROZEN  
**Approved review version:** V1  
**Runtime registration:** eligible for shared Environment package binding  
**Languages in this checkpoint:** English review surface only; canonical facts are locale-neutral.

## Scope

This CP covers the basic structural components and functional groups of an ecosystem.

Included:
- biotic and abiotic components
- producers, consumers and decomposers
- autotrophs and heterotrophs
- herbivores, carnivores and omnivores
- detritivores and their distinction from decomposers
- simple applied identification of ecosystem roles

Explicitly deferred:
- food chains, food webs and trophic levels (ENV-CP-003)
- ecological pyramids and energy transfer (later CP)
- nutrient cycles (ENV-CP-004)
- biome-specific climate and vegetation (ENV-CP-005)
- biodiversity and conservation categories (ENV-CP-006 onward)

## Design rules

1. Stems use short competitive-exam language.
2. Explanations directly answer the question and add only the needed distinction.
3. Producer/consumer/decomposer questions test function, not memorised wording alone.
4. Consumers may be classified as herbivores, carnivores or omnivores without introducing trophic-level numbering.
5. Detritivores ingest and fragment detritus; microbial decomposers chemically break down dead organic matter.
6. Abiotic factors remain non-living physical or chemical components.
7. Review distractors stay inside the same conceptual neighbourhood and avoid obvious joke options where possible.
8. Standard instruction stems may repeat, but the underlying tested relation must not be duplicated.
9. No question depends on mutable counts, notifications or current conservation status.
10. V1 is the approved learner-facing wording baseline.

## QL inventory

| QL | Family | Main operation | Difficulty |
|---|---|---|---|
| ENV-002-QL-001 | Ecosystem component identification | classify biotic/abiotic component | Easy |
| ENV-002-QL-002 | Biotic role identification | identify producer/consumer/decomposer | Easy |
| ENV-002-QL-003 | Producer identification | identify producer/function | Easy |
| ENV-002-QL-004 | Consumer type | herbivore/carnivore/omnivore | Medium |
| ENV-002-QL-005 | Decomposer function | identify decomposition role | Medium |
| ENV-002-QL-006 | Autotroph and heterotroph | distinguish nutrition mode | Medium |
| ENV-002-QL-007 | Detritivore and decomposer | distinguish detritus roles | Medium |
| ENV-002-QL-008 | Correct ecological role pair | term ↔ example/function | Medium |
| ENV-002-QL-009 | Incorrect ecological role pair | detect wrong match | Medium |
| ENV-002-QL-010 | Two-statement evaluation | verify paired concepts | Medium |
| ENV-002-QL-011 | Three-statement count | evaluate three concepts | Hard |
| ENV-002-QL-012 | Applied ecosystem structure | apply roles to a short scenario | Hard |

## Approved review gate

The approved V1 surface satisfies:
- exactly 48 review questions;
- four questions per QL;
- Easy, Medium and Hard bands represented;
- all four correct-option positions represented inside every four-question QL set;
- four unique options per question;
- canonical answer equals the option at `correctIndex`;
- source IDs and source-fact IDs retained;
- no duplicate semantic question signatures;
- repeated standard instruction stems allowed when the tested relation differs;
- no `associated with` filler;
- no option-by-option explanation clutter;
- project-owner approval on 2026-09-14.

Review-only artifacts may continue to carry `runtimeRegistered: false`; production/package registration is handled separately from review rendering.

## Source policy

Canonical definitions are anchored to the NCERT Class XII Biology ecosystem material. The facts used here are stable concepts rather than update-sensitive environment data.
