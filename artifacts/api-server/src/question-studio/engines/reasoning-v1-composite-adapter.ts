import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "../engine-types";
import { reasoningV1QuestionStudioAdapter as ops001Adapter } from "./reasoning-v1-adapter";
import { isCls001QuestionStudioRequest } from "./reasoning-v1-cls001-adapter";
import { cls001QuestionStudioAdapterV2 } from "./reasoning-v1-cls001-adapter-v2";

export const reasoningV1CompositeQuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "reasoning-v1",

  listPackages() {
    return [
      ...ops001Adapter.listPackages(),
      ...cls001QuestionStudioAdapterV2.listPackages(),
    ];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (isCls001QuestionStudioRequest(request)) {
      return cls001QuestionStudioAdapterV2.generate(request);
    }
    return ops001Adapter.generate(request);
  },
};
