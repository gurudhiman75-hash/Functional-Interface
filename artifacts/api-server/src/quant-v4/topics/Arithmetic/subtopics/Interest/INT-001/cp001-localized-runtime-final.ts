import type { IntCp001FinalQlId } from "./cp001-final-registry";
import {
  assertIntCp001LocaleParity,
  generateIntCp001LocalizedQuestion as generateRawLocalizedQuestion,
  type IntCp001LocalizedQuestion,
} from "./cp001-localized-runtime";
import type { IntCp001Locale } from "./cp001-multilingual-release";

const DEVANAGARI_LETTER_OR_MARK = /[\u0901-\u0939\u093A-\u094D\u0950-\u0963\u0971-\u097F]/u;
const MATH_SEGMENT = /(\$\$[\s\S]*?\$\$|\$[^$]*?\$)/gu;

function normalizePercentText(value: string): string {
  return value
    .replace(/%\\%/gu, "\\%")
    .replace(/%%/gu, "%")
    .replace(/\$([^$]+)\$%/gu, (_match, inner: string) => `$${inner}\\%$`);
}

function normalizeFinalStem(stem: string, locale: IntCp001Locale): string {
  const interrogative = locale === "hi"
    ? stem.replace(/वार्षिक दर ज्ञात कीजिए।$/u, "वार्षिक दर कितनी है?")
    : stem;
  return normalizePercentText(interrogative);
}

function normalizeLocalizedItem(raw: IntCp001LocalizedQuestion, locale: IntCp001Locale): IntCp001LocalizedQuestion {
  const stem = normalizeFinalStem(raw.stem, locale);
  const options = raw.options.map(normalizePercentText);
  const optionAudit = raw.optionAudit.map((option, index) => ({
    ...option,
    text: options[index]!,
  }));
  const explanation = {
    ...raw.explanation,
    notice: normalizePercentText(raw.explanation.notice),
    relation: normalizePercentText(raw.explanation.relation),
    steps: raw.explanation.steps.map(normalizePercentText),
    verification: normalizePercentText(raw.explanation.verification),
    conclusion: normalizePercentText(raw.explanation.conclusion),
    commonTrap: normalizePercentText(raw.explanation.commonTrap),
    coreConcept: {
      ...raw.explanation.coreConcept,
      heading: normalizePercentText(raw.explanation.coreConcept.heading),
      narrative: normalizePercentText(raw.explanation.coreConcept.narrative),
      displayMath: normalizePercentText(raw.explanation.coreConcept.displayMath),
    },
    stepByStep: {
      ...raw.explanation.stepByStep,
      heading: normalizePercentText(raw.explanation.stepByStep.heading),
      steps: raw.explanation.stepByStep.steps.map(normalizePercentText),
      verification: normalizePercentText(raw.explanation.stepByStep.verification),
      conclusion: normalizePercentText(raw.explanation.stepByStep.conclusion),
    },
    examShortcut: {
      ...raw.explanation.examShortcut,
      heading: normalizePercentText(raw.explanation.examShortcut.heading),
      narrative: normalizePercentText(raw.explanation.examShortcut.narrative),
      displayMath: normalizePercentText(raw.explanation.examShortcut.displayMath),
    },
    trapAnalysis: {
      ...raw.explanation.trapAnalysis,
      heading: normalizePercentText(raw.explanation.trapAnalysis.heading),
      items: raw.explanation.trapAnalysis.items.map((trap) => ({
        ...trap,
        optionText: options[trap.optionNumber - 1]!,
        explanation: normalizePercentText(trap.explanation),
      })),
    },
  };
  const graph = raw.reasoningGraph as { nodes?: Array<Record<string, unknown>> };
  const reasoningGraph = graph?.nodes
    ? {
        ...graph,
        nodes: graph.nodes.map((node) => ({
          ...node,
          text: typeof node.text === "string" ? normalizePercentText(node.text) : node.text,
          mathLatex: typeof node.mathLatex === "string" ? normalizePercentText(node.mathLatex) : node.mathLatex,
        })),
      }
    : raw.reasoningGraph;

  return {
    ...raw,
    stem,
    options,
    optionAudit,
    explanation,
    reasoningGraph: reasoningGraph as IntCp001LocalizedQuestion["reasoningGraph"],
  };
}

function learnerText(item: IntCp001LocalizedQuestion): string {
  return [
    item.stem,
    ...item.options,
    item.explanation.coreConcept.heading,
    item.explanation.coreConcept.narrative,
    item.explanation.coreConcept.displayMath,
    item.explanation.stepByStep.heading,
    ...item.explanation.stepByStep.steps,
    item.explanation.stepByStep.verification,
    item.explanation.stepByStep.conclusion,
    item.explanation.examShortcut.heading,
    item.explanation.examShortcut.narrative,
    item.explanation.examShortcut.displayMath,
    item.explanation.trapAnalysis.heading,
    ...item.explanation.trapAnalysis.items.flatMap((trap) => [trap.optionText, trap.explanation]),
  ].join(" ");
}

function containsDevanagariLanguageText(value: string): boolean {
  return DEVANAGARI_LETTER_OR_MARK.test(value.replace(MATH_SEGMENT, " "));
}

export function generateIntCp001FinalLocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001LocalizedQuestion {
  const raw = generateRawLocalizedQuestion(qlId, seed, locale);
  const item = normalizeLocalizedItem(raw, locale);
  const text = learnerText(item);
  const errors = item.validation.errors.filter((error) => {
    if (locale === "pa" && error === "Punjabi learner text contains Devanagari script.") {
      return containsDevanagariLanguageText(text);
    }
    if (error === "Localized stem is not a complete question." && item.stem.endsWith("?")) {
      return false;
    }
    return true;
  });

  if (locale === "pa" && containsDevanagariLanguageText(text)) {
    if (!errors.includes("Punjabi learner text contains Devanagari language text.")) {
      errors.push("Punjabi learner text contains Devanagari language text.");
    }
  }
  if (!item.stem.endsWith("?") && !errors.includes("Localized stem is not a complete question.")) {
    errors.push("Localized stem is not a complete question.");
  }
  if (/%%|%\\%/u.test(text)) {
    errors.push("Localized learner text contains malformed percentage notation.");
  }
  if (!item.explanation.stepByStep.conclusion.includes(item.options[item.correctIndex]!)) {
    errors.push("Localized conclusion lost the normalized correct option.");
  }

  return {
    ...item,
    validation: {
      ...item.validation,
      ok: errors.length === 0,
      errors,
    },
  };
}

export { assertIntCp001LocaleParity };
export type { IntCp001LocalizedQuestion };
