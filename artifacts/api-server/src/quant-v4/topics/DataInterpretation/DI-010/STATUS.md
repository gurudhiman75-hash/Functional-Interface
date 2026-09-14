# DI-010 Frequency Polygon — P0 Status

`REVIEW_ONLY_P0` — implemented for human review; not promoted.

## Implemented

- semantic-only frequency-polygon stimulus; no SVG stored in question data
- shared presentation renderer: `DataInterpretation/visuals/frequency-polygon-svg.ts`
- genuine class-mark points joined by straight segments
- zero-frequency closing endpoints one class width outside the first/last class mark
- endpoint x-coordinate labels intentionally omitted from the student stimulus
- 5–8 equal-width continuous classes
- six controlled distribution shapes
- 9 task families
- deterministic 5-question sets with 1 Easy + 2 Medium + 2 Hard
- misconception-owned distractors
- beginner-readable question-specific explanations
- independent answer verifier
- deterministic/diversity/shared-renderer proof
- standalone Markdown and HTML review exports

## P0 task families

1. `GRAPH_TYPE_IDENTIFICATION`
2. `CLASS_MARK_FROM_INTERVAL`
3. `POINT_COORDINATE_FOR_CLASS`
4. `READ_FREQUENCY_AT_CLASS_MARK`
5. `ZERO_CLOSING_ENDPOINTS`
6. `TOTAL_FREQUENCY_FROM_POLYGON`
7. `MODAL_CLASS_FROM_POLYGON`
8. `FREQUENCY_DIFFERENCE_BETWEEN_CLASSES`
9. `COMBINED_RANGE_TOTAL_FROM_POLYGON`

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

No permanent QLs are allocated at P0. Promotion requires explicit human approval of both generated questions and the shared frequency-polygon visual.
