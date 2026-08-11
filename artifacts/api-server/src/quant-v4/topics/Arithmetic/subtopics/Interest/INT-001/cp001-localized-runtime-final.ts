import type { IntCp001FinalQlId } from "./cp001-final-registry";
import {
  assertIntCp001LocaleParity,
  generateIntCp001LocalizedQuestion as generateRawLocalizedQuestion,
  type IntCp001LocalizedQuestion,
} from "./cp001-localized-runtime";
import type { IntCp001Locale } from "./cp001-multilingual-release";
import { divideRational, rational, subtractRational } from "./foundation/rational";
import {
  asRecord,
  isRational,
  mathMoney,
  mathPercent,
  mathRational,
  readRational,
} from "./cp001-localization-foundation";

const DEVANAGARI_LETTER_OR_MARK = /[\u0901-\u0939\u093A-\u094D\u0950-\u0963\u0971-\u097F]/u;
const MATH_SEGMENT = /(\$\$[\s\S]*?\$\$|\$[^$]*?\$)/gu;

function normalizePercentText(value: string): string {
  return value
    .replace(/%\\%/gu, "\\%")
    .replace(/%%/gu, "%")
    .replace(/\$([^$]+)\$%/gu, (_match, inner: string) => `$${inner}\\%$`);
}

function normalizeFinalStem(stem: string, locale: IntCp001Locale): string {
  let result = stem;
  if (locale === "hi") {
    result = result
      .replace(/वार्षिक दर ज्ञात कीजिए।$/u, "वार्षिक दर कितनी है?")
      .replace(/(\d+(?:\.\d+)?%) वार्षिक की साधारण ब्याज दर/gu, "$1 वार्षिक साधारण ब्याज की दर")
      .replace(/कुल राशि, मूलधन की कितनी गुना/gu, "कुल राशि, मूलधन का कितना गुना");
  } else {
    result = result
      .replace(/(\d+(?:\.\d+)?%) ਸਾਲਾਨਾ ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ/gu, "$1 ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਦਰ")
      .replace(/ਕੁੱਲ ਰਕਮ, ਮੂਲਧਨ ਦੀ ਕਿੰਨੀ ਗੁਣਾ/gu, "ਕੁੱਲ ਰਕਮ, ਮੂਲਧਨ ਦਾ ਕਿੰਨਾ ਗੁਣਾ");
  }
  return normalizePercentText(result);
}

function localizedTrapText(
  misconceptionId: string,
  optionText: string,
  existing: string,
  locale: IntCp001Locale,
): string {
  const hiOverrides: Record<string, string> = {
    PLAUSIBLE_SCALE_ERROR: "सही गणना के बजाय पास का लेकिन असमर्थित मान चुना गया।",
    ADDED_ONE_YEAR_TO_KNOWN_TIME: "दिए गए पहले समय में बिना अनुपात हल किए एक वर्ष जोड़ दिया गया।",
    REMOVED_ONE_YEAR_FROM_LATER_TIME: "सही बाद के समय में से बिना कारण एक वर्ष घटा दिया गया।",
    ADMISSIBLE_TIME_FROM_WRONG_RELATION: "यह समय देखने में संभव है, पर दिए गए राशि-अनुपात को संतुष्ट नहीं करता।",
  };
  const paOverrides: Record<string, string> = {
    PLAUSIBLE_SCALE_ERROR: "ਸਹੀ ਗਣਨਾ ਦੀ ਥਾਂ ਨੇੜਲਾ ਪਰ ਬਿਨਾਂ ਆਧਾਰ ਵਾਲਾ ਮੁੱਲ ਚੁਣਿਆ ਗਿਆ।",
    ADDED_ONE_YEAR_TO_KNOWN_TIME: "ਦਿੱਤੇ ਪਹਿਲੇ ਸਮੇਂ ਵਿੱਚ ਅਨੁਪਾਤ ਹੱਲ ਕੀਤੇ ਬਿਨਾਂ ਇੱਕ ਸਾਲ ਜੋੜ ਦਿੱਤਾ ਗਿਆ।",
    REMOVED_ONE_YEAR_FROM_LATER_TIME: "ਸਹੀ ਬਾਅਦਲੇ ਸਮੇਂ ਵਿੱਚੋਂ ਬਿਨਾਂ ਕਾਰਨ ਇੱਕ ਸਾਲ ਘਟਾ ਦਿੱਤਾ ਗਿਆ।",
    ADMISSIBLE_TIME_FROM_WRONG_RELATION: "ਇਹ ਸਮਾਂ ਵੇਖਣ ਵਿੱਚ ਸੰਭਵ ਹੈ, ਪਰ ਦਿੱਤੇ ਰਕਮ-ਅਨੁਪਾਤ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ।",
  };
  const base = (locale === "hi" ? hiOverrides : paOverrides)[misconceptionId] ?? existing;
  return locale === "hi"
    ? `यह विकल्प ${optionText} दिखाता है। ${base}`
    : `ਇਹ ਵਿਕਲਪ ${optionText} ਦਿਖਾਉਂਦਾ ਹੈ। ${base}`;
}

function monthAnswerWorking(
  raw: IntCp001LocalizedQuestion,
  locale: IntCp001Locale,
): string | undefined {
  const correct = raw.optionAudit[raw.correctIndex]?.result;
  if (!correct || correct.semantic !== "TIME_MONTHS" || !isRational(correct.value)) return undefined;

  const parameters = asRecord(raw.internalProvenance.sourceParameters);
  const state = asRecord(parameters?.hiddenState);
  const principal = readRational(state, "principal");
  const rate = readRational(state, "annualRatePercent");
  if (!principal || !rate) return undefined;

  const months = correct.value;
  const years = divideRational(months, rational(12));
  const yearLabel = locale === "hi" ? "वर्ष" : "ਸਾਲ";
  const monthLabel = locale === "hi"
    ? (months.numerator === months.denominator ? "महीना" : "महीने")
    : (months.numerator === months.denominator ? "ਮਹੀਨਾ" : "ਮਹੀਨੇ");
  const lead = locale === "hi" ? "सूत्र में मान रखें" : "ਸੂਤਰ ਵਿੱਚ ਮੁੱਲ ਰੱਖੋ";
  const converted = `${mathRational(years)}\\text{ ${yearLabel}}=${mathRational(months)}\\text{ ${monthLabel}}`;

  if (raw.solveContract === "FIND_TIME_FROM_INTEREST") {
    const interest = readRational(state, "laterInterest") ?? readRational(state, "simpleInterest");
    if (!interest) return undefined;
    return `${lead}: $$T=\\frac{100I}{PR}=\\frac{100\\times ${mathMoney(interest)}}{${mathMoney(principal)}\\times ${mathPercent(rate)}}=${converted}$$`;
  }
  if (raw.solveContract === "FIND_TIME_FROM_AMOUNT") {
    const amount = readRational(state, "laterAmount") ?? readRational(state, "amount");
    if (!amount) return undefined;
    const interest = subtractRational(amount, principal);
    return `${lead}: $$T=\\frac{100I}{PR}=\\frac{100\\times ${mathMoney(interest)}}{${mathMoney(principal)}\\times ${mathPercent(rate)}}=${converted}$$`;
  }
  return undefined;
}

function normalizeLocalizedItem(raw: IntCp001LocalizedQuestion, locale: IntCp001Locale): IntCp001LocalizedQuestion {
  const stem = normalizeFinalStem(raw.stem, locale);
  const options = raw.options.map(normalizePercentText);
  const optionAudit = raw.optionAudit.map((option, index) => ({
    ...option,
    text: options[index]!,
  }));
  const normalizedSteps = raw.explanation.stepByStep.steps.map(normalizePercentText);
  const monthWorking = monthAnswerWorking(raw, locale);
  if (monthWorking && normalizedSteps.length >= 2) normalizedSteps[1] = normalizePercentText(monthWorking);

  const trapItems = raw.explanation.trapAnalysis.items.map((trap) => ({
    ...trap,
    optionText: options[trap.optionNumber - 1]!,
    explanation: normalizePercentText(localizedTrapText(
      trap.misconceptionId,
      options[trap.optionNumber - 1]!,
      trap.explanation,
      locale,
    )),
  }));

  const explanation = {
    ...raw.explanation,
    notice: normalizePercentText(raw.explanation.notice),
    relation: normalizePercentText(raw.explanation.relation),
    steps: normalizedSteps,
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
      steps: normalizedSteps,
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
      items: trapItems,
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
  if (/%%|%\\%/u.test(text)) errors.push("Localized learner text contains malformed percentage notation.");
  if (/वार्षिक की साधारण ब्याज दर|ਸਾਲਾਨਾ ਦੀ ਸਧਾਰਣ ਵਿਆਜ ਦਰ/u.test(item.stem)) {
    errors.push("Localized stem contains an awkward annual-rate construction.");
  }
  if (/मूलधन की कितनी गुना|ਮੂਲਧਨ ਦੀ ਕਿੰਨੀ ਗੁਣਾ/u.test(item.stem)) {
    errors.push("Localized amount-multiple stem contains a gender-agreement defect.");
  }
  if (!item.explanation.stepByStep.conclusion.includes(item.options[item.correctIndex]!)) {
    errors.push("Localized conclusion lost the normalized correct option.");
  }
  if (new Set(item.explanation.trapAnalysis.items.map((trap) => trap.explanation)).size !== 3) {
    errors.push("Localized distractor explanations are not option-specific.");
  }

  const correct = item.optionAudit[item.correctIndex]?.result;
  if (correct?.semantic === "TIME_MONTHS") {
    const working = item.explanation.stepByStep.steps.join(" ");
    const monthToken = locale === "hi" ? /\\text\{ (?:महीना|महीने)\}/u : /\\text\{ (?:ਮਹੀਨਾ|ਮਹੀਨੇ)\}/u;
    if (!monthToken.test(working)) errors.push("Month-answer working does not display the answer in months.");
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
