# ENG-003-CP012 — Grammar Fillers: Voice and Narration — Source Audit V1

Status: `IMPLEMENTED_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Boundary

ENG-003 CP012 implements **Voice and Narration Grammar Fillers** by reusing the closed ENG-001 CP012 donor catalog and the curated, human-approved ENG-002 CP012 sentence-improvement layer.

Reused rules: `GR-VNR-001..012`.

Coverage includes passive participles, passive auxiliary chains, verbs that do not form an ordinary passive, modal passives, retained objects, tense backshift, pronouns, time/place reference, reported questions, commands/requests, universal truths and reporting-verb patterns.

## Filler transformation

For each donor scene, ENG-003 asks the curated ENG-002 generator for:

- the verified correction;
- three curated wrong alternatives from the same scene.

`No improvement` is removed completely. Shared words across all four choices are moved back into the sentence where safe so the options focus on the grammar actually being tested.

Phrase-level blanks remain when voice or narration depends on the complete phrase.

## Explanation style

CP012 follows the simplified language standard approved in ENG-003 CP011:

**answer → simple rule → why it fits this sentence → corrected sentence**

Formal textbook wording is avoided unless a grammar term is needed to explain the rule clearly.

## Difficulty and coverage

The donor catalog contains:

- 20 Easy scenes
- 24 Medium scenes
- 24 Hard scenes

The 6,000-question soak must exercise every eligible rule family, semantic domain and donor scene, with deterministic replay, exact reconstruction and balanced answer positions.

## Lifecycle

CP012 is review-only until explicit human editorial approval. It is not registered in Question Studio and cannot write to Question Bank or appear in tests, mocks, learner/public delivery or production release.
