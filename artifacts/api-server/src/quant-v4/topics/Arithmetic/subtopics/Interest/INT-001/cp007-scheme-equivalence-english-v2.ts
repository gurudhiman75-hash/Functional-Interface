import { div, eq, hash, rat, type Rational } from "./cp003-exam-model";
import { schemeFactor, type IntCp007Scheme } from "./cp007-scheme-equivalence-runtime-v1";
import {
  INT_CP007_ENGLISH_VERSION as INT_CP007_ENGLISH_VERSION_V1,
  generateIntCp007EnglishQuestion as generateV1,
  type IntCp007EnglishQuestion as IntCp007EnglishQuestionV1,
  type IntCp007Option,
  type IntCp007Representation,
} from "./cp007-scheme-equivalence-english-v1";
import {
  INT_CP007_PERMANENT_ALLOCATION,
  INT_CP007_RUNTIME_VERSION,
  constructIntCp007State,
  solveIntCp007,
  verifyIntCp007Answer,
  type IntCp007QlId,
} from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_ENGLISH_VERSION = "INT-CP-007-EN-v2-review" as const;
export const INT_CP007_ENGLISH_V2_SUPERSEDES = INT_CP007_ENGLISH_VERSION_V1;

export type IntCp007EnglishQuestion = Omit<IntCp007EnglishQuestionV1, "englishVersion"> & {
  readonly englishVersion: typeof INT_CP007_ENGLISH_VERSION;
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

function gcd(a: bigint, b: bigint): bigint {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) [left, right] = [right, left % right];
  return left;
}

function formatRational(value: Rational, maximumDecimals = 6): string {
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  const denominator = value.denominator;
  const whole = numerator / denominator;
  let remainder = numerator % denominator;
  if (remainder === 0n) return `${sign}${whole}`;
  let decimals = "";
  for (let index = 0; index < maximumDecimals && remainder !== 0n; index += 1) {
    remainder *= 10n;
    decimals += (remainder / denominator).toString();
    remainder %= denominator;
  }
  if (remainder === 0n) return `${sign}${whole}.${decimals}`;
  const divisor = gcd(numerator, denominator);
  return `${sign}${numerator / divisor}/${denominator / divisor}`;
}

function ratioText(value: Rational): string {
  const divisor = gcd(value.numerator, value.denominator);
  return `${value.numerator / divisor}:${value.denominator / divisor}`;
}

function formatPercent(value: Rational): string {
  return `${formatRational(value)}%`;
}

function formatYears(years: number): string {
  return years === 1 ? "1 year" : `${years} years`;
}

function schemeLabel(scheme: IntCp007Scheme): string {
  const method = scheme.method === "SIMPLE" ? "simple interest" : "compound interest compounded annually";
  return `${method} at ${formatPercent(scheme.annualRatePercent)} p.a. for ${formatYears(scheme.years)}`;
}

function schemeFactorCalculation(label: string, scheme: IntCp007Scheme): string {
  const factor = schemeFactor(scheme);
  if (scheme.method === "SIMPLE") {
    return `${label}: simple-interest factor = 1 + (${scheme.years} × ${formatRational(scheme.annualRatePercent)}/100) = ${formatRational(factor)}.`;
  }
  return `${label}: compound-interest factor = (1 + ${formatRational(scheme.annualRatePercent)}/100)^${scheme.years} = ${formatRational(factor)}.`;
}

function arrangeOptions(seed: string, correct: Rational, wrongs: readonly IntCp007Option[]) {
  const correctIndex = (hash(`${seed}:INT-QL-113:correct-index`) % 4) as 0 | 1 | 2 | 3;
  const options: IntCp007Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push(deepFreeze({ text: ratioText(correct), value: correct, misconceptionId: "CORRECT" }));
    else options.push(wrongs[wrongIndex++]!);
  }
  return deepFreeze({ options: Object.freeze(options), correctIndex });
}

function generateQl113(seed: string): IntCp007EnglishQuestion {
  const mathematicalState = constructIntCp007State("INT-QL-113", seed);
  const contract: any = mathematicalState.contractState;
  const correctValue = solveIntCp007(mathematicalState);
  if (!verifyIntCp007Answer(mathematicalState, correctValue)) throw new Error(`INT-QL-113/${seed}: solver answer rejected`);

  const inverse = div(rat(1n), correctValue);
  const wrongValues = [inverse, rat(1n), rat(2n)] as const;
  for (const value of wrongValues) {
    if (verifyIntCp007Answer(mathematicalState, value)) throw new Error(`INT-QL-113/${seed}: V2 distractor verifies as correct`);
  }
  if (new Set(wrongValues.map((value) => `${value.numerator}/${value.denominator}`)).size !== 3) {
    throw new Error(`INT-QL-113/${seed}: V2 distractors are not distinct`);
  }

  const wrongs = deepFreeze([
    { text: ratioText(inverse), value: inverse, misconceptionId: "INVERT_REQUIRED_PRINCIPAL_RATIO" },
    { text: "1:1", value: rat(1n), misconceptionId: "ASSUME_EQUAL_PRESENT_PRINCIPALS" },
    { text: "2:1", value: rat(2n), misconceptionId: "USE_ARBITRARY_DOUBLE_RATIO" },
  ] as const);
  const arranged = arrangeOptions(seed, correctValue, wrongs);

  const factorA = schemeFactor(contract.schemeA);
  const factorB = schemeFactor(contract.schemeB);
  const template = hash(`${seed}:INT-QL-113:stem-family`) % 3;
  const a = schemeLabel(contract.schemeA);
  const b = schemeLabel(contract.schemeB);
  const stems = [
    `Two present principals are invested in Scheme A (${a}) and Scheme B (${b}). If their maturity amounts are equal, find the required ratio Principal A : Principal B.`,
    `Plan A follows ${a}; Plan B follows ${b}. What should be the ratio of the two present investments so that they become equal at maturity?`,
    `The future values from Scheme A (${a}) and Scheme B (${b}) must match. Determine the present-principal ratio A:B.`,
  ] as const;
  const markdown = stems[template]!;
  const correctAnswer = arranged.options[arranged.correctIndex]!.text;

  return deepFreeze({
    id: `INT-QL-113:${seed}`,
    runtimeVersion: INT_CP007_RUNTIME_VERSION,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    checkpointId: "INT-CP-007",
    qlId: "INT-QL-113",
    locale: "en-IN",
    seed,
    mathematicalState,
    answerSemantic: mathematicalState.answerSemantic,
    presentation: deepFreeze({
      markdown,
      prompt: markdown,
      representation: (["STANDARD_PROSE", "SCHEME_CARD", "COMPARISON_LEDGER"] as const)[template] as IntCp007Representation,
      stemFamilyId: `INT-QL-113-T${template + 1}`,
    }),
    options: arranged.options,
    correctIndex: arranged.correctIndex,
    correctAnswer,
    explanation: deepFreeze({
      keyIdea: "Equal future values mean present principal × complete accumulation factor must be the same for both schemes. Therefore the required present-principal ratio is the inverse ratio of the two maturity factors.",
      steps: Object.freeze([
        `The question gives two complete accumulation schemes and asks for the present-principal ratio A:B that makes their future values equal.`,
        `${schemeFactorCalculation("Scheme A", contract.schemeA)} ${schemeFactorCalculation("Scheme B", contract.schemeB)}`,
        `Let the present principals be P_A and P_B. Equal maturity requires P_A × ${formatRational(factorA)} = P_B × ${formatRational(factorB)}.`,
        `Dividing by P_B × ${formatRational(factorA)} gives P_A/P_B = ${formatRational(factorB)}/${formatRational(factorA)} = ${formatRational(correctValue)}.`,
        `Hence Principal A : Principal B = ${ratioText(correctValue)}. Substituting this inverse-factor ratio makes the two future-value products equal.`,
      ]),
      finalAnswer: correctAnswer,
      commonMistake: "Do not copy the rate ratio or reverse the principal ratio. The higher accumulation factor needs the smaller present principal, so present principals must be taken in the inverse ratio of the complete maturity factors.",
    }),
    mathematicalFingerprint: `INT-QL-113|${seed}|${mathematicalState.sourcePrototypeId}|${JSON.stringify(mathematicalState.contractState, (_key, value) => typeof value === "bigint" ? `${value}n` : value)}|answer=${correctValue.numerator}/${correctValue.denominator}|v2-ratio-distractors`,
    editorialStatus: "ENGLISH_REVIEW",
    approvalStatus: "PENDING_PRODUCT_REVIEW",
    allocationStatus: "PERMANENT_QL_ALLOCATED_INACTIVE",
    permanentIdentityFrozen: true,
    learnerContentFrozen: false,
    enabled: INT_CP007_PERMANENT_ALLOCATION.enabled,
    stagingStatus: INT_CP007_PERMANENT_ALLOCATION.stagingStatus,
    registrationStatus: INT_CP007_PERMANENT_ALLOCATION.registrationStatus,
    questionStudioDiscoverable: INT_CP007_PERMANENT_ALLOCATION.questionStudioDiscoverable,
    questionBankStatus: INT_CP007_PERMANENT_ALLOCATION.questionBankStatus,
    testEligibility: INT_CP007_PERMANENT_ALLOCATION.testEligibility,
    publiclyPublishable: INT_CP007_PERMANENT_ALLOCATION.publiclyPublishable,
  });
}

export function generateIntCp007EnglishQuestion(qlId: IntCp007QlId, seed: string, locale: "en-IN" = "en-IN"): IntCp007EnglishQuestion {
  if (locale !== "en-IN") throw new Error("CP007 English V2 review authority supports en-IN only");
  if (qlId === "INT-QL-113") return generateQl113(seed);
  const source = generateV1(qlId, seed, locale);
  return deepFreeze({ ...source, englishVersion: INT_CP007_ENGLISH_VERSION });
}
