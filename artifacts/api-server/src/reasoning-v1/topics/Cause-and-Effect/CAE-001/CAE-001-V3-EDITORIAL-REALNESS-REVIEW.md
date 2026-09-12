# CAE-001 V3 editorial-realness review pack

The obsolete template-based examples have been removed. The approved, deterministic English review pack is materialized by [editorial-review-pack.ts](./editorial-review-pack.ts): ten generated questions for every current CP/QL (90 total), covering every difficulty state actually available for that QL and multiple scenario families.

Every sample includes the stem, options, answer, question-specific explanation, family and variant, `causalStateId`, `itemVariantId`, instance-derived difficulty evidence, and distractor-mechanism labels. It is review-only: Question Studio persistence, test, mock, and public publication remain locked.

The CAE saturation test verifies the pack selection and renders it through `renderCae001EditorialRealnessReview()`.
