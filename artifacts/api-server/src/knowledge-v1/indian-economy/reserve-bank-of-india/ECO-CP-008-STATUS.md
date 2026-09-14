# ECO-CP-008 Status

**CP:** ECO-CP-008 Reserve Bank of India  
**Lifecycle:** REVIEW_CANDIDATE_V1  
**Runtime:** BLOCKED_PENDING_HUMAN_APPROVAL  
**Localisation:** NOT_STARTED

## Implemented

- official RBI source registry;
- canonical history, function and currency-responsibility fact pools;
- 12 QLs;
- deterministic 44-question English review generator;
- per-variant Easy/Medium/Hard classification;
- stronger rule + reason/application explanation style;
- explicit banknote/coin/one-rupee-note responsibility distinctions;
- banker-to-government, debt-manager, banker-to-banks and lender-of-last-resort distinctions;
- regulation/supervision, foreign-exchange, payment-system and developmental roles;
- QA for source resolution, option validity, duplicates, history milestones, currency responsibilities and difficulty spread;
- QA blocking current-person/current-policy/current-value leakage;
- QA blocking detailed repo/CRR/SLR instrument questions reserved for ECO-CP-009;
- 24-question human review Markdown set.

## Static boundary

Excluded from this CP:
- current Governor and Deputy Governors;
- current policy-rate and reserve-ratio values;
- detailed monetary-policy instruments and transmission;
- current foreign-exchange-reserve values;
- current note/coin circulation statistics;
- current bank/payment-operator counts and rankings;
- current payment-system transaction volumes;
- detailed commercial-bank operations reserved for later CPs.

## Promotion steps

1. Human review of English questions and explanations.
2. Fix editorial/content defects if found.
3. Freeze approved English behavior.
4. Add localisation layer in the localisation phase.
5. Register with runtime/Question Studio only after separate promotion approval.
