# GEO-CLI-001 Post-Merge Remediation V1

Status: APPROVED — MERGED — CONTENT CLOSED
Chapter: Climate of India & Monsoon System
Current owning authority: `GEO_CLI_001_OWNING_AUTHORITY_V3`
Current exhaustive closure layer: `GEO_CLI_001_CP013_REVIEW_BATCH_V6`

## Why this remediation exists

The post-merge exhaustive audit found that the chapter was mechanically complete but still had coverage, wording, integration, answer-position, distractor and difficulty-calibration defects that the earlier checkpoint gates did not detect.

## Resolved audit findings

### 1. Missing core monsoon-mechanism coverage — resolved in CP002 V5

CP002 V5 adds explicit learner-facing coverage of:
- the high-pressure area east of Madagascar / Mascarene High;
- intense summer heating of the Tibetan Plateau and the resulting strong vertical circulation / low pressure aloft.

The 54-question checkpoint structure and QL010–QL018 ownership are preserved.

### 2. CP002 templated explanations — resolved in CP002 V5

All 54 CP002 explanations are rewritten question-by-question. The V5 audit requires 54 unique explanations and rejects the old answer-prefix template behaviour.

### 3. Chapter-wide mechanical wording — resolved in owning authority V2/V3

The chapter authority removes learner-facing:
- `broad`;
- `broadly`;
- repetitive `mainly`.

The gate runs across all 648 owning questions rather than only later CPs.

### 4. Exact cross-CP duplicate stems — resolved

The two CP002/CP003 winter duplicates are removed in CP002 V5.

The remaining duplicate groups identified by the audit are rewritten in the chapter authority:
- CP003 Q016;
- CP009 Q023;
- CP004 Q035;
- CP005 Q011;
- CP009 Q041;
- CP010 Q009.

The authority gate requires 648 unique normalized stems.

### 5. Chapter answer-position bias — resolved

The 648-question owning pool is rebalanced to:

- A: 162
- B: 162
- C: 162
- D: 162

Correct answers and option sets are preserved while positions are redistributed deterministically.

### 6. CP012 integration-only boundary — resolved in CP012 V2

Twelve direct-recall items are rebuilt as genuine integration tasks:

Q001, Q008, Q013, Q014, Q019, Q020, Q025, Q026, Q031, Q032, Q037 and Q038.

The replacements use two-fact comparisons, seasonal transitions, mechanism chains, region-season links and cause-effect relations. Each replacement carries at least two source-fact identifiers.

### 7. Distractor / option-shape defects — targeted remediation in owning authority V3

Eight confirmed weak option-shape cases are rewritten:
- CP003 Q032
- CP004 Q028
- CP006 Q046
- CP008 Q053
- CP009 Q054
- CP011 Q016
- CP011 Q023
- CP011 Q039

The audit's remaining heuristic flags are not treated as automatic defects; only manually confirmed cases are changed.

### 8. Hard-difficulty calibration — resolved for confirmed weak items

Twelve Hard items that relied on obvious three-statement recall are rebuilt around relation depth or multi-step inference:
- CP007 Q049, Q053
- CP010 Q012, Q018, Q024, Q036
- CP011 Q006, Q018, Q024, Q048
- CP012 Q006, Q042

Difficulty totals remain Easy 216 / Medium 360 / Hard 72.

### 9. Metadata drift — resolved

- chapter blueprint no longer says the chapter is under implementation;
- CP004 identifies V2 as its final owning checkpoint authority;
- CP012 records V2 remediation;
- CP013 records V6 synchronization.

## Current authority contract

`GEO_CLI_001_OWNING_AUTHORITY_V3` must contain:
- 648 questions;
- 108 permanent QLs;
- exactly six questions per QL;
- Easy 216 / Medium 360 / Hard 72;
- A162 / B162 / C162 / D162;
- 648 unique normalized stems;
- no learner-facing `broad`, `broadly` or repetitive `mainly`;
- review-only lifecycle and runtime registration disabled.

## CP013 V6 closure contract

CP013 V6 is synchronized to owning authority V3 and must contain:
- 108 questions;
- exactly one representative from every QL001–QL108;
- Easy 36 / Medium 60 / Hard 12;
- A27 / B27 / C27 / D27;
- owning-authority answer, option-set, explanation, QL and provenance alignment;
- review-only lifecycle.

## Lifecycle

This remediation does not authorize Question Bank persistence, test/mock eligibility, learner publication, runtime registration or production release.

Human approval was granted and PR #1965 was merged into `New-main`. GEO-CLI-001 is content-closed on owning authority V3 and CP013 V6. This closure does not authorize runtime registration, Question Bank persistence, tests/mocks, learner publication or production release.
