# INT-CP-005 V16.1 Final Authority

- Checkpoint: `INT-CP-005 — Variable Rates, Growth & Decay`
- Approved learner QLs: `INT-QL-086,087,088,089,090,091,092,093,095`
- Excluded from CP005 learner authority: `INT-QL-094`
- English runtime: `INT-CP-005-VARIABLE-GROWTH-DECAY-v16.1-hardening`
- Hindi/Punjabi runtime: `INT-CP-005-V16.1-HI-PA-HARDENING-v5`
- Immutable freeze: `INT-CP-005-EN-HI-PA-v16.1-frozen`
- Locales: `en-IN`, `hi-IN`, `pa-IN`
- Product-owner approval: `2026-08-16`
- Approved learner-source head: `979960073696a4945cb5540f7514aebfba57db0c`
- Exact freeze-validation head: `946d9bfe1af9fa72f740fd04fface3e07a5f3a1d`
- Final hardening run: `31955622235` — PASS
- Final review/hardening artifact: `9265885396`
- Review artifact digest: `sha256:49a530e7df09db66a02b3b4c91f0bf54242a57a2dea7f3c792268c1d6132184a`
- Freeze replay run: `31956998671` — PASS
- Freeze evidence artifact: `9266249585`
- Freeze artifact digest: `sha256:38b2652464d28960644ebc1bfb4ea4d0eaa1897a8df02daa94168da599735199`
- Freeze run merge-context base: `97a97ef0c9f058de75b2b83f5dfd6b55636fbbca`
- Freeze run PR merge ref: `4574110e3f99015f85cb2a251dc6ac28525e2ca0`

This authority record is added after the exact freeze-validation head. It does not modify learner content, runtime mathematics, option ownership, localization, audit logic, delivery wiring, or application behavior.

## Why V16.1 supersedes V15

V15 was mathematically sound but was rejected after learner-facing review found oversized values, unnecessary stem detail, weak contextual fit, and insufficient pool/stem diversity. V16/V16.1 rebuilt the learner surface rather than treating the earlier CI pass as sufficient evidence.

The approved V16.1 authority:
- removes production and salary contexts;
- keeps ordinary values hand-manageable and exam-realistic;
- makes stems direct and self-contained;
- uses misconception-derived distractors rather than synthetic nearby values;
- expands true mathematical topology instead of counting rate-order permutations as diversity;
- gives every retained QL multiple authored learner-facing frames;
- keeps Hindi and Punjabi mathematically identical to English while using native editorial wording;
- keeps `INT-QL-094` excluded because the migration/event-order family has no recovered Interest-family authority.

## Final hardening proof

English V16.1 hardening audit:
- 9 retained QLs;
- 5,760 generated questions;
- 5,760 deterministic replay checks;
- 5,760 independent verifier checks;
- 23,040 option checks;
- 7,680 option-plausibility checks;
- 40,320 lifecycle checks;
- 1,920 self-contained-stem checks;
- genuine topology counts: QL086 `66`, QL087 `22`, QL088 `66`, QL089 `35`, QL090 `18`, QL091 `18`, QL092 `11`, QL093 `50`, QL095 `9`;
- QL093 covers growth/decay, years 2–5, exact and between-year thresholds;
- QL095 covers both `A > B` and `B > A` plan directions and rejects permutation-only plans.

Hindi/Punjabi V16.1 hardening audit:
- 5,760 localized questions total;
- 34,560 mathematical-parity checks;
- 69,120 option-value/order/ownership checks;
- 40,320 lifecycle checks;
- 14,400 language checks;
- 1,920 self-contained-stem checks;
- approved Punjabi compound-interest terminology preserved;
- QL094 rejected in both localized authorities.

Final matched learner review:
- 27 mathematical states × 3 locales = 81 learner surfaces;
- three aligned stem templates per retained QL;
- three distinct mathematical topologies per retained QL in the review evidence;
- learner-facing artifact manually inspected after CI;
- product-owner approved.

## Immutable V16.1 freeze replay

The frozen wrapper dispatches only the approved English `final-v2` and localized `v5` authorities, then stamps multilingual-frozen status while independently rejecting any open delivery boundary.

Freeze replay proof:
- 9 QLs × 3 locales × 200 seeds = 5,400 frozen questions;
- 10,800 source/frozen and deterministic replay identity checks;
- 37,800 lifecycle checks;
- 48,600 deep-freeze checks;
- mutation guards `2/2`;
- QL094 rejected in all 3 locales;
- API build PASS on the PR merge context.

## Closed delivery boundary

V16.1 completion/freeze does not activate downstream product delivery:
- `enabled: false`
- `stagingStatus: NOT_STAGED`
- `registrationStatus: NOT_REGISTERED`
- `questionStudioDiscoverable: false`
- Question Bank: `NOT_STORED`
- tests: `INELIGIBLE`
- public publication: `false`

Question Studio activation, registration, Question Bank storage, test eligibility and public publication remain separate checkpoints.
