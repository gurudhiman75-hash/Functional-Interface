# Statistics — STAT-012 Analysis of Variance Review V2

**Status:** Approved by Gurbaj Singh on 2026-09-30. Question pool expansion is deferred to a later pass.
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

**Explanation:** dfbetween = k−1 = 3; dfwithin = N−k = 26. Thus F = (SSbetween/dfbetween)/(SSwithin/dfwithin) = (60/3)/(120/26) ≈ 4.33.

## STAT-QL-149 — Two-way ANOVA error degrees of freedom

A two-way ANOVA without replication, assuming no interaction, has 3 levels of factor A and 5 levels of factor B. Find the residual degrees of freedom.

A. 6
B. 12
C. 8
D. 10

**Answer:** C. 8

**Explanation:** For an additive two-way layout without replication, residual df = (a−1)(b−1) = (3−1)(5−1) = 8.

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

## STAT-QL-185 — Interaction degrees of freedom with replication

A replicated two-way ANOVA has 2 levels of factor A and 2 levels of factor B, with observations in every cell. Find the interaction degrees of freedom.

A. 4
B. 1
C. 6
D. 2

**Answer:** B. 1

**Explanation:** For a two-way interaction, dfAB = (a−1)(b−1) = (2−1)(2−1) = 1.

## STAT-QL-186 — Interaction sum of squares in replicated two-way ANOVA

A balanced two-way ANOVA has two observations in each cell: A₁B₁ (10, 12), A₁B₂ (14, 16), A₂B₁ (20, 22), and A₂B₂ (28, 30). Find the interaction sum of squares SSAB.

A. 8
B. 360
C. 368
D. 72

**Answer:** A. 8

**Explanation:** The grand mean is 19. The factor sums of squares are SSA = 288 and SSB = 72. The between-cell sum of squares is 368, so SSAB = 368−288−72 = 8.

## STAT-QL-187 — Interaction F statistic in replicated two-way ANOVA

For the replicated two-way data A₁B₁ (10, 12), A₁B₂ (14, 16), A₂B₁ (20, 22), and A₂B₂ (28, 30), the interaction sum of squares is 8 and the error sum of squares is 8. Find the interaction F statistic.

A. 1
B. 4
C. 8
D. 2

**Answer:** B. 4

**Explanation:** There are 2 levels of each factor and 2 replicates per cell. Thus dfAB = (2−1)(2−1) = 1 and dfError = 2×2×(2−1) = 4. MSAB = 8/1 = 8 and MSE = 8/4 = 2, so F = 8/2 = 4.

## STAT-QL-188 — Interpret a significant interaction

In a two-way ANOVA, a significant interaction between factors A and B means what?

A. The effect of one factor differs across levels of the other factor
B. The two factors are statistically independent
C. Both factors have no effect on the response
D. Every pair of cell means differs significantly

**Answer:** A. The effect of one factor differs across levels of the other factor

**Explanation:** An interaction means the effect of factor A on the response is not the same at every level of factor B (and equivalently, the effect of B varies across levels of A).

## STAT-QL-189 — Follow-up comparison after a significant omnibus test

A one-way ANOVA rejects the null hypothesis that all group means are equal. The study design and assumptions support pairwise comparisons. What is an appropriate next step to find which means differ?

A. Repeat the same omnibus F test until a pair is identified
B. Use a suitable multiple-comparison procedure, such as Tukey's HSD, to identify differing pairs
C. Conclude that every group mean differs from every other
D. Select the largest sample mean without further testing

**Answer:** B. Use a suitable multiple-comparison procedure, such as Tukey's HSD, to identify differing pairs

**Explanation:** The omnibus F test shows that at least one mean differs but does not identify the pair. A family-wise multiple-comparison method such as Tukey's HSD can assess the pairwise differences.

## STAT-QL-190 — ANOVA model assumptions

Which set gives the usual assumptions for a classical one-way ANOVA F test?

A. Independent errors, approximately normal errors within groups, and equal population variances
B. Normal predictors, correlated errors, and unequal variances
C. Independent groups, equal sample medians, and a uniform response
D. Equal sample sizes, zero sample means, and no outliers

**Answer:** A. Independent errors, approximately normal errors within groups, and equal population variances

**Explanation:** The classical one-way ANOVA model assumes independent errors, approximately normal errors within each group, and a common population variance across groups.

## STAT-QL-201 — One-way ANOVA from raw observations

Three independent groups have observations (8, 10, 12), (12, 14, 16), and (16, 18, 20). Find the one-way ANOVA F statistic.

A. 24
B. 12
C. 4
D. 6

**Answer:** B. 12

**Explanation:** The group means are 10, 14, and 18; the grand mean is 14. SSbetween = 3[(10−14)²+(14−14)²+(18−14)²] = 96. Within each group, the squared deviations sum to 8, so SSwithin = 24. With dfbetween = 2 and dfwithin = 6, F = (96/2)/(24/6) = 12.

## STAT-QL-202 — Treatment F statistic in a randomized-block design

A randomized-block experiment has three treatments and four blocks, with one observation per treatment in each block. The block rows are (8, 10, 12), (10, 13, 13), (12, 13, 17), and (10, 12, 14). Assuming an additive model, find the treatment F statistic.

A. 48
B. 16
C. 24
D. 8

**Answer:** C. 24

**Explanation:** The grand mean is 12. Treatment means are 10, 12, and 14, so SStreatment = 4[(10−12)²+(12−12)²+(14−12)²] = 32. Block means are 10, 12, 14, and 12, giving SSblock = 24. SStotal = 60, so SSerror = 60−32−24 = 4. Treatment df = 2 and error df = (4−1)(3−1) = 6. Thus F = (32/2)/(4/6) = 24.

## STAT-QL-203 — Interaction limitation without replication

A two-way ANOVA has one observation in each cell. Which limitation applies when an interaction may be present?

A. Interaction cannot be estimated separately from error
B. Residual degrees of freedom are always zero
C. Interaction has been proved to be zero
D. Both main effects must be equal

**Answer:** A. Interaction cannot be estimated separately from error

**Explanation:** With one observation per cell, there is no within-cell replication to estimate pure error. Interaction cannot be separated from error. The usual additive-model F tests require the no-interaction assumption.

## STAT-QL-204 — Unequal residual variance diagnostic

In an ANOVA residual plot, the vertical spread increases as the fitted response increases. Which assumption is most directly called into question?

A. The residuals must have a nonzero overall mean
B. The equal-variance assumption may be violated
C. The treatment means must all be equal
D. The observations must be serially correlated

**Answer:** B. The equal-variance assumption may be violated

**Explanation:** Increasing residual spread suggests that error variance changes with the response level. This is evidence against the common-variance assumption; the plot alone does not establish whether the errors are independent or normally distributed.

## Review checkpoints

- Diversity and numerical pool expansion are deferred to a later pass.
- Verify sum-of-squares partitioning and degrees-of-freedom conventions.
- Confirm the two-way residual-df example explicitly assumes no replication and no interaction.
- Verify raw one-way and randomized-block sums of squares, and the unequal-variance diagnostic.
- Check F-ratio arithmetic, critical-value comparison, and the omnibus interpretation.
- This candidate does not authorize storage, tests, mocks, localization, publication, or production release.

