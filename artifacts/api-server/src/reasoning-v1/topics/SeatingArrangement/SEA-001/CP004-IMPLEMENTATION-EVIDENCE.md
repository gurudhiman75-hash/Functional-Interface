# SEA-001 CP-004 Outward-Facing Implementation Evidence

## Authority boundary

Implements `SEA-CP-004 — Circular, Facing Outward` from the approved **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

Named authorities:

- `SEA-PBA-013` — outward-facing opposite-anchor cycle;
- `SEA-PBA-014` — outward left/right reversal-intensive chain;
- `SEA-PBA-015` — outward gap and neighbour mix;
- `SEA-PBA-016` — outward external-landmark anchor and reversal.

## Delivered behavior

- 6–10 person outward-facing circles;
- guarded odd 7/9 variants without opposite clues or opposite questions;
- explicit outward rule: left is anticlockwise and right is clockwise;
- shared ring geometry but a separate clue evaluator and independent oracle from CP-003;
- rotation-class canonicalisation and explicit entrance/stage/door landmark variants;
- full displayed-clue removal audit;
- four linked child questions with distinct query facts;
- one mandatory child per caselet whose answer changes under the incorrect centre-facing rule;
- wrong centre-facing answer retained as reproducible misconception metadata;
- deterministic JSON, CSV and HTML review export for 48 English caselets;
- all activation and permanent-allocation locks retained.

## Repository proof

GitHub Actions run: `31303781279`

```text
PASS_SEA_001_CP004_OUTWARD
named blueprint authorities 4
generated deterministic caselets 400
generated child questions 1600
odd-seat guarded caselets 132
landmark-anchored caselets 100
centre-rule reversal detector questions 400
displayed-clue necessity audits 2293
elapsed milliseconds 971
permanent QLs 0
```

## Real artifact review

A generated `SEA-PBA-013` caselet used the outward clockwise chain:

```text
A → E → D → J → B → C → I → H → F → G → A
```

For the question `Who sits second to the left of A?`:

- correct outward-facing answer: `F`;
- incorrect centre-facing counterfactual: `D`;
- explanation: outward-facing left means anticlockwise.

The reviewed `SEA-PBA-015` and `SEA-PBA-016` samples also confirmed:

- directional gap and adjacency clues were both necessary;
- odd landmark circles emitted sequence questions instead of illegal opposite questions;
- student-facing stems did not expose internal canonicalisation language;
- every option set contained one correct and three semantically distinct answers.

## Closed gates

```text
Permanent QLs:              0
Question Studio registered: false
Question Bank writable:     false
Test eligible:              false
Publicly publishable:       false
English freeze:             not started
```

`SEA-CP-005 — Circular, Mixed Facing` remains the only unfinished SEA-001 checkpoint.
