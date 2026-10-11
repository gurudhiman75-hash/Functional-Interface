import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import { TSD_CP012_NATIVE_HINDI_REVIEW_FINAL, TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL } from "./native-review-editorial-final";
import {
  TSD_CP012_STUDIO_CANDIDATE_PACKAGE,
  previewTsdCp012StudioCandidate,
  type TsdCp012StudioLanguage,
} from "./question-studio-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 difficulty contract failed: ${message}`);
}

const supported = new Set<string>(TSD_CP012_STUDIO_CANDIDATE_PACKAGE.supportedDifficulties);
assert(supported.size === 2 && supported.has("EASY") && supported.has("MEDIUM"), "Studio package must advertise only EASY and MEDIUM before hard-band calibration exists");

const surfaces = Object.freeze({
  en: TSD_CP012_ENGLISH_REVIEW_FINAL,
  hi: TSD_CP012_NATIVE_HINDI_REVIEW_FINAL,
  pa: TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL,
});

const englishDifficultyByFamily = new Map(TSD_CP012_ENGLISH_REVIEW_FINAL.map((question) => [question.familyId, question.difficulty] as const));

for (const [language, questions] of Object.entries(surfaces) as [TsdCp012StudioLanguage, typeof TSD_CP012_ENGLISH_REVIEW_FINAL][]) {
  assert(questions.length === 270, `${language}: expected 270 calibrated review families, found ${questions.length}`);
  assert(questions.every((question) => supported.has(question.difficulty)), `${language}: final review exposes an unadvertised difficulty`);
  assert(questions.every((question) => question.difficulty !== ("HARD" as string)), `${language}: unreviewed HARD label escaped final review`);

  const easy = questions.filter((question) => question.difficulty === "EASY").length;
  const medium = questions.filter((question) => question.difficulty === "MEDIUM").length;
  assert(easy === 22, `${language}: expected 22 EASY families, found ${easy}`);
  assert(medium === 248, `${language}: expected 248 MEDIUM families, found ${medium}`);

  for (const question of questions) {
    assert(englishDifficultyByFamily.get(question.familyId) === question.difficulty, `${language}/${question.familyId}: difficulty label diverges from English authority`);
  }

  const allPreview = previewTsdCp012StudioCandidate({ language, count: 270, seed: "cp012-difficulty-contract-all" });
  assert(allPreview.questions.every((question) => supported.has(question.difficultyBand)), `${language}: Studio preview emitted an unadvertised difficulty`);
  assert(allPreview.questions.every((question) => question.difficultyBand !== ("HARD" as string)), `${language}: Studio preview emitted HARD before hard-band calibration`);

  const easyPreview = previewTsdCp012StudioCandidate({ language, difficulty: "EASY", count: 22, seed: "cp012-difficulty-contract-easy" });
  assert(easyPreview.availableCombinationsUnderFilters === 22, `${language}: EASY filter must expose exactly 22 reviewed combinations`);
  assert(easyPreview.questions.every((question) => question.difficultyBand === "EASY"), `${language}: EASY filter leaked another difficulty`);

  const mediumPreview = previewTsdCp012StudioCandidate({ language, difficulty: "MEDIUM", count: 248, seed: "cp012-difficulty-contract-medium" });
  assert(mediumPreview.availableCombinationsUnderFilters === 248, `${language}: MEDIUM filter must expose exactly 248 reviewed combinations`);
  assert(mediumPreview.questions.every((question) => question.difficultyBand === "MEDIUM"), `${language}: MEDIUM filter leaked another difficulty`);
}

console.log("TSD-CP-012 QUESTION STUDIO DIFFICULTY CONTRACT PROOF: PASS");
console.log(JSON.stringify({
  supportedDifficulties: [...TSD_CP012_STUDIO_CANDIDATE_PACKAGE.supportedDifficulties],
  perLocale: { total: 270, easy: 22, medium: 248, hard: 0 },
  multilingual: { total: 810, easy: 66, medium: 744, hard: 0 },
  crossLocaleDifficultyParity: "IDENTICAL_BY_FAMILY",
  unreviewedHardBandExposed: false,
  lifecycle: "REVIEW_ONLY_NOT_FROZEN",
}, null, 2));
