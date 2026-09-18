# ENG-003-CP007 — Grammar Fillers: Conjunctions and Parallelism — Source Audit V1

Status: `IMPLEMENTED_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

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
