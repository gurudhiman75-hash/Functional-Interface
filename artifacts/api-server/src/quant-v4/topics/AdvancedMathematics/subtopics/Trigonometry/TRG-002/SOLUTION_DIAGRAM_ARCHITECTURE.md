# Trigonometry Solution-Diagram Architecture

Status: **ARCHITECTURE LOCKED — EXECUTION EVIDENCE PENDING**

This document locks the diagram policy for the Trigonometry chapter before further TRG-002 expansion.

## 1. Primary principle

A diagram is a **solution/explanation instrument first**, not a decoration and not an automatic question-stem hint.

The generator must keep these concerns separate:

- `solutionDiagramPolicy`: `NONE | OPTIONAL | REQUIRED`
- `stemDiagramPolicy`: `NONE | OPTIONAL | REQUIRED`

A required solution diagram is disclosed with the explanation after the attempt. A stem diagram is a separate editorial decision and must never be inferred merely because a solution diagram exists.

## 2. Canonical-state authority

For TRG-002, one exact canonical spatial state is authoritative for all of the following:

1. question wording and supplied values;
2. exact solver result;
3. explanation reasoning;
4. misconception-driven options;
5. solution diagram;
6. any optional stem diagram;
7. independent spatial verification.

`solution-diagram.ts` creates a deterministic fingerprint from the exact canonical state. Diagram evidence is invalid if it is reused against a different state.

This prevents a common content-generation failure: a mathematically correct answer accompanied by a stale or mismatched figure.

## 3. TRG-001 policy — selective diagrams

TRG-001 is not made diagram-heavy merely because the chapter is Trigonometry.

### REQUIRED solution diagrams — 24 QLs

`TRG-001-QL-001...024` (CP-001)

Purpose: `GEOMETRIC_RECONSTRUCTION`.

These roles teach or reconstruct opposite/adjacent/hypotenuse relationships, side recovery and right-triangle ratios. The solution diagram should expose the triangle the reasoning actually uses.

Stem diagrams remain OPTIONAL so an exam-style text-only question can still require the learner to form the triangle mentally.

### OPTIONAL solution diagrams — 10 QLs

- `TRG-001-QL-092...095`
- `TRG-001-QL-097...100`
- `TRG-001-QL-131...132`

These later ratio-derived roles may benefit from a small reconstructed triangle, but the diagram is not necessary for every explanation.

### NONE — 110 QLs

All remaining TRG-001 roles stay diagram-free by default. This includes the standard-value, degree/radian, complementary/reduction, identity, symbolic-expression, angle-sum/difference and most mixed-expression families.

A decorative triangle must not be added to these roles.

## 4. TRG-002 policy — solution-diagram first

Every one of the 96 permanent TRG-002 QLs is a spatial Heights & Distances application.

Current locked default:

- solution diagram: **REQUIRED — 96/96**
- stem diagram: **OPTIONAL — 96/96**
- purpose: `SPATIAL_MODEL`

If a future permanent QL is judged not to benefit from a solution figure, that exception must be explicit, reviewed and counted. The architecture does not allow silent omission.

This covers:

- single elevation;
- single depression;
- shadows;
- ladders;
- broken objects;
- guy wires;
- same-side two observations;
- moving closer/farther;
- opposite-side observations;
- observer-height correction;
- building-to-building systems;
- combined elevation/depression;
- river width;
- composite sight-line systems.

## 5. Stem-versus-solution disclosure

### Solution stage

The full pedagogical diagram may show the geometry required by the explanation:

- object vertical;
- observer/eye level;
- sight lines;
- angle markers;
- ground or horizontal reference;
- movement segment;
- shadow, ladder or wire segment;
- labels that help explain already-disclosed solution steps.

It is tagged `AFTER_ATTEMPT`.

### Stem stage

A stem diagram is never auto-required by the solution policy.

If a QL explicitly elects to render one, it must pass stem-safety validation. In particular, symbolic point labels are allowed, but numeric point labels are rejected by the current foundation because they can leak a derived or target value.

Later rendering work may introduce a more detailed disclosure allow-list, but it must remain derived from the QL's supplied-information contract rather than from the solved state indiscriminately.

## 6. Diagram quality rules

A solution diagram must be:

- derived from canonical state, not separately authored coordinates;
- mathematically consistent with all distances, heights and angles;
- deterministic for a given generated state;
- uncluttered and exam/student friendly;
- non-decorative: every shown construction must support the reasoning;
- free of unearned information before the explanation stage;
- renderable as a small clean SVG/diagram specification rather than a raster screenshot;
- responsive without changing the mathematical relationships.

The canonical coordinates are mathematical authority; viewport coordinates are only a projection.

## 7. Validation gates

`solution-diagram.test.ts` locks:

- TRG-001 policy counts: **24 REQUIRED / 10 OPTIONAL / 110 NONE**;
- TRG-002 policy counts: **96 REQUIRED / 0 OPTIONAL / 0 NONE** for solution diagrams;
- TRG-002 stem diagrams remain OPTIONAL rather than forced;
- deterministic canonical-state fingerprints;
- required solution diagram presence;
- strategy consistency with canonical state;
- diagram-spec validation;
- optional stem-diagram validation;
- rejection of numeric point-label leakage in a stem diagram;
- rejection when diagram evidence is validated against a tampered/different canonical state.

These are committed gates. They are **not claimed as executed** until an actual run is observed.

## 8. Question Studio contract

Future Question Studio registration should consume diagram evidence rather than a bare `diagram` Boolean.

Conceptually:

```ts
{
  solutionDiagramPolicy: "REQUIRED",
  stemDiagramPolicy: "OPTIONAL",
  purpose: "SPATIAL_MODEL",
  sourceStateFingerprint: "TRG002:...",
  solutionDiagram: { ... },
  stemDiagram?: { ... },
  disclosure: {
    solutionStage: "AFTER_ATTEMPT",
    stemStage: "QUESTION"
  }
}
```

The public/test runtime remains OFF until the broader chapter approval gate.

## 9. Editorial interpretation

A diagram is considered successful only when it makes the explanation easier to follow.

- If the learner must reconstruct a triangle or spatial configuration, show it in the solution.
- If the work is purely standard-value or symbolic algebra, do not add a figure.
- Do not use diagrams to make a page look richer.
- Do not make a stem easier by revealing the solution geometry unless that QL explicitly intends a figure-based question.
