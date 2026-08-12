# RNK-CP-006 — Raw Discovery Self-Review V1

Status: **RAW MATHEMATICS PASS — EDITORIAL REMODEL REQUIRED — no permanent QL allocated**

## 1. What passed

The first executable discovery corpus contains:

```text
4 raw source forms
32 questions/source form
128 questions total
answer positions/source form: 8 / 8 / 8 / 8
overall answer positions:    32 / 32 / 32 / 32
contexts: 5
unique mathematical fingerprints: 128
```

Executable state checks confirmed:

```text
equality checks:                 256
strict pair checks:            3,658
rendered clue checks:            639
complete-order distractors rejected: 96
```

Every raw state is a unique total preorder with one explicit internal equality class. Equality remains distinct from incomparability, and no numeric post-tie ranking convention is assigned.

## 2. Raw source-form review

### `EQUAL_PAIR_IDENTIFICATION` — REJECT AS PERMANENT CANDIDATE

The stem asks which pair is tied while the statements explicitly say that same pair is equal.

This is a direct lookup rather than a ranking inference. The equality statement is useful evidence inside a larger ranking problem, but copying it into the answer does not justify a Question Logic authority.

Decision:

```text
REJECT_DIRECT_CLUE_LOOKUP
```

### `PAIR_RELATION_WITH_EQUALITY` — REMODEL

The raw family has two weaknesses:

1. equality-answer cases simply ask about the pair already stated equal;
2. in the original clue renderer, the strict chain entered and exited the tied level through the same tied person, so many strict pair questions did not actually need the equality statement.

Decision:

```text
REMOVE_DIRECT_EQUALITY_QUERY
REQUIRE_EQUALITY_BRIDGE_IN_STRICT_PROOF
```

Editorial replacement:

```text
PAIR_RELATION_THROUGH_EQUALITY
```

The strict chain must enter the tie through one member and leave through the other. Removing the equality clue must break the proof.

### `ENDPOINT_ENTITY_WITH_INTERNAL_TIE` — KEEP AS OWNERSHIP PROBE, REMODEL

This is strongly source-real: ranking books include highest/lowest questions even when an internal pair is equal.

However the answer contract resembles frozen `RNK-QL-027 ENDPOINT_ENTITY`. It must therefore not receive a new QL merely because the hidden state now contains equality.

The raw renderer also allowed the equality statement to be logically decorative. V2 makes the endpoint proof cross the equality bridge.

Decision:

```text
KEEP_FOR_EDITORIAL_REVIEW
FINAL_QL_OWNERSHIP_UNRESOLVED
```

### `COMPLETE_WEAK_ORDER` — KEEP

This is the strongest distinct equality-aware form. The answer itself must preserve an equality class, for example:

```text
A > B = C > D > E
```

Distractors can test:

- incorrectly splitting the tied pair;
- reversing a strict level;
- assigning equality to the wrong pair;
- reversing an endpoint relation.

Decision:

```text
KEEP_EDITORIAL_CANDIDATE
```

## 3. Equality must be solver-relevant

The most important V1 self-review finding is that merely including an equality clue is not enough.

Bad structural pattern:

```text
A > B
B = C
B > D
```

The relation `A > D` can be solved through `B` without using `B = C`.

Required V2 pattern:

```text
A > B
B = C
C > D
```

Now the chain from `A` to `D` requires the equality bridge.

Executable V2 therefore requires:

```text
path(top, bottom | strict clues only) = false
path(top, bottom | strict clues + equality) = true
```

## 4. Editorial V2 scope

V2 retains three forms:

```text
PAIR_RELATION_THROUGH_EQUALITY
ENDPOINT_ENTITY_THROUGH_EQUALITY
COMPLETE_WEAK_ORDER
```

Target corpus:

```text
48 questions/source form
144 editorial questions
```

Required gates:

- equality bridge required in every state;
- no direct equality lookup answer;
- 12 / 12 / 12 / 12 answer-position balance per form;
- all five contexts per form;
- pair queries split between local bridge and full-chain proofs;
- highest/lowest endpoint balance;
- four unique options;
- one independently valid answer;
- no Seating Arrangement leakage;
- no symbolic Inequalities takeover;
- no unstated numeric tie-ranking convention;
- no permanent QL allocation.

## 5. Ownership remains open

V2 editorial survival does not imply three QLs.

The next ownership audit must specifically compare:

```text
ENDPOINT_ENTITY_THROUGH_EQUALITY
  versus RNK-QL-027 ENDPOINT_ENTITY

PAIR_RELATION_THROUGH_EQUALITY
  versus RNK-QL-031 RELATIVE_ORDER_OF_PAIR

COMPLETE_WEAK_ORDER
  versus RNK-QL-030 COMPLETE_ORDER
```

The core question is whether equality changes the permanent solve contract enough to require a separate authority, or whether it should become a controlled state extension of an existing frozen authority.

No answer is pre-decided.

## 6. Lifecycle

```text
frozen range:            RNK-QL-001..038
next available identity: RNK-QL-039
CP-006 permanent QLs:    0
Question Studio:         DISABLED
persistence:             DISABLED
Question Bank:           NOT_STORED
test eligibility:        INELIGIBLE
public publication:      false
```
