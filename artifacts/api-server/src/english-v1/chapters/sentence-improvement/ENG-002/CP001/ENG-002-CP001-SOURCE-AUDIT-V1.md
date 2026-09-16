# ENG-002-CP001 — Sentence Improvement: Subject–Verb Agreement — Source Audit V1

Status: `IMPLEMENTED_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Blueprint boundary

ENG-002 is **Sentence Improvement**. It must reuse the shared grammar layer already validated through ENG-001 instead of creating a second set of grammar facts. CP001 therefore owns only the **Sentence Improvement transformation for Subject–Verb Agreement**.

The source grammar for this checkpoint is the closed ENG-001 CP001 V4 SVA layer:

- `GR-SVA-001` through `GR-SVA-010`;
- the approved semantic and structural catalogs;
- the existing Easy / Medium / Hard rule mapping;
- the existing single-mutation grammar contract;
- the same ambiguity repairs and plain-language normalization used by the closed ENG-001 surface.

No new grammar rule is invented in ENG-002 CP001.

## Learner-facing format

Each question contains:

1. one natural complete sentence;
2. exactly one underlined target phrase;
3. three replacement choices;
4. `No improvement` as option D;
5. one uniquely keyed answer;
6. a short teaching-oriented explanation.

The instruction is fixed and exam-grade:

> Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.

The `/` separator belongs to **Error Spotting**, where a sentence is deliberately divided into labelled/answerable parts. ENG-002 Sentence Improvement keeps the sentence intact and marks only the segment to be improved. Slash-separated sentence parts must therefore not be introduced into this chapter.

Stem variety is intentionally not manufactured. Variation belongs in the sentence, grammar structure, semantic domain, target phrase and distractors.

## No-improvement calibration

The production generator targets approximately **25% No improvement** items.

For a No-improvement item, the sentence is generated from the correct side of the existing SVA candidate and the three replacement choices are deliberately incorrect agreement surfaces. `No improvement` is therefore the only defensible answer.

For an improvement item, the sentence uses the registered incorrect SVA surface, one option supplies the validated correction, and the remaining replacement choices retain the wrong agreement number. `No improvement` remains incorrect.

This gives a natural four-position answer distribution instead of making option D rare or predictable.

## Difficulty ownership

Difficulty is inherited from the validated ENG-001 structural dimensions rather than recreated by vocabulary tricks.

- **Easy** — direct agreement, `each/every`, `one of`.
- **Medium** — intervening material and the broader SVA rule inventory, including number phrases, additive phrases, proximity agreement and collective readings.
- **Hard** — longer dependency distance, misleading nearby nouns, collective reading and proximity/number structures.

Hard items must remain readable; difficult vocabulary is not a difficulty mechanism.

## Distractor policy

Replacement distractors must:

- be natural English phrases, never mechanically malformed forms;
- be short enough to read as genuine replacement phrases;
- stay connected to the same lexical verb where practical;
- preserve the **wrong agreement number** so they cannot become accidental alternate answers;
- never duplicate the underlined phrase when the item already uses `No improvement` to represent leaving the sentence unchanged;
- never duplicate another visible option;
- avoid introducing an unrelated grammar lesson as the intended test.

After human review identified malformed forms such as artificial spellings/stems, CP001 no longer manufactures new verb spellings to create distractors. It now keeps the validated wrong agreement phrase intact and creates deterministic, natural variants around that phrase. Any mechanically generated or non-word surface is a generator defect and must fail editorial review.

## Explanation policy

Every explanation must teach the learner, not merely reveal the correct option.

The required order is:

1. **State the error first.** Identify the incorrect underlined form and give the needed correction. If the sentence is already correct, clearly state that there is no error.
2. **Teach the underlying concept in very easy language.** Explain the SVA rule as if the learner is seeing it for the first time.
3. **Apply that concept to this sentence.** Point out the main subject or the relevant agreement cue and explain why the chosen verb form matches it.
4. **Show the complete corrected sentence.**

The teaching language should be concrete and simple. Examples of the intended level include:

- “First find the main subject. A singular subject takes a singular verb, while a plural subject takes a plural verb.”
- “In ‘one of the ...’, the real subject is ‘one’, not the plural noun after ‘of’.”
- “With ‘either...or’ and ‘neither...nor’, the verb agrees with the subject nearest to it.”

Explanations must avoid option-by-option analysis, technical jargon and generic closing clutter.

## Reuse and regression boundary

ENG-002 CP001 imports the closed ENG-001 CP001 candidate layer but does **not** modify it. That means:

- ENG-001 remains content-closed;
- ENG-002 cannot silently change the approved Error Spotting surface;
- future ENG-001 grammar fixes can be forward-ported deliberately if required;
- ENG-002 validation can compare its metadata/rules against the same shared SVA rule inventory.

## Validation gates before approval

V1 requires:

- deterministic replay;
- exactly four unique options;
- `No improvement` fixed at D;
- unique keyed answer;
- correct/improvement sentence difference contract;
- forced No-improvement reproducibility;
- all 20 semantic domains reachable at every difficulty;
- approximately 25% No-improvement frequency;
- broadly balanced A/B/C/D answer positions;
- rule/difficulty compatibility;
- exam-grade instruction surface;
- explanation begins by stating error/no-error status;
- explanation explicitly teaches the underlying concept;
- explanation applies the concept to the current sentence;
- explanation includes the corrected sentence;
- review-only lifecycle lock.

## Lifecycle

This checkpoint is **not** registered in Question Studio yet and has no authority for:

- Question Bank writes;
- test eligibility;
- mock-test eligibility;
- public publication;
- automatic learner delivery;
- production release.

Question Studio integration comes only after explicit human editorial approval of the ENG-002 CP001 review corpus.
