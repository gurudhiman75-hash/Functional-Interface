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
import {
  buildIntCp002OutstandingBalanceContributions,
  calculateIntCp002Ledger,
  intCp002DaysToYears,
} from "./cp002-foundation/ledger";
import type { IntCp002Contribution, IntCp002LedgerState } from "./cp002-foundation/types";
import {
  verifyIntCp002LedgerCandidate,
  verifyIntCp002LedgerDifferenceCandidate,
  verifyIntCp002SplitPrincipalCandidate,
  verifyIntCp002UnknownContributionCandidate,
} from "./cp002-foundation/verifier";
import {
  INT_CP002_WAVE01_PROTOTYPE_IDS,
  type IntCp002Wave01AnswerSemantic,
  type IntCp002Wave01Difficulty,
  type IntCp002Wave01Explanation,
  type IntCp002Wave01GeneratedPrototype,
  type IntCp002Wave01MisconceptionId,
  type IntCp002Wave01OptionAudit,
  type IntCp002Wave01PrototypeId,
  type IntCp002Wave01SourceState,
} from "./cp002-wave01-types";

const ZERO = rational(0);
const ONE_HUNDRED = rational(100);

interface BuildResult {
  stem: string;
  answerSemantic: IntCp002Wave01AnswerSemantic;
  difficulty: IntCp002Wave01Difficulty;
  sourceState: IntCp002Wave01SourceState;
  solution: Rational;
  optionCandidates: Array<{
    value: Rational;
    misconceptionId: IntCp002Wave01MisconceptionId;
    explanation: string;
  }>;
  explanation: Omit<IntCp002Wave01Explanation, "trapAnalysis">;
  validation: { ok: boolean; errors: string[] };
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

function money(value: Rational): string {
  return formatMoney(value);
}

function years(value: Rational): string {
  const exact = formatExact(value);
  return `${exact} ${equalsRational(value, rational(1)) ? "year" : "years"}`;
}

function simpleInterest(principal: Rational, ratePercent: Rational, durationYears: Rational): Rational {
  return divideRational(
    multiplyRational(principal, multiplyRational(ratePercent, durationYears)),
    ONE_HUNDRED,
  );
}

function contribution(request: {
  id: string;
  principal: Rational;
  rate: Rational;
  duration: Rational;
  start?: Rational;
  kind?: IntCp002Contribution["sourceKind"];
}): IntCp002Contribution {
  const startsAtYears = request.start ?? ZERO;
  return {
    contributionId: request.id,
    principal: request.principal,
    annualRatePercent: request.rate,
    durationYears: request.duration,
    startsAtYears,
    endsAtYears: addRational(startsAtYears, request.duration),
    sourceKind: request.kind ?? "INDEPENDENT_DEPOSIT",
  };
}

function stableValue(value: unknown): string {
  return JSON.stringify(value, (_key, item) => {
    if (typeof item === "bigint") return item.toString();
    return item;
  });
}

function fingerprint(
  prototypeId: IntCp002Wave01PrototypeId,
  sourceState: IntCp002Wave01SourceState,
  solution: Rational,
): string {
  return `${prototypeId}|${stableValue(sourceState)}|${rationalKey(solution)}`;
}

function context(seed: string): { actor: string; institution: string } {
  return {
    actor: pick(
      ["Meera", "Arjun", "Kavya", "Rohan", "Simran", "Aman", "Neha", "Vikram"],
      seed,
      "actor",
    ),
    institution: pick(
      [
        "a cooperative bank",
        "a post-office savings scheme",
        "a rural bank",
        "a credit society",
        "a community savings fund",
      ],
      seed,
      "institution",
    ),
  };
}

function formatAnswer(value: Rational, semantic: IntCp002Wave01AnswerSemantic): string {
  return semantic === "MONEY" || semantic === "PRINCIPAL"
    ? money(value)
    : formatExact(value);
}

function rotateOptions(
  candidates: BuildResult["optionCandidates"],
  semantic: IntCp002Wave01AnswerSemantic,
  seed: string,
): {
  options: string[];
  optionAudit: IntCp002Wave01OptionAudit[];
  correctIndex: number;
  trapAnalysis: IntCp002Wave01Explanation["trapAnalysis"];
} {
  if (candidates.length !== 4) throw new Error("CP-002 Wave 1 requires exactly four option candidates.");
  if (candidates.filter((item) => item.misconceptionId === "CORRECT").length !== 1) {
    throw new Error("CP-002 Wave 1 requires exactly one correct option candidate.");
  }
  const optionAudit = candidates.map((candidate) => ({
    text: formatAnswer(candidate.value, semantic),
    value: candidate.value,
    misconceptionId: candidate.misconceptionId,
    explanation: candidate.explanation,
  }));
  if (new Set(optionAudit.map((item) => item.text)).size !== 4) {
    throw new Error("CP-002 Wave 1 option formatting collision.");
  }

  const rotation = hash(`${seed}:answer-position`) % 4;
  const rotated = optionAudit.map((_item, index) => optionAudit[(index + rotation) % 4]!);
  const correctIndex = rotated.findIndex((item) => item.misconceptionId === "CORRECT");
  const trapAnalysis = rotated
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.misconceptionId !== "CORRECT")
    .map(({ item, index }) => ({
      optionNumber: index + 1,
      misconceptionId: item.misconceptionId as Exclude<IntCp002Wave01MisconceptionId, "CORRECT">,
      explanation: item.explanation,
    }));
  return {
    options: rotated.map((item) => item.text),
    optionAudit: rotated,
    correctIndex,
    trapAnalysis,
  };
}

function fullValidation(
  built: BuildResult,
  options: ReturnType<typeof rotateOptions>,
): { ok: boolean; errors: string[] } {
  const errors = [...built.validation.errors];
  if (!built.validation.ok) errors.push("Independent mathematical verification failed.");
  if (options.options.length !== 4 || new Set(options.options).size !== 4) {
    errors.push("Four distinct options were not produced.");
  }
  if (options.correctIndex < 0 || options.options[options.correctIndex] !== formatAnswer(built.solution, built.answerSemantic)) {
    errors.push("Correct answer index does not point to the solved value.");
  }
  if (built.explanation.workedSteps.length < 4) {
    errors.push("Calculation-rich explanation requires at least four worked steps.");
  }
  if (options.trapAnalysis.length !== 3) {
    errors.push("All three wrong options require trap analysis.");
  }
  return { ok: errors.length === 0, errors };
}

function buildPiecewise(seed: string): BuildResult {
  const { actor, institution } = context(seed);
  const principal = rational(pick([6000, 8000, 10000, 12000, 15000], seed, "principal"));
  const firstRate = rational(pick([4, 5, 6, 7], seed, "first-rate"));
  const secondRate = addRational(firstRate, rational(pick([2, 3, 4], seed, "rate-gap")));
  const firstTime = rational(pick([1, 2, 3], seed, "first-time"));
  const secondTime = rational(pick([1, 2], seed, "second-time"));
  const totalTime = addRational(firstTime, secondTime);
  const firstInterest = simpleInterest(principal, firstRate, firstTime);
  const secondInterest = simpleInterest(principal, secondRate, secondTime);
  const solution = addRational(firstInterest, secondInterest);
  const ledger: IntCp002LedgerState = {
    contributions: [
      contribution({ id: "first-interval", principal, rate: firstRate, duration: firstTime, kind: "RATE_INTERVAL" }),
      contribution({ id: "second-interval", principal, rate: secondRate, duration: secondTime, start: firstTime, kind: "RATE_INTERVAL" }),
    ],
    dayCountBasis: "NOT_APPLICABLE",
    totalInterest: solution,
  };
  const latestRateForAll = simpleInterest(principal, secondRate, totalTime);
  const firstRateForAll = simpleInterest(principal, firstRate, totalTime);
  const verification = verifyIntCp002LedgerCandidate(ledger, solution);
  return {
    stem: `${actor} deposits ${money(principal)} in ${institution}. The deposit earns simple interest at ${formatPercent(firstRate)} per annum for the first ${years(firstTime)} and ${formatPercent(secondRate)} per annum for the next ${years(secondTime)}. Find the total interest.`,
    answerSemantic: "MONEY",
    difficulty: "Medium",
    sourceState: { ledger, values: { principal, firstRate, secondRate, firstTime, secondTime } },
    solution,
    optionCandidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: "Adds the separately calculated interest from both rate intervals." },
      { value: latestRateForAll, misconceptionId: "APPLY_LATEST_RATE_TO_ALL_INTERVALS", explanation: `Applies ${formatPercent(secondRate)} to the entire ${years(totalTime)} instead of only the second interval.` },
      { value: firstRateForAll, misconceptionId: "APPLY_FIRST_RATE_TO_ALL_INTERVALS", explanation: `Keeps ${formatPercent(firstRate)} for the entire duration and ignores the later rate change.` },
      { value: firstInterest, misconceptionId: "IGNORE_ONE_CONTRIBUTION", explanation: "Calculates only the first interval and omits the second interval completely." },
    ],
    explanation: {
      mainRule: "For simple interest with changing rates, calculate each time interval separately and add the interval interests.",
      workedSteps: [
        `Given: $P=${formatExact(principal)},\ R_1=${formatExact(firstRate)},\ T_1=${formatExact(firstTime)},\ R_2=${formatExact(secondRate)},\ T_2=${formatExact(secondTime)}$.`,
        `First interval: $$I_1=\frac{P\times R_1\times T_1}{100}=\frac{${formatExact(principal)}\times${formatExact(firstRate)}\times${formatExact(firstTime)}}{100}=${formatExact(firstInterest)}$$`,
        `Second interval: $$I_2=\frac{P\times R_2\times T_2}{100}=\frac{${formatExact(principal)}\times${formatExact(secondRate)}\times${formatExact(secondTime)}}{100}=${formatExact(secondInterest)}$$`,
        `Add the interval interests: $$I=I_1+I_2=${formatExact(firstInterest)}+${formatExact(secondInterest)}=${formatExact(solution)}$$`,
      ],
      examShortcut: `Use the weighted rate-time total: $$I=\frac{P(R_1T_1+R_2T_2)}{100}=\frac{${formatExact(principal)}(${formatExact(firstRate)}\times${formatExact(firstTime)}+${formatExact(secondRate)}\times${formatExact(secondTime)})}{100}=${formatExact(solution)}$$`,
      verification: `Independent interval reconstruction gives ${money(firstInterest)} + ${money(secondInterest)} = ${money(solution)}.`,
      conclusion: `Therefore, the total simple interest is ${money(solution)}.`,
    },
    validation: { ok: verification.ok, errors: verification.errors },
  };
}

function buildMultipleDeposits(seed: string): BuildResult {
  const { actor, institution } = context(seed);
  const firstPrincipal = rational(pick([4000, 5000, 6000, 8000, 9000], seed, "p1"));
  const secondPrincipal = rational(pick([7000, 8000, 10000, 12000, 15000], seed, "p2"));
  const firstRate = rational(pick([5, 6, 8, 10], seed, "r1"));
  const secondRate = rational(pick([7, 9, 12, 15], seed, "r2"));
  const firstTime = rational(pick([1, 2, 3], seed, "t1"));
  const secondTime = rational(pick([1, 2, 3], seed, "t2"));
  const firstInterest = simpleInterest(firstPrincipal, firstRate, firstTime);
  const secondInterest = simpleInterest(secondPrincipal, secondRate, secondTime);
  const solution = addRational(firstInterest, secondInterest);
  const totalPrincipal = addRational(firstPrincipal, secondPrincipal);
  const firstTermsForAll = simpleInterest(totalPrincipal, firstRate, firstTime);
  const secondTermsForAll = simpleInterest(totalPrincipal, secondRate, secondTime);
  const ledger: IntCp002LedgerState = {
    contributions: [
      contribution({ id: "first-deposit", principal: firstPrincipal, rate: firstRate, duration: firstTime }),
      contribution({ id: "second-deposit", principal: secondPrincipal, rate: secondRate, duration: secondTime }),
    ],
    dayCountBasis: "NOT_APPLICABLE",
    totalInterest: solution,
  };
  const verification = verifyIntCp002LedgerCandidate(ledger, solution);
  return {
    stem: `${actor} invests ${money(firstPrincipal)} at ${formatPercent(firstRate)} simple interest for ${years(firstTime)} and ${money(secondPrincipal)} at ${formatPercent(secondRate)} simple interest for ${years(secondTime)} through ${institution}. Find the combined interest.`,
    answerSemantic: "MONEY",
    difficulty: "Medium",
    sourceState: { ledger, values: { firstPrincipal, secondPrincipal, firstRate, secondRate, firstTime, secondTime } },
    solution,
    optionCandidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: "Calculates each deposit with its own rate and time, then adds both interests." },
      { value: firstInterest, misconceptionId: "IGNORE_ONE_CONTRIBUTION", explanation: "Includes only the first deposit and ignores the second deposit." },
      { value: firstTermsForAll, misconceptionId: "USE_FIRST_TERMS_FOR_ALL_DEPOSITS", explanation: "Adds the principals first and applies only the first deposit's rate and time to both." },
      { value: secondTermsForAll, misconceptionId: "USE_SECOND_TERMS_FOR_ALL_DEPOSITS", explanation: "Adds the principals first and applies only the second deposit's rate and time to both." },
    ],
    explanation: {
      mainRule: "Independent deposits produce independent simple-interest contributions; calculate and add them.",
      workedSteps: [
        `First deposit data: $P_1=${formatExact(firstPrincipal)},\ R_1=${formatExact(firstRate)},\ T_1=${formatExact(firstTime)}$.`,
        `$$I_1=\frac{${formatExact(firstPrincipal)}\times${formatExact(firstRate)}\times${formatExact(firstTime)}}{100}=${formatExact(firstInterest)}$$`,
        `Second deposit: $$I_2=\frac{${formatExact(secondPrincipal)}\times${formatExact(secondRate)}\times${formatExact(secondTime)}}{100}=${formatExact(secondInterest)}$$`,
        `Combined interest: $$I=I_1+I_2=${formatExact(firstInterest)}+${formatExact(secondInterest)}=${formatExact(solution)}$$`,
      ],
      examShortcut: `Write one ledger line: $$I=\frac{P_1R_1T_1+P_2R_2T_2}{100}=${formatExact(solution)}$$`,
      verification: `The independent contribution ledger totals ${money(firstInterest)} + ${money(secondInterest)} = ${money(solution)}.`,
      conclusion: `The combined simple interest is ${money(solution)}.`,
    },
    validation: { ok: verification.ok, errors: verification.errors },
  };
}

function buildSplitPrincipal(seed: string): BuildResult {
  const { actor, institution } = context(seed);
  const totalPrincipal = rational(pick([10000, 12000, 15000, 18000, 20000], seed, "total"));
  const fraction = pick([rational(3, 10), rational(2, 5)], seed, "fraction");
  const firstPrincipal = multiplyRational(totalPrincipal, fraction);
  const secondPrincipal = subtractRational(totalPrincipal, firstPrincipal);
  const firstRate = rational(pick([5, 6, 8], seed, "r1"));
  const firstTime = rational(2);
  const secondRate = addRational(firstRate, rational(pick([2, 3, 4], seed, "gap")));
  const secondTime = rational(1);
  const firstInterest = simpleInterest(firstPrincipal, firstRate, firstTime);
  const secondInterest = simpleInterest(secondPrincipal, secondRate, secondTime);
  const totalInterest = addRational(firstInterest, secondInterest);
  const half = divideRational(totalPrincipal, rational(2));
  const validation = verifyIntCp002SplitPrincipalCandidate({
    totalPrincipal,
    firstPrincipal,
    secondPrincipal,
    firstAnnualRatePercent: firstRate,
    firstDurationYears: firstTime,
    secondAnnualRatePercent: secondRate,
    secondDurationYears: secondTime,
    expectedTotalInterest: totalInterest,
  });
  return {
    stem: `${actor} divides ${money(totalPrincipal)} between two simple-interest deposits in ${institution}. The first part earns ${formatPercent(firstRate)} per annum for ${years(firstTime)}, and the remaining part earns ${formatPercent(secondRate)} per annum for ${years(secondTime)}. If the total interest is ${money(totalInterest)}, how much was placed in the first deposit?`,
    answerSemantic: "PRINCIPAL",
    difficulty: "Hard",
    sourceState: {
      values: { totalPrincipal, firstPrincipal, secondPrincipal, firstRate, secondRate, firstTime, secondTime, totalInterest },
    },
    solution: firstPrincipal,
    optionCandidates: [
      { value: firstPrincipal, misconceptionId: "CORRECT", explanation: "Solves the split equation while keeping the second part equal to total minus the first part." },
      { value: secondPrincipal, misconceptionId: "USE_COMPLEMENTARY_SPLIT", explanation: "Returns the complementary second deposit instead of the requested first deposit." },
      { value: half, misconceptionId: "ASSUME_EQUAL_SPLIT", explanation: "Assumes the money was divided equally without using the interest evidence." },
      { value: totalPrincipal, misconceptionId: "RETURN_TOTAL_PRINCIPAL", explanation: "Returns the full available principal rather than the portion placed in the first deposit." },
    ],
    explanation: {
      mainRule: "Let the first part be x and the second part be total − x, then add their exact interest contributions.",
      workedSteps: [
        `Let the first deposit be $x$; the second deposit is $${formatExact(totalPrincipal)}-x$.`,
        `Write the interest equation: $$\frac{x\times${formatExact(firstRate)}\times${formatExact(firstTime)}}{100}+\frac{(${formatExact(totalPrincipal)}-x)\times${formatExact(secondRate)}\times${formatExact(secondTime)}}{100}=${formatExact(totalInterest)}$$`,
        `Multiply by 100 and expand: $$${formatExact(multiplyRational(firstRate, firstTime))}x+${formatExact(secondRate)}(${formatExact(totalPrincipal)}-x)=${formatExact(multiplyRational(totalInterest, ONE_HUNDRED))}$$`,
        `Isolate x: $$x=${formatExact(firstPrincipal)}$$ and the other part is $${formatExact(totalPrincipal)}-${formatExact(firstPrincipal)}=${formatExact(secondPrincipal)}$.`,
      ],
      examShortcut: `Use weighted coefficients directly: $$x=\frac{100I-S(R_2T_2)}{R_1T_1-R_2T_2}=${formatExact(firstPrincipal)}$$`,
      verification: `First interest ${money(firstInterest)} plus second interest ${money(secondInterest)} equals the stated ${money(totalInterest)}.`,
      conclusion: `${actor} placed ${money(firstPrincipal)} in the first deposit.`,
    },
    validation: { ok: validation.ok, errors: validation.errors },
  };
}

const EQUAL_INTEREST_TEMPLATES = [
  { p1: 6000, r1: 8, t1: 2, r2: 6, t2: 4, p2: 4000 },
  { p1: 8000, r1: 9, t1: 2, r2: 12, t2: 1, p2: 12000 },
  { p1: 9000, r1: 10, t1: 2, r2: 12, t2: 3, p2: 5000 },
] as const;

function buildEqualInterest(seed: string): BuildResult {
  const { actor, institution } = context(seed);
  const template = pick(EQUAL_INTEREST_TEMPLATES, seed, "template");
  const scale = BigInt(pick([1, 2, 3], seed, "scale"));
  const firstPrincipal = rational(BigInt(template.p1) * scale);
  const secondPrincipal = rational(BigInt(template.p2) * scale);
  const firstRate = rational(template.r1);
  const secondRate = rational(template.r2);
  const firstTime = rational(template.t1);
  const secondTime = rational(template.t2);
  const commonInterest = simpleInterest(firstPrincipal, firstRate, firstTime);
  const assumeEqual = firstPrincipal;
  const ignoreDuration = divideRational(multiplyRational(firstPrincipal, firstRate), secondRate);
  const ignoreRate = divideRational(multiplyRational(firstPrincipal, firstTime), secondTime);
  const firstLedger: IntCp002LedgerState = {
    contributions: [contribution({ id: "first-investment", principal: firstPrincipal, rate: firstRate, duration: firstTime })],
    dayCountBasis: "NOT_APPLICABLE",
    totalInterest: commonInterest,
  };
  const secondLedger: IntCp002LedgerState = {
    contributions: [contribution({ id: "second-investment", principal: secondPrincipal, rate: secondRate, duration: secondTime })],
    dayCountBasis: "NOT_APPLICABLE",
    totalInterest: commonInterest,
  };
  const verification = verifyIntCp002UnknownContributionCandidate({
    knownContributions: [],
    unknownContributionTemplate: {
      contributionId: "second-investment",
      annualRatePercent: secondRate,
      durationYears: secondTime,
      startsAtYears: ZERO,
      endsAtYears: secondTime,
      sourceKind: "INDEPENDENT_DEPOSIT",
    },
    candidatePrincipal: secondPrincipal,
    expectedTotalInterest: commonInterest,
  });
  return {
    stem: `${actor} earns the same simple interest from two investments in ${institution}. The first principal is ${money(firstPrincipal)} at ${formatPercent(firstRate)} per annum for ${years(firstTime)}. The second investment earns ${formatPercent(secondRate)} per annum for ${years(secondTime)}. Find the second principal.`,
    answerSemantic: "PRINCIPAL",
    difficulty: "Medium",
    sourceState: { ledger: firstLedger, comparisonLedger: secondLedger, values: { firstPrincipal, secondPrincipal, firstRate, secondRate, firstTime, secondTime, commonInterest } },
    solution: secondPrincipal,
    optionCandidates: [
      { value: secondPrincipal, misconceptionId: "CORRECT", explanation: "Uses the equal-interest relation P₁R₁T₁ = P₂R₂T₂ with both rate and time factors." },
      { value: assumeEqual, misconceptionId: "ASSUME_EQUAL_PRINCIPAL", explanation: "Assumes equal interest means equal principal even though rate and duration differ." },
      { value: ignoreDuration, misconceptionId: "IGNORE_DURATION_RATIO", explanation: "Uses only the rate ratio and ignores the different durations." },
      { value: ignoreRate, misconceptionId: "IGNORE_RATE_RATIO", explanation: "Uses only the time ratio and ignores the different annual rates." },
    ],
    explanation: {
      mainRule: "Equal simple interests imply equality of the products P × R × T.",
      workedSteps: [
        `First interest: $$I_1=\frac{${formatExact(firstPrincipal)}\times${formatExact(firstRate)}\times${formatExact(firstTime)}}{100}=${formatExact(commonInterest)}$$`,
        `Let the second principal be $P_2$. Its interest is $$I_2=\frac{P_2\times${formatExact(secondRate)}\times${formatExact(secondTime)}}{100}$$`,
        `Since the interests are equal: $$\frac{P_2\times${formatExact(secondRate)}\times${formatExact(secondTime)}}{100}=${formatExact(commonInterest)}$$`,
        `Therefore: $$P_2=\frac{${formatExact(commonInterest)}\times100}{${formatExact(secondRate)}\times${formatExact(secondTime)}}=${formatExact(secondPrincipal)}$$`,
      ],
      examShortcut: `Use the ratio directly: $$P_2=P_1\frac{R_1T_1}{R_2T_2}=${formatExact(firstPrincipal)}\times\frac{${formatExact(firstRate)}\times${formatExact(firstTime)}}{${formatExact(secondRate)}\times${formatExact(secondTime)}}=${formatExact(secondPrincipal)}$$`,
      verification: `The second investment also earns ${money(commonInterest)}, exactly matching the first.`,
      conclusion: `The required second principal is ${money(secondPrincipal)}.`,
    },
    validation: { ok: verification.ok, errors: verification.errors },
  };
}

function buildCounterfactual(seed: string): BuildResult {
  const { actor, institution } = context(seed);
  const principal = rational(pick([5000, 8000, 10000, 12000, 15000], seed, "principal"));
  const oldRate = rational(pick([4, 5, 6, 8], seed, "old-rate"));
  const newRate = addRational(oldRate, rational(pick([2, 3, 4], seed, "gap")));
  const time = rational(pick([1, 2, 3], seed, "time"));
  const oldInterest = simpleInterest(principal, oldRate, time);
  const newInterest = simpleInterest(principal, newRate, time);
  const solution = subtractRational(newInterest, oldInterest);
  const addedRates = simpleInterest(principal, addRational(oldRate, newRate), time);
  const oldLedger: IntCp002LedgerState = {
    contributions: [contribution({ id: "old-scheme", principal, rate: oldRate, duration: time, kind: "COUNTERFACTUAL_STATE" })],
    dayCountBasis: "NOT_APPLICABLE",
    totalInterest: oldInterest,
  };
  const newLedger: IntCp002LedgerState = {
    contributions: [contribution({ id: "new-scheme", principal, rate: newRate, duration: time, kind: "COUNTERFACTUAL_STATE" })],
    dayCountBasis: "NOT_APPLICABLE",
    totalInterest: newInterest,
  };
  const verification = verifyIntCp002LedgerDifferenceCandidate({
    left: newLedger,
    right: oldLedger,
    candidateDifference: solution,
  });
  return {
    stem: `${actor} considers moving ${money(principal)} in ${institution} from ${formatPercent(oldRate)} to ${formatPercent(newRate)} simple interest for ${years(time)}. How much additional interest will the higher rate earn?`,
    answerSemantic: "MONEY",
    difficulty: "Easy",
    sourceState: { ledger: newLedger, comparisonLedger: oldLedger, values: { principal, oldRate, newRate, time, oldInterest, newInterest } },
    solution,
    optionCandidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: "Subtracts the old complete interest from the new complete interest." },
      { value: newInterest, misconceptionId: "RETURN_NEW_TOTAL_INTEREST", explanation: "Returns all interest at the new rate instead of only the additional interest." },
      { value: oldInterest, misconceptionId: "RETURN_OLD_TOTAL_INTEREST", explanation: "Returns the original scheme's interest rather than the increase." },
      { value: addedRates, misconceptionId: "ADD_RATES_INSTEAD_OF_SUBTRACTING", explanation: "Adds the two rates even though the question asks for the difference between the schemes." },
    ],
    explanation: {
      mainRule: "Additional interest equals new-scheme interest minus old-scheme interest.",
      workedSteps: [
        `Old scheme: $$I_{old}=\frac{${formatExact(principal)}\times${formatExact(oldRate)}\times${formatExact(time)}}{100}=${formatExact(oldInterest)}$$`,
        `New scheme: $$I_{new}=\frac{${formatExact(principal)}\times${formatExact(newRate)}\times${formatExact(time)}}{100}=${formatExact(newInterest)}$$`,
        `Additional interest: $$\Delta I=I_{new}-I_{old}=${formatExact(newInterest)}-${formatExact(oldInterest)}$$`,
        `$$\Delta I=${formatExact(solution)}$$`,
      ],
      examShortcut: `Use only the rate difference: $$\Delta I=\frac{P(R_{new}-R_{old})T}{100}=\frac{${formatExact(principal)}(${formatExact(newRate)}-${formatExact(oldRate)})${formatExact(time)}}{100}=${formatExact(solution)}$$`,
      verification: `${money(newInterest)} − ${money(oldInterest)} = ${money(solution)}.`,
      conclusion: `The higher rate earns ${money(solution)} more.`,
    },
    validation: { ok: verification.ok, errors: verification.errors },
  };
}

function buildPartialRepayment(seed: string): BuildResult {
  const { actor, institution } = context(seed);
  const openingPrincipal = rational(pick([10000, 12000, 15000, 18000, 20000], seed, "opening"));
  const repaymentFraction = pick([rational(1, 5), rational(1, 4), rational(2, 5)], seed, "repayment-fraction");
  const repayment = multiplyRational(openingPrincipal, repaymentFraction);
  const rate = rational(pick([6, 8, 10, 12], seed, "rate"));
  const repaymentTime = rational(pick([1, 2], seed, "repayment-time"));
  const horizon = addRational(repaymentTime, rational(pick([1, 2], seed, "remaining-time")));
  const contributions = buildIntCp002OutstandingBalanceContributions({
    openingPrincipal,
    annualRatePercent: rate,
    horizonYears: horizon,
    events: [{ eventId: "repayment", atYears: repaymentTime, kind: "PARTIAL_REPAYMENT", amount: repayment }],
  });
  const ledger: IntCp002LedgerState = {
    contributions,
    dayCountBasis: "NOT_APPLICABLE",
  };
  const solution = calculateIntCp002Ledger(ledger).totalInterest;
  ledger.totalInterest = solution;
  const remainingPrincipal = subtractRational(openingPrincipal, repayment);
  const ignoreRepayment = simpleInterest(openingPrincipal, rate, horizon);
  const repaymentFromStart = simpleInterest(remainingPrincipal, rate, horizon);
  const omitPostSegment = simpleInterest(openingPrincipal, rate, repaymentTime);
  const firstSegment = calculateIntCp002Ledger({ contributions: [contributions[0]!], dayCountBasis: "NOT_APPLICABLE" }).totalInterest;
  const secondSegment = calculateIntCp002Ledger({ contributions: [contributions[1]!], dayCountBasis: "NOT_APPLICABLE" }).totalInterest;
  const verification = verifyIntCp002LedgerCandidate(ledger, solution);
  return {
    stem: `${actor} owes ${money(openingPrincipal)} to ${institution} at ${formatPercent(rate)} per annum simple interest. At the end of ${years(repaymentTime)}, ${actor} repays ${money(repayment)}. Simple interest then continues only on the outstanding principal until the end of ${years(horizon)}. Find the total interest.`,
    answerSemantic: "MONEY",
    difficulty: "Hard",
    sourceState: { ledger, contributions, values: { openingPrincipal, repayment, remainingPrincipal, rate, repaymentTime, horizon } },
    solution,
    optionCandidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: "Charges interest on the opening balance before repayment and only the remaining balance afterwards." },
      { value: ignoreRepayment, misconceptionId: "IGNORE_REPAYMENT", explanation: "Charges interest on the original principal for the full horizon and ignores the repayment." },
      { value: repaymentFromStart, misconceptionId: "APPLY_REPAYMENT_FROM_START", explanation: "Treats the reduced balance as if it had applied from time zero." },
      { value: omitPostSegment, misconceptionId: "OMIT_POST_REPAYMENT_SEGMENT", explanation: "Calculates interest only up to the repayment date and omits the later outstanding-balance segment." },
    ],
    explanation: {
      mainRule: "A partial repayment creates separate simple-interest balance segments; each balance earns interest only for its own duration.",
      workedSteps: [
        `Before repayment: $$I_1=\frac{${formatExact(openingPrincipal)}\times${formatExact(rate)}\times${formatExact(repaymentTime)}}{100}=${formatExact(firstSegment)}$$`,
        `Outstanding principal: $$P_2=${formatExact(openingPrincipal)}-${formatExact(repayment)}=${formatExact(remainingPrincipal)}$$`,
        `Remaining duration: $$T_2=${formatExact(horizon)}-${formatExact(repaymentTime)}=${formatExact(subtractRational(horizon, repaymentTime))}$$ and $$I_2=\frac{${formatExact(remainingPrincipal)}\times${formatExact(rate)}\times${formatExact(subtractRational(horizon, repaymentTime))}}{100}=${formatExact(secondSegment)}$$`,
        `Total interest: $$I=I_1+I_2=${formatExact(firstSegment)}+${formatExact(secondSegment)}=${formatExact(solution)}$$`,
      ],
      examShortcut: "Draw a two-segment balance timeline: opening balance until repayment, then reduced balance for the remaining time.",
      verification: `${money(firstSegment)} before repayment plus ${money(secondSegment)} after repayment equals ${money(solution)}.`,
      conclusion: `The total simple interest is ${money(solution)}.`,
    },
    validation: { ok: verification.ok, errors: verification.errors },
  };
}

function buildBorrowLendSpread(seed: string): BuildResult {
  const { actor } = context(seed);
  const principal = rational(pick([5000, 8000, 10000, 12000, 15000], seed, "principal"));
  const borrowRate = rational(pick([4, 5, 6, 8], seed, "borrow-rate"));
  const lendRate = addRational(borrowRate, rational(pick([2, 3, 5], seed, "spread")));
  const time = rational(pick([1, 2, 3], seed, "time"));
  const borrowingInterest = simpleInterest(principal, borrowRate, time);
  const lendingInterest = simpleInterest(principal, lendRate, time);
  const solution = subtractRational(lendingInterest, borrowingInterest);
  const rateSumInterest = simpleInterest(principal, addRational(borrowRate, lendRate), time);
  const borrowLedger: IntCp002LedgerState = {
    contributions: [contribution({ id: "borrow", principal, rate: borrowRate, duration: time, kind: "COUNTERFACTUAL_STATE" })],
    dayCountBasis: "NOT_APPLICABLE",
    totalInterest: borrowingInterest,
  };
  const lendLedger: IntCp002LedgerState = {
    contributions: [contribution({ id: "lend", principal, rate: lendRate, duration: time, kind: "COUNTERFACTUAL_STATE" })],
    dayCountBasis: "NOT_APPLICABLE",
    totalInterest: lendingInterest,
  };
  const verification = verifyIntCp002LedgerDifferenceCandidate({ left: lendLedger, right: borrowLedger, candidateDifference: solution });
  return {
    stem: `${actor} borrows ${money(principal)} at ${formatPercent(borrowRate)} per annum simple interest and lends the same amount for the same ${years(time)} at ${formatPercent(lendRate)} per annum simple interest. Find the net interest gain.`,
    answerSemantic: "MONEY",
    difficulty: "Easy",
    sourceState: { ledger: lendLedger, comparisonLedger: borrowLedger, values: { principal, borrowRate, lendRate, time, borrowingInterest, lendingInterest } },
    solution,
    optionCandidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: "Subtracts borrowing interest from lending interest for the same principal and duration." },
      { value: rateSumInterest, misconceptionId: "ADD_BORROW_AND_LEND_RATES", explanation: "Adds the borrowing and lending rates instead of taking their spread." },
      { value: lendingInterest, misconceptionId: "RETURN_LENDING_INTEREST", explanation: "Returns gross lending interest without deducting the borrowing cost." },
      { value: borrowingInterest, misconceptionId: "RETURN_BORROWING_INTEREST", explanation: "Returns the interest paid rather than the net gain." },
    ],
    explanation: {
      mainRule: "Net interest gain equals lending interest minus borrowing interest.",
      workedSteps: [
        `Borrowing cost: $$I_b=\frac{${formatExact(principal)}\times${formatExact(borrowRate)}\times${formatExact(time)}}{100}=${formatExact(borrowingInterest)}$$`,
        `Lending income: $$I_l=\frac{${formatExact(principal)}\times${formatExact(lendRate)}\times${formatExact(time)}}{100}=${formatExact(lendingInterest)}$$`,
        `Net gain: $$G=I_l-I_b=${formatExact(lendingInterest)}-${formatExact(borrowingInterest)}$$`,
        `$$G=${formatExact(solution)}$$`,
      ],
      examShortcut: `Use the rate spread: $$G=\frac{P(R_l-R_b)T}{100}=\frac{${formatExact(principal)}(${formatExact(lendRate)}-${formatExact(borrowRate)})${formatExact(time)}}{100}=${formatExact(solution)}$$`,
      verification: `${money(lendingInterest)} income − ${money(borrowingInterest)} cost = ${money(solution)}.`,
      conclusion: `The net simple-interest gain is ${money(solution)}.`,
    },
    validation: { ok: verification.ok, errors: verification.errors },
  };
}

function buildDayCount(seed: string): BuildResult {
  const { actor, institution } = context(seed);
  const actualBasis = hash(`${seed}:basis`) % 2 === 0;
  const basis = actualBasis ? "ACTUAL_365" as const : "COMMERCIAL_360" as const;
  const denominator = actualBasis ? 365 : 360;
  const days = actualBasis ? 73 : 72;
  const basePrincipal = actualBasis ? 7300 : 7200;
  const multiplier = pick([1, 2, 3, 4], seed, "multiplier");
  const principal = rational(basePrincipal * multiplier);
  const rate = rational(pick([5, 10], seed, "rate"));
  const duration = intCp002DaysToYears(days, basis);
  const solution = simpleInterest(principal, rate, duration);
  const wrongBasis = actualBasis ? 360 : 365;
  const wrongBasisInterest = simpleInterest(principal, rate, rational(days, wrongBasis));
  const daysAsMonths = simpleInterest(principal, rate, rational(days, 12));
  const daysAsYears = simpleInterest(principal, rate, rational(days));
  const ledger: IntCp002LedgerState = {
    contributions: [contribution({ id: "day-count", principal, rate, duration })],
    dayCountBasis: basis,
    totalInterest: solution,
  };
  const verification = verifyIntCp002LedgerCandidate(ledger, solution);
  const basisLabel = actualBasis ? "365-day year" : "360-day commercial year";
  return {
    stem: `${actor} deposits ${money(principal)} in ${institution} at ${formatPercent(rate)} per annum simple interest for ${days} days. Using the stated ${basisLabel}, find the interest.`,
    answerSemantic: "MONEY",
    difficulty: "Medium",
    sourceState: { ledger, values: { principal, rate, days, denominator, duration, basis } },
    solution,
    optionCandidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: `Converts ${days} days using the declared ${denominator}-day denominator before applying simple interest.` },
      { value: wrongBasisInterest, misconceptionId: "USE_WRONG_DAY_COUNT_BASIS", explanation: `Uses ${wrongBasis} days in a year instead of the explicitly stated ${denominator}-day basis.` },
      { value: daysAsMonths, misconceptionId: "TREAT_DAYS_AS_MONTHS", explanation: `Divides the number of days by 12 as though the given number were months.` },
      { value: daysAsYears, misconceptionId: "TREAT_DAYS_AS_YEARS", explanation: `Uses ${days} directly as years without any day-to-year conversion.` },
    ],
    explanation: {
      mainRule: "Convert days to years using the explicitly declared day-count basis, then apply the simple-interest formula.",
      workedSteps: [
        `Declared time basis: $$T=\frac{${days}}{${denominator}}=${formatExact(duration)}\text{ year}$$`,
        `Use $$I=\frac{P\times R\times T}{100}$$ with $P=${formatExact(principal)}$ and $R=${formatExact(rate)}$.`,
        `Substitute the values: $$I=\frac{${formatExact(principal)}\times${formatExact(rate)}\times\frac{${days}}{${denominator}}}{100}$$`,
        `Simplify: $$I=${formatExact(solution)}$$`,
      ],
      examShortcut: `Combine the denominators directly: $$I=\frac{P\times R\times days}{100\times${denominator}}=${formatExact(solution)}$$`,
      verification: `Reconstructing the contribution with T = ${days}/${denominator} year gives ${money(solution)}.`,
      conclusion: `The simple interest is ${money(solution)}.`,
    },
    validation: { ok: verification.ok, errors: verification.errors },
  };
}

function buildPrototype(prototypeId: IntCp002Wave01PrototypeId, seed: string): BuildResult {
  switch (prototypeId) {
    case "INT-CP002-PROT-PIECEWISE-RATES": return buildPiecewise(seed);
    case "INT-CP002-PROT-MULTIPLE-DEPOSITS": return buildMultipleDeposits(seed);
    case "INT-CP002-PROT-SPLIT-PRINCIPAL": return buildSplitPrincipal(seed);
    case "INT-CP002-PROT-EQUAL-INTEREST": return buildEqualInterest(seed);
    case "INT-CP002-PROT-COUNTERFACTUAL-CHANGE": return buildCounterfactual(seed);
    case "INT-CP002-PROT-PARTIAL-REPAYMENT": return buildPartialRepayment(seed);
    case "INT-CP002-PROT-BORROW-LEND-SPREAD": return buildBorrowLendSpread(seed);
    case "INT-CP002-PROT-DAY-COUNT": return buildDayCount(seed);
  }
}

export function generateIntCp002Wave01Prototype(request: {
  prototypeId: IntCp002Wave01PrototypeId;
  seed: string;
}): IntCp002Wave01GeneratedPrototype {
  if (!(INT_CP002_WAVE01_PROTOTYPE_IDS as readonly string[]).includes(request.prototypeId)) {
    throw new Error(`Unknown CP-002 Wave 1 prototype '${String(request.prototypeId)}'.`);
  }
  const requestedSeed = request.seed.trim();
  if (!requestedSeed) throw new Error("CP-002 Wave 1 generation requires a non-empty deterministic seed.");

  let lastError: unknown;
  for (let attempt = 1; attempt <= 32; attempt += 1) {
    const effectiveSeed = attempt === 1 ? requestedSeed : `${requestedSeed}:retry:${attempt - 1}`;
    try {
      const built = buildPrototype(request.prototypeId, effectiveSeed);
      built.sourceState.values.requestedSeed = requestedSeed;
      built.sourceState.values.effectiveSeed = effectiveSeed;
      built.sourceState.values.generationAttempts = attempt;
      const optionShape = rotateOptions(built.optionCandidates, built.answerSemantic, effectiveSeed);
      const validation = fullValidation(built, optionShape);
      if (!validation.ok) throw new Error(validation.errors.join("; "));
      return {
        packageId: "INT-001",
        canonicalProblemId: "INT-CP-002",
        prototypeId: request.prototypeId,
        permanentQlId: null,
        frozenSolveContractId: null,
        seed: requestedSeed,
        language: "en",
        questionLanguageId: "en-IN",
        answerSemantic: built.answerSemantic,
        difficulty: built.difficulty,
        stem: built.stem,
        sourceState: built.sourceState,
        solution: built.solution,
        options: optionShape.options,
        optionAudit: optionShape.optionAudit,
        correctIndex: optionShape.correctIndex,
        explanation: { ...built.explanation, trapAnalysis: optionShape.trapAnalysis },
        mathematicalFingerprint: fingerprint(request.prototypeId, built.sourceState, built.solution),
        validation,
        reviewStatus: "EXECUTABLE_DISCOVERY",
        enabled: false,
        stagingStatus: "NOT_STAGED",
        registrationStatus: "NOT_REGISTERED",
        questionStudioDiscoverable: false,
        questionBankStatus: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
      };
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    `${request.prototypeId}/${requestedSeed}: failed to construct a valid prototype after 32 deterministic attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
  );
}
