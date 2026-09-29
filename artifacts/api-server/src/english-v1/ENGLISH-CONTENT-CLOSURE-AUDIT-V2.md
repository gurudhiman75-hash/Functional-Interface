# English Content — Whole-Chapter Closure Audit V2

Status: `QUALITY_REMEDIATION_OPEN__ENG008__QUESTION_STUDIO_REVIEW_ONLY__DOWNSTREAM_RELEASE_LOCKED`

Closure audit date: **2026-09-29**

This document supersedes `ENGLISH-CONTENT-CLOSURE-AUDIT-V1.md`, which predates the implementation and approval of ENG-008 through ENG-013 and therefore no longer represents the complete English chapter.

## Current chapter inventory

| Chapter | Area | Current authoritative state |
|---|---|---|
| ENG-001 | Error Spotting | Content closed |
| ENG-002 | Sentence Improvement | Content closed |
| ENG-003 | Grammar Fillers | Content closed through CP013 |
| ENG-004 | Synonyms & Antonyms | Human approved; Question Studio review-only |
| ENG-005 | Idioms & Phrases | Human approved; Question Studio review-only |
| ENG-006 | One-word Substitution | Human approved; Question Studio review-only |
| ENG-007 | Spelling Correction | Frozen through CP007; Question Studio review-only |
| ENG-008 | Reading Comprehension | Coverage complete, but final quality remediation open for factory-built Waves 14–19; Question Studio review-only |
| ENG-009 | Cloze Test | Content closed through CP006; Question Studio review-only |
| ENG-010 | Para Jumbles | Approved saturation set; Question Studio review-only |
| ENG-011 | Sentence Rearrangement | Approved saturation set; Question Studio review-only |
| ENG-012 | Word Swap | Approved 450-authority production-volume set; Question Studio review-only |
| ENG-013 | Word Usage | Approved V4 768-authority bank; Question Studio review-only |

## ENG-001 to ENG-007 retained closure

The V1 closure evidence remains valid for the first seven chapters:

- ENG-001 and ENG-002 cover the governed grammar families through 13 checkpoints.
- ENG-003 closes the same 131-rule grammar-family breadth in filler form through CP013.
- ENG-004 contains 2,100 unique headwords and 2,400 headword-senses.
- ENG-005 contains 840 approved idioms / fixed expressions.
- ENG-006 contains 1,400 unique one-word substitutions.
- ENG-007 is frozen at 1,445 unique canonical spellings.

No new gap was found in this audit that requires reopening ENG-001 through ENG-007.

## ENG-008 — Reading Comprehension

Coverage state remains complete, but final quality state is now `QUALITY_REMEDIATION_REQUIRED__QUESTION_STUDIO_REVIEW_ONLY`.

Implemented profiles:
- SSC Foundation RC;
- SSC Editorial / Current-Affairs RC;
- Banking Prelims RC;
- Banking Mains Analytical RC;
- Research / Survey / Report RC;
- governed full multi-question passage sets;
- Banking Prelims contextual word-fit / filler gap closure.

Current large-pool inventory reaches **632 core RC passages / 5,308 governed authorities** across the governed profiles after Large-Pool Expansion Wave 19.

Banking Prelims linked sets support **8, 9 and 10 questions** using approved passage authorities. The previously demonstrated contextual word-fit gap is closed. Waves 17–19 alone added 120 passages / 1,008 governed authorities, taking the cumulative pool from 512 passages after Wave 16 to 632 after Wave 19.

No CP008 is justified: this is not a coverage gap. The required work is one-for-one quality remediation of factory-built active passages in Waves 14–19.

## ENG-009 — Cloze Test

Authoritative closure state: `CONTENT_CLOSED_V1__CP001_CP006_HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY`.

Implemented content:
- SSC Standard;
- SSC Advanced;
- Banking Prelims;
- Banking Mains;
- Mixed / New-pattern Banking;
- full-set composition and Question Studio integration.

Current authority:
- **48 original passages**;
- **268 governed blanks**.

No core cloze family remains unimplemented in the approved blueprint.

## ENG-010 — Para Jumbles

Approved saturation inventory:
- SSC Standard: 120;
- SSC Advanced: 120;
- Banking Prelims: 100;
- Banking Mains: 110;
- **450 active authority sets total**.

The merged closure work records that no additional volume is required. Future changes should be one-for-one quality replacement where ambiguity or formulaic construction is demonstrated, not blind count growth.

## ENG-011 — Sentence Rearrangement

Approved saturation inventory:
- SSC Standard: 264;
- SSC Advanced: 264;
- Banking Prelims: 217;
- Banking Mains: 245;
- **990 active authority sets total**.

990 is intentionally treated as saturation rather than forcing an artificial round number. Future work should be ambiguity replacement or genuine missing-structure work only.

## ENG-012 — Word Swap

Approved production-volume inventory:
- SSC Standard: 120;
- SSC Advanced: 120;
- Banking Prelims: 100;
- Banking Mains: 110;
- **450 authorities total**;
- **1,350 controlled lexical surfaces**.

A controlled no-correction form is active in **45 of 450 authorities** (~10%), with the correct answer set to `No correction required` only when the displayed sentence is already natural.

The current set is integrated into Question Studio in review-only mode.

## ENG-013 — Word Usage

Approved V4 inventory:
- SSC Standard: 192;
- SSC Advanced: 192;
- Banking Prelims: 192;
- Banking Mains: 192;
- **768 active authorities total**.

V4 adds **384 new target words / terms** over the 384-authority V3 bank.

The V4 architecture retains:
- deterministic authority selection;
- deterministic option shuffle / answer remapping;
- correct-usage and incorrect-usage forms;
- CP005 cross-profile composition;
- Question Studio review-only routing.

The V4 audit guards exact profile counts, unique authority IDs, distinct V4 target words / terms, no exact V3 target overlap, valid four-option construction and a 30,000-seed soak source.

## Audit reconciliation

The earlier status files contained stale lifecycle labels after approved work was merged:

1. ENG-010 / ENG-011 closure documentation still said `HUMAN_REVIEW_PENDING`, while the approved saturation work had already been merged to `New-main`.
2. ENG-012 production-volume review still said `HUMAN_REVIEW_PENDING`, while the approved 450-authority expansion was subsequently merged.
3. ENG-013 V4 review still said `REVIEW_READY__NOT_MERGED`, while the approved V4 doubling wave was merged to `New-main`.

This V2 audit is the chapter-level authority for current English closure status. Historical review files are retained as implementation records and should not be read as the present lifecycle state when they conflict with this audit.

## Lifecycle boundary

`CONTENT_CLOSED_V2` means the implemented English authored-content scope is complete for the current blueprint. It does **not** authorize learner delivery.

Still locked across ENG-001 through ENG-013:
- Question Bank writes;
- scored-test eligibility;
- mock-test eligibility;
- public publication;
- automatic learner publication;
- production release.

Question Studio remains the editorial / review surface.

## Final gap decision

No material English content-family gap remains in the currently implemented ENG-001 through ENG-013 blueprint. However, ENG-008 is not yet final-frozen because the final quality audit identified excessive shared surface scaffolding across 240 active RC passages in Waves 14–19.

Do **not** add a new checkpoint or inflate existing pools solely to increase counts.

Reopen a chapter only for one of the following:
1. new exam/source evidence showing a meaningful missing question family;
2. a demonstrated editorial, ambiguity, or generator defect;
3. a justified one-for-one quality replacement;
4. an explicitly approved new learner-facing capability.

Current state:

`QUALITY_REMEDIATION_OPEN__ENG008__QUESTION_STUDIO_REVIEW_ONLY__DOWNSTREAM_RELEASE_LOCKED`

Return to whole-English content-frozen status only after ENG-008 factory-built Waves 14–19 are remediated and re-audited.
