# SEA-001 CP-002 Mixed-Facing Implementation Evidence

## Authority boundary

Implements `SEA-CP-002 — Single Row, Mixed Facing` from the approved **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

Named provisional authorities:

- `SEA-PBA-005` — stated mixed facings plus relative chain;
- `SEA-PBA-006` — inferred facing from directional consistency;
- `SEA-PBA-007` — mixed-facing block placement;
- `SEA-PBA-008` — exact-gap relations under mixed facing.

## Delivered behavior

- 6–8 persons with at least two north-facing and two south-facing occupants;
- unique complete state over both seat order and person facings;
- facing-dependent clues evaluated from the reference person's facing;
- direct and inferred facing variants;
- independent production solver and oracle model agreement;
- removal audit for every displayed clue;
- four linked child questions with distinct query facts;
- four semantically unique options per question;
- reference-facing explanation for every facing-dependent child;
- text row diagram with north/south arrows;
- deterministic 48-caselet English review export in JSON, CSV and HTML;
- lifecycle and activation locks retained.

## Local proof

```text
PASS_SEA_001_CP002_MIXED_FACING
named blueprint authorities 4
generated deterministic caselets 400
generated child questions 1600
displayed-clue necessity audits 3410
permanent QLs 0
```

## Reviewed sample findings

A real `SEA-PBA-006` generated caselet was inspected before repository submission. The review confirmed:

- facings were inferred without direct facing statements;
- reciprocal directional clues were semantically valid because the two reference persons faced opposite directions;
- each facing-dependent answer explanation stated the reference person's resolved facing;
- two avoidably repeated person answers were removed from the child mix;
- setup wording was changed to natural exam language;
- count distractors were restricted to physically possible row values.

## Closed gates

```text
Permanent QLs:              0
Question Studio registered: false
Question Bank writable:     false
Test eligible:              false
Publicly publishable:       false
English freeze:             not started
```

`SEA-CP-004` and `SEA-CP-005` remain the next Wave 5 implementation checkpoints.
