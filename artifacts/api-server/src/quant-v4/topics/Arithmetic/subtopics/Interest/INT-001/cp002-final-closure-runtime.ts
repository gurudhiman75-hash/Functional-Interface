import {
  addRational,
  divideRational,
  equalsRational,
  formatExact,
  formatMoney,
  formatPercent,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
} from "./foundation/rational";
import type { Rational } from "./foundation/types";
import { assertIntCp002Wave01MathJaxIntegrity } from "./cp002-wave01-runtime-v2";
import { verifyIntCp002FinalClosureCandidate } from "./cp002-final-closure-verifier";
import {
  INT_CP002_FINAL_CLOSURE_PROTOTYPE_IDS,
  type IntCp002FinalClosureAnswerSemantic,
  type IntCp002FinalClosureDifficulty,
  type IntCp002FinalClosureExplanation,
  type IntCp002FinalClosureMisconceptionId,
  type IntCp002FinalClosureOptionAudit,
  type IntCp002FinalClosurePrototypeId,
  type IntCp002FinalClosureQuestion,
  type IntCp002FinalClosureState,
} from "./cp002-final-closure-types";

const ONE_HUNDRED = rational(100);
const raw = String.raw;

interface Candidate {
  value: Rational;
  misconceptionId: IntCp002FinalClosureMisconceptionId;
  explanation: string;
}

interface BuiltQuestion {
  stem: string;
  answerSemantic: IntCp002FinalClosureAnswerSemantic;
  difficulty: IntCp002FinalClosureDifficulty;
  state: IntCp002FinalClosureState;
  solution: Rational;
  candidates: Candidate[];
  explanation: Omit<IntCp002FinalClosureExplanation, "trapAnalysis">;
}

function hash(value: string): number {
  let state = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    state ^= value.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

function pick<T>(items: readonly T[], seed: string, salt: string): T {
  return items[hash(`${seed}:${salt}`) % items.length]!;
}

function context(seed: string): { actor: string; institution: string } {
  return {
    actor: pick(["Aarav", "Diya", "Harpreet", "Ishita", "Kabir", "Mandeep", "Navya", "Yuvraj"], seed, "actor"),
    institution: pick([
      "a cooperative bank",
      "a post-office savings account",
      "a regional rural bank",
      "a credit society",
      "a community savings fund",
    ], seed, "institution"),
  };
}

function representation(seed: string): IntCp002FinalClosureState["representation"] {
  return pick(["NARRATIVE", "TABLE", "TIMELINE", "COMPARISON_CARD"] as const, seed, "representation");
}

function simpleInterest(principal: Rational, rate: Rational, time: Rational): Rational {
  return divideRational(
    multiplyRational(principal, multiplyRational(rate, time)),
    ONE_HUNDRED,
  );
}

function money(value: Rational): string {
  return formatMoney(value);
}

function rateText(value: Rational): string {
  return formatPercent(value);
}

function timeText(value: Rational): string {
  return `${formatExact(value)} ${equalsRational(value, rational(1)) ? "year" : "years"}`;
}

function ratioText(value: Rational): string {
  return `${value.numerator}:${value.denominator}`;
}

function formatAnswer(value: Rational, semantic: IntCp002FinalClosureAnswerSemantic): string {
  switch (semantic) {
    case "MONEY": return money(value);
    case "PRINCIPAL": return money(value);
    case "RATIO": return ratioText(value);
    case "TIME_YEARS": return timeText(value);
  }
}

function rotateCandidates(
  candidates: Candidate[],
  semantic: IntCp002FinalClosureAnswerSemantic,
  seed: string,
): {
  options: string[];
  optionAudit: IntCp002FinalClosureOptionAudit[];
  correctIndex: number;
  trapAnalysis: IntCp002FinalClosureExplanation["trapAnalysis"];
} {
  if (candidates.length !== 4) throw new Error("CP-002 final closure requires exactly four candidates.");
  if (candidates.filter((candidate) => candidate.misconceptionId === "CORRECT").length !== 1) {
    throw new Error("CP-002 final closure requires exactly one correct candidate.");
  }
  const audited = candidates.map((candidate) => ({
    text: formatAnswer(candidate.value, semantic),
    value: candidate.value,
    misconceptionId: candidate.misconceptionId,
    explanation: candidate.explanation,
  }));
  if (new Set(audited.map((candidate) => candidate.text)).size !== 4) {
    throw new Error("CP-002 final closure formatted-option collision.");
  }
  const rotation = hash(`${seed}:option-rotation`) % 4;
  const rotated = audited.map((_candidate, index) => audited[(index + rotation) % 4]!);
  const correctIndex = rotated.findIndex((candidate) => candidate.misconceptionId === "CORRECT");
  return {
    options: rotated.map((candidate) => candidate.text),
    optionAudit: rotated,
    correctIndex,
    trapAnalysis: rotated
      .map((candidate, index) => ({ candidate, index }))
      .filter(({ candidate }) => candidate.misconceptionId !== "CORRECT")
      .map(({ candidate, index }) => ({
        optionNumber: index + 1,
        misconceptionId: candidate.misconceptionId as Exclude<IntCp002FinalClosureMisconceptionId, "CORRECT">,
        explanation: candidate.explanation,
      })),
  };
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function learnerText(question: IntCp002FinalClosureQuestion): string {
  return [
    question.stem,
    ...question.options,
    question.explanation.mainRule,
    ...question.explanation.workedSteps,
    question.explanation.examShortcut,
    question.explanation.verification,
    question.explanation.conclusion,
    ...question.explanation.trapAnalysis.map((item) => item.explanation),
  ].join("\n");
}

function finish(
  prototypeId: IntCp002FinalClosurePrototypeId,
  requestedSeed: string,
  effectiveSeed: string,
  generationAttempts: number,
  built: BuiltQuestion,
): IntCp002FinalClosureQuestion {
  const optionShape = rotateCandidates(built.candidates, built.answerSemantic, effectiveSeed);
  const draft: IntCp002FinalClosureQuestion = {
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-002",
    checkpointId: "INT-CP-002-FINAL-SATURATION",
    prototypeId,
    permanentQlId: null,
    frozenSolveContractId: null,
    seed: requestedSeed,
    effectiveSeed,
    generationAttempts,
    language: "en",
    questionLanguageId: "en-IN",
    answerSemantic: built.answerSemantic,
    difficulty: built.difficulty,
    stem: built.stem,
    state: built.state,
    solution: built.solution,
    options: optionShape.options,
    optionAudit: optionShape.optionAudit,
    correctIndex: optionShape.correctIndex,
    explanation: { ...built.explanation, trapAnalysis: optionShape.trapAnalysis },
    mathematicalFingerprint: `${prototypeId}|${stable(built.state)}|${rationalKey(built.solution)}`,
    validation: { ok: false, errors: [] },
    reviewStatus: "EXECUTABLE_DISCOVERY",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };

  const errors: string[] = [];
  let verifiedOptions = 0;
  for (const option of draft.optionAudit) {
    const verifies = verifyIntCp002FinalClosureCandidate(draft, option.value);
    if (verifies) verifiedOptions += 1;
    if (option.misconceptionId === "CORRECT" && !verifies) {
      errors.push("Correct option failed the independent final-closure verifier.");
    }
    if (option.misconceptionId !== "CORRECT" && verifies) {
      errors.push(`Wrong option '${option.misconceptionId}' passed independent verification.`);
    }
  }
  if (verifiedOptions !== 1) errors.push(`Independent verifier accepted ${verifiedOptions} options.`);
  if (draft.explanation.workedSteps.length < 4) errors.push("Fewer than four worked steps.");
  if (!draft.explanation.workedSteps.every((step) => /\d/u.test(step))) {
    errors.push("A worked step lacks actual numerical values.");
  }
  if (draft.explanation.trapAnalysis.length !== 3) errors.push("Wrong-option analysis is incomplete.");
  if (!draft.explanation.conclusion.includes(draft.options[draft.correctIndex]!)) {
    errors.push("Conclusion does not state the displayed correct answer.");
  }
  try {
    assertIntCp002Wave01MathJaxIntegrity(learnerText(draft), `${prototypeId}/${requestedSeed}`);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
  if (/INT-QL-|INT-CP002-CLOSE-|prototypeId|effectiveSeed|generationAttempts/iu.test(learnerText(draft))) {
    errors.push("Internal final-closure metadata leaked into learner text.");
  }
  draft.validation = { ok: errors.length === 0, errors };
  if (!draft.validation.ok) throw new Error(errors.join("; "));
  return draft;
}

function piecewiseStem(
  rep: IntCp002FinalClosureState["representation"],
  actor: string,
  institution: string,
  principal: Rational,
  firstRate: Rational,
  firstTime: Rational,
  secondRate: Rational,
  secondTime: Rational,
): string {
  if (rep === "TABLE") {
    return `${actor} deposits ${money(principal)} in ${institution}. The rate schedule is: Period 1 — ${rateText(firstRate)} for ${timeText(firstTime)}; Period 2 — ${rateText(secondRate)} for ${timeText(secondTime)}.`;
  }
  if (rep === "TIMELINE") {
    return `${actor}'s ${money(principal)} deposit follows this simple-interest timeline: ${rateText(firstRate)} for ${timeText(firstTime)} → ${rateText(secondRate)} for ${timeText(secondTime)}.`;
  }
  return `${actor} deposits ${money(principal)} in ${institution}. It earns ${rateText(firstRate)} simple interest for ${timeText(firstTime)} and ${rateText(secondRate)} for the next ${timeText(secondTime)}.`;
}

function buildPiecewiseAmount(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const rep = representation(seed);
  const principal = rational(pick([6000, 8000, 10000, 12000], seed, "principal"));
  const firstRate = rational(pick([4, 5, 6], seed, "first-rate"));
  const secondRate = addRational(firstRate, rational(pick([2, 3, 4], seed, "rate-gap")));
  const firstTime = rational(1);
  const secondTime = rational(pick([1, 2, 3], seed, "second-time"));
  const firstInterest = simpleInterest(principal, firstRate, firstTime);
  const secondInterest = simpleInterest(principal, secondRate, secondTime);
  const totalInterest = addRational(firstInterest, secondInterest);
  const amount = addRational(principal, totalInterest);
  const latestRateInterest = simpleInterest(principal, secondRate, addRational(firstTime, secondTime));
  const firstIntervalAmount = addRational(principal, firstInterest);
  return {
    stem: `${piecewiseStem(rep, actor, institution, principal, firstRate, firstTime, secondRate, secondTime)} Find the final amount.`,
    answerSemantic: "MONEY",
    difficulty: "Medium",
    state: { values: { principal, firstRate, firstTime, secondRate, secondTime }, representation: rep },
    solution: amount,
    candidates: [
      { value: amount, misconceptionId: "CORRECT", explanation: "Adds both interval interests to the original principal." },
      { value: totalInterest, misconceptionId: "RETURN_INTEREST_NOT_AMOUNT", explanation: "Returns only the accumulated interest and omits the principal." },
      { value: addRational(principal, latestRateInterest), misconceptionId: "USE_ONE_RATE_FOR_ALL_INTERVALS", explanation: "Applies the later rate to the full duration." },
      { value: firstIntervalAmount, misconceptionId: "IGNORE_ONE_INTERVAL", explanation: "Stops after the first interval and ignores the second." },
    ],
    explanation: {
      mainRule: "Calculate each interval's simple interest separately, add the interests, and then add the original principal.",
      workedSteps: [
        raw`First interval: $$I_1=\frac{${formatExact(principal)}\times${formatExact(firstRate)}\times${formatExact(firstTime)}}{100}=${formatExact(firstInterest)}$$`,
        raw`Second interval: $$I_2=\frac{${formatExact(principal)}\times${formatExact(secondRate)}\times${formatExact(secondTime)}}{100}=${formatExact(secondInterest)}$$`,
        raw`Total interest: $$I=${formatExact(firstInterest)}+${formatExact(secondInterest)}=${formatExact(totalInterest)}$$`,
        raw`Final amount: $$A=${formatExact(principal)}+${formatExact(totalInterest)}=${formatExact(amount)}$$`,
      ],
      examShortcut: raw`$$A=P\left(1+\frac{R_1T_1+R_2T_2}{100}\right)=${formatExact(amount)}$$`,
      verification: `The two intervals earn ${money(firstInterest)} and ${money(secondInterest)}, so the principal plus total interest is ${money(amount)}.`,
      conclusion: `The final amount is ${money(amount)}.`,
    },
  };
}

function buildPiecewiseMissingPrincipal(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const rep = representation(seed);
  const principal = rational(pick([5000, 8000, 10000, 12000], seed, "principal"));
  const firstRate = rational(pick([4, 5, 6], seed, "first-rate"));
  const secondRate = addRational(firstRate, rational(pick([2, 3, 4], seed, "rate-gap")));
  const firstTime = rational(1);
  const secondTime = rational(pick([2, 3], seed, "second-time"));
  const weightedExposure = addRational(
    multiplyRational(firstRate, firstTime),
    multiplyRational(secondRate, secondTime),
  );
  const totalInterest = divideRational(multiplyRational(principal, weightedExposure), ONE_HUNDRED);
  const omitDuration = divideRational(
    multiplyRational(totalInterest, ONE_HUNDRED),
    addRational(firstRate, secondRate),
  );
  const latestRateOnly = divideRational(
    multiplyRational(totalInterest, ONE_HUNDRED),
    multiplyRational(secondRate, addRational(firstTime, secondTime)),
  );
  const firstIntervalOnly = divideRational(
    multiplyRational(totalInterest, ONE_HUNDRED),
    multiplyRational(firstRate, firstTime),
  );
  return {
    stem: `${piecewiseStem(rep, actor, institution, rational(0), firstRate, firstTime, secondRate, secondTime).replace("₹0", "an unknown principal")} The total simple interest is ${money(totalInterest)}. Find the principal.`,
    answerSemantic: "PRINCIPAL",
    difficulty: "Hard",
    state: { values: { principal, firstRate, firstTime, secondRate, secondTime, totalInterest }, representation: rep },
    solution: principal,
    candidates: [
      { value: principal, misconceptionId: "CORRECT", explanation: "Divides total interest by the complete rate-time exposure of both intervals." },
      { value: omitDuration, misconceptionId: "OMIT_DURATION_WEIGHT", explanation: "Adds the rates but ignores how long each rate applies." },
      { value: latestRateOnly, misconceptionId: "USE_ONE_RATE_FOR_ALL_INTERVALS", explanation: "Uses only the later rate over the full duration." },
      { value: firstIntervalOnly, misconceptionId: "USE_TOTAL_INTEREST_AS_SINGLE_INTERVAL", explanation: "Treats all interest as if it came from the first interval." },
    ],
    explanation: {
      mainRule: "Combine the exact rate-time exposures, then invert the complete piecewise-interest equation for principal.",
      workedSteps: [
        raw`Weighted exposure: $$R_1T_1+R_2T_2=${formatExact(firstRate)}\times${formatExact(firstTime)}+${formatExact(secondRate)}\times${formatExact(secondTime)}=${formatExact(weightedExposure)}$$`,
        raw`Complete equation: $$${formatExact(totalInterest)}=\frac{P\times${formatExact(weightedExposure)}}{100}$$`,
        raw`Multiply by 100: $$${formatExact(multiplyRational(totalInterest, ONE_HUNDRED))}=P\times${formatExact(weightedExposure)}$$`,
        raw`$$P=\frac{${formatExact(multiplyRational(totalInterest, ONE_HUNDRED))}}{${formatExact(weightedExposure)}}=${formatExact(principal)}$$`,
      ],
      examShortcut: raw`$$P=\frac{100I}{R_1T_1+R_2T_2}=${formatExact(principal)}$$`,
      verification: `Using ${money(principal)} in both intervals reproduces total interest ${money(totalInterest)}.`,
      conclusion: `The principal is ${money(principal)}.`,
    },
  };
}

function buildLedgerComparison(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const rep = representation(seed);
  const principal = rational(pick([5000, 8000, 10000, 12000], seed, "principal"));
  const tuple = pick([
    [rational(5), rational(1), rational(9), rational(2), rational(7), rational(3)],
    [rational(6), rational(1), rational(10), rational(2), rational(8), rational(3)],
    [rational(4), rational(2), rational(9), rational(1), rational(5), rational(3)],
  ] as const, seed, "comparison-tuple");
  const [firstRate, firstTime, secondRate, secondTime, comparisonRate, comparisonTime] = tuple;
  const leftInterest = addRational(
    simpleInterest(principal, firstRate, firstTime),
    simpleInterest(principal, secondRate, secondTime),
  );
  const rightInterest = simpleInterest(principal, comparisonRate, comparisonTime);
  const difference = subtractRational(leftInterest, rightInterest);
  return {
    stem: `${actor} compares two simple-interest plans in ${institution}. Plan A applies ${rateText(firstRate)} for ${timeText(firstTime)} and then ${rateText(secondRate)} for ${timeText(secondTime)} to ${money(principal)}. Plan B applies ${rateText(comparisonRate)} for ${timeText(comparisonTime)} to the same principal. By how much does Plan A's interest exceed Plan B's?`,
    answerSemantic: "MONEY",
    difficulty: "Hard",
    state: { values: { principal, firstRate, firstTime, secondRate, secondTime, comparisonRate, comparisonTime }, representation: rep },
    solution: difference,
    candidates: [
      { value: difference, misconceptionId: "CORRECT", explanation: "Reconstructs both complete ledgers and subtracts Plan B from Plan A." },
      { value: leftInterest, misconceptionId: "RETURN_ONE_SCHEME_INTEREST", explanation: "Returns Plan A's total interest instead of the difference." },
      { value: rightInterest, misconceptionId: "REVERSE_LEDGER_DIFFERENCE", explanation: "Returns Plan B's interest rather than the excess produced by Plan A." },
      { value: addRational(leftInterest, rightInterest), misconceptionId: "ADD_LEDGER_TOTALS", explanation: "Adds both plan interests instead of comparing them." },
    ],
    explanation: {
      mainRule: "Evaluate each ledger independently and subtract in the direction stated by the question.",
      workedSteps: [
        raw`Plan A, first interval: $$I_{A1}=\frac{${formatExact(principal)}\times${formatExact(firstRate)}\times${formatExact(firstTime)}}{100}=${formatExact(simpleInterest(principal, firstRate, firstTime))}$$`,
        raw`Plan A total: $$I_A=${formatExact(simpleInterest(principal, firstRate, firstTime))}+${formatExact(simpleInterest(principal, secondRate, secondTime))}=${formatExact(leftInterest)}$$`,
        raw`Plan B: $$I_B=\frac{${formatExact(principal)}\times${formatExact(comparisonRate)}\times${formatExact(comparisonTime)}}{100}=${formatExact(rightInterest)}$$`,
        raw`Excess: $$I_A-I_B=${formatExact(leftInterest)}-${formatExact(rightInterest)}=${formatExact(difference)}$$`,
      ],
      examShortcut: raw`For a common principal, compare weighted exposures: $$\Delta I=\frac{P[(R_1T_1+R_2T_2)-RT]}{100}=${formatExact(difference)}$$`,
      verification: `${money(leftInterest)} − ${money(rightInterest)} = ${money(difference)}.`,
      conclusion: `Plan A's interest exceeds Plan B's by ${money(difference)}.`,
    },
  };
}

function buildSplitPrincipalRatio(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const totalPrincipal = rational(pick([10000, 15000, 20000, 25000], seed, "total"));
  const fraction = pick([rational(2, 5), rational(3, 5), rational(1, 3)], seed, "fraction");
  const firstPart = multiplyRational(totalPrincipal, fraction);
  const secondPart = subtractRational(totalPrincipal, firstPart);
  const firstRate = rational(pick([5, 6, 8], seed, "first-rate"));
  const secondRate = addRational(firstRate, rational(pick([2, 3, 4], seed, "gap")));
  const time = rational(pick([1, 2], seed, "time"));
  const totalInterest = addRational(
    simpleInterest(firstPart, firstRate, time),
    simpleInterest(secondPart, secondRate, time),
  );
  const ratio = divideRational(firstPart, secondPart);
  const complementRatio = divideRational(secondPart, firstPart);
  return {
    stem: `${actor} divides ${money(totalPrincipal)} between two deposits in ${institution}. The first earns ${rateText(firstRate)} and the second ${rateText(secondRate)} for ${timeText(time)}. Their combined simple interest is ${money(totalInterest)}. Find the ratio of the first part to the second part.`,
    answerSemantic: "RATIO",
    difficulty: "Hard",
    state: { values: { totalPrincipal, firstPart, secondPart, firstRate, secondRate, time, totalInterest }, representation: representation(seed) },
    solution: ratio,
    candidates: [
      { value: ratio, misconceptionId: "CORRECT", explanation: "Recovers the two complementary parts and forms first part : second part." },
      { value: complementRatio, misconceptionId: "REVERSE_PRINCIPAL_RATIO", explanation: "Reverses the requested order of the two parts." },
      { value: rational(1), misconceptionId: "ASSUME_EQUAL_SPLIT", explanation: "Assumes an equal split without using the interest condition." },
      { value: divideRational(firstRate, secondRate), misconceptionId: "USE_RATE_RATIO_DIRECTLY", explanation: "Uses the rate ratio as though it were the principal ratio." },
    ],
    explanation: {
      mainRule: "Let the first part be x and the second S−x, solve the total-interest equation, then form x:(S−x).",
      workedSteps: [
        raw`Let the first part be $x$; the second is $${formatExact(totalPrincipal)}-x$.`,
        raw`$$${formatExact(totalInterest)}=\frac{x\times${formatExact(firstRate)}\times${formatExact(time)}}{100}+\frac{(${formatExact(totalPrincipal)}-x)\times${formatExact(secondRate)}\times${formatExact(time)}}{100}$$`,
        raw`Solving gives $$x=${formatExact(firstPart)},\qquad ${formatExact(totalPrincipal)}-x=${formatExact(secondPart)}$$`,
        raw`Required ratio: $$${formatExact(firstPart)}:${formatExact(secondPart)}=${ratioText(ratio)}$$`,
      ],
      examShortcut: raw`After finding one part, use the declared total immediately for the complement; do not solve a second equation.`,
      verification: `The parts ${money(firstPart)} and ${money(secondPart)} reproduce the combined interest ${money(totalInterest)}.`,
      conclusion: `The required ratio is ${ratioText(ratio)}.`,
    },
  };
}

function buildEqualInterestPrincipalRatio(seed: string): BuiltQuestion {
  const { actor } = context(seed);
  const firstRate = rational(pick([4, 5, 6, 8], seed, "first-rate"));
  const firstTime = rational(pick([1, 2, 3], seed, "first-time"));
  const secondRate = rational(pick([6, 8, 10, 12], seed, "second-rate"));
  const secondTime = rational(pick([1, 2, 3], seed, "second-time"));
  const ratio = divideRational(
    multiplyRational(secondRate, secondTime),
    multiplyRational(firstRate, firstTime),
  );
  const reverseRatio = divideRational(rational(1), ratio);
  const rateRatio = divideRational(secondRate, firstRate);
  const timeRatio = divideRational(secondTime, firstTime);
  return {
    stem: `${actor} observes that two principals earn equal simple interest. The first is invested at ${rateText(firstRate)} for ${timeText(firstTime)}, while the second is invested at ${rateText(secondRate)} for ${timeText(secondTime)}. Find the ratio of the first principal to the second principal.`,
    answerSemantic: "RATIO",
    difficulty: "Hard",
    state: { values: { firstRate, firstTime, secondRate, secondTime }, representation: representation(seed) },
    solution: ratio,
    candidates: [
      { value: ratio, misconceptionId: "CORRECT", explanation: "Uses P1R1T1 = P2R2T2 and keeps the requested P1:P2 order." },
      { value: reverseRatio, misconceptionId: "REVERSE_PRINCIPAL_RATIO", explanation: "Reverses the required principal order." },
      { value: rateRatio, misconceptionId: "USE_RATE_RATIO_DIRECTLY", explanation: "Uses only the rates and ignores the durations." },
      { value: timeRatio, misconceptionId: "USE_DURATION_RATIO_DIRECTLY", explanation: "Uses only the durations and ignores the rates." },
    ],
    explanation: {
      mainRule: "For equal simple interest, P1R1T1 = P2R2T2, so P1:P2 = R2T2:R1T1.",
      workedSteps: [
        raw`Equal interest gives $$P_1\times${formatExact(firstRate)}\times${formatExact(firstTime)}=P_2\times${formatExact(secondRate)}\times${formatExact(secondTime)}$$`,
        raw`$$\frac{P_1}{P_2}=\frac{${formatExact(secondRate)}\times${formatExact(secondTime)}}{${formatExact(firstRate)}\times${formatExact(firstTime)}}$$`,
        raw`$$\frac{P_1}{P_2}=\frac{${formatExact(multiplyRational(secondRate, secondTime))}}{${formatExact(multiplyRational(firstRate, firstTime))}}$$`,
        raw`Therefore $$P_1:P_2=${ratioText(ratio)}$$`,
      ],
      examShortcut: raw`Write the opposite rate-time products directly: $$P_1:P_2=R_2T_2:R_1T_1$$.`,
      verification: `Any principals in the ratio ${ratioText(ratio)} make the two products PRT equal.`,
      conclusion: `The ratio of the first principal to the second is ${ratioText(ratio)}.`,
    },
  };
}

function buildCounterfactualOriginalDuration(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const principal = rational(pick([5000, 8000, 10000, 12000], seed, "principal"));
  const rate = rational(pick([5, 6, 8, 10], seed, "rate"));
  const originalDuration = rational(pick([1, 2, 3], seed, "original"));
  const durationChange = rational(pick([1, 2], seed, "change"));
  const revisedDuration = addRational(originalDuration, durationChange);
  const additionalInterest = simpleInterest(principal, rate, durationChange);
  return {
    stem: `${actor} deposits ${money(principal)} in ${institution} at ${rateText(rate)} simple interest. Extending the deposit to ${timeText(revisedDuration)} increases the interest by ${money(additionalInterest)}. What was the original duration?`,
    answerSemantic: "TIME_YEARS",
    difficulty: "Medium",
    state: { values: { principal, rate, originalDuration, durationChange, revisedDuration, additionalInterest }, representation: representation(seed) },
    solution: originalDuration,
    candidates: [
      { value: originalDuration, misconceptionId: "CORRECT", explanation: "Finds the added duration from extra interest and subtracts it from the revised duration." },
      { value: revisedDuration, misconceptionId: "RETURN_NEW_DURATION", explanation: "Returns the revised duration already given in the question." },
      { value: durationChange, misconceptionId: "RETURN_DURATION_CHANGE", explanation: "Returns only the extension, not the original duration." },
      { value: addRational(revisedDuration, durationChange), misconceptionId: "ADD_DURATION_CHANGE", explanation: "Adds the extension to the revised duration instead of subtracting it." },
    ],
    explanation: {
      mainRule: "Extra simple interest caused by a time extension determines the added time; subtract it from the revised duration.",
      workedSteps: [
        raw`$$\Delta I=\frac{P\times R\times\Delta T}{100}$$`,
        raw`$$${formatExact(additionalInterest)}=\frac{${formatExact(principal)}\times${formatExact(rate)}\times\Delta T}{100}$$`,
        raw`$$\Delta T=\frac{${formatExact(additionalInterest)}\times100}{${formatExact(principal)}\times${formatExact(rate)}}=${formatExact(durationChange)}$$ years`,
        raw`Original duration: $$${formatExact(revisedDuration)}-${formatExact(durationChange)}=${formatExact(originalDuration)}$$ years`,
      ],
      examShortcut: raw`$$T_{old}=T_{new}-\frac{100\Delta I}{PR}=${formatExact(originalDuration)}$$`,
      verification: `Increasing ${timeText(originalDuration)} by ${timeText(durationChange)} gives ${timeText(revisedDuration)} and the stated extra interest.`,
      conclusion: `The original duration was ${timeText(originalDuration)}.`,
    },
  };
}

function buildPartialRepaymentComparison(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const openingPrincipal = rational(pick([10000, 12000, 15000, 20000], seed, "opening"));
  const repayment = multiplyRational(openingPrincipal, pick([rational(1, 5), rational(1, 4)], seed, "repayment-fraction"));
  const rate = rational(pick([6, 8, 10, 12], seed, "rate"));
  const earlyTime = rational(1);
  const lateTime = rational(pick([2, 3], seed, "late-time"));
  const horizon = addRational(lateTime, rational(1));
  const saving = simpleInterest(repayment, rate, subtractRational(lateTime, earlyTime));
  const fullHorizonSaving = simpleInterest(repayment, rate, horizon);
  const earlyDurationSaving = simpleInterest(repayment, rate, earlyTime);
  return {
    stem: `${actor} owes ${money(openingPrincipal)} to ${institution} at ${rateText(rate)} simple interest until the end of ${timeText(horizon)}. A repayment of ${money(repayment)} could be made after ${timeText(earlyTime)} or after ${timeText(lateTime)}. How much less interest is paid when the repayment is made at the earlier time?`,
    answerSemantic: "MONEY",
    difficulty: "Hard",
    state: { values: { openingPrincipal, repayment, rate, earlyTime, lateTime, horizon }, representation: "TIMELINE" },
    solution: saving,
    candidates: [
      { value: saving, misconceptionId: "CORRECT", explanation: "Charges the repaid amount for only the interval between the late and early repayment dates." },
      { value: fullHorizonSaving, misconceptionId: "IGNORE_REPAYMENT_TIMING", explanation: "Treats the repayment as absent for the full horizon." },
      { value: earlyDurationSaving, misconceptionId: "REVERSE_EARLY_LATE_DIFFERENCE", explanation: "Uses time from the start to the early date instead of the gap between repayment dates." },
      { value: repayment, misconceptionId: "USE_REPAYMENT_AMOUNT_AS_SAVING", explanation: "Confuses principal repaid with interest saved." },
    ],
    explanation: {
      mainRule: "Earlier repayment saves interest on the repaid principal only for the time gap between the two possible repayment dates.",
      workedSteps: [
        raw`Time advantage: $$${formatExact(lateTime)}-${formatExact(earlyTime)}=${formatExact(subtractRational(lateTime, earlyTime))}$$ years`,
        raw`Principal removed earlier: $$X=${formatExact(repayment)}$$`,
        raw`Interest saving: $$S=\frac{X\times R\times\Delta T}{100}=\frac{${formatExact(repayment)}\times${formatExact(rate)}\times${formatExact(subtractRational(lateTime, earlyTime))}}{100}$$`,
        raw`$$S=${formatExact(saving)}$$`,
      ],
      examShortcut: raw`The opening principal and final horizon cancel in the comparison: $$S=\frac{XR(t_l-t_e)}{100}=${formatExact(saving)}$$.`,
      verification: `The earlier repayment removes ${money(repayment)} from interest calculation for ${timeText(subtractRational(lateTime, earlyTime))}, saving ${money(saving)}.`,
      conclusion: `The earlier repayment reduces interest by ${money(saving)}.`,
    },
  };
}

function buildBorrowLendMissingPrincipal(seed: string): BuiltQuestion {
  const { actor } = context(seed);
  const principal = rational(pick([5000, 8000, 10000, 12000, 15000], seed, "principal"));
  const borrowRate = rational(pick([4, 5, 6, 8], seed, "borrow-rate"));
  const lendRate = addRational(borrowRate, rational(pick([2, 3, 4], seed, "spread")));
  const time = rational(pick([1, 2, 3], seed, "time"));
  const spread = subtractRational(lendRate, borrowRate);
  const netGain = simpleInterest(principal, spread, time);
  const lendOnly = divideRational(multiplyRational(netGain, ONE_HUNDRED), multiplyRational(lendRate, time));
  const borrowOnly = divideRational(multiplyRational(netGain, ONE_HUNDRED), multiplyRational(borrowRate, time));
  const omitTime = divideRational(multiplyRational(netGain, ONE_HUNDRED), spread);
  return {
    stem: `${actor} borrows an amount at ${rateText(borrowRate)} simple interest and lends the same amount for ${timeText(time)} at ${rateText(lendRate)}. The net interest gain is ${money(netGain)}. Find the principal.`,
    answerSemantic: "PRINCIPAL",
    difficulty: "Medium",
    state: { values: { principal, borrowRate, lendRate, time, netGain }, representation: representation(seed) },
    solution: principal,
    candidates: [
      { value: principal, misconceptionId: "CORRECT", explanation: "Uses the rate spread and the common duration to recover principal." },
      { value: lendOnly, misconceptionId: "USE_LENDING_RATE_ONLY", explanation: "Treats net gain as gross lending interest." },
      { value: borrowOnly, misconceptionId: "USE_BORROWING_RATE_ONLY", explanation: "Treats net gain as borrowing interest." },
      { value: omitTime, misconceptionId: "OMIT_DURATION_WEIGHT", explanation: "Uses the rate spread but omits duration." },
    ],
    explanation: {
      mainRule: "Net gain is simple interest on the rate spread, so invert G = P(Rl−Rb)T/100 for principal.",
      workedSteps: [
        raw`Rate spread: $$${formatExact(lendRate)}-${formatExact(borrowRate)}=${formatExact(spread)}\%$$`,
        raw`$$${formatExact(netGain)}=\frac{P\times${formatExact(spread)}\times${formatExact(time)}}{100}$$`,
        raw`$$P=\frac{${formatExact(netGain)}\times100}{${formatExact(spread)}\times${formatExact(time)}}$$`,
        raw`$$P=${formatExact(principal)}$$`,
      ],
      examShortcut: raw`$$P=\frac{100G}{(R_l-R_b)T}=${formatExact(principal)}$$`,
      verification: `The recovered principal at the ${rateText(spread)} spread for ${timeText(time)} yields ${money(netGain)}.`,
      conclusion: `The principal is ${money(principal)}.`,
    },
  };
}

function buildBorrowLendMissingDuration(seed: string): BuiltQuestion {
  const { actor } = context(seed);
  const principal = rational(pick([5000, 8000, 10000, 12000], seed, "principal"));
  const borrowRate = rational(pick([4, 5, 6, 8], seed, "borrow-rate"));
  const lendRate = addRational(borrowRate, rational(pick([2, 3, 4], seed, "spread")));
  const time = rational(pick([1, 2, 3], seed, "time"));
  const spread = subtractRational(lendRate, borrowRate);
  const netGain = simpleInterest(principal, spread, time);
  const lendOnly = divideRational(multiplyRational(netGain, ONE_HUNDRED), multiplyRational(principal, lendRate));
  const borrowOnly = divideRational(multiplyRational(netGain, ONE_HUNDRED), multiplyRational(principal, borrowRate));
  const omitSpread = divideRational(multiplyRational(netGain, ONE_HUNDRED), principal);
  return {
    stem: `${actor} borrows ${money(principal)} at ${rateText(borrowRate)} simple interest and lends it at ${rateText(lendRate)} for the same unknown period. The net interest gain is ${money(netGain)}. Find the duration.`,
    answerSemantic: "TIME_YEARS",
    difficulty: "Medium",
    state: { values: { principal, borrowRate, lendRate, time, netGain }, representation: representation(seed) },
    solution: time,
    candidates: [
      { value: time, misconceptionId: "CORRECT", explanation: "Uses the rate spread to solve the net-gain equation for time." },
      { value: lendOnly, misconceptionId: "USE_LENDING_RATE_ONLY", explanation: "Uses the lending rate instead of the spread." },
      { value: borrowOnly, misconceptionId: "USE_BORROWING_RATE_ONLY", explanation: "Uses the borrowing rate instead of the spread." },
      { value: omitSpread, misconceptionId: "OMIT_RATE_SPREAD", explanation: "Omits the spread entirely while solving for duration." },
    ],
    explanation: {
      mainRule: "Net gain is generated by the rate spread; invert the spread-interest equation for time.",
      workedSteps: [
        raw`Rate spread: $$R_l-R_b=${formatExact(lendRate)}-${formatExact(borrowRate)}=${formatExact(spread)}\%$$`,
        raw`$$${formatExact(netGain)}=\frac{${formatExact(principal)}\times${formatExact(spread)}\times T}{100}$$`,
        raw`$$T=\frac{${formatExact(netGain)}\times100}{${formatExact(principal)}\times${formatExact(spread)}}$$`,
        raw`$$T=${formatExact(time)}$$ years`,
      ],
      examShortcut: raw`$$T=\frac{100G}{P(R_l-R_b)}=${formatExact(time)}$$`,
      verification: `The spread ${rateText(spread)} on ${money(principal)} for ${timeText(time)} gives ${money(netGain)}.`,
      conclusion: `The duration is ${timeText(time)}.`,
    },
  };
}

function buildDayCountBasisComparison(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const days = rational(pick([72, 360], seed, "days"));
  const principal = rational(pick([7300, 14600, 21900], seed, "principal"));
  const rate = rational(pick([5, 10], seed, "rate"));
  const commercialInterest = simpleInterest(principal, rate, divideRational(days, rational(360)));
  const actualInterest = simpleInterest(principal, rate, divideRational(days, rational(365)));
  const difference = subtractRational(commercialInterest, actualInterest);
  return {
    stem: `${actor} deposits ${money(principal)} in ${institution} at ${rateText(rate)} simple interest for ${formatExact(days)} days. How much greater is the interest under a declared 360-day commercial year than under a declared 365-day year?`,
    answerSemantic: "MONEY",
    difficulty: "Hard",
    state: { values: { principal, rate, days }, representation: "COMPARISON_CARD" },
    solution: difference,
    candidates: [
      { value: difference, misconceptionId: "CORRECT", explanation: "Calculates both declared day-count contracts and subtracts actual/365 from commercial/360." },
      { value: commercialInterest, misconceptionId: "RETURN_ONE_SCHEME_INTEREST", explanation: "Returns the full 360-day-basis interest instead of the difference." },
      { value: actualInterest, misconceptionId: "USE_WRONG_DAY_COUNT_BASIS", explanation: "Returns the 365-day-basis interest instead of comparing the two." },
      { value: addRational(commercialInterest, actualInterest), misconceptionId: "ADD_LEDGER_TOTALS", explanation: "Adds the two contract interests instead of finding their difference." },
    ],
    explanation: {
      mainRule: "Use each explicitly declared denominator separately; a smaller annual denominator produces the larger interest for the same number of days.",
      workedSteps: [
        raw`Commercial basis: $$I_{360}=\frac{${formatExact(principal)}\times${formatExact(rate)}\times${formatExact(days)}}{100\times360}=${formatExact(commercialInterest)}$$`,
        raw`Actual basis: $$I_{365}=\frac{${formatExact(principal)}\times${formatExact(rate)}\times${formatExact(days)}}{100\times365}=${formatExact(actualInterest)}$$`,
        raw`Required excess: $$I_{360}-I_{365}=${formatExact(commercialInterest)}-${formatExact(actualInterest)}$$`,
        raw`$$I_{360}-I_{365}=${formatExact(difference)}$$`,
      ],
      examShortcut: raw`$$\Delta I=\frac{PRD}{100}\left(\frac1{360}-\frac1{365}\right)=${formatExact(difference)}$$`,
      verification: `${money(commercialInterest)} − ${money(actualInterest)} = ${money(difference)}.`,
      conclusion: `The 360-day basis gives ${money(difference)} more interest.`,
    },
  };
}

function build(prototypeId: IntCp002FinalClosurePrototypeId, seed: string): BuiltQuestion {
  switch (prototypeId) {
    case "INT-CP002-CLOSE-PIECEWISE-AMOUNT": return buildPiecewiseAmount(seed);
    case "INT-CP002-CLOSE-PIECEWISE-MISSING-PRINCIPAL": return buildPiecewiseMissingPrincipal(seed);
    case "INT-CP002-CLOSE-LEDGER-COMPARISON": return buildLedgerComparison(seed);
    case "INT-CP002-CLOSE-SPLIT-PRINCIPAL-RATIO": return buildSplitPrincipalRatio(seed);
    case "INT-CP002-CLOSE-EQUAL-INTEREST-PRINCIPAL-RATIO": return buildEqualInterestPrincipalRatio(seed);
    case "INT-CP002-CLOSE-COUNTERFACTUAL-ORIGINAL-DURATION": return buildCounterfactualOriginalDuration(seed);
    case "INT-CP002-CLOSE-PARTIAL-REPAYMENT-COMPARISON": return buildPartialRepaymentComparison(seed);
    case "INT-CP002-CLOSE-BORROW-LEND-MISSING-PRINCIPAL": return buildBorrowLendMissingPrincipal(seed);
    case "INT-CP002-CLOSE-BORROW-LEND-MISSING-DURATION": return buildBorrowLendMissingDuration(seed);
    case "INT-CP002-CLOSE-DAY-COUNT-BASIS-COMPARISON": return buildDayCountBasisComparison(seed);
  }
}

export function generateIntCp002FinalClosureQuestion(request: {
  prototypeId: IntCp002FinalClosurePrototypeId;
  seed: string;
}): IntCp002FinalClosureQuestion {
  if (!(INT_CP002_FINAL_CLOSURE_PROTOTYPE_IDS as readonly string[]).includes(request.prototypeId)) {
    throw new Error(`Unknown CP-002 final closure prototype '${String(request.prototypeId)}'.`);
  }
  const requestedSeed = request.seed.trim();
  if (!requestedSeed) throw new Error("CP-002 final closure requires a non-empty deterministic seed.");
  let lastError: unknown;
  for (let attempt = 1; attempt <= 32; attempt += 1) {
    const effectiveSeed = attempt === 1 ? requestedSeed : `${requestedSeed}:retry:${attempt - 1}`;
    try {
      return finish(request.prototypeId, requestedSeed, effectiveSeed, attempt, build(request.prototypeId, effectiveSeed));
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    `${request.prototypeId}/${requestedSeed}: failed after 32 deterministic attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
  );
}
