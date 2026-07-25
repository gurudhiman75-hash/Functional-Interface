# DIR-001 — Direction and Distance

Status: active implementation.

## Authoritative reading order

1. `DIR-001-END-TO-END-DESIGN.md` — chapter scope, architecture and checkpoint ownership.
2. `DIR-001-NEED-BASED-QL-POLICY.md` — authoritative amendment for QL and solve-mode allocation.
3. `DIR-001-CHAPTER-MANIFEST.ts` — machine-readable policy and checkpoint inventory.
4. `chapter-registry.ts` — actual implemented QL inventory and generation dispatch.

## Important correction

Any fixed QL count or fixed QL range shown in the original end-to-end design is planning scaffolding only. It is superseded for implementation by the need-based policy.

```text
fixed QL total:          none
fixed solve-mode list:   none
QL allocation:           only after material runtime need is proven
solveMode:               optional and open
QL IDs after merge:      permanent
QL numbering:            continuous chapter-wide
```

The actual current inventory is determined only from `chapter-registry.ts`.

## Current implementation

```text
Foundation:   implemented
DIR-CP-001:   3 need-proven English QLs
Hindi:        not started
Punjabi:      not started
Studio wiring:not started
Freeze-ready: no
```

Implemented QLs:

- `DIR-QL-001` — final facing after ordered turns;
- `DIR-QL-002` — initial facing reconstructed from final facing;
- `DIR-QL-003` — missing relative turn reconstruction.

Single versus multiple turns, angle values, names, contexts, wording and option order are runtime variation rather than separate QLs.
