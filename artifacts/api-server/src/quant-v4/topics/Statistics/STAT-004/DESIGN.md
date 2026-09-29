# STAT-004 — Data Collection, Classification and Tabulation

## Ownership

STAT-004 owns fifteen English review contracts for data sources and collection methods, qualitative and variable classification, one-way/two-way classification, statistical-table components, frequency-total validation, interval boundary rules, and construction of a small frequency table from raw values.

The permanent QL namespace is allocated as STAT-QL-021 through STAT-QL-035 in `permanent-ql-registry.ts`; generation and routing resolve ownership from that registry and do not derive IDs from array positions.

## Overlap decisions

- DI-009 owns histogram reading and its derived totals/classes/measures. STAT-004 does not render or ask learners to calculate from histograms.
- DI-010 owns frequency-polygon construction properties and graph-based questions. STAT-004 does not duplicate its class-mark, plotted-frequency, total, mean, median-class or endpoint tasks.
- STAT-003 owns grouped/discrete mean, median, mode and empirical relations. STAT-004 stops at basic frequency-table formation and tally checks.
- Future sampling designs, sampling errors and sample-size decisions belong to the Sampling Theory package. Here, census versus sample appears only as a collection-scope distinction.

## Generation and validation

- Deterministic scenario pools use the shared Statistics `seededRandom`, `pick` and `shuffle` functions.
- Every item has exactly four distinct options and one indexed answer; the correct option position is seed-shuffled.
- Frequency totals and class tallies are independently checked in the focused test over 50 seeds, two profiles and all fifteen contracts.
- Explanations state the decisive distinction or show the frequency tally and reconciliation.

## Lifecycle

Question Studio controlled review, English only. Question Bank writing, test/mock eligibility, public/automatic publication and production release remain disabled. Localization has not started.

## Scope source

SSC CGL 2026 notification, §13.11.6, Paper-II (Statistics). The representative English review source is included as `REVIEW.md`.
