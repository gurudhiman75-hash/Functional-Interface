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
6. a short explanation that states the governing SVA rule and shows the corrected sentence.

The instruction is fixed and exam-like:

> Choose the best replacement for the underlined part. If no change is needed, select 'No improvement'.

Stem variety is intentionally not manufactured. Variation belongs in the sentence, grammar structure, semantic domain, target phrase and distractors.

## No-improvement calibration

The production generator targets approximately **25% No improvement** items.

For a No-improvement item, the sentence is generated from the correct side of the existing SVA candidate and the three replacement choices are deliberately incorrect agreement surfaces. `No improvement` is therefore the only defensible answer.

For an improvement item, the sentence uses the registered incorrect SVA surface, one option supplies the validated correction, and the remaining replacement choices retain the wrong agreement number through alternate finite-verb constructions. `No improvement` remains incorrect.

This gives a natural four-position answer distribution instead of making option D rare or predictable.

## Difficulty ownership

Difficulty is inherited from the validated ENG-001 structural dimensions rather than recreated by vocabulary tricks.

- **Easy** — direct agreement, `each/every`, `one of`.
- **Medium** — intervening material and the broader SVA rule inventory, including number phrases, additive phrases, proximity agreement and collective readings.
- **Hard** — longer dependency distance, misleading nearby nouns, collective reading and proximity/number structures.

Hard items must remain readable; difficult vocabulary is not a difficulty mechanism.

## Distractor policy

Replacement distractors must:

- be short enough to read as genuine replacement phrases;
- stay connected to the same lexical verb where practical;
- preserve the **wrong agreement number** so they cannot become accidental alternate answers;
- never duplicate the underlined phrase when the item already uses `No improvement` to represent leaving the sentence unchanged;
- never duplicate another visible option;
- avoid introducing an unrelated grammar lesson as the intended test.

The first V1 implementation derives distractors deterministically from the validated wrong SVA verb phrase. Human review must still check whether any surface feels mechanically generated or too easy; such defects are source-generator defects and must be fixed in code rather than hand-editing a frozen review artifact.

## Explanation policy

Explanations are deliberately simple and slightly helpful rather than technical.

They must:

- name the needed replacement when an improvement is required;
- state the SVA rule in ordinary language;
- explain why the visible phrase is wrong or why no improvement is needed;
- show the complete corrected sentence;
- avoid option-by-option analysis and generic closing clutter.

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
- explanation includes corrected sentence;
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
