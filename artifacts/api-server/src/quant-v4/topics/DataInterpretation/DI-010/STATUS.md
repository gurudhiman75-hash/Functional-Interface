# DI-010 Frequency Polygon — P2 Status

`REVIEW_ONLY_P2_QUESTION_QUALITY` — the diagram direction is retained; the question engine has been rebuilt again after the P0 review rejected question quality.

## Diagram status

The accepted diagram system is unchanged:

- semantic-only frequency-polygon stimulus; no SVG stored in question data
- shared presentation renderer: `DataInterpretation/visuals/frequency-polygon-svg.ts`
- genuine class-mark points joined by straight segments
- zero-frequency closing endpoints one class width outside the first/last class mark
- endpoint x-coordinate labels intentionally omitted from the student stimulus
- 5–8 equal-width continuous classes
- six controlled distribution shapes

## P2 question architecture

P2 removes the mechanical feel of the earlier question layer. Direct coordinate drills and repetitive textbook wording are not part of the active task library. Questions now use natural context wherever the data context supports it and include interpretation, range aggregation, percentages, ratios, representation conversion and grouped-data reasoning.

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

Each generated set contains five distinct families with exactly 1 Easy + 2 Medium + 2 Hard.

## P2 quality rules

- context-first exam wording
- no direct coordinate-recovery drill
- no direct "find the class mark" drill
- no concatenated interval strings such as `30–40–40–50`
- histogram ↔ frequency-polygon representation conversion retained
- misconception-owned distractors
- grouped mean and median-class explanations include working tables
- independent answer verifier
- deterministic/diversity/shared-renderer proof

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

No permanent QLs are allocated. Promotion requires explicit human approval of the P2 questions. The diagram direction remains accepted.
