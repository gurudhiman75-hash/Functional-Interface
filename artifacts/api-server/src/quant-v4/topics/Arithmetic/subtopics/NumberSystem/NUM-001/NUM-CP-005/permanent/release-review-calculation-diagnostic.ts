import { NUM_CP005_PERMANENT_ALLOCATION } from "./allocation";
import { runNumCp005PermanentPipeline } from "./runtime";

const calculationMarkerPattern = /(?:=|\\times|\\div|\\frac|\\lfloor|\bso\b|\bhence\b|\btherefore\b)/iu;
const violations = [];

for (const allocation of NUM_CP005_PERMANENT_ALLOCATION) {
  for (let seed = 1; seed <= 48; seed += 1) {
    const question = runNumCp005PermanentPipeline({
      questionLanguageId: allocation.qlId,
      seed,
    });
    if (!question.explanation.stepByStep.some((step) => calculationMarkerPattern.test(step))) {
      violations.push({
        qlId: allocation.qlId,
        seed,
        stem: question.stem,
        steps: question.explanation.stepByStep,
      });
    }
  }
}

if (violations.length > 0) {
  throw new Error(`NUM-CP-005 calculation-completeness diagnostics:\n${JSON.stringify(violations.slice(0, 30), null, 2)}`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_RELEASE_REVIEW_CALCULATION_DIAGNOSTIC",
  checkedQuestions: NUM_CP005_PERMANENT_ALLOCATION.length * 48,
  violations: 0,
}, null, 2));
