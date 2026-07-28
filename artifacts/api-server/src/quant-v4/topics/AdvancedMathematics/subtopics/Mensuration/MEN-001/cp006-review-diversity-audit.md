# MEN-CP-006 — Human-Review Diversity Audit

## Purpose

The CP-006 review export must expose genuine parameter variation rather than repeating an identical generated question under different seed labels.

## Acceptance contract

- export three deterministic review samples for every active CP-006 QL;
- require all three samples to have distinct stem-and-answer fingerprints;
- search additional deterministic seeds when the first three seeds collide;
- fail the review export if three distinct CP-006 questions cannot be produced within the bounded search;
- preserve the established export behaviour for CP-001 through CP-005.

## Product-review finding

The first synced CP-006 review pack contained 11 repeated sample rows across 108 exported rows. The repetitions were valid generated questions, but they weakened human-review evidence by presenting the same parameter state more than once.

The exporter now selects three distinct CP-006 states per QL and treats an insufficient state pool as a validation failure rather than silently accepting duplicate evidence.
