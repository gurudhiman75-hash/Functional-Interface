# Statistics Hindi/Punjabi foundation review V1

Date: 2026-10-15. Scope: controlled native review candidates, not a new mathematics audit or a production release.

## Coverage

| Package | Permanent QLs | Hindi/Punjabi state |
|---|---|---|
| STAT-001 Central tendency | STAT-QL-001–006 | Authored native review candidates |
| STAT-002 Standard deviation | STAT-QL-007–012 | Authored native review candidates |
| STAT-003 Frequency distributions and empirical relations | STAT-QL-013–020 | Authored native review candidates |
| STAT-004 Data collection, classification and tabulation | STAT-QL-021–035 | Authored native review candidates |
| STAT-005–014 | Remaining 179 QLs, including later syllabus additions | English-only; localization pending |

This checkpoint covers 35 of 214 QLs. It does not freeze or close localization of the whole chapter. The completed mathematics, syllabus, English stems and diversity audit remains closed.

## Content and authority

`shared/foundation-native-v1.ts` authors full Hindi and Punjabi prompts and worked solutions directly from the 20 structured state kinds. No English parsing, word replacement, machine translation or English fallback is used. Every native rendering recomputes the answer, checks QL/state ownership and verifies exact answer/option parity against the validated source package before returning a preview. Grouped problems state interval conventions and two-decimal rounding; rounded results use ≈. Population SD explicitly uses N, not N−1. Reverse scaling explicitly asks for a positive multiplier.

The English source packages remain byte-identical mathematical authorities. Native previews retain data, answers, answer positions, numeric options, permanent IDs, exam profile, difficulty and source identity. Their own IDs carry the language suffix. Native review status, runtime and release identity are separate from the English review release; metadata and traceability point back to that source release. English distractor derivations remain in the source audit package; native option metadata carries numeric text and misconception IDs without exposing untranslated derivations.

Only STAT-001–005 advertise `en`, `hi`, `pa`. Language aliases hi-IN/pa-IN are normalized, unsupported languages fail explicitly. STAT-006–014 continue to advertise English only. English package review states remain unchanged; Hindi/Punjabi are `NATIVE_REVIEW_CANDIDATE` with human review pending. Question Bank writes, tests/mocks, publication and production release remain locked. Human/live verification is deferred to the user, as requested.

## Reproducible verification

- `shared/foundation-native-v1.test.ts`: 1,440 English source/preview baseline comparisons by SHA-256; 2,880 Hindi/Punjabi previews; all 80 QL/profile/language combinations; complete native replays; data/options/answer parity; review provenance and release locks; unsupported-language, wrong-owner and invalid-source rejection; fixed correction-direction, positive-factor, interval, rounding and even-median cases.
- `shared/foundation-native-studio-v1.test.ts`: all 40 QL/language routes through Question Studio; discovery checks for all 14 packages, including the 11 untouched English-only packages.
- Existing STAT-001 API, central-tendency, STAT-002 SD, STAT-003 frequency and three Question Studio integration proofs run alongside this work.
- Dedicated hosted workflow: `.github/workflows/quant-v4-statistics-foundation-native-v1.yml`.

The isolated TypeScript comparison reports the existing STAT-001 `central-tendency.ts:252` generic tuple-inference error on both baseline and changed code. This checkpoint introduces no additional error in the foundation source/parity check; it does not claim a clean whole-repository typecheck.

## STAT-004 extension

`STAT-004/review-facts-v1.ts` owns scenario choices and numeric stimuli for both English and native rendering. Extracting those choices preserves the original RNG draw order. `STAT-004/native-review-v1.ts` authors both native stem surfaces, complete conceptual options and explanations for all 15 contracts, rather than applying the numeric foundation renderer to conceptual questions. Unknown options fail explicitly. Native conceptual answer text and canonical display are localized while the source answer, source options and correct index remain traceable. Numeric frequency questions independently recompute their answers, with an interval tally table for the construction task.

`STAT-004/native-review-v1.test.ts` verifies 3,000 English source/preview questions against the pre-change SHA-256 baseline, 6,000 native questions, all 60 QL/profile/language combinations, all 67 scenario/fact variants, all four answer positions, full replays, numeric recomputation, native canonical-answer display, provenance and release locks. Unsupported language, unknown option, wrong QL owner and mismatched source identity are rejected. The isolated native source/parity TypeScript check passes. The existing 1,500-question data-foundations proof also passes.

`STAT-004/native-studio-v1.test.ts` covers all 60 native QL/language/profile routes and the 15-QL English batch through Question Studio. Dedicated hosted workflow: `.github/workflows/quant-v4-stat004-native-v1.yml`. The earlier foundation discovery proof now expects four native-capable packages and ten English-only packages.

STAT-005 adds 16 QLs (036–051), bringing authored native coverage to 51/214. Its state-driven renderer preserves English numerical authority and explicit partition conventions; see STAT-005/NATIVE-REVIEW-V1.md. Next authored package: STAT-006. Native human/live verification remains deferred to the user.
