# PNC-001 Library Authority Map

| Artifact | Authority |
|---|---|
| `task-registry.library.json` | Human-owned registry for the base CP-001/CP-002 checkpoint |
| `task-registry.cp003.library.json` | Human-owned CP-003 combination contracts |
| `task-registry.cp004.library.json` | Human-owned CP-004 multiset contracts |
| `question-language.en.json` | Human-owned English stems for the base checkpoint |
| `question-language.cp003.en.json` | Human-owned CP-003 English stems |
| `question-language.cp004.en.json` | Human-owned CP-004 English stems |
| `variable-ranges.library.json` | Human-owned curated numeric pools and safety ceilings needed by active QLs |
| `constraint-profiles.library.json` | Human-owned semantic restriction and identity-policy profiles needed by active QLs |
| `coverage-targets.library.json` | Descriptive snapshot of the current reviewed checkpoint; not a final corpus target |
| `distribution-targets.library.json` | Descriptive current difficulty and solve-mode counts; not future quotas |
| `explanation.en.json` | Human-owned explanation strategies required by active solve modes |
| `foundation/library.ts` | Code-owned composition and global registry/language parity enforcement |
| `foundation/math.ts` | Code-owned exact arithmetic authority introduced only as active QLs require it |
| `foundation/parameter-generator.ts` | Code-owned deterministic parameter construction |
| `foundation/solver.ts` | Sole mathematical answer authority |
| `foundation/reasoning-graph.ts` | Code-owned normalized reasoning evidence |
| `foundation/explanation-renderer.ts` | Code-owned evidence-to-prose rendering |
| `foundation/validator.ts` | Code-owned package invariant enforcement |

No stem or explanation may contain a hard-coded generated answer. Fixed words and scenarios may be human-authored, but their answers, options and explanations must consume solver evidence. New library records, modes or helpers are added only with a documented coverage need.
