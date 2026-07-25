# ANA-CP-004 Runtime Review Resolution

## Accepted critical findings

### QL-115 / QL-116 — parameter scope

`SET_PRODUCT_ADJUST` keeps one constant for the complete generated question. The same context is used for both the source and target sets. Different seeds may select different constants, which is intended runtime variety rather than an inconsistency within a question.

The rule label now explicitly states that the value is the question's fixed constant, while both worked substitutions display the actual selected constant.

### QL-131 / QL-132 — unused second member

The former `SET_RATIO_PRESERVING` rule has been removed.

The QL IDs are retained but now use:

- `SET_SUM_MULTIPLIER`
- formula: `(a + b) × k = c`

Both input members now contribute to the result.

### QL-133 / QL-134 — unused first member

The former `SET_FACTOR_MULTIPLE` rule has been removed.

The QL IDs are retained but now use:

- `SET_DIFF_MULTIPLIER`
- formula: `|a - b| × k = c`

Both input members now contribute to the result.

## Expansion assessment

The proposed additional families are valuable, but they should not be inserted by silently extending CP-004 beyond its audited `ANA-QL-109`–`ANA-QL-140` range until the chapter manifest confirms that later IDs are unreserved.

High-priority candidates for a dedicated number-set expansion checkpoint are:

1. `SET_CUBE_SUM`
2. `SET_CUBE_DIFFERENCE`
3. `SET_DIVISION_RATIO`
4. `SET_SUM_DIVISOR`
5. `SET_SUM_SQUARE`
6. `SET_DIFF_SQUARE`
7. `SET_DIGIT_SUM_RELATION`
8. `SET_GEOMETRIC_PROGRESSION`
9. `SET_MIDDLE_AVERAGE`
10. `SET_PRODUCT_DIVISOR`

`SET_DIFF_MULTIPLIER` is already incorporated through QL-133/134.

## Admission rules for expansion

A proposed family should be admitted only when:

- every displayed member has a mathematical role;
- integer-safe parameter domains can be enforced;
- the independent solver can recompute the answer;
- the full eligible rule pool does not produce an equal-or-simpler explanation;
- all four options remain independently single-answer safe;
- output bounds remain suitable for SSC, Banking, and Punjab exams;
- the family adds genuinely different reasoning rather than a cosmetic variant of an existing rule.

## Current CP-004 status

After these corrections, CP-004 retains:

- 32 stable QL IDs;
- 16 rule families;
- no intentional dummy members;
- seed-varying but question-fixed parameters;
- four layouts;
- three difficulty bands;
- variable displayed missing positions;
- independent ambiguity and option validation.
