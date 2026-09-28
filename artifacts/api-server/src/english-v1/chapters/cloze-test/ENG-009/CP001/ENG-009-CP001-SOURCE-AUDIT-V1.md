# ENG-009 CP001 — SSC Standard Cloze — Source / Coverage Audit V1

Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`

## Purpose

CP001 implements the standard SSC passage-based cloze format: one coherent passage with **five numbered deleted words** and one four-option question per blank.

This is separate from ENG-003 standalone grammar fillers and ENG-008 ordinary reading comprehension.

## Exam evidence

Recent SSC CHSL/GD previous-paper material continues to use directions equivalent to: read the passage, where some words have been deleted, and select the most appropriate option for each numbered blank. Recent examples retain a five-blank passage structure.

Banking evidence is reserved for later ENG-009 checkpoints because recent SBI Clerk analyses continue to report Cloze Test separately and show more phrase-heavy variants at mains level.

## CP001 contract

- 10 original Examtree-authored passages;
- 5 blanks per passage;
- 50 governed blank authorities;
- four options per blank;
- Easy/Medium;
- blank operations span grammar, vocabulary, collocation and passage context;
- each set is generated as one linked five-question passage;
- passage text is original; public exam material is used only for format calibration.

## Validation

Automated guard covers:
- exactly 10 passages / 50 authorities;
- exactly five numbered blanks per passage;
- all four blank-operation classes represented;
- unique answer/options;
- deterministic replay;
- stable shared passage across each five-question set;
- SSC foundation length band;
- 3,000-question soak.

Lifecycle remains review-only pending explicit human approval.
