import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "../engine-types";
import {
  isEng001QuestionStudioRequestV1,
  languageV1Eng001QuestionStudioAdapterV1,
} from "./language-v1-eng001-adapter-v1";
import {
  isEng001Cp004QuestionStudioRequestV1,
  languageV1Eng001Cp004QuestionStudioAdapterV1,
} from "./language-v1-eng001-cp004-adapter-v1";
import {
  isEng001Cp005QuestionStudioRequestV1,
  languageV1Eng001Cp005QuestionStudioAdapterV1,
} from "./language-v1-eng001-cp005-adapter-v1";
import {
  isEng001Cp006QuestionStudioRequestV1,
  languageV1Eng001Cp006QuestionStudioAdapterV1,
} from "./language-v1-eng001-cp006-adapter-v1";
import {
  isEng001Cp007QuestionStudioRequestV1,
  languageV1Eng001Cp007QuestionStudioAdapterV1,
} from "./language-v1-eng001-cp007-adapter-v1";
import {
  isEng001Cp008QuestionStudioRequestV1,
  languageV1Eng001Cp008QuestionStudioAdapterV1,
} from "./language-v1-eng001-cp008-adapter-v1";

/**
 * Composite adapter for language subjects. Individual chapter adapters own
 * their grammar authority, review lifecycle, selectors, and generation rules.
 */
export const languageV1QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "language-v1",

  listPackages() {
    return [...languageV1Eng001Cp008QuestionStudioAdapterV1.listPackages()];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (isEng001Cp008QuestionStudioRequestV1(request)) {
      return languageV1Eng001Cp008QuestionStudioAdapterV1.generate(request);
    }
    if (isEng001Cp007QuestionStudioRequestV1(request)) {
      return languageV1Eng001Cp007QuestionStudioAdapterV1.generate(request);
    }
    if (isEng001Cp006QuestionStudioRequestV1(request)) {
      return languageV1Eng001Cp006QuestionStudioAdapterV1.generate(request);
    }
    if (isEng001Cp005QuestionStudioRequestV1(request)) {
      return languageV1Eng001Cp005QuestionStudioAdapterV1.generate(request);
    }
    if (isEng001Cp004QuestionStudioRequestV1(request)) {
      return languageV1Eng001Cp004QuestionStudioAdapterV1.generate(request);
    }
    if (isEng001QuestionStudioRequestV1(request)) {
      return languageV1Eng001QuestionStudioAdapterV1.generate(request);
    }
    throw new Error(`language-v1 cannot resolve package ${String(request.packageId ?? request.topic ?? "unknown")}`);
  },
};
