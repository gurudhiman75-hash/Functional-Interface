# BLR-CP-005 — Final English Discovery Freeze

Status: **structurally saturated and frozen for English review runtime only; exam-grade editorial remediation applied without changing authority identity**.

## Scope

BLR-CP-005 formalizes incomplete family information through complete bounded model enumeration. A fact is definite only when true in every valid model, possible when true in some but not all models, and impossible when true in none.

## Frozen inventory

```text
approved English review questions          184
shared model-space groups                    80
source scenarios                             10
model-space topologies                       10
source prototypes                            23
frozen solve authorities                      8
permanent QLs                                 8
enumerated model instances                  432
full learner-item signatures unique     184 / 184
```

Prototype and question counts were discovered through source, boundary, inverse, edge and overlap audits. They were not established as quotas.

## Permanent allocation

```text
BLR-QL-018  RESOLVE_INVARIANT_RELATION
BLR-QL-019  RESOLVE_RELATION_UNCERTAINTY
BLR-QL-020  SELECT_CLAIM_BY_MODEL_STATUS
BLR-QL-021  IDENTIFY_PERSON_BY_MODEL_STATUS
BLR-QL-022  RESOLVE_PERSON_IDENTITY_UNCERTAINTY
BLR-QL-023  DETERMINE_COUNT_BOUND
BLR-QL-024  SELECT_COUNT_BY_MODEL_STATUS
BLR-QL-025  RESOLVE_COUNT_DETERMINACY
```

Next available chapter identity: `BLR-QL-026`.

## Model-space proof

Every question contains two or three valid completed family models. The runtime exhaustively enumerates the declared finite variable domains, rejects invalid or duplicate graphs, solves each model, classifies every offered claim/person/count and constructs the answer only after the complete model set is known.

An independent verifier reconstructs all 432 family graphs from the exported model diagrams and recomputes relation paths, broad relation reduction, lineage side, person eligibility, truth status and count outcomes without calling the production CP-005 solver.

## Exam-grade editorial remediation

The owner-supplied editorial suite was audited against the frozen contracts and V1 graph ontology. Its style standard was applied to all 184 questions, while examples assigned to the wrong QL or relying on excluded/contradictory family assumptions were not copied as authority definitions.

The runtime now guarantees:

- no learner-facing phrases such as “the gender of X is not stated”;
- natural question stems that let the omission itself create uncertainty;
- authority-specific core concepts;
- an explicit derivation for every valid family model;
- a model-set conclusion and exam-speed shortcut;
- four option explanations with bracketed diagnostic codes;
- unchanged answers, model spaces, QL identities and release boundaries.

The canonical audit is recorded in `BLR-CP-005-EDITORIAL-REMEDIATION.md` and enforced by `cp005-editorial-remediation.test.ts`.

## Merge and split decisions

- exact, broad and gender-neutral invariant relations merge under `RESOLVE_INVARIANT_RELATION`;
- one-of-two and indeterminate relation outcomes merge under `RESOLVE_RELATION_UNCERTAINTY`;
- definite, possible and impossible claims are parameters of one claim-status authority;
- person status and person-set uncertainty remain separate because their answer contracts differ;
- minimum and maximum counts are opposite parameters of one bound authority;
- possible and impossible counts are status parameters of one selection authority;
- invariant and indeterminate exact counts merge under one all-model agreement authority.

## Boundaries

- fully determined relations remain in CP-001 through CP-003;
- definite closed-world counts remain in CP-004;
- coded relation decoding and coded construction remain CP-006 and CP-007;
- Data Sufficiency and multi-attribute family puzzles remain excluded;
- half, step, adoptive and foster relations remain outside V1.

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
