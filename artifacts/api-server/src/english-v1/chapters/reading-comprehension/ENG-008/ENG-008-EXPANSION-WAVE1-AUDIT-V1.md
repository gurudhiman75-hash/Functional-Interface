# ENG-008 — Breadth Expansion Wave 1 — Audit V1

Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`

## Purpose

Expand the existing ENG-008 Reading Comprehension library without creating new checkpoint taxonomy or changing any approved question-family contracts.

All new learner-facing passage text is original Examtree-authored material. Real exam evidence informs profile, length, question mix and difficulty behaviour only.

## Wave 1 additions

| Profile | Existing passages | Added | Candidate total | New governed questions |
|---|---:|---:|---:|---:|
| CP001 SSC Foundation | 8 | 2 | 10 | 12 |
| CP002 SSC Editorial / Current Affairs | 12 | 2 | 14 | 16 |
| CP003 Banking Prelims | 8 | 2 | 10 | 18 |
| CP004 Banking Mains | 8 | 2 | 10 | 20 |
| CP005 Research / Survey | 6 | 2 | 8 | 16 |
| CP007 Banking Prelims word-fit supplements | 8 | 2 | 10 | 2 |

Total new passages: **10**  
Total new governed authorities: **84** including the two BP-F10 supplements.\n\nPost-recalibration runtime distributions:\n- SSC Foundation: **183–217 words**, average **205**;\n- SSC Editorial / Current Affairs: **225–262 words**, average **241**;\n- Banking Prelims: **352–383 words**, average **367**.

## New passage breadth

### SSC Foundation
- narrative: lost/borrowed property and responsible action;
- report: clinic registration queue/process improvement.

### SSC Editorial / Current Affairs
- inclusive digital public-service design;
- reflective school-roof cooling pilot.

### Banking Prelims
- narrative: adapting a study plan after forgetting a library card;
- science/public-interest: measuring traffic noise around a hospital.

Both new Banking Prelims passages receive a tenth contextual word-fit authority through CP007.

### Banking Mains
- business/consumer choice: subscription discounts and commitment costs;
- health/service measurement: why averages can hide extreme waits.

### Research / Survey
- transport information: real-time bus arrival displays;
- digital learning: video explanations vs worked examples.

## Contract checks

- CP001: 6 families per added passage.
- CP002: 8 families per added passage.
- CP003: 9 CP003 families + 1 CP007 BP-F10 supplement per added passage.
- CP001 runtime target: 180–250 words.\n- CP002 runtime target: 220–350 words.\n- CP003 runtime target: 350–450 words, 4–6 paragraphs.
- CP004: 10 families per passage, 450–650 words, 6–8 paragraphs.
- CP005: 8 families per passage, 380–520 words, 6–8 paragraphs.
- Four unique answer options per question.
- Existing deterministic generators and lifecycle locks remain unchanged.
- Existing CP006 set generation automatically receives the expanded passage pools.
- 10-question Banking Prelims sets remain valid because every added CP003 passage also has BP-F10 coverage.

## Provenance rule

The expansion follows `ENG-008-WEB-SIMILARITY-AUDIT-V1.md`:
- no copied newspaper, book, coaching or PYQ passage text;
- original passage wording;
- exam-pattern inspiration only;
- sampled web-similarity checks should be repeated before a future large expansion wave.

## Lifecycle

Wave 1 is review-only and unapproved. No Question Bank writes, scored tests, mocks, learner/public publication, automatic publication or production release are authorized by this expansion.
