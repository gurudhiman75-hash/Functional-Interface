# PNC-001 CP-001 Implementation Report

> **Package:** `PNC-001 — Permutation & Combination Core`  
> **Implemented checkpoint:** `PNC-CP-001 — Fundamental Counting Principle, Case Partition & Factorial Reasoning`  
> **Current QL range:** `PNC-QL-001` through `PNC-QL-058`  
> **Branch:** `feat/pnc-001-cp001-runtime-proof`  
> **Draft PR:** `#87`  
> **Implementation status:** Runtime proof complete for current admitted scope  
> **Date:** 2026-07-24

---

## 1. Need-Based Governance

The governing design fixes architecture and quality rules, not a final corpus size.

- no fixed final QL count;
- no fixed QLs per CP;
- no reserved terminal QL ID;
- no fixed final CP or package count;
- no predeclared future solve modes;
- no mandatory difficulty percentage;
- new artifacts are admitted only for demonstrated coverage/runtime need.

The current 58 QLs and ten active solve modes are checkpoint observations. They are not quotas or limits for future work.

---

## 2. Coverage Decision

A reference/PYQ-oriented gap review found factorial reasoning missing from the original 48-QL CP-001 runtime proof. The uploaded SSC references consistently place factorial definition, `0!`/`1!`, cancellation and inverse factorial questions immediately after fundamental counting principles and before full permutation/combination applications.

The decision was therefore to extend the existing CP rather than create a new CP. Ten materially distinct QLs were admitted as `PNC-QL-049` through `PNC-QL-058`. Full permutation, combination, word, digit, circular and grouping modes remain deferred until separate coverage decisions justify them.

The evidence and ownership decision are recorded in `pnc-001-coverage-gap-matrix.md`.

---

## 3. Delivered Scope

The checkpoint currently contains:

- 58 human-authored English QLs;
- observed difficulty distribution of 27 Easy, 22 Medium and 9 Hard;
- ten active solve modes required by admitted QLs;
- five newly admitted factorial solve contracts;
- human-owned task registry, variable ranges, constraints and explanation strategies;
- deterministic seeded parameter generation;
- exact `bigint`-backed products, factorials and factorial quotients;
- one authoritative solver;
- independent enumeration, recursion, range-product and bounded-search verification;
- normalized reasoning evidence;
- evidence-driven customized explanations;
- semantic distractor generation;
- package validation and coverage auditing;
- a bundled 696-seed runtime proof;
- a dedicated GitHub Actions gate.

---

## 4. Active Solve Modes

| Solve mode | Current QLs | Authority |
|---|---:|---|
| `countSequentialIndependentChoices` | 14 | Multiplication principle |
| `countMutuallyExclusiveAlternatives` | 10 | Addition principle |
| `countDisjointCasePartition` | 10 | Sum of disjoint case products |
| `countUsingSimpleComplement` | 8 | Unrestricted total minus invalid outcomes |
| `recoverMissingStageChoiceCount` | 6 | Exact factor recovery |
| `evaluateFactorialValue` | 2 | Exact factorial definition |
| `evaluateFactorialUnitExpression` | 2 | `0! = 1! = 1` with exact expression evaluation |
| `simplifyFactorialQuotient` | 3 | Consecutive-factor cancellation |
| `recoverFactorialArgument` | 2 | Bounded exact factorial inverse search |
| `recoverFactorialQuotientArgument` | 1 | Transform and solve `n(n - 1) = target` |
| **Total** | **58** |  |

These modes exist because current QLs require distinct solver/evidence/validator contracts. No future `nPr`, `nCr`, multiset, digit or circular modes are declared.

---

## 5. Runtime Architecture

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
- QL behaviour is owned by `task-registry.library.json`;
- numeric pools are owned by `variable-ranges.library.json`;
- semantic restrictions are owned by `constraint-profiles.library.json`;
- the solver is the sole answer authority;
- explanations and options consume solver result/evidence.

---

## 6. Verification Results

| Gate | Result |
|---|---|
| Locked dependency installation | PASS |
| Strict targeted TypeScript compilation | PASS |
| esbuild test bundling | PASS |
| CP-001 bundled runtime proof | PASS |
| Current 58-QL coverage snapshot | PASS |
| Determinism | PASS |
| Independent solver agreement | PASS |
| Four unique options | PASS |
| Correct answer exactly once | PASS |
| Placeholder resolution | PASS |
| English-only enforcement | PASS |

Runtime volume:

- 58 current QLs;
- 12 seed cases per QL;
- 696 seed cases total;
- every seed generated twice for deterministic comparison;
- method-level assertions for all ten active solve modes.

Successful factorial-extension PNC workflow run: `30068306106` on head `517e8909a583cf0ae7b2738f6cb65bea1da84b0c`.

The repository-wide API-server typecheck has unrelated pre-existing failures outside P&C. The PNC workflow uses a strict targeted compiler invocation covering this module and its tests; that gate passes.

---

## 7. Safety State

- only `PNC-CP-001` exists in runtime types;
- runtime language is English only;
- Hindi and Punjabi requests fail explicitly;
- `publiclyPublishable` is `false`;
- maturity is `RUNTIME_PROOF`;
- `generation-engine.ts` has not been edited;
- no admin or production routing has changed.

---

## 8. Next Decision

There is no automatic next CP number or predetermined QL range.

The next checkpoint starts with a fresh coverage-gap review. Current deferred high-value families include unrestricted ordered arrangements (`nPr`) and unordered selections (`nCr`), but neither receives a CP ID, QL count or solve-mode inventory until the review determines ownership and exact need.

Expansion stops at semantic saturation, not at a planned count.