# ECO-CP-013 Status

**CP:** ECO-CP-013 Government Budget  
**Lifecycle:** ENGLISH_APPROVED_V1_FROZEN  
**Runtime:** BLOCKED_PENDING_SEPARATE_PROMOTION_APPROVAL  
**Localisation:** NOT_STARTED

## Implemented

- official Constitution and Ministry of Finance source registry;
- Annual Financial Statement / Article 112;
- Consolidated Fund, Contingency Fund and Public Account distinctions;
- charged versus voted expenditure;
- Demands for Grants / Article 113 and Lok Sabha voting role;
- Appropriation Bill / Article 114;
- Finance Bill and tax-proposal role under Article 110;
- supplementary, additional and excess grants / Article 115;
- Vote on Account, Vote of Credit and Exceptional Grant / Article 116;
- Expenditure Budget and Receipt Budget;
- Expenditure Profile and Budget at a Glance;
- 12 QLs;
- deterministic 44-question English review generator;
- per-variant Easy/Medium/Hard classification;
- rule + reason/application explanations;
- QA for source resolution, option validity, duplicates, constitutional distinctions and difficulty spread;
- QA requiring complete question-style stems ending in `?` and blocking terminal-colon prompt fragments;
- QA blocking current Budget allocations, current tax proposals/rates, current deficit/debt values, current Contingency Fund corpus and current number of Demands for Grants;
- 24-question human review Markdown set.

## Freeze note

Human review approved the V1 English surface on 2026-09-15. English behaviour is frozen pending localisation and a separate runtime/Question Studio promotion decision.

## Static boundary

Excluded from this CP:
- current Budget allocations or scheme outlays;
- current number of Demands for Grants;
- current tax rates/slabs and current Finance Bill proposals;
- current deficit/debt values;
- current Contingency Fund corpus;
- current ministry-wise expenditure or receipts;
- detailed tax-system classification reserved for ECO-CP-014.

## Promotion steps

1. English V1 approved and frozen.
2. Add localisation layer in the localisation phase.
3. Register with runtime/Question Studio only after separate promotion approval.
