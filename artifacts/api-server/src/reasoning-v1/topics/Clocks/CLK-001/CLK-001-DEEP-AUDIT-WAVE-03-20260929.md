# CLK-001 — Deep Audit Wave 03

Date: 2026-09-29

Status: `MULTILINGUAL_VARIANT_AUTHORING_BATCH_2_IMPLEMENTED__16_MERGED_VARIANTS_ENABLED__23_QLS_UNCHANGED`

## Batch 2 newly enabled variants

Ten additional source-backed merged variants are now authorable inside their existing permanent QLs:

- `REFLEX_ANGLE_AT_TIME` -> `CLK-QL-003`
- `OPPOSITION_IN_HOUR` -> `CLK-QL-006`
- `RIGHT_ANGLE_TIMES_IN_HOUR` -> `CLK-QL-006`
- `COUNT_OPPOSITIONS` -> `CLK-QL-008`
- `COUNT_RIGHT_ANGLES` -> `CLK-QL-008`
- `ACTUAL_FROM_DISPLAYED_ELAPSED` -> `CLK-QL-010`
- `ACTUAL_DURATION_FROM_READING_CHANGE` -> `CLK-QL-011`
- `LOSS_FROM_COINCIDENCE_INTERVAL` -> `CLK-QL-017`
- `GAP_FROM_N_STRIKES` -> `CLK-QL-018`
- `IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM` -> `CLK-QL-022`

Together with Batch 1, CLK-001 now exposes 16 merged source-backed variants in addition to the 23 permanent anchors.

## Permanent taxonomy

Unchanged:

- permanent QLs: 23;
- range: `CLK-QL-001..023`;
- no new QLs allocated;
- merged query/value/renderer forms remain owned by their existing semantic authority.

## Expanded QLs

After Batch 2, twelve permanent QLs have more than one authoring task:

- QL001
- QL003
- QL006
- QL008
- QL010
- QL011
- QL017
- QL018
- QL019
- QL020
- QL021
- QL022

Other QLs remain anchor-only until their merged variants receive explicit multilingual authoring surfaces.

## Multilingual parity

Every Batch 2 variant has native Hindi and Punjabi authoring templates derived from solver scenario state.

The implementation avoids generic machine-style English replacement.

Parity remains frozen for:

- selected authoring task;
- semantic fingerprint;
- correct option index;
- option uniqueness;
- solver agreement;
- QL identity.

## Exclusions

No task with disposition:

- `HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION`; or
- `INTERNAL_VERIFICATION_ONLY`

is exposed.

## CI proof

`clk-001-deep-audit-wave3.test.ts` verifies:

- 23 permanent QLs remain unchanged;
- cumulative enabled merged variants = 16;
- Batch 2 contains exactly 10 tasks;
- every Batch 2 task is observed under Question Studio generation;
- all 12 expanded QLs expose their complete enabled authoring pool;
- EN/HI/PA task selection, correct-index and semantic-fingerprint parity;
- held/internal tasks remain unreachable.

## Lifecycle

Unchanged review-only lifecycle:

- Question Studio discovery/generation: enabled;
- Question Bank writes: disabled;
- test/mock eligibility: disabled;
- public/student publication: disabled;
- manual review required.

## Next wave

Continue multilingual variant expansion for the remaining source-backed merged tasks, prioritizing:

- arbitrary-angle time query variants;
- partial/endpoint event-count variants;
- faulty-clock rate/classification variants;
- multi-day forward mapping;
- two-clock equality;
- recurrence inverse/classification;
- strike transfer/count variants;
- mirror boundary/text variants;
- diagram angle/renderer variants.

## Result

`CLK_001_WAVE03_BATCH2_VARIANT_BREADTH_ENABLED_WITH_MULTILINGUAL_PARITY`
