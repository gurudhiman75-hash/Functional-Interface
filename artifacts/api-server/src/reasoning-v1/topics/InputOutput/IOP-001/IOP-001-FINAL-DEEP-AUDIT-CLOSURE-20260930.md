# IOP-001 — Final Content Deep Audit Closure

Date: 2026-09-30

Status: `CONTENT_DEEP_AUDIT_COMPLETE__MULTILINGUAL_FROZEN__QUESTION_STUDIO_REVIEW_ONLY`

## Permanent authority

Input–Output retains exactly 8 permanent machine QLs:

- `IOP-QL-001` — Single Select-and-Fix Rearrangement
- `IOP-QL-002` — Blocked Multi-Category Rearrangement
- `IOP-QL-003` — Simultaneous Multi-Action Rearrangement
- `IOP-QL-004` — Alternating / Interleaved Rearrangement
- `IOP-QL-005` — Numeric Transformation Pipeline
- `IOP-QL-006` — Text / Alphanumeric Transformation Pipeline
- `IOP-QL-007` — Mixed Word–Number Transformed-Pair Machine
- `IOP-QL-008` — Box / Table Arithmetic Machine

CP010 contributes solve/query overlays and creates zero additional machine QLs.

## Source saturation and anti-inflation

Current authority remains:

- source-family saturation: `PASS_V1`;
- whitelisted source modes: 19;
- solve/query modes: 8.

The merge/split model correctly does not create new QLs for:

- word versus number token domain;
- ascending versus descending order;
- left versus right placement;
- direct versus derived selection key;
- query wording;
- step/final/position/reverse/missing-state overlays;
- difficulty label alone.

A separate QL is retained only when the learner-facing transition architecture materially changes.

## Frozen learner authority

English:

- human approved;
- content-addressed frozen;
- 38 approved review caselets;
- 152 approved review questions;
- learner-content hash protected.

Hindi/Punjabi:

- human approved;
- `FROZEN_V1`;
- 76 localized review caselets;
- 304 localized review questions;
- canonical localized learner-content hash protected.

Frozen learner content was not changed by this deep audit.

## Question Studio parity defect remediated

Two integration defects were found and fixed:

### 1. Language-dependent semantic seed

Question Studio previously included the language in the caselet seed.

That allowed the same request seed to generate a different machine input/trace in English, Hindi and Punjabi.

Semantic generation is now language-neutral. Language is only a localization projection.

### 2. Locale-dependent canonical item identity

Localized caselets intentionally append `-hi-IN` / `-pa-IN` to their local caselet IDs.

Question Studio previously reused those localized IDs as canonical item IDs.

Canonical Question Studio identity now uses the shared language-neutral caselet identity, while localized question/explanation IDs remain language-specific.

## Same-item multilingual proof

The new parity proof sweeps:

- all 8 permanent QLs;
- all 19 source modes;
- English / Hindi / Punjabi;
- four generated questions per source mode.

For the same seed it requires parity for:

- QL;
- source mode;
- solve mode;
- canonical item ID;
- semantic seed;
- demonstration trace;
- target trace;
- source evidence;
- correct option index;
- difficulty.

## Generated-surface quality

Existing chapter gates already cover:

- all 19 source modes;
- all 8 solve modes;
- EN/HI/PA;
- exam-standard direct stems;
- stem-length limits;
- substantive worked explanations;
- explanation-answer inclusion;
- four distinct options;
- exactly one correct answer;
- answer-position balance;
- rich word/number object pools;
- vocabulary safety;
- no engineering-token leakage;
- no duplicate learner questions in readiness samples;
- deterministic generation;
- Banking-only exam-profile fail-closed behavior.

The post-fix IOP-specific Question Studio gate passed:

- strict IOP TypeScript;
- English freeze proof;
- Hindi/Punjabi freeze proof;
- permanent QL authority;
- standard Question Studio adapter;
- EN/HI/PA same-item semantic parity;
- source-mode difficulty routing;
- exam vocabulary safety;
- full Question Studio scale;
- exam-readiness audit;
- global production-style routing;
- admin Question Studio typecheck;
- production API build.

## Difficulty

Current difficulty remains the approved source-mode/family calibration used by the frozen production authority.

This deep audit does not mutate frozen learner content to introduce a new difficulty system.

Learner-data calibration remains a separate later analytics pass.

## Lifecycle

Current lifecycle remains:

- maturity: `MULTILINGUAL_FROZEN`;
- Question Studio: registered / discoverable / generatable;
- Question Studio mode: review-only;
- Question Bank writable: false;
- test eligible: false;
- mock-test eligible: false;
- public/student publication: false;
- automatic publication: false.

## Separate future gates

The following remain outside this content closure:

1. learner-data-based difficulty calibration;
2. controlled novelty;
3. any future source-backed expansion of currently quarantined transformation modes;
4. downstream Question Bank/test/mock/public release approval.

## Final result

`IOP_001_CONTENT_DEEP_AUDIT_COMPLETE_20260930__8_QLS__19_SOURCE_MODES__EN_HI_PA_SAME_ITEM_PARITY__REVIEW_ONLY`
