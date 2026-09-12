import assert from "node:assert/strict";
import { generateLp006BatchStabilizedV4_2 } from "./lp-001-008-stabilized-english-v4-2.ts";
import {
  LP_006_PROJECTION_EXTENSION_V1,
  generateLp006ProjectionBatchV1,
} from "./lp-006-projection-extension-v1.ts";

const seed = "lp-006-projection-extension-v1-proof";
const count = 72;
const base = generateLp006BatchStabilizedV4_2(seed, count);
const extended = generateLp006ProjectionBatchV1(seed, count);

assert.equal(LP_006_PROJECTION_EXTENSION_V1.status, "PROVISIONAL_REVIEW_CANDIDATE");
assert.deepEqual(LP_006_PROJECTION_EXTENSION_V1.provisionalQlIds, ["LP-QL-041", "LP-QL-042"]);
assert.equal(LP_006_PROJECTION_EXTENSION_V1.permanentQlAllocationStatus, "UNALLOCATED");
assert.equal(LP_006_PROJECTION_EXTENSION_V1.changesHiddenState, false);
assert.equal(extended.length, base.length);

const answerPositions = new Map<string, number[]>([
  ["LP-QL-041", [0, 0, 0, 0]],
  ["LP-QL-042", [0, 0, 0, 0]],
]);
const projectionPairs = new Set<string>();
const statementPolarities = new Set<string>();
const difficulties = new Set<string>();

for (let index = 0; index < count; index += 1) {
  const source = base[index]!;
  const candidate = extended[index]!;
  const { projectionChildren, ...candidateBase } = candidate;
  assert.deepEqual(candidateBase, source, `${candidate.caseletId} changed the approved LP-006 base caselet`);
  assert.equal(projectionChildren.length, 2);
  difficulties.add(candidate.difficultyBand);

  const [projection, statement] = projectionChildren;
  assert.equal(projection!.qlId, "LP-QL-041");
  assert.equal(statement!.qlId, "LP-QL-042");

  for (const child of projectionChildren) {
    assert.equal(child.options.length, 4, `${child.questionId} option count`);
    assert.equal(new Set(child.options).size, 4, `${child.questionId} duplicate option`);
    assert.equal(child.answer, child.options[child.correctIndex], `${child.questionId} answer/index mismatch`);
    assert.equal(child.difficultyBand, candidate.difficultyBand, `${child.questionId} difficulty drift`);
    assert.match(child.stem, /Four persons/u, `${child.questionId} missing complete setup`);
    assert.match(child.stem, /Each day, study area and city is used exactly once/u, `${child.questionId} missing one-to-one rule`);
    assert.match(child.stem, /Clues:\n/u, `${child.questionId} missing clue block`);
    assert.ok(child.explanation.lines.some((line) => line.includes("|")), `${child.questionId} missing table-led explanation`);
    answerPositions.get(child.qlId)![child.correctIndex] += 1;
  }

  assert.ok("sourceDimension" in projection!.proof);
  if ("sourceDimension" in projection!.proof) {
    assert.notEqual(projection.proof.sourceDimension, "PERSON");
    assert.equal(projection.answer, projection.proof.targetValue);
    projectionPairs.add(`${projection.proof.sourceDimension}->${projection.proof.targetDimension}`);
  }

  assert.ok("polarity" in statement!.proof);
  if ("polarity" in statement!.proof) {
    statementPolarities.add(statement.proof.polarity);
    const semanticMatches = statement.proof.truthByOption.map((truth) => statement.proof.polarity === "CORRECT" ? truth : !truth);
    assert.equal(semanticMatches.filter(Boolean).length, 1, `${statement.questionId} must have exactly one semantic answer`);
    assert.equal(semanticMatches[statement.correctIndex], true, `${statement.questionId} correctIndex does not point to semantic answer`);
  }
}

assert.deepEqual(difficulties, new Set(["Easy", "Medium", "Hard"]));
assert.deepEqual(statementPolarities, new Set(["CORRECT", "INCORRECT"]));
assert.ok(projectionPairs.has("SUBJECT->CITY"), "source-backed subject/college -> city projection missing");
assert.ok(projectionPairs.has("SUBJECT->PERSON"), "source-backed subject/college -> person projection missing");
assert.ok(projectionPairs.has("CITY->SUBJECT"), "city -> subject projection missing");
assert.ok(projectionPairs.has("DAY->CITY"), "day -> city projection missing");
assert.ok(projectionPairs.size >= 7, `projection-pair variety too low: ${[...projectionPairs].join(", ")}`);

for (const [qlId, counts] of answerPositions) {
  assert.deepEqual(counts, [18, 18, 18, 18], `${qlId} answer positions are not balanced`);
}

console.log(`LP-006 projection extension V1 proof passed: ${count} frozen-state caselets, ${count * 2} provisional questions, ${projectionPairs.size} projection directions, balanced answer positions and statement truth parity.`);
