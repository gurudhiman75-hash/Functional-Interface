# R7 Corpus Scheduler Intelligence Report

## Scope

This phase adds corpus-level orchestration above the stable quant-v2 percentage generator. It does not rewrite canonical reasoning, multilingual realization, validators, admin routing, or storage contracts.

## Implemented

- Added `corpus-scheduler.ts` as a deterministic set-level scheduler.
- Added mock-test profiles:
  - `balanced_mock`
  - `ssc_mock`
  - `banking_mock`
  - `railway_mock`
  - `punjab_state_mock`
- Added topology-group governance for:
  - simple templates
  - reverse logic
  - relational reasoning
  - filtered reasoning
  - hybrid reasoning
  - multi-step reasoning
- Added examiner-intent balancing to prevent cognitive-trap clustering.
- Added semantic-anchor rotation to reduce repeated topics and repeated object/domain anchors.
- Added distractor-trap distribution tracking.
- Added fingerprint collision scoring using existing quant-v2 corpus fingerprints.
- Added difficulty pacing with hard-question streak control.
- Added candidate self-correction:
  - scheduler generates multiple candidates per slot when needed
  - scores candidates against corpus history
  - records rejection reasons and pacing events
- Added `corpus-quality-evaluator.ts` with a single corpus quality score and tier.
- Integrated scheduler metadata into corpus audit exports through optional `useScheduler` and `schedulerProfile` options.

## Export Metadata

Audit summaries can now include:

- scheduler profile
- topology distribution
- topology group distribution
- examiner-intent distribution
- semantic-anchor distribution
- distractor-trap distribution
- duplicate-risk report
- difficulty pacing report
- rejection reason distribution
- corpus quality score and tier

## Validation

- `pnpm --dir artifacts/api-server run test:quant-v2-corpus-scheduler`
  - validates multiple 100-question mock sets across SSC, Banking, Railway, Punjab/State, and balanced profiles
  - validates a 20,000-question scheduled audit corpus
  - validates export summary propagation for scheduler and corpus-quality metadata
- `pnpm --dir artifacts/api-server run test:quant-v2-corpus-audit`
  - confirms existing export pipeline remains stable

## Operational Notes

- Normal single-question admin generation remains unchanged.
- Scheduler mode is optional and intended for mock-test/corpus generation.
- The scheduler is deterministic from seed/profile but uses corpus history to avoid local clustering.
- The scheduler prefers intelligent balancing over rigid quotas, so it can still finish sets when finite factory pools are strained.

## Remaining Gaps

- Full batch-level regeneration is now available at candidate level, but not yet exposed as a first-class admin mock-test builder.
- The scheduler works with current quant-v2 percentage generation only.
- Future phases can let examiner intent become the primary input before topology selection, instead of inferred after candidate generation.

## Readiness

R7 moves quant-v2 from single-question optimization toward set-level mock-test orchestration. A generated 50/100-question percentage set now has explicit controls for distribution, pacing, duplicate risk, trap variety, and semantic diversity.

