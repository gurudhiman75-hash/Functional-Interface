import { generateCp001ReviewRows } from "./runtime";
import { stableStringify } from "./runtime-support";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp001ReviewRows(3);
const prohibitedEnginePhrases = /\b(compatible units|continuous timeline|required answer|this option is obtained by)\b/i;
const narratives = new Set<string>();
let optionReasonsChecked = 0;
let correctReasonsChecked = 0;

assert(rows.length === 69, "Expected 69 learner review rows");

for (const row of rows) {
  const learnerNarrative = stableStringify({
    stem: row.stem,
    keyRule: row.explanation.keyRule,
    steps: row.explanation.stepByStepSolution,
    shortcut: row.explanation.examSpeedShortcut,
    options: row.explanation.optionAnalysis.map((option) => option.reason),
  });

  assert(!prohibitedEnginePhrases.test(learnerNarrative), `${row.solveMode}: residual engine prose leaked`);
  assert(row.explanation.stepByStepSolution.length >= 6, `${row.solveMode}: explanation is too short`);
  assert(row.explanation.optionAnalysis.length === 4, `${row.solveMode}: incomplete option analysis`);
  assert(row.explanation.optionAnalysis.every((option) => option.reason.includes(option.text)), `${row.solveMode}: option reason does not mention its displayed value`);
  assert(row.explanation.optionAnalysis.filter((option) => option.isCorrect).length === 1, `${row.solveMode}: correct option count failed`);
  assert(!narratives.has(learnerNarrative), `${row.solveMode}: complete learner narrative was reused`);
  narratives.add(learnerNarrative);

  for (const option of row.explanation.optionAnalysis) {
    if (option.isCorrect) {
      assert(/^✅ Correct:/.test(option.reason), `${row.solveMode}: correct option has no teacher confirmation`);
      correctReasonsChecked += 1;
    } else {
      assert(/^⚠️ /.test(option.reason), `${row.solveMode}: wrong option has no teacher diagnosis`);
      assert(!/obtained by/i.test(option.reason), `${row.solveMode}: generic fallback wording survived`);
      optionReasonsChecked += 1;
    }
  }
}

assert(narratives.size === rows.length, "Every learner row must have a unique complete explanation");
assert(correctReasonsChecked === 69, "Expected one correct-option explanation per row");
assert(optionReasonsChecked === 207, "Expected three wrong-option explanations per row");

console.log(JSON.stringify({
  status: "PASS",
  reviewRows: rows.length,
  uniqueCompleteNarratives: narratives.size,
  correctReasonsChecked,
  wrongReasonsChecked: optionReasonsChecked,
  prohibitedEnginePhraseLeaks: 0,
  conciseExplanations: 0,
  permanentQlCount: 0,
}, null, 2));
