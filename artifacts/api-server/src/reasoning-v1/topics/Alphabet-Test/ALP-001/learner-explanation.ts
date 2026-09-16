import { buildCp010 } from "./completion/cp010";
import { alp001QlById } from "./ql-registry";
import type { AlpExplanation, AlpLocale, GeneratedAlpQuestion } from "./types";

export interface AlpLearnerExplanation {
  readonly schemaVersion: "ALP-001-LEARNER-EXPLANATION-V1";
  readonly coreConcept: string;
  readonly steps: readonly string[];
  readonly visualWorking: readonly string[];
  readonly conclusion: string;
}

export function toAlpLearnerExplanation(explanation: AlpExplanation): AlpLearnerExplanation {
  return {
    schemaVersion: "ALP-001-LEARNER-EXPLANATION-V1",
    coreConcept: explanation.coreConcept,
    steps: explanation.steps,
    visualWorking: explanation.visualWorking,
    conclusion: explanation.conclusion,
  };
}

function localeValue<T>(locale: AlpLocale, values: { readonly en: T; readonly hi: T; readonly pa: T }): T {
  return locale === "hi-IN" ? values.hi : locale === "pa-IN" ? values.pa : values.en;
}

function learnerStem(question: GeneratedAlpQuestion): string {
  if (question.qlId !== "ALP-QL-155") return question.stem;
  const source = question.structuredPrompt.sequence;
  if (!source?.length) return question.stem;

  const completion = buildCp010(alp001QlById(question.qlId), question.seed);
  const operation = localeValue(question.locale, completion.operation);
  const sequence = source.join(" ");
  if (question.locale === "hi-IN") {
    return `श्रृंखला ${sequence} को ध्यान से देखें। ${operation}। इसके बाद कितने चिह्न अपने मूल स्थान पर रहेंगे?`;
  }
  if (question.locale === "pa-IN") {
    return `ਲੜੀ ${sequence} ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ। ${operation}। ਇਸ ਤੋਂ ਬਾਅਦ ਕਿੰਨੇ ਚਿੰਨ੍ਹ ਆਪਣੀ ਮੂਲ ਥਾਂ ਉੱਤੇ ਰਹਿਣਗੇ?`;
  }
  return `Study the sequence ${sequence}. ${operation.charAt(0).toUpperCase()}${operation.slice(1)}. After this rearrangement, how many elements remain in their original positions?`;
}

export function toAlpReviewQuestion<T extends GeneratedAlpQuestion>(question: T): Omit<T, "stem" | "explanation"> & { readonly stem: string; readonly explanation: AlpLearnerExplanation } {
  return {
    ...question,
    stem: learnerStem(question),
    explanation: toAlpLearnerExplanation(question.explanation),
  };
}
