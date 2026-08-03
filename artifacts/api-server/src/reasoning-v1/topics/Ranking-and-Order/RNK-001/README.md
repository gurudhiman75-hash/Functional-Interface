# RNK-001 — Ranking and Order

Status: **CP-001, CP-002 and CP-003 English discovery frozen; cumulative permanent range `RNK-QL-001..026`**.

Student-facing chapter: **Ranking and Order**  
Reasoning V1 package: `RNK-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `RNK-001-END-TO-END-DESIGN.md`;
4. `rnk-001-open-ql-discovery.md` for CP-004 onward;
5. `RNK-001-MANIFEST-AMENDMENT-CP001.md`;
6. `RNK-001-MANIFEST-AMENDMENT-CP002.md`;
7. `RNK-001-MANIFEST-AMENDMENT-CP003.md`;
8. checkpoint-specific review, freeze and permanent-runtime records.

## Checkpoint map

| Checkpoint | Ownership | State |
|---|---|---|
| `RNK-CP-001` | one-person rank arithmetic, side counts, totals and exact-middle inverses | frozen: `RNK-QL-001..009` |
| `RNK-CP-002` | two-person positions, separation, comparison and mixed-end total constraints | frozen: `RNK-QL-010..017` |
| `RNK-CP-003` | interchange, movement, overtaking, insertion/removal and changed-rank transformations | frozen: `RNK-QL-018..026` |
| `RNK-CP-004` | comparative ordering of several named entities | open |
| `RNK-CP-005` | shared ranking passages | planned |
| `RNK-CP-006` | attribute-led ranking ownership extensions | planned ownership audit |
| `RNK-CP-007` | partial-order, definite/possible and uniqueness semantics | planned |
| `RNK-CP-008` | advanced synthesis | planned |

## Frozen inventory

### CP-001 — `RNK-QL-001..009`

One-person opposite-end ranks, side counts, totals, exact-middle rank and odd-total inverses.

### CP-002 — `RNK-QL-010..017`

```text
RNK-QL-010  people between normalized positions
RNK-QL-011  position gap between normalized positions
RNK-QL-012  target rank from reference and separation
RNK-QL-013  compare normalized positions
RNK-QL-014  total from mixed ends with known order
RNK-QL-015  minimum/maximum total with unknown order
RNK-QL-016  exact total or indeterminate
RNK-QL-017  proposed-total order status
```

### CP-003 — `RNK-QL-018..026`

```text
RNK-QL-018  interchange ranks, direct or inverse
RNK-QL-019  total from interchange rank change
RNK-QL-020  own rank before or after one movement
RNK-QL-021  people passed from rank change
RNK-QL-022  target rank after insertion
RNK-QL-023  target rank after removal
RNK-QL-024  own rank after sequential moves
RNK-QL-025  target-rank effect of another person’s move
RNK-QL-026  own rank with movement and membership change
```

Next available RNK identity: `RNK-QL-027`.

## Proof summary

```text
CP-001: 13 prototypes / 3,120 discovery / 54 approved / 9 authorities
CP-002: 13 prototypes / 3,120 discovery / 48 approved / 8 authorities / 1,536 permanent
CP-003: 13 prototypes / 3,120 discovery / 78 approved / 9 authorities / 1,728 permanent
```

Approved English projections:

```text
CP-002  sha256:e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
CP-003  sha256:6457a50fdde7673f9e66fe607a47a5c38a4c921489ed387b72c87ef8a22947d5
```

## Construction model

```text
construct a valid hidden total order
  -> derive only the intended evidence
  -> solve displayed evidence independently
  -> replay transformations and intermediate states
  -> reject invalid or ambiguous narratives
  -> construct misconception-owned options
  -> render question-specific teaching
  -> expose permanent review identity while delivery stays locked
```

## Ownership boundaries

- one-person rank arithmetic → CP-001;
- relationships between two fixed positions → CP-002;
- interchange, movement, overtaking, insertion or removal → CP-003;
- three-or-more-person order reconstruction → CP-004;
- shared passages → CP-005;
- multi-person partial-order uncertainty → CP-007;
- statement-wise sufficiency → Data Sufficiency;
- facing/adjacency geometry → Seating Arrangement.

## Current lifecycle

```text
cumulative permanent range:      RNK-QL-001..026
next available ID:               RNK-QL-027
CP-001 discovery frozen:         true
CP-002 discovery frozen:         true
CP-003 discovery frozen:         true
chapter-wide freeze:             false
English review-only:             true
Hindi/Punjabi:                   not started
Question Studio:                 disabled
Question Bank:                   NOT_STORED
test eligibility:                INELIGIBLE
public publication:              false
```
