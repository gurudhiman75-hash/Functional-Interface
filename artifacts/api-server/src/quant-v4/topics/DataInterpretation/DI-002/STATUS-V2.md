# DI-002 Advanced Table — V2 Review Candidate

Status: ENGLISH_REVIEW_CANDIDATE · NOT YET QUESTION STUDIO ENABLED

## Why V2 exists

The original DI-002 engine remains in place for regression, but its learner surface is too narrow for final common-exam closure:

- only 5 task families
- no Easy questions
- generic Branch A–E rows
- one stem surface per task family
- repeated shortcut/trap explanation fields
- decimal percentage surfaces in some routes
- no permanent review-Ql map or controlled Question Studio path

V2 keeps the exact table arithmetic foundation and rebuilds the learner/content layer separately.

## V2 learner contract

- advanced four-column table: row label, Applicants, Selected, Selection %
- exactly one Applicants entry hidden and recoverable from the same row
- five linked questions per set
- exact difficulty mix: 1 Easy + 2 Medium + 2 Hard
- 12 task families
- three stem surfaces per task family
- six neutral scenario families
- 60+ row-label objects across those scenarios
- SSC CGL Tier I: 4 options
- Banking Prelims: 5 options
- misconception-owned distractors
- simple question-specific explanations
- Hard questions use at least three worked steps
- working tables are included where they improve clarity
- no forced shortcut/trap sections
- learner-facing percentage answers use whole percentages; questions explicitly say nearest whole percent when rounding is required
- no local city names

## Task families

Easy:
1. DIRECT_SELECTED_VALUE
2. DIRECT_SELECTION_RATE

Medium:
3. MISSING_APPLICANTS_FROM_RATE
4. REJECTED_COUNT
5. SELECTED_DIFFERENCE
6. COMBINED_SELECTED
7. SELECTION_RATE_POINT_GAP
8. SELECTED_SHARE_OF_TOTAL

Hard:
9. COMBINED_SELECTED_RATIO
10. RELATIVE_SELECTED_PERCENT_EXCESS
11. COMBINED_SELECTION_RATE
12. REJECTED_TO_SELECTED_RATIO

## Scenario variety

- recruitment centres
- training batches
- departments
- service units
- scholarship zones
- branch recruitment

## Candidate QL reservation

- DI-QL-097 through DI-QL-108
- one review QL per V2 task family
- editorial status: ENGLISH_REVIEW_PENDING
- localization status: NOT_STARTED

These IDs are reserved only inside the V2 review branch until approval.

## Verification gates

The V2 stress test is designed to cover:

- 240 deterministic seeds × 2 exam profiles
- 480 linked sets / 2,400 questions
- independent answer recomputation for every question
- deterministic replay
- all 12 task families
- all 6 scenario families
- all three stem surfaces for every task family
- all four SSC answer positions and all five Banking answer positions
- profile-specific unique option counts
- exact 1 Easy + 2 Medium + 2 Hard set balance
- no decimal percentage answers
- no forced shortcut/trap explanation fields
- no learner-stem use of the mechanical word "associated"
- lifecycle locks

## Lifecycle

- reviewStatus: ENGLISH_REVIEW_CANDIDATE
- Question Studio discoverable: false
- Question Bank: NOT_STORED
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false
- automatic student publication: false
- production release authorized: false

Approval is still required before permanent ownership promotion, Question Studio controlled-review routing, localization, or any wider lifecycle change.
