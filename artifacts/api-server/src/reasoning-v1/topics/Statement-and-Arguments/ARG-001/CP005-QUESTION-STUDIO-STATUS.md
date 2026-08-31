# ARG-001 CP005 — Question Studio Review Integration

Status: ROUTER CONNECTED / REVIEW CANDIDATE / EASY COVERAGE GAP OPEN

## Implemented in this branch

- Review-only Question Studio package for `ARG-001`.
- Six permanent QLs exposed as selectable canonical problems.
- English, Hindi and Punjabi generation backed only by the certified CP004 generator.
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
- Dedicated strict TypeScript / proof / build workflows added.

## Difficulty authority audit discovered during CP005

The end-to-end design targets `Easy`, `Medium` and `Hard`, but the certified CP003/CP004 authority set does not currently contain any `Easy` templates.

Certified coverage is:

- `ARG-QL-001`: Medium, Hard
- `ARG-QL-002`: Medium, Hard
- `ARG-QL-003`: Medium, Hard
- `ARG-QL-004`: Medium, Hard
- `ARG-QL-005`: Medium, Hard
- `ARG-QL-006`: Hard only
- Easy: no certified authority in any QL

CP005 therefore advertises only `Medium` and `Hard` as currently supported certified difficulties. It does not relabel Medium questions as Easy.

Runtime guards:

- generic `Medium` requests can schedule only QL001–QL005;
- generic `Hard` requests can schedule all six QLs;
- `ARG-QL-006 + Medium` is rejected explicitly;
- every `Easy` request is rejected explicitly until Easy authorities are authored, localized and re-certified.

This is an authority-coverage defect discovered by integration, not a Question Studio routing defect.

## Still required before CP005 / chapter closure

- Obtain exact-head green CP005 adapter and shared-router CI after the difficulty-coverage correction.
- Author genuine Easy authorities/surfaces under the chapter's Easy difficulty contract.
- Add Hindi/Punjabi semantic-parity surfaces for the Easy authorities.
- Re-run saturation, anti-gaming, localization parity and Question Studio proofs over the expanded authority set.
- Do not enter CP006 freeze while Easy remains uncovered.

## CP006 boundary

CP006 remains the immutable chapter freeze/certification checkpoint. CP006 must not certify the chapter while the design-target Easy coverage gap is open. Learner release is not implied by CP005 or CP006 and remains separately locked until explicit release approval.
