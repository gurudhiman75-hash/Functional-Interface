# PNC-002 Canonical Problems

## Fixed package ownership

| CP | Ownership | Current status |
|---|---|---|
| `PNC-CP-007` | specified objects together/apart, one or more linear blocks, internal block orders and direct block complements | Current English ownership saturated; runtime proof |
| `PNC-CP-008` | fixed positions, starts/ends, relative order, alternation, position classes and explicit gap placement | Current English ownership saturated; runtime proof |
| `PNC-CP-009` | compulsory/excluded members and exact/at-least/at-most category selection | Current English ownership saturated; runtime proof |
| `PNC-CP-010` | circular arrangements and rotational/reflection symmetry | Current English ownership saturated; runtime proof |
| `PNC-CP-011` | labelled/unlabelled grouping and distribution | Current English ownership saturated; reviewed runtime proof: `PNC-QL-209..241` |
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

Grouping Wave 1 contains ten English QLs, `PNC-QL-209` through `PNC-QL-218`, and seven materially distinct solve modes:

- distinct objects divided into named groups of prescribed unequal or equal sizes;
- distinct objects divided into unnamed groups with distinct, equal or repeated size classes;
- division into unnamed pairs;
- two specified members in the same or different named equal group;
- two specified members in the same or different unnamed equal group.

Equal and unequal labelled-group presentations reuse one prescribed-group authority. Unnamed pairs reuse the general unnamed-equal-group authority. These merges avoid cosmetic solve-mode inflation while retaining materially different learner-facing QLs.

## CP-011 represented distinct-object distribution scope

Distribution Wave 1 contains ten English QLs, `PNC-QL-219` through `PNC-QL-228`, and ten solve modes:

- unrestricted assignment to labelled receivers;
- every labelled receiver non-empty;
- exactly a stated number of labelled receivers used;
- at least one labelled receiver empty;
- a prescribed occupancy vector;
- exact occupancy of one receiver, with other receivers unrestricted or non-empty;
- exactly or at most a stated number of identical non-empty receivers through Stirling authority;
- all unnamed non-empty set partitions through Bell-number authority.

## CP-011 represented identical-object distribution scope

Distribution Wave 2 contains ten English QLs, `PNC-QL-229` through `PNC-QL-238`, and ten solve modes:

- weak compositions into labelled receivers;
- positive compositions with every receiver non-empty;
- exactly a stated number of labelled receivers used;
- at least one labelled receiver empty by complement;
- a common minimum for every receiver;
- a minimum for one specified receiver, with other receivers unrestricted;
- every receiver non-empty plus a larger minimum for one specified receiver;
- one common finite capacity for every labelled receiver through controlled inclusion-exclusion;
- exactly or at most a stated number of identical non-empty receivers through integer partitions.

The capacity contract is deliberately limited to one uniform capacity. Non-uniform capacity vectors remain outside CP-011 current ownership.

## CP-011 represented inverse scope

The bounded inverse wave contains three English QLs, `PNC-QL-239` through `PNC-QL-241`, and three solve modes:

- recover the total number of distinct people from the count of divisions into two unnamed equal groups;
- recover the number of labelled receivers from a distinct-object assignment count;
- recover the number of labelled receivers from an identical-object weak-composition count.

Every inverse problem publishes an explicit bounded search domain and is admitted only when exactly one candidate reproduces the target.

## CP-011 saturation verdict

Current English ownership is saturated at runtime-proof maturity:

- 33 QLs: `PNC-QL-209` through `PNC-QL-241`;
- 30 materially distinct solve modes;
- difficulty snapshot: 3 Easy / 17 Medium / 13 Hard;
- grouping, distinct-object distribution, identical-object distribution and bounded inverse directions represented;
- receiver identity, object identity, occupancy policy, relation restrictions and solve direction explicitly audited;
- final counts remain regression snapshots, not design quotas.

The next immutable PNC family ID is `PNC-QL-242`, reserved for the next admitted CP-012 contract.

## Negative boundaries

CP-011 does not own:

- ordinary committee selection without a partition after selection — CP-003 or CP-009;
- role assignment after selection — CP-006;
- linear or circular arrangement inside or between groups — CP-007, CP-008 or CP-010;
- conditional or category-restricted selection followed by a circular arrangement — CP-012;
- category quotas coupled across multiple groups — CP-012;
- non-uniform capacity vectors, mixed distinct/identical object pools or per-object eligibility matrices — CP-012 unless a future source audit establishes a clean standalone authority;
- distribution followed by internal arrangement or other mixed casework systems — CP-012;
- repeated-colour necklace systems requiring Burnside/Pólya analysis — CP-012 unless separately justified;
- word-specific repeated-letter restrictions whose primary authority is multiset identity — CP-005.

Pure selection of an unrestricted proper subset followed directly by circular equivalence is CP-010 ownership. It becomes CP-012 only when the selection itself introduces named-member, category, quota or other mixed-system conditions.

Current implemented PNC-002 QLs are `PNC-QL-107` through `PNC-QL-241`. The next available immutable family ID is `PNC-QL-242`.
