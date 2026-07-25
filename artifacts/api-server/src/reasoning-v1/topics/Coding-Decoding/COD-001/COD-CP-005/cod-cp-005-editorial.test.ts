import assert from "node:assert/strict";
import { generateCodCp005Question } from "./generator";
import { COD_CP005_QUESTION_LOGICS } from "./question-language.en";

let generated = 0;
let recoveryQuestions = 0;
let exactRuleQuestions = 0;
let trapSpecificQuestions = 0;

for (const logic of COD_CP005_QUESTION_LOGICS) {
  for (let seed = 1; seed <= 20; seed += 1) {
    const question = generateCodCp005Question(logic.qlId, seed);
    generated += 1;

    assert.ok(question.stem.length >= 35 && question.stem.length <= 520);
    assert.equal(/\bbranch(?:es)?\b/i.test(question.stem), false);
    assert.equal(/\bpermutation\b/i.test(question.stem), false);
    assert.equal(question.stem.includes("COD_"), false);
    assert.equal(question.stem.includes("{{"), false);
    assert.equal(question.stem.includes("undefined"), false);

    const firstEvidence = question.structuredPrompt.evidence[0]!;
    const rule = question.explanation.ruleStatement;
    assert.equal(rule.includes(`${firstEvidence.source} → ${firstEvidence.code}`), true);
    assert.equal(rule.includes("source-position"), true);
    assert.equal(rule.includes("Therefore"), true);
    assert.equal(/\bcommon rule\b/i.test(rule), false);
    exactRuleQuestions += 1;

    const explanationText = [
      rule,
      ...question.explanation.sourceDemonstration,
      ...question.explanation.targetApplication,
      question.explanation.conclusion,
      question.explanation.closestTrapRejection ?? "",
    ].join(" ");
    assert.ok(explanationText.trim().split(/\s+/).length <= 160, `${logic.qlId}/${seed} explanation is too long`);
    assert.equal(question.explanation.sourceDemonstration.length, 1);

    const trap = question.explanation.closestTrapRejection!;
    assert.ok(trap);
    assert.equal(question.options.filter((option) => !option.isCorrect).some((option) => trap.includes(option.value)), true);
    trapSpecificQuestions += 1;

    if (question.structuredPrompt.taskKind === "RECOVER_MISSING_LETTER") {
      const displayed = question.structuredPrompt.displayedTargetCode!;
      assert.equal((displayed.match(/\?/g) ?? []).length, 1);
      assert.equal(question.stem.includes(displayed), true);
      assert.equal(
        question.explanation.targetApplication.some((line) =>
          line.includes(`code position ${question.structuredPrompt.missingIndex! + 1}`)
          && line.includes("source position")
          && line.includes(`? = ${question.options[question.correctIndex]!.value}`),
        ),
        true,
      );
      assert.equal(question.explanation.targetApplication.some((line) => /is shown as/i.test(line)), false);
      recoveryQuestions += 1;
    }
  }
}

assert.equal(generated, 480);
assert.equal(recoveryQuestions, 80);
assert.equal(exactRuleQuestions, generated);
assert.equal(trapSpecificQuestions, generated);

console.log(JSON.stringify({
  checkpoint: "COD-CP-005",
  generated,
  recoveryQuestions,
  exactRuleQuestions,
  trapSpecificQuestions,
}, null, 2));
