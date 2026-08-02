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
import type { IntCp002Contribution } from "./cp002-foundation/types";
import { assertIntCp002Wave01MathJaxIntegrity } from "./cp002-wave01-runtime-v2";
import {
  INT_CP002_WAVE03A_PROTOTYPE_IDS,
  type IntCp002Wave03aAnswerSemantic,
  type IntCp002Wave03aDifficulty,
  type IntCp002Wave03aExplanation,
  type IntCp002Wave03aMisconceptionId,
  type IntCp002Wave03aOptionAudit,
  type IntCp002Wave03aPrototypeId,
  type IntCp002Wave03aQuestion,
} from "./cp002-wave03a-types";
import { verifyIntCp002Wave03aCandidate } from "./cp002-wave03a-verifier";

const ZERO = rational(0);
const ONE_HUNDRED = rational(100);
const raw = String.raw;

interface Candidate {
  value: Rational;
  misconceptionId: IntCp002Wave03aMisconceptionId;
  explanation: string;
}

interface Built {
  stem: string;
  answerSemantic: IntCp002Wave03aAnswerSemantic;
  difficulty: IntCp002Wave03aDifficulty;
  values: Record<string, Rational | string | number>;
  solution: Rational;
  candidates: Candidate[];
  explanation: Omit<IntCp002Wave03aExplanation, "trapAnalysis">;
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
    actor: pick(["Anaya", "Dev", "Gurleen", "Ira", "Jatin", "Kirti", "Manav", "Prisha"], seed, "actor"),
    institution: pick([
      "a cooperative bank",
      "a post-office savings plan",
      "a regional rural bank",
      "a credit society",
      "a community savings fund",
    ], seed, "institution"),
  };
}

function si(principal: Rational, rate: Rational, time: Rational): Rational {
  return divideRational(
    multiplyRational(principal, multiplyRational(rate, time)),
    ONE_HUNDRED,
  );
}

function contribution(id: string, principal: Rational, rate: Rational, time: Rational): IntCp002Contribution {
  return {
    contributionId: id,
    principal,
    annualRatePercent: rate,
    durationYears: time,
    startsAtYears: ZERO,
    endsAtYears: time,
    sourceKind: "INDEPENDENT_DEPOSIT",
  };
}

function ledgerTotal(contributions: IntCp002Contribution[]): Rational {
  return calculateIntCp002Ledger({ contributions, dayCountBasis: "NOT_APPLICABLE" }).totalInterest;
}

function money(value: Rational): string {
  return formatMoney(value);
}

function time(value: Rational): string {
  return `${formatExact(value)} ${equalsRational(value, rational(1)) ? "year" : "years"}`;
}

function answerText(value: Rational, semantic: IntCp002Wave03aAnswerSemantic): string {
  if (semantic === "MONEY" || semantic === "PRINCIPAL") return money(value);
  if (semantic === "TIME_YEARS") return time(value);
  return `${value.numerator}:${value.denominator}`;
}

function rotate(
  candidates: Candidate[],
  semantic: IntCp002Wave03aAnswerSemantic,
  seed: string,
): {
  options: string[];
  optionAudit: IntCp002Wave03aOptionAudit[];
  correctIndex: number;
  trapAnalysis: IntCp002Wave03aExplanation["trapAnalysis"];
} {
  if (candidates.length !== 4) throw new Error("Wave 3A requires four candidates.");
  if (candidates.filter((item) => item.misconceptionId === "CORRECT").length !== 1) {
    throw new Error("Wave 3A requires exactly one correct candidate.");
  }
  const audited = candidates.map((candidate) => ({
    text: answerText(candidate.value, semantic),
    value: candidate.value,
    misconceptionId: candidate.misconceptionId,
    explanation: candidate.explanation,
  }));
  if (new Set(audited.map((item) => item.text)).size !== 4) {
    throw new Error("Wave 3A formatted-option collision.");
  }
  const shift = hash(`${seed}:option-position`) % 4;
  const rotated = audited.map((_item, index) => audited[(index + shift) % 4]!);
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
        misconceptionId: item.misconceptionId as Exclude<IntCp002Wave03aMisconceptionId, "CORRECT">,
        explanation: item.explanation,
      })),
  };
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function learnerText(question: IntCp002Wave03aQuestion): string {
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
  prototypeId: IntCp002Wave03aPrototypeId,
  requestedSeed: string,
  effectiveSeed: string,
  attempts: number,
  built: Built,
): IntCp002Wave03aQuestion {
  const optionShape = rotate(built.candidates, built.answerSemantic, effectiveSeed);
  const question: IntCp002Wave03aQuestion = {
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-002",
    waveId: "INT-CP-002-WAVE03A-EDGE-RUNTIME",
    prototypeId,
    permanentQlId: null,
    frozenSolveContractId: null,
    seed: requestedSeed,
    effectiveSeed,
    generationAttempts: attempts,
    language: "en",
    questionLanguageId: "en-IN",
    answerSemantic: built.answerSemantic,
    difficulty: built.difficulty,
    stem: built.stem,
    state: { values: built.values },
    solution: built.solution,
    options: optionShape.options,
    optionAudit: optionShape.optionAudit,
    correctIndex: optionShape.correctIndex,
    explanation: { ...built.explanation, trapAnalysis: optionShape.trapAnalysis },
    mathematicalFingerprint: `${prototypeId}|${stable(built.values)}|${rationalKey(built.solution)}`,
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
  let accepted = 0;
  for (const option of question.optionAudit) {
    const verifies = verifyIntCp002Wave03aCandidate(question, option.value);
    if (verifies) accepted += 1;
    if (option.misconceptionId === "CORRECT" && !verifies) errors.push("Correct option failed independent verification.");
    if (option.misconceptionId !== "CORRECT" && verifies) errors.push(`Wrong option ${option.misconceptionId} passed independent verification.`);
  }
  if (accepted !== 1) errors.push(`Independent verifier accepted ${accepted} options.`);
  if (question.explanation.workedSteps.length < 4) errors.push("Fewer than four worked steps.");
  if (!question.explanation.workedSteps.every((step) => /\d/u.test(step))) errors.push("A worked step lacks numerical values.");
  if (!question.explanation.conclusion.includes(question.options[question.correctIndex]!)) errors.push("Conclusion omits displayed answer.");
  if (question.explanation.trapAnalysis.length !== 3) errors.push("Wrong-option analysis incomplete.");
  try {
    assertIntCp002Wave01MathJaxIntegrity(learnerText(question), `${prototypeId}/${requestedSeed}`);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
  if (/<sub>Trace:|INT-QL-|INT-CP002-W03A-|requestedSeed|effectiveSeed|generationAttempts|FIND_/u.test(learnerText(question))) {
    errors.push("Internal metadata leaked into learner text.");
  }
  question.validation = { ok: errors.length === 0, errors };
  if (!question.validation.ok) throw new Error(errors.join("; "));
  return question;
}

function buildPiecewiseMissingPrincipal(seed: string): Built {
  const { actor, institution } = context(seed);
  const principal = rational(pick([6000, 8000, 10000, 12000], seed, "p"));
  const r1 = rational(pick([4, 5, 6], seed, "r1"));
  const r2 = addRational(r1, rational(pick([2, 3, 4], seed, "gap")));
  const t1 = rational(1);
  const t2 = rational(pick([2, 3], seed, "t2"));
  const totalInterest = addRational(si(principal, r1, t1), si(principal, r2, t2));
  const ignoreSecond = divideRational(multiplyRational(totalInterest, ONE_HUNDRED), multiplyRational(r1, t1));
  const latestAll = divideRational(multiplyRational(totalInterest, ONE_HUNDRED), multiplyRational(r2, addRational(t1, t2)));
  const combinedWrong = divideRational(multiplyRational(totalInterest, ONE_HUNDRED), multiplyRational(addRational(r1, r2), addRational(t1, t2)));
  return {
    stem: `${actor} earns ${money(totalInterest)} simple interest from one deposit in ${institution}. The rate is ${formatPercent(r1)} for ${time(t1)} and ${formatPercent(r2)} for the next ${time(t2)}. Find the principal.`,
    answerSemantic: "PRINCIPAL",
    difficulty: "Hard",
    values: { principal, firstRate: r1, secondRate: r2, firstTime: t1, secondTime: t2, totalInterest },
    solution: principal,
    candidates: [
      { value: principal, misconceptionId: "CORRECT", explanation: "Uses the sum of the two exact rate-time exposures." },
      { value: ignoreSecond, misconceptionId: "IGNORE_INTERVAL", explanation: "Attributes the total interest only to the first interval." },
      { value: latestAll, misconceptionId: "USE_SINGLE_RATE_FOR_ALL", explanation: "Applies the later rate to the complete duration." },
      { value: combinedWrong, misconceptionId: "USE_TOTAL_TIME_FOR_EACH_INTERVAL", explanation: "Multiplies the sum of rates by the sum of times, creating false cross-terms." },
    ],
    explanation: {
      mainRule: "For one unchanged principal across intervals, add the rate-time exposures and solve the weighted interest equation for principal.",
      workedSteps: [
        raw`Weighted equation: $$I=\frac{P(R_1T_1+R_2T_2)}{100}$$`,
        raw`Substitute: $$${formatExact(totalInterest)}=\frac{P(${formatExact(r1)}\times${formatExact(t1)}+${formatExact(r2)}\times${formatExact(t2)})}{100}$$`,
        raw`Exposure total: $$${formatExact(r1)}\times${formatExact(t1)}+${formatExact(r2)}\times${formatExact(t2)}=${formatExact(addRational(multiplyRational(r1, t1), multiplyRational(r2, t2)))}$$`,
        raw`$$P=\frac{${formatExact(totalInterest)}\times100}{${formatExact(addRational(multiplyRational(r1, t1), multiplyRational(r2, t2)))}}=${formatExact(principal)}$$`,
      ],
      examShortcut: raw`$$P=\frac{100I}{\sum RT}=${formatExact(principal)}$$`,
      verification: `The recovered principal produces ${money(si(principal, r1, t1))} and ${money(si(principal, r2, t2))}; their sum is ${money(totalInterest)}.`,
      conclusion: `The principal is ${money(principal)}.`,
    },
  };
}

function buildThreeIntervals(seed: string): Built {
  const { actor, institution } = context(seed);
  const p = rational(pick([6000, 8000, 10000, 12000], seed, "p"));
  const r1 = rational(pick([4, 5, 6], seed, "r1"));
  const r2 = addRational(r1, rational(2));
  const r3 = addRational(r2, rational(2));
  const t1 = rational(1);
  const t2 = rational(1);
  const t3 = rational(pick([1, 2], seed, "t3"));
  const i1 = si(p, r1, t1);
  const i2 = si(p, r2, t2);
  const i3 = si(p, r3, t3);
  const solution = addRational(addRational(i1, i2), i3);
  const ignoreThird = addRational(i1, i2);
  const latestAll = si(p, r3, addRational(addRational(t1, t2), t3));
  const falseCross = divideRational(
    multiplyRational(p, multiplyRational(addRational(addRational(r1, r2), r3), addRational(addRational(t1, t2), t3))),
    ONE_HUNDRED,
  );
  return {
    stem: `${actor} deposits ${money(p)} in ${institution}. It earns ${formatPercent(r1)} for ${time(t1)}, ${formatPercent(r2)} for the next ${time(t2)}, and ${formatPercent(r3)} for the final ${time(t3)}, all at simple interest. Find the total interest.`,
    answerSemantic: "MONEY",
    difficulty: "Medium",
    values: { principal: p, firstRate: r1, secondRate: r2, thirdRate: r3, firstTime: t1, secondTime: t2, thirdTime: t3 },
    solution,
    candidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: "Adds all three interval contributions." },
      { value: ignoreThird, misconceptionId: "IGNORE_INTERVAL", explanation: "Stops after the first two intervals." },
      { value: latestAll, misconceptionId: "USE_SINGLE_RATE_FOR_ALL", explanation: "Applies the final rate to the whole duration." },
      { value: falseCross, misconceptionId: "USE_TOTAL_TIME_FOR_EACH_INTERVAL", explanation: "Uses (sum of rates) × (sum of times), creating non-existent cross-terms." },
    ],
    explanation: {
      mainRule: "Calculate the simple interest for each rate interval and add all three contributions.",
      workedSteps: [
        raw`$$I_1=\frac{${formatExact(p)}\times${formatExact(r1)}\times${formatExact(t1)}}{100}=${formatExact(i1)}$$`,
        raw`$$I_2=\frac{${formatExact(p)}\times${formatExact(r2)}\times${formatExact(t2)}}{100}=${formatExact(i2)}$$`,
        raw`$$I_3=\frac{${formatExact(p)}\times${formatExact(r3)}\times${formatExact(t3)}}{100}=${formatExact(i3)}$$`,
        raw`$$I=I_1+I_2+I_3=${formatExact(i1)}+${formatExact(i2)}+${formatExact(i3)}=${formatExact(solution)}$$`,
      ],
      examShortcut: raw`$$I=\frac{P(R_1T_1+R_2T_2+R_3T_3)}{100}=${formatExact(solution)}$$`,
      verification: `${money(i1)} + ${money(i2)} + ${money(i3)} = ${money(solution)}.`,
      conclusion: `The total interest is ${money(solution)}.`,
    },
  };
}

interface ThreeDepositState {
  p1: Rational; p2: Rational; p3: Rational;
  r1: Rational; r2: Rational; r3: Rational;
  t1: Rational; t2: Rational; t3: Rational;
  i1: Rational; i2: Rational; i3: Rational; totalInterest: Rational;
}

function threeDepositState(seed: string): ThreeDepositState {
  const p1 = rational(pick([3000, 4000, 5000], seed, "p1"));
  const p2 = rational(pick([6000, 7000, 8000], seed, "p2"));
  const p3 = rational(pick([9000, 10000, 12000], seed, "p3"));
  const r1 = rational(pick([5, 6], seed, "r1"));
  const r2 = rational(pick([7, 8], seed, "r2"));
  const r3 = rational(pick([9, 10, 12], seed, "r3"));
  const t1 = rational(1);
  const t2 = rational(2);
  const t3 = rational(pick([1, 3], seed, "t3"));
  const i1 = si(p1, r1, t1);
  const i2 = si(p2, r2, t2);
  const i3 = si(p3, r3, t3);
  return { p1, p2, p3, r1, r2, r3, t1, t2, t3, i1, i2, i3, totalInterest: addRational(addRational(i1, i2), i3) };
}

function buildThreeDepositsDirect(seed: string): Built {
  const { actor, institution } = context(seed);
  const s = threeDepositState(seed);
  const ignoreThird = addRational(s.i1, s.i2);
  const totalP = addRational(addRational(s.p1, s.p2), s.p3);
  const firstAll = si(totalP, s.r1, s.t1);
  const totalTimeAll = divideRational(
    multiplyRational(totalP, multiplyRational(addRational(addRational(s.r1, s.r2), s.r3), addRational(addRational(s.t1, s.t2), s.t3))),
    ONE_HUNDRED,
  );
  return {
    stem: `${actor} makes three simple-interest deposits in ${institution}: ${money(s.p1)} at ${formatPercent(s.r1)} for ${time(s.t1)}, ${money(s.p2)} at ${formatPercent(s.r2)} for ${time(s.t2)}, and ${money(s.p3)} at ${formatPercent(s.r3)} for ${time(s.t3)}. Find the combined interest.`,
    answerSemantic: "MONEY",
    difficulty: "Medium",
    values: { firstPrincipal: s.p1, secondPrincipal: s.p2, thirdPrincipal: s.p3, firstRate: s.r1, secondRate: s.r2, thirdRate: s.r3, firstTime: s.t1, secondTime: s.t2, thirdTime: s.t3 },
    solution: s.totalInterest,
    candidates: [
      { value: s.totalInterest, misconceptionId: "CORRECT", explanation: "Adds the three independent interest contributions." },
      { value: ignoreThird, misconceptionId: "IGNORE_ONE_DEPOSIT", explanation: "Omits the third deposit." },
      { value: firstAll, misconceptionId: "USE_FIRST_TERMS_FOR_ALL", explanation: "Adds all principals and applies only the first deposit's rate and time." },
      { value: totalTimeAll, misconceptionId: "USE_TOTAL_TIME_FOR_EACH_INTERVAL", explanation: "Combines all rates and times as though every principal had every exposure." },
    ],
    explanation: {
      mainRule: "Each deposit has its own principal, rate and time; calculate and add all three interests.",
      workedSteps: [
        raw`$$I_1=\frac{${formatExact(s.p1)}\times${formatExact(s.r1)}\times${formatExact(s.t1)}}{100}=${formatExact(s.i1)}$$`,
        raw`$$I_2=\frac{${formatExact(s.p2)}\times${formatExact(s.r2)}\times${formatExact(s.t2)}}{100}=${formatExact(s.i2)}$$`,
        raw`$$I_3=\frac{${formatExact(s.p3)}\times${formatExact(s.r3)}\times${formatExact(s.t3)}}{100}=${formatExact(s.i3)}$$`,
        raw`$$I=${formatExact(s.i1)}+${formatExact(s.i2)}+${formatExact(s.i3)}=${formatExact(s.totalInterest)}$$`,
      ],
      examShortcut: raw`$$I=\frac{P_1R_1T_1+P_2R_2T_2+P_3R_3T_3}{100}=${formatExact(s.totalInterest)}$$`,
      verification: `${money(s.i1)} + ${money(s.i2)} + ${money(s.i3)} = ${money(s.totalInterest)}.`,
      conclusion: `The combined interest is ${money(s.totalInterest)}.`,
    },
  };
}

function buildThreeDepositMissingPrincipal(seed: string): Built {
  const { actor, institution } = context(seed);
  const s = threeDepositState(seed);
  const known = addRational(s.i1, s.i2);
  const totalAsThird = divideRational(multiplyRational(s.totalInterest, ONE_HUNDRED), multiplyRational(s.r3, s.t3));
  const addKnown = divideRational(multiplyRational(addRational(s.totalInterest, known), ONE_HUNDRED), multiplyRational(s.r3, s.t3));
  const omitTime = divideRational(multiplyRational(s.i3, ONE_HUNDRED), s.r3);
  return {
    stem: `${actor} invests ${money(s.p1)} at ${formatPercent(s.r1)} for ${time(s.t1)}, ${money(s.p2)} at ${formatPercent(s.r2)} for ${time(s.t2)}, and an unknown third principal at ${formatPercent(s.r3)} for ${time(s.t3)} in ${institution}. The total interest is ${money(s.totalInterest)}. Find the third principal.`,
    answerSemantic: "PRINCIPAL",
    difficulty: "Hard",
    values: { firstPrincipal: s.p1, secondPrincipal: s.p2, thirdPrincipal: s.p3, firstRate: s.r1, secondRate: s.r2, thirdRate: s.r3, firstTime: s.t1, secondTime: s.t2, thirdTime: s.t3, totalInterest: s.totalInterest },
    solution: s.p3,
    candidates: [
      { value: s.p3, misconceptionId: "CORRECT", explanation: "Subtracts both known interests before solving the third contribution for principal." },
      { value: totalAsThird, misconceptionId: "USE_TOTAL_INTEREST_AS_MISSING_COMPONENT", explanation: "Treats the total interest as if the third deposit earned all of it." },
      { value: addKnown, misconceptionId: "SUBTRACT_KNOWN_INTEREST_WRONG_WAY", explanation: "Adds the two known interests to the total instead of subtracting them." },
      { value: omitTime, misconceptionId: "OMIT_DURATION_FACTOR", explanation: "Solves the third principal without dividing by its duration." },
    ],
    explanation: {
      mainRule: "Add the known contributions, remove them from the total, then invert the third simple-interest term.",
      workedSteps: [
        raw`Known interests: $$I_1=${formatExact(s.i1)},\qquad I_2=${formatExact(s.i2)}$$`,
        raw`Third interest: $$I_3=${formatExact(s.totalInterest)}-${formatExact(s.i1)}-${formatExact(s.i2)}=${formatExact(s.i3)}$$`,
        raw`$$${formatExact(s.i3)}=\frac{P_3\times${formatExact(s.r3)}\times${formatExact(s.t3)}}{100}$$`,
        raw`$$P_3=\frac{${formatExact(s.i3)}\times100}{${formatExact(s.r3)}\times${formatExact(s.t3)}}=${formatExact(s.p3)}$$`,
      ],
      examShortcut: raw`$$P_3=\frac{100I_{total}-P_1R_1T_1-P_2R_2T_2}{R_3T_3}=${formatExact(s.p3)}$$`,
      verification: `The recovered third principal earns ${money(s.i3)}; together the three interests equal ${money(s.totalInterest)}.`,
      conclusion: `The third principal is ${money(s.p3)}.`,
    },
  };
}

function buildSplitRatio(seed: string): Built {
  const { actor, institution } = context(seed);
  const ratio = pick([rational(2, 3), rational(3, 5), rational(4, 5)], seed, "ratio");
  const totalP = rational(pick([10000, 16000, 18000, 24000], seed, "total"));
  const firstP = divideRational(multiplyRational(totalP, ratio), addRational(ratio, rational(1)));
  const secondP = subtractRational(totalP, firstP);
  const r1 = rational(pick([5, 6, 8], seed, "r1"));
  const r2 = addRational(r1, rational(3));
  const t1 = rational(2);
  const t2 = rational(1);
  const totalInterest = addRational(si(firstP, r1, t1), si(secondP, r2, t2));
  const reverse = divideRational(rational(1), ratio);
  const rateRatio = divideRational(r2, r1);
  return {
    stem: `${actor} divides ${money(totalP)} between two deposits in ${institution}. The first earns ${formatPercent(r1)} for ${time(t1)}, the second earns ${formatPercent(r2)} for ${time(t2)}, and total interest is ${money(totalInterest)}. Find the ratio of the first principal to the second principal.`,
    answerSemantic: "RATIO",
    difficulty: "Hard",
    values: { totalPrincipal: totalP, firstPrincipal: firstP, secondPrincipal: secondP, firstRate: r1, secondRate: r2, firstTime: t1, secondTime: t2, totalInterest },
    solution: ratio,
    candidates: [
      { value: ratio, misconceptionId: "CORRECT", explanation: "Solves the split equation and reports first principal : second principal." },
      { value: reverse, misconceptionId: "REVERSE_RATIO", explanation: "Reports second principal : first principal." },
      { value: rational(1), misconceptionId: "ASSUME_EQUAL_SPLIT", explanation: "Assumes the total was divided equally." },
      { value: rateRatio, misconceptionId: "IGNORE_TIME_RATIO", explanation: "Uses only the two rates as the principal ratio." },
    ],
    explanation: {
      mainRule: "Let the first part be x and the second part be S − x; use the total-interest equation, then reduce x:(S−x).",
      workedSteps: [
        raw`Let first principal be $x$ and second principal be $${formatExact(totalP)}-x$.`,
        raw`$$\frac{x\times${formatExact(r1)}\times${formatExact(t1)}}{100}+\frac{(${formatExact(totalP)}-x)\times${formatExact(r2)}\times${formatExact(t2)}}{100}=${formatExact(totalInterest)}$$`,
        raw`Solving gives $$x=${formatExact(firstP)},\qquad ${formatExact(totalP)}-x=${formatExact(secondP)}$$`,
        raw`Ratio: $$${formatExact(firstP)}:${formatExact(secondP)}=${ratio.numerator}:${ratio.denominator}$$`,
      ],
      examShortcut: raw`Solve the weighted split once, then reduce $$x:(S-x)=${ratio.numerator}:${ratio.denominator}$$.`,
      verification: `${money(firstP)} and ${money(secondP)} produce the stated total interest ${money(totalInterest)}.`,
      conclusion: `The required ratio is ${ratio.numerator}:${ratio.denominator}.`,
    },
  };
}

function buildEqualInterestSplit(seed: string): Built {
  const { actor, institution } = context(seed);
  const totalP = rational(pick([10000, 12000, 15000, 18000], seed, "total"));
  const r1 = rational(pick([6, 8, 10], seed, "r1"));
  const t1 = rational(1);
  const r2 = rational(pick([4, 5], seed, "r2"));
  const t2 = rational(2);
  const c1 = multiplyRational(r1, t1);
  const c2 = multiplyRational(r2, t2);
  const firstP = divideRational(multiplyRational(totalP, c2), addRational(c1, c2));
  const secondP = subtractRational(totalP, firstP);
  const half = divideRational(totalP, rational(2));
  return {
    stem: `${actor} divides ${money(totalP)} between two simple-interest deposits in ${institution}. The first earns ${formatPercent(r1)} for ${time(t1)}, and the second earns ${formatPercent(r2)} for ${time(t2)}. If both parts earn equal interest, how much is placed in the first deposit?`,
    answerSemantic: "PRINCIPAL",
    difficulty: "Hard",
    values: { totalPrincipal: totalP, firstPrincipal: firstP, secondPrincipal: secondP, firstRate: r1, secondRate: r2, firstTime: t1, secondTime: t2 },
    solution: firstP,
    candidates: [
      { value: firstP, misconceptionId: "CORRECT", explanation: "Uses xR₁T₁ = (S−x)R₂T₂ together with the total-principal constraint." },
      { value: secondP, misconceptionId: "REVERSE_RATIO", explanation: "Returns the complementary second principal." },
      { value: half, misconceptionId: "ASSUME_EQUAL_SPLIT", explanation: "Assumes equal interest means equal principal." },
      { value: totalP, misconceptionId: "RETURN_TOTAL_PRINCIPAL", explanation: "Returns the entire available capital." },
    ],
    explanation: {
      mainRule: "Equal interest means the two principal-rate-time products are equal, while the two principals sum to the total.",
      workedSteps: [
        raw`Let first principal be $x$; second principal is $${formatExact(totalP)}-x$.`,
        raw`Equal interest: $$x\times${formatExact(r1)}\times${formatExact(t1)}=(${formatExact(totalP)}-x)\times${formatExact(r2)}\times${formatExact(t2)}$$`,
        raw`$$${formatExact(c1)}x=${formatExact(multiplyRational(totalP, c2))}-${formatExact(c2)}x,\qquad ${formatExact(addRational(c1, c2))}x=${formatExact(multiplyRational(totalP, c2))}$$`,
        raw`$$x=\frac{${formatExact(multiplyRational(totalP, c2))}}{${formatExact(addRational(c1, c2))}}=${formatExact(firstP)}$$`,
      ],
      examShortcut: raw`$$x=\frac{S(R_2T_2)}{R_1T_1+R_2T_2}=${formatExact(firstP)}$$`,
      verification: `Both ${money(firstP)} and ${money(secondP)} earn the same simple interest under their stated terms.`,
      conclusion: `The first deposit is ${money(firstP)}.`,
    },
  };
}

function buildTimeChangeDifference(seed: string): Built {
  const { actor, institution } = context(seed);
  const p = rational(pick([5000, 8000, 10000, 12000], seed, "p"));
  const r = rational(pick([5, 6, 8, 10], seed, "r"));
  const oldT = rational(1);
  const newT = rational(pick([2, 3, 4], seed, "new"));
  const oldI = si(p, r, oldT);
  const newI = si(p, r, newT);
  const solution = subtractRational(newI, oldI);
  const addedDuration = si(p, r, addRational(oldT, newT));
  return {
    stem: `${actor} extends a ${money(p)} simple-interest deposit in ${institution} from ${time(oldT)} to ${time(newT)} at ${formatPercent(r)} per annum. How much additional interest is earned?`,
    answerSemantic: "MONEY",
    difficulty: "Medium",
    values: { principal: p, rate: r, oldTime: oldT, newTime: newT },
    solution,
    candidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: "Subtracts the old full interest from the new full interest." },
      { value: newI, misconceptionId: "RETURN_NEW_TOTAL", explanation: "Returns the total interest for the longer period." },
      { value: oldI, misconceptionId: "RETURN_OLD_TOTAL", explanation: "Returns the original interest." },
      { value: addedDuration, misconceptionId: "ADD_DURATIONS", explanation: "Adds the two durations instead of taking their difference." },
    ],
    explanation: {
      mainRule: "With principal and rate unchanged, extra interest is based only on the additional time.",
      workedSteps: [
        raw`Old interest: $$I_1=\frac{${formatExact(p)}\times${formatExact(r)}\times${formatExact(oldT)}}{100}=${formatExact(oldI)}$$`,
        raw`New interest: $$I_2=\frac{${formatExact(p)}\times${formatExact(r)}\times${formatExact(newT)}}{100}=${formatExact(newI)}$$`,
        raw`$$\Delta I=I_2-I_1=${formatExact(newI)}-${formatExact(oldI)}$$`,
        raw`$$\Delta I=${formatExact(solution)}$$`,
      ],
      examShortcut: raw`$$\Delta I=\frac{PR(T_2-T_1)}{100}=${formatExact(solution)}$$`,
      verification: `${money(newI)} − ${money(oldI)} = ${money(solution)}.`,
      conclusion: `The additional interest is ${money(solution)}.`,
    },
  };
}

function buildOriginalDuration(seed: string): Built {
  const { actor, institution } = context(seed);
  const p = rational(pick([5000, 8000, 10000, 12000], seed, "p"));
  const r = rational(pick([5, 6, 8, 10], seed, "r"));
  const oldT = rational(1);
  const deltaT = rational(pick([1, 2], seed, "delta"));
  const newT = addRational(oldT, deltaT);
  const extraInterest = si(p, r, deltaT);
  return {
    stem: `${actor} keeps ${money(p)} in ${institution} at ${formatPercent(r)} simple interest. After extending the deposit to ${time(newT)}, the interest increases by ${money(extraInterest)}. Find the original duration.`,
    answerSemantic: "TIME_YEARS",
    difficulty: "Hard",
    values: { principal: p, rate: r, oldTime: oldT, newTime: newT, extraInterest },
    solution: oldT,
    candidates: [
      { value: oldT, misconceptionId: "CORRECT", explanation: "Recovers the added duration from the extra interest and subtracts it from the new duration." },
      { value: newT, misconceptionId: "RETURN_NEW_DURATION", explanation: "Returns the stated extended duration." },
      { value: deltaT, misconceptionId: "RETURN_DURATION_CHANGE", explanation: "Returns only the added duration." },
      { value: addRational(newT, deltaT), misconceptionId: "ADD_DURATION_CHANGE", explanation: "Adds the recovered extension to the new duration." },
    ],
    explanation: {
      mainRule: "Convert the extra interest into added time, then subtract that added time from the new duration.",
      workedSteps: [
        raw`$$\Delta I=\frac{PR\Delta T}{100}$$`,
        raw`$$${formatExact(extraInterest)}=\frac{${formatExact(p)}\times${formatExact(r)}\times\Delta T}{100}$$`,
        raw`$$\Delta T=\frac{${formatExact(extraInterest)}\times100}{${formatExact(p)}\times${formatExact(r)}}=${formatExact(deltaT)}$$`,
        raw`$$T_{old}=T_{new}-\Delta T=${formatExact(newT)}-${formatExact(deltaT)}=${formatExact(oldT)}$$`,
      ],
      examShortcut: raw`$$T_{old}=T_{new}-\frac{100\Delta I}{PR}=${formatExact(oldT)}$$`,
      verification: `Extending ${time(oldT)} by ${time(deltaT)} gives ${time(newT)} and adds ${money(extraInterest)}.`,
      conclusion: `The original duration was ${time(oldT)}.`,
    },
  };
}

function buildTwoRepayments(seed: string): Built {
  const { actor, institution } = context(seed);
  const p = rational(pick([12000, 15000, 18000, 20000], seed, "p"));
  const r = rational(pick([6, 8, 10], seed, "r"));
  const h = rational(3);
  const t1 = rational(1);
  const t2 = rational(2);
  const a1 = divideRational(p, rational(4));
  const a2 = divideRational(p, rational(5));
  const contributions = buildIntCp002OutstandingBalanceContributions({
    openingPrincipal: p,
    annualRatePercent: r,
    horizonYears: h,
    events: [
      { eventId: "r1", atYears: t1, kind: "PARTIAL_REPAYMENT", amount: a1 },
      { eventId: "r2", atYears: t2, kind: "PARTIAL_REPAYMENT", amount: a2 },
    ],
  });
  const solution = ledgerTotal(contributions);
  const ignoreFirst = ledgerTotal(buildIntCp002OutstandingBalanceContributions({
    openingPrincipal: p,
    annualRatePercent: r,
    horizonYears: h,
    events: [{ eventId: "r2", atYears: t2, kind: "PARTIAL_REPAYMENT", amount: a2 }],
  }));
  const ignoreSecond = ledgerTotal(buildIntCp002OutstandingBalanceContributions({
    openingPrincipal: p,
    annualRatePercent: r,
    horizonYears: h,
    events: [{ eventId: "r1", atYears: t1, kind: "PARTIAL_REPAYMENT", amount: a1 }],
  }));
  const finalBalance = subtractRational(subtractRational(p, a1), a2);
  const bothFromStart = si(finalBalance, r, h);
  const seg = calculateIntCp002Ledger({ contributions, dayCountBasis: "NOT_APPLICABLE" }).contributions;
  return {
    stem: `${actor} owes ${money(p)} to ${institution} at ${formatPercent(r)} simple interest for ${time(h)}. ${money(a1)} is repaid after ${time(t1)}, and another ${money(a2)} after ${time(t2)}. Interest thereafter applies only to the outstanding balance. Find total interest.`,
    answerSemantic: "MONEY",
    difficulty: "Hard",
    values: { openingPrincipal: p, rate: r, horizon: h, firstRepaymentTime: t1, secondRepaymentTime: t2, firstRepaymentAmount: a1, secondRepaymentAmount: a2 },
    solution,
    candidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: "Uses three ordered outstanding-balance segments." },
      { value: ignoreFirst, misconceptionId: "IGNORE_FIRST_REPAYMENT", explanation: "Omits the first repayment." },
      { value: ignoreSecond, misconceptionId: "IGNORE_SECOND_REPAYMENT", explanation: "Omits the second repayment." },
      { value: bothFromStart, misconceptionId: "APPLY_BOTH_REPAYMENTS_FROM_START", explanation: "Uses the final reduced balance from time zero." },
    ],
    explanation: {
      mainRule: "Each repayment creates a new balance segment; calculate interest for all three ordered segments.",
      workedSteps: [
        raw`First segment: $$I_1=\frac{${formatExact(p)}\times${formatExact(r)}\times1}{100}=${formatExact(seg[0]!.interest)}$$`,
        raw`After first repayment, balance is $${formatExact(subtractRational(p, a1))}$, so $$I_2=${formatExact(seg[1]!.interest)}$$ for the next year.`,
        raw`After second repayment, balance is $${formatExact(finalBalance)}$, so $$I_3=${formatExact(seg[2]!.interest)}$$ for the final year.`,
        raw`$$I=I_1+I_2+I_3=${formatExact(seg[0]!.interest)}+${formatExact(seg[1]!.interest)}+${formatExact(seg[2]!.interest)}=${formatExact(solution)}$$`,
      ],
      examShortcut: "Draw a three-segment balance timeline and multiply each balance by the common annual rate for its one-year segment.",
      verification: `${money(seg[0]!.interest)} + ${money(seg[1]!.interest)} + ${money(seg[2]!.interest)} = ${money(solution)}.`,
      conclusion: `The total interest is ${money(solution)}.`,
    },
  };
}

function buildBorrowLendPrincipal(seed: string): Built {
  const { actor } = context(seed);
  const p = rational(pick([5000, 8000, 10000, 12000], seed, "p"));
  const rb = rational(pick([4, 5, 6], seed, "rb"));
  const spread = rational(pick([2, 3, 4], seed, "spread"));
  const rl = addRational(rb, spread);
  const t = rational(pick([2, 3], seed, "t"));
  const gain = si(p, spread, t);
  const lendOnly = divideRational(multiplyRational(gain, ONE_HUNDRED), multiplyRational(rl, t));
  const borrowOnly = divideRational(multiplyRational(gain, ONE_HUNDRED), multiplyRational(rb, t));
  const omitTime = divideRational(multiplyRational(gain, ONE_HUNDRED), spread);
  return {
    stem: `${actor} borrows an unknown principal at ${formatPercent(rb)} simple interest and lends the same amount at ${formatPercent(rl)} for ${time(t)}. The net interest gain is ${money(gain)}. Find the principal.`,
    answerSemantic: "PRINCIPAL",
    difficulty: "Hard",
    values: { principal: p, borrowRate: rb, lendRate: rl, time: t, netGain: gain },
    solution: p,
    candidates: [
      { value: p, misconceptionId: "CORRECT", explanation: "Uses the lending-minus-borrowing rate spread." },
      { value: lendOnly, misconceptionId: "RETURN_RATE_SPREAD", explanation: "Treats net gain as gross lending interest." },
      { value: borrowOnly, misconceptionId: "RETURN_BORROWING_INTEREST", explanation: "Treats net gain as borrowing interest." },
      { value: omitTime, misconceptionId: "OMIT_DURATION_FACTOR", explanation: "Forgets to divide by the duration." },
    ],
    explanation: {
      mainRule: "Net gain is simple interest at the rate spread, so invert G = P(Rₗ−Rᵦ)T/100 for principal.",
      workedSteps: [
        raw`Rate spread: $$${formatExact(rl)}-${formatExact(rb)}=${formatExact(spread)}\%$$`,
        raw`$$${formatExact(gain)}=\frac{P\times${formatExact(spread)}\times${formatExact(t)}}{100}$$`,
        raw`$$P=\frac{${formatExact(gain)}\times100}{${formatExact(spread)}\times${formatExact(t)}}$$`,
        raw`$$P=${formatExact(p)}$$`,
      ],
      examShortcut: raw`$$P=\frac{100G}{(R_l-R_b)T}=${formatExact(p)}$$`,
      verification: `The rate spread on ${money(p)} for ${time(t)} gives net gain ${money(gain)}.`,
      conclusion: `The principal is ${money(p)}.`,
    },
  };
}

function buildBorrowLendDuration(seed: string): Built {
  const { actor } = context(seed);
  const p = rational(pick([5000, 8000, 10000, 12000], seed, "p"));
  const rb = rational(pick([4, 5, 6], seed, "rb"));
  const spread = rational(pick([2, 3, 4], seed, "spread"));
  const rl = addRational(rb, spread);
  const t = rational(pick([2, 3], seed, "t"));
  const gain = si(p, spread, t);
  const lendOnly = divideRational(multiplyRational(gain, ONE_HUNDRED), multiplyRational(p, rl));
  const borrowOnly = divideRational(multiplyRational(gain, ONE_HUNDRED), multiplyRational(p, rb));
  const omitHundred = divideRational(gain, multiplyRational(p, spread));
  return {
    stem: `${actor} borrows ${money(p)} at ${formatPercent(rb)} and lends it at ${formatPercent(rl)}, both at simple interest. A net gain of ${money(gain)} is earned. For how long was the money lent?`,
    answerSemantic: "TIME_YEARS",
    difficulty: "Hard",
    values: { principal: p, borrowRate: rb, lendRate: rl, time: t, netGain: gain },
    solution: t,
    candidates: [
      { value: t, misconceptionId: "CORRECT", explanation: "Uses the rate spread and solves for time." },
      { value: lendOnly, misconceptionId: "RETURN_RATE_SPREAD", explanation: "Uses the lending rate instead of the spread." },
      { value: borrowOnly, misconceptionId: "RETURN_BORROWING_INTEREST", explanation: "Uses the borrowing rate instead of the spread." },
      { value: omitHundred, misconceptionId: "RETURN_ONE_YEAR_EQUIVALENT", explanation: "Treats the percentage rate as a decimal without the factor 100." },
    ],
    explanation: {
      mainRule: "Net gain is interest at the rate spread; invert that simple-interest expression for time.",
      workedSteps: [
        raw`Rate spread: $$R_l-R_b=${formatExact(rl)}-${formatExact(rb)}=${formatExact(spread)}\%$$`,
        raw`$$${formatExact(gain)}=\frac{${formatExact(p)}\times${formatExact(spread)}\times T}{100}$$`,
        raw`$$T=\frac{${formatExact(gain)}\times100}{${formatExact(p)}\times${formatExact(spread)}}$$`,
        raw`$$T=${formatExact(t)}$$ years.`,
      ],
      examShortcut: raw`$$T=\frac{100G}{P(R_l-R_b)}=${formatExact(t)}$$`,
      verification: `${money(p)} at a ${formatPercent(spread)} spread for ${time(t)} gives ${money(gain)}.`,
      conclusion: `The duration is ${time(t)}.`,
    },
  };
}

function buildMonthLedger(seed: string): Built {
  const { actor, institution } = context(seed);
  const p1 = rational(pick([6000, 8000, 12000], seed, "p1"));
  const p2 = rational(pick([9000, 12000, 15000], seed, "p2"));
  const r1 = rational(pick([6, 8, 10], seed, "r1"));
  const r2 = rational(pick([9, 12], seed, "r2"));
  const m1 = rational(pick([6, 9], seed, "m1"));
  const m2 = rational(pick([3, 6], seed, "m2"));
  const t1 = divideRational(m1, rational(12));
  const t2 = divideRational(m2, rational(12));
  const i1 = si(p1, r1, t1);
  const i2 = si(p2, r2, t2);
  const solution = addRational(i1, i2);
  const yearsWrong = addRational(si(p1, r1, m1), si(p2, r2, m2));
  const hundredWrong = addRational(si(p1, r1, divideRational(m1, rational(100))), si(p2, r2, divideRational(m2, rational(100))));
  return {
    stem: `${actor} invests ${money(p1)} at ${formatPercent(r1)} for ${formatExact(m1)} months and ${money(p2)} at ${formatPercent(r2)} for ${formatExact(m2)} months in ${institution}, using simple interest. Find the combined interest.`,
    answerSemantic: "MONEY",
    difficulty: "Medium",
    values: { firstPrincipal: p1, secondPrincipal: p2, firstRate: r1, secondRate: r2, firstMonths: m1, secondMonths: m2 },
    solution,
    candidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: "Converts each month duration to years before calculating interest." },
      { value: yearsWrong, misconceptionId: "TREAT_MONTHS_AS_YEARS", explanation: "Uses the month counts directly as years." },
      { value: hundredWrong, misconceptionId: "DIVIDE_MONTHS_BY_100", explanation: "Divides months by 100 instead of 12." },
      { value: i1, misconceptionId: "IGNORE_ONE_DEPOSIT", explanation: "Omits the second deposit." },
    ],
    explanation: {
      mainRule: "Convert months to years separately for every contribution, then add the interests.",
      workedSteps: [
        raw`$$T_1=\frac{${formatExact(m1)}}{12}=${formatExact(t1)},\qquad T_2=\frac{${formatExact(m2)}}{12}=${formatExact(t2)}$$`,
        raw`$$I_1=\frac{${formatExact(p1)}\times${formatExact(r1)}\times${formatExact(t1)}}{100}=${formatExact(i1)}$$`,
        raw`$$I_2=\frac{${formatExact(p2)}\times${formatExact(r2)}\times${formatExact(t2)}}{100}=${formatExact(i2)}$$`,
        raw`$$I=${formatExact(i1)}+${formatExact(i2)}=${formatExact(solution)}$$`,
      ],
      examShortcut: raw`$$I=\frac{P_1R_1m_1+P_2R_2m_2}{1200}=${formatExact(solution)}$$`,
      verification: `${money(i1)} + ${money(i2)} = ${money(solution)}.`,
      conclusion: `The combined interest is ${money(solution)}.`,
    },
  };
}

function buildFractionalLedger(seed: string): Built {
  const { actor, institution } = context(seed);
  const p1 = rational(pick([6000, 8000, 10000], seed, "p1"));
  const p2 = rational(pick([9000, 12000, 15000], seed, "p2"));
  const r1 = rational(pick([6, 8, 10], seed, "r1"));
  const r2 = rational(pick([9, 12], seed, "r2"));
  const t1 = rational(1, 2);
  const t2 = rational(3, 2);
  const i1 = si(p1, r1, t1);
  const i2 = si(p2, r2, t2);
  const solution = addRational(i1, i2);
  const rounded = addRational(si(p1, r1, rational(1)), si(p2, r2, rational(2)));
  const bothOne = addRational(si(p1, r1, rational(1)), si(p2, r2, rational(1)));
  return {
    stem: `${actor} invests ${money(p1)} at ${formatPercent(r1)} for ${formatExact(t1)} year and ${money(p2)} at ${formatPercent(r2)} for ${formatExact(t2)} years in ${institution}. Find the combined simple interest.`,
    answerSemantic: "MONEY",
    difficulty: "Medium",
    values: { firstPrincipal: p1, secondPrincipal: p2, firstRate: r1, secondRate: r2, firstTime: t1, secondTime: t2 },
    solution,
    candidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: "Retains both exact fractional-year durations." },
      { value: rounded, misconceptionId: "ROUND_FRACTIONAL_YEAR", explanation: "Rounds one-half year to one and one-and-a-half years to two." },
      { value: bothOne, misconceptionId: "RETURN_ONE_YEAR_EQUIVALENT", explanation: "Uses one year for both deposits." },
      { value: i1, misconceptionId: "IGNORE_ONE_DEPOSIT", explanation: "Omits the second contribution." },
    ],
    explanation: {
      mainRule: "Use fractional years exactly; simple interest is linear in time and requires no rounding.",
      workedSteps: [
        raw`First duration is exactly $$T_1=${formatExact(t1)}$$ year.`,
        raw`$$I_1=\frac{${formatExact(p1)}\times${formatExact(r1)}\times${formatExact(t1)}}{100}=${formatExact(i1)}$$`,
        raw`$$I_2=\frac{${formatExact(p2)}\times${formatExact(r2)}\times${formatExact(t2)}}{100}=${formatExact(i2)}$$`,
        raw`$$I=${formatExact(i1)}+${formatExact(i2)}=${formatExact(solution)}$$`,
      ],
      examShortcut: raw`Keep the rational times inside $$\frac{P_1R_1T_1+P_2R_2T_2}{100}$$.`,
      verification: `${money(i1)} + ${money(i2)} = ${money(solution)}.`,
      conclusion: `The combined interest is ${money(solution)}.`,
    },
  };
}

function buildMixedDayYear(seed: string): Built {
  const { actor, institution } = context(seed);
  const basis = rational(365);
  const days = rational(73);
  const dayP = rational(pick([7300, 14600, 21900], seed, "dp"));
  const dayR = rational(pick([5, 10], seed, "dr"));
  const yearP = rational(pick([5000, 8000, 10000], seed, "yp"));
  const yearR = rational(pick([6, 8, 10], seed, "yr"));
  const yearT = rational(pick([1, 2], seed, "yt"));
  const dayT = divideRational(days, basis);
  const dayI = si(dayP, dayR, dayT);
  const yearI = si(yearP, yearR, yearT);
  const solution = addRational(dayI, yearI);
  const wrong360 = addRational(si(dayP, dayR, divideRational(days, rational(360))), yearI);
  const daysAsYears = addRational(si(dayP, dayR, days), yearI);
  return {
    stem: `${actor} has two simple-interest deposits in ${institution}. ${money(dayP)} earns ${formatPercent(dayR)} for ${formatExact(days)} days using a 365-day year, while ${money(yearP)} earns ${formatPercent(yearR)} for ${time(yearT)}. Find the combined interest.`,
    answerSemantic: "MONEY",
    difficulty: "Hard",
    values: { dayPrincipal: dayP, dayRate: dayR, days, dayBasis: basis, yearPrincipal: yearP, yearRate: yearR, yearTime: yearT },
    solution,
    candidates: [
      { value: solution, misconceptionId: "CORRECT", explanation: "Uses 73/365 year for the day contribution and exact years for the other contribution." },
      { value: wrong360, misconceptionId: "USE_WRONG_DAY_COUNT_BASIS", explanation: "Uses a 360-day denominator despite the stated 365-day year." },
      { value: daysAsYears, misconceptionId: "TREAT_MONTHS_AS_YEARS", explanation: "Treats the number of days as a number of years." },
      { value: yearI, misconceptionId: "IGNORE_DAY_CONTRIBUTION", explanation: "Omits the day-based deposit." },
    ],
    explanation: {
      mainRule: "Convert the day-based duration with its declared denominator and add it to the separate year-based contribution.",
      workedSteps: [
        raw`Day duration: $$T_d=\frac{${formatExact(days)}}{${formatExact(basis)}}=${formatExact(dayT)}$$ year.`,
        raw`$$I_d=\frac{${formatExact(dayP)}\times${formatExact(dayR)}\times${formatExact(dayT)}}{100}=${formatExact(dayI)}$$`,
        raw`$$I_y=\frac{${formatExact(yearP)}\times${formatExact(yearR)}\times${formatExact(yearT)}}{100}=${formatExact(yearI)}$$`,
        raw`$$I=${formatExact(dayI)}+${formatExact(yearI)}=${formatExact(solution)}$$`,
      ],
      examShortcut: raw`$$I=\frac{P_dR_d\,days}{100\times365}+\frac{P_yR_yT_y}{100}=${formatExact(solution)}$$`,
      verification: `${money(dayI)} + ${money(yearI)} = ${money(solution)}.`,
      conclusion: `The combined interest is ${money(solution)}.`,
    },
  };
}

function build(prototypeId: IntCp002Wave03aPrototypeId, seed: string): Built {
  switch (prototypeId) {
    case "INT-CP002-W03A-PIECEWISE-MISSING-PRINCIPAL": return buildPiecewiseMissingPrincipal(seed);
    case "INT-CP002-W03A-PIECEWISE-THREE-INTERVAL-DIRECT": return buildThreeIntervals(seed);
    case "INT-CP002-W03A-THREE-DEPOSIT-DIRECT": return buildThreeDepositsDirect(seed);
    case "INT-CP002-W03A-THREE-DEPOSIT-MISSING-PRINCIPAL": return buildThreeDepositMissingPrincipal(seed);
    case "INT-CP002-W03A-SPLIT-PRINCIPAL-RATIO": return buildSplitRatio(seed);
    case "INT-CP002-W03A-EQUAL-INTEREST-SPLIT": return buildEqualInterestSplit(seed);
    case "INT-CP002-W03A-TIME-CHANGE-DIFFERENCE": return buildTimeChangeDifference(seed);
    case "INT-CP002-W03A-ORIGINAL-DURATION": return buildOriginalDuration(seed);
    case "INT-CP002-W03A-TWO-REPAYMENTS-DIRECT": return buildTwoRepayments(seed);
    case "INT-CP002-W03A-BORROW-LEND-MISSING-PRINCIPAL": return buildBorrowLendPrincipal(seed);
    case "INT-CP002-W03A-BORROW-LEND-MISSING-DURATION": return buildBorrowLendDuration(seed);
    case "INT-CP002-W03A-MONTH-BASED-LEDGER": return buildMonthLedger(seed);
    case "INT-CP002-W03A-FRACTIONAL-YEAR-LEDGER": return buildFractionalLedger(seed);
    case "INT-CP002-W03A-MIXED-DAY-YEAR-LEDGER": return buildMixedDayYear(seed);
  }
}

export function generateIntCp002Wave03aQuestion(request: {
  prototypeId: IntCp002Wave03aPrototypeId;
  seed: string;
}): IntCp002Wave03aQuestion {
  if (!(INT_CP002_WAVE03A_PROTOTYPE_IDS as readonly string[]).includes(request.prototypeId)) {
    throw new Error(`Unknown Wave 3A prototype '${String(request.prototypeId)}'.`);
  }
  const requestedSeed = request.seed.trim();
  if (!requestedSeed) throw new Error("Wave 3A requires a non-empty deterministic seed.");
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
    `${request.prototypeId}/${requestedSeed}: failed after 32 attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
  );
}
