# PNC-CP-002 Content Audit

> **Canonical problem:** `PNC-CP-002 — Unrestricted Ordered Arrangements of Distinct Objects`  
> **Current CP QLs:** `PNC-QL-059` through `PNC-QL-066`  
> **Language:** English  
> **Audit status:** PASS for runtime-proof scope  
> **Production-freeze status:** Not applicable  
> **Audit date:** 2026-07-24

---

## 1. Need-Based Interpretation

This audit validates the eight QLs admitted by the CP-002 coverage decision. It does not establish eight as a final CP size and does not reserve future permutation modes.

The audit asks whether every current QL contributes a material direction, whether all three active modes have complete runtime authority, and whether any proposed extension would add coverage rather than a cosmetic context.

---

## 2. Current CP-002 Coverage

| Metric | Current value | Status |
|---|---:|---|
| Active QLs | 8 | PASS |
| Unique QL IDs | 8 | PASS |
| First ID | `PNC-QL-059` | PASS |
| Last ID | `PNC-QL-066` | PASS |
| Missing IDs in admitted range | 0 | PASS |
| Exact duplicate templates | 0 | PASS |

### Difficulty snapshot

| Difficulty | Current count |
|---|---:|
| Easy | 4 |
| Medium | 3 |
| Hard | 1 |

### Solve-mode snapshot

| Mode | Current count |
|---|---:|
| `arrangeAllDistinctObjects` | 3 |
| `arrangeRFromNDistinctObjects` | 3 |
| `recoverPermutationParameter` | 2 |

These values are descriptive only.

---

## 3. Mathematical Contract

Every direct arrangement package enforces:

- objects are distinct;
- order matters;
- repetition is not allowed;
- `1 ≤ r ≤ n`;
- exact answer is `nPr = n!/(n-r)!`;
- arrange-all forms use `r = n` and therefore equal `n!`.

Every inverse package enforces:

- `2 ≤ r ≤ n` for the admitted profiles;
- a bounded exact search;
- a unique target match inside the curated domain;
- reconstruction of the original `nPr` target from the recovered parameter.

### Independent verification

| Family | Production authority | Independent method | Result |
|---|---|---|---|
| Arrange all distinct | exact `nPn` | recursive enumeration of all ordered selections | PASS |
| Arrange `r` from `n` | exact `nPr` | recursive no-repetition ordered enumeration | PASS |
| Recover `n` | bounded exact `nPr` search | bounded enumeration search | PASS |
| Recover `r` | bounded exact `nPr` search | bounded enumeration search | PASS |

Status: **PASS**.

---

## 4. Placeholder and Registry Audit

| Check | Result |
|---|---:|
| Missing required placeholders | 0 |
| Unregistered placeholders | 0 |
| Unresolved stem placeholders | 0 |
| Unresolved explanation placeholders | 0 |
| Missing distractor profiles | 0 |
| QL/CP mismatches | 0 |
| QL/difficulty mismatches | 0 |

QL-directed generation infers the QL’s registered CP. An explicitly conflicting CP remains an error.

Status: **PASS**.

---

## 5. Explanation Audit

Current explanations establish:

1. that the objects and positions are distinct;
2. that order matters;
3. that repetition is prohibited;
4. the values of `n` and `r`;
5. the consecutive factors used by `nPr`;
6. the exact answer or exact inverse match.

Explanations consume solver-owned evidence and do not independently recompute answers.

Status: **PASS**.

---

## 6. Option Audit

Distractors model current misconceptions including:

- using only `r!`;
- treating the task as unordered selection;
- allowing repetition as `n^r`;
- omitting one ordered factor;
- returning a known parameter rather than the missing parameter;
- off-by-one inverse search.

Every sampled question has four unique positive integer options, the correct answer appears once, and `correctIndex` points to it.

Status: **PASS**.

---

## 7. Editorial Audit

The admitted QLs cover standard exam wording for:

- people in a row;
- books on a shelf;
- flag signals;
- no-repetition codes;
- ranked medals;
- distinct offices;
- direct inverse `nPr` equations.

The contexts are not treated as separate mathematical modes. Further noun substitutions are not valid expansion evidence.

Potential future families such as unordered committees, repeated letters, leading-zero number formation, circular arrangements and restrictions remain outside CP-002.

---

## 8. Runtime Sampling

The package-wide proof runs:

- 12 seeds for each of 66 current package QLs;
- 792 seed cases total;
- each seed twice for deterministic comparison;
- dedicated CP-002 operation, evidence, inverse and routing assertions;
- explicit unsupported-language rejection.

Successful pre-report workflow run: `30069922425`.

---

## 9. Conclusion

The current CP-002 scope is deterministic, mathematically exact, independently verified, placeholder-clean, exact-duplicate-free and internally complete for the admitted unrestricted-distinct-permutation directions.

This does not mean CP-002 is numerically frozen. Additional content requires a new documented coverage distinction.