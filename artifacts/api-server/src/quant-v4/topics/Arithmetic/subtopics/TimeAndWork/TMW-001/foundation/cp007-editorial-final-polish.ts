import { divide, multiply, subtract, toLatex } from "./rational";
import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";
import type { TmwCp007Parameters, TmwCp007Solution } from "./cp007-types";

type Language = "en" | "hi" | "pa";

interface Cp007OptionAudit { text: string; [key: string]: unknown }
interface Cp007Question {
  canonicalProblemId?: string;
  cpId?: string;
  stem?: string;
  parameters?: TmwCp007Parameters;
  solution?: TmwCp007Solution;
  options?: string[];
  optionAudit?: Cp007OptionAudit[];
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

function t(language: Language, en: string, hi: string, pa: string): string {
  return language === "hi" ? hi : language === "pa" ? pa : en;
}

function math(value: string): string { return `\\(${value}\\)`; }

function fixNumberAgreement(text: string, language: Language): string {
  if (language === "hi") {
    return text
      .replace(/1 फाइलें/g, "1 फाइल")
      .replace(/1 पुर्ज़े/g, "1 पुर्ज़ा")
      .replace(/1 बोतलें/g, "1 बोतल")
      .replace(/1 प्रतियाँ/g, "1 प्रति")
      .replace(/1 कार्य-इकाइयाँ/g, "1 कार्य-इकाई");
  }
  if (language === "pa") {
    return text
      .replace(/1 ਫਾਈਲਾਂ/g, "1 ਫਾਈਲ")
      .replace(/1 ਪੁਰਜ਼ੇ/g, "1 ਪੁਰਜ਼ਾ")
      .replace(/1 ਬੋਤਲਾਂ/g, "1 ਬੋਤਲ")
      .replace(/1 ਕਾਪੀਆਂ/g, "1 ਕਾਪੀ")
      .replace(/1 ਕੰਮ-ਇਕਾਈਆਂ/g, "1 ਕੰਮ-ਇਕਾਈ");
  }
  return text;
}

function answerLine(answerText: string, language: Language): string {
  return t(language, `Therefore, the answer is ${answerText}.`, `अतः उत्तर है: ${answerText}।`, `ਇਸ ਲਈ ਉੱਤਰ ਹੈ: ${answerText}।`);
}

function replaceLast<T>(values: T[], last: T): T[] {
  return values.length ? [...values.slice(0, -1), last] : [last];
}

export function polishTmwCp007EditorialReview<T extends Cp007Question>(
  question: T,
  qlId: string,
  language: Language,
): T {
  if ((question.canonicalProblemId ?? question.cpId) !== "TMW-CP-007" || !question.learnerExplanation || !question.solution) return question;

  let stem = fixNumberAgreement(question.stem ?? "", language);
  let solution: TmwCp007Solution = { ...question.solution, answerText: fixNumberAgreement(question.solution.answerText, language) };
  let options = question.options?.map((option) => fixNumberAgreement(option, language));
  let optionAudit = question.optionAudit?.map((option) => ({ ...option, text: fixNumberAgreement(option.text, language) }));
  let learnerExplanation: TmwLearnerExplanationV2 = { ...question.learnerExplanation };

  if (qlId === "TMW-QL-134") {
    const answer = answerLine(solution.answerText, language);
    learnerExplanation = { ...learnerExplanation, answer, solution: replaceLast(learnerExplanation.solution, answer) };
  }

  if (qlId === "TMW-QL-128") {
    const a = solution.answerValues;
    const ratioStep = t(
      language,
      `Individual-rate ratio is the inverse of the group counts: ${math(`${toLatex(a[0])}:${toLatex(a[1])}`)}.`,
      `व्यक्तिगत दरों का अनुपात समूह की संख्याओं का उलटा है: ${math(`${toLatex(a[0])}:${toLatex(a[1])}`)}।`,
      `ਵਿਅਕਤੀਗਤ ਦਰਾਂ ਦਾ ਅਨੁਪਾਤ ਸਮੂਹ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਉਲਟ ਹੈ: ${math(`${toLatex(a[0])}:${toLatex(a[1])}`)}।`,
    );
    learnerExplanation = { ...learnerExplanation, solution: [ratioStep, learnerExplanation.answer] };
  }

  if (qlId === "TMW-QL-133" && question.parameters) {
    const p = question.parameters;
    const first = p.targetCategoryIndex ?? 0;
    const second = p.replacementCategoryIndex ?? 1;
    const firstRate = divide(p.workA, p.daysA);
    const secondRate = divide(p.workB, p.daysB);
    const increase = subtract(secondRate, firstRate);
    const firstCount = divide(increase, p.context.categories[first].efficiency);
    const secondCount = divide(subtract(firstRate, multiply(firstCount, p.context.categories[first].efficiency)), p.context.categories[second].efficiency);
    learnerExplanation = {
      ...learnerExplanation,
      solution: [
        t(language, `First crew rate: ${math(`\\frac{${toLatex(p.workA)}}{${toLatex(p.daysA)}}=${toLatex(firstRate)}`)}.`, `पहली स्थिति की समूह-दर: ${math(`\\frac{${toLatex(p.workA)}}{${toLatex(p.daysA)}}=${toLatex(firstRate)}`)}।`, `ਪਹਿਲੀ ਸਥਿਤੀ ਦੀ ਸਮੂਹ-ਦਰ: ${math(`\\frac{${toLatex(p.workA)}}{${toLatex(p.daysA)}}=${toLatex(firstRate)}`)}।`),
        t(language, `Second crew rate: ${math(`\\frac{${toLatex(p.workB)}}{${toLatex(p.daysB)}}=${toLatex(secondRate)}`)}.`, `दूसरी स्थिति की समूह-दर: ${math(`\\frac{${toLatex(p.workB)}}{${toLatex(p.daysB)}}=${toLatex(secondRate)}`)}।`, `ਦੂਜੀ ਸਥਿਤੀ ਦੀ ਸਮੂਹ-ਦਰ: ${math(`\\frac{${toLatex(p.workB)}}{${toLatex(p.daysB)}}=${toLatex(secondRate)}`)}।`),
        t(language, `First-category count from the rate increase: ${math(`\\frac{${toLatex(increase)}}{${toLatex(p.context.categories[first].efficiency)}}=${toLatex(firstCount)}`)}.`, `दर में हुई वृद्धि से पहली श्रेणी की संख्या: ${math(`\\frac{${toLatex(increase)}}{${toLatex(p.context.categories[first].efficiency)}}=${toLatex(firstCount)}`)}।`, `ਦਰ ਵਿੱਚ ਹੋਏ ਵਾਧੇ ਤੋਂ ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ: ${math(`\\frac{${toLatex(increase)}}{${toLatex(p.context.categories[first].efficiency)}}=${toLatex(firstCount)}`)}।`),
        t(language, `Second-category count from the first crew: ${math(`\\frac{${toLatex(firstRate)}-${toLatex(firstCount)}\\times${toLatex(p.context.categories[first].efficiency)}}{${toLatex(p.context.categories[second].efficiency)}}=${toLatex(secondCount)}`)}.`, `पहली स्थिति से दूसरी श्रेणी की संख्या: ${math(`\\frac{${toLatex(firstRate)}-${toLatex(firstCount)}\\times${toLatex(p.context.categories[first].efficiency)}}{${toLatex(p.context.categories[second].efficiency)}}=${toLatex(secondCount)}`)}।`, `ਪਹਿਲੀ ਸਥਿਤੀ ਤੋਂ ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ: ${math(`\\frac{${toLatex(firstRate)}-${toLatex(firstCount)}\\times${toLatex(p.context.categories[first].efficiency)}}{${toLatex(p.context.categories[second].efficiency)}}=${toLatex(secondCount)}`)}।`),
        learnerExplanation.answer,
      ],
    };
  }

  if (qlId === "TMW-QL-136" && language === "hi") {
    stem = stem.replace(/उसकी पूर्णता अवधि ([^।]+) है।/g, "यह काम $1 में पूरा होता है।");
  }

  if (qlId === "TMW-QL-138" && language === "pa") {
    stem = stem.replace(/ਬਰਾਬਰ/g, "ਸਮਤੁੱਲ");
    solution = { ...solution, answerText: solution.answerText.replace(/ਬਰਾਬਰ/g, "ਸਮਤੁੱਲ") };
    options = options?.map((option) => option.replace(/ਬਰਾਬਰ/g, "ਸਮਤੁੱਲ"));
    optionAudit = optionAudit?.map((option) => ({ ...option, text: option.text.replace(/ਬਰਾਬਰ/g, "ਸਮਤੁੱਲ") }));
    const answer = answerLine(solution.answerText, language);
    learnerExplanation = { ...learnerExplanation, answer, solution: replaceLast(learnerExplanation.solution, answer) };
  }

  if (qlId === "TMW-QL-139") {
    if (language === "hi") stem = stem.replace(/सबसे छोटी धनात्मक पूर्णांक संरचना क्या है\?/g, "सबसे कम कुल सदस्यों वाली संभव जोड़ी कौन-सी है?");
    if (language === "pa") stem = stem.replace(/ਸਭ ਤੋਂ ਛੋਟੀ ਧਨਾਤਮਕ ਪੂਰਨ-ਅੰਕ ਬਣਤਰ ਕੀ ਹੈ\?/g, "ਸਭ ਤੋਂ ਘੱਟ ਕੁੱਲ ਮੈਂਬਰਾਂ ਵਾਲੀ ਸੰਭਵ ਜੋੜੀ ਕਿਹੜੀ ਹੈ?");
  }

  if (qlId === "TMW-QL-140" && language === "hi" && /मशीन/.test(stem)) {
    stem = stem.replace(/(मशीनें मिलकर [^।]+) पूरा करते हैं/g, "$1 पूरा करती हैं");
    const p = question.parameters;
    if (p) {
      const combinedRate = divide(p.workA, p.daysA);
      learnerExplanation = {
        ...learnerExplanation,
        solution: [
          t(language, `Combined crew rate: ${math(toLatex(combinedRate))}.`, `संयुक्त समूह-दर: ${math(toLatex(combinedRate))}।`, `ਸਾਂਝੀ ਸਮੂਹ-ਦਰ: ${math(toLatex(combinedRate))}।`),
          ...learnerExplanation.solution.slice(1),
        ],
      };
    }
  }

  if (qlId === "TMW-QL-141" && question.parameters) {
    const p = question.parameters;
    const target = p.targetCategoryIndex ?? 0;
    const contribution = multiply(p.crewA[target], p.context.categories[target].efficiency);
    const total = p.crewA.reduce((sum, count, index) => ({
      numerator: sum.numerator * count.denominator * p.context.categories[index].efficiency.denominator + count.numerator * p.context.categories[index].efficiency.numerator * sum.denominator,
      denominator: sum.denominator * count.denominator * p.context.categories[index].efficiency.denominator,
    }), { numerator: 0, denominator: 1 });
    const fraction = divide(contribution, total);
    const third = t(language, `Required fraction: ${math(toLatex(fraction))}.`, `आवश्यक भाग: ${math(toLatex(fraction))}।`, `ਲੋੜੀਂਦਾ ਹਿੱਸਾ: ${math(toLatex(fraction))}।`);
    learnerExplanation = { ...learnerExplanation, solution: [...learnerExplanation.solution.slice(0, 2), third, learnerExplanation.answer] };
  }

  if (qlId === "TMW-QL-142") {
    const a = solution.answerValues;
    const third = t(language, `Rate ratio A:B: ${math(`${toLatex(a[0])}:${toLatex(a[1])}`)}.`, `दर अनुपात A:B: ${math(`${toLatex(a[0])}:${toLatex(a[1])}`)}।`, `ਦਰ ਅਨੁਪਾਤ A:B: ${math(`${toLatex(a[0])}:${toLatex(a[1])}`)}।`);
    learnerExplanation = { ...learnerExplanation, solution: [...learnerExplanation.solution.slice(0, 2), third, learnerExplanation.answer] };
  }

  const fixedAnswer = answerLine(solution.answerText, language);
  learnerExplanation = {
    ...learnerExplanation,
    answer: fixedAnswer,
    solution: replaceLast(learnerExplanation.solution, fixedAnswer),
  };

  const previousErrors = (question.validation?.errors ?? []).filter((error) => error !== "CP007 multilingual editorial review: internal solver notation or English trace remains");
  const learnerErrors = validateTmwLearnerExplanationV2(learnerExplanation);
  const learnerText = [learnerExplanation.method, ...learnerExplanation.solution, learnerExplanation.answer].join(" ");
  const traceErrors: string[] = [];
  if (/\\text\{|\bsource capacity\b|\btarget contribution\b|\btotal contribution\b|\bleast feasible\b|\bcomponents per\b|\bcopies per\b|\bweighted contribution\b|R_\d|e_[A-Za-z]|r_[A-Za-z]|n_[A-Za-z]|T_[A-Za-z]/.test(learnerText)) {
    traceErrors.push("CP007 final polish: internal solver notation or untranslated trace remains");
  }

  return {
    ...question,
    stem,
    solution,
    options,
    optionAudit,
    learnerExplanation,
    validation: {
      valid: previousErrors.length === 0 && learnerErrors.length === 0 && traceErrors.length === 0,
      errors: [...previousErrors, ...learnerErrors.map((error) => `CP007 final polish: ${error}`), ...traceErrors],
    },
    publiclyPublishable: false,
  };
}
