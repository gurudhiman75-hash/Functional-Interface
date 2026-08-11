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
} from "./cp002-foundation/ledger";
import type { IntCp002Contribution, IntCp002LedgerState } from "./cp002-foundation/types";
import { assertIntCp002Wave01MathJaxIntegrity } from "./cp002-wave01-runtime-v2";
import { verifyIntCp002Wave02Candidate } from "./cp002-wave02-verifier";
import {
  INT_CP002_WAVE02_PROTOTYPE_IDS,
  type IntCp002Wave02AnswerSemantic,
  type IntCp002Wave02Difficulty,
  type IntCp002Wave02Explanation,
  type IntCp002Wave02MisconceptionId,
  type IntCp002Wave02OptionAudit,
  type IntCp002Wave02PrototypeId,
  type IntCp002Wave02Question,
  type IntCp002Wave02State,
} from "./cp002-wave02-types";

const ZERO = rational(0);
const ONE_HUNDRED = rational(100);
const raw = String.raw;

interface Candidate {
  value: Rational;
  misconceptionId: IntCp002Wave02MisconceptionId;
  explanation: string;
}

interface BuiltQuestion {
  stem: string;
  answerSemantic: IntCp002Wave02AnswerSemantic;
  difficulty: IntCp002Wave02Difficulty;
  state: IntCp002Wave02State;
  solution: Rational;
  candidates: Candidate[];
  explanation: Omit<IntCp002Wave02Explanation, "trapAnalysis">;
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

function simpleInterest(principal: Rational, rate: Rational, duration: Rational): Rational {
  return divideRational(
    multiplyRational(principal, multiplyRational(rate, duration)),
    ONE_HUNDRED,
  );
}

function contribution(
  id: string,
  principal: Rational,
  rate: Rational,
  duration: Rational,
): IntCp002Contribution {
  return {
    contributionId: id,
    principal,
    annualRatePercent: rate,
    durationYears: duration,
    startsAtYears: ZERO,
    endsAtYears: duration,
    sourceKind: "INDEPENDENT_DEPOSIT",
  };
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

function formatAnswer(value: Rational, semantic: IntCp002Wave02AnswerSemantic): string {
  switch (semantic) {
    case "PRINCIPAL": return money(value);
    case "RATE_PERCENT": return rateText(value);
    case "TIME_YEARS": return timeText(value);
    case "DAYS": return `${formatExact(value)} ${equalsRational(value, rational(1)) ? "day" : "days"}`;
  }
}

function rotateCandidates(
  candidates: Candidate[],
  semantic: IntCp002Wave02AnswerSemantic,
  seed: string,
): {
  options: string[];
  optionAudit: IntCp002Wave02OptionAudit[];
  correctIndex: number;
  trapAnalysis: IntCp002Wave02Explanation["trapAnalysis"];
} {
  if (candidates.length !== 4) throw new Error("Wave 2 requires exactly four option candidates.");
  if (candidates.filter((item) => item.misconceptionId === "CORRECT").length !== 1) {
    throw new Error("Wave 2 requires exactly one correct candidate.");
  }
  const audited = candidates.map((candidate) => ({
    text: formatAnswer(candidate.value, semantic),
    value: candidate.value,
    misconceptionId: candidate.misconceptionId,
    explanation: candidate.explanation,
  }));
  if (new Set(audited.map((item) => item.text)).size !== 4) {
    throw new Error("Wave 2 formatted-option collision.");
  }
  const rotation = hash(`${seed}:option-rotation`) % 4;
  const rotated = audited.map((_item, index) => audited[(index + rotation) % 4]!);
  const correctIndex = rotated.findIndex((item) => item.misconceptionId === "CORRECT");
  return {
    options: rotated.map((item) => item.text),
    optionAudit: rotated,
    correctIndex,
    trapAnalysis: rotated
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.misconceptionId !== "CORRECT")
      .map(({ item, index }) => ({
        optionNumber: index + 1,
        misconceptionId: item.misconceptionId as Exclude<IntCp002Wave02MisconceptionId, "CORRECT">,
        explanation: item.explanation,
      })),
  };
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function learnerText(question: IntCp002Wave02Question): string {
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
  prototypeId: IntCp002Wave02PrototypeId,
  requestedSeed: string,
  effectiveSeed: string,
  generationAttempts: number,
  built: BuiltQuestion,
): IntCp002Wave02Question {
  const optionShape = rotateCandidates(built.candidates, built.answerSemantic, effectiveSeed);
  const draft: IntCp002Wave02Question = {
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-002",
    waveId: "INT-CP-002-WAVE02-INVERSE-SATURATION",
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
  draft.optionAudit.forEach((option) => {
    const verifies = verifyIntCp002Wave02Candidate(draft, option.value);
    if (verifies) verifiedOptions += 1;
    if (option.misconceptionId === "CORRECT" && !verifies) {
      errors.push("Correct option failed the independent Wave 2 verifier.");
    }
    if (option.misconceptionId !== "CORRECT" && verifies) {
      errors.push(`Wrong option '${option.misconceptionId}' passed independent verification.`);
    }
  });
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
  if (/<sub>Trace:|INT-QL-|INT-CP002-W02-|requestedSeed|effectiveSeed|generationAttempts|FIND_/u.test(learnerText(draft))) {
    errors.push("Internal Wave 2 metadata leaked into learner text.");
  }
  draft.validation = { ok: errors.length === 0, errors };
  if (!draft.validation.ok) throw new Error(errors.join("; "));
  return draft;
}

function buildPiecewiseMissingRate(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const principal = rational(pick([6000, 8000, 10000, 12000], seed, "principal"));
  const firstRate = rational(pick([4, 5, 6], seed, "first-rate"));
  const secondRate = addRational(firstRate, rational(pick([2, 3, 4], seed, "gap")));
  const firstTime = rational(1);
  const secondTime = rational(pick([2, 3], seed, "second-time"));
  const firstInterest = simpleInterest(principal, firstRate, firstTime);
  const secondInterest = simpleInterest(principal, secondRate, secondTime);
  const totalInterest = addRational(firstInterest, secondInterest);
  const ignoreKnown = divideRational(multiplyRational(totalInterest, ONE_HUNDRED), multiplyRational(principal, secondTime));
  const addKnown = divideRational(multiplyRational(addRational(totalInterest, firstInterest), ONE_HUNDRED), multiplyRational(principal, secondTime));
  const state: IntCp002Wave02State = { values: { principal, firstRate, secondRate, firstTime, secondTime, firstInterest, totalInterest } };
  return {
    stem: `${actor} deposits ${money(principal)} in ${institution}. It earns ${rateText(firstRate)} simple interest for ${timeText(firstTime)} and then an unknown annual simple-interest rate for the next ${timeText(secondTime)}. If the total interest is ${money(totalInterest)}, find the second rate.`,
    answerSemantic: "RATE_PERCENT",
    difficulty: "Hard",
    state,
    solution: secondRate,
    candidates: [
      { value: secondRate, misconceptionId: "CORRECT", explanation: "Subtracts the first interval's interest before solving the second interval rate." },
      { value: ignoreKnown, misconceptionId: "IGNORE_KNOWN_CONTRIBUTION", explanation: "Treats the total interest as if it came only from the second interval." },
      { value: addKnown, misconceptionId: "SUBTRACT_KNOWN_INTEREST_WRONG_WAY", explanation: "Adds the first interval interest to the total instead of subtracting it." },
      { value: firstRate, misconceptionId: "ASSUME_EQUAL_RATE", explanation: "Assumes the rate did not change despite the unknown second-rate condition." },
    ],
    explanation: {
      mainRule: "Remove the known interval's interest from the total, then solve the remaining simple-interest contribution for its rate.",
      workedSteps: [
        raw`Known first interval: $$I_1=\frac{${formatExact(principal)}\times${formatExact(firstRate)}\times${formatExact(firstTime)}}{100}=${formatExact(firstInterest)}$$`,
        raw`Second-interval interest: $$I_2=${formatExact(totalInterest)}-${formatExact(firstInterest)}=${formatExact(secondInterest)}$$`,
        raw`Use $$I_2=\frac{P\times R_2\times T_2}{100}$$, so $$${formatExact(secondInterest)}=\frac{${formatExact(principal)}\times R_2\times${formatExact(secondTime)}}{100}$$`,
        raw`Isolate the rate: $$R_2=\frac{${formatExact(secondInterest)}\times100}{${formatExact(principal)}\times${formatExact(secondTime)}}=${formatExact(secondRate)}\%$$`,
      ],
      examShortcut: raw`Use the weighted ledger directly: $$R_2=\frac{100I-P R_1T_1}{P T_2}=${formatExact(secondRate)}\%$$`,
      verification: `The first interval gives ${money(firstInterest)} and the recovered second rate gives ${money(secondInterest)}; together they give ${money(totalInterest)}.`,
      conclusion: `The second annual rate is ${rateText(secondRate)}.`,
    },
  };
}

function buildPiecewiseMissingDuration(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const principal = rational(pick([5000, 8000, 10000, 12000], seed, "principal"));
  const firstRate = rational(pick([4, 5, 6], seed, "first-rate"));
  const secondRate = addRational(firstRate, rational(pick([3, 4, 5], seed, "gap")));
  const firstTime = rational(1);
  const secondTime = rational(pick([2, 3], seed, "second-time"));
  const firstInterest = simpleInterest(principal, firstRate, firstTime);
  const secondInterest = simpleInterest(principal, secondRate, secondTime);
  const totalInterest = addRational(firstInterest, secondInterest);
  const ignoreKnown = divideRational(multiplyRational(totalInterest, ONE_HUNDRED), multiplyRational(principal, secondRate));
  const addKnown = divideRational(multiplyRational(addRational(totalInterest, firstInterest), ONE_HUNDRED), multiplyRational(principal, secondRate));
  return {
    stem: `${actor} keeps ${money(principal)} in ${institution} at ${rateText(firstRate)} simple interest for ${timeText(firstTime)}, followed by ${rateText(secondRate)} simple interest for an unknown period. The total interest is ${money(totalInterest)}. Find the second period.`,
    answerSemantic: "TIME_YEARS",
    difficulty: "Hard",
    state: { values: { principal, firstRate, secondRate, firstTime, secondTime, firstInterest, totalInterest } },
    solution: secondTime,
    candidates: [
      { value: secondTime, misconceptionId: "CORRECT", explanation: "Removes the known first interval and solves the remaining contribution for time." },
      { value: ignoreKnown, misconceptionId: "IGNORE_KNOWN_CONTRIBUTION", explanation: "Uses the entire total interest as the second interval's interest." },
      { value: addKnown, misconceptionId: "SUBTRACT_KNOWN_INTEREST_WRONG_WAY", explanation: "Adds the first interval interest before solving for time." },
      { value: firstTime, misconceptionId: "ASSUME_EQUAL_DURATION", explanation: "Assumes both intervals lasted equally long without using the total interest." },
    ],
    explanation: {
      mainRule: "Find the known interval interest, subtract it from the total, and solve the remaining contribution for time.",
      workedSteps: [
        raw`First interval: $$I_1=\frac{${formatExact(principal)}\times${formatExact(firstRate)}\times${formatExact(firstTime)}}{100}=${formatExact(firstInterest)}$$`,
        raw`Required second interest: $$I_2=${formatExact(totalInterest)}-${formatExact(firstInterest)}=${formatExact(secondInterest)}$$`,
        raw`Substitute in $$I_2=\frac{P R_2T_2}{100}$$: $$${formatExact(secondInterest)}=\frac{${formatExact(principal)}\times${formatExact(secondRate)}\times T_2}{100}$$`,
        raw`Therefore $$T_2=\frac{${formatExact(secondInterest)}\times100}{${formatExact(principal)}\times${formatExact(secondRate)}}=${formatExact(secondTime)}$$ years.`,
      ],
      examShortcut: raw`$$T_2=\frac{100I-P R_1T_1}{P R_2}=${formatExact(secondTime)}$$`,
      verification: `At the recovered period, the second interval earns ${money(secondInterest)}; adding ${money(firstInterest)} gives ${money(totalInterest)}.`,
      conclusion: `The second period is ${timeText(secondTime)}.`,
    },
  };
}

interface MultiState {
  firstPrincipal: Rational;
  firstRate: Rational;
  firstTime: Rational;
  secondPrincipal: Rational;
  secondRate: Rational;
  secondTime: Rational;
  firstInterest: Rational;
  secondInterest: Rational;
  totalInterest: Rational;
}

function makeMultiState(seed: string): MultiState {
  const firstPrincipal = rational(pick([4000, 5000, 6000, 8000], seed, "p1"));
  const firstRate = rational(pick([5, 6, 8], seed, "r1"));
  const firstTime = rational(1);
  const secondPrincipal = rational(pick([7000, 9000, 10000, 12000], seed, "p2"));
  const secondRate = rational(pick([7, 9, 10, 12], seed, "r2"));
  const secondTime = rational(pick([2, 3], seed, "t2"));
  const firstInterest = simpleInterest(firstPrincipal, firstRate, firstTime);
  const secondInterest = simpleInterest(secondPrincipal, secondRate, secondTime);
  return {
    firstPrincipal,
    firstRate,
    firstTime,
    secondPrincipal,
    secondRate,
    secondTime,
    firstInterest,
    secondInterest,
    totalInterest: addRational(firstInterest, secondInterest),
  };
}

function multiValues(state: MultiState): IntCp002Wave02State {
  return { values: { ...state } };
}

function buildMultiMissingPrincipal(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const s = makeMultiState(seed);
  const ignoreKnown = divideRational(multiplyRational(s.totalInterest, ONE_HUNDRED), multiplyRational(s.secondRate, s.secondTime));
  const addKnown = divideRational(multiplyRational(addRational(s.totalInterest, s.firstInterest), ONE_HUNDRED), multiplyRational(s.secondRate, s.secondTime));
  const omitTime = divideRational(multiplyRational(s.secondInterest, ONE_HUNDRED), s.secondRate);
  return {
    stem: `${actor} invests ${money(s.firstPrincipal)} at ${rateText(s.firstRate)} for ${timeText(s.firstTime)} and another unknown principal at ${rateText(s.secondRate)} for ${timeText(s.secondTime)} in ${institution}. The combined simple interest is ${money(s.totalInterest)}. Find the second principal.`,
    answerSemantic: "PRINCIPAL",
    difficulty: "Hard",
    state: multiValues(s),
    solution: s.secondPrincipal,
    candidates: [
      { value: s.secondPrincipal, misconceptionId: "CORRECT", explanation: "Subtracts the known deposit's interest and solves the second contribution for principal." },
      { value: ignoreKnown, misconceptionId: "USE_TOTAL_INTEREST_AS_UNKNOWN_CONTRIBUTION", explanation: "Treats the combined interest as if the unknown deposit produced all of it." },
      { value: addKnown, misconceptionId: "SUBTRACT_KNOWN_INTEREST_WRONG_WAY", explanation: "Adds the known contribution instead of removing it from the combined interest." },
      { value: omitTime, misconceptionId: "OMIT_DIVIDE_BY_DURATION", explanation: "Solves for principal without dividing by the second deposit's duration." },
    ],
    explanation: {
      mainRule: "Remove the known deposit's interest, then invert the second deposit's simple-interest formula for principal.",
      workedSteps: [
        raw`Known deposit: $$I_1=\frac{${formatExact(s.firstPrincipal)}\times${formatExact(s.firstRate)}\times${formatExact(s.firstTime)}}{100}=${formatExact(s.firstInterest)}$$`,
        raw`Unknown deposit's interest: $$I_2=${formatExact(s.totalInterest)}-${formatExact(s.firstInterest)}=${formatExact(s.secondInterest)}$$`,
        raw`$$${formatExact(s.secondInterest)}=\frac{P_2\times${formatExact(s.secondRate)}\times${formatExact(s.secondTime)}}{100}$$`,
        raw`$$P_2=\frac{${formatExact(s.secondInterest)}\times100}{${formatExact(s.secondRate)}\times${formatExact(s.secondTime)}}=${formatExact(s.secondPrincipal)}$$`,
      ],
      examShortcut: raw`$$P_2=\frac{100I_{total}-P_1R_1T_1}{R_2T_2}=${formatExact(s.secondPrincipal)}$$`,
      verification: `The recovered second principal earns ${money(s.secondInterest)}; with ${money(s.firstInterest)}, the total is ${money(s.totalInterest)}.`,
      conclusion: `The second principal is ${money(s.secondPrincipal)}.`,
    },
  };
}

function buildMultiMissingRate(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const s = makeMultiState(seed);
  const ignoreKnown = divideRational(multiplyRational(s.totalInterest, ONE_HUNDRED), multiplyRational(s.secondPrincipal, s.secondTime));
  const addKnown = divideRational(multiplyRational(addRational(s.totalInterest, s.firstInterest), ONE_HUNDRED), multiplyRational(s.secondPrincipal, s.secondTime));
  const omitTime = divideRational(multiplyRational(s.secondInterest, ONE_HUNDRED), s.secondPrincipal);
  return {
    stem: `${actor} invests ${money(s.firstPrincipal)} at ${rateText(s.firstRate)} for ${timeText(s.firstTime)} and ${money(s.secondPrincipal)} at an unknown simple-interest rate for ${timeText(s.secondTime)} through ${institution}. The combined interest is ${money(s.totalInterest)}. Find the second rate.`,
    answerSemantic: "RATE_PERCENT",
    difficulty: "Hard",
    state: multiValues(s),
    solution: s.secondRate,
    candidates: [
      { value: s.secondRate, misconceptionId: "CORRECT", explanation: "Removes the first contribution and solves the second contribution for rate." },
      { value: ignoreKnown, misconceptionId: "USE_TOTAL_INTEREST_AS_UNKNOWN_CONTRIBUTION", explanation: "Uses the combined interest as the second deposit's interest." },
      { value: addKnown, misconceptionId: "SUBTRACT_KNOWN_INTEREST_WRONG_WAY", explanation: "Adds the first interest instead of subtracting it." },
      { value: omitTime, misconceptionId: "OMIT_DIVIDE_BY_DURATION", explanation: "Forgets to divide by the second duration, producing rate × time." },
    ],
    explanation: {
      mainRule: "Isolate the unknown deposit's interest and divide by its principal-time exposure.",
      workedSteps: [
        raw`$$I_1=\frac{${formatExact(s.firstPrincipal)}\times${formatExact(s.firstRate)}\times${formatExact(s.firstTime)}}{100}=${formatExact(s.firstInterest)}$$`,
        raw`$$I_2=${formatExact(s.totalInterest)}-${formatExact(s.firstInterest)}=${formatExact(s.secondInterest)}$$`,
        raw`$$${formatExact(s.secondInterest)}=\frac{${formatExact(s.secondPrincipal)}\times R_2\times${formatExact(s.secondTime)}}{100}$$`,
        raw`$$R_2=\frac{${formatExact(s.secondInterest)}\times100}{${formatExact(s.secondPrincipal)}\times${formatExact(s.secondTime)}}=${formatExact(s.secondRate)}\%$$`,
      ],
      examShortcut: raw`$$R_2=\frac{100I_{total}-P_1R_1T_1}{P_2T_2}=${formatExact(s.secondRate)}\%$$`,
      verification: `At ${rateText(s.secondRate)}, the second deposit earns ${money(s.secondInterest)}, completing the stated total.`,
      conclusion: `The second annual rate is ${rateText(s.secondRate)}.`,
    },
  };
}

function buildMultiMissingDuration(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const s = makeMultiState(seed);
  const ignoreKnown = divideRational(multiplyRational(s.totalInterest, ONE_HUNDRED), multiplyRational(s.secondPrincipal, s.secondRate));
  const addKnown = divideRational(multiplyRational(addRational(s.totalInterest, s.firstInterest), ONE_HUNDRED), multiplyRational(s.secondPrincipal, s.secondRate));
  const omitRate = divideRational(multiplyRational(s.secondInterest, ONE_HUNDRED), s.secondPrincipal);
  return {
    stem: `${actor} invests ${money(s.firstPrincipal)} at ${rateText(s.firstRate)} for ${timeText(s.firstTime)} and ${money(s.secondPrincipal)} at ${rateText(s.secondRate)} for an unknown period in ${institution}. The combined interest is ${money(s.totalInterest)}. Find the second period.`,
    answerSemantic: "TIME_YEARS",
    difficulty: "Hard",
    state: multiValues(s),
    solution: s.secondTime,
    candidates: [
      { value: s.secondTime, misconceptionId: "CORRECT", explanation: "Subtracts the known interest and solves the second contribution for time." },
      { value: ignoreKnown, misconceptionId: "USE_TOTAL_INTEREST_AS_UNKNOWN_CONTRIBUTION", explanation: "Uses the combined interest as if only the second deposit earned it." },
      { value: addKnown, misconceptionId: "SUBTRACT_KNOWN_INTEREST_WRONG_WAY", explanation: "Adds rather than removes the known interest." },
      { value: omitRate, misconceptionId: "OMIT_DIVIDE_BY_RATE", explanation: "Forgets to divide by the second annual rate." },
    ],
    explanation: {
      mainRule: "Remove the known contribution and invert the second deposit formula for duration.",
      workedSteps: [
        raw`$$I_1=\frac{${formatExact(s.firstPrincipal)}\times${formatExact(s.firstRate)}\times${formatExact(s.firstTime)}}{100}=${formatExact(s.firstInterest)}$$`,
        raw`$$I_2=${formatExact(s.totalInterest)}-${formatExact(s.firstInterest)}=${formatExact(s.secondInterest)}$$`,
        raw`$$${formatExact(s.secondInterest)}=\frac{${formatExact(s.secondPrincipal)}\times${formatExact(s.secondRate)}\times T_2}{100}$$`,
        raw`$$T_2=\frac{${formatExact(s.secondInterest)}\times100}{${formatExact(s.secondPrincipal)}\times${formatExact(s.secondRate)}}=${formatExact(s.secondTime)}$$`,
      ],
      examShortcut: raw`$$T_2=\frac{100I_{total}-P_1R_1T_1}{P_2R_2}=${formatExact(s.secondTime)}$$`,
      verification: `The recovered period produces ${money(s.secondInterest)} on the second deposit; the total becomes ${money(s.totalInterest)}.`,
      conclusion: `The second period is ${timeText(s.secondTime)}.`,
    },
  };
}

function buildCommonRate(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const firstPrincipal = rational(pick([4000, 6000, 8000], seed, "p1"));
  const secondPrincipal = rational(pick([9000, 10000, 12000], seed, "p2"));
  const firstTime = rational(1);
  const secondTime = rational(pick([2, 3], seed, "t2"));
  const commonRate = rational(pick([5, 6, 8, 10], seed, "rate"));
  const firstInterest = simpleInterest(firstPrincipal, commonRate, firstTime);
  const secondInterest = simpleInterest(secondPrincipal, commonRate, secondTime);
  const totalInterest = addRational(firstInterest, secondInterest);
  const ignoreSecond = divideRational(multiplyRational(totalInterest, ONE_HUNDRED), multiplyRational(firstPrincipal, firstTime));
  const totalPrincipalTotalTime = divideRational(
    multiplyRational(totalInterest, ONE_HUNDRED),
    multiplyRational(addRational(firstPrincipal, secondPrincipal), addRational(firstTime, secondTime)),
  );
  const totalPrincipalFirstTime = divideRational(
    multiplyRational(totalInterest, ONE_HUNDRED),
    multiplyRational(addRational(firstPrincipal, secondPrincipal), firstTime),
  );
  return {
    stem: `${actor} invests ${money(firstPrincipal)} for ${timeText(firstTime)} and ${money(secondPrincipal)} for ${timeText(secondTime)} at the same unknown simple-interest rate in ${institution}. The combined interest is ${money(totalInterest)}. Find the common annual rate.`,
    answerSemantic: "RATE_PERCENT",
    difficulty: "Hard",
    state: { values: { firstPrincipal, secondPrincipal, firstTime, secondTime, commonRate, totalInterest } },
    solution: commonRate,
    candidates: [
      { value: commonRate, misconceptionId: "CORRECT", explanation: "Divides total interest by the exact weighted principal-time exposure." },
      { value: ignoreSecond, misconceptionId: "IGNORE_KNOWN_CONTRIBUTION", explanation: "Attributes all interest to only the first investment." },
      { value: totalPrincipalTotalTime, misconceptionId: "USE_UNWEIGHTED_AVERAGE_RATE", explanation: "Multiplies total principal by total time, creating cross-terms that never earned interest." },
      { value: totalPrincipalFirstTime, misconceptionId: "OMIT_DIVIDE_BY_DURATION", explanation: "Uses only the first duration for both principals." },
    ],
    explanation: {
      mainRule: "With one common rate, factor R from the ledger and divide by the weighted sum of principal × time.",
      workedSteps: [
        raw`Ledger equation: $$${formatExact(totalInterest)}=\frac{R(${formatExact(firstPrincipal)}\times${formatExact(firstTime)}+${formatExact(secondPrincipal)}\times${formatExact(secondTime)})}{100}$$`,
        raw`Weighted exposure: $$P_1T_1+P_2T_2=${formatExact(multiplyRational(firstPrincipal, firstTime))}+${formatExact(multiplyRational(secondPrincipal, secondTime))}=${formatExact(addRational(multiplyRational(firstPrincipal, firstTime), multiplyRational(secondPrincipal, secondTime)))}$$`,
        raw`$$R=\frac{${formatExact(totalInterest)}\times100}{${formatExact(addRational(multiplyRational(firstPrincipal, firstTime), multiplyRational(secondPrincipal, secondTime)))}}$$`,
        raw`$$R=${formatExact(commonRate)}\%$$`,
      ],
      examShortcut: raw`$$R=\frac{100I}{\sum PT}=${formatExact(commonRate)}\%$$`,
      verification: `${money(firstPrincipal)} earns ${money(firstInterest)} and ${money(secondPrincipal)} earns ${money(secondInterest)}; together they give ${money(totalInterest)}.`,
      conclusion: `The common annual rate is ${rateText(commonRate)}.`,
    },
  };
}

const EQUAL_RATE_TEMPLATES = [
  { p1: 6000, r1: 8, t1: 2, p2: 8000, t2: 1, r2: 12 },
  { p1: 8000, r1: 9, t1: 2, p2: 6000, t2: 3, r2: 8 },
  { p1: 9000, r1: 10, t1: 2, p2: 12000, t2: 1, r2: 15 },
] as const;

function buildEqualInterestRate(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const t = pick(EQUAL_RATE_TEMPLATES, seed, "template");
  const scale = BigInt(pick([1, 2, 3], seed, "scale"));
  const firstPrincipal = rational(BigInt(t.p1) * scale);
  const secondPrincipal = rational(BigInt(t.p2) * scale);
  const firstRate = rational(t.r1);
  const secondRate = rational(t.r2);
  const firstTime = rational(t.t1);
  const secondTime = rational(t.t2);
  const commonInterest = simpleInterest(firstPrincipal, firstRate, firstTime);
  const rateOnly = divideRational(multiplyRational(firstPrincipal, firstRate), secondPrincipal);
  const timeOnly = divideRational(multiplyRational(firstRate, firstTime), secondTime);
  return {
    stem: `${actor} earns equal simple interest from two deposits in ${institution}. The first is ${money(firstPrincipal)} at ${rateText(firstRate)} for ${timeText(firstTime)}. The second is ${money(secondPrincipal)} for ${timeText(secondTime)} at an unknown rate. Find that rate.`,
    answerSemantic: "RATE_PERCENT",
    difficulty: "Hard",
    state: { values: { firstPrincipal, firstRate, firstTime, secondPrincipal, secondRate, secondTime, commonInterest } },
    solution: secondRate,
    candidates: [
      { value: secondRate, misconceptionId: "CORRECT", explanation: "Uses the complete equality P₁R₁T₁ = P₂R₂T₂." },
      { value: firstRate, misconceptionId: "ASSUME_EQUAL_RATE", explanation: "Assumes equal interest requires equal rates despite different principal and time." },
      { value: rateOnly, misconceptionId: "USE_RATE_RATIO_ONLY", explanation: "Adjusts for principal but ignores the duration ratio." },
      { value: timeOnly, misconceptionId: "USE_DURATION_RATIO_ONLY", explanation: "Adjusts for time but ignores the principal ratio." },
    ],
    explanation: {
      mainRule: "Equal simple interests imply P₁R₁T₁ = P₂R₂T₂.",
      workedSteps: [
        raw`First interest: $$I_1=\frac{${formatExact(firstPrincipal)}\times${formatExact(firstRate)}\times${formatExact(firstTime)}}{100}=${formatExact(commonInterest)}$$`,
        raw`Second interest: $$I_2=\frac{${formatExact(secondPrincipal)}\times R_2\times${formatExact(secondTime)}}{100}$$`,
        raw`Set them equal: $$${formatExact(commonInterest)}=\frac{${formatExact(secondPrincipal)}\times R_2\times${formatExact(secondTime)}}{100}$$`,
        raw`$$R_2=\frac{${formatExact(commonInterest)}\times100}{${formatExact(secondPrincipal)}\times${formatExact(secondTime)}}=${formatExact(secondRate)}\%$$`,
      ],
      examShortcut: raw`$$R_2=\frac{P_1R_1T_1}{P_2T_2}=${formatExact(secondRate)}\%$$`,
      verification: `The recovered second rate gives ${money(commonInterest)}, exactly equal to the first deposit's interest.`,
      conclusion: `The second annual rate is ${rateText(secondRate)}.`,
    },
  };
}

const EQUAL_TIME_TEMPLATES = [
  { p1: 6000, r1: 8, t1: 2, p2: 8000, r2: 4, t2: 3 },
  { p1: 8000, r1: 9, t1: 2, p2: 6000, r2: 8, t2: 3 },
  { p1: 9000, r1: 10, t1: 2, p2: 12000, r2: 5, t2: 3 },
] as const;

function buildEqualInterestDuration(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const t = pick(EQUAL_TIME_TEMPLATES, seed, "template");
  const scale = BigInt(pick([1, 2, 3], seed, "scale"));
  const firstPrincipal = rational(BigInt(t.p1) * scale);
  const secondPrincipal = rational(BigInt(t.p2) * scale);
  const firstRate = rational(t.r1);
  const secondRate = rational(t.r2);
  const firstTime = rational(t.t1);
  const secondTime = rational(t.t2);
  const commonInterest = simpleInterest(firstPrincipal, firstRate, firstTime);
  const rateOnly = divideRational(multiplyRational(firstRate, firstTime), secondRate);
  const principalOnly = divideRational(multiplyRational(firstPrincipal, firstTime), secondPrincipal);
  return {
    stem: `${actor} earns equal simple interest from ${money(firstPrincipal)} at ${rateText(firstRate)} for ${timeText(firstTime)} and ${money(secondPrincipal)} at ${rateText(secondRate)} for an unknown period in ${institution}. Find the second period.`,
    answerSemantic: "TIME_YEARS",
    difficulty: "Hard",
    state: { values: { firstPrincipal, firstRate, firstTime, secondPrincipal, secondRate, secondTime, commonInterest } },
    solution: secondTime,
    candidates: [
      { value: secondTime, misconceptionId: "CORRECT", explanation: "Uses principal, rate and time in the equal-interest equation." },
      { value: firstTime, misconceptionId: "ASSUME_EQUAL_DURATION", explanation: "Assumes equal interest requires equal time." },
      { value: rateOnly, misconceptionId: "USE_RATE_RATIO_ONLY", explanation: "Uses only the rate ratio and ignores the different principals." },
      { value: principalOnly, misconceptionId: "USE_DURATION_RATIO_ONLY", explanation: "Uses only the principal ratio and ignores the rate difference." },
    ],
    explanation: {
      mainRule: "Equal interest requires equality of P × R × T; solve that equality for the unknown duration.",
      workedSteps: [
        raw`$$I_1=\frac{${formatExact(firstPrincipal)}\times${formatExact(firstRate)}\times${formatExact(firstTime)}}{100}=${formatExact(commonInterest)}$$`,
        raw`$$I_2=\frac{${formatExact(secondPrincipal)}\times${formatExact(secondRate)}\times T_2}{100}$$`,
        raw`Set equal: $$${formatExact(commonInterest)}=\frac{${formatExact(secondPrincipal)}\times${formatExact(secondRate)}\times T_2}{100}$$`,
        raw`$$T_2=\frac{${formatExact(commonInterest)}\times100}{${formatExact(secondPrincipal)}\times${formatExact(secondRate)}}=${formatExact(secondTime)}$$`,
      ],
      examShortcut: raw`$$T_2=\frac{P_1R_1T_1}{P_2R_2}=${formatExact(secondTime)}$$`,
      verification: `The second deposit earns ${money(commonInterest)} over ${timeText(secondTime)}, matching the first.`,
      conclusion: `The second period is ${timeText(secondTime)}.`,
    },
  };
}

function buildOriginalRate(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const principal = rational(pick([5000, 8000, 10000, 12000], seed, "principal"));
  const oldRate = rational(pick([4, 5, 6, 8], seed, "old-rate"));
  const gap = rational(pick([2, 3, 4], seed, "gap"));
  const newRate = addRational(oldRate, gap);
  const time = rational(pick([1, 2, 3], seed, "time"));
  const extraInterest = simpleInterest(principal, gap, time);
  const addedWrong = addRational(newRate, gap);
  return {
    stem: `${actor} moves ${money(principal)} in ${institution} to a new simple-interest rate of ${rateText(newRate)} for ${timeText(time)} and earns ${money(extraInterest)} more interest than before. Find the original annual rate.`,
    answerSemantic: "RATE_PERCENT",
    difficulty: "Medium",
    state: { values: { principal, oldRate, gap, newRate, time, extraInterest } },
    solution: oldRate,
    candidates: [
      { value: oldRate, misconceptionId: "CORRECT", explanation: "Finds the rate increase from the extra interest and subtracts it from the new rate." },
      { value: newRate, misconceptionId: "RETURN_NEW_RATE", explanation: "Returns the stated new rate rather than the original rate." },
      { value: gap, misconceptionId: "RETURN_RATE_DIFFERENCE", explanation: "Returns only the rate increase." },
      { value: addedWrong, misconceptionId: "ADD_RATE_DIFFERENCE", explanation: "Adds the rate increase to the new rate instead of subtracting it." },
    ],
    explanation: {
      mainRule: "Convert the extra interest into the rate increase, then subtract that increase from the new rate.",
      workedSteps: [
        raw`Extra interest obeys $$\Delta I=\frac{P\times\Delta R\times T}{100}$$.`,
        raw`Substitute: $$${formatExact(extraInterest)}=\frac{${formatExact(principal)}\times\Delta R\times${formatExact(time)}}{100}$$`,
        raw`$$\Delta R=\frac{${formatExact(extraInterest)}\times100}{${formatExact(principal)}\times${formatExact(time)}}=${formatExact(gap)}\%$$`,
        raw`Original rate: $$R_{old}=R_{new}-\Delta R=${formatExact(newRate)}-${formatExact(gap)}=${formatExact(oldRate)}\%$$`,
      ],
      examShortcut: raw`$$R_{old}=R_{new}-\frac{100\Delta I}{PT}=${formatExact(oldRate)}\%$$`,
      verification: `Raising ${rateText(oldRate)} by ${rateText(gap)} gives ${rateText(newRate)} and increases the interest by ${money(extraInterest)}.`,
      conclusion: `The original annual rate was ${rateText(oldRate)}.`,
    },
  };
}

function buildRepaymentAmount(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const openingPrincipal = rational(pick([10000, 12000, 15000, 20000], seed, "opening"));
  const repaymentFraction = pick([rational(1, 5), rational(1, 4)], seed, "fraction");
  const repaymentAmount = multiplyRational(openingPrincipal, repaymentFraction);
  const remainingPrincipal = subtractRational(openingPrincipal, repaymentAmount);
  const rate = rational(pick([6, 8, 10, 12], seed, "rate"));
  const repaymentTime = rational(1);
  const horizon = rational(3);
  const ledgerContributions = buildIntCp002OutstandingBalanceContributions({
    openingPrincipal,
    annualRatePercent: rate,
    horizonYears: horizon,
    events: [{ eventId: "hidden-repayment", atYears: repaymentTime, kind: "PARTIAL_REPAYMENT", amount: repaymentAmount }],
  });
  const totalInterest = calculateIntCp002Ledger({ contributions: ledgerContributions, dayCountBasis: "NOT_APPLICABLE" }).totalInterest;
  const fullInterest = simpleInterest(openingPrincipal, rate, horizon);
  const savedInterest = subtractRational(fullInterest, totalInterest);
  const fullHorizonWrong = divideRational(multiplyRational(savedInterest, ONE_HUNDRED), multiplyRational(rate, horizon));
  const prePeriodWrong = divideRational(multiplyRational(savedInterest, ONE_HUNDRED), multiplyRational(rate, repaymentTime));
  return {
    stem: `${actor} owes ${money(openingPrincipal)} to ${institution} at ${rateText(rate)} simple interest for ${timeText(horizon)}. After ${timeText(repaymentTime)}, an unknown part of the principal is repaid. Interest then continues on the balance, and the total interest is ${money(totalInterest)}. Find the repayment amount.`,
    answerSemantic: "PRINCIPAL",
    difficulty: "Hard",
    state: { values: { openingPrincipal, repaymentAmount, remainingPrincipal, rate, repaymentTime, horizon, totalInterest } },
    solution: repaymentAmount,
    candidates: [
      { value: repaymentAmount, misconceptionId: "CORRECT", explanation: "Uses the interest saved only over the post-repayment period to recover the amount repaid." },
      { value: remainingPrincipal, misconceptionId: "USE_REMAINING_PRINCIPAL_AS_REPAYMENT", explanation: "Returns the balance left after repayment rather than the amount repaid." },
      { value: fullHorizonWrong, misconceptionId: "IGNORE_REPAYMENT_TIMING", explanation: "Spreads the interest saving across the full loan horizon instead of only the period after repayment." },
      { value: prePeriodWrong, misconceptionId: "USE_PRE_REPAYMENT_DURATION", explanation: "Uses the period before repayment as the saving duration." },
    ],
    explanation: {
      mainRule: "Compare with interest on the unreduced principal; the saving equals repayment × rate × remaining time / 100.",
      workedSteps: [
        raw`Interest without repayment: $$I_{full}=\frac{${formatExact(openingPrincipal)}\times${formatExact(rate)}\times${formatExact(horizon)}}{100}=${formatExact(fullInterest)}$$`,
        raw`Interest saved: $$S=${formatExact(fullInterest)}-${formatExact(totalInterest)}=${formatExact(savedInterest)}$$`,
        raw`The repayment saves interest for $${formatExact(horizon)}-${formatExact(repaymentTime)}=${formatExact(subtractRational(horizon, repaymentTime))}$ years: $$${formatExact(savedInterest)}=\frac{X\times${formatExact(rate)}\times${formatExact(subtractRational(horizon, repaymentTime))}}{100}$$`,
        raw`$$X=\frac{${formatExact(savedInterest)}\times100}{${formatExact(rate)}\times${formatExact(subtractRational(horizon, repaymentTime))}}=${formatExact(repaymentAmount)}$$`,
      ],
      examShortcut: raw`$$X=\frac{100(I_{full}-I_{actual})}{R(H-t)}=${formatExact(repaymentAmount)}$$`,
      verification: `Repaying ${money(repaymentAmount)} leaves ${money(remainingPrincipal)}; reconstructing both balance segments gives ${money(totalInterest)}.`,
      conclusion: `The repayment amount is ${money(repaymentAmount)}.`,
    },
  };
}

function buildRepaymentTime(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const openingPrincipal = rational(pick([10000, 12000, 15000, 20000], seed, "opening"));
  const repaymentAmount = multiplyRational(openingPrincipal, pick([rational(1, 5), rational(1, 4)], seed, "fraction"));
  const rate = rational(pick([6, 8, 10, 12], seed, "rate"));
  const repaymentTime = rational(1);
  const horizon = rational(3);
  const contributions = buildIntCp002OutstandingBalanceContributions({
    openingPrincipal,
    annualRatePercent: rate,
    horizonYears: horizon,
    events: [{ eventId: "hidden-time", atYears: repaymentTime, kind: "PARTIAL_REPAYMENT", amount: repaymentAmount }],
  });
  const totalInterest = calculateIntCp002Ledger({ contributions, dayCountBasis: "NOT_APPLICABLE" }).totalInterest;
  const remainingDuration = subtractRational(horizon, repaymentTime);
  const equivalentNoRepaymentTime = divideRational(multiplyRational(totalInterest, ONE_HUNDRED), multiplyRational(openingPrincipal, rate));
  return {
    stem: `${actor} owes ${money(openingPrincipal)} to ${institution} at ${rateText(rate)} simple interest for a total horizon of ${timeText(horizon)}. A repayment of ${money(repaymentAmount)} is made at an unknown time, after which interest continues on the balance. If total interest is ${money(totalInterest)}, when was the repayment made?`,
    answerSemantic: "TIME_YEARS",
    difficulty: "Hard",
    state: { values: { openingPrincipal, repaymentAmount, rate, repaymentTime, horizon, totalInterest } },
    solution: repaymentTime,
    candidates: [
      { value: repaymentTime, misconceptionId: "CORRECT", explanation: "Solves the two balance segments for the event time." },
      { value: remainingDuration, misconceptionId: "USE_PRE_REPAYMENT_DURATION", explanation: "Returns the duration after repayment instead of the time at which repayment occurred." },
      { value: horizon, misconceptionId: "IGNORE_REPAYMENT_TIMING", explanation: "Places the repayment at the end, which gives no interest saving." },
      { value: equivalentNoRepaymentTime, misconceptionId: "USE_FULL_HORIZON_FOR_REDUCED_BALANCE", explanation: "Treats the total interest as if the original principal alone ran for one equivalent duration." },
    ],
    explanation: {
      mainRule: "Write interest on the original balance before the event and on the reduced balance after it, then solve for the event time.",
      workedSteps: [
        raw`Remaining principal: $$P_2=${formatExact(openingPrincipal)}-${formatExact(repaymentAmount)}=${formatExact(subtractRational(openingPrincipal, repaymentAmount))}$$`,
        raw`Let repayment time be $t$. Then $$I=\frac{${formatExact(openingPrincipal)}\times${formatExact(rate)}\times t}{100}+\frac{${formatExact(subtractRational(openingPrincipal, repaymentAmount))}\times${formatExact(rate)}\times(${formatExact(horizon)}-t)}{100}$$`,
        raw`Substitute total interest: $$${formatExact(totalInterest)}=\frac{${formatExact(openingPrincipal)}\times${formatExact(rate)}\times t+${formatExact(subtractRational(openingPrincipal, repaymentAmount))}\times${formatExact(rate)}\times(${formatExact(horizon)}-t)}{100}$$`,
        raw`Expanding and isolating gives $$t=${formatExact(repaymentTime)}$$ year.`,
      ],
      examShortcut: raw`Use interest saving: $$I_{full}-I_{actual}=\frac{X R(H-t)}{100}$$, hence $$t=H-\frac{100(I_{full}-I_{actual})}{XR}=${formatExact(repaymentTime)}$$.`,
      verification: `Using repayment at ${timeText(repaymentTime)} reconstructs the exact total interest ${money(totalInterest)}.`,
      conclusion: `The repayment was made after ${timeText(repaymentTime)}.`,
    },
  };
}

function buildLendingRate(seed: string): BuiltQuestion {
  const { actor } = context(seed);
  const principal = rational(pick([5000, 8000, 10000, 12000], seed, "principal"));
  const borrowRate = rational(pick([4, 5, 6, 8], seed, "borrow-rate"));
  const spread = rational(pick([2, 3, 4], seed, "spread"));
  const lendingRate = addRational(borrowRate, spread);
  const time = rational(pick([1, 2, 3], seed, "time"));
  const netGain = simpleInterest(principal, spread, time);
  const rateSum = addRational(borrowRate, lendingRate);
  return {
    stem: `${actor} borrows ${money(principal)} at ${rateText(borrowRate)} per annum simple interest and lends it for the same ${timeText(time)}. The net interest gain is ${money(netGain)}. Find the lending rate.`,
    answerSemantic: "RATE_PERCENT",
    difficulty: "Medium",
    state: { values: { principal, borrowRate, spread, lendingRate, time, netGain } },
    solution: lendingRate,
    candidates: [
      { value: lendingRate, misconceptionId: "CORRECT", explanation: "Converts the net gain into the rate spread and adds that spread to the borrowing rate." },
      { value: borrowRate, misconceptionId: "RETURN_BORROWING_RATE", explanation: "Returns the cost rate instead of the lending rate." },
      { value: spread, misconceptionId: "RETURN_RATE_DIFFERENCE", explanation: "Returns only the rate spread represented by the net gain." },
      { value: rateSum, misconceptionId: "USE_SUM_OF_RATES", explanation: "Adds the full borrowing and lending rates, double-counting the borrowing rate." },
    ],
    explanation: {
      mainRule: "Net gain comes from the lending-minus-borrowing rate spread; recover the spread and add it to the borrowing rate.",
      workedSteps: [
        raw`$$G=\frac{P(R_l-R_b)T}{100}$$`,
        raw`$$${formatExact(netGain)}=\frac{${formatExact(principal)}\times(R_l-${formatExact(borrowRate)})\times${formatExact(time)}}{100}$$`,
        raw`Rate spread: $$R_l-R_b=\frac{${formatExact(netGain)}\times100}{${formatExact(principal)}\times${formatExact(time)}}=${formatExact(spread)}\%$$`,
        raw`$$R_l=${formatExact(borrowRate)}+${formatExact(spread)}=${formatExact(lendingRate)}\%$$`,
      ],
      examShortcut: raw`$$R_l=R_b+\frac{100G}{PT}=${formatExact(lendingRate)}\%$$`,
      verification: `The spread ${rateText(spread)} on ${money(principal)} for ${timeText(time)} produces the stated net gain ${money(netGain)}.`,
      conclusion: `The lending rate is ${rateText(lendingRate)}.`,
    },
  };
}

function buildDayCountMissingDays(seed: string): BuiltQuestion {
  const { actor, institution } = context(seed);
  const actualBasis = hash(`${seed}:basis`) % 2 === 0;
  const denominator = rational(actualBasis ? 365 : 360);
  const days = rational(actualBasis ? 73 : 72);
  const principal = rational((actualBasis ? 7300 : 7200) * pick([1, 2, 3], seed, "scale"));
  const rate = rational(pick([5, 10], seed, "rate"));
  const interest = simpleInterest(principal, rate, divideRational(days, denominator));
  const wrongBasisDays = divideRational(
    multiplyRational(days, rational(actualBasis ? 360 : 365)),
    denominator,
  );
  const halfDays = divideRational(days, rational(2));
  const monthLikeDays = divideRational(days, rational(12));
  const basisLabel = actualBasis ? "365-day year" : "360-day commercial year";
  return {
    stem: `${actor} deposits ${money(principal)} in ${institution} at ${rateText(rate)} per annum simple interest. Using the stated ${basisLabel}, the interest is ${money(interest)}. For how many days was the money deposited?`,
    answerSemantic: "DAYS",
    difficulty: "Medium",
    state: { values: { principal, rate, interest, days, dayCountDenominator: denominator, basisLabel } },
    solution: days,
    candidates: [
      { value: days, misconceptionId: "CORRECT", explanation: "Solves the day-based simple-interest equation using the declared denominator." },
      { value: wrongBasisDays, misconceptionId: actualBasis ? "USE_360_INSTEAD_OF_365" : "USE_365_INSTEAD_OF_360", explanation: `Uses the wrong annual day-count denominator instead of the stated ${basisLabel}.` },
      { value: halfDays, misconceptionId: "OMIT_DIVIDE_BY_DURATION", explanation: "Introduces an unsupported factor of one-half while converting the time." },
      { value: monthLikeDays, misconceptionId: "TREAT_DAYS_AS_MONTHS", explanation: "Divides by 12 as though the unknown time were a number of months." },
    ],
    explanation: {
      mainRule: "For a declared day-count basis, use T = days / denominator and solve the simple-interest equation for days.",
      workedSteps: [
        raw`$$I=\frac{P\times R\times days}{100\times${formatExact(denominator)}}$$`,
        raw`Substitute: $$${formatExact(interest)}=\frac{${formatExact(principal)}\times${formatExact(rate)}\times days}{100\times${formatExact(denominator)}}$$`,
        raw`$$days=\frac{${formatExact(interest)}\times100\times${formatExact(denominator)}}{${formatExact(principal)}\times${formatExact(rate)}}$$`,
        raw`$$days=${formatExact(days)}$$`,
      ],
      examShortcut: raw`$$days=\frac{100\times basis\times I}{PR}=${formatExact(days)}$$`,
      verification: `Using ${formatExact(days)}/${formatExact(denominator)} year reproduces the stated interest ${money(interest)}.`,
      conclusion: `The deposit period was ${formatAnswer(days, "DAYS")}.`,
    },
  };
}

function build(prototypeId: IntCp002Wave02PrototypeId, seed: string): BuiltQuestion {
  switch (prototypeId) {
    case "INT-CP002-W02-PIECEWISE-MISSING-RATE": return buildPiecewiseMissingRate(seed);
    case "INT-CP002-W02-PIECEWISE-MISSING-DURATION": return buildPiecewiseMissingDuration(seed);
    case "INT-CP002-W02-MULTI-MISSING-PRINCIPAL": return buildMultiMissingPrincipal(seed);
    case "INT-CP002-W02-MULTI-MISSING-RATE": return buildMultiMissingRate(seed);
    case "INT-CP002-W02-MULTI-MISSING-DURATION": return buildMultiMissingDuration(seed);
    case "INT-CP002-W02-MULTI-COMMON-RATE": return buildCommonRate(seed);
    case "INT-CP002-W02-EQUAL-INTEREST-MISSING-RATE": return buildEqualInterestRate(seed);
    case "INT-CP002-W02-EQUAL-INTEREST-MISSING-DURATION": return buildEqualInterestDuration(seed);
    case "INT-CP002-W02-COUNTERFACTUAL-ORIGINAL-RATE": return buildOriginalRate(seed);
    case "INT-CP002-W02-PARTIAL-REPAYMENT-AMOUNT": return buildRepaymentAmount(seed);
    case "INT-CP002-W02-PARTIAL-REPAYMENT-TIME": return buildRepaymentTime(seed);
    case "INT-CP002-W02-BORROW-LEND-LENDING-RATE": return buildLendingRate(seed);
    case "INT-CP002-W02-DAY-COUNT-MISSING-DAYS": return buildDayCountMissingDays(seed);
  }
}

export function generateIntCp002Wave02Question(request: {
  prototypeId: IntCp002Wave02PrototypeId;
  seed: string;
}): IntCp002Wave02Question {
  if (!(INT_CP002_WAVE02_PROTOTYPE_IDS as readonly string[]).includes(request.prototypeId)) {
    throw new Error(`Unknown CP-002 Wave 2 prototype '${String(request.prototypeId)}'.`);
  }
  const requestedSeed = request.seed.trim();
  if (!requestedSeed) throw new Error("Wave 2 generation requires a non-empty deterministic seed.");
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
