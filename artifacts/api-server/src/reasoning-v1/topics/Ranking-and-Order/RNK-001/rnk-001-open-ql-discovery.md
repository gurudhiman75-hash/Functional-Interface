# RNK-001 — Open QL Discovery Register

Status: **CP-001 through CP-007 frozen at `RNK-QL-001..042`; next available identity is `RNK-QL-043`.**

Counts are evidence, never chapter-size quotas.

## Frozen inventory

```text
RNK-CP-001   9 authorities  RNK-QL-001..009
RNK-CP-002   8 authorities  RNK-QL-010..017
RNK-CP-003   9 authorities  RNK-QL-018..026
RNK-CP-004   9 authorities  RNK-QL-027..035
RNK-CP-005   3 authorities  RNK-QL-036..038
RNK-CP-006   3 authorities  RNK-QL-039..041
RNK-CP-007   1 authority    RNK-QL-042
```

Cumulative frozen authorities: **42**.  
Next available identity: **`RNK-QL-043`**.

## Frozen projection tail

```text
CP004  39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
CP005  f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
CP006  7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
CP007  44aefb019c1a55308b58f4b285b1b6f7df97dea0185652d6de73e2dafbbd446b
```

CP007 pinned candidate:

```text
63e8cc87812f1ec4546d23829022f333736a03c5e9aa8142384bcab15817dc94
```

## CP007 final ownership decision

The post-CP006 source audit replayed:

```text
Q27 Q28 Q35 Q65 Q66 Q67 Q68
```

After V1.1 manual review and executable merge/split testing, only one source family survives as a new permanent authority.

### RNK-QL-042 — CATEGORY_COMPOSITION_AROUND_RANK

Source fixtures: Q65 / Q67.

Permanent modes:

```text
TARGET_CATEGORY_AFTER
OTHER_CATEGORY_AFTER
TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER
OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER
```

Permanent corpus:

```text
questions:               192
questions/mode:           48
answer positions:         48 / 48 / 48 / 48
difficulty:               144 Medium / 48 Hard
surface styles:             4 x 48
partition contexts:        11
target names:              84
unique learner surfaces:  192
```

Ownership rationale:

```text
partitioned population
+ category totals/ratio
+ named rank
+ cross-category side evidence
```

Frozen CP001 has no subgroup-composition state dimension, so this family remains separate.

## Source forms closed as new-QL candidates

### TRANSFER_BALANCE_ORDER

```text
DERIVATION_ADAPTER_TO_CP004
```

Mappings after arithmetic normalization:

```text
highest / lowest     -> RNK-QL-027 ENDPOINT_ENTITY
entity at position   -> RNK-QL-028 ENTITY_AT_POSITION
true relation        -> RNK-QL-034 DEFINITELY_TRUE_RELATION
```

No new QL.

### SCALED_OBJECT_ORDER

```text
DERIVATION_ADAPTER_TO_RNK_QL_038_INVERSE_VARIANT
```

Q68-style states can admit several valid total rankings while one entity remains invariant at the requested position. This is the inverse presentation of exact-rank invariance already owned by `RNK-QL-038 EXACT_RANK_DETERMINACY`.

No new QL.

### NUMERIC_VALUE_CONSTRAINED_ORDER

```text
HOLD_AS_DERIVATION_ADAPTER
```

Q27-Q28 remain source fixtures. More evidence is required before any special adapter is frozen; no permanent QL is justified.

### RELATIONAL_SIDE_COUNT_EQUATION

```text
REDIRECT_CP001_EXTENSION
```

Q66 normalizes through compact algebra into ordinary CP001 before/after counts.

No new QL.

## CP007 freeze proof

All 192 permanent QL042 questions are independently re-solved and gated for:

```text
one correct answer
rank clue essential
ratio/category-total clue essential
subgroup-count clue essential
>=2 structural misconception distractors
zero answer/evidence numeric echoes
bounded numeric options
valid ordinal grammar
no Seating Arrangement leakage
unique mathematical/permanent/learner fingerprints
```

## Object Pool V2

Pinned future-facing pool:

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

Historical frozen runtimes are not retrofitted merely to adopt the expanded pool.

## Still held / redirected

```text
NUMERIC_POST_TIE_RANK_CONVENTION   HOLD
MULTIPLE_INDEPENDENT_TIE_GROUPS    HOLD
TIE_CLASS_SIZE_GTE_3                HOLD
NUMERIC_VALUE_CONSTRAINED_ORDER    DERIVATION ADAPTER HOLD
RELATIONAL_SIDE_COUNT_EQUATION     CP001 EXTENSION
SHARED_RANKING_CASELETS             INFRASTRUCTURE
MIXED_RANKING_AND_BLOOD_RELATION    OTHER CHAPTER / MIXED PUZZLE
```

These do not reserve QL identities.

## Ranking versus Quant boundary

Derived arithmetic stays in Ranking only when arithmetic is compact and instrumental and the actual learner burden is ranking/order/relation. Substantial equation, percentage, profit, age or optimization work remains Quant.

## Lifecycle

```text
cumulative permanent range: RNK-QL-001..042
next available RNK ID:      RNK-QL-043
CP007 English freeze:       true
chapter-wide final freeze:  false
Question Studio:            DISABLED
persistence:                DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
Hindi/Punjabi:              NOT_STARTED
```

No merge, deployment, publication, persistence, Question Studio activation or translation is authorized by this register.
