# SCI Physics Exhaustive V2 — Scope, Gap Closure & Capacity Contract

Status: **REVIEW-ONLY CANDIDATE V2**

## Meaning of exhaustive

`Exhaustive` here means exhaustive for ExamTree's target General Science / Static-GK Physics layer used by SSC, Railways, Police, Banking and state one-day examinations. It does **not** mean undergraduate/JEE-level coverage.

Advanced rotational dynamics, calculus-based mechanics, detailed wave equations, advanced geometrical optics, RLC/phasor analysis, Maxwell-equation derivations, relativity, quantum derivations and advanced semiconductor design remain deliberately out of scope.

## Why V1 was not exhaustive

The V1 CPs had useful reviewed 60-question qualification corpora, but those corpora were fixed review sets. They did not by themselves provide enough chapter breadth or production-scale semantic capacity. V2 keeps the reviewed corpora and adds a structured exhaustive domain/generation layer.

## Gap-closure matrix

| CP | Area | V2 breadth added/strengthened |
|---|---|---|
| SCI-CP-001 | Measurement, Units & Basic Physics | least count; accuracy vs precision; systematic error; significant figures; SI prefixes; dimensional formulae; scientific notation; finer instrument selection |
| SCI-CP-002 | Motion, Force & Laws of Motion | distance/velocity graph interpretation; impulse; balanced forces; centripetal force; recoil; seat-belt impulse; terminal speed |
| SCI-CP-003 | Work, Energy & Power | efficiency; velocity ratio; all three lever classes; movable pulley; wheel-and-axle; broader energy transformations |
| SCI-CP-004 | Gravitation, Pressure & Fluids | Pascal law; hydraulic systems; surface tension; capillarity; viscosity; Bernoulli principle and applications |
| SCI-CP-005 | Heat & Temperature | anomalous expansion of water; calorimetry; pressure cooker; refrigerator; thermos flask; heat-capacity comparison |
| SCI-CP-006 | Sound | speed by medium; resonance; Doppler effect; auditorium acoustics; richer ultrasound/SONAR and ear applications |
| SCI-CP-007 | Light & Optics | apparent depth; total internal reflection; optical fibre; presbyopia; camera; periscope; stronger atmospheric-optics coverage |
| SCI-CP-008 | Electricity | electrostatic attraction/repulsion; meter connection; resistivity factors; kWh; MCB; earthing; short circuit; household safety |
| SCI-CP-009 | Magnetism & Electromagnetism | Earth/compass behaviour; magnetic materials; right-hand thumb rule; Fleming rules; relay; transformer ratio; high-voltage transmission |
| SCI-CP-010 | Modern Physics & Everyday Devices | isotopes; half-life; reactor moderator/control rods; radiation penetration/uses; transistor; diode/LED/solar cell; photoelectric effect; laser/radar |

## V2 semantic architecture

- **24 curated semantic anchors per CP**; every anchor carries a direct MCQ, same-neighbourhood distractors, a true statement, a deliberately false misconception statement, explanation and provenance.
- **24 direct-anchor questions per CP**.
- **24 correct-statement questions per CP**, built from one true anchor statement plus false peer statements.
- **24 incorrect-statement questions per CP**, built from one false anchor statement plus true peer statements.
- **276 unique two-anchor statement compositions per CP** (`24 choose 2`). Each unordered anchor pair is used once; option order and wording-only changes are not counted.
- **348 meaningful semantic questions per CP; 3,480 across SCI-CP-001…010**.
- Correct-answer positions across each full CP space are exactly **A87 / B87 / C87 / D87**.

## Delivery mix

Capacity is not the same as sampling policy. The default 60-question V2 review/sample is deliberately balanced:

- 24 direct/application/calculation anchor questions
- 12 correct-statement questions
- 12 incorrect-statement questions
- 12 two-statement composition questions

This prevents the much larger combinatorial statement pool from dominating ordinary learner-facing batches.

## Quality rules

- Do not count option shuffles, punctuation changes or wording-only paraphrases as semantic capacity.
- Keep stems concise and exam-like.
- Hard items test application, discrimination or multi-fact reasoning—not obscure trivia.
- Distractors remain in the same conceptual neighbourhood.
- Numerical explanations show the decisive calculation.
- Every generated item keeps source IDs and the review-only lifecycle lock.
- Question Studio/runtime registration remains disabled until explicit human approval.

## Capacity contract

| CP | Anchors | Direct | Correct-statement | Incorrect-statement | Two-statement pairs | Semantic capacity |
|---|---:|---:|---:|---:|---:|---:|
| SCI-CP-001 | 24 | 24 | 24 | 24 | 276 | 348 |
| SCI-CP-002 | 24 | 24 | 24 | 24 | 276 | 348 |
| SCI-CP-003 | 24 | 24 | 24 | 24 | 276 | 348 |
| SCI-CP-004 | 24 | 24 | 24 | 24 | 276 | 348 |
| SCI-CP-005 | 24 | 24 | 24 | 24 | 276 | 348 |
| SCI-CP-006 | 24 | 24 | 24 | 24 | 276 | 348 |
| SCI-CP-007 | 24 | 24 | 24 | 24 | 276 | 348 |
| SCI-CP-008 | 24 | 24 | 24 | 24 | 276 | 348 |
| SCI-CP-009 | 24 | 24 | 24 | 24 | 276 | 348 |
| SCI-CP-010 | 24 | 24 | 24 | 24 | 276 | 348 |
| **Physics total** | **240** | **240** | **240** | **240** | **2,760** | **3,480** |

## Promotion gate

Physics V2 can be called exhaustive only after the dedicated V2 qualification test, review artifact export, CI-hygiene guard and API build pass. Human approval is still required before runtime promotion.
