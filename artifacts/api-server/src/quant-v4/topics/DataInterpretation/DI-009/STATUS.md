# DI-009 — Histogram

Status: `PHASE0_HUMAN_REVIEW_REQUIRED`

## Why this package exists

The common SSC Mathematical Abilities syllabus explicitly includes histograms. Existing DI packages own tables, grouped bars, line charts, pie charts, caselets and arithmetic/missing DI, but none owns the semantics of a continuous histogram with touching class intervals.

`DI-009` therefore owns the **histogram representation layer**. It does not replace `STAT-003`, which remains the semantic authority for grouped-frequency central-tendency mathematics.

## Real-paper anchors

The Phase-0 contract is grounded in SSC forms that include:
- reading and aggregating frequencies from histogram rectangles;
- forming a ratio across two multi-class ranges (SSC CGL 2021 Tier-I, held 11 Apr 2022 Shift 1);
- interpreting a histogram as the source for grouped-frequency calculations;
- deriving frequency-polygon structure from histogram classes, which remains reserved for planned sibling `DI-010` rather than duplicated here.

## Phase-0 task families

1. `DIRECT_CLASS_FREQUENCY` — read one class frequency from its rectangle height;
2. `COMBINED_RANGE_TOTAL` — add frequencies across a contiguous range;
3. `RANGE_RATIO` — compare totals from two histogram ranges;
4. `CLASS_SHARE_OF_TOTAL` — selected class as a percentage of all observations;
5. `MODAL_CLASS_IDENTIFICATION` — identify the tallest rectangle / modal class;
6. `APPROX_GROUPED_MEAN_FROM_HISTOGRAM` — extract frequencies from the histogram and apply class-mark weighting, while `STAT-003` remains the underlying grouped-mean mathematical authority.

## Visual contract

- exactly six contiguous equal-width class intervals in Phase 0;
- rectangle bases touch: no categorical gaps as in an ordinary bar chart;
- x-axis uses numerical class boundaries;
- y-axis is frequency, never cumulative frequency;
- generated SVG is part of the review stimulus and is derived from the same certified bin state used by the solver;
- no tilted, decorative or out-of-scale geometry.

## Difficulty

- **Easy:** direct frequency and modal class;
- **Medium:** range total, range ratio, class share;
- **Hard:** approximate grouped mean requiring both visual extraction and weighted-frequency calculation.

## Explicit exclusions

- unequal-width histogram/frequency-density theory;
- cumulative-frequency ogives;
- frequency-polygon construction and endpoint questions (`DI-010` planned);
- grouped median/mode formula work already owned by `STAT-003`;
- advanced JSO descriptive-statistics theory.

## Lifecycle

- English human review required;
- Question Studio discoverable: false;
- Question Bank: `NOT_STORED`;
- tests/mocks: ineligible;
- public/automatic publication: false.
