# ENG-001 — Error Spotting — Final Chapter Audit V1

Status: `FINAL_AUDIT_REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_CONTENT_CLOSED`

## Purpose

This checkpoint audits the complete implemented ENG-001 chapter after CP001–CP013. It does not add CP014, allocate new permanent QLs, rewrite already approved corpora, or authorize learner/production release.

The objective is to establish one chapter-level closure gate across the exact human-approved checkpoint authorities already merged into `New-main`.

## Implemented checkpoint inventory

| CP | Scope | Rule families |
| --- | --- | ---: |
| CP001 | Subject–Verb Agreement | 10 |
| CP002 | Tenses and Sequence of Tenses | 10 |
| CP003 | Articles and Determiners | 10 |
| CP004 | Pronouns | 10 |
| CP005 | Prepositions | 10 |
| CP006 | Adjectives, Adverbs and Comparison | 10 |
| CP007 | Conjunctions & Parallelism | 10 |
| CP008 | Nouns & Quantifiers | 10 |
| CP009 | Gerunds, Infinitives & Participles | 10 |
| CP010 | Modifiers | 10 |
| CP011 | Conditionals | 10 |
| CP012 | Voice & Narration | 12 |
| CP013 | Common Usage / Idiomatic Grammar | 9 |

Total approved grammar-rule families: **131**.

Permanent learner surfaces remain:

- `ENG-001-QL001` — four-part error spotting;
- `ENG-001-QL002` — error spotting with `No error` available;
- `ENG-001-QL007` — calibrated no-error surface.

## Final-audit editorial contract

The audit preserves the chapter-wide editorial rules already established during implementation:

- the instruction stem may remain standardized; repetition of the instruction itself is not treated as a content-variety defect;
- the actual sentence/scenario must remain natural, exam-like and semantically varied;
- each keyed item must have one defensible grammatical error;
- no-error items must be genuinely correct rather than merely lacking the targeted mutation;
- difficulty must come from grammar structure, dependency distance, interaction or ambiguity control rather than obscure vocabulary;
- explanations must identify the decisive grammar point in simple language and show the complete corrected sentence;
- learner explanations must not contain option-by-option analysis, internal generator terminology, seed data, lifecycle terminology or Question Studio jargon;
- approved ambiguity guards remain authoritative and must not be weakened during closure.

## Audit finding 1 — shared type-model drift

The shared `english-v1/core/types.ts` model had stopped at CP009 even though CP010–CP013 were already implemented and registered through checkpoint-local types. This left:

- `Eng001CpId` incomplete;
- `GrammarRuleId` incomplete;
- `GrammarMutationId` incomplete;
- the shared grammar-category union incomplete.

This final-audit branch corrects the shared model through CP013 without changing any approved question corpus or approval hash.

## Audit finding 2 — no chapter-level master review existed

Each checkpoint has its own source audit, generator validation, approval authority and Question Studio review-only registration, but ENG-001 did not yet have one deterministic chapter-wide human-review pack.

This checkpoint adds `eng-001-final-audit-v1.test.ts`, which:

1. verifies the cumulative Question Studio package exposes exactly CP001–CP013;
2. verifies exactly 131 unique grammar-rule IDs with the expected per-CP prefix counts;
3. rechecks all review-only lifecycle locks;
4. proves the shared core type model now includes CP010–CP013 rule/mutation identities;
5. generates and deterministically replays one question for every `CP × difficulty × QL` combination;
6. validates answer bounds, unique options, fixed instruction policy, no-error contracts and full corrected-sentence explanations;
7. rejects internal/meta leakage and option-by-option analysis in the sampled learner surface;
8. exports a **117-question** whole-chapter Markdown review pack.

Master review artifact:

`ENG-001-FINAL-AUDIT-MASTER-REVIEW-V1.md`

Composition:

- 13 checkpoints;
- 3 difficulties per checkpoint;
- 3 permanent QL surfaces per difficulty;
- 117 deterministic review questions in total.

## Frozen checkpoint evidence

Historical per-CP review artifacts are intentionally not rewritten merely to update old lifecycle wording. Several are pinned by exact SHA-256/blob authority, and changing those files would invalidate the human-approval provenance.

Where a generated review Markdown is not committed beside the checkpoint, the existing source audit, generator, validator, human-approval authority and CI regeneration/hash gate remain the evidence chain. The final audit treats these differences in storage layout as historical implementation detail, not as permission to mutate approved content.

## Lifecycle

ENG-001 remains strictly review-only during this audit:

- Question Bank writable: **false**;
- test eligible: **false**;
- mock-test eligible: **false**;
- public publication: **false**;
- automatic learner publication: **false**;
- production release authorized: **false**.

## Closure gate

ENG-001 may be marked `CONTENT_CLOSED_V1` only after all of the following are true:

1. the final-audit workflow is green on the exact branch head;
2. the API build and admin typecheck remain green;
3. the 117-question master review artifact is manually reviewed;
4. any genuine wording, ambiguity, explanation or difficulty defect found in that pack is corrected at the source generator and the affected checkpoint is regenerated/re-approved as required;
5. explicit project-owner approval is recorded for chapter closure.

Until that approval, the correct state is:

`CP001–CP013_IMPLEMENTED_AND_HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY__FINAL_CHAPTER_AUDIT_IN_PROGRESS`
