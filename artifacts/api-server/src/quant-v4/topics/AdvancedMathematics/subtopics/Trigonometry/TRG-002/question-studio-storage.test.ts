import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../generation-engine";
import { normalizeGeneratedQuestionPayload } from "../../../../../../lib/admin-question-conversion";
import { TRG_002_EXAMTREE_DIRECTIVE_PREFIX } from "./examtree-solution-directive";
import {
  TRG_002_V4_APPROVED_ARTIFACT,
  TRG_002_V4_APPROVED_SOURCE_HEAD,
  TRG_002_V4_HUMAN_APPROVAL,
} from "./exam-readiness-v4-approved-governance";

async function generate(qlId: string, language: string) {
  const result: any = await generateQuestion({
    packageId: "TRG-002" as any,
    questionLanguageId: qlId,
    language,
    count: 1,
    seed: `trg002-v4-storage-regression:${language}:${qlId}`,
  });
  assert.equal(result.questions.length, 1, `${qlId}:${language}: expected one generated question`);
  return result.questions[0] as any;
}

function assertActivatedQuestion(question: any, qlId: string, language: string) {
  assert.equal(question.packageId, "TRG-002");
  assert.equal(question.questionLanguageId, qlId);
  assert.equal(question.language, language);
  assert.equal(question.proceduralLogic.qlId, qlId);
  assert.equal(question.humanReviewStatus, "APPROVED");
  assert.equal(question.multilingualFreezeGranted, true);
  assert.equal(question.activationAuthorized, true);
  assert.equal(question.questionStudioDiscoverable, true);
  assert.equal(question.freezeStatus, "FROZEN");
  assert.equal(question.questionBankStatus, "WRITABLE");
  assert.equal(question.testEligibility, "ELIGIBLE");
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.publicReleaseAuthorized, false);
  assert.ok(question.explanation.includes(TRG_002_EXAMTREE_DIRECTIVE_PREFIX));
  assert.equal(question.solutionDiagram.kind, "TRG002_HEIGHTS_DISTANCES");
  assert.equal(question.solutionDiagram.version, 2);
  assert.equal(question.solutionDiagram.qlId, qlId);
  assert.equal(question.solutionDiagram.disclosure, "AFTER_ATTEMPT");
  assert.equal(question.solutionDiagram.approvedSourceHead, TRG_002_V4_APPROVED_SOURCE_HEAD);
  assert.equal(question.solutionDiagram.approvedArtifactId, TRG_002_V4_APPROVED_ARTIFACT.id);
  assert.deepEqual(question.answerModel.solutionDiagram, question.solutionDiagram);
  assert.ok(question.solutionDiagram.diagram);
  assert.equal(question.solutionDiagram.diagram.semanticDiagramAudit?.status, "PASS");
  assert.equal(question.solutionDiagram.diagram.pedagogicDiagramAudit?.status, "PASS");
  assert.equal(question.solutionDiagram.diagram.pedagogicDiagramAudit?.approvedRuntime, true);
  assert.ok(question.solutionDiagram.diagram.measurementArrows.length >= 2);
  const cues = question.solutionDiagram.diagram.pedagogicTeachingCues ?? [];
  assert.equal(cues.length, 3);
  assert.deepEqual(cues.map((cue: any) => cue.kind), ["GEOMETRY", "RULE", "CALCULATION"]);
}

async function main() {
  assert.equal(TRG_002_V4_HUMAN_APPROVAL.status, "APPROVED");
  assert.equal(TRG_002_V4_HUMAN_APPROVAL.approvedQlCount, 96);

  const pkg = listQuantV4Packages().find((entry: any) => entry.packageId === "TRG-002") as any;
  assert.ok(pkg, "TRG-002 must be discoverable in Question Studio");
  assert.equal(pkg.enabled, true);
  assert.equal(pkg.qlCount, 96);
  assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(pkg.multilingualFreezeGranted, true);
  assert.equal(pkg.activationAuthorized, true);
  assert.equal(pkg.questionStudioDiscoverable, true);
  assert.equal(pkg.questionBankStatus, "WRITABLE");
  assert.equal(pkg.testEligibility, "ELIGIBLE");
  assert.equal(pkg.publiclyPublishable, false);
  assert.equal(pkg.publicReleaseAuthorized, false);
  assert.equal(pkg.freezeStatus, "FROZEN");
  assert.equal(pkg.approvedBaselineHead, TRG_002_V4_APPROVED_SOURCE_HEAD);
  assert.equal(pkg.approvedArtifactId, TRG_002_V4_APPROVED_ARTIFACT.id);
  assert.equal(pkg.cpIds.length, 4);
  assert.deepEqual(pkg.cpIds, ["TRG-CP-007", "TRG-CP-008", "TRG-CP-009", "TRG-CP-010"]);

  const english = await generate("TRG-002-QL-015", "en");
  const hindi = await generate("TRG-002-QL-060", "hi");
  const punjabi = await generate("TRG-002-QL-096", "pa");
  assertActivatedQuestion(english, "TRG-002-QL-015", "en");
  assertActivatedQuestion(hindi, "TRG-002-QL-060", "hi");
  assertActivatedQuestion(punjabi, "TRG-002-QL-096", "pa");

  const q37 = await generate("TRG-002-QL-037", "en");
  assertActivatedQuestion(q37, "TRG-002-QL-037", "en");
  const overlay = q37.solutionDiagram.diagram.pedagogicAngleOverlays?.find((item: any) => item.id === "ql037-given-wall-angle");
  assert.ok(overlay, "QL037 approved runtime must store the given 30° wall-angle overlay");
  assert.equal(overlay.label, "30°");
  assert.equal(overlay.vertexPointId, "wall-contact");
  assert.ok(Math.abs(Number(overlay.actualDegrees) - 30) < 0.75);

  const normalized = normalizeGeneratedQuestionPayload(english, {
    itemId: "00000000-0000-0000-0000-000000000015",
    generationRunCode: "GEN-TRG002-V4-STORAGE-TEST",
  });
  const answerModel: any = normalized.answerModel;
  assert.deepEqual(answerModel.solutionDiagram, english.solutionDiagram);
  assert.equal(answerModel.generation.questionLanguageId, "TRG-002-QL-015");
  assert.equal(answerModel.generation.canonicalProblemId, "TRG-CP-007");
  assert.equal(answerModel.generation.packageId, "TRG-002");
  assert.ok(normalized.explanation.includes(TRG_002_EXAMTREE_DIRECTIVE_PREFIX));

  console.log("TRG-002 V4 Question Studio activation/storage bridge: PASS languages=en,hi,pa qls=96 public=OFF");
}

void main();
