# RNK-001 — Ranking and Order

Status: **chapter-wide English content/authority freeze complete at `RNK-QL-001..042`; CP008 closes adapters/caselets with zero new QLs; next available identity is `RNK-QL-043`.**

Student-facing chapter: **Ranking and Order**  
Reasoning V1 package: `RNK-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/`

This is an **English content freeze**, not a multilingual/product freeze. Hindi/Punjabi and all product lifecycle surfaces remain locked.

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `RNK-001-END-TO-END-DESIGN.md` plus post-CP006 amendment;
4. `rnk-001-open-ql-discovery.md`;
5. `RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md`;
6. `RNK-001-POST-CP006-CHAPTER-GAP-AUDIT-2026-08-12.md`;
7. `RNK-001-CHAPTER-WIDE-ENGLISH-CONTENT-FREEZE-V1.md`;
8. checkpoint-specific ownership/freeze records.

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
| `RNK-CP-008` | source-backed derivation adapters + shared ranking caselets | English closure; **0 new QLs** |

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

Cumulative permanent authority count: **42**.  
Next available identity: **`RNK-QL-043`**.  
CP008 does not reserve or allocate it.

## Multi-entity state contracts

```text
CP004  ONE_UNIQUE_STRICT_TOTAL_ORDER
CP005  MULTIPLE_VALID_STRICT_TOTAL_ORDERS
CP006  ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY
CP007  PARTITIONED_POPULATION_AROUND_NAMED_RANK
CP008  PREPROCESS_OR_SHARE_EVIDENCE_THEN_ROUTE_EXISTING_QL
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

Source basis: Aggarwal Ranking Q65 and Q67. The solve state requires a partitioned population plus cross-category evidence and is not reducible to CP001 side-count arithmetic.

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

Expanded pools, adapters and shared delivery may not move frozen hashes.

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

## CP008 zero-new-QL closure

CP008 closes the remaining source-backed preprocessing/delivery forms without changing permanent QL identity.

### Q35 — transfer balance order

After the short ledger is evaluated, the final strict-order query maps to:

```text
highest / lowest       -> RNK-QL-027
second-highest         -> RNK-QL-028
true final relation    -> RNK-QL-034
```

### Q68 — scaled object order

When several valid rankings remain but the requested position has the same occupant in every order:

```text
-> RNK-QL-038 EXACT_RANK_DETERMINACY
```

### Q27-Q28 — bounded numeric-value constraints

CP008 now normalizes bounded consecutive numeric domains into valid ranking orders.

Pure Ranking projections route to existing authorities:

```text
unique complete order               -> RNK-QL-030
unique entity at position           -> RNK-QL-028
unique rank of entity               -> RNK-QL-029
unique pair relation                -> RNK-QL-031
multi-order pair truth/status       -> RNK-QL-036
multi-order exact-rank invariance   -> RNK-QL-038
```

The original learner surfaces that ask an exact numeric attribute value or count satisfying numeric models are classified `REDIRECT_MIXED_NUMERIC_CONSTRAINT`. Their answer semantic is not a new pure Ranking authority, so they do not justify `RNK-QL-043`.

### Q66 — relational side-count equation

The displayed total plus compact equation is preprocessing into the CP001 total/rank model:

```text
-> RNK-QL-004 OPPOSITE_SIDE_COUNT_FROM_TOTAL_AND_RANK
```

The V1 draft that hid the total population is superseded. CP008 V1.1 explicitly exposes the total, so the displayed evidence alone is sufficient.

### Shared ranking caselets

Shared passages are delivery infrastructure. CP008 independently re-solves each common clue set and keeps child ownership on existing QLs, currently including:

```text
RNK-QL-027
RNK-QL-028
RNK-QL-031
RNK-QL-033
```

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

Frozen historical projection paths are not retrofitted merely to adopt the expanded pool.

## Protected boundaries

- one-person rank/side-count arithmetic -> CP001;
- two-person positional relations -> CP002;
- movement/interchange/membership changes -> CP003;
- direct comparisons forcing one strict order -> CP004;
- direct comparisons leaving multiple strict orders -> CP005;
- explicit equality forcing one weak order -> CP006;
- subgroup/category composition around a ranked person -> CP007;
- arithmetic/equational preprocessing -> CP008 adapter first, not automatic QL;
- shared passages/caselets -> CP008 delivery infrastructure;
- exact numeric-value/model-count burden -> mixed numeric-constraint ownership;
- left/right placement with seat geometry/facing -> Seating Arrangement;
- substantial arithmetic as main burden -> Quant;
- family inference as main burden -> Blood Relations / mixed puzzle.

## Historical superseded snapshots

These files remain historical evidence but are not current chapter-final gates:

```text
rnk-001-book-ownership-reset.test.ts
  CP004-era snapshot ending at RNK-QL-035

rnk-001-post-cp006-gap-audit.test.ts
  pre-CP007 snapshot ending at RNK-QL-041
```

They must not overwrite later CP005-CP008 ownership/freeze evidence.

## Proof summary

```text
CP001: 9 frozen authorities / RNK-QL-001..009
CP002: 8 frozen authorities / RNK-QL-010..017
CP003: 9 frozen authorities / RNK-QL-018..026
CP004: 9 frozen authorities / RNK-QL-027..035 / 1,728 permanent questions
CP005: 3 frozen authorities / RNK-QL-036..038 /   576 permanent questions
CP006: 3 frozen authorities / RNK-QL-039..041 /   576 permanent questions
CP007: 1 frozen authority   / RNK-QL-042      /   192 permanent questions
CP008: 0 frozen authorities / adapter + caselet closure
```

The chapter-wide gate requires one continuous unique permanent sequence `RNK-QL-001..042`, unchanged CP004-CP007 projection anchors, CP008 zero allocation, and RNK absence from the live Reasoning Question Studio review registry.

## Current lifecycle

```text
cumulative permanent range:          RNK-QL-001..042
next available ID:                   RNK-QL-043
CP001..CP007 English frozen:         true
CP008 adapter/caselet closure:       validated candidate
chapter-wide English content freeze: true
multilingual/product final freeze:   false
Hindi/Punjabi:                       NOT_STARTED
Question Studio:                     DISABLED / NOT REGISTERED
persistence:                         DISABLED
Question Bank:                       NOT_STORED
test eligibility:                    INELIGIBLE
public publication:                  false
```

No deployment, publication, persistence, Question Studio activation or translation is authorized by the English content freeze.