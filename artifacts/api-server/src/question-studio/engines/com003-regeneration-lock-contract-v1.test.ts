import { strict as assert } from "node:assert";

import { buildRegenerationRequest } from "../../lib/question-studio-regeneration";
import { knowledgeV1Com003QuestionStudioAdapterV1 } from "./knowledge-v1-com003-adapter-v1";

const generated = await knowledgeV1Com003QuestionStudioAdapterV1.generate({
  packageId: "COM-003",
  language: "en",
  count: 1,
  seed: "com003-regeneration-lock-contract-v1",
  runtimeMode: "review-only",
});
const question = generated.questions[0]!;

assert.throws(
  () => buildRegenerationRequest({
    itemId: "00000000-0000-4000-8000-000000000001",
    status: "needs_fix",
    acceptedQuestionId: null,
    currentVersionNumber: 1,
    runCode: "GEN-COM003-LOCK",
    requestSnapshot: {
      engineId: "knowledge-v1",
      packageId: "COM-003",
      subject: "Computer Awareness",
      topic: "Computer Awareness",
      subtopic: "Office & Productivity Software",
      language: "en",
      runtimeMode: "review-only",
    },
    payload: {
      ...question,
      engineId: "knowledge-v1",
      generationContext: generated.generationContext,
    },
  }, "com003-regeneration-attempt"),
  /KNOWLEDGE_V1_REGENERATION_LOCKED: Computer Awareness is source-generator controlled/i,
);

console.log("[COM003-REGENERATION-LOCK-CONTRACT-V1]", {
  valid: true,
  engineId: "knowledge-v1",
  packageId: "COM-003",
  legacyRegeneration: false,
  correctionPath: "SOURCE_FIX_AND_NEW_REVIEW_BATCH",
});
