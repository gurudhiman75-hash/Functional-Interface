# BLR-CP-006 — Final English Discovery Freeze

Status: **structurally saturated and frozen for English review runtime only**.

## Scope

BLR-CP-006 decodes a supplied kinship code, converts every adjacent coded pair into a directed family assertion, closes the decoded family graph and answers relation, person, gender and pair queries.

## Frozen inventory

```text
approved English review questions          152
source prototypes                           19
frozen solve authorities                     5
permanent QLs                                5
source topologies                            17
decoded statement instances                 440
full learner-item signatures unique         152 / 152
```

Prototype and question counts were discovered through source, boundary, inverse, edge, answer-contract and CP-007 ownership audits. They were not established as quotas.

## Permanent allocation

```text
BLR-QL-026  RESOLVE_CODED_RELATION
BLR-QL-027  IDENTIFY_PERSON_FROM_CODED_GRAPH
BLR-QL-028  DETERMINE_GENDER_FROM_CODED_GRAPH
BLR-QL-029  SELECT_CODED_RELATION_PAIR
BLR-QL-030  RESOLVE_CODED_FAMILY_SET_RELATION
```

Next available chapter identity: `BLR-QL-031`.

## Key decisions

- direct, reverse, two-link, three-link, endpoint and internal-person relation queries merge under one decoded-relation authority;
- person identification, gender and pair selection remain separate because their answer contracts and option validators differ;
- multi-statement family sets remain separate because every decoded statement must be retained in one connected graph and audited as a set;
- symbol, letter and neutral-word tokens are presentation parameters, not different solve authorities;
- arithmetic precedence is forbidden;
- one token has one meaning within a question;
- every fixed gender comes from a decoded gender-bearing relation, never from a name or letter label;
- expression construction, missing-token and correct/incorrect coded-statement tasks belong to CP-007.

## Verification

Every one of the 152 questions is independently re-solved from its exported graph without calling the production relation resolver. The proof also covers unique code tokens, explicit direction, deterministic replay, four unique options, diagnostic misconception codes, family-tree parity, all answer positions and all three code-token styles.

## Release boundary

```text
English permanent review runtime          available
Question Studio                          disabled
Question Bank                            disabled
mock tests                               disabled
Hindi/Punjabi localisation               not started
public publication                       disabled
production staging                       disabled
merge                                    not authorised
```
