# SEA-001 — Deep Audit Wave 03

Date: 2026-09-29

Status: `QUERY_BREADTH_EXPANDED__NINE_CONTRACT_CANDIDATE_TAXONOMY_FROZEN_FOR_ALLOCATION_REVIEW`

## New source-backed query coverage

Wave 03 adds review-only facing-state coverage over the verified CP002 mixed-facing solved model:

- count persons facing north/south;
- identify an extreme-end person together with that person's facing.

These are compressed into one learner contract: `RESOLVE_FACING_STATE`.

The query extension preserves:

- deterministic replay;
- verified solved-state derivation;
- four unique options;
- exact keyed answer;
- all four answer positions;
- review-only lifecycle;
- zero permanent allocation.

## Candidate taxonomy

After merge/split compression, SEA-001 currently requires nine distinct learner contracts:

1. endpoint identification;
2. person at relative position;
3. relative-position description;
4. immediate-neighbour pair;
5. linear number-between;
6. directional circular number-between;
7. opposite person;
8. directional sequence;
9. facing-state resolution.

## Important merges

The following do **not** justify separate permanent QLs:

- immediate versus second/third/k-th left/right;
- centre-facing versus outward-facing versus mixed-facing;
- north-facing versus south-facing;
- one end versus both extreme ends;
- relation description versus definitely-true relation statement;
- facing count versus person-plus-facing answer;
- "everyone changes facing" counterfactual versus the underlying relative-position query.

The facing-change shell remains a harder transformed-state practice variant of the relative-position learner contract.

## Planning-only query IDs

`SEA-QC-004`, `SEA-QC-014` and `SEA-QC-015` remain declared but have no generated evidence anywhere in SEA-001.

They remain unallocated planning scaffolding and cannot create permanent QLs merely because an ID exists.

## Topology saturation boundary

SEA-001 topology ownership is complete at:

- single row, same facing;
- single row, mixed facing;
- circular centre-facing;
- circular outward-facing;
- circular mixed-facing.

Do not pull these into SEA-001:

- parallel rows;
- polygonal seating;
- multi-ring seating;
- attribute-linked arrangements;
- vacant-seat arrangements;
- ranking-linked or other advanced arrangement systems.

Those remain SEA-002 / SEA-003 ownership.

## Current allocation decision

The nine-contract registry is frozen as the **candidate allocation authority** only.

Permanent `SEA-QL-*` IDs are not yet assigned by this wave.

Before allocation, the next checkpoint must:

- bind each existing runtime query ID and extension kind to the candidate registry;
- ensure every generated child can expose one canonical QL without altering answer semantics;
- verify no checkpoint requires an additional contract after cross-checking its actual child mix;
- preserve practice-only status for the counterfactual facing transform;
- keep lifecycle activation closed.

## Lifecycle

- permanent QLs: 0;
- Question Studio: not registered;
- Question Bank: locked;
- tests/mocks/public delivery: locked;
- English freeze: not started;
- Hindi/Punjabi localization: not started.

## Next wave

Wave 04: allocate the nine permanent learner contracts, retrofit runtime QL mapping without changing topology/solver semantics, and prove backward compatibility across CP001–CP005.
