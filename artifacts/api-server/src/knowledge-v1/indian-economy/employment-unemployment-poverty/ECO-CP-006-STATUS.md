# ECO-CP-006 Status

**CP:** ECO-CP-006 Employment, Unemployment & Poverty  
**Lifecycle:** REVIEW_CANDIDATE_V1  
**Runtime:** BLOCKED_PENDING_HUMAN_APPROVAL  
**Localisation:** NOT_STARTED

## Implemented

- official/static source registry;
- canonical labour-force, unemployment and poverty concepts;
- employment-status scenario pool;
- poverty-estimation committee pool;
- 12 QLs;
- deterministic 44-question English review generator;
- per-variant Easy/Medium/Hard classification;
- improved explanation style using rule + reason/application;
- QA for formulas, committee sequence, sources, duplicate prevention, option validity and difficulty spread;
- QA blocking current unemployment/poverty/MPI/MGNREGA values;
- human review Markdown set.

## Static boundary

Excluded from this CP:
- current unemployment rate, LFPR and WPR values;
- current poverty ratio and MPI values/rankings;
- current poverty-line rupee values;
- current MGNREGA wage rates, beneficiary counts and Budget allocations;
- current state rankings or scheme performance.

## Promotion steps

1. Human review of English questions and explanations.
2. Fix editorial/content defects if found.
3. Freeze approved English behavior.
4. Add localisation layer.
5. Register with runtime/Question Studio only after promotion approval.
