import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  CND_001_LOCALIZATION_AUTHORITY_V1,
  localizeCubesDicePermanentQuestionV1,
  type CubesDiceLocalizedLanguageV1,
} from "../foundation/spatial/cubes-dice-localization-v1";
import { generateCubesDicePermanentEnglishQuestionV1 } from "../foundation/spatial/cubes-dice-permanent-english-runtime-v1";
import type { CubesDiceCp004TaskKindV1 } from "../foundation/spatial/cubes-dice-cp004-distractors-allocation-v1";

const TASKS: readonly CubesDiceCp004TaskKindV1[] = [
  "DICE_OPPOSITE_FROM_TWO_VIEWS",
  "CUBE_NET_OPPOSITE_FACE",
  "PAINTED_CUBE_EXACT_FACE_COUNT",
];
const LANGUAGES: readonly CubesDiceLocalizedLanguageV1[] = ["hi", "pa"];
const EXPECTED_QL: Readonly<Record<CubesDiceCp004TaskKindV1, string>> = Object.freeze({
  DICE_OPPOSITE_FROM_TWO_VIEWS: "SPA-QL-043",
  CUBE_NET_OPPOSITE_FACE: "SPA-QL-044",
  PAINTED_CUBE_EXACT_FACE_COUNT: "SPA-QL-045",
});

assert.equal(CND_001_LOCALIZATION_AUTHORITY_V1.englishFreezeAuthorityId, "CND-001-ENGLISH-FREEZE-V1");
assert.deepEqual(CND_001_LOCALIZATION_AUTHORITY_V1.supportedLanguages, ["hi", "pa"]);
assert.equal(CND_001_LOCALIZATION_AUTHORITY_V1.governance.localizationFrozen, false);
assert.equal(CND_001_LOCALIZATION_AUTHORITY_V1.governance.questionStudioRegistrationAuthorized, false);
assert.equal(CND_001_LOCALIZATION_AUTHORITY_V1.governance.automaticPublicationAuthorized, false);

const variantCoverage = new Map<string, Set<string>>();
const qlLanguageCounts = new Map<string, number>();
const reviewRows: Record<string, unknown>[] = [];
let localizedCount = 0;

for (const taskKind of TASKS) {
  for (let index = 0; index < 60; index += 1) {
    const seed = `CND-LOC-V1:${taskKind}:${index}`;
    const english = generateCubesDicePermanentEnglishQuestionV1({ seed, taskKind });
    for (const language of LANGUAGES) {
      const localized = localizeCubesDicePermanentQuestionV1({ seed, taskKind, language });
      assert.equal(localized.permanentQlId, EXPECTED_QL[taskKind]);
      assert.equal(localized.language, language);
      assert.equal(localized.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.equal(localized.localization.frozen, false);
      assert.equal(localized.localization.reviewOnly, true);
      assert.equal(localized.localization.sourceEnglishSeed, english.seed);
      assert.equal(localized.localization.sourceEnglishStemVariantId, english.stemVariantId);
      assert.equal(localized.stemVariantId, english.stemVariantId);
      assert.deepEqual(localized.scene, english.scene);
      assert.deepEqual(localized.solverEvidence, english.solverEvidence);
      assert.deepEqual(localized.stimulusSvgs, english.stimulusSvgs);
      assert.deepEqual(localized.renderer, english.renderer);
      assert.deepEqual(localized.options, english.options);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.answer, english.answer);
      assert.deepEqual(localized.distractorEvidence, english.distractorEvidence);
      assert.equal(localized.difficulty, english.difficulty);
      assert.equal(localized.candidateId, english.candidateId);
      assert.equal(localized.chapterCode, english.chapterCode);
      assert.equal(localized.lifecycle.questionStudioRegistered, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      assert.notEqual(localized.stem, english.stem);
      assert.notEqual(localized.permanentQlTitle, english.permanentQlTitle);
      assert.ok(localized.explanation.whatIsGiven.length > 15);
      assert.ok(localized.explanation.howToReason.length > 15);
      assert.ok(localized.explanation.conclusion.length > 8);
      if (language === "hi") {
        assert.match(localized.stem, /[\u0900-\u097F]/, `${seed}: Hindi stem must contain Devanagari.`);
        assert.match(localized.explanation.howToReason, /[\u0900-\u097F]/);
      } else {
        assert.match(localized.stem, /[\u0A00-\u0A7F]/, `${seed}: Punjabi stem must contain Gurmukhi.`);
        assert.match(localized.explanation.howToReason, /[\u0A00-\u0A7F]/);
      }

      const coverageKey = `${localized.permanentQlId}:${language}`;
      const variants = variantCoverage.get(coverageKey) ?? new Set<string>();
      variants.add(localized.stemVariantId);
      variantCoverage.set(coverageKey, variants);
      qlLanguageCounts.set(coverageKey, (qlLanguageCounts.get(coverageKey) ?? 0) + 1);
      localizedCount += 1;

      if (reviewRows.length < 36) {
        reviewRows.push({
          seed,
          permanentQlId: localized.permanentQlId,
          taskKind,
          language,
          stemVariantId: localized.stemVariantId,
          stem: localized.stem,
          explanation: localized.explanation,
          answer: localized.answer,
          options: localized.options,
        });
      }
    }
  }
}

assert.equal(localizedCount, 360);
for (const taskKind of TASKS) {
  for (const language of LANGUAGES) {
    const key = `${EXPECTED_QL[taskKind]}:${language}`;
    assert.equal(qlLanguageCounts.get(key), 60, `${key}: expected 60 localized review items.`);
    assert.equal(variantCoverage.get(key)?.size, 6, `${key}: all six frozen stem variants must be localized.`);
  }
}

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
const evidence = {
  result: "PASS",
  authority: CND_001_LOCALIZATION_AUTHORITY_V1.authorityId,
  reviewedEnglishSeeds: 180,
  localizedSurfacesReviewed: localizedCount,
  localizedPerQlPerLanguage: 60,
  qlLanguageCounts: Object.fromEntries([...qlLanguageCounts.entries()].sort()),
  variantCoverage: Object.fromEntries([...variantCoverage.entries()].map(([key, values]) => [key, [...values].sort()])),
  reviewRows,
  governance: CND_001_LOCALIZATION_AUTHORITY_V1.governance,
  invariants: [
    "FROZEN_ENGLISH_IS_SOURCE",
    "THREE_PERMANENT_QLS_TIMES_TWO_LANGUAGES",
    "ALL_SIX_STEM_VARIANTS_LOCALIZED_PER_QL_PER_LANGUAGE",
    "SCENE_SOLVER_SVG_RENDERER_OPTIONS_ANSWER_DISTRACTORS_UNCHANGED",
    "NATIVE_DEVANAGARI_AND_GURMUKHI_SURFACES",
    "QUESTION_STUDIO_AND_PUBLICATION_REMAIN_LOCKED",
  ],
};
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-localization-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ result: evidence.result, localizedSurfacesReviewed: evidence.localizedSurfacesReviewed, localizedPerQlPerLanguage: evidence.localizedPerQlPerLanguage, variantCoverage: evidence.variantCoverage }, null, 2));
