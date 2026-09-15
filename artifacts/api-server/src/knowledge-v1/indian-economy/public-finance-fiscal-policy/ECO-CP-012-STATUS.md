# ECO-CP-012 Status

**CP:** ECO-CP-012 Public Finance & Fiscal Policy  
**Lifecycle:** REVIEW_CANDIDATE_V2  
**Runtime:** BLOCKED_PENDING_HUMAN_APPROVAL  
**Localisation:** NOT_STARTED

## Implemented

- NCERT/Union Budget/FRBM official-source registry;
- public-finance and fiscal-policy concepts;
- expansionary/contractionary fiscal-policy direction;
- revenue/capital receipt distinctions;
- debt and non-debt capital receipt distinctions;
- revenue/capital expenditure distinctions;
- fiscal, revenue and primary deficit concepts and formulas;
- simple numerical deficit application;
- public-debt and interest-burden logic;
- FRBM Act, 2003 concept and fiscal-responsibility principles;
- automatic stabilisers at introductory level;
- 12 QLs;
- deterministic 44-question English review generator;
- V2 editorial stem-polish overlay converting fragment/colon prompts into complete exam-style questions;
- per-variant Easy/Medium/Hard classification;
- stronger rule + reason/application explanations;
- QA for exact batch count, sources, options, duplicates, formulas, classification logic and difficulty spread;
- V2 QA requiring complete question-style stems and blocking terminal-colon prompt fragments;
- QA blocking current deficit/debt ratios, live Budget allocations, current tax slabs and current FRBM numerical targets;
- 24-question human review set regenerated with V2 stems.

## V2 stem-quality rule

- Normal MCQ stems must read as complete exam questions rather than label-like prompts.
- Avoid endings such as `classified as:`, `calculated as:`, `stands for:`, `means:` and similar prompt fragments.
- Prefer natural forms such as `How is ... classified?`, `Which formula is used ...?`, `What does ... indicate?` and `What is the full form of ...?`.
- A colon may still appear inside a naturally structured statement question, but normal question stems must not end with a colon.

## Static boundary

Excluded from this CP:
- current fiscal/revenue/primary deficit ratios or rupee values;
- current public-debt ratio;
- current Budget allocations, subsidies or tax collections;
- current FRBM numerical targets and escape-clause values;
- current tax rates/slabs;
- detailed Budget procedure/documents reserved for ECO-CP-013;
- detailed tax-system classification reserved for ECO-CP-014.

## Promotion steps

1. Human review of English V2 questions and explanations.
2. Fix editorial/content defects if found.
3. Freeze approved English behavior.
4. Add localisation layer in the localisation phase.
5. Register with runtime/Question Studio only after separate promotion approval.
