# PNC-CP-006 Implementation Report

> **Package:** `PNC-001 — Counting Foundations, Basic Permutations & Basic Combinations`  
> **Canonical problem:** `PNC-CP-006 — Selection-Then-Arrangement & Role Assignment`  
> **Current CP QLs:** `PNC-QL-095` through `PNC-QL-104`  
> **Branch:** `feat/pnc-cp006-selection-role-assignment-proof`  
> **Draft PR:** `#98`  
> **Status:** runtime proof complete  
> **Date:** 2026-07-24

## 1. Ownership decision

CP-002 already owns direct ordered selection from the complete pool, while CP-003 owns unordered selection. CP-006 owns questions where the selected group remains mathematically visible before a second arrangement or role-assignment stage.

The decisive construction is:

```text
choose s from n, then assign k distinct roles within the selected group
nCs × sPk
```

A direct `nPk` question with no selected-group stage remains CP-002. A selection-only question remains CP-003.

## 2. Admitted QLs

| QL | Direction |
|---|---|
| `PNC-QL-095` | committee then one chairperson |
| `PNC-QL-096` | team then captain and vice-captain |
| `PNC-QL-097` | committee then three distinct offices |
| `PNC-QL-098` | shortlist then ranked awards |
| `PNC-QL-099` | select books then arrange all selected books |
| `PNC-QL-100` | select speakers then assign all to numbered slots |
| `PNC-QL-101` | isolate the role-assignment multiplier |
| `PNC-QL-102` | recover the original pool size |
| `PNC-QL-103` | recover the selected-group size |
| `PNC-QL-104` | recover the number of roles |

Ten QLs were sufficient at current semantic saturation. The count is not a quota or ceiling.

## 3. Solve modes

| Mode | Current QLs | Contract |
|---|---:|---|
| `selectThenAssignDistinctRoles` | 4 | calculate `nCs × sPk` with `1 ≤ k < s < n` |
| `selectThenArrangeAllSelected` | 2 | calculate `nCs × s!` and verify equality with `nPs` |
| `findRoleAssignmentMultiplier` | 1 | isolate `sPk` after a fixed selected group |
| `recoverSelectionRoleParameter` | 3 | bounded unique recovery of `n`, `s` or `k` |

One-chair, two-office and three-office contexts reuse one direct mixed mode because their evidence and invariants are identical.

## 4. Runtime delivered

- CP-006-specific human-owned QL, registry and explanation libraries;
- deterministic mixed pool/selection/role generation;
- uniqueness-filtered inverse selected-group states;
- exact `nCs × sPk` mathematical authority;
- explicit `nCs × s! = nPs` bridge;
- recursive subset enumeration followed by ordered role assignment;
- dedicated CP-006 solver, explanation, option, reasoning and validator modules;
- canonical-problem routers that preserve the existing CP-001–005 runtime;
- semantic distractors for selection-only, assignment-only, additive and wrong-order misconceptions;
- independent validation of formula stages, domains and inverse uniqueness.

## 5. Verification

Workflow run `30083673548` passed:

| Gate | Result |
|---|---|
| Strict targeted TypeScript compilation | PASS |
| esbuild proof-test bundle | PASS |
| Current 104-QL coverage audit | PASS |
| 1,248 deterministic seed cases | PASS |
| Every seed generated twice | PASS |
| Formula solver / recursive verifier agreement | PASS |
| `nCs × s! = nPs` identity | PASS |
| Unique inverse reconstruction | PASS |
| Four unique positive options | PASS |
| Placeholder resolution | PASS |
| Exact duplicate English templates | 0 |

## 6. Current PNC-001 checkpoint

- active CPs: 6;
- English QLs: 104;
- active solve modes: 34;
- observed difficulty: 39 Easy / 44 Medium / 21 Hard;
- language: English only;
- `publiclyPublishable: false`;
- no generation-engine, admin or production routing.

## 7. Next action

All six PNC-001 CP ownership boundaries now have runtime coverage. The next action is a package-wide saturation and freeze-readiness audit before PNC-002 begins with CP-007.
