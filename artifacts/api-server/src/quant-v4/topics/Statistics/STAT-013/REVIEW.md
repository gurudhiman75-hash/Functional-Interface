# Statistics — STAT-013 Time Series Analysis Review V1

**Status:** English review candidate; awaiting editorial approval.
**Profiles:** SSC CGL Tier II and JSO. **Lifecycle:** controlled review only.

## STAT-QL-152 — Time-series components

Which set contains the four classical time-series components?

A. Population, sample, parameter, and statistic
B. Mean, median, mode, and range
C. Level, variance, skewness, and kurtosis
D. Trend, seasonal, cyclical, and irregular

**Answer:** D. Trend, seasonal, cyclical, and irregular

**Explanation:** The classical components are trend, seasonal, cyclical, and irregular.

## STAT-QL-153 — Trend component

A series rises steadily over several years after short-term fluctuations are smoothed. Which component is described?

A. Irregular
B. Sampling
C. Seasonal
D. Trend

**Answer:** D. Trend

**Explanation:** Trend is the long-run direction or movement of a series.

## STAT-QL-154 — Seasonal component

A retailer sees a similar sales peak each December. Which component is indicated?

A. Cyclical
B. Seasonal
C. Irregular
D. Long-run trend

**Answer:** B. Seasonal

**Explanation:** Seasonality repeats at a known period, such as months within each year.

## STAT-QL-155 — Cyclical component

An economy experiences multi-year expansions and contractions without a fixed annual period. Which component is indicated?

A. Cyclical
B. Deterministic trend
C. Irregular
D. Seasonal

**Answer:** A. Cyclical

**Explanation:** Cyclical variation moves in waves over longer periods without a fixed seasonal period.

## STAT-QL-156 — Irregular component

A one-time supply disruption causes an unexpected fluctuation not explained by trend or seasonality. Which component is indicated?

A. Irregular
B. Cyclical
C. Seasonal
D. Trend

**Answer:** A. Irregular

**Explanation:** The irregular component captures unpredictable residual variation.

## STAT-QL-157 — Additive decomposition model

In an additive decomposition, how are the components combined?

A. Y = T × S × C × I
B. Y = T/S + C/I
C. Y = T + S + C + I
D. Y = T − S − C − I

**Answer:** C. Y = T + S + C + I

**Explanation:** The additive model is Y = T + S + C + I.

## STAT-QL-158 — Multiplicative decomposition model

In a multiplicative decomposition, how are the components combined?

A. Y = (T + S)(C + I)
B. Y = T × S × C × I
C. Y = T − S − C − I
D. Y = T + S + C + I

**Answer:** B. Y = T × S × C × I

**Explanation:** The multiplicative model is Y = T × S × C × I.

## STAT-QL-159 — Moving average smoothing

Find the 3-period moving average for observations 8, 10, and 12.

A. 10
B. 8
C. 12
D. 14

**Answer:** A. 10

**Explanation:** Moving average = (8 + 10 + 12)/3 = 10.

## STAT-QL-160 — Centered moving average

For an even 4-period window, two adjacent moving averages are 10 and 12. Find the centered moving average.

A. 13
B. 11
C. 15
D. 9

**Answer:** B. 11

**Explanation:** Center by averaging the adjacent moving averages: (10 + 12)/2 = 11.

## STAT-QL-161 — Least-squares trend line

Observed values at coded times t = -2, -1, 0, 1, 2 are 37, 36, 40, 44, 43, respectively. Fit the straight-line trend Ŷ = a + bt by least squares and find the fitted value at t = 3.

A. 48
B. 46
C. 44
D. 42

**Answer:** B. 46

**Explanation:** The mean coded time is 0, so a = (37 + 36 + 40 + 44 + 43)/5 = 40. The least-squares slope is b = Σ(tY)/Σt² = 20/10 = 2. Thus Ŷ = 40 + 2t; at t = 3, the fitted value is 40 + 2(3) = 46.

## STAT-QL-162 — Trend forecast

A fitted trend is Ŷ = 20 + 4t. Forecast at t = 6.

A. 48
B. 44
C. 46
D. 42

**Answer:** B. 44

**Explanation:** Substitute t = 6: Ŷ = 20 + 4(6) = 44.

## STAT-QL-163 — Seasonal index

A season's average is 150; the overall average is 125. Find its seasonal index as a percent.

A. 120
B. 124
C. 122
D. 118

**Answer:** A. 120

**Explanation:** Index = (seasonal average / overall average) × 100 = (150/125) × 100 = 120.

## Review checkpoints

- Verify component terminology and additive versus multiplicative conventions.
- Confirm moving-average arithmetic, trend forecasts, and seasonal index base.
- This candidate does not authorize storage, tests, mocks, localization, publication, or production release.

