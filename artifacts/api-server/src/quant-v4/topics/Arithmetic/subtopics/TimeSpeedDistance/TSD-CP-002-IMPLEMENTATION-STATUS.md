# TSD-CP-002 — Implementation Status

**Status:** `FROZEN_ENGLISH_REVIEW_COMPLETE`  
**Permanent QLs:** `TSD-QL-024` through `TSD-QL-037`  
**Frozen learner authorities:** 14  
**Internal QA authorities:** 2  
**Approved English questions:** 42  
**Next permanent TSD QL:** `TSD-QL-038`

## Runtime architecture

CP-002 is implemented under:

`TSD-001/cp002/`

The runtime contains:

- exact reduced-fraction arithmetic;
- frozen source-to-authority registry;
- canonical solver;
- independent invariant verifier;
- curated deterministic English case library;
- four-option misconception packages;
- permanent QL registry;
- frozen English runtime;
- JSON, JSONL and HTML review exporter;
- executable discovery, solver, runtime and freeze proofs.

## Exact mathematics

The canonical solver supports:

- total distance ÷ total time for arbitrary segment lists;
- distance-weighted average pace;
- inverse speed, time and distance reconstruction;
- distance-share harmonic weighting;
- time-share arithmetic weighting;
- equal-distance round-trip harmonic reconstruction;
- one-way distance from two leg speeds and total time;
- round-trip time from one-way distance and two speeds;
- total distance from overall average and total time;
- two-speed segment allocation using simultaneous totals;
- distance/time ratio reconstruction;
- target-average remaining-speed recovery;
- comparison of complete segmented plans.

Every learner case is rechecked by a separate invariant verifier. Deliberately tampered solutions must be rejected.

## Runtime proof boundary

The executable suite requires:

- 34 source candidates owned exactly once;
- 16 frozen mathematical authorities;
- 14 learner authorities and two internal QA authorities;
- 42 curated solver/verifier cases;
- 48 deliberate tamper rejections across learner and internal modes;
- 14 authorities × 60 seeds = 840 deterministic candidates;
- perfectly balanced correct-option positions: 210 in A, B, C and D;
- 42 distinct stems and 42 distinct mathematical fingerprints;
- 42 frozen review rows and 42 unique complete narratives;
- three distinct teaching openings per QL;
- four unique options and one keyed answer per row;
- complete value-specific option analysis;
- zero singular-unit, duplicated-unit, malformed-MathJax or engine-language defects;
- zero Question Bank, test or public-delivery leaks.

## Frozen representation coverage

The 42-row review includes:

- equal-distance average speed;
- three-segment average speed;
- mixed metre/kilometre presentation;
- average pace with unequal distances;
- unknown segment speed, time and distance;
- distance and time share percentages;
- outward and return unknown round-trip speed;
- one-way distance and full round-trip time;
- overall distance from average and time;
- requested segment distance and requested segment time;
- distance ratio and time ratio;
- target-average recovery after time has already been spent;
- Plan A wins, Plan B wins and exact tie.

## Editorial contract

Every frozen row contains:

1. `📌 Main Rule`;
2. a human teaching opening;
3. explicit givens and unit-normalized working;
4. a final computation line;
5. `⚡ Exam Speed Trick`;
6. full A/B/C/D analysis;
7. an exam-style conclusion.

The runtime rejects unresolved placeholders, internal QA IDs, generic engine phrases, malformed MathJax, plural-after-one errors and duplicated unit nouns.

## Delivery locks

CP-002 is complete at the mathematical-authority and English-freeze layer only.

Still disabled:

- Hindi/Punjabi localization;
- Question Studio registration;
- Question Bank writes;
- test eligibility;
- public delivery.
