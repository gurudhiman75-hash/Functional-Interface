import assert from "node:assert/strict";
import { exactKey } from "../foundation/exact";
import {
  MEN_CP011_OPEN_CONTAINER_AUTHORITY,
  MEN_CP011_OPEN_CUBOID_DISPOSITION,
  auditMenCp011OpenContainerBatch,
  generateMenCp011OpenContainerQuestion,
  generateMenCp011OpenContainerReviewBatch,
  getMenCp011OpenContainerDefinition,
  getMenCp011OpenContainerPrototypeIds,
  proveMenCp011OpenCuboidOwnership,
} from "./open-containers-runtime";

const prototypeIds = getMenCp011OpenContainerPrototypeIds();
assert.deepEqual(prototypeIds, [
  "MEN-CP011-PROT-OPEN-CYLINDER-ONE-END-AREA",
  "MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA",
]);
assert.equal(
  prototypeIds.includes(
    MEN_CP011_OPEN_CUBOID_DISPOSITION.candidatePrototypeId as never,
  ),
  false,
  "The reassigned open-cuboid family must not be duplicated in the MEN-CP-011 runtime registry.",
);

let generatedCount = 0;
for (const prototypeId of prototypeIds) {
  const definition = getMenCp011OpenContainerDefinition(prototypeId);
  for (let index = 0; index < 128; index += 1) {
    const question = generateMenCp011OpenContainerQuestion(
      prototypeId,
      `open-container-runtime-proof:${prototypeId}:${index}`,
    );
    assert.equal(question.openContainerAuthority, MEN_CP011_OPEN_CONTAINER_AUTHORITY);
    assert.equal(question.packageId, "MEN-002");
    assert.equal(question.canonicalProblemId, "MEN-CP-011");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeId, prototypeId);
    assert.equal(question.solveMode, definition.solveMode);
    assert.equal(question.target, "SURFACE_AREA");
    assert.equal(question.state.openEndCount, definition.openEndCount);
    assert.equal(question.validation.valid, true, question.validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join(" | "));
    assert.equal(question.verification.valid, true);
    assert.equal(question.options.length, 4);
    assert.equal(
      new Set(question.options.map((option) => exactKey(option.value))).size,
      4,
    );
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]!.isCorrect, true);
    assert.equal(question.answer, question.options[question.correctIndex]!.display);
    assert.equal(question.renderSurfaces.attempt.diagram, null);
    assert.equal(question.renderSurfaces.attempt.exposesInternalCodes, false);
    assert.equal(question.renderSurfaces.practice.exposesInternalCodes, false);
    assert.equal(question.renderSurfaces.solution.exposesInternalCodes, false);
    assert.equal(question.renderSurfaces.admin.exposesInternalCodes, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioDiscoverable, false);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.match(question.diagram.svg, /data-diagram-version="EXAMTREE_OPEN_CONTAINER_V1"/);
    assert.match(question.solutionDiagram.svg, /data-diagram-role="SOLUTION"/);
    assert.match(question.diagram.svg, /data-responsive="true"/);
    assert.match(
      question.diagram.svg,
      new RegExp(`data-open-ends="${definition.openEndCount}"`),
    );
    assert.match(question.diagram.svg, /data-surface="TOP_BASE" data-status="ABSENT"/);
    assert.match(question.diagram.svg, /data-surface="CURVED_WALL" data-status="EXPOSED"/);
    assert.doesNotMatch(question.diagram.svg, /<svg[^>]+\bwidth="\d+/);
    assert.match(question.diagram.svg, /not to scale/);
    assert.match(
      question.diagram.svg,
      new RegExp(`r = ${question.state.radius} ${question.state.linearUnit}`),
    );
    assert.match(
      question.diagram.svg,
      new RegExp(`h = ${question.state.height} ${question.state.linearUnit}`),
    );
    const exposed = question.state.surfaceLedger
      .filter((surface) => surface.status === "EXPOSED")
      .map((surface) => surface.surfaceId);
    if (definition.openEndCount === 1) {
      assert.deepEqual(exposed, ["CURVED_WALL", "BOTTOM_BASE"]);
      assert.match(question.diagram.svg, /data-surface="BOTTOM_BASE" data-status="EXPOSED"/);
      assert.match(question.learnerSolution.formula, /one circular base/);
    } else {
      assert.deepEqual(exposed, ["CURVED_WALL"]);
      assert.match(question.diagram.svg, /data-surface="BOTTOM_BASE" data-status="ABSENT"/);
      assert.match(question.learnerSolution.formula, /curved wall only/);
    }
    const learnerText = [
      question.stem,
      ...question.options.map((option) => option.display),
      question.learnerSolution.formula,
      ...question.learnerSolution.steps,
      question.learnerSolution.finalAnswer,
      question.learnerSolution.shortcut,
      ...question.learnerSolution.wrongOptionAnalysis,
    ].join("\n");
    assert.doesNotMatch(learnerText, /MEN-CP011-PROT|misconceptionId|FALLBACK_|UNCLASSIFIED/);
    assert.doesNotMatch(learnerText, /\[[A-Z0-9_]+\]/);
    assert.doesNotMatch(learnerText, /\\pih/);
    assert.equal((learnerText.match(/\$/g) ?? []).length % 2, 0);
    generatedCount += 1;
  }
}
assert.equal(generatedCount, 256);

const review = generateMenCp011OpenContainerReviewBatch();
assert.equal(review.records.length, 32);
assert.equal(review.audit.authority, MEN_CP011_OPEN_CONTAINER_AUTHORITY);
assert.equal(review.audit.prototypeCount, 2);
assert.equal(review.audit.exactStemCount, 32);
assert.equal(review.audit.exactQuestionOptionCount, 32);
assert.equal(review.audit.uniquePhysicalStateCount, 32);
assert.ok(review.audit.normalizedStemGroupCount >= 8);
assert.ok(review.audit.maximumNormalizedStemRepetition <= 4);
assert.deepEqual(review.audit.answerPositionCounts, { A: 8, B: 8, C: 8, D: 8 });
assert.deepEqual(review.audit.profileCounts, {
  "cm|EXACT_PI": 8,
  "cm|PI_22_OVER_7": 8,
  "m|EXACT_PI": 8,
  "m|PI_22_OVER_7": 8,
});
assert.ok(
  Object.values(review.audit.prototypeProfileCounts).every((count) => count === 4),
);
assert.equal(review.audit.publicationEligible, false);
assert.deepEqual(auditMenCp011OpenContainerBatch(review.records), review.audit);

for (let index = 0; index < 32; index += 1) {
  const boundary = proveMenCp011OpenCuboidOwnership(
    `men-cp011-open-cuboid-boundary:${index}`,
  );
  assert.equal(boundary.valid, true);
  assert.equal(boundary.ownerQuestion.canonicalProblemId, "MEN-CP-007");
  assert.equal(
    boundary.ownerQuestion.prototypeId,
    "MEN-CP007-PROT-OPEN-TOP-BOX-AREA",
  );
  assert.equal(boundary.ownerQuestion.solveMode, "findOpenTopCuboidSheetArea");
  assert.equal(boundary.ownerQuestion.target, "SURFACE_AREA");
  assert.equal(boundary.ownerQuestion.validation.valid, true);
  assert.equal(boundary.ownerQuestion.verification.valid, true);
}

console.log(
  "MEN-CP-011 open-container Wave 01 proof passed: 256 deterministic runtime packages, 32 balanced review records and 32 open-cuboid ownership-boundary checks.",
);
