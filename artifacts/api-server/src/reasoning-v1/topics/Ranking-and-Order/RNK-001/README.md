# RNK-001 — Ranking and Order

Status: **CP-001 through CP-007 English frozen at `RNK-QL-001..042`; next available identity is `RNK-QL-043`.**

Student-facing chapter: **Ranking and Order**  
Reasoning V1 package: `RNK-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `RNK-001-END-TO-END-DESIGN.md` plus post-CP006 amendment;
4. `rnk-001-open-ql-discovery.md`;
5. `RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md`;
6. `RNK-001-POST-CP006-CHAPTER-GAP-AUDIT-2026-08-12.md`;
7. checkpoint-specific ownership/freeze records.

The original checkpoint map was provisional. Source and executable ownership audits supersede it where stronger evidence exists.

## Checkpoint map

| Checkpoint | Ownership | State |
|---|---|---|
| `RNK-CP-001` | one-person rank arithmetic, side counts, totals, exact-middle inverses | frozen `RNK-QL-001..009` |
| `RNK-CP-002` | two-person positions, separation, comparison, mixed-end totals | frozen `RNK-QL-010..017` |
| `RNK-CP-003` | interchange, movement, overtaking, insertion/removal | frozen `RNK-QL-018..026` |
| `RNK-CP-004` | unique multi-entity strict-order reasoning | frozen `RNK-QL-027..035` |
| `RNK-CP-005` | partial order / ranking uncertainty | frozen `RNK-QL-036..038` |
| `RNK-CP-006` | equality-aware / tied comparison ranking | frozen `RNK-QL-039..041` |
| `RNK-CP-007` | subgroup/category composition around rank | frozen `RNK-QL-042` |
| `RNK-CP-008` | reserved | no automatic QL ownership; shared-set assembly remains infrastructure |

## Frozen inventory

```text
RNK-QL-001..009   CP001 one-person rank arithmetic
RNK-QL-010..017   CP002 two-position/separation/mixed-end constraints
RNK-QL-018..026   CP003 movement/interchange/membership transformations
RNK-QL-027..035   CP004 unique strict multi-entity order reasoning
RNK-QL-036..038   CP005 partial-order ranking uncertainty
RNK-QL-039..041   CP006 equality-aware weak-order reasoning
RNK-QL-042        CP007 category composition around rank
```

Next available identity: **`RNK-QL-043`**.

## Multi-entity state contracts

```text
CP004  ONE_UNIQUE_STRICT_TOTAL_ORDER
CP005  MULTIPLE_VALID_STRICT_TOTAL_ORDERS
CP006  ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY
CP007  PARTITIONED_POPULATION_AROUND_NAMED_RANK
```

### CP004 authorities

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

### CP005 authorities

```text
RNK-QL-036  RELATION_TRUTH_STATUS
RNK-QL-037  POSSIBLE_RANK_BOUND
RNK-QL-038  EXACT_RANK_DETERMINACY
```

### CP006 authorities

```text
RNK-QL-039  EQUALITY_AWARE_PAIR_RELATION
RNK-QL-040  EQUALITY_AWARE_ENDPOINT
RNK-QL-041  COMPLETE_WEAK_ORDER
```

### CP007 authority

```text
RNK-QL-042  CATEGORY_COMPOSITION_AROUND_RANK
```

Source basis: Aggarwal Ranking Q65 and Q67.

The authority combines population ratio/counts, target category, target rank and an opposite-category ahead/after count. This state dimension is not present in frozen CP001 side-count arithmetic and therefore survives as one separate permanent authority.

## Frozen projection anchors

```text
CP004  sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
CP005  sha256:f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
CP006  sha256:7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
CP007  sha256:44aefb019c1a55308b58f4b285b1b6f7df97dea0185652d6de73e2dafbbd446b
```

CP007 production-candidate projection:

```text
sha256:63e8cc87812f1ec4546d23829022f333736a03c5e9aa8142384bcab15817dc94
```

Expanded object pools and future discovery may not move frozen hashes.

## CP007 final runtime

```text
questions:                 192
modes:                       4 x 48
answer positions:           48 / 48 / 48 / 48
difficulty:                 144 Medium / 48 Hard
surface styles:               4 x 48
partition contexts:          11
target names:                84
unique mathematical states: 192
unique learner surfaces:     192
```

Modes:

```text
TARGET_CATEGORY_AFTER
OTHER_CATEGORY_AFTER
TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER
OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER
```

The permanent freeze independently re-solves all 192 questions and proves that rank, category-total/ratio evidence and the displayed subgroup count are each essential. Options remain within visible bounds, answer/evidence numeric echoes are rejected, and structural misconception distractors are required.

## CP007 source-form ownership after merge/split audit

The post-CP006 source audit replayed:

```text
Q27 Q28 Q35 Q65 Q66 Q67 Q68
```

Only Q65/Q67 justified a new authority.

### Q35 / transfer balances

```text
DERIVATION_ADAPTER_TO_CP004
```

After the short ledger is evaluated, the final query maps to existing CP004 authorities:

```text
highest / lowest  -> RNK-QL-027
entity at position -> RNK-QL-028
true relation      -> RNK-QL-034
```

### Q68 / scaled weight order

```text
DERIVATION_ADAPTER_TO_RNK_QL_038_INVERSE_VARIANT
```

When several valid total rankings remain but the same entity occupies the requested rank in every ranking, the learner surface is the inverse presentation of exact-rank invariance already owned by `RNK-QL-038 EXACT_RANK_DETERMINACY`.

### Q27-Q28 / numeric-value constraints

```text
HOLD_AS_DERIVATION_ADAPTER
```

The numeric layer should normalize into an order state before an existing strict/partial-order query authority is selected.

### Q66 / relational side-count equation

```text
REDIRECT_CP001_EXTENSION
```

Compact algebraic normalization yields ordinary front/behind counts already owned by CP001.

## Ranking versus Quant boundary

Derived arithmetic stays in Ranking only when arithmetic is compact and instrumental and the final assessed burden is order/rank/relation. Substantial age, percentage, profit, equation or optimization work remains Quant even when a comparison appears at the end.

## Object Pool V2

Pinned future-facing foundation:

```text
people:                    96
male/female:               48 / 48
localized person labels:   288
group objects:             20
settings:                  18
ranking semantic domains:   6
symbolic rankable objects: 52
derived quantity domains:   8
partition schemes:          12
derived operation kinds:     8
```

Manifest:

```text
RNK_OBJECT_POOL_V2_MANIFEST_V1
sha256:09fd886c8ef602ab00bd6ca4b1410b963c8db93351881417ec13e538ec4aa452
```

Selection is deterministic. Frozen historical projection paths are not retrofitted merely to adopt the expanded pool.

## Protected boundaries

- one-person rank/side-count arithmetic -> CP001;
- two-person positional relations -> CP002;
- movement/interchange/membership changes -> CP003;
- direct comparisons forcing one strict order -> CP004;
- direct comparisons leaving multiple strict orders -> CP005;
- explicit equality forcing one weak order -> CP006;
- subgroup/category composition around a ranked person -> CP007;
- arithmetic/equational preprocessing -> adapter first, not automatic QL;
- left/right placement, facing, adjacency and seat geometry -> Seating Arrangement;
- substantial arithmetic as main burden -> Quant;
- family inference as main burden -> Blood Relations / mixed puzzle;
- shared passages/caselets -> delivery infrastructure.

## Proof summary

```text
CP001: 9 frozen authorities / RNK-QL-001..009
CP002: 8 frozen authorities / RNK-QL-010..017
CP003: 9 frozen authorities / RNK-QL-018..026
CP004: 9 frozen authorities / RNK-QL-027..035 / 1,728 permanent questions
CP005: 3 frozen authorities / RNK-QL-036..038 /   576 permanent questions
CP006: 3 frozen authorities / RNK-QL-039..041 /   576 permanent questions
CP007: 1 frozen authority   / RNK-QL-042      /   192 permanent questions
```

Cumulative frozen authority count: **42**.

## Current lifecycle

```text
cumulative permanent range: RNK-QL-001..042
next available ID:          RNK-QL-043
CP001..CP007 English frozen:true
chapter-wide final freeze:  false
Hindi/Punjabi:              NOT_STARTED
Question Studio:            DISABLED
persistence:                DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
```

No merge, deployment, publication, persistence, Question Studio activation or translation is authorized by the English freezes.
