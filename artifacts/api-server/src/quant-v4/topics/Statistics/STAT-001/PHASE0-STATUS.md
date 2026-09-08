# STAT-001 Central Tendency Phase 0

Status: `PROOF_GREEN_REVIEW_READY`

Authority scope:
- SSC CGL Tier-II Mathematical Abilities common Statistics core.
- SSC CGL JSO common central-tendency foundation only; advanced Paper-II Statistics remains outside this checkpoint.

Temporary semantic contracts:
1. direct arithmetic mean of raw observations;
2. missing observation from stated mean;
3. corrected mean after one recording error;
4. combined/weighted mean of two groups;
5. median of raw observations, including odd and even sample sizes;
6. mode of raw observations with a unique modal value.

Editorial/runtime rules:
- direct learner-facing English stems;
- three or more structural stem surfaces per contract/profile under the permanent proof;
- four options for SSC profiles;
- misconception-owned distractors;
- exact deterministic arithmetic;
- materially separate independent verifier;
- question-specific worked explanation, shortcut and trap guidance.

Permanent proof:
- dedicated workflow run `34189916399`: PASS;
- 100 seeds × 2 profiles × 6 contracts = 1,200 generated questions;
- 1,200 deterministic replay checks;
- 1,200 independent verification checks;
- 4,800 option checks;
- four unique options and one correct answer throughout;
- A-D answer-position coverage for every contract/profile;
- at least three normalized stem structures per contract/profile;
- at least three wrong-answer misconception families per contract/profile;
- odd/even median coverage;
- multi-count missing/corrected mean coverage;
- all configured combined-group count pairs;
- learner-surface and lifecycle gates passed;
- no non-deterministic random source;
- package namespace guard passed;
- canonical collision-safe `Stat001*` public API proof passed;
- patch hygiene passed.

Lifecycle lock:
- contract IDs are temporary review IDs, not permanent QLs;
- Question Studio discovery: OFF;
- Question Bank: NOT_STORED;
- test eligibility: INELIGIBLE;
- mock-test eligibility: false;
- public publication: false;
- automatic student publication: false;
- localization: not started.

## Namespace correction

`STAT-001` is the Quant V4 Statistics package ID. `STA-001` is already owned globally by the frozen Reasoning Statement & Assumption package and must not be reused. The Phase-0 internals retain compatibility aliases, while new callers have a collision-safe `Stat001*` / `STAT001_*` public API.

## Checkpoint boundary

This checkpoint certifies only the six Phase-0 central-tendency contracts above. It does not claim full Statistics chapter coverage, permanent QL allocation, Question Studio activation, learner delivery, localization, dispersion, grouped-frequency Statistics, or advanced JSO Paper-II Statistics.
