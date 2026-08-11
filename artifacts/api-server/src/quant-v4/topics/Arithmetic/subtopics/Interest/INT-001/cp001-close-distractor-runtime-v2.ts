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
import {
  formatDurationYears as formatLocalizedDurationYears,
  formatIndianInteger,
  formatMonths,
  isRational,
} from "./cp001-localization-foundation";
import type { IntCp001FinalQlId } from "./cp001-final-registry";
import type { IntCp001Locale } from "./cp001-multilingual-release";
import type { IntCp001CloseDistractorLanguage } from "./cp001-close-distractor-release";
import {
  generateIntCp001CloseDistractorEnglishQuestion as generateV1English,
  generateIntCp001CloseDistractorLocalizedQuestion as generateV1Localized,
  type IntCp001CloseDistractorEnglishQuestion,
  type IntCp001CloseDistractorLocalizedQuestion,
  type IntCp001CloseOptionAudit,
  type IntCp001CloseTrapItem,
} from "./cp001-close-distractor-runtime";

type CloseQuestion = IntCp001CloseDistractorEnglishQuestion | IntCp001CloseDistractorLocalizedQuestion;
type Result = IntCp001CloseOptionAudit["result"];
type Family = "MONEY" | "RATE" | "TIME_MONTHS" | "TIME_YEARS" | "RATIO";

interface Candidate {
  value: Rational;
  misconceptionId: string;
  origin: "RETAINED_CONCEPT_TRAP" | "GENERATED_NEAR_MISS";
  explanation?: string;
}

function fail(message: string): never {
  throw new Error(message);
}

function requireRational(value: unknown, label: string): Rational {
  if (!isRational(value)) fail(`Close-distractor V2 requires rational ${label}.`);
  return value;
}

function familyFor(question: CloseQuestion): Family {
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

function stepFor(family: Family, correct: Rational): Rational {
  if (family === "MONEY") return moneyStep(correct);
  if (family === "RATE") {
    if (compareRational(correct, rational(2)) <= 0) return rational(1, 4);
    if (compareRational(correct, rational(5)) <= 0) return rational(1, 2);
    return rational(1);
  }
  if (family === "TIME_MONTHS") {
    return compareRational(correct, rational(4)) <= 0 ? rational(1, 2) : rational(1);
  }
  if (family === "TIME_YEARS") {
    if (compareRational(correct, rational(1)) <= 0) return rational(1, 12);
    if (compareRational(correct, rational(2)) <= 0) return rational(1, 6);
    if (compareRational(correct, rational(4)) <= 0) return rational(1, 4);
    if (compareRational(correct, rational(8)) <= 0) return rational(1, 2);
    return rational(1);
  }
  return rational(1, 20);
}

function generatedBoundary(family: Family, correct: Rational, candidate: Rational): boolean {
  if (compareRational(candidate, rational(0)) <= 0 || compareRational(candidate, correct) === 0) return false;
  const relative = relativeDistanceBps(correct, candidate);
  if (family === "MONEY") return relative <= 1500;
  if (family === "RATE") return compareRational(distance(correct, candidate), rational(2)) <= 0;
  if (family === "TIME_MONTHS") return compareRational(distance(correct, candidate), rational(2)) <= 0;
  if (family === "TIME_YEARS") {
    if (compareRational(correct, rational(1, 12)) <= 0) {
      return compareRational(distance(correct, candidate), rational(1, 24)) <= 0;
    }
    if (compareRational(correct, rational(1)) <= 0) {
      return compareRational(distance(correct, candidate), rational(1, 12)) <= 0;
    }
    return relative <= 2500 && compareRational(distance(correct, candidate), rational(1)) <= 0;
  }
  return relative <= 2500 && compareRational(distance(correct, candidate), rational(1, 4)) <= 0;
}

function retainedConceptCandidate(question: CloseQuestion, correct: Rational): Candidate | undefined {
  return question.optionAudit
    .map((audit, index) => ({ audit, index }))
    .filter(({ index }) => index !== question.correctIndex)
    .filter(({ audit }) => audit.proximityOrigin === "RETAINED_CONCEPT_TRAP")
    .filter(({ audit }) => isRational(audit.result.value))
    .map(({ audit, index }) => ({
      value: audit.result.value as Rational,
      misconceptionId: audit.misconceptionId,
      origin: "RETAINED_CONCEPT_TRAP" as const,
      explanation: question.explanation.trapAnalysis.items
        .find((trap) => trap.optionNumber === index + 1)?.explanation,
    }))
    .filter((candidate) => relativeDistanceBps(correct, candidate.value) <= 1500)
    .sort((left, right) => compareRational(distance(correct, left.value), distance(correct, right.value)))[0];
}

function ratioPool(correct: Rational): Rational[] {
  const values: Rational[] = [];
  if (compareRational(correct, rational(1)) >= 0) {
    const step = rational(1, 20);
    for (const signedFactor of [-1, 1, -2, 2, -3, 3]) {
      values.push(addRational(correct, multiplyRational(step, rational(signedFactor))));
    }
    return values;
  }

  const numerator = correct.numerator;
  const denominator = correct.denominator;
  for (let delta = 1n; delta <= 5n; delta += 1n) {
    if (denominator > delta) values.push(rational(numerator, denominator - delta));
    values.push(rational(numerator, denominator + delta));
  }
  values.push(
    subtractRational(correct, divideRational(correct, rational(10))),
    addRational(correct, divideRational(correct, rational(10))),
    subtractRational(correct, divideRational(correct, rational(5))),
    addRational(correct, divideRational(correct, rational(5))),
  );
  return values;
}

function shortYearPool(correct: Rational): Rational[] {
  const offsets = compareRational(correct, rational(1, 12)) <= 0
    ? [rational(1, 48), rational(1, 24), rational(1, 16)]
    : [rational(1, 24), rational(1, 12), rational(1, 8)];
  return offsets.flatMap((offset) => [
    subtractRational(correct, offset),
    addRational(correct, offset),
  ]);
}

function generatedPool(family: Family, correct: Rational): Rational[] {
  if (family === "RATIO") return ratioPool(correct);
  if (family === "TIME_YEARS" && compareRational(correct, rational(1)) <= 0) {
    return shortYearPool(correct);
  }
  const step = stepFor(family, correct);
  return [
    subtractRational(correct, step),
    addRational(correct, step),
    subtractRational(correct, multiplyRational(step, rational(2))),
    addRational(correct, multiplyRational(step, rational(2))),
    subtractRational(correct, multiplyRational(step, rational(3))),
    addRational(correct, multiplyRational(step, rational(3))),
  ];
}

function buildCandidates(question: CloseQuestion, family: Family, correct: Rational): Candidate[] {
  const seen = new Set<string>([rationalKey(correct)]);
  const generated = generatedPool(family, correct)
    .filter((value) => generatedBoundary(family, correct, value))
    .filter((value) => {
      const key = rationalKey(value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  const lower = generated
    .filter((value) => compareRational(value, correct) < 0)
    .sort((a, b) => compareRational(distance(correct, a), distance(correct, b)))[0];
  const upper = generated
    .filter((value) => compareRational(value, correct) > 0)
    .sort((a, b) => compareRational(distance(correct, a), distance(correct, b)))[0];
  if (!lower || !upper) fail(`${question.qlId}/${question.seed}: unable to bracket the answer with close values.`);

  const selected: Candidate[] = [
    { value: lower, misconceptionId: "NEAR_CALCULATION_LOW", origin: "GENERATED_NEAR_MISS" },
    { value: upper, misconceptionId: "NEAR_CALCULATION_HIGH", origin: "GENERATED_NEAR_MISS" },
  ];
  const selectedKeys = new Set(selected.map((candidate) => rationalKey(candidate.value)));
  const concept = retainedConceptCandidate(question, correct);
  if (concept && !selectedKeys.has(rationalKey(concept.value))) {
    selected.push(concept);
  } else {
    const remaining = generated
      .filter((value) => !selectedKeys.has(rationalKey(value)))
      .sort((a, b) => compareRational(distance(correct, a), distance(correct, b)));
    const preferredSide = deterministicIndex(`${question.qlId}:${question.seed}:v2-third-side`, 2) === 0 ? -1 : 1;
    const third = remaining.find((value) => compareRational(value, correct) === preferredSide)
      ?? remaining[0];
    if (!third) fail(`${question.qlId}/${question.seed}: unable to construct a third close distractor.`);
    selected.push({
      value: third,
      misconceptionId: "SECOND_STEP_INPUT_SLIP",
      origin: "GENERATED_NEAR_MISS",
    });
  }
  return selected;
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
  const exact = formatExact(value);
  const displayed = exact.includes("/") ? `$${toLatex(value)}$` : exact;
  if (language === "en") return `${displayed} ${compareRational(value, rational(1)) === 0 ? "month" : "months"}`;
  if (value.denominator === 1n) return formatMonths(value.numerator, language);
  return language === "hi" ? `${displayed} महीने` : `${displayed} ਮਹੀਨੇ`;
}

function formatTimeYears(value: Rational, language: IntCp001CloseDistractorLanguage): string {
  const months = multiplyRational(value, rational(12));
  if (months.denominator === 1n || months.denominator === 2n || months.denominator === 4n) {
    return formatTimeMonths(months, language);
  }
  return language === "en" ? formatEnglishDurationYears(value) : formatLocalizedDurationYears(value, language);
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
  family: Family,
  answerSemantic: string,
  language: IntCp001CloseDistractorLanguage,
): string {
  if (family === "MONEY") return formatMoney(value);
  if (family === "RATE") {
    const suffix = language === "en" ? "per annum" : language === "hi" ? "वार्षिक" : "ਸਾਲਾਨਾ";
    return `${formatExact(value)}% ${suffix}`;
  }
  if (family === "TIME_MONTHS") return formatTimeMonths(value, language);
  if (family === "TIME_YEARS") return formatTimeYears(value, language);
  return formatRatio(value, answerSemantic, language);
}

function generatedExplanation(
  language: IntCp001CloseDistractorLanguage,
  optionText: string,
  misconceptionId: string,
): string {
  if (language === "en") {
    if (misconceptionId === "NEAR_CALCULATION_LOW") {
      return `${optionText} is a nearby value obtained by a small under-calculation in the final numerical step.`;
    }
    if (misconceptionId === "NEAR_CALCULATION_HIGH") {
      return `${optionText} is a nearby value obtained by a small over-calculation in the final numerical step.`;
    }
    return `${optionText} results from shifting one numerical input by a second small step before finishing the calculation.`;
  }
  if (language === "hi") {
    if (misconceptionId === "NEAR_CALCULATION_LOW") {
      return `${optionText} अंतिम संख्यात्मक चरण में थोड़ी कम गणना करने से मिलने वाला पास का गलत मान है।`;
    }
    if (misconceptionId === "NEAR_CALCULATION_HIGH") {
      return `${optionText} अंतिम संख्यात्मक चरण में थोड़ी अधिक गणना करने से मिलने वाला पास का गलत मान है।`;
    }
    return `${optionText} किसी एक संख्यात्मक मान को एक और छोटे चरण से बदलकर गणना पूरी करने पर मिलता है।`;
  }
  if (misconceptionId === "NEAR_CALCULATION_LOW") {
    return `${optionText} ਆਖਰੀ ਅੰਕੀ ਕਦਮ ਵਿੱਚ ਥੋੜ੍ਹੀ ਘੱਟ ਗਿਣਤੀ ਕਰਨ ਨਾਲ ਮਿਲਣ ਵਾਲਾ ਨੇੜਲਾ ਗਲਤ ਮੁੱਲ ਹੈ।`;
  }
  if (misconceptionId === "NEAR_CALCULATION_HIGH") {
    return `${optionText} ਆਖਰੀ ਅੰਕੀ ਕਦਮ ਵਿੱਚ ਥੋੜ੍ਹੀ ਵੱਧ ਗਿਣਤੀ ਕਰਨ ਨਾਲ ਮਿਲਣ ਵਾਲਾ ਨੇੜਲਾ ਗਲਤ ਮੁੱਲ ਹੈ।`;
  }
  return `${optionText} ਕਿਸੇ ਇੱਕ ਅੰਕੀ ਮੁੱਲ ਨੂੰ ਇੱਕ ਹੋਰ ਛੋਟੇ ਕਦਮ ਨਾਲ ਬਦਲ ਕੇ ਗਣਨਾ ਪੂਰੀ ਕਰਨ ਤੇ ਮਿਲਦਾ ਹੈ।`;
}

function refine(
  question: CloseQuestion,
  language: IntCp001CloseDistractorLanguage,
): CloseQuestion {
  const family = familyFor(question);
  const correctAudit = question.optionAudit[question.correctIndex];
  if (!correctAudit) fail(`${question.qlId}/${question.seed}: correct audit is missing.`);
  const correct = requireRational(correctAudit.result.value, "correct answer");
  const ordered = rotate(
    buildCandidates(question, family, correct),
    deterministicIndex(`${question.qlId}:${question.seed}:v2-close-order`, 3),
  );

  const options: string[] = [];
  const optionAudit: IntCp001CloseOptionAudit[] = [];
  const candidateByOption = new Map<number, Candidate>();
  let cursor = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === question.correctIndex) {
      const text = question.options[index]!;
      options.push(text);
      optionAudit.push({
        text,
        result: correctAudit.result,
        misconceptionId: "CORRECT",
        proximityOrigin: "CORRECT",
        absoluteDistance: rational(0),
        relativeDistanceBps: 0,
      });
      continue;
    }
    const candidate = ordered[cursor++]!;
    const text = formatCandidate(candidate.value, family, question.answerSemantic, language);
    candidateByOption.set(index, candidate);
    options.push(text);
    optionAudit.push({
      text,
      result: { semantic: correctAudit.result.semantic, value: candidate.value } as Result,
      misconceptionId: candidate.misconceptionId,
      proximityOrigin: candidate.origin,
      absoluteDistance: distance(correct, candidate.value),
      relativeDistanceBps: relativeDistanceBps(correct, candidate.value),
    });
  }

  const traps: IntCp001CloseTrapItem[] = optionAudit
    .map((audit, index) => ({ audit, index }))
    .filter(({ index }) => index !== question.correctIndex)
    .map(({ audit, index }) => {
      const candidate = candidateByOption.get(index)!;
      return {
        optionNumber: index + 1,
        optionText: audit.text,
        misconceptionId: audit.misconceptionId,
        explanation: candidate.explanation
          ?? generatedExplanation(language, audit.text, audit.misconceptionId),
      };
    });

  const errors = question.validation.errors.filter((error) => !error.startsWith("Distractor "));
  if (options.length !== 4 || new Set(options).size !== 4) errors.push("Close-distractor V2 must contain four unique options.");
  if (options[question.correctIndex] !== question.options[question.correctIndex]) {
    errors.push("Close-distractor V2 changed the correct option text.");
  }
  const wrong = optionAudit.filter((_audit, index) => index !== question.correctIndex);
  const hasLower = wrong.some((audit) => compareRational(requireRational(audit.result.value, "wrong option"), correct) < 0);
  const hasUpper = wrong.some((audit) => compareRational(requireRational(audit.result.value, "wrong option"), correct) > 0);
  if (!hasLower || !hasUpper) errors.push("Close-distractor V2 does not bracket the answer.");
  for (const audit of wrong) {
    const value = requireRational(audit.result.value, "wrong option");
    if (audit.proximityOrigin === "RETAINED_CONCEPT_TRAP" && relativeDistanceBps(correct, value) > 1500) {
      errors.push(`Retained concept distractor ${audit.text} exceeds the 15% review boundary.`);
    }
    if (audit.proximityOrigin === "GENERATED_NEAR_MISS" && !generatedBoundary(family, correct, value)) {
      errors.push(`Generated distractor ${audit.text} exceeds the tightened ${family} boundary.`);
    }
  }
  for (const trap of traps) {
    if (trap.optionText !== options[trap.optionNumber - 1]) errors.push(`Trap ${trap.optionNumber} is out of sync.`);
  }

  const retained = wrong.filter((audit) => audit.proximityOrigin === "RETAINED_CONCEPT_TRAP").length;
  return {
    ...question,
    options,
    optionAudit,
    explanation: {
      ...question.explanation,
      trapAnalysis: { ...question.explanation.trapAnalysis, items: traps },
    },
    distractorEditorialTrace: {
      ...question.distractorEditorialTrace,
      retainedConceptDistractors: retained,
      generatedNearMisses: 3 - retained,
      hasLowerDistractor: hasLower,
      hasUpperDistractor: hasUpper,
      maximumRelativeDistanceBps: Math.max(...wrong.map((audit) => audit.relativeDistanceBps)),
    },
    validation: {
      ...question.validation,
      ok: errors.length === 0,
      errors,
    },
  };
}

export function generateIntCp001CloseDistractorEnglishQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
): IntCp001CloseDistractorEnglishQuestion {
  return refine(generateV1English(qlId, seed), "en") as IntCp001CloseDistractorEnglishQuestion;
}

export function generateIntCp001CloseDistractorLocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001CloseDistractorLocalizedQuestion {
  return refine(generateV1Localized(qlId, seed, locale), locale) as IntCp001CloseDistractorLocalizedQuestion;
}
