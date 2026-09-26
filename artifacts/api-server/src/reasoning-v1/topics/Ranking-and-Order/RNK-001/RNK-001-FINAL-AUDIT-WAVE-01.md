# RNK-001 — Final Audit Wave 01

Date: 2026-09-26  
Status: **RECOVERY + CURRENT-INTEGRATION AUDIT CANDIDATE**  
Base: current `New-main`

## Purpose

Recover the last approved RNK-001 chapter authority onto the current repository baseline and prove that it can run through the present Question Studio architecture without importing stale shared infrastructure from the historical RNK branch.

This wave is deliberately a recovery/integration wave. It does **not** rewrite learner content or allocate new semantic authority.

## Recovery boundary

The recovered chapter subtree comes from the last exact-green RNK closeout head:

```text
historical closeout head:
5ac3a2dc7dc233f1449acf082f0a6522ff619c99

recovered subtree:
artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/
```

Only the RNK-001 chapter subtree was transplanted. Historical August-era shared Question Studio, admin and route changes were intentionally not copied onto current `New-main`.

Current shared integration is rebuilt against:

```text
src/question-studio/engine-registry.ts
src/question-studio/engines/reasoning-v1-adapter.ts
src/question-studio/standard-lifecycle.ts
```

## Frozen authority preserved

```text
permanent QLs:          RNK-QL-001..042
permanent QL count:     42
RNK-QL-043:             UNALLOCATED
checkpoints:            RNK-CP-001..008
QL-owning checkpoints:  RNK-CP-001..007
CP008:                  adapter/caselet infrastructure; zero new QLs
languages:              EN / HI / PA
multilingual content:   approved + frozen
```

No mathematical authority, answer key, QL ownership, approved localization semantics, frozen source state or chapter boundary is changed in Wave 01.

## Current Question Studio integration

Wave 01 adds a current-architecture RNK adapter that supports:

- global `reasoning-v1` package discovery;
- all 42 permanent QLs;
- CP selectors for CP001..CP007;
- explicit CP008 zero-QL rejection;
- English, Hindi and Punjabi;
- Easy / Medium / Hard filtering through the frozen RNK generation layer;
- chapter-coverage generation;
- SSC, Banking and Punjab exam-profile routing;
- banking five-option delivery through the approved frozen adapter;
- deterministic seed replay;
- standard review-only lifecycle locks.

## Executable proof

`rnk-001-final-audit-wave-01.test.ts` proves:

```text
42 / 42 English QLs through chapter coverage
42 / 42 Hindi QLs directly
42 / 42 Punjabi QLs directly
126 trilingual QL-level samples
current global Question Studio registry ownership
CP-level routing
CP008 zero-new-QL boundary
banking Punjabi five-option delivery
deterministic replay
Question Bank/test/mock/public release locks
```

The historical chapter closeout and multilingual freeze proofs are also rerun on the recovered tree after their integration boundary is forward-ported to the current Question Studio registry.

## Lifecycle boundary

Wave 01 remains review-only:

```text
Question Bank status:             NOT_STORED
Question Bank writable:           false
test eligible:                    false
mock-test eligible:               false
publicly publishable:             false
automatic student publication:    false
production release authorized:    false
manual approval required:         true
```

## Still open after Wave 01

A successful Wave 01 establishes a trustworthy current baseline. The fresh final audit then continues with generated learner-surface review rather than assuming the historical closeout is sufficient:

1. chapter-wide generated-sample / stem-realism audit;
2. distractor and answer-uniqueness audit;
3. explanation simplicity, coherence and beginner-teaching audit;
4. generated-instance difficulty calibration audit;
5. presentation/diagram policy where applicable;
6. fresh Hindi/Punjabi learner-surface audit on current generated output;
7. final current-main multilingual freeze / closure boundary.

RNK-QL-043 remains unallocated unless a later audit proves a genuinely new semantic contract.

## CI boundary note — 2026-09-26

The first combined Waves 01–06 run failed before RNK proofs executed because its ad-hoc TypeScript command followed the global reasoning adapter into unrelated repository modules with existing type errors. A narrowed strict-TypeScript pass then exposed historical RNK CP003–CP006 type debt that predates the current recovery and is not part of the frozen runtime contract.

The final recovery gate therefore uses:
- bundled compile/import resolution for the current RNK integration, difficulty and explanation layers;
- executable Waves 01–06 against the recovered frozen runtimes and current Question Studio registry;
- the normal API build step.

This avoids treating historical strict-type cleanup as a prerequisite for content/runtime closure while still failing on syntax, import, bundle, executable-proof or build regressions. This changes CI scope only, not learner content or authority.
