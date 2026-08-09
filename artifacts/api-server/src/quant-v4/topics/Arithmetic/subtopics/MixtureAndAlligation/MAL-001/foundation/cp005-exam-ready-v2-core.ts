import {
  addRational,
  compareRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import type { Rational } from "./types";
import {
  MAL_CP005_ALLOWED_DISPLAY_DENOMINATORS_V2,
  MAL_CP005_CHEAPER_CONTEXTS_V2,
  MAL_CP005_FREE_CONTEXTS_V2,
  MAL_CP005_NATURAL_RATIOS_V2,
  MAL_CP005_PURE_COSTS_V2,
  MAL_CP005_QUANTITY_SCALES_V2,
  MAL_CP005_TARGET_PROFITS_V2,
  type MalCp005CheaperContextV2,
  type MalCp005FreeContextV2,
} from "./cp005-exam-ready-v2-data";
import { MAL_CP005_DISCOVERY_REGISTRY } from "./cp005-discovery-registry";
import type {
  MalCp005DiscoveryPrototypeId,
  MalCp005OptionAudit,
  MalCp005SolveRequest,
  MalCp005SolveResult,
} from "./cp005-types";
import {
  MAL_CP005_EXAM_READY_V2_ALLIGATION_ID,
  MAL_CP005_EXAM_READY_V2_PRESENTATION_ID,
  MAL_CP005_EXAM_READY_V2_RUNTIME_ID,
  type MalCp005AlligationHelpV2,
  type MalCp005AlligationVisualV2,
  type MalCp005ExamReadyQuestionV2,
  type MalCp005ExamSetSelectionResultV2,
  type MalCp005NumberProvenanceV2,
} from "./cp005-exam-ready-v2-types";

export const HUNDRED_V2 = rational(100);

export interface MalCp005FreeStateV2 {
  context: MalCp005FreeContextV2;
  purePart: Rational;
  adulterantPart: Rational;
  scale: Rational;
  pureQuantity: Rational;
  adulterantQuantity: Rational;
  pureUnitCost: Rational;
  profitPercentAtPureCost: Rational;
  finalAdulterantPercent: Rational;
  stateKey: string;
  siblingStateKey: string;
}

export interface MalCp005FreeCommercialStateV2 extends MalCp005FreeStateV2 {
  targetProfitPercent: Rational;
  averageCost: Rational;
  sellingRate: Rational;
}

export interface MalCp005CheaperCommercialStateV2 {
  context: MalCp005CheaperContextV2;
  purePart: Rational;
  adulterantPart: Rational;
  scale: Rational;
  pureQuantity: Rational;
  adulterantQuantity: Rational;
  pureUnitCost: Rational;
  adulterantUnitCost: Rational;
  targetProfitPercent: Rational;
  averageCost: Rational;
  sellingRate: Rational;
  stateKey: string;
  siblingStateKey: string;
}

export interface MalCp005OptionCandidateV2 {
  text: string;
  misconceptionId: string;
  physicallyPossible?: boolean;
}

export function hashV2(value: string): number {
  let state = 2166136261;
  for (const character of value) {
    state ^= character.codePointAt(0) ?? 0;
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

export function pickV2<T>(values: readonly T[], seed: string): T {
  if (values.length === 0) throw new Error("Cannot pick from an empty list.");
  return values[hashV2(seed) % values.length]!;
}

function shuffleV2<T>(values: readonly T[], seed: string): T[] {
  const result = [...values];
  let state = hashV2(seed) || 0x9e3779b9;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = next() % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

export function rV2(numerator: number, denominator = 1): Rational {
  return rational(numerator, denominator);
}

export function percentTextV2(value: Rational): string {
  return `${formatRational(value)}%`;
}

export function quantityTextV2(value: Rational, unit: "litres" | "kg"): string {
  const displayedUnit =
    unit === "litres" && value.numerator === value.denominator
      ? "litre"
      : unit;
  return `${formatRational(value)} ${displayedUnit}`;
}

export function rateTextV2(value: Rational, unit: "litres" | "kg"): string {
  return `₹${formatRational(value)} per ${unit === "kg" ? "kg" : "litre"}`;
}

export function moneyTextV2(value: Rational): string {
  return `₹${formatRational(value)}`;
}

export function ratioTextV2(first: Rational, second: Rational): string {
  return `${formatRational(first)} : ${formatRational(second)}`;
}

export function actorPhraseV2(actor: string): string {
  return `${/^[aeiou]/iu.test(actor) ? "An" : "A"} ${actor}`;
}

export function reducedRatioTextV2(first: Rational, second: Rational): string {
  const [a, b] = reduceRationalRatio(first, second);
  return ratioTextV2(a, b);
}

function allowedDisplayDenominator(value: Rational): boolean {
  return MAL_CP005_ALLOWED_DISPLAY_DENOMINATORS_V2.has(Number(value.denominator));
}

export function naturalDisplayTextV2(text: string): boolean {
  for (const match of text.matchAll(/(?:^|\s)(\d+)\/(\d+)(?=\D|$)/gu)) {
    const denominator = Number(match[2]);
    if (!MAL_CP005_ALLOWED_DISPLAY_DENOMINATORS_V2.has(denominator)) return false;
  }
  return text.length <= 48;
}

function canonicalOption(text: string): string {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}

export function buildNaturalOptionsV2(
  answer: string,
  candidates: readonly MalCp005OptionCandidateV2[],
  seed: string,
): { options: string[]; correctIndex: number; optionAudit: MalCp005OptionAudit[] } {
  if (!naturalDisplayTextV2(answer)) {
    throw new Error(`Correct answer is not exam-natural: ${answer}`);
  }
  const unique = new Map<string, MalCp005OptionCandidateV2>();
  for (const candidate of candidates) {
    const key = canonicalOption(candidate.text);
    if (
      key !== canonicalOption(answer) &&
      candidate.physicallyPossible !== false &&
      naturalDisplayTextV2(candidate.text) &&
      !unique.has(key)
    ) {
      unique.set(key, candidate);
    }
  }
  if (unique.size < 3) {
    throw new Error(`Insufficient exam-natural distractors for ${seed}.`);
  }
  const distractors = shuffleV2([...unique.values()], `${seed}:distractors`).slice(0, 3);
  const selected = shuffleV2(
    [{ text: answer, misconceptionId: "correct" }, ...distractors],
    `${seed}:positions`,
  );
  const correctIndex = selected.findIndex(
    (item) => canonicalOption(item.text) === canonicalOption(answer),
  );
  return {
    options: selected.map((item) => item.text),
    correctIndex,
    optionAudit: selected.map((item) => ({
      text: item.text,
      misconceptionId: item.misconceptionId,
      isCorrect: canonicalOption(item.text) === canonicalOption(answer),
    })),
  };
}

function ratioFromSeed(seed: string): [Rational, Rational] {
  const pair = pickV2(MAL_CP005_NATURAL_RATIOS_V2, `${seed}:ratio`);
  return [rV2(pair[0]), rV2(pair[1])];
}

function scaleFromSeed(seed: string): Rational {
  return rV2(pickV2(MAL_CP005_QUANTITY_SCALES_V2, `${seed}:scale`));
}

function targetProfitFromSeed(seed: string): Rational {
  const selected = pickV2(MAL_CP005_TARGET_PROFITS_V2, `${seed}:target-profit`);
  return rV2(selected.numerator, selected.denominator);
}

export function freeStateV2(seed: string): MalCp005FreeStateV2 {
  const context = pickV2(MAL_CP005_FREE_CONTEXTS_V2, `${seed}:context`);
  const [purePart, adulterantPart] = ratioFromSeed(seed);
  const scale = scaleFromSeed(seed);
  const pureQuantity = multiplyRational(purePart, scale);
  const adulterantQuantity = multiplyRational(adulterantPart, scale);
  const pureUnitCost = rV2(pickV2(MAL_CP005_PURE_COSTS_V2, `${seed}:pure-cost`));
  const profitPercentAtPureCost = multiplyRational(
    divideRational(adulterantPart, purePart),
    HUNDRED_V2,
  );
  const finalAdulterantPercent = multiplyRational(
    divideRational(adulterantPart, addRational(purePart, adulterantPart)),
    HUNDRED_V2,
  );
  const ratioKey = `${rationalKey(purePart)}:${rationalKey(adulterantPart)}`;
  return {
    context,
    purePart,
    adulterantPart,
    scale,
    pureQuantity,
    adulterantQuantity,
    pureUnitCost,
    profitPercentAtPureCost,
    finalAdulterantPercent,
    stateKey: `FREE-PURE-COST|${context.product}|${ratioKey}|${rationalKey(scale)}|${rationalKey(pureUnitCost)}`,
    siblingStateKey: `FREE-PURE-COST|${context.product}|${ratioKey}`,
  };
}

export function freeCommercialStateV2(seed: string): MalCp005FreeCommercialStateV2 {
  const base = freeStateV2(seed);
  const targetProfitPercent = targetProfitFromSeed(seed);
  const totalPart = addRational(base.purePart, base.adulterantPart);
  const averageCost = divideRational(
    multiplyRational(base.purePart, base.pureUnitCost),
    totalPart,
  );
  const sellingRate = divideRational(
    multiplyRational(averageCost, addRational(HUNDRED_V2, targetProfitPercent)),
    HUNDRED_V2,
  );
  if (!allowedDisplayDenominator(averageCost) || !allowedDisplayDenominator(sellingRate)) {
    throw new Error("Commercial state does not have exam-natural rates.");
  }
  const commercialKey = `${base.context.product}|${rationalKey(base.purePart)}:${rationalKey(base.adulterantPart)}|${rationalKey(base.pureUnitCost)}|${rationalKey(targetProfitPercent)}`;
  return {
    ...base,
    targetProfitPercent,
    averageCost,
    sellingRate,
    stateKey: `FREE-COMMERCIAL|${commercialKey}|${rationalKey(base.scale)}`,
    siblingStateKey: `FREE-COMMERCIAL|${commercialKey}`,
  };
}

export function cheaperCommercialStateV2(
  seed: string,
): MalCp005CheaperCommercialStateV2 {
  const context = pickV2(MAL_CP005_CHEAPER_CONTEXTS_V2, `${seed}:context`);
  const [purePart, adulterantPart] = ratioFromSeed(seed);
  const scale = scaleFromSeed(seed);
  const pureQuantity = multiplyRational(purePart, scale);
  const adulterantQuantity = multiplyRational(adulterantPart, scale);
  const pureUnitCost = rV2(context.pureUnitCost);
  const adulterantUnitCost = rV2(context.adulterantUnitCost);
  const targetProfitPercent = targetProfitFromSeed(seed);
  const totalPart = addRational(purePart, adulterantPart);
  const averageCost = divideRational(
    addRational(
      multiplyRational(purePart, pureUnitCost),
      multiplyRational(adulterantPart, adulterantUnitCost),
    ),
    totalPart,
  );
  const sellingRate = divideRational(
    multiplyRational(averageCost, addRational(HUNDRED_V2, targetProfitPercent)),
    HUNDRED_V2,
  );
  if (!allowedDisplayDenominator(averageCost) || !allowedDisplayDenominator(sellingRate)) {
    throw new Error("Cheaper-ingredient state does not have exam-natural rates.");
  }
  const ratioKey = `${rationalKey(purePart)}:${rationalKey(adulterantPart)}`;
  const commercialKey = `${context.product}|${context.adulterant}|${ratioKey}|${rationalKey(targetProfitPercent)}`;
  return {
    context,
    purePart,
    adulterantPart,
    scale,
    pureQuantity,
    adulterantQuantity,
    pureUnitCost,
    adulterantUnitCost,
    targetProfitPercent,
    averageCost,
    sellingRate,
    stateKey: `CHEAPER-COMMERCIAL|${commercialKey}|${rationalKey(scale)}`,
    siblingStateKey: `CHEAPER-COMMERCIAL|${commercialKey}`,
  };
}

function base64Url(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

export function alligationHelpV2(input: {
  lowerLabel: string;
  lowerValue: Rational;
  higherLabel: string;
  higherValue: Rational;
  targetValue: Rational;
  higherQuantityPart: Rational;
  lowerQuantityPart: Rational;
  ratioLabel: string;
  ratio: string;
  result: string;
  unit: "litres" | "kg";
}): MalCp005AlligationHelpV2 {
  const visual: MalCp005AlligationVisualV2 = {
    version: 1,
    kind: "cross",
    title: "Alligation cross for the required mixture cost",
    lower: { label: input.lowerLabel, value: rateTextV2(input.lowerValue, input.unit) },
    higher: { label: input.higherLabel, value: rateTextV2(input.higherValue, input.unit) },
    mean: { label: "Required average cost", value: rateTextV2(input.targetValue, input.unit) },
    lowerPart: {
      label: `${input.lowerLabel} quantity part`,
      value: formatRational(input.lowerQuantityPart),
      expression: `${formatRational(input.higherValue)} − ${formatRational(input.targetValue)}`,
    },
    higherPart: {
      label: `${input.higherLabel} quantity part`,
      value: formatRational(input.higherQuantityPart),
      expression: `${formatRational(input.targetValue)} − ${formatRational(input.lowerValue)}`,
    },
  };
  return {
    methodId: MAL_CP005_EXAM_READY_V2_ALLIGATION_ID,
    title: "Alternative method: Alligation cross",
    directive: `[[EXAMTREE_ALLIGATION_SVG_V1:${base64Url(visual)}]]`,
    visual,
    ratioLabel: input.ratioLabel,
    ratio: input.ratio,
    calculation: `${input.ratioLabel} = ${input.ratio}.`,
    result: input.result,
  };
}

function parsePercentOption(text: string): number | null {
  const match = text.match(/^(-?\d+)(?: (\d+)\/(\d+))?%$/u);
  if (!match) return null;
  const whole = Number(match[1]);
  const fraction = match[2] ? Number(match[2]) / Number(match[3]) : 0;
  return whole < 0 ? whole - fraction : whole + fraction;
}

function validateExamReadyQuestionV2(
  question: Omit<MalCp005ExamReadyQuestionV2, "validation">,
): MalCp005ExamReadyQuestionV2["validation"] {
  const errors: string[] = [];
  const checks: MalCp005ExamReadyQuestionV2["validation"]["checks"] = [];
  const check = (name: string, passed: boolean, message: string) => {
    checks.push({ name, passed, message });
    if (!passed) errors.push(message);
  };
  check("INTERROGATIVE_STEM", question.stem.endsWith("?"), "Stem is not interrogative.");
  check("FOUR_UNIQUE_OPTIONS", question.options.length === 4 && new Set(question.options.map(canonicalOption)).size === 4, "Question must have four unique options.");
  check("CORRECT_OPTION", question.options[question.correctIndex] === question.answer, "Correct option does not match the canonical answer.");
  check("NATURAL_OPTIONS", question.options.every(naturalDisplayTextV2), "An option has an awkward display denominator or excessive length.");
  check("SOLUTION_FIRST_DEPTH", question.explanation.visibleLines.length >= 1 && question.explanation.visibleLines.length <= 3, "Default solution must contain one to three lines.");
  check("NO_SINGULAR_ERROR", !/\b1 litres\b/iu.test(JSON.stringify({ stem: question.stem, explanation: question.explanation })), "Singular litre grammar is incorrect.");
  check("NO_HARD_MISLABEL", question.difficulty !== ("Hard" as never), "Wave 01 algebra was incorrectly labelled Hard.");
  check("NO_HIDDEN_NUMBER_AUTHORITY", question.numberProvenance.hiddenStateKeys.length === 0, "A hidden-state number remains available to learner-facing content.");
  check("REVIEW_ONLY_LIFECYCLE", !question.active && !question.publiclyPublishable && !question.questionBankWritable && !question.testEligible && question.runtimeMode === "REVIEW_ONLY", "Review-only lifecycle changed.");
  const expectsAlligation =
    question.prototypeId === "MAL-CP005-PROT-FREE-BLEND-RATIO-FROM-COST-SELLING-RATE-AND-TARGET-PROFIT" ||
    question.prototypeId === "MAL-CP005-PROT-CHEAPER-IMPURITY-RATIO-FROM-TARGET-PROFIT";
  const alternative = question.explanation.optionalHelp.alternativeMethod;
  check("SELECTIVE_ALLIGATION", expectsAlligation === Boolean(alternative), "Selective alligation policy is inconsistent.");
  if (alternative) {
    check("SVG_DIRECTIVE", alternative.directive.startsWith("[[EXAMTREE_ALLIGATION_SVG_V1:"), "Alligation does not use the shared SVG directive.");
    check("ALLIGATION_ANSWER", alternative.result.includes(question.answer), "Alligation result omits the canonical answer.");
  }
  if (question.answerSemantic === "ADULTERANT_PERCENT_OF_MIXTURE") {
    check("PHYSICAL_PERCENT_OPTIONS", question.options.every((option) => {
      const value = parsePercentOption(option);
      return value !== null && value >= 0 && value <= 100;
    }), "A final-mixture percentage option lies outside 0% to 100%.");
  }
  return { ok: errors.length === 0, errors, checks };
}

export function packageExamReadyQuestionV2(input: {
  prototypeId: MalCp005DiscoveryPrototypeId;
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
  stateKey: string;
  siblingStateKey: string;
  request: MalCp005SolveRequest;
  solution: MalCp005SolveResult;
  exactState: Record<string, Rational | string>;
  stem: string;
  answer: string;
  options: ReturnType<typeof buildNaturalOptionsV2>;
  visibleLines: string[];
  commonMistake: string;
  verification?: string[];
  alternativeMethod?: MalCp005AlligationHelpV2;
  numberProvenance: MalCp005NumberProvenanceV2;
}): MalCp005ExamReadyQuestionV2 {
  const registry = MAL_CP005_DISCOVERY_REGISTRY.find(
    (entry) => entry.prototypeId === input.prototypeId,
  );
  if (!registry) throw new Error(`Missing CP-005 registry entry ${input.prototypeId}.`);
  const difficulty =
    input.prototypeId === "MAL-CP005-PROT-PROFIT-FROM-FREE-ADULTERANT-QUANTITIES" ||
    input.prototypeId === "MAL-CP005-PROT-RATIO-FROM-TARGET-PROFIT-AT-PURE-COST"
      ? "Easy"
      : "Medium";
  const withoutValidation: Omit<MalCp005ExamReadyQuestionV2, "validation"> = {
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-005",
    runtimeId: MAL_CP005_EXAM_READY_V2_RUNTIME_ID,
    presentationId: MAL_CP005_EXAM_READY_V2_PRESENTATION_ID,
    prototypeId: input.prototypeId,
    permanentQlId: null,
    questionLanguageId: `${input.prototypeId}-EN-V2`,
    questionId: `MAL-CP005-V2-${hashV2(`${input.prototypeId}|${input.requestedSeed}`).toString(16).padStart(8, "0")}`,
    language: "en",
    requestedSeed: input.requestedSeed,
    selectedSeed: input.selectedSeed,
    selectionAttempt: input.selectionAttempt,
    stateKey: input.stateKey,
    siblingStateKey: input.siblingStateKey,
    difficulty,
    taskDirection: registry.taskDirection,
    answerSemantic: registry.answerSemantic,
    sourceEvidenceIds: [
      ...registry.legacyFamilyAuthorities,
      ...registry.directReferenceAuthorities,
      "MAL-CP-005-WAVE-01-EXECUTABLE-DISCOVERY",
      "MAL-CP-005-EXAM-READINESS-REMEDIATION-V2",
    ],
    sourceEvidenceStatus: registry.sourceEvidenceStatus,
    request: input.request,
    solution: input.solution,
    exactState: input.exactState,
    stem: input.stem,
    answer: input.answer,
    ...input.options,
    explanation: {
      layoutId: "MAL-CP005-EN-SOLUTION-FIRST-V2",
      visibleLines: input.visibleLines,
      answerLine: `Answer: ${input.answer}`,
      optionalHelp: {
        commonMistake: input.commonMistake,
        ...(input.verification ? { verification: input.verification } : {}),
        ...(input.alternativeMethod ? { alternativeMethod: input.alternativeMethod } : {}),
      },
    },
    numberProvenance: input.numberProvenance,
    maturity: "EXAM_READY_REVIEW_CANDIDATE",
    allocationStatus: "UNALLOCATED_OPEN_DISCOVERY",
    reviewStatus: "PENDING_PRODUCT_REVIEW",
    runtimeMode: "REVIEW_ONLY",
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: true,
    questionBankWritable: false,
    testEligible: false,
  };
  return {
    ...withoutValidation,
    validation: validateExamReadyQuestionV2(withoutValidation),
  };
}

export function selectMalCp005ExamSetV2(
  candidates: readonly MalCp005ExamReadyQuestionV2[],
): MalCp005ExamSetSelectionResultV2 {
  const accepted: MalCp005ExamReadyQuestionV2[] = [];
  const rejected: MalCp005ExamSetSelectionResultV2["rejected"] = [];
  const usedSiblingStates = new Set<string>();
  for (const question of candidates) {
    if (usedSiblingStates.has(question.siblingStateKey)) {
      rejected.push({
        questionId: question.questionId,
        siblingStateKey: question.siblingStateKey,
        reason: "SIBLING_STATE_COLLISION",
      });
      continue;
    }
    usedSiblingStates.add(question.siblingStateKey);
    accepted.push(question);
  }
  return { accepted, rejected };
}

export function cp005ExamReadyV2Stable(
  question: MalCp005ExamReadyQuestionV2,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}

export function rationalIsPositiveV2(value: Rational): boolean {
  return compareRational(value, rational(0)) > 0;
}
