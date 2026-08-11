# RNK-001 — Open QL Discovery Register

Status: **CP-001 through CP-004 frozen at `RNK-QL-001..035`; CP-005 has a pinned 576-question permanent-runtime candidate, final manual English freeze review remains open, and `RNK-QL-036` is unallocated.**

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

V3 Easy:                        0
V3 Medium:                    156
V3 Hard:                       12
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

### Permanent-runtime candidate

The three authority candidates have now been expanded to a production-scale, projection-pinned English candidate:

```text
candidate runtime version: RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_V1
candidate questions:       576
questions/authority:        192
permanent QLs:                0
```

Authority counts:

```text
RELATION_TRUTH_STATUS:      192
POSSIBLE_RANK_BOUND:        192
EXACT_RANK_DETERMINACY:     192
```

Mode counts:

```text
MUST:                       48
COULD:                      48
CANNOT:                     48
PAIR_FIRST_ABOVE:           16
PAIR_SECOND_ABOVE:          16
PAIR_INDETERMINATE:         16
HIGHEST_POSSIBLE:           96
LOWEST_POSSIBLE:            96
EXACT_DEFINITE:             96
EXACT_INDETERMINATE:        96
```

Each authority has exact answer-position balance:

```text
48 / 48 / 48 / 48
```

All five approved contexts occur inside every authority. Context rendering is independent of mathematical state selection.

Quality-filtered topology coverage:

```text
RELATION_TRUTH_STATUS:    8 families
POSSIBLE_RANK_BOUND:      7 families
EXACT_RANK_DETERMINACY:   6 families
```

Candidate difficulty and uniqueness:

```text
Easy:       0
Medium:   496
Hard:      80

normalized learner surfaces: 576
selected state keys:          576
runtime fingerprints:         576
```

Every selected state still has at least two valid complete rankings.

Pinned candidate projection:

```text
sha256:c45517d1d8bf4283d38eb4b62d1c9e2f90c5ec58593e2c400a59b2a26fb6e71e
```

This is a freeze-review pin, not a permanent allocation.

### Final manual freeze review

A deterministic 36-question review pack is generated from the pinned runtime:

```text
questions:                36
questions/authority:      12
answer positions:    9 / 9 / 9 / 9
```

Composition:

```text
RELATION_TRUTH_STATUS
  2 MUST
  2 COULD
  2 CANNOT
  2 PAIR_FIRST_ABOVE
  2 PAIR_SECOND_ABOVE
  2 PAIR_INDETERMINATE

POSSIBLE_RANK_BOUND
  6 HIGHEST_POSSIBLE
  6 LOWEST_POSSIBLE

EXACT_RANK_DETERMINACY
  6 EXACT_DEFINITE
  6 EXACT_INDETERMINATE
```

English freeze is still **NOT APPROVED**. The review pack is the final manual gate.

### Remaining gate before permanent allocation

```text
ownership audit:         passed
editorial review:        passed
runtime candidate:       built
projection:              pinned
manual freeze review:    pending
permanent QL allocation: prohibited until explicit approval
```

If all three later pass freeze, the available contiguous range would be `RNK-QL-036..038`; this statement is a forecast, not an allocation.

`RNK-QL-036` remains available.

See:

- `RNK-CP-005/RNK-CP-005-QL034-OWNERSHIP-AUDIT.md`
- `RNK-CP-005/RNK-CP-005-PERMANENT-RUNTIME-CANDIDATE-V1.md`

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
CP-005 runtime candidate:   built + pinned
CP-005 English freeze:      false
CP-005 permanent QLs:       0
chapter-wide freeze:        false
Hindi/Punjabi:              NOT_STARTED
Question Studio:            DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
```
