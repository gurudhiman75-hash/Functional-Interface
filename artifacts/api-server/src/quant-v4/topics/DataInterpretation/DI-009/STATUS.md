# DI-009 Histogram — V4 Visual Review Status

## State

`REVIEW_ONLY_V4_VISUAL` — the question engine remains review-only. V4 is a renderer micro-audit and restrained color-system pass; Question Studio discovery, Question Bank writes, test/mock eligibility and public publication remain disabled.

## Why V4 exists

V3 established the approved premium histogram direction. Human review then exposed a geometry defect: the first class-boundary tick shared the y-axis x-position and extended below the baseline, making the vertical axis appear out of position. A wider micro-audit found several smaller visual issues worth fixing at source rather than patching the HTML.

## V4 renderer corrections

- The y-axis itself owns the left class boundary; there is no duplicate downward `boundary-tick=0`.
- The zero-level gridline is removed so it cannot double-thicken the x-axis baseline.
- The x-axis explicitly owns the baseline.
- Y-axis tick marks are separate from horizontal gridlines.
- If the maximum frequency lands exactly on a rounded y-axis maximum, one additional tick interval is added so the tallest bar has visual headroom instead of touching the chart ceiling.
- Serialized bar boundary coordinates are rounded once and shared by adjacent bars, preventing microscopic gaps or overlaps caused by independent coordinate rounding.
- Decorative white bar-top highlight lines are removed so perceived bar height is not visually shifted.
- Centered interval labels and continuous histogram geometry are retained.

## V4 color system

`EXAMTREE_BLUE_SINGLE_SERIES` uses one restrained blue family for all bars. Bars do not receive separate category colors because a histogram is one continuous frequency distribution, not multiple categorical series.

- pale blue plotting region
- light blue bar fill
- deeper blue bar outline and axes
- muted blue-grey grid/tick text
- dark navy title and axis labels

The palette is designed to remain readable on screen and acceptable in print without becoming infographic-like.

## Content contract retained

The 13 histogram task families, 5-question mixed sets, 5–9 continuous class intervals, six controlled distribution shapes, misconception-owned distractors and beginner-readable explanations are unchanged.

## V4 proof gate

The full 240-set / 1,200-question deterministic and independent-verification matrix remains mandatory. V4 additionally asserts the V4 theme/color contract, explicit x/y axis ownership, no duplicate left boundary tick, no decorative bar-top line, y-axis tick/grid quality, exact serialized adjacency between neighboring bars, positive visual headroom, responsive/accessibility metadata and no bar-value leakage.

## Next gate

Run the dedicated V4 workflow and review its exact CI-generated HTML artifact. DI-009 remains unmerged/unpromoted until that final visual checkpoint is accepted.
