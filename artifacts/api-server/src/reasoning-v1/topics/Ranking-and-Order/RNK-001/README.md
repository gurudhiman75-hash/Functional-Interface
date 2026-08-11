# RNK-001 — Ranking and Order

Status: **CP-001 through CP-004 frozen at `RNK-QL-001..035`; CP-005 V3 editorial and QL-034 ownership audits passed with three provisional authorities and zero permanent QLs.**

Student-facing chapter: **Ranking and Order**  
Reasoning V1 package: `RNK-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `RNK-001-END-TO-END-DESIGN.md`;
4. `rnk-001-open-ql-discovery.md`;
5. `RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md`;
6. checkpoint-specific consolidation/freeze records.

## Checkpoint map

| Checkpoint | Ownership | State |
|---|---|---|
| `RNK-CP-001` | one-person rank arithmetic, side counts, totals, exact-middle inverses | frozen `RNK-QL-001..009` |
| `RNK-CP-002` | two-person positions, separation, comparison, mixed-end totals | frozen `RNK-QL-010..017` |
| `RNK-CP-003` | interchange, movement, overtaking, insertion/removal | frozen `RNK-QL-018..026` |
| `RNK-CP-004` | unique multi-entity strict-order reasoning | frozen `RNK-QL-027..035` |
| `RNK-CP-005` | partial order, relation truth status, possible-rank bounds, exact-rank determinacy | V3 editorial + ownership audit passed; 3 provisional authorities; 0 QLs |
| `RNK-CP-006` | non-strict/tied-ranking audit | unallocated; source evidence required |
| `RNK-CP-007` | advanced mixed transformations | unallocated; later gap audit |
| `RNK-CP-008` | reserved | shared-set assembly is infrastructure, not QL ownership |

## Frozen inventory

```text
RNK-QL-001..009   CP-001 one-person rank arithmetic
RNK-QL-010..017   CP-002 two-position/separation/mixed-end constraints
RNK-QL-018..026   CP-003 movement/interchange/membership transformations
RNK-QL-027..035   CP-004 unique strict multi-entity order reasoning
```

CP-004 frozen authorities:

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

Next available RNK identity: **`RNK-QL-036`**.

## Book-to-QL ownership audit

The 2026-08-08 audit established that ordinary top/bottom ranking, two-person separation, interchange/movement and unique strict-comparison ranking are already owned by CP-001..004.

It also fixed these boundaries:

- left/right placement, facing, adjacency and seat neighbours → Seating Arrangement;
- shared passages/caselets → delivery infrastructure, not a QL;
- height/age/marks/performance words → context only unless solver changes;
- arithmetic-heavy marks/age/speed/score → relevant Quant chapter;
- incomplete comparison information with several valid strict rankings → CP-005.

The rejected presentation-led/shared-set CP-005 proposal allocated no QLs. See `RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md`.

## CP-004 freeze summary

```text
approved English review: 132
source forms:              11
frozen authorities:        9
permanent runtime:      1,728
projection: sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

CP-004 assumes the evidence forces one unique complete strict order.

## CP-005 V3 Release summary

CP-005 deliberately retains **multiple valid complete rankings** and asks what remains definite, possible, impossible, bounded or indeterminate across them.

```text
raw:                 8 prototypes / 256 questions
V3 release:          7 source forms / 168 checked questions
answer positions:    42 / 42 / 42 / 42
unique release states: 168
V3 graph families:   8

Easy:      0
Medium:  156
Hard:     12

permanent QLs: 0
```

The rejected form remains `ORDER_UNIQUENESS_STATUS`.

### Three provisional CP-005 authorities

```text
RELATION_TRUTH_STATUS
  MUST / COULD / CANNOT / PAIR_STATUS

POSSIBLE_RANK_BOUND
  HIGHEST / LOWEST

EXACT_RANK_DETERMINACY
  DEFINITE / INDETERMINATE
```

`PAIR_RELATION_CANNOT_BE_DETERMINED` is retained only as a legacy discovery ID; learner-facing `PAIR_STATUS` contains first-above, second-above and indeterminate outcomes.

See:
- `RNK-CP-005/RNK-CP-005-EDITORIAL-V3-CONSOLIDATION.md`
- `RNK-CP-005/RNK-CP-005-QL034-OWNERSHIP-AUDIT.md`
- `RNK-CP-005/RNK-CP-005-PARTIAL-ORDER-DISCOVERY-STATUS-V1.md`

### QL-034 ownership resolution

The final ownership audit retains CP-005 `RELATION_TRUTH_STATUS` as a **separate provisional authority** rather than widening frozen `RNK-QL-034`.

```text
RNK-QL-034 / CP-004
  state contract: exactly one complete strict order
  query: definitely-true relation

CP-005 / RELATION_TRUTH_STATUS
  state contract: at least two complete strict orders remain valid
  queries: MUST / COULD / CANNOT / PAIR_STATUS
```

CP-004's solver explicitly rejects a non-unique evidence graph before answering its relation query. CP-005 instead quantifies the relation over every valid order. The solver state and answer contract therefore differ materially.

Primary Ranking-source evidence also contains incomplete comparison tables with incomparable people and nevertheless asks which conclusions can or cannot be determined. This supports partial-order uncertainty as Ranking ownership.

Audit decision:

```text
KEEP_SEPARATE_PROVISIONAL_AUTHORITY
```

No permanent ID is allocated by this decision.

### V3 semantic safeguards

- four distinct comparison pairs in generic relation options;
- at least four people represented and maximum two appearances/person;
- MUST uses possible-but-not-compulsory distractors;
- COULD bans direct clue reversals and requires multi-step contradiction for wrong options;
- CANNOT uses possible-but-not-compulsory wrong options;
- eight graph topologies prevent repeated diamond-only structure;
- possible-rank bounds require at least three compulsory people, branch integration and a transitive compulsory relation;
- definite exact ranks require transitive structural evidence;
- indeterminate exact ranks use two witness rankings;
- difficulty is based on proof burden, not number of names.

## V3 evidence

Final V3 Release exact-head proof before the ownership branch:

```text
workflow run: 31473422220
head:         c4fcb1a53b310aae9e4c24e55d3fa3b4f895a15a
result:       PASS

evidence artifact: 9094288269
review artifact:   9094288765
```

The ownership-audit branch must independently pass its own exact-head workflow.

## Proof summary

```text
CP-001: 13 prototypes / 3,120 discovery / 54 approved / 9 frozen authorities
CP-002: 13 prototypes / 3,120 discovery / 48 approved / 8 frozen authorities
CP-003: 13 prototypes / 3,120 discovery / 78 approved / 9 frozen authorities
CP-004: 11 forms / 2,640 discovery / 132 approved / 9 frozen authorities / 1,728 permanent
CP-005: 8 raw / 256 raw / 7 release forms / 168 checked / 3 provisional authorities / 0 permanent
```

## Ownership boundaries

- one-person rank arithmetic → CP-001;
- two-position relationships → CP-002;
- movement/interchange/insertion/removal → CP-003;
- unique multi-entity strict order → CP-004;
- incomplete strict comparison graph / ranking uncertainty → CP-005;
- tied/non-strict ranking → CP-006 only after source evidence;
- shared passage structure → assembly infrastructure;
- seating adjacency/facing geometry → Seating Arrangement;
- multi-attribute assignment → Logic Puzzles;
- statement-wise sufficiency → Data Sufficiency;
- arithmetic-heavy marks/ages/speeds/scores → Quant.

## Next CP-005 gate

```text
ownership resolved
-> construct permanent English runtime for 3 provisional authorities
-> validate full corpus, projection, deduplication, difficulty and contexts
-> final manual English freeze approval
-> only then allocate CP-005 permanent QL IDs
```

## Current lifecycle

```text
cumulative permanent range: RNK-QL-001..035
next available ID:          RNK-QL-036
CP-001 frozen:              true
CP-002 frozen:              true
CP-003 frozen:              true
CP-004 frozen:              true
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
