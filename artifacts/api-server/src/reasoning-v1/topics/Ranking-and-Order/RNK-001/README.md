# RNK-001 — Ranking and Order

Status: **CP-001 through CP-006 English frozen at `RNK-QL-001..041`; CP007 Discovery V1.1 implemented with zero permanent QLs; `RNK-QL-042` remains unallocated.**

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
7. checkpoint-specific consolidation/freeze records.

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
| `RNK-CP-007` | derived/compositional ranking ownership discovery | **Discovery V1.1; 0 permanent QLs** |
| `RNK-CP-008` | reserved | shared-set assembly is infrastructure, not QL ownership |

## Frozen inventory

```text
RNK-QL-001..009   CP001 one-person rank arithmetic
RNK-QL-010..017   CP002 two-position/separation/mixed-end constraints
RNK-QL-018..026   CP003 movement/interchange/membership transformations
RNK-QL-027..035   CP004 unique strict multi-entity order reasoning
RNK-QL-036..038   CP005 partial-order ranking uncertainty
RNK-QL-039..041   CP006 equality-aware weak-order reasoning
```

Next available identity: **`RNK-QL-042`**.

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

CP007 discovery and the expanded object pool may not change these hashes.

## Corrected post-CP006 source audit

A deeper source pass established:

```text
SOURCE_BACKED_CP007_DISCOVERY_REQUIRED
```

Executable source anchors:

```text
Q27  numeric-value-constrained order
Q28  numeric-value-constrained order
Q35  money transfer -> final balance order
Q65  subgroup composition around rank
Q66  relational side-count equation
Q67  subgroup composition around rank
Q68  weight/equation-derived order
```

This reopened discovery only. It did not allocate `RNK-QL-042`.

## CP007 Discovery V1.1

The first V1 pack was mathematically correct but manual review exposed decorative clues, impossible numeric distractors, ordinal grammar defects, synthetic object labels, weak scaled distractors and incomplete transfer conclusions. V1.1 remediates those defects.

### CATEGORY_COMPOSITION_AROUND_RANK

Source basis: Q65 / Q67.

V1.1 modes:

```text
TARGET_CATEGORY_AFTER
OTHER_CATEGORY_AFTER
TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER
OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER
```

The old `UNKNOWN_CATEGORY_AHEAD` mode was removed because its ratio could be decorative.

Corpus:

```text
4 modes x 72 = 288
answer positions = 72 / 72 / 72 / 72
```

Executable V1.1 gates prove:

```text
perturb target rank -> answer changes
perturb relevant category total -> answer changes
perturb displayed subgroup count -> answer changes
requested subgroup != evidence subgroup
all numeric options satisfy the visible count bound
ordinal grammar is valid
```

Disposition remains:

```text
PROVISIONAL_AUTHORITY_CANDIDATE
```

Nearest alternative remains CP001 composition extension.

### DERIVED_QUANTITY_ORDER

Source basis: Q35 / Q68.

Source forms:

```text
TRANSFER_BALANCE_ORDER
SCALED_OBJECT_ORDER
```

Modes:

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
8 modes x 32 = 256
transfer = 128
scaled-object = 128
answer positions = 64 / 64 / 64 / 64
```

Transfer V1.1:

```text
3 compact transactions
money conserved
4 unique final balances
arithmetic burden = LIGHT
complete mode-specific explanations
```

Scaled-object V1.1:

```text
six A-Z single-letter objects only
at least two valid complete orders
requested rank invariant across witnesses
rank-aware distractors
>=2 distractors within two rank positions in a witness order
arithmetic burden = MODERATE
```

Disposition remains:

```text
DISCOVERY_FAMILY_ADAPTER_VS_QL_UNRESOLVED
```

Preferred architecture hypothesis:

```text
DERIVATION ADAPTER
  -> normalized value/order state
  -> existing CP004/CP005 query authority where possible
```

Do not allocate a new QL merely because the input evidence is arithmetic/equational.

### NUMERIC_VALUE_CONSTRAINED_ORDER

Source basis: Q27-Q28.

```text
HOLD_MERGE_WITH_DERIVED_QUANTITY
```

Source fixture replay exists, but production generation remains deferred pending source diversity and merge testing.

### RELATIONAL_SIDE_COUNT_EQUATION

Source basis: Q66.

```text
REDIRECT_CP001_EXTENSION
```

The equation normalizes to CP001 front/behind identities after a compact algebraic solve.

## CP007 V1.1 totals

```text
category-composition corpus: 288
derived-quantity corpus:     256
combined corpus:             544
permanent CP007 QLs:           0
RNK-QL-042 allocated:       false
```

CI review pack:

```text
RNK-CP-007-DISCOVERY-V1.1-REVIEW-28Q.md
CATEGORY_COMPOSITION_AROUND_RANK  12
DERIVED_QUANTITY_ORDER            16
TOTAL                              28
answer positions             7 / 7 / 7 / 7
```

## CP007 ownership guard

Source evidence does not imply one QL per source form. Before permanent allocation CP007 must decide:

1. whether category composition differs enough from CP001 to own an authority;
2. whether derived quantity is an authority or a derivation adapter over CP004/CP005;
3. whether numeric-value-constrained order merges into the derived-constraint family;
4. where compact arithmetic-as-ranking evidence ends and Quant begins.

`RNK-QL-042` remains free until these decisions survive manual review and merge/split audit.

## Ranking versus Quant boundary

CP007 accepts a derived-quantity item only when arithmetic is compact and instrumental and the final assessed burden is order/rank/relation.

Substantial equation solving, percentage/profit/age calculation or optimization remains Quant even when a comparison appears at the end.

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

Selection is deterministic. Frozen CP001..CP006 retain historical presentation pools.

## Protected boundaries

- one-person rank/side-count arithmetic -> CP001;
- two-person positional relations -> CP002;
- movement/interchange/membership changes -> CP003;
- direct comparisons forcing one strict order -> CP004;
- direct comparisons leaving multiple strict orders -> CP005;
- explicit equality forcing one weak order -> CP006;
- derived/compositional evidence -> CP007 discovery until ownership is proved;
- left/right placement, facing, adjacency and seat geometry -> Seating Arrangement;
- substantial arithmetic as main burden -> Quant;
- family inference as main burden -> Blood Relations / mixed puzzle;
- shared passages/caselets -> delivery infrastructure.

## Proof summary

```text
CP001: 9 frozen authorities / RNK-QL-001..009
CP002: 8 frozen authorities / RNK-QL-010..017
CP003: 9 frozen authorities / RNK-QL-018..026
CP004: 9 frozen authorities / RNK-QL-027..035 / 1,728 permanent
CP005: 3 frozen authorities / RNK-QL-036..038 /   576 permanent
CP006: 3 frozen authorities / RNK-QL-039..041 /   576 permanent
CP007: 0 permanent authorities / 544 V1.1 discovery questions
```

Cumulative frozen authority count: **41**.

## Current lifecycle

```text
cumulative permanent range: RNK-QL-001..041
next available ID:          RNK-QL-042
CP001..CP006 frozen:        true
CP007 Discovery V1.1:       IMPLEMENTED / EXACT-HEAD + MANUAL REVIEW PENDING
CP007 permanent runtime:    NOT AUTHORIZED
CP007 English freeze:       NOT AUTHORIZED
chapter-wide final freeze:  false
Hindi/Punjabi:              NOT_STARTED
Question Studio:            DISABLED
persistence:                DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
```

No merge, deployment, publication, persistence, Question Studio activation, translation or permanent QL allocation is authorized by Discovery V1.1.
