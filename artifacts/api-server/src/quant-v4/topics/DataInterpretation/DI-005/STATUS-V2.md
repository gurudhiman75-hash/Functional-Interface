# DI-005 Pie Chart — V2 Review Candidate

Status: REVIEW-ONLY IMPLEMENTATION

## Why V2 exists
The original DI-005 Phase-4 engine is retained for regression, but it is too narrow for final common-exam closure: five task families only, no Easy questions, one fixed student/course context, and explanation contracts that force shortcut/trap boilerplate.

V2 is a separate review candidate and does not widen lifecycle authority.

## V2 learner contract
- representation: genuine pie chart
- five sectors per shared stimulus
- one percentage label hidden as `?`
- exact shares totaling 100%
- exact central angles totaling 360°
- visible total count/value
- semantic question state only; SVG is presentation-only
- 5 linked questions per set
- exact difficulty mix: 1 Easy + 2 Medium + 2 Hard
- SSC CGL Tier I: 4 options
- Banking Prelims: 5 options
- simple question-specific explanations
- no forced shortcut/trap sections
- misconception-owned distractors

## Task families
Easy:
1. DIRECT_SECTOR_PERCENT
2. LARGEST_SECTOR_IDENTIFICATION
3. SMALLEST_SECTOR_IDENTIFICATION

Medium:
4. MISSING_SECTOR_PERCENT
5. SECTOR_ANGLE_DEGREES
6. SECTOR_COUNT_FROM_TOTAL
7. COMBINED_SECTOR_PERCENT
8. DIFFERENCE_IN_COUNTS

Hard:
9. RATIO_OF_TWO_SECTORS
10. RELATIVE_SECTOR_PERCENT_EXCESS
11. COMBINED_SECTOR_ANGLE
12. REMAINDER_AFTER_TWO_SECTORS_COUNT

## Variety
Neutral contexts include course enrolment, books by category, department staff, product output, sports participation and order categories. No local city names are used.

Five distinct percentage partitions are used, each with five unique shares in multiples of 5%, preserving exact integer angles and unambiguous largest/smallest sectors.

## Presentation
Shared renderer:
`DataInterpretation/visuals/pie-svg.ts`

Theme:
`EXAMTREE_DI_PIE_CLEAN_V1`

The generated `Di005V2Stimulus` contains no SVG payload. Review HTML renders the semantic stimulus only at presentation/export time.

## Lifecycle
- reviewStatus: UNREVIEWED
- Question Studio discoverable: false
- Question Bank: NOT_STORED
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false
- automatic student publication: false
- production release authorized: false
- permanent QLs: not allocated

Promotion is blocked until human review and explicit approval.
