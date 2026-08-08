# RNK-001 — Ranking and Order

Status: **CP-001 through CP-005 English discovery frozen at `RNK-QL-001..043`; CP-006 onward remains open.**

Student-facing chapter: **Ranking and Order**  
Reasoning V1 package: `RNK-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `RNK-001-END-TO-END-DESIGN.md`;
4. `rnk-001-open-ql-discovery.md`;
5. checkpoint manifest amendments;
6. checkpoint-specific review, source, consolidation, permanent-runtime and freeze records.

## Checkpoint map

| Checkpoint | Ownership | State |
|---|---|---|
| `RNK-CP-001` | one-person rank arithmetic, side counts, totals and exact-middle inverses | frozen: `RNK-QL-001..009` |
| `RNK-CP-002` | two-person positions, separation, comparison and mixed-end total constraints | frozen: `RNK-QL-010..017` |
| `RNK-CP-003` | interchange, movement, overtaking, insertion/removal and changed-rank transformations | frozen: `RNK-QL-018..026` |
| `RNK-CP-004` | exact multi-entity comparison and explicit order reconstruction | frozen: `RNK-QL-027..035` |
| `RNK-CP-005` | presentation-led tables, ledgers and shared ranking sets | frozen: `RNK-QL-036..043` |
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

### CP-004 — `RNK-QL-027..035`

```text
RNK-QL-027  endpoint entity, highest or lowest
RNK-QL-028  entity at explicit or derived-middle position
RNK-QL-029  rank of a named entity from top or bottom
RNK-QL-030  complete order in requested direction
RNK-QL-031  relative direction of a named pair
RNK-QL-032  exact rank difference and direction of a pair
RNK-QL-033  immediate neighbour above or below
RNK-QL-034  definitely true transitive relation
RNK-QL-035  comparison sufficient to make the order unique
```

### CP-005 — `RNK-QL-036..043`

```text
RNK-QL-036  shared-set endpoint entity
RNK-QL-037  shared-set entity at requested position
RNK-QL-038  shared-set rank of a named entity
RNK-QL-039  shared-set relative order of a named pair
RNK-QL-040  shared-set exact rank gap
RNK-QL-041  shared-set immediate neighbour
RNK-QL-042  shared-set complete order
RNK-QL-043  shared-set definitely true statement
```

Next available RNK identity: `RNK-QL-044`.

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

## CP-005 freeze summary

```text
English review corpus:          144
presentation modes:               3
contexts:                         6
frozen authorities:               8
shared sets:                    192
permanent runtime:            1,536
questions per authority:         192
freeze version:             RNK_CP005_ENGLISH_DISCOVERY_FREEZE_V1
projection: sha256:3fcc8981c4eb66b04cc455605da5d2f89a29555a48a7c17bd2e3d51403fa2c29
```

CP-005 distinguishes shared-set ownership from CP-004 standalone ownership. Every set has one stable passage identity and one independently reconstructed order reused by linked questions. The runtime supports rank tables, ordered ledgers and comparison-clue passages across row, queue, merit-list, race, shortlist and performance contexts.

The permanent CP-005 runtime contains 132 Easy, 1,284 Medium and 120 Hard questions, exact `48/48/48/48` answer-position balance per QL and zero duplicate mathematical fingerprints.

## Proof summary

```text
CP-001: 13 prototypes / 3,120 discovery / 54 approved / 9 authorities
CP-002: 13 prototypes / 3,120 discovery / 48 approved / 8 authorities / 1,536 permanent
CP-003: 13 prototypes / 3,120 discovery / 78 approved / 9 authorities / 1,728 permanent
CP-004: 11 source forms / 2,640 discovery / 132 approved / 9 authorities / 1,728 permanent
CP-005: 3 presentation modes / 192 shared sets / 144 review / 8 authorities / 1,536 permanent
```

Approved English projections:

```text
CP-002  sha256:e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
CP-003  sha256:6457a50fdde7673f9e66fe607a47a5c38a4c921489ed387b72c87ef8a22947d5
CP-004  sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
CP-005  sha256:3fcc8981c4eb66b04cc455605da5d2f89a29555a48a7c17bd2e3d51403fa2c29
```

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

For CP-005, one additional invariant applies:

```text
one shared passage
  -> one stable shared-set fingerprint
  -> multiple linked authority questions
  -> identical reconstructed order across the set
```

## Ownership boundaries

- one-person rank arithmetic → CP-001;
- relationships between two fixed positions → CP-002;
- interchange, movement, overtaking, insertion or removal → CP-003;
- unique standalone three-or-more-person order reconstruction → CP-004;
- reusable presentation-led or shared ranking sets → CP-005;
- attribute-led height, age, marks and weight ranking → CP-006;
- multi-person partial-order uncertainty → CP-007;
- advanced mixed shared synthesis → CP-008;
- statement-wise sufficiency → Data Sufficiency;
- facing/adjacency geometry → Seating Arrangement.

## Current lifecycle

```text
cumulative permanent range:      RNK-QL-001..043
next available ID:               RNK-QL-044
CP-001 discovery frozen:         true
CP-002 discovery frozen:         true
CP-003 discovery frozen:         true
CP-004 discovery frozen:         true
CP-005 discovery frozen:         true
chapter-wide freeze:             false
Hindi/Punjabi:                   not started
Question Studio:                 disabled
Question Bank:                   NOT_STORED
test eligibility:                INELIGIBLE
public publication:              false
manual NVDA/VoiceOver gate:      pending
```
