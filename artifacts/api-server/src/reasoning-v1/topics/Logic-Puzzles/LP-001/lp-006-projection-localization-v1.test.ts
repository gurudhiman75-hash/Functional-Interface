import assert from "node:assert/strict";
import { generateLp006ProjectionBatchV2 } from "./lp-006-projection-extension-v2.ts";
import {
  generateLp006ProjectionLocalizedBatchV1,
  LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1,
} from "./lp-006-projection-localization-v1.ts";

assert.equal(LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1.status, "HUMAN_REVIEW_CANDIDATE_V1");
assert.deepEqual(LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1.permanentQlIds, ["LP-QL-045", "LP-QL-046"]);

const seed = "lp-006-projection-localization-parity";
const count = 16;
const english = generateLp006ProjectionBatchV2(seed, count);
const projectionDirections = new Set<string>();
const statementPolarities = new Set<string>();

for (const language of ["hi", "pa"] as const) {
  const localized = generateLp006ProjectionLocalizedBatchV1(language, seed, count);
  assert.equal(localized.length, english.length);

  for (let index = 0; index < count; index += 1) {
    const source = english[index]!;
    const candidate = localized[index]!;
    assert.equal(candidate.caseletId, source.caseletId);
    assert.equal(candidate.scenarioProfileId, source.scenarioProfileId);
    assert.equal(candidate.difficultyBand, source.difficultyBand);
    assert.deepEqual(candidate.localizedBaseCaselet.englishCaselet.assignment, source.assignment);
    assert.deepEqual(candidate.localizedBaseCaselet.englishCaselet.clues, source.clues);
    assert.equal(candidate.projectionChildren.length, 2);

    for (let childIndex = 0; childIndex < 2; childIndex += 1) {
      const before = source.projectionChildren[childIndex]!;
      const child = candidate.projectionChildren[childIndex]!;
      assert.equal(child.qlId, before.qlId);
      assert.equal(child.correctIndex, before.correctIndex);
      assert.equal(child.difficultyBand, before.difficultyBand);
      assert.deepEqual(child.proof, before.proof);
      assert.equal(new Set(child.options).size, 4, `${child.questionId}: localized duplicate options`);
      assert.equal(child.answer, child.options[child.correctIndex]);
      assert.ok(child.explanation.lines.some((line) => line.includes("|")), `${child.questionId}: localized table evidence missing`);
      assert.ok(child.explanation.lines.some((line) => line.includes(child.answer)), `${child.questionId}: localized answer not explained`);
      assert.doesNotMatch(child.stem, /Which of the following|The person assigned|The person scheduled|On which day|Who is assigned|Who is scheduled/u);
      for (const option of child.options) {
        assert.doesNotMatch(option, / is scheduled | is assigned |The person /u, `${child.questionId}: English statement grammar leaked`);
      }
    }

    const projection = source.projectionChildren.find((child) => child.qlId === "LP-QL-045")!;
    if ("sourceDimension" in projection.proof) projectionDirections.add(`${projection.proof.sourceDimension}->${projection.proof.targetDimension}`);

    const statement = candidate.projectionChildren.find((child) => child.qlId === "LP-QL-046")!;
    const sourceStatement = source.projectionChildren.find((child) => child.qlId === "LP-QL-046")!;
    assert.ok("polarity" in sourceStatement.proof && "polarity" in statement.proof);
    if ("polarity" in sourceStatement.proof) {
      statementPolarities.add(sourceStatement.proof.polarity);
      const semanticMatches = sourceStatement.proof.truthByOption.map((truth) => sourceStatement.proof.polarity === "CORRECT" ? truth : !truth);
      assert.deepEqual(semanticMatches.flatMap((match, optionIndex) => match ? [optionIndex] : []), [statement.correctIndex]);
    }
  }
}

assert.ok(projectionDirections.size >= 5, `Localized review batch projection variety too low: ${[...projectionDirections].join(", ")}`);
assert.deepEqual(statementPolarities, new Set(["CORRECT", "INCORRECT"]));

console.log(`LP-006 projection localization V1 parity passed: ${count} English caselets rebuilt in Hindi and Punjabi; ${projectionDirections.size} projection directions and both statement polarities covered.`);
