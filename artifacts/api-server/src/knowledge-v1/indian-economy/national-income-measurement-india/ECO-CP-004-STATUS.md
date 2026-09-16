# ECO-CP-004 Status — National Income Measurement in India

**Lifecycle:** REVIEW_CANDIDATE_V2  
**Runtime:** BLOCKED_PENDING_HUMAN_APPROVAL  
**Localisation:** not started

## Implemented

- CP specification and Static-GK boundary;
- NCERT/MoSPI source registry;
- canonical method, use-case and component pools;
- value-added and GVA-to-GDP calculation pools;
- 12 QLs and deterministic 44-question English review generator;
- per-variant Easy/Medium/Hard difficulty assignment;
- V2 generator overlay and V2 structural/editorial QA;
- 24-question V2 human review Markdown set.

## V2 closure-audit changes

- replaced legacy answer-label / terminal-colon prompts with complete exam-grade questions;
- kept final/intermediate-use questions on the same classification axis;
- improved double-counting distractors so they stay within national-account measurement concepts;
- removed `Net exports` as a distractor from income-method component questions;
- retained value-added and GVA-to-GDP calculations with short working;
- retained the base-year concept without turning the current base year into a memorisation fact;
- retained MoSPI as the official ministry anchor for National Accounts Statistics;
- added V2 QA for complete stems, same-axis options, duplicate prevention, source resolution and Static-GK boundaries.

## Static-GK boundary

Excluded from this CP:
- current GDP/GVA values;
- current growth rates;
- current sector shares;
- current base-year number as a memorisation fact;
- live revisions, forecasts or release-specific statistics.

## Promotion path

1. Human review of English V2 stems, distractors, explanations and difficulty.
2. Fix any remaining editorial/content defects if found.
3. Freeze approved English V2 behaviour.
4. Add localisation only after English approval.
5. Register with runtime / Question Studio only after a separate promotion approval.
