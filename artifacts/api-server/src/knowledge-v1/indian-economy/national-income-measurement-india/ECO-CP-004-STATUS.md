# ECO-CP-004 Status — National Income Measurement in India

**Lifecycle:** REVIEW_CANDIDATE_V1  
**Runtime:** BLOCKED_PENDING_HUMAN_APPROVAL  
**Localisation:** not started

## Implemented

- CP specification and Static-GK boundary
- NCERT/MoSPI source registry
- canonical method, use-case and component pools
- value-added and GVA-to-GDP calculation pools
- 12 QLs
- 44-question deterministic English review generator
- per-variant Easy/Medium/Hard difficulty assignment
- structural/editorial QA tests
- 24-question human review Markdown set

## Important safeguards

- current GDP/GVA values excluded
- current growth rates excluded
- current sector shares excluded
- current base-year number excluded as a memorisation fact
- final/intermediate classification depends on use
- double-counting logic explicitly tested
- runtime remains disabled until human approval

## Promotion path

1. Human review of stems, distractors, explanations and difficulty.
2. Fix any editorial or conceptual defects.
3. Freeze approved English surface.
4. Add localisation only after English approval.
5. Register with runtime / Question Studio only after the approval gate is deliberately opened.
