# Statistics — STAT-006 Moments, Skewness & Kurtosis Review V1

**Review status:** English representative review candidate; awaiting content approval.
**Profiles:** SSC CGL Tier II and JSO. **Lifecycle:** controlled review only.

Raw and central moments use divisor n for the displayed population. Each coefficient and formula convention is stated in the question where needed.

## STAT-QL-052 — Second raw moment

**Semantic contract:** Calculate the second moment about the origin, the arithmetic mean of squared observations, from a small raw data set.

Find the 2nd moment about the origin for the observations -2, 0, 2, 2, 8.

A. 14.7
B. 15.7
C. 15.2
D. 16.2

**Answer:** C. 15.2

**Explanation:** The 2nd raw moment is the mean of the 2nd powers: ((-2)^2 + (0)^2 + (2)^2 + (2)^2 + (8)^2) / 5 = 15.2.

## STAT-QL-053 — Third raw moment

**Semantic contract:** Calculate the third moment about the origin, the arithmetic mean of cubed observations, from a small raw data set.

Find the 3rd moment about the origin for the observations -2, 0, 2, 2, 8.

A. 104
B. 103
C. 105
D. 106

**Answer:** A. 104

**Explanation:** The 3rd raw moment is the mean of the 3rd powers: ((-2)^3 + (0)^3 + (2)^3 + (2)^3 + (8)^3) / 5 = 104.

## STAT-QL-054 — Fourth raw moment

**Semantic contract:** Calculate the fourth moment about the origin, the arithmetic mean of fourth powers, from a small raw data set.

Find the 4th moment about the origin for the observations -1, 1, 3, 3, 9.

A. 1345
B. 1346
C. 1344
D. 1347

**Answer:** A. 1345

**Explanation:** The 4th raw moment is the mean of the 4th powers: ((-1)^4 + (1)^4 + (3)^4 + (3)^4 + (9)^4) / 5 = 1345.

## STAT-QL-055 — Second central moment

**Semantic contract:** Calculate the population second central moment by averaging squared deviations from the arithmetic mean; do not take the square root.

Treat the listed observations as a population. Find the 2nd central moment about the mean for -3, 0, 3, 3, 12.

A. 27.2
B. 24.2
C. 25.2
D. 26.2

**Answer:** C. 25.2

**Explanation:** The mean is 3. The 2nd central moment is the average of ((-3 − 3)^2 + (0 − 3)^2 + (3 − 3)^2 + (3 − 3)^2 + (12 − 3)^2) / 5 = 25.2. This is the variance; do not take its square root.

## STAT-QL-056 — Third central moment

**Semantic contract:** Calculate the population third central moment by averaging cubed deviations from the arithmetic mean and preserve the sign.

Treat the listed observations as a population. Find the 3rd central moment about the mean for -1, 5, 5, 7, 9.

A. -28.8
B. -29.8
C. -26.8
D. -27.8

**Answer:** A. -28.8

**Explanation:** The mean is 5. The 3rd central moment is the average of ((-1 − 5)^3 + (5 − 5)^3 + (5 − 5)^3 + (7 − 5)^3 + (9 − 5)^3) / 5 = -28.8.

## STAT-QL-057 — Fourth central moment

**Semantic contract:** Calculate the population fourth central moment by averaging fourth powers of deviations from the arithmetic mean.

Treat the listed observations as a population. Find the 4th central moment about the mean for 3, 4, 5, 5, 8.

A. 19.6
B. 20.6
C. 19.1
D. 20.1

**Answer:** A. 19.6

**Explanation:** The mean is 5. The 4th central moment is the average of ((3 − 5)^4 + (4 − 5)^4 + (5 − 5)^4 + (5 − 5)^4 + (8 − 5)^4) / 5 = 19.6.

## STAT-QL-058 — Second central moment from raw moments

**Semantic contract:** Recover μ2 from the first two raw moments using μ2 = μ′2 − (μ′1)^2.

The first four raw moments about the origin are μ′1 = 3, μ′2 = 34.2, μ′3 = 351 and μ′4 = 4195.8. Find the 2nd central moment.

A. 26.2
B. 25.2
C. 24.2
D. 27.2

**Answer:** B. 25.2

**Explanation:** Use μ2 = μ′2 − (μ′1)^2. Substituting the stated raw moments gives 34.2 − 3^2 = 25.2.

## STAT-QL-059 — Third central moment from raw moments

**Semantic contract:** Recover μ3 from the first three raw moments using μ3 = μ′3 − 3μ′2μ′1 + 2(μ′1)^3.

The first four raw moments about the origin are μ′1 = 3, μ′2 = 20.2, μ′3 = 156.6 and μ′4 = 1345. Find the 3rd central moment.

A. 30.8
B. 27.8
C. 29.8
D. 28.8

**Answer:** D. 28.8

**Explanation:** Use μ3 = μ′3 − 3μ′2μ′1 + 2(μ′1)^3. Substituting the stated raw moments gives 156.6 − 3 × 20.2 × 3 + 2 × 3^3 = 28.8.

## STAT-QL-060 — Fourth central moment from raw moments

**Semantic contract:** Recover μ4 from the first four raw moments using the expanded raw-to-central-moment identity.

The first four raw moments about the origin are μ′1 = 6, μ′2 = 38.8, μ′3 = 270 and μ′4 = 2006.8. Find the 4th central moment.

A. 19.6
B. 20.6
C. 19.1
D. 20.1

**Answer:** A. 19.6

**Explanation:** Use μ4 = μ′4 − 4μ′3μ′1 + 6μ′2(μ′1)^2 − 3(μ′1)^4. Substituting the stated raw moments gives 2006.8 − 4 × 270 × 6 + 6 × 38.8 × 6^2 − 3 × 6^4 = 19.6.

## STAT-QL-061 — Central moment under an affine transformation

**Semantic contract:** Use μr(aX+b) = a^r μr(X) for r = 2, 3 or 4; a shift does not change the central moment and scaling changes it by the rth power.

For a variable X, μ3(X) = 1.5. If Y = -2X + 4, find μ3(Y).

A. -11.5
B. -12.5
C. -11
D. -12

**Answer:** D. -12

**Explanation:** For a central moment, adding 4 shifts the values and their mean equally, so the shift does not change the moment. Multiplication by -2 scales the 3rd central moment by (-2)^3: μ3(Y) = (-2)^3 × 1.5 = -12.

## STAT-QL-062 — Moment coefficient of skewness β1

**Semantic contract:** Calculate β1 = μ3^2 / μ2^3 from the second and third central moments.

For a distribution, the second central moment is μ2 = 25.2 and the third central moment is μ3 = -97.2. Find β1.

A. 0.59
B. 0.39
C. 0.99
D. 0.79

**Answer:** A. 0.59

**Explanation:** Use β1 = μ3^2 / μ2^3. Substituting the stated moments gives (-97.2)^2 / (25.2)^3 = 0.59.

## STAT-QL-063 — Standardized moment coefficient of skewness γ1

**Semantic contract:** Calculate γ1 = μ3 / μ2^(3/2), retaining the sign of μ3.

For a distribution, the second central moment is μ2 = 25.2 and the third central moment is μ3 = 97.2. Find γ1.

A. 0.77
B. 0.97
C. 0.57
D. 1.17

**Answer:** A. 0.77

**Explanation:** Use γ1 = μ3 / μ2^(3/2). Substituting the stated moments gives (97.2) / (25.2)^(3/2) = 0.77.

## STAT-QL-064 — Bowley coefficient of skewness

**Semantic contract:** Calculate (Q3 + Q1 − 2Median) / (Q3 − Q1) from quartiles and median supplied in the question.

A distribution has Q1 = 28, median = 44, and Q3 = 58. Find Bowley's coefficient of skewness.

A. 0.33
B. -0.27
C. 0.13
D. -0.07

**Answer:** D. -0.07

**Explanation:** Bowley's coefficient = (Q3 + Q1 − 2Median)/(Q3 − Q1). Substituting the values gives (58 + 28 − 2 × 44)/(58 − 28) = -0.07.

## STAT-QL-065 — Pearson's first coefficient of skewness

**Semantic contract:** Calculate (mean − mode) / standard deviation using all three stated summary values.

A distribution has mean 75, mode 69 and standard deviation 8. Find Pearson's first coefficient of skewness.

A. 0.55
B. 0.95
C. 1.15
D. 0.75

**Answer:** D. 0.75

**Explanation:** Use (mean − mode) / standard deviation. Substituting the values gives (75 − 69) / 8 = 0.75.

## STAT-QL-066 — Pearson's second coefficient of skewness

**Semantic contract:** Calculate 3(mean − median) / standard deviation using all three stated summary values.

A distribution has mean 50, median 44 and standard deviation 6. Find Pearson's second coefficient of skewness.

A. 3
B. 2.5
C. 4
D. 3.5

**Answer:** A. 3

**Explanation:** Use 3(mean − median) / standard deviation. Substituting the values gives 3(50 − 44) / 6 = 3.

## STAT-QL-067 — Direction of skewness from the third central moment

**Semantic contract:** Infer the direction of skewness from the sign of the third central moment: positive, negative or zero.

A distribution has third central moment μ3 = 5. What does its sign indicate about moment skewness?

A. Negatively skewed
B. Positively skewed
C. Zero third-moment skewness
D. Cannot be determined

**Answer:** B. Positively skewed

**Explanation:** The sign of μ3 indicates the direction of moment skewness. Here μ3 is positive, so the moment-based result is positively skewed.

## STAT-QL-068 — Moment coefficient of kurtosis β2

**Semantic contract:** Calculate β2 = μ4 / μ2^2 from the fourth and second central moments.

A distribution has μ2 = 4 and μ4 = 51.2. Find its moment coefficient of kurtosis β2.

A. 3.7
B. 3.2
C. 2.7
D. 4.2

**Answer:** B. 3.2

**Explanation:** β2 = μ4 / μ2^2. Substituting the values gives 51.2 / 4^2 = 3.2.

## STAT-QL-069 — Excess kurtosis and distribution type

**Semantic contract:** Calculate excess kurtosis γ2 = β2 − 3 or classify the distribution as mesokurtic, leptokurtic or platykurtic by comparing β2 with 3.

A distribution has moment coefficient of kurtosis β2 = 2.4. Classify its kurtosis relative to a normal distribution, for which β2 = 3.

A. Cannot be determined
B. Mesokurtic
C. Leptokurtic
D. Platykurtic

**Answer:** D. Platykurtic

**Explanation:** Compare β2 = 2.4 with 3. Since it is less than 3, the distribution is platykurtic.

## Review checkpoints

- Check that the moment and coefficient conventions match SSC CGL JSO Paper II usage.
- Check formula notation and ensure each representative stem is concise and exam-like.
- Confirm that the third-moment sign is not presented as a proof of symmetry.
- This review file does not authorize Question Bank storage, tests, mock tests, localization, publication, or production release.

