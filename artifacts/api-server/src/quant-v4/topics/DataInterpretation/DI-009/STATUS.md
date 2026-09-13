# DI-009 Histogram — V2 Review Status

## State

`REVIEW_ONLY_V2` — not approved, not merged, not Question Studio discoverable, not Question Bank writable, and not eligible for tests/mocks/publication.

## Why V2 exists

P0 was mathematically correct but too repetitive: six fixed questions, one fixed six-class shape, and frequency states that could look mechanically shuffled. V2 replaces that review surface instead of promoting it.

## V2 contract library (13)

1. Direct class frequency
2. Total frequency
3. Combined contiguous-range total
4. Frequency at/above a boundary
5. Cumulative frequency below a boundary
6. Ratio of two grouped histogram ranges
7. One class as a percentage of total frequency
8. Difference between two class frequencies
9. Modal-class identification
10. Median-class identification from cumulative frequency
11. Class containing a specified kth observation
12. Approximate grouped mean using class marks
13. Approximate grouped mode using neighbouring frequencies

## Set construction

- Exactly 5 questions per set, not all contracts every time.
- Structural mix: 1 Easy + 2 Medium + 2 Hard.
- Task order is deterministically shuffled.
- 5, 6, 7, 8 or 9 continuous equal-width classes.
- Six controlled distribution shapes: `UNIMODAL`, `RIGHT_SKEWED`, `LEFT_SKEWED`, `ASCENDING`, `DESCENDING`, `CONTROLLED_IRREGULAR`.
- Histogram rectangles physically touch in SVG; axes use readable rounded tick steps.
- Student/review question surface does not show a fallback frequency table beside the histogram.
- Mean/median/kth/mode explanations may use compact working tables because those tables explain the calculation rather than reveal the stimulus.

## Language / explanation quality

- Multiple stem surfaces per contract.
- No generic shortcut/trap filler.
- No `associated` boilerplate.
- Explanations are question-specific and beginner-readable.
- Distractors carry misconception ids and derivations.

## Proof gate

Offline exact TypeScript mirror before push:

- 2 SSC profiles
- 120 deterministic seeds per profile
- 240 generated sets
- 1,200 questions
- 240 deterministic replay checks
- 240 independent-verifier checks
- 4,800 option checks
- all 13 task families exercised in each profile
- A/B/C/D correct-position coverage for every task family in each profile
- at least 3 stem surfaces exercised for every task family in each profile
- all six distribution shapes exercised in each profile
- all class counts 5–9 exercised in each profile
- at least 70 distinct five-question order signatures per profile

GitHub CI must reproduce these gates before this checkpoint can be considered review-ready.

## Next gate

Human review of the generated V2 HTML/Markdown pack. Only after explicit approval should DI-009 receive permanent review authority / Question Studio integration or merge to `New-main`.
