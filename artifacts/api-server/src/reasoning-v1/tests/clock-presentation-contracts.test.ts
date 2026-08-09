import assert from "node:assert/strict";
import {
  CLOCK_TASK_CATALOG,
  generateClockQuestion,
} from "../topics/Clocks/CLK-001/runtime";

const malformedOrdinal = /\b(?:1th|2th|3th)\b/;
const unpaddedFractionalSecond = /:\d \d+\/\d+/;
const singularPluralMismatch = /\b1 (?:seconds|minutes|hours)\b/;

let generated = 0;
for (let taskIndex = 0; taskIndex < CLOCK_TASK_CATALOG.length; taskIndex += 1) {
  const [taskId] = CLOCK_TASK_CATALOG[taskIndex]!;
  for (let seedIndex = 0; seedIndex < 20; seedIndex += 1) {
    const question = generateClockQuestion({
      taskId,
      seed: `CLK-PRESENTATION-${taskIndex}-${seedIndex}`,
      locale: "en-IN",
      correctOptionIndex: (seedIndex % 4) as 0 | 1 | 2 | 3,
    });
    const visibleText = [
      question.stem,
      question.answer.display,
      ...question.options.map((option) => option.display),
      question.explanation.given,
      question.explanation.rule,
      ...question.explanation.working,
      question.explanation.validityCheck,
      question.explanation.closestTrap,
      question.explanation.answer,
    ].join("\n");

    assert.doesNotMatch(visibleText, malformedOrdinal);
    assert.doesNotMatch(visibleText, unpaddedFractionalSecond);
    assert.doesNotMatch(visibleText, singularPluralMismatch);
    assert.doesNotMatch(question.stem, /<svg|<script|foreignObject|javascript:/i);
    generated += 1;
  }
}

assert.equal(generated, CLOCK_TASK_CATALOG.length * 20);
console.log(JSON.stringify({
  status: "PASS_CLK_001_PRESENTATION_CONTRACTS",
  generated,
  malformedOrdinals: 0,
  unpaddedFractionalSeconds: 0,
  singularPluralMismatches: 0,
}, null, 2));
