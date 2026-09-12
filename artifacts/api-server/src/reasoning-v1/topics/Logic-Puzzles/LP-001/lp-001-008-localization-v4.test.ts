import assert from "node:assert/strict";
import {
  LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4,
  LP_001_008_LOCALIZED_GENERATORS_V4,
} from "./lp-001-008-localization-v4.ts";
import type { Lp001008LocalizedLanguage } from "./lp-001-008-localization-v1.ts";

assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4.status, "HUMAN_REVIEW_CANDIDATE_V4");
assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4.localizationFreezeStatus, "NOT_FROZEN");
assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4.questionStudioActivation, "NOT_ENABLED_UNTIL_HUMAN_APPROVAL");

for (const language of ["hi", "pa"] as const satisfies readonly Lp001008LocalizedLanguage[]) {
  for (const [packageId, generator] of Object.entries(LP_001_008_LOCALIZED_GENERATORS_V4)) {
    const batch = generator(language, `localization-v4-proof:${packageId}:${language}`, 8);
    for (const caselet of batch) {
      for (const child of caselet.children) {
        assert.equal(child.options[child.correctIndex], child.answer, `${packageId}/${language}/${child.qlId}: answer/option drift`);
      }

      if (packageId === "LP-003") {
        const visible = [caselet.scenario, ...caselet.learnerFacingClues, ...caselet.children.flatMap((child) => [child.stem, ...child.explanation.lines])].join("\n");
        if (language === "hi") {
          assert.ok(!/[1-7]वें/u.test(visible), "LP-003/hi: numeric ordinal residue remains");
          const oblique = visible.match(/.{0,100}(?:फाइलें के बीच|उत्तर-पुस्तिकाएँ के बीच).{0,100}/u)?.[0];
          assert.ok(!oblique, `LP-003/hi: oblique-case grammar residue remains: ${oblique ?? "unknown"}`);
          assert.ok(!/ठीक 1 वस्तुएँ हैं/u.test(visible), "LP-003/hi: singular/plural mismatch remains");
        } else {
          assert.ok(!/[1-7]ਵੇਂ/u.test(visible), "LP-003/pa: numeric ordinal residue remains");
          assert.ok(!/ਠੀਕ 1 ਵਸਤੂਆਂ ਹਨ/u.test(visible), "LP-003/pa: singular/plural mismatch remains");
        }
      }

      if (packageId === "LP-004") {
        const visible = [caselet.scenario, ...caselet.learnerFacingClues, ...caselet.children.flatMap((child) => [child.stem, ...child.options, ...child.explanation.lines])].join("\n");
        if (language === "hi") {
          assert.ok(!/(?:चुना|चुनी) जाता|(?:चुना|चुनी) जाती|दोनों चुने जाते/u.test(visible), "LP-004/hi: gender-sensitive explanation wording remains");
        } else {
          assert.ok(!/(?:ਚੁਣਿਆ|ਚੁਣੀ) ਜਾਂਦਾ|(?:ਚੁਣਿਆ|ਚੁਣੀ) ਜਾਂਦੀ|ਦੋਵੇਂ ਚੁਣੇ ਜਾਂਦੇ/u.test(visible), "LP-004/pa: gender-sensitive explanation wording remains");
          assert.ok(!/\| ਨਹੀਂ ਚੁਣਿਆ \||\| ਚੁਣਿਆ \|/u.test(visible), "LP-004/pa: gender-sensitive table status remains");
          assert.ok(visible.includes("ਚੋਣ"), "LP-004/pa: expected gender-neutral selection noun missing");
        }
      }
    }
  }
}

console.log("LP-001..008 localization V4 editorial guard passed: LP-003 uses native ordinal/case/plural grammar and LP-004 uses gender-neutral selection wording consistently in clues, explanations and Punjabi tables without answer drift.");
