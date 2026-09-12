import assert from "node:assert/strict";
import {
  LP_001_008_HI_PA_LOCALIZATION_REVIEW_V3,
  LP_001_008_LOCALIZED_GENERATORS_V3,
} from "./lp-001-008-localization-v3.ts";
import type { Lp001008LocalizedLanguage } from "./lp-001-008-localization-v1.ts";

assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V3.status, "HUMAN_REVIEW_CANDIDATE_V3");
assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V3.localizationFreezeStatus, "NOT_FROZEN");
assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V3.questionStudioActivation, "NOT_ENABLED_UNTIL_HUMAN_APPROVAL");

const bannedResidues = [
  "No unit can be identified",
  " and ",
  "North section", "South section", "East section", "West section", "Yard section",
  "1st", "2nd", "3rd", "4th", "5th", "6th", "7th",
  " is selected", " are selected", "Only ", "All three of ", "None of ",
];

for (const language of ["hi", "pa"] as const satisfies readonly Lp001008LocalizedLanguage[]) {
  for (const [packageId, generator] of Object.entries(LP_001_008_LOCALIZED_GENERATORS_V3)) {
    const batch = generator(language, `localization-v3-proof:${packageId}:${language}`, 6);
    for (const caselet of batch) {
      const visible = [
        caselet.scenario,
        ...caselet.learnerFacingClues,
        ...caselet.children.flatMap((child) => [
          child.stem, ...child.options, child.answer, child.explanation.summary, ...child.explanation.lines,
        ]),
      ].join("\n");
      for (const residue of bannedResidues) assert.ok(!visible.includes(residue), `${packageId}/${language}: learner text still contains ${residue}`);

      for (const child of caselet.children) {
        assert.equal(child.options[child.correctIndex], child.answer, `${packageId}/${language}/${child.qlId}: localized answer/option drift`);
      }

      if (packageId === "LP-004") {
        const clues = caselet.learnerFacingClues.join("\n");
        if (language === "hi") {
          assert.ok(clues.includes("चयन"), "LP-004/hi: selection clues must use gender-neutral चयन wording");
          assert.ok(!/(?:चुना|चुनी) जाता|(?:चुना|चुनी) जाती/u.test(clues), "LP-004/hi: gender-sensitive selection wording returned");
        } else {
          assert.ok(clues.includes("ਚੋਣ"), "LP-004/pa: selection clues must use gender-neutral ਚੋਣ wording");
          assert.ok(!/(?:ਚੁਣਿਆ|ਚੁਣੀ) ਜਾਂਦਾ|(?:ਚੁਣਿਆ|ਚੁਣੀ) ਜਾਂਦੀ/u.test(clues), "LP-004/pa: gender-sensitive selection wording returned");
        }
        for (const child of caselet.children.filter((item) => item.qlId === "LP-QL-015")) {
          for (const option of child.options) assert.ok(!/[A-Za-z]{2,}/u.test(option), `${packageId}/${language}: LP-QL-015 option still contains English prose: ${option}`);
        }
      }
    }
  }
}

console.log("LP-001..008 localization V3 polish guard passed: native pair separators, fallback text, ordinals, section labels and LP-004 selection wording/options are localized without answer drift.");
