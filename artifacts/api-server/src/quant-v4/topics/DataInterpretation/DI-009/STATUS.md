# DI-009 Histogram — Original DI Architecture Alignment

`REVIEW_ONLY_ARCHITECTURE_V6` — DI-009 now follows the same data-first architecture as the original DI packages. The question generator stores semantic histogram data only; SVG/presentation markup is generated separately by the shared Data Interpretation visual layer.

## Architecture contract

- Question logic remains `DI-009-QUESTION-LOGIC-V2`.
- Set/stimulus contract is `DI-009-SET-CONTRACT-V3`.
- Presentation authority is `DATA_INTERPRETATION_SHARED_VISUALS`.
- `Di009Stimulus` contains title, instruction, bins, class width, distribution shape, axis labels and unit only.
- No SVG or other presentation markup is stored in the question set.
- Review exports call `DataInterpretation/visuals/histogram-svg.ts` at presentation time.
- This mirrors the original DI-003/DI-004 pattern where the generator owns semantic chart data rather than a bespoke renderer payload.

## Question engine retained

The approved V2 content engine is unchanged:
- 13 histogram task families
- 5-question mixed sets
- 1 Easy + 2 Medium + 2 Hard
- 5–9 continuous equal-width classes
- six controlled distribution shapes
- cumulative-frequency, grouped mean and grouped mode reasoning
- misconception-owned distractors
- beginner-readable question-specific explanations

## Shared histogram presentation checkpoint

The current accepted-for-now histogram presentation remains in the shared visual layer rather than the question generator:
- balanced multicolour contiguous bars
- horizontal reading guides
- one horizontal baseline
- no vertical y-axis spine
- no y-axis tick lines
- no downward class-boundary ticks
- centered class-interval labels
- headroom above tallest bar
- no bar-value labels

This visual is not considered permanently frozen; future DI-family styling changes can now happen in one presentation layer without mutating question semantics.

## Proof

The dedicated gate retains the 240-set / 1,200-question deterministic and independent-verification matrix and separately validates the shared renderer. It also asserts that semantic stimuli do not contain an `svg` property.

DI-009 remains unmerged/unpromoted. Question Studio discovery, Question Bank writes, test/mock eligibility, automatic publication and public publication remain disabled.
