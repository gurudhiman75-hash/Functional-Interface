# ENG-008 CP001 — SSC Foundation Reading Comprehension — Source Audit V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY`

## Purpose

CP001 establishes the SSC foundation RC layer after separating exam profiles. It covers the simpler passage classes used as the base of SSC comprehension: **book/story-style narrative** and **straightforward report/expository** passages.

Editorial/current-affairs passages are no longer runtime authorities in CP001. The four already-authored editorial passages are retained only as seed material for CP002 and require independent expansion/review there.

## Official requirement traced

Current SSC English syllabi explicitly include Comprehension Passage. SSC notices describe a mix that includes simple book/story-type material and report/editorial/current-affairs material.

CP001 owns the foundation side of that requirement:
1. simple narrative / story;
2. straightforward report / expository.

CP002 will own editorial/current-affairs RC.

All learner passages are original Examtree-authored text. They are not copied from newspapers, books, coaching PDFs or previous-year passages.

## Question families

- `RC-F01` — Factual retrieval
- `RC-F02` — Inference
- `RC-F03` — Main idea / central theme
- `RC-F04` — Suitable title
- `RC-F05` — Vocabulary in context
- `RC-F06` — Passage-supported statement

Each question authority stores one correct answer, three curated distractors, a simple explanation, evidence text/rationale, difficulty, genre and passage ID.

## CP001 breadth

The candidate contains **8 authored passages**:
- 4 narrative/story;
- 4 report/expository.

Each passage carries six governed question authorities, one per family, for **48 atomic RC authorities**.

The four previously authored editorial passages are preserved outside the CP001 runtime pool as `ENG008_CP002_SEED_PASSAGES_V1`.

This is a foundation checkpoint, not a final passage-count target.

## Difficulty

- factual retrieval: Easy;
- vocabulary in context: Easy or Medium;
- supported statement: Medium;
- inference: Medium;
- main idea/title: Medium or Hard where evidence must be synthesised.

## Validation requirements

- 8 unique CP001 passages;
- 48 reachable question authorities;
- all six families represented;
- exactly 4 narrative + 4 report passages;
- exactly four unique options per question;
- exactly one keyed answer;
- evidence/rationale non-empty;
- deterministic generation;
- 6,000-question soak across Easy/Medium/Hard;
- no learner/public lifecycle leakage.

## Lifecycle

Human approval was recorded on **2026-09-25** against review artifact `ENG-008-CP001-REVIEW-V1` (artifact `10852440253`, digest `sha256:29ad5043739b07bebbf3fa5866ce5d8c40b5b70c411a193af1334ce341c2cc68`). CP001 is registered in Question Studio in **review-only** mode. Question Bank writes, tests, mocks, learner/public publication, automatic publication and production release remain locked.
