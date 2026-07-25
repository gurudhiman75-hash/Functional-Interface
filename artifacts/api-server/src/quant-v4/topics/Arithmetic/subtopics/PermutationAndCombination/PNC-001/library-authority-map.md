# PNC-001 Library Authority Map

| Artifact | Authority |
|---|---|
| `task-registry.library.json` | Human-owned base CP-001/CP-002 contracts |
| `task-registry.cp003.library.json` | Human-owned CP-003 combination contracts |
| `task-registry.cp004.library.json` | Human-owned CP-004 digit/number/code contracts |
| `task-registry.cp005.library.json` | Human-owned CP-005 multiset and dictionary-rank contracts |
| `task-registry.cp006.library.json` | Human-owned CP-006 selection/role-assignment contracts |
| `question-language.en.json` | Human-owned base English stems |
| `question-language.cp003.en.json` | Human-owned CP-003 English stems |
| `question-language.cp004.en.json` | Human-owned CP-004 English stems |
| `question-language.cp005.en.json` | Human-owned CP-005 English stems, including QL-105/106 dictionary rank |
| `question-language.cp006.en.json` | Human-owned CP-006 English stems |
| `question-language.editorial-repairs.en.json` | Human-owned traceable stem overrides approved by the full rendered review |
| `explanation.en.json` | Human-owned legacy mathematical strategy metadata |
| `explanation.cp004.en.json` | Human-owned CP-004 mathematical strategy metadata |
| `explanation.cp006.en.json` | Human-owned CP-006 mathematical strategy metadata |
| `explanation-by-ql.en.json` | Human-owned natural QL-specific prose for QL-001 through QL-104 |
| `explanation-by-ql.cp005-rank.en.json` | Human-owned natural dictionary-rank prose for QL-105/106 |
| `explanation-by-ql.editorial-repairs.en.json` | Human-owned traceable explanation overrides approved by the full rendered review |
| `pnc-001-editorial-review-decisions.json` | Human-owned final accept/fix/defer decisions for all audit findings and review rows |
| `variable-ranges.library.json` | Human-owned curated numeric, digit, symbol, mixed-selection and safety pools |
| `constraint-profiles.library.json` | Human-owned order, identity, repetition, leading-zero, mixed-stage and inverse-domain semantics |
| `coverage-targets.library.json` | Descriptive reviewed regression snapshot; not a final QL target |
| `distribution-targets.library.json` | Descriptive reviewed difficulty/mode distribution; not future quotas |
| `foundation/library.ts` | Code-owned companion-library composition, editorial override application and global parity/duplicate enforcement |
| `foundation/math.ts` | Code-owned exact sum, product, power, factorial, `nPr`, `nCr` and multiset arithmetic |
| `foundation/parameter-generator.ts` | Code-owned deterministic parameter construction and bounded inverse states |
| `foundation/solver.ts` | Legacy CP-001–005 production mathematical authority except dictionary rank |
| `foundation/solver-dictionary-rank.ts` | CP-005 dictionary-rank authority plus recursive distinct-word verifier |
| `foundation/solver-cp006.ts` | CP-006 production mathematical authority and independent mixed-outcome verifier |
| `foundation/solver-router.ts` | Narrow routing between legacy, dictionary-rank and CP-006 authorities |
| `foundation/reasoning-graph*.ts` | Code-owned normalized reasoning evidence |
| `foundation/explanation-*.ts` | Code-owned evidence-to-prose rendering and routing |
| `foundation/option-*.ts` | Code-owned semantic distractor construction and routing |
| `foundation/validator*.ts` | Code-owned package and solve-mode invariant enforcement and routing |
| `foundation/coverage-auditor.ts` | Code-owned 106-QL regression, placeholder, duplicate and runtime audit |
| `pnc-001-package-audit-final.ts` | Code-owned 5,300-case stress audit, decision-parity enforcement and completed review export |

No stem or explanation may contain a hard-coded generated answer. Fixed words and scenarios may be human-authored, but answers, options and rendered explanations must consume solver evidence. CP ownership follows the fixed roadmap; new QLs, modes and helpers are added only for demonstrated need.