# BLR-CP-005 — Exam-Grade Editorial Remediation

Status: **applied across all 184 frozen English review questions without changing the eight permanent solve authorities**.

## Owner-supplied editorial direction

The supplied corpus established the required learner-facing standard:

1. natural exam stems without meta-spoonfeeding;
2. a QL-specific core concept;
3. an exhaustive model-by-model audit;
4. a five-second exam shortcut;
5. option-specific reasoning with bracketed misconception codes.

The style direction is adopted. Example content was not copied blindly because permanent QL identity is controlled by solve authority, and every model must obey the frozen V1 family ontology.

## Canonical QL alignment

```text
BLR-QL-018  RESOLVE_INVARIANT_RELATION
             exact invariant + common broad invariant
BLR-QL-019  RESOLVE_RELATION_UNCERTAINTY
             exact one-of-two relation set + relation indeterminacy
BLR-QL-020  SELECT_CLAIM_BY_MODEL_STATUS
             definite / possible / impossible statement selection
BLR-QL-021  IDENTIFY_PERSON_BY_MODEL_STATUS
             definite / possible / impossible named person
BLR-QL-022  RESOLVE_PERSON_IDENTITY_UNCERTAINTY
             one-of-two named identities + identity indeterminacy
BLR-QL-023  DETERMINE_COUNT_BOUND
             minimum or maximum attainable count
BLR-QL-024  SELECT_COUNT_BY_MODEL_STATUS
             possible or impossible offered count
BLR-QL-025  RESOLVE_COUNT_DETERMINACY
             invariant exact count or cannot be determined
```

## Corrections made during audit

- The supplied gender-neutral invariant example belongs to `BLR-QL-018`, not `BLR-QL-019`.
- The supplied father-or-mother disjunction belongs to `BLR-QL-019`, not `BLR-QL-020`.
- Statement validity belongs to `BLR-QL-020`, not `BLR-QL-025`.
- Person-status and person-identity authorities remain `BLR-QL-021` and `BLR-QL-022`; count examples cannot replace them.
- Exact or indeterminate count belongs to `BLR-QL-025`, while possible/impossible offered counts remain `BLR-QL-024`.
- The chained-sibling example was rejected because its explanation relies on half/step-sibling semantics, which are outside Blood Relations V1.
- The “two married couples and two children” range example was rejected because the wording says two children total while the proposed maximum counts four children.
- “Sister's child” is retained as the natural broad label; the uncommon word “nibling” is not required in learner-facing options.

## Runtime remediation

All 184 questions now receive:

- polished prompts and stems with the banned meta phrases removed;
- authority-specific theory;
- one explicit audit line for every valid model;
- an aggregate outcome/status/count line;
- a QL-specific speed shortcut;
- four complete option explanations ending in diagnostic codes;
- the existing 432 independently verified family diagrams.

The graph, answer, option semantics, permanent QL IDs, review-only locks and publication boundaries remain unchanged.
