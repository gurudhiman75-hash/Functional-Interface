import type { TmwLearnerExplanationV2 } from "./learner-explanation-contract";

type Language = "en" | "hi" | "pa";

interface Cp007Question {
  canonicalProblemId?: string;
  cpId?: string;
  stem?: string;
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

const STALE_TRACE_ERRORS = new Set([
  "CP007 multilingual editorial review: internal solver notation or English trace remains",
  "CP007 final polish: internal solver notation or untranslated trace remains",
]);

export function finalizeTmwCp007EditorialValidation<T extends Cp007Question>(question: T, language: Language): T {
  if ((question.canonicalProblemId ?? question.cpId) !== "TMW-CP-007" || !question.learnerExplanation) return question;

  let stem = question.stem ?? "";
  if (language === "hi") {
    stem = stem
      .replace(/ का ऑर्डर पर/g, " के ऑर्डर पर")
      .replace(/ का ऑर्डर को/g, " के ऑर्डर को");
  } else if (language === "pa") {
    stem = stem.replace(/ ਦਾ ਆਰਡਰ ਉੱਤੇ/g, " ਦੇ ਆਰਡਰ ਉੱਤੇ");
  }

  const learnerText = [
    question.learnerExplanation.method,
    ...question.learnerExplanation.solution,
    question.learnerExplanation.answer,
  ].join(" ");

  const errors = (question.validation?.errors ?? []).filter((error) => !STALE_TRACE_ERRORS.has(error));
  const internalTrace = /\\text\{|R_\d|e_[A-Za-z]|r_[A-Za-z]|n_[A-Za-z]|T_[A-Za-z]|(?:^|[^A-Za-z])(?:xe|ye)(?:[^A-Za-z]|$)/.test(learnerText);
  const localizedEnglishTrace = language !== "en" && /\bsource capacity\b|\btarget contribution\b|\btotal contribution\b|\bleast feasible\b|\bcomponents per\b|\bcopies per\b|\bbottles per\b|\bweighted contribution\b/i.test(learnerText);

  if (internalTrace) errors.push("CP007 final validation: internal solver notation remains");
  if (localizedEnglishTrace) errors.push("CP007 final validation: untranslated English solver trace remains");

  return {
    ...question,
    stem,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
