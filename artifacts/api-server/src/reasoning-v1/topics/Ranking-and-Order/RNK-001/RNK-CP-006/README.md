# RNK-CP-006 — Equality-Aware Ranking

Status: **ENGLISH FROZEN at `RNK-QL-039..041`**

CP-006 covers ranking comparisons in which explicit evidence places two people at the **same comparison level**.

It does not treat missing comparison as equality and it does not assume an unstated numerical ranking convention after a tie.

## Source basis

The Ranking chapter of the primary Aggarwal reference contains solved examples with:

- two people of equal height;
- two people with equal scores;
- two people equally fast;
- separate notation for pairs that are uncomparable.

This supports a distinct equality-aware ranking state contract.

See `RNK-CP-006-SOURCE-AND-OWNERSHIP-AUDIT-2026-08-12.md`.

## Frozen state contract

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

This differs from CP-004, which requires one unique **strict** total order, and from CP-005, where several complete strict rankings remain valid because some relations are unresolved.

## Discovery and editorial path

Raw V1 source forms:

```text
EQUAL_PAIR_IDENTIFICATION
PAIR_RELATION_WITH_EQUALITY
ENDPOINT_ENTITY_WITH_INTERNAL_TIE
COMPLETE_WEAK_ORDER
```

`EQUAL_PAIR_IDENTIFICATION` was rejected because the answer merely repeated the equality clue.

The surviving forms were remodeled so the chain must cross equality through different members of the tie:

```text
A > B
B = C
C > D
```

rather than allowing equality to be decorative.

Editorial V4 finalized context-native learner wording and misconception-oriented complete-order distractors.

## Permanent authorities

```text
RNK-QL-039  EQUALITY_AWARE_PAIR_RELATION
RNK-QL-040  EQUALITY_AWARE_ENDPOINT
RNK-QL-041  COMPLETE_WEAK_ORDER
```

### RNK-QL-039 — EQUALITY_AWARE_PAIR_RELATION

A queried pair lies across an equality level. Equality must be used as a bridge to prove the directional relation.

Modes:

```text
PAIR_LOCAL_BRIDGE
PAIR_FULL_CHAIN
```

CP-004 analogue: `RNK-QL-031 RELATIVE_ORDER_OF_PAIR`, but QL031 is strict-order only.

### RNK-QL-040 — EQUALITY_AWARE_ENDPOINT

The learner identifies the unique highest or lowest entity only after equality connects the comparison chain.

Modes:

```text
ENDPOINT_HIGHEST
ENDPOINT_LOWEST
```

CP-004 analogue: `RNK-QL-027 ENDPOINT_ENTITY`, but QL027 is strict-order only.

### RNK-QL-041 — COMPLETE_WEAK_ORDER

The learner reconstructs the full weak order and preserves the explicit tied class.

Mode:

```text
COMPLETE_WEAK_ORDER
```

CP-004 analogue: `RNK-QL-030 COMPLETE_ORDER`, but QL030 reconstructs a strict total order.

## Frozen permanent runtime

```text
permanent questions:       576
questions/authority:       192
answer positions/QL:       48 / 48 / 48 / 48
contexts/QL:               5
entity counts/QL:          5, 6, 7
unique state keys:         576
unique learner surfaces:   576
unique permanent IDs:      576
```

Mode counts:

```text
PAIR_LOCAL_BRIDGE:    96
PAIR_FULL_CHAIN:      96
ENDPOINT_HIGHEST:     96
ENDPOINT_LOWEST:      96
COMPLETE_WEAK_ORDER: 192
```

Difficulty:

```text
Easy:       0
Medium:   416
Hard:     160
```

## Freeze proof

The 36-question production review pack was manually checked before allocation. All 36 answer keys and explanations were correct, the equality clue was necessary, and no unstated numerical post-tie ranking rule appeared.

The executable freeze gate then independently re-proved all 576 frozen questions:

```text
questions independently re-proved: 576
equality-essential checks:         576
complete-order distractors checked:576
```

Pinned production candidate projection:

```text
sha256:3b26204b7137910d3247af37c75934680ea34cd86b5f342b55de2012e057fd00
```

Frozen permanent projection:

```text
sha256:7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

See `RNK-CP-006-ENGLISH-FREEZE-V1.md`.

## Numeric tie-rank convention remains excluded

CP-006 does not implement questions such as:

```text
Three candidates share 5th place. What rank comes next?
```

unless a numerical ranking convention is explicitly stated or later primary-source evidence establishes the intended exam rule.

Multiple tie groups and equality classes larger than two people are also outside this freeze and require a fresh source-backed checkpoint before use.

## Lifecycle

```text
frozen RNK range:       RNK-QL-001..041
next available QL:      RNK-QL-042
CP-006 permanent QLs:   3
CP-006 English frozen:  true
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```

This freeze does not authorize merge, deployment, publication, persistence, Question Studio generation or translation.
