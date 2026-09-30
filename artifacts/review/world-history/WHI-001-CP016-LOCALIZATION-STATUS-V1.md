# WHI-001 CP016 Hindi and Punjabi Localization Status

**Status:** English, Hindi and Punjabi review sets are approved. CP016 is available in Question Studio through a read-only review package.

- Hindi and Punjabi contain 60 items each and use locale-suffixed IDs linked through `englishQuestionId`.
- Each item preserves the CP016 fact ID, origin checkpoint/question/fact/source IDs, normalized source IDs, difficulty, option keys/order, and answer position.
- CP001–CP005 selections reuse their existing localized origin records; CP006–CP015 selections are localized for this cumulative set. This does not replace full-pool localization for CP006–CP010 and CP015.
- The Question Studio package uses the shared `knowledge-v1` adapter and standard review-only lifecycle.
- Question Bank persistence, tests, mock tests, publication and learner delivery remain disabled. Generated CP016 items retain `runtimeRegistered: false`.
- Contract checks cover route selection, all three languages, provenance, correct answer indexes, difficulty filtering, and release locks.

## Remaining before learner release

1. Resolve the coverage gaps, duplicate clusters and source issues recorded in [the chapter-wide audit](./WHI-001-CP001-016-CHAPTER-WIDE-COVERAGE-AUDIT-V1.md).
2. Verify unresolved source locators against original material; do not infer page/section references.
3. Complete chapter-wide chronology, semantic duplication, factual accuracy, ambiguity and difficulty review.
4. Complete full Hindi/Punjabi localization and parity review for CP006–CP010 and CP015; CP011–CP014 now have approved full pools. CP016 currently localizes only four selected questions per origin checkpoint.
