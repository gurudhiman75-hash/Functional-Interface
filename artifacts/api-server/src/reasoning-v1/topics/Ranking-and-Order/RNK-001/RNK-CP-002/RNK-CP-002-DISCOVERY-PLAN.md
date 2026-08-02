# RNK-CP-002 Discovery Plan

Status: **open discovery register — counts are not quotas**.

## 1. Core state dimensions

Every candidate contract must be tested across:

- first and second position from the same start end;
- derived ranks from the opposite end;
- first person before or after the second person;
- adjacent, near, wide-gap and endpoint placements;
- odd and even group totals;
- total known, total unknown and total bounded;
- same-end and mixed-end evidence;
- exact, minimum, maximum, possible and indeterminate answer semantics;
- merit-list, horizontal-row and queue renderers.

## 2. Candidate query families

### Direct two-position queries

- people strictly between two ranks from the same end;
- raw difference between two positions;
- identify which person is nearer a named end;
- compare who ranks higher after common-end normalization.

### Relative-offset queries

- second rank from first rank plus a known positional offset;
- first rank from second rank plus a known positional offset;
- offset from two ranks;
- people-between from rank plus relative-order evidence;
- inverse direction under start-side and end-side numbering.

### Mixed-end queries

- people between when total is known;
- total when relative order is known;
- total when one person is definitely before the other;
- two possible totals when relative order is unknown;
- minimum or maximum possible total;
- determine whether a proposed total is valid;
- identify which relative order is compatible with a stated total.

### Constraint and edge queries

- adjacent positions (`between = 0`);
- one person at the first or last position;
- equal numerical ranks from opposite ends referring to different positions;
- invalid totals smaller than a supplied end-rank;
- impossible between-counts;
- coincident-position rejection;
- cases where only one of the two mixed-end arrangements is valid;
- cases where both arrangements are valid.

## 3. Provisional first wave

The first executable wave probes six contracts:

1. people between from same-end ranks;
2. position gap from same-end ranks;
3. second rank from a relative offset;
4. people between from mixed-end ranks and total;
5. total from mixed-end ranks, between-count and known order;
6. minimum/maximum total from mixed-end ranks and unknown order.

The wave is intentionally incomplete. It exists to establish shared state, solvers, option construction, deterministic generation and lifecycle locks before source saturation.

## 4. Merge/split questions to resolve later

- Do people-between and raw position-gap require separate authorities because the requested quantity and endpoint adjustment differ?
- Can start-side and end-side relative-offset queries merge under a side parameter?
- Can both known-order total equations merge under a relative-order parameter?
- Should minimum and maximum possible total be one authority with an extremum parameter?
- Does “which order is possible?” require a separate boolean/choice authority?
- Are nearer/farther comparison questions merely renderers over normalized positions or separate answer contracts?

No answer is frozen until executable evidence and editorial review support it.

## 5. Ownership boundaries

```text
one-person arithmetic                         -> RNK-CP-001
positions of two distinct people             -> RNK-CP-002
swap, move, overtake, insert, remove          -> RNK-CP-003
three-or-more-person order reconstruction     -> RNK-CP-004
shared passage                                -> later RNK checkpoint
facing or adjacency geometry                  -> Seating Arrangement
statement I/II sufficiency                    -> Data Sufficiency
multi-attribute assignment                    -> Logic Puzzles
```

## 6. Freeze prohibition

Until the final audit sequence is complete:

```text
permanentQlCount:             0
frozenSolveModeCount:         0
englishDiscoveryFrozen:       false
questionStudioDiscoverable:   false
questionBankWritable:         false
testEligible:                 false
publiclyPublishable:          false
```
