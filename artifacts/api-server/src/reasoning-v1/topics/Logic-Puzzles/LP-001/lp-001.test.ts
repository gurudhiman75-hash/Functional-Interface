import assert from "node:assert/strict";
import { generateCaseletBatch, solveCaselet } from "./index.ts";
import { generateLogicPuzzleQuestionStudioBatch, listLogicPuzzleQuestionStudioPackages } from "./question-studio.ts";

const caselets = generateCaseletBatch("lp-001-proof", 24);
assert.equal(caselets.length, 24);
assert.ok(new Set(caselets.map((caselet) => caselet.scenarioProfileId)).size >= 6);
assert.deepEqual(new Set(caselets.map((caselet) => caselet.difficultyBand)), new Set(["Medium", "Hard"]));
const answerPositions = new Map<string, Set<number>>();
for (const caselet of caselets) {
  assert.equal(solveCaselet(caselet).length, 1, caselet.caseletId);
  for (let removed = 0; removed < caselet.clues.length; removed += 1) {
    const withoutOneClue = { people: caselet.people, clues: caselet.clues.filter((_, index) => index !== removed) };
    assert.ok(solveCaselet(withoutOneClue).length > 1, `${caselet.caseletId} has a redundant clue`);
  }
  assert.equal(caselet.children.length, 4);
  for (const child of caselet.children) {
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.correctIndex, child.options.indexOf(child.answer));
    assert.match(child.explanation.lines.join("\n"), /\| Unit \| Members \|/);
    assert.doesNotMatch(child.explanation.lines.join("\n"), /\.\./u);
    assert.doesNotMatch(child.explanation.lines.join("\n"), /Start with [A-Z][^:]* are/u);
    const positions = answerPositions.get(child.qlId) ?? new Set<number>();
    positions.add(child.correctIndex);
    answerPositions.set(child.qlId, positions);
  }
}
for (const [qlId, positions] of answerPositions) assert.deepEqual(new Set([...positions].sort()), new Set([0, 1, 2, 3]), `${qlId} answer positions are not balanced`);
const studio = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-001", count: 3, seed: "studio-proof" });
assert.equal(studio.questions.length, 12);
assert.equal(studio.generationContext.lifecycleStatus, "REVIEW_ONLY");
assert.equal(listLogicPuzzleQuestionStudioPackages()[0]?.questionBankWritable, false);
console.log("LP-001 proof passed: 24 unique caselets, 96 child questions, Question Studio review adapter green.");
