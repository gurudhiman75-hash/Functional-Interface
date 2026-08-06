# MEN-CP-008 Executable Discovery Plan

## Status

**Executable non-QL discovery authority.**

```text
Package:             MEN-002
Canonical problem:   MEN-CP-008 — Cylinders & Cones
Language:            English
Permanent QLs:       0
Publication:         disabled
```

This plan authorises temporary executable prototypes. It does not freeze QL counts, solve-mode counts, cylinder/cone ownership boundaries or publication.

## Discovery objective

Discover the complete competitive-exam measurement system for cylinders and cones through:

- direct volume, curved/lateral area and total area;
- radius, diameter, height and slant-height inverses;
- exact relation `l²=r²+h²`;
- exact π, declared `22/7` and declared `3.14` policies;
- rational, surd, π-multiple and π-surd answers;
- cylinder/cone comparison and equal-measure states;
- roller, drum, pillar, vessel, tent, heap and canvas contexts;
- unit, capacity, cost, revolution, scaling and percentage representations;
- source, misconception, representation and ownership audits.

## Ownership boundary

MEN-CP-008 owns simple single-cylinder and single-cone measurement when the decisive reasoning is the base shape's formula or its inverse.

Reassign when decisive reasoning changes:

- open, hollow, shell, pipe-thickness or excluded-surface transformation -> MEN-CP-011;
- melting/recasting between cylinders, cones or other solids -> MEN-CP-012;
- cone/cylinder composites, drilled solids, tank displacement or inscribed solids -> MEN-CP-013;
- pure right-triangle recovery using trigonometric evidence -> Trigonometry where measurement is incidental.

## Exact arithmetic extension

The shared MEN-002 exact layer must add:

```text
RATIONAL     a/b
SURD         (a/b)√n
PI           (a/b)π
PI_SURD      (a/b)π√n
```

Required rules:

- simplify rational coefficients;
- simplify square factors in surds;
- preserve exact π unless the generated state explicitly declares another policy;
- represent `π=22/7` as an exact rational policy;
- represent `π=3.14` as exact `157/50`, not binary floating point;
- compare exact options structurally;
- never silently convert exact π to a decimal;
- permit exact π-surd cone surface values such as `5π√13`.

## Canonical state additions

Every CP-008 state must explicitly declare:

```text
shape: CYLINDER | CONE
radius
height
slantHeight where relevant
piPolicy: EXACT_PI | PI_22_OVER_7 | PI_3_14
includedSurfaces
operation
answerSemantic
unit
```

Derived dimensions must record their source. A cone slant height may be supplied or recovered from `l²=r²+h²`, but the state must distinguish those cases.

## Initial temporary prototype wave

The first executable wave is architecture-establishing and gap-revealing. It is not a final inventory.

```text
MEN-CP008-PROT-CYLINDER-VOLUME
MEN-CP008-PROT-CYLINDER-CSA
MEN-CP008-PROT-CYLINDER-TSA
MEN-CP008-PROT-CYLINDER-RADIUS-FROM-VOLUME
MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-VOLUME
MEN-CP008-PROT-CYLINDER-RADIUS-FROM-CSA
MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-CSA
MEN-CP008-PROT-CYLINDER-RADIUS-FROM-TSA
MEN-CP008-PROT-CYLINDER-CAPACITY-22-OVER-7
MEN-CP008-PROT-ROLLER-REVOLUTIONS
MEN-CP008-PROT-CONE-VOLUME
MEN-CP008-PROT-CONE-CSA
MEN-CP008-PROT-CONE-TSA
MEN-CP008-PROT-CONE-SLANT-HEIGHT
MEN-CP008-PROT-CONE-HEIGHT-FROM-SLANT
MEN-CP008-PROT-CONE-RADIUS-FROM-SLANT
MEN-CP008-PROT-CONE-HEIGHT-FROM-VOLUME
MEN-CP008-PROT-CONE-RADIUS-FROM-VOLUME
MEN-CP008-PROT-CONE-CANVAS-COST
MEN-CP008-PROT-CYLINDER-CONE-VOLUME-RATIO
```

The count `20` describes only the first executable wave.

## Provisional merge hypotheses

- cylinder CSA and TSA may merge through included-surface parameters;
- cone CSA and TSA may merge through included-surface parameters;
- radius/diameter wording may be a representation parameter unless the answer semantic changes;
- declared π policies are representations, not automatic new QLs;
- roller revolutions may remain distinct if the learner must convert swept area into circumference × length × revolutions;
- canvas and paint cost may merge into area measurement through a rate parameter;
- cylinder–cone ratio states may merge into scaling/comparison representations;
- slant-height direct and inverse tasks may remain distinct because their evidence and misconception structures differ.

## Required proof

Every temporary prototype must pass:

- deterministic valid-state-first generation;
- exact canonical solver;
- materially separate independent verifier;
- four unique positive exact options;
- all four correct-answer positions;
- at least four distinct stems and answers;
- state-derived difficulty;
- declared π-policy validation;
- no floating-point mathematical authority;
- exact MathJax π and surd rendering;
- four-tier teacher-style English explanations;
- option-specific calculation traps;
- lifecycle and publication locks;
- deterministic review export;
- exact Render production build.

## Source boundary

Uploaded-book retrieval is currently unavailable. Mathematical executable discovery may proceed, but source-backed permanent allocation and freeze remain blocked.
