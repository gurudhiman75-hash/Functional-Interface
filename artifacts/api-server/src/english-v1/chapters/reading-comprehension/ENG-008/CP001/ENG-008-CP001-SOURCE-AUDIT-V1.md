# ENG-008 CP001 — Foundation Reading Comprehension — Source Audit V1

Status: `IMPLEMENTED_CANDIDATE_V1__HUMAN_REVIEW_PENDING__REVIEW_ONLY`

## Purpose

CP001 proves the canonical Reading Comprehension architecture before larger SSC-style passage sets are added.

## Official requirement traced

Current SSC English syllabi explicitly include Comprehension Passage. CGL additionally specifies multiple paragraphs and a mix including a simple book/story-type passage and report/editorial material.

CP001 therefore uses three authored genres:
1. narrative / story;
2. report / expository;
3. editorial / argumentative.

All learner passages in CP001 are original Examtree-authored text. They are not copied from newspapers, books, coaching PDFs or previous-year passages.

## Question families

- `RC-F01` — Factual retrieval
- `RC-F02` — Inference
- `RC-F03` — Main idea / central theme
- `RC-F04` — Suitable title
- `RC-F05` — Vocabulary in context
- `RC-F06` — Passage-supported statement

Each question authority stores:
- one correct answer;
- at least three curated distractors;
- a simple explanation;
- evidence text or evidence rationale;
- difficulty;
- genre;
- passage ID.

## CP001 breadth

The initial candidate contains **12 authored passages**:
- 4 narrative/story;
- 4 report/expository;
- 4 editorial/argumentative.

Each passage carries six reviewed question authorities, one per family, for **72 atomic RC authorities**.

This is a foundation checkpoint, not a final passage-count target.

## Difficulty

Each passage contains a controlled mix:
- factual retrieval: Easy;
- vocabulary in context: Easy or Medium;
- supported statement: Medium;
- inference: Medium;
- main idea/title: Medium or Hard where distractors are close.

## Validation requirements

- 12 unique passages;
- all 72 question authorities reachable;
- every family represented;
- all three genres represented;
- exactly four unique options;
- exactly one keyed answer;
- evidence/rationale non-empty;
- deterministic generation;
- Easy / Medium / Hard review sampling;
- no learner/public lifecycle leakage.

## Lifecycle

Review-only. No Question Studio registration or downstream release until explicit human approval.
