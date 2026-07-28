import type { GeneratedCp008Question } from "../COD-CP-008/cp008-runtime";
import { renamedLabel } from "../COD-CP-008/cp008-prototype-solver";
import type { Cp008StructuredPrompt } from "../COD-CP-008/cp008-prototype-types";
import { getCp008LanguagePack } from "./cp008-language-pack";
import type { CodTranslatedLocale } from "./translational-language-pack";

interface LocalizedOption {
  value: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export type LocalizedCp008Question = Omit<GeneratedCp008Question, "locale" | "structuredPrompt" | "options" | "explanation" | "metadata"> & {
  locale: CodTranslatedLocale;
  structuredPrompt: Cp008StructuredPrompt;
  options: readonly LocalizedOption[];
  explanation: {
    referenceAid: readonly string[];
    quickMethod: string;
    ruleStatement: string;
    sourceDemonstration: readonly string[];
    targetApplication: readonly string[];
    conclusion: string;
    commonTrapAlert: string;
    closestTrapRejection: string;
  };
  metadata: GeneratedCp008Question["metadata"] & {
    localizationVersion: "cod-cp008-language-adapted-v1";
    sourceLocale: "en-IN";
    abstractHiddenFingerprint: string;
    localizedSolverAgreement: true;
  };
};

export function localizeCp008Question(
  english: GeneratedCp008Question,
  locale: CodTranslatedLocale,
): LocalizedCp008Question {
  const pack = getCp008LanguagePack(locale);
  const prompt = english.structuredPrompt;
  const mapping = prompt.mapping.map(({ actual, called }) => ({
    actual: pack.label(actual),
    called: pack.label(called),
  }));
  const directTarget = prompt.directTarget ? pack.label(prompt.directTarget) : undefined;
  const ordinaryAnswer = pack.label(prompt.ordinaryAnswer);
  const fact = prompt.semanticFactId ? pack.fact(prompt.semanticFactId) : undefined;
  const localizedPrompt: Cp008StructuredPrompt = {
    ...prompt,
    mapping,
    directTarget,
    semanticQuestion: fact?.question,
    ordinaryAnswer,
  };

  const options = english.options.map((option) => ({
    ...option,
    value: pack.label(option.value),
  }));
  const correct = options[english.correctIndex]!.value;
  const independentlySolved = renamedLabel(mapping, ordinaryAnswer);
  if (independentlySolved !== correct) {
    throw new Error(`${english.qlId}/${locale}/${english.seed} localized solver disagreement`);
  }

  const statements = mapping.map(({ actual, called }) => pack.mappingStatement(actual, called)).join(", ");
  const style = Math.abs(english.seed) % 3;
  const stem = directTarget
    ? pack.directStem(statements, directTarget, style)
    : pack.semanticStem(statements, fact!.question, style);
  const relevant = mapping.find((pair) => pair.actual === ordinaryAnswer)!;
  const sourceDemonstration = directTarget
    ? [pack.directReferent(directTarget, style)]
    : [fact!.rationale];
  const trap = options.find((option) => !option.isCorrect)!;

  return {
    ...english,
    locale,
    stem,
    structuredPrompt: localizedPrompt,
    options,
    explanation: {
      referenceAid: pack.referenceAid,
      quickMethod: pack.quickMethod,
      ruleStatement: pack.ruleStatement,
      sourceDemonstration,
      targetApplication: [pack.application(relevant.actual, relevant.called, style)],
      conclusion: pack.conclusion(correct, style),
      commonTrapAlert: pack.trap(trap.value),
      closestTrapRejection: pack.trap(trap.value),
    },
    metadata: {
      ...english.metadata,
      localizationVersion: "cod-cp008-language-adapted-v1",
      sourceLocale: "en-IN",
      abstractHiddenFingerprint: english.metadata.hiddenFingerprint,
      localizedSolverAgreement: true,
      correctAnswer: correct,
    },
  };
}
