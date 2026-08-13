# RNK-001 — Ranking and Order

Status: **CP-001 through CP-006 English frozen at `RNK-QL-001..041`; CP007 Discovery V1 implemented and awaiting manual review; `RNK-QL-042` remains unallocated.**

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
| `RNK-CP-007` | derived/compositional ranking ownership discovery | **Discovery V1 implemented; 0 permanent QLs** |
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
CP004  sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
CP005  sha256:f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
CP006  sha256:7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

The expanded object pools and CP007 discovery are forbidden from changing these hashes.

## Corrected post-CP006 source audit

A deeper page-level source review superseded the initial saturation conclusion and established:

```text
SOURCE_BACKED_CP007_DISCOVERY_REQUIRED
```

This reopened discovery but did not allocate a QL.

Source anchors now replayed executably:

```text
Q27  numeric-value-constrained order
Q28  numeric-value-constrained order
Q35  money transfer -> final balance order
Q65  subgroup composition around rank
Q66  relational side-count equation
Q67  subgroup composition around rank
Q68  weight/equation-derived order
```

## CP007 Discovery V1

### 1. CATEGORY_COMPOSITION_AROUND_RANK

Source basis: Q65 and Q67.

Implemented modes:

```text
TARGET_CATEGORY_AFTER
OTHER_CATEGORY_AFTER
UNKNOWN_CATEGORY_AHEAD
```

Corpus:

```text
3 modes x 96 = 288 questions
answer positions = 72 / 72 / 72 / 72
```

The normalized solver reconciles total population, subgroup ratio/counts, target rank, target subgroup and the known subgroup-ahead count. Direct lookup questions are rejected.

Current ownership disposition:

```text
PROVISIONAL_AUTHORITY_CANDIDATE
```

Nearest alternative: CP001 composition extension.

### 2. DERIVED_QUANTITY_ORDER

Source basis: Q35 and Q68.

Implemented source forms:

```text
TRANSFER_BALANCE_ORDER
SCALED_OBJECT_ORDER
```

Implemented modes:

```text
HIGHEST_BALANCE
LOWEST_BALANCE
SECOND_HIGHEST_BALANCE
TRUE_FINAL_RELATION
HEAVIEST_OBJECT
LIGHTEST_OBJECT
SECOND_FROM_BOTTOM
FOURTH_FROM_TOP
```

Corpus:

```text
8 modes x 32 = 256 questions
transfer = 128
scaled-object = 128
answer positions = 64 / 64 / 64 / 64
```

Transfer states replay all transactions independently, preserve total money and require distinct final balances.

Scaled-object states retain at least two valid complete orders while requiring the requested rank position to be invariant. This preserves the key source property that the whole order need not be unique for a requested rank fact to be definite.

Current ownership disposition:

```text
DISCOVERY_FAMILY_ADAPTER_VS_QL_UNRESOLVED
```

Preferred architecture hypothesis:

```text
DERIVATION ADAPTER
  -> normalized value/order state
  -> existing CP004/CP005 query authority when possible
```

A new permanent QL is allowed only if this composition fails to preserve a materially distinct learner solve contract.

### 3. NUMERIC_VALUE_CONSTRAINED_ORDER

Source basis: Q27-Q28.

Current disposition:

```text
HOLD_MERGE_WITH_DERIVED_QUANTITY
```

The source fixture is replayed, but no production corpus is created in V1. More source diversity is required before splitting it from the derived-constraint family.

### 4. RELATIONAL_SIDE_COUNT_EQUATION

Source basis: Q66.

Current disposition:

```text
REDIRECT_CP001_EXTENSION
```

The displayed equations normalize to ordinary CP001 side-count identities after a compact algebraic solve. No separate CP007 generator is created for this form.

## Discovery V1 totals

```text
category-composition corpus: 288
derived-quantity corpus:     256
combined generated corpus:   544
permanent CP007 QLs:           0
next available QL:     RNK-QL-042
```

CI also generates a 28-question manual review pack:

```text
CATEGORY_COMPOSITION_AROUND_RANK  12
DERIVED_QUANTITY_ORDER            16
TOTAL                              28
```

## CP007 ownership guard

Source evidence does not imply one QL per source form.

Before any permanent allocation CP007 must decide:

1. whether category composition really differs from CP001 enough for a new QL;
2. whether derived quantity is a QL or a reusable derivation adapter over CP004/CP005;
3. whether numeric-value-constrained order merges into the derived-constraint family;
4. where compact arithmetic-as-ranking-evidence ends and Quant begins.

`RNK-QL-042` stays free until those decisions survive manual review and executable merge/split audit.

## Ranking vs Quant boundary

CP007 accepts a derived-quantity question only when:

- arithmetic is short and instrumental;
- the final assessed task is comparative order/rank/relation;
- substantial calculation is not the main challenge.

Calculation-heavy age, percentage, profit, equation or optimization problems remain Quant even if a final comparison appears.

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
- derived/compositional evidence → CP007 discovery until ownership is proved;
- left/right placement, facing, adjacency and seat-neighbour geometry → Seating Arrangement;
- shared passages/caselets → delivery infrastructure;
- substantial arithmetic as the main burden → Quant;
- family inference as the main burden → Blood Relations / mixed puzzle.

## Object Pool V2

Pinned future-facing pool:

```text
people:                    96
male / female:             48 / 48
person locales:            EN / HI / PA
localized person labels:   288
group objects:             20
setting objects:           18
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

Selection is seeded and deterministic. Frozen CP001..CP006 keep historical pools and projections.

## Proof summary

```text
CP-001: 9 frozen authorities  / RNK-QL-001..009
CP-002: 8 frozen authorities  / RNK-QL-010..017
CP-003: 9 frozen authorities  / RNK-QL-018..026
CP-004: 9 frozen authorities  / RNK-QL-027..035 / 1,728 permanent
CP-005: 3 frozen authorities  / RNK-QL-036..038 /   576 permanent
CP-006: 3 frozen authorities  / RNK-QL-039..041 /   576 permanent
CP-007: 0 permanent authorities / 544 Discovery V1 questions
```

Cumulative frozen authority count: **41**.

## Current lifecycle

```text
cumulative permanent range: RNK-QL-001..041
next available ID:          RNK-QL-042
CP-001..CP-006 frozen:      true
CP-007 Discovery V1:        IMPLEMENTED / MANUAL REVIEW PENDING
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

No merge, deployment, publication, persistence, Question Studio activation, translation or permanent QL allocation is authorized by Discovery V1.
