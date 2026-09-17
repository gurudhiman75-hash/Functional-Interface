import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "../engine-types";
import { normalizeEng001AnswerPositionsV1 } from "./language-v1-eng001-answer-position-normalizer-v1";
import { isEng001QuestionStudioRequestV1, languageV1Eng001QuestionStudioAdapterV1 } from "./language-v1-eng001-adapter-v1";
import { isEng001Cp004QuestionStudioRequestV1, languageV1Eng001Cp004QuestionStudioAdapterV1 } from "./language-v1-eng001-cp004-adapter-v1";
import { isEng001Cp005QuestionStudioRequestV1, languageV1Eng001Cp005QuestionStudioAdapterV1 } from "./language-v1-eng001-cp005-adapter-v1";
import { isEng001Cp006QuestionStudioRequestV1, languageV1Eng001Cp006QuestionStudioAdapterV1 } from "./language-v1-eng001-cp006-adapter-v1";
import { isEng001Cp007QuestionStudioRequestV1, languageV1Eng001Cp007QuestionStudioAdapterV1 } from "./language-v1-eng001-cp007-adapter-v1";
import { isEng001Cp008QuestionStudioRequestV1, languageV1Eng001Cp008QuestionStudioAdapterV1 } from "./language-v1-eng001-cp008-adapter-v1";
import { isEng001Cp009QuestionStudioRequestV1, languageV1Eng001Cp009QuestionStudioAdapterV1 } from "./language-v1-eng001-cp009-adapter-v1";
import { isEng001Cp010QuestionStudioRequestV1, languageV1Eng001Cp010QuestionStudioAdapterV1 } from "./language-v1-eng001-cp010-adapter-v1";
import { isEng001Cp011QuestionStudioRequestV1, languageV1Eng001Cp011QuestionStudioAdapterV1 } from "./language-v1-eng001-cp011-adapter-v1";
import { isEng001Cp012QuestionStudioRequestV1, languageV1Eng001Cp012QuestionStudioAdapterV1 } from "./language-v1-eng001-cp012-adapter-v1";
import { isEng001Cp013QuestionStudioRequestV1, languageV1Eng001Cp013QuestionStudioAdapterV1 } from "./language-v1-eng001-cp013-adapter-v1";
import { isEng002Cp001QuestionStudioRequestV1, languageV1Eng002Cp001QuestionStudioAdapterV1 } from "./language-v1-eng002-cp001-adapter-v1";
import { isEng002Cp002QuestionStudioRequestV1, languageV1Eng002Cp002QuestionStudioAdapterV1 } from "./language-v1-eng002-cp002-adapter-v1";
import { isEng002Cp003QuestionStudioRequestV1, languageV1Eng002Cp003QuestionStudioAdapterV1 } from "./language-v1-eng002-cp003-adapter-v1";
import { isEng002Cp004QuestionStudioRequestV1, languageV1Eng002Cp004QuestionStudioAdapterV1 } from "./language-v1-eng002-cp004-adapter-v1";
import { isEng002Cp005QuestionStudioRequestV1, languageV1Eng002Cp005QuestionStudioAdapterV1 } from "./language-v1-eng002-cp005-adapter-v1";
import { isEng002Cp006QuestionStudioRequestV1, languageV1Eng002Cp006QuestionStudioAdapterV1 } from "./language-v1-eng002-cp006-adapter-v1";
import { isEng002Cp007QuestionStudioRequestV1, isEng002Cp008QuestionStudioRequestV1, languageV1Eng002Cp007Cp008QuestionStudioAdapterV1 } from "./language-v1-eng002-cp007-cp008-adapter-v1";
import { isEng002Cp009QuestionStudioRequestV1, languageV1Eng002Cp009QuestionStudioAdapterV1 } from "./language-v1-eng002-cp009-adapter-v1";
import { isEng002Cp010QuestionStudioRequestV1, languageV1Eng002Cp010QuestionStudioAdapterV1 } from "./language-v1-eng002-cp010-adapter-v1";
import { isEng002Cp011QuestionStudioRequestV1, languageV1Eng002Cp011QuestionStudioAdapterV1 } from "./language-v1-eng002-cp011-adapter-v1";
import { isEng002Cp012QuestionStudioRequestV1, languageV1Eng002Cp012QuestionStudioAdapterV1 } from "./language-v1-eng002-cp012-adapter-v1";
import { isEng002Cp013QuestionStudioRequestV1, languageV1Eng002Cp013QuestionStudioAdapterV1 } from "./language-v1-eng002-cp013-adapter-v1";

function explicitEng002CpSelector(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => typeof value === "string" ? value.trim().toUpperCase() : "")
    .find((value) => /^ENG-002-CP\d{3}$/.test(value));
}

/** Composite adapter for approved English review-only generators. */
export const languageV1QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "language-v1",
  listPackages() {
    return [
      ...languageV1Eng001Cp013QuestionStudioAdapterV1.listPackages(),
      ...languageV1Eng002Cp013QuestionStudioAdapterV1.listPackages(),
    ];
  },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    // Explicit ENG-002 checkpoint selectors are authoritative. This prevents broad topic aliases
    // (for example `noun` matching `pronouns`) from stealing requests that name another CP.
    switch (explicitEng002CpSelector(request)) {
      case "ENG-002-CP001": return languageV1Eng002Cp001QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP002": return languageV1Eng002Cp002QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP003": return languageV1Eng002Cp003QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP004": return languageV1Eng002Cp004QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP005": return languageV1Eng002Cp005QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP006": return languageV1Eng002Cp006QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP007": return languageV1Eng002Cp007Cp008QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP008": return languageV1Eng002Cp007Cp008QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP009": return languageV1Eng002Cp009QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP010": return languageV1Eng002Cp010QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP011": return languageV1Eng002Cp011QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP012": return languageV1Eng002Cp012QuestionStudioAdapterV1.generate(request);
      case "ENG-002-CP013": return languageV1Eng002Cp013QuestionStudioAdapterV1.generate(request);
    }

    if (isEng002Cp013QuestionStudioRequestV1(request)) return languageV1Eng002Cp013QuestionStudioAdapterV1.generate(request);
    if (isEng002Cp012QuestionStudioRequestV1(request)) return languageV1Eng002Cp012QuestionStudioAdapterV1.generate(request);
    if (isEng002Cp011QuestionStudioRequestV1(request)) return languageV1Eng002Cp011QuestionStudioAdapterV1.generate(request);
    if (isEng002Cp010QuestionStudioRequestV1(request)) return languageV1Eng002Cp010QuestionStudioAdapterV1.generate(request);
    if (isEng002Cp009QuestionStudioRequestV1(request)) return languageV1Eng002Cp009QuestionStudioAdapterV1.generate(request);
    if (isEng002Cp008QuestionStudioRequestV1(request) || isEng002Cp007QuestionStudioRequestV1(request)) return languageV1Eng002Cp007Cp008QuestionStudioAdapterV1.generate(request);
    if (isEng002Cp006QuestionStudioRequestV1(request)) return languageV1Eng002Cp006QuestionStudioAdapterV1.generate(request);
    if (isEng002Cp005QuestionStudioRequestV1(request)) return languageV1Eng002Cp005QuestionStudioAdapterV1.generate(request);
    if (isEng002Cp004QuestionStudioRequestV1(request)) return languageV1Eng002Cp004QuestionStudioAdapterV1.generate(request);
    if (isEng002Cp003QuestionStudioRequestV1(request)) return languageV1Eng002Cp003QuestionStudioAdapterV1.generate(request);
    if (isEng002Cp002QuestionStudioRequestV1(request)) return languageV1Eng002Cp002QuestionStudioAdapterV1.generate(request);
    if (isEng002Cp001QuestionStudioRequestV1(request)) return languageV1Eng002Cp001QuestionStudioAdapterV1.generate(request);
    if (isEng001Cp013QuestionStudioRequestV1(request)) return normalizeEng001AnswerPositionsV1(await languageV1Eng001Cp013QuestionStudioAdapterV1.generate(request));
    if (isEng001Cp012QuestionStudioRequestV1(request)) return normalizeEng001AnswerPositionsV1(await languageV1Eng001Cp012QuestionStudioAdapterV1.generate(request));
    if (isEng001Cp011QuestionStudioRequestV1(request)) return normalizeEng001AnswerPositionsV1(await languageV1Eng001Cp011QuestionStudioAdapterV1.generate(request));
    if (isEng001Cp010QuestionStudioRequestV1(request)) return normalizeEng001AnswerPositionsV1(await languageV1Eng001Cp010QuestionStudioAdapterV1.generate(request));
    if (isEng001Cp009QuestionStudioRequestV1(request)) return normalizeEng001AnswerPositionsV1(await languageV1Eng001Cp009QuestionStudioAdapterV1.generate(request));
    if (isEng001Cp008QuestionStudioRequestV1(request)) return normalizeEng001AnswerPositionsV1(await languageV1Eng001Cp008QuestionStudioAdapterV1.generate(request));
    if (isEng001Cp007QuestionStudioRequestV1(request)) return normalizeEng001AnswerPositionsV1(await languageV1Eng001Cp007QuestionStudioAdapterV1.generate(request));
    if (isEng001Cp006QuestionStudioRequestV1(request)) return normalizeEng001AnswerPositionsV1(await languageV1Eng001Cp006QuestionStudioAdapterV1.generate(request));
    if (isEng001Cp005QuestionStudioRequestV1(request)) return normalizeEng001AnswerPositionsV1(await languageV1Eng001Cp005QuestionStudioAdapterV1.generate(request));
    if (isEng001Cp004QuestionStudioRequestV1(request)) return normalizeEng001AnswerPositionsV1(await languageV1Eng001Cp004QuestionStudioAdapterV1.generate(request));
    if (isEng001QuestionStudioRequestV1(request)) return normalizeEng001AnswerPositionsV1(await languageV1Eng001QuestionStudioAdapterV1.generate(request));
    throw new Error(`language-v1 cannot resolve package ${String(request.packageId ?? request.topic ?? "unknown")}`);
  },
};
