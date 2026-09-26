# CLK-001 Foundation Status

Status: **implementation proof in progress; no learner checkpoint or permanent QL is activated.**

## Branch basis

This slice is stacked on `feat/spa-fnd-001-wave03-perceptual-remediation` at `3c7cface0560632376c08e7c3651dd22fc382aa0` so the Clocks chapter and the already-proved Mirror/Water clock renderer consume one hand-angle authority.

## Implemented in this slice

- reduced exact rational arithmetic using `bigint`;
- exact 12-hour time representation with rational seconds;
- modulo-safe conversion between time parts and elapsed seconds;
- continuous hour, minute and second-hand angles;
- exact smaller, reflex and directed hour-minute separations;
- canonical component-form solution path;
- independent full-cycle-period verification path;
- exhaustive second-level proof across one complete 12-hour cycle;
- exact time round-trip proof across one complete 12-hour cycle;
- spatial clock adapter migrated to the shared temporal authority;
- complete minute-level Mirror clock regression proof.

## Correctness contracts

```text
hour angle   = 30H + M/2 + S/120
minute angle = 6M + S/10
second angle = 6S
```

All values remain exact until a renderer explicitly asks for numeric coordinates. The spatial renderer receives numbers only through the adapter after the exact authority has solved the hand positions.

The independent verifier does not reuse the component formulas. It derives each hand angle from:

```text
elapsed seconds / hand cycle seconds * 360 degrees
```

## Deliberately deferred

- question stems, options and explanations;
- permanent `CLK-CP-001` solve inventory;
- inverse angle/event roots;
- coincidence/right-angle counting;
- faulty clocks;
- striking clocks;
- localisation;
- Question Studio registration;
- Question Bank writes.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

## Next controlled slice

After exact-head CI proof and review, implement `CLK-CP-001 — Angle at a stated time` on this foundation with deterministic scenarios, misconception-owned options, question-specific explanations and an independent answer proof.
