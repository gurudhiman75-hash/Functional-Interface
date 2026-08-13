# RNK-001 — Open QL Discovery Register

Status: **CP-001 through CP-006 frozen at `RNK-QL-001..041`; CP007 Discovery V1 implemented with zero permanent QLs; `RNK-QL-042` remains unallocated.**

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

CP007 and Object Pool V2 are not allowed to move these hashes.

## Corrected post-CP006 audit

Decision:

```text
SOURCE_BACKED_CP007_DISCOVERY_REQUIRED
```

Source fixtures replayed:

```text
Q27 Q28 Q35 Q65 Q66 Q67 Q68
```

The source evidence justified discovery, not automatic QL allocation.

## CP007 Discovery V1

### Candidate A — CATEGORY_COMPOSITION_AROUND_RANK

Source fixtures: Q65 / Q67.

Implemented modes:

```text
TARGET_CATEGORY_AFTER
OTHER_CATEGORY_AFTER
UNKNOWN_CATEGORY_AHEAD
```

Corpus:

```text
questions:        288
questions/mode:    96
answer positions:  72 / 72 / 72 / 72
```

Disposition:

```text
PROVISIONAL_AUTHORITY_CANDIDATE
```

Primary overlap audit: CP001 side-count arithmetic/composition extension.

### Candidate B — DERIVED_QUANTITY_ORDER

Source fixtures:

```text
Q35  CSAT 2015      money transfers -> final balances -> rank/relation
Q68  SSC MTS 2021   weight relations/equations -> derived order -> rank query
```

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
questions:         256
transfer:          128
scaled-object:     128
answer positions:   64 / 64 / 64 / 64
```

Disposition:

```text
DISCOVERY_FAMILY_ADAPTER_VS_QL_UNRESOLVED
```

Preferred hypothesis:

```text
DERIVATION_ADAPTER
  -> normalized value/order state
  -> existing CP004/CP005 query authority where possible
```

Do not create a new QL merely because evidence is arithmetic/equational.

### Candidate C — NUMERIC_VALUE_CONSTRAINED_ORDER

Source fixtures: Q27-Q28.

Disposition:

```text
HOLD_MERGE_WITH_DERIVED_QUANTITY
```

Source replay exists; production generator intentionally deferred until more source diversity or a distinct solve contract appears.

### Candidate D — RELATIONAL_SIDE_COUNT_EQUATION

Source fixture: Q66.

Disposition:

```text
REDIRECT_CP001_EXTENSION
```

The relation normalizes into ordinary CP001 side-count identities after a compact algebraic solve. No separate CP007 corpus is created.

## Discovery V1 totals

```text
category-composition: 288
derived-quantity:     256
combined corpus:      544
permanent QLs:          0
RNK-QL-042 allocated: false
```

Manual review artifact:

```text
RNK-CP-007-DISCOVERY-V1-REVIEW-28Q.md
12 category-composition + 16 derived-quantity
```

## Allocation lock

The current four discovery candidates are not four QLs.

Before any permanent ID can be allocated:

1. category composition must survive CP001 overlap review;
2. derived quantity must be tested as an adapter over CP004/CP005 before becoming a QL;
3. numeric-value constraints must survive merge testing;
4. relational side-count equations remain CP001-bound unless stronger evidence appears;
5. manual exam-readiness review must pass;
6. Question Studio and persistence remain disabled.

## Ranking vs Quant boundary

Derived/compositional questions stay in Ranking only when arithmetic is short and instrumental and the final learner task is order/rank/relation.

Substantial equation solving, percentage/profit/age calculation or optimization remains Quant even when a comparison appears at the end.

## Object-pool remediation

Pinned Object Pool V2:

```text
people:                    96
localized person labels:   288
male/female:               48 / 48
group objects:             20
settings:                  18
ordinary semantic domains:  6
symbolic rankable objects: 52
derived quantity domains:   8
partition schemes:          12
derived operation kinds:     8
```

Manifest:

```text
sha256:09fd886c8ef602ab00bd6ca4b1410b963c8db93351881417ec13e538ec4aa452
```

Selection is deterministic. Frozen CP001..CP006 retain historical pools.

## Held / redirected candidates

```text
NUMERIC_POST_TIE_RANK_CONVENTION  HOLD
MULTIPLE_INDEPENDENT_TIE_GROUPS   HOLD
TIE_CLASS_SIZE_GTE_3               HOLD
SHARED_RANKING_CASELETS            INFRASTRUCTURE
MIXED_RANKING_AND_BLOOD_RELATION   OTHER CHAPTER / MIXED PUZZLE
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
CP007 Discovery V1:         IMPLEMENTED / MANUAL REVIEW PENDING
CP007 permanent QLs:        0
CP007 permanent runtime:    NOT AUTHORIZED
CP007 English freeze:       NOT AUTHORIZED
Question Studio:            DISABLED
persistence:                DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
Hindi/Punjabi:              NOT_STARTED
```

No merge, deployment, publication, persistence, Question Studio enablement, translation or QL allocation is authorized by Discovery V1.
