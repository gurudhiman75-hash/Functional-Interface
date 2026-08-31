import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "../engine-types";
import { knowledgeV1Com001QuestionStudioAdapter } from "./knowledge-v1-com001-adapter";
import { knowledgeV1Com002QuestionStudioAdapterV3 } from "./knowledge-v1-com002-adapter-v3";

/**
 * Subject-family composite for knowledge-v1. Individual chapter adapters own
 * their content/freeze/lifecycle rules; this adapter only exposes them through
 * one engine ID so package routing can scale beyond the COM-001 pilot.
 */
export const knowledgeV1QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [
      ...knowledgeV1Com001QuestionStudioAdapter.listPackages(),
      ...knowledgeV1Com002QuestionStudioAdapterV3.listPackages(),
    ];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (request.packageId === "COM-002") {
      return knowledgeV1Com002QuestionStudioAdapterV3.generate(request);
    }

    // Preserve the pre-COM-002 knowledge-v1 default: requests that explicitly
    // target COM-001 or omit packageId continue through the established COM-001
    // adapter. Unknown package IDs fail closed in that adapter.
    return knowledgeV1Com001QuestionStudioAdapter.generate(request);
  },
};
