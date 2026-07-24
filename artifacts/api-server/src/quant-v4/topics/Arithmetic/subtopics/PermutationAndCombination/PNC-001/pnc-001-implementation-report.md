# PNC-001 CP-001 Implementation Report

> **Package:** `PNC-001 — Counting Foundations, Basic Permutations & Basic Combinations`
> **Implemented checkpoint:** `PNC-CP-001 — Fundamental Counting Principle & Case Partition`
> **QL range:** `PNC-QL-001` through `PNC-QL-048`
> **Branch:** `feat/pnc-001-cp001-runtime-proof`
> **Draft PR:** `#87`
> **Design commit:** `8ad8aa1a00663d1d2b0d929b29b29446592aa8fc`
> **Implementation status:** Runtime proof complete
> **Date:** 2026-07-24

---

## 1. Delivered Scope

The checkpoint implements the complete planned CP-001 corpus rather than a small scaffold:

- 48 human-authored English QLs;
- 22 Easy, 18 Medium and 8 Hard;
- five typed solve modes;
- human-owned task registry, variable ranges, constraints, coverage targets, distribution targets and explanation strategies;
- deterministic seeded parameter generation;
- exact integer counting helpers backed by `bigint` where products are formed;
- one authoritative solver;
- an independent enumeration/search verifier;
- normalized reasoning evidence;
- evidence-driven customized explanations;
- semantic distractor generation;
- package validation;
- coverage/content auditing;
- a bundled 576-seed runtime proof;
- a dedicated GitHub Actions gate.

The family-level end-to-end blueprint is stored in:

```text
PermutationAndCombination/pnc-family-end-to-end-design.md
```

It freezes two packages, 12 canonical problems and 720 planned English QLs.

---

## 2. Implemented Solve Modes

| Solve mode | QLs | Counting authority |
|---|---:|---|
| `countSequentialIndependentChoices` | 14 | Multiplication principle |
| `countMutuallyExclusiveAlternatives` | 10 | Addition principle |
| `countDisjointCasePartition` | 10 | Sum of disjoint case products |
| `countUsingSimpleComplement` | 8 | Unrestricted total minus invalid outcomes |
| `recoverMissingStageChoiceCount` | 6 | Exact factor recovery |
| **Total** | **48** |  |

CP-001 intentionally does not use factorial, `nPr` or `nCr`; those begin in CP-002 and CP-003.

---

## 3. Runtime Architecture

```text
Question library + task registry
        ↓
Deterministic QL selection
        ↓
Curated parameter generation
        ↓
Authoritative exact solver
        ↓
Independent verifier
        ↓
Reasoning evidence
        ↓
Explanation renderer
        ↓
Semantic option generator
        ↓
Package validator
        ↓
Question package
```

### Authority rules

- English stems are owned by `question-language.en.json`.
- QL behavior is owned by `task-registry.library.json`.
- numeric pools are owned by `variable-ranges.library.json`.
- semantic restrictions are owned by `constraint-profiles.library.json`.
- the solver is the sole answer authority.
- explanations and options consume the solver result and evidence.

---

## 4. Main Files Added

### Design and package documents

- `pnc-family-end-to-end-design.md`
- `PNC-001/archetype.md`
- `PNC-001/canonical-problems.md`
- `PNC-001/difficulty-framework.md`
- `PNC-001/reasoning-patterns.md`
- `PNC-001/implementation-plan.md`
- `PNC-001/library-authority-map.md`

### Human-owned libraries

- `question-language.en.json`
- `task-registry.library.json`
- `variable-ranges.library.json`
- `constraint-profiles.library.json`
- `coverage-targets.library.json`
- `distribution-targets.library.json`
- `explanation.en.json`

### Runtime foundation

- `foundation/types.ts`
- `foundation/library.ts`
- `foundation/math.ts`
- `foundation/parameter-generator.ts`
- `foundation/solver.ts`
- `foundation/reasoning-graph.ts`
- `foundation/explanation-renderer.ts`
- `foundation/option-generator.ts`
- `foundation/validator.ts`
- `foundation/pipeline.ts`
- `foundation/coverage-auditor.ts`
- `index.ts`

### Verification

- `pnc-001.test.ts`
- `pnc-001-content-audit.md`
- `.github/workflows/pnc-001-runtime-proof.yml`

---

## 5. Verification Results

The dedicated pull-request workflow checks the PR merge ref against the current `New-main` base.

| Gate | Result |
|---|---|
| Locked dependency installation | PASS |
| Strict targeted TypeScript compilation | PASS |
| esbuild test bundling | PASS |
| CP-001 bundled runtime proof | PASS |
| 48-Ql coverage audit | PASS |
| Determinism | PASS |
| Independent solver agreement | PASS |
| Four unique options | PASS |
| Correct answer exactly once | PASS |
| Placeholder resolution | PASS |
| English-only enforcement | PASS |

Runtime test volume:

- 48 QLs;
- 12 seed cases per QL;
- 576 seed cases total;
- every seed generated twice for exact determinism comparison;
- dedicated method-level assertions for all five solve modes.

### Repository-wide typecheck note

The repository-wide API-server typecheck currently reports pre-existing errors in unrelated database, knowledge-generator, admin and general generation files. The diagnostic output contained no `PermutationAndCombination`/`PNC-001` paths. Therefore, the PNC workflow uses a strict compiler invocation scoped to the new module and its tests; that targeted gate passes.

---

## 6. Safety State

- only `PNC-CP-001` is active;
- `PNC-CP-002` through `PNC-CP-006` are typed/planned but not exposed;
- runtime language is English only;
- Hindi and Punjabi requests fail explicitly;
- `publiclyPublishable` is `false`;
- maturity is `RUNTIME_PROOF`;
- `generation-engine.ts` has not been edited;
- no admin or production routing has been changed.

This keeps P&C safe to develop in parallel with Average and Mensuration.

---

## 7. Known Limits

This checkpoint does not yet include:

- factorials or unrestricted linear permutations;
- combinations;
- digit/number/code formation;
- word/multiset arrangements;
- role assignment;
- any PNC-002 restricted systems;
- Hindi/Punjabi localization;
- generation-engine integration;
- chapter-wide semantic near-duplicate scoring;
- final production/editorial freeze.

---

## 8. Next Checkpoint

Proceed with:

```text
PNC-001 → PNC-CP-002
Distinct Linear Permutations & Positional Assignments
PNC-QL-049 through PNC-QL-102
54 English QLs
```

CP-002 should extend the shared exact-math authority with factorial and permutation helpers while preserving all CP-001 contracts and tests. Generation-engine integration should remain deferred until the full PNC-001 package has passed its chapter-wide audit.