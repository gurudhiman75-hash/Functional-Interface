# DIR-001 Need-Based QL and Solve-Mode Policy

Status: authoritative amendment to `DIR-001-END-TO-END-DESIGN.md`.

## Governing correction

The earlier `240`-QL allocation and fixed QL ranges are planning scaffolds only. They are not implementation quotas and must not force artificial Question Logics.

The implementation policy is now:

```text
QL count          = need-based
solve-mode count  = need-based and optional
QL identity       = permanent after merge
QL numbering      = continuous chapter-wide
checkpoint scope  = stable ownership boundary
```

A checkpoint may contain fewer or more QLs than the original planning table when the audited runtime decomposition justifies it. No QL may be created only to fill a reserved range.

## When a new QL is justified

A new QL requires at least one material difference in:

- hidden-state topology;
- answer demand;
- solve direction, such as forward solving versus inverse reconstruction;
- generator contract or safe parameter domain;
- independent-solver contract;
- renderer or structured-prompt contract;
- misconception and distractor model;
- reconstruction or uniqueness burden;
- localization behavior.

Changing only names, places, distances, directions, wording, units, seed values, option order or surface context does not justify another QL.

## Solve modes

`solveMode` is not a closed enum and is not mandatory on every QL. It may be introduced only when it identifies a materially separate solver entry point or validation contract.

Closely related QLs should instead share solver capabilities and pass their structured query demand to the same independent solver.

A new solve mode must document:

1. its operation family;
2. its independent solver entry point;
3. why the existing solver capability cannot express it cleanly.

## Allocation workflow

```text
research an exam pattern
  -> construct its hidden state
  -> compare with existing QLs and solver capabilities
  -> prove a material runtime difference
  -> allocate the next continuous DIR-QL ID
  -> keep that ID permanent after merge
```

The implementation manifest in `DIR-001-CHAPTER-MANIFEST.ts` is the machine-readable source of truth for this policy.
