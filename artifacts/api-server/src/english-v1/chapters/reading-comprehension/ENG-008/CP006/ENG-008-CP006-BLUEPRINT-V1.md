# ENG-008 CP006 — Full Multi-question Passage Sets — Blueprint V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY`

## Purpose

CP006 binds the approved ENG-008 passage/question authorities into real exam-style linked sets:

`one passage -> governed set of questions`

It does not create a new content genre. It composes already approved passage authorities from CP001–CP005 without changing their keyed answers.

## Set profiles

| Profile | Source | Default set size | Allowed set sizes |
|---|---|---:|---|
| SSC Foundation RC | CP001 | 6 | 5, 6 |
| SSC Editorial / Current Affairs RC | CP002 | 8 | 6, 8 |
| Banking Prelims RC | CP003 | 9 | 8, 9, 10* |
| Banking Mains Analytical RC | CP004 | 8 | 8, 10 |
| Research / Survey / Report RC | CP005 | 8 | 6, 8 |

*CP003 has 9 approved authorities per passage. A requested 10-question set is therefore not fabricated from the same passage; V1 rejects 10 until a tenth approved authority exists.

## Composition rules

- all questions in one set come from the same passage;
- no duplicate family in a set;
- answer order is shuffled independently but deterministically per question;
- source authority identity is retained;
- set order is deterministic from the set seed;
- shorter sets are deterministic subsets of the approved passage authority pool;
- core comprehension operations are retained before optional vocabulary/title items are dropped;
- requested set sizes unsupported by the approved authority pool are rejected rather than padded.

## Core-family retention

### SSC Foundation
Core: factual retrieval, inference, main idea, supported statement.
Optional: title, vocabulary.

### SSC Editorial
Core: detail, inference, summary, tone, purpose, implication.
Optional: cause/support, vocabulary.

### Banking Prelims
Core: detail, inference, main idea, supported statement, contextual synonym, phrase/reference, cause-effect.
Optional: contextual antonym, title.

### Banking Mains
Core: detail, deep inference, central argument, tone, purpose, can/cannot infer, paragraph relation, implication.
Optional: contextual vocabulary, scope/assumption.

### Research / Survey
Core: finding, inference, conclusion, limitation, correlation-vs-causation, evidence-vs-interpretation.
Optional: competing explanation, recommendation.

## Lifecycle

Human approval was recorded on **2026-09-26** for the CP006 full multi-question passage-set checkpoint. CP006 is registered in Question Studio in **review-only** mode. Question Bank writes, scored tests, mocks, learner/public publication, automatic publication and production release remain locked.
