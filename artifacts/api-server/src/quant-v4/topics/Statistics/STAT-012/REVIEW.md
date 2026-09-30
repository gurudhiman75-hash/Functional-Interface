# Statistics — STAT-012 Analysis of Variance Review V1

**Status:** English review candidate; awaiting editorial approval.
**Profiles:** SSC CGL Tier II and JSO. **Lifecycle:** controlled review only.

## STAT-QL-140 — Purpose of analysis of variance

What is the main purpose of a one-way analysis of variance?

A. Test whether every observation is identical
B. Measure rank correlation
C. Estimate a single median
D. Compare means across several groups

**Answer:** D. Compare means across several groups

**Explanation:** ANOVA compares means across multiple groups by partitioning variation into between-group and within-group components.

## STAT-QL-141 — One-way ANOVA factor

A study compares outcomes across four teaching methods, with students classified by one treatment factor. Is this one-way or two-way ANOVA?

A. Repeated-measures correlation
B. Regression discontinuity
C. One-way ANOVA
D. Two-way ANOVA

**Answer:** C. One-way ANOVA

**Explanation:** One-way ANOVA analyzes one factor; this study has one treatment factor.

## STAT-QL-142 — Two-way ANOVA factors

A study compares outcomes by teaching method and school type, with observations classified by both factors. How many factors are analyzed?

A. Two categorical factors
B. One categorical factor
C. No factors
D. Only a response variable

**Answer:** A. Two categorical factors

**Explanation:** Two-way ANOVA analyzes two factors; here the factors are teaching method and school type.

## STAT-QL-143 — ANOVA sum-of-squares partition

In a one-way ANOVA, SSbetween = 36 and SSwithin = 60. Find SStotal.

A. 98
B. 96
C. 100
D. 94

**Answer:** B. 96

**Explanation:** SStotal = SSbetween + SSwithin. Substituting the two supplied components gives 96.

## STAT-QL-144 — One-way ANOVA degrees of freedom

A one-way ANOVA has k = 4 groups and N = 24 observations. Find the within degrees of freedom.

A. 18
B. 22
C. 20
D. 24

**Answer:** C. 20

**Explanation:** For one-way ANOVA, dfbetween = k−1 = 3, dfwithin = N−k = 20, and dftotal = N−1 = 23. The requested df is 20.

## STAT-QL-145 — Total degrees of freedom

A one-way ANOVA has k = 5 groups and N = 30 observations. Find the total degrees of freedom.

A. 31
B. 29
C. 33
D. 27

**Answer:** B. 29

**Explanation:** For one-way ANOVA, dfbetween = k−1 = 4, dfwithin = N−k = 25, and dftotal = N−1 = 29. The requested df is 29.

## STAT-QL-146 — Mean square from sum of squares

An ANOVA component has sum of squares SS = 48 and df = 4. Find its mean square MS.

A. 12
B. 14
C. 16
D. 10

**Answer:** A. 12

**Explanation:** MS = SS/df = 48/4 = 12.

## STAT-QL-147 — F ratio from mean squares

In an ANOVA table, MSbetween = 30 and MSwithin = 6. Find F.

A. 5
B. 9
C. 3
D. 7

**Answer:** A. 5

**Explanation:** F = MSbetween/MSwithin = 30/6 = 5.

## STAT-QL-148 — One-way ANOVA F statistic

A one-way ANOVA has k = 4 groups and N = 30 observations, with SSbetween = 60 and SSwithin = 120. Find F.

A. 8.33
B. 6.33
C. 2.33
D. 4.33

**Answer:** D. 4.33

**Explanation:** dfbetween = k−1 = 3; dfwithin = N−k = 26. Thus F = (SSbetween/dfbetween)/(SSwithin/dfwithin) = (60/3)/(120/26) = 4.33.

## STAT-QL-149 — Two-way ANOVA error degrees of freedom

A two-way ANOVA without replication has 3 levels of factor A and 5 levels of factor B. Find the residual degrees of freedom.

A. 6
B. 12
C. 8
D. 10

**Answer:** C. 8

**Explanation:** For a two-way layout without replication, residual df = (a−1)(b−1) = (3−1)(5−1) = 8.

## STAT-QL-150 — ANOVA critical-value decision

An ANOVA test has F = 3.2 and critical value Fcrit = 3 at the stated significance level. What is the decision?

A. Reject H₀
B. Conclude all means are equal
C. Do not reject H₀
D. Accept H₁ as proven

**Answer:** A. Reject H₀

**Explanation:** Since F = 3.2 > Fcrit = 3, Reject H₀.

## STAT-QL-151 — Meaning of a significant F statistic

An ANOVA F test is significant. What does this establish about the group means?

A. Every group mean differs from every other
B. The largest sample mean is the population maximum
C. At least one population mean differs
D. The null hypothesis is proven true

**Answer:** C. At least one population mean differs

**Explanation:** A significant omnibus F test indicates evidence that not all population means are equal; it does not show that every pair differs.

## Review checkpoints

- Verify sum-of-squares partitioning and degrees-of-freedom conventions.
- Confirm the two-way residual-df example explicitly assumes no replication.
- Check F-ratio arithmetic, critical-value comparison, and the omnibus interpretation.
- This candidate does not authorize storage, tests, mocks, localization, publication, or production release.



## STAT-QL-185 — Interaction degrees of freedom with replication

A replicated two-way ANOVA has 2 levels of factor A and 2 levels of factor B, with observations in every cell. Find the interaction degrees of freedom.

A. 1
B. 2
C. 4
D. 6

**Answer:** A. 1

**Explanation:** For a two-way interaction, dfAB = (a−1)(b−1) = (2−1)(2−1) = 1.

## STAT-QL-186 — Interaction sum of squares

A balanced two-way ANOVA has two observations in each cell: A₁B₁ (10, 12), A₁B₂ (14, 16), A₂B₁ (20, 22), and A₂B₂ (28, 30). Find SSAB.

A. 8
B. 368
C. 72
D. 360

**Answer:** A. 8

**Explanation:** The grand mean is 19. SSA = 288 and SSB = 72. The between-cell sum of squares is 368, so SSAB = 368−288−72 = 8.

## STAT-QL-187 — Interaction F statistic

For replicated two-way data A₁B₁ (10, 12), A₁B₂ (14, 16), A₂B₁ (20, 22), and A₂B₂ (28, 30), SSAB = 8 and SSE = 8. Find the interaction F statistic.

A. 4
B. 2
C. 8
D. 1

**Answer:** A. 4

**Explanation:** dfAB = 1 and dfError = 2×2×(2−1) = 4. MSAB = 8/1 = 8 and MSE = 8/4 = 2, so F = 8/2 = 4.

## STAT-QL-188 — Interpret a significant interaction

In a two-way ANOVA, a significant interaction between factors A and B means what?

A. The effect of one factor differs across levels of the other factor
B. Both factors have no effect on the response
C. Every pair of cell means differs significantly
D. The two factors are statistically independent

**Answer:** A. The effect of one factor differs across levels of the other factor

**Explanation:** An interaction means the effect of factor A on the response is not the same at every level of factor B; equivalently, B's effect varies across levels of A.

## STAT-QL-189 — Follow-up after a significant omnibus test

A one-way ANOVA rejects the null hypothesis that all group means are equal. The study design and assumptions support pairwise comparisons. What is an appropriate next step to identify which means differ?

A. Use a suitable multiple-comparison procedure, such as Tukey's HSD
B. Conclude that every group mean differs from every other
C. Repeat the same omnibus F test until a pair is identified
D. Select the largest sample mean without further testing

**Answer:** A. Use a suitable multiple-comparison procedure, such as Tukey's HSD

**Explanation:** The omnibus F test shows that at least one mean differs but does not identify the pair. A family-wise multiple-comparison method such as Tukey's HSD can assess pairwise differences.

## STAT-QL-190 — Classical one-way ANOVA assumptions

Which set gives the usual assumptions for a classical one-way ANOVA F test?

A. Independent errors, approximately normal errors within groups, and equal population variances
B. Equal sample sizes, zero sample means, and no outliers
C. Independent groups, equal sample medians, and a uniform response
D. Normal predictors, correlated errors, and unequal variances

**Answer:** A. Independent errors, approximately normal errors within groups, and equal population variances

**Explanation:** The classical one-way ANOVA model assumes independent errors, approximately normal errors within each group, and a common population variance across groups.

