# TMW-CP-010 Editorial Review

**Sample:** 18 QLs × 3 mathematically distinct states = 54 candidate questions  
**Language:** English  
**Publication:** disabled

## Learner contract

Every question contains:

1. a realistic institutional tank, reservoir, pump or maintenance setting;
2. an explicit initial level and target boundary or final-state target;
3. an unambiguous event order, cycle order or controller rule;
4. a plain-English stage/cycle rule;
5. literal inline MathJax;
6. complete stage-ledger or cycle-remainder working;
7. a solve-mode-specific 10-second shortcut;
8. an actual-option diagnostic trap without learner-facing internal IDs;
9. a contextual conclusion.

## Editorial decisions

- opening, closing, leak-start and repair events name the actual affected pipe;
- idle intervals are stated as zero-flow elapsed time;
- cycle segments are numbered and punctuated consistently;
- arbitrary-phase questions state the exact part from which the schedule begins;
- partial levels, thresholds and controller marks use canonical MathJax fractions;
- non-integer time options use proper mixed/improper MathJax forms;
- event-time inverses identify whether `x` is the first-stage time;
- deadline-adjustment answers always include “earlier” or “later”;
- signed expressions never contain `+-`, subtraction of a negative, or repeated equalities;
- physical-flow capacity solutions multiply each flow by its duration before adding volumes;
- terminal-segment options do not include a second wording that is also true at an exact cycle boundary;
- diagnostic trap prose explains how the displayed wrong option arises and never says “Do not choose”.

## Manual-review corrections after the first green proof

Manual review corrected:

- generated inverse states that could imply a level above one full tank;
- awkward capability-to-schedule grammar;
- vague “scheduled pipe” event wording;
- `+-` signed-rate expressions;
- duplicated labels such as “First, First interval”;
- negative remaining-level wording for empty targets;
- exact cycle-end semantic overlap in terminal-segment options;
- excessive routine cycle counts;
- ambiguous deadline-adjustment magnitudes without direction;
- oversized or unit-inappropriate flow-rate distractors;
- redundant capacity equalities.

## Current verdict

The English generator is ready for exact-head repository CI and hosted-artifact review. It remains a candidate generator only.
