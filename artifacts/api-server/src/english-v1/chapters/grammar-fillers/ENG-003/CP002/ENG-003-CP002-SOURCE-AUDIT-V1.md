# ENG-003-CP002 — Grammar Fillers: Tenses and Sequence of Tenses — Source Audit V1

Status: `HUMAN_APPROVED_V1__QUESTION_STUDIO_REVIEW_ONLY__LEARNER_RELEASE_LOCKED`

## Blueprint boundary

ENG-003 is **Fill in the Blanks / Grammar Fillers**. CP002 owns the filler transformation for **Tenses and Sequence of Tenses**.

The grammar authority remains the closed ENG-001 CP002 tense layer and the approved ENG-002 CP002 sentence-improvement layer. ENG-003 reuses:

- `GR-TNS-001` through `GR-TNS-010`;
- the validated 160-scene tense catalog across 20 semantic domains;
- existing Easy / Medium / Hard rule compatibility;
- approved temporal-cue and sequence logic;
- the verified correct/error tense pairs and sentence-specific explanations.

No tense rule is re-authored in ENG-003 CP002.

## Learner-facing format

Each question contains:

1. one natural complete sentence;
2. exactly one tense/verb-form blank;
3. four tense-form choices;
4. one deterministic, uniquely defensible answer;
5. a simple rule-grounded explanation;
6. the completed correct sentence.

Fixed instruction:

> Choose the most appropriate option to fill in the blank.

There is no `No improvement` option in ENG-003.

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

## Filler transformation

The approved ENG-002 CP002 generator is always invoked in correction-required mode.

ENG-003 then:

- removes the verified tense target from the sentence;
- inserts exactly one `_____` blank;
- carries forward the verified correct tense form;
- carries forward the natural tense distractors already produced by ENG-002;
- adds the approved donor mutation as the remaining distractor;
- deterministically distributes the correct answer across A/B/C/D.

This preserves grammar truth while changing only the question family.

## Distractor policy

All distractors must be real tense/verb-form surfaces already grounded in the approved tense donor model.

Distractors must:

- stay within the intended tense lesson;
- remain grammatically plausible in isolation;
- be wrong for the explicit temporal or sequence meaning of the sentence;
- remain unique;
- not contain `No improvement`;
- not introduce malformed mechanical spellings.

## Difficulty

Difficulty is inherited from the approved tense rule layer.

- **Easy** — direct time cues, habits, happening-now contexts and `did + base`.
- **Medium** — all ten rule families, greater cue distance, stative distinctions and sequence logic.
- **Hard** — continuing-action, earlier-past and interrupted-past structures with longer dependency distance.

Difficulty must come from grammar structure, not obscure vocabulary.

## Explanation policy

Every explanation must:

1. state the exact word/phrase needed in the blank;
2. teach the underlying tense concept in simple language;
3. connect the concept to the actual sentence;
4. show the complete correct sentence.

No option-by-option analysis or generic closing clutter.

## Review batch

The deterministic review exporter produces **30 questions**:

- 10 Easy;
- 10 Medium;
- 10 Hard.

Within each difficulty, explicit rule selection cycles through every rule allowed at that level before repeating.

## Validation gates before approval

V1 must pass:

- deterministic replay;
- exactly one visible blank;
- exactly four unique options;
- no `No improvement` leakage;
- valid answer index;
- rule/difficulty compatibility;
- every eligible rule exercised in the 6,000-question soak;
- broad semantic-domain coverage;
- broadly balanced A/B/C/D answer positions;
- answer reconstructs the approved corrected sentence;
- explanation includes concept, sentence-specific application and completed sentence;
- API build gate;
- review-only lifecycle lock.

## Lifecycle

CP002 remains **review-only** until explicit human editorial approval.

It is not registered in Question Studio yet and has no authority for Question Bank writes, tests, mocks, learner/public publication, automatic student delivery or production release.

## Human approval

The 30-question review artifact was explicitly approved on **2026-09-18**.

- Approval authority: `ENG-003-CP002-HUMAN-EDITORIAL-APPROVAL-V1`
- Approved generator head: `b12a199132c3940a9e17fa3bb5fc0e3023856db0`
- Review SHA-256: `11f276ceef471e8a735da24fd89de00d6153e138af2299d3438b2b12f172795d`
- Workflow artifact digest: `sha256:3e792ddd1cb46d9dc5b80f68991f93485adbd4cff332552293bb308deab826bb`

Question Studio registration is review-only. Question Bank writes, tests, mocks, learner/public publication, automatic student delivery and production release remain locked.
