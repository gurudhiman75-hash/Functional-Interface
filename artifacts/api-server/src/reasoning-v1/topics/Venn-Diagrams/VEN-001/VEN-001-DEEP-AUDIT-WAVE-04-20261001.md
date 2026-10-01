# VEN-001 — Deep Audit Wave 04: CP004 Region Stem Realness

Date: 2026-10-01

Status: `CP004_INSTRUCTION_OPENERS_REMOVED__NATIVE_MAPPING_SENTENCES_ADDED__FINAL_CLOSURE_PENDING`

## Scope

Wave 04 hardens VEN-CP004 learner-facing region-identification stems.

The numbered Venn diagram still uses A/B/C as compact internal circle labels, but the question no longer exposes solver syntax such as `A = ...; B = ...` or starts with an instruction like `Study the diagram`.

## New presentation

English mapping example:

`In the diagram, A represents art-club members and B represents music-club members. Which numbered region represents members who belong to the music club but not the art club?`

Hindi and Punjabi use natural mapping sentences rather than equality notation.

## Preserved

- region topology and numbering;
- correct answer;
- option order generation;
- renderer;
- permanent QL VEN-QL-004;
- explanation semantics;
- review-only lifecycle.

## Regression authority

`ven-001-region-editorial-audit.test.ts` generates multilingual VEN-CP004 questions and rejects:

- `Study/Look at the diagram` style openers;
- Hindi/Punjabi instruction equivalents;
- `A = ... / B = ... / C = ...` learner assignments.

The mapping must still explicitly connect the visible diagram labels to their categories.
