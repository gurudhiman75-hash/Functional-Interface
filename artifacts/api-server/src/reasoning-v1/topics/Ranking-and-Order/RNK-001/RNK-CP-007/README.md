# RNK-CP-007 — Derived and Compositional Ranking Discovery

Status: **DISCOVERY V1 IMPLEMENTED — manual review pending; zero permanent QLs allocated**.

CP007 exists because the post-CP006 page-level source audit found Ranking questions whose displayed evidence must first be transformed arithmetically or compositionally before a rank/order conclusion can be reached.

It is **not** a permanent checkpoint yet.

## Discovery candidates

```text
CATEGORY_COMPOSITION_AROUND_RANK
DERIVED_QUANTITY_ORDER
NUMERIC_VALUE_CONSTRAINED_ORDER
RELATIONAL_SIDE_COUNT_EQUATION
```

## Discovery V1 implementation

Two strongest source-backed families now have executable generators and independent solver gates.

### CATEGORY_COMPOSITION_AROUND_RANK

Source basis: Aggarwal Ranking Q65 and Q67.

Typical structure:

```text
total population
+ ratio/count of two categories
+ target person's rank
+ known members of one category ahead
-> requested category count ahead/after target
```

Implemented modes:

```text
TARGET_CATEGORY_AFTER
OTHER_CATEGORY_AFTER
UNKNOWN_CATEGORY_AHEAD
```

Discovery corpus:

```text
3 modes x 96 questions = 288
answer positions:          72 / 72 / 72 / 72
permanent QL:              none
```

Every question is solved again from the normalized subgroup state. Direct lookup of the known subgroup-ahead count is forbidden.

Current disposition: **provisional authority candidate**, with CP001 composition-extension still retained as the nearest alternative.

### DERIVED_QUANTITY_ORDER

Source basis:

- Aggarwal Ranking Q35 [CSAT 2015] — money transfers -> final balances -> richest/poorest/comparison;
- Aggarwal Ranking Q68 [SSC MTS 2021] — weight ratios/equations -> derived order -> second from bottom.

Discovery source forms:

```text
TRANSFER_BALANCE_ORDER
SCALED_OBJECT_ORDER
```

Transfer modes:

```text
HIGHEST_BALANCE
LOWEST_BALANCE
SECOND_HIGHEST_BALANCE
TRUE_FINAL_RELATION
```

Scaled-object modes:

```text
HEAVIEST_OBJECT
LIGHTEST_OBJECT
SECOND_FROM_BOTTOM
FOURTH_FROM_TOP
```

Discovery corpus:

```text
8 modes x 32 questions = 256
transfer questions:         128
scaled-object questions:    128
answer positions:            64 / 64 / 64 / 64
permanent QL:                none
```

Transfer states use three compact transactions, preserve total money, and require four distinct final balances.

Scaled-object states deliberately preserve genuine uncertainty between two middle objects while requiring the asked rank position to remain invariant across valid witness orders. This reproduces the important Q68 property: the full order need not be unique for the requested rank fact to be definite.

### Architecture warning: discovery family does not automatically mean QL

The preferred architecture hypothesis for `DERIVED_QUANTITY_ORDER` is currently:

```text
DERIVATION ADAPTER
  -> normalized quantity/order state
  -> existing CP004/CP005 query authority where possible
```

A separate permanent QL is allowed only if manual/editorial evidence shows that adapter composition loses a materially different student-visible solve contract.

This is intentionally unresolved in Discovery V1.

## Remaining candidates

### NUMERIC_VALUE_CONSTRAINED_ORDER

Source basis: Aggarwal Ranking Q27-Q28 [CSAT 2015].

The entities occupy a bounded numeric domain with ordering, exact-offset and exclusion constraints.

Current disposition:

```text
HOLD_MERGE_WITH_DERIVED_QUANTITY
```

Discovery V1 replays the source fixture but does **not** create a production corpus yet. More source diversity is required before deciding whether this is a derived-constraint mode or its own learner contract.

### RELATIONAL_SIDE_COUNT_EQUATION

Source basis: Aggarwal Ranking Q66.

Current disposition:

```text
REDIRECT_CP001_EXTENSION
```

The equation layer normalizes into ordinary CP001 front/behind counts after a small algebraic solve. Discovery V1 therefore does not create a separate CP007 generator for it.

## Source-fixture replay

Executable replay covers:

```text
Q27
Q28
Q35
Q65
Q66
Q67
Q68
```

These fixtures are retained as source anchors, not as learner-facing copied questions.

## Object-pool support

CP007 Discovery V1 uses the pinned future-facing Ranking Object Pool V2:

```text
96 localized person objects
52 symbolic rankable objects
20 group objects
18 settings
12 partition schemes
8 derived quantity domains
8 derived-operation families
EN / HI / PA infrastructure
```

Frozen CP001..CP006 generators do not import the new pool into their projection paths.

## Review pack

CI generates:

```text
RNK-CP-007-DISCOVERY-V1-REVIEW-28Q.md
```

Composition:

```text
CATEGORY_COMPOSITION_AROUND_RANK  12
DERIVED_QUANTITY_ORDER            16
TOTAL                              28
```

The review pack is evidence for manual exam-readiness review only. It is not a freeze pack.

## Merge/split audit

`cp007-merge-split-audit-v1.ts` currently records:

```text
CATEGORY_COMPOSITION_AROUND_RANK
  PROVISIONAL_AUTHORITY_CANDIDATE

DERIVED_QUANTITY_ORDER
  DISCOVERY_FAMILY_ADAPTER_VS_QL_UNRESOLVED

NUMERIC_VALUE_CONSTRAINED_ORDER
  HOLD_MERGE_WITH_DERIVED_QUANTITY

RELATIONAL_SIDE_COUNT_EQUATION
  REDIRECT_CP001_EXTENSION
```

No discovery candidate owns `RNK-QL-042`.

## Boundary rule against Quant

Ranking owns a derived-quantity item only when:

1. the arithmetic derivation is short and instrumental;
2. the final assessed task is rank/order/relation;
3. the arithmetic itself is not the dominant challenge.

Substantial equation solving, percentage/profit/age arithmetic, or calculation-heavy optimization remains Quant even if a final comparison is asked.

## Required next gates

1. Exact-head CI over both discovery corpora.
2. Manual review of the 28-question pack.
3. Audit distractor quality and repetitive surface patterns.
4. Decide whether category composition is new authority or CP001 composition extension.
5. Decide whether derived quantity is a QL or derivation adapter over CP004/CP005.
6. Only then consider another generator wave or permanent identity.

## Lifecycle

```text
permanent QLs:          0
next available RNK ID:  RNK-QL-042
English freeze:         false
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```

No merge, deployment, persistence, publication, translation, Question Studio activation or QL allocation is authorized by Discovery V1.
