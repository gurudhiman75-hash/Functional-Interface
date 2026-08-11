import { formatDurationYears as formatEnglishDurationYears } from "./foundation/cp001-presentation";
import { deterministicIndex, rotate } from "./foundation/prng";
import {
  absoluteRational,
  addRational,
  compareRational,
  divideRational,
  formatExact,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
  toLatex,
} from "./foundation/rational";
import type { Rational } from "./foundation/types";
import type { IntCp001FinalQlId } from "./cp001-final-registry";
import {
  formatDurationYears as formatLocalizedDurationYears,
  formatIndianInteger,
  formatMonths,
  isRational,
} from "./cp001-localization-foundation";
import type { IntCp001Locale } from "./cp001-multilingual-release";
import {
  generateIntCp001ReadableEnglishQuestion,
  generateIntCp001ReadableLocalizedQuestion,
  type IntCp001ReadableEnglishQuestion,
  type IntCp001ReadableLocalizedQuestion,
} from "./cp001-readable-stem-runtime";
import {
  getIntCp001CloseDistractorReleaseId,
  INT_CP001_CLOSE_DISTRACTOR_PATCH_ID,
  type IntCp001CloseDistractorLanguage,
} from "./cp001-close-distractor-release";

type BaseQuestion = IntCp001ReadableEnglishQuestion | IntCp001ReadableLocalizedQuestion;
type BaseResult = IntCp001ReadableEnglishQuestion["optionAudit"][number]["result"];
type BaseExplanation = IntCp001ReadableEnglishQuestion["explanation"];
type DistractorFamily = "MONEY" | "RATE" | "TIME_MONTHS" | "TIME_YEARS" | "RATIO";
type CloseMisconceptionId = string;

export interface IntCp001CloseOptionAudit {
  text: string;
  result: BaseResult;
  misconceptionId: CloseMisconceptionId;
  proximityOrigin: "RETAINED_CONCEPT_TRAP" | "GENERATED_NEAR_MISS" | "CORRECT";
  absoluteDistance: Rational;
  relativeDistanceBps: number;
}

export interface IntCp001CloseTrapItem {
  optionNumber: number;
  optionText: string;
  misconceptionId: CloseMisconceptionId;
  explanation: string;
}

export type IntCp001CloseExplanation = Omit<BaseExplanation, "trapAnalysis"> & {
  trapAnalysis: Omit<BaseExplanation["trapAnalysis"], "items"> & {
    items: IntCp001CloseTrapItem[];
  };
};

interface CloseDistractorTrace {
  patchId: typeof INT_CP001_CLOSE_DISTRACTOR_PATCH_ID;
  supersedesReleaseId: string;
  retainedConceptDistractors: number;
  generatedNearMisses: number;
  hasLowerDistractor: boolean;
  hasUpperDistractor: boolean;
  maximumRelativeDistanceBps: number;
}

export type IntCp001CloseDistractorEnglishQuestion = Omit<
  IntCp001ReadableEnglishQuestion,
  "releaseId" | "maturity" | "reviewStatus" | "localeReviewStatus" |
  "options" | "optionAudit" | "explanation" | "validation"
> & {
  releaseId: "INT-CP-001-EN-v5";
  maturity: "CLOSE_DISTRACTOR_EDITORIAL_CANDIDATE";
  reviewStatus: "PENDING_MULTILINGUAL_DISTRACTOR_REVIEW";
  localeReviewStatus: "PENDING_HUMAN_REVIEW";
  options: string[];
  optionAudit: IntCp001CloseOptionAudit[];
  explanation: IntCp001CloseExplanation;
  distractorEditorialTrace: CloseDistractorTrace;
  validation: IntCp001ReadableEnglishQuestion["validation"];
};

export type IntCp001CloseDistractorLocalizedQuestion = Omit<
  IntCp001ReadableLocalizedQuestion,
  "releaseId" | "maturity" | "reviewStatus" | "localeReviewStatus" |
  "options" | "optionAudit" | "explanation" | "validation"
> & {
  releaseId: "INT-CP-001-HI-v4" | "INT-CP-001-PA-v4";
  maturity: "CLOSE_DISTRACTOR_EDITORIAL_CANDIDATE";
  reviewStatus: "PENDING_MULTILINGUAL_DISTRACTOR_REVIEW";
  localeReviewStatus: "PENDING_HUMAN_REVIEW";
  options: string[];
  optionAudit: IntCp001CloseOptionAudit[];
  explanation: IntCp001CloseExplanation;
  distractorEditorialTrace: CloseDistractorTrace;
  validation: IntCp001ReadableLocalizedQuestion["validation"];
};

interface WorkingCandidate {
  value: Rational;
  misconceptionId: CloseMisconceptionId;
  origin: "RETAINED_CONCEPT_TRAP" | "GENERATED_NEAR_MISS";
  sourceExplanation?: string;
}

function fail(message: string): never {
  throw new Error(message);
}

function requireRational(value: unknown, label: string): Rational {
  if (!isRational(value)) fail(`Close-distractor runtime requires rational ${label}.`);
  return value;
}

function familyFor(question: BaseQuestion): DistractorFamily {
  if (["SIMPLE_INTEREST", "TOTAL_AMOUNT", "PRINCIPAL", "ANNUAL_INTEREST"].includes(question.answerSemantic)) {
    return "MONEY";
  }
  if (question.answerSemantic === "ANNUAL_RATE_PERCENT") return "RATE";
  if (question.answerSemantic === "TIME") {
    return question.internalProvenance.answerUnit === "MONTHS" ? "TIME_MONTHS" : "TIME_YEARS";
  }
  return "RATIO";
}

function distance(correct: Rational, candidate: Rational): Rational {
  return absoluteRational(subtractRational(candidate, correct));
}

function relativeDistanceBps(correct: Rational, candidate: Rational): number {
  const scaled = divideRational(multiplyRational(distance(correct, candidate), rational(10_000)), correct);
  return Number(scaled.numerator / scaled.denominator);
}

function closeEnough(family: DistractorFamily, correct: Rational, candidate: Rational): boolean {
  const gap = distance(correct, candidate);
  if (compareRational(gap, rational(0)) <= 0 || compareRational(candidate, rational(0)) <= 0) return false;
  if (family === "MONEY") return compareRational(divideRational(gap, correct), rational(1, 4)) <= 0;
  if (family === "RATE") return compareRational(gap, rational(3)) <= 0;
  if (family === "TIME_MONTHS") return compareRational(gap, rational(6)) <= 0;
  if (family === "TIME_YEARS") return compareRational(gap, rational(2)) <= 0;
  return compareRational(gap, rational(1, 4)) <= 0;
}

function moneyStep(correct: Rational): Rational {
  const whole = (correct.numerator < 0n ? -correct.numerator : correct.numerator) / correct.denominator;
  if (whole >= 100_000n) return rational(5_000);
  if (whole >= 50_000n) return rational(2_500);
  if (whole >= 20_000n) return rational(1_000);
  if (whole >= 10_000n) return rational(500);
  if (whole >= 5_000n) return rational(250);
  if (whole >= 2_000n) return rational(100);
  if (whole >= 1_000n) return rational(50);
  if (whole >= 500n) return rational(25);
  if (whole >= 200n) return rational(10);
  if (whole >= 100n) return rational(5);
  if (whole >= 50n) return rational(2);
  if (whole >= 10n) return rational(1);
  return rational(1, 2);
}

function stepFor(family: DistractorFamily, correct: Rational): Rational {
  if (family === "MONEY") return moneyStep(correct);
  if (family === "RATE") {
    if (compareRational(correct, rational(2)) <= 0) return rational(1, 4);
    if (compareRational(correct, rational(5)) <= 0) return rational(1, 2);
    return rational(1);
  }
  if (family === "TIME_MONTHS") return rational(1);
  if (family === "TIME_YEARS") {
    if (compareRational(correct, rational(1)) < 0) return rational(1, 12);
    if (compareRational(correct, rational(3)) <= 0) return rational(1, 2);
    return rational(1);
  }
  if (correct.denominator <= 10n) return rational(1n, 20n);
  if (correct.denominator <= 40n) return rational(1n, correct.denominator * 2n);
  if (correct.denominator <= 100n) return rational(1n, correct.denominator);
  return rational(1n, 100n);
}

function groupIndianDecimal(raw: string): string {
  const negative = raw.startsWith("-");
  const unsigned = negative ? raw.slice(1) : raw;
  const [whole = "0", fraction] = unsigned.split(".");
  const grouped = whole.length <= 3
    ? whole
    : `${whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/gu, ",")},${whole.slice(-3)}`;
  return `${negative ? "-" : ""}${grouped}${fraction ? `.${fraction}` : ""}`;
}

function formatMoney(value: Rational): string {
  if (value.denominator === 1n) return `₹${formatIndianInteger(value.numerator)}`;
  const exact = formatExact(value);
  if (!exact.includes("/")) return `₹${groupIndianDecimal(exact)}`;
  return `₹$${toLatex(value)}$`;
}

function mixedLatex(value: Rational): string {
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  const sign = value.numerator < 0n ? "-" : "";
  if (value.denominator === 1n) return `${sign}${numerator}`;
  if (numerator > value.denominator) {
    const whole = numerator / value.denominator;
    const remainder = numerator % value.denominator;
    return remainder === 0n
      ? `${sign}${whole}`
      : `${sign}${whole}\\frac{${remainder}}{${value.denominator}}`;
  }
  return `${sign}\\frac{${numerator}}{${value.denominator}}`;
}

function formatTimeMonths(value: Rational, language: IntCp001CloseDistractorLanguage): string {
  if (value.denominator !== 1n) {
    const years = divideRational(value, rational(12));
    return language === "en"
      ? formatEnglishDurationYears(years)
      : formatLocalizedDurationYears(years, language);
  }
  if (language === "en") return `${value.numerator} ${value.numerator === 1n ? "month" : "months"}`;
  return formatMonths(value.numerator, language);
}

function formatRatio(value: Rational, answerSemantic: string, language: IntCp001CloseDistractorLanguage): string {
  const amountMultiple = answerSemantic === "AMOUNT_MULTIPLE";
  if (language === "en") {
    if (amountMultiple || compareRational(value, rational(1)) > 0) return `$${mixedLatex(value)}$ times the principal`;
    return `$${toLatex(value)}$ of the principal`;
  }
  const inline = `$${toLatex(value)}$`;
  if (amountMultiple || compareRational(value, rational(1)) > 0) {
    return language === "hi" ? `${inline} गुना मूलधन` : `${inline} ਗੁਣਾ ਮੂਲਧਨ`;
  }
  return language === "hi" ? `मूलधन का ${inline}` : `ਮੂਲਧਨ ਦਾ ${inline}`;
}

function formatCandidate(
  value: Rational,
  family: DistractorFamily,
  answerSemantic: string,
  language: IntCp001CloseDistractorLanguage,
): string {
  if (family === "MONEY") return formatMoney(value);
  if (family === "RATE") {
    const suffix = language === "en" ? "per annum" : language === "hi" ? "वार्षिक" : "ਸਾਲਾਨਾ";
    return `${formatExact(value)}% ${suffix}`;
  }
  if (family === "TIME_MONTHS") return formatTimeMonths(value, language);
  if (family === "TIME_YEARS") {
    return language === "en" ? formatEnglishDurationYears(value) : formatLocalizedDurationYears(value, language);
  }
  return formatRatio(value, answerSemantic, language);
}

function generatedExplanation(
  language: IntCp001CloseDistractorLanguage,
  optionText: string,
  misconceptionId: CloseMisconceptionId,
): string {
  if (language === "en") {
    if (misconceptionId === "NEAR_CALCULATION_LOW") {
      return `${optionText} is a plausible near miss caused by a small under-calculation in the final arithmetic.`;
    }
    if (misconceptionId === "NEAR_CALCULATION_HIGH") {
      return `${optionText} is a plausible near miss caused by a small over-calculation in the final arithmetic.`;
    }
    return `${optionText} results from moving one numerical input by a second small step before completing the calculation.`;
  }
  if (language === "hi") {
    if (misconceptionId === "NEAR_CALCULATION_LOW") {
      return `${optionText} अंतिम गणना में थोड़ी कम गणना करने से मिलने वाला पास का, लेकिन गलत मान है।`;
    }
    if (misconceptionId === "NEAR_CALCULATION_HIGH") {
      return `${optionText} अंतिम गणना में थोड़ी अधिक गणना करने से मिलने वाला पास का, लेकिन गलत मान है।`;
    }
    return `${optionText} किसी एक संख्यात्मक मान को एक अतिरिक्त छोटे चरण से बदलकर गणना करने पर मिलता है।`;
  }
  if (misconceptionId === "NEAR_CALCULATION_LOW") {
    return `${optionText} ਆਖਰੀ ਗਣਨਾ ਵਿੱਚ ਥੋੜ੍ਹੀ ਘੱਟ ਗਿਣਤੀ ਕਰਨ ਨਾਲ ਮਿਲਣ ਵਾਲਾ ਨੇੜਲਾ, ਪਰ ਗਲਤ ਮੁੱਲ ਹੈ।`;
  }
  if (misconceptionId === "NEAR_CALCULATION_HIGH") {
    return `${optionText} ਆਖਰੀ ਗਣਨਾ ਵਿੱਚ ਥੋੜ੍ਹੀ ਵੱਧ ਗਿਣਤੀ ਕਰਨ ਨਾਲ ਮਿਲਣ ਵਾਲਾ ਨੇੜਲਾ, ਪਰ ਗਲਤ ਮੁੱਲ ਹੈ।`;
  }
  return `${optionText} ਕਿਸੇ ਇੱਕ ਅੰਕੀ ਮੁੱਲ ਨੂੰ ਇੱਕ ਹੋਰ ਛੋਟੇ ਕਦਮ ਨਾਲ ਬਦਲ ਕੇ ਗਣਨਾ ਕਰਨ ਤੇ ਮਿਲਦਾ ਹੈ।`;
}

function sourceTrapExplanation(question: BaseQuestion, sourceIndex: number): string | undefined {
  return question.explanation.trapAnalysis.items.find((item) => item.optionNumber === sourceIndex + 1)?.explanation;
}

function buildWrongCandidates(
  question: BaseQuestion,
  family: DistractorFamily,
  correct: Rational,
): WorkingCandidate[] {
  const step = stepFor(family, correct);
  const candidates: WorkingCandidate[] = [];
  const seen = new Set<string>([rationalKey(correct)]);
  const add = (value: Rational, misconceptionId: string): void => {
    if (!closeEnough(family, correct, value)) return;
    const key = rationalKey(value);
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({ value, misconceptionId, origin: "GENERATED_NEAR_MISS" });
  };

  for (let factor = 1; factor <= 8 && !candidates.some((item) => compareRational(item.value, correct) < 0); factor += 1) {
    add(subtractRational(correct, multiplyRational(step, rational(factor))), "NEAR_CALCULATION_LOW");
  }
  for (let factor = 1; factor <= 8 && !candidates.some((item) => compareRational(item.value, correct) > 0); factor += 1) {
    add(addRational(correct, multiplyRational(step, rational(factor))), "NEAR_CALCULATION_HIGH");
  }

  const retained = question.optionAudit
    .map((audit, index) => ({ audit, index }))
    .filter(({ index }) => index !== question.correctIndex)
    .filter(({ audit }) => isRational(audit.result.value))
    .map(({ audit, index }) => ({
      value: audit.result.value as Rational,
      misconceptionId: audit.misconceptionId,
      origin: "RETAINED_CONCEPT_TRAP" as const,
      sourceExplanation: sourceTrapExplanation(question, index),
    }))
    .filter((item) => closeEnough(family, correct, item.value))
    .filter((item) => !seen.has(rationalKey(item.value)))
    .sort((left, right) => compareRational(distance(correct, left.value), distance(correct, right.value)))[0];

  if (retained) {
    seen.add(rationalKey(retained.value));
    candidates.push(retained);
  }

  const firstDirection = deterministicIndex(`${question.qlId}:${question.seed}:third-close-distractor`, 2) === 0 ? -1 : 1;
  for (const direction of [firstDirection, -firstDirection]) {
    for (let factor = 2; candidates.length < 3 && factor <= 8; factor += 1) {
      add(
        addRational(correct, multiplyRational(step, rational(factor * direction))),
        "SECOND_STEP_INPUT_SLIP",
      );
    }
  }

  if (candidates.length < 3) fail(`${question.qlId}/${question.seed}: unable to build three close distractors.`);
  return candidates.slice(0, 3);
}

function buildCloseQuestion(
  question: BaseQuestion,
  language: IntCp001CloseDistractorLanguage,
): {
  options: string[];
  optionAudit: IntCp001CloseOptionAudit[];
  explanation: IntCp001CloseExplanation;
  trace: CloseDistractorTrace;
  errors: string[];
} {
  const family = familyFor(question);
  const correctSource = question.optionAudit[question.correctIndex];
  if (!correctSource) fail(`${question.qlId}/${question.seed}: missing correct option audit.`);
  const correct = requireRational(correctSource.result.value, "correct option value");
  const orderedWrong = rotate(
    buildWrongCandidates(question, family, correct),
    deterministicIndex(`${question.qlId}:${question.seed}:close-distractor-order`, 3),
  );

  const options: string[] = [];
  const optionAudit: IntCp001CloseOptionAudit[] = [];
  const workingByOption = new Map<number, WorkingCandidate>();
  let cursor = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === question.correctIndex) {
      const text = question.options[index]!;
      options.push(text);
      optionAudit.push({
        text,
        result: correctSource.result,
        misconceptionId: "CORRECT",
        proximityOrigin: "CORRECT",
        absoluteDistance: rational(0),
        relativeDistanceBps: 0,
      });
      continue;
    }
    const working = orderedWrong[cursor++]!;
    const text = formatCandidate(working.value, family, question.answerSemantic, language);
    workingByOption.set(index, working);
    options.push(text);
    optionAudit.push({
      text,
      result: { semantic: correctSource.result.semantic, value: working.value } as BaseResult,
      misconceptionId: working.misconceptionId,
      proximityOrigin: working.origin,
      absoluteDistance: distance(correct, working.value),
      relativeDistanceBps: relativeDistanceBps(correct, working.value),
    });
  }

  const trapItems: IntCp001CloseTrapItem[] = optionAudit
    .map((audit, index) => ({ audit, index }))
    .filter(({ index }) => index !== question.correctIndex)
    .map(({ audit, index }) => {
      const working = workingByOption.get(index)!;
      return {
        optionNumber: index + 1,
        optionText: audit.text,
        misconceptionId: audit.misconceptionId,
        explanation: working.sourceExplanation ?? generatedExplanation(language, audit.text, audit.misconceptionId),
      };
    });

  const explanation: IntCp001CloseExplanation = {
    ...question.explanation,
    trapAnalysis: { ...question.explanation.trapAnalysis, items: trapItems },
  };

  const errors = [...question.validation.errors];
  if (options.length !== 4 || new Set(options).size !== 4) {
    errors.push("Close-distractor candidate must contain four unique option texts.");
  }
  if (options[question.correctIndex] !== question.options[question.correctIndex]) {
    errors.push("Close-distractor candidate changed the correct option text.");
  }
  if (optionAudit[question.correctIndex]?.misconceptionId !== "CORRECT") {
    errors.push("Close-distractor candidate moved or relabelled the correct option.");
  }
  if (trapItems.length !== 3) errors.push("Close-distractor candidate must explain exactly three wrong options.");

  const wrongAudits = optionAudit.filter((_audit, index) => index !== question.correctIndex);
  const hasLower = wrongAudits.some((audit) => compareRational(requireRational(audit.result.value, "distractor value"), correct) < 0);
  const hasUpper = wrongAudits.some((audit) => compareRational(requireRational(audit.result.value, "distractor value"), correct) > 0);
  if (!hasLower || !hasUpper) {
    errors.push("Close-distractor candidate must bracket the correct answer with lower and upper near misses.");
  }
  for (const audit of wrongAudits) {
    const value = requireRational(audit.result.value, "distractor value");
    if (!closeEnough(family, correct, value)) errors.push(`Distractor ${audit.text} exceeds the ${family} proximity boundary.`);
    if (compareRational(value, correct) === 0) errors.push(`Distractor ${audit.text} duplicates the exact answer value.`);
  }
  for (const trap of trapItems) {
    if (trap.optionText !== options[trap.optionNumber - 1]) {
      errors.push(`Close-distractor trap ${trap.optionNumber} is out of sync with its displayed option.`);
    }
  }

  const retainedConceptDistractors = wrongAudits.filter((audit) => audit.proximityOrigin === "RETAINED_CONCEPT_TRAP").length;
  return {
    options,
    optionAudit,
    explanation,
    trace: {
      patchId: INT_CP001_CLOSE_DISTRACTOR_PATCH_ID,
      supersedesReleaseId: question.releaseId,
      retainedConceptDistractors,
      generatedNearMisses: 3 - retainedConceptDistractors,
      hasLowerDistractor: hasLower,
      hasUpperDistractor: hasUpper,
      maximumRelativeDistanceBps: Math.max(...wrongAudits.map((audit) => audit.relativeDistanceBps)),
    },
    errors,
  };
}

export function generateIntCp001CloseDistractorEnglishQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
): IntCp001CloseDistractorEnglishQuestion {
  const readable = generateIntCp001ReadableEnglishQuestion(qlId, seed);
  const built = buildCloseQuestion(readable, "en");
  return {
    ...readable,
    releaseId: getIntCp001CloseDistractorReleaseId("en"),
    maturity: "CLOSE_DISTRACTOR_EDITORIAL_CANDIDATE",
    reviewStatus: "PENDING_MULTILINGUAL_DISTRACTOR_REVIEW",
    localeReviewStatus: "PENDING_HUMAN_REVIEW",
    options: built.options,
    optionAudit: built.optionAudit,
    explanation: built.explanation,
    distractorEditorialTrace: built.trace,
    validation: { ...readable.validation, ok: built.errors.length === 0, errors: built.errors },
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function generateIntCp001CloseDistractorLocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001CloseDistractorLocalizedQuestion {
  const readable = generateIntCp001ReadableLocalizedQuestion(qlId, seed, locale);
  const built = buildCloseQuestion(readable, locale);
  return {
    ...readable,
    releaseId: getIntCp001CloseDistractorReleaseId(locale),
    maturity: "CLOSE_DISTRACTOR_EDITORIAL_CANDIDATE",
    reviewStatus: "PENDING_MULTILINGUAL_DISTRACTOR_REVIEW",
    localeReviewStatus: "PENDING_HUMAN_REVIEW",
    options: built.options,
    optionAudit: built.optionAudit,
    explanation: built.explanation,
    distractorEditorialTrace: built.trace,
    validation: { ...readable.validation, ok: built.errors.length === 0, errors: built.errors },
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
