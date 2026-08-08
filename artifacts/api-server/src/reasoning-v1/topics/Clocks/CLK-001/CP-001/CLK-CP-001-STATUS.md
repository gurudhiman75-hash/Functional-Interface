# CLK-CP-001 — Angle at a Stated Time

Status: **open executable discovery; English review evidence only; no permanent QLs.**

## Ownership

This checkpoint owns direct angle evaluation after the relevant clock time is known.

Included discovery dimensions:

- smaller angle between the hour and minute hands;
- reflex angle between the hour and minute hands;
- clockwise directed angle from hour hand to minute hand;
- clockwise directed angle from minute hand to hour hand;
- direct stated time;
- a whole-minute time stated as a duration after an anchor;
- a whole-minute time stated as a duration before an anchor.

The four angle contracts and three time frames create twelve executable review combinations. They are **not twelve proposed QLs**. Merge/split and source-frequency audits remain pending.

Excluded from this slice:

- time at which a target angle occurs;
- coincidence/right-angle/opposition enumeration;
- second-hand questions;
- faulty clocks;
- striking clocks;
- mirror-time arithmetic;
- learner-facing clock diagrams;
- localisation and Question Studio registration.

## Runtime authority

The runtime uses the exact temporal foundation:

```text
hour angle   = 30H + M/2
minute angle = 6M
```

The canonical answer uses the exact hand-position snapshot. The independent verifier derives the relative phase directly from elapsed seconds:

```text
relative minute-hour phase = 11 × elapsed seconds / 120  (mod 360°)
```

The two paths must agree exactly. No floating-point value determines an answer or option.

## Distractor ownership

Every wrong option is generated from a named method and independently reproducible:

- ignored the stated forward/backward time shift;
- snapped the hour hand to the hour numeral;
- selected the reflex angle instead of the smaller angle;
- selected the smaller angle instead of the reflex angle;
- reversed the requested clockwise direction;
- added the formula terms instead of separating them;
- used 1° per minute for the hour hand;
- used 5° per minute for the minute hand;
- used one hand's position from 12 as the separation.

Arbitrary nearby-number distractors are prohibited.

## Proof corpus

The dedicated proof targets:

```text
4 angle modes × 3 time frames × 100 seeded questions = 1,200 questions
```

It validates deterministic replay, exact dual-solver agreement, four semantic options, one correct answer, distractor reproducibility, answer-position balance, scenario diversity, explanation structure and lifecycle locks.

The human review artifact contains 24 questions:

```text
2 per angle-mode/time-frame combination
A / B / C / D = 6 / 6 / 6 / 6
```

Each review card includes a reviewer-only analog clock rendered from the same shared hand-angle authority used by Mirror/Water.

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

## Next gate

After exact-head proof and human review:

1. audit the 24-question editorial artifact;
2. compare source frequency for smaller, reflex and directed forms;
3. perform merge/split and difficulty review;
4. revise stems, distractors or explanations where necessary;
5. decide whether the checkpoint is ready for a larger English review candidate.
