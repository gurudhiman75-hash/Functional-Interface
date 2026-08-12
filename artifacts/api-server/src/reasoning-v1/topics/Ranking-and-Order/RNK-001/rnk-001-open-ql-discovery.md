# RNK-001 — Open QL Discovery Register

Status: **CP-001 through CP-006 frozen at `RNK-QL-001..041`; CP007 source-backed discovery open; `RNK-QL-042` remains unallocated.**

Counts in this register are evidence, never chapter-size quotas.

## Frozen inventory

```text
RNK-CP-001  9 authorities  RNK-QL-001..009
RNK-CP-002  8 authorities  RNK-QL-010..017
RNK-CP-003  9 authorities  RNK-QL-018..026
RNK-CP-004  9 authorities  RNK-QL-027..035
RNK-CP-005  3 authorities  RNK-QL-036..038
RNK-CP-006  3 authorities  RNK-QL-039..041
```

Cumulative frozen authorities: **41**.

Next available identity: **`RNK-QL-042`**.

## Frozen projections

```text
CP002  e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
CP003  6457a50fdde7673f9e66fe607a47a5c38a4c921489ed387b72c87ef8a22947d5
CP004  39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
CP005  f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
CP006  7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

The expanded object pools are forbidden from silently changing these projections.

## Book-to-QL ownership reset

The 2026-08-08 audit established these protected boundaries:

- ordinary one-person rank arithmetic → CP001;
- two-person positional/separation logic → CP002;
- movement/interchange/insertion/removal → CP003;
- one unique strict multi-entity comparison order → CP004;
- multiple valid strict orders / uncertainty → CP005;
- explicit equality / one unique weak order → CP006;
- seating-facing/adjacency geometry → Seating Arrangement;
- shared passages → infrastructure;
- substantial arithmetic whose main target is calculation → Quant;
- family inference as the main burden → Blood Relations / mixed puzzle.

## CP004 frozen state contract

```text
ONE_UNIQUE_STRICT_TOTAL_ORDER
```

Authorities:

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

## CP005 frozen state contract

```text
MULTIPLE_VALID_STRICT_TOTAL_ORDERS
```

Authorities:

```text
RNK-QL-036  RELATION_TRUTH_STATUS
RNK-QL-037  POSSIBLE_RANK_BOUND
RNK-QL-038  EXACT_RANK_DETERMINACY
```

Permanent runtime: **576**.

## CP006 frozen state contract

```text
ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY
```

Authorities:

```text
RNK-QL-039  EQUALITY_AWARE_PAIR_RELATION
RNK-QL-040  EQUALITY_AWARE_ENDPOINT
RNK-QL-041  COMPLETE_WEAK_ORDER
```

Permanent runtime: **576**.

The direct equality-lookup source form was rejected. Numeric post-tie rank conventions remain excluded.

## Corrected post-CP006 source audit

The initial saturation conclusion was superseded after a deeper page-level review of the Ranking source.

Current decision:

```text
SOURCE_BACKED_CP007_DISCOVERY_REQUIRED
```

This is a discovery decision only. No permanent QL has been allocated.

## Open RNK-CP-007 — Derived and Compositional Ranking

### Candidate A — CATEGORY_COMPOSITION_AROUND_RANK

Source fixtures: Ranking Q65 and Q67.

Pattern:

```text
total population
+ category ratio/count
+ target rank
+ count of one category ahead
-> requested category count after target
```

Disposition: `DISCOVER_AS_PROVISIONAL_AUTHORITY`.

Primary overlap audit: CP001 side-count arithmetic.

### Candidate B — DERIVED_QUANTITY_ORDER

Source fixtures:

```text
Q35 [CSAT 2015]      money transfers -> final balances -> comparative rank
Q68 [SSC MTS 2021]  weight ratios/equations -> derived order -> rank query
```

Disposition: `DISCOVER_AS_PROVISIONAL_AUTHORITY`.

Primary boundary audit: direct Ranking reasoning versus arithmetic-dominant Quant.

### Candidate C — NUMERIC_VALUE_CONSTRAINED_ORDER

Source fixtures: Q27-Q28 [CSAT 2015].

Bounded consecutive ages, exact offsets, comparison constraints and excluded values jointly determine possible values/orders.

Disposition: `AUDIT_MERGE_WITH_DERIVED_QUANTITY_ORDER`.

### Candidate D — RELATIONAL_SIDE_COUNT_EQUATION

Source fixture: Q66.

Front/behind counts for two people are linked by equations.

Disposition: `AUDIT_EXTENSION_OF_CP001`.

## CP007 allocation lock

```text
RNK-QL-042 allocated:          false
CP007 permanent authorities:   0
CP007 permanent runtime:       NOT AUTHORIZED
CP007 English freeze:          NOT AUTHORIZED
```

The four source candidates are **not four QLs**. They must undergo solver construction and merge/split ownership review first.

## Held / redirected candidates

```text
NUMERIC_POST_TIE_RANK_CONVENTION  HOLD
MULTIPLE_INDEPENDENT_TIE_GROUPS   HOLD
TIE_CLASS_SIZE_GTE_3               HOLD
SHARED_RANKING_CASELETS            INFRASTRUCTURE
MIXED_RANKING_AND_BLOOD_RELATION   OTHER CHAPTER / MIXED PUZZLE
```

## Object-pool remediation

The audit also found a presentation-diversity weakness: frozen mathematics is strong, but historical generators use small checkpoint-local pools.

Future-facing foundation now provides:

```text
96 people / 288 EN-HI-PA person labels
20 neutral group objects
18 setting objects
6 ordinary ranking semantic domains
6 multilingual relation-template sets
52 symbolic rankable objects
8 derived quantity domains
12 subgroup partition schemes
8 derived-operation surface families
```

All selection APIs are deterministic and seeded. Frozen CP001..CP006 retain their historical pools to protect projections.

See:

```text
foundation/rnk-object-pool-v2.ts
foundation/rnk-presentation-object-pool-v2.ts
foundation/rnk-derived-object-pool-v2.ts
```

## Protected exclusions

```text
lexicographic/dictionary position              -> Word and Dictionary Order
seating adjacency/facing/geometry              -> Seating Arrangement
multi-attribute assignment                     -> Logic Puzzles
league/tournament scoring                      -> Games and Tournament
statement I/II sufficiency                     -> Data Sufficiency
alphabet position without ranked group         -> Alphabet Test
substantial arithmetic as the main burden      -> Quant
family/gender inference as the main burden     -> Blood Relations / Mixed Puzzle
```

## Lifecycle

```text
cumulative permanent range: RNK-QL-001..041
next available RNK ID:      RNK-QL-042
post-CP006 decision:        SOURCE_BACKED_CP007_DISCOVERY_REQUIRED
CP007 discovery:            OPEN
CP007 permanent QLs:        0
Question Studio:            DISABLED
persistence:                DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
Hindi/Punjabi:              NOT_STARTED
```

No merge, deployment, publication, persistence or Question Studio enablement is authorized by this audit.
