// Source-tree equivalent of the built worker policy module.
// The production image uses the dist copy, not this source shim.
export {productionChapterReleaseActive,readProductionChapterScope,
  readCanonicalChapterManifest,validateProductionChapterReview}
  from "./src/question-studio/prod-chapter-review-policy.mjs";
