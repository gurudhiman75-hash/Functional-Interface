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
import { ENG003_QUESTION_STUDIO_PACKAGE_ID_V1, languageV1Eng003Cp001QuestionStudioAdapterV1 } from "./language-v1-eng003-cp001-adapter-v1";
import { languageV1Eng003Cp002QuestionStudioAdapterV1 } from "./language-v1-eng003-cp002-adapter-v1";
import { languageV1Eng003Cp003QuestionStudioAdapterV1 } from "./language-v1-eng003-cp003-adapter-v1";
import { languageV1Eng003Cp004QuestionStudioAdapterV1 } from "./language-v1-eng003-cp004-adapter-v1";
import { languageV1Eng003Cp005QuestionStudioAdapterV1 } from "./language-v1-eng003-cp005-adapter-v1";
import { languageV1Eng003Cp006QuestionStudioAdapterV1 } from "./language-v1-eng003-cp006-adapter-v1";
import { languageV1Eng003Cp007QuestionStudioAdapterV1 } from "./language-v1-eng003-cp007-adapter-v1";
import { languageV1Eng003Cp008QuestionStudioAdapterV1 } from "./language-v1-eng003-cp008-adapter-v1";
import { languageV1Eng003Cp009QuestionStudioAdapterV1 } from "./language-v1-eng003-cp009-adapter-v1";

function explicitSelectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => typeof value === "string" ? value.trim().toUpperCase() : "")
    .filter(Boolean);
}

function explicitEng002CpSelector(request: QuestionStudioGenerationRequest) {
  return explicitSelectorValues(request).find((value) => /^ENG-002-CP\d{3}$/.test(value));
}

function explicitEng002RuleSelector(request: QuestionStudioGenerationRequest) {
  return explicitSelectorValues(request).find((value) => /^GR-[A-Z]+-\d{3}$/.test(value));
}

function explicitEng003CpSelector(request: QuestionStudioGenerationRequest) {
  return explicitSelectorValues(request).find((value) => /^ENG-003-CP\d{3}$/.test(value));
}

function eng003PackageSelected(request: QuestionStudioGenerationRequest) {
  const packageId = typeof request.packageId === "string" ? request.packageId.trim().toLowerCase() : "";
  return packageId === ENG003_QUESTION_STUDIO_PACKAGE_ID_V1;
}

function eng003TopicText(request: QuestionStudioGenerationRequest) {
  return `${typeof request.topic === "string" ? request.topic : ""} ${typeof request.subtopic === "string" ? request.subtopic : ""}`.toLowerCase();
}

/** Composite adapter for approved English review-only generators. */
export const languageV1QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "language-v1",
  listPackages() {
    return [
      ...languageV1Eng001Cp013QuestionStudioAdapterV1.listPackages(),
      ...languageV1Eng002Cp013QuestionStudioAdapterV1.listPackages(),
      ...languageV1Eng003Cp001QuestionStudioAdapterV1.listPackages(),
    ];
  },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    // ENG-003 reuses the ENG-001/ENG-002 grammar rule IDs. Resolve its explicit checkpoint/package
    // before the shared GR-* fallback so ENG-003 requests cannot be stolen by ENG-002.
    const eng003CpSelector = explicitEng003CpSelector(request);
    if (eng003CpSelector === "ENG-003-CP001") return languageV1Eng003Cp001QuestionStudioAdapterV1.generate(request);
    if (eng003CpSelector === "ENG-003-CP002") return languageV1Eng003Cp002QuestionStudioAdapterV1.generate(request);
    if (eng003CpSelector === "ENG-003-CP003") return languageV1Eng003Cp003QuestionStudioAdapterV1.generate(request);
    if (eng003CpSelector === "ENG-003-CP004") return languageV1Eng003Cp004QuestionStudioAdapterV1.generate(request);
    if (eng003CpSelector === "ENG-003-CP005") return languageV1Eng003Cp005QuestionStudioAdapterV1.generate(request);
    if (eng003CpSelector === "ENG-003-CP006") return languageV1Eng003Cp006QuestionStudioAdapterV1.generate(request);
    if (eng003CpSelector === "ENG-003-CP007") return languageV1Eng003Cp007QuestionStudioAdapterV1.generate(request);
    if (eng003CpSelector === "ENG-003-CP008") return languageV1Eng003Cp008QuestionStudioAdapterV1.generate(request);
    if (eng003CpSelector === "ENG-003-CP009") return languageV1Eng003Cp009QuestionStudioAdapterV1.generate(request);
    if (eng003PackageSelected(request)) {
      const selectors = explicitSelectorValues(request);
      const topic = eng003TopicText(request);
      if (selectors.some((value) => value.startsWith("GR-TNS-")) || /\btense/.test(topic)) {
        return languageV1Eng003Cp002QuestionStudioAdapterV1.generate(request);
      }
      if (selectors.some((value) => value.startsWith("GR-ART-")) || /article|determiner/.test(topic)) {
        return languageV1Eng003Cp003QuestionStudioAdapterV1.generate(request);
      }
      if (selectors.some((value) => value.startsWith("GR-PRN-")) || /pronoun/.test(topic)) {
        return languageV1Eng003Cp004QuestionStudioAdapterV1.generate(request);
      }
      if (selectors.some((value) => value.startsWith("GR-PRP-")) || /preposition/.test(topic)) {
        return languageV1Eng003Cp005QuestionStudioAdapterV1.generate(request);
      }
      if (selectors.some((value) => value.startsWith("GR-CMP-")) || /adjective|adverb|comparison/.test(topic)) {
        return languageV1Eng003Cp006QuestionStudioAdapterV1.generate(request);
      }
      if (selectors.some((value) => value.startsWith("GR-CON-")) || /conjunction|parallel/.test(topic)) {
        return languageV1Eng003Cp007QuestionStudioAdapterV1.generate(request);
      }
      if (selectors.some((value) => value.startsWith("GR-NQN-")) || /noun|quantifier|countable|uncountable/.test(topic)) {
        return languageV1Eng003Cp008QuestionStudioAdapterV1.generate(request);
      }
      if (selectors.some((value) => value.startsWith("GR-GIP-")) || /gerund|infinitive|participle|non.?finite/.test(topic)) {
        return languageV1Eng003Cp009QuestionStudioAdapterV1.generate(request);
      }
      if (selectors.some((value) => value.startsWith("GR-SVA-")) || /subject.?verb|agreement/.test(topic)) {
        return languageV1Eng003Cp001QuestionStudioAdapterV1.generate(request);
      }
      throw new Error("ENG-003 grammar-fillers package requires an explicit checkpoint, grammar rule, or approved subtopic");
    }

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

    // Explicit grammar-rule selectors are equally authoritative for the established ENG-002
    // package. ENG-003 requires its own package/CP selector because the rule IDs are shared.
    const ruleSelector = explicitEng002RuleSelector(request);
    if (ruleSelector?.startsWith("GR-SVA-")) return languageV1Eng002Cp001QuestionStudioAdapterV1.generate(request);
    if (ruleSelector?.startsWith("GR-TNS-")) return languageV1Eng002Cp002QuestionStudioAdapterV1.generate(request);
    if (ruleSelector?.startsWith("GR-ART-")) return languageV1Eng002Cp003QuestionStudioAdapterV1.generate(request);
    if (ruleSelector?.startsWith("GR-PRN-")) return languageV1Eng002Cp004QuestionStudioAdapterV1.generate(request);
    if (ruleSelector?.startsWith("GR-PRP-")) return languageV1Eng002Cp005QuestionStudioAdapterV1.generate(request);
    if (ruleSelector?.startsWith("GR-CMP-")) return languageV1Eng002Cp006QuestionStudioAdapterV1.generate(request);
    if (ruleSelector?.startsWith("GR-CON-") || ruleSelector?.startsWith("GR-NQN-")) return languageV1Eng002Cp007Cp008QuestionStudioAdapterV1.generate(request);
    if (ruleSelector?.startsWith("GR-GIP-")) return languageV1Eng002Cp009QuestionStudioAdapterV1.generate(request);
    if (ruleSelector?.startsWith("GR-MOD-")) return languageV1Eng002Cp010QuestionStudioAdapterV1.generate(request);
    if (ruleSelector?.startsWith("GR-CND-")) return languageV1Eng002Cp011QuestionStudioAdapterV1.generate(request);
    if (ruleSelector?.startsWith("GR-VNR-")) return languageV1Eng002Cp012QuestionStudioAdapterV1.generate(request);
    if (ruleSelector?.startsWith("GR-USG-")) return languageV1Eng002Cp013QuestionStudioAdapterV1.generate(request);

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
