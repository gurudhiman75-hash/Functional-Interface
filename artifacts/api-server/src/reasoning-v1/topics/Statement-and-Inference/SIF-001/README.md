# SIF-001 — Statement and Inference

This package implements the 17 content packs in the approved Statement & Inference blueprint.

The runtime is logic-first:

1. select a content pack and structured authority;
2. resolve facts and candidate support strength;
3. derive the answer class independently of language;
4. realise English, Hindi or Punjabi learner text;
5. run the ten release gates;
6. expose the item to Question Studio in `REVIEW_ONLY` state.

The package does not infer its answer from generated prose. It also keeps inference separate from Statement & Assumption, Statement & Conclusion, Statement & Arguments, Course of Action and formal Cause & Effect.

## CP006 review candidate

`SIF-CP006-REVIEW-V1.md` contains the human-review sample for Intention / Purpose Inference. Its 48 trilingual authorities cover eight practical-purpose families across seven contexts. The review sampler selects 24 distinct medium-level scenarios, with three per family and balanced inference positions. CP006 infers a likely operational purpose from a stated need and response; it does not infer unsupported motives, guaranteed outcomes, causal proof or recommended action.

## CP007 review candidate

`SIF-CP007-REVIEW-V1.md` contains the human-review sample for Negative and Restrictive Statements. Its 24 trilingual authorities cover eight wording families, with 12 Medium and 12 Hard scenarios. The 24-question sampler uses three scenarios per family and balances which inference is supported. Hard scenarios combine at least three facts. The chapter tests negative quantifiers, restrictive scope, conditions, exceptions, inability, evidence gaps and time qualifiers; it remains in Question Studio review only.

## CP008 review candidate

`SIF-CP008-REVIEW-V1.md` contains the human-review sample for Multi-Sentence Contextual Inference. Its 32 trilingual authorities cover eight practical synthesis families, with 16 Medium and 16 Hard scenarios. The review sampler selects three scenarios per family, balances difficulty and inference positions, and expects candidates to connect information across short passages. It remains in Question Studio review only.

## Review boundary

All 17 content packs are executable and registered for Question Studio review. Question Bank persistence, tests, mocks, public delivery and automatic publication remain locked until CP-level human review, multilingual parity review, novelty expansion and the chapter freeze are approved.
