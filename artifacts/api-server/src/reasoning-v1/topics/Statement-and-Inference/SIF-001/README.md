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

## Review boundary

All 17 content packs are executable and registered for Question Studio review. Question Bank persistence, tests, mocks, public delivery and automatic publication remain locked until CP-level human review, multilingual parity review, novelty expansion and the chapter freeze are approved.
