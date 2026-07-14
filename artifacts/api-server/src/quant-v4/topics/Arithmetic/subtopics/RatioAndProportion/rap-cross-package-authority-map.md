# RAP Cross-Package Authority Map

Reviewed date: 2026-07-11

## Ownership Decisions

| Concept family | Owner | RAP-002 policy | RAP-003 policy |
|---|---|---|---|
| Linked chains, reverse chains, transformations, conditional partitions | RAP-002 | Active mechanics | Not duplicated |
| Election margin, winner/loser, turnout, valid/invalid votes | RAP-003 | RAP-QL-407 to RAP-QL-409 deactivated | Active application family |
| Income, expenditure, and savings reconciliation | RAP-003 | RAP-QL-507 and RAP-QL-508 deactivated | Active application family |
| Race lead | RAP-003 | RAP-QL-608 deactivated | Active rate-product application family |
| Pure worker-days, machines-hours, speed-time, efficiency-time ratios | RAP-002 | Active only as direct/inverse mechanics | Active when embedded in a full application |
| Combined direct/inverse factor chains | RAP-002 | Active | Used only where application context is the real learning target |

## Duplicate Audit Rule

Two QLs conflict only when all four elements match: requested unknown, mathematical relation, rendered givens, and solution method. Similar wording or a shared sub-step is not enough.

## Status

The six deactivated RAP-002 QLs remain as historical library entries with active set to false. They are excluded from runtime selection, coverage, review export, and residual QA. RAP-003 owns the corresponding full application domains.
