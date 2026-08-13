# RNK-CP-007 — Derived and Compositional Ranking

Status: **ENGLISH FROZEN — `RNK-QL-042 = CATEGORY_COMPOSITION_AROUND_RANK`; derived-quantity source forms are adapters, not new QLs.**

CP007 began as a source-backed discovery checkpoint after the post-CP006 audit found Ranking questions whose visible evidence must be transformed compositionally or arithmetically before a rank/order conclusion can be reached. Manual review and merge/split testing narrowed the checkpoint from several source forms to **one genuinely new permanent authority**.

## Permanent authority

```text
RNK-QL-042  CATEGORY_COMPOSITION_AROUND_RANK
```

Source basis:

```text
Aggarwal Ranking Q65
Aggarwal Ranking Q67
```

The learner must combine:

```text
whole-group total
+ ratio/count of two categories
+ target person's category
+ target person's rank
+ one opposite-category count ahead/after
-> requested category count ahead/after
```

This is not reducible to frozen CP001 without adding a new subgroup-composition state dimension. CP001 owns ordinary one-person rank/side-count arithmetic; `RNK-QL-042` owns cross-category composition around that ranked person.

## Permanent runtime

Runtime:

```text
RNK_CP007_PERMANENT_RUNTIME_V1
RNK_CP007_ENGLISH_FREEZE_V1
```

Question count:

```text
RNK-QL-042: 192
```

Modes:

```text
TARGET_CATEGORY_AFTER                    48
OTHER_CATEGORY_AFTER                     48
TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER   48
OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER   48
```

Answer positions:

```text
A / B / C / D = 48 / 48 / 48 / 48
```

Difficulty:

```text
MEDIUM  144
HARD     48
```

Surface diversity:

```text
CANONICAL       48
RANKED_LIST     48
ORDER_OF_MERIT  48
COMPACT_RATIO   48
```

Context/object diversity:

```text
approved partition contexts: 11
distinct target names:        84
unique mathematical states:   192
unique learner surfaces:      192
```

Every permanent question is independently re-solved. The freeze gate also proves that the rank clue, category-total/ratio clue, and displayed opposite-category count are each essential to the answer. Numeric distractors remain inside visible feasible bounds, answer/evidence number echoes are rejected, and each item contains at least two structural misconception distractors.

## Pinned projections

Production candidate:

```text
sha256:63e8cc87812f1ec4546d23829022f333736a03c5e9aa8142384bcab15817dc94
```

Permanent frozen runtime:

```text
sha256:44aefb019c1a55308b58f4b285b1b6f7df97dea0185652d6de73e2dafbbd446b
```

Both hashes are hard-pinned and must fail CI on drift.

## Source forms rejected as new QLs

Source evidence does not imply one QL per source form. CP007's final ownership audit explicitly rejects duplicate permanent authorities for the following forms.

### Transfer balance order — adapter to CP004

Source anchor: Aggarwal Q35 / CSAT 2015.

After the short transfer ledger is evaluated, final balances form a unique strict order. The final question is already owned by CP004:

```text
highest / lowest final balance  -> RNK-QL-027 ENDPOINT_ENTITY
second-highest final balance    -> RNK-QL-028 ENTITY_AT_POSITION
true final relation             -> RNK-QL-034 DEFINITELY_TRUE_RELATION
```

Disposition:

```text
DERIVATION_ADAPTER_TO_CP004
```

No new QL.

### Scaled/weight order — adapter to RNK-QL-038 inverse presentation

Source anchor: Aggarwal Q68 / SSC MTS 2021.

The derived weight constraints can leave several complete orders valid while the same entity occupies the requested position in every valid order. Q68's structural property is therefore:

```text
multiple valid rankings
+ entity invariant at requested rank
```

Asking **which entity** occupies that invariant rank is the inverse learner surface of `RNK-QL-038 EXACT_RANK_DETERMINACY`, whose proof contract is exact-rank invariance across all valid total rankings.

Disposition:

```text
DERIVATION_ADAPTER_TO_RNK_QL_038_INVERSE_VARIANT
```

No new QL.

### Numeric-value-constrained order

Source anchors: Aggarwal Q27-Q28 / CSAT 2015.

Disposition:

```text
HOLD_AS_DERIVATION_ADAPTER
```

The numeric layer should normalize into an order state before an existing strict/partial-order authority handles the learner query. No separate permanent authority is justified by current evidence.

### Relational side-count equation

Source anchor: Aggarwal Q66.

Disposition:

```text
REDIRECT_CP001_EXTENSION
```

A compact algebraic normalization yields ordinary front/behind counts already owned by CP001. The equation is preprocessing, not a new Ranking authority.

## Historical discovery evidence

The following source fixtures remain executable evidence:

```text
Q27 Q28 Q35 Q65 Q66 Q67 Q68
```

Discovery V1.1 generated:

```text
category composition: 288
derived quantity:     256
combined:             544
```

The 28-question V1.1 discovery pack was manually reviewed with:

```text
wrong keys:            0
ambiguous items:       0
invalid explanations:  0
editorial verdict:     PASS
```

The final category production candidate was separately reviewed through a 24-question balanced pack before freeze.

## Object pool

CP007 uses the pinned future-facing Ranking Object Pool V2:

```text
96 localized people
52 symbolic rankable objects
20 group objects
18 settings
12 partition schemes
8 derived quantity domains
8 derived-operation families
EN / HI / PA infrastructure
```

Object-pool manifest:

```text
sha256:09fd886c8ef602ab00bd6ca4b1410b963c8db93351881417ec13e538ec4aa452
```

Frozen CP001..CP006 projection paths remain unchanged.

## Ranking versus Quant boundary

Derived arithmetic remains in Ranking only when the arithmetic is compact and instrumental and the assessed endpoint is ranking/order/relation. Calculation-heavy age, percentage, profit, equation or optimization work remains Quant even when a comparison appears at the end.

## Lifecycle

```text
permanent CP007 QLs:    1
permanent range:        RNK-QL-042
English freeze:         true
next available RNK ID:  RNK-QL-043
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```

This English freeze does **not** authorize merge, deployment, persistence, publication, Question Studio activation, Question Bank storage, test eligibility or translation.
