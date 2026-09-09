import assert from "node:assert/strict";
import { generateLp009Batch } from "./lp-009.ts";

const caselets = generateLp009Batch("lp-009-explanation-v2", 100);

for (const caselet of caselets) {
  for (const child of caselet.children) {
    const evidence = child.explanation.lines.join("\n\n");

    assert.match(evidence, /Step 1: Record the direct entries/u, `${child.questionId} must start from direct entries`);
    assert.match(evidence, /Step \d+: Complete the schedule/u, `${child.questionId} must show the completed schedule`);
    assert.ok(evidence.includes(child.answer), `${child.questionId} explanation must state the child answer`);

    // Every displayed entity must remain visible in the worked tables so the explanation can be followed row by row.
    for (const person of Object.values(caselet.labels.people)) {
      assert.ok(evidence.includes(person), `${child.questionId} explanation omits ${person}`);
    }

    // Medium/Hard questions must show clue-by-clue narrowing rather than jumping from setup to answer.
    if (caselet.difficultyBand !== "Easy") {
      const applySteps = evidence.match(/Step \d+: Apply the next clue/gu) ?? [];
      const nonDirectClues = caselet.clues.filter((clue) => clue.kind !== "PERSON_VALUE").length;
      assert.equal(applySteps.length, nonDirectClues, `${child.questionId} must explain every non-direct clue`);
      assert.match(evidence, /Remove |comes before|consecutive|between|second-oldest position/u, `${child.questionId} lacks clue-specific deduction language`);
    }

    // Generic answer-only explanations are forbidden by the approved V2 editorial contract.
    assert.doesNotMatch(evidence, /use all the clues|apply all the clues|the question asks|simply choose|obviously/iu);

    const tableHeaders = evidence.match(/\|---\|---\|/gu) ?? [];
    assert.ok(tableHeaders.length >= 2, `${child.questionId} must show progressive tables, not only a final table`);
  }
}

console.log("LP-009 explanation V2 passed: 400 questions retain clue-by-clue deductions, progressive tables and question-specific conclusions.");