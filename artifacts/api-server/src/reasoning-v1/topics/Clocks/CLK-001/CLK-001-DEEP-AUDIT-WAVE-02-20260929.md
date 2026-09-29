# CLK-001 — Deep Audit Wave 02

Date: 2026-09-29

Status: `MULTILINGUAL_VARIANT_AUTHORING_BATCH_1_IMPLEMENTED__23_QL_TAXONOMY_UNCHANGED`

## Purpose

Wave 01 proved that CLK-001 permanent QLs own substantially more source-backed semantic breadth than Question Studio actually exposed.

Wave 02 begins closing that gap without inflating the permanent taxonomy.

## Batch 1 newly authorable variants

The following source-backed merged variants are now enabled inside their existing permanent QLs:

- `HAND_MINUTE_ROTATION` -> `CLK-QL-001`
- `HAND_SECOND_ROTATION` -> `CLK-QL-001`
- `HAND_DURATION_FROM_ANGLE` -> `CLK-QL-001`
- `TOTAL_STRIKES_12_HOURS` -> `CLK-QL-019`
- `ACTUAL_FROM_MIRROR` -> `CLK-QL-020`
- `SELECT_DIAGRAM_FOR_TIME` -> `CLK-QL-021`

No new QL is created.

## Deterministic within-QL selection

Question Studio now selects the actual authoring task from a QL-owned authoring pool rather than always forcing the permanent anchor.

The selector is deterministic from:

- base seed;
- QL;
- item index.

Repeated generation of a selected QL therefore cycles through the enabled exam-natural variants while preserving replay.

## Traceability

Every generated item now records both:

- `anchorTaskId` — the permanent governance anchor;
- `authoringTaskId` — the actual source-backed task used for this generated item.

The item also records:

- the full enabled authoring task pool for that QL;
- `CLK_001_AUTHORING_VARIANT_AUTHORITY_V1`.

This keeps permanent taxonomy and authoring diversity separate.

## Multilingual parity

Batch 1 is enabled only after native Hindi/Punjabi templates were added for the same six variants.

The localization layer now supports:

- hour / minute / second hand total motion;
- inverse time-from-angle hand movement;
- 12-hour standard strike total;
- actual time recovered from mirror reading;
- clock-diagram selection for a target time.

No English-only variant exposure is permitted.

## Explicit exclusions

All tasks currently marked:

- `HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION`; or
- `INTERNAL_VERIFICATION_ONLY`

remain unreachable from the authoring registry.

Merged variants not yet localized also remain anchor-inaccessible until later batches.

## Regression proof

`clk-001-deep-audit-wave2.test.ts` verifies:

- permanent QL count remains 23;
- exactly six merged variants are newly enabled in Batch 1;
- expanded QLs are `CLK-QL-001`, `019`, `020`, `021`;
- every enabled variant is observed under repeated deterministic generation;
- English/Hindi/Punjabi choose the same task sequence;
- correct index and semantic fingerprint remain identical across languages;
- all non-expanded QLs remain anchor-only;
- held/internal tasks remain excluded.

## Lifecycle

Unchanged:

- Question Studio: review-only;
- Question Bank writable: false;
- test eligible: false;
- mock-test eligible: false;
- public/student publication: false;
- manual editorial review required.

## Next wave

Continue variant expansion in controlled multilingual batches across:

- stated-time angle variants;
- arbitrary-angle time queries;
- special hand events;
- event counts;
- faulty-clock inverse/unit conversions;
- recurrence-fault variants;
- strike-gap inverse/count variants;
- mirror boundary/text variants;
- diagram angle variants.

## Result

`CLK_001_WAVE02_BATCH1_VARIANT_BREADTH_ENABLED_WITH_MULTILINGUAL_PARITY`
