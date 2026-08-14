# RNK-001 — Open QL Discovery Register

Status: **English content/authority discovery closed at `RNK-QL-001..042`; CP008 allocates zero new QLs; next available identity remains `RNK-QL-043`.**

Counts are evidence, never chapter-size quotas. Future reviewed exam/source evidence may reopen discovery; this register records that no **currently evidenced pure Ranking authority** remains unresolved after CP008.

## Frozen inventory

```text
RNK-CP-001   9 authorities  RNK-QL-001..009
RNK-CP-002   8 authorities  RNK-QL-010..017
RNK-CP-003   9 authorities  RNK-QL-018..026
RNK-CP-004   9 authorities  RNK-QL-027..035
RNK-CP-005   3 authorities  RNK-QL-036..038
RNK-CP-006   3 authorities  RNK-QL-039..041
RNK-CP-007   1 authority    RNK-QL-042
RNK-CP-008   0 authorities  adapter / caselet closure
```

Cumulative frozen authorities: **42**.  
Next available identity: **`RNK-QL-043`**.  
CP008 does not reserve it.

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

## Permanent CP007 authority

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

The partitioned population + category totals/ratio + named rank + cross-category side evidence dimension is not owned by frozen CP001, so QL042 remains separate.

## CP008 closes the remaining source forms

### TRANSFER_BALANCE_ORDER — Q35

```text
DERIVATION_ADAPTER_TO_CP004
```

Mappings after arithmetic normalization:

```text
highest / lowest       -> RNK-QL-027 ENDPOINT_ENTITY
second-highest         -> RNK-QL-028 ENTITY_AT_POSITION
true relation          -> RNK-QL-034 DEFINITELY_TRUE_RELATION
```

No new QL.

### SCALED_OBJECT_ORDER — Q68

```text
DERIVATION_ADAPTER_TO_RNK_QL_038_INVERSE_VARIANT
```

Several valid total rankings may remain while the same entity occupies the requested rank in every ranking. That is inverse exact-rank invariance already owned by `RNK-QL-038`.

No new QL.

### NUMERIC_VALUE_CONSTRAINED_ORDER — Q27/Q28

```text
EXECUTABLE_NORMALIZATION_ADAPTER
```

CP008 now solves the bounded consecutive numeric domain and converts it into one or more ranking orders.

When the learner asks a rank/order question, ownership is existing RNK:

```text
unique complete order               -> RNK-QL-030
unique entity at position           -> RNK-QL-028
unique rank of entity               -> RNK-QL-029
unique pair relation                -> RNK-QL-031
multi-order pair truth/status       -> RNK-QL-036
multi-order exact-rank invariance   -> RNK-QL-038
```

Original source surfaces asking for an exact numeric attribute value or the number of satisfying numeric models are classified:

```text
REDIRECT_MIXED_NUMERIC_CONSTRAINT
```

Their answer semantic is numeric-model reasoning rather than a new pure Ranking authority. They therefore do not justify `RNK-QL-043`.

### RELATIONAL_SIDE_COUNT_EQUATION — Q66

```text
EXECUTABLE_ADAPTER_TO_RNK_QL_004
```

The total population is explicitly learner-visible in CP008 V1.1. Compact algebra yields ordinary total/rank/side-count state already owned by CP001.

No new QL.

### SHARED_RANKING_CASELETS

```text
DELIVERY_INFRASTRUCTURE
```

Common clues are independently re-solved; each child retains existing QL ownership. Current child routes include QL027, QL028, QL031 and QL033.

No new QL.

## Still held / redirected after English content freeze

```text
NUMERIC_POST_TIE_RANK_CONVENTION   HOLD until convention is explicit and source-backed
MULTIPLE_INDEPENDENT_TIE_GROUPS    possible CP006 state expansion, not new authority by entity count
TIE_CLASS_SIZE_GTE_3                possible CP006 state expansion, not new authority by entity count
MIXED_RANKING_AND_BLOOD_RELATION   OTHER CHAPTER / MIXED PUZZLE
SUBSTANTIAL_ARITHMETIC_BURDEN       QUANT
SHARED_RANKING_CASELETS             INFRASTRUCTURE
```

These do not reserve QL identities.

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

## Historical superseded snapshots

```text
rnk-001-book-ownership-reset.test.ts
  -> CP004-era snapshot ending at RNK-QL-035

rnk-001-post-cp006-gap-audit.test.ts
  -> pre-CP007 snapshot ending at RNK-QL-041
```

They remain historical evidence and are not current chapter-final gates.

## Ranking versus Quant boundary

Derived arithmetic remains Ranking only when arithmetic is compact/instrumental and the assessed answer is rank/order/relation. Exact numeric-model/value tasks or substantial equation/percentage/profit/age/optimization burden remain mixed numeric or Quant ownership.

## Lifecycle

```text
cumulative permanent range:          RNK-QL-001..042
next available RNK ID:               RNK-QL-043
CP001..CP007 English frozen:         true
CP008 adapter/caselet closure:       validated candidate
chapter-wide English content freeze: true
multilingual/product final freeze:   false
Question Studio:                     DISABLED / NOT REGISTERED
persistence:                         DISABLED
Question Bank:                       NOT_STORED
test eligibility:                    INELIGIBLE
public publication:                  false
Hindi/Punjabi:                       NOT_STARTED
```

No merge, deployment, publication, persistence, Question Studio activation or translation is authorized by this register.