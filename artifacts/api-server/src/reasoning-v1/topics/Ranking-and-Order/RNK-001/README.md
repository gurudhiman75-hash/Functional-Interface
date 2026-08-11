# RNK-001 — Ranking and Order

Status: **CP-001 through CP-004 frozen at `RNK-QL-001..035`; CP-005 has a pinned 576-question permanent-runtime candidate and is awaiting final manual English freeze approval. No CP-005 QL is allocated.**

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
| `RNK-CP-005` | partial order, relation truth status, possible-rank bounds, exact-rank determinacy | 576-question candidate pinned; final manual freeze review pending; 0 QLs |
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

## CP-004 freeze summary

```text
approved English review: 132
source forms:              11
frozen authorities:        9
permanent runtime:      1,728
projection: sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

CP-004 assumes the evidence forces one unique complete strict order.

## CP-005 ownership and V3 editorial result

CP-005 deliberately retains **multiple valid complete rankings** and asks what remains definite, possible, impossible, bounded or indeterminate across them.

```text
raw discovery:        8 prototypes / 256 questions
V3 release:           7 source forms / 168 checked questions
V3 answer positions:  42 / 42 / 42 / 42
unique release states: 168
V3 graph families:    8

Easy:      0
Medium:  156
Hard:     12
```

The rejected form remains `ORDER_UNIQUENESS_STATUS`.

Three authority candidates survived consolidation:

```text
RELATION_TRUTH_STATUS
  MUST / COULD / CANNOT / PAIR_STATUS

POSSIBLE_RANK_BOUND
  HIGHEST / LOWEST

EXACT_RANK_DETERMINACY
  DEFINITE / INDETERMINATE
```

`PAIR_RELATION_CANNOT_BE_DETERMINED` is retained only as a legacy discovery ID; learner-facing `PAIR_STATUS` contains first-above, second-above and indeterminate outcomes.

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

Audit decision:

```text
KEEP_SEPARATE_PROVISIONAL_AUTHORITY
```

No permanent ID is allocated by this decision.

## CP-005 permanent-runtime candidate

The production-scale English candidate is now built from the approved V3 solver/editorial contracts:

```text
candidate runtime version: RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_V1
candidate questions:       576
candidate authorities:       3
questions/authority:        192

RELATION_TRUTH_STATUS:      192
POSSIBLE_RANK_BOUND:        192
EXACT_RANK_DETERMINACY:     192
```

Mode distribution:

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

Every authority is independently answer-position balanced at `48 / 48 / 48 / 48`.

The exact-rank source intentionally splits `EXACT_DEFINITE` as `48/0/48/0` and `EXACT_INDETERMINATE` as `0/48/0/48`; the combined authority remains perfectly balanced.

All five approved presentation contexts occur within every authority. Context rendering is decoupled from the mathematical state, so wording diversity does not alter solver logic.

Quality-filtered topology baselines are preserved:

```text
RELATION_TRUTH_STATUS:    8 graph families
POSSIBLE_RANK_BOUND:      7 graph families
EXACT_RANK_DETERMINACY:   6 graph families
```

Runtime evidence:

```text
Easy:       0
Medium:   496
Hard:      80

normalized learner surfaces: 576
selected state keys:          576
runtime fingerprints:         576
```

Every selected state retains at least two valid complete rankings.

### Pinned candidate projection

```text
sha256:c45517d1d8bf4283d38eb4b62d1c9e2f90c5ec58593e2c400a59b2a26fb6e71e
```

This pin protects the candidate against silent drift. It does **not** allocate `RNK-QL-036..038` and does **not** approve English freeze.

### Final manual freeze-review pack

A deterministic 36-question pack is generated from the pinned candidate:

```text
questions:                36
questions/authority:      12
answer positions:    9 / 9 / 9 / 9
```

It includes all relation-status modes, both possible-rank directions, and both exact-rank outcomes while preferring context/topology diversity.

See:
- `RNK-CP-005/RNK-CP-005-EDITORIAL-V3-CONSOLIDATION.md`
- `RNK-CP-005/RNK-CP-005-QL034-OWNERSHIP-AUDIT.md`
- `RNK-CP-005/RNK-CP-005-PERMANENT-RUNTIME-CANDIDATE-V1.md`

## Proof summary

```text
CP-001: 13 prototypes / 3,120 discovery / 54 approved / 9 frozen authorities
CP-002: 13 prototypes / 3,120 discovery / 48 approved / 8 frozen authorities
CP-003: 13 prototypes / 3,120 discovery / 78 approved / 9 frozen authorities
CP-004: 11 forms / 2,640 discovery / 132 approved / 9 frozen authorities / 1,728 permanent
CP-005: 8 raw / 256 raw / 7 V3 forms / 168 V3 checked / 3 authorities / 576 candidate / 0 permanent
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
-> 576-question candidate built
-> projection pinned
-> final 36-question manual English freeze review
-> explicit freeze approval
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
CP-005 candidate runtime:   built + pinned
CP-005 English freeze:      false
CP-005 permanent QLs:       0
chapter-wide freeze:        false
Hindi/Punjabi:              NOT_STARTED
Question Studio:            DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
```
