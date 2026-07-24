# PNC-CP-004 Implementation Report

> **Package:** `PNC-001 — Counting Foundations, Basic Permutations & Basic Combinations`  
> **Canonical problem:** `PNC-CP-004 — Digit, Number, Code & Password Formation`  
> **Current CP QLs:** `PNC-QL-083` through `PNC-QL-094`  
> **Branch:** `feat/pnc-cp004-digit-number-code-proof`  
> **Draft stacked PR:** `#96`  
> **Base:** corrected CP-005 multiset checkpoint  
> **Status:** runtime proof complete  
> **Date:** 2026-07-24

## 1. Roadmap Ownership

CP-004 is one of the six fixed ownership boundaries in package PNC-001. Its existence and scope are roadmap-fixed; its QL count, solve modes, difficulty distribution and checkpoint size are need-based.

Adjacent ownership was respected:

- generic ordered selection of distinct symbols remains in CP-002;
- repeated-letter and multiset arrangements remain in CP-005;
- CP-004 owns number/code semantics such as leading zero, repetition, final-digit restrictions, threshold prefixes and mixed letter/digit stages.

## 2. Current Admitted QLs

| QL | Direction |
|---|---|
| `PNC-QL-083` | non-zero digits, no repetition |
| `PNC-QL-084` | zero available, no repetition and leading-zero correction |
| `PNC-QL-085` | repetition-allowed numeric code with leading zero allowed |
| `PNC-QL-086` | repetition-allowed number with leading zero forbidden |
| `PNC-QL-087` | even numbers without zero |
| `PNC-QL-088` | even numbers with zero and two-case split |
| `PNC-QL-089` | odd numbers with zero |
| `PNC-QL-090` | numbers divisible by 5 |
| `PNC-QL-091` | four-digit numbers above a controlled threshold |
| `PNC-QL-092` | fixed-pattern alphanumeric codes |
| `PNC-QL-093` | recover repetition-allowed code alphabet size |
| `PNC-QL-094` | length-four codes with multiplicity pattern `2,1,1` |

The count of 12 is a current coverage result, not a CP quota or ceiling.

## 3. Current Required Solve Modes

- `formNumbersWithoutRepetitionNoZero`;
- `formNumbersWithoutRepetitionWithZero`;
- `formCodesWithRepetition`;
- `formNumbersWithRepetitionAndZero`;
- `formParityNumbersWithoutRepetition`;
- `formDivisibleByFiveNumbersWithoutRepetition`;
- `formNumbersAboveLeadingThreshold`;
- `formAlphanumericCodes`;
- `recoverSymbolCountForCode`;
- `formCodesWithExactlyOnePair`.

## 4. Runtime Delivered

- CP-004-specific human-owned language, registry and explanation companion libraries;
- exact exponentiation through `powerExact`;
- deterministic digit, symbol, slot and threshold generation;
- formula-based production authority;
- independent recursive enumeration of symbol strings;
- explicit number-versus-code and leading-zero semantics;
- parity and divisibility case evidence;
- mixed alphanumeric stage evidence;
- bounded inverse alphabet search;
- multiplicity-pattern construction for exactly one pair;
- semantic distractors and complete package validation.

## 5. Verification

Successful pre-report workflow run: `30078944764`.

| Gate | Result |
|---|---|
| Strict targeted TypeScript compilation | PASS |
| esbuild proof-test bundle | PASS |
| Current 94-QL audit | PASS |
| 1,128 deterministic seed cases | PASS |
| Every seed generated twice | PASS |
| Formula solver / recursive sequence enumeration agreement | PASS |
| Leading-zero semantics | PASS |
| Parity and divisibility case totals | PASS |
| Threshold-prefix reconstruction | PASS |
| Inverse alphabet target reconstruction | PASS |
| Exactly-one-pair multiplicity pattern | PASS |
| Exact duplicate English templates | 0 |

## 6. Safety State

- English only;
- maturity `RUNTIME_PROOF`;
- `publiclyPublishable: false`;
- no generation-engine, admin or production routing changes;
- draft PR remains stacked on the corrected CP-005 branch.

## 7. Remaining CP-004 Review

The current checkpoint may later be expanded only for materially distinct gaps such as divisibility-by-4 suffix logic, compulsory character categories, richer threshold prefixes or additional repetition patterns. No QL or solve-mode allocation is reserved for them.
