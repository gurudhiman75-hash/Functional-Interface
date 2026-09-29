# STAT-006 — Moments, Skewness and Kurtosis

## Ownership

STAT-006 covers raw moments of orders two through four, central moments of orders two through four, raw-to-central identities, affine transformations of central moments, and established skewness and kurtosis measures. STAT-001 continues to own the arithmetic mean; STAT-002 owns standard-deviation computation and transformation; STAT-003 owns mean/median/mode relationships; STAT-005 owns quartile and dispersion calculations. This package only uses those established summaries as inputs when calculating a distinct coefficient.

Eighteen permanent contracts reserve STAT-QL-052 through STAT-QL-069 for SSC CGL Tier II and JSO. The package remains English-only controlled review. It does not authorize Question Bank writes, test/mock use, localization, publication, or production release.

## Conventions

- Raw and central moments use population divisor `n` for the displayed finite observations.
- Central moment of order two is variance, not standard deviation. No square root is taken for the second central moment.
- Third central moment retains its sign. The sign gives the direction of moment skewness; a zero third moment alone is not a claim that the full distribution is symmetric.
- Standardized moment skewness uses `β1 = μ3² / μ2³` and `γ1 = μ3 / μ2^(3/2)` as separately named coefficients.
- Bowley's coefficient uses `(Q3 + Q1 − 2Median)/(Q3 − Q1)`; Pearson's first and second coefficients use their own explicit formulas.
- Moment kurtosis is `β2 = μ4 / μ2²`; excess kurtosis is `γ2 = β2 − 3`. Classification compares β2 with 3.
- Questions state relevant definitions/formulae when a convention could otherwise be unclear. Displayed calculations use two decimal places where needed.

## Exclusions

This package does not regenerate raw mean, standard deviation, median, mode, quartiles, or any DI chart-reading task. Correlation and regression remain a later ownership group. All numeric derivations are bound to generator state and independently recomputed in the deterministic proof.
