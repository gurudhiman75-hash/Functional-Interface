import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../generation-engine";
import { normalizeGeneratedQuestionPayload } from "../../../../../../../lib/admin-question-conversion";
import { TRG_002_EXAMTREE_DIRECTIVE_PREFIX } from "./examtree-solution-directive";

async function main() {
  const pkg = listQuantV4Packages().find((entry: any) => entry.packageId === "TRG-002") as any;
  assert.ok(pkg, "TRG-002 must be discoverable in Question Studio");
  assert.equal(pkg.enabled, true);
  assert.equal(pkg.questionBankStatus, "WRITABLE");
  assert.equal(pkg.testEligibility, "ELIGIBLE");
  assert.equal(pkg.publiclyPublishable, true);
  assert.equal(pkg.cpIds.length, 48);

  const result: any = await generateQuestion({
    packageId: "TRG-002" as any,
    canonicalProblemId: "TRG-002-QL-015",
    language: "en",
    count: 1,
    seed: "trg002-question-studio-storage-regression",
  });

  assert.equal(result.questions.length, 1);
  const question = result.questions[0];
  assert.equal(question.packageId, "TRG-002");
  assert.equal(question.proceduralLogic.qlId, "TRG-002-QL-015");
  assert.equal(question.questionBankStatus, "WRITABLE");
  assert.equal(question.testEligibility, "ELIGIBLE");
  assert.equal(question.publiclyPublishable, true);
  assert.ok(question.explanation.includes(TRG_002_EXAMTREE_DIRECTIVE_PREFIX));
  assert.equal(question.solutionDiagram.family, "TRG-002");
  assert.equal(question.solutionDiagram.qlId, "TRG-002-QL-015");
  assert.deepEqual(question.solutionDiagram, question.proceduralLogic.solutionDiagram);
  assert.ok(question.solutionDiagram.diagram);
  assert.equal(question.solutionDiagram.diagram.segments.some((segment: any) =>
    String(segment.id).startsWith("depression-height-transfer-")), false);
  assert.equal(question.solutionDiagram.diagram.measurementArrows.length, 2);

  const normalized = normalizeGeneratedQuestionPayload(question, {
    itemId: "00000000-0000-0000-0000-000000000015",
    generationRunCode: "GEN-TRG002-STORAGE-TEST",
  });
  const answerModel: any = normalized.answerModel;
  assert.deepEqual(answerModel.generation.solutionDiagram, question.solutionDiagram);
  assert.equal(answerModel.generation.qlId, "TRG-002-QL-015");
  assert.equal(answerModel.generation.packageId, "TRG-002");
  assert.ok(normalized.explanation.includes(TRG_002_EXAMTREE_DIRECTIVE_PREFIX));

  console.log("TRG-002 Question Studio storage bridge: PASS");
}

void main();
