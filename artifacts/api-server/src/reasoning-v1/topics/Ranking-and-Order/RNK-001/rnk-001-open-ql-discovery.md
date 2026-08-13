# RNK-001 — Open QL Discovery Register

Status: **CP-001 through CP-006 frozen at `RNK-QL-001..041`; CP007 Discovery V1.1 implemented with zero permanent QLs; `RNK-QL-042` remains unallocated.**

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

Frozen tail projections remain:

```text
CP004  39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
CP005  f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
CP006  7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

CP007 and Object Pool V2 must not move these hashes.

## Corrected post-CP006 audit

Decision:

```text
SOURCE_BACKED_CP007_DISCOVERY_REQUIRED
```

Executable source anchors:

```text
Q27 Q28 Q35 Q65 Q66 Q67 Q68
```

Discovery is justified; another permanent QL is not yet justified.

## CP007 Discovery V1.1

### Candidate A — CATEGORY_COMPOSITION_AROUND_RANK

Source fixtures: Q65 / Q67.

V1.1 modes:

```text
TARGET_CATEGORY_AFTER
OTHER_CATEGORY_AFTER
TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER
OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER
```

The old `UNKNOWN_CATEGORY_AHEAD` mode was removed because the subgroup ratio could be decorative.

Corpus:

```text
questions:        288
questions/mode:    72
answer positions:  72 / 72 / 72 / 72
```

V1.1 gates require:

- displayed subgroup evidence concerns the opposite category from the requested one;
- perturbing target rank changes the answer;
- perturbing the relevant ratio-derived category total changes the answer;
- perturbing the displayed subgroup count changes the answer;
- every numeric option stays inside the visible mathematical bound;
- ordinal grammar is valid;
- explanations do not render meaningless `- 0` arithmetic.

Disposition:

```text
PROVISIONAL_AUTHORITY_CANDIDATE
```

Primary overlap audit remains CP001 side-count/composition extension.

### Candidate B — DERIVED_QUANTITY_ORDER

Source fixtures:

```text
Q35  CSAT 2015      money transfers -> final balances -> rank/relation
Q68  SSC MTS 2021   weight relations/equations -> derived order -> rank query
```

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
questions:         256
transfer:          128
scaled-object:     128
answer positions:   64 / 64 / 64 / 64
```

V1.1 transfer remediation:

```text
arithmetic burden: LIGHT
complete mode-specific solution conclusions
```

V1.1 scaled remediation:

```text
arithmetic burden: MODERATE
exam-facing symbols: A-Z single letters only
synthetic labels P9/Q12/etc: forbidden
rank-aware distractors: enabled
>=2 wrong options within two rank positions in a witness order: required
```

Disposition:

```text
DISCOVERY_FAMILY_ADAPTER_VS_QL_UNRESOLVED
```

Preferred architecture:

```text
DERIVATION_ADAPTER
  -> normalized value/order state
  -> existing CP004/CP005 query authority where possible
```

Do not create a QL merely because the input evidence is arithmetic/equational.

### Candidate C — NUMERIC_VALUE_CONSTRAINED_ORDER

Source fixtures: Q27-Q28.

Disposition:

```text
HOLD_MERGE_WITH_DERIVED_QUANTITY
```

Source replay exists; production generation remains intentionally deferred pending more source diversity or a distinct solve contract.

### Candidate D — RELATIONAL_SIDE_COUNT_EQUATION

Source fixture: Q66.

Disposition:

```text
REDIRECT_CP001_EXTENSION
```

The displayed equation normalizes into ordinary CP001 side-count identities after a compact algebraic solve.

## V1.1 totals

```text
category-composition: 288
derived-quantity:     256
combined corpus:      544
permanent CP007 QLs:    0
RNK-QL-042 allocated: false
```

Manual review artifact:

```text
RNK-CP-007-DISCOVERY-V1.1-REVIEW-28Q.md
12 category-composition + 16 derived-quantity
answer positions: 7 / 7 / 7 / 7
```

## Allocation lock

The four discovery candidates are not four QLs.

Before any permanent allocation:

1. category composition must survive CP001 overlap review;
2. derived quantity must be tested as an adapter over CP004/CP005;
3. numeric-value constraints must survive merge testing;
4. relational side-count equations remain CP001-bound unless stronger evidence appears;
5. manual exam-readiness review must pass;
6. Question Studio/persistence remain disabled.

## Ranking versus Quant boundary

Derived/compositional questions stay in Ranking only when arithmetic is compact and instrumental and the final learner burden is order/rank/relation.

Substantial equation solving, percentage/profit/age calculation or optimization remains Quant even when a comparison appears at the end.

## Object Pool V2

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

Pinned manifest:

```text
sha256:09fd886c8ef602ab00bd6ca4b1410b963c8db93351881417ec13e538ec4aa452
```

Frozen CP001..CP006 retain their historical presentation pools.

## Held / redirected candidates

```text
NUMERIC_POST_TIE_RANK_CONVENTION  HOLD
MULTIPLE_INDEPENDENT_TIE_GROUPS   HOLD
TIE_CLASS_SIZE_GTE_3               HOLD
SHARED_RANKING_CASELETS            INFRASTRUCTURE
MIXED_RANKING_AND_BLOOD_RELATION   OTHER CHAPTER / MIXED PUZZLE
```

## Lifecycle

```text
cumulative permanent range: RNK-QL-001..041
next available RNK ID:      RNK-QL-042
CP007 Discovery V1.1:       IMPLEMENTED / EXACT-HEAD + MANUAL REVIEW PENDING
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

No merge, deployment, publication, persistence, Question Studio enablement, translation or QL allocation is authorized by Discovery V1.1.
