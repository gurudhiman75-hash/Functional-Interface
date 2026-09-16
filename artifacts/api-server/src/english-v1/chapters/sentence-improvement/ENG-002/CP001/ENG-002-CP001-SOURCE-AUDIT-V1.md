# ENG-002-CP001 — Sentence Improvement: Subject–Verb Agreement — Source Audit V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REGISTERED_REVIEW_ONLY__NOT_PRODUCTION_RELEASED`

## Blueprint boundary

ENG-002 is **Sentence Improvement**. CP001 owns only the Sentence Improvement transformation for Subject–Verb Agreement and reuses the closed ENG-001 CP001 V4 SVA authority (`GR-SVA-001` through `GR-SVA-010`, approved semantic/structural catalogs, difficulty mapping, ambiguity repairs, and plain-language normalization).

No new grammar rule is invented in ENG-002 CP001.

## Learner-facing format

Each question contains:

1. one natural complete sentence;
2. exactly one underlined target phrase;
3. three replacement choices;
4. `No improvement` as option D;
5. one uniquely keyed answer;
6. a short teaching-oriented explanation.

Fixed instruction:

> Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.

The `/` separator belongs to Error Spotting. ENG-002 keeps the sentence intact and underlines only the segment to be improved.

## No-improvement calibration

The generator targets approximately 25% `No improvement` items. In those items the sentence is already correct and D is the only defensible answer. In improvement items the visible SVA surface is wrong, one option supplies the validated correction, and the remaining replacement choices preserve an incorrect agreement reading without becoming malformed English.

## Difficulty

- **Easy** — direct agreement, `each/every`, `one of`.
- **Medium** — intervening material, number phrases, additive phrases, proximity agreement, collective readings.
- **Hard** — longer dependency distance, misleading nearby nouns, collective reading, proximity/number structures.

Difficulty comes from grammar structure, not hard vocabulary.

## Distractor policy

Distractors must be natural English phrases, remain close to the same lexical material where practical, preserve the wrong agreement reading, remain unique, and never introduce mechanically malformed spellings. The reviewed defect class that produced forms such as artificial stems is prohibited at generator level.

## Explanation policy

Every explanation must teach the learner, not merely reveal the answer. Required order:

1. **Error / No error** — state what is wrong and the required correction, or state that no improvement is needed.
2. **Concept** — explain the underlying grammar rule in very easy language.
3. **Here** — apply the concept to the current sentence by identifying the real subject/agreement cue.
4. **Correct sentence** — show the complete sentence.

Explanations avoid option-by-option analysis, technical jargon, and generic closing clutter.

## Human approval pin

Human editorial approval was explicitly given on **2026-09-16** after review feedback on sentence format, instruction quality, distractors, and explanation teaching depth was resolved.

Approval authority: `ENG-002-CP001-HUMAN-EDITORIAL-APPROVAL-V1`

Pinned approved generator head: `6782cba449c2300f025851c229c0b7de461dc711`

Pinned approved review digest: `sha256:23a179e1772b98cef0d7ef738d9a38363f782e7f632ef6cf9ef32a76a1fb8100`

Approved review artifact: `ENG-002-CP001-REVIEW-V1.md`

## Question Studio lifecycle

After approval, CP001 is registered in Question Studio in **review-only** mode. This registration permits deterministic reviewer generation only.

It does **not** authorize:

- Question Bank writes;
- test eligibility;
- mock-test eligibility;
- learner/public publication;
- automatic student delivery;
- production release.

Revision policy remains `SOURCE_GENERATOR_ONLY`; any later generator change requires regeneration and a new explicit editorial approval before the changed corpus can replace the approved boundary.

## Validation gates

The checkpoint requires:

- deterministic replay;
- exactly four unique options;
- `No improvement` fixed at D;
- unique keyed answer;
- correct/improvement sentence difference contract;
- all 20 semantic domains reachable at every difficulty;
- approximately 25% No-improvement frequency;
- broadly balanced A/B/C/D answer positions;
- rule/difficulty compatibility;
- exam-grade instruction surface;
- intact sentence with only the target underlined;
- natural distractor surface;
- teaching explanation with Error/Concept/Here/Correct sentence structure;
- Question Studio review-only lifecycle lock;
- API build gate.
