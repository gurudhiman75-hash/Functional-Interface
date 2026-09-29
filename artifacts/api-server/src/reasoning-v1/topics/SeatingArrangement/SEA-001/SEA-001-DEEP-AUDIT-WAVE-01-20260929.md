# SEA-001 — Deep Audit Wave 01

Date: 2026-09-29

Status: `TOPOLOGY_SCOPE_COMPLETE__QUERY_MIX_AND_PERMANENT_QL_AUDIT_OPEN`

## Current topology authority

SEA-001 now has executable implementations for all five intended foundation checkpoints:

- `SEA-CP-001` — single row, same facing;
- `SEA-CP-002` — single row, mixed facing;
- `SEA-CP-003` — circular, facing centre;
- `SEA-CP-004` — circular, facing outward;
- `SEA-CP-005` — circular, mixed facing.

Named blueprint authorities are continuous from `SEA-PBA-001` through `SEA-PBA-020`.

SEA-002 and SEA-003 remain owners for parallel rows, polygonal/multi-ring seating, attribute-linked seating, vacant seats and other advanced families.

## CP005 stale-state remediation

The top-level README, family manifest and lifecycle roadmap still described CP005 as unfinished.

That is stale. CP005 already has:

- four named mixed-circle blueprints;
- deterministic generation;
- independent production/oracle agreement;
- displayed-clue necessity proof;
- known-facing, inferred-facing, opposite/gap and conditional-orientation variants;
- facing-counterfactual misconception proof;
- four-child caselets;
- 48-caselet English review exporter.

Wave 01 aligns the roadmap state to the implemented repository.

## Implemented learner-query surface

The actually generated child-query contracts are:

- `SEA-QC-001` — occupant at an extreme/end position;
- `SEA-QC-003` — k-th person to the left/right of a reference;
- `SEA-QC-005` — immediate left/right person;
- `SEA-QC-006` — immediate-neighbour pair;
- `SEA-QC-008` — number of persons between two people in a linear row;
- `SEA-QC-009` — directional arc count between two people in a circle;
- `SEA-QC-010` — person opposite a reference;
- `SEA-QC-020` — ordered clockwise/anticlockwise sequence;
- `SEA-QC-022` — counterfactual facing-change relative-position query.

Planning-only IDs `SEA-QC-004`, `SEA-QC-014` and `SEA-QC-015` are declared in types but have no generated runtime evidence. They are not allocation evidence.

## First merge/split decision

`SEA-QC-005` is not a distinct learner solve contract from `SEA-QC-003`.

Immediate-left/right is simply the `steps = 1` subtype of the general relative-position query.

Therefore permanent taxonomy must not allocate separate QLs solely for immediate versus second/third/k-th relative position.

Likewise, centre-facing, outward-facing, north/south mixed-facing and mixed-circle facing are topology/facing scenario dimensions around the same relative-position learner contract. They do not justify separate QLs by themselves.

## Source-backed query gaps

The implemented topology coverage is stronger than the implemented child-query breadth.

Recurring exam-style seating outputs not yet generated include:

1. **relative-position description** — identify the relation of one person with respect to another, e.g. second/third left/right;
2. **extreme-end pair** — identify the two people occupying the row ends;
3. **definitely-true relation/statement** — select the one option that correctly describes the solved arrangement.

These are answer-contract gaps, not new seating topologies.

They must be implemented or explicitly rejected with source/ownership evidence before query-mix freeze.

## Current anti-inflation candidate inventory

Before the source-gap remediation, the implemented generated surface compresses to these provisional learner contracts:

1. endpoint occupant;
2. relative-position person (includes immediate/k-th);
3. neighbour pair;
4. undirected linear between-count;
5. directional circular between-count;
6. opposite person;
7. directional ordered sequence;
8. counterfactual facing-change relative query.

This is an audit inventory only. No permanent `SEA-QL-*` allocation is authorized yet.

## Why linear and circular count remain separate candidates

Linear between-count has one physical interval between endpoints.

Circular directional count requires choosing and following a named arc; the opposite arc can produce a different answer and is a central misconception.

The learner evidence topology is therefore materially different enough to remain separate during the merge/split audit.

## Lifecycle

No lifecycle promotion occurs in Wave 01.

- permanent QLs: 0;
- solve inventory: open;
- query mix: open;
- English freeze: not started;
- Question Studio: not registered;
- Question Bank/test/mock/public delivery: locked.

## Next wave

Wave 02 should implement and independently prove the missing source-backed query contracts without changing topology ownership, then rerun merge/split and saturation analysis before permanent allocation.
