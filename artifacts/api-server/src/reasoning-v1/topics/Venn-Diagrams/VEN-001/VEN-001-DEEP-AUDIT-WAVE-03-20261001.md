# VEN-001 — Deep Audit Wave 03: Logical Stem Realness

Date: 2026-10-01

Status: `LOGICAL_STEM_SYMBOLIC_ASSIGNMENTS_REMOVED__REGRESSION_GATE_ADDED__FINAL_CLOSURE_PENDING`

## Scope

Wave 03 cleans the learner-facing logical Venn stems for VEN-CP001, VEN-CP002 and VEN-CP003.

It does not change:

- topology authorities;
- set ordering used by the renderer;
- option diagrams;
- correct answers;
- permanent QLs;
- explanation semantics;
- lifecycle locks.

## Defect corrected

The live generators exposed solver-style labels such as:

- `A = mangoes; B = fruits`
- `A = poodles; B = dogs; C = mammals`
- `A = sparrows, B = birds, C = animals`

and then asked about the relationship among A/B/C.

These symbolic assignments are useful internally but make learner stems look machine-authored.

## New learner-facing style

### VEN-CP001 / VEN-CP002

The stem now states the actual relationship directly, for example:

`Every poodle is a dog, and every dog is a mammal. Which Venn diagram correctly represents this relationship?`

Hindi and Punjabi use the corresponding native relation sentence.

### VEN-CP003

The stem now directly names the categories, for example:

`Which Venn diagram correctly represents the relationship among Sparrows, Birds, Animals?`

The A/B/C IDs remain internal renderer/semantic identifiers only.

## Regression authority

`ven-001-logical-editorial-audit.test.ts` generates CP001–CP003 learner questions in English, Hindi and Punjabi and rejects:

- `A = ...`, `B = ...`, `C = ...` assignments;
- symbolic questions referring to `A, B and C` instead of the actual categories.

## Lifecycle

Review-only remains unchanged. No Question Bank, test, mock or learner-release gate is opened by this wave.
