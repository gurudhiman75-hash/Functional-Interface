# Statistics — STAT-009 Random Variables and Probability Distributions Review V1

**Status:** English review candidate; awaiting editorial approval.
**Profiles:** SSC CGL Tier II and JSO. **Lifecycle:** controlled review only.

## STAT-QL-096 — Probability mass function normalization

A discrete random variable has probability weights proportional to 2, 3, 5 at x = 0, 1, 2 respectively. Find P(X = 1).

A. 0.4
B. 0.35
C. 0.3
D. 0.25

**Answer:** C. 0.3

**Explanation:** Normalize the weights by their sum 10. The probability at the selected value is 3/10 = 0.3.

## STAT-QL-097 — Expectation of a discrete random variable

A discrete variable X has the probability weights shown below (x: 0, 1, 2, 3 ; f(x): 2, 1, 4, 3). Find E[X].

A. 2.05
B. 1.55
C. 1.8
D. 2.3

**Answer:** C. 1.8

**Explanation:** The total weight is 10. The weighted sum is 0×2 + 1×1 + 2×4 + 3×3 = 18, so E[X] = 18/10 = 1.8.

## STAT-QL-098 — Variance of a discrete random variable

A discrete variable X has the probability weights shown below (x: 0, 1, 2, 3 ; f(x): 2, 1, 4, 3). Find Var(X).

A. 1.66
B. 1.41
C. 1.16
D. 0.91

**Answer:** C. 1.16

**Explanation:** The total weight is 10. E[X] = 1.8 and E[X²] = (0²×2 + 1²×1 + 2²×4 + 3²×3)/10 = 4.4. Therefore Var(X) = E[X²]−E[X]² = 4.4−1.8² = 1.16.

## STAT-QL-099 — Third central moment of a discrete distribution

A discrete variable X has the probability weights shown below (x: 0, 1, 2, 3 ; f(x): 1, 2, 3, 4). Find the third central moment of X.

A. -0.65
B. -0.55
C. -0.6
D. -0.5

**Answer:** C. -0.6

**Explanation:** The total weight is 10 and E[X] = 2. Thus μ₃ = [(-2)³×1 + (-1)³×2 + 0³×3 + 1³×4]/10 = (-8−2+4)/10 = -0.6.

## STAT-QL-100 — Expectation under an affine transformation

For the distribution (x: 0, 1, 2, 3 ; f(x): 1, 2, 3, 4), define Y = -2X + 4. Find E[Y].

A. 0.1
B. 0.05
C. 0
D. -0.05

**Answer:** C. 0

**Explanation:** Linearity of expectation gives E[Y] = -2E[X] + (4) = -2(2) + (4) = 0.

## STAT-QL-101 — Binomial point probability

X has a binomial distribution with n = 5 and success probability p = 0.4. Find P(X = 2).

A. 0.3456
B. 0.3956
C. 0.4456
D. 0.2956

**Answer:** A. 0.3456

**Explanation:** P(X=2) = C(5,2)(0.4)^2(1−0.4)^3 = 0.3456.

## STAT-QL-102 — Binomial mean and variance

For X ~ Binomial(n = 8, p = 0.4), find its variance.

A. 1.92
B. 1.67
C. 2.42
D. 2.17

**Answer:** A. 1.92

**Explanation:** For a binomial variable, E[X] = np = 8×0.4 = 3.2 and Var(X) = np(1−p) = 8×0.4×0.6 = 1.92. The requested variance is 1.92.

## STAT-QL-103 — Poisson point probability

X has a Poisson distribution with mean λ = 1.5. Find P(X = 3).

A. 0.1255
B. 0.2255
C. 0.1755
D. 0.0755

**Answer:** A. 0.1255

**Explanation:** P(X=3) = e^(−λ)λ^3/3! = e^(−1.5)(1.5)^3/3! ≈ 0.1255.

## STAT-QL-104 — Poisson mean and variance

X has a Poisson distribution with mean λ = 2. Find its mean.

A. 2.5
B. 2.25
C. 2
D. 1.75

**Answer:** C. 2

**Explanation:** For a Poisson variable, both its mean and variance equal λ. Thus the mean is 2.

## STAT-QL-105 — Standard score for a normal variable

X is normally distributed with mean 70 and standard deviation 15. Find the standard score corresponding to X = 40.

A. -1.5
B. -1.75
C. -2.25
D. -2

**Answer:** D. -2

**Explanation:** Standardize with z = (x−μ)/σ = (40−70)/15 = -2.

## STAT-QL-106 — Exponential survival probability

A continuous waiting time has an exponential distribution with rate λ = 0.25. Find P(X > 2).

A. 0.6565
B. 0.6065
C. 0.5565
D. 0.7065

**Answer:** B. 0.6065

**Explanation:** For an exponential variable, P(X>t) = e^(−λt) = e^(−0.25×2) ≈ 0.6065.

## STAT-QL-107 — Marginal probability from a joint table

A joint probability table for X,Y = 0 or 1 has row-major cell frequencies 2, 1, 4, 3. Find P(X = 0).

A. 0.3
B. 0.4
C. 0.35
D. 0.25

**Answer:** A. 0.3

**Explanation:** Sum the X=0 row and divide by the total: (2+1)/10 = 0.3.

## STAT-QL-108 — Conditional probability from a joint table

A joint table for X,Y = 0 or 1 has row-major frequencies 1, 3, 2, 6. Find P(Y = 0 | X = 0).

A. 0.25
B. 0.35
C. 0.2
D. 0.3

**Answer:** A. 0.25

**Explanation:** P(Y=0|X=0) = f(0,0)/f(X=0) = 1/(1+3) = 0.25.

## STAT-QL-109 — Independence in a joint distribution

A joint table for X,Y = 0 or 1 has row-major frequencies 1, 2, 3, 4. Are X and Y independent?

A. Independent
B. Cannot be determined
C. X and Y are mutually exclusive
D. Dependent

**Answer:** D. Dependent

**Explanation:** Compare P(X=0,Y=0) = 1/10 with P(X=0)P(Y=0) = ((1+2)/10)((1+3)/10). The joint distribution is dependent.

## STAT-QL-110 — Covariance from a joint distribution

A joint distribution for X,Y = 0 or 1 has row-major frequencies 2, 1, 4, 3. Find Cov(X,Y).

A. 0.07
B. -0.03
C. 0.02
D. 0.12

**Answer:** C. 0.02

**Explanation:** From the table, E[X] = (4+3)/10 = 0.7 and E[Y] = (1+3)/10 = 0.4. Also E[XY] = 3/10 = 0.3. Hence Cov(X,Y) = E[XY]−E[X]E[Y] = 0.3−(0.7×0.4) = 0.02.

## Review checkpoints

- Confirm the discrete distributions state how their probabilities are obtained.
- Check binomial, Poisson, normal, exponential, and joint-table conventions.
- Check rounding and that model assumptions are visible in each stem.
- This candidate does not authorize storage, tests, mocks, localization, publication, or production release.

