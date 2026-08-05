# BLR-CP-007 — Exam Readiness and Pedagogy Remediation V2

Status: **implemented for executable review; human approval required; V1 editorial freeze revoked**.

The five permanent QLs remain unchanged:

```text
BLR-QL-031  SELECT_CODED_EXPRESSION
BLR-QL-032  COMPLETE_MISSING_CODE_TOKEN
BLR-QL-033  COMPLETE_ORDERED_CODE_TOKEN_PAIR
BLR-QL-034  COMPLETE_MISSING_PERSON
BLR-QL-035  SELECT_CODED_STATEMENT_BY_VALIDITY
```

The solver and QL ownership were logically sound. V2 replaces the learner-facing and freeze-proof layers that failed critical review.

## Remediation implemented

- unique balanced answer-position sequences per prototype instead of four-answer rotations;
- semantic option construction before deterministic shuffling;
- graph-valid wrong options for every displayed choice;
- precise failure codes and option-specific explanations;
- separate `statementValidity` and `isCorrect` semantics;
- correct explanation polarity for all invalid-statement questions;
- normalized multi-statement formatting so semicolons do not reveal wrong options;
- rebuilt QL-034 scenarios with four existing, graph-valid candidates;
- A, B, C and D each correct eight times in QL-034;
- question-adaptive explanation modes with no forced audit template;
- one combined diagram with directed parent arrows, relation labels, highlighted path and coded/inferred distinction;
- meaningful SVG title, description and accessible summary;
- explicit full-sibling V1 policy;
- visible question ID, seed, versions, topology, target path, fingerprints, independent verification, renderer validation and human-review state.

## Release boundary

```text
V2 status:                    REMEDIATION_REVIEW_REQUIRED
permanent QL allocation:      unchanged
Question Studio:              disabled
Question Bank:                NOT_STORED
mock-test eligibility:        INELIGIBLE
Hindi/Punjabi localisation:   blocked
public publication:           false
production staging:           disabled
merge:                        not authorised
```

A green executable proof does not freeze V2. Manual review of the exported 168-question pack and a new chapter-wide English audit are required before English manual freeze.
