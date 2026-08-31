import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1,
  freezeCubesDiceLocalizedQuestionV1,
} from "../foundation/spatial/cubes-dice-localization-freeze-v1";
import { generateCubesDicePermanentEnglishQuestionV1 } from "../foundation/spatial/cubes-dice-permanent-english-runtime-v1";
import type { CubesDiceCp004TaskKindV1 } from "../foundation/spatial/cubes-dice-cp004-distractors-allocation-v1";
import type { CubesDiceLocalizedLanguageV1 } from "../foundation/spatial/cubes-dice-localization-v1";

const TASKS: readonly CubesDiceCp004TaskKindV1[] = [
  "DICE_OPPOSITE_FROM_TWO_VIEWS",
  "CUBE_NET_OPPOSITE_FACE",
  "PAINTED_CUBE_EXACT_FACE_COUNT",
];
const LANGUAGES: readonly CubesDiceLocalizedLanguageV1[] = ["hi", "pa"];

assert.equal(CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.localizationFrozen, true);
assert.equal(CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.seededQuestionStudioIntegrationAuthorized, true);
assert.equal(CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.standardQuestionStudioRegistrationAuthorized, false);
assert.equal(CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.automaticPublicationAuthorized, false);

const variantCoverage = new Map<string, Set<string>>();
let localizedCount = 0;
for (const taskKind of TASKS) {
  for (let index = 0; index < 60; index += 1) {
    const seed = `CND-LOC-FREEZE-V1:${taskKind}:${index}`;
    const english = generateCubesDicePermanentEnglishQuestionV1({ seed, taskKind });
    for (const language of LANGUAGES) {
      const localized = freezeCubesDiceLocalizedQuestionV1({ seed, taskKind, language });
      assert.equal(localized.localization.frozen, true);
      assert.equal(localized.localization.reviewOnly, false);
      assert.equal(localized.localization.sourceEnglishSeed, english.seed);
      assert.equal(localized.localization.sourceEnglishStemVariantId, english.stemVariantId);
      assert.deepEqual(localized.scene, english.scene);
      assert.deepEqual(localized.solverEvidence, english.solverEvidence);
      assert.deepEqual(localized.stimulusSvgs, english.stimulusSvgs);
      assert.deepEqual(localized.renderer, english.renderer);
      assert.deepEqual(localized.options, english.options);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.answer, english.answer);
      assert.deepEqual(localized.distractorEvidence, english.distractorEvidence);
      assert.equal(localized.stemVariantId, english.stemVariantId);
      assert.equal(localized.lifecycle.questionStudioRegistered, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      if (language === "hi") assert.match(localized.stem, /\p{Script=Devanagari}/u);
      else assert.match(localized.stem, /\p{Script=Gurmukhi}/u);

      const key = `${localized.permanentQlId}:${language}`;
      const variants = variantCoverage.get(key) ?? new Set<string>();
      variants.add(localized.stemVariantId);
      variantCoverage.set(key, variants);
      localizedCount += 1;
    }
  }
}

assert.equal(localizedCount, 360);
for (const [key, variants] of variantCoverage) {
  assert.equal(variants.size, 6, `${key}: expected all six frozen stem variants.`);
}
assert.equal(variantCoverage.size, 6);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
const evidence = {
  result: "PASS",
  authority: CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  localizedSurfacesRevalidated: localizedCount,
  permanentQlCount: 3,
  languageCount: 2,
  localizedPerQlPerLanguage: 60,
  variantCoverage: Object.fromEntries([...variantCoverage.entries()].map(([key, values]) => [key, [...values].sort()])),
  governance: CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance,
};
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-localization-freeze-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence, null, 2));
