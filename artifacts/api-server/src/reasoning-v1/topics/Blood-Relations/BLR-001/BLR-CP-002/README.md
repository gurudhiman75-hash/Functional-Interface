# BLR-CP-002 — Pointer, Photograph and Conversation Relations

Status: **English open discovery; first executable role-chain slice; zero permanent QLs**.

## Implemented prototype surface

```text
BLR-CP002-PROT-POINTED-TO-SPEAKER
BLR-CP002-PROT-SPEAKER-TO-POINTED
BLR-CP002-PROT-NESTED-QUERY-ENDPOINT
BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION
BLR-CP002-PROT-SELF-IDENTITY
```

These are exploratory identities. They do not establish a five-QL freeze.

## Runtime model

The runtime stores dialogue as structured role assertions:

```text
speaker / listener / pointed-person anchors
+ nested role chains
+ SAME_PERSON or kinship assertion
+ explicit ONLY quantifier
+ role-chain query endpoints
```

The solver:

1. resolves every pronoun to an anchor;
2. reduces each role chain in order;
3. checks every `ONLY` claim against the active family scope;
4. independently verifies the displayed assertion;
5. resolves both query endpoints;
6. returns `SELF` when both endpoints collapse to one identity;
7. otherwise delegates the final relation to the frozen family-graph closure.

## Source boundary

Pointing, photograph, introduction and stage wording are renderer variants. Two-speaker anchoring, nested query endpoints and self identity remain separate prototypes until merge/split evidence is complete.

Pointer items requiring `data inadequate`, possible, impossible or one-of-two semantics remain owned by CP-005.

## Current deterministic gate

```text
5 prototypes × 120 seeds = 600 questions
```

The audit checks deterministic reproduction, statement verification, exact only-role cardinality, four unique options, one correct answer, balanced answer placement, all five presentations, conversation anchors, nested query endpoints, self identity, relation breadth, misconception labels and release locks.

## Release boundary

- permanent `BLR-QL-*` allocation: **0**;
- next chapter identity remains `BLR-QL-008` but is not claimed;
- English prototype only;
- Question Studio visibility disabled;
- Question Bank and mock-test eligibility disabled;
- public publication disabled;
- Hindi and Punjabi not started.

## Next discovery work

- widen source scenarios for pointed-person-relative and speaker-relative assertions;
- audit derived in-law role chains and exact/broad boundaries;
- add English review export;
- perform merge/split and inverse audits;
- run a second source-gap pass before any permanent allocation.
