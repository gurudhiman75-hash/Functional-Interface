# Statistics — STAT-007 Correlation and Regression Review V1

**Status:** English representative review candidate; awaiting editorial approval.
**Profiles:** SSC CGL Tier II and JSO. **Lifecycle:** controlled review only.

Population divisor n is used for displayed paired observations. Rank-based coefficients use the shown ranks. Three-variable coefficients use the formula stated in each question.

## STAT-QL-070 — Scatter diagram trend

**Semantic contract:** SCATTER_DIAGRAM_TREND

In a scatter diagram, the plotted points rise from lower left to upper right. What is the direction of association?

A. Perfect association
B. Positive association
C. No linear association
D. Negative association

**Answer:** B. Positive association

**Explanation:** Read the overall direction of the point cloud. The points rise from lower left to upper right, indicating positive association.

## STAT-QL-071 — Pearson correlation from paired data

**Semantic contract:** PEARSON_FROM_RAW_PAIRS

Find Pearson's correlation coefficient for the paired observations X = 2, 4, 6, 8, 10 and Y = 1, 2, 3, 4, 5.

A. 1
B. 0.65
C. 0.5
D. 0.8

**Answer:** A. 1

**Explanation:** Use r = Cov(X,Y)/(σXσY), with population divisor n for these displayed pairs. The covariance is 4, while σX = 2.83 and σY = 1.41. Thus r = 1.

## STAT-QL-072 — Pearson correlation from covariance and standard deviations

**Semantic contract:** PEARSON_FROM_COVARIANCE

For two variables, covariance = 6, σX = 5, and σY = 4. Find Pearson's r.

A. 0.3
B. 0.1
C. -0.05
D. 0.45

**Answer:** A. 0.3

**Explanation:** r = Cov(X,Y)/(σXσY) = 6/(5 × 4) = 0.3.

## STAT-QL-073 — Meaning and bounds of the correlation coefficient

**Semantic contract:** CORRELATION_BOUNDS

A data set has Pearson's correlation coefficient r = -0.6. Which interpretation is correct?

A. Negative linear correlation
B. Perfect positive correlation
C. Zero linear correlation
D. Positive linear correlation

**Answer:** A. Negative linear correlation

**Explanation:** Pearson's r lies between −1 and 1. Its sign gives the direction; r = -0.6 therefore indicates negative linear correlation.

## STAT-QL-074 — Covariance from paired observations

**Semantic contract:** COVARIANCE_FROM_PAIRS

Using divisor n, find the covariance for X = 1, 2, 3, 4, 5 and Y = 2, 3, 5, 4, 6.

A. 2.3
B. 1.8
C. 1.55
D. 2.05

**Answer:** B. 1.8

**Explanation:** Cov(X,Y) = Σ(x − x̄)(y − ȳ)/n. Here x̄ = 3, ȳ = 4, so the covariance is 1.8.

## STAT-QL-075 — Regression line of Y on X

**Semantic contract:** REGRESSION_Y_ON_X

Find the slope of the regression line of Y on X for X = 2, 4, 6, 8, 10 and Y = 1, 2, 3, 4, 5.

A. 0.6
B. 0.4
C. 0.5
D. 0.7

**Answer:** C. 0.5

**Explanation:** The regression slope is Cov(X,Y)/Var(X) = 0.5. The line passes through (x̄, ȳ) = (6, 3), giving Y = 0.5X + 0.

## STAT-QL-076 — Regression line of X on Y

**Semantic contract:** REGRESSION_X_ON_Y

Find the slope of the regression line of X on Y for X = 1, 2, 3, 4, 5 and Y = 6, 4, 5, 3, 2.

A. -0.8
B. -0.9
C. -0.7
D. -1

**Answer:** B. -0.9

**Explanation:** The regression slope is Cov(X,Y)/Var(Y) = -0.9. The line passes through (x̄, ȳ) = (3, 4), giving X = -0.9Y + 6.6.

## STAT-QL-077 — Prediction from a regression line

**Semantic contract:** REGRESSION_PREDICTION

The regression line is Y = 1.5X + 4. Estimate Y when X = 6.

A. 13.5
B. 12.75
C. 13.25
D. 13

**Answer:** D. 13

**Explanation:** Substitute X = 6 into the stated line: Y = 1.5(6) + 4 = 13.

## STAT-QL-078 — Correlation from regression coefficients

**Semantic contract:** REGRESSION_COEFFICIENT_RELATION

The regression coefficients are bYX = 0.5 and bXY = 0.4. Find the correlation coefficient r.

A. 0.6
B. 0.45
C. 0.25
D. 0.1

**Answer:** B. 0.45

**Explanation:** r² = bYX × bXY and the sign of r is the common sign of the regression coefficients. Both are positive, so r = +√(0.5 × 0.4) = 0.45.

## STAT-QL-079 — Spearman rank correlation without ties

**Semantic contract:** SPEARMAN_NO_TIES

Find Spearman's rank correlation coefficient for the ranks X = 1, 2, 3, 4, 5 and Y = 2, 1, 3, 5, 4.

A. 0.45
B. 0.8
C. 0.95
D. 0.6

**Answer:** B. 0.8

**Explanation:** Treat these as ranks. Spearman's coefficient is the Pearson correlation of the rank vectors. Computing their rank correlation gives 0.8.

## STAT-QL-080 — Spearman rank correlation with tied ranks

**Semantic contract:** SPEARMAN_WITH_TIES

Find Spearman's rank correlation coefficient for the average ranks with a tie X = 1, 2.5, 2.5, 4, 5 and Y = 1, 3, 2, 4, 5.

A. 0.97
B. 0.77
C. 0.62
D. 1

**Answer:** A. 0.97

**Explanation:** Treat these as ranks. Spearman's coefficient is the Pearson correlation of the rank vectors. The tied X observations already have their average rank (2.5). Computing their rank correlation gives 0.97.

## STAT-QL-081 — Yule coefficient of association

**Semantic contract:** YULE_ASSOCIATION

A 2 × 2 attribute table has cells a = 15, b = 5, c = 10, d = 10. Find Yule's coefficient of association Q.

A. 0.7
B. 0.4
C. 0.5
D. 0.6

**Answer:** C. 0.5

**Explanation:** Yule's Q = (ad − bc)/(ad + bc) = (15×10 − 5×10)/(15×10 + 5×10) = 0.5.

## STAT-QL-082 — Partial correlation for three variables

**Semantic contract:** PARTIAL_CORRELATION_THREE_VARIABLES

Given r12 = 0.8, r13 = 0.6, and r23 = 0.5, find the partial correlation r12.3.

A. 0.52
B. 0.37
C. 0.87
D. 0.72

**Answer:** D. 0.72

**Explanation:** Use r12.3 = (r12 − r13r23)/√[(1 − r13²)(1 − r23²)]. Substitution gives 0.72.

## STAT-QL-083 — Multiple correlation for three variables

**Semantic contract:** MULTIPLE_CORRELATION_THREE_VARIABLES

For three variables, r12 = 0.6, r13 = 0.5, and r23 = 0.2. Find the multiple correlation coefficient R1.23.

A. 0.36
B. 0.86
C. 0.51
D. 0.71

**Answer:** D. 0.71

**Explanation:** Use R1.23 = √[(r12² + r13² − 2r12r13r23)/(1 − r23²)]. Substitution gives 0.71.

## Review checkpoints

- Check that the simple and three-variable formulas match the intended JSO Paper-II depth.
- Check rank tie handling, attribute-association convention, and regression notation.
- Confirm that the displayed data and working are sufficient to reproduce each answer.
- This candidate does not authorize storage, tests, mocks, localization, publication, or production release.

