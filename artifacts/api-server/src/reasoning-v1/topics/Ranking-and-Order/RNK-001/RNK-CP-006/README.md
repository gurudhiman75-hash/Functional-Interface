# RNK-CP-006 — Equality-Aware Ranking

Status: **RAW DISCOVERY ACTIVE — SOURCE-BACKED — no permanent QL allocated**

CP-006 covers ordinary ranking comparisons in which explicit evidence places two people at the **same comparison level**.

It does not treat missing comparison as equality and it does not assume an unstated numerical ranking convention after a tie.

## Source basis

The Ranking chapter of the primary Aggarwal reference contains solved examples with:

- two people of equal height;
- two people with equal scores;
- two people equally fast;
- separate notation for pairs that are uncomparable.

This supports a distinct equality-aware ranking state contract.

See `RNK-CP-006-SOURCE-AND-OWNERSHIP-AUDIT-2026-08-12.md`.

## State contract

```text
ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY
```

Example:

```text
A > B = C > D > E
```

Interpretation:

- `B = C` is an explicit equality class;
- `A` is strictly above both `B` and `C`;
- both `B` and `C` are strictly above `D`;
- one weak order is determined even though two entities share one level.

This differs from CP-005, where several strict total orders remain valid because some relations are unresolved.

## V1 raw discovery

Version:

```text
RNK_CP006_EQUALITY_DISCOVERY_V1
```

Source forms:

```text
EQUAL_PAIR_IDENTIFICATION
PAIR_RELATION_WITH_EQUALITY
ENDPOINT_ENTITY_WITH_INTERNAL_TIE
COMPLETE_WEAK_ORDER
```

Generation target:

```text
32 questions/source form
4 source forms
128 raw discovery questions
```

Contexts:

```text
HEIGHT
SCORES
SPEED
SENIORITY
PERFORMANCE
```

V1 deliberately uses one internal two-person equality class per state. Larger or multiple tie groups remain later discovery candidates rather than being assumed safe now.

## Raw validity gates

Every question must prove:

- 5–7 distinct entities;
- every entity appears in exactly one equivalence class;
- exactly one equality class of size two;
- equality class is internal, preserving unique top and bottom endpoints;
- equality is symmetric within the class;
- strict order is complete between different classes;
- displayed equality and strict clues are all true of the hidden state;
- four unique options;
- exactly one independently correct option;
- stored correct index agrees with independent state evaluation;
- answer-position balance is checked per source form;
- semantic fingerprints are unique in the raw corpus;
- no Seating Arrangement geometry leaks in;
- no unstated competition/dense/fractional ranking convention leaks in;
- all lifecycle gates remain off.

## Human review pack

A deterministic 24-question pack is generated after the raw gates:

```text
6 questions/source form
24 total questions
answer positions: 6 / 6 / 6 / 6
all five contexts inside every source form
```

The human review must decide whether the four source forms really deserve separate authorities.

Particular merge question:

```text
ENDPOINT_ENTITY_WITH_INTERNAL_TIE
```

may be only a state extension of frozen CP-004 endpoint ownership rather than a new permanent QL.

Likewise equal-pair, pair-relation and complete-weak-order forms may consolidate based on proof and answer semantics.

## Numeric tie-rank convention

Not implemented in V1.

Questions such as:

```text
Three candidates share 5th place. What rank comes next?
```

are prohibited unless a ranking convention is explicitly stated or later primary-source evidence establishes the intended exam rule.

## Lifecycle

```text
frozen RNK range:       RNK-QL-001..038
next available QL:      RNK-QL-039
CP-006 permanent QLs:   0
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```
