# ENG-003-CP003 — Grammar Fillers: Articles and Determiners — Source Audit V1

Status: `HUMAN_APPROVED_V1__QUESTION_STUDIO_REVIEW_ONLY__LEARNER_RELEASE_LOCKED`

## Blueprint boundary

ENG-003 is **Fill in the Blanks / Grammar Fillers**. CP003 owns the filler transformation for **Articles and Determiners**.

The grammar authority remains the closed ENG-001 CP003 article/determiner layer and the approved ENG-002 CP003 sentence-improvement layer. ENG-003 reuses:

- `GR-ART-001` through `GR-ART-010`;
- the curated article/determiner donor-scene catalog;
- existing Easy / Medium / Hard rule compatibility;
- approved article, zero-article, sound, definiteness, countability and determiner-number logic;
- verified correct/error phrase pairs and sentence-specific teaching.

No article or determiner rule is re-authored in ENG-003 CP003.

## Learner-facing format

Each question contains:

1. one natural complete sentence;
2. exactly one article/determiner blank;
3. four phrase choices;
4. one deterministic, uniquely defensible answer;
5. a simple rule-grounded explanation;
6. the completed correct sentence.

Fixed instruction:

> Choose the most appropriate option to fill in the blank.

There is no `No improvement` option in ENG-003.

## Rule coverage

| Rule | Concept |
| --- | --- |
| `GR-ART-001` | singular countable noun needs a determiner |
| `GR-ART-002` | choose a/an by sound |
| `GR-ART-003` | superlative normally takes the |
| `GR-ART-004` | specific identifiable noun takes the |
| `GR-ART-005` | general plural/uncountable noun uses zero article |
| `GR-ART-006` | singular profession/role needs a/an |
| `GR-ART-007` | institution used for normal purpose may use zero article |
| `GR-ART-008` | geography article patterns |
| `GR-ART-009` | countability controls many/much/few/little |
| `GR-ART-010` | determiner-number agreement |

## Filler transformation

The approved ENG-002 CP003 generator is always invoked in correction-required mode.

ENG-003 then:

- keeps the noun phrase visible and removes only its article/determiner;
- inserts exactly one `_____` blank before the noun phrase;
- reduces the verified correction to its controlling article/determiner;
- uses rule-aware determiner-only distractors rather than malformed full noun phrases;
- represents zero article explicitly as `No article`;
- deterministically distributes the correct answer across A/B/C/D.

This preserves grammar truth while producing a cleaner competitive-exam filler surface.

## Distractor policy

Distractors must:

- be article/determiner choices, not rewritten noun phrases;
- stay tied to the same visible noun phrase;
- be wrong for the sentence's sound, specificity, countability or number condition;
- remain unique;
- not contain `No improvement`;
- never rely on malformed surfaces such as `an dictionary` or `many dictionary`.

For zero-article rules, the correct option is shown explicitly as `No article`.

## Difficulty

Difficulty remains inherited from the approved donor scenes and difficulty dimensions.

Easy, Medium and Hard differ through rule availability, dependency distance, distractor similarity and sentence structure rather than obscure vocabulary.

## Explanation policy

Every explanation must:

1. state the exact phrase needed in the blank;
2. explain the article/determiner rule in simple language;
3. connect the rule to the actual sentence;
4. show the complete correct sentence.

No option-by-option analysis or generic closing clutter.

## Review batch

The deterministic review exporter produces **30 questions**:

- 10 Easy;
- 10 Medium;
- 10 Hard.

Within each difficulty it first selects one scene from every available rule family, then fills remaining slots with unique donor scenes.

## Validation gates before approval

V1 must pass:

- deterministic replay;
- exactly one visible blank;
- exactly four unique options;
- no `No improvement` leakage;
- valid answer index;
- every eligible rule family exercised at every difficulty;
- every eligible semantic domain exercised at every difficulty;
- every eligible donor scene exercised in the 6,000-question soak;
- broadly balanced A/B/C/D answer positions;
- answer reconstructs the approved corrected sentence;
- explanation contains concept, sentence-specific application and completed sentence;
- API build gate;
- review-only lifecycle lock.

## Lifecycle

CP003 remains **review-only** until explicit human editorial approval.

It is not registered in Question Studio yet and has no authority for Question Bank writes, tests, mocks, learner/public publication, automatic student delivery or production release.


## Human approval

The 30-question review artifact was explicitly approved on **2026-09-18**.

- Approval authority: `ENG-003-CP003-HUMAN-EDITORIAL-APPROVAL-V1`
- Approved generator head: `8035a339acb1b4c9d3ff61df9ad3d35d7e49a713`
- Review SHA-256: `febda8465d3325e9a114a90945be6a84b49ac801ae522a20e885fff84bc4546a`
- Workflow artifact digest: `sha256:5786be1fa30eb9ca6d127b121155522b5bbd3a51e5c7995c8d72b22642be9057`

Question Studio registration is review-only. Question Bank writes, tests, mocks, learner/public publication, automatic student delivery and production release remain locked.
