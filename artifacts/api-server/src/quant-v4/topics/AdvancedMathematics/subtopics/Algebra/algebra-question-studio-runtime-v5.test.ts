import assert from "node:assert/strict";

import { getQuantV4OptionCount } from "../../../../common/exam-profile";
import {
  ALGEBRA_QUESTION_STUDIO_LANGUAGES,
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
} from "./algebra-question-studio-runtime-v1";
import {
  ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5,
  ALGEBRA_QUESTION_STUDIO_PACKAGE_V5,
  centralProfileForAlgebraV5,
  generateAlgebraStudioQuestionV5,
} from "./algebra-question-studio-runtime-v5";

assert.equal(ALGEBRA_QUESTION_STUDIO_PATTERNS.length, 109);
assert.equal(new Set(ALGEBRA_QUESTION_STUDIO_PATTERNS.map((pattern) => pattern.qlId)).size, 43);
assert.equal(ALGEBRA_QUESTION_STUDIO_PACKAGE_V5.deliveryAuthority, ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY);
assert.deepEqual(ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5, [
  "SSC_CORE",
  "SSC_ADVANCED",
  "BANKING_PRELIMS",
  "BANKING_MAINS",
  "PUNJAB_STATE",
]);

const answerPositionsByProfile = new Map<string, Set<number>>();
let generated = 0;
let bankingFiveOptionCases = 0;
let fourOptionCases = 0;
let multilingualParityChecks = 0;

for (const pattern of ALGEBRA_QUESTION_STUDIO_PATTERNS) {
  for (const examProfile of ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5) {
    const seed = `algebra-v5-central-profile:${pattern.prototypeId}:${examProfile}`;
    const byLanguage = new Map<string, ReturnType<typeof generateAlgebraStudioQuestionV5>>();

    for (const language of ALGEBRA_QUESTION_STUDIO_LANGUAGES) {
      const question = generateAlgebraStudioQuestionV5({ pattern, examProfile, language, seed });
      const replay = generateAlgebraStudioQuestionV5({ pattern, examProfile, language, seed });
      generated += 1;
      byLanguage.set(language, question);

      assert.deepEqual(question, replay, `${pattern.prototypeId}/${examProfile}/${language}: V5 replay drifted`);
      assert.equal(question.deliveryAuthority, ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY);
      assert.equal(question.validation.valid, true, `${pattern.prototypeId}/${examProfile}/${language}: invalid question`);
      assert.equal(question.validation.centralOptionCountConformant, true);
      assert.equal(question.validation.exactlyOneCorrect, true);
      assert.equal(question.validation.answerParity, true);
      assert.equal(question.validation.frozenSourcePreserved, true);
      assert.equal(question.validation.questionBankLocked, true, "Frozen source Question Bank lifecycle changed instead of using an outer activation envelope");
      assert.equal(question.validation.testMockLocked, true);
      assert.equal(question.validation.publicationLocked, true);
      assert.equal(question.options.length, getQuantV4OptionCount(question.centralExamProfile));
      assert.equal(new Set(question.options).size, question.optionCount);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1);
      assert.equal(question.optionDetails.length, question.optionCount);
      assert.equal(question.questionId.startsWith("ALG-QS5-"), true);
      assert.equal(question.centralExamProfile, centralProfileForAlgebraV5(examProfile));
      JSON.stringify(question);

      if (examProfile === "BANKING_PRELIMS" || examProfile === "BANKING_MAINS") {
        assert.equal(question.optionCount, 5);
        assert.equal(question.options.length, 5);
        assert.deepEqual(question.optionDetails.map((option) => option.label), ["A", "B", "C", "D", "E"]);
        bankingFiveOptionCases += 1;
      } else {
        assert.equal(question.optionCount, 4);
        assert.equal(question.options.length, 4);
        assert.deepEqual(question.optionDetails.map((option) => option.label), ["A", "B", "C", "D"]);
        fourOptionCases += 1;
      }

      const positions = answerPositionsByProfile.get(examProfile) ?? new Set<number>();
      positions.add(question.correctIndex);
      answerPositionsByProfile.set(examProfile, positions);
    }

    const english = byLanguage.get("en")!;
    for (const language of ["hi", "pa"] as const) {
      const localized = byLanguage.get(language)!;
      assert.equal(localized.sourceStateSeed, english.sourceStateSeed, `${pattern.prototypeId}/${examProfile}/${language}: source state drifted by language`);
      assert.deepEqual(localized.canonicalAnswer, english.canonicalAnswer, `${pattern.prototypeId}/${examProfile}/${language}: canonical answer drifted by language`);
      assert.equal(localized.optionCount, english.optionCount);
      multilingualParityChecks += 1;
    }
  }
}

for (const profile of ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5) {
  const positions = answerPositionsByProfile.get(profile) ?? new Set<number>();
  const required = profile === "BANKING_PRELIMS" || profile === "BANKING_MAINS" ? 5 : 4;
  assert.equal(positions.size, required, `${profile}: expected all ${required} answer positions, got ${[...positions].join(",")}`);
}

assert.equal(generated, 109 * 5 * 3);
assert.equal(bankingFiveOptionCases, 109 * 2 * 3);
assert.equal(fourOptionCases, 109 * 3 * 3);

console.log("PASS_ALGEBRA_QUESTION_STUDIO_V5_CENTRAL_OPTION_PROFILE", {
  deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY,
  permanentQlCount: 43,
  patternCount: 109,
  generated,
  bankingFiveOptionCases,
  fourOptionCases,
  multilingualParityChecks,
  answerPositionsByProfile: Object.fromEntries(
    [...answerPositionsByProfile.entries()].map(([profile, positions]) => [profile, [...positions].sort()]),
  ),
});
