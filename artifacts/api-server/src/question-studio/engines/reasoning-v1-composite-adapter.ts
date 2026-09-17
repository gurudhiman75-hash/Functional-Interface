import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "../engine-types";
import { reasoningV1QuestionStudioAdapter as ops001Adapter } from "./reasoning-v1-adapter";
import {
  cls001QuestionStudioAdapter,
  isCls001QuestionStudioRequest,
} from "./reasoning-v1-cls001-adapter";

export const reasoningV1CompositeQuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "reasoning-v1",

  listPackages() {
    return [
      ...ops001Adapter.listPackages(),
      ...cls001QuestionStudioAdapter.listPackages(),
    ];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (isCls001QuestionStudioRequest(request)) {
      return cls001QuestionStudioAdapter.generate(request);
    }
    return ops001Adapter.generate(request);
  },
};
