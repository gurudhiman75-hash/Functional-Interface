import { equals, toLatex } from "./rational";
import type { Rational } from "./types";

type Language = "en" | "hi" | "pa";

interface Cp008Question {
  canonicalProblemId?: string;
  questionLanguageId?: string;
  parameters?: {
    totalPayment: Rational;
    targetIndex?: 0 | 1 | 2;
    context: { roles: Array<{ days: Rational; efficiency: Rational }> };
  };
  solution?: { answerValues: Rational[]; answerText: string };
  learnerExplanation?: { method: string; solution: string[]; answer: string };
  explanation?: { steps: string[]; conclusion: string };
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

function t(language: Language, en: string, hi: string, pa: string): string {
  return language === "hi" ? hi : language === "pa" ? pa : en;
}

function math(value: string): string { return `\\(${value}\\)`; }

export function polishTmwCp008VisibleGivens<T extends Cp008Question>(question: T, language: Language): T {
  if (question.canonicalProblemId !== "TMW-CP-008" || question.questionLanguageId !== "TMW-QL-148" || !question.parameters || !question.solution || !question.learnerExplanation) return question;
  const [a, b] = question.parameters.context.roles;
  if (!a || !b || !equals(a.efficiency, b.efficiency)) return question;

  const target = question.parameters.targetIndex ?? 0;
  const targetDays = target === 0 ? a.days : b.days;
  const totalDays: Rational = {
    numerator: a.days.numerator * b.days.denominator + b.days.numerator * a.days.denominator,
    denominator: a.days.denominator * b.days.denominator,
  };
  const answer = question.learnerExplanation.answer;
  const steps = [
    t(
      language,
      `The work rates and daily hours are equal; equal daily hours cancel, and the equal work-rate factor cancels too. Contribution ratio = ${math(`${toLatex(a.days)}:${toLatex(b.days)}`)}.`,
      `दोनों की काम-दर और प्रतिदिन घंटे समान हैं; प्रतिदिन समान घंटे कट जाते हैं और समान काम-दर भी कट जाती है। योगदान अनुपात = ${math(`${toLatex(a.days)}:${toLatex(b.days)}`)}।`,
      `ਦੋਵਾਂ ਦੀ ਕੰਮ-ਦਰ ਅਤੇ ਹਰ ਰੋਜ਼ ਘੰਟੇ ਇੱਕੋ ਹਨ; ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ ਜਾਂਦੇ ਹਨ ਅਤੇ ਇੱਕੋ ਕੰਮ-ਦਰ ਵੀ ਕੱਟ ਜਾਂਦੀ ਹੈ। ਯੋਗਦਾਨ ਅਨੁਪਾਤ = ${math(`${toLatex(a.days)}:${toLatex(b.days)}`)}।`,
    ),
    t(
      language,
      `Total contribution parts: ${math(`${toLatex(a.days)}+${toLatex(b.days)}=${toLatex(totalDays)}`)}.`,
      `कुल योगदान भाग: ${math(`${toLatex(a.days)}+${toLatex(b.days)}=${toLatex(totalDays)}`)}।`,
      `ਕੁੱਲ ਯੋਗਦਾਨ ਹਿੱਸੇ: ${math(`${toLatex(a.days)}+${toLatex(b.days)}=${toLatex(totalDays)}`)}।`,
    ),
    t(
      language,
      `Required payment: ${math(`${toLatex(question.parameters.totalPayment)}\\times\\frac{${toLatex(targetDays)}}{${toLatex(totalDays)}}=${toLatex(question.solution.answerValues[0])}`)}.`,
      `माँगा गया भुगतान: ${math(`${toLatex(question.parameters.totalPayment)}\\times\\frac{${toLatex(targetDays)}}{${toLatex(totalDays)}}=${toLatex(question.solution.answerValues[0])}`)}।`,
      `ਮੰਗਿਆ ਭੁਗਤਾਨ: ${math(`${toLatex(question.parameters.totalPayment)}\\times\\frac{${toLatex(targetDays)}}{${toLatex(totalDays)}}=${toLatex(question.solution.answerValues[0])}`)}।`,
    ),
    answer,
  ];
  const previousErrors = question.validation?.errors ?? [];
  return {
    ...question,
    learnerExplanation: { ...question.learnerExplanation, solution: steps },
    explanation: question.explanation ? { ...question.explanation, steps: steps.slice(0, -1), conclusion: answer } : question.explanation,
    validation: { valid: previousErrors.length === 0, errors: previousErrors },
    publiclyPublishable: false,
  };
}
