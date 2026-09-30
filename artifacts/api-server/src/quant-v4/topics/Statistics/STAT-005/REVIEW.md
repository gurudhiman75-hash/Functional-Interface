# Statistics — STAT-005 Partition Values & Dispersion Review V2

**Review status:** English representative review candidate; awaiting content approval.
**Profiles:** SSC CGL Tier II and JSO. **Lifecycle:** controlled review only.

Each example is generated deterministically from its permanent QL contract. Formula conventions are stated where needed; stem wording has been revised to read as exam questions rather than procedural directions.

## STAT-QL-036 — Quartile from raw observations

**Semantic contract:** Find a requested quartile in ordered raw observations using the explicitly stated (n+1) position convention and linear interpolation when required.

For the ordered observations 21, 24, 25, 27, 30, 31, 33, 36, 37, 39, 42, quartiles are located at position k(n + 1)/4, with linear interpolation when required. The third quartile, Q3, is:

A. 38
B. 36
C. 37
D. 39

**Answer:** C. 37

**Explanation:** Q3's position is 3 × (11 + 1) / 4 = 9. Interpolate at that position in the ordered observations; the value is 37.

## STAT-QL-037 — Decile from raw observations

**Semantic contract:** Find a requested decile in ordered raw observations using the explicitly stated (n+1) position convention and linear interpolation when required.

For the ordered observations 18, 21, 22, 24, 27, 28, 30, 33, 34, deciles are located at position k(n + 1)/10, with linear interpolation when required. The third decile, D3, is:

A. 23
B. 24
C. 22
D. 21

**Answer:** C. 22

**Explanation:** D3's position is 3 × (9 + 1) / 10 = 3. Interpolate at that position in the ordered observations; the value is 22.

## STAT-QL-038 — Percentile from raw observations

**Semantic contract:** Find a requested percentile in ordered raw observations using the explicitly stated (n+1) position convention and linear interpolation when required.

For the ordered observations 36, 40, 42, 45, 49, 51, 54, 58, 60, percentiles are located at position k(n + 1)/100, with linear interpolation when required. The 75th percentile, P75, is:

A. 58
B. 57
C. 56
D. 55

**Answer:** C. 56

**Explanation:** P75's position is 75 × (9 + 1) / 100 = 7.5. Interpolate at that position in the ordered observations; the value is 56.

## STAT-QL-039 — Quartile from a discrete frequency distribution

**Semantic contract:** Locate a specified quartile by its nearest-rank position in an ordered discrete frequency distribution using cumulative frequencies.

Under the nearest-rank convention r = ceil(kN/m), the second quartile, Q2, for the ordered frequency distribution below (N = 23) is:
| Value | Frequency |
|---:|---:|
| 10 | 2 |
| 20 | 4 |
| 30 | 5 |
| 40 | 7 |
| 50 | 5 |

A. 40
B. 39
C. 42
D. 41

**Answer:** A. 40

**Explanation:** The rank is ceil(2 × 23 / 4) = 12. The cumulative frequencies are 2, 6, 11, 18 and 23, so rank 12 falls at value 40.

## STAT-QL-040 — Decile from a discrete frequency distribution

**Semantic contract:** Locate a specified decile by its nearest-rank position in an ordered discrete frequency distribution using cumulative frequencies.

Under the nearest-rank convention r = ceil(kN/m), the eighth decile, D8, for the ordered frequency distribution below (N = 23) is:
| Value | Frequency |
|---:|---:|
| 10 | 2 |
| 20 | 4 |
| 30 | 5 |
| 40 | 7 |
| 50 | 5 |

A. 51
B. 50
C. 49
D. 52

**Answer:** B. 50

**Explanation:** The rank is ceil(8 × 23 / 10) = 19. The cumulative frequencies are 2, 6, 11, 18 and 23, so rank 19 falls at value 50.

## STAT-QL-041 — Percentile from a discrete frequency distribution

**Semantic contract:** Locate a specified percentile by its nearest-rank position in an ordered discrete frequency distribution using cumulative frequencies.

Under the nearest-rank convention r = ceil(kN/m), the 75th percentile, P75, for the ordered frequency distribution below (N = 23) is:
| Value | Frequency |
|---:|---:|
| 10 | 2 |
| 20 | 4 |
| 30 | 5 |
| 40 | 7 |
| 50 | 5 |

A. 42
B. 41
C. 39
D. 40

**Answer:** D. 40

**Explanation:** The rank is ceil(75 × 23 / 100) = 18. The cumulative frequencies are 2, 6, 11, 18 and 23, so rank 18 falls at value 40.

## STAT-QL-042 — Quartile from grouped data

**Semantic contract:** Interpolate a requested quartile in a grouped continuous frequency distribution from its quartile class, lower boundary, cumulative frequency, class frequency and width.

For grouped data, Q1 is estimated by linear interpolation at position N/4. For the distribution below, Q1 is:
| Class interval | Frequency |
|---:|---:|
| 0–10 | 2 |
| 10–20 | 4 |
| 20–30 | 5 |
| 30–40 | 7 |
| 40–50 | 5 |

A. 21.38
B. 18.38
C. 20.38
D. 19.38

**Answer:** D. 19.38

**Explanation:** N = 23, so the target position is 1 × 23 / 4 = 5.75. This lies in 10–20. Using L + [(target − cumulative frequency before the class) / class frequency] × class width gives 10 + [(5.75 − 2) / 4] × 10 ≈ 19.38.

## STAT-QL-043 — Decile from grouped data

**Semantic contract:** Interpolate a requested decile in a grouped continuous frequency distribution from its decile class and displayed frequency data.

For grouped data, D4 is estimated by linear interpolation at position 4N/10. For the distribution below, D4 is:
| Class interval | Frequency |
|---:|---:|
| 0–10 | 2 |
| 10–20 | 4 |
| 20–30 | 5 |
| 30–40 | 7 |
| 40–50 | 5 |

A. 28.4
B. 25.4
C. 27.4
D. 26.4

**Answer:** D. 26.4

**Explanation:** N = 23, so the target position is 4 × 23 / 10 = 9.2. This lies in 20–30. Using L + [(target − cumulative frequency before the class) / class frequency] × class width gives 20 + [(9.2 − 6) / 5] × 10 = 26.4.

## STAT-QL-044 — Percentile from grouped data

**Semantic contract:** Interpolate a requested percentile in a grouped continuous frequency distribution from its percentile class and displayed frequency data.

For grouped data, P25 is estimated by linear interpolation at position 25N/100. For the distribution below, P25 is:
| Class interval | Frequency |
|---:|---:|
| 0–10 | 2 |
| 10–20 | 4 |
| 20–30 | 5 |
| 30–40 | 7 |
| 40–50 | 5 |

A. 18.38
B. 21.38
C. 20.38
D. 19.38

**Answer:** D. 19.38

**Explanation:** N = 23, so the target position is 25 × 23 / 100 = 5.75. This lies in 10–20. Using L + [(target − cumulative frequency before the class) / class frequency] × class width gives 10 + [(5.75 − 2) / 4] × 10 ≈ 19.38.

## STAT-QL-045 — Range of raw observations

**Semantic contract:** Calculate the absolute range as the difference between the largest and smallest observations.

The range of the observations 30, 35, 38, 42, 47, 50 is:

A. 21
B. 20
C. 22
D. 19

**Answer:** B. 20

**Explanation:** The largest value is 50 and the smallest is 30. Range = 50 − 30 = 20.

## STAT-QL-046 — Coefficient of range

**Semantic contract:** Calculate the relative range (largest minus smallest) divided by (largest plus smallest), and express it as a percentage when requested.

A data set has smallest observation 18 and largest observation 28. Its coefficient of range, expressed as a percentage, is:

A. 22.74
B. 20.74
C. 21.74
D. 23.74

**Answer:** C. 21.74

**Explanation:** Coefficient of range = (largest − smallest) / (largest + smallest) × 100 = (28 − 18) / (28 + 18) × 100 ≈ 21.74%.

## STAT-QL-047 — Quartile deviation of raw observations

**Semantic contract:** Find Q1 and Q3 with the stated (n+1) linear-interpolation convention and calculate half their difference.

For the ordered observations 30, 34, 36, 39, 43, 45, 48, 52, 54, 57, 61, quartiles are located at position k(n + 1)/4, with linear interpolation when required. The quartile deviation is:

A. 8
B. 9
C. 10
D. 11

**Answer:** B. 9

**Explanation:** Q1 is at position (11 + 1)/4 = 3 and equals 36. Q3 is at position 3(11 + 1)/4 = 9 and equals 54. Quartile deviation = (Q3 − Q1)/2 = (54 − 36)/2 = 9.

## STAT-QL-048 — Coefficient of quartile deviation

**Semantic contract:** Calculate (Q3 minus Q1) divided by (Q3 plus Q1), using quartiles provided in the question.

For a distribution with Q1 = 20 and Q3 = 44, the coefficient of quartile deviation, expressed as a percentage, is:

A. 37.5
B. 36.5
C. 39.5
D. 38.5

**Answer:** A. 37.5

**Explanation:** Coefficient of quartile deviation = (Q3 − Q1)/(Q3 + Q1) × 100 = (44 − 20)/(44 + 20) × 100 ≈ 37.5%.

## STAT-QL-049 — Mean deviation about the arithmetic mean

**Semantic contract:** Calculate the arithmetic mean of absolute deviations from the mean for a small raw data set.

The mean deviation about the arithmetic mean for the observations 24, 28, 32, 32, 36, 40 is:

A. 5
B. 3
C. 6
D. 4

**Answer:** D. 4

**Explanation:** The mean is 32. The absolute deviations are 8, 4, 0, 0, 4, 8. Their sum is 24; dividing by 6 gives mean deviation 4.

## STAT-QL-050 — Mean deviation about the median

**Semantic contract:** Calculate the arithmetic mean of absolute deviations from the median for a small raw data set.

The mean deviation about the median for the observations 16, 20, 24, 24, 28, 32 is:

A. 5
B. 6
C. 4
D. 3

**Answer:** C. 4

**Explanation:** The median is 24. The absolute deviations are 8, 4, 0, 0, 4, 8. Their sum is 24; dividing by 6 gives mean deviation 4.

## STAT-QL-051 — Coefficient of variation

**Semantic contract:** Calculate the coefficient of variation from a stated mean and population standard deviation, or compare relative consistency from given means and standard deviations.

A distribution has arithmetic mean 30 and population standard deviation 9. Its coefficient of variation, expressed as a percentage, is:

A. 32
B. 29
C. 30
D. 31

**Answer:** C. 30

**Explanation:** Coefficient of variation = standard deviation / mean × 100 = 9/30 × 100 ≈ 30%.

## Review checkpoints

- Table presentation corrected after the STAT-005 review pass.

- Confirm stems, data presentation, and explanations read like SSC CGL JSO Paper II questions.
- Confirm the stated partition convention is acceptable for each intended format.
- Confirm rounding, absolute-dispersion, and relative-dispersion treatment.
- This review file does not authorize Question Bank storage, tests, mock tests, localization, publication, or production release.


