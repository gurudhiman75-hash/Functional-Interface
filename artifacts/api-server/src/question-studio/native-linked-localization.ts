import { toQuestionStudioPreview } from "../quant-v4/generation-engine";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "./engine-registry";
import type { QuestionStudioGenerationRequest } from "./engine-types";
import { runAvg001QuestionStudioPipeline, type Avg001QuestionStudioCpId } from "../quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/question-studio-adapter";
import { generateInt001ExistingLocalizedQuestion } from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/int-001-chapter-question-studio-admin-adapter-v1";

export type NativeLocale = "en" | "hi" | "pa";
export type NativeLocalizedQuestion = {
  stem: string;
  explanation: string;
  options: string[];
  correctIndex: number;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function string(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
function asOptions(value: unknown): string[] {
  return Array.isArray(value) ? value.map((option) => String(option ?? "").trim()) : [];
}

/** Preserve authored localized explanation order for ordinary and structured
 * chapter outputs, without inventing or machine translating any wording. */
export function nativeExplanationText(value: unknown): string {
  if (typeof value==="string") return value.trim();
  if (Array.isArray(value)) return value.map(string).filter(Boolean).join("\n");
  const structured=record(value);
  if (Array.isArray(structured.lines)) {
    return structured.lines.map(string).filter(Boolean).join("\n");
  }
  if (Array.isArray(structured.visibleLines)) {
    return [...structured.visibleLines.map(string),string(structured.answerLine)].filter(Boolean).join("\n");
  }
  return [string(structured.method),
    ...(Array.isArray(structured.steps)?structured.steps.map(string):[]),
    string(structured.conclusion||structured.finalAnswer)].filter(Boolean).join("\n");
}

/**
 * Rebuild only an already-authored, approved engine localization from a
 * persisted exact QL + question seed. No LLM and no guessed translation.
 *
 * Only explicitly verified engines are allowed. All other packages fail
 * closed until their saved-seed parity is covered by contract tests.
 */
export async function nativeLocalizedQuestion(
  payloadValue: unknown,
  language: NativeLocale,
): Promise<NativeLocalizedQuestion> {
  const payload = record(payloadValue);
  const packageId = string(payload.packageId);
  const seed = string(payload.seed);
  const cpId = string(payload.canonicalProblemId || payload.selectedCpId || payload.cpId);
  const qlId = string(payload.questionLanguageId || record(payload.metadata).questionLanguageId || payload.qlId);
  if (!seed || !cpId || !qlId) {
    throw new Error("NATIVE_LOCALIZATION_SOURCE_IDENTITY_MISSING");
  }

  if (packageId === "AVG-001") {
    if (!/^AVG-CP-00[1-6]$/.test(cpId) || !/^AVG-QL-\d{3}$/.test(qlId)) {
      throw new Error("NATIVE_LOCALIZATION_AVERAGE_SELECTOR_INVALID");
    }
    const pkg = runAvg001QuestionStudioPipeline(cpId as Avg001QuestionStudioCpId, {
      questionLanguageId: qlId, seed, language,
    });
    if (!pkg.validation.valid || pkg.validation.checks.some(check => !check.passed)) {
      throw new Error("NATIVE_LOCALIZATION_AVERAGE_NOT_VALIDATED");
    }
    const preview = toQuestionStudioPreview(pkg, { seed }) as Record<string, unknown>;
    return {
      stem: string(preview.text),
      explanation: string(preview.explanation),
      options: asOptions(preview.options),
      correctIndex: Number(preview.correctIndex),
    };
  }
  if (packageId === "INT-001") {
    const match = /^(INT-QL-\d{3})(?::(?:en|hi|pa))?$/i.exec(qlId);
    if (!/^INT-CP-\d{3}$/.test(cpId) || !match) {
      throw new Error("NATIVE_LOCALIZATION_INTEREST_SELECTOR_INVALID");
    }
    const pkg = await generateInt001ExistingLocalizedQuestion(match[1]!, seed, language);
    if (pkg.canonicalProblemId !== cpId || pkg.qlId !== match[1]) {
      throw new Error("NATIVE_LOCALIZATION_INTEREST_IDENTITY_MISMATCH");
    }
    return {
      stem: pkg.stem,
      explanation: pkg.explanationLines.join("\n"),
      options: [...pkg.options],
      correctIndex: pkg.correctIndex,
    };
  }
  // Native chapter engines already accept a canonical CP, permanent QL and
  // deterministic seed through the central registry. Reuse that contract for
  // every registered chapter with an authored locale; never invent a fallback.
  const pkg=listQuestionStudioPackages().find(entry=>entry.packageId===packageId && entry.enabled);
  if (!pkg || !pkg.supportedLanguages.includes("en") || !pkg.supportedLanguages.includes(language)) {
    throw new Error("NATIVE_LOCALIZATION_UNSUPPORTED_LANGUAGE_OR_PACKAGE");
  }
  if (!pkg.cpIds.includes(cpId) && !(pkg.dynamicCandidateCpIds ?? []).includes(cpId)) {
    throw new Error("NATIVE_LOCALIZATION_CP_NOT_REGISTERED");
  }
  const request: QuestionStudioGenerationRequest = {
    engineId:pkg.engineId, packageId, canonicalProblemId:cpId,
    questionLanguageId:qlId, seed, language, count:1,
    ...(string(payload.exam)?{exam:string(payload.exam)}:{}),
    ...(string(payload.runtimeMode)?{runtimeMode:string(payload.runtimeMode)}:{}),
    ...(string(payload.difficulty)?{difficulty:string(payload.difficulty)}:{}),
  };
  const result=await generateQuestionStudioQuestions(request);
  if (result.questions.length!==1) throw new Error("NATIVE_LOCALIZATION_NOT_SINGLE_QUESTION");
  const question=record(result.questions[0]);
  const generatedCp=string(question.canonicalProblemId||question.selectedCpId||question.cpId);
  const generatedQl=string(question.questionLanguageId||question.qlId);
  const generatedSeed=string(question.seed);
  if ((generatedCp && generatedCp!==cpId) ||
      (generatedQl && generatedQl!==qlId) ||
      (generatedSeed && generatedSeed!==seed)) {
    throw new Error("NATIVE_LOCALIZATION_REGENERATED_IDENTITY_DRIFT");
  }
  const explanation=nativeExplanationText(question.explanation);
  const options=Array.isArray(question.options)?question.options.map(value=>
    typeof value==="string"?value.trim():string(record(value).text)): [];
  const generatedIndex=Number(question.correctIndex??question.correct);
  if (!string(question.stem||question.text)||!explanation||
      options.length<2||options.some(option=>!option)||
      !Number.isInteger(generatedIndex)||generatedIndex<0||generatedIndex>=options.length) {
    throw new Error("NATIVE_LOCALIZATION_INCOMPLETE_GENERATED_CONTENT");
  }
  return {
    stem:string(question.stem||question.text),
    explanation,options,correctIndex:generatedIndex,
  };
}

/** Fail-closed comparison to a canonical approved version, including the
 * original option ordering and explanation, before offering a locale draft. */
export function assertNativeEnglishSourceParity(
  source: NativeLocalizedQuestion,
  regenerated: NativeLocalizedQuestion,
): void {
  if (source.stem !== regenerated.stem ||
      source.explanation !== regenerated.explanation ||
      JSON.stringify(source.options) !== JSON.stringify(regenerated.options) ||
      source.correctIndex !== regenerated.correctIndex) {
    throw new Error("NATIVE_LOCALIZATION_SOURCE_PARITY_FAILED");
  }
}

/** Locale variants must retain the canonical answer position and number of
 * options. Any engine reordering requires a separately audited mapping. */
export function assertNativeLocalizedAnswerParity(
  source: NativeLocalizedQuestion,
  localized: NativeLocalizedQuestion,
): void {
  if (!localized.stem || !localized.explanation ||
      localized.options.length !== source.options.length ||
      localized.options.some(option => !option) ||
      new Set(localized.options).size !== localized.options.length ||
      localized.correctIndex !== source.correctIndex ||
      localized.correctIndex < 0 ||
      localized.correctIndex >= localized.options.length) {
    throw new Error("NATIVE_LOCALIZATION_ANSWER_PARITY_FAILED");
  }
}
