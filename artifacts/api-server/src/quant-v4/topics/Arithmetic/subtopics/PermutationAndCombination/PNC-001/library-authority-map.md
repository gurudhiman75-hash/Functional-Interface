# PNC-001 Library Authority Map

| Artifact | Authority |
|---|---|
| `task-registry.library.json` | Human-owned mapping for currently admitted QLs: CP, solve mode, placeholders, difficulty, explanation and distractor behavior |
| `question-language.en.json` | Human-owned English stem source of truth |
| `variable-ranges.library.json` | Human-owned curated numeric pools and answer ceilings required by active content |
| `constraint-profiles.library.json` | Human-owned semantic restriction profiles required by active content |
| `coverage-targets.library.json` | Descriptive snapshot of current reviewed coverage; not a final count target |
| `distribution-targets.library.json` | Descriptive snapshot of current difficulty/solve-mode distribution; not a future quota |
| `explanation.en.json` | Human-owned explanation strategies required by active solve modes |
| `foundation/math.ts` | Code-owned exact arithmetic helpers added only when active content needs them |
| `foundation/parameter-generator.ts` | Code-owned deterministic parameter construction |
| `foundation/solver.ts` | Sole mathematical answer authority |
| `foundation/reasoning-graph.ts` | Code-owned normalized reasoning evidence |
| `foundation/explanation-renderer.ts` | Code-owned evidence-to-prose rendering |
| `foundation/validator.ts` | Code-owned package invariant enforcement |

No QL, solve mode, CP, package, helper, explanation strategy or distractor profile is reserved in advance. It is admitted only for demonstrated content/runtime need.

No stem or explanation may contain a hard-coded generated answer. Options and explanations must consume the solver result.
