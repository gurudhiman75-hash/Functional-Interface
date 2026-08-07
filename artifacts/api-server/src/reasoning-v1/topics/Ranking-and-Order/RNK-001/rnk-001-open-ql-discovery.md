# RNK-001 — Open QL Discovery Register

Status: **CP-001 through CP-004 are frozen at `RNK-QL-001..035`; `RNK-QL-036` is the next available identity.**

This register prevents premature chapter sizing. Counts are discovery evidence, never quotas.

## 1. Frozen checkpoint — RNK-CP-001

```text
combined discovery:             13 prototypes / 3,120 questions
approved English review corpus: 54 questions
frozen authorities:              9
permanent range:                 RNK-QL-001..009
freeze version:                  RNK_CP001_ENGLISH_DISCOVERY_FREEZE_V1
```

## 2. Frozen checkpoint — RNK-CP-002

```text
combined discovery:             13 prototypes / 3,120 questions
approved English review corpus: 48 questions
frozen authorities:              8
permanent runtime:               1,536 questions
permanent range:                 RNK-QL-010..017
freeze version:                  RNK_CP002_ENGLISH_DISCOVERY_FREEZE_V1
projection: sha256:e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
```

Open CP-002 source dimensions: `0`.

## 3. Frozen checkpoint — RNK-CP-003

```text
combined discovery:             13 prototypes / 3,120 questions
approved English review corpus: 78 questions
frozen authorities:              9
permanent runtime:               1,728 questions
permanent range:                 RNK-QL-018..026
freeze version:                  RNK_CP003_ENGLISH_DISCOVERY_FREEZE_V1
projection: sha256:6457a50fdde7673f9e66fe607a47a5c38a4c921489ed387b72c87ef8a22947d5
```

```text
RNK-QL-018  INTERCHANGE_RANKS_DIRECT_OR_INVERSE
RNK-QL-019  TOTAL_FROM_INTERCHANGE_RANK_CHANGE
RNK-QL-020  OWN_RANK_BEFORE_OR_AFTER_SINGLE_MOVEMENT
RNK-QL-021  PEOPLE_PASSED_FROM_RANK_CHANGE
RNK-QL-022  TARGET_RANK_AFTER_INSERTION
RNK-QL-023  TARGET_RANK_AFTER_REMOVAL
RNK-QL-024  OWN_RANK_AFTER_SEQUENTIAL_MOVES
RNK-QL-025  TARGET_RANK_EFFECT_OF_ANOTHER_PERSON_MOVE
RNK-QL-026  OWN_RANK_WITH_MOVEMENT_AND_MEMBERSHIP_CHANGE
```

Open CP-003 source dimensions: `0`.

## 4. Frozen checkpoint — RNK-CP-004

### Freeze summary

```text
approved English review corpus: 132 questions
source prototypes/forms:          11
frozen authorities:                9
permanent runtime:             1,728 questions
questions per authority:          192
permanent range:            RNK-QL-027..035
freeze version:             RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1
runtime version:            RNK_CP004_PERMANENT_RUNTIME_V1
projection: sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

### Frozen authorities

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

### Consolidation record

```text
HIGHEST_ENTITY + LOWEST_ENTITY
  -> ENDPOINT_ENTITY

ENTITY_AT_EXACT_RANK + MIDDLE_ENTITY
  -> ENTITY_AT_POSITION
```

Endpoint direction and explicit-versus-derived position are parameters, not separate QLs. Named rank, complete order, pair direction, exact distance, immediate neighbour, definitely-true relation and missing comparison retain distinct proof or answer contracts.

### Source and inverse record

Inverse presentation was audited across 2,640 discovery records and a targeted 36-question review pack.

Permanent runtime inverse coverage:

```text
canonical:                               1,488
person at a rank from bottom:               48
rank of a named entity from bottom:          96
complete order from lowest to highest:       96
```

No inverse form created a duplicate authority identity.

### Permanent runtime evidence

```text
Easy:       470
Medium:   1,106
Hard:       152

six context families: 288 each
answer positions per QL: 48 / 48 / 48 / 48
normalised semantic duplicates: 0
```

### Ownership boundary

```text
exact unique multi-entity order                  -> RNK-CP-004
row/queue/merit/race presentation-led forms       -> RNK-CP-005
height/age/marks/weight attribute-led forms       -> RNK-CP-006
possible/impossible/cannot-determine partial order -> RNK-CP-007
shared multi-question ranking sets                 -> RNK-CP-008
statement I/II sufficiency labels                  -> Data Sufficiency
```

`DEFINITELY_FALSE_RELATION` remains unallocated without additional source proof. Possible, impossible, cannot-determine and minimum/maximum possible-rank forms remain excluded to RNK-CP-007.

Open CP-004 English discovery dimensions: `0`.

Question Studio disclosure/mobile/accessibility integration and Hindi/Punjabi localisation remain downstream product work, not open English authority discovery.

## 5. Open later checkpoints

### RNK-CP-005 — Presentation-led and shared ranking sets

Row, queue, merit-list and race-order presentations, plus shared evidence where ownership is primarily presentation or caselet structure.

### RNK-CP-006 — Attribute-led ranking ownership

Height, age, marks, weight and performance when comparison language and localisation materially affect the contract.

### RNK-CP-007 — Partial order and uncertainty

Definite, possible, impossible, cannot determine, minimum/maximum rank and uniqueness.

### RNK-CP-008 — Advanced synthesis

Multi-stage narratives, bounded grid/table forms and mixed ranking evidence.

## 6. Protected exclusions

```text
lexicographic/dictionary position              -> Word and Dictionary Order
seating adjacency/facing/geometry              -> Seating Arrangement
multi-attribute assignment                     -> Logic Puzzles
league points, brackets and tournament scoring -> Games and Tournament
statement I/II sufficiency labels              -> Data Sufficiency
alphabet position without a ranked group       -> Alphabet Test
age/speed/marks arithmetic as main burden       -> relevant Quant chapter
```

## 7. Current lifecycle

```text
cumulative permanent range:   RNK-QL-001..035
next available RNK ID:        RNK-QL-036
CP-001 discovery frozen:      true
CP-002 discovery frozen:      true
CP-003 discovery frozen:      true
CP-004 discovery frozen:      true
chapter-wide freeze:          false
Hindi/Punjabi:                not started
Question Studio:              disabled
Question Bank:                NOT_STORED
test eligibility:             INELIGIBLE
public publication:           false
```
