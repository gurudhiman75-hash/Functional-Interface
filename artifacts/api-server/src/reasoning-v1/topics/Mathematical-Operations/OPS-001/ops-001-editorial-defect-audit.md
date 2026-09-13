# ExamTree Reasoning V1 — OPS-001 Editorial Defect Audit

Status: **manual-review bundle v1 rejected; CP freeze remains blocked.**

## Trigger

Manual review found that several questions used unclear or incorrect interchange scopes and that mapping explanations did not visibly replace the supplied symbols before calculation.

## Measured defects in the rejected export

```text
mapping explanations whose replacement step repeated the original expression: 50
retained English questions using a one-sided operator "interchange":          43
sampled CP-001 identity/many-to-one mapping judged editorially misleading:     1
```

The arithmetic solver could still reach the keyed answer in many of these instances. That is not sufficient for publication. A mathematically solvable item can still fail ExamTree's editorial and teaching contract.

## Root causes

1. `solveWithMapping` evaluated mapped semantic tokens but the explanation renderer printed `transformedTokens`, which represented only pre-mapping display transformations. The mapped expression therefore appeared unchanged.
2. Some pilot blueprints allowed an operator pair even when one member did not occur in the source expression. That produced a one-way replacement while the stem called it an interchange.
3. Explanation templates often jumped from the original expression directly to the final value and did not expose the replacement key, transformed expression or precedence calculation.
4. The first manual export did not include hard editorial checks for visible two-way interchange or visible substitution.

## Correct editorial contract

Every supplied-mapping explanation must show:

```text
1. replacement key
2. original expression
3. fully substituted expression
4. multiplication/division calculations
5. addition/subtraction calculations
6. final conclusion
```

Every interchange question must satisfy:

```text
- both identities occur in the original expression/equation;
- the transformation is simultaneous and two-way;
- every occurrence is transformed;
- the transformed expression/equation is displayed;
- complete-pool uniqueness is checked for identify-the-pair tasks.
```

Whole-number swaps and digit-identity swaps must use separate wording and traces.

## Corrected manual-review export

A replacement bundle was generated with:

```text
English consolidated records: 310
English pre-merge records:     340
Hindi representative records:  48
Punjabi representative records:48
Total corrected records:       436
```

Corrected-export audits:

```text
duplicate option groups:                 0
records without exactly one correct key: 0
correct-index/answer mismatches:          0
visible-substitution audit failures:      0
one-sided interchange audit failures:     0
```

## Freeze verdict

```text
MANUAL_REVIEW_BUNDLE_V1       = REJECTED
CORRECTED_EDITORIAL_EXPORT    = READY_FOR_MANUAL_REVIEW
RAW_PILOT_GENERATORS          = REQUIRE_PORTING_OF_ACCEPTED_FIXES
PERMANENT_QL_ALLOCATION       = BLOCKED
CP_FREEZE                      = BLOCKED
PRODUCTION_WIRING              = BLOCKED
```

The corrected review content must be manually accepted before the fixes are ported into permanent CP generators.