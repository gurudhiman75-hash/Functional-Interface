# GEO-RIV-001-CP013 — River Comparisons & Classification

Status: REVIEW CANDIDATE V1
Chapter: `GEO-RIV-001`
CP: `GEO-RIV-001-CP013`
Engine: `knowledge-v1`

## Objective

Qualify cross-river classification and comparison tasks without duplicating source/origin, city, project or basin recall already owned by earlier CPs.

## Canonical dimensions

- Himalayan river
- Peninsular river
- East-flowing river
- West-flowing river
- Delta-forming river
- Estuary-forming river
- Source-backed major-river membership

The V1 fact pool contains 12 rivers. Learner-facing proper river names always use `River + name`; canonical entity labels remain bare names internally.

## Major/minor safety rule

`MAJOR_RIVER` is a one-way positive label supported by the qualified NCERT source set. CP013 MUST NOT infer `MINOR_RIVER` from absence. Questions may ask whether a river is explicitly included in the source-backed major set, but may not label an unlisted river as minor.

## QLs

- QL110 — direct class membership
- QL111 — classification exception
- QL112 — correctly matched river–classification pair
- QL113 — incorrectly matched river–classification pair
- QL114 — cross-classification comparison / intersection
- QL115 — source-backed major-river discrimination
- QL116 — Statement I/II
- QL117 — three-statement count
- QL118 — two-dimension river identification

QLs represent different learner tasks, not stem variants.

## Unique-answer rules

A river may hold multiple simultaneous classifications. Therefore direct questions ask for a river satisfying a named class, rather than presenting overlapping classes as competing answers. Dual-class questions use distractors that fail at least one required class. Pair and statement questions recompute truth from the canonical class matrix.

## Editorial rules

- clean competitive-exam language;
- no machine-style labels in learner text;
- no bare proper river names;
- concise, beginner-readable explanations;
- no unsupported extra facts;
- no unsafe minor-river inference.

## Review batch contract

- 54 questions;
- 6 semantically distinct payloads per QL;
- exact answer-position target A14/B14/C13/D13;
- independent semantic audit;
- provenance required;
- review-only lifecycle;
- no runtime registration or Question Bank promotion before explicit human approval.

## Acceptance gate

CP013 is review-ready only when its dedicated qualification test, review export, API build, Geography validation, branch-topology guard and CI-hygiene policy pass on the exact review head.
