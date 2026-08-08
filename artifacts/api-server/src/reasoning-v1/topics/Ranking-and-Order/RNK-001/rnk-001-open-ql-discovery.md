# RNK-001 — Open QL Discovery Register

Status: **CP-001 through CP-004 are frozen at `RNK-QL-001..035`; `RNK-QL-036` is unallocated and CP-005 ownership is reset to partial-order discovery.**

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

### Permanent runtime evidence

```text
Easy:       470
Medium:   1,106
Hard:       152

six context families: 288 each
answer positions per QL: 48 / 48 / 48 / 48
normalised semantic duplicates: 0
```

### Corrected ownership boundary

```text
exact unique multi-entity strict order               -> RNK-CP-004
partial order / possible / impossible / indeterminate -> RNK-CP-005
shared passage or linked-question structure           -> assembly infrastructure
height/age/marks/performance comparison wording       -> CP-004 surface parameter
clue-heavy left/right adjacency and facing             -> Seating Arrangement
statement I/II sufficiency labels                      -> Data Sufficiency
```

Open CP-004 English discovery dimensions: `0`.

Question Studio disclosure/mobile/accessibility integration and Hindi/Punjabi localisation remain downstream product work, not open English authority discovery.

## 5. Book-to-QL audit

The audit in `RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md` maps standard competitive-exam ranking forms to `RNK-QL-001..035`.

Audit conclusions:

- ordinary rank arithmetic, two-position relations, interchange/movement and strict comparison ranking are already covered;
- row, queue, merit-list, race and attribute wording are presentation or context parameters unless their solver changes;
- shared passages are not permanent authority identities;
- immediate left/right placement, neighbours, facing and extreme-seat reconstruction belong to Seating Arrangement;
- the remaining genuine ranking gap is incomplete comparison information and uncertainty across multiple valid orders.

## 6. Open next checkpoint — RNK-CP-005

### Ownership

```text
PARTIAL_ORDER_AND_RANKING_UNCERTAINTY
```

Candidate source forms:

```text
DEFINITELY_TRUE
DEFINITELY_FALSE
POSSIBLE
IMPOSSIBLE
CANNOT_BE_DETERMINED
MINIMUM_POSSIBLE_RANK
MAXIMUM_POSSIBLE_RANK
UNIQUE_OR_MULTIPLE_ORDERS
```

These labels are provisional source forms, not QLs.

### Entry gates

CP-005 may not allocate `RNK-QL-036` until it has:

```text
book and exam-source evidence
-> ownership proof against CP-004 and Data Sufficiency
-> bounded partial-order enumeration
-> all-valid-orders answer proof
-> ambiguity and contradiction gates
-> realistic SSC/banking English review pack
-> merge/split audit
-> manual approval
```

### Explicit exclusions

```text
shared-set-only variants
complete rank tables followed by lookup questions
linear seating or row reconstruction from adjacency
facing and neighbour geometry
strict total orders already owned by CP-004
attribute vocabulary without a new solver contract
```

## 7. Later checkpoints remain unallocated

### RNK-CP-006 — Non-strict or tied-ranking source audit

No implementation or permanent QL allocation without strong exam evidence. Attribute words alone do not create this checkpoint.

### RNK-CP-007 — Advanced mixed ranking transformations

Open only after CP-005 and a fresh chapter-gap audit.

### RNK-CP-008 — Reserved

Shared passages and linked-question assembly are infrastructure and may reuse existing authorities without new QLs.

## 8. Protected exclusions

```text
lexicographic/dictionary position              -> Word and Dictionary Order
seating adjacency/facing/geometry              -> Seating Arrangement
multi-attribute assignment                     -> Logic Puzzles
league points, brackets and tournament scoring -> Games and Tournament
statement I/II sufficiency labels              -> Data Sufficiency
alphabet position without a ranked group       -> Alphabet Test
age/speed/marks arithmetic as main burden       -> relevant Quant chapter
```

## 9. Current lifecycle

```text
cumulative permanent range:   RNK-QL-001..035
next available RNK ID:        RNK-QL-036
CP-005 permanent QLs:         0
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
