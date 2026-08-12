# RNK-CP-006 — Equality-Aware Ranking

Status: **RAW DISCOVERY PASSED — EDITORIAL V2 UNDER VALIDATION — no permanent QL allocated**

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

Raw source forms:

```text
EQUAL_PAIR_IDENTIFICATION
PAIR_RELATION_WITH_EQUALITY
ENDPOINT_ENTITY_WITH_INTERNAL_TIE
COMPLETE_WEAK_ORDER
```

Validated raw corpus:

```text
32 questions/source form
4 source forms
128 questions
answer positions/source form: 8 / 8 / 8 / 8
overall answer positions:    32 / 32 / 32 / 32
contexts: 5
unique mathematical fingerprints: 128
```

Raw executable checks included 256 equality checks, 3,658 strict comparison checks, 639 rendered-clue checks and independent rejection of all 96 complete-order distractors.

V1 deliberately uses one internal two-person equality class per state. Larger or multiple tie groups remain later discovery candidates rather than being assumed safe now.

## Raw self-review decision

See `RNK-CP-006-RAW-SELF-REVIEW-V1.md`.

The raw mathematical corpus passed, but the first editorial rendering was **not** accepted unchanged.

### Rejected

```text
EQUAL_PAIR_IDENTIFICATION
```

Reason: the stem asks for the equal pair while the equality clue already names that pair. This is direct clue lookup, not a worthwhile permanent solve contract.

### Remodeled

The original pair and endpoint forms included an equality clue, but the strict chain could sometimes enter and leave the tied level through the same person. The equality fact could therefore be decorative.

Editorial V2 enforces the stronger structure:

```text
A > B
B = C
C > D
```

rather than:

```text
A > B
B = C
B > D
```

Required executable invariant:

```text
path(top, bottom | strict clues only) = false
path(top, bottom | strict clues + equality) = true
```

## Editorial V2

Version:

```text
RNK_CP006_EQUALITY_EDITORIAL_V2
```

Three surviving forms are under validation:

```text
PAIR_RELATION_THROUGH_EQUALITY
ENDPOINT_ENTITY_THROUGH_EQUALITY
COMPLETE_WEAK_ORDER
```

Target V2 corpus:

```text
48 questions/source form
144 questions total
answer positions/source form: 12 / 12 / 12 / 12
all five contexts/source form
```

Additional V2 requirements:

- equality bridge is mathematically necessary in every state;
- no direct equality-lookup answer survives;
- pair questions split between local bridge and full-chain proofs;
- pair direction is balanced;
- endpoint questions split highest/lowest evenly;
- complete-order distractors test split ties, wrong strict order or false equality grouping;
- difficulty comes from proof span/entity count rather than merely clue count;
- no Seating Arrangement geometry;
- no symbolic Inequalities takeover;
- no numeric post-tie ranking convention;
- all lifecycle gates remain off.

## Ownership is still unresolved

Editorial survival does **not** imply three new QLs.

The next audit must compare:

```text
PAIR_RELATION_THROUGH_EQUALITY
  vs RNK-QL-031 RELATIVE_ORDER_OF_PAIR

ENDPOINT_ENTITY_THROUGH_EQUALITY
  vs RNK-QL-027 ENDPOINT_ENTITY

COMPLETE_WEAK_ORDER
  vs RNK-QL-030 COMPLETE_ORDER
```

The endpoint form is especially likely to be a state-contract extension rather than a standalone new authority. No decision is pre-allocated.

## V2 human review pack

After executable V2 validation, CI generates:

```text
24 questions
8 questions/source form
answer positions: 6 / 6 / 6 / 6
all five contexts inside every source form
```

The pack is specifically for editorial and merge/split review before any production-scale candidate exists.

## Numeric tie-rank convention

Not implemented.

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
