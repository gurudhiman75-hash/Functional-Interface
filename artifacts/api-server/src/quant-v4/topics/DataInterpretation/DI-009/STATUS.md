# DI-009 Histogram — V3 Visual Review Status

## State

`REVIEW_ONLY_V3_VISUAL` — the V3 diagram direction is approved, but DI-009 remains review-only: not Question Studio discoverable, not Question Bank writable, and not eligible for tests/mocks/publication.

## What V3 changes

V2 fixed question depth and repetition. V3 keeps that question logic intact and replaces the plain histogram renderer with the approved ExamTree DI visual system.

### Approved visual contract

- `EXAMTREE_DI_WORLD_CLASS_V3` renderer marker.
- Crisp responsive 900×480 SVG with `preserveAspectRatio` and geometric precision.
- Clean plotting region and restrained neutral DI palette.
- Light horizontal reading guides with rounded/nice y-axis steps.
- Stronger axis hierarchy and typography.
- Physically contiguous histogram rectangles; no category-style gaps.
- One centered class-interval label beneath each bar.
- Boundary ticks retained so continuous-class structure stays visually explicit.
- No value labels above bars, preventing answer leakage.
- SVG `<title>` and `<desc>` metadata for accessibility.
- Review HTML uses a premium but restrained chart panel that remains mobile-scrollable and print-safe.

## V2 content contract retained (13)

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

## Set construction retained

- Exactly 5 questions per set.
- Structural mix: 1 Easy + 2 Medium + 2 Hard.
- Deterministically shuffled task order.
- 5–9 continuous equal-width classes.
- Six controlled distribution shapes.
- Student/review stimulus does not show a fallback frequency table.

## V3 proof gate

The existing 240-set / 1,200-question deterministic and independent-verification matrix remains mandatory. V3 adds renderer regression checks for:

- V3 visual-theme marker
- responsive SVG metadata
- plot-area marker
- minimum y-gridline count
- one interval label per class
- all class-boundary ticks
- SVG title/description accessibility metadata
- no bar-value answer leakage

## Next gate

Run the dedicated DI-009 V3 workflow and inspect the CI-generated standalone HTML. Only after the full DI-009 package is explicitly approved should permanent review authority / Question Studio integration or merge to `New-main` occur.
