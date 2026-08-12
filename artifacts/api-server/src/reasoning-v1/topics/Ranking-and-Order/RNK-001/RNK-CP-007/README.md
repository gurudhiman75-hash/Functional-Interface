# RNK-CP-007 — Derived and Compositional Ranking Discovery

Status: **SOURCE-BACKED DISCOVERY OPEN — zero permanent QLs allocated**.

CP007 exists because the post-CP006 page-level source audit found Ranking questions whose displayed evidence must first be transformed arithmetically or compositionally before a rank/order conclusion can be reached.

It is **not** a permanent checkpoint yet.

## Discovery candidates

```text
CATEGORY_COMPOSITION_AROUND_RANK
DERIVED_QUANTITY_ORDER
NUMERIC_VALUE_CONSTRAINED_ORDER
RELATIONAL_SIDE_COUNT_EQUATION
```

### 1. CATEGORY_COMPOSITION_AROUND_RANK

Source basis: Aggarwal Ranking Q65 and Q67.

Typical structure:

```text
total population
+ ratio/count of two categories
+ target person's rank
+ members of one category ahead of target
-> members of a requested category after target
```

Primary ownership question:

```text
new authority vs extension of CP001 side-count arithmetic
```

Current disposition: **provisional authority discovery**.

### 2. DERIVED_QUANTITY_ORDER

Source basis:

- Aggarwal Ranking Q35 [CSAT 2015] — money transfers -> final balances -> richest/poorest/comparison;
- Aggarwal Ranking Q68 [SSC MTS 2021] — weight ratios/equations -> derived order -> second from bottom.

Current disposition: **provisional authority discovery**.

Boundary rule to prove:

> Ranking owns the item only when arithmetic is a compact derivation layer and the final assessed skill is comparative order/rank. If substantial calculation is the main burden, ownership remains Quant.

### 3. NUMERIC_VALUE_CONSTRAINED_ORDER

Source basis: Aggarwal Ranking Q27-Q28 [CSAT 2015].

The entities occupy a bounded numeric domain with ordering, exact-offset and exclusion constraints.

Current disposition: **audit merge with `DERIVED_QUANTITY_ORDER`**. Do not create a separate QL just because the values are ages.

### 4. RELATIONAL_SIDE_COUNT_EQUATION

Source basis: Aggarwal Ranking Q66.

Side counts for two people are linked by multiplicative/equality constraints.

Current disposition: **audit extension of CP001** before considering any new authority.

## Non-goals

CP007 does not authorize:

- universal post-tie ranking conventions;
- multiple-tie-group expansion;
- large tie classes;
- shared caselets as QLs;
- Blood Relation inference as Ranking;
- arbitrary arithmetic stories relabelled as Ranking.

## Object-pool support

Future CP007 prototypes may use:

```text
../foundation/rnk-object-pool-v2.ts
../foundation/rnk-presentation-object-pool-v2.ts
../foundation/rnk-derived-object-pool-v2.ts
```

The derived pool includes symbolic objects, weight/money/age/population domains, subgroup partition schemes and deterministic operation-surface templates.

## Required discovery gates

1. Reconstruct every source fixture mathematically.
2. Create an independent solver for each provisional state type.
3. Validate every option against the solver rather than by template.
4. Compare every candidate against CP001, CP002, CP004, CP005 and relevant Quant ownership.
5. Merge source forms that share one learner solve contract.
6. Reject questions where arithmetic becomes the dominant Quant burden.
7. Keep all permanent QLs unallocated until manual review.
8. Keep Question Studio/persistence/publication disabled.

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
