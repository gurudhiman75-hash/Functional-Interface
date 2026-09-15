# ECO-CP-009 Status

**CP:** ECO-CP-009 Monetary Policy  
**Lifecycle:** ENGLISH_APPROVED_V1_FROZEN  
**Runtime:** BLOCKED_PENDING_SEPARATE_PROMOTION_APPROVAL  
**Localisation:** NOT_STARTED

## Implemented and approved

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
- 24-question human review Markdown set;
- English V1 human review approved and frozen.

## Static boundary

Excluded from this CP:
- current repo/SDF/MSF/Bank Rate/CRR/SLR values;
- current policy stance or latest MPC decision;
- current inflation target/tolerance numbers;
- current MPC member names;
- current WACR/liquidity figures;
- detailed variable-rate auction operations;
- detailed commercial-bank credit creation reserved for ECO-CP-010.

## Next promotion steps

1. Preserve the approved English behavior.
2. Add localisation layer in the localisation phase.
3. Register with runtime/Question Studio only after separate promotion approval.
