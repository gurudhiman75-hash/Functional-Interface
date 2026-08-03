# RNK-001 — Ranking and Order

Status: **CP-001 and CP-002 English discovery frozen; CP-003 initial English pack approved and supplementary source-backed review pending**.

Student-facing chapter: **Ranking and Order**  
Reasoning V1 package: `RNK-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `RNK-001-END-TO-END-DESIGN.md`;
4. `rnk-001-open-ql-discovery.md` for CP-003 onward;
5. `RNK-001-MANIFEST-AMENDMENT-CP001.md`;
6. `RNK-001-MANIFEST-AMENDMENT-CP002.md`;
7. checkpoint-specific review, freeze and permanent-runtime records.

## Checkpoint map

| Checkpoint | Ownership | State |
|---|---|---|
| `RNK-CP-001` | one-person rank arithmetic, side counts, totals and exact-middle inverses | frozen: `RNK-QL-001..009` |
| `RNK-CP-002` | two-person positions, separation, comparison and mixed-end total constraints | frozen: `RNK-QL-010..017` |
| `RNK-CP-003` | interchange, movement, overtaking, insertion/removal and changed-rank questions | active: 13 prototypes / 3,120 runtime; 54 approved + 24 supplementary review questions |
| `RNK-CP-004` | comparative ordering of several named entities | planned |
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

Next available RNK identity: `RNK-QL-018`.

## CP-002 proof summary

```text
source prototypes:                 13
combined discovery questions:   3,120
frozen authorities:                 8
authority review runtime:        2,560
approved English review pack:       48
permanent runtime proof:          1,536
open CP-002 source dimensions:        0
```

Approved CP-002 English projection:

```text
sha256:e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
```

## CP-003 active discovery summary

```text
initial prototypes:                     9
initial runtime questions:          2,160
approved English review questions:     54
supplementary source prototypes:         4
supplementary runtime questions:       960
supplementary review questions:         24
cumulative prototypes:                  13
cumulative runtime questions:        3,120
permanent QLs allocated:                0
next available RNK identity:     RNK-QL-018
```

The supplementary wave closes two post-approval source gaps:

- another person moves and the target shifts only when crossed;
- movement is combined with people joining or leaving from an end, in either operation order, with direct or inverse rank queries.

The initial 54-question pack is approved. The supplementary 24-question pack must be reviewed before merge/split consolidation, permanent allocation or freeze.

## Construction model

```text
construct a valid hidden total order
  -> derive only the intended evidence
  -> solve displayed evidence independently
  -> replay each transformation and intermediate state
  -> update current total and current rank after every membership change
  -> reject invalid or ambiguous narratives
  -> construct misconception-owned options
  -> render question-specific teaching
  -> expose review evidence while delivery stays locked
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
cumulative permanent range:          RNK-QL-001..017
next available ID:                   RNK-QL-018
CP-001 discovery frozen:             true
CP-002 discovery frozen:             true
CP-003 discovery frozen:             false
CP-003 initial English review:       approved
CP-003 supplementary English review: pending
CP-003 permanent QL count:           open
English review-only:                 true
Hindi/Punjabi:                       not started
Question Studio:                     disabled
Question Bank:                       NOT_STORED
test eligibility:                    INELIGIBLE
public publication:                  false
```
