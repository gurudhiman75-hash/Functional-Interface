# ECO-CP-007 Status

**CP:** ECO-CP-007 Money & Monetary System  
**Lifecycle:** REVIEW_CANDIDATE_V1  
**Runtime:** BLOCKED_PENDING_HUMAN_APPROVAL  
**Localisation:** NOT_STARTED

## Implemented

- static scope and exclusions;
- NCERT/RBI source registry;
- canonical money, deposit, aggregate and reserve-money facts;
- function and deposit scenario pools;
- M1/M2/M3/M4 relationships and liquidity ordering;
- introductory multiplier cases;
- 12 QLs;
- deterministic 44-question English review generator;
- per-variant Easy/Medium/Hard classification;
- stronger rule + reason/application explanations;
- QA for source resolution, option validity, duplicates, aggregate formulas, liquidity ordering and difficulty spread;
- QA blocking current monetary values and detailed monetary-policy instruments;
- 24-question human review Markdown set.

## Static boundary

Excluded from this CP:
- current money-supply or reserve-money values/growth rates;
- current repo, reverse-repo, CRR or SLR values;
- current denomination availability and circulation values;
- detailed monetary-policy operations;
- detailed commercial-bank credit creation;
- current digital-payment usage data.

## Promotion steps

1. Human review of English questions and explanations.
2. Fix editorial/content defects if found.
3. Freeze approved English behavior.
4. Add localisation layer in the localisation phase.
5. Register with runtime/Question Studio only after separate promotion approval.
