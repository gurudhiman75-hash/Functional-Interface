import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";
import type { Tmw001ChapterLanguage } from "./chapter-localized-runtime";

export const TMW_CP_012_ID = "TMW-CP-012" as const;

export const TMW_CP_012_QLS = [
  { qlId: "TMW-QL-212", solveMode: "findExcludedAgentTimeFromAllTogetherAndSubgroup", answerType: "TIME", difficulty: "Easy" },
  { qlId: "TMW-QL-213", solveMode: "findNewTeamTimeAfterMemberEfficiencyChange", answerType: "TIME", difficulty: "Medium" },
  { qlId: "TMW-QL-214", solveMode: "findTeamTimeSavedOrDelayedAfterMemberEfficiencyChange", answerType: "TIME_DIFFERENCE", difficulty: "Medium" },
] as const;

type Cp012Entry = typeof TMW_CP_012_QLS[number];
type ChangeDirection = "INCREASE" | "DECREASE";

interface Rational {
  n: number;
  d: number;
}

interface ExcludedAgentCase {
  allTime: number;
  subgroupTime: number;
}

interface EfficiencyChangeCase {
  a: number;
  b: number;
  percent: number;
  direction: ChangeDirection;
  oldTime: number;
}

const EXCLUDED_AGENT_CASES: readonly ExcludedAgentCase[] = [
  { allTime: 6, subgroupTime: 10 },
  { allTime: 8, subgroupTime: 12 },
  { allTime: 10, subgroupTime: 15 },
  { allTime: 9, subgroupTime: 12 },
  { allTime: 12, subgroupTime: 16 },
  { allTime: 14, subgroupTime: 21 },
  { allTime: 16, subgroupTime: 24 },
  { allTime: 18, subgroupTime: 30 },
];

const EFFICIENCY_CHANGE_CASES: readonly EfficiencyChangeCase[] = [
  { a: 2, b: 3, percent: 50, direction: "INCREASE", oldTime: 12 },
  { a: 4, b: 3, percent: 25, direction: "INCREASE", oldTime: 16 },
  { a: 1, b: 2, percent: 100, direction: "INCREASE", oldTime: 12 },
  { a: 4, b: 2, percent: 50, direction: "INCREASE", oldTime: 12 },
  { a: 1, b: 1, percent: 50, direction: "DECREASE", oldTime: 12 },
  { a: 2, b: 3, percent: 25, direction: "DECREASE", oldTime: 18 },
  { a: 3, b: 2, percent: 20, direction: "DECREASE", oldTime: 22 },
];

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

function rational(n: number, d = 1): Rational {
  if (d === 0) throw new Error("Zero denominator in CP-012 rational");
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { n: sign * n / g, d: Math.abs(d) / g };
}

function subtract(a: Rational, b: Rational): Rational {
  return rational(a.n * b.d - b.n * a.d, a.d * b.d);
}

function absRational(value: Rational): Rational {
  return { n: Math.abs(value.n), d: value.d };
}

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(items: readonly T[], seed: string): T {
  return items[hashSeed(seed) % items.length];
}

function shuffled<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  let state = hashSeed(seed) || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function getEntry(qlId: string): Cp012Entry {
  const entry = TMW_CP_012_QLS.find((item) => item.qlId === qlId);
  if (!entry) throw new Error(`Unknown CP-012 QL: ${qlId}`);
  return entry;
}

function dayWord(language: Tmw001ChapterLanguage, value: Rational): string {
  if (language === "hi") return "दिन";
  if (language === "pa") return "ਦਿਨ";
  return value.n === value.d ? "day" : "days";
}

function displayRational(value: Rational): string {
  if (value.d === 1) return String(value.n);
  const whole = Math.trunc(value.n / value.d);
  const remainder = Math.abs(value.n % value.d);
  if (whole !== 0 && remainder !== 0) return `${whole} \\(\\frac{${remainder}}{${value.d}}\\)`;
  return `\\(\\frac{${value.n}}{${value.d}}\\)`;
}

function displayDays(value: Rational, language: Tmw001ChapterLanguage): string {
  return `${displayRational(value)} ${dayWord(language, value)}`;
}

function percentPhrase(direction: ChangeDirection, percent: number, language: Tmw001ChapterLanguage): string {
  if (language === "hi") return direction === "INCREASE" ? `${percent}% अधिक कुशल` : `${percent}% कम कुशल`;
  if (language === "pa") return direction === "INCREASE" ? `${percent}% ਵੱਧ ਕੁਸ਼ਲ` : `${percent}% ਘੱਟ ਕੁਸ਼ਲ`;
  return direction === "INCREASE" ? `${percent}% more efficient` : `${percent}% less efficient`;
}

function newTeamTime(c: EfficiencyChangeCase): Rational {
  const multiplierNumerator = c.direction === "INCREASE" ? 100 + c.percent : 100 - c.percent;
  const newRateNumerator = c.a * multiplierNumerator + c.b * 100;
  const workTimesHundred = (c.a + c.b) * c.oldTime * 100;
  return rational(workTimesHundred, newRateNumerator);
}

function optionValues(correct: Rational, anchors: readonly number[]): Rational[] {
  const values: Rational[] = [correct];
  const keys = new Set([`${correct.n}/${correct.d}`]);
  for (const anchor of anchors) {
    if (anchor <= 0) continue;
    const candidate = rational(anchor);
    const key = `${candidate.n}/${candidate.d}`;
    if (!keys.has(key)) {
      keys.add(key);
      values.push(candidate);
    }
    if (values.length === 4) break;
  }
  let bump = 1;
  while (values.length < 4) {
    const base = Math.ceil(correct.n / correct.d);
    const candidate = rational(base + bump);
    const key = `${candidate.n}/${candidate.d}`;
    if (!keys.has(key)) {
      keys.add(key);
      values.push(candidate);
    }
    bump += 1;
  }
  return values;
}

function optionPackage(correct: Rational, anchors: readonly number[], language: Tmw001ChapterLanguage, seed: string) {
  const answerText = displayDays(correct, language);
  const options = shuffled(optionValues(correct, anchors).map((value) => displayDays(value, language)), `${seed}:options`);
  return { answerText, options, correctIndex: options.indexOf(answerText) };
}

function buildExcludedAgentQuestion(entry: Cp012Entry, seed: string, language: Tmw001ChapterLanguage) {
  const c = pick(EXCLUDED_AGENT_CASES, `${seed}:${entry.qlId}`);
  const allRate = rational(1, c.allTime);
  const subgroupRate = rational(1, c.subgroupTime);
  const cRate = subtract(allRate, subgroupRate);
  if (cRate.n <= 0) throw new Error("CP-012 excluded-agent case has non-positive residual rate");
  const answer = rational(cRate.d, cRate.n);
  const optionSet = optionPackage(answer, [c.subgroupTime, c.allTime + c.subgroupTime, c.subgroupTime - c.allTime, c.allTime], language, seed);

  const stem = language === "hi"
    ? `A, B और C मिलकर एक काम ${c.allTime} दिन में पूरा करते हैं। A और B मिलकर वही काम ${c.subgroupTime} दिन में पूरा करते हैं। C अकेला उस काम को कितने दिन में पूरा करेगा?`
    : language === "pa"
      ? `A, B ਅਤੇ C ਮਿਲ ਕੇ ਇੱਕ ਕੰਮ ${c.allTime} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। A ਅਤੇ B ਮਿਲ ਕੇ ਉਹੀ ਕੰਮ ${c.subgroupTime} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। C ਇਕੱਲਾ ਉਹ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰੇਗਾ?`
      : `A, B and C together complete a work in ${c.allTime} days. A and B together complete the same work in ${c.subgroupTime} days. In how many days can C alone complete the work?`;

  const learner: TmwLearnerExplanationV2 = language === "hi" ? {
    method: "सभी की संयुक्त दर में से A और B की दर घटाएँ। बची हुई दर C की अकेली कार्य-दर है।",
    solution: [
      `A+B+C की एक दिन की दर \\(\\frac{1}{${c.allTime}}\\) है।`,
      `A+B की एक दिन की दर \\(\\frac{1}{${c.subgroupTime}}\\) है।`,
      `इसलिए C की दर \\(\\frac{1}{${c.allTime}}-\\frac{1}{${c.subgroupTime}}=\\frac{${cRate.n}}{${cRate.d}}\\) काम प्रति दिन है।`,
      `अतः C का अकेले समय \\(\\frac{${cRate.d}}{${cRate.n}}=${displayRational(answer)}\\) दिन है।`,
    ],
    answer: `अतः C अकेला काम ${optionSet.answerText} में पूरा करेगा।`,
  } : language === "pa" ? {
    method: "ਸਭ ਦੀ ਮਿਲੀ-ਜੁਲੀ ਦਰ ਵਿੱਚੋਂ A ਅਤੇ B ਦੀ ਦਰ ਘਟਾਓ। ਬਚੀ ਹੋਈ ਦਰ C ਦੀ ਇਕੱਲੀ ਕੰਮ ਕਰਨ ਦੀ ਦਰ ਹੈ।",
    solution: [
      `A+B+C ਦੀ ਇੱਕ ਦਿਨ ਦੀ ਦਰ \\(\\frac{1}{${c.allTime}}\\) ਹੈ।`,
      `A+B ਦੀ ਇੱਕ ਦਿਨ ਦੀ ਦਰ \\(\\frac{1}{${c.subgroupTime}}\\) ਹੈ।`,
      `ਇਸ ਲਈ C ਦੀ ਦਰ \\(\\frac{1}{${c.allTime}}-\\frac{1}{${c.subgroupTime}}=\\frac{${cRate.n}}{${cRate.d}}\\) ਕੰਮ ਪ੍ਰਤੀ ਦਿਨ ਹੈ।`,
      `ਇਸ ਕਰਕੇ C ਦਾ ਇਕੱਲੇ ਸਮਾਂ \\(\\frac{${cRate.d}}{${cRate.n}}=${displayRational(answer)}\\) ਦਿਨ ਹੈ।`,
    ],
    answer: `ਇਸ ਲਈ C ਇਕੱਲਾ ਕੰਮ ${optionSet.answerText} ਵਿੱਚ ਪੂਰਾ ਕਰੇਗਾ।`,
  } : {
    method: "Subtract the A+B rate from the A+B+C rate. The residual rate belongs to C alone.",
    solution: [
      `A+B+C complete \\(\\frac{1}{${c.allTime}}\\) of the work per day.`,
      `A+B complete \\(\\frac{1}{${c.subgroupTime}}\\) of the work per day.`,
      `So C's rate is \\(\\frac{1}{${c.allTime}}-\\frac{1}{${c.subgroupTime}}=\\frac{${cRate.n}}{${cRate.d}}\\) of the work per day.`,
      `Hence C's time is the reciprocal: \\(\\frac{${cRate.d}}{${cRate.n}}=${displayRational(answer)}\\) days.`,
    ],
    answer: `Therefore, C alone completes the work in ${optionSet.answerText}.`,
  };

  return { stem, learner, optionSet, parameters: c, answer };
}

function buildEfficiencyQuestion(entry: Cp012Entry, seed: string, language: Tmw001ChapterLanguage) {
  const c = pick(EFFICIENCY_CHANGE_CASES, `${seed}:${entry.qlId}`);
  const changedTime = newTeamTime(c);
  const oldTime = rational(c.oldTime);
  const impact = absRational(subtract(oldTime, changedTime));
  const asksImpact = entry.solveMode === "findTeamTimeSavedOrDelayedAfterMemberEfficiencyChange";
  const correct = asksImpact ? impact : changedTime;
  const optionSet = optionPackage(correct, asksImpact
    ? [impact.n / impact.d + 1, impact.n / impact.d + 2, c.oldTime, Math.max(1, Math.floor(impact.n / impact.d) - 1)]
    : [c.oldTime, Math.ceil(changedTime.n / changedTime.d) + 1, Math.max(1, Math.floor(changedTime.n / changedTime.d) - 1), c.oldTime + 2], language, seed);

  const change = percentPhrase(c.direction, c.percent, language);
  const impactNoun = c.direction === "INCREASE" ? "saved" : "delayed";
  const stem = language === "hi"
    ? `A और B की कार्यक्षमताओं का अनुपात ${c.a}:${c.b} है और वे मिलकर काम ${c.oldTime} दिन में पूरा करते हैं। यदि शुरू से A ${change} हो जाए, तो ${asksImpact ? "काम पूरा होने के समय में कितने दिन की बचत या देरी होगी" : "दोनों मिलकर काम कितने दिन में पूरा करेंगे"}?`
    : language === "pa"
      ? `A ਅਤੇ B ਦੀਆਂ ਕੁਸ਼ਲਤਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ${c.a}:${c.b} ਹੈ ਅਤੇ ਉਹ ਮਿਲ ਕੇ ਕੰਮ ${c.oldTime} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਜੇ ਸ਼ੁਰੂ ਤੋਂ A ${change} ਹੋ ਜਾਵੇ, ਤਾਂ ${asksImpact ? "ਕੰਮ ਪੂਰਾ ਹੋਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਕਿੰਨੇ ਦਿਨਾਂ ਦੀ ਬਚਤ ਜਾਂ ਦੇਰੀ ਹੋਵੇਗੀ" : "ਦੋਵੇਂ ਮਿਲ ਕੇ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਨਗੇ"}?`
      : `The efficiencies of A and B are in the ratio ${c.a}:${c.b}, and together they complete a work in ${c.oldTime} days. If A becomes ${change} from the start, ${asksImpact ? "by how many days is completion time saved or delayed" : "how long will A and B now take to complete the work"}?`;

  const multiplierNum = c.direction === "INCREASE" ? 100 + c.percent : 100 - c.percent;
  const newRateNum = c.a * multiplierNum + c.b * 100;
  const newRateDen = 100;
  const workUnits = (c.a + c.b) * c.oldTime;
  const changedA = rational(c.a * multiplierNum, 100);
  const changedTeam = rational(newRateNum, newRateDen);

  const answerLineEn = asksImpact
    ? `Therefore, the completion time is ${impactNoun} by ${optionSet.answerText}.`
    : `Therefore, the new team completion time is ${optionSet.answerText}.`;
  const answerLineHi = asksImpact
    ? `अतः काम पूरा होने का समय ${c.direction === "INCREASE" ? "कम" : "बढ़"} कर ${optionSet.answerText} का अंतर देता है।`
    : `अतः नई संयुक्त पूर्णता अवधि ${optionSet.answerText} है।`;
  const answerLinePa = asksImpact
    ? `ਇਸ ਲਈ ਕੰਮ ਪੂਰਾ ਹੋਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ${c.direction === "INCREASE" ? "ਬਚਤ" : "ਦੇਰੀ"} ${optionSet.answerText} ਹੈ।`
    : `ਇਸ ਲਈ ਨਵਾਂ ਮਿਲਿਆ-ਜੁਲਿਆ ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ ${optionSet.answerText} ਹੈ।`;

  const learner: TmwLearnerExplanationV2 = language === "hi" ? {
    method: "कार्यक्षमता अनुपात को दैनिक इकाइयों की दर मानें, पुराने समय से कुल काम निकालें, फिर केवल A की दर बदलकर नई संयुक्त दर बनाएँ।",
    solution: [
      `पुरानी संयुक्त दर \\(${c.a}+${c.b}=${c.a + c.b}\\) इकाई/दिन है, इसलिए कुल काम \\(${c.a + c.b}\\times${c.oldTime}=${workUnits}\\) इकाई है।`,
      `बदलाव के बाद A की दर \\(${c.a}\\times\\frac{${multiplierNum}}{100}=${displayRational(changedA)}\\) इकाई/दिन है।`,
      `नई संयुक्त दर \\(${displayRational(changedA)}+${c.b}=${displayRational(changedTeam)}\\) इकाई/दिन है, इसलिए नया समय \\(\\frac{${workUnits}}{${displayRational(changedTeam)}}=${displayRational(changedTime)}\\) दिन है।`,
      ...(asksImpact ? [`समय का अंतर \\(|${c.oldTime}-${displayRational(changedTime)}|=${displayRational(impact)}\\) दिन है।`] : []),
    ],
    answer: answerLineHi,
  } : language === "pa" ? {
    method: "ਕੁਸ਼ਲਤਾ ਅਨੁਪਾਤ ਨੂੰ ਰੋਜ਼ਾਨਾ ਇਕਾਈਆਂ ਦੀ ਦਰ ਮੰਨੋ, ਪੁਰਾਣੇ ਸਮੇਂ ਤੋਂ ਕੁੱਲ ਕੰਮ ਕੱਢੋ, ਫਿਰ ਸਿਰਫ਼ A ਦੀ ਦਰ ਬਦਲ ਕੇ ਨਵੀਂ ਮਿਲੀ-ਜੁਲੀ ਦਰ ਬਣਾਓ।",
    solution: [
      `ਪੁਰਾਣੀ ਮਿਲੀ-ਜੁਲੀ ਦਰ \\(${c.a}+${c.b}=${c.a + c.b}\\) ਇਕਾਈ/ਦਿਨ ਹੈ, ਇਸ ਲਈ ਕੁੱਲ ਕੰਮ \\(${c.a + c.b}\\times${c.oldTime}=${workUnits}\\) ਇਕਾਈ ਹੈ।`,
      `ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ A ਦੀ ਦਰ \\(${c.a}\\times\\frac{${multiplierNum}}{100}=${displayRational(changedA)}\\) ਇਕਾਈ/ਦਿਨ ਹੈ।`,
      `ਨਵੀਂ ਮਿਲੀ-ਜੁਲੀ ਦਰ \\(${displayRational(changedA)}+${c.b}=${displayRational(changedTeam)}\\) ਇਕਾਈ/ਦਿਨ ਹੈ, ਇਸ ਲਈ ਨਵਾਂ ਸਮਾਂ \\(\\frac{${workUnits}}{${displayRational(changedTeam)}}=${displayRational(changedTime)}\\) ਦਿਨ ਹੈ।`,
      ...(asksImpact ? [`ਸਮੇਂ ਦਾ ਅੰਤਰ \\(|${c.oldTime}-${displayRational(changedTime)}|=${displayRational(impact)}\\) ਦਿਨ ਹੈ।`] : []),
    ],
    answer: answerLinePa,
  } : {
    method: "Treat the efficiency ratio as daily work units, find total work from the old team time, then change only A's rate and recompute the team time.",
    solution: [
      `The old team rate is \\(${c.a}+${c.b}=${c.a + c.b}\\) units/day, so total work is \\(${c.a + c.b}\\times${c.oldTime}=${workUnits}\\) units.`,
      `After the change, A's rate becomes \\(${c.a}\\times\\frac{${multiplierNum}}{100}=${displayRational(changedA)}\\) units/day.`,
      `The new team rate is \\(${displayRational(changedA)}+${c.b}=${displayRational(changedTeam)}\\) units/day, so new time is \\(\\frac{${workUnits}}{${displayRational(changedTeam)}}=${displayRational(changedTime)}\\) days.`,
      ...(asksImpact ? [`The schedule impact is \\(|${c.oldTime}-${displayRational(changedTime)}|=${displayRational(impact)}\\) days.`] : []),
    ],
    answer: answerLineEn,
  };

  return { stem, learner, optionSet, parameters: c, answer: correct, changedTime, impact };
}

export function runTmwCp012Pipeline(input: { questionLanguageId: string; seed: string; language: Tmw001ChapterLanguage }): any {
  const entry = getEntry(input.questionLanguageId);
  const built = entry.solveMode === "findExcludedAgentTimeFromAllTogetherAndSubgroup"
    ? buildExcludedAgentQuestion(entry, input.seed, input.language)
    : buildEfficiencyQuestion(entry, input.seed, input.language);
  const learnerErrors = validateTmwLearnerExplanationV2(built.learner);
  const errors: string[] = [...learnerErrors];
  if (!built.stem.trim() || !built.stem.includes("?")) errors.push("Stem is not a complete exam question");
  if (built.optionSet.options.length !== 4 || new Set(built.optionSet.options).size !== 4) errors.push("Options are not four unique choices");
  if (built.optionSet.correctIndex < 0 || built.optionSet.options[built.optionSet.correctIndex] !== built.optionSet.answerText) errors.push("Correct option is not answer-aligned");
  if (built.answer.n <= 0 || built.answer.d <= 0) errors.push("Solved time is not positive");

  return {
    archetypeId: "TMW-001",
    canonicalProblemId: TMW_CP_012_ID,
    questionLanguageId: entry.qlId,
    solveMode: entry.solveMode,
    answerType: entry.answerType,
    difficulty: entry.difficulty,
    language: input.language,
    seed: input.seed,
    stem: built.stem,
    parameters: built.parameters,
    solution: { answerText: built.optionSet.answerText, answerKey: `${built.answer.n}/${built.answer.d}` },
    answerText: built.optionSet.answerText,
    options: built.optionSet.options,
    correctIndex: built.optionSet.correctIndex,
    learnerExplanationVersion: "TMW_LEARNER_V2",
    learnerExplanation: built.learner,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
