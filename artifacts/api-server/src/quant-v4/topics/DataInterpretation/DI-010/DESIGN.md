# DI-010 — Frequency Polygon P0 Design

## Goal

Add genuine frequency-polygon capability as the next Data Interpretation package after DI-009 Histogram, while preserving the original DI data-first architecture: semantic grouped-frequency data in the question engine and presentation-only SVG in the shared DI visual layer.

## Exam anchors

The P0 contract is anchored to verified previous-paper representations:

- SSC MTS 2020, held 12 Oct 2021 Shift 2: identifies the line graph that can replace a histogram as a frequency polygon.
- SSC CGL 2021 Tier-I, held 20 Apr 2022 Shift 2: converts a histogram to a line diagram and requires zero-frequency closing endpoints one class width outside the first and last class marks; the paper answer is `(117.5, 0)` and `(172.5, 0)` for the shown state.
- Punjab Police Constable, held 25 Sep 2021: identifies a grouped-frequency figure as a frequency polygon.
- SSC CGL 2024 Tier-II Statistics Paper-II, held 19 Jan 2025: tests frequency-polygon construction properties, including equal-width class intervals and plotting frequency against class midpoints.

## Semantic stimulus

`Di010Stimulus` will contain no SVG. It will own only:

- `kind: "FREQUENCY_POLYGON"`
- title and instruction
- continuous equal-width class intervals
- frequencies
- class width
- distribution shape
- x/y axis labels and unit
- derived class marks

The shared renderer will derive polygon points as `(class mark, frequency)` and zero-frequency closing points at one class width before/after the first/last class mark.

## P0 task library

1. `GRAPH_TYPE_IDENTIFICATION` — identify a frequency polygon and distinguish it from histogram/ogive/bar graph.
2. `CLASS_MARK_FROM_INTERVAL` — calculate the midpoint used on the x-axis for a class interval.
3. `POINT_COORDINATE_FOR_CLASS` — recover `(class mark, frequency)` for a named class.
4. `READ_FREQUENCY_AT_CLASS_MARK` — read the frequency represented by a plotted class-mark point.
5. `ZERO_CLOSING_ENDPOINTS` — calculate the two zero-frequency endpoints used to close the polygon.
6. `TOTAL_FREQUENCY_FROM_POLYGON` — add the plotted frequencies.
7. `MODAL_CLASS_FROM_POLYGON` — identify the class interval corresponding to the highest point.
8. `FREQUENCY_DIFFERENCE_BETWEEN_CLASSES` — compare two plotted class frequencies.
9. `COMBINED_RANGE_TOTAL_FROM_POLYGON` — aggregate frequencies across consecutive classes.

## Difficulty policy

Easy:
- graph type identification
- class mark from interval
- read frequency at class mark
- modal class

Medium:
- point coordinate for class
- total frequency
- frequency difference

Hard:
- zero closing endpoints
- combined range total

Each P0 set will emit five distinct families with exactly 1 Easy + 2 Medium + 2 Hard and deterministic ordering.

## Visual contract

Create `DataInterpretation/visuals/frequency-polygon-svg.ts` rather than embedding SVG in DI-010.

Renderer requirements:
- connected straight segments through class-mark points
- zero-frequency closing points one class width outside the data range
- no smoothing/spline curves
- no cumulative-frequency/ogive semantics
- horizontal reading guides
- clean original-DI proportions and typography
- class marks on the x-axis
- no printed frequency value labels that leak answers
- endpoints may be drawn but their x-coordinate labels are omitted so endpoint-construction questions still require calculation
- responsive and accessible SVG metadata

## Distractors

Every distractor must own a misconception, e.g.:
- using class boundaries instead of class marks
- swapping x/y coordinates
- using half a class width instead of a full class width for closure
- closing at the first/last class mark instead of one class width outside
- using a neighboring point's frequency
- confusing frequency polygon with ogive/cumulative frequency

## Explanations

Explanations must be short, beginner-readable and question-specific. Construction questions should explicitly show:

`class mark = (lower limit + upper limit) / 2`

and for closure:

`left endpoint = first class mark - class width`, `right endpoint = last class mark + class width`, both with frequency `0`.

## Lifecycle

P0 is review-only:
- Question Studio discovery: false
- Question Bank: not stored / not writable
- test/mock eligibility: false
- public publication: false
- automatic student publication: false
- production release authorization: false

Promotion is forbidden until generated questions and the shared polygon visual are explicitly reviewed and approved.
