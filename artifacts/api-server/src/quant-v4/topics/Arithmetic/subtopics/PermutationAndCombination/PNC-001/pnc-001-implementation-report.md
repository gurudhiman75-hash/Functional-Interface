# PNC-001 CP-001 Implementation Report

> **Package:** `PNC-001 — Permutation & Combination Core`
> **Implemented checkpoint:** `PNC-CP-001 — Fundamental Counting Principle & Case Partition`
> **Current QL range:** `PNC-QL-001` through `PNC-QL-048`
> **Branch:** `feat/pnc-001-cp001-runtime-proof`
> **Draft PR:** `#87`
> **Implementation status:** Runtime proof complete
> **Date:** 2026-07-24

---

## 1. Need-Based Design Amendment

The original draft incorrectly treated a projected family size, CP inventory and solve-mode inventory as fixed in advance. That assumption has been removed.

The governing design now states:

- no fixed final QL count;
- no fixed QLs per CP;
- no reserved terminal QL ID;
- no fixed final CP or package count;
- no predeclared future solve modes;
- no mandatory difficulty percentage;
- new artifacts are admitted only for demonstrated coverage/runtime need.

The 48 QLs and five solve modes in this report describe the current implemented checkpoint. They are not quotas or limits for future work.

---

## 2. Delivered Scope

The checkpoint currently contains:

- 48 human-authored English QLs;
- observed difficulty distribution of 22 Easy, 18 Medium and 8 Hard;
- five solve modes required by the admitted CP-001 QLs;
- human-owned task registry, variable ranges, constraints and explanation strategies;
- deterministic seeded parameter generation;
- exact integer counting helpers backed by `bigint` where products are formed;
- one authoritative solver;
- an independent enumeration/search verifier;
- normalized reasoning evidence;
- evidence-driven customized explanations;
- semantic distractor generation;
- package validation and coverage auditing;
- a bundled 576-seed runtime proof;
- a dedicated GitHub Actions gate.

---

## 3. Active Solve Modes

| Solve mode | Current QLs | Counting authority |
|---|---:|---|
| `countSequentialIndependentChoices` | 14 | Multiplication principle |
| `countMutuallyExclusiveAlternatives` | 10 | Addition principle |
| `countDisjointCasePartition` | 10 | Sum of disjoint case products |
| `countUsingSimpleComplement` | 8 | Unrestricted total minus invalid outcomes |
| `recoverMissingStageChoiceCount` | 6 | Exact factor recovery |

These modes exist because current QLs require distinct solver/evidence contracts. Future modes will be added only with the first approved QL family that needs them.

CP-001 intentionally does not use factorial, `nPr` or `nCr` because no admitted CP-001 QL requires them.

---

## 4. Runtime Architecture

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

Authority rules:

- English stems are owned by `question-language.en.json`;
- QL behavior is owned by `task-registry.library.json`;
- numeric pools are owned by `variable-ranges.library.json`;
- semantic restrictions are owned by `constraint-profiles.library.json`;
- the solver is the sole answer authority;
- explanations and options consume solver result/evidence.

---

## 5. Verification Results

| Gate | Result |
|---|---|
| Locked dependency installation | PASS |
| Strict targeted TypeScript compilation | PASS |
| esbuild test bundling | PASS |
| CP-001 bundled runtime proof | PASS |
| Current 48-QL coverage snapshot | PASS |
| Determinism | PASS |
| Independent solver agreement | PASS |
| Four unique options | PASS |
| Correct answer exactly once | PASS |
| Placeholder resolution | PASS |
| English-only enforcement | PASS |

Runtime volume:

- 48 current QLs;
- 12 seed cases per QL;
- 576 seed cases total;
- every seed generated twice for deterministic comparison;
- method-level assertions for all five active solve modes.

The repository-wide API-server typecheck has unrelated pre-existing failures outside P&C. The PNC workflow therefore uses a strict targeted compiler invocation covering the new module and tests; that gate passes.

---

## 6. Safety State

- only `PNC-CP-001` exists in runtime types;
- runtime language is English only;
- Hindi and Punjabi requests fail explicitly;
- `publiclyPublishable` is `false`;
- maturity is `RUNTIME_PROOF`;
- `generation-engine.ts` has not been edited;
- no admin or production routing has changed.

---

## 7. Next Decision

There is no automatic next CP number or predetermined QL range.

The next checkpoint begins with a coverage-gap review of reference books, PYQs and current motif/scenario code. That review decides:

- the highest-value uncovered family;
- whether it belongs in CP-001 or needs a new CP;
- how many genuinely distinct QLs are needed;
- which new solve modes, if any, are required;
- the solver, evidence, explanation, distractor and validator contracts.

Expansion stops at semantic saturation, not at a planned count.
