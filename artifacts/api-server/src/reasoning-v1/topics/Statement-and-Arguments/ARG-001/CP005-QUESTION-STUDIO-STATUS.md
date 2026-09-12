# ARG-001 CP005 — Question Studio Review Integration

Status: COMPLETE / REVIEW CONNECTED / READY FOR CP006 FREEZE CANDIDATE

## Implemented and certified in this branch

- Review-only Question Studio package for `ARG-001`.
- Six permanent QLs exposed as selectable canonical problems.
- English, Hindi and Punjabi generation backed only by the certified CP004 generator.
- Easy, Medium and Hard generation available for every permanent QL.
- Stable seeded replay and content fingerprints.
- Review payload includes statement, both arguments, localized options, answer class, argument strengths and issue-specific explanation.
- Question Studio visibility/discovery/generation flags enabled for review.
- ARG is layered additively over the existing shared Question Studio generation registry.
- Canonical Question Studio route registry mounts ARG before the previous SRI aggregate route, preserving all previous package fallbacks.
- Shared-router proof verifies previous package preservation, ARG routing and non-ARG fallback behaviour.
- Manual approval required.
- Source-generator-only revision policy.
- Question Bank writes remain disabled.
- Test/mock eligibility remains disabled.
- Public and automatic learner publication remain disabled.
- Dedicated strict TypeScript / proof / production-build workflows are green.

## Difficulty authority audit and correction

CP005 exposed a metadata defect in the already-certified CP003 authority set: the chapter design requires `Easy`, `Medium` and `Hard`, but the original template labels did not expose Easy and labelled all QL006 authorities Hard.

The defect was corrected at the source-authority layer by recalibrating difficulty metadata only. No statement, argument, answer class, option, explanation, variant dimension, Hindi text or Punjabi text was rewritten as part of this correction.

Recalibrated 48-template distribution:

- Easy: 13 templates
- Medium: 15 templates
- Hard: 20 templates

Every permanent QL now contains all three certified difficulty bands:

- `ARG-QL-001`: Easy, Medium, Hard
- `ARG-QL-002`: Easy, Medium, Hard
- `ARG-QL-003`: Easy, Medium, Hard
- `ARG-QL-004`: Easy, Medium, Hard
- `ARG-QL-005`: Easy, Medium, Hard
- `ARG-QL-006`: Easy, Medium, Hard

The recalibration is consistent with the chapter difficulty contract: Easy authorities use obvious relevance/materiality, triviality, stereotype, extreme-overclaim, fanciful-premise or false-dilemma defects; Medium authorities require more careful evaluation of scope, implementation or proportionality; Hard authorities preserve competing material considerations, qualified mechanisms and second-order effects.

## Re-certification evidence

After the source-authority recalibration:

- CP003 saturation and anti-gaming proof remains green over 12,288 unique English learner surfaces.
- CP004 EN/HI/PA semantic-parity proof remains green over the complete trilingual surface space.
- CP005 review adapter proof is green for all six QLs, all three languages and all three difficulty bands.
- Explicit `6 QLs × 3 difficulties` Question Studio routing is proved.
- Shared Question Studio package registry and non-ARG fallback routing remain green.
- Production API build is green.
- Production admin build is green.
- Question Studio route-registry and workflow-hygiene guards are green.

## Lifecycle boundary

CP005 exposes ARG-001 only to Question Studio review. It does **not** approve learner delivery.

The following remain hard-locked:

- Question Bank writes
- learner test eligibility
- mock-test eligibility
- public publication
- automatic student publication

Manual editorial approval remains required inside Question Studio.

## CP006 boundary

`ARG-CP-006` is the next checkpoint and is a separate immutable chapter freeze/certification step. CP006 must freeze the certified taxonomy, QL inventory, answer mapping, difficulty calibration, multilingual semantic parity, saturation/anti-gaming guarantees and Question Studio review contract. Learner release remains a later, separate approval even after CP006.
