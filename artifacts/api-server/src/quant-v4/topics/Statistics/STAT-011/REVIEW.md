# Statistics — STAT-011 Statistical Inference Review V1

**Status:** English review candidate; awaiting editorial approval.
**Profiles:** SSC CGL Tier II and JSO. **Lifecycle:** controlled review only.

## STAT-QL-124 — Point estimate and parameter

A sample mean is used as a single-number estimate of an unknown population mean. What is this estimate called?

A. Sampling frame
B. Confidence interval
C. Null hypothesis
D. Point estimate

**Answer:** D. Point estimate

**Explanation:** A single numerical value used to estimate a population parameter is a point estimate.

## STAT-QL-125 — Unbiased estimator

An estimator has expected value equal to the population parameter for every sample size. What property does it have?

A. Inefficient estimator
B. Unbiased estimator
C. Consistent estimator
D. Biased estimator

**Answer:** B. Unbiased estimator

**Explanation:** An estimator whose expectation equals the target parameter is unbiased.

## STAT-QL-126 — Consistency of an estimator

As sample size increases, an estimator converges in probability to the true parameter. What property does it have?

A. Unbiased estimator
B. Consistent estimator
C. Biased estimator
D. Inefficient estimator

**Answer:** B. Consistent estimator

**Explanation:** An estimator that approaches the true parameter in probability as sample size grows is consistent.

## STAT-QL-127 — Method of moments for Bernoulli probability

In 80 independent Bernoulli trials, 30 are successes. Find the method-of-moments estimate of success probability p.

A. 0.33
B. 0.38
C. 0.43
D. 0.48

**Answer:** B. 0.38

**Explanation:** For Bernoulli data, both the sample proportion and the estimate from the first-moment equation are x̄ = 30/80 ≈ 0.38 (rounded to two decimal places).

## STAT-QL-128 — Maximum likelihood estimate for Bernoulli probability

In 80 independent Bernoulli trials, 30 are successes. Find the maximum-likelihood estimate of success probability p.

A. 0.33
B. 0.38
C. 0.48
D. 0.43

**Answer:** B. 0.38

**Explanation:** For Bernoulli data, both the sample proportion and the estimate from the first-moment equation are x̄ = 30/80 ≈ 0.38 (rounded to two decimal places).

## STAT-QL-129 — Least-squares slope

For the observations (x,y) = (1,3), (2,5), (3,4), (4,8), find the least-squares slope in ŷ = a + bx.

A. 2.4
B. 1.9
C. 0.9
D. 1.4

**Answer:** D. 1.4

**Explanation:** The least-squares slope is b = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)² = 1.4. The intercept is a = ȳ−b x̄ = 1.5. The requested slope is 1.4.

## STAT-QL-130 — Least-squares intercept

For the observations (x,y) = (1,3), (2,5), (3,4), (4,8), find the least-squares intercept in ŷ = a + bx.

A. 1.5
B. 1
C. 2
D. 2.5

**Answer:** A. 1.5

**Explanation:** The least-squares slope is b = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)² = 1.4. The intercept is a = ȳ−b x̄ = 1.5. The requested intercept is 1.5.

## STAT-QL-131 — Confidence interval margin of error

For a 95% z confidence interval for a population mean, use z = 1.96. If known σ = 12 and n = 144, find the margin of error.

A. 2.96
B. 2.46
C. 1.46
D. 1.96

**Answer:** D. 1.96

**Explanation:** Margin of error = zσ/√n = 1.96×12/√144 = 1.96.

## STAT-QL-132 — Confidence interval interpretation

Which is the correct frequentist interpretation of a 95% confidence-interval procedure?

A. The procedure covers the fixed parameter in about 95% of repeated samples
B. 95% of observations lie inside the interval
C. The parameter changes in 95% of samples
D. There is a 95% probability the fixed parameter lies in this realized interval

**Answer:** A. The procedure covers the fixed parameter in about 95% of repeated samples

**Explanation:** The population parameter is fixed. In repeated sampling, about 95% of intervals built by this procedure would contain it.

## STAT-QL-133 — Null and alternative hypotheses

In a standard significance test, which hypothesis specifies the reference value and is tested for possible rejection?

A. The null hypothesis
B. The test statistic
C. The alternative hypothesis
D. The confidence level

**Answer:** A. The null hypothesis

**Explanation:** The null hypothesis H₀ supplies the reference condition; evidence is assessed against it.

## STAT-QL-134 — Type I and Type II errors

A test fails to reject H₀ even though H₀ is false. What error has occurred?

A. Type II error
B. Type I error
C. Sampling error
D. Non-sampling error

**Answer:** A. Type II error

**Explanation:** Failing to reject a false null hypothesis is a Type II error.

## STAT-QL-135 — One-tailed and two-tailed alternatives

The alternative hypothesis is H₁: μ < μ₀. Which test direction is appropriate?

A. Two-tailed test
B. Right-tailed test
C. Left-tailed test
D. No-tailed test

**Answer:** C. Left-tailed test

**Explanation:** The alternative μ < μ₀ looks for a difference in the lower tail; use a left-tailed test.

## STAT-QL-136 — Large-sample Z statistic

A sample of n = 100 has mean x̄ = 52. Test H₀: μ = 50 using known σ = 10. Find the Z statistic.

A. 2.5
B. 2
C. 1.5
D. 3

**Answer:** B. 2

**Explanation:** Z = (x̄−μ₀)/(σ/√n) = (52−50)/(10/√100) = 2.

## STAT-QL-137 — Small-sample t statistic

A small sample of n = 16 has mean x̄ = 13 and sample standard deviation s = 4. For H₀: μ = 10, find the one-sample t statistic.

A. 2.5
B. 4
C. 3
D. 3.5

**Answer:** C. 3

**Explanation:** t = (x̄−μ₀)/(s/√n) = (13−10)/(4/√16) = 3.

## STAT-QL-138 — Chi-square test statistic

For a goodness-of-fit test, observed counts are (20, 30, 50) and expected counts are (25, 25, 50). Find χ².

A. 2
B. 3
C. 1.5
D. 2.5

**Answer:** A. 2

**Explanation:** χ² = Σ(O−E)²/E = (20−25)²/25 + (30−25)²/25 + (50−50)²/50 = 2.

## STAT-QL-139 — F statistic for variance comparison

Two independent samples have sample variances s₁² = 64 and s₂² = 9. Find the F ratio s₁²/s₂².

A. 8.11
B. 6.61
C. 7.11
D. 7.61

**Answer:** C. 7.11

**Explanation:** The variance ratio is F = s₁²/s₂² = 64/9 = 7.11.

## Review checkpoints

- Verify estimator terminology and the method-of-moments/MLE examples.
- Check confidence interval interpretation and error-direction concepts.
- Confirm test-statistic conventions, tails, and rounding.
- This candidate does not authorize storage, tests, mocks, localization, publication, or production release.



## STAT-QL-181 — Construct a confidence interval for a mean

A sample of n = 100 has mean x̄ = 50. The population standard deviation is known to be σ = 10. Construct a 95% z confidence interval using z = 1.96.

A. (48.04, 51.96)
B. (48, 52)
C. (46.04, 53.96)
D. (49.8, 50.2)

**Answer:** A. (48.04, 51.96)

**Explanation:** The standard error is σ/√n = 10/√100 = 1. The interval is x̄ ± z(SE) = 50 ± 1.96(1), giving (48.04, 51.96).

## STAT-QL-182 — Wald confidence interval for a proportion

In a sample of 100 people, 60 support a proposal. Using the normal (Wald) method with z = 1.96, construct a 95% confidence interval for the population proportion.

A. (0.504, 0.696)
B. (0.500, 0.700)
C. (0.550, 0.650)
D. (0.400, 0.800)

**Answer:** A. (0.504, 0.696)

**Explanation:** The sample proportion is p̂ = 60/100 = 0.60. Its standard error is √[0.60×0.40/100] ≈ 0.04899. Thus p̂ ± z(SE) = 0.60 ± 1.96(0.04899) ≈ (0.504, 0.696).

## STAT-QL-183 — Decision from a one-sample Z test

A sample of n = 100 has mean x̄ = 56. Test H₀: μ = 50 against H₁: μ > 50, with known σ = 10. At α = 0.05, use critical value z = 1.645. What is the decision?

A. Reject H₀
B. Fail to reject H₀
C. Accept H₁ as proven
D. There is not enough information

**Answer:** A. Reject H₀

**Explanation:** The test statistic is z = (56−50)/(10/√100) = 6. For this upper-tailed test, reject H₀ when z > 1.645. Since 6 > 1.645, reject H₀.

## STAT-QL-184 — Decision from a chi-square goodness-of-fit test

A goodness-of-fit test has observed counts (20, 30, 50) and expected counts (25, 25, 50). Using critical value χ² = 5.99, decide whether to reject H₀.

A. Reject H₀
B. Fail to reject H₀
C. Accept H₀ as proven
D. The test must be two-tailed

**Answer:** B. Fail to reject H₀

**Explanation:** Calculate χ² = Σ(O−E)²/E = 2. Reject H₀ when χ² exceeds 5.99. Since 2 ≤ 5.99, fail to reject H₀.


## STAT-QL-200 — Decision from a supplied p-value

A hypothesis test reports a p-value of 0.032. At significance level α = 0.05, what is the correct decision?

A. The p-value is the probability that H₀ is true
B. Accept H₀ as proven
C. Reject H₀
D. Fail to reject H₀

**Answer:** C. Reject H₀

**Explanation:** Compare the p-value with α: 0.032 < 0.05. The result is statistically significant at this level, so reject H₀. This does not prove H₁ or give the probability that H₀ is true.
