# PNC-001 Library Authority Map

| Artifact | Authority |
|---|---|
| `task-registry.library.json` | Human-owned mapping for currently admitted QLs: CP, solve mode, placeholders, difficulty, explanation and distractor contract |
| `question-language.en.json` | Human-owned English stem source of truth |
| `variable-ranges.library.json` | Human-owned curated numeric pools and safety ceilings needed by active QLs |
| `constraint-profiles.library.json` | Human-owned semantic restriction profiles needed by active QLs |
| `coverage-targets.library.json` | Descriptive snapshot of the current reviewed checkpoint; not a final corpus target |
| `distribution-targets.library.json` | Descriptive current difficulty and solve-mode counts; not future quotas |
| `explanation.en.json` | Human-owned explanation strategies required by active solve modes |
| `foundation/math.ts` | Code-owned exact arithmetic authority introduced only as active QLs require it |
| `foundation/parameter-generator.ts` | Code-owned deterministic parameter construction |
| `foundation/solver.ts` | Sole mathematical answer authority |
| `foundation/reasoning-graph.ts` | Code-owned normalized reasoning evidence |
| `foundation/explanation-renderer.ts` | Code-owned evidence-to-prose rendering |
| `foundation/validator.ts` | Code-owned package invariant enforcement |

No stem or explanation may contain a hard-coded generated answer. Options and explanations must consume the solver result. New library records, modes or helpers are added only with a documented coverage need.