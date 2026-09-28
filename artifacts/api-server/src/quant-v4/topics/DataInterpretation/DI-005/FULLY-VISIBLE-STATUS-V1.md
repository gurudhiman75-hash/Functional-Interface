# DI-005 Fully-Visible Pie — Exhaustiveness Retrofit V1

Status: ENGLISH_REVIEW_CANDIDATE · ADDITIVE MODE

## Why this exists
The approved DI-005 V2 authority always hides one pie-sector percentage. That is useful for missing-sector DI but does not cover ordinary fully-labelled pie charts.

This retrofit adds a separate fully-visible canonical mode without changing the approved hidden-sector QLs or localization authority.

## Learner contract
- five sectors
- all five percentages printed
- percentages sum to 100
- total count/value visible
- shared DI pie renderer
- no hidden question mark
- 5 linked questions
- exact difficulty mix: 1 Easy + 2 Medium + 2 Hard
- SSC CGL Tier I: 4 options
- Banking Prelims: 5 options
- whole-number / exact answers only

## Task families
Easy:
- DIRECT_SECTOR_PERCENT
- LARGEST_SECTOR_IDENTIFICATION
- SMALLEST_SECTOR_IDENTIFICATION

Medium:
- SECTOR_ANGLE_DEGREES
- SECTOR_COUNT_FROM_TOTAL
- COMBINED_SECTOR_PERCENT
- DIFFERENCE_IN_COUNTS

Hard:
- RATIO_OF_TWO_SECTORS
- RELATIVE_SECTOR_PERCENT_EXCESS
- COMBINED_SECTOR_ANGLE
- REMAINDER_AFTER_TWO_SECTORS_COUNT

MISSING_SECTOR_PERCENT intentionally remains owned by the existing hidden-sector mode.

## Lifecycle
- review-only additive mode
- no change to existing DI-005 permanent QLs
- no Question Bank writes
- no test/mock eligibility
- no public/student publication
- no production release
- English only until human review/localization
