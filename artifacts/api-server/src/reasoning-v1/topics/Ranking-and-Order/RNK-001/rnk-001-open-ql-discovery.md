# RNK-001 — Open QL Discovery Register

Status: **CP-001 through CP-004 frozen at `RNK-QL-001..035`; CP-005 V3 editorial and QL-034 ownership audits passed, permanent runtime/freeze remains open, and `RNK-QL-036` is unallocated.**

Counts in this register are evidence, never chapter-size quotas.

## 1. Frozen RNK-CP-001

```text
13 prototypes / 3,120 discovery
54 approved English review questions
9 frozen authorities
RNK-QL-001..009
```

## 2. Frozen RNK-CP-002

```text
13 prototypes / 3,120 discovery
48 approved English review questions
8 frozen authorities
1,536 permanent questions
RNK-QL-010..017
projection: sha256:e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
```

## 3. Frozen RNK-CP-003

```text
13 prototypes / 3,120 discovery
78 approved English review questions
9 frozen authorities
1,728 permanent questions
RNK-QL-018..026
projection: sha256:6457a50fdde7673f9e66fe607a47a5c38a4c921489ed387b72c87ef8a22947d5
```

## 4. Frozen RNK-CP-004

```text
11 source forms
132 approved English review questions
9 frozen authorities
1,728 permanent questions
RNK-QL-027..035
projection: sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

Frozen authorities:

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

CP-004 owns comparison evidence that forces one unique complete strict order.

## 5. Book-to-QL reset

`RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md` confirmed:

- ordinary rank arithmetic, two-position relations, interchange/movement and unique strict comparison ranking are already covered;
- left/right placement, facing and neighbour geometry belong to Seating Arrangement;
- shared passages/caselets are delivery infrastructure;
- context words do not create QLs;
- the genuine remaining ranking gap is incomplete strict comparison information with several valid total orders.

The rejected presentation-led/shared-set proposal allocated no QLs.

## 6. RNK-CP-005 — Partial Order and Ranking Uncertainty

### Validated discovery state

```text
raw prototypes:                 8
raw questions:                256
raw answer balance:    64 / 64 / 64 / 64

V3 release source forms:        7
release questions:            168
questions/source form:         24
release answer balance: 42 / 42 / 42 / 42
unique release states:        168
provisional authorities:        3
permanent QLs:                  0

Easy:                           0
Medium:                       156
Hard:                          12
```

Seven discovery source forms:

```text
DEFINITELY_TRUE_RELATION
POSSIBLE_RELATION
IMPOSSIBLE_RELATION
PAIR_RELATION_CANNOT_BE_DETERMINED   # legacy ID; learner form = PAIR_RELATION_STATUS
MINIMUM_POSSIBLE_RANK
MAXIMUM_POSSIBLE_RANK
DEFINITE_RANK_OR_INDETERMINATE
```

Rejected: `ORDER_UNIQUENESS_STATUS`.

### Consolidation after ownership audit

```text
RELATION_TRUTH_STATUS
  MUST / COULD / CANNOT / PAIR_STATUS

POSSIBLE_RANK_BOUND
  HIGHEST / LOWEST

EXACT_RANK_DETERMINACY
  DEFINITE / INDETERMINATE
```

These are still provisional authorities, not permanent QLs.

### QL-034 overlap — resolved

Decision:

```text
KEEP_SEPARATE_PROVISIONAL_AUTHORITY
```

Reason:

```text
RNK-QL-034 / CP-004
  exactly one total order is valid
  solver reconstructs that unique order
  asks for a definitely-true relation

CP-005 RELATION_TRUTH_STATUS
  at least two total orders remain valid
  solver quantifies relations over all valid orders
  supports MUST / COULD / CANNOT / PAIR_STATUS
```

The shared surface wording does not make these the same authority. Merging would change the frozen QL-034 state contract and answer space.

Executable audit coverage:

```text
QL-034 frozen questions checked:       192
CP-005 relation questions checked:      96
CP-005 MUST:                            24
CP-005 COULD:                           24
CP-005 CANNOT:                          24
CP-005 PAIR_STATUS:                     24
PAIR first/second/indeterminate:    8 / 8 / 8
```

Primary Ranking-source evidence also contains incomplete comparison tables where some people remain incomparable while other conclusions are determinable. This supports CP-005 partial-order ownership inside Ranking.

See `RNK-CP-005/RNK-CP-005-QL034-OWNERSHIP-AUDIT.md`.

### V3 semantic gates

- generic relation options use four distinct person-pairs, at least four people and no more than two appearances/person;
- MUST uses possible-but-not-compulsory distractors;
- COULD bans direct clue reversals and requires multi-step contradiction for wrong options;
- CANNOT uses possible-but-not-compulsory distractors;
- PAIR_STATUS includes first-above, second-above and indeterminate results;
- rank bounds require at least three compulsory people, branch integration, a transitive compulsory relation, boundary proof and attainable witness;
- definite exact ranks require transitive structural evidence;
- indeterminate exact ranks use two witness rankings;
- eight graph topology families are represented.

### Editorial evidence

```text
28-question V3 human review pack
answer balance: 7 / 7 / 7 / 7
wrong answer keys: 0
contradictions: 0
one-person fixation: 0
COULD direct-reversal shortcuts: 0
rank-bound direct-count-only cases: 0
```

Final V3 release proof before the ownership branch:

```text
workflow run: 31473422220
head:         c4fcb1a53b310aae9e4c24e55d3fa3b4f895a15a
result:       PASS
```

### Remaining gate before permanent allocation

```text
ownership audit: passed
editorial review: passed

next:
  construct permanent English runtime for all 3 provisional authorities
  -> validate full corpus/projection/dedup/difficulty/context balance
  -> final manual English freeze approval
  -> allocate permanent identities only after that approval
```

If all three later pass freeze, the available contiguous range would be `RNK-QL-036..038`; this statement is a reservation forecast, not an allocation.

`RNK-QL-036` remains available.

## 7. Later checkpoints

### RNK-CP-006 — tied/non-strict ranking

Unallocated. Implement only after strong exam-source evidence.

### RNK-CP-007 — advanced mixed ranking transformations

Unallocated. Open only after CP-005 freeze and a fresh chapter-gap audit.

### RNK-CP-008 — reserved

Shared passages/linked-question assembly remain infrastructure rather than authority identities.

## 8. Protected exclusions

```text
lexicographic/dictionary position              -> Word and Dictionary Order
seating adjacency/facing/geometry              -> Seating Arrangement
multi-attribute assignment                     -> Logic Puzzles
league/tournament scoring                      -> Games and Tournament
statement I/II sufficiency                     -> Data Sufficiency
alphabet position without ranked group         -> Alphabet Test
age/speed/marks arithmetic as main burden      -> Quant
```

## 9. Lifecycle

```text
cumulative permanent range: RNK-QL-001..035
next available RNK ID:      RNK-QL-036
CP-005 editorial review:    passed
CP-005 ownership audit:     passed
CP-005 permanent QLs:       0
chapter-wide freeze:        false
Hindi/Punjabi:              NOT_STARTED
Question Studio:            DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
```
