# English Content — Whole-Chapter Closure Audit V1

Status: `CONTENT_CLOSED_V1__QUESTION_STUDIO_REVIEW_ONLY__DOWNSTREAM_RELEASE_LOCKED`

Closure date: **2026-09-25**

## Scope

This audit covers the implemented English content system:

| Chapter | Area | Closure / approval state |
|---|---|---|
| ENG-001 | Error Spotting | `CONTENT_CLOSED_V1` |
| ENG-002 | Sentence Improvement | `CONTENT_CLOSED_V1` |
| ENG-003 | Grammar Fillers | `CONTENT_CLOSED_V1` through CP013 |
| ENG-004 | Synonyms & Antonyms | Human approved; Question Studio review-only |
| ENG-005 | Idioms & Phrases | Human approved; Question Studio review-only |
| ENG-006 | One-word Substitution | Human approved; Question Studio review-only |
| ENG-007 | Spelling Correction | Frozen at CP007; Question Studio review-only |

## Evidence

### ENG-001
The exhaustive closure audit covers CP001–CP013, 131 grammar rules, chapter-wide deterministic validation, human re-approval, cumulative Question Studio regression and locked downstream lifecycle.

### ENG-002
The content closure record covers CP001–CP013, 131 grammar rules, a 117-question master review, 3,900-question exhaustive closure soak, deterministic replay, answer-position diagnostics and Question Studio lifecycle regression.

### ENG-003
All 13 grammar-filler checkpoints are human approved. CP013 closes Common Usage / Idiomatic Grammar with nine rule families and completes the same 131-rule grammar family breadth in filler form. The package is registered through CP013 in the normal Question Studio review-only workflow.

### ENG-004
Merged approval PR #2015 records:
- 2,100 unique headwords;
- 2,400 headword-senses;
- 5,524 stored synonym links;
- 985 explicit antonym links;
- approved 100-question combined chapter review;
- Question Studio review-only registration across CP001–CP005.

### ENG-005
Merged approval PR #2026 records:
- 840 unique idioms/fixed expressions;
- approved 120-question full chapter review;
- 24,000-question chapter-wide soak;
- Question Studio review-only registration across CP001–CP004.

The CP004 authored context templates remain intentionally runtime-disabled until a separate surface-realisation pass. This does not block the approved idiom-to-meaning / meaning-to-idiom chapter authority.

### ENG-006
The approved six-checkpoint authority contains **1,400 unique one-word substitutions**, is human-approved, and is registered in Question Studio review-only mode.

### ENG-007
The final residual audit closed CP007 at **1,445 unique canonical spellings**. The full authority enforces 1,445 unique governed misspellings with zero canonical/misspelling cross-collisions. No CP008 is justified by the final exam-relevant gap audit. The frozen CP001–CP007 authority is registered as a Question Studio review-only package.

## Audit findings corrected during closeout

1. ENG-005's coverage-plan status still said `HUMAN_REVIEW_PENDING` even though merged PR #2026 recorded explicit approval and Question Studio registration. The stale status is corrected.
2. ENG-003 CP013 was approved but had not yet been registered in Question Studio. It is now added to the existing ENG-003 package and routing.
3. ENG-007 was content-frozen but not registered in Question Studio. A review-only package and routing are now added across CP001–CP007.

## Lifecycle boundary

`CONTENT_CLOSED_V1` means the current English authored content authority is complete for the implemented blueprint. It does **not** authorize learner delivery.

These remain locked across the English closeout:
- Question Bank writes;
- scored-test eligibility;
- mock-test eligibility;
- public publication;
- automatic learner publication;
- production release.

Question Studio remains the editorial/review surface.

## Closure decision

No material content-coverage gap remains in the implemented English blueprint that warrants a new checkpoint solely to increase counts.

English is therefore marked:

`CONTENT_CLOSED_V1__QUESTION_STUDIO_REVIEW_ONLY__DOWNSTREAM_RELEASE_LOCKED`

Any future reopen requires either:
1. new exam/source evidence showing a meaningful missing content family;
2. a demonstrated editorial or generator defect; or
3. an explicitly approved new learner-facing capability.
