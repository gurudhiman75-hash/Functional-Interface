# Algebra HOLD Resolution — Saturation Pass 01

**Chapter:** Algebra  
**Runtime packages:** `ALG-001`, `ALG-002`  
**Date:** 18 August 2026  
**Status:** SOURCE-SATURATION PASS / NOT A PERMANENT QL FREEZE

## 1. Purpose

This pass resolves HOLDs only where direct target/comparable-exam evidence or strong ownership consolidation is now sufficient. It does not allocate permanent QL IDs.

## 2. New evidence ledger

| ID | Exam provenance | Contract evidence |
|---|---|---|
| `ALG-HR1-S01` | SSC Selection Post 2024, 26 Jun 2024 Shift 2 | direct perfect-square-trinomial recognition: `49a²+70ab+25b²` |
| `ALG-HR1-S02` | SSC CGL 2024 Tier-I, 10 Sep 2024 Shift 3 | recognize `16x²+40x+25` as a perfect square to infer side/perimeter |
| `ALG-HR1-S03` | SSC CGL 2024 Tier-I, 26 Sep 2024 Shift 1 | classify a 2×2 system as no-solution; options also expose infinite/unique states |
| `ALG-HR1-S04` | SSC CGL 2024 Tier-I, 11 Sep 2024 Shift 2 | direct system classification from coefficient ratios |
| `ALG-HR1-S05` | SSC CGL 2022 Tier-II, 6 Mar 2023 | solve parameter `m` so a 2×2 system has no solution |
| `ALG-HR1-S06` | RRB NTPC Graduate CBT-I, 21 Jun 2025 Shift 1 | parameter `k` from a common quadratic root condition |
| `ALG-HR1-S07` | Allahabad High Court Group C, 11 Dec 2022 | direct absolute-value equation `|A|=|B|` with two-solution case split |
| `ALG-HR1-S08` | DSSSB TGT Maths, 23 Sep 2018 Shift 1 | absolute-value polynomial equation and real-solution count |
| `ALG-HR1-S09` | SSC CGL Algebra collection | pairwise-difference-square structure appears inside the standard three-variable cubic identity |

Source URLs:

- S01: https://testbook.com/question-answer/simplify-the-following-expression-49a2-70--66a0be1d1826e3519afa8c2c
- S02: https://testbook.com/question-answer/the-area-of-a-square-is-16x2-40x-25-square-uni--6710c805bb5718bb50971dcb
- S03: https://testbook.com/question-answer/given-a-linear-equation-in-two-variables-5x-7y--67160a8789d8e1f7b500d5d0
- S04: https://testbook.com/question-answer/if-0-4x-0-16y-1-7-and-0-3x-0-12y-3-4-then--6710cc15629e751617aa69d5
- S05: https://testbook.com/question-answer/for-what-value-of-m-will-the-system-of-equations-1--641078fa74d13e8cf0bae602
- S06: https://testbook.com/question-answer/two-quadratic-equations-x2-5x-6-0-and-2x2--687f7deb2a0f6e158eb3a571
- S07: https://testbook.com/question-answer/if-3x-4-2x-5-then-how-many-values-of--6398045d6c31ca10a7b39cce
- S08: https://testbook.com/question-answer/the-number-of-real-solutions-of-equation-x2--60a4cae5456009b42db1ff0c
- S09: https://testbook.com/questions/ssc-algebra-questions--637ef16c74e0cf94c62c13a5

## 3. Resolved HOLDs

### `P-H001 — infer missing coefficient from known evaluation`

**Resolution:** `MERGE_VARIANT / NO STANDALONE CONTRACT`

Reason: mathematically this is a one-variable linear equation in the missing parameter after substitution. Direct target-exam evidence for a separate learner-facing contract remains weak, while CP-005 already owns polynomial parameter-from-remainder conditions. Keep executable coverage, but do not allocate an independent permanent QL.

### `P-H002 — difference of squares from sum/difference givens`

**Resolution:** `MERGE_VARIANT → identity transformation family`

Reason: `a²-b²=(a+b)(a-b)` changes target topology but not the governing identity engine enough to justify a standalone contract without direct saturation evidence. Keep as a generation target under the two-variable identity family.

### `P-H003 — pairwise-difference-square target`

**Resolution:** `MERGE_VARIANT → three-variable symmetric identity family`

Reason: SSC Algebra evidence uses `(a-b)²+(b-c)²+(c-a)²` as part of the canonical cubic identity, but current evidence does not justify a separate standalone target contract. Preserve it as a target/intermediate topology inside three-variable symmetric identities.

### `P-H004 — cyclic reciprocal relation`

**Resolution:** `KEEP_SOURCE_BACKED / OWNER → CP-003`

Reason: Wave-1 source S15 directly establishes the chained reciprocal relation in SSC CGL Tier-2. CP-015 has zero independent permanent contracts and should not own ordinary mathematics. The dominant learner-facing engine is multi-variable algebraic relation/symmetry, so ownership belongs to CP-003 with reciprocal-chain topology metadata.

### `P-H005 — perfect-square trinomial recognition/factorisation`

**Resolution:** `KEEP_SOURCE_BACKED CONTRACT`

Reason: S01 and S02 directly test recognition of a perfect-square trinomial in SSC papers. This is not merely monic/non-monic coefficient state: the tested inference is recognition of the square identity itself. Retain a dedicated identity-form recognition/factorisation contract, while ordinary quadratic factorisation remains separate.

### `CP-006 degenerate one-variable linear classification`

**Resolution:** `ENGINE_ONLY / NO STANDALONE PERMANENT CONTRACT`

Reason: no direct target-exam saturation was found in this pass for one-variable `0x=c` / `0x=0` classification. Correct engine support remains mandatory because it protects solver semantics.

### `CP-006 parameter from known solution`

**Resolution:** `MERGE_VARIANT → one-variable linear equation contract`

Reason: after the known solution is substituted, the tested math is a linear equation in the parameter. Keep reverse-target generation coverage but not a standalone permanent QL unless later direct evidence proves frequency.

### `CP-007 degenerate system classification`

**Resolution:** `KEEP_SOURCE_BACKED CONTRACT`

Reason: S03 and S04 are direct SSC CGL official-paper evidence for unique/no-solution/infinite-solution classification. Treat `UNIQUE | NO_SOLUTION | INFINITE_SOLUTIONS` as answer states of one system-classification contract.

### `CP-007 parameter for consistency/inconsistency`

**Resolution:** `KEEP_SOURCE_BACKED CONTRACT`

Reason: S05 directly asks for the parameter value making an SSC CGL Tier-II system have no solution. Consistent/inconsistent/infinite variants are controlled target states of the same parameterised-system contract.

### `CP-008 standalone excluded-value task / identity-on-domain`

**Resolution:** `ENGINE_OR_VARIANT / NO STANDALONE CONTRACT`

Reason: original-domain preservation is mandatory correctness infrastructure for rational equations, but this pass found no direct target-exam evidence justifying standalone “state the excluded value” or “identity on domain” permanent QLs. Keep domain restrictions as first-class state within rational-equation contracts.

### `CP-009 coefficient from known root`

**Resolution:** `KEEP_PROVISIONAL → quadratic parameter/root-condition contract`

Reason: S06 directly establishes parameter inference from a quadratic common-root condition in RRB NTPC 2025. This supports the broader root-condition parameter contract, but the exact single-known-root topology should remain a variant until more SSC/Banking fixtures are added.

### `CP-013 absolute-value engine`

**Resolution:** `KEEP_SOURCE_BACKED FOR COMPARABLE STATE/RECRUITMENT EXAMS`

Reason: S07 directly tests `|A|=|B|` case splitting and S08 tests an absolute-value polynomial equation. Retain absolute-value equation/inequality contracts in Algebra. SSC/Banking-specific saturation is still desirable, but the family is no longer an evidence-free HOLD.

## 4. Still unresolved after Pass 01

1. surd coefficients in the *input* equations of Banking quadratic comparison;
2. unlike-radicand exact surd comparison;
3. broader Banking/SSC mapping for CP-014 Quantity Comparison beyond category-level evidence;
4. direct target-exam fixture strengthening for CP-006 ordinary linear equations and CP-008 rational equations;
5. final source fixture ledger normalization with exam/date/shift for every retained semantic contract;
6. final cross-contract merge/split matrix and audited permanent-contract count.

## 5. Freeze effect

This pass reduces the unresolved semantic HOLD surface, but **does not authorize permanent IDs**.

- permanent QLs: `0`
- Question Studio: `LOCKED`
- Question Bank / test / public: `LOCKED`
- PR #867: `DRAFT`
