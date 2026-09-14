# ECO-CP-005 Status

**CP:** ECO-CP-005 Inflation & Price Concepts  
**Lifecycle:** REVIEW_CANDIDATE_V2  
**Runtime:** BLOCKED_PENDING_HUMAN_APPROVAL  
**Localisation:** NOT_STARTED

## Implemented

- static scope and exclusions;
- official source registry;
- canonical concept and price-index pools;
- demand-pull and cost-push scenario pools;
- 12 QLs;
- deterministic 44-question English review generator;
- per-variant Easy/Medium/Hard classification;
- improved explanation style using rule + reason + key distinction/working where useful;
- QA preventing answer-only/generic explanations;
- QA for source resolution, duplicates, option validity, difficulty spread and static-data boundary;
- Human Review Set V2 with improved explanations.

## Explanation standard

- normally one or two short sentences;
- state the deciding rule rather than only repeat the answer;
- connect the rule to the scenario when the question is applied;
- explicitly explain true/false logic in statement questions;
- show the small calculation in numerical questions;
- remain beginner-friendly and avoid unrelated extra facts.

## Deliberately excluded

- current CPI/WPI/inflation values;
- current inflation target/tolerance band;
- current index weights/base-year memorisation;
- forecasts and current food/fuel contributions;
- arbitrary creeping/walking/running percentage bands.

## Promotion steps

1. Human review of English questions and V2 explanations.
2. Fix editorial/content defects if found.
3. Freeze approved English behavior.
4. Add localisation layer.
5. Register with runtime/Question Studio only after promotion approval.
