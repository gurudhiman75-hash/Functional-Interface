# RNK-CP-004 — Source, Inverse and Ownership Audit

Status: **completed for English Discovery Freeze V1.**

## 1. Source findings

The competitive-reasoning references support exact multi-entity comparison questions asking for:

- a highest or lowest endpoint;
- the entity at an explicit or derived middle position;
- the rank of a named entity;
- the complete order;
- the direction between a named pair;
- the exact rank difference and direction between a pair;
- an immediate neighbour;
- one definitely true transitive relation;
- the one additional comparison that makes two ordered blocks uniquely joinable.

The sources also contain ties, non-unique orders, possible/impossible statements and cannot-determine answers. Those are boundary evidence for partial-order reasoning and remain excluded to RNK-CP-007.

## 2. Manual approval and editorial base

The 132-question Remodel V7 pack was manually approved on 7 August 2026 and is recorded as:

```text
approval ID: USER_APPROVED_2026_08_07
```

V7 had already passed grammar, option-count, difficulty, distractor realism, explanation alignment, structural-diversity and answer-position gates across 2,640 discovery questions.

## 3. Source and inverse decisions

Inverse wording was tested across all 2,640 records, including a targeted 36-question review pack.

```text
transformed discovery records:                 360
person at rank from bottom:                    120
rank of named entity from bottom:              120
complete order from lowest to highest:         120
```

Decision:

- bottom-rank entity selection is a parameter of entity-at-position;
- named rank from bottom is a parameter of named-rank lookup;
- lowest-to-highest display is a presentation parameter of complete order;
- highest/lowest, above/below and pair-input orientation are already covered by endpoint, direction or symmetry parameters;
- inverse presentation creates no additional permanent QL.

`DEFINITELY_FALSE_RELATION` was not admitted because the reviewed source evidence did not establish it as a separate required authority. It may only be reconsidered with fresh source proof.

## 4. Authority consolidation

The 11 provisional forms consolidate to nine permanent authorities.

```text
HIGHEST_ENTITY + LOWEST_ENTITY
  -> ENDPOINT_ENTITY

ENTITY_AT_EXACT_RANK + MIDDLE_ENTITY
  -> ENTITY_AT_POSITION
```

These merges are valid because each pair shares one answer semantic and one proof contract. Direction or position mode remains an explicit parameter.

The following remain distinct:

```text
RANK_OF_NAMED_ENTITY
COMPLETE_ORDER
RELATIVE_ORDER_OF_PAIR
EXACT_RANK_DIFFERENCE_OF_PAIR
IMMEDIATE_NEIGHBOUR
DEFINITELY_TRUE_RELATION
MISSING_COMPARISON
```

Each retained authority has a distinct output or proof contract: numeric rank lookup, full sequence, directional path, full-position arithmetic, local adjacency, transitive relation proof or two-block uniqueness bridge.

## 5. Permanent authority map

```text
RNK-QL-027  ENDPOINT_ENTITY
RNK-QL-028  ENTITY_AT_POSITION
RNK-QL-029  RANK_OF_NAMED_ENTITY
RNK-QL-030  COMPLETE_ORDER
RNK-QL-031  RELATIVE_ORDER_OF_PAIR
RNK-QL-032  EXACT_RANK_DIFFERENCE_OF_PAIR
RNK-QL-033  IMMEDIATE_NEIGHBOUR
RNK-QL-034  DEFINITELY_TRUE_RELATION
RNK-QL-035  MISSING_COMPARISON
```

## 6. Permanent runtime proof

```text
runtime version:       RNK_CP004_PERMANENT_RUNTIME_V1
freeze version:        RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1
questions per QL:      192
permanent questions:   1,728
projection SHA-256:    39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
semantic duplicates:   0
answer positions/QL:   48 / 48 / 48 / 48
```

The permanent runtime preserves six equally represented contexts and includes top/bottom and forward/reverse presentation parameters without duplicating authority identities.

## 7. Ownership boundary

```text
exact unique order from comparison clues          -> RNK-CP-004
row/queue/merit/race presentation-led forms       -> RNK-CP-005
height/age/marks/weight attribute-led forms       -> RNK-CP-006
possible/impossible/cannot-determine partial order -> RNK-CP-007
shared multi-question ranking sets                 -> RNK-CP-008
statement I/II sufficiency labels                  -> Data Sufficiency
```

## 8. Protected exclusions

The following do not belong to this frozen authority set:

- ties or incomparable entities;
- possible, impossible or cannot-determine relation questions;
- minimum or maximum possible rank;
- row/queue facing or seating geometry;
- attribute-led ranking where height, age, marks or weight changes the language contract;
- data-sufficiency answer labels;
- shared passage/caselet ownership.

## 9. Lifecycle boundary

```text
English manual approval:  approved
English discovery frozen: true
permanent range:          RNK-QL-027..035
next RNK identity:        RNK-QL-036
Hindi/Punjabi:            not started
Question Studio:          disabled
Question Bank:            NOT_STORED
test eligibility:         INELIGIBLE
public publication:       false
```

The next phase is product integration and localisation, not further CP-004 English authority discovery.
