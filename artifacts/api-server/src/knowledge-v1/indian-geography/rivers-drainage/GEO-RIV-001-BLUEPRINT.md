# GEO-RIV-001 — Indian Rivers & Drainage System

Status: CONTENT CLOSED V1
Engine: `knowledge-v1`
Subject: Static GK / Indian Geography
Chapter: `GEO-RIV-001`

## 1. Goal

Build a deterministic, provenance-backed Indian Rivers & Drainage package that produces real competitive-exam question families from canonical geographic facts and relations.

The chapter must use the shared Question Studio hierarchy and lifecycle:

`Subject -> Chapter -> CP -> QL -> fact/relation pool -> generator -> validator -> distractor builder -> realizer -> explanation -> localization -> audit -> Question Studio`

No runtime web/LLM answer authority is permitted.

## 2. Truth and exam-evidence split

### Truth authority

Primary factual authority should be drawn from:

1. NCERT geography textbooks and syllabus material for standard school-level physical geography and river-system descriptions.
2. Central Water Commission (CWC) basin material for basin boundaries, river-system membership and official hydrological descriptions.
3. India-WRIS / River Basin Atlas material for basin, sub-basin, river-network and water-resource project relationships.
4. Other Government of India sources only where a fact is not adequately covered by the first three.

### Exam-evidence layer

Previous-year SSC/railway/banking/state-exam material is used to determine:

- which relations are repeatedly tested;
- learner-task frequency;
- stem style;
- distractor neighborhoods;
- difficulty patterns;
- important aliases and conventional exam terminology.

Exam-prep books are not canonical truth authority when they conflict with official sources.

## 3. Chapter scope

The chapter covers:

- drainage concepts and patterns;
- Himalayan vs Peninsular river systems;
- Indus system;
- Ganga system;
- Brahmaputra system;
- major east-flowing Peninsular rivers;
- major west-flowing Peninsular rivers;
- tributaries and confluences;
- river sources/origins and mouths/outfalls;
- states/UTs traversed or drained;
- river-basin membership;
- important dams, barrages, projects and reservoirs where exam-relevant;
- important cities/places associated with rivers where exam-relevant;
- river classifications and comparison facts;
- ordered upstream/downstream relations where a source supports them;
- map/spatial metadata for future visual questions.

Out of scope for V1 unless directly required by exam evidence:

- live flood levels;
- daily reservoir storage;
- current water-quality values;
- politically disputed claims without a stable official convention;
- unrestricted lists of every minor stream;
- dynamic project status unless versioned as mutable facts.

## 4. CP decomposition

### CP001 — Drainage Basics & River Classification

Core concepts, drainage patterns, Himalayan/Peninsular distinction, perennial/seasonal tendencies, antecedent/consequent concepts where exam-relevant, inland/coastal drainage and direction-of-flow classification.

### CP002 — Indus River System

Indus and major tributaries, sources, sequence/relations, states/UTs, important projects and exam-relevant place relations.

### CP003 — Ganga River System

Bhagirathi-Alaknanda formation, major tributaries, distributaries, source relations, confluences and state/city/project associations.

### CP004 — Brahmaputra River System

Names across regions, source-course relations, major tributaries, Assam valley relations and downstream naming where officially supported.

### CP005 — East-flowing Peninsular Rivers

Mahanadi, Godavari, Krishna, Cauvery and other exam-relevant east-flowing systems.

### CP006 — West-flowing Peninsular Rivers

Narmada, Tapi, Mahi, Sabarmati and other exam-relevant west-flowing systems.

### CP007 — Tributaries & Confluences

Cross-system mastery of tributary-parent and confluence relations.

### CP008 — Sources, Origins & Mouths

Glacier/hill/source region, origin state/UT, bay/sea/delta/estuary relations.

### CP009 — Rivers & States/UTs

State traversal, drainage and region associations with explicit relation semantics.

### CP010 — Dams, Projects & Reservoirs

River-project-reservoir-state relations. Mutable status fields must be versioned separately from immutable river-location relations.

### CP011 — River Basins & Drainage Patterns

Basin membership, major basin classifications, drainage patterns and physiographic controls.

### CP012 — Important Cities/Places on Rivers

Only exam-relevant and source-backed city/river relations.

### CP013 — River Comparisons & Classification

East/west flow, delta/estuary, Himalayan/Peninsular, major/minor, basin/system discrimination.

### CP014 — Multi-fact / Statement / Match Tasks

Compound learner tasks using already-qualified relations from earlier CPs.

### CP015 — Mixed Rivers Mastery

Balanced chapter-level generation after CP001-014 are individually qualified.

## 5. Canonical data model

The geography repository should model entities and relations rather than a permanent MCQ bank.

### Entity families

- `RIVER`
- `TRIBUTARY`
- `DISTRIBUTARY`
- `GLACIER_OR_SOURCE_FEATURE`
- `CONFLUENCE`
- `RIVER_SYSTEM`
- `BASIN`
- `STATE_UT`
- `CITY_PLACE`
- `DAM_BARRAGE`
- `RESERVOIR`
- `SEA_BAY`
- `DELTA_ESTUARY_FEATURE`
- `PHYSIOGRAPHIC_REGION`

### Core relations

- `TRIBUTARY_OF`
- `DISTRIBUTARY_OF`
- `ORIGINATES_AT`
- `ORIGINATES_IN_REGION`
- `JOINS_AT`
- `JOINS_RIVER`
- `FLOWS_THROUGH`
- `DRAINS_STATE`
- `BELONGS_TO_SYSTEM`
- `BELONGS_TO_BASIN`
- `EMPTIES_INTO`
- `FORMS_DELTA`
- `FORMS_ESTUARY`
- `PROJECT_ON_RIVER`
- `RESERVOIR_ON_RIVER`
- `CITY_ON_RIVER`
- `EAST_FLOWING`
- `WEST_FLOWING`
- `HIMALAYAN_SYSTEM`
- `PENINSULAR_SYSTEM`
- `UPSTREAM_OF`
- `DOWNSTREAM_OF`

Every relation must define semantics precisely enough to avoid ambiguous generation. For example, `FLOWS_THROUGH` must not be conflated with `DRAINS_STATE`.

## 6. Fact contract extensions for Geography

Every generation-eligible geography fact should preserve the standard `knowledge-v1` fields plus:

- canonical entity IDs;
- relation type;
- source authority IDs;
- source locator/page/section when available;
- geography convention notes;
- map/spatial metadata when applicable;
- alias set;
- mutable/immutable classification;
- exam evidence tags;
- distractor neighborhood;
- ambiguity notes;
- accepted alternate spellings/transliterations.

### Spatial metadata

Where source-safe, entities should include:

- approximate canonical coordinates or geometry reference;
- source feature type;
- state/UT;
- basin/system ID;
- spatial confidence;
- map-label aliases.

Spatial metadata is not required for text-only V1 generation but must be designed in from the start so map questions do not require rebuilding the fact graph.

## 7. Freshness policy

Suggested defaults:

- river-system membership: `IMMUTABLE`;
- source/origin relation: `IMMUTABLE` unless official convention changes;
- tributary relation: `IMMUTABLE`;
- state/UT traversal: `SLOW_MUTABLE` where administrative boundaries matter;
- project status: `CURRENT` or `SLOW_MUTABLE`;
- project-river location relation: usually `IMMUTABLE` after verified construction;
- city name/administrative label: `SLOW_MUTABLE`;
- dynamic hydrological measurements: excluded from V1.

## 8. Learner-task families

Permanent QLs must represent materially different learner tasks, not surface wording changes.

Candidate chapter-level task families:

1. forward relation recall;
2. reverse relation recall;
3. correct pair identification;
4. incorrect pair / exception;
5. statement truth evaluation;
6. multi-statement combination;
7. match-the-following;
8. classification / belongs-does-not-belong;
9. sequence/order where source-backed;
10. source/origin identification;
11. mouth/outfall identification;
12. tributary-parent discrimination;
13. river-state discrimination;
14. river-project association;
15. river-city association;
16. basin/system membership;
17. map/spatial identification in a later visual-capable phase.

## 9. Distractor policy

Distractors must be relation-aware.

Examples:

- a tributary question should draw distractors from tributaries of neighboring/commonly confused systems;
- an origin question should use plausible source regions/glaciers, not random places;
- east/west-flowing classification should use rivers with similar physiographic context;
- dam/project questions should use real projects from nearby relation neighborhoods;
- city-river questions should use real city-river pairs that form authentic confusions.

No fabricated river, dam, source, city or confluence name may be used as a distractor.

## 10. Explanation standard

Every explanation should:

1. state the correct answer directly;
2. name the governing relation;
3. give one or two useful connected facts;
4. explain confusing alternatives when the QL benefits from it;
5. remain concise and exam-focused;
6. use the actual fact graph, not a generic template detached from the item.

For relation questions, a compact relation table is preferred when it improves clarity.

Example:

| Item | Correct relation |
| --- | --- |
| Beas | Tributary of the Indus system |
| Godavari | East-flowing Peninsular river |

## 11. Difficulty topology

Difficulty must come from relation topology and learner task, not obscure wording.

### Easy

- direct single relation;
- famous entity;
- broad distractor separation;
- no competing near-neighbor relation.

### Medium

- reverse relation;
- closely related systems;
- similar tributaries/projects;
- two-hop reasoning;
- statement pair.

### Hard

- multiple plausible near-neighbor relations;
- three/four-statement composition;
- ordering or confluence logic;
- cross-system discrimination;
- closely related project/tributary/state combinations.

Hard questions must still use clean exam-like language.

## 12. Validation requirements

Every generated item must pass:

- fact eligibility;
- provenance completeness;
- unique-answer validation;
- relation-direction validation;
- option distinctness;
- distractor truth collision check;
- alias collision check;
- state-vs-drainage semantic check;
- mutable-fact validity-window check;
- explanation-answer consistency;
- deterministic replay;
- localization parity when localization is introduced;
- difficulty integrity.

Multi-fact questions additionally require a composition verifier so each statement is independently grounded.

## 13. Localization

Initial implementation may qualify English first.

Hindi and Punjabi must use localized entity labels and semantic reconstruction rather than blind translation. Geographic names need an approved alias/transliteration authority before localization is frozen.

## 14. Source hierarchy and conflict handling

When sources disagree:

1. prefer official hydrological/geographic authority for the exact relation;
2. record the competing convention in an ambiguity note;
3. block the fact from generation if the answer would depend on the unresolved convention;
4. never silently select the exam-prep wording as truth authority.

## 15. Completed implementation

All planned content checkpoints CP001–CP015 have completed editorial review and merge.

- CP001–CP014 are the permanent semantic owners.
- Permanent semantic coverage: 127 QLs and 762 frozen English review-only questions.
- CP015 is the 60-question mixed-rivers mastery proof and does not create duplicate permanent QL ownership.
- Question Studio discovery/generation remains limited to the frozen CP001–CP014 semantic authorities.
- Question Bank writes, test/mock eligibility, public publication and production release remain separately disabled.

## 16. Closure authority

The canonical closeout authority is `GEO-RIV-001-CHAPTER-CLOSE-V1`.

Final content closure requires:

- all permanent frozen questions to preserve unique IDs, valid four-option answers and provenance;
- exactly 14 permanent semantic CPs;
- exactly 127 permanent QLs;
- exactly 762 frozen semantic questions;
- CP015 to remain a non-owning 60-question mastery proof representing all 14 semantic CPs;
- the dedicated chapter-close test to pass inside the main Geography qualification workflow;
- the API build and full Geography validation to pass.

## 17. Closure state

`GEO-RIV-001` is **CONTENT CLOSED V1** at the content-authority level. Future changes must be deliberate revisions of the closed chapter rather than normal checkpoint continuation.

Content closure does not authorize public/runtime publication. Question Bank writes, test/mock eligibility, public publication and production release remain separately governed.
