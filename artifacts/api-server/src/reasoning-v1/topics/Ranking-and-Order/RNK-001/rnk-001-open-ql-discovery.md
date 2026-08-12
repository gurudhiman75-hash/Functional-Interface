# RNK-001 — Open QL Discovery Register

Status: **CP-001 through CP-005 frozen at `RNK-QL-001..038`; `RNK-QL-039` is the next available identity.**

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

`RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md` established these protected boundaries:

- ordinary rank arithmetic, two-position relations, interchange/movement and unique strict comparison ranking were already covered by CP-001..004;
- left/right placement, facing and neighbour geometry belong to Seating Arrangement;
- shared passages/caselets are delivery infrastructure;
- context words do not create QLs;
- arithmetic-heavy marks/age/speed/score questions belong to Quant;
- incomplete strict comparisons with multiple valid complete rankings remain Ranking ownership.

## 6. Frozen RNK-CP-005 — Partial Order and Ranking Uncertainty

### Discovery and consolidation evidence

```text
raw prototypes:                 8
raw questions:                256
V3 release source forms:        7
V3 checked questions:         168
consolidated authorities:       3
final manual review pack:      36
permanent questions:          576
questions/authority:          192
```

Rejected: `ORDER_UNIQUENESS_STATUS`.

The seven surviving source forms consolidate into three permanent authorities:

```text
RNK-QL-036  RELATION_TRUTH_STATUS
  MUST / COULD / CANNOT / PAIR_STATUS

RNK-QL-037  POSSIBLE_RANK_BOUND
  HIGHEST_POSSIBLE / LOWEST_POSSIBLE

RNK-QL-038  EXACT_RANK_DETERMINACY
  EXACT_DEFINITE / EXACT_INDETERMINATE
```

### QL-034 ownership boundary

```text
RNK-QL-034 / CP-004
  exactly one total order is valid
  solver reconstructs that unique order

RNK-QL-036 / CP-005
  two or more total orders remain valid
  solver quantifies relation truth over the complete valid-order set
```

The QL-034 ownership/anti-duplication audit remains a permanent freeze regression gate.

### Permanent runtime evidence

```text
RNK-QL-036: 192
RNK-QL-037: 192
RNK-QL-038: 192
Total:      576
```

Answer-position balance per QL:

```text
48 / 48 / 48 / 48
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

All five approved contexts occur within every authority. Quality-filtered topology coverage is 8 / 7 / 6 graph families for QL036 / QL037 / QL038.

Frozen difficulty:

```text
Easy:       0
Medium:   496
Hard:      80
```

### Freeze proof

Manual final review:

```text
questions independently reviewed: 36 / 36
wrong answer keys:                  0
ambiguous correct options:          0
invalid witness rankings:           0
contradictory clue sets:            0
```

Full-runtime executable proof:

```text
questions independently re-proved: 576
compulsory proof chains checked:    736
full witness orders checked:        816
rank-bound proofs rechecked:        192
unique learner fingerprints:        576
unique permanent fingerprints:      576
```

Candidate projection:

```text
sha256:c45517d1d8bf4283d38eb4b62d1c9e2f90c5ec58593e2c400a59b2a26fb6e71e
```

Frozen permanent projection:

```text
sha256:f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
```

See `RNK-CP-005/RNK-CP-005-ENGLISH-FREEZE-V1.md`.

`RNK-QL-036..038` are therefore no longer open discovery identities.

## 7. Open later checkpoints

### RNK-CP-006 — tied/non-strict ranking

Unallocated. Implement only after strong exam-source evidence.

### RNK-CP-007 — advanced mixed ranking transformations

Unallocated. Open only after a fresh chapter-gap audit.

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
cumulative permanent range: RNK-QL-001..038
next available RNK ID:      RNK-QL-039
CP-005 English freeze:      true
CP-005 permanent QLs:       3
chapter-wide final freeze:  false
Hindi/Punjabi:              NOT_STARTED
Question Studio:            DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
```

No merge, deployment, publication or Question Studio/persistence enablement is authorized by this freeze.
