# ENG-003-CP003 — Grammar Fillers: Articles and Determiners — Source Audit V1

Status: `IMPLEMENTED_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

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

- removes the verified article/determiner target;
- inserts exactly one `_____` blank;
- carries forward the verified correct phrase;
- carries forward the two natural replacement distractors already produced by ENG-002;
- adds the approved donor mutation as the third distractor;
- deterministically distributes the correct answer across A/B/C/D.

This preserves grammar truth while changing only the question family.

## Distractor policy

Distractors must:

- stay tied to the same noun phrase;
- remain real English article/determiner surfaces;
- be wrong for the sentence's meaning or countability;
- remain unique;
- not contain `No improvement`;
- never be malformed by mechanical spelling edits.

For zero-article rules, the correct option may be the bare noun phrase; this is intentional and must remain explicit in the option set.

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
