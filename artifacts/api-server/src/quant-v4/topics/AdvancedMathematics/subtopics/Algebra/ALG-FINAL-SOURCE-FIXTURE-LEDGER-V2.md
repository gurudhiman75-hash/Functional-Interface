# Algebra Final Source Fixture Ledger V2

**Authority target:** `F-C001..F-C043`  
**Status:** `V2_FIXTURE_NORMALIZED`  
**Date:** 18 August 2026

This V2 ledger supersedes using the V1 40-contract source ledger as final authority. V1 evidence for `F-C001..F-C040` remains valid; V2 adds explicit current-PYQ evidence for the three appended contracts and records the final cubic-solver disposition.

---

## 1. V1 evidence carry-forward

Contracts `F-C001..F-C040` retain their source paths from:

- `ALG-SOURCE-PYQ-AUDIT-WAVE01-CP001-CP005.md`
- Wave-2 source/PYQ authority and remediation files
- `ALG-SOURCE-PYQ-AUDIT-WAVE03-CP012-CP015.md`
- `ALG-HOLD-RESOLUTION-PASS-01.md`
- `ALG-HOLD-RESOLUTION-PASS-02.md`
- `ALG-FINAL-SOURCE-FIXTURE-LEDGER.md`

No V1 source-backed contract is removed in V2.

---

## 2. New V2 source fixtures

### `F-C041 / ALG-QL-041` — unique 3×3 linear system

Direct target-exam evidence:

- `ALG-V2-S01` — SSC CGL 2024 Tier-I Official Paper, 10 Sep 2024 Shift 2: solve `x+y+z=12`, `x+y-z=6`, `x-y+z=4`.
- `ALG-V2-S02` — SSC CGL 2024 Tier-I Official Paper, 12 Sep 2024 Shift 3: solve a full nontrivial 3×3 system.
- `ALG-V2-S03` — SSC CHSL 2024 Tier-I Official Paper, 03 Jul 2024 Shift 3: solve a full 3×3 system.
- `ALG-V2-S04` — RRB JE CBT 1 2025 Official Paper, held 19 Feb 2026 Shift 1: solve a full 3×3 system with rational solution.

Evidence level: `DIRECT_PYQ`.

URLs:
- https://testbook.com/question-answer/find-the-values-of-x-y-and-z-so-as-to-satisfy-th--6710c78ee77f2a0d93d4d48f
- https://testbook.com/question-answer/find-the-values-of-x-y-and-z-so-as-to-satisfy-th--6710cecb675ce088ea48df7b
- https://testbook.com/question-answer/solve-the-following-system-of-linear-equations-x--66a2674ec285828efda9c179
- https://testbook.com/question-answer/solve-the-following-linear-equations-2x-3y--69ae703f0c88b267e7d2e138

### `F-C042 / ALG-QL-042` — direct cubic Vieta invariant

Direct target-exam evidence:

- `ALG-V2-S05` — SSC CGL 2025 Tier-I, held 18 Sep 2025 Shift 1: cubic coefficients → sum of three roots.
- `ALG-V2-S06` — RRB NTPC Graduate CBT-I Official Paper, 21 Jun 2025 Shift 3: cubic coefficients → sum of pairwise root products.

The same direct Vieta contract supports the product-of-roots invariant as another coefficient-target state.

Evidence level: `DIRECT_PYQ`.

URLs:
- https://testbook.com/question-answer/if-the-cubic-equation-a-4a-5a-2--690b22cab5904ecb896dc387
- https://testbook.com/question-answer/given-the-cubic-equation-x3-3x2-4x-min--6878fdc0a88d90f5052e6b2b

### `F-C043 / ALG-QL-043` — positive-variable fixed-sum symmetric extremum

Direct/comparable evidence:

- `ALG-V2-S07` — SSC CGL 2024 Tier-I Official Paper, 09 Sep 2024 Shift 3: for positive `x,y,z` with fixed sum, find least reciprocal sum.
- `ALG-V2-S08` — OSSC CGLRE Mains 2024: fixed positive sum → minimum square sum.

Evidence level: `DIRECT_PYQ / COMPARABLE_PYQ`.

URL:
- https://testbook.com/question-answer/if-x-y-and-z-are-positive-numbers-and-x-y-z--670503d014ddc2bd7041d893

---

## 3. Apparent cubic-solving gap disposition

`ALG-V2-S09` — SSC MTS 2025 Official Paper, held 10 Feb 2026 Shift 2 asks a positive number whose sum with its cube is 68.

This is retained in executable coverage as CP-015 composition candidate `ALG-CP015-CAND-007`:

- positive-integer domain is explicit;
- polynomial root is verified exactly;
- bounded positive-integer uniqueness is independently scanned;
- it does not create a general cubic-formula solver.

Source URL:
- https://testbook.com/question-answer/the-sum-of-a-positive-number-and-its-cube-is-68-w--69bcf1144ed2d4d2b279d3bb

Evidence from current SSC/Railway scans supports repeated cubic **Vieta/invariant** tasks, but not a stable general cubic-solving family comparable to the quadratic solving contract. Therefore S09 expands composition coverage, not permanent QL count.

---

## 4. Evidence-free check

Result: **0 of 43 retained contracts lacks an evidence path.**

Evidence quality remains explicit: some V1 contracts are target-taxonomy or comparable-recruitment backed; V2 additions F-C041 and F-C042 have direct target-exam official-paper support, while F-C043 has direct SSC plus comparable state evidence.

Representation states inherit the evidence of their owning semantic contract and do not require one source fixture per numeric/surface form.