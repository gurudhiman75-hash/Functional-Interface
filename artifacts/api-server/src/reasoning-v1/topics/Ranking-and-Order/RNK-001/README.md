# RNK-001 — Ranking and Order

Status: **CP-001 through CP-004 English discovery frozen at `RNK-QL-001..035`; CP-005 partial-order editorial discovery is active with no permanent QL allocated.**

Student-facing chapter: **Ranking and Order**  
Reasoning V1 package: `RNK-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `RNK-001-END-TO-END-DESIGN.md`;
4. `rnk-001-open-ql-discovery.md`;
5. `RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md`;
6. checkpoint manifest amendments;
7. checkpoint-specific review, source, consolidation, permanent-runtime and freeze records.

## Checkpoint map

| Checkpoint | Ownership | State |
|---|---|---|
| `RNK-CP-001` | one-person rank arithmetic, side counts, totals and exact-middle inverses | frozen: `RNK-QL-001..009` |
| `RNK-CP-002` | two-person positions, separation, comparison and mixed-end total constraints | frozen: `RNK-QL-010..017` |
| `RNK-CP-003` | interchange, movement, overtaking, insertion/removal and changed-rank transformations | frozen: `RNK-QL-018..026` |
| `RNK-CP-004` | exact multi-entity comparison and strict order reconstruction | frozen: `RNK-QL-027..035` |
| `RNK-CP-005` | partial order, relation certainty, rank bounds and exact-rank indeterminacy | editorial discovery: 7 candidates, 0 QLs |
| `RNK-CP-006` | non-strict or tied-ranking source audit | unallocated; evidence required |
| `RNK-CP-007` | advanced mixed ranking transformations | unallocated; gap audit required |
| `RNK-CP-008` | reserved | shared-set assembly is infrastructure, not a QL family |

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
RNK-QL-025  target-rank effect of another person's move
RNK-QL-026  own rank with movement and membership change
```

### CP-004 — `RNK-QL-027..035`

```text
RNK-QL-027  endpoint entity, highest or lowest
RNK-QL-028  entity at explicit or derived-middle position
RNK-QL-029  rank of a named entity from top or bottom
RNK-QL-030  complete strict order in requested direction
RNK-QL-031  relative direction of a named pair
RNK-QL-032  exact rank difference and direction of a pair
RNK-QL-033  immediate neighbour above or below in a strict ranking
RNK-QL-034  definitely true transitive relation in a strict order
RNK-QL-035  comparison sufficient to make a strict order unique
```

Next available RNK identity: `RNK-QL-036`.

## Book-to-QL audit decision

The 2026-08-08 audit compared the frozen inventory with a dedicated Ranking chapter and with a banking-oriented arrangement reference.

It confirmed:

- standard top/bottom, left/right and front/back rank arithmetic is covered by CP-001 and CP-002;
- interchange and movement are covered by CP-003;
- strict comparison ranking is covered by CP-004;
- clue-heavy left/right placement, neighbours, facing and extreme seats belong to Seating Arrangement;
- shared directions followed by several questions are a delivery format, not a new reasoning authority;
- height, age, marks and performance wording does not create a new QL when the solver remains strict comparison ranking.

The rejected `presentation-led and shared ranking sets` proposal allocates no permanent QLs. `RNK-QL-036..043` remain available.

See `RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md`.

## CP-004 freeze summary

```text
approved English review corpus: 132
source forms:                     11
frozen authorities:                9
permanent runtime:             1,728
questions per authority:          192
freeze version:             RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1
projection: sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

Highest/lowest and explicit-rank/middle forms were consolidated after proof-contract and answer-semantic audits. Bottom-rank and reverse-order wording are authority parameters rather than duplicate QLs.

The permanent CP-004 runtime contains 470 Easy, 1,106 Medium and 152 Hard questions, six contexts represented 288 times each, exact `48/48/48/48` answer-position balance per QL and zero normalised semantic duplicates.

## CP-005 discovery summary

```text
raw prototypes:                    8
raw discovery questions:         256
raw answer positions:      64 / 64 / 64 / 64
editorial candidates:              7
editorial questions checked:     168
editorial answer positions: 42 / 42 / 42 / 42
rejected prototypes:               1
permanent QLs:                     0
```

The rejected prototype is `ORDER_UNIQUENESS_STATUS`. It repeatedly projected the same multiple-order conclusion and overlapped existing uniqueness ownership.

The seven surviving source forms remain provisional. Before `RNK-QL-036` can be allocated, the merge/split audit must determine whether relation-certainty forms consolidate together, whether rank bounds merge by direction, and whether partial-order definite relation extends or duplicates `RNK-QL-034`.

See `RNK-CP-005/RNK-CP-005-PARTIAL-ORDER-DISCOVERY-STATUS-V1.md`.

## Proof summary

```text
CP-001: 13 prototypes / 3,120 discovery / 54 approved / 9 authorities
CP-002: 13 prototypes / 3,120 discovery / 48 approved / 8 authorities / 1,536 permanent
CP-003: 13 prototypes / 3,120 discovery / 78 approved / 9 authorities / 1,728 permanent
CP-004: 11 source forms / 2,640 discovery / 132 approved / 9 authorities / 1,728 permanent
CP-005: 8 raw prototypes / 256 discovery / 7 editorial candidates / 168 checked / 0 permanent
```

Approved English projections:

```text
CP-002  sha256:e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
CP-003  sha256:6457a50fdde7673f9e66fe607a47a5c38a4c921489ed387b72c87ef8a22947d5
CP-004  sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

CP-005 has no permanent projection because no QL is frozen.

## Construction model

```text
construct a valid hidden ranking state
  -> derive only intended evidence
  -> solve displayed evidence independently
  -> reject cycles, ambiguity and invalid identities
  -> construct misconception-owned options
  -> render question-specific teaching
  -> audit source inverses and ownership
  -> consolidate by proof and answer contract
  -> pin the permanent projection digest
```

For CP-005 partial-order discovery, the solver enumerates all valid orders before classifying a statement as definite, possible, impossible or indeterminate. Editorial explanations use transitive chains or one/two witness rankings rather than raw permutation counts.

## Ownership boundaries

- one-person rank arithmetic → CP-001;
- relationships between two fixed positions → CP-002;
- interchange, movement, overtaking, insertion or removal → CP-003;
- unique three-or-more-person strict order reconstruction → CP-004;
- incomplete comparison graphs and ranking uncertainty → CP-005;
- tied or non-strict ranking → CP-006 only after source evidence;
- shared passage/caselet structure → assembly infrastructure, not a QL;
- top/bottom, left/right and front/back → renderer parameters when no placement geometry is involved;
- height/age/marks/performance comparison wording → CP-004 parameter when strict comparison is the burden;
- clue-heavy adjacency, facing and seat placement → Seating Arrangement;
- multi-attribute assignment → Logic Puzzles;
- statement-wise sufficiency → Data Sufficiency;
- arithmetic-heavy age, marks, score or speed calculation → relevant Quant chapter.

## Current lifecycle

```text
cumulative permanent range:      RNK-QL-001..035
next available ID:               RNK-QL-036
CP-001 discovery frozen:         true
CP-002 discovery frozen:         true
CP-003 discovery frozen:         true
CP-004 discovery frozen:         true
CP-005 editorial discovery:      ready
CP-005 permanent QLs:            0
chapter-wide freeze:             false
Hindi/Punjabi:                   not started
Question Studio:                 disabled
Question Bank:                   NOT_STORED
test eligibility:                INELIGIBLE
public publication:              false
```
