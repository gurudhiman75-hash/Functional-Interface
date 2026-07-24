# PNC-001 Library Authority Map

| Artifact | Authority |
|---|---|
| `task-registry.library.json` | Human-owned base CP-001/CP-002 contracts |
| `task-registry.cp003.library.json` | Human-owned CP-003 combination contracts |
| `task-registry.cp004.library.json` | Human-owned CP-004 digit/number/code contracts |
| `task-registry.cp005.library.json` | Human-owned CP-005 word/multiset contracts |
| `question-language.en.json` | Human-owned base English stems |
| `question-language.cp003.en.json` | Human-owned CP-003 English stems |
| `question-language.cp004.en.json` | Human-owned CP-004 English stems |
| `question-language.cp005.en.json` | Human-owned CP-005 English stems |
| `explanation.en.json` | Human-owned base and CP-005 explanation strategies |
| `explanation.cp004.en.json` | Human-owned CP-004 digit/code explanation strategies |
| `variable-ranges.library.json` | Human-owned curated numeric, digit, symbol and safety pools |
| `constraint-profiles.library.json` | Human-owned order, identity, repetition, leading-zero and restriction semantics |
| `coverage-targets.library.json` | Descriptive current regression snapshot; not a final QL target |
| `distribution-targets.library.json` | Descriptive current difficulty/mode distribution; not future quotas |
| `foundation/library.ts` | Code-owned companion-library composition and global parity/duplicate enforcement |
| `foundation/math.ts` | Code-owned exact sum, product, power, factorial, `nPr`, `nCr` and multiset arithmetic |
| `foundation/parameter-generator.ts` | Code-owned deterministic parameter construction |
| `foundation/solver.ts` | Sole production mathematical answer authority |
| `foundation/reasoning-graph.ts` | Code-owned normalized reasoning evidence |
| `foundation/explanation-renderer.ts` | Code-owned evidence-to-prose rendering |
| `foundation/option-generator.ts` | Code-owned semantic distractor construction |
| `foundation/validator.ts` | Code-owned package and solve-mode invariant enforcement |
| `foundation/coverage-auditor.ts` | Code-owned current QL, placeholder, duplicate and runtime audit |

No stem or explanation may contain a hard-coded generated answer. Fixed words, digit sets and scenarios may be human-authored, but answers, options and explanations must consume solver evidence. CP ownership follows the fixed family roadmap; new QLs, modes and helpers are added only for demonstrated need inside that ownership.
