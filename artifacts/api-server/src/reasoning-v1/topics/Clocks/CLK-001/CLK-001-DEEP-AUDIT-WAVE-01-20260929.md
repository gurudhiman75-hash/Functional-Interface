# CLK-001 — Deep Audit Wave 01

Date: 2026-09-29

Status: `IMPLEMENTATION_COMPLETE__DEEP_AUDIT_OPEN__AUTHORING_BREADTH_GAP_CONFIRMED`

## Current authority

CLK-001 already has:

- 14 checkpoints;
- 23 permanent learner QLs (`CLK-QL-001..023`);
- completed source-saturation decisions;
- exact solvers and independent verification;
- technical item-level difficulty audit;
- English/Hindi/Punjabi anchor localization;
- review-only Question Studio integration;
- Question Bank/test/mock/public delivery locked.

No new permanent QL allocation is proposed in Wave 01.

## Anti-inflation state

The permanent taxonomy correctly compresses many source-backed tasks into shared learner contracts.

The current effective model contains:

- 23 permanent learner authorities;
- a large set of merged query/value/renderer variants owned by those authorities;
- explicit advanced holds;
- one internal-only verification family.

This is the correct anti-inflation direction.

## Reproduced authoring breadth defect

Question Studio currently generates:

```ts
generateClockQuestion({
  taskId: contract.anchorTaskId,
  ...
})
```

for every requested permanent QL.

Therefore repeated generation of a QL can vary numeric state/seed, but cannot select the other source-backed `ownedTaskIds` already merged into that same QL.

Examples of currently owned-but-authoring-inaccessible variants include:

- minute/second hand movement, inverse duration and revolutions under hand motion;
- reflex/directed/seconds/time-shift stated-time angles;
- all/first/next/previous/rounded angle-event queries;
- opposition/right-angle variants of special events;
- opposition/right-angle/arbitrary-angle interval counts;
- inverse faulty-clock mappings and rate conversions;
- inverse/multi-day faulty-clock directions;
- loss/inverse recurrence-fault variants;
- inverse strike-gap/count queries;
- 12-hour/range strike totals;
- inverse/boundary mirror queries;
- inverse clock-diagram selection and smaller/reflex diagram reading.

These are not new QLs. They are breadth inside existing QLs.

## Multilingual constraint

The current localization authority intentionally contains curated surfaces only for the 23 anchor tasks and throws for unsupported task IDs.

Therefore enabling merged variants only in the generator would create English-only breadth or break Hindi/Punjabi generation.

Wave 01 explicitly rejects that shortcut.

The remediation must expand:

1. authorable task selection inside each permanent QL; and
2. Hindi/Punjabi localization coverage for every newly authorable variant;

as one parity-preserving change.

## Regression authority

`clk-001-deep-audit-wave1.test.ts` proves:

- all 23 permanent QLs remain intact;
- permanent contracts own substantially more semantic tasks than the 23 anchors;
- repeated current Question Studio generation for every QL still exposes only its anchor task;
- variant authoring must remain blocked until multilingual support is extended.

## Other current lifecycle notes

Historical discovery/source-saturation policy files still contain pre-freeze booleans such as `permanentQlAllocationAllowed: false`. They are preserved audit history and do not override the later authoring completion authority.

The current authority remains:

- implementation complete;
- Question Studio review-only active;
- Question Bank writes disabled;
- test/mock/public delivery disabled.

## Next wave

Wave 02 should create a permanent-Ql-owned authoring variant registry:

- include only effective `PROVISIONAL_AUTHORITY_ANCHOR` + `MERGE_AS_QUERY_OR_RENDERER_VARIANT` tasks;
- keep all advanced holds/internal rows excluded;
- add deterministic within-QL variant selection;
- extend EN/HI/PA localization for the promoted variants;
- preserve semantic answer and correct-index parity;
- prove each QL can expose its owned exam-natural breadth without creating new QLs.

## Result

`CLK_001_WAVE01_ANCHOR_ONLY_AUTHORING_GAP_CONFIRMED`
