import { createHash } from "node:crypto";
import { eq, rat, type Rational } from "./cp003-exam-model";
import {
  intCp009GrowthFactor,
  intCp009ShiftAmount,
} from "./cp009-dated-cash-flow-discovery-v1";
import {
  buildIntCp009ExamReadyPolishedPackage,
  solveIntCp009Prototype,
  verifyIntCp009PrototypeAnswer,
  type IntCp009PrototypeId,
} from "./cp009-dated-cash-flow-exam-ready-v3-polish";
import {
  INT_CP009_PERMANENT_QL_IDS,
  getIntCp009PermanentAuthority,
  type IntCp009PermanentQlId,
} from "./cp009-permanent-allocation-v1";

export const INT_CP009_PRODUCTION_RUNTIME_VERSION = "INT-CP-009-PRODUCTION-RUNTIME-v1" as const;
export const INT_CP009_P001_OBJECT_POOL_VERSION = "INT-CP-009-P001-PRODUCTION-OBJECT-POOL-v2" as const;
export { INT_CP009_PERMANENT_QL_IDS };
export type { IntCp009PermanentQlId };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

function stableIndex(value: string, modulo: number) {
  const digest = createHash("sha256").update(value).digest();
  return digest.readUInt32BE(0) % modulo;
}

function resolvePrototype(qlId: IntCp009PermanentQlId, seed: string): IntCp009PrototypeId {
  const authority = getIntCp009PermanentAuthority(qlId);
  return authority.sourcePrototypeIds[stableIndex(`${qlId}:${seed}:source-variant`, authority.sourcePrototypeIds.length)]!;
}

function deriveGenerationSeed(qlId: IntCp009PermanentQlId, prototypeId: IntCp009PrototypeId, sourceSeed: string) {
  return createHash("sha256")
    .update(`INT-CP009:${qlId}:${prototypeId}:${sourceSeed}`)
    .digest("hex");
}

function indianInteger(value: bigint): string {
  const source = value.toString();
  if (source.length <= 3) return source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  return `${groups.join(",")},${tail}`;
}

function money(value: Rational): string {
  if (value.denominator !== 1n) {
    let paise = (value.numerator * 100n) / value.denominator;
    const remainder = (value.numerator * 100n) % value.denominator;
    if (remainder * 2n >= value.denominator) paise += 1n;
    const rupees = paise / 100n;
    const p = paise % 100n;
    return p === 0n ? `₹${indianInteger(rupees)}` : `₹${indianInteger(rupees)}.${p.toString().padStart(2, "0")}`;
  }
  return `₹${indianInteger(value.numerator)}`;
}

function percent(value: Rational): string {
  return value.denominator === 1n ? `${value.numerator}%` : `${value.numerator}/${value.denominator}%`;
}

function timePhrase(period: number, unit: "YEAR" | "HALF_YEAR") {
  if (period === 0) return "today";
  return unit === "YEAR" ? `at the end of year ${period}` : `at the end of half-year ${period}`;
}

function rateText(rate: Rational, unit: "YEAR" | "HALF_YEAR") {
  return unit === "YEAR" ? `${percent(rate)} p.a., compounded annually` : `${percent(rate)} per half-year, compounded half-yearly`;
}

function moneyOptions(correct: Rational, desiredIndex: number) {
  if (correct.denominator !== 1n) throw new Error("CP009 P001 production answer must be integral");
  const whole = correct.numerator;
  let step = whole / 20n;
  if (step < 500n) step = 500n;
  step = ((step + 499n) / 500n) * 500n;
  const lower = whole - step > 0n ? whole - step : whole + 3n * step;
  const correctValue = rat(whole);
  const distractors = [rat(lower), rat(whole + step), rat(whole + 2n * step)];
  const ordered = [...distractors];
  ordered.splice(desiredIndex, 0, correctValue);
  return Object.freeze(ordered.map((value) => deepFreeze({ value, text: money(value) })));
}

function diversifyFutureFundPackage(source: any, generationSeed: string) {
  if (source.prototypeId !== "INT-CP009-PROT-001") return source;
  const state = source.mathematicalState as {
    prototypeId: "INT-CP009-PROT-001";
    periodicRatePercent: Rational;
    periodUnit: "YEAR" | "HALF_YEAR";
    duePeriod: number;
    deposits: readonly { atPeriod: number; amount: Rational; direction: "DEPOSIT" }[];
  };
  const factor = intCp009GrowthFactor(state.periodicRatePercent);
  const digest = createHash("sha256").update(`${generationSeed}:p001-object-pool`).digest();
  const targetRanges = [[8_000n, 14_000n], [15_000n, 21_000n], [22_000n, 30_000n]] as const;
  const deposits = state.deposits.map((flow, index) => {
    const remaining = state.duePeriod - flow.atPeriod;
    const quantum = factor.denominator ** BigInt(remaining);
    const [minimum, maximum] = targetRanges[index]!;
    const minimumCoefficient = (minimum + quantum - 1n) / quantum;
    const maximumCoefficient = maximum / quantum;
    const span = Number(maximumCoefficient - minimumCoefficient + 1n);
    if (span <= 0) throw new Error(`CP009 P001 object-pool range has no exact amount for deposit ${index + 1}`);
    const selector = BigInt(digest.readUInt16BE(index * 2) % span);
    return deepFreeze({ ...flow, amount: rat((minimumCoefficient + selector) * quantum) });
  });
  const mathematicalState = deepFreeze({ ...state, deposits: Object.freeze(deposits) });
  const answer = solveIntCp009Prototype(mathematicalState as any);
  if (!verifyIntCp009PrototypeAnswer(mathematicalState as any, answer)) throw new Error("CP009 P001 diversified state failed independent verification");

  const list = deposits.map((flow) => `${money(flow.amount)} ${timePhrase(flow.atPeriod, state.periodUnit)}`).join(", ");
  const target = timePhrase(state.duePeriod, state.periodUnit);
  const family = String(source.presentation.stemFamilyId);
  const familyIndex = family.endsWith("T2") ? 1 : family.endsWith("T3") ? 2 : 0;
  const prompts = [
    `A savings account earns ${rateText(state.periodicRatePercent, state.periodUnit)}. Deposits of ${list} are made. Find the value of the account ${target}.`,
    `Riya deposits ${list} into an account earning ${rateText(state.periodicRatePercent, state.periodUnit)}. What amount will be in the account ${target}?`,
    `Three unequal deposits—${list}—earn ${rateText(state.periodicRatePercent, state.periodUnit)}. Determine their total accumulated value ${target}.`,
  ];
  const presentation = deepFreeze({ ...source.presentation, prompt: prompts[familyIndex]! });
  const factorText = `${factor.numerator}/${factor.denominator}`;
  const values = deposits.map((flow) => intCp009ShiftAmount(flow.amount, state.periodicRatePercent, flow.atPeriod, state.duePeriod));
  const explanation = deepFreeze({
    keyIdea: "Each deposit earns interest only from its own deposit date. Move every deposit to the target date and then add the accumulated values.",
    steps: Object.freeze([
      `Growth factor per period = ${factorText}.`,
      deposits.map((flow, index) => `${money(flow.amount)} × (${factorText})^${state.duePeriod - flow.atPeriod} = ${money(values[index]!)}`).join("; "),
      `${values.map((value) => money(value)).join(" + ")} = ${money(answer)}.`,
      `Therefore, the fund value is ${money(answer)}.`,
    ]),
    finalAnswer: money(answer),
  });
  const correctIndex = source.correctIndex as number;
  const options = moneyOptions(answer, correctIndex);

  return deepFreeze({
    ...source,
    productionDiversificationVersion: INT_CP009_P001_OBJECT_POOL_VERSION,
    mathematicalState,
    answer,
    presentation,
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    explanation,
  });
}

export function getIntCp009PrototypeForPermanentQl(qlId: IntCp009PermanentQlId, seed: string | number) {
  return resolvePrototype(qlId, String(seed));
}

export function generateIntCp009Permanent(qlId: IntCp009PermanentQlId, seed: string | number) {
  const sourceSeed = String(seed);
  const authority = getIntCp009PermanentAuthority(qlId);
  const prototypeId = resolvePrototype(qlId, sourceSeed);
  const generationSeed = deriveGenerationSeed(qlId, prototypeId, sourceSeed);
  const certifiedSource = buildIntCp009ExamReadyPolishedPackage(prototypeId, `permanent:${qlId}:${prototypeId}:${generationSeed}`) as any;
  const source = diversifyFutureFundPackage(certifiedSource, generationSeed) as any;

  const canonical = solveIntCp009Prototype(source.mathematicalState);
  if (!eq(canonical, source.answer)) throw new Error(`${qlId}/${sourceSeed}: canonical answer drift.`);
  if (!verifyIntCp009PrototypeAnswer(source.mathematicalState, source.answer)) throw new Error(`${qlId}/${sourceSeed}: independent verifier rejected answer.`);
  if (source.options[source.correctIndex]?.text !== source.correctAnswer) throw new Error(`${qlId}/${sourceSeed}: option ownership drift.`);

  const fingerprint = createHash("sha256")
    .update(stable({ qlId, prototypeId, state: source.mathematicalState, answer: source.answer }))
    .digest("hex");

  return deepFreeze({
    productionRuntimeVersion: INT_CP009_PRODUCTION_RUNTIME_VERSION,
    checkpointId: "INT-CP-009" as const,
    permanentQlId: qlId,
    authorityId: authority.authorityId,
    solveContract: authority.solveContract,
    sourcePrototypeId: prototypeId,
    sourceVariantCount: authority.sourcePrototypeIds.length,
    sourceSeed,
    locale: "en-IN" as const,
    stem: source.presentation.prompt,
    stemFamilyId: source.presentation.stemFamilyId,
    options: source.options,
    correctIndex: source.correctIndex,
    correctAnswer: source.correctAnswer,
    answer: source.answer,
    answerSemantic: source.answerSemantic,
    permanentAnswerSemantic: authority.answerSemantic,
    explanation: source.explanation,
    mathematicalState: source.mathematicalState,
    difficultyBand: authority.baselineDifficulty,
    mathematicalFingerprint: fingerprint,
    lifecycle: deepFreeze({
      active: true as const,
      permanentIdentityAllocated: true as const,
      productionRuntimeReady: true as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
    sourcePackage: source,
  });
}
