# RNK-CP-006 — Equality-Aware Ranking Authority Consolidation V1

Status: **THREE DISTINCT PROVISIONAL AUTHORITIES — no permanent QL allocated**

## 1. Inputs

This decision follows:

- source confirmation that Ranking examples can contain explicit equal-height, equal-score and equal-speed groups;
- raw V1 executable discovery;
- rejection of direct equal-pair lookup;
- Editorial V2 equality-bridge remediation;
- the frozen CP-004 ownership rule that reserves tied/non-strict ranking for CP-006 rather than silently widening strict-order QLs.

## 2. State-contract boundary

Frozen CP-004 authorities operate on one **unique strict total order**:

```text
A > B > C > D > E
```

CP-006 uses one **unique total preorder with explicit equality**:

```text
A > B = C > D > E
```

The equality class changes the solver state. It must be collapsed as one comparison level, and strict inference may require equality substitution to connect the chain.

Therefore CP-006 is not implemented as a silent input variant of frozen CP-004.

## 3. Rejected raw form

```text
EQUAL_PAIR_IDENTIFICATION
```

Decision:

```text
REJECT_DIRECT_CLUE_LOOKUP
```

An item that literally states `B = C` and then asks which pair is equal does not provide a meaningful separate proof contract.

## 4. Surviving source forms

```text
PAIR_RELATION_THROUGH_EQUALITY
ENDPOINT_ENTITY_THROUGH_EQUALITY
COMPLETE_WEAK_ORDER
```

All three now require the equality fact to be solver-relevant.

## 5. Merge/split decision

The three surviving forms remain **distinct provisional authorities** because they have different answer semantics and different minimal proof contracts.

### A. `EQUALITY_AWARE_PAIR_RELATION`

Source:

```text
PAIR_RELATION_THROUGH_EQUALITY
```

Answer semantic:

```text
RELATION
```

Proof contract:

```text
EQUALITY_BRIDGED_DIRECTIONAL_PAIR_PROOF
```

Strict CP-004 analogue:

```text
RNK-QL-031 RELATIVE_ORDER_OF_PAIR
```

Why separate for discovery/freeze purposes:

- CP-004 assumes every person occupies a distinct strict level;
- CP-006 must substitute across an equality class before the directional relation follows;
- direct equality lookup has been removed, so the item still requires actual inference.

### B. `EQUALITY_AWARE_ENDPOINT`

Source:

```text
ENDPOINT_ENTITY_THROUGH_EQUALITY
```

Answer semantic:

```text
ENTITY
```

Proof contract:

```text
EQUALITY_BRIDGED_ENDPOINT_SELECTION
```

Strict CP-004 analogue:

```text
RNK-QL-027 ENDPOINT_ENTITY
```

Why not merge with the pair authority:

- the answer is a person rather than a relation;
- the proof must connect the entire preorder far enough to establish the unique top/bottom endpoint;
- highest/lowest is a query parameter within this authority, mirroring CP-004's consolidation discipline.

### C. `COMPLETE_WEAK_ORDER`

Source:

```text
COMPLETE_WEAK_ORDER
```

Answer semantic:

```text
WEAK_ORDER_SEQUENCE
```

Proof contract:

```text
EQUALITY_AWARE_FULL_SEQUENCE
```

Strict CP-004 analogue:

```text
RNK-QL-030 COMPLETE_ORDER
```

Why distinct:

- the answer must preserve the equality class itself;
- distractors can split the tie, move equality to the wrong people or reverse a strict level;
- the learner must reconstruct the complete ordered partition, not merely one entity or one relation.

## 6. Why not one generic equality QL

A single umbrella `EQUALITY_AWARE_RANKING` authority would mix three materially different outputs:

```text
entity
relation
full weak-order sequence
```

That would weaken Question Studio controls, distractor semantics, explanation contracts and difficulty calibration.

The existing CP-004 architecture already separates endpoint, pair-direction and complete-order authorities for this reason. CP-006 follows the same semantic boundary while changing the state contract from strict total order to total preorder.

Decision:

```text
KEEP_THREE_DISTINCT_PROVISIONAL_AUTHORITIES
```

## 7. Important non-decision

This document does **not** allocate:

```text
RNK-QL-039
RNK-QL-040
RNK-QL-041
```

Those numbers remain only the next available contiguous range if all three authorities later pass final review and receive explicit freeze approval.

Current permanent allocation remains:

```text
RNK-QL-001..038
```

## 8. Numeric tie ranks remain excluded

No surviving authority answers questions about the numerical rank following a tie.

The generator still does not assume:

```text
competition ranking
or
dense ranking
or
fractional ranking
```

A later numeric-tie family requires explicit exam-source evidence or an item-stated convention.

## 9. Next checkpoint

```text
Editorial V2 release validation
-> 24-question human/self-review
-> authority anti-duplication proof
-> production-scale candidate only if review passes
-> final freeze review
-> explicit freeze approval
-> permanent QL allocation
```

## 10. Lifecycle

```text
frozen RNK range:             RNK-QL-001..038
next available QL:            RNK-QL-039
provisional CP-006 authorities: 3
CP-006 permanent QLs:         0
Question Studio:              DISABLED
persistence:                  DISABLED
Question Bank:                NOT_STORED
test eligibility:             INELIGIBLE
public publication:           false
Hindi/Punjabi:                NOT_STARTED
```
