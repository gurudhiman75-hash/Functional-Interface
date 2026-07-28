# BLR-CP-002 — Pointer, Photograph and Conversation Relations

Status: **English open discovery; core, affinal, exact only-child and V2 editorial gates green; zero permanent QLs**.

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
+ gendered or broad role vocabulary
+ explicit ONLY quantifier
+ role-chain query endpoints
```

The solver:

1. resolves every pronoun to an anchor;
2. expands broad roles when required;
3. reduces each role chain in order;
4. checks every `ONLY` claim after forming the complete role set;
5. independently verifies the displayed assertion;
6. resolves both query endpoints;
7. returns `SELF` when both endpoints collapse to one identity;
8. otherwise delegates the final relation to the frozen family-graph closure.

Broad role semantics include:

```text
PARENT = FATHER ∪ MOTHER
CHILD = SON ∪ DAUGHTER
SIBLING = BROTHER ∪ SISTER
SPOUSE = HUSBAND ∪ WIFE
```

Therefore `ONLY_CHILD` is true only when the union of sons and daughters contains exactly one person.

## Source and ownership boundary

Pointing, photograph, introduction and stage wording are renderer variants. The current merge/split audit provisionally compresses all five prototypes into one solve authority:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

This is provisional only. Pointer items requiring `data inadequate`, possible, impossible or one-of-two semantics remain owned by CP-005.

## Current deterministic gates

```text
mathematical role-chain audit                 600 questions
affinal + only-child source-widening audit    832 questions
English editorial V2 audit                    400 questions
------------------------------------------------------
current CP-002 proof                         1,832 questions
```

The core audit checks deterministic reproduction, assertion verification, only-role cardinality, four unique options, one correct answer, balanced answer placement, all five presentations, conversation anchors, nested query endpoints, self identity, relation breadth, misconception labels and release locks.

The widening gate proves nine affinal relation families, three exact only-child forms and rejection of a false only-child claim when one son and one daughter are both present. The complete frozen CP-001 regression workflow remains green after the shared foundation extensions.

The editorial gate rejects exposed self identities, unnatural photograph openings, generic reflexive wording, irrelevant only-role teaching, incomplete teaching blocks and missing explanation tiers.

## Review and audit records

- `BLR-CP-002-SOURCE-AND-BOUNDARY-AUDIT.md`;
- `BLR-CP-002-MERGE-SPLIT-AUDIT-V1.md`;
- `BLR-CP-002-ENGLISH-REVIEW-V2.md`;
- `BLR-CP-002-SOURCE-WIDENING-AUDIT-V1.md`;
- `BLR-CP-002-ONLY-CHILD-AUDIT-V1.md`;
- `BLR-CP-002-SOURCE-REJECTION-REGISTER-V1.md`;
- 60-record V2 HTML/CSV/JSONL review artifact.

## Current discovery inventory

```text
positive source scenarios:         26
negative cardinality models:        1
exploratory prototypes:             5
provisional solve authorities:      1
permanent CP-002 QLs:               0
```

## Release boundary

- next chapter identity remains `BLR-QL-008` but is not claimed;
- English prototype only;
- Question Studio visibility disabled;
- Question Bank and mock-test eligibility disabled;
- public publication disabled;
- Hindi and Punjabi not started.

## Remaining discovery work

- integrate the twelve widening scenarios into the canonical question generator and review appendix;
- audit longer four-plus-step chains;
- run a second independent source-gap pass;
- rerun merge/split against the complete evidence;
- allocate only after a successful discovery freeze.
