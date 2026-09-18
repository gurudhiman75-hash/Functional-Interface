# ENG-003-CP007 — Grammar Fillers: Conjunctions and Parallelism — Source Audit V1

Status: `HUMAN_APPROVED_V1__QUESTION_STUDIO_REVIEW_ONLY__LEARNER_RELEASE_LOCKED`

## Boundary

ENG-003 CP007 implements **Conjunctions and Parallelism Grammar Fillers** by reusing the closed ENG-001 CP007 and approved ENG-002 CP007 layer.

Reused rules: `GR-CON-001..010`, covering logical coordinators, both-and, either-or, neither-nor, not-only-but-also, although/though redundancy, because/because of, despite/although, coordinated-list parallelism, and correlative parallelism.

No conjunction rule is re-authored in ENG-003.

## Filler transformation

ENG-002 CP007 already isolates the smallest useful target for each donor scene. ENG-003:

- keeps that approved focus;
- replaces it with one `_____` blank;
- uses the verified correction as the correct choice;
- obtains three safe wrong-form alternatives from the same approved donor logic;
- deterministically distributes all four choices across A/B/C/D;
- removes `No improvement` from the learner surface.

For rules where grammar depends on a phrase rather than a single word, the option remains the necessary phrase. This prevents unnatural token chopping.

## Quality guards

The checkpoint rejects duplicate choices, mechanical conjunction phrases, multiple blanks, Error Spotting slash segmentation, answer-reconstruction drift and explanation loss.

## Difficulty and coverage

The donor catalog contains **20 curated scenes per difficulty**. The 6,000-question soak must exercise every eligible rule family, semantic domain and donor scene, while passing deterministic replay and answer-position balance.

## Review batch

The review exporter produces **30 deterministic questions**: 10 Easy, 10 Medium and 10 Hard, prioritizing rule-family breadth before additional scene variety.

## Lifecycle

CP007 remains review-only until explicit human editorial approval. It is not registered in Question Studio and is not eligible for Question Bank writes, tests, mocks, learner/public publication, automatic student delivery or production release.

## Human approval

Approved on **2026-09-18**.

- Approval authority: `ENG-003-CP007-HUMAN-EDITORIAL-APPROVAL-V1`
- Approved generator head: `d46e0d93a7a2af0ab9f4c93079fe7495450a5627`
- Review SHA-256: `fd3e6cbc5fbdb35544fc0fbd7d91c6e45aa69d686f0ca11a1e8bf82f28eae30c`
- Workflow artifact digest: `sha256:f35e3b7ed04987bff0330473c8c2739db003aa4fafda4fa37b25908bedd2188a`

Question Studio registration is review-only. Learner/test/mock/public release remains locked.
