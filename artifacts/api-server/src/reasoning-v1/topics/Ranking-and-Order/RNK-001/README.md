# RNK-001 — Ranking and Order

Status: **CP-001 through CP-006 English frozen at `RNK-QL-001..041`; source-backed CP007 discovery reopened; `RNK-QL-042` remains unallocated.**

Student-facing chapter: **Ranking and Order**  
Reasoning V1 package: `RNK-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `RNK-001-END-TO-END-DESIGN.md` plus its post-CP006 amendment;
4. `rnk-001-open-ql-discovery.md`;
5. `RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md`;
6. `RNK-001-POST-CP006-CHAPTER-GAP-AUDIT-2026-08-12.md`;
7. checkpoint-specific consolidation/freeze records.

The original checkpoint map was provisional. Implementation and source audits supersede it where they provide stronger evidence.

## Checkpoint map

| Checkpoint | Ownership | State |
|---|---|---|
| `RNK-CP-001` | one-person rank arithmetic, side counts, totals, exact-middle inverses | frozen `RNK-QL-001..009` |
| `RNK-CP-002` | two-person positions, separation, comparison, mixed-end totals | frozen `RNK-QL-010..017` |
| `RNK-CP-003` | interchange, movement, overtaking, insertion/removal | frozen `RNK-QL-018..026` |
| `RNK-CP-004` | unique multi-entity strict-order reasoning | frozen `RNK-QL-027..035` |
| `RNK-CP-005` | partial order / ranking uncertainty | frozen `RNK-QL-036..038` |
| `RNK-CP-006` | equality-aware / tied comparison ranking | frozen `RNK-QL-039..041` |
| `RNK-CP-007` | derived/compositional ranking ownership discovery | **open discovery; zero QLs allocated** |
| `RNK-CP-008` | reserved | shared-set assembly is infrastructure, not QL ownership |

## Frozen inventory

```text
RNK-QL-001..009   CP-001 one-person rank arithmetic
RNK-QL-010..017   CP-002 two-position/separation/mixed-end constraints
RNK-QL-018..026   CP-003 movement/interchange/membership transformations
RNK-QL-027..035   CP-004 unique strict multi-entity order reasoning
RNK-QL-036..038   CP-005 partial-order ranking uncertainty
RNK-QL-039..041   CP-006 equality-aware weak-order reasoning
```

Next available identity: **`RNK-QL-042`**. It remains intentionally unallocated.

## Frozen multi-entity state contracts

```text
CP004  ONE_UNIQUE_STRICT_TOTAL_ORDER
CP005  MULTIPLE_VALID_STRICT_TOTAL_ORDERS
CP006  ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY
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

## Frozen projection anchors

```text
CP004
sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f

CP005
sha256:f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717

CP006
sha256:7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

The object-pool expansion must not change these hashes.

## Post-CP006 corrected source audit

The first post-CP006 pass was too aggressive in declaring the chapter saturated. A deeper page-level read of the primary Ranking chapter found source-backed families whose displayed evidence is not represented by the frozen QLs.

Corrected decision:

```text
SOURCE_BACKED_CP007_DISCOVERY_REQUIRED
```

This **does not** allocate a new QL. It only reopens discovery.

### CP007 candidate 1 — category composition around rank

Source Ranking Q65/Q67 combine:

```text
total class size
+ subgroup ratio/count
+ target person's rank
+ known members of one subgroup ahead
-> requested subgroup count after target
```

This exceeds CP001's ordinary one-person side-count arithmetic because subgroup composition must be reconciled with rank position.

Provisional status: `DISCOVER_AS_PROVISIONAL_AUTHORITY`.

### CP007 candidate 2 — derived quantity order

Source-backed examples include:

- CSAT 2015 money transfers -> final balances -> comparative ranking;
- SSC MTS 2021 weight ratios/equations -> derived order -> second-from-bottom query.

Input is arithmetic/equational, then ranking is derived. This differs from CP004's direct comparison graph.

Provisional status: `DISCOVER_AS_PROVISIONAL_AUTHORITY`.

### CP007 candidate 3 — numeric-value-constrained order

Source Q27-Q28 constrains ages to a bounded consecutive numeric domain with exact offsets, order relations and excluded values.

Provisional status: `AUDIT_MERGE_WITH_DERIVED_QUANTITY_ORDER`.

### CP007 candidate 4 — relational side-count equation

Source Q66 links front/behind counts for two people through multiplicative/equality constraints.

Provisional status: `AUDIT_EXTENSION_OF_CP001`.

See `RNK-CP-007/README.md` and `RNK-001-POST-CP006-CHAPTER-GAP-AUDIT-2026-08-12.md`.

## CP007 ownership guard

The existence of source evidence does not mean four new QLs.

Before any permanent allocation CP007 must determine:

1. whether category-composition really differs from CP001 strongly enough for a new QL;
2. whether numeric-value-constrained order merges into derived-quantity order;
3. whether relational side-count equations are merely a CP001 mode;
4. where the boundary lies between compact arithmetic-as-ranking-evidence and full Quant problems.

`RNK-QL-042` stays free until that audit is complete.

## Held / redirected gaps

```text
numeric post-tie numbering convention    HOLD
multiple independent tie groups          HOLD
tie class size >= 3                       HOLD
shared ranking caselets                   INFRASTRUCTURE
ranking + family/gender inference         BLOOD RELATIONS / MIXED PUZZLE
```

## Protected chapter boundaries

- rank arithmetic and side counts → CP001;
- two-person positional relations → CP002;
- interchange/movement/membership changes → CP003;
- direct comparisons forcing one unique strict order → CP004;
- direct comparisons leaving multiple valid strict orders → CP005;
- explicit equality forcing one unique weak order → CP006;
- arithmetic/compositional evidence that may derive rank/order → CP007 discovery only until ownership is proved;
- left/right placement, facing, adjacency and seat-neighbour geometry → Seating Arrangement;
- shared passages/caselets → delivery infrastructure;
- substantial arithmetic as the main burden → Quant;
- family inference as the main burden → Blood Relations / mixed puzzle.

## Object Pool V2

The audit found a generation-diversity weakness independent of mathematical coverage: some historical frozen generators use small local name arrays. Those arrays remain immutable because they are projection-bearing.

Future-facing shared pools now live under `foundation/`.

### Person/context pool

```text
people:                    96
male / female:             48 / 48
person locales:            EN / HI / PA
localized person labels:   288
group objects:             20
setting objects:           18
ranking semantic domains:   6
relation template sets:      6 x 3 locales
```

### Derived/compositional pool

```text
symbolic rankable objects: 52
derived quantity domains:   8
partition schemes:          12
derived operation kinds:     8
locales:                    EN / HI / PA
```

Derived domains include weight, money balance, age, population count, score, time taken, height and income. Operation surfaces include transfer, multiplier, fraction, exact difference, sum comparison, category ratio, category-ahead count and bounded consecutive values.

### Determinism

Selection is seed-driven. No V2 pool selector uses `Math.random()`.

New/future generators must opt in explicitly; frozen CP001..CP006 do not silently adopt the new pools.

## Proof summary

```text
CP-001: 9 frozen authorities  / RNK-QL-001..009
CP-002: 8 frozen authorities  / RNK-QL-010..017
CP-003: 9 frozen authorities  / RNK-QL-018..026
CP-004: 9 frozen authorities  / RNK-QL-027..035 / 1,728 permanent
CP-005: 3 frozen authorities  / RNK-QL-036..038 /   576 permanent
CP-006: 3 frozen authorities  / RNK-QL-039..041 /   576 permanent
CP-007: 0 permanent authorities / discovery open
```

Cumulative frozen authority count: **41**.

## Current lifecycle

```text
cumulative permanent range: RNK-QL-001..041
next available ID:          RNK-QL-042
CP-001..CP-006 frozen:      true
post-CP006 audit decision:  SOURCE_BACKED_CP007_DISCOVERY_REQUIRED
CP-007 discovery:           AUTHORIZED
CP-007 permanent runtime:   NOT AUTHORIZED
CP-007 English freeze:      NOT AUTHORIZED
chapter-wide final freeze:  false
Hindi/Punjabi:              NOT_STARTED
Question Studio:            DISABLED
persistence:                DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
```

This audit and pool expansion do not authorize merge, deployment, publication, persistence, Question Studio generation or translation.
