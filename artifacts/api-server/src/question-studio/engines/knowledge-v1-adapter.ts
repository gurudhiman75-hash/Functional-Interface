import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "../engine-types";
import { knowledgeV1Com001QuestionStudioAdapter } from "./knowledge-v1-com001-adapter";
import { knowledgeV1Com002QuestionStudioAdapterV3 } from "./knowledge-v1-com002-adapter-v3";
import {
  isCom003QuestionStudioRequestV2,
  knowledgeV1Com003QuestionStudioAdapterV2,
} from "./knowledge-v1-com003-adapter-v2";

/**
 * Subject-family composite for knowledge-v1. Individual chapter adapters own
 * their content/freeze/lifecycle rules; this adapter only exposes them through
 * one engine ID so package routing can scale across Computer Awareness.
 */
export const knowledgeV1QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    const packages = [
      ...knowledgeV1Com001QuestionStudioAdapter.listPackages(),
      ...knowledgeV1Com002QuestionStudioAdapterV3.listPackages(),
      ...knowledgeV1Com003QuestionStudioAdapterV2.listPackages(),
    ];
    const ids = packages.map((pkg) => pkg.packageId);
    if (new Set(ids).size !== ids.length) {
      throw new Error("knowledge-v1 Question Studio package IDs must be unique");
    }
    return packages;
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (isCom003QuestionStudioRequestV2(request)) {
      return knowledgeV1Com003QuestionStudioAdapterV2.generate(request);
    }
    if (request.packageId === "COM-002") {
      return knowledgeV1Com002QuestionStudioAdapterV3.generate(request);
    }

    // Preserve the established knowledge-v1 default: requests that explicitly
    // target COM-001 or omit packageId continue through COM-001. Unknown package
    // IDs still fail closed in the owning adapter.
    return knowledgeV1Com001QuestionStudioAdapter.generate(request);
  },
};
