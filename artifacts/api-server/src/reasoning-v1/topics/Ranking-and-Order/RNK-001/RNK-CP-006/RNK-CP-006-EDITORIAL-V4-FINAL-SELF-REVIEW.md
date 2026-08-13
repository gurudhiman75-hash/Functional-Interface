# RNK-CP-006 — Equality-Aware Ranking Editorial V4 Final Self-Review

Status: **EDITORIAL REVIEW PASSED — PRODUCTION-SCALE CANDIDATE MAY BE BUILT — no permanent QL allocated**

## 1. Review scope

The final 24-question pack was reviewed across all three surviving source forms:

```text
PAIR_RELATION_THROUGH_EQUALITY:      8
ENDPOINT_ENTITY_THROUGH_EQUALITY:    8
COMPLETE_WEAK_ORDER:                 8

total:                              24
answer positions:              6 / 6 / 6 / 6
contexts/source form:                  5
```

The review considered answer correctness, whether equality was genuinely necessary, option quality, exam-natural wording, explanation sufficiency, difficulty, state ownership and leakage into other reasoning families.

## 2. Final verdict

```text
answer keys:                         PASS
single-correct-option contract:      PASS
equality necessary to the solve:    PASS
context-native stems/options:        PASS
student-facing explanations:         PASS
complete-order distractors:          PASS
Seating Arrangement leakage:         NONE
incomparability/equality confusion:   NONE
unstated numeric tie convention:      NONE
permanent QL allocation:              0
```

The pack is suitable to serve as the editorial basis for a production-scale CP-006 candidate.

It is **not** an English freeze and does not allocate `RNK-QL-039+`.

## 3. Pair-relation family

The earlier raw direct-equality lookup has been removed. Every surviving pair question asks for a strict relation between two different comparison levels.

The equality clue is solver-relevant because the strict chain enters the tied level through one person and exits through the other:

```text
A > B
B = C
C > D
```

The pair questions deliberately include two proof spans:

```text
LOCAL_BRIDGE
  the queried pair lies immediately outside the tied level

FULL_CHAIN
  the queried pair lies farther apart and the full derived order is needed
```

Final editorial assessment:

- stems are explicit about the named pair, so repeated use of those two people in the four options is legitimate and does not recreate the old CP-005 generic-option person-fixation defect;
- height, marks, speed, seniority and performance wording is context-native;
- the equality and indeterminate distractors are semantically relevant misconceptions;
- local-bridge explanations now contain one complete proof line rather than repeating the conclusion;
- full-chain explanations display the complete derived order before the final answer.

Verdict:

```text
PASS
```

## 4. Endpoint family

The endpoint family asks for tallest/shortest, highest/lowest score, fastest/slowest, most senior/most junior or highest/lowest performance position according to context.

The internal equality class is not decorative. Without the equality bridge, the strict evidence separates into branches and the unique endpoint is not established; equality joins those branches.

Distractors are drawn from the tied pair and nearby competing entities rather than arbitrary names.

Explanations now provide:

1. the equality bridge;
2. the complete derived order;
3. the requested endpoint.

Verdict:

```text
PASS
```

Ownership remains equality-aware rather than silently widening frozen `RNK-QL-027`, because CP-004's permanent state contract is a strict total order while CP-006 requires an explicit equivalence class.

## 5. Complete weak-order family

This is the clearest equality-specific answer space. The learner must preserve an equality class in the final sequence, for example:

```text
A > B = C > D > E
```

Every V4 complete-order item now contains one distractor from each misconception class:

```text
SPLIT_TIE
  treats the two equal people as different levels

FALSE_EQUALITY
  moves equality to the wrong pair

STRICT_ORDER
  preserves the true equality group but reverses a strict part of the order
```

This is materially stronger than the earlier V3 option pattern, which overused strict swaps.

The stem explains the `=` notation in plain learner text without Markdown formatting leakage.

Verdict:

```text
PASS
```

## 6. Difficulty assessment

The surviving equality-aware forms are intentionally not direct lookup items. Even the shortest valid states require the learner to combine equality with strict comparisons, so the current Medium/Hard emphasis is appropriate.

Hard is mainly reserved for seven-entity/full-chain states; Medium covers shorter or more local equality-bridge proofs.

No Easy family is being created merely to fill a quota. The rejected direct-equality lookup would have produced artificial Easy questions and remains excluded.

## 7. Authority decision after editorial review

The three provisional authorities remain justified:

```text
EQUALITY_AWARE_PAIR_RELATION
  answer semantic: RELATION

EQUALITY_AWARE_ENDPOINT
  answer semantic: ENTITY

COMPLETE_WEAK_ORDER
  answer semantic: WEAK_ORDER_SEQUENCE
```

They correspond to strict CP-004 analogues but operate on a different state contract:

```text
CP-004: one unique strict total order
CP-006: one unique total preorder with explicit equality
```

The three forms should therefore proceed separately into the production-scale candidate. This is still a provisional ownership decision; permanent IDs are withheld until final freeze review.

## 8. Production candidate gate

Next checkpoint:

```text
expand to production-scale mathematical states
-> 192 questions/provisional authority
-> 576 questions total
-> independently validate all answers and equality necessity
-> pin candidate projection
-> generate final freeze-review pack
-> explicit freeze approval
-> only then allocate permanent QL IDs
```

The production candidate must not reach 192/authority by merely repeating the same 48 mathematical states with cosmetic wording changes. State/fingerprint uniqueness must be enforced.

## 9. Lifecycle

```text
frozen RNK range:       RNK-QL-001..038
next available QL:      RNK-QL-039
CP-006 permanent QLs:   0
English freeze:         false
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```
