# PNC-002 Library Authority Map

| File | Authority |
|---|---|
| `question-language.en.json` | Human-owned English stems |
| `task-registry.library.json` | Human-owned QL ownership, mode, constraint and distractor contracts |
| `explanation-by-ql.en.json` | Human-owned natural explanation narratives |
| `variable-ranges.library.json` | Curated safe block and inverse states |
| `constraint-profiles.library.json` | Mathematical meaning of every restriction |
| `coverage-targets.library.json` | Descriptive current checkpoint |
| `distribution-targets.library.json` | Descriptive current difficulty/mode distribution |
| `foundation/math.ts` | Reuse boundary for exact P&C arithmetic |
| `foundation/parameter-generator.ts` | Deterministic state construction |
| `foundation/solver.ts` | Final answer authority and independent permutation enumerator |
| `foundation/reasoning-graph.ts` | Normalized solver-owned evidence |
| `foundation/explanation-renderer.ts` | Evidence-to-prose rendering |
| `foundation/option-generator.ts` | Misconception-driven options |
| `foundation/validator.ts` | Package and solve-mode invariants |
| `foundation/pipeline.ts` | Complete question package assembly |
| `foundation/coverage-auditor.ts` | QL continuity, snapshots, duplicates and runtime sample audit |

No explanation or option recomputes the answer independently. Fixed contexts are allowed; hard-coded generated answers are not.
