# ARG-001 CP005 — Question Studio Review Integration

Status: IMPLEMENTATION CANDIDATE

## Implemented in this branch

- Review-only Question Studio package for `ARG-001`.
- Six permanent QLs exposed as selectable canonical problems.
- English, Hindi and Punjabi generation backed only by the certified CP004 generator.
- Easy / Medium / Hard filtering resolved deterministically against certified authority difficulty.
- Stable seeded replay and content fingerprints.
- Review payload includes statement, both arguments, localized options, answer class, argument strengths and issue-specific explanation.
- Question Studio visibility/discovery/generation flags enabled for review.
- Manual approval required.
- Source-generator-only revision policy.
- Question Bank writes remain disabled.
- Test/mock eligibility remains disabled.
- Public and automatic learner publication remain disabled.
- Dedicated strict TypeScript / proof / build workflow added.

## Still required before CP005 can be called complete

- Wire `ARG-001` into `src/question-studio/shared-generation-engine.ts` package listing and generation router.
- Prove the shared router returns the ARG package and routes ARG selectors to the CP005 adapter without disturbing STA/WOR/Quant routing.
- Obtain green exact-head CI for the CP005 workflow after router wiring.

## CP006 boundary

CP006 remains the immutable chapter freeze/certification checkpoint. Learner release is not implied by CP005 or CP006 and remains separately locked until explicit release approval.
