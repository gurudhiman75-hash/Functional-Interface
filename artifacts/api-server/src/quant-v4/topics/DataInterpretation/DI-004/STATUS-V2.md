# DI-004 Line Graph — V2 Review Candidate

Status: ENGLISH_REVIEW_APPROVED · QUESTION STUDIO CONTROLLED REVIEW

## Why V2 exists

The original DI-004 Phase-3 line engine is retained for regression, but it is too narrow for final exam-ready closure:

- only 5 task families;
- no Easy layer;
- one fixed Region A / Region B scenario;
- one stem surface per family;
- decimal-capable percentage/average answers;
- forced shortcut/trap explanation fields;
- no permanent Question Studio ownership.

V2 rebuilds the learner/content layer without mutating the old regression engine.

## V2 learner contract

- genuine two-series line graph with six plotted periods;
- 5 linked questions per generated set;
- exact difficulty mix: 1 Easy + 2 Medium + 2 Hard;
- 12 task families;
- 3 stem surfaces per family;
- 6 neutral scenario families;
- 72 configured series pairs / 144 entity labels;
- SSC CGL Tier I: 4 options;
- Banking Prelims: 5 options;
- integer plotted values;
- percentage answers rounded to the nearest whole percent with explicit wording;
- three-period averages shown to the nearest whole number with explicit wording;
- simple question-specific explanations;
- working tables where they improve multi-step clarity;
- no forced shortcut/trap boilerplate;
- no local city-name pool;
- misconception-owned distractors.

## Task families

Easy:
1. CROSS_SERIES_DIFFERENCE
2. COMBINED_PERIOD_TOTAL

Medium:
3. FIRST_OVERTAKE_PERIOD
4. CLOSEST_LINES_PERIOD
5. THREE_PERIOD_AVERAGE
6. CONSECUTIVE_PERCENT_INCREASE
7. TWO_PERIOD_SERIES_RATIO
8. TWO_PERIOD_COMBINED_TOTAL

Hard:
9. TOTAL_SERIES_RATIO
10. COMBINED_PERIOD_PERCENT_EXCESS
11. TOTAL_SERIES_PERCENT_EXCESS
12. THREE_VS_THREE_RATIO

## Scenario variety

- annual sales;
- annual production;
- monthly orders;
- annual enrolment;
- annual exports;
- monthly passengers.

Each scenario family contains 12 neutral series pairs. Period schemes vary between annual and monthly forms.

## Review QL reservation

DI-QL-109 through DI-QL-120 are reserved for the 12 V2 semantic families.

These are review coordinates only until human approval. They do not yet widen lifecycle authority.

## Verification gates

The V2 stress gate covers:

- 240 deterministic seeds × 2 exam profiles;
- 480 linked sets / 2,400 questions;
- independent answer recomputation;
- deterministic replay;
- all 12 task families;
- all 6 scenario families;
- broad series-pair exercise against the 72-pair pool;
- all three stem surfaces for every family;
- all four SSC answer positions and all five Banking answer positions;
- profile-specific unique option counts;
- exact 1 Easy + 2 Medium + 2 Hard set balance;
- no decimal percentage answers;
- no forced shortcut/trap fields;
- non-trivial ratio guards;
- non-zero rounded total-series percentage excess;
- lifecycle locks.

## Lifecycle

- reviewStatus: ENGLISH_REVIEW_APPROVED
- Question Studio discoverable: true
- Question Bank: NOT_STORED
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false
- automatic student publication: false
- production release authorized: false
- localization: not started

English ownership is approved and Question Studio controlled review is enabled. Localization remains a separate approval gate; Question Bank, tests, mocks and public release remain locked.
