# MAL-001 native quality correction V7 — 2026-10-16

Status: partial correction; chapter remains open for native wording review.

Translation fallback previously altered TeX command names, including `\left` and `\times`. V7 shields command tokens before localization and restores them afterward, preserving localized prose inside text commands. Structured Hindi/Punjabi stems now cover CP002 QLs 012–028, with additional matching forms elsewhere. QL067 now explicitly states that vessel C starts empty when its source omitted this necessary premise.

Native delivery is marked NATIVE_QUALITY_REVIEW_CANDIDATE; the package is CONTROLLED_MULTILINGUAL_REVIEW. Bank writes, test eligibility, automatic student publication and production release remain disabled, with manual approval required. Source review provenance is retained. English mathematical data, solvers and option construction are unchanged.

## Reproducible verification

The committed `mal-native-quality-v7.test.ts` exercises all 67 QLs over 12 seeds, expanding CP002 to 60 seeds. It verifies immutable source data, numeric option parity, unique options, answer binding, mathematical parameter parity, native script, authored CP002 stems, exact TeX command parity, 1,000-question batches per language, replay determinism and delivery locks. The run covers 4,860 trilingual source samples and 3,240 native samples; the old localizer corrupts formula command streams in 1,896 of those native samples. All V7 comparisons pass. Separate mixed batches add 3,000 delivery questions. Evidence is in the adjacent JSON; CI runs both this regression and the existing systematic chapter audit.

## Remaining work

27 QLs still have at least one tested alternate stem using lexical fallback: 029–033, 035–046, 053, 059–067. These are reported by the regression rather than silently counted as authored native stems. Native explanation prose and encoded diagram labels also need wording/visual review. Command preservation and numeric parity do not establish linguistic quality. No native editorial approval, publication readiness or full chapter closure is claimed.
