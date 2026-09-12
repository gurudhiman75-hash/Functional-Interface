# DI-003 Grouped-Bar Phase 2

Status: REVIEW-ONLY GREEN CHECKPOINT

- Representation: grouped bar, two visible series, five categories
- Linked child questions per set: 5
- Exam profiles: SSC CGL Tier I (4 options), Banking Prelims (5 options)
- Deterministic stress proof: 200 sets / 1,000 questions
- Independent verification checks: 1,000
- Option checks: 4,500
- Cross-profile stimulus checks: 100
- Distinct stimuli: 100/100 seeds
- Correct-answer position coverage: complete for every task in both exam profiles
- Collision audit: zero five-option collision states after hardening
- Lifecycle: review-only; no Question Studio discovery, Question Bank storage, test eligibility or public publication

The first Banking stress pass exposed three five-option collapses in CROSS_SERIES_DIFFERENCE. These arose when adjacent-category and same-series misread calculations reduced to the same displayed value. The final candidate architecture replaces those fragile calculations with unit-consistent whole-series-total misread traps while retaining an adjacent-category trap as a lower-priority distractor. The percent-comparison task was also made state-safe by choosing the lower Product A bar as the comparison base regardless of chronological order.
