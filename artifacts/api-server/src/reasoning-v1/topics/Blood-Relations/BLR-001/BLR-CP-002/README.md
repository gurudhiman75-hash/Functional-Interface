# BLR-CP-002 — Pointer, Photograph and Conversation Relations

Status: **English source-gap and merge/split passes complete; one authority recommended; human review pending; zero permanent QLs**.

## Exploratory prototype surface

```text
BLR-CP002-PROT-POINTED-TO-SPEAKER
BLR-CP002-PROT-SPEAKER-TO-POINTED
BLR-CP002-PROT-NESTED-QUERY-ENDPOINT
BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION
BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION
BLR-CP002-PROT-SELF-IDENTITY
```

These are source-discovery identities. They do not establish a six-QL freeze.

## Recommended solve authority

The second source-gap and merge/split rerun recommends one eventual authority:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

This remains a recommendation until human review and the formal discovery-freeze record pass.

## Runtime model

The structured runtime supports:

```text
speaker / listener / pointed-person anchors
+ one, two or three active anchors
+ nested role-chain expressions
+ SAME_PERSON or kinship assertions
+ gendered and broad role vocabulary
+ ANY / ONLY / NONE cardinality
+ direct, reverse, nested and both-derived query endpoints
+ relation, self and possessive photograph/portrait rendering
```

The solver:

1. resolves every pronoun to an explicit anchor;
2. validates zero-cardinality facts such as `no brother or sister`;
3. expands broad roles where required;
4. reduces each role chain in order;
5. validates every `ONLY` condition after forming the complete role set;
6. independently verifies the displayed assertion;
7. resolves both query endpoints;
8. returns `SELF` when the endpoint identities coincide;
9. otherwise delegates the final relation to the family-graph closure;
10. applies the selected learner-facing question and option renderer.

Broad role semantics include:

```text
PARENT = FATHER ∪ MOTHER
CHILD = SON ∪ DAUGHTER
SIBLING = BROTHER ∪ SISTER
SPOUSE = HUSBAND ∪ WIFE
```

## Implemented source dimensions

- pointing, photograph, portrait, introduction, stage and conversation wording;
- `How is X related to Y?`;
- `Whose photograph was it?`;
- `At whose portrait was ... looking?`;
- direct and reverse endpoint order;
- neither, one or both query endpoints as role chains;
- one-, two- and three-anchor contexts;
- one- through four-step expressions;
- `ANY`, exact `ONLY` and zero-cardinality conditions;
- exact broad `ONLY_CHILD`;
- explicit `no brother or sister`;
- blood and affinal outputs;
- pictured self and derived-endpoint self;
- semantic relation options and possessive options such as `His son's` and `Her own`.

## Current deterministic gates

```text
core mathematical audit                    720 questions
affinal + only-child widening               832 questions
English editorial audit                     480 questions
three-anchor topology                       256 questions
both-derived query endpoints                192 questions
negative sibling constraints                256 questions
photograph/portrait ownership renderer      192 questions
four-step role chains                       384 questions
canonical 45-scenario appendix              180 questions
--------------------------------------------------------
current CP-002 proof                      3,492 questions
```

The complete frozen CP-001 workflow remains green after the shared foundation and CP-002 extensions.

## Discovery inventory

```text
positive canonical source scenarios: 45
negative model families:              2
exploratory prototypes:               6
recommended solve authorities:        1
permanent CP-002 QLs:                  0
canonical appendix records:          180
```

## Review and audit records

- `BLR-CP-002-SOURCE-AND-BOUNDARY-AUDIT.md`;
- `BLR-CP-002-SOURCE-WIDENING-AUDIT-V1.md`;
- `BLR-CP-002-ONLY-CHILD-AUDIT-V1.md`;
- `BLR-CP-002-SOURCE-REJECTION-REGISTER-V1.md`;
- `BLR-CP-002-OWNERSHIP-RENDERER-AUDIT-V1.md`;
- `BLR-CP-002-SECOND-SOURCE-GAP-AUDIT.md`;
- `BLR-CP-002-MERGE-SPLIT-AUDIT-V1.md` (content upgraded to V2);
- `BLR-CP-002-ENGLISH-REVIEW-V2.md`;
- canonical HTML/CSV/JSONL review artifact.

## Ownership boundary

The following are not CP-002 exact-answer modes:

- `data inadequate`, possible, impossible and one-of-two semantics: CP-005;
- shared family passages: CP-003;
- family counts and composition: CP-004;
- coded relation decoding: CP-006;
- coded construction and validation: CP-007.

## Release boundary

- next chapter identity remains `BLR-QL-008` but is not claimed;
- permanent CP-002 QLs: **0**;
- Question Studio visibility disabled;
- Question Bank and mock-test eligibility disabled;
- public publication disabled;
- Hindi and Punjabi not started.

## Remaining blocker

Human editorial review and approval of the final English open-discovery pack is required before the formal one-authority freeze, allocation of `BLR-QL-008`, manifest amendment or delivery integration.
