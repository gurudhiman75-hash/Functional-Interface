# ENG-002-CP002 — Sentence Improvement: Tenses and Sequence of Tenses — Source Audit V1

Status: `IMPLEMENTED_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Blueprint boundary

ENG-002 is **Sentence Improvement**. CP002 owns only the Sentence Improvement transformation for **Tenses and Sequence of Tenses**.

The grammar authority is the closed ENG-001 CP002 tense layer. ENG-002 reuses:

- `GR-TNS-001` through `GR-TNS-010`;
- the validated 160-scene tense catalog across 20 semantic domains;
- existing Easy / Medium / Hard rule compatibility;
- ambiguity guards already established for the tense chapter;
- the verified correct/error tense pairs and sentence-specific applications.

No tense rule is re-authored in ENG-002 CP002.

## Scope

CP002 covers tense choice, tense morphology and explicit temporal sequencing. It does not absorb later grammar chapters merely because a tense appears inside them.

Deferred boundaries remain unchanged:

- articles/determiners → CP003;
- pronouns → CP004;
- standalone preposition choice → CP005;
- conjunction choice → CP007;
- conditionals → CP011;
- voice/narration → CP012.

## Learner-facing format

Each question contains:

1. one natural complete sentence;
2. one underlined tense/verb-form target;
3. three replacement choices;
4. `No improvement` as option D;
5. one uniquely defensible answer;
6. a simple teaching explanation.

Fixed instruction:

> Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.

The `/` separator is an Error Spotting convention and must not be used here. Sentence Improvement keeps the sentence intact and underlines only the target phrase.

## Rule coverage

| Rule | Concept | Difficulty |
| --- | --- | --- |
| `GR-TNS-001` | finished past time → simple past | Easy–Medium |
| `GR-TNS-002` | continuing dynamic action from past → present perfect continuous | Medium–Hard |
| `GR-TNS-003` | habit/routine → simple present | Easy–Medium |
| `GR-TNS-004` | action happening now → present continuous | Easy–Medium |
| `GR-TNS-005` | stative verb not normally continuous | Medium |
| `GR-TNS-006` | `did/did not + base form` | Easy–Medium |
| `GR-TNS-007` | earlier of two ordered past actions → past perfect | Medium–Hard |
| `GR-TNS-008` | ongoing past action + interruption → past continuous | Medium–Hard |
| `GR-TNS-009` | single completed past event → simple past | Medium |
| `GR-TNS-010` | continuing stative state → present perfect simple | Medium |

## Distractor policy

Distractors must be natural exam-style replacement phrases. CP002 does **not** derive new spellings by stripping or adding suffixes.

Instead, it uses verb forms already authored in the validated donor scene: base, simple-present, simple-past, participle and `-ing` forms. Auxiliary changes are applied only around these validated forms.

Distractors must:

- remain real English word forms;
- stay within the tense/verb-form lesson;
- be wrong for the explicit time/sequence cue in the sentence;
- never duplicate the underlined phrase when `No improvement` already represents leaving it unchanged;
- remain unique;
- avoid introducing an unrelated grammar error as the intended distinction.

Any non-word or mechanically malformed verb surface is a generator defect.

## No-improvement calibration

The generator targets approximately **25% No improvement** items.

For those items, the visible sentence is already correct and D is the only accepted answer. The three replacement choices are alternative tense forms that conflict with the validated time/sequence reading.

For improvement items, the visible sentence uses the approved donor mutation, one replacement restores the verified correct tense, and the remaining two choices are natural but incorrect tense alternatives.

## Difficulty

Difficulty remains structural rather than lexical.

- **Easy** — direct finished-past, routine, happening-now and `did + base` cues.
- **Medium** — all ten rule families, wider cue-to-verb distance, stative distinctions and past sequencing.
- **Hard** — continuing-action, past-sequence and past-interruption structures with longer dependency distance.

Plain vocabulary is retained at every level.

## Explanation policy

Every explanation must teach the underlying tense concept in very easy language after identifying the error.

Required order:

1. **Error / No improvement** — state the wrong form and correction, or state that the visible form is already correct.
2. **Concept** — explain the tense rule in simple learner-friendly language.
3. **Here** — connect that rule to the actual time marker or event sequence in this sentence.
4. **Correct sentence** — show the complete corrected sentence.

Examples of the intended teaching level:

- “When a sentence gives a finished past time such as yesterday, use the simple past.”
- “After did or did not, keep the main verb in its base form because did already shows the past tense.”
- “When one action was already in progress and another past action interrupted it, use was/were + verb-ing for the ongoing action.”

Avoid option-by-option analysis, technical jargon and generic closing clutter.

## Review batch

The deterministic review exporter produces **60 questions**:

- 20 Easy;
- 20 Medium;
- 20 Hard.

It aims to cover all 20 semantic domains within each difficulty section while retaining rule compatibility. Every fourth review item is deliberately generated as a `No improvement` case so that the review set exposes the full sentence-improvement contract.

## Validation gates before approval

V1 must pass:

- deterministic replay;
- exactly four unique options;
- `No improvement` fixed at D;
- valid unique answer key;
- improvement/no-improvement sentence contracts;
- target phrase is exactly the underlined segment;
- no slash-separated Error Spotting surface;
- natural authored verb forms only;
- rule/difficulty compatibility;
- all 20 semantic domains reachable at every difficulty;
- approximately 25% No-improvement frequency;
- broadly balanced A/B/C/D answer positions;
- explanation contains `Concept`, sentence-specific application and corrected sentence;
- API build gate;
- review-only lifecycle lock.

## Lifecycle

CP002 remains **review-only** until explicit human editorial approval.

It is not yet registered in Question Studio and has no authority for:

- Question Bank writes;
- test or mock eligibility;
- learner/public publication;
- automatic student delivery;
- production release.

After approval, Question Studio integration must be separately pinned to the exact reviewed generator/artifact boundary, following the ENG-002 CP001 lifecycle pattern.
