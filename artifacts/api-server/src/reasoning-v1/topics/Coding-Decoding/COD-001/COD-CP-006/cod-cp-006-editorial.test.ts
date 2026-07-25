import assert from "node:assert/strict";
import { generateCodCp006Question } from "./generator";
import { COD_CP006_QUESTION_LOGICS } from "./question-language.en";
import { compositeStageResult } from "./transform";

let generated = 0;
let missingQuestions = 0;
let numericQuestions = 0;
let decodeQuestions = 0;
const uniqueStemCounts: Record<string, number> = {};
const uniqueRuleCounts: Record<string, number> = {};

for (const logic of COD_CP006_QUESTION_LOGICS) {
  const stems = new Set<string>();
  const rules = new Set<string>();
  for (let seed = 1; seed <= 20; seed += 1) {
    const question = generateCodCp006Question(logic.qlId, seed);
    const answer = question.options[question.correctIndex]!.value;
    const explanationText = [
      question.explanation.ruleStatement,
      ...question.explanation.sourceDemonstration,
      ...question.explanation.targetApplication,
      question.explanation.conclusion,
      question.explanation.closestTrapRejection ?? "",
    ].join(" ");
    const firstEvidence = question.structuredPrompt.evidence[0]!;
    const firstStages = compositeStageResult(question.ruleId, question.ruleContext, firstEvidence.source);
    const targetStages = compositeStageResult(question.ruleId, question.ruleContext, question.structuredPrompt.targetWord);

    assert.ok(question.stem.length >= 70 && question.stem.length <= 450, `${logic.qlId}/${seed} stem length ${question.stem.length}`);
    assert.equal(question.structuredPrompt.evidence.length <= 3, true, `${logic.qlId}/${seed} displays too many examples`);
    assert.equal(/two[- ](?:stage|step)|apply the same|given that/i.test(question.stem), false, `${logic.qlId}/${seed} uses robotic or mechanism-revealing wording`);
    const stemSentences = question.stem.match(/[^.!?]+[.!?]/g)?.map((sentence) => sentence.trim()) ?? [question.stem.trim()];
    assert.equal(new Set(stemSentences).size, stemSentences.length, `${logic.qlId}/${seed} repeats a sentence`);
    assert.equal(question.stem.includes("{{"), false);
    assert.equal(question.stem.includes("COD-CP"), false);
    assert.equal(question.stem.includes("COD_"), false);
    assert.equal(question.stem.includes(question.ruleId), false);
    assert.equal(explanationText.includes("{{"), false);
    assert.equal(/is shown as \?; therefore/i.test(explanationText), false);
    assert.equal(/therefore [‘']?\?[’']? must be/i.test(explanationText), false);
    assert.ok(explanationText.length < 1900, `${logic.qlId}/${seed} explanation length ${explanationText.length}`);

    assert.equal(question.explanation.ruleStatement.includes(firstEvidence.source), true);
    assert.equal(question.explanation.ruleStatement.includes(firstStages.stage1), true);
    assert.equal(question.explanation.ruleStatement.includes(firstEvidence.code), true);
    assert.equal(question.explanation.ruleStatement.includes("Stage 1"), true);
    assert.equal(question.explanation.ruleStatement.includes("Stage 2"), true);
    assert.equal(question.explanation.targetApplication.join(" ").includes(targetStages.stage1), true);
    assert.equal(question.explanation.conclusion.includes(answer), true);
    assert.ok(question.explanation.sourceDemonstration.length >= 1);

    const selectedTrap = question.options.find((option) => !option.isCorrect && option.errorLabel);
    assert.ok(selectedTrap);
    assert.ok(question.explanation.closestTrapRejection);
    assert.equal(question.explanation.closestTrapRejection!.includes(selectedTrap!.value), true);

    if (question.structuredPrompt.taskKind === "RECOVER_MISSING_TOKEN") {
      const application = question.explanation.targetApplication.join(" ");
      assert.equal(application.includes(`code position ${question.structuredPrompt.missingIndex! + 1}`), true);
      assert.equal(application.includes(`? = ${answer}`), true);
      assert.equal(application.includes(targetStages.finalCode), true);
      missingQuestions += 1;
    }
    if (question.ruleId === "TRANSFORM_THEN_RANK_SEQUENCE") {
      assert.equal(explanationText.includes("alphabet rank"), true);
      assert.equal(question.structuredPrompt.evidence.every((pair) => pair.code.includes("-")), true);
      numericQuestions += 1;
    }
    if (question.structuredPrompt.taskKind === "DECODE_TARGET") {
      const application = question.explanation.targetApplication.join(" ");
      assert.equal(application.includes(question.structuredPrompt.encodedTarget!), true);
      assert.equal(application.includes(targetStages.stage1), true);
      assert.equal(application.includes(answer), true);
      decodeQuestions += 1;
    }

    stems.add(question.stem);
    rules.add(question.explanation.ruleStatement);
    generated += 1;
  }
  uniqueStemCounts[logic.qlId] = stems.size;
  uniqueRuleCounts[logic.qlId] = rules.size;
  assert.ok(stems.size >= 17, `${logic.qlId} has only ${stems.size}/20 unique stems`);
  assert.ok(rules.size >= 17, `${logic.qlId} has only ${rules.size}/20 unique Rule explanations`);
}

const badRegressionStem = "Given that ‘ORANGE’ is coded as ‘GJRFXV’, ‘BANK’ is coded as ‘MQEG’, ‘FLOWER’ is coded as ‘THATRM’, and ‘TEAM’ is coded as ‘ODIY’, apply the same two-step rule to ‘STONE’.";
const repairedRegression = generateCodCp006Question("COD-QL-140", 1);
assert.notEqual(repairedRegression.stem, badRegressionStem);
assert.equal(repairedRegression.structuredPrompt.evidence.length, 3);
assert.equal(/two[- ](?:stage|step)|apply the same|given that/i.test(repairedRegression.stem), false);

assert.equal(generated, 640);
assert.ok(missingQuestions > 0);
assert.ok(numericQuestions > 0);
assert.ok(decodeQuestions > 0);

console.log(JSON.stringify({
  checkpoint: "COD-CP-006",
  generated,
  missingQuestions,
  numericQuestions,
  decodeQuestions,
  minimumUniqueStemsPerQl: Math.min(...Object.values(uniqueStemCounts)),
  minimumUniqueRulesPerQl: Math.min(...Object.values(uniqueRuleCounts)),
}, null, 2));
