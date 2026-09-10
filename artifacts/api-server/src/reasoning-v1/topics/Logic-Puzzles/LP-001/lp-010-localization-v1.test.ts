import assert from "node:assert/strict";
import type { DayTimeClue } from "./lp-010.ts";
import { solveLp010 } from "./lp-010.ts";
import {
  generateLp010LocalizedBatch,
  LP_010_HI_PA_LOCALIZATION_REVIEW_V1,
  type Lp010LocalizedLanguage,
} from "./lp-010-localization-v1.ts";

const languages: readonly Lp010LocalizedLanguage[] = ["hi", "pa"];
const expectedQls = new Set(["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"]);

function semanticClue(clue: DayTimeClue): Omit<DayTimeClue, "text"> {
  const { text: _text, ...semantic } = clue;
  return semantic as Omit<DayTimeClue, "text">;
}

for (const language of languages) {
  const caselets = generateLp010LocalizedBatch(language, "lp-010-localization-parity-v1", 100);
  assert.equal(caselets.length, 100);
  assert.deepEqual(new Set(caselets.map((caselet) => caselet.labels.times.length)), new Set([2, 4, 5, 6]));
  assert.equal(caselets.filter((caselet) => caselet.labels.times.length === 2).length, 25);
  assert.equal(caselets.filter((caselet) => caselet.labels.times.length === 4).length, 25);
  assert.equal(caselets.filter((caselet) => caselet.labels.times.length === 5).length, 25);
  assert.equal(caselets.filter((caselet) => caselet.labels.times.length === 6).length, 25);

  const answerPositions = new Map<string, number[]>();
  for (const caselet of caselets) {
    const english = caselet.englishCaselet;
    assert.deepEqual(caselet.assignment, english.assignment);
    assert.equal(caselet.difficultyBand, english.difficultyBand);
    assert.equal(caselet.scenarioProfileId, english.scenarioProfileId);
    assert.equal(caselet.labels.timePatternId, english.labels.timePatternId);
    assert.deepEqual(caselet.labels.times, english.labels.times);
    assert.deepEqual(caselet.labels.slotTimes, english.labels.slotTimes);
    assert.deepEqual(caselet.clues.map(semanticClue), english.clues.map(semanticClue));
    assert.deepEqual(solveLp010({ clues: caselet.clues }), [caselet.assignment]);

    if (language === "hi") {
      assert.match(caselet.questionSetup, /[\u0900-\u097F]/u);
      assert.doesNotMatch(caselet.questionSetup, /scheduled|chronological|Clues|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday/iu);
    } else {
      assert.match(caselet.questionSetup, /[\u0A00-\u0A7F]/u);
      assert.doesNotMatch(caselet.questionSetup, /scheduled|chronological|Clues|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday/iu);
    }

    assert.equal(caselet.children.length, english.children.length);
    for (let index = 0; index < caselet.children.length; index += 1) {
      const child = caselet.children[index]!;
      const englishChild = english.children[index]!;
      assert.equal(child.questionId, englishChild.questionId);
      assert.equal(child.qlId, englishChild.qlId);
      assert.ok(expectedQls.has(child.qlId));
      assert.equal(child.difficultyBand, englishChild.difficultyBand);
      assert.equal(child.correctIndex, englishChild.correctIndex);
      assert.equal(child.options.length, 4);
      assert.equal(new Set(child.options).size, 4);
      assert.equal(child.answer, child.options[child.correctIndex]);
      for (const clue of caselet.clues) assert.ok(child.stem.includes(clue.text), `${language} ${child.questionId} omitted a clue`);
      assert.equal(child.explanation.lines.length, caselet.clues.length + 1, `${language} ${child.questionId} explanation step count drifted`);
      const evidence = child.explanation.lines.join("\n\n");
      assert.ok(evidence.includes(child.answer));
      assert.equal((evidence.match(/\|---\|---\|/gu) ?? []).length, caselet.clues.length + 1);
      assert.doesNotMatch(evidence, /use all the clues|apply all the clues|as shown above|simply choose|obviously/iu);
      if (language === "hi") {
        assert.match(child.stem, /शर्तें:/u);
        assert.match(evidence, /चरण 1:/u);
        assert.match(evidence, /पूरा क्रम/u);
      } else {
        assert.match(child.stem, /ਸ਼ਰਤਾਂ:/u);
        assert.match(evidence, /ਕਦਮ 1:/u);
        assert.match(evidence, /ਪੂਰਾ ਕ੍ਰਮ/u);
      }
      const counts = answerPositions.get(child.qlId) ?? [0, 0, 0, 0];
      counts[child.correctIndex] += 1;
      answerPositions.set(child.qlId, counts);
    }
  }
  assert.deepEqual(new Set(answerPositions.keys()), expectedQls);
  for (const [qlId, counts] of answerPositions) assert.deepEqual(counts, [25, 25, 25, 25], `${language} ${qlId} answer-position balance drifted`);
}

assert.equal(LP_010_HI_PA_LOCALIZATION_REVIEW_V1.sourceEnglishAuthorityId, "LP_010_ENGLISH_FREEZE_V1");
assert.deepEqual(LP_010_HI_PA_LOCALIZATION_REVIEW_V1.permanentQlIds, ["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"]);
assert.deepEqual(LP_010_HI_PA_LOCALIZATION_REVIEW_V1.supportedLanguages, ["hi", "pa"]);
assert.equal(LP_010_HI_PA_LOCALIZATION_REVIEW_V1.localizationMethod, "SEMANTIC_REBUILD_FROM_FROZEN_SOLVED_CASELET");
assert.equal(LP_010_HI_PA_LOCALIZATION_REVIEW_V1.runtimeMode, "REVIEW_ONLY");

console.log("LP-010 Hindi/Punjabi localization V1 parity audit passed: 200 localized caselets / 800 questions with frozen semantic, time-layout, QL, difficulty, answer and explanation parity.");
