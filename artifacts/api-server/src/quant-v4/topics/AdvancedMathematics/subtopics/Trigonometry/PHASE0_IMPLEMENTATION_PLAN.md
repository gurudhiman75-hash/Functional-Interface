# Trigonometry Phase 0 Implementation Plan

Status: **Phase 0 design lock implementation**.

This document records what is frozen now and what must wait for later phases.

## Phase 0 deliverables

Phase 0 freezes:

- `TRG-001` and `TRG-002` as the only initial runtime packages;
- `TRG-CP-001...TRG-CP-010` as the canonical-problem map;
- 240 English production QLs;
- package-local contiguous QL numbering;
- degree/radian coverage in `TRG-CP-003`;
- exact-answer policy;
- canonical-state rule;
- independent-verification rule;
- diagram policy;
- cross-chapter ownership boundaries;
- initial exclusions;
- English-first publication policy;
- hard activation lock.

## Phase 0 non-deliverables

Phase 0 intentionally does **not** implement:

- `types.ts` runtime contracts;
- trig solver code;
- exact-number arithmetic code;
- angle/standard-value code;
- expression parser/tree code;
- parameter generators;
- question-language JSON/TS registries;
- distractor runtime code;
- explanation renderer;
- diagram renderer;
- package registration;
- Test Builder registration;
- production activation;
- Hindi/Punjabi production content.

Those belong to later phases and must not be inferred from Phase 0 existence.

# Three major implementation checkpoints

## Checkpoint A — Foundation + TRG-001 MVP

### Foundation

Build shared Trigonometry primitives:

- exact rational/surd/rational-surd support;
- exact rational multiples of `pi`;
- angle model;
- degree/radian conversion;
- normalized angle/reference angle/quadrant sign;
- standard trig value authority;
- expression model and exact evaluator;
- mathematical equivalence/normalization;
- independent verification primitives.

### TRG-001 runtime proof

Implement approximately five forced representative QLs per CP across all six CPs.

The proof must cover:

- triangle side reconstruction;
- exact standard values;
- degree/radian conversion;
- complementary/reduction relations;
- all three fundamental Pythagorean identities;
- derived ratio relations;
- at least one controlled mixed expression.

### TRG-001 MVP

Expand to **72 / 144 QLs**.

Gate before continuing:

- exact answers remain exact;
- independent verifier agrees;
- equivalent options collapse correctly;
- no accidental undefined values;
- stems are exam-like;
- explanations use generated values;
- deterministic regeneration passes;
- editorial review of the 72-Ql MVP is complete.

## Checkpoint B — Complete TRG-001 + TRG-002 Foundation/MVP

### Complete TRG-001

Expand to **144 / 144 QLs** and run package-wide QA.

### Build TRG-002 spatial foundation

Implement canonical geometry concepts for:

- ground/reference line;
- vertical objects;
- observers and eye height;
- sight lines;
- elevation/depression;
- horizontal separations;
- multiple observation point order;
- deterministic diagram scene;
- independent coordinate verifier.

### TRG-002 runtime proof

Forced coverage must include at minimum:

- single elevation;
- single depression;
- shadow;
- ladder;
- broken tree;
- two same-side observations;
- move closer/farther;
- observer height;
- opposite-side observation;
- elevation + depression.

### TRG-002 MVP

Expand to **48 / 96 QLs** and visually audit every implemented diagram strategy.

## Checkpoint C — Complete TRG-002 + Full Chapter QA

Complete `TRG-002` to **96 / 96 QLs**.

Final English implementation total: **240 / 240 QLs**.

Required chapter-level QA:

- 12 deterministic canonical seeds per QL;
- `240 × 12 = 2,880` canonical cases;
- independent verification for all 2,880 cases;
- at least 2,000 mixed `TRG-001` residual generations;
- at least 1,500 mixed `TRG-002` residual generations;
- same-QL diversity audit;
- cross-package/cross-chapter duplicate audit;
- option-equivalence audit;
- explanation-quality audit;
- diagram audit for every diagram-required QL;
- primary human review of all 240 English QLs.

## Required blocker counters

Before freeze consideration, all of the following must be zero or explicitly resolved by an authority amendment:

- unresolved placeholders;
- invalid correct indices;
- mathematically equivalent option duplicates;
- solver/verifier mismatches;
- exactness loss;
- accidental undefined trig values;
- degree/radian mismatches;
- standard-value mismatches;
- quadrant/reduction mismatches;
- missing required diagrams;
- diagram/canonical-state mismatches;
- observer-height mismatches;
- two-observation ordering mismatches;
- explanation/answer mismatches;
- unsupported-language exposure;
- unreachable active QLs/solve modes.

## Human review contract

All **240 primary English QLs** receive human review at least once.

Suggested review states:

- `PENDING`
- `APPROVED`
- `MINOR_EDIT`
- `MAJOR_EDIT`
- `REJECT`

Freeze consideration requires `MAJOR_EDIT = 0` and `REJECT = 0` after regeneration/re-review.

Systematic editorial defects must be fixed at generator/template level rather than patched question-by-question.

## Activation gate

Even after Checkpoint C, implementation completion does not automatically activate Trigonometry.

Activation requires explicit product-owner approval after:

1. engineering QA passes;
2. independent mathematics verification passes;
3. diagram QA passes;
4. full English editorial review passes;
5. readiness/freeze reports are regenerated from current runtime state.

Until that approval, both packages remain inactive and invisible to production Question Studio/Test Builder flows.

## Phase 1 handoff

The immediate next phase after this design lock is:

**Phase 1 — Trigonometry mathematical foundation.**

The first code should establish exact-number/angle/standard-value/expression authority before any large-scale QL authoring begins.
