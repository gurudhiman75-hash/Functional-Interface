# ENG-004-CP001 — Core Synonyms & Antonyms — Source Audit V1

Status: `IMPLEMENTED_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Boundary

ENG-004 starts the blueprint's Phase 2 vocabulary layer. Unlike ENG-001 to ENG-003, this chapter does **not** use grammar mutations.

CP001 establishes the first reusable lexical checkpoint for direct synonym and antonym questions.

Pipeline:

> lexical entry → relation type → exam-style stem → same-part-of-speech option family → deterministic answer → usage explanation

## Lexical inventory

V1 contains **36 curated entries**:

- 12 Easy
- 12 Medium
- 12 Hard

Each entry stores:

- lemma
- part of speech
- concise meaning
- one canonical synonym
- one canonical antonym
- three synonym distractors
- three antonym distractors
- a natural usage example
- difficulty

The initial inventory intentionally favours common competitive-exam vocabulary rather than obscure dictionary words.

## Question surface

CP001 supports both:

- direct synonym questions
- direct antonym questions

Stem wording rotates deterministically among natural exam-style variants. Options remain single words or compact lexical expressions.

## Distractor policy

Distractors must:

- match the target part of speech;
- remain plausible enough to require vocabulary knowledge;
- not duplicate the answer;
- not accidentally become a second defensible synonym/antonym;
- avoid trivial nonsense options.

## Difficulty

Difficulty comes mainly from lexical familiarity and semantic closeness.

Easy uses high-frequency words.
Medium uses common exam vocabulary with closer distractors.
Hard uses less frequent but still exam-relevant vocabulary and tighter semantic distinctions.

## Explanation policy

Every explanation states:

1. the meaning of the target word;
2. why the correct option has the same/opposite meaning;
3. one natural usage example.

No option-by-option analysis and no generic closing clutter.

## Validation

V1 requires:

- deterministic replay;
- exactly four unique options;
- valid answer index;
- explicit coverage of every lexical entry in both relation modes;
- 6,000-question soak;
- all 36 entries exercised in the soak;
- synonym and antonym generation at every difficulty;
- broadly balanced A/B/C/D answer positions;
- API build gate;
- generated 30-question review file.

## Lifecycle

CP001 is **review-only** and is not registered in Question Studio until explicit human editorial approval.

Question Bank writes, tests, mocks, learner/public publication, automatic student delivery and production release are not authorized.
