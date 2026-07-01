# PCT-006: Percentage Comparison & Comparative Change

## Mission

PCT-006 builds the comparison and base-switching layer of percentage reasoning. It trains students to move correctly between more-than, less-than, reverse comparison, ratio comparison, target matching, and same-percentage versus same-base confusion.

## Educational Boundary

- Focus: comparison-driven percentage reasoning with clear base selection.
- Scope: direct comparison, reverse comparison, selected-base percentage difference, ratio comparison, target matching, chained comparison, percentage-point vs relative change, and cross-base comparison.
- Excluded: mixture/concentration, drying, evaporation, alloy composition, full election applications, full income-expenditure applications, and caselet-style DI.

## Package Philosophy

- Foundation rich on first pass.
- Natural exam-like English from the start.
- Rich CP coverage before later editorial polish.
- Explanation style stays concise and consistent.

## Architecture Reuse

PCT-006 reuses the existing Quant V4 runtime pattern:

- solver
- evidence
- reasoning graph
- explanation renderer
- validator
- pipeline
- coverage auditor
- generation-engine routing
