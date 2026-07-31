# CLS-CP-005 — Editorial V2 Explanation Audit

Status: `RULE_AWARE_EDITORIAL_LAYER_IMPLEMENTED__VALIDATION_PENDING`

## 1. Problem closed by this audit

The discovery runtime previously exposed canonical diagnostic summaries directly in learner-facing explanation fields. The most visible failures were:

- all three pairwise sums for `TRIPLE_SUM_OF_TWO_EQUALS_THIRD`;
- all three pairwise products for `TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD`;
- all three standalone squares for `TRIPLE_PYTHAGOREAN_DIRECTION`;
- debug-style `compare ... with ...` wording for geometric progression;
- generic conclusion wording such as `gives a different result` and `the other options give different values`.

Those forms remain acceptable only as internal solver evidence. They are prohibited at the learner-facing editorial boundary.

## 2. Package-boundary architecture

The canonical discovery runtime remains responsible for:

- tuple construction;
- intended rule selection;
- canonical rule values;
- ambiguity audits;
- independent verification;
- answer semantics.

`editorial-runtime.ts` now transforms the accepted canonical state into learner-facing content. It does not alter tuples, answers, intended rules, difficulty or lifecycle locks.

```text
canonical discovery question
  -> rule-aware editorial renderer
  -> presentation-quality gate
  -> review export
```

## 3. Exact engine template rules

### 3.1 Active-relation-only rule

For a position-sensitive tuple relation, render only the equation required by the intended position signature.

Examples:

```text
AB_TO_C -> first operation second = third
AC_TO_B -> first operation third = middle
BC_TO_A -> second operation third = first
```

The renderer must not print unused pairwise calculations.

### 3.2 Explicit option status

Every answer option receives exactly one status:

```text
✅ Matches rule.
❌ Fails rule; <explicit target failure>.
```

For odd-tuple questions, all non-answer options match and the answer fails.
For equivalent-set questions, only the answer matches and all distractors fail.

### 3.3 Failure-detail rule

A failed position-sensitive equation must state:

- the active calculation;
- the calculated result;
- the displayed target;
- the expected target when useful.

Example:

```text
\( 31 \times 10 = 310 \ne 22 \)
— ❌ Fails rule; middle number should be 310, not 22.
```

### 3.4 Geometric-progression rule

Use the geometric-mean identity only:

```text
\( \text{Middle}^2 = \text{First} \times \text{Third} \)
```

For a valid triple, show the two targeted values and optionally the reduced common ratio. Do not use debugging prose such as `compare X with Y`.

### 3.5 Pythagorean fixed-position rule

The same positions must retain the same roles in every option.

If the intended signature is:

```text
BC_TO_A -> \( \text{Second}^2 + \text{Third}^2 = \text{First}^2 \)
```

then `(9, 31, 18)` must be checked as:

```text
\( 31^2 + 18^2 = 1285 \ne 9^2 = 81 \)
```

It must not be rewritten as `18² + 9² ≠ 31²`, because that changes the target position and weakens the classification proof.

### 3.6 Math-format rule

All learner-facing arithmetic expressions use ExamTree's canonical inline MathJax delimiters:

```text
\( ... \)
```

Raw visible `²`, `³`, `×` and `≠` are prohibited in generated explanation text. Internal solver fields may remain delimiter-free.

### 3.7 Explanation-summary rule

The step-by-step conclusion may summarise which options pass and fail, but it must not repeat diagnostic phrases such as:

```text
gives a different result
the other options give different values
it matches the intended rule
it does not match the intended rule
```

The detailed option evidence already explains the mathematical reason.

## 4. Automated audit coverage

`editorial.test.ts` verifies the exact 60-question review sample and enforces:

- all 18 admitted rules represented;
- balanced inline MathJax delimiters;
- one explicit status per option;
- answer-status parity for odd and equivalent-set tasks;
- one active sum equation for positional triple-sum items;
- one active product equation for positional triple-product items;
- one active square-sum equation for Pythagorean items;
- no raw diagnostic-array wording;
- no raw visible mathematical symbols outside LaTeX;
- exact regression examples for sum, product, GP and Pythagorean templates.

## 5. Lifecycle

```text
Permanent QLs:              0
Question Studio exposure:   disabled
Question Bank storage:      disabled
Test eligibility:           disabled
Public publication:         disabled
```

Editorial improvement does not freeze CP-005 or allocate any permanent QL identity.
