import {
  OPS_QL_FREEZE_VERSION,
  generateFrozenOpsQuestion,
} from "../registry";
import {
  arithmeticTrace,
  swapOperatorPairs,
  swapWholeNumbers,
  type TeachingStep,
} from "../pilot/approved-teaching-helpers";
import type { OpsPilotOption } from "../pilot/representative-pilots";
import { withOpsInstanceDifficulty } from "./final-audit-remediation";

export type OpsPairedLocale = "en" | "hi" | "pa";

function mix(seed: number, salt: number): number {
  let value = (seed ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x85ebca6b) >>> 0;
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

function int(seed: number, salt: number, minimum: number, maximum: number): number {
  return minimum + (mix(seed, salt) % (maximum - minimum + 1));
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  const normalized = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

function integerValue(expression: string): string | null {
  try {
    const value = arithmeticTrace(expression).value;
    if (!/^-?\d+$/u.test(value)) return null;
    const numeric = Number(value);
    return Number.isSafeInteger(numeric) && Math.abs(numeric) <= 5000 ? value : null;
  } catch {
    return null;
  }
}

type Transformation = {
  readonly operatorPair: readonly [string, string];
  readonly numberPair: readonly [string, string];
  readonly firstExpression: string;
};

function transformationFromSeed(seed: number): Transformation {
  const base = generateFrozenOpsQuestion("OPS-QL-026", seed);
  const match = base.stem.match(/^Interchange (.+) and (.+), and interchange the complete numbers (.+) and (.+), throughout (.+)\. What is the resulting value\?$/u);
  if (!match) throw new Error(`OPS-QL-026 canonical stem cannot seed paired presentation: ${base.stem}`);
  return {
    operatorPair: [match[1]!, match[2]!] as const,
    numberPair: [match[3]!, match[4]!] as const,
    firstExpression: match[5]!,
  };
}

function states(expression: string, operatorPair: readonly [string, string], numberPair: readonly [string, string]) {
  const operatorOnlyExpression = swapOperatorPairs(expression, [operatorPair]);
  const numberOnlyExpression = swapWholeNumbers(expression, numberPair[0], numberPair[1]);
  const bothExpression = swapWholeNumbers(operatorOnlyExpression, numberPair[0], numberPair[1]);
  const original = integerValue(expression);
  const operatorOnly = integerValue(operatorOnlyExpression);
  const numberOnly = integerValue(numberOnlyExpression);
  const both = integerValue(bothExpression);
  if (!original || !operatorOnly || !numberOnly || !both) return null;
  return { original, operatorOnly, numberOnly, both, bothExpression };
}

function secondExpression(
  seed: number,
  operatorPair: readonly [string, string],
  numberPair: readonly [string, string],
  firstStates: NonNullable<ReturnType<typeof states>>,
): { expression: string; states: NonNullable<ReturnType<typeof states>> } {
  const firstNumber = Number(numberPair[0]);
  const secondNumber = Number(numberPair[1]);
  for (let attempt = 0; attempt < 5000; attempt += 1) {
    const sourceSeed = (seed * 1237 + attempt * 4567 + 313) >>> 0;
    const b = int(sourceSeed, 1, 2, 12);
    const d = int(sourceSeed, 2, 2, 12);
    const e = int(sourceSeed, 3, 2, 20);
    if (new Set([firstNumber, secondNumber, b, d, e]).size < 4) continue;
    const expression = `${secondNumber} ÷ ${d} − ${e} + ${firstNumber} × ${b}`;
    const next = states(expression, operatorPair, numberPair);
    if (!next) continue;
    const orderedPairs = [
      `${firstStates.both}, ${next.both}`,
      `${firstStates.operatorOnly}, ${next.operatorOnly}`,
      `${firstStates.numberOnly}, ${next.numberOnly}`,
      `${firstStates.original}, ${next.original}`,
    ];
    if (new Set(orderedPairs).size !== orderedPairs.length) continue;
    return { expression, states: next };
  }
  throw new Error(`OPS paired compound presentation could not build a second expression for seed ${seed}.`);
}

function localizedStem(
  locale: OpsPairedLocale,
  operatorPair: readonly [string, string],
  numberPair: readonly [string, string],
  first: string,
  second: string,
): string {
  if (locale === "hi") return `${operatorPair[0]} और ${operatorPair[1]} को तथा पूरी संख्याओं ${numberPair[0]} और ${numberPair[1]} को आपस में बदलने के बाद व्यंजक (I) और (II) के मान क्रमशः क्या होंगे?\nI. ${first}\nII. ${second}`;
  if (locale === "pa") return `${operatorPair[0]} ਅਤੇ ${operatorPair[1]} ਨੂੰ ਅਤੇ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ${numberPair[0]} ਅਤੇ ${numberPair[1]} ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲਣ ਤੋਂ ਬਾਅਦ (I) ਅਤੇ (II) ਦੇ ਮੁੱਲ ਕ੍ਰਮਵਾਰ ਕੀ ਹੋਣਗੇ?\nI. ${first}\nII. ${second}`;
  return `After interchanging ${operatorPair[0]} and ${operatorPair[1]}, and interchanging the complete numbers ${numberPair[0]} and ${numberPair[1]}, what will be the values of expressions (I) and (II), respectively?\nI. ${first}\nII. ${second}`;
}

export function generateOpsPairedCompoundPresentation(seed: number, locale: OpsPairedLocale = "en") {
  const transform = transformationFromSeed(seed);
  const first = states(transform.firstExpression, transform.operatorPair, transform.numberPair);
  if (!first) throw new Error(`OPS paired compound first expression was not integer-safe for seed ${seed}.`);
  const second = secondExpression(seed, transform.operatorPair, transform.numberPair, first);
  const correct = `${first.both}, ${second.states.both}`;
  const optionStates = rotate([
    { value: correct, errorLabel: null },
    { value: `${first.operatorOnly}, ${second.states.operatorOnly}`, errorLabel: "APPLIED_OPERATOR_SWAP_ONLY" },
    { value: `${first.numberOnly}, ${second.states.numberOnly}`, errorLabel: "APPLIED_NUMBER_SWAP_ONLY" },
    { value: `${first.original}, ${second.states.original}`, errorLabel: "IGNORED_BOTH_INTERCHANGES" },
  ] as const, seed);
  const options: OpsPilotOption[] = optionStates.map((entry) => ({ ...entry }));
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  const ruleStatement = locale === "hi"
    ? "दोनों आपसी बदलाव प्रत्येक व्यंजक पर अलग-अलग लागू कीजिए और उत्तर उसी क्रम में लिखिए जिसमें (I) और (II) दिए हैं।"
    : locale === "pa"
      ? "ਦੋਵੇਂ ਆਪਸੀ ਬਦਲਾਅ ਹਰ ਵਿਅੰਜਕ ਉੱਤੇ ਵੱਖ-ਵੱਖ ਲਾਗੂ ਕਰੋ ਅਤੇ ਉੱਤਰ (I), (II) ਦੇ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖੋ।"
      : "Apply both mutual interchanges independently to each expression and keep the final results in the displayed (I), (II) order.";
  const steps: TeachingStep[] = [
    {
      label: locale === "hi" ? "दोनों बदलाव लिखें" : locale === "pa" ? "ਦੋਵੇਂ ਬਦਲਾਅ ਲਿਖੋ" : "Write both interchanges",
      expression: `${transform.operatorPair[0]} ↔ ${transform.operatorPair[1]}; ${transform.numberPair[0]} ↔ ${transform.numberPair[1]}`,
      result: locale === "hi" ? "यही दोनों बदलाव (I) और (II) पर लागू होंगे।" : locale === "pa" ? "ਇਹੀ ਦੋਵੇਂ ਬਦਲਾਅ (I) ਅਤੇ (II) ਉੱਤੇ ਲਾਗੂ ਹੋਣਗੇ।" : "The same two changes apply to both expressions.",
    },
    {
      label: locale === "hi" ? "व्यंजक (I) बदलें" : locale === "pa" ? "ਵਿਅੰਜਕ (I) ਬਦਲੋ" : "Transform expression (I)",
      expression: transform.firstExpression,
      result: `${first.bothExpression} = ${first.both}`,
    },
    {
      label: locale === "hi" ? "व्यंजक (II) बदलें" : locale === "pa" ? "ਵਿਅੰਜਕ (II) ਬਦਲੋ" : "Transform expression (II)",
      expression: second.expression,
      result: `${second.states.bothExpression} = ${second.states.both}`,
    },
    {
      label: locale === "hi" ? "क्रम बनाए रखें" : locale === "pa" ? "ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ" : "Keep the requested order",
      expression: "(I), (II)",
      result: correct,
    },
  ];
  const conclusion = locale === "hi" ? `अतः क्रमशः मान ${correct} हैं।` : locale === "pa" ? `ਇਸ ਲਈ ਕ੍ਰਮਵਾਰ ਮੁੱਲ ${correct} ਹਨ।` : `Therefore, the values respectively are ${correct}.`;

  const question = {
    candidateId: "OPS-CAND-028",
    checkpointId: "OPS-CP-008",
    seed,
    locale: locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "pa-IN",
    taskKind: "EVALUATE_PAIRED_EXPRESSIONS_AFTER_GIVEN_INTERCHANGE",
    solveMode: "evaluateAfterSpecifiedCompoundSwap",
    renderer: "STRUCTURED_TEXT",
    stem: localizedStem(locale, transform.operatorPair, transform.numberPair, transform.firstExpression, second.expression),
    options,
    correctIndex,
    answer: correct,
    explanation: { ruleStatement, steps, conclusion },
    proof: {
      unique: true as const,
      solverRoute: "SSC_SOURCE_PAIRED_COMPOUND_TRANSFORMATION",
      eligibleCandidateCount: 4,
      survivingCandidateCount: 1 as const,
      semanticFingerprint: `OPS-CAND-028:PAIRED:${transform.operatorPair.join("<->")}:${transform.numberPair.join("<->")}:${transform.firstExpression}|${second.expression}:${correct}`,
    },
    metadata: {
      teachingExplanationVersion: "V3_APPROVED",
      teachingTraceVerified: true,
      requestedSeed: seed,
      sourceSeed: seed,
      compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER",
      presentationMode: "PAIRED_EXPRESSIONS_ORDERED_RESULTS",
      presentationAnswerSemantic: "ORDERED_RESULT_PAIR",
      sourceBackedSurface: "SSC_CGL_2022_PAIRED_EQUATIONS",
      misconceptionDistractorsGrounded: true,
      distractorModelCount: 3,
    },
    qlId: "OPS-QL-026" as const,
    qlFreezeVersion: OPS_QL_FREEZE_VERSION,
  };
  return withOpsInstanceDifficulty(question);
}
