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

const LATEX_TIMES = String.raw`\times`;
const LATEX_FRAC = String.raw`\frac`;
const MATH_OPEN = String.raw`\(`;
const MATH_CLOSE = String.raw`\)`;
const TAB_TIMES = `${String.fromCharCode(9)}imes`;
const FORM_FEED_FRAC = `${String.fromCharCode(12)}rac`;

function repairLearnerText(text: string): string {
  const repairedControls = text
    .split(TAB_TIMES).join(LATEX_TIMES)
    .split(FORM_FEED_FRAC).join(LATEX_FRAC);

  return repairedControls.replace(/\\\(([^=]+)=\1\\\)/g, (_match, value: string) => `${MATH_OPEN}${value}${MATH_CLOSE}`);
}

function repairLearnerExplanation(explanation: TmwLearnerExplanationV2): TmwLearnerExplanationV2 {
  return {
    ...explanation,
    method: repairLearnerText(explanation.method),
    solution: explanation.solution.map(repairLearnerText),
    answer: repairLearnerText(explanation.answer),
  };
}

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

  const learnerExplanation = repairLearnerExplanation(question.learnerExplanation);
  const learnerText = [
    learnerExplanation.method,
    ...learnerExplanation.solution,
    learnerExplanation.answer,
  ].join(" ");

  const errors = (question.validation?.errors ?? []).filter((error) => !STALE_TRACE_ERRORS.has(error));
  const internalTrace = /\\text\{|R_\d|e_[A-Za-z]|r_[A-Za-z]|n_[A-Za-z]|T_[A-Za-z]|(?:^|[^A-Za-z])(?:xe|ye)(?:[^A-Za-z]|$)/.test(learnerText);
  const localizedEnglishTrace = language !== "en" && /\bsource capacity\b|\btarget contribution\b|\btotal contribution\b|\bleast feasible\b|\bcomponents per\b|\bcopies per\b|\bbottles per\b|\bweighted contribution\b/i.test(learnerText);
  const controlCharacterTrace = /[\u0000-\u001F\u007F]/.test(learnerText);

  if (internalTrace) errors.push("CP007 final validation: internal solver notation remains");
  if (localizedEnglishTrace) errors.push("CP007 final validation: untranslated English solver trace remains");
  if (controlCharacterTrace) errors.push("CP007 final validation: control character remains in learner explanation");

  return {
    ...question,
    stem,
    learnerExplanation,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
