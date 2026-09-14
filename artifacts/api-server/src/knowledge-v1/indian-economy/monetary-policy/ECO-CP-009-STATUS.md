# ECO-CP-009 Status

**CP:** ECO-CP-009 Monetary Policy  
**Lifecycle:** REVIEW_CANDIDATE_V1  
**Runtime:** BLOCKED_PENDING_HUMAN_APPROVAL  
**Localisation:** NOT_STARTED

## Implemented

- official RBI source registry;
- static scope and exclusions;
- canonical monetary-policy, MPC and instrument fact pools;
- policy/liquidity scenario pool;
- 12 QLs;
- deterministic 44-question English review generator;
- per-variant Easy/Medium/Hard classification;
- stronger rule + reason/application explanations;
- MPC structure/voting/meeting-frequency coverage;
- repo/SDF/MSF/LAF-corridor distinctions;
- CRR, OMO and Bank Rate concept coverage;
- expansionary/contractionary direction and introductory transmission;
- QA for source resolution, option validity, duplicates, corridor logic, liquidity direction and difficulty spread;
- QA blocking current rate/stance/member leakage;
- 24-question human review Markdown set.

## Static boundary

Excluded from this CP:
- current repo/SDF/MSF/Bank Rate/CRR/SLR values;
- current policy stance or latest MPC decision;
- current inflation target/tolerance numbers;
- current MPC member names;
- current WACR/liquidity figures;
- detailed variable-rate auction operations;
- detailed commercial-bank credit creation reserved for ECO-CP-010.

## Promotion steps

1. Human review of English questions and explanations.
2. Fix editorial/content defects if found.
3. Freeze approved English behavior.
4. Add localisation layer in the localisation phase.
5. Register with runtime/Question Studio only after separate promotion approval.
