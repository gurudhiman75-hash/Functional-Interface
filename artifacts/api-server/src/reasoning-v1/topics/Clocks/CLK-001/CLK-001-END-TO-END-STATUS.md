# CLK-001 — End-to-End Open-Discovery Status

Sole design authority: `CLK-001-CLOCKS-MASTER-END-TO-END-DESIGN-V2.md`.

Status: **all fourteen checkpoint domains now have shared executable authorities; no permanent QLs or delivery activation.**

## Canonical checkpoint map

The previous prototype labelled angle-at-time as `CLK-CP-001`. The V2 master design is authoritative and supersedes that provisional numbering:

- `CLK-CP-001` — hand movement and rate foundations;
- `CLK-CP-002` — angle at a stated time;
- `CLK-CP-003` — time for a stated arbitrary angle;
- `CLK-CP-004` — special hand events;
- `CLK-CP-005` — event counts and recurrence;
- `CLK-CP-006` — basic uniform gain/loss;
- `CLK-CP-007` — inverse and multi-day faulty clocks;
- `CLK-CP-008` — fault inferred from hand-event frequency;
- `CLK-CP-009` — strike interval mechanics;
- `CLK-CP-010` — hour-strike totals and schedules;
- `CLK-CP-011` — vertical mirror-time arithmetic;
- `CLK-CP-012` — diagram literacy;
- `CLK-CP-013` — hand interchange;
- `CLK-CP-014` — mixed synthesis.

The earlier angle-at-time runtime remains inherited evidence only. It must be migrated to the canonical CP-002 coordinate before any permanent identity decision.

## Implemented shared authorities

- exact hand rates, movement, duration, revolutions and hand-tip arc distance;
- continuous hour/minute/second hand positions;
- smaller, reflex and directed angle contracts;
- exact hour-minute event-root solver;
- independent recurrence enumerator;
- endpoint-aware interval semantics;
- special-event counting and nth occurrence;
- affine actual/displayed faulty-clock mapping and inverse;
- next-correct-on-12-hour-dial solving;
- faulty rate inference from displayed event frequency;
- strike timeline, `n-1` interval authority and schedule totals;
- vertical mirror-time arithmetic and geometric cross-check;
- physical diagram-time validation;
- exact hand-interchange validity solver;
- mixed faulty-clock angle/event composition.

## Ownership boundary

- numeric/textual vertical mirror time: `CLK-001`;
- learner-facing vertical mirror clock diagram selection: `MIR-001`;
- learner-facing horizontal water-image clock diagram selection: `MIR-001`;
- numeric water-image time under a continuous real-clock model: excluded;
- bells ringing together: Number System/LCM;
- general circular track motion: TSD;
- calendar arithmetic: `CAL-001`.

## Proof contracts

The end-to-end proof requires:

- exactly fourteen canonical checkpoints;
- exact standard half-open 12-hour counts: `11 / 11 / 22 / 22`;
- analytic/enumerated root agreement for multiple arbitrary angles;
- affine actual/displayed round trips;
- event-frequency rate recovery;
- strike interval and schedule proofs;
- complete 720-minute mirror arithmetic/geometry agreement;
- invalid diagram rejection;
- exact hand-interchange equation checks;
- inherited foundation, angle prototype and spatial regressions.

## Lifecycle lock

```text
Permanent QLs:                0
English freeze:               false
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
Hindi/Punjabi:                not started
API/database schema changes:  none
```

## Remaining work before any freeze

The design requires source saturation, checkpoint-specific question generators, method-derived distractor packs, exam-natural explanation templates, review exports, merge/split audit, inverse audit, boundary audit, gap audit, difficulty audit and multilingual-risk audit. The present branch completes the shared mathematical runtime and checkpoint architecture; it does not claim editorial freeze or production readiness.
