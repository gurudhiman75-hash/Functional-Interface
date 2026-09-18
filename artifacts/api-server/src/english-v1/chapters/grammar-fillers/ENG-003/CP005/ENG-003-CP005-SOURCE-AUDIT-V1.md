# ENG-003-CP005 — Grammar Fillers: Prepositions — Source Audit V1

Status: `HUMAN_APPROVED_V1__QUESTION_STUDIO_REVIEW_ONLY__LEARNER_RELEASE_LOCKED`

## Boundary

ENG-003 CP005 implements **Preposition Grammar Fillers** by reusing the closed ENG-001 CP005 and approved ENG-002 CP005 preposition layer.

Reused rule IDs:

- `GR-PRP-001` time: at / on / in
- `GR-PRP-002` place: at / on / in
- `GR-PRP-003` since / for
- `GR-PRP-004` by / until
- `GR-PRP-005` between / among
- `GR-PRP-006` in / into
- `GR-PRP-007` beside / besides
- `GR-PRP-008` adjective + fixed preposition
- `GR-PRP-009` verb + fixed preposition
- `GR-PRP-010` noun + fixed preposition

No preposition rule is re-authored here.

## Filler transformation

The approved ENG-002 CP005 generator is invoked only in correction-required mode.

ENG-003 then:

- compares the verified correct and mutated phrase;
- isolates the single changed preposition token;
- keeps the rest of the phrase visible;
- replaces only that token with one `_____` blank;
- supplies four single-preposition choices;
- uses rule-aware distractors from the same preposition distinction;
- deterministically distributes the correct answer across A/B/C/D.

Examples of the intended surface:

- `familiar _____ the software`
- `_____ Friday`
- `shared _____ the affected families`
- `a solution _____ the problem`

This avoids repeating long phrases in every option and keeps the question close to competitive-exam filler style.

## Difficulty and coverage

The approved donor catalog contains **20 scenes per difficulty**.

The 6,000-question validation must exercise:

- every rule family eligible at that difficulty;
- every eligible semantic domain;
- every one of the 20 donor scenes at that difficulty;
- deterministic replay;
- valid reconstruction of the approved corrected sentence;
- broadly balanced A/B/C/D answer positions.

Difficulty comes from the approved scene structure and rule distinction, not obscure vocabulary.

## Explanation policy

Every explanation:

1. names the exact preposition required;
2. reuses the approved simple rule explanation;
3. applies it to the actual sentence;
4. shows the completed correct sentence.

No option-by-option analysis and no generic closing clutter.

## Review batch

The deterministic review exporter produces **30 questions**:

- 10 Easy
- 10 Medium
- 10 Hard

It prioritizes one donor from every eligible rule family before adding further unique scenes.

## Lifecycle

CP005 remains **review-only** until explicit human editorial approval.

It is not registered in Question Studio yet. Question Bank writes, tests, mocks, learner/public publication, automatic student delivery and production release remain locked.

## Human approval

Approved on **2026-09-18**.

- Approval authority: `ENG-003-CP005-HUMAN-EDITORIAL-APPROVAL-V1`
- Approved generator head: `0dba987acc64badd03c4031edf8e98493358bee8`
- Review SHA-256: `aa2fc64a233317b20a7730c7894f83606d0e7f2c8b4bdfaa44587805132a1f5e`
- Workflow artifact digest: `sha256:9ab194b178b7b19972fb85cdd1697f0daa5dcc15cb1b8e7b5dd1fe48bf24a868`

Question Studio registration is review-only. Learner/test/mock/public release remains locked.
