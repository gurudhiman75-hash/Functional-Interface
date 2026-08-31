import { add, div, hash, mul, rat, sub, type Rational } from "./cp003-exam-model";
import {
  buildIntCp010SequentialReopenPackageV2,
  type IntCp010SequentialReopenPrototypeId,
} from "./cp010-sequential-mixed-source-reopen-v2";
import {
  INT_001_WAVE03_AUTHORITY_CONTRACTS,
  INT_001_WAVE03_QL_IDS,
  type Int001Wave03QlId,
} from "./int-001-wave03-permanent-allocation-v1";

export const INT_001_WAVE04_ENGLISH_AUTHORITY_VERSION = "INT-001-WAVE04-ENGLISH-AUTHORITY-v1" as const;
export const INT_001_WAVE04_ENGLISH_RELEASE = "INT-001-WAVE04-EN-v1-review-candidate" as const;

export const INT_001_WAVE04_ENGLISH_GOVERNANCE = Object.freeze({
  permanentQlIds: INT_001_WAVE03_QL_IDS,
  permanentQlCount: 3 as const,
  language: "en" as const,
  release: INT_001_WAVE04_ENGLISH_RELEASE,
  permanentIdentityFrozen: true as const,
  learnerContentFrozen: false as const,
  reviewStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
  localeReviewStatus: "PENDING_HUMAN_REVIEW" as const,
  questionStudioDiscoverable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

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

function prototypeFor(qlId: Int001Wave03QlId, seed: string): IntCp010SequentialReopenPrototypeId {
  switch (qlId) {
    case "INT-QL-132":
      return hash(`${seed}:INT-QL-132:stage-order`) % 2 === 0
        ? "INT-CP010-REOPEN-PROT-001"
        : "INT-CP010-REOPEN-PROT-002";
    case "INT-QL-133":
      return "INT-CP010-REOPEN-PROT-003";
    case "INT-QL-134":
      return "INT-CP010-REOPEN-PROT-004";
  }
}

function questionTypeFor(qlId: Int001Wave03QlId) {
  switch (qlId) {
    case "INT-QL-132": return "SEQUENTIAL_SI_CI_FINAL_AMOUNT" as const;
    case "INT-QL-133": return "SEQUENTIAL_SI_CI_OPENING_PRINCIPAL" as const;
    case "INT-QL-134": return "SCHEME_RETURN_DIFFERENCE_COMMON_PRINCIPAL" as const;
  }
}

function whatAskedFor(qlId: Int001Wave03QlId) {
  switch (qlId) {
    case "INT-QL-132": return "Find the final amount after the two stated interest stages.";
    case "INT-QL-133": return "Find the opening principal that leads to the stated final amount.";
    case "INT-QL-134": return "Find the common principal from the known difference between the two scheme returns.";
  }
}

function shortcutFor(qlId: Int001Wave03QlId) {
  switch (qlId) {
    case "INT-QL-132": return "Use one multiplier for each stage and multiply the stage factors; the maturity of the first stage is the principal of the second.";
    case "INT-QL-133": return "Build the SI and CI multipliers separately, multiply them once, and divide the final amount by that combined multiplier.";
    case "INT-QL-134": return "Because both schemes use the same principal, divide the known return difference by the difference of their exact amount factors.";
  }
}

function commonTrapFor(qlId: Int001Wave03QlId) {
  switch (qlId) {
    case "INT-QL-132": return "Do not apply one interest method to the entire duration or stop after the first stage.";
    case "INT-QL-133": return "Do not reverse only one stage or treat all years as simple/compound interest.";
    case "INT-QL-134": return "Do not subtract the nominal annual rates directly; compare the complete SI and CI amount factors for the stated duration and frequency.";
  }
}

function rationalNumber(value: Rational): number {
  return Number(value.numerator) / Number(value.denominator);
}
function decimal(value: Rational, digits = 8): string {
  const rendered = rationalNumber(value).toFixed(digits).replace(/0+$/u, "").replace(/\.$/u, "");
  return rendered === "-0" ? "0" : rendered;
}
function money(value: Rational): string {
  const rounded = Math.round(rationalNumber(value) * 100) / 100;
  const hasPaise = Math.abs(rounded - Math.round(rounded)) > 1e-9;
  return `₹${rounded.toLocaleString("en-IN", {
    minimumFractionDigits: hasPaise ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}
function exactAtPaise(value: Rational): boolean {
  return (value.numerator * 100n) % value.denominator === 0n;
}
function rationalEqual(left: Rational, right: Rational): boolean {
  return left.numerator * right.denominator === right.numerator * left.denominator;
}
function simpleFactor(ratePercent: Rational, years: number): Rational {
  return add(rat(1n), div(mul(ratePercent, rat(BigInt(years))), rat(100n)));
}
function pow(base: Rational, exponent: number): Rational {
  let result = rat(1n);
  for (let index = 0; index < exponent; index += 1) result = mul(result, base);
  return result;
}
function compoundFactor(ratePercent: Rational, years: number): Rational {
  return pow(add(rat(1n), div(ratePercent, rat(100n))), years);
}
function nominalCompoundFactor(ratePercent: Rational, years: number, periodsPerYear: 1 | 2): Rational {
  const perPeriod = div(ratePercent, rat(BigInt(100 * periodsPerYear)));
  return pow(add(rat(1n), perPeriod), years * periodsPerYear);
}

function isEditoriallyDistinctState(qlId: Int001Wave03QlId, state: any): boolean {
  if (qlId === "INT-QL-132" || qlId === "INT-QL-133") {
    const equalRates = rationalEqual(state.simpleRatePercent, state.compoundRatePercent);
    if (equalRates && state.simpleYears === 1) return false;
  }
  if (qlId === "INT-QL-134" && !exactAtPaise(state.netGain)) return false;
  return true;
}

function buildReviewedSource(qlId: Int001Wave03QlId, prototypeId: IntCp010SequentialReopenPrototypeId, requestedSeed: string) {
  for (let attempt = 1; attempt <= 96; attempt += 1) {
    const qualitySeed = attempt === 1 ? requestedSeed : `${requestedSeed}:wave04-review-quality:${attempt - 1}`;
    const source = buildIntCp010SequentialReopenPackageV2(prototypeId, qualitySeed) as any;
    if (source.prototypeId !== prototypeId || source.state?.prototypeId !== prototypeId) continue;
    if (!isEditoriallyDistinctState(qlId, source.state)) continue;
    return { source, qualitySeed, qualitySelectionAttempts: attempt };
  }
  throw new Error(`${qlId}/${requestedSeed}: unable to construct a review-quality learner state within 96 deterministic attempts`);
}

function explanationFor(qlId: Int001Wave03QlId, source: any) {
  const state = source.state as any;
  if (qlId === "INT-QL-132") {
    const siFactor = simpleFactor(state.simpleRatePercent, state.simpleYears);
    const ciFactor = compoundFactor(state.compoundRatePercent, state.compoundYears);
    const combined = mul(siFactor, ciFactor);
    const orderText = state.stageOrder === "SI_THEN_CI" ? "SI first, then CI" : "CI first, then SI";
    return deepFreeze({
      whatAsked: whatAskedFor(qlId),
      keyIdea: "Treat the two interest methods as consecutive stages. The maturity amount of stage 1 becomes the principal of stage 2.",
      steps: Object.freeze([
        `SI multiplier = 1 + (${decimal(state.simpleRatePercent)} × ${state.simpleYears})/100 = ${decimal(siFactor)}.`,
        `CI multiplier = (1 + ${decimal(state.compoundRatePercent)}/100)^${state.compoundYears} = ${decimal(ciFactor)}.`,
        `Stage 1 → Stage 2 order is ${orderText}; the first-stage maturity becomes the second-stage principal.`,
        `Combined multiplier = ${decimal(siFactor)} × ${decimal(ciFactor)} = ${decimal(combined)}.`,
        `Final amount = ${money(state.principal)} × ${decimal(combined)} = ${money(source.answer)}.`,
      ]),
      shortcut: shortcutFor(qlId),
      commonTrap: commonTrapFor(qlId),
      finalAnswer: money(source.answer),
    });
  }
  if (qlId === "INT-QL-133") {
    const siFactor = simpleFactor(state.simpleRatePercent, state.simpleYears);
    const ciFactor = compoundFactor(state.compoundRatePercent, state.compoundYears);
    const combined = mul(siFactor, ciFactor);
    return deepFreeze({
      whatAsked: whatAskedFor(qlId),
      keyIdea: "The two stages contribute separate exact multipliers. Multiply those multipliers once and reverse the combined multiplier to recover the opening principal.",
      steps: Object.freeze([
        `SI multiplier = 1 + (${decimal(state.simpleRatePercent)} × ${state.simpleYears})/100 = ${decimal(siFactor)}.`,
        `CI multiplier = (1 + ${decimal(state.compoundRatePercent)}/100)^${state.compoundYears} = ${decimal(ciFactor)}.`,
        `Combined multiplier = ${decimal(siFactor)} × ${decimal(ciFactor)} = ${decimal(combined)}.`,
        `Opening principal = ${money(state.finalAmount)} ÷ ${decimal(combined)} = ${money(source.answer)}.`,
        `Check: ${money(source.answer)} × ${decimal(combined)} = ${money(state.finalAmount)}.`,
      ]),
      shortcut: shortcutFor(qlId),
      commonTrap: commonTrapFor(qlId),
      finalAnswer: money(source.answer),
    });
  }
  const borrowFactor = simpleFactor(state.borrowSimpleRatePercent, state.years);
  const lendFactor = nominalCompoundFactor(state.lendNominalCompoundRatePercent, state.years, state.compoundPeriodsPerYear);
  const spreadFactor = sub(lendFactor, borrowFactor);
  const periods = state.years * state.compoundPeriodsPerYear;
  const periodRateDivisor = 100 * state.compoundPeriodsPerYear;
  return deepFreeze({
    whatAsked: whatAskedFor(qlId),
    keyIdea: "The same principal is used in both schemes, so the known return difference equals the principal multiplied by the difference between the complete CI and SI amount factors.",
    steps: Object.freeze([
      `SI borrowing factor = 1 + (${decimal(state.borrowSimpleRatePercent)} × ${state.years})/100 = ${decimal(borrowFactor)}.`,
      `CI lending factor = (1 + ${decimal(state.lendNominalCompoundRatePercent)}/${periodRateDivisor})^${periods} = ${decimal(lendFactor)}.`,
      `Return-difference factor = ${decimal(lendFactor)} − ${decimal(borrowFactor)} = ${decimal(spreadFactor)}.`,
      `Principal = ${money(state.netGain)} ÷ ${decimal(spreadFactor)} = ${money(source.answer)}.`,
    ]),
    shortcut: shortcutFor(qlId),
    commonTrap: commonTrapFor(qlId),
    finalAnswer: money(source.answer),
  });
}

function normalizeSourceOptions(source: any) {
  return source.options.map((option: any) => deepFreeze({
    text: String(option.text),
    value: option.value as Rational,
    misconceptionId: String(option.misconceptionId),
    isCorrect: Boolean(option.isCorrect),
  }));
}

function wrongOptionsFor(qlId: Int001Wave03QlId, source: any, normalizedSourceOptions: readonly any[]) {
  const sourceWrong = normalizedSourceOptions.filter((option: any) => !option.isCorrect);
  if (qlId !== "INT-QL-134") return sourceWrong;
  const conceptual = sourceWrong.find((option: any) => !/FALLBACK/u.test(option.misconceptionId)) ?? sourceWrong[0];
  if (!conceptual) throw new Error(`${qlId}: missing conceptual distractor`);
  const seenText = new Set([money(source.answer), conceptual.text]);
  const nearby: any[] = [];
  for (const [factor, misconceptionId] of [
    [rat(9n, 10n), "TEN_PERCENT_LOW_CALCULATION_SLIP"],
    [rat(11n, 10n), "TEN_PERCENT_HIGH_CALCULATION_SLIP"],
    [rat(4n, 5n), "TWENTY_PERCENT_LOW_CALCULATION_SLIP"],
    [rat(6n, 5n), "TWENTY_PERCENT_HIGH_CALCULATION_SLIP"],
  ] as const) {
    const value = mul(source.answer, factor);
    const text = money(value);
    if (seenText.has(text)) continue;
    seenText.add(text);
    nearby.push(deepFreeze({ text, value, misconceptionId, isCorrect: false as const }));
    if (nearby.length === 2) break;
  }
  if (nearby.length !== 2) throw new Error(`${qlId}: unable to construct two distinct nearby distractors`);
  return [conceptual, ...nearby];
}

export function generateInt001Wave04EnglishCandidate(qlId: Int001Wave03QlId, seed: string | number) {
  const requestedSeed = String(seed);
  const prototypeId = prototypeFor(qlId, requestedSeed);
  const contract = INT_001_WAVE03_AUTHORITY_CONTRACTS[qlId];
  if (!(contract.sourcePrototypeIds as readonly string[]).includes(prototypeId)) {
    throw new Error(`${qlId}/${requestedSeed}: prototype escaped the permanent Wave03 authority mapping`);
  }

  const { source, qualitySeed, qualitySelectionAttempts } = buildReviewedSource(qlId, prototypeId, requestedSeed);
  if (!source.presentation?.prompt || !Array.isArray(source.options) || source.options.length !== 4) {
    throw new Error(`${qlId}/${requestedSeed}: incomplete learner package`);
  }
  if (!Number.isInteger(source.correctIndex) || source.correctIndex < 0 || source.correctIndex > 3) {
    throw new Error(`${qlId}/${requestedSeed}: invalid source answer index`);
  }

  const normalizedSourceOptions = normalizeSourceOptions(source);
  const correctOption = normalizedSourceOptions.find((option: any) => option.isCorrect);
  const wrongOptions = wrongOptionsFor(qlId, source, normalizedSourceOptions);
  if (!correctOption || wrongOptions.length !== 3) {
    throw new Error(`${qlId}/${requestedSeed}: source answer ownership drift`);
  }
  const correctIndex = hash(`${qlId}:${requestedSeed}:wave04-independent-correct-position`) % 4;
  const arrangedOptions = [...wrongOptions];
  arrangedOptions.splice(correctIndex, 0, correctOption);
  const options = Object.freeze(arrangedOptions);
  if (new Set(options.map((option) => option.text)).size !== 4) {
    throw new Error(`${qlId}/${requestedSeed}: duplicate displayed option text`);
  }
  if (options.filter((option) => option.isCorrect).length !== 1 || !options[correctIndex]?.isCorrect) {
    throw new Error(`${qlId}/${requestedSeed}: displayed answer ownership drift`);
  }

  const explanation = explanationFor(qlId, source);

  return deepFreeze({
    authorityVersion: INT_001_WAVE04_ENGLISH_AUTHORITY_VERSION,
    release: INT_001_WAVE04_ENGLISH_RELEASE,
    checkpointId: contract.checkpointId,
    permanentQlId: qlId,
    qlId,
    permanentIdentityAllocated: true as const,
    questionType: questionTypeFor(qlId),
    title: contract.title,
    solveContract: contract.givenUnknown,
    answerSemantic: contract.answerSemantic,
    language: "en" as const,
    requestedSeed,
    qualitySeed,
    effectiveSeed: String(source.effectiveSeed ?? qualitySeed),
    qualitySelectionAttempts,
    sourcePrototypeId: prototypeId,
    stemFamilyId: String(source.presentation.stemFamilyId),
    stem: String(source.presentation.prompt),
    options,
    correctIndex,
    answer: source.answer,
    mathematicalState: source.state,
    mathematicalFingerprint: String(source.mathematicalFingerprint),
    explanation,
    provenance: deepFreeze({
      wave03PermanentAuthority: true as const,
      sourcePrototypeId: prototypeId,
      sourceAuthorityContract: contract.givenUnknown,
      packagingRemediationVersion: String(source.packagingRemediationVersion ?? "NONE"),
      seedResolutionAttempts: Number(source.seedResolutionAttempts ?? 1),
      qualitySelectionAttempts,
      qualityPolicy: "avoid sequential identity-collapse states; require exact-to-paise displayed QL134 gain; independently balance learner answer positions; keep one conceptual and two nearby QL134 distractors" as const,
      sourceCorrectIndex: Number(source.correctIndex),
      learnerOptionOrderRemediated: true as const,
    }),
    lifecycle: deepFreeze({
      permanentIdentityFrozen: true as const,
      learnerContentFrozen: false as const,
      reviewStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
      localeReviewStatus: "PENDING_HUMAN_REVIEW" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}
