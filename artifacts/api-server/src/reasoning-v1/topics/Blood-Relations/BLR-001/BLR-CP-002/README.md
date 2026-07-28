# BLR-CP-002 — Pointer, Photograph and Conversation Relations

Status: **English open discovery; first executable role-chain slice and V2 editorial gate green; zero permanent QLs**.

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

## Source and ownership boundary

Pointing, photograph, introduction and stage wording are renderer variants. The current merge/split audit provisionally compresses all five prototypes into one solve authority:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

This is provisional only. Pointer items requiring `data inadequate`, possible, impossible or one-of-two semantics remain owned by CP-005.

## Current deterministic gates

```text
mathematical role-chain audit      600 questions
English editorial V2 audit         400 questions
-----------------------------------------------
current CP-002 proof             1,000 questions
```

The mathematical audit checks deterministic reproduction, assertion verification, exact only-role cardinality, four unique options, one correct answer, balanced answer placement, all five presentations, conversation anchors, nested query endpoints, self identity, relation breadth, misconception labels and release locks.

The editorial gate additionally rejects exposed self identities, unnatural photograph openings, generic reflexive wording, irrelevant only-role teaching, incomplete teaching blocks and missing explanation tiers.

## Review records

- `BLR-CP-002-SOURCE-AND-BOUNDARY-AUDIT.md`;
- `BLR-CP-002-MERGE-SPLIT-AUDIT-V1.md`;
- `BLR-CP-002-ENGLISH-REVIEW-V2.md`;
- 60-record V2 HTML/CSV/JSONL review artifact.

## Release boundary

- permanent `BLR-QL-*` allocation: **0**;
- next chapter identity remains `BLR-QL-008` but is not claimed;
- English prototype only;
- Question Studio visibility disabled;
- Question Bank and mock-test eligibility disabled;
- public publication disabled;
- Hindi and Punjabi not started.

## Next discovery work

- widen affinal outputs and source scenarios;
- prove exact only-child patterns separately from only son/daughter;
- widen pointed-person-relative and speaker-relative assertions;
- audit longer four-plus-step chains;
- maintain a rejection register for logically invalid published answers;
- run a second source-gap pass before any permanent allocation.
