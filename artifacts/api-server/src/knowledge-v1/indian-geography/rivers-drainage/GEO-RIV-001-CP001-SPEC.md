# GEO-RIV-001-CP001 — Drainage Basics & River Classification

Status: IMPLEMENTATION SPEC V1
Chapter: `GEO-RIV-001`
CP: `GEO-RIV-001-CP001`
Engine: `knowledge-v1`

## 1. CP objective

Establish the Indian Geography knowledge-v1 implementation pattern using a tightly bounded foundational CP before major river systems are added.

CP001 should prove:

- canonical concept/fact representation;
- classification relations;
- relation-aware distractors;
- deterministic question generation;
- unique-answer validation;
- source provenance;
- concise question-specific explanations;
- real-exam learner-task diversity.

## 2. Initial content scope

### A. Core terminology

Candidates for reviewed canonical entries:

- drainage;
- drainage system;
- drainage basin;
- water divide;
- river;
- tributary;
- distributary;
- perennial river;
- seasonal/non-perennial river;
- delta;
- estuary;
- inland drainage.

### B. Drainage patterns

Initial pattern set:

- dendritic;
- trellis;
- rectangular;
- radial.

Each pattern record should store:

- definition;
- controlling topographic/geological condition;
- one or more source-backed Indian examples where unambiguous;
- confusion neighbors;
- source authority.

### C. Broad Indian river classification

Initial relation groups:

- Himalayan river system;
- Peninsular river system;
- east-flowing Peninsular river;
- west-flowing Peninsular river;
- Bay of Bengal drainage;
- Arabian Sea drainage;
- inland drainage;
- delta-forming broad example;
- estuary-forming broad example.

## 3. Canonical object types

Recommended CP001 object families:

```ts
type GeoConcept = {
  conceptId: string;
  term: string;
  definition: string;
  aliases: string[];
  sourceIds: string[];
  reviewStatus: "CANDIDATE" | "REVIEWED" | "FROZEN";
};

type GeoClassificationFact = {
  factId: string;
  entityId: string;
  relation:
    | "HIMALAYAN_SYSTEM"
    | "PENINSULAR_SYSTEM"
    | "EAST_FLOWING"
    | "WEST_FLOWING"
    | "DRAINS_TO_BAY_OF_BENGAL"
    | "DRAINS_TO_ARABIAN_SEA"
    | "INLAND_DRAINAGE"
    | "FORMS_DELTA"
    | "FORMS_ESTUARY";
  value: true;
  sourceIds: string[];
  examTags: string[];
  distractorGroup: string;
  reviewStatus: "CANDIDATE" | "REVIEWED" | "FROZEN";
};

type DrainagePatternFact = {
  factId: string;
  patternId: string;
  definition: string;
  controllingCondition: string;
  exampleEntityIds: string[];
  sourceIds: string[];
  distractorGroup: string;
  reviewStatus: "CANDIDATE" | "REVIEWED" | "FROZEN";
};
```

Exact implementation should reuse shared knowledge-v1 base types rather than duplicating common provenance/freshness fields.

## 4. Proposed permanent QLs

The first review build should keep the QL set small and materially distinct.

### GEO-RIV-001-QL-001 — Definition Recall

Learner task: identify the correct concept from a definition.

Example shape:

> The area drained by a river and its tributaries is called which of the following?

### GEO-RIV-001-QL-002 — Reverse Definition

Learner task: identify the correct definition of a named concept.

### GEO-RIV-001-QL-003 — Drainage Pattern Identification

Learner task: infer the named drainage pattern from a structural description.

### GEO-RIV-001-QL-004 — Pattern-Condition Association

Learner task: identify the terrain/structure associated with a drainage pattern.

### GEO-RIV-001-QL-005 — River Classification

Learner task: classify a river/entity into a broad river group.

### GEO-RIV-001-QL-006 — Correct Pair

Learner task: identify a valid river/classification or pattern/feature pair.

### GEO-RIV-001-QL-007 — Incorrect Pair / Exception

Learner task: identify the one invalid pair among valid geographic associations.

### GEO-RIV-001-QL-008 — Statement Pair

Learner task: evaluate two independently grounded statements.

### GEO-RIV-001-QL-009 — Multi-statement Classification

Learner task: evaluate 3-4 statements using qualified CP001 facts.

No QL should be created solely because the stem wording differs.

## 5. Difficulty mapping

### Easy

Allowed shapes:

- direct definition;
- very common river classification;
- broad pattern definition;
- clearly separated distractor group.

### Medium

Allowed shapes:

- reverse recall;
- confusion-neighbor classifications;
- definition vs controlling-condition distinction;
- correct/incorrect pair;
- two-statement evaluation.

### Hard

Allowed shapes:

- multi-statement composition;
- closely related east/west or delta/estuary confusion neighborhoods;
- drainage pattern + condition + example composition;
- cross-classification exception.

Forbidden hardening methods:

- obscure vocabulary;
- excessively long stems;
- disputed terminology;
- unreviewed minor-river trivia.

## 6. Distractor neighborhoods

### Concept definitions

Use only neighboring geography concepts.

Example group:

- drainage basin;
- water divide;
- river system;
- watershed where the selected authority treats terminology distinctly enough for a unique answer.

If two terms are used interchangeably by the chosen authority, they must not be placed as competing answer options.

### Drainage patterns

Use real pattern names only:

- dendritic;
- trellis;
- radial;
- rectangular.

### Flow direction

Use real major rivers from the opposite/same flow-direction classes so distractors remain plausible.

### Delta/estuary

Use only source-reviewed examples. Do not apply a blanket school-level rule where a specific river morphology is ambiguous.

## 7. Stem rules

Preferred style:

- short competitive-exam wording;
- one clear task;
- no unnecessary story context;
- no machine-like repeated phrasing;
- no phrases such as "according to the above data" when no data is shown.

Maintain a curated stem bank per learner task, but surface variation must not create new QLs.

## 8. Explanation patterns

### Definition item

1. identify the term;
2. define it in one clean sentence;
3. contrast the nearest confusing term if useful.

### Classification item

Use a compact table when useful:

| River | Classification |
| --- | --- |
| Narmada | West-flowing Peninsular river |
| Godavari | East-flowing Peninsular river |

### Statement item

Evaluate each statement separately:

| Statement | Verdict | Why |
| --- | --- | --- |
| I | Correct/Incorrect | Grounded relation |
| II | Correct/Incorrect | Grounded relation |

Then state the correct option.

## 9. Validation checklist

Every CP001 generated item must prove:

- every used fact is reviewed and generation-eligible;
- all options are real geography objects/terms;
- exactly one answer satisfies the asked relation;
- no alias creates a duplicate option;
- classification direction is correct;
- no `FLOWS_THROUGH`/`DRAINS_STATE` conflation appears;
- statement compositions are independently verified;
- explanation contains no unsupported extra fact;
- answer position is deterministic from seed;
- replay produces the same question;
- difficulty metadata matches task topology.

## 10. Review batch design

First review batch should target approximately 45-60 questions rather than maximum volume.

Suggested distribution:

- QL001: 5-6
- QL002: 5-6
- QL003: 5-6
- QL004: 5-6
- QL005: 6-8
- QL006: 5-6
- QL007: 5-6
- QL008: 5-6
- QL009: 4-6

Difficulty target:

- 35% Easy;
- 45% Medium;
- 20% Hard.

This is a review target, not a production distribution contract.

## 11. CP001 acceptance gate

CP001 is review-ready only when:

- source authority records exist;
- all included concept/classification facts are reviewed;
- QL001-009 generators are deterministic;
- unique-answer and collision validation pass;
- review batch contains no fabricated geography;
- stem variety is acceptable;
- explanations are coherent and specific;
- Easy/Medium/Hard are visibly distinct;
- relation repetition is controlled;
- Question Studio adapter/package metadata can identify chapter, CP and QL.

## 12. Implementation sequence

1. add geography source-authority registry;
2. add CP001 canonical concept pool;
3. add broad classification fact pool;
4. add drainage-pattern fact pool;
5. add CP001 relation/distractor helpers;
6. implement QL001-004;
7. implement QL005-007;
8. implement statement composition QL008-009;
9. add validators/tests;
10. generate English review batch;
11. perform editorial/exam audit;
12. freeze only after review defects are corrected.

## 13. Immediate next coding target

The first code checkpoint after this specification should create:

- `geo-riv-001-source-authorities.ts`
- `geo-riv-001-cp001-facts.ts`
- `geo-riv-001-cp001-types.ts` only where shared types are insufficient
- `geo-riv-001-cp001-validator.ts`
- tests proving fact eligibility and relation uniqueness.

Generators should begin only after the initial fact authority set is reviewed.
