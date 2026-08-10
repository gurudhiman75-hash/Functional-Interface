import {
  add,
  compare,
  divide,
  equals,
  formatRational,
  multiply,
  rational,
  reciprocal,
  subtract,
  toLatex,
  toMixedLatex,
} from "./rational";
import type { Rational } from "./types";
import type { Tmw001ChapterLanguage } from "./chapter-localized-runtime";
import { getTmwR4GapEntry, type TmwR4GapEntry } from "./source-gap-r4-registry";
import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";

interface R4Option {
  text: string;
  key: string;
  misconceptionId: string;
}

interface R4State {
  parameters: Record<string, Rational | number | string>;
}

export interface TmwR4GeneratedQuestion {
  archetypeId: "TMW-001";
  canonicalProblemId: string;
  questionLanguageId: string;
  solveMode: string;
  answerType: string;
  difficulty: string;
  examTier: string;
  language: Tmw001ChapterLanguage;
  seed: string;
  stem: string;
  parameters: Record<string, Rational | number | string>;
  solution: {
    answer: Rational;
    answerKey: string;
    answerText: string;
  };
  options: string[];
  optionAudit: R4Option[];
  correctIndex: number;
  learnerExplanationVersion: "TMW_LEARNER_V2";
  learnerExplanation: TmwLearnerExplanationV2;
  mathematicalFingerprint: string;
  validation: { valid: boolean; errors: string[] };
  publiclyPublishable: false;
}

const r = (n: number, d = 1): Rational => rational(n, d);
const ONE = r(1);
const ZERO = r(0);

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(values: readonly T[], seed: string, salt: string): T {
  return values[hash(`${seed}|${salt}`) % values.length];
}

function requireR(p: R4State["parameters"], key: string): Rational {
  const value = p[key];
  if (!value || typeof value === "number" || typeof value === "string") throw new Error(`Missing rational parameter ${key}`);
  return value;
}

function requireN(p: R4State["parameters"], key: string): number {
  const value = p[key];
  if (typeof value !== "number") throw new Error(`Missing numeric parameter ${key}`);
  return value;
}

function key(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

function positive(value: Rational): boolean {
  return compare(value, ZERO) > 0;
}

function show(value: Rational): string {
  return value.denominator === 1 ? String(value.numerator) : `\\(${toMixedLatex(value)}\\)`;
}

function fraction(value: Rational): string {
  return `\\(${toLatex(value)}\\)`;
}

function unitWord(language: Tmw001ChapterLanguage, unit: "day" | "hour" | "worker" | "woman"): string {
  if (language === "hi") {
    if (unit === "day") return "दिन";
    if (unit === "hour") return "घंटे";
    if (unit === "woman") return "महिलाएँ";
    return "कर्मचारी";
  }
  if (language === "pa") {
    if (unit === "day") return "ਦਿਨ";
    if (unit === "hour") return "ਘੰਟੇ";
    if (unit === "woman") return "ਔਰਤਾਂ";
    return "ਕਰਮਚਾਰੀ";
  }
  if (unit === "woman") return "women";
  if (unit === "worker") return "workers";
  return `${unit}${unit === "day" || unit === "hour" ? "s" : ""}`;
}

function quantityText(entry: TmwR4GapEntry, value: Rational, language: Tmw001ChapterLanguage): string {
  if (entry.answerType === "RATIO") return `${Math.abs(value.numerator)} : ${value.denominator}`;
  if (entry.answerType === "MONEY") return `₹${formatRational(value)}`;
  if (entry.answerType === "COUNT") return `${formatRational(value)} ${entry.qlId === "TMW-QL-225" ? unitWord(language, "woman") : unitWord(language, "worker")}`;
  const unit = entry.qlId === "TMW-QL-214" || entry.qlId === "TMW-QL-221" ? unitWord(language, "hour") : unitWord(language, "day");
  return `${show(value)} ${unit}`;
}

function buildState(entry: TmwR4GapEntry, seed: string): R4State {
  switch (entry.qlId) {
    case "TMW-QL-212": {
      const v = pick([
        { solo: 10, percent: 25 }, { solo: 12, percent: 50 }, { solo: 15, percent: 20 }, { solo: 20, percent: 25 },
      ] as const, seed, entry.qlId);
      return { parameters: { soloTime: r(v.solo), percentMore: r(v.percent), efficiencyMultiplier: r(100 + v.percent, 100) } };
    }
    case "TMW-QL-213": {
      const v = pick([
        { fa: r(1, 2), ta: 8, fb: r(1, 3), tb: 6 },
        { fa: r(2, 5), ta: 6, fb: r(1, 4), tb: 5 },
        { fa: r(3, 8), ta: 9, fb: r(1, 2), tb: 10 },
        { fa: r(1, 3), ta: 4, fb: r(2, 5), tb: 6 },
      ], seed, entry.qlId);
      return { parameters: { fractionA: v.fa, timeA: r(v.ta), fractionB: v.fb, timeB: r(v.tb) } };
    }
    case "TMW-QL-214": {
      const v = pick([
        { qa: 50, ta: 10, qab: 300, tab: 40, target: 30 },
        { qa: 60, ta: 12, qab: 240, tab: 24, target: 40 },
        { qa: 80, ta: 10, qab: 300, tab: 20, target: 42 },
        { qa: 45, ta: 9, qab: 240, tab: 20, target: 35 },
      ] as const, seed, entry.qlId);
      return { parameters: { outputA: r(v.qa), timeA: r(v.ta), combinedOutput: r(v.qab), combinedTime: r(v.tab), targetOutput: r(v.target) } };
    }
    case "TMW-QL-215": {
      const v = pick([
        { a: 10, b: 12, c: 15, after: 2, before: 3 },
        { a: 12, b: 18, c: 24, after: 3, before: 2 },
        { a: 15, b: 20, c: 30, after: 4, before: 3 },
        { a: 18, b: 24, c: 36, after: 3, before: 2 },
      ] as const, seed, entry.qlId);
      return { parameters: { timeA: r(v.a), timeB: r(v.b), timeC: r(v.c), leaveAfterA: r(v.after), leaveBeforeCompletionB: r(v.before) } };
    }
    case "TMW-QL-216": {
      const v = pick([
        { together: 30, first: 6, finish: 32 }, { together: 20, first: 5, finish: 15 },
        { together: 15, first: 3, finish: 16 }, { together: 18, first: 3, finish: 20 },
      ] as const, seed, entry.qlId);
      return { parameters: { combinedTime: r(v.together), togetherDuration: r(v.first), soloFinishDuration: r(v.finish) } };
    }
    case "TMW-QL-217": {
      const v = pick([
        { days: 30, added: 6, saved: 10 }, { days: 24, added: 8, saved: 8 },
        { days: 20, added: 5, saved: 5 }, { days: 36, added: 9, saved: 9 },
      ] as const, seed, entry.qlId);
      return { parameters: { plannedDays: r(v.days), addedWorkers: r(v.added), timeSaved: r(v.saved) } };
    }
    case "TMW-QL-218": {
      const v = pick([
        { n: 20, d: 30, leave: 5, final: 35 }, { n: 24, d: 20, leave: 6, final: 24 },
        { n: 30, d: 18, leave: 10, final: 24 }, { n: 40, d: 15, leave: 8, final: 18 },
      ] as const, seed, entry.qlId);
      return { parameters: { workers: r(v.n), plannedDays: r(v.d), workersLeave: r(v.leave), finalDays: r(v.final) } };
    }
    case "TMW-QL-219": {
      const v = pick([
        { ea: 2, eb: 1, a1: 8, b1: 4, base: 6, event: 2, a2: 4, b2: 8 },
        { ea: 3, eb: 2, a1: 6, b1: 6, base: 8, event: 2, a2: 4, b2: 9 },
        { ea: 2, eb: 1, a1: 10, b1: 5, base: 10, event: 4, a2: 5, b2: 10 },
        { ea: 3, eb: 1, a1: 6, b1: 4, base: 9, event: 3, a2: 4, b2: 8 },
      ] as const, seed, entry.qlId);
      return { parameters: { efficiencyA: r(v.ea), efficiencyB: r(v.eb), countAInitial: r(v.a1), countBInitial: r(v.b1), originalCompletionDays: r(v.base), eventDays: r(v.event), countAChanged: r(v.a2), countBChanged: r(v.b2) } };
    }
    case "TMW-QL-220": {
      const v = pick([
        { solo: 12, pa: 54, pb: 81 }, { solo: 15, pa: 60, pb: 90 },
        { solo: 20, pa: 80, pb: 120 }, { solo: 18, pa: 75, pb: 45 },
      ] as const, seed, entry.qlId);
      return { parameters: { soloTimeA: r(v.solo), paymentA: r(v.pa), paymentB: r(v.pb) } };
    }
    case "TMW-QL-221": {
      const v = pick([
        { abc: r(12), bcd: r(15), ad: r(20) },
        { abc: r(8), bcd: r(8), ad: r(12) },
        { abc: r(10), bcd: r(10), ad: r(15) },
        { abc: r(6), bcd: r(10), ad: r(15) },
      ], seed, entry.qlId);
      return { parameters: { timeABC: v.abc, timeBCD: v.bcd, timeAD: v.ad } };
    }
    case "TMW-QL-222": {
      const v = pick([
        { ab: 10, c: 50 }, { ab: 12, c: 72 }, { ab: 8, c: 48 }, { ab: 15, c: 60 },
      ] as const, seed, entry.qlId);
      return { parameters: { combinedABTime: r(v.ab), soloTimeC: r(v.c) } };
    }
    case "TMW-QL-223": {
      const v = pick([
        { ab: r(20), bc: r(30), ac: r(40) },
        { ab: r(6), bc: r(10), ac: r(15, 2) },
        { ab: r(8), bc: r(16), ac: r(48, 5) },
        { ab: r(60, 7), bc: r(15), ac: r(12) },
      ], seed, entry.qlId);
      return { parameters: { timeAB: v.ab, timeBC: v.bc, timeAC: v.ac } };
    }
    case "TMW-QL-224": {
      const v = pick([
        { xa: r(1, 20), xb: r(1, 40), c1a: 1, c1b: 2, c2a: 2, c2b: 1, ta: 3, tb: 2 },
        { xa: r(1, 30), xb: r(1, 60), c1a: 1, c1b: 2, c2a: 2, c2b: 1, ta: 3, tb: 2 },
        { xa: r(1, 18), xb: r(1, 36), c1a: 1, c1b: 2, c2a: 2, c2b: 1, ta: 3, tb: 3 },
        { xa: r(1, 24), xb: r(1, 48), c1a: 2, c1b: 2, c2a: 3, c2b: 1, ta: 4, tb: 2 },
      ], seed, entry.qlId);
      const rate1 = add(multiply(r(v.c1a), v.xa), multiply(r(v.c1b), v.xb));
      const rate2 = add(multiply(r(v.c2a), v.xa), multiply(r(v.c2b), v.xb));
      return { parameters: { crew1A: r(v.c1a), crew1B: r(v.c1b), crew2A: r(v.c2a), crew2B: r(v.c2b), time1: reciprocal(rate1), time2: reciprocal(rate2), targetA: r(v.ta), targetB: r(v.tb) } };
    }
    case "TMW-QL-225": {
      const v = pick([
        { a: 4, b: 10, da: 2, db: 2, d1: 4, d2: 2, final: 3, extra: 8 },
        { a: 3, b: 6, da: 1, db: 2, d1: 3, d2: 2, final: 4, extra: 6 },
        { a: 5, b: 8, da: 2, db: 1, d1: 2, d2: 3, final: 4, extra: 5 },
        { a: 6, b: 5, da: 1, db: 3, d1: 3, d2: 2, final: 3, extra: 7 },
      ] as const, seed, entry.qlId);
      const units1 = 2 * v.a + v.b;
      const units2 = 2 * (v.a + v.da) + (v.b + v.db);
      const totalUnits = units1 * v.d1 + units2 * v.d2 + (units2 + v.extra) * v.final;
      return { parameters: {
        initialA: r(v.a), initialB: r(v.b), addedA: r(v.da), addedB: r(v.db),
        phase1Days: r(v.d1), phase2Days: r(v.d2), finalDays: r(v.final),
        fraction1: r(units1 * v.d1, totalUnits), fraction2: r(units2 * v.d2, totalUnits),
      } };
    }
    case "TMW-QL-226": {
      const v = pick([
        { a: 5, b: 10, joint: 2, pay: 100 }, { a: 6, b: 12, joint: 3, pay: 120 },
        { a: 8, b: 12, joint: 3, pay: 160 }, { a: 10, b: 15, joint: 5, pay: 180 },
      ] as const, seed, entry.qlId);
      return { parameters: { soloTimeA: r(v.a), soloTimeB: r(v.b), jointTime: r(v.joint), totalPayment: r(v.pay) } };
    }
    case "TMW-QL-227": {
      const v = pick([
        { solo: 20, first: 5, finish: 10 }, { solo: 12, first: 3, finish: 9 },
        { solo: 15, first: 5, finish: 8 }, { solo: 18, first: 6, finish: 8 },
      ] as const, seed, entry.qlId);
      return { parameters: { soloTimeA: r(v.solo), initialSoloDays: r(v.first), replacementFinishDays: r(v.finish) } };
    }
    case "TMW-QL-228": {
      const v = pick([
        { planned: 4, actual: 7, drop: 20 }, { planned: 5, actual: 8, drop: 15 },
        { planned: 6, actual: 9, drop: 10 }, { planned: 3, actual: 5, drop: 8 },
      ] as const, seed, entry.qlId);
      return { parameters: { plannedDays: r(v.planned), actualDays: r(v.actual), dailyDrop: r(v.drop) } };
    }
    case "TMW-QL-229": {
      const v = pick([
        { slower: 60, faster: 30 }, { slower: 40, faster: 24 }, { slower: 36, faster: 18 }, { slower: 48, faster: 24 },
      ] as const, seed, entry.qlId);
      const combined = divide(r(v.slower * v.faster), r(v.slower + v.faster));
      const halfHandoff = r(v.slower + v.faster, 2);
      return { parameters: { combinedTime: combined, halfHandoffTotal: halfHandoff } };
    }
    default:
      throw new Error(`No R4 state builder for ${entry.qlId}`);
  }
}

function solve(entry: TmwR4GapEntry, state: R4State): Rational {
  const p = state.parameters;
  switch (entry.qlId) {
    case "TMW-QL-212":
      return divide(requireR(p, "soloTime"), add(ONE, requireR(p, "efficiencyMultiplier")));
    case "TMW-QL-213": {
      const rate = add(divide(requireR(p, "fractionA"), requireR(p, "timeA")), divide(requireR(p, "fractionB"), requireR(p, "timeB")));
      return reciprocal(rate);
    }
    case "TMW-QL-214": {
      const rateA = divide(requireR(p, "outputA"), requireR(p, "timeA"));
      const combinedRate = divide(requireR(p, "combinedOutput"), requireR(p, "combinedTime"));
      return divide(requireR(p, "targetOutput"), subtract(combinedRate, rateA));
    }
    case "TMW-QL-215": {
      const ra = reciprocal(requireR(p, "timeA")), rb = reciprocal(requireR(p, "timeB")), rc = reciprocal(requireR(p, "timeC"));
      const numerator = add(subtract(ONE, multiply(ra, requireR(p, "leaveAfterA"))), multiply(rb, requireR(p, "leaveBeforeCompletionB")));
      return divide(numerator, add(rb, rc));
    }
    case "TMW-QL-216": {
      const remaining = subtract(ONE, divide(requireR(p, "togetherDuration"), requireR(p, "combinedTime")));
      return divide(requireR(p, "soloFinishDuration"), remaining);
    }
    case "TMW-QL-217": {
      const d = requireR(p, "plannedDays"), k = requireR(p, "addedWorkers"), saved = requireR(p, "timeSaved");
      return divide(multiply(k, subtract(d, saved)), saved);
    }
    case "TMW-QL-218": {
      const n = requireR(p, "workers"), d = requireR(p, "plannedDays"), leave = requireR(p, "workersLeave"), finalDays = requireR(p, "finalDays");
      return divide(subtract(multiply(n, d), multiply(subtract(n, leave), finalDays)), leave);
    }
    case "TMW-QL-219": {
      const initialRate = add(multiply(requireR(p, "countAInitial"), requireR(p, "efficiencyA")), multiply(requireR(p, "countBInitial"), requireR(p, "efficiencyB")));
      const changedRate = add(multiply(requireR(p, "countAChanged"), requireR(p, "efficiencyA")), multiply(requireR(p, "countBChanged"), requireR(p, "efficiencyB")));
      const work = multiply(initialRate, requireR(p, "originalCompletionDays"));
      const done = multiply(initialRate, requireR(p, "eventDays"));
      return divide(subtract(work, done), changedRate);
    }
    case "TMW-QL-220": {
      const pa = requireR(p, "paymentA"), pb = requireR(p, "paymentB");
      return divide(multiply(requireR(p, "soloTimeA"), pa), add(pa, pb));
    }
    case "TMW-QL-221": {
      const sumRates = add(add(reciprocal(requireR(p, "timeABC")), reciprocal(requireR(p, "timeBCD"))), reciprocal(requireR(p, "timeAD")));
      return divide(r(2), sumRates);
    }
    case "TMW-QL-222": {
      const rb = divide(subtract(reciprocal(requireR(p, "combinedABTime")), reciprocal(requireR(p, "soloTimeC"))), r(2));
      return reciprocal(rb);
    }
    case "TMW-QL-223": {
      const sab = reciprocal(requireR(p, "timeAB")), sbc = reciprocal(requireR(p, "timeBC")), sac = reciprocal(requireR(p, "timeAC"));
      const ra = divide(subtract(add(sab, sac), sbc), r(2));
      const rc = divide(subtract(add(sbc, sac), sab), r(2));
      return divide(rc, ra);
    }
    case "TMW-QL-224": {
      const a1 = requireR(p, "crew1A"), b1 = requireR(p, "crew1B"), a2 = requireR(p, "crew2A"), b2 = requireR(p, "crew2B");
      const s1 = reciprocal(requireR(p, "time1")), s2 = reciprocal(requireR(p, "time2"));
      const det = subtract(multiply(a1, b2), multiply(a2, b1));
      const x = divide(subtract(multiply(s1, b2), multiply(s2, b1)), det);
      const y = divide(subtract(multiply(a1, s2), multiply(a2, s1)), det);
      const targetRate = add(multiply(requireR(p, "targetA"), x), multiply(requireR(p, "targetB"), y));
      return reciprocal(targetRate);
    }
    case "TMW-QL-225": {
      const a1 = requireR(p, "initialA"), b1 = requireR(p, "initialB"), a2 = add(a1, requireR(p, "addedA")), b2 = add(b1, requireR(p, "addedB"));
      const s1 = divide(requireR(p, "fraction1"), requireR(p, "phase1Days"));
      const s2 = divide(requireR(p, "fraction2"), requireR(p, "phase2Days"));
      const det = subtract(multiply(a1, b2), multiply(a2, b1));
      const x = divide(subtract(multiply(s1, b2), multiply(s2, b1)), det);
      const y = divide(subtract(multiply(a1, s2), multiply(a2, s1)), det);
      const remaining = subtract(subtract(ONE, requireR(p, "fraction1")), requireR(p, "fraction2"));
      const requiredRate = divide(remaining, requireR(p, "finalDays"));
      const currentRate = add(multiply(a2, x), multiply(b2, y));
      return divide(subtract(requiredRate, currentRate), y);
    }
    case "TMW-QL-226": {
      const helperRate = subtract(subtract(reciprocal(requireR(p, "jointTime")), reciprocal(requireR(p, "soloTimeA"))), reciprocal(requireR(p, "soloTimeB")));
      const helperFraction = multiply(helperRate, requireR(p, "jointTime"));
      return multiply(requireR(p, "totalPayment"), helperFraction);
    }
    case "TMW-QL-227": {
      const remaining = subtract(ONE, divide(requireR(p, "initialSoloDays"), requireR(p, "soloTimeA")));
      const rb = divide(remaining, requireR(p, "replacementFinishDays"));
      return reciprocal(add(reciprocal(requireR(p, "soloTimeA")), rb));
    }
    case "TMW-QL-228": {
      const n = requireR(p, "actualDays"), d = requireR(p, "plannedDays"), drop = requireR(p, "dailyDrop");
      const numerator = multiply(multiply(drop, n), subtract(n, ONE));
      const denominator = multiply(r(2), subtract(n, d));
      return divide(numerator, denominator);
    }
    case "TMW-QL-229": {
      const t = requireR(p, "combinedTime"), h = requireR(p, "halfHandoffTotal");
      const sum = multiply(r(2), h), product = multiply(multiply(r(2), h), t);
      const discriminant = subtract(multiply(sum, sum), multiply(r(4), product));
      const root = sqrtExact(discriminant);
      return divide(add(sum, root), r(2));
    }
    default:
      throw new Error(`No R4 solver for ${entry.qlId}`);
  }
}

function integerSqrt(value: number): number {
  const root = Math.trunc(Math.sqrt(value));
  if (root * root !== value) throw new Error(`Expected perfect square, got ${value}`);
  return root;
}

function sqrtExact(value: Rational): Rational {
  if (value.numerator < 0) throw new Error("Negative discriminant");
  return r(integerSqrt(value.numerator), integerSqrt(value.denominator));
}

function verify(entry: TmwR4GapEntry, state: R4State, answer: Rational): boolean {
  if (!positive(answer)) return false;
  const p = state.parameters;
  switch (entry.qlId) {
    case "TMW-QL-212": {
      const combinedRate = add(reciprocal(requireR(p, "soloTime")), multiply(requireR(p, "efficiencyMultiplier"), reciprocal(requireR(p, "soloTime"))));
      return equals(multiply(combinedRate, answer), ONE);
    }
    case "TMW-QL-213":
      return equals(multiply(add(divide(requireR(p, "fractionA"), requireR(p, "timeA")), divide(requireR(p, "fractionB"), requireR(p, "timeB"))), answer), ONE);
    case "TMW-QL-214": {
      const rateB = subtract(divide(requireR(p, "combinedOutput"), requireR(p, "combinedTime")), divide(requireR(p, "outputA"), requireR(p, "timeA")));
      return equals(multiply(rateB, answer), requireR(p, "targetOutput"));
    }
    case "TMW-QL-215": {
      const ra = reciprocal(requireR(p, "timeA")), rb = reciprocal(requireR(p, "timeB")), rc = reciprocal(requireR(p, "timeC"));
      const bDuration = subtract(answer, requireR(p, "leaveBeforeCompletionB"));
      const work = add(add(multiply(ra, requireR(p, "leaveAfterA")), multiply(rb, bDuration)), multiply(rc, answer));
      return positive(bDuration) && equals(work, ONE);
    }
    case "TMW-QL-216": {
      const combinedDone = divide(requireR(p, "togetherDuration"), requireR(p, "combinedTime"));
      const soloDone = divide(requireR(p, "soloFinishDuration"), answer);
      return equals(add(combinedDone, soloDone), ONE);
    }
    case "TMW-QL-217":
      return equals(multiply(answer, requireR(p, "plannedDays")), multiply(add(answer, requireR(p, "addedWorkers")), subtract(requireR(p, "plannedDays"), requireR(p, "timeSaved"))));
    case "TMW-QL-218": {
      const work = multiply(requireR(p, "workers"), requireR(p, "plannedDays"));
      const staged = add(multiply(requireR(p, "workers"), answer), multiply(subtract(requireR(p, "workers"), requireR(p, "workersLeave")), subtract(requireR(p, "finalDays"), answer)));
      return equals(work, staged);
    }
    case "TMW-QL-219": {
      const ri = add(multiply(requireR(p, "countAInitial"), requireR(p, "efficiencyA")), multiply(requireR(p, "countBInitial"), requireR(p, "efficiencyB")));
      const rc = add(multiply(requireR(p, "countAChanged"), requireR(p, "efficiencyA")), multiply(requireR(p, "countBChanged"), requireR(p, "efficiencyB")));
      return equals(add(multiply(ri, requireR(p, "eventDays")), multiply(rc, answer)), multiply(ri, requireR(p, "originalCompletionDays")));
    }
    case "TMW-QL-220": {
      const ra = reciprocal(requireR(p, "soloTimeA")), rb = subtract(reciprocal(answer), ra);
      return equals(divide(ra, rb), divide(requireR(p, "paymentA"), requireR(p, "paymentB")));
    }
    case "TMW-QL-221": {
      const twiceAllRate = add(add(reciprocal(requireR(p, "timeABC")), reciprocal(requireR(p, "timeBCD"))), reciprocal(requireR(p, "timeAD")));
      return equals(multiply(reciprocal(answer), r(2)), twiceAllRate);
    }
    case "TMW-QL-222": {
      const rb = reciprocal(answer), rc = reciprocal(requireR(p, "soloTimeC")), ra = add(rb, rc);
      return equals(add(ra, rb), reciprocal(requireR(p, "combinedABTime")));
    }
    case "TMW-QL-223": {
      const sab = reciprocal(requireR(p, "timeAB")), sbc = reciprocal(requireR(p, "timeBC")), sac = reciprocal(requireR(p, "timeAC"));
      const ra = divide(subtract(add(sab, sac), sbc), r(2));
      const rc = divide(subtract(add(sbc, sac), sab), r(2));
      return equals(answer, divide(rc, ra));
    }
    case "TMW-QL-224": {
      const a1 = requireR(p, "crew1A"), b1 = requireR(p, "crew1B"), a2 = requireR(p, "crew2A"), b2 = requireR(p, "crew2B");
      const det = subtract(multiply(a1, b2), multiply(a2, b1));
      return compare(det, ZERO) !== 0 && positive(answer);
    }
    case "TMW-QL-225":
      return answer.denominator === 1 && positive(answer);
    case "TMW-QL-226": {
      const contribution = subtract(subtract(ONE, divide(requireR(p, "jointTime"), requireR(p, "soloTimeA"))), divide(requireR(p, "jointTime"), requireR(p, "soloTimeB")));
      return equals(answer, multiply(requireR(p, "totalPayment"), contribution));
    }
    case "TMW-QL-227": {
      const ra = reciprocal(requireR(p, "soloTimeA"));
      const rb = divide(subtract(ONE, multiply(ra, requireR(p, "initialSoloDays"))), requireR(p, "replacementFinishDays"));
      return equals(multiply(add(ra, rb), answer), ONE);
    }
    case "TMW-QL-228": {
      const n = requireR(p, "actualDays"), drop = requireR(p, "dailyDrop");
      const actualWorkerDays = subtract(multiply(n, answer), divide(multiply(multiply(drop, n), subtract(n, ONE)), r(2)));
      return equals(actualWorkerDays, multiply(answer, requireR(p, "plannedDays")));
    }
    case "TMW-QL-229": {
      const totalSequential = multiply(r(2), requireR(p, "halfHandoffTotal"));
      const other = subtract(totalSequential, answer);
      return positive(other) && compare(answer, other) > 0 && equals(divide(multiply(answer, other), add(answer, other)), requireR(p, "combinedTime"));
    }
    default:
      return false;
  }
}

function renderStem(entry: TmwR4GapEntry, state: R4State, language: Tmw001ChapterLanguage): string {
  const p = state.parameters;
  const hi = language === "hi", pa = language === "pa";
  const d = (x: Rational): string => `${show(x)} ${unitWord(language, "day")}`;
  const h = (x: Rational): string => `${show(x)} ${unitWord(language, "hour")}`;
  switch (entry.qlId) {
    case "TMW-QL-212": {
      const solo = requireR(p, "soloTime"), pct = requireR(p, "percentMore");
      if (hi) return `A अकेले एक काम ${d(solo)} में करता है। B, A से ${formatRational(pct)}% अधिक दक्ष है। दोनों साथ काम करें तो काम कितने समय में पूरा होगा?`;
      if (pa) return `A ਇਕੱਲਾ ਇੱਕ ਕੰਮ ${d(solo)} ਵਿੱਚ ਕਰਦਾ ਹੈ। B, A ਨਾਲੋਂ ${formatRational(pct)}% ਵੱਧ ਦੱਖ ਹੈ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਕਰਨਗੇ?`;
      return `A can complete a job alone in ${d(solo)}. B is ${formatRational(pct)}% more efficient than A. How long will they take working together?`;
    }
    case "TMW-QL-213": {
      const fa = requireR(p, "fractionA"), fb = requireR(p, "fractionB"), ta = requireR(p, "timeA"), tb = requireR(p, "timeB");
      if (hi) return `A काम का ${fraction(fa)} भाग ${d(ta)} में और B काम का ${fraction(fb)} भाग ${d(tb)} में करता है। दोनों साथ मिलकर पूरा काम कितने समय में करेंगे?`;
      if (pa) return `A ਕੰਮ ਦਾ ${fraction(fa)} ਹਿੱਸਾ ${d(ta)} ਵਿੱਚ ਅਤੇ B ਕੰਮ ਦਾ ${fraction(fb)} ਹਿੱਸਾ ${d(tb)} ਵਿੱਚ ਕਰਦਾ ਹੈ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਕਰਨਗੇ?`;
      return `A completes ${fraction(fa)} of a job in ${d(ta)}, while B completes ${fraction(fb)} of it in ${d(tb)}. How long will they take together to finish the whole job?`;
    }
    case "TMW-QL-214": {
      const qa = requireR(p, "outputA"), ta = requireR(p, "timeA"), qab = requireR(p, "combinedOutput"), tab = requireR(p, "combinedTime"), target = requireR(p, "targetOutput");
      if (hi) return `A ${formatRational(qa)} पृष्ठ ${h(ta)} में टाइप करता है। A और B मिलकर ${formatRational(qab)} पृष्ठ ${h(tab)} में टाइप करते हैं। B अकेले ${formatRational(target)} पृष्ठ कितने समय में टाइप करेगा?`;
      if (pa) return `A ${formatRational(qa)} ਸਫ਼ੇ ${h(ta)} ਵਿੱਚ ਟਾਈਪ ਕਰਦਾ ਹੈ। A ਅਤੇ B ਮਿਲ ਕੇ ${formatRational(qab)} ਸਫ਼ੇ ${h(tab)} ਵਿੱਚ ਟਾਈਪ ਕਰਦੇ ਹਨ। B ਇਕੱਲਾ ${formatRational(target)} ਸਫ਼ੇ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਟਾਈਪ ਕਰੇਗਾ?`;
      return `A types ${formatRational(qa)} pages in ${h(ta)}. A and B together type ${formatRational(qab)} pages in ${h(tab)}. How long will B alone take to type ${formatRational(target)} pages?`;
    }
    case "TMW-QL-215": {
      const a = requireR(p, "timeA"), b = requireR(p, "timeB"), c = requireR(p, "timeC"), after = requireR(p, "leaveAfterA"), before = requireR(p, "leaveBeforeCompletionB");
      if (hi) return `A, B और C अकेले काम क्रमशः ${d(a)}, ${d(b)} और ${d(c)} में कर सकते हैं। तीनों साथ शुरू करते हैं। A ${d(after)} बाद चला जाता है और B काम पूरा होने से ${d(before)} पहले चला जाता है। काम कुल कितने दिनों में पूरा होगा?`;
      if (pa) return `A, B ਅਤੇ C ਇਕੱਲੇ ਕੰਮ ਕ੍ਰਮਵਾਰ ${d(a)}, ${d(b)} ਅਤੇ ${d(c)} ਵਿੱਚ ਕਰ ਸਕਦੇ ਹਨ। ਤਿੰਨੇ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। A ${d(after)} ਬਾਅਦ ਚਲਾ ਜਾਂਦਾ ਹੈ ਅਤੇ B ਕੰਮ ਮੁਕੰਮਲ ਹੋਣ ਤੋਂ ${d(before)} ਪਹਿਲਾਂ ਚਲਾ ਜਾਂਦਾ ਹੈ। ਕੰਮ ਕੁੱਲ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਮੁਕੰਮਲ ਹੋਵੇਗਾ?`;
      return `A, B and C can complete a job alone in ${d(a)}, ${d(b)} and ${d(c)} respectively. They start together. A leaves after ${d(after)}, while B leaves ${d(before)} before the job is completed. Find the total completion time.`;
    }
    case "TMW-QL-216": {
      const together = requireR(p, "combinedTime"), first = requireR(p, "togetherDuration"), finish = requireR(p, "soloFinishDuration");
      if (hi) return `A और B साथ मिलकर एक काम ${d(together)} में कर सकते हैं। वे ${d(first)} साथ काम करते हैं, फिर A चला जाता है और B शेष काम ${d(finish)} में पूरा करता है। B अकेले पूरा काम कितने दिनों में करेगा?`;
      if (pa) return `A ਅਤੇ B ਮਿਲ ਕੇ ਇੱਕ ਕੰਮ ${d(together)} ਵਿੱਚ ਕਰ ਸਕਦੇ ਹਨ। ਉਹ ${d(first)} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ, ਫਿਰ A ਚਲਾ ਜਾਂਦਾ ਹੈ ਅਤੇ B ਬਾਕੀ ਕੰਮ ${d(finish)} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। B ਇਕੱਲਾ ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਕਰੇਗਾ?`;
      return `A and B together can complete a job in ${d(together)}. They work together for ${d(first)}, then A leaves and B finishes the remainder in ${d(finish)}. In how many days can B alone complete the whole job?`;
    }
    case "TMW-QL-217": {
      const days = requireR(p, "plannedDays"), added = requireR(p, "addedWorkers"), saved = requireR(p, "timeSaved");
      if (hi) return `कुछ कर्मचारी एक काम ${d(days)} में पूरा कर सकते हैं। यदि ${formatRational(added)} कर्मचारी और होते, तो काम ${d(saved)} कम समय में पूरा होता। मूल कर्मचारियों की संख्या कितनी थी?`;
      if (pa) return `ਕੁਝ ਕਰਮਚਾਰੀ ਇੱਕ ਕੰਮ ${d(days)} ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦੇ ਹਨ। ਜੇ ${formatRational(added)} ਕਰਮਚਾਰੀ ਹੋਰ ਹੁੰਦੇ, ਤਾਂ ਕੰਮ ${d(saved)} ਘੱਟ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ। ਸ਼ੁਰੂਆਤੀ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਸੀ?`;
      return `A workforce can complete a job in ${d(days)}. If ${formatRational(added)} more workers were employed, the job would finish ${d(saved)} earlier. How many workers were in the original workforce?`;
    }
    case "TMW-QL-218": {
      const n = requireR(p, "workers"), days = requireR(p, "plannedDays"), leave = requireR(p, "workersLeave"), final = requireR(p, "finalDays");
      if (hi) return `${formatRational(n)} कर्मचारी एक काम ${d(days)} में कर सकते हैं। काम शुरू होने के कुछ दिन बाद ${formatRational(leave)} कर्मचारी चले जाते हैं और काम कुल ${d(final)} में पूरा होता है। कर्मचारी कितने दिन बाद गए?`;
      if (pa) return `${formatRational(n)} ਕਰਮਚਾਰੀ ਇੱਕ ਕੰਮ ${d(days)} ਵਿੱਚ ਕਰ ਸਕਦੇ ਹਨ। ਕੰਮ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਕੁਝ ਦਿਨ ਬਾਅਦ ${formatRational(leave)} ਕਰਮਚਾਰੀ ਚਲੇ ਜਾਂਦੇ ਹਨ ਅਤੇ ਕੰਮ ਕੁੱਲ ${d(final)} ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ਕਰਮਚਾਰੀ ਕਿੰਨੇ ਦਿਨ ਬਾਅਦ ਗਏ?`;
      return `${formatRational(n)} workers can complete a job in ${d(days)}. After working for some days, ${formatRational(leave)} workers leave, and the job is completed in a total of ${d(final)}. After how many days did they leave?`;
    }
    case "TMW-QL-219": {
      const ea = requireR(p, "efficiencyA"), eb = requireR(p, "efficiencyB"), a1 = requireR(p, "countAInitial"), b1 = requireR(p, "countBInitial"), base = requireR(p, "originalCompletionDays"), event = requireR(p, "eventDays"), a2 = requireR(p, "countAChanged"), b2 = requireR(p, "countBChanged");
      if (hi) return `${formatRational(a1)} पुरुष और ${formatRational(b1)} महिलाएँ एक काम ${d(base)} में कर सकते हैं। एक पुरुष की दैनिक क्षमता एक महिला की ${formatRational(divide(ea, eb))} गुना है। ${d(event)} बाद दल बदलकर ${formatRational(a2)} पुरुष और ${formatRational(b2)} महिलाएँ रह जाता है। शेष काम में और कितने दिन लगेंगे?`;
      if (pa) return `${formatRational(a1)} ਮਰਦ ਅਤੇ ${formatRational(b1)} ਔਰਤਾਂ ਇੱਕ ਕੰਮ ${d(base)} ਵਿੱਚ ਕਰ ਸਕਦੇ ਹਨ। ਇੱਕ ਮਰਦ ਦੀ ਰੋਜ਼ਾਨਾ ਸਮਰੱਥਾ ਇੱਕ ਔਰਤ ਦੀ ${formatRational(divide(ea, eb))} ਗੁਣਾ ਹੈ। ${d(event)} ਬਾਅਦ ਟੀਮ ਬਦਲ ਕੇ ${formatRational(a2)} ਮਰਦ ਅਤੇ ${formatRational(b2)} ਔਰਤਾਂ ਰਹਿ ਜਾਂਦੀਆਂ ਹਨ। ਬਾਕੀ ਕੰਮ ਲਈ ਹੋਰ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ?`;
      return `${formatRational(a1)} men and ${formatRational(b1)} women can complete a job in ${d(base)}. A man's daily efficiency is ${formatRational(divide(ea, eb))} times a woman's. After ${d(event)}, the crew changes to ${formatRational(a2)} men and ${formatRational(b2)} women. How many more days are required?`;
    }
    case "TMW-QL-220": {
      const solo = requireR(p, "soloTimeA"), payA = requireR(p, "paymentA"), payB = requireR(p, "paymentB");
      if (hi) return `A अकेले काम ${d(solo)} में कर सकता है। A और B साथ काम पूरा करते हैं और उन्हें क्रमशः ₹${formatRational(payA)} तथा ₹${formatRational(payB)} मिलते हैं, भुगतान काम के योगदान के अनुपात में है। दोनों ने काम कितने दिनों में पूरा किया?`;
      if (pa) return `A ਇਕੱਲਾ ਕੰਮ ${d(solo)} ਵਿੱਚ ਕਰ ਸਕਦਾ ਹੈ। A ਅਤੇ B ਮਿਲ ਕੇ ਕੰਮ ਪੂਰਾ ਕਰਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ਕ੍ਰਮਵਾਰ ₹${formatRational(payA)} ਅਤੇ ₹${formatRational(payB)} ਮਿਲਦੇ ਹਨ, ਭੁਗਤਾਨ ਕੰਮ ਦੇ ਯੋਗਦਾਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ। ਦੋਵਾਂ ਨੇ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕੀਤਾ?`;
      return `A can complete a job alone in ${d(solo)}. A and B finish it together and are paid ₹${formatRational(payA)} and ₹${formatRational(payB)} respectively in proportion to work contributed. In how many days did they complete the job together?`;
    }
    case "TMW-QL-221": {
      const abc = requireR(p, "timeABC"), bcd = requireR(p, "timeBCD"), ad = requireR(p, "timeAD");
      if (hi) return `चार इनलेट A, B, C और D एक टंकी भरते हैं। A+B+C टंकी ${h(abc)} में, B+C+D ${h(bcd)} में और A+D ${h(ad)} में भरते हैं। चारों साथ मिलकर टंकी कितने समय में भरेंगे?`;
      if (pa) return `ਚਾਰ ਇਨਲੈਟ A, B, C ਅਤੇ D ਇੱਕ ਟੈਂਕੀ ਭਰਦੇ ਹਨ। A+B+C ਟੈਂਕੀ ${h(abc)} ਵਿੱਚ, B+C+D ${h(bcd)} ਵਿੱਚ ਅਤੇ A+D ${h(ad)} ਵਿੱਚ ਭਰਦੇ ਹਨ। ਚਾਰੇ ਮਿਲ ਕੇ ਟੈਂਕੀ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਭਰਨਗੇ?`;
      return `Four inlet pipes A, B, C and D fill a tank. A+B+C fill it in ${h(abc)}, B+C+D in ${h(bcd)}, and A+D in ${h(ad)}. How long will all four take together?`;
    }
    case "TMW-QL-222": {
      const ab = requireR(p, "combinedABTime"), c = requireR(p, "soloTimeC");
      if (hi) return `A अकेले उतनी ही तेज़ी से काम करता है जितनी B और C साथ मिलकर। A और B साथ काम ${d(ab)} में करते हैं और C अकेले ${d(c)} में। B अकेले काम कितने दिनों में करेगा?`;
      if (pa) return `A ਇਕੱਲਾ ਉਨੀ ਹੀ ਦਰ ਨਾਲ ਕੰਮ ਕਰਦਾ ਹੈ ਜਿੰਨੀ B ਅਤੇ C ਮਿਲ ਕੇ। A ਅਤੇ B ਮਿਲ ਕੇ ਕੰਮ ${d(ab)} ਵਿੱਚ ਕਰਦੇ ਹਨ ਅਤੇ C ਇਕੱਲਾ ${d(c)} ਵਿੱਚ। B ਇਕੱਲਾ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਕਰੇਗਾ?`;
      return `A alone works at the same rate as B and C together. A and B together complete the job in ${d(ab)}, while C alone takes ${d(c)}. How long will B alone take?`;
    }
    case "TMW-QL-223": {
      const ab = requireR(p, "timeAB"), bc = requireR(p, "timeBC"), ac = requireR(p, "timeAC");
      if (hi) return `A+B, B+C और A+C एक ही काम क्रमशः ${d(ab)}, ${d(bc)} और ${d(ac)} में कर सकते हैं। A के अकेले समय और C के अकेले समय का अनुपात ज्ञात कीजिए।`;
      if (pa) return `A+B, B+C ਅਤੇ A+C ਇੱਕੋ ਕੰਮ ਕ੍ਰਮਵਾਰ ${d(ab)}, ${d(bc)} ਅਤੇ ${d(ac)} ਵਿੱਚ ਕਰ ਸਕਦੇ ਹਨ। A ਦੇ ਇਕੱਲੇ ਸਮੇਂ ਅਤੇ C ਦੇ ਇਕੱਲੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
      return `A+B, B+C and A+C can complete the same job in ${d(ab)}, ${d(bc)} and ${d(ac)} respectively. Find the ratio of A's solo completion time to C's solo completion time.`;
    }
    case "TMW-QL-224": {
      const a1 = requireR(p, "crew1A"), b1 = requireR(p, "crew1B"), a2 = requireR(p, "crew2A"), b2 = requireR(p, "crew2B"), t1 = requireR(p, "time1"), t2 = requireR(p, "time2"), ta = requireR(p, "targetA"), tb = requireR(p, "targetB");
      if (hi) return `${formatRational(a1)} पुरुष और ${formatRational(b1)} महिलाएँ एक काम ${d(t1)} में करते हैं, जबकि ${formatRational(a2)} पुरुष और ${formatRational(b2)} महिलाएँ वही काम ${d(t2)} में करते हैं। ${formatRational(ta)} पुरुष और ${formatRational(tb)} महिलाएँ वही काम कितने समय में करेंगे?`;
      if (pa) return `${formatRational(a1)} ਮਰਦ ਅਤੇ ${formatRational(b1)} ਔਰਤਾਂ ਇੱਕ ਕੰਮ ${d(t1)} ਵਿੱਚ ਕਰਦੇ ਹਨ, ਜਦਕਿ ${formatRational(a2)} ਮਰਦ ਅਤੇ ${formatRational(b2)} ਔਰਤਾਂ ਉਹੀ ਕੰਮ ${d(t2)} ਵਿੱਚ ਕਰਦੇ ਹਨ। ${formatRational(ta)} ਮਰਦ ਅਤੇ ${formatRational(tb)} ਔਰਤਾਂ ਉਹੀ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਕਰਨਗੇ?`;
      return `${formatRational(a1)} men and ${formatRational(b1)} women complete a job in ${d(t1)}, while ${formatRational(a2)} men and ${formatRational(b2)} women complete the same job in ${d(t2)}. How long will ${formatRational(ta)} men and ${formatRational(tb)} women take?`;
    }
    case "TMW-QL-225": {
      const a = requireR(p, "initialA"), b = requireR(p, "initialB"), da = requireR(p, "addedA"), db = requireR(p, "addedB"), d1 = requireR(p, "phase1Days"), d2 = requireR(p, "phase2Days"), f1 = requireR(p, "fraction1"), f2 = requireR(p, "fraction2"), final = requireR(p, "finalDays");
      if (hi) return `${formatRational(a)} पुरुष और ${formatRational(b)} महिलाएँ ${d(d1)} में काम का ${fraction(f1)} भाग करते हैं। फिर ${formatRational(da)} पुरुष और ${formatRational(db)} महिलाएँ जुड़ते हैं और नया दल ${d(d2)} में ${fraction(f2)} भाग और करता है। शेष काम ${d(final)} में पूरा करने के लिए कितनी अतिरिक्त महिलाएँ चाहिए?`;
      if (pa) return `${formatRational(a)} ਮਰਦ ਅਤੇ ${formatRational(b)} ਔਰਤਾਂ ${d(d1)} ਵਿੱਚ ਕੰਮ ਦਾ ${fraction(f1)} ਹਿੱਸਾ ਕਰਦੇ ਹਨ। ਫਿਰ ${formatRational(da)} ਮਰਦ ਅਤੇ ${formatRational(db)} ਔਰਤਾਂ ਜੁੜਦੇ ਹਨ ਅਤੇ ਨਵੀਂ ਟੀਮ ${d(d2)} ਵਿੱਚ ਹੋਰ ${fraction(f2)} ਹਿੱਸਾ ਕਰਦੀ ਹੈ। ਬਾਕੀ ਕੰਮ ${d(final)} ਵਿੱਚ ਪੂਰਾ ਕਰਨ ਲਈ ਕਿੰਨੀਆਂ ਵਾਧੂ ਔਰਤਾਂ ਚਾਹੀਦੀਆਂ ਹਨ?`;
      return `${formatRational(a)} men and ${formatRational(b)} women complete ${fraction(f1)} of a job in ${d(d1)}. Then ${formatRational(da)} men and ${formatRational(db)} women join, and the new crew completes another ${fraction(f2)} in ${d(d2)}. How many additional women are needed to finish the remainder in ${d(final)}?`;
    }
    case "TMW-QL-226": {
      const a = requireR(p, "soloTimeA"), b = requireR(p, "soloTimeB"), joint = requireR(p, "jointTime"), total = requireR(p, "totalPayment");
      if (hi) return `A और B अकेले काम क्रमशः ${d(a)} और ${d(b)} में करते हैं। सहायक C के साथ तीनों काम ${d(joint)} में पूरा करते हैं। कुल ₹${formatRational(total)} भुगतान योगदान के अनुपात में बाँटा जाता है। C का हिस्सा कितना है?`;
      if (pa) return `A ਅਤੇ B ਇਕੱਲੇ ਕੰਮ ਕ੍ਰਮਵਾਰ ${d(a)} ਅਤੇ ${d(b)} ਵਿੱਚ ਕਰਦੇ ਹਨ। ਸਹਾਇਕ C ਨਾਲ ਤਿੰਨੇ ਕੰਮ ${d(joint)} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਕੁੱਲ ₹${formatRational(total)} ਭੁਗਤਾਨ ਯੋਗਦਾਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ। C ਦਾ ਹਿੱਸਾ ਕਿੰਨਾ ਹੈ?`;
      return `A and B can complete a job alone in ${d(a)} and ${d(b)}. With helper C, all three finish it in ${d(joint)}. A total payment of ₹${formatRational(total)} is divided by work contribution. What is C's share?`;
    }
    case "TMW-QL-227": {
      const solo = requireR(p, "soloTimeA"), first = requireR(p, "initialSoloDays"), finish = requireR(p, "replacementFinishDays");
      if (hi) return `A अकेले काम ${d(solo)} में कर सकता है। वह ${d(first)} अकेले काम करता है और फिर B शेष काम ${d(finish)} में पूरा करता है। यदि A और B शुरू से साथ काम करते, तो पूरा काम कितने दिनों में होता?`;
      if (pa) return `A ਇਕੱਲਾ ਕੰਮ ${d(solo)} ਵਿੱਚ ਕਰ ਸਕਦਾ ਹੈ। ਉਹ ${d(first)} ਇਕੱਲਾ ਕੰਮ ਕਰਦਾ ਹੈ ਅਤੇ ਫਿਰ B ਬਾਕੀ ਕੰਮ ${d(finish)} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਜੇ A ਅਤੇ B ਸ਼ੁਰੂ ਤੋਂ ਮਿਲ ਕੇ ਕੰਮ ਕਰਦੇ, ਤਾਂ ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਹੁੰਦਾ?`;
      return `A can complete a job alone in ${d(solo)}. A works alone for ${d(first)}, after which B completes the remainder in ${d(finish)}. If A and B had worked together from the start, how long would the whole job take?`;
    }
    case "TMW-QL-228": {
      const planned = requireR(p, "plannedDays"), actual = requireR(p, "actualDays"), drop = requireR(p, "dailyDrop");
      if (hi) return `एक दल ने काम ${d(planned)} में पूरा करने की योजना बनाई थी। लेकिन हर अगले दिन ${formatRational(drop)} कर्मचारी काम छोड़ते गए और काम ${d(actual)} के अंत में पूरा हुआ। शुरुआत में कितने कर्मचारी थे?`;
      if (pa) return `ਇੱਕ ਟੀਮ ਨੇ ਕੰਮ ${d(planned)} ਵਿੱਚ ਪੂਰਾ ਕਰਨ ਦੀ ਯੋਜਨਾ ਬਣਾਈ ਸੀ। ਪਰ ਹਰ ਅਗਲੇ ਦਿਨ ${formatRational(drop)} ਕਰਮਚਾਰੀ ਕੰਮ ਛੱਡਦੇ ਗਏ ਅਤੇ ਕੰਮ ${d(actual)} ਦੇ ਅੰਤ ਵਿੱਚ ਪੂਰਾ ਹੋਇਆ। ਸ਼ੁਰੂ ਵਿੱਚ ਕਿੰਨੇ ਕਰਮਚਾਰੀ ਸਨ?`;
      return `A workforce planned to finish a job in ${d(planned)}. Instead, ${formatRational(drop)} workers dropped out at the start of each successive day, and the job finished at the end of ${d(actual)}. How many workers were there initially?`;
    }
    case "TMW-QL-229": {
      const together = requireR(p, "combinedTime"), handoff = requireR(p, "halfHandoffTotal");
      if (hi) return `A और B साथ मिलकर काम ${d(together)} में करते हैं। यदि A अकेले आधा काम करे और फिर B अकेले शेष आधा करे, तो कुल ${d(handoff)} लगते हैं। B, A से अधिक दक्ष है। A अकेले पूरा काम कितने दिनों में करेगा?`;
      if (pa) return `A ਅਤੇ B ਮਿਲ ਕੇ ਕੰਮ ${d(together)} ਵਿੱਚ ਕਰਦੇ ਹਨ। ਜੇ A ਇਕੱਲਾ ਅੱਧਾ ਕੰਮ ਕਰੇ ਅਤੇ ਫਿਰ B ਇਕੱਲਾ ਬਾਕੀ ਅੱਧਾ ਕਰੇ, ਤਾਂ ਕੁੱਲ ${d(handoff)} ਲੱਗਦੇ ਹਨ। B, A ਨਾਲੋਂ ਵੱਧ ਦੱਖ ਹੈ। A ਇਕੱਲਾ ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਕਰੇਗਾ?`;
      return `A and B together complete a job in ${d(together)}. If A alone completes half the job and then B alone completes the other half, the total time is ${d(handoff)}. B is more efficient than A. How long would A alone take for the whole job?`;
    }
    default:
      throw new Error(`No R4 stem for ${entry.qlId}`);
  }
}

function method(entry: TmwR4GapEntry, language: Tmw001ChapterLanguage): string {
  const en: Record<string, string> = {
    "TMW-QL-212": "Convert the relative efficiency into B's rate, add both rates, then invert the combined rate",
    "TMW-QL-213": "Convert each partial-work statement into work per day before adding the rates",
    "TMW-QL-214": "Find A's rate and the combined rate, subtract to get B's rate, then scale to the target output",
    "TMW-QL-215": "Write each worker's active duration in terms of the unknown completion time and total the work to 1",
    "TMW-QL-216": "Use the known combined rate for the first stage, then recover B's solo rate from the remaining work",
    "TMW-QL-217": "Equate original worker-days to the worker-days after adding the extra workers",
    "TMW-QL-218": "Split the worker-day ledger at the unknown leaving day and equate it to the planned worker-days",
    "TMW-QL-219": "Convert each heterogeneous crew to a weighted daily rate and carry the remaining work across the crew-change event",
    "TMW-QL-220": "Use wage ratio as the contribution-rate ratio, recover B's rate from A's known rate, and add the rates",
    "TMW-QL-221": "Add the three overlapping subset rates; every pipe is counted twice, so halve the sum before inverting",
    "TMW-QL-222": "Translate A = B + C into rates and combine it with the known A+B rate",
    "TMW-QL-223": "Recover A and C rates from the three pairwise rates, then invert the rate ratio for the solo-time ratio",
    "TMW-QL-224": "Form two linear equations for the per-person rates, solve them, then build the target crew rate",
    "TMW-QL-225": "Use the two completed-work phases to recover category rates, then compare the required final rate with the current crew rate",
    "TMW-QL-226": "Subtract A's and B's rates from the known three-person rate, then pay C in proportion to C's work share",
    "TMW-QL-227": "Recover B's rate from the handoff remainder, then add A's and B's rates for the hypothetical joint schedule",
    "TMW-QL-228": "Equate planned worker-days to the arithmetic-series total of the shrinking daily workforce",
    "TMW-QL-229": "Use the half-handoff time to get the sum of the two solo times and the combined time to get their product",
  };
  if (language === "hi") return `सबसे सीधा तरीका: ${entry.canonicalProblemId === "TMW-CP-008" ? "योगदान और दर को एक ही अनुपात में रखें" : entry.canonicalProblemId === "TMW-CP-007" ? "हर श्रेणी की संख्या को उसकी दक्षता से भारित करें" : entry.canonicalProblemId === "TMW-CP-009" ? "ओवरलैप वाली पाइप-दरों को सावधानी से जोड़ें" : "काम = दर × समय का सही समीकरण बनाएँ"}।`;
  if (language === "pa") return `ਸਭ ਤੋਂ ਸਿੱਧਾ ਤਰੀਕਾ: ${entry.canonicalProblemId === "TMW-CP-008" ? "ਯੋਗਦਾਨ ਅਤੇ ਦਰ ਨੂੰ ਇੱਕੋ ਅਨੁਪਾਤ ਵਿੱਚ ਰੱਖੋ" : entry.canonicalProblemId === "TMW-CP-007" ? "ਹਰ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਨੂੰ ਉਸ ਦੀ ਦੱਖਤਾ ਨਾਲ ਭਾਰਿਤ ਕਰੋ" : entry.canonicalProblemId === "TMW-CP-009" ? "ਓਵਰਲੈਪ ਵਾਲੀਆਂ ਪਾਈਪ ਦਰਾਂ ਨੂੰ ਧਿਆਨ ਨਾਲ ਜੋੜੋ" : "ਕੰਮ = ਦਰ × ਸਮਾਂ ਦਾ ਸਹੀ ਸਮੀਕਰਨ ਬਣਾਓ"}।`;
  return `${en[entry.qlId]}.`;
}

function calculationSteps(entry: TmwR4GapEntry, state: R4State, answer: Rational, language: Tmw001ChapterLanguage): string[] {
  const p = state.parameters;
  const a = toLatex(answer);
  let first = "";
  let second = `\\(x=${a}\\)`;
  switch (entry.qlId) {
    case "TMW-QL-212": first = `\\(r_A=\\frac{1}{${toLatex(requireR(p,"soloTime"))}},\\quad r_B=${toLatex(requireR(p,"efficiencyMultiplier"))}r_A\\)`; break;
    case "TMW-QL-213": first = `\\(r=\\frac{${toLatex(requireR(p,"fractionA"))}}{${toLatex(requireR(p,"timeA"))}}+\\frac{${toLatex(requireR(p,"fractionB"))}}{${toLatex(requireR(p,"timeB"))}}\\)`; break;
    case "TMW-QL-214": first = `\\(r_B=\\frac{${toLatex(requireR(p,"combinedOutput"))}}{${toLatex(requireR(p,"combinedTime"))}}-\\frac{${toLatex(requireR(p,"outputA"))}}{${toLatex(requireR(p,"timeA"))}}\\)`; break;
    case "TMW-QL-215": first = `\\(\\frac{${toLatex(requireR(p,"leaveAfterA"))}}{${toLatex(requireR(p,"timeA"))}}+\\frac{x-${toLatex(requireR(p,"leaveBeforeCompletionB"))}}{${toLatex(requireR(p,"timeB"))}}+\\frac{x}{${toLatex(requireR(p,"timeC"))}}=1\\)`; break;
    case "TMW-QL-216": first = `\\(W_{rem}=1-\\frac{${toLatex(requireR(p,"togetherDuration"))}}{${toLatex(requireR(p,"combinedTime"))}}\\)`; break;
    case "TMW-QL-217": first = `\\(x(${toLatex(requireR(p,"plannedDays"))})=(x+${toLatex(requireR(p,"addedWorkers"))})(${toLatex(subtract(requireR(p,"plannedDays"),requireR(p,"timeSaved")))})\\)`; break;
    case "TMW-QL-218": first = `\\(${toLatex(requireR(p,"workers"))}${toLatex(requireR(p,"plannedDays"))}=${toLatex(requireR(p,"workers"))}x+${toLatex(subtract(requireR(p,"workers"),requireR(p,"workersLeave")))}(${toLatex(requireR(p,"finalDays"))}-x)\\)`; break;
    case "TMW-QL-219": first = `\\(R_1=${toLatex(add(multiply(requireR(p,"countAInitial"),requireR(p,"efficiencyA")),multiply(requireR(p,"countBInitial"),requireR(p,"efficiencyB"))))},\\quad R_2=${toLatex(add(multiply(requireR(p,"countAChanged"),requireR(p,"efficiencyA")),multiply(requireR(p,"countBChanged"),requireR(p,"efficiencyB"))))}\\)`; break;
    case "TMW-QL-220": first = `\\(r_A:r_B=${toLatex(requireR(p,"paymentA"))}:${toLatex(requireR(p,"paymentB"))}\\)`; break;
    case "TMW-QL-221": first = `\\(2R=\\frac1{${toLatex(requireR(p,"timeABC"))}}+\\frac1{${toLatex(requireR(p,"timeBCD"))}}+\\frac1{${toLatex(requireR(p,"timeAD"))}}\\)`; break;
    case "TMW-QL-222": first = `\\(r_A=r_B+r_C,\\quad r_A+r_B=\\frac1{${toLatex(requireR(p,"combinedABTime"))}}\\)`; break;
    case "TMW-QL-223": first = `\\(r_A=\\frac{r_{AB}+r_{AC}-r_{BC}}2,\\quad r_C=\\frac{r_{BC}+r_{AC}-r_{AB}}2\\)`; break;
    case "TMW-QL-224": first = `\\(${toLatex(requireR(p,"crew1A"))}x+${toLatex(requireR(p,"crew1B"))}y=\\frac1{${toLatex(requireR(p,"time1"))}},\\quad ${toLatex(requireR(p,"crew2A"))}x+${toLatex(requireR(p,"crew2B"))}y=\\frac1{${toLatex(requireR(p,"time2"))}}\\)`; break;
    case "TMW-QL-225": first = `\\(R_1=\\frac{${toLatex(requireR(p,"fraction1"))}}{${toLatex(requireR(p,"phase1Days"))}},\\quad R_2=\\frac{${toLatex(requireR(p,"fraction2"))}}{${toLatex(requireR(p,"phase2Days"))}}\\)`; break;
    case "TMW-QL-226": first = `\\(r_C=\\frac1{${toLatex(requireR(p,"jointTime"))}}-\\frac1{${toLatex(requireR(p,"soloTimeA"))}}-\\frac1{${toLatex(requireR(p,"soloTimeB"))}}\\)`; break;
    case "TMW-QL-227": first = `\\(r_B=\\frac{1-${toLatex(divide(requireR(p,"initialSoloDays"),requireR(p,"soloTimeA")))}}{${toLatex(requireR(p,"replacementFinishDays"))}}\\)`; break;
    case "TMW-QL-228": first = `\\(${toLatex(requireR(p,"plannedDays"))}x=${toLatex(requireR(p,"actualDays"))}x-${toLatex(requireR(p,"dailyDrop"))}\\frac{${toLatex(requireR(p,"actualDays"))}(${toLatex(subtract(requireR(p,"actualDays"),ONE))})}{2}\\)`; break;
    case "TMW-QL-229": first = `\\(T_A+T_B=${toLatex(multiply(r(2),requireR(p,"halfHandoffTotal")))},\\quad T_AT_B=${toLatex(multiply(multiply(r(2),requireR(p,"halfHandoffTotal")),requireR(p,"combinedTime")))}\\)`; break;
  }
  const label = language === "hi" ? `अतः आवश्यक मान ${quantityText(entry, answer, language)} है।` : language === "pa" ? `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਮੁੱਲ ${quantityText(entry, answer, language)} ਹੈ।` : `Therefore, the required value is ${quantityText(entry, answer, language)}.`;
  return [first, second, label];
}

function distractors(entry: TmwR4GapEntry, state: R4State, answer: Rational): Array<{ value: Rational; id: string }> {
  const p = state.parameters;
  const candidates: Array<{ value: Rational; id: string }> = [];
  const push = (value: Rational, id: string): void => { if (positive(value) && !equals(value, answer) && !candidates.some((x) => equals(x.value, value))) candidates.push({ value, id }); };
  switch (entry.qlId) {
    case "TMW-QL-212": push(requireR(p,"soloTime"),"USED_A_SOLO_TIME"); push(divide(requireR(p,"soloTime"),requireR(p,"efficiencyMultiplier")),"USED_B_SOLO_TIME"); break;
    case "TMW-QL-213": push(reciprocal(add(reciprocal(requireR(p,"timeA")),reciprocal(requireR(p,"timeB")))),"TREATED_PARTIAL_TIMES_AS_SOLO_TIMES"); push(add(requireR(p,"timeA"),requireR(p,"timeB")),"ADDED_GIVEN_TIMES"); break;
    case "TMW-QL-214": push(divide(requireR(p,"targetOutput"),divide(requireR(p,"combinedOutput"),requireR(p,"combinedTime"))),"USED_COMBINED_RATE_FOR_B"); push(divide(requireR(p,"targetOutput"),divide(requireR(p,"outputA"),requireR(p,"timeA"))),"USED_A_RATE_FOR_B"); break;
    case "TMW-QL-215": push(reciprocal(add(add(reciprocal(requireR(p,"timeA")),reciprocal(requireR(p,"timeB"))),reciprocal(requireR(p,"timeC")))),"IGNORED_LEAVING_EVENTS"); push(subtract(answer,requireR(p,"leaveBeforeCompletionB")),"REPORTED_B_ACTIVE_TIME"); break;
    case "TMW-QL-216": push(requireR(p,"combinedTime"),"REPORTED_COMBINED_TIME"); push(requireR(p,"soloFinishDuration"),"REPORTED_REMAINING_STAGE_TIME"); break;
    case "TMW-QL-217": push(requireR(p,"addedWorkers"),"REPORTED_ADDED_WORKERS"); push(add(answer,requireR(p,"addedWorkers")),"REPORTED_REVISED_WORKFORCE"); break;
    case "TMW-QL-218": push(requireR(p,"plannedDays"),"REPORTED_PLANNED_DURATION"); push(subtract(requireR(p,"finalDays"),answer),"REPORTED_POST_LEAVE_DURATION"); break;
    case "TMW-QL-219": push(requireR(p,"originalCompletionDays"),"IGNORED_CREW_CHANGE"); push(add(requireR(p,"eventDays"),answer),"REPORTED_TOTAL_INSTEAD_OF_ADDITIONAL_TIME"); break;
    case "TMW-QL-220": push(requireR(p,"soloTimeA"),"USED_A_SOLO_TIME"); push(divide(multiply(requireR(p,"soloTimeA"),requireR(p,"paymentB")),add(requireR(p,"paymentA"),requireR(p,"paymentB"))),"REVERSED_WAGE_RATIO"); break;
    case "TMW-QL-221": { const sum=add(add(reciprocal(requireR(p,"timeABC")),reciprocal(requireR(p,"timeBCD"))),reciprocal(requireR(p,"timeAD"))); push(reciprocal(sum),"FORGOT_EACH_PIPE_COUNTED_TWICE"); push(requireR(p,"timeABC"),"USED_ONE_SUBSET_TIME"); break; }
    case "TMW-QL-222": push(requireR(p,"combinedABTime"),"USED_COMBINED_TIME_AS_SOLO"); push(requireR(p,"soloTimeC"),"USED_C_SOLO_TIME"); break;
    case "TMW-QL-223": push(reciprocal(answer),"REVERSED_TIME_RATIO"); push(ONE,"ASSUMED_EQUAL_SOLO_TIMES"); break;
    case "TMW-QL-224": push(requireR(p,"time1"),"USED_FIRST_CREW_TIME"); push(requireR(p,"time2"),"USED_SECOND_CREW_TIME"); break;
    case "TMW-QL-225": push(add(requireR(p,"initialB"),requireR(p,"addedB")),"REPORTED_CURRENT_WOMEN"); push(add(answer,add(requireR(p,"initialB"),requireR(p,"addedB"))),"REPORTED_FINAL_TOTAL_WOMEN"); break;
    case "TMW-QL-226": push(divide(requireR(p,"totalPayment"),r(3)),"DIVIDED_PAYMENT_EQUALLY"); push(subtract(requireR(p,"totalPayment"),answer),"REPORTED_A_AND_B_COMBINED_SHARE"); break;
    case "TMW-QL-227": push(requireR(p,"soloTimeA"),"USED_A_SOLO_TIME"); push(add(requireR(p,"initialSoloDays"),requireR(p,"replacementFinishDays")),"USED_HANDOFF_TOTAL_TIME"); break;
    case "TMW-QL-228": push(multiply(requireR(p,"dailyDrop"),requireR(p,"actualDays")),"MULTIPLIED_DROP_BY_DAYS"); push(subtract(answer,requireR(p,"dailyDrop")),"USED_FINAL_DAY_WORKFORCE"); break;
    case "TMW-QL-229": push(subtract(multiply(r(2),requireR(p,"halfHandoffTotal")),answer),"CHOSE_FASTER_WORKER_TIME"); push(multiply(r(2),requireR(p,"combinedTime")),"DOUBLED_COMBINED_TIME"); break;
  }
  push(multiply(answer,r(2)),"DOUBLED_REQUIRED_VALUE");
  push(divide(answer,r(2)),"HALVED_REQUIRED_VALUE");
  push(add(answer,ONE),"ARITHMETIC_OFF_BY_ONE");
  return candidates.slice(0,3);
}

function shuffledOptions(entry: TmwR4GapEntry, state: R4State, answer: Rational, language: Tmw001ChapterLanguage, seed: string): { options: R4Option[]; correctIndex: number } {
  const wrong = distractors(entry,state,answer);
  if (wrong.length < 3) throw new Error(`${entry.qlId}: insufficient unique distractors`);
  const values: Array<{ value: Rational; id: string }> = [{ value: answer, id: "CORRECT" }, ...wrong];
  let h = hash(`${seed}|${entry.qlId}|option-order`);
  for (let i = values.length - 1; i > 0; i -= 1) {
    h = Math.imul(h ^ (h >>> 16), 2246822519) >>> 0;
    const j = h % (i + 1);
    [values[i], values[j]] = [values[j], values[i]];
  }
  const options = values.map((item) => ({ text: quantityText(entry,item.value,language), key: key(item.value), misconceptionId: item.id }));
  const correctIndex = options.findIndex((option) => option.misconceptionId === "CORRECT");
  return { options, correctIndex };
}

function fingerprint(entry: TmwR4GapEntry, state: R4State): string {
  return [entry.solveMode, ...Object.entries(state.parameters).sort(([a],[b]) => a.localeCompare(b)).map(([name,value]) => `${name}:${typeof value === "object" ? key(value as Rational) : String(value)}`)].join("|");
}

export function runTmwR4SourceGapPipeline(input: { questionLanguageId: string; seed: string; language: Tmw001ChapterLanguage }): TmwR4GeneratedQuestion {
  const entry = getTmwR4GapEntry(input.questionLanguageId);
  const state = buildState(entry,input.seed);
  const answer = solve(entry,state);
  const answerText = quantityText(entry,answer,input.language);
  const optionSet = shuffledOptions(entry,state,answer,input.language,input.seed);
  const learnerExplanation: TmwLearnerExplanationV2 = {
    method: method(entry,input.language),
    solution: calculationSteps(entry,state,answer,input.language),
    answer: input.language === "hi" ? `अतः उत्तर ${answerText} है।` : input.language === "pa" ? `ਇਸ ਲਈ ਉੱਤਰ ${answerText} ਹੈ।` : `Therefore, the answer is ${answerText}.`,
  };
  const errors = validateTmwLearnerExplanationV2(learnerExplanation);
  if (!verify(entry,state,answer)) errors.push("Independent R4 source-gap verifier disagrees with canonical solve");
  if (optionSet.options.length !== 4 || new Set(optionSet.options.map((option) => option.text)).size !== 4) errors.push("R4 option set is not four unique choices");
  if (optionSet.correctIndex < 0 || optionSet.options[optionSet.correctIndex]?.key !== key(answer)) errors.push("R4 correct option does not match solved answer");
  if (entry.answerType === "COUNT" && answer.denominator !== 1) errors.push("R4 count answer is not an integer");
  if (!renderStem(entry,state,input.language).trim()) errors.push("R4 stem is empty");
  if (input.language === "hi" && !/[\u0900-\u097F]/.test([renderStem(entry,state,input.language),learnerExplanation.method,learnerExplanation.answer].join(" "))) errors.push("R4 Hindi output lacks Devanagari text");
  if (input.language === "pa" && !/[\u0A00-\u0A7F]/.test([renderStem(entry,state,input.language),learnerExplanation.method,learnerExplanation.answer].join(" "))) errors.push("R4 Punjabi output lacks Gurmukhi text");
  return {
    archetypeId: "TMW-001",
    canonicalProblemId: entry.canonicalProblemId,
    questionLanguageId: entry.qlId,
    solveMode: entry.solveMode,
    answerType: entry.answerType,
    difficulty: entry.difficulty,
    examTier: entry.examTier,
    language: input.language,
    seed: input.seed,
    stem: renderStem(entry,state,input.language),
    parameters: state.parameters,
    solution: { answer, answerKey: key(answer), answerText },
    options: optionSet.options.map((option) => option.text),
    optionAudit: optionSet.options,
    correctIndex: optionSet.correctIndex,
    learnerExplanationVersion: "TMW_LEARNER_V2",
    learnerExplanation,
    mathematicalFingerprint: fingerprint(entry,state),
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
