import assert from "node:assert/strict";
import { buildSea001EnglishReviewPackV1 } from "./english-review-pack-v1.ts";
import { buildSea001LocalizationReviewPackV1 } from "./localization-v1.ts";

const english = buildSea001EnglishReviewPackV1();
const hindi = buildSea001LocalizationReviewPackV1("hi-IN");
const punjabi = buildSea001LocalizationReviewPackV1("pa-IN");

assert.equal(english.length, 324);
assert.equal(hindi.length, english.length);
assert.equal(punjabi.length, english.length);

const proseLatin = /[A-Za-z]{2,}/u;
let unchangedHindiStems = 0;
let unchangedPunjabiStems = 0;

for (let index = 0; index < english.length; index += 1) {
  const en = english[index]!;
  const hi = hindi[index]!;
  const pa = punjabi[index]!;

  assert.equal(hi.sourceEnglishItemId, en.itemId);
  assert.equal(pa.sourceEnglishItemId, en.itemId);
  assert.equal(hi.itemId, en.itemId);
  assert.equal(pa.itemId, en.itemId);
  assert.equal(hi.qlId, en.qlId);
  assert.equal(pa.qlId, en.qlId);
  assert.equal(hi.correctIndex, en.correctIndex);
  assert.equal(pa.correctIndex, en.correctIndex);
  assert.equal(hi.difficulty, en.difficulty);
  assert.equal(pa.difficulty, en.difficulty);
  assert.equal(hi.diagramPolicy, "EXPLANATION_ONLY");
  assert.equal(pa.diagramPolicy, "EXPLANATION_ONLY");
  assert.equal(hi.options.length, 4);
  assert.equal(pa.options.length, 4);
  assert.equal(new Set(hi.options).size, 4);
  assert.equal(new Set(pa.options).size, 4);
  assert.equal(hi.reviewStatus, "LOCALIZATION_REVIEW_REQUIRED");
  assert.equal(pa.reviewStatus, "LOCALIZATION_REVIEW_REQUIRED");

  if (hi.stem === en.stem) unchangedHindiStems += 1;
  if (pa.stem === en.stem) unchangedPunjabiStems += 1;

  const hiSurface = [hi.stem, hi.explanation, ...hi.options].join("\n");
  const paSurface = [pa.stem, pa.explanation, ...pa.options].join("\n");
  assert.equal(proseLatin.test(hiSurface), false, `${hi.itemId}: Hindi learner surface contains untranslated Latin prose: ${hiSurface}`);
  assert.equal(proseLatin.test(paSurface), false, `${pa.itemId}: Punjabi learner surface contains untranslated Latin prose: ${paSurface}`);
}

assert.equal(unchangedHindiStems, 0, "Hindi stem shell coverage is incomplete");
assert.equal(unchangedPunjabiStems, 0, "Punjabi stem shell coverage is incomplete");

console.log(JSON.stringify({
  status: "PASS_SEA_001_LOCALIZATION_V2_NATIVE",
  englishItems: english.length,
  hindiItems: hindi.length,
  punjabiItems: punjabi.length,
  correctIndexParity: true,
  qlParity: true,
  difficultyParity: true,
  stemShellCoverage: "100%",
  untranslatedLatinProse: 0,
  nativeExplanationRendering: true,
  multilingualFreezePermitted: false,
}, null, 2));
