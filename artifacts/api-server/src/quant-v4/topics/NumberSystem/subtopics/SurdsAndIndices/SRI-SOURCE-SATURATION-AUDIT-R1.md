# SRI Source Saturation Audit — R1

**Chapter:** Surds & Indices  
**Packages:** SRI-001 / SRI-002  
**State:** SOURCE_SATURATION_R1_FREEZE_PREP  
**Permanent QLs:** 0  
**Frozen solve modes:** 0

## 1. Purpose

This audit tests whether the executable discovery corpus is broad enough to begin merge/split closure and English review. It does **not** allocate permanent QLs. A source example creates a new provisional family only when it changes the learner-task contract, domain/admissibility burden, exact answer semantic, verification path or misconception contract. Number changes, cosmetic wording and equivalent object families remain object-pool work.

## 2. Executable baseline entering R1

| Checkpoint | Families before R1 additions |
|---|---:|
| SRI-CP-001 | 8 |
| SRI-CP-002 | 11 |
| SRI-CP-003 | 6 |
| SRI-CP-004 | 7 |
| SRI-CP-005 | 9 |
| SRI-CP-006 | 7 |
| SRI-CP-007 | 6 |
| SRI-CP-008 | 8 |
| SRI-CP-009 | 9 |
| SRI-CP-010 | 6 |
| SRI-CP-011 | 9 |
| SRI-CP-012 | 5 |
| **Total** | **91** |

## 3. Current exam-source gap findings and dispositions

### A. Finite surd-sum comparison — ADD / EXPAND

Observed current SSC-oriented source pattern compares expressions such as `√6+√2` and `√5+√3` by squaring both positive sums and comparing cross terms. The learner burden is not single-surd comparison: the solver must preserve the rational parts and compare the resulting surd cross terms.

**Disposition:** add `C011-J` under SRI-CP-011 as `EXPAND`.  
**Reason:** materially different comparison topology from C011-A/B/C; source-backed and exact-verification friendly.

### B. Condition under which `√x+√y=√(x+y)` holds — ADD / SOURCE_GATED

Observed prep-source pattern asks for the condition that makes the normally false distribution-like identity true. Squaring gives `x+y+2√xy=x+y`, hence `xy=0` for non-negative variables.

**Disposition:** add `C008-I` under SRI-CP-008 as `SOURCE_GATED`.  
**Reason:** inverse/condition target and misconception contract differ from ordinary forward arithmetic; corroboration is not yet strong enough for release-bound retention.

### C. Simultaneous `√x+√y` and `√x−√y` equations — MOVE

Observed exam-style pattern gives both sum and difference and asks for `x,y`.

**Disposition:** MOVE to Algebra.  
**Reason:** simultaneous-equation elimination dominates; the radicals are only a substitution wrapper.

### D. Deep nested perfect-root evaluation chains — MOVE

Observed nested expressions repeatedly evaluate exact inner roots before ordinary arithmetic.

**Disposition:** MOVE to Simplification & Approximation when the tested burden is procedural BODMAS/nested evaluation.  
**Boundary:** true denesting `√(A±2√B)` remains SRI-CP-010.

### E. Terminating-decimal rational bases with fractional indices — OBJECT-POOL EXPANSION

Observed patterns include exact decimals such as `(0.008)^(1/3)`.

**Disposition:** EXPAND C002-C/C002-F surface/object pools; no new QL.  
**Reason:** canonical task remains exact rational-base fractional-index evaluation.

### F. Cubic / biquadratic / higher-index radical classification — OBJECT-POOL EXPANSION

Observed material classifies radicals beyond square roots.

**Disposition:** EXPAND C007-D index/object pool beyond only square/cube presentations; no new QL.  
**Reason:** learner contract is still exact-power test → rational vs surd classification.

### G. Reciprocal/conjugate transformed targets from `x=a±b√d` — OBJECT/TARGET EXPANSION

Observed official/past-paper patterns ask `x+1/x`, `x²+1/x²`, or `√x±1/√x` for conjugate-friendly values such as `3±2√2`.

**Disposition:** retain CP011-F and broaden supported target surfaces where the conjugate/surd step remains dominant.  
**Boundary:** long recurrence chains such as very high powers of `x±1/x` MOVE to Algebra.

### H. Complex rationalisation with coefficient recovery — COVERED

Observed patterns rationalise one or more terms, identify `a+b√m`, then recover coefficients or evaluate a target from them.

**Disposition:** covered by CP009-F/G/H; expand object pool only if new coefficient geometries appear.

### I. Negative fractional powers on rational bases — COVERED

Observed patterns such as a rational base raised to a negative fractional index are covered by CP002-E/G. Decimal rendering may expand surfaces, but the solve contract is already executable.

### J. Denesting `√(A±2√B)` — COVERED

Observed denesting questions are covered by CP010-A/B plus inverse/recovery C010-C/D/E.

### K. Mixed radical/index expressions — COVERED

Observed expressions requiring both rational-index and radical normalization map to CP012-A..E. Long BODMAS chains remain owned by Simplification.

### L. Infinite/repeating radical fixed point — KEEP SOURCE_GATED

C010-F remains executable but source-gated. It is not eligible for permanent allocation until target-exam corroboration is strong enough.

## 4. R1 provisional corpus after additions

R1 adds exactly two executable candidates without changing historical phase-wave counts:

- `C008-I` — SOURCE_GATED condition identity
- `C011-J` — EXPAND finite surd-sum comparison

New cumulative counts:

- SRI-001: **48**
- SRI-002: **45**
- Chapter total: **93**

No permanent QL or frozen solve-mode count changes.

## 5. Remaining freeze-prep work

R1 is **not yet no-known-gap evidence**. Before a permanent proposal:

1. run the chapter-wide 93-family executable saturation gate;
2. expand C007-D higher-index classification objects;
3. expand C002 fractional-index exact-decimal surfaces;
4. audit CP011-F target depth and keep Algebra-owned recurrence forms out;
5. run pairwise merge/split review across all 93 candidates;
6. run cross-chapter collision closure against Algebra, Number System, Simplification and Data Sufficiency;
7. quantify stem/state/answer diversity and near-duplicate risk;
8. create an English representative review corpus;
9. obtain explicit human approval before allocating any permanent IDs.

## 6. Freeze verdict

**DO NOT FREEZE.**  
**DO NOT allocate permanent QLs yet.**  
**DO NOT enable Question Studio production generation, Question Bank writes, test eligibility or public publication.**

R1 is a saturation-and-compression wave only.
