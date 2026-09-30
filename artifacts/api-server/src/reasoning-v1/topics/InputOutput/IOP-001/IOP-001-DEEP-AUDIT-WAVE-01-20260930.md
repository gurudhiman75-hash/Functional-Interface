# IOP-001 — Deep Audit Wave 01

Date: 2026-09-30

Status: `MULTILINGUAL_STATE_ALIGNED__QUESTION_STUDIO_SEMANTIC_PARITY_FIXED__FINAL_QUALITY_AUDIT_OPEN`

## Current authority

IOP-001 already has:

- 8 permanent QLs;
- 19 source-whitelisted production modes;
- all 8 solve/query overlays;
- English content-addressed freeze;
- human-approved Hindi/Punjabi localization freeze;
- standard Question Studio review-only integration;
- Question Bank/test/mock/public release locked.

## Governance drift remediated

The top-level README and branch-status documents still described:

- maturity as English-only frozen;
- Hindi/Punjabi as not started;
- Question Studio as inactive.

Those statements were stale relative to current permanent/localization/Question Studio authorities.

Wave 01 aligns the chapter status to:

- `MULTILINGUAL_FROZEN`;
- Hindi/Punjabi `FROZEN_V1`;
- Question Studio `REGISTERED_STANDARD_REVIEW_ONLY`.

## Question Studio semantic-parity defect

Question Studio previously constructed caselet seeds as:

```
baseSeed | language | qlId | attempt
```

Therefore the same request seed could produce a different machine input/trace for English, Hindi and Punjabi.

That violates the intended localization model: language should project the same frozen semantic machine state, not generate a different question.

Wave 01 changes semantic generation to:

```
baseSeed | qlId | attempt
```

Language is now applied only during localization.

## Regression proof

`question-studio-language-parity.test.ts` sweeps:

- all 8 permanent QLs;
- all 19 source modes;
- English / Hindi / Punjabi;
- four generated questions per source mode.

For the same seed it requires identical:

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

Localized text/options may differ by language as intended.

## Lifecycle

No downstream activation changes:

- Question Studio: review-only;
- Question Bank writes: false;
- test eligible: false;
- mock/public release: false;
- automatic publication: false.

## Next gate

Run a final generated-surface deep audit across all 19 source modes and all 8 solve modes for:

- exam-standard stems;
- explanation quality;
- distractor integrity/provenance;
- vocabulary safety;
- difficulty correctness;
- multilingual editorial purity;
- source-mode breadth and query balance;
- lifecycle consistency.

## Result

`IOP_001_WAVE01_SEMANTIC_LANGUAGE_PARITY_FIXED`
