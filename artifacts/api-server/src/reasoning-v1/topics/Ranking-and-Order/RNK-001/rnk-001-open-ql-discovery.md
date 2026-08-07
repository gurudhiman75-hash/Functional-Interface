# RNK-001 — Open QL Discovery Register

Status: **CP-001, CP-002 and CP-003 frozen at `RNK-QL-001..026`; CP-004 targeted SSC/banking English Remodel V7 review is active**.

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

## 4. Active checkpoint — RNK-CP-004

### Remodel V7 executable wave

```text
provisional authorities:          11
runtime seeds per authority:     240
runtime questions:             2,640
English review questions:        132
review evidence per authority:    12
mixed review batches:             12
manual English approval:     pending
permanent QLs:                   none
next available identity:  RNK-QL-027
```

### Provisional authorities

```text
HIGHEST_ENTITY
LOWEST_ENTITY
ENTITY_AT_EXACT_RANK
RANK_OF_NAMED_ENTITY
MIDDLE_ENTITY
COMPLETE_ORDER
RELATIVE_ORDER_OF_PAIR
EXACT_RANK_DIFFERENCE_OF_PAIR
IMMEDIATE_NEIGHBOUR
DEFINITELY_TRUE_RELATION
MISSING_COMPARISON
```

The compatibility runtime ID for `DEFINITELY_TRUE_RELATION` remains `VALID_RANK_STATEMENT` until consolidation.

`RELATIVE_ORDER_OF_PAIR` owns direction only. `EXACT_RANK_DIFFERENCE_OF_PAIR` remains separate because it requires complete-position proof and arithmetic.

### V7 corrections

- singular/plural rendering is validated;
- every four-option question records exactly three distractors;
- distance options use natural `place/places above` wording;
- endpoint feedback is option-specific;
- missing-comparison mock help is compact;
- pair learner help is regenerated from the displayed remapped options;
- each authority has at least three stem and explanation-shell variants.

Direction-only pair options now share one semantic contract:

```text
correct direction
reverse direction
same-rank contradiction
cannot-determine contradiction
```

Exact-distance options test:

```text
correct distance and direction
reversed direction
people-between error
inclusive-count error
```

### Difficulty and proof model

Difficulty uses:

```text
RNK_CP004_DIFFICULTY_V3
```

The shortest answer proof and task burden dominate. Entity count is only a small scanning factor.

```text
runtime: 838 Easy / 1,595 Medium / 207 Hard
review:   17 Easy /   100 Medium /  15 Hard
```

Calibration gates prove:

- five-person middle questions are Easy;
- short direction-only pair proofs are Easy;
- named-rank and ordinary immediate-neighbour chains are not Hard;
- definitely-true relations are Medium;
- exact-distance Hard requires the combined large-chain, reversed-wording and confirmatory burden.

Proof metadata remains:

```text
shortestDirectionalPathClues
shortestExactPositionProofClues
fullOrderProofClues
shortestAnswerProofClues
```

Missing comparison separately records base-clue, selected-option and completed-relation counts.

### Expanded structural evidence

The review pack provides:

```text
12 distinct structural fingerprints per authority
6 context families × 22 records
confirmatory counts 0, 1 and 2
12 mixed-authority batches
```

Fingerprints normalise names to solved-order positions and store clue shape, query shape, confirmatory count and option roles.

Answer-position authority:

```text
A/B/C/D: 33/33/33/33
unique four-answer windows: 129
repeated four-answer windows: 0
normalized semantic duplicates: 0
```

### Learner renderer boundary

```text
DIRECT
SEGMENT_BUILDING
FULL_POSITIONAL
```

Student content remains separate from admin proof metadata. Optional wrong-option teaching uses a native collapsed component. Actual Question Studio mobile/accessibility validation remains pending.

### Current executable evidence

```text
runtime questions:                          2,640
review questions:                             132
average visible explanation words:          45.28
average words including optional help:       87.73
```

### Still open before consolidation

- manual English approval of the 132-question Remodel V7 pack;
- source saturation and inverse-query audit;
- ownership audit against CP-005, CP-006 and CP-007;
- endpoint, exact-rank, relation and distance merge/split proof;
- final provisional-authority consolidation;
- permanent QL allocation and freeze proof;
- Question Studio disclosure, mobile and accessibility validation.

No CP-004 QL count is allocated.

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
cumulative permanent range:   RNK-QL-001..026
next available RNK ID:        RNK-QL-027
CP-001 discovery frozen:      true
CP-002 discovery frozen:      true
CP-003 discovery frozen:      true
CP-004 discovery frozen:      false
CP-004 manual review:         pending
CP-004 permanent QL count:    open
chapter-wide freeze:          false
English review-only:          true
Hindi/Punjabi:                not started
Question Studio:              disabled
Question Bank:                NOT_STORED
test eligibility:             INELIGIBLE
public publication:           false
```
