# DI-011 Mixed / Multi-Chart DI — V1 Review Candidate

Status: ENGLISH_REVIEW_CANDIDATE · CONTROLLED_REVIEW

## Purpose
DI-011 closes the highest-priority exhaustiveness gap found after auditing DI-001 through DI-010: genuine questions that require reading and combining two learner-facing representations in one linked set.

## Representation families
1. BAR_TABLE
2. LINE_TABLE
3. PIE_TABLE
4. BAR_LINE
5. TWO_TABLE_JOIN

The second component is not decorative. Question families deliberately require values from both displays.

## Question families
Easy:
- SAME_CATEGORY_COMBINED_TOTAL
- SAME_CATEGORY_ABSOLUTE_DIFFERENCE

Medium:
- LEFT_TO_RIGHT_RATIO
- TWO_CATEGORY_CROSS_SUM
- HIGHEST_COMBINED_CATEGORY
- CROSS_COMPONENT_AVERAGE

Hard:
- TWO_GROUP_CROSS_RATIO
- TWO_GROUP_COMBINED_DIFFERENCE
- THREE_CATEGORY_CROSS_TOTAL
- FOUR_VALUE_CROSS_AVERAGE

Each generated set contains exactly 1 Easy + 2 Medium + 2 Hard questions.

## Exam profiles
- Banking Prelims
- Banking Mains

V1 focuses on banking because mixed/multi-chart DI was identified as a material Banking Mains coverage gap. SSC's core representation families remain owned by DI-001 through DI-010.

## Learner-visible answerability
- semantic state remains presentation-independent
- mixed stimulus is rendered as a single two-panel SVG
- tables show all required values
- bars show exact values
- line points show exact values
- pie sectors show visible percentage labels
- no learner answer depends on hidden semantic-only data

## Verification
The V1 stress proof generates 300 deterministic sets / 1,500 linked questions and requires:
- deterministic replay
- all 5 representation-pair families
- all 10 task families
- exact 1 Easy + 2 Medium + 2 Hard balance
- five unique options
- correct-index parity
- no decimal answers
- learner-visible categories and values in the rendered stimulus

## Lifecycle
- Question Studio discoverable: true
- Question Studio mode: CONTROLLED_REVIEW
- English only in V1
- Question Bank: NOT_STORED
- writes disabled
- tests/mocks: INELIGIBLE
- public/student publication: disabled
- production release: not authorized
- manual approval required

Localization and production promotion are separate future gates.
