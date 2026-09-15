# DI-010 Frequency Polygon — P1 Status

`REVIEW_ONLY_P1_QUESTION_REWORK` — diagram direction retained; question engine rebuilt after human review rejected P0 question quality.

## What stays

- semantic-only frequency-polygon stimulus; no SVG stored in question data
- shared presentation renderer: `DataInterpretation/visuals/frequency-polygon-svg.ts`
- genuine class-mark points joined by straight segments
- zero-frequency closing endpoints one class width outside the first/last class mark
- endpoint x-coordinate labels intentionally omitted from the student stimulus
- 5–8 equal-width continuous classes
- six controlled distribution shapes

## P1 question architecture

P0 overused mechanical prompts such as direct coordinate recovery, direct class-mark calculation and generic frequency arithmetic. P1 replaces that question layer while leaving the diagram system unchanged.

P1 has 13 task families:

### Easy
1. `CONSTRUCTION_PROPERTY`
2. `READ_CLASS_FREQUENCY_CONTEXT`
3. `MODAL_CLASS_FROM_POLYGON`
4. `CLASS_INTERVAL_FROM_MARK`

### Medium
5. `TOTAL_FREQUENCY_FROM_POLYGON`
6. `CONSECUTIVE_RANGE_TOTAL_CONTEXT`
7. `FREQUENCY_DIFFERENCE_CONTEXT`
8. `CLASS_SHARE_OF_TOTAL`
9. `HISTOGRAM_BAR_HEIGHT_FROM_POLYGON`

### Hard
10. `ZERO_CLOSING_ENDPOINTS`
11. `RANGE_RATIO_FROM_POLYGON`
12. `GROUPED_MEAN_FROM_POLYGON`
13. `MEDIAN_CLASS_FROM_POLYGON`

Each set still emits exactly 5 distinct families with 1 Easy + 2 Medium + 2 Hard, but the hard layer now requires genuine construction or grouped-data reasoning rather than relabelling simple arithmetic as Hard.

## Quality rules

- context-first exam wording where the context supports it
- representation-conversion questions between frequency polygon and histogram
- direct coordinate/class-mark drills removed from the production mix
- misconception-owned distractors
- beginner-readable explanations
- grouped mean and median-class explanations include working tables
- independent answer verifier
- deterministic/diversity/shared-renderer proof
- standalone Markdown and HTML review exports

## Lifecycle locks

- `questionStudioDiscoverable: false`
- `questionBankStatus: NOT_STORED`
- `questionBankWritable: false`
- `testEligibility: INELIGIBLE`
- `testEligible: false`
- `mockTestEligible: false`
- `publiclyPublishable: false`
- `automaticStudentPublication: false`
- `productionReleaseAuthorized: false`

No permanent QLs are allocated. Promotion requires explicit human approval of the P1 generated questions. The diagram direction is retained from the accepted review.
