# PNC-002 Canonical Problems

## Fixed package ownership

| CP | Ownership | Current status |
|---|---|---|
| `PNC-CP-007` | specified objects together/apart, one or more linear blocks, internal block orders and direct block complements | Current English ownership saturated; runtime proof |
| `PNC-CP-008` | fixed positions, starts/ends, relative order, alternation, position classes and explicit gap placement | Current English ownership saturated; runtime proof |
| `PNC-CP-009` | compulsory/excluded members and exact/at-least/at-most category selection | Current English ownership saturated; runtime proof |
| `PNC-CP-010` | circular arrangements and rotational/reflection symmetry | Current English ownership saturated; runtime proof |
| `PNC-CP-011` | labelled/unlabelled grouping and distribution | Grouping Wave 1 runtime proof: `PNC-QL-209..218`; distribution families pending |
| `PNC-CP-012` | exam-relevant mixed systems that cannot be owned cleanly by an earlier CP | Not started |

## CP-007 represented scope

- one specified pair or larger block together;
- one specified pair or complete group not together;
- multiple equal or unequal disjoint blocks together;
- three simultaneous pair-blocks;
- a required block with a separate pair apart;
- two formed blocks together but not adjacent to one another;
- a required block separated from a named outsider;
- one required block together while another group is broken;
- complements in which not every specified block forms simultaneously;
- bounded recovery of total object count or block size, including a separated-block inverse.

## CP-008 represented scope

- one object at an exact position, either end, or away from both ends;
- two specified objects occupying both ends;
- several named objects fixed to prescribed positions;
- a specified set occupying a named set of positions in any order;
- prescribed relative-order chains of lengths two, three and four;
- two independent relative-order chains;
- strict alternation for equal groups, one-extra groups and a fixed starting category;
- gap placement so no two members of a category or specified set are adjacent;
- exact, at least and at most separation between a specified pair;
- directional exact separation with one named object before another;
- exact and at-least counts of specified objects in odd/even position classes;
- bounded recovery of an exact gap parameter.

## CP-009 represented scope

- compulsory, excluded and compulsory-plus-excluded named members;
- exact, at-least, at-most and inclusive-range category quotas;
- participation from one, two or three required categories;
- exact, at-least, at-most and inclusive-range counts from a specified subset;
- all-or-none, implication and not-all-together member conditions;
- named compulsory/excluded members combined with category quotas;
- bounded recovery of total pool size or category size.

## CP-010 represented scope

- distinct round-table arrangements and reference-person normalization;
- one or more circular blocks and direct complements;
- a specified circular group not entirely consecutive;
- pair-event inclusion–exclusion for at least one, neither and exactly one of two disjoint pairs together;
- neighbouring, opposite and directed clockwise conditions;
- exact, minimum and maximum clockwise gaps;
- prescribed clockwise relative order;
- equal-category alternation and circular gap placement;
- bounded recovery from unrestricted or pair-together circular counts;
- rotation-only circular displays;
- distinct necklaces under rotation and reflection;
- reflection-equivalent necklaces with a specified adjacent pair;
- choosing a proper subset of distinct objects and arranging the chosen objects circularly when rotations alone are identified;
- choosing a proper subset of distinct objects for a reversible ring when rotations and reflections are identified;
- round-table seatings identified by each person's unordered neighbour pair, which merges reversed cycles.

## CP-011 represented grouping scope

The first admitted English runtime wave contains ten QLs, `PNC-QL-209` through `PNC-QL-218`, and seven materially distinct solve modes:

- distinct objects divided into two named groups of unequal prescribed sizes;
- distinct objects divided into several numbered equal groups;
- distinct objects divided into unnamed groups of three distinct prescribed sizes;
- distinct objects divided into unnamed equal groups;
- unnamed groups with two repeated size classes and separate interchange corrections;
- division into unnamed pairs;
- two specified members in the same or different named equal group;
- two specified members in the same or different unnamed equal group.

Equal and unequal labelled-group presentations reuse one prescribed-group authority. Unnamed pairs reuse the general unnamed-equal-group authority. These merges avoid cosmetic solve-mode inflation while retaining distinct learner-facing QLs where the exam wording and misconception profile materially differ.

The broader executable discovery remains active for:

- distinct objects assigned to labelled boxes with unrestricted, non-empty, exact-use and occupancy conditions;
- distinct objects partitioned into identical non-empty boxes through Stirling/Bell authority;
- identical objects distributed among labelled boxes through stars-and-bars, minimum and controlled capacity conditions;
- identical objects distributed into identical non-empty boxes through integer-partition authority;
- bounded inverse recovery for selected grouping/distribution parameters.

The companion discovery matrix uses temporary `CP011-DISC-*` IDs for not-yet-admitted contracts. Those IDs are not question-language IDs and do not reserve final solve modes.

## Negative boundaries

The active or discovering CPs do not own:

- ordinary committee selection without a partition after selection — CP-003 or CP-009;
- role assignment after selection — CP-006;
- linear or circular arrangement inside or between groups — CP-007, CP-008 or CP-010;
- conditional or category-restricted selection followed by a circular arrangement — CP-012;
- category quotas distributed across multiple groups, non-uniform capacity systems or other coupled advanced constructions whose primary difficulty is mixed casework — CP-012 unless source and ownership audits justify CP-011;
- repeated-colour necklace systems requiring Burnside/Pólya analysis — CP-012 unless separately justified;
- word-specific repeated-letter restrictions whose primary authority is multiset identity — CP-005.

Pure selection of an unrestricted proper subset followed directly by circular equivalence is CP-010 ownership. It becomes CP-012 only when the selection itself introduces named-member, category, quota or other mixed-system conditions.

Current implemented PNC-002 QLs are `PNC-QL-107` through `PNC-QL-218`. The next available immutable family ID is `PNC-QL-219`.
