# NS-DIV-001 Authority Map

Date: 2026-06-03

This map identifies the current single source of truth for each NS-DIV-001 area. Runtime files are listed separately where they enforce the authority.

| Area | Source Of Truth | Runtime Enforcement |
|---|---|---|
| Archetype Definition | `archetype.md` | `types.ts` |
| Canonical Problem Registry | `canonical-problems.md`; `realism-library/cp-capability-matrix.library.json` | `types.ts`; `pipeline.ts` |
| CP-001 Definition | `canonical-problems.md`; root-level CP-001 specs | `parameter-generator.ts`; `solver.ts`; `reasoning-graph.ts`; `pipeline.ts`; `validator.ts` |
| CP-002 Definition | `CP-002/cp-002-spec.md` | `parameter-generator.ts`; `solver.ts`; `reasoning-graph.ts`; `pipeline.ts`; `validator.ts` |
| CP-002 Domain And Candidate Rules | `CP-002/domain-rules.md`; `CP-002/candidate-rules.md`; `CP-002/selection-rules.md` | `parameter-generator.ts`; `solver.ts`; `validator.ts` |
| Reasoning Patterns | `reasoning-patterns.md`; `realism-library/divisor-capabilities.library.json` | `solver.ts`; `reasoning-graph.ts`; `validator.ts` |
| CP-001 Reasoning Graph | `reasoning-graph-spec.md` | `reasoning-graph.ts`; `validator.ts` |
| CP-002 Reasoning Graph | `CP-002/reasoning-graph-spec.md` | `reasoning-graph.ts`; `validator.ts` |
| Question Language | `realism-library/question-language.library.json` | `language-contract.ts`; `validator.ts` |
| Stem Family Registry | `realism-library/stem-families-expanded.library.json` | `realism-library.ts`; `language-contract.ts` |
| Forbidden Language | Human-curated forbidden lists in `language-contract.ts` | `validator.ts` |
| Explanation Variants | `realism-library/explanation-variants.library.json` | `realism-library.ts`; `explanation-renderer.ts` |
| Explanation Styles | `realism-library/explanation-styles.library.json` | `realism-library.ts`; `explanation-renderer.ts`; `validator.ts` |
| Divisor Capabilities | `realism-library/divisor-capabilities.library.json` | `realism-library.ts`; `parameter-generator.ts`; `validator.ts` |
| Pattern System Policy | `pattern-system-v2-migration-spec.md` | `instance-generator.ts`; `structural-pattern-registry.ts`; `parameter-generator.ts` |
| Production Pattern Source | `realism-library/structural-pattern-library.json` | `structural-pattern-registry.ts`; `instance-generator.ts`; `validator.ts` |
| Fixed Template Fixture Source | `fixtures/fixed-template-fixtures.json` | `instance-generator.ts`; `pattern-system-v2.test.ts` |
| Legacy Fixed Template Library | `realism-library/number-patterns.library.json` | `realism-library.ts` for legacy validation/reference only |
| Distribution Rules | `realism-library/distribution-rules.library.json`; `realism-library/distribution-strategy.library.json` | `realism-library.ts` audit helpers |
| Difficulty Bands | `realism-library/difficulty-bands.library.json` | Library validation only; no CP-001/CP-002 difficulty scaling is active |
| Validation Rules | `validation-spec.md`; `CP-002/validation-spec.md` | `validator.ts` |
| Audit Rules | `realism-library/audit-contract.library.json`; `CP-002/audit-spec.md` | `realism-library.ts` |
| Traceability | `types.ts`; `pattern-system-v2-migration-spec.md` | `instance-generator.ts`; `pipeline.ts`; `reasoning-graph.ts`; `validator.ts` |
| Public API | `index.ts` | Export surface for tests and callers |

## Current Package Shape

| Canonical Problem | Explicit Package | Current Form |
|---|---:|---|
| CP-001 | No | Root-level specs plus implementation files. |
| CP-002 | Yes | Dedicated `CP-002/` specification package plus shared implementation files. |

## Authority Notes

- Human-owned libraries are the authority for educational decisions.
- Runtime code may load, validate, register, enforce, and audit those libraries.
- Production generation uses structural patterns. Fixed templates are retained only as fixtures, reference examples, audit fixtures, regression fixtures, and solver validation cases.
- CP-003 is not implemented and has no active runtime path in NS-DIV-001.
