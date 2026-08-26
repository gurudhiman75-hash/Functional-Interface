import assert from "node:assert/strict";

import {
  generateQuestion,
  isSea002Cp006QuestionStudioRequest,
  listQuestionStudioPackages,
} from "../../../../../question-studio/shared-generation-engine.ts";
import { isSea002Cp008QuestionStudioRequest } from "./question-studio-integration-v1.ts";

const packages = listQuestionStudioPackages();
const sea002 = packages.find((entry: any) => String(entry.packageId) === "SEA-002") as any;
assert.ok(sea002, "SEA-002 must be discoverable through the shared Question Studio package list");
assert.ok(sea002.cpIds.includes("SEA-CP-006"));
assert.ok(sea002.cpIds.includes("SEA-CP-008"));
assert.ok(sea002.canonicalProblems.some((entry: any) => entry.id === "SEA-CP-008" && entry.label === "Square Seating"));
for (const qlId of ["SEA-QL-029", "SEA-QL-030", "SEA-QL-031", "SEA-QL-032", "SEA-QL-033", "SEA-QL-034", "SEA-QL-035"]) {
  assert.ok(sea002.permanentQlIds.includes(qlId), `${qlId} must be exposed through shared SEA-002 capabilities`);
}
assert.equal(sea002.checkpointCapabilities["SEA-CP-008"].questionStudioActive, true);
assert.equal(sea002.checkpointCapabilities["SEA-CP-008"].productOwnerApprovalStatus, "APPROVED");
assert.equal(sea002.checkpointCapabilities["SEA-CP-008"].freezeStatus, "FROZEN");
assert.equal(sea002.checkpointCapabilities["SEA-CP-008"].questionBankStatus, "NOT_STORED");
assert.equal(sea002.checkpointCapabilities["SEA-CP-008"].questionBankWritable, false);
assert.equal(sea002.checkpointCapabilities["SEA-CP-008"].testEligible, false);
assert.equal(sea002.checkpointCapabilities["SEA-CP-008"].mockTestEligible, false);
assert.equal(sea002.checkpointCapabilities["SEA-CP-008"].publiclyPublishable, false);

const explicitCp008 = {
  packageId: "SEA-002",
  canonicalProblemId: "SEA-CP-008",
  language: "en",
  difficulty: "Hard",
  seed: "shared-route-cp008-explicit",
  count: 2,
} as const;
assert.equal(isSea002Cp008QuestionStudioRequest(explicitCp008), true);
assert.equal(isSea002Cp006QuestionStudioRequest(explicitCp008), true);
const cp008Result = await generateQuestion(explicitCp008);
assert.equal(cp008Result.questions.length, 2);
assert.equal(cp008Result.generationContext.checkpointId, "SEA-CP-008");
assert.equal(cp008Result.generationContext.runtimeMode, "QUESTION_STUDIO_ACTIVE_APPROVED_FROZEN");
assert.equal(cp008Result.generationContext.productOwnerApprovalStatus, "APPROVED");
assert.equal(cp008Result.generationContext.freezeStatus, "FROZEN");
assert.equal(cp008Result.generationContext.questionBankStatus, "NOT_STORED");
assert.equal(cp008Result.generationContext.questionBankWritable, false);
assert.equal(cp008Result.generationContext.testEligible, false);
assert.equal(cp008Result.generationContext.mockTestEligible, false);
assert.equal(cp008Result.generationContext.publiclyPublishable, false);
for (const question of cp008Result.questions as any[]) {
  assert.equal(question.canonicalProblemId, "SEA-CP-008");
  assert.equal(question.subtopic, "Square Seating");
  assert.equal(question.runtimeMode, "QUESTION_STUDIO_ACTIVE_APPROVED_FROZEN");
  assert.equal(question.reviewStatus, "APPROVED_FROZEN_V1");
  assert.equal(question.questionStudioDiscoverable, true);
  assert.equal(question.questionStudioRegistered, true);
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.productionStaging, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.ok(["SEA-QL-029", "SEA-QL-030", "SEA-QL-031", "SEA-QL-032", "SEA-QL-033", "SEA-QL-034", "SEA-QL-035"].includes(question.qlId));
}

for (const language of ["en", "hi", "pa"] as const) {
  const byQl = await generateQuestion({
    packageId: "SEA-002",
    questionLanguageId: "SEA-QL-029",
    language,
    difficulty: "Hard",
    seed: `shared-route-ql029-alt12:${language}`,
    count: 2,
  });
  assert.equal(byQl.generationContext.checkpointId, "SEA-CP-008");
  assert.equal(byQl.generationContext.questionBankWritable, false);
  assert.equal(byQl.questions.length, 2);
  assert.ok((byQl.questions as any[]).every((question) => question.qlId === "SEA-QL-029"));
  assert.ok((byQl.questions as any[]).every((question) => question.signatureId === "SEA-CP008-SIG-A"));
  assert.ok((byQl.questions as any[]).every((question) => [4, 5].includes(question.variantIndex)));
  assert.ok((byQl.questions as any[]).every((question) => !/60\s*(?:m|मीटर|ਮੀਟਰ)|5\s*(?:m|मीटर|ਮੀਟਰ)/u.test(question.setupText)));
}

const genericSea002 = {
  packageId: "SEA-002",
  language: "en",
  difficulty: "Easy",
  seed: "shared-route-generic-sea002",
  count: 1,
} as const;
assert.equal(isSea002Cp008QuestionStudioRequest(genericSea002), false);
assert.equal(isSea002Cp006QuestionStudioRequest(genericSea002), true);
const cp006Result = await generateQuestion(genericSea002);
assert.equal(cp006Result.generationContext.checkpointId, "SEA-CP-006");
assert.equal(cp006Result.generationContext.questionBankWritable, true);
assert.equal(cp006Result.generationContext.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal((cp006Result.questions[0] as any).canonicalProblemId, "SEA-CP-006");

console.log("PASS_SEA002_CP008_SHARED_QUESTION_STUDIO_ROUTE_V1");
console.log("shared SEA-002 checkpoints", sea002.cpIds.join(","));
console.log("CP008 shared questions", cp008Result.questions.length);
console.log("QL029 live languages", "en,hi,pa");
console.log("CP008 Bank writable", cp008Result.generationContext.questionBankWritable);
console.log("generic SEA-002 remains CP006", cp006Result.generationContext.checkpointId);
