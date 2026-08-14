# RNK-001 — Chapter-Wide English Content Freeze V1

Date: 2026-08-14  
Freeze version: `RNK_001_CHAPTER_WIDE_ENGLISH_CONTENT_FREEZE_V1`

## Decision

```text
English content/authority freeze: TRUE
permanent range:                 RNK-QL-001..042
permanent authorities:          42
RNK-QL-043:                      UNALLOCATED
CP008 new permanent QLs:         0
multilingual/product final freeze: FALSE
```

This freeze closes the English Ranking & Order authority/content discovery surface after CP008 adapter and shared-caselet closure. It does **not** authorize Question Studio activation, persistence, Question Bank storage, test use, public publication, Hindi translation or Punjabi translation.

## Permanent inventory

```text
CP001  RNK-QL-001..009   one-person rank arithmetic
CP002  RNK-QL-010..017   two-person positions/separation/mixed-end totals
CP003  RNK-QL-018..026   movement/interchange/membership transformations
CP004  RNK-QL-027..035   unique strict multi-entity order
CP005  RNK-QL-036..038   partial-order uncertainty
CP006  RNK-QL-039..041   explicit equality / total preorder
CP007  RNK-QL-042        category composition around rank
CP008  zero new QLs      adapter + shared-caselet closure
```

The chapter-wide executable gate requires one continuous unique sequence from `RNK-QL-001` through `RNK-QL-042`. `RNK-QL-043` remains the next available identity and is not reserved by CP008.

## Frozen projection anchors

```text
CP004  39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
CP005  f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
CP006  7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
CP007  44aefb019c1a55308b58f4b285b1b6f7df97dea0185652d6de73e2dafbbd446b
```

CP008 may not alter any of these frozen projections.

## CP008 closure decision

### Q35 — transfer balance order

A short arithmetic ledger is preprocessing. The resulting ranking query routes to existing strict-order authorities:

```text
highest / lowest       -> RNK-QL-027 ENDPOINT_ENTITY
second-highest         -> RNK-QL-028 ENTITY_AT_POSITION
true final relation    -> RNK-QL-034 DEFINITELY_TRUE_RELATION
```

No new QL.

### Q68 — scaled object order

The arithmetic can leave several complete rankings while the requested rank occupant remains invariant. This is an inverse presentation of exact-rank determinacy:

```text
-> RNK-QL-038 EXACT_RANK_DETERMINACY
```

No new QL.

### Q27-Q28 — bounded numeric-value constraints

CP008 now has an executable bounded-domain solver that normalizes the numeric constraints into one or more rank orders.

When the learner is asked an actual ranking question, the normalized state routes to existing RNK authorities:

```text
unique complete order               -> RNK-QL-030
unique entity at position           -> RNK-QL-028
unique rank of entity               -> RNK-QL-029
unique pair relation                -> RNK-QL-031
multi-order pair truth/status       -> RNK-QL-036
multi-order exact-rank invariance   -> RNK-QL-038
```

The original source surfaces asking for an **exact numeric attribute value** or the **number of satisfying numeric models/orders** are recorded as `REDIRECT_MIXED_NUMERIC_CONSTRAINT`. Their answer semantic is numeric-model reasoning rather than a new pure Ranking authority. They therefore do not justify `RNK-QL-043`.

### Q66 — relational side-count equation

The displayed total population plus the compact side-count equation is preprocessing into the ordinary total/rank state already owned by CP001:

```text
-> RNK-QL-004 OPPOSITE_SIDE_COUNT_FROM_TOTAL_AND_RANK
```

The CP008 V1.1 correction explicitly displays the total population; the earlier V1 draft that hid this anchor is superseded and is not freeze authority.

### Shared ranking caselets

A common ranking passage may serve several questions, but shared delivery does not create a new reasoning authority. CP008 independently re-solves the common clue set and binds child questions to existing QLs such as:

```text
RNK-QL-027  endpoint
RNK-QL-028  entity at position
RNK-QL-031  relative order of pair
RNK-QL-033  immediate neighbour
```

No new QL.

## Held boundaries after English content freeze

The following do not reserve permanent QL identities:

```text
numeric post-tie rank convention    HOLD until a convention is explicitly stated and source-backed
multiple independent tie groups     possible CP006 state expansion, not a new authority by entity count
larger tie classes                   possible CP006 state expansion, not a new authority by entity count
mixed ranking + family inference     Blood Relations / controlled mixed-puzzle ownership
substantial arithmetic burden        Quant ownership
shared passage delivery              infrastructure
```

Future reviewed source evidence can reopen discovery. This freeze means no **currently evidenced** pure Ranking authority remains unresolved; it is not a claim that no future exam pattern can ever justify another QL.

## Historical superseded gates

Two older executable files remain useful as historical snapshots but are **not current chapter-final gates**:

```text
rnk-001-book-ownership-reset.test.ts
  -> CP004-era Question Studio ownership snapshot ending at RNK-QL-035

rnk-001-post-cp006-gap-audit.test.ts
  -> pre-CP007 discovery snapshot ending at RNK-QL-041
```

They must not overwrite the later CP005-CP008 ownership/freeze evidence.

## Current live product boundary

The shared Reasoning Question Studio review registry currently exposes no RNK package. The chapter-wide gate asserts this remains true.

```text
Question Studio:        DISABLED / NOT REGISTERED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi:                  NOT_STARTED
Punjabi:                NOT_STARTED
```

Therefore:

```text
chapter-wide English content/authority freeze: TRUE
multilingual/product final freeze:              FALSE
```

A later localization and product-integration phase must independently prove Hindi/Punjabi parity and Question Studio lifecycle readiness before any activation.