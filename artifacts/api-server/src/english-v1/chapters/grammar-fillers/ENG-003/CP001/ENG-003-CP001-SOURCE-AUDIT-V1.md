# ENG-003-CP001 — Source Audit V1

Chapter: `ENG-003` — Fill in the Blanks / Grammar Fillers  
Checkpoint: `ENG-003-CP001` — Subject–Verb Agreement  
Lifecycle: `REVIEW_ONLY__HUMAN_APPROVAL_PENDING`

## Blueprint alignment

ENG-003 is the third Phase-1 English chapter and is intended to reuse the same Grammar Knowledge Layer already used by ENG-001 Error Spotting and ENG-002 Sentence Improvement. CP001 therefore reuses the established SVA rule IDs instead of creating a second grammar inventory.

## Reused grammar authority

The checkpoint consumes the approved ENG-001/ENG-002 SVA layer:

- `GR-SVA-001` — basic singular/plural agreement
- `GR-SVA-002` — each/every agreement
- `GR-SVA-003` — one of the ...
- `GR-SVA-004` — a number of / the number of
- `GR-SVA-005` — along with / together with / as well as
- `GR-SVA-006` — either...or / neither...nor proximity agreement
- `GR-SVA-007` — collective nouns
- `GR-SVA-008` — more than one
- `GR-SVA-009` — many a / many an
- `GR-SVA-010` — intervening phrases / main-subject identification

Difficulty eligibility is inherited from the approved `rulesForDifficultyV4` contract rather than being redefined inside ENG-003.

## Question family

Exam surface:

> Choose the most appropriate option to fill in the blank.

A valid SVA sentence is reduced to one controlled blank at the finite-verb target. Four replacement choices are then shown. Exactly one choice satisfies the already registered SVA rule in the sentence context.

ENG-003 CP001 deliberately does **not** use a `No improvement` / `No error` option because the task is a positive filler choice rather than an error-detection decision.

## Sentence inventory

Sentence and semantic-domain coverage is inherited from the approved ENG-001 CP001 semantic catalog through the already-audited ENG-002 CP001 reuse layer. This preserves broad everyday competitive-exam contexts rather than introducing a new narrow filler-only sentence bank.

## Distractor strategy

Each item uses three grammatically plausible but agreement-invalid alternatives derived from the controlled wrong agreement form. Adverb insertion may vary the surface while preserving the underlying agreement defect, so distractor variation does not create a second correct answer.

Required option properties:

- exactly four choices;
- exactly one correct filler;
- no duplicate options;
- no `No improvement` leakage;
- correct answer position deterministically shuffled;
- all choices tied to the same intended agreement decision rather than random unrelated verb forms.

## Explanation standard

Each explanation must:

1. state the required filler;
2. teach the underlying SVA concept in simple language;
3. apply that concept to the actual sentence and subject;
4. show the completed correct sentence.

The explanation teaching tail is reused from the approved ENG-002 CP001 rule-grounded explanation layer, avoiding generic filler commentary.

## Difficulty

Easy / Medium / Hard comes from the existing SVA difficulty contract and therefore reflects rule eligibility, structural distance and sentence complexity already calibrated in ENG-001/ENG-002. Difficulty is not manufactured through obscure vocabulary.

## Validation target

Automated soak for each difficulty checks:

- deterministic generation;
- four unique options;
- one visible blank;
- valid answer index;
- no sentence-improvement option leakage;
- rule eligibility and explicit rule selection;
- broad semantic-domain coverage;
- balanced answer-position distribution;
- explanation completeness;
- review-only lifecycle.

## Human-review gate

The first review artifact contains representative Easy, Medium and Hard items. No Question Studio registration, learner release, test/mock eligibility or production publication is authorized by this checkpoint until the review file is explicitly approved.
