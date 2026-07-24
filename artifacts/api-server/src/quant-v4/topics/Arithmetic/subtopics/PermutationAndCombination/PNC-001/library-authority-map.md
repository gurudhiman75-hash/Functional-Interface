# PNC-001 Library Authority Map

| Artifact | Authority |
|---|---|
| `task-registry.library.json` | Human-owned QL-to-CP, solve-mode, placeholder, difficulty, explanation and distractor mapping |
| `question-language.en.json` | Human-owned English stem source of truth |
| `variable-ranges.library.json` | Human-owned curated numeric pools and answer ceilings |
| `constraint-profiles.library.json` | Human-owned semantic restriction profiles |
| `coverage-targets.library.json` | Human-owned exact coverage targets |
| `distribution-targets.library.json` | Human-owned difficulty and solve-mode targets |
| `explanation.en.json` | Human-owned explanation strategy wording |
| `foundation/math.ts` | Code-owned exact arithmetic authority |
| `foundation/parameter-generator.ts` | Code-owned deterministic parameter construction |
| `foundation/solver.ts` | Sole mathematical answer authority |
| `foundation/reasoning-graph.ts` | Code-owned normalized reasoning evidence |
| `foundation/explanation-renderer.ts` | Code-owned evidence-to-prose rendering |
| `foundation/validator.ts` | Code-owned package invariant enforcement |

No stem or explanation may contain a hard-coded generated answer. Options and explanations must consume the solver result.