# PNL-001 Standalone Dynamic Completeness Report

## Result

The Profit & Loss chapter now has a standalone English `DYNAMIC_CANDIDATE` runtime for every frozen question language from `PNL-QL-001` through `PNL-QL-186`.

```text
Canonical problem:         PNL-001
Completed CP runtimes:     6 / 6
Owned QLs:                 186 / 186
Seeds per QL:              24
Validated packages:        4,464
Easy packages:               624
Medium packages:            1,416
Hard packages:              2,424
Runtime mode:               DYNAMIC_CANDIDATE
Review status:              UNREVIEWED_DYNAMIC_CANDIDATE
Question Bank status:      NOT_STORED
Test eligibility:          INELIGIBLE
Publicly publishable:      false
```

## Exact CP ownership

| CP | QL range | QLs | Validated packages |
|---|---:|---:|---:|
| `PNL-CP-001` | `PNL-QL-001..036` | 36 | 864 |
| `PNL-CP-002` | `PNL-QL-037..070` | 34 | 816 |
| `PNL-CP-003` | `PNL-QL-071..094` | 24 | 576 |
| `PNL-CP-004` | `PNL-QL-095..120` | 26 | 624 |
| `PNL-CP-005` | `PNL-QL-121..149` | 29 | 696 |
| `PNL-CP-006` | `PNL-QL-150..186` | 37 | 888 |

The aggregate audit found:

- no missing QLs;
- no duplicate QL ownership;
- no cross-CP overlap;
- exact contiguous ordering from 001 through 186;
- 4,464 globally unique generated question IDs.

## Aggregate proof obligations

For every QL across all 24 seeds, the audit verifies:

- the package belongs to the correct CP;
- English is used and unsupported Hindi/Punjabi requests fail explicitly;
- runtime mode is `DYNAMIC_CANDIDATE`;
- review status is `UNREVIEWED_DYNAMIC_CANDIDATE`;
- Question Bank status is `NOT_STORED`;
- test eligibility is `INELIGIBLE`;
- public publication is disabled;
- package validation passes;
- four unique options are produced;
- the answer occurs exactly at `correctIndex`;
- generated stems and explanations contain no unresolved prose placeholders;
- every QL varies its stem across the 24-seed sweep;
- deterministic replay succeeds for a representative seed of every QL.

## Representation coverage

The complete runtime includes and preserves:

- paragraph questions;
- tables;
- caselets;
- statement evaluation;
- algebraic presentation;
- data sufficiency;
- false-count and false-metre dishonest-trade cases;
- mixed-direction commercial cases.

## Safety boundary

This audit does not change or approve any generated item for storage or testing. All packages remain review-only candidates.

The audit does **not** modify:

- Question Studio;
- the shared generation engine;
- admin routes;
- Question Studio capability metadata;
- Question Bank approval/write paths;
- test eligibility;
- public publication.

`questionStudioWiringChanged` remains `false`.

## Chapter completion decision

The standalone English dynamic implementation of `PNL-001` is complete at **186/186 QLs across 6/6 CPs**.

Question Studio integration is a separate future decision. It should begin only after reviewing chapter-level generated samples, runtime capability boundaries, multilingual readiness and the intended approval workflow.