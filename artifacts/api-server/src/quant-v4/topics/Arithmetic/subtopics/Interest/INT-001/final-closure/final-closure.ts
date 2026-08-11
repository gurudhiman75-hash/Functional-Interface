import { deterministicIndex, pick, rotate } from "../foundation/prng";
import {
  addRational,
  divideRational,
  equalsRational,
  formatMoney,
  formatPercent,
  formatRational,
  isWholeRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
} from "../foundation/rational";
import type { Rational } from "../foundation/types";

export const INT_CP001_CLOSURE_PROTOTYPE_IDS = [
  "INT-CP001-CLOSE-PROT-AMOUNT-AT-OTHER-TIME",
  "INT-CP001-CLOSE-PROT-TIME-FROM-TWO-AMOUNT-RATIO",
] as const;

export type IntCp001ClosurePrototypeId = (typeof INT_CP001_CLOSURE_PROTOTYPE_IDS)[number];
export type IntCp001ClosureAnswerSemantic = "TOTAL_AMOUNT" | "TIME_YEARS";

type ClosureRequest =
  | {
      mode: "AMOUNT_AT_OTHER_TIME";
      knownAmount: Rational;
      annualRatePercent: Rational;
      knownTimeYears: Rational;
      targetTimeYears: Rational;
    }
  | {
      mode: "TIME_FROM_TWO_AMOUNT_RATIO";
      laterToEarlierAmountRatio: Rational;
      annualRatePercent: Rational;
      earlierTimeYears: Rational;
    };

interface ClosureState {
  principal: Rational;
  annualRatePercent: Rational;
  annualRate: Rational;
  earlierTimeYears: Rational;
  laterTimeYears: Rational;
  annualInterest: Rational;
  earlierAmount: Rational;
  laterAmount: Rational;
}

interface ClosureContext {
  scenarioId: string;
  actor: string;
  instrument: string;
  institution: string;
}

interface ClosureParameters {
  prototypeId: IntCp001ClosurePrototypeId;
  seed: string;
  context: ClosureContext;
  request: ClosureRequest;
  hiddenState: ClosureState;
  difficulty: "Medium" | "Hard";
  difficultyEvidence: string[];
  generationFingerprint: string;
}

interface ClosureResult {
  semantic: IntCp001ClosureAnswerSemantic;
  value: Rational;
}

interface ClosureOptionAudit {
  text: string;
  result: ClosureResult;
  misconceptionId: string;
}

interface ClosureExplanation {
  notice: string;
  relation: string;
  steps: string[];
  verification: string;
  conclusion: string;
  commonTrap: string;
}

const RATE_POOL = [
  rational(4), rational(5), rational(6), rational(15, 2), rational(8),
  rational(10), rational(25, 2), rational(12), rational(15), rational(20),
] as const;

const TIME_POOL = [
  rational(1, 2), rational(1), rational(3, 2), rational(2), rational(5, 2),
  rational(3), rational(7, 2), rational(4), rational(5), rational(6),
] as const;

const PRINCIPAL_POOL = [
  1200, 1500, 1800, 2000, 2400, 2500, 3000, 3200, 3600, 4000,
  4500, 4800, 5000, 6000, 7200, 8000, 9000, 10000, 12000, 15000,
  18000, 20000, 24000,
] as const;

const CONTEXTS: readonly ClosureContext[] = [
  { scenarioId: "FIXED_DEPOSIT", actor: "Meera", instrument: "fixed deposit", institution: "a cooperative bank" },
  { scenarioId: "POST_OFFICE", actor: "Harpreet", instrument: "term deposit", institution: "a post office" },
  { scenarioId: "EDUCATION_LOAN", actor: "Aman", instrument: "education loan", institution: "a regional bank" },
  { scenarioId: "CROP_LOAN", actor: "Gurleen", instrument: "crop loan", institution: "a rural credit society" },
  { scenarioId: "BUSINESS_ADVANCE", actor: "Ravi", instrument: "business advance", institution: "a local finance office" },
  { scenarioId: "SAVINGS_CERTIFICATE", actor: "Simran", instrument: "savings certificate", institution: "a savings cooperative" },
  { scenarioId: "EQUIPMENT_LOAN", actor: "Navdeep", instrument: "equipment loan", institution: "a district bank" },
  { scenarioId: "PERSONAL_AGREEMENT", actor: "Kiran", instrument: "stated loan agreement", institution: "a finance office" },
] as const;

function percentToRate(percent: Rational): Rational {
  return divideRational(percent, rational(100));
}

function amountAt(principal: Rational, rate: Rational, time: Rational): Rational {
  return addRational(principal, multiplyRational(multiplyRational(principal, rate), time));
}

function createState(
  principal: Rational,
  annualRatePercent: Rational,
  earlierTimeYears: Rational,
  laterTimeYears: Rational,
): ClosureState {
  const annualRate = percentToRate(annualRatePercent);
  const annualInterest = multiplyRational(principal, annualRate);
  return {
    principal,
    annualRatePercent,
    annualRate,
    earlierTimeYears,
    laterTimeYears,
    annualInterest,
    earlierAmount: amountAt(principal, annualRate, earlierTimeYears),
    laterAmount: amountAt(principal, annualRate, laterTimeYears),
  };
}

const STATES: ClosureState[] = [];
for (const principalValue of PRINCIPAL_POOL) {
  for (const rate of RATE_POOL) {
    for (const earlier of TIME_POOL) {
      for (const later of TIME_POOL) {
        if (later.numerator * earlier.denominator <= earlier.numerator * later.denominator) continue;
        const state = createState(rational(principalValue), rate, earlier, later);
        if (![state.annualInterest, state.earlierAmount, state.laterAmount].every(isWholeRational)) continue;
        STATES.push(state);
      }
    }
  }
}

function duration(value: Rational): string {
  if (isWholeRational(value)) return `${value.numerator} ${value.numerator === 1n ? "year" : "years"}`;
  const months = multiplyRational(value, rational(12));
  if (isWholeRational(months)) return `${months.numerator} ${months.numerator === 1n ? "month" : "months"}`;
  return `${formatRational(value)} years`;
}

function solve(request: ClosureRequest): ClosureResult {
  switch (request.mode) {
    case "AMOUNT_AT_OTHER_TIME": {
      const rate = percentToRate(request.annualRatePercent);
      const knownMultiplier = addRational(rational(1), multiplyRational(rate, request.knownTimeYears));
      const principal = divideRational(request.knownAmount, knownMultiplier);
      return {
        semantic: "TOTAL_AMOUNT",
        value: amountAt(principal, rate, request.targetTimeYears),
      };
    }
    case "TIME_FROM_TWO_AMOUNT_RATIO": {
      const rate = percentToRate(request.annualRatePercent);
      const numerator = subtractRational(
        multiplyRational(
          request.laterToEarlierAmountRatio,
          addRational(rational(1), multiplyRational(rate, request.earlierTimeYears)),
        ),
        rational(1),
      );
      return { semantic: "TIME_YEARS", value: divideRational(numerator, rate) };
    }
  }
}

function verify(parameters: ClosureParameters, solution: ClosureResult): { ok: boolean; errors: string[]; matchingCandidates: string[] } {
  const errors: string[] = [];
  const state = parameters.hiddenState;
  if (!equalsRational(state.earlierAmount, amountAt(state.principal, state.annualRate, state.earlierTimeYears))) {
    errors.push("Earlier amount does not balance.");
  }
  if (!equalsRational(state.laterAmount, amountAt(state.principal, state.annualRate, state.laterTimeYears))) {
    errors.push("Later amount does not balance.");
  }

  const matches: Rational[] = [];
  if (parameters.request.mode === "AMOUNT_AT_OTHER_TIME") {
    for (let value = 100n; value <= 50000n; value += 100n) {
      const candidate = rational(value);
      if (equalsRational(
        amountAt(candidate, state.annualRate, parameters.request.knownTimeYears),
        parameters.request.knownAmount,
      )) matches.push(candidate);
    }
    if (matches.length !== 1) errors.push(`Expected one admissible principal; found ${matches.length}.`);
    if (matches.length === 1) {
      const reconstructed = amountAt(matches[0]!, state.annualRate, parameters.request.targetTimeYears);
      if (!equalsRational(reconstructed, solution.value)) errors.push("Enumerated principal does not reconstruct the solver amount.");
    }
  } else {
    for (const candidate of TIME_POOL) {
      if (candidate.numerator * parameters.request.earlierTimeYears.denominator <= parameters.request.earlierTimeYears.numerator * candidate.denominator) continue;
      const earlierFactor = addRational(rational(1), multiplyRational(state.annualRate, parameters.request.earlierTimeYears));
      const laterFactor = addRational(rational(1), multiplyRational(state.annualRate, candidate));
      if (equalsRational(divideRational(laterFactor, earlierFactor), parameters.request.laterToEarlierAmountRatio)) {
        matches.push(candidate);
      }
    }
    if (matches.length !== 1) errors.push(`Expected one admissible later time; found ${matches.length}.`);
    if (matches.length === 1 && !equalsRational(matches[0]!, solution.value)) {
      errors.push("Enumerated time disagrees with the solver time.");
    }
  }

  return { ok: errors.length === 0, errors, matchingCandidates: matches.map(rationalKey) };
}

function formatAnswer(result: ClosureResult): string {
  return result.semantic === "TOTAL_AMOUNT" ? formatMoney(result.value) : duration(result.value);
}

function buildOptions(parameters: ClosureParameters, solution: ClosureResult): {
  options: string[];
  optionAudit: ClosureOptionAudit[];
  correctIndex: number;
} {
  const state = parameters.hiddenState;
  const candidates: ClosureOptionAudit[] = [{ text: formatAnswer(solution), result: solution, misconceptionId: "CORRECT" }];

  if (parameters.request.mode === "AMOUNT_AT_OTHER_TIME") {
    const wrongStates: Array<[Rational, string]> = [
      [state.earlierAmount, "RETURNED_KNOWN_AMOUNT"],
      [amountAt(state.earlierAmount, state.annualRate, subtractRational(state.laterTimeYears, state.earlierTimeYears)), "USED_KNOWN_AMOUNT_AS_PRINCIPAL"],
      [amountAt(state.principal, state.annualRate, subtractRational(state.laterTimeYears, state.earlierTimeYears)), "RESET_TIME_ORIGIN"],
      [addRational(state.laterAmount, state.annualInterest), "ADDED_ONE_EXTRA_YEAR"],
      [subtractRational(state.laterAmount, state.annualInterest), "REMOVED_ONE_YEAR"],
    ];
    for (const [value, label] of wrongStates) {
      if (value.numerator <= 0n || !isWholeRational(value)) continue;
      const result: ClosureResult = { semantic: "TOTAL_AMOUNT", value };
      candidates.push({ text: formatAnswer(result), result, misconceptionId: label });
    }
  } else {
    const k = parameters.request.laterToEarlierAmountRatio;
    const r = state.annualRate;
    const wrongStates: Array<[Rational, string]> = [
      [subtractRational(state.laterTimeYears, state.earlierTimeYears), "REPORTED_TIME_GAP"],
      [divideRational(subtractRational(k, rational(1)), r), "IGNORED_EARLIER_AMOUNT_FACTOR"],
      [divideRational(k, r), "FAILED_TO_REMOVE_PRINCIPAL_UNIT"],
      [state.earlierTimeYears, "RETURNED_KNOWN_TIME"],
    ];
    for (const [value, label] of wrongStates) {
      if (value.numerator <= 0n) continue;
      const result: ClosureResult = { semantic: "TIME_YEARS", value };
      candidates.push({ text: formatAnswer(result), result, misconceptionId: label });
    }
    for (const fallback of TIME_POOL) {
      const result: ClosureResult = { semantic: "TIME_YEARS", value: fallback };
      candidates.push({ text: formatAnswer(result), result, misconceptionId: "ADMISSIBLE_TIME_FROM_WRONG_RELATION" });
    }
  }

  const unique = [...new Map(candidates.map((item) => [item.text, item])).values()];
  const selected = [unique[0]!, ...unique.slice(1, 4)];
  if (selected.length !== 4) throw new Error(`${parameters.prototypeId} could not construct four unique options.`);
  const correctIndex = deterministicIndex(`${parameters.prototypeId}:${parameters.seed}:correct`, 4);
  const ordered = rotate(selected, 4 - correctIndex);
  return { options: ordered.map((item) => item.text), optionAudit: ordered, correctIndex: ordered.findIndex((item) => item.misconceptionId === "CORRECT") };
}

function presentation(parameters: ClosureParameters, solution: ClosureResult): { stem: string; explanation: ClosureExplanation; reasoningGraph: { nodes: Array<{ id: string; kind: string; text: string; dependsOn: string[] }> } } {
  const state = parameters.hiddenState;
  const variant = deterministicIndex(`${parameters.prototypeId}:${parameters.seed}:stem`, 3);
  const lead = [
    `${parameters.context.actor}'s ${parameters.context.instrument} with ${parameters.context.institution}`,
    `${parameters.context.institution} records ${parameters.context.actor}'s ${parameters.context.instrument}`,
    `For ${parameters.context.actor}'s ${parameters.context.instrument}`,
  ][variant]!;
  const answer = formatAnswer(solution);
  const rate = formatPercent(state.annualRatePercent);

  if (parameters.request.mode === "AMOUNT_AT_OTHER_TIME") {
    const known = duration(parameters.request.knownTimeYears);
    const target = duration(parameters.request.targetTimeYears);
    const stem = [
      `${lead} amounts to ${formatMoney(parameters.request.knownAmount)} after ${known} at ${rate} simple interest per annum. What will the amount be after ${target}?`,
      `At ${rate} simple interest per annum, a sum is ${formatMoney(parameters.request.knownAmount)} after ${known}. What amount will the same sum reach after ${target}?`,
      `${lead} has an amount of ${formatMoney(parameters.request.knownAmount)} at the end of ${known}. The rate is ${rate} simple interest per annum. Find the amount at the end of ${target}.`,
    ][variant]!;
    const explanation: ClosureExplanation = {
      notice: "The known amount is not the original principal. Recover the principal before moving to the new time point.",
      relation: "Use A(t) = P(1 + rt) at both time points.",
      steps: [
        `At ${known}, the amount multiplier is 1 + (${formatRational(state.annualRate)} × ${formatRational(state.earlierTimeYears)}).`,
        `${formatMoney(state.earlierAmount)} divided by that multiplier gives principal ${formatMoney(state.principal)}.`,
        `Annual simple interest on this principal is ${formatMoney(state.annualInterest)}.`,
        `For ${target}, amount = principal + interest = ${formatMoney(state.principal)} + ${formatMoney(subtractRational(state.laterAmount, state.principal))}.`,
      ],
      verification: `${formatMoney(state.laterAmount)} − ${formatMoney(state.principal)} equals the exact simple interest for ${target}.`,
      conclusion: `Therefore, the amount after ${target} is ${answer}.`,
      commonTrap: "Do not treat the amount observed at the first time point as a fresh principal.",
    };
    return { stem, explanation, reasoningGraph: graph(answer) };
  }

  const ratio = parameters.request.laterToEarlierAmountRatio;
  const earlier = duration(parameters.request.earlierTimeYears);
  const stem = [
    `Under simple interest at ${rate} per annum, the amount after an unknown later time is to the amount after ${earlier} as ${ratio.numerator}:${ratio.denominator}. What is the later time?`,
    `A sum is invested at ${rate} simple interest per annum. Its later amount and its amount after ${earlier} are in the ratio ${ratio.numerator}:${ratio.denominator}. After how long is the later amount reached?`,
    `${lead} earns ${rate} simple interest per annum. The amount at a later time is ${ratio.numerator}:${ratio.denominator} of the amount after ${earlier}. Find that later time.`,
  ][variant]!;
  const explanation: ClosureExplanation = {
    notice: "The supplied ratio compares two amounts, so both include the same original principal.",
    relation: "Use A(t₂)/A(t₁) = (1 + rt₂)/(1 + rt₁).",
    steps: [
      `Earlier time t₁ = ${formatRational(state.earlierTimeYears)} years and annual decimal rate r = ${formatRational(state.annualRate)}.`,
      `Set (1 + rt₂)/(1 + rt₁) = ${ratio.numerator}/${ratio.denominator}.`,
      `Thus 1 + rt₂ = (${ratio.numerator}/${ratio.denominator})(1 + rt₁).`,
      `Solving the exact linear equation gives t₂ = ${formatRational(state.laterTimeYears)} years.`,
    ],
    verification: `The exact amount factors at ${duration(state.laterTimeYears)} and ${earlier} reproduce ${ratio.numerator}:${ratio.denominator}.`,
    conclusion: `Therefore, the later time is ${answer}.`,
    commonTrap: "The answer is the total later time, not only the gap between the two observations.",
  };
  return { stem, explanation, reasoningGraph: graph(answer) };
}

function graph(answer: string) {
  return {
    nodes: [
      { id: "given", kind: "GIVEN", text: "Identify the amount evidence, rate and time point without treating amount as principal.", dependsOn: [] },
      { id: "relation", kind: "RELATION", text: "Use the exact linear simple-interest timeline A(t) = P(1 + rt).", dependsOn: ["given"] },
      { id: "derive", kind: "DERIVATION", text: `Derive the requested value exactly as ${answer}.`, dependsOn: ["relation"] },
      { id: "verify", kind: "VERIFICATION", text: "Reconstruct every displayed amount or ratio from the derived value.", dependsOn: ["derive"] },
      { id: "conclusion", kind: "CONCLUSION", text: `State the answer as ${answer}.`, dependsOn: ["verify"] },
    ],
  };
}

function generateParameters(prototypeId: IntCp001ClosurePrototypeId, seed: string): ClosureParameters {
  const state = pick(STATES, `${prototypeId}:${seed}:state`);
  const context = pick(CONTEXTS, `${prototypeId}:${seed}:context`);
  if (prototypeId === "INT-CP001-CLOSE-PROT-AMOUNT-AT-OTHER-TIME") {
    return {
      prototypeId,
      seed,
      context,
      request: {
        mode: "AMOUNT_AT_OTHER_TIME",
        knownAmount: state.earlierAmount,
        annualRatePercent: state.annualRatePercent,
        knownTimeYears: state.earlierTimeYears,
        targetTimeYears: state.laterTimeYears,
      },
      hiddenState: state,
      difficulty: "Medium",
      difficultyEvidence: ["The principal must be reconstructed from a known amount before changing the time point."],
      generationFingerprint: [prototypeId, rationalKey(state.principal), rationalKey(state.annualRatePercent), rationalKey(state.earlierTimeYears), rationalKey(state.laterTimeYears)].join("::"),
    };
  }
  const ratio = divideRational(state.laterAmount, state.earlierAmount);
  return {
    prototypeId,
    seed,
    context,
    request: {
      mode: "TIME_FROM_TWO_AMOUNT_RATIO",
      laterToEarlierAmountRatio: ratio,
      annualRatePercent: state.annualRatePercent,
      earlierTimeYears: state.earlierTimeYears,
    },
    hiddenState: state,
    difficulty: "Hard",
    difficultyEvidence: ["A ratio of two amount factors must be converted into an exact linear equation for the later time."],
    generationFingerprint: [prototypeId, rationalKey(state.annualRatePercent), rationalKey(state.earlierTimeYears), rationalKey(state.laterTimeYears), rationalKey(ratio)].join("::"),
  };
}

export function generateIntCp001ClosurePrototype(prototypeId: IntCp001ClosurePrototypeId, seed: string) {
  const parameters = generateParameters(prototypeId, seed);
  const solution = solve(parameters.request);
  const optionPackage = buildOptions(parameters, solution);
  const rendered = presentation(parameters, solution);
  const independent = verify(parameters, solution);
  const errors = [...independent.errors];
  if (new Set(optionPackage.options).size !== 4) errors.push("Options are not unique.");
  if (optionPackage.correctIndex < 0 || optionPackage.correctIndex > 3) errors.push("Correct index is invalid.");
  if (!rendered.explanation.conclusion.includes(optionPackage.options[optionPackage.correctIndex]!)) errors.push("Conclusion does not state the displayed answer.");
  const learnerText = `${rendered.stem} ${optionPackage.options.join(" ")} ${Object.values(rendered.explanation).flat().join(" ")}`;
  if (/INT-CP|PROT-|undefined|NaN|Infinity|PLACEHOLDER/u.test(learnerText)) errors.push("Learner text contains an internal or unresolved token.");

  return {
    archetypeId: "INT-001" as const,
    canonicalProblemId: "INT-CP-001" as const,
    discoveryWaveId: "INT-CP001-FINAL-CLOSURE" as const,
    prototypeId,
    permanentQlId: null,
    questionLanguageId: `${prototypeId}:en`,
    language: "en" as const,
    seed,
    difficulty: parameters.difficulty,
    difficultyEvidence: parameters.difficultyEvidence,
    taskDirection: prototypeId.includes("TIME-FROM") ? "INVERSE" as const : "RECONSTRUCTION" as const,
    answerSemantic: solution.semantic,
    stem: rendered.stem,
    parameters,
    solution,
    options: optionPackage.options,
    optionAudit: optionPackage.optionAudit,
    correctIndex: optionPackage.correctIndex,
    explanation: rendered.explanation,
    reasoningGraph: rendered.reasoningGraph,
    mathematicalFingerprint: `${parameters.generationFingerprint}::${solution.semantic}::${rationalKey(solution.value)}`,
    validation: { ok: errors.length === 0, errors, matchingCandidates: independent.matchingCandidates },
    reviewStatus: "UNREVIEWED" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
  };
}

export function assertIntCp001ClosureFoundation(): void {
  if (STATES.length < 1000) throw new Error(`Closure state pool is too small: ${STATES.length}.`);
}
