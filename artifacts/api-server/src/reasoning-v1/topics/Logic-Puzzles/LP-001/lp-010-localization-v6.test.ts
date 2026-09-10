import assert from "node:assert/strict";
import { solveLp010 } from "./lp-010.ts";
import {
  generateLp010LocalizedBatchV6,
  LP_010_HI_PA_LOCALIZATION_REVIEW_V6,
} from "./lp-010-localization-v6.ts";

for (const language of ["hi", "pa"] as const) {
  const caselets = generateLp010LocalizedBatchV6(language, "lp-010-localization-v6-proof", 100);
  assert.equal(caselets.length, 100);
  assert.deepEqual(new Set(caselets.map((caselet) => caselet.labels.times.length)), new Set([2, 4, 5, 6]));

  for (const caselet of caselets) {
    assert.equal(new Set(Object.values(caselet.labels.people)).size, 6);
    assert.deepEqual(solveLp010({ clues: caselet.clues }), [caselet.assignment]);
    assert.equal(caselet.labels.timePatternId, caselet.englishCaselet.labels.timePatternId);
    assert.ok((caselet.questionSetup.match(/;/gu) ?? []).length >= 5);

    for (const clue of caselet.clues) {
      if (clue.kind === "PERSON_TIME") {
        if (language === "hi") assert.match(clue.text, / का समय .* (?:AM|PM) है।$/u);
        else assert.match(clue.text, / ਦਾ ਸਮਾਂ .* (?:AM|PM) ਹੈ।$/u);
      }
      if (clue.kind === "BEFORE" || clue.kind === "IMMEDIATE_BEFORE") {
        if (language === "hi") assert.match(clue.text, /रखा गया है।$/u);
        else assert.match(clue.text, /ਰੱਖਿਆ ਗਿਆ ਹੈ।$/u);
      }
    }

    const joinedStems = caselet.children.map((child) => child.stem).join("\n");
    if (language === "hi") {
      assert.doesNotMatch(joinedStems, /इंटरव्यू का समय|प्रदर्शन का समय|इंटरव्यू के ठीक बाद|प्रदर्शन के ठीक बाद/u);
      if (caselet.scenarioProfileId === "INTERVIEW_SCHEDULE") assert.match(joinedStems, /इंटरव्यू/u);
      if (caselet.scenarioProfileId === "TRAINING_DEMOS") assert.match(joinedStems, /प्रदर्शन/u);
      if (caselet.scenarioProfileId === "COUNSELLING_APPOINTMENTS") assert.match(joinedStems, /काउंसलिंग/u);
      if (caselet.scenarioProfileId === "REVIEW_MEETINGS") assert.match(joinedStems, /समीक्षा बैठक/u);
      if (caselet.scenarioProfileId === "STUDENT_PRESENTATIONS" || caselet.scenarioProfileId === "RESEARCH_PRESENTATIONS") assert.match(joinedStems, /प्रस्तुति/u);
    } else {
      assert.doesNotMatch(joinedStems, /ਇੰਟਰਵਿਊ ਦਾ ਸਮਾਂ ਦਾ|ਪ੍ਰਦਰਸ਼ਨ ਦਾ ਸਮਾਂ ਦਾ/u);
      if (caselet.scenarioProfileId === "INTERVIEW_SCHEDULE") assert.match(joinedStems, /ਇੰਟਰਵਿਊ/u);
      if (caselet.scenarioProfileId === "TRAINING_DEMOS") assert.match(joinedStems, /ਪ੍ਰਦਰਸ਼ਨ/u);
      if (caselet.scenarioProfileId === "COUNSELLING_APPOINTMENTS") assert.match(joinedStems, /ਕਾਊਂਸਲਿੰਗ/u);
      if (caselet.scenarioProfileId === "REVIEW_MEETINGS") assert.match(joinedStems, /ਸਮੀਖਿਆ ਮੀਟਿੰਗ/u);
      if (caselet.scenarioProfileId === "STUDENT_PRESENTATIONS" || caselet.scenarioProfileId === "RESEARCH_PRESENTATIONS") assert.match(joinedStems, /ਪੇਸ਼ਕਾਰੀ/u);
    }

    for (let index = 0; index < caselet.children.length; index += 1) {
      const child = caselet.children[index]!;
      const englishChild = caselet.englishCaselet.children[index]!;
      assert.equal(child.qlId, englishChild.qlId);
      assert.equal(child.correctIndex, englishChild.correctIndex);
      assert.equal(child.difficultyBand, englishChild.difficultyBand);
      assert.equal(child.answer, child.options[child.correctIndex]);
      for (const clue of caselet.clues) assert.ok(child.stem.includes(clue.text));
      assert.equal(child.explanation.lines.length, caselet.clues.length + 1);
      assert.ok(child.explanation.lines.join("\n").includes(child.answer));
    }
  }
}

assert.equal(LP_010_HI_PA_LOCALIZATION_REVIEW_V6.supersedes, "LP_010_HI_PA_LOCALIZATION_REVIEW_V5");
assert.equal(LP_010_HI_PA_LOCALIZATION_REVIEW_V6.status, "HUMAN_REVIEW_CANDIDATE_V6");
console.log("LP-010 localization V6 passed: profile-specific native wording with safe Hindi/Punjabi case grammar and frozen semantic parity.");
