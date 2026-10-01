# DSF-CP-020 — QL002 Number System Batch Runtime

Date: 2026-10-01

Status: **review candidate / not Question Studio discoverable**

## Purpose

This checkpoint begins productionizing permanent `DSF-QL-002` without changing its frozen CP015 semantics.

`DSF-QL-002` remains:

- three statements;
- task contract: `THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS`;
- answer semantic: `MINIMAL_SUFFICIENT_STATEMENT_SUBSET`;
- semantic space: 19 valid minimal-sufficient-subset states.

CP020 reuses the CP015 three-statement evaluator and five-option semantic profile. It does not create a second sufficiency truth engine.

## Wave 01 runtime

`number-system-three-statement-batch-v1.ts` creates randomized Number System items using the existing NUM-001 divisibility foundation.

Each generated problem:

- uses a three-digit number with one unknown digit X;
- preserves a 10-world digit domain;
- selects three mutually consistent statements true at an anchor world;
- evaluates all seven non-empty statement subsets through `evaluateFiniteDomainTriple`;
- derives the canonical CP015 semantic key;
- renders five answer choices through `buildThreeStatementAnswerOptions`;
- keeps Question Studio / Question Bank / test / mock / public release disabled.

This is a real batch runtime, not replay of the two original CP015 prototypes.

## Executable audit

`number-system-three-statement-batch-v1.test.ts` verifies:

- deterministic batch replay;
- exactly three statements;
- all seven subset evaluations;
- jointly consistent three-statement evidence;
- valid CP015 semantic keys;
- five options with exactly one correct answer;
- answer-position rotation;
- multiple semantic states;
- multiple number templates;
- unique generation identities;
- frozen lifecycle locks.

The runtime remains undiscoverable until additional source-backed domains are implemented and the breadth is reviewed.

## Next expansion

The next CP020 waves should add source-bound three-statement runtimes for domains already supported by Library exam evidence, especially:

- Time & Work;
- Profit/Loss / commercial arithmetic;
- other arithmetic domains where canonical source solvers already exist.

Only after multi-domain breadth and editorial QA should `DSF-QL-002` be connected to normal Question Studio review generation.
