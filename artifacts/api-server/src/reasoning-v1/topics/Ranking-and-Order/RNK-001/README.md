# RNK-001 — Ranking and Order

Status: **CP-001 through CP-005 English frozen at `RNK-QL-001..038`; next available identity is `RNK-QL-039`.**

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
| `RNK-CP-005` | partial order / ranking uncertainty | frozen `RNK-QL-036..038` |
| `RNK-CP-006` | non-strict/tied-ranking audit | unallocated; source evidence required |
| `RNK-CP-007` | advanced mixed transformations | unallocated; later gap audit |
| `RNK-CP-008` | reserved | shared-set assembly is infrastructure, not QL ownership |

## Frozen inventory

```text
RNK-QL-001..009   CP-001 one-person rank arithmetic
RNK-QL-010..017   CP-002 two-position/separation/mixed-end constraints
RNK-QL-018..026   CP-003 movement/interchange/membership transformations
RNK-QL-027..035   CP-004 unique strict multi-entity order reasoning
RNK-QL-036..038   CP-005 partial-order ranking uncertainty
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

CP-005 frozen authorities:

```text
RNK-QL-036  RELATION_TRUTH_STATUS
RNK-QL-037  POSSIBLE_RANK_BOUND
RNK-QL-038  EXACT_RANK_DETERMINACY
```

Next available RNK identity: **`RNK-QL-039`**.

## Ownership boundary

The 2026-08-08 book-to-QL audit fixed these chapter boundaries:

- top/bottom arithmetic and side counts → CP-001;
- two-person rank/separation relations → CP-002;
- interchange, movement, insertion/removal → CP-003;
- comparison evidence that forces one unique complete strict order → CP-004;
- incomplete strict-comparison information with multiple valid complete rankings → CP-005;
- left/right placement, facing, adjacency and seat neighbours → Seating Arrangement;
- shared passages/caselets → delivery infrastructure, not a QL;
- arithmetic-heavy marks/age/speed/score → relevant Quant chapter;
- tied/non-strict ranks → CP-006 only after source evidence.

## CP-004 freeze summary

```text
frozen authorities:        9
permanent runtime:      1,728
projection:
sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

CP-004 requires one unique complete strict order.

## CP-005 freeze summary

CP-005 deliberately retains **two or more valid complete rankings** and asks what remains definite, possible, impossible, bounded or indeterminate across them.

Discovery/editorial path:

```text
raw discovery:           8 prototypes / 256 questions
V3 release:              7 source forms / 168 checked questions
consolidated authorities: 3
manual freeze pack:      36 / 36 independently reviewed
permanent runtime:       576
questions/authority:     192
```

Permanent assignments:

```text
RNK-QL-036  RELATION_TRUTH_STATUS
  MUST / COULD / CANNOT / PAIR_STATUS

RNK-QL-037  POSSIBLE_RANK_BOUND
  HIGHEST_POSSIBLE / LOWEST_POSSIBLE

RNK-QL-038  EXACT_RANK_DETERMINACY
  EXACT_DEFINITE / EXACT_INDETERMINATE
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

Each CP-005 QL is answer-position balanced `48 / 48 / 48 / 48`.

All five approved presentation contexts occur in every CP-005 authority. Quality-filtered topology coverage is 8 / 7 / 6 graph families for QL036 / QL037 / QL038 respectively.

Frozen CP-005 difficulty distribution:

```text
Easy:       0
Medium:   496
Hard:      80
```

### Freeze proof

The 36-question manual pack was independently re-solved before allocation: zero wrong keys, zero ambiguous correct options, zero invalid witnesses and zero contradictory clue sets.

The executable freeze gate then independently re-proved every answer across the full 576-question runtime from the partial-order state:

```text
questions independently re-proved: 576
compulsory proof chains checked:    736
full witness orders checked:        816
rank-bound proofs rechecked:        192
unique learner fingerprints:        576
unique permanent fingerprints:      576
```

### Projection chain

Reviewed candidate projection:

```text
sha256:c45517d1d8bf4283d38eb4b62d1c9e2f90c5ec58593e2c400a59b2a26fb6e71e
```

Frozen permanent projection:

```text
sha256:f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
```

See `RNK-CP-005/RNK-CP-005-ENGLISH-FREEZE-V1.md`.

### QL-034 versus QL-036

The ownership audit remains authoritative:

```text
RNK-QL-034 / CP-004
  exactly one complete strict order is valid
  solver reconstructs that unique order

RNK-QL-036 / CP-005
  two or more complete strict orders remain valid
  solver evaluates relation truth over the valid-order set
```

Their wording can resemble each other, but the solver state and answer contract are different. The QL-034 anti-duplication audit remains in CP-005 freeze CI.

## Proof summary

```text
CP-001: 9 frozen authorities  / RNK-QL-001..009
CP-002: 8 frozen authorities  / RNK-QL-010..017
CP-003: 9 frozen authorities  / RNK-QL-018..026
CP-004: 9 frozen authorities  / RNK-QL-027..035 / 1,728 permanent
CP-005: 3 frozen authorities  / RNK-QL-036..038 /   576 permanent
```

Cumulative frozen authority count: **38**.

## Current lifecycle

```text
cumulative permanent range: RNK-QL-001..038
next available ID:          RNK-QL-039
CP-001 frozen:              true
CP-002 frozen:              true
CP-003 frozen:              true
CP-004 frozen:              true
CP-005 English frozen:      true
chapter-wide final freeze:  false
Hindi/Punjabi:              NOT_STARTED
Question Studio:            DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
```

Freezing CP-005 does not authorize merge, deployment, publication, Question Studio generation, persistence, or translation.
