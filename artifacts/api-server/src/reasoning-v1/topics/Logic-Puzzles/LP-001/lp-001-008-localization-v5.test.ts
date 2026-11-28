import assert from "node:assert/strict";
import { LP_001_008_LOCALIZED_GENERATORS_V4 } from "./lp-001-008-localization-v4.ts";
import {
  LP_001_008_HI_PA_LOCALIZATION_REVIEW_V5,
  LP_001_008_LOCALIZED_GENERATORS_V5,
  LP_001_008_SCENARIO_CONTEXTS_V5,
} from "./lp-001-008-localization-v5.ts";
import type { Lp001008LocalizedLanguage } from "./lp-001-008-localization-v1.ts";

assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V5.status, "HUMAN_REVIEW_CANDIDATE_V5");
assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V5.supersedes, "LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4");

const ROTATED = new Set(Object.keys(LP_001_008_SCENARIO_CONTEXTS_V5));
const NATIVE_SCRIPT: Record<Lp001008LocalizedLanguage, RegExp> = { hi: /^[ऀ-ॿ\s,.'।-]+$/u, pa: /^[਀-੿।\s,.'-]+$/u };

for (const language of ["hi", "pa"] as const satisfies readonly Lp001008LocalizedLanguage[]) {
  for (const [packageId, contexts] of Object.entries(LP_001_008_SCENARIO_CONTEXTS_V5)) {
    for (const [profileId, text] of Object.entries(contexts)) {
      const line = text[language];
      assert.ok(line && line.endsWith("।"), `${packageId}/${profileId}/${language}: context must be a full native sentence`);
      assert.ok(NATIVE_SCRIPT[language].test(line), `${packageId}/${profileId}/${language}: context contains non-native script`);
    }
  }

  for (const [packageId, v5] of Object.entries(LP_001_008_LOCALIZED_GENERATORS_V5)) {
    const v4 = LP_001_008_LOCALIZED_GENERATORS_V4[packageId]!;
    const profilesSeen = new Set<string>();
    for (let round = 0; round < 2; round += 1) {
      const seed = `localization-v5-proof:${packageId}:${language}:${round}`;
      const before = v4(language, seed, 8);
      const after = v5(language, seed, 8);
      assert.equal(after.length, before.length, `${packageId}/${language}: batch size changed`);
      after.forEach((caselet, index) => {
        const base = before[index]!;
        profilesSeen.add(caselet.scenarioProfileId);
        // Only the scenario line may change, and only by a prefixed context sentence.
        assert.deepEqual({ ...caselet, scenario: base.scenario }, base, `${packageId}/${language}: non-scenario content changed`);
        if (ROTATED.has(packageId)) {
          const context = (LP_001_008_SCENARIO_CONTEXTS_V5 as any)[packageId][caselet.scenarioProfileId][language];
          assert.equal(caselet.scenario, `${context} ${base.scenario}`, `${packageId}/${language}: structural sentence altered`);
        } else {
          assert.equal(caselet.scenario, base.scenario, `${packageId}/${language}: non-rotated package changed`);
        }
        for (const child of caselet.children) {
          assert.equal(child.options[child.correctIndex], child.answer, `${packageId}/${language}/${child.qlId}: answer/option drift`);
        }
      });
    }
    if (ROTATED.has(packageId)) {
      const expected = Object.keys((LP_001_008_SCENARIO_CONTEXTS_V5 as any)[packageId]).length;
      assert.ok(profilesSeen.size >= Math.min(3, expected), `${packageId}/${language}: only ${profilesSeen.size} scenario contexts rotated in 16 caselets`);
    }
  }
}

console.log("LP-001..008 localization V5 guard passed: HI/PA scenario contexts rotate per English profile for LP-002/003/004/006, structural sentences, clues, stems, options and answers are byte-identical to V4.");
