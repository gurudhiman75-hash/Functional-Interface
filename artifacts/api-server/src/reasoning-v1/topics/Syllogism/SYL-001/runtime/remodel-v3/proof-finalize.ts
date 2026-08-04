import type { SylLocale } from "../../foundation/types";
import type { SylTaskKind } from "../types";
import type { SylStructuredProofCoreV3 } from "./proof";
import type { SylVisibleOptionAnalysisV3 } from "./types";

function stripTerminal(value: string): string {
  return value.trim().replace(/[।.!?;:]+$/u, "");
}

function sentence(value: string, locale: SylLocale): string {
  return `${stripTerminal(value)}${locale === "en-IN" ? "." : "।"}`;
}

function quoted(value: string): string {
  return `“${stripTerminal(value)}”`;
}

function joinNatural(values: readonly string[], locale: SylLocale): string {
  const clean = values.map(stripTerminal).filter(Boolean);
  if (clean.length <= 1) return clean[0] ?? "";
  if (clean.length === 2) {
    const connector = locale === "en-IN" ? " and " : locale === "hi-IN" ? " और " : " ਅਤੇ ";
    return `${clean[0]}${connector}${clean[1]}`;
  }
  const connector = locale === "en-IN" ? ", and " : locale === "hi-IN" ? ", और " : ", ਅਤੇ ";
  return `${clean.slice(0, -1).join(", ")}${connector}${clean.at(-1)}`;
}

function statementReference(index: number, locale: SylLocale): string {
  if (locale === "hi-IN") return `कथन ${index}`;
  if (locale === "pa-IN") return `ਕਥਨ ${index}`;
  return `Statement ${index}`;
}

function finalAnswerSentence(index: number, text: string, locale: SylLocale): string {
  if (locale === "hi-IN") return `अतः सही उत्तर विकल्प ${index} है — ${stripTerminal(text)}।`;
  if (locale === "pa-IN") return `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ਵਿਕਲਪ ${index} ਹੈ — ${stripTerminal(text)}।`;
  return `Therefore, the correct answer is Option ${index} — ${stripTerminal(text)}.`;
}

function isModalTask(taskKind: SylTaskKind): boolean {
  return taskKind.includes("MODAL") || taskKind.includes("CLASSIFY_CONCLUSION_MODALITY");
}

function isCombinationTask(taskKind: SylTaskKind): boolean {
  return taskKind.includes("MASK") || taskKind.includes("EITHER_OR") || taskKind.includes("PAIR");
}

function modalWrongReason(
  wrong: SylVisibleOptionAnalysisV3,
  correct: SylVisibleOptionAnalysisV3,
  locale: SylLocale,
): string {
  const proof = correct.studentReason;
  if (locale === "hi-IN") {
    return `${proof} इसलिए ${quoted(wrong.optionText)} गलत स्थिति है; सही स्थिति ${quoted(correct.optionText)} है।`;
  }
  if (locale === "pa-IN") {
    return `${proof} ਇਸ ਲਈ ${quoted(wrong.optionText)} ਗਲਤ ਸਥਿਤੀ ਹੈ; ਸਹੀ ਸਥਿਤੀ ${quoted(correct.optionText)} ਹੈ।`;
  }
  return `${proof} Therefore, ${quoted(wrong.optionText)} is the wrong classification; the correct classification is ${quoted(correct.optionText)}.`;
}

function proofConclusionStep(
  core: SylStructuredProofCoreV3,
  correct: SylVisibleOptionAnalysisV3,
  taskKind: SylTaskKind,
): string {
  if (isCombinationTask(taskKind)) return correct.studentReason;
  const current = core.correctOptionProof.reasoningSteps.at(-1);
  return current ?? correct.studentReason;
}

export function finalizeStructuredProofCoreV3(
  core: SylStructuredProofCoreV3,
  locale: SylLocale,
  taskKind: SylTaskKind,
): SylStructuredProofCoreV3 {
  const correct = core.optionAnalysis.find((analysis) => analysis.taskDisposition === "CORRECT_FOR_TASK");
  if (!correct) throw new Error("V3 proof finalization requires one correct visible option.");

  const optionAnalysis = Object.freeze(core.optionAnalysis.map((analysis) => {
    if (!isModalTask(taskKind) || analysis.taskDisposition === "CORRECT_FOR_TASK") return analysis;
    return Object.freeze({
      ...analysis,
      studentReason: modalWrongReason(analysis, correct, locale),
    });
  }));
  const finalizedCorrect = optionAnalysis.find((analysis) => analysis.taskDisposition === "CORRECT_FOR_TASK")!;
  const decisiveMeanings = finalizedCorrect.premiseIdsUsed
    .map((premiseId) => core.statementMeanings.find((entry) => entry.premiseId === premiseId))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const conclusionStep = proofConclusionStep(core, finalizedCorrect, taskKind);
  const reasoningSteps = Object.freeze([
    ...decisiveMeanings.map((meaning) => sentence(`${statementReference(meaning.displayIndex, locale)}: ${meaning.normalizedMeaning}`, locale)),
    conclusionStep,
  ]);
  const correctOptionProof = Object.freeze({
    ...core.correctOptionProof,
    reasoningSteps,
    studentProof: [
      ...reasoningSteps,
      finalAnswerSentence(finalizedCorrect.displayIndex, finalizedCorrect.optionText, locale),
    ].join(" "),
  });
  const combinedRelation = [
    sentence(joinNatural(decisiveMeanings.map((meaning) => meaning.normalizedMeaning), locale), locale),
    conclusionStep,
  ].join(" ");

  return Object.freeze({
    ...core,
    optionAnalysis,
    correctOptionProof,
    combinedRelation,
  });
}
