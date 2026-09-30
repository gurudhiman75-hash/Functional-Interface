# Logic Puzzles — Deep Audit Wave 01

Date: 2026-09-30

Status: `CURRENT_AUTHORITY_RECONCILED__LIVE_QUESTION_STUDIO_V8_ROUTING_FIXED__SOURCE_SATURATION_STILL_FALSE`

## Current permanent authority

The current permanent registry is:

- `LP_001_011_PERMANENT_QL_REGISTRY_V3`;
- permanent range: `LP-QL-001..047`;
- permanent QL count: 47;
- next available identity: `LP-QL-048`;
- runtime mode: `REVIEW_ONLY`;
- production eligible: false.

Post-LP-010 permanent additions are already real current authority:

- `LP-QL-041..044` — LP-011 box + attribute linked-state queries;
- `LP-QL-045..046` — LP-006 cross-attribute projection / statement-truth queries;
- `LP-QL-047` — counterfactual additional-condition query.

## Current multilingual authority

QL047 already has:

- English freeze: `LP_CP04_ENGLISH_FREEZE_V1`;
- Hindi/Punjabi localization freeze: `LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1`;
- native editorial approval: V3;
- semantic parity: proved.

Therefore older V7 statements that QL047 localization is pending are historical.

## Reproduced live integration defect

The shared Question Studio engine imports:

```
Logic-Puzzles/LP-001/question-studio.ts
```

The stable facade `question-studio.ts` still exported `question-studio-v2.ts`.

That meant later Logic Puzzle Question Studio layers V3 through V8 were not reachable from the actual shared generation engine even though their local tests passed.

Consequences included orphaning:

- LP-011 / QL041–044 review routes;
- LP-006 projection / QL045–046 review routes;
- LP-QL-047 English route;
- LP-QL-047 frozen Hindi/Punjabi route.

## Remediation

The stable facade now aliases the current V8 implementation as the live exported API:

- `generateLogicPuzzleQuestionStudioBatch` -> V8;
- `isLogicPuzzleQuestionStudioRequest` -> V8;
- `listLogicPuzzleQuestionStudioPackages` -> V8.

No generator semantics, permanent QLs, frozen learner content or delivery gates are changed.

## Global shared-engine proof

A new regression exercises the real shared generation engine, not only the local LP adapter.

It verifies:

- global discovery of `LP-CP04-COUNTERFACTUAL`;
- permanent QL `LP-QL-047`;
- supported languages `en / hi / pa`;
- generation through the global shared engine;
- same QL / correct-index / difficulty parity across languages;
- review-only runtime;
- Question Bank/test/public delivery locks.

The existing post-046 Logic Puzzle workflow now runs this global-routing proof.

## Source provenance boundary

This remediation does **not** alter the source-provenance decision.

Current source status remains:

- Banking: strong structural convergence;
- SSC: official scope/access evidence, durable item-level mapping incomplete;
- Punjab: official reasoning scope proven, durable item-level Logic Puzzle evidence incomplete;
- `SOURCE_SATURATED_FOR_TARGET_EXAMS = false`;
- `PRODUCTION_ELIGIBLE = false`.

The source gate blocks production promotion; it does not invalidate the permanent semantic registry or review-only multilingual content.

## Next audit wave

After the live-route fix is merged, continue with:

1. generated-surface audit across the actual V8 shared-engine route;
2. cross-package difficulty consistency;
3. query-family coverage / anti-inflation recheck through QL047;
4. structural repetition/diversity audit;
5. final content deep-audit closure only if no content defect remains.

Production source saturation remains a separate unresolved gate.

## Result

`LP_DEEP_AUDIT_WAVE01_LIVE_V8_ROUTE_FIXED__47_QL_REVIEW_AUTHORITY_ACTIVE__PRODUCTION_GATE_CLOSED`
