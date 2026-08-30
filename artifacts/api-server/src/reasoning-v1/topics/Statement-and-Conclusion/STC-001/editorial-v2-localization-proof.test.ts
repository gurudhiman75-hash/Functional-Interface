import assert from "node:assert/strict";
import { STC_V2_EDITORIAL_AUTHORITIES } from "./editorial-v2-authorities.ts";
import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { STC_V2_LOCALIZATION_ENTRIES } from "./editorial-v2-localization.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const authorityIds = STC_V2_EDITORIAL_AUTHORITIES.map((entry) => entry.id);
const localizationIds = STC_V2_LOCALIZATION_ENTRIES.map((entry) => entry.id);

assert.equal(STC_V2_EDITORIAL_AUTHORITIES.length, 48);
assert.equal(STC_V2_LOCALIZATION_ENTRIES.length, 48);
assert.equal(new Set(authorityIds).size, 48, "English V2 authority IDs must be unique");
assert.equal(new Set(localizationIds).size, 48, "V2 localization IDs must be unique");
assert.deepEqual([...localizationIds].sort(), [...authorityIds].sort(), "localization overlay must cover exactly the 48 English authorities");

let generatedSurfaceCount = 0;
for (const qlId of STC_QL_IDS) {
  const englishSurfaceSet = new Set<string>();
  for (let seed = 0; seed < 8; seed += 1) {
    const en = generateStcV2EditorialQuestion({ qlId, locale: "en-IN", seed });
    englishSurfaceSet.add(en.surfaceArchetype);

    for (const locale of LOCALES) {
      const localized = generateStcV2EditorialQuestion({ qlId, locale, seed });
      generatedSurfaceCount += 1;
      assert.equal(localized.locale, locale, `${qlId}/${seed}/${locale}: locale drift`);
      assert.equal(localized.scenarioId, en.scenarioId, `${qlId}/${seed}/${locale}: scenario drift`);
      assert.equal(localized.answerClass, en.answerClass, `${qlId}/${seed}/${locale}: answer-class drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${qlId}/${seed}/${locale}: correct-index drift`);
      assert.equal(localized.difficulty, en.difficulty, `${qlId}/${seed}/${locale}: difficulty drift`);
      assert.equal(localized.checkpointId, en.checkpointId, `${qlId}/${seed}/${locale}: checkpoint drift`);
      assert.equal(localized.surfaceArchetype, en.surfaceArchetype, `${qlId}/${seed}/${locale}: surface-archetype drift`);
      assert.equal(localized.metadata.localizedByScenarioId, true);
      assert.equal(localized.metadata.repeatedInstructionEmbeddedInStem, false);
      assert.equal(localized.metadata.reviewOnly, true);
      assert.equal(localized.metadata.questionBankWritable, false);
      assert.equal(localized.metadata.testEligible, false);
      assert.equal(localized.metadata.mockEligible, false);
      assert.equal(localized.metadata.publicEligible, false);
      assert.equal(localized.metadata.automaticPublication, false);
      assert.ok(localized.stem.trim().length > 20, `${qlId}/${seed}/${locale}: stem too short`);
      assert.ok(localized.conclusions[0].trim().length > 8 && localized.conclusions[1].trim().length > 8, `${qlId}/${seed}/${locale}: conclusion missing`);
      assert.ok(localized.explanation.includes(locale === "en-IN" ? "I " : locale === "hi-IN" ? "निष्कर्ष I" : "ਨਤੀਜਾ I"));
      assert.ok(!localized.stem.includes("STC-V2"), `${qlId}/${seed}/${locale}: internal ID leaked`);
      assert.ok(!localized.conclusions.join(" ").includes("STC-V2"), `${qlId}/${seed}/${locale}: internal ID leaked`);

      if (locale !== "en-IN") {
        assert.notEqual(localized.stem, en.stem, `${qlId}/${seed}/${locale}: untranslated stem`);
        assert.notDeepEqual(localized.conclusions, en.conclusions, `${qlId}/${seed}/${locale}: untranslated conclusions`);
        assert.notDeepEqual(localized.options, en.options, `${qlId}/${seed}/${locale}: untranslated options`);
      }
    }
  }
  assert.equal(englishSurfaceSet.size, 8, `${qlId}: eight distinct V2 surfaces must remain after localization`);
}

assert.equal(generatedSurfaceCount, 144, "48 V2 authorities × 3 locales must produce 144 review surfaces");
console.log("PASS_STC_001_V2_TRILINGUAL_LOCALIZATION_PARITY");
