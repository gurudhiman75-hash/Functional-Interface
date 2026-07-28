# BLR-001 — Open QL Discovery Policy

Status: **authoritative for unfinished BLR-001 checkpoints**.

No total chapter QL count and no checkpoint QL range is frozen by the end-to-end design. Permanent identities are allocated only after executable prototype discovery.

## Required sequence

```text
source and boundary audit
  -> non-permanent prototype contracts
  -> deterministic runtime proof
  -> independent-solver proof
  -> editorial saturation
  -> merge/split audit
  -> inverse-contract audit
  -> gap audit
  -> discovery freeze
  -> permanent sequential QL allocation
```

## Current state

`BLR-CP-001` currently has four executable prototype contracts and zero permanent QLs.

The prototypes prove the shared graph foundation and relation-path solver. They do not establish that CP-001 has exactly four eventual QLs. Query shape, answer semantics and source-backed exam ownership remain under discovery.

## Prohibited actions before freeze

- assigning `BLR-QL-*` IDs;
- declaring a final QL count;
- making the runtime Question Studio visible;
- localising unstable English contracts;
- marking any prototype publicly publishable;
- treating path length, names or difficulty alone as separate QLs.
