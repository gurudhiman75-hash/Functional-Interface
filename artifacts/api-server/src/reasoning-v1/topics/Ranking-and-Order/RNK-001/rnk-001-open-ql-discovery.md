# RNK-001 — Open QL Discovery Register

Status: **CP-001 through CP-004 frozen at `RNK-QL-001..035`; CP-005 V3 editorial review passed, final ownership is pending, and `RNK-QL-036` remains unallocated.**

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

CP-004 owns evidence that forces one unique complete strict order.

## 5. Book-to-QL reset

`RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md` confirmed:

- ordinary rank arithmetic, two-position relations, interchange/movement and unique strict comparison ranking are already covered;
- left/right placement, facing and neighbour geometry belong to Seating Arrangement;
- shared passages/caselets are delivery infrastructure;
- context words do not create QLs;
- the genuine remaining ranking gap is incomplete strict comparison information with several valid total orders.

The rejected presentation-led/shared-set proposal allocated no QLs.

## 6. RNK-CP-005 — Partial Order and Ranking Uncertainty

### Current state

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
```

Release difficulty:

```text
Easy:      0
Medium:  156
Hard:     12
```

### Seven discovery source forms

```text
DEFINITELY_TRUE_RELATION
POSSIBLE_RELATION
IMPOSSIBLE_RELATION
PAIR_RELATION_CANNOT_BE_DETERMINED   # legacy ID; learner form = PAIR_RELATION_STATUS
MINIMUM_POSSIBLE_RANK
MAXIMUM_POSSIBLE_RANK
DEFINITE_RANK_OR_INDETERMINATE
```

Rejected:

```text
ORDER_UNIQUENESS_STATUS
```

### V3 consolidation proposal

```text
RELATION_TRUTH_STATUS
  MUST
  COULD
  CANNOT
  PAIR_STATUS

POSSIBLE_RANK_BOUND
  HIGHEST
  LOWEST

EXACT_RANK_DETERMINACY
  DEFINITE
  INDETERMINATE
```

The legacy pair source is not a separate authority. Its corpus contains:

```text
FIRST_ABOVE:      8
SECOND_ABOVE:     8
INDETERMINATE:    8
```

### V3 semantic gates

Generic relation options:

```text
4 distinct ordered pairs
4 distinct unordered pairs
>=4 people represented
<=2 option appearances/person
```

- MUST: correct answer is transitive; at least two distractors are possible but not compulsory.
- COULD: wrong options are impossible through multi-step inference; direct clue reversal is prohibited.
- CANNOT: every distractor is possible but not compulsory.
- PAIR_STATUS: first-above, second-above and indeterminate all occur; exact-gap distractors vary.
- rank bounds: >=3 compulsory people, branch integration, >=1 transitively derived compulsory relation, boundary impossibility proof and attainable witness.
- definite exact rank: transitive structural evidence and full accounting.
- indeterminate exact rank: two witness rankings with different target ranks.

Eight V3 topology families are used. Every release source form spans at least six, and the 28-question review pack has four distinct topologies/source form.

### Editorial review result

```text
28-question human pack reviewed
answer balance: 7 / 7 / 7 / 7
wrong answer keys: 0
contradictions: 0
one-person fixation: 0
COULD direct-reversal shortcuts: 0
rank-bound direct-count-only cases: 0
```

Editorial review is passed. Final source-backed permanent ownership remains pending.

### CP-004 overlap still open

`RNK-QL-034` and CP-005 `RELATION_TRUTH_STATUS-MUST` have different current proof contracts:

```text
RNK-QL-034:
  one unique total order is forced

CP-005 MUST:
  multiple total orders remain valid
  relation holds across all of them
```

Before `RNK-QL-036` is allocated, exam-source evidence and manual ownership signoff must decide whether this warrants a new permanent QL or parameterised extension of existing ownership.

### Evidence

Validated implementation before final documentation cleanup:

```text
workflow run: 31472607624
head:         bf268249e9daf24273da2ecf081f674ea4e42642
result:       PASS

evidence artifact: 9093964523
review artifact:   9093964870
```

See:

- `RNK-CP-005/RNK-CP-005-EDITORIAL-V3-CONSOLIDATION.md`
- `RNK-CP-005/RNK-CP-005-PARTIAL-ORDER-DISCOVERY-STATUS-V1.md`

### Remaining entry gates before permanent QLs

```text
exam-source frequency evidence
-> final CP-004 overlap decision
-> manual English ownership approval
-> permanent QL allocation
-> permanent runtime / freeze evidence
```

`RNK-QL-036` is still available.

## 7. Later checkpoints

### RNK-CP-006 — tied/non-strict ranking

Unallocated. Implement only after strong exam-source evidence.

### RNK-CP-007 — advanced mixed ranking transformations

Unallocated. Open only after CP-005 final ownership and a fresh chapter-gap audit.

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
CP-005 final ownership:     pending
CP-005 permanent QLs:       0
chapter-wide freeze:        false
Hindi/Punjabi:              NOT_STARTED
Question Studio:            DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
```
