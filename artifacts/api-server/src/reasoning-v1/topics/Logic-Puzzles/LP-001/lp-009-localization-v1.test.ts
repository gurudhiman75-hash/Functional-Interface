import assert from "node:assert/strict";
import { solveLp009 } from "./lp-009.ts";
import {
  generateLp009LocalizedBatch,
  LP_009_HI_PA_LOCALIZATION_REVIEW_V1,
  type Lp009LocalizedLanguage,
} from "./lp-009-localization-v1.ts";

const languages: readonly Lp009LocalizedLanguage[] = ["hi", "pa"];
const qls = ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"] as const;
const expectedProfiles = new Set([
  "BIRTH_MONTH_REGISTER",
  "INTERVIEW_MONTH_REGISTER",
  "COURSE_START_MONTHS",
  "REVIEW_MEETING_MONTHS",
  "BIRTH_YEAR_REGISTER",
  "SERVICE_BIRTH_YEARS",
  "ARCHIVE_BIRTH_YEARS",
  "CLUB_BIRTH_YEARS",
]);

assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V1.sourceEnglishAuthorityId, "LP_009_ENGLISH_FREEZE_V1");
assert.deepEqual(LP_009_HI_PA_LOCALIZATION_REVIEW_V1.permanentQlIds, qls);
assert.deepEqual(LP_009_HI_PA_LOCALIZATION_REVIEW_V1.supportedLanguages, languages);
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V1.runtimeMode, "REVIEW_ONLY");
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V1.questionBankWritable, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V1.testEligible, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V1.mockTestEligible, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V1.publiclyPublishable, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V1.automaticStudentPublication, false);

for (const language of languages) {
  const caselets = generateLp009LocalizedBatch(language, "lp-009-localization-freeze-audit", 100);
  assert.equal(caselets.length, 100);

  const profiles = new Set(caselets.map((caselet) => caselet.scenarioProfileId));
  assert.deepEqual(profiles, expectedProfiles);
  assert.ok(caselets.some((caselet) => caselet.mode === "MONTH"));
  assert.ok(caselets.some((caselet) => caselet.mode === "YEAR"));
  assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Easy", "Medium", "Hard"]));

  const qlCounts = Object.fromEntries(qls.map((ql) => [ql, 0])) as Record<(typeof qls)[number], number>;
  const slotCounts = Object.fromEntries(qls.map((ql) => [ql, [0, 0, 0, 0]])) as Record<(typeof qls)[number], number[]>;

  for (const caselet of caselets) {
    assert.equal(caselet.language, language);
    assert.deepEqual(caselet.assignment, caselet.englishCaselet.assignment);
    assert.equal(caselet.children.length, 4);
    assert.equal(caselet.clues.length, caselet.englishCaselet.clues.length);

    const solved = solveLp009({ clues: caselet.clues });
    assert.equal(solved.length, 1, `${language} ${caselet.caseletId} lost unique-solution parity`);
    assert.deepEqual(solved[0], caselet.assignment);

    const script = language === "hi" ? /[\u0900-\u097F]/ : /[\u0A00-\u0A7F]/;
    assert.match(caselet.questionSetup, script);
    assert.doesNotMatch(caselet.questionSetup, /\b(?:Clues|Step|Therefore|correct answer)\b/i);

    caselet.clues.forEach((clue, index) => {
      const english = caselet.englishCaselet.clues[index]!;
      assert.equal(clue.kind, english.kind);
      assert.match(clue.text, script);
      assert.notEqual(clue.text, english.text);
    });

    caselet.children.forEach((child, index) => {
      const english = caselet.englishCaselet.children[index]!;
      assert.equal(child.qlId, english.qlId);
      assert.equal(child.correctIndex, english.correctIndex);
      assert.equal(child.difficultyBand, english.difficultyBand);
      assert.equal(child.options.length, 4);
      assert.equal(new Set(child.options).size, 4);
      assert.equal(child.answer, child.options[child.correctIndex]);
      assert.match(child.stem, script);
      assert.doesNotMatch(child.stem, /\b(?:Clues|Step|Therefore|correct answer)\b/i);
      assert.equal(child.explanation.lines.length, english.explanation.lines.length, `${language} ${child.questionId} changed explanation-step count`);
      assert.match(child.explanation.summary, script);
      assert.ok(child.explanation.lines.every((line) => line.includes("|---|---|") && script.test(line)), `${language} ${child.questionId} explanation lost progressive table/native script`);
      assert.doesNotMatch(child.explanation.lines.join("\n"), /\bOption\s+[A-D]\b|विकल्प\s+[A-D]|ਚੋਣ\s+[A-D]/i);

      qlCounts[child.qlId] += 1;
      slotCounts[child.qlId][child.correctIndex]! += 1;
    });
  }

  for (const ql of qls) {
    assert.equal(qlCounts[ql], 100, `${language} ${ql} question count drifted`);
    assert.deepEqual(slotCounts[ql], [25, 25, 25, 25], `${language} ${ql} answer-slot balance drifted`);
  }
}

console.log("LP-009 Hindi/Punjabi localization V1 parity audit passed: 200 caselets / 800 localized questions.");
