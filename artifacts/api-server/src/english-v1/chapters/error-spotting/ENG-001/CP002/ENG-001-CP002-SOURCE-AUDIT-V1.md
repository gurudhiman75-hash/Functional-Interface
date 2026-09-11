# ENG-001-CP002 Source & Coverage Audit — Tenses and Sequence of Tenses V1

Status: `SOURCE_AUDIT_V1__IMPLEMENTATION_OPEN__NOT_QUESTION_STUDIO_REGISTERED`

## Purpose

This audit defines the evidence boundary for `ENG-001-CP002 — Tenses and Sequence of Tenses` before review generation. It follows the English blueprint requirement that every CP begin from a source-backed coverage matrix and preserve the pipeline:

> verified correct construction → registered grammar rule → controlled mutation → deterministic answer → question-specific explanation

CP002 inherits the CP001 editorial policy: clean competitive-exam English, moderate sentence length, familiar contexts, structural difficulty instead of difficult vocabulary, and generator-level fixes rather than one-off review patches.

## Scope boundary

CP002 owns tense choice, tense morphology, and explicit temporal sequencing. It does **not** absorb later CPs merely because a tense appears inside them.

Deferred to later CPs:

- article/determiner errors → CP003
- pronoun errors → CP004
- standalone preposition choice such as `since` vs `for` when tense itself is already correct → CP005
- conjunction/parallelism errors such as choosing `than` vs `when` → CP007
- conditionals → CP011
- voice and narration/backshift → CP012

A CP002 question may contain words such as `since`, `for`, `when`, or `by the time`, but the controlled mutation must be a tense/verb-form mutation, not a preposition/conjunction/narration mutation.

## Source classes reviewed

### A. Blueprint authority

The Examtree English blueprint explicitly assigns `ENG-001-CP002` to **Tenses and Sequence of Tenses** and requires a source audit, rule inventory, patterns, mutations, difficulty mapping, explanations, validators, review batch, systemic defect correction, final audit, and Question Studio compatibility before completion.

### B. Competitive-exam surfaces

The audit used indexed official-paper questions reproduced by Testbook, EduRev and similar exam-preparation hosts. These are secondary hosts of examination questions, not the examination authorities themselves, so each observation is used as exam-pattern evidence rather than as a claim of first-party provenance.

Observed recurring surfaces include:

- SSC CHSL 2024: `I have met my friend yesterday` → simple past `met`.
- SSC CHSL 2024: `He has broken his leg yesterday` → simple past `broke`.
- SSC CHSL 2024: `I had seen ... yesterday` → simple past `saw` because there is no second past reference point.
- SSC CPO 2020: `has been working ... since hours` exposes the duration/point-time distinction around perfect-continuous constructions.
- SSC CHSL 2018: `has been lives ... since childhood` → `has been living`.
- SSC CGL 2021: `They had hardly completed ... than ...` confirms that quick-sequence structures are common exam material; CP002 uses only their tense sequencing and leaves conjunction choice to CP007.
- SSC Stenographer 2025: `Hardly had he left ... when the guests have arrived` → later action simple past `arrived`, showing tense-sequence consistency.

### C. Grammar-reference support

Cambridge Grammar and British Council references were used to define safe deterministic boundaries:

- present perfect is not normally used with a definite finished-past time such as `yesterday`;
- present perfect simple/continuous can describe situations that began in the past and continue to the present;
- simple present is used for habits/general facts, while present continuous is used for actions happening around now;
- stable stative verbs such as `know`, `understand`, `own`, and `belong` are not normally used progressively in their stative senses;
- past perfect marks the earlier of two connected past events, while the later event is typically simple past;
- a single completed past event does not require the past perfect merely because it happened long ago.

## Coverage matrix

| Rule | Construction | Evidence status | V1 decision | Difficulty |
| --- | --- | --- | --- | --- |
| `GR-TNS-001` | definite finished-past marker → simple past | Direct SSC PYQ + reference backed | Admit `yesterday`, `last Friday`, `two days ago`, explicit past dates; mutate simple past to present perfect. | Easy–Medium |
| `GR-TNS-002` | continuing dynamic action from past → present perfect continuous | Direct exam-pattern + reference backed | Require dynamic verb, explicit since/for cue, and still-continuing meaning. Mutate to present continuous. | Medium–Hard |
| `GR-TNS-003` | habitual/general action → simple present | Reference + exam-pattern backed | Use an authored routine marker matched to each scene; mutate to present continuous. | Easy–Medium |
| `GR-TNS-004` | action happening now → present continuous | Reference backed | Require `right now`, `at the moment`, or `currently` with dynamic verbs; mutate to simple present. | Easy–Medium |
| `GR-TNS-005` | stative verb not normally continuous | Direct exam-pattern + reference backed | Use only unambiguous stative senses of know/understand/own. | Medium |
| `GR-TNS-006` | `did/did not + base form` | Direct SSC-pattern backed | Past marking stays on `did`; mutate the lexical verb to its past form. | Easy–Medium |
| `GR-TNS-007` | earlier of two connected past actions → past perfect | Reference + exam-pattern backed | Require `by the time` plus explicit earlier/later ordering. Avoid contexts where two simple-past forms are equally natural. | Medium–Hard |
| `GR-TNS-008` | ongoing past action + past interruption → past continuous | Reference backed | Require an explicit in-progress reading plus a distinct simple-past interruption. | Medium–Hard |
| `GR-TNS-009` | single completed past event → simple past, not past perfect | Direct SSC CHSL evidence + reference backed | No second past reference point may appear. | Medium |
| `GR-TNS-010` | continuing stative state → present perfect simple | Reference + SSC-style evidence | Use stable stative verbs plus since/for duration; reject progressive stative readings. | Medium |

## Implemented semantic depth

The first production-oriented V1 catalog now contains:

- **40 dynamic scenes** across all 20 semantic domains;
- **20 continuing/sequence/interruption scenes**, one in every domain;
- **20 stative scenes**, one in every domain;
- neutral setting phrases rather than time-specific context phrases;
- authored habit markers so a sentence cannot combine contradictory cues such as `at night` with `every morning`;
- no local city/place-name pool.

The 20 domains are education, transport, commerce, science, sports, public-service, technology, environment, hospitality, healthcare, agriculture, media, household, infrastructure, banking, manufacturing, energy, postal, culture, and emergency-service.

## Evidence URLs retained for the checkpoint

Competitive-exam surfaces:

- SSC CHSL 2024 — `I have met my friend yesterday`: https://testbook.com/question-answer/identify-the-grammatical-error-in-the-following-se--66a39dd15377bcf1b87b8b5d
- SSC CHSL 2024 — `He has broken his leg yesterday`: https://testbook.com/question-answer/select-the-option-that-corrects-the-following-sent--66a29e73d16564afb1d6bc0b
- SSC CHSL 2024 — `I had seen ... yesterday`: https://testbook.com/question-answer/the-following-sentence-has-been-split-into-four-se--66a26dd5a97cb52593ecfa3d
- SSC CPO 2020 — `has been working ... since hours`: https://testbook.com/question-answer/identify-the-segment-in-the-sentence-which-contain--5fe849a935cdbf6b10233cb5
- SSC CHSL 2018 — `has been lives ... since her childhood`: https://edurev.in/test/29732/previous-year-questions-spotting-errors-2-mcq
- SSC CGL 2021 — `had hardly completed ... than ...`: https://testbook.com/question-answer/ques--62743fdef60b60bce39135dd
- SSC Stenographer 2025 — past-sequence mismatch after `Hardly had`: https://testbook.com/question-answer/identify-the-part-containing-a-grammatical-or-stru--68bada71e8fc7a37dad50950

Grammar references:

- Cambridge — Present perfect simple: https://dictionary.cambridge.org/us/grammar/british-grammar/present-perfect-simple-i-have-worked
- Cambridge — Past perfect vs past simple: https://dictionary.cambridge.org/grammar/british-grammar/past-perfect-simple
- Cambridge — Present simple vs present continuous: https://dictionary.cambridge.org/us/grammar/british-grammar/present-simple-present-continuous
- British Council — Stative verbs: https://learnenglish.britishcouncil.org/grammar/b1-b2/stative-verbs
- British Council — Past perfect: https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/past-perfect

## V1 exam-surface decisions

- Reuse the fixed CP001 instructions:
  - `Identify the part of the sentence that contains an error.`
  - add `If there is no error, select 'No error'.` only for QL002/QL007.
- Use four visible parts for QL001.
- Use three visible parts plus `No error` for QL002 while preserving the mutated tense span as one visible segment.
- QL007 is a calibrated no-error surface from deceptive but unambiguous correct constructions.
- Difficulty is structural: distance between the temporal cue and verb, competing time cues, clause sequencing, and sentence length. Vocabulary must remain plain.
- Every error item starts from a verified correct sentence and changes exactly one tense/verb-form segment.
- Explanations remain short: identify the part, state the time/sequence reason, give the correction, show the corrected sentence.

## Ambiguity exclusions

V1 rejects or defers:

- present perfect simple vs present perfect continuous where both are acceptable;
- past simple vs past perfect where event order is already clear and both are natural;
- progressive uses of normally stative verbs when an accepted dynamic reading exists (`think`, `have`, `see`, `taste`, etc.);
- future forms whose choice depends mainly on prediction, intention, schedule, or style rather than a single grammatical requirement;
- narration/backshift and conditional tense systems;
- any item whose answer depends on a disputed British/American preference rather than the target Indian competitive-exam convention.

## Initial completion gate

Before CP002 can be approved, it must show:

1. rule/mutation determinism;
2. exactly one intended tense error;
3. no hidden second error;
4. simple exam-like vocabulary;
5. stable Easy/Medium/Hard separation;
6. meaningful no-error calibration;
7. diverse temporal contexts rather than random noun replacement;
8. question-specific explanations;
9. deterministic review export;
10. no Question Studio registration before human approval.
