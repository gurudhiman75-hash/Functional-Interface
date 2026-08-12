import { add, divide, equals, multiply, rational, reciprocal, subtract, toLatex, toMixedLatex } from "./rational";
import { pick, seedNumber } from "./cp001-helpers";
import type { Rational, TmwLanguage } from "./types";

export const TMW_CP_013_ID = "TMW-CP-013" as const;

export const TMW_CP_013_SOLVE_MODES = [
  "dataSufficiencyCombinedRates",
  "dataSufficiencyEfficiencyRelation",
  "dataSufficiencyStagedParticipation",
  "dataSufficiencyWorkforceSchedule",
  "dataSufficiencyHeterogeneousWorkers",
  "dataSufficiencyWageContribution",
  "dataSufficiencyPipesAndLeak",
  "dataSufficiencyVariableProductivity",
] as const;

export type TmwCp013SolveMode = (typeof TMW_CP_013_SOLVE_MODES)[number];

type DsClass = "I_ONLY" | "II_ONLY" | "TOGETHER_ONLY" | "EVEN_TOGETHER_INSUFFICIENT";

type Entry = Readonly<{
  qlId: string;
  solveMode: TmwCp013SolveMode;
  expectedClass: DsClass;
  difficulty: "Medium" | "Hard";
}>;

type Candidate = string;

type DsState = Readonly<{
  stemLead: string;
  statementI: string;
  statementII: string;
  targetLabel: string;
  iCandidates: readonly Candidate[];
  iiCandidates: readonly Candidate[];
  combinedCandidates: readonly Candidate[];
  calculationSteps: readonly string[];
  verification: string;
  fingerprint: string;
}>;

const ENTRIES: readonly Entry[] = [
  { qlId: "TMW-QL-216", solveMode: "dataSufficiencyCombinedRates", expectedClass: "I_ONLY", difficulty: "Medium" },
  { qlId: "TMW-QL-217", solveMode: "dataSufficiencyEfficiencyRelation", expectedClass: "II_ONLY", difficulty: "Medium" },
  { qlId: "TMW-QL-218", solveMode: "dataSufficiencyStagedParticipation", expectedClass: "TOGETHER_ONLY", difficulty: "Hard" },
  { qlId: "TMW-QL-219", solveMode: "dataSufficiencyWorkforceSchedule", expectedClass: "EVEN_TOGETHER_INSUFFICIENT", difficulty: "Medium" },
  { qlId: "TMW-QL-220", solveMode: "dataSufficiencyHeterogeneousWorkers", expectedClass: "I_ONLY", difficulty: "Medium" },
  { qlId: "TMW-QL-221", solveMode: "dataSufficiencyWageContribution", expectedClass: "II_ONLY", difficulty: "Medium" },
  { qlId: "TMW-QL-222", solveMode: "dataSufficiencyPipesAndLeak", expectedClass: "TOGETHER_ONLY", difficulty: "Hard" },
  { qlId: "TMW-QL-223", solveMode: "dataSufficiencyVariableProductivity", expectedClass: "EVEN_TOGETHER_INSUFFICIENT", difficulty: "Hard" },
];

const DS_OPTIONS: readonly DsClass[] = ["I_ONLY", "II_ONLY", "TOGETHER_ONLY", "EVEN_TOGETHER_INSUFFICIENT"];

function entryFor(qlId: string): Entry {
  const entry = ENTRIES.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`Unknown TMW-CP-013 question language: ${qlId}`);
  return entry;
}

function text(language: TmwLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function dayText(value: Rational, language: TmwLanguage): string {
  const unit = language === "en" ? (equals(value, rational(1)) ? "day" : "days") : language === "hi" ? "दिन" : "ਦਿਨ";
  return value.denominator === 1 ? `${value.numerator} ${unit}` : `\\(${toMixedLatex(value)}\\) ${unit}`;
}

function hoursText(value: Rational, language: TmwLanguage): string {
  const unit = language === "en" ? (equals(value, rational(1)) ? "hour" : "hours") : language === "hi" ? "घंटे" : "ਘੰਟੇ";
  return value.denominator === 1 ? `${value.numerator} ${unit}` : `\\(${toMixedLatex(value)}\\) ${unit}`;
}

function optionText(value: DsClass, language: TmwLanguage): string {
  const map: Record<DsClass, [string, string, string]> = {
    I_ONLY: [
      "Statement I alone is sufficient, but Statement II alone is not sufficient.",
      "केवल कथन I पर्याप्त है, लेकिन केवल कथन II पर्याप्त नहीं है।",
      "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ, ਪਰ ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
    ],
    II_ONLY: [
      "Statement II alone is sufficient, but Statement I alone is not sufficient.",
      "केवल कथन II पर्याप्त है, लेकिन केवल कथन I पर्याप्त नहीं है।",
      "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ, ਪਰ ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
    ],
    TOGETHER_ONLY: [
      "Both statements together are sufficient, but neither statement alone is sufficient.",
      "दोनों कथन मिलकर पर्याप्त हैं, लेकिन कोई भी कथन अकेले पर्याप्त नहीं है।",
      "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
    ],
    EVEN_TOGETHER_INSUFFICIENT: [
      "Even both statements together are not sufficient.",
      "दोनों कथन मिलकर भी पर्याप्त नहीं हैं।",
      "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ।",
    ],
  };
  const [en, hi, pa] = map[value];
  return text(language, en, hi, pa);
}

function classify(state: DsState): DsClass {
  const first = state.iCandidates.length === 1;
  const second = state.iiCandidates.length === 1;
  const together = state.combinedCandidates.length === 1;
  if (first && !second) return "I_ONLY";
  if (!first && second) return "II_ONLY";
  if (!first && !second && together) return "TOGETHER_ONLY";
  return "EVEN_TOGETHER_INSUFFICIENT";
}

function combinedRatesState(seed: string, language: TmwLanguage): DsState {
  const state = pick([
    { a: 12, together: 8, b: 24 },
    { a: 18, together: 12, b: 36 },
    { a: 20, together: 12, b: 30 },
    { a: 15, together: 10, b: 30 },
  ] as const, seed, "cp013-combined");
  const rateB = subtract(reciprocal(rational(state.together)), reciprocal(rational(state.a)));
  const target = dayText(rational(state.b), language);
  return {
    stemLead: text(language, "A and B work at constant rates on the same job. Can B's solo completion time be determined?", "A और B एक ही काम पर स्थिर दर से काम करते हैं। क्या B का अकेले काम पूरा करने का समय निर्धारित किया जा सकता है?", "A ਅਤੇ B ਇੱਕੋ ਕੰਮ ਉੱਤੇ ਸਥਿਰ ਦਰ ਨਾਲ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੀ B ਦਾ ਇਕੱਲੇ ਕੰਮ ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `A alone takes ${state.a} days and A+B together take ${state.together} days.`, `A अकेला ${state.a} दिन और A+B मिलकर ${state.together} दिन लेते हैं।`, `A ਇਕੱਲਾ ${state.a} ਦਿਨ ਅਤੇ A+B ਮਿਲ ਕੇ ${state.together} ਦਿਨ ਲੈਂਦੇ ਹਨ।`),
    statementII: text(language, "B takes more time than A when working alone.", "अकेले काम करने पर B, A से अधिक समय लेता है।", "ਇਕੱਲੇ ਕੰਮ ਕਰਨ ਤੇ B, A ਨਾਲੋਂ ਵੱਧ ਸਮਾਂ ਲੈਂਦਾ ਹੈ।"),
    targetLabel: target,
    iCandidates: [target],
    iiCandidates: [dayText(rational(state.a + 3), language), target, dayText(rational(state.b + 12), language)],
    combinedCandidates: [target],
    calculationSteps: [
      text(language, `From I, B's rate = \\(${toLatex(reciprocal(rational(state.together)))}-${toLatex(reciprocal(rational(state.a)))}=${toLatex(rateB)}\\).`, `I से B की दर = \\(${toLatex(reciprocal(rational(state.together)))}-${toLatex(reciprocal(rational(state.a)))}=${toLatex(rateB)}\\)।`, `I ਤੋਂ B ਦੀ ਦਰ = \\(${toLatex(reciprocal(rational(state.together)))}-${toLatex(reciprocal(rational(state.a)))}=${toLatex(rateB)}\\)।`),
      text(language, `So B alone takes ${target}; Statement I is sufficient.`, `इसलिए B अकेला ${target} लेता है; कथन I पर्याप्त है।`, `ਇਸ ਲਈ B ਇਕੱਲਾ ${target} ਲੈਂਦਾ ਹੈ; ਕਥਨ I ਕਾਫ਼ੀ ਹੈ।`),
      text(language, "Statement II gives only an inequality, so many solo times remain possible.", "कथन II केवल एक असमानता देता है, इसलिए कई अकेले समय संभव रहते हैं।", "ਕਥਨ II ਸਿਰਫ਼ ਇੱਕ ਅਸਮਾਨਤਾ ਦਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਕਈ ਇਕੱਲੇ ਸਮੇਂ ਸੰਭਵ ਰਹਿੰਦੇ ਹਨ।"),
    ],
    verification: `I uniquely gives B=${state.b}; II leaves multiple values.`,
    fingerprint: `combined:${state.a}:${state.together}:${state.b}`,
  };
}

function efficiencyState(seed: string, language: TmwLanguage): DsState {
  const state = pick([
    { percent: 25, ratio: "5:4", together: 20 },
    { percent: 50, ratio: "3:2", together: 12 },
    { percent: 100, ratio: "2:1", together: 10 },
    { percent: 20, ratio: "6:5", together: 15 },
  ] as const, seed, "cp013-efficiency");
  return {
    stemLead: text(language, "A and B complete the same kind of work. Can the efficiency ratio A:B be determined?", "A और B एक ही प्रकार का काम करते हैं। क्या दक्षता अनुपात A:B निर्धारित किया जा सकता है?", "A ਅਤੇ B ਇੱਕੋ ਕਿਸਮ ਦਾ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੀ ਕੁਸ਼ਲਤਾ ਅਨੁਪਾਤ A:B ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `Together they can complete one job in ${state.together} days.`, `दोनों मिलकर एक काम ${state.together} दिनों में पूरा कर सकते हैं।`, `ਦੋਵੇਂ ਮਿਲ ਕੇ ਇੱਕ ਕੰਮ ${state.together} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦੇ ਹਨ।`),
    statementII: text(language, `A is ${state.percent}% more efficient than B.`, `A, B से ${state.percent}% अधिक दक्ष है।`, `A, B ਨਾਲੋਂ ${state.percent}% ਵੱਧ ਕੁਸ਼ਲ ਹੈ।`),
    targetLabel: state.ratio,
    iCandidates: ["1:1", state.ratio, "2:3"],
    iiCandidates: [state.ratio],
    combinedCandidates: [state.ratio],
    calculationSteps: [
      text(language, "Statement I fixes only the sum of their rates, not how that rate is split between A and B.", "कथन I केवल दोनों की दरों का योग तय करता है, A और B के बीच उसका बँटवारा नहीं।", "ਕਥਨ I ਸਿਰਫ਼ ਦੋਵੇਂ ਦਰਾਂ ਦਾ ਜੋੜ ਤੈਅ ਕਰਦਾ ਹੈ, A ਅਤੇ B ਵਿਚ ਉਸ ਦੀ ਵੰਡ ਨਹੀਂ।"),
      text(language, `From II, A:B efficiency = ${100 + state.percent}:100 = ${state.ratio}.`, `II से A:B दक्षता = ${100 + state.percent}:100 = ${state.ratio}।`, `II ਤੋਂ A:B ਕੁਸ਼ਲਤਾ = ${100 + state.percent}:100 = ${state.ratio}।`),
      text(language, "Therefore Statement II alone is sufficient.", "अतः केवल कथन II पर्याप्त है।", "ਇਸ ਲਈ ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ।"),
    ],
    verification: `I admits multiple ratios; II uniquely gives ${state.ratio}.`,
    fingerprint: `efficiency:${state.percent}:${state.together}:${state.ratio}`,
  };
}

function stagedState(seed: string, language: TmwLanguage): DsState {
  const state = pick([
    { a: 12, b: 18, join: 4 },
    { a: 15, b: 30, join: 5 },
    { a: 20, b: 30, join: 6 },
    { a: 18, b: 24, join: 6 },
  ] as const, seed, "cp013-staged");
  const remaining = subtract(rational(1), multiply(rational(state.join), reciprocal(rational(state.a))));
  const jointRate = add(reciprocal(rational(state.a)), reciprocal(rational(state.b)));
  const afterJoin = divide(remaining, jointRate);
  const total = add(rational(state.join), afterJoin);
  const target = dayText(total, language);
  return {
    stemLead: text(language, "A starts a job alone and B joins later. Can the total completion time be determined?", "A काम अकेले शुरू करता है और B बाद में जुड़ता है। क्या कुल पूरा होने का समय निर्धारित किया जा सकता है?", "A ਕੰਮ ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ B ਬਾਅਦ ਵਿੱਚ ਜੁੜਦਾ ਹੈ। ਕੀ ਕੁੱਲ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `A alone takes ${state.a} days and B alone takes ${state.b} days.`, `A अकेला ${state.a} दिन और B अकेला ${state.b} दिन लेता है।`, `A ਇਕੱਲਾ ${state.a} ਦਿਨ ਅਤੇ B ਇਕੱਲਾ ${state.b} ਦਿਨ ਲੈਂਦਾ ਹੈ।`),
    statementII: text(language, `B joins A after ${state.join} days from the start.`, `B शुरुआत के ${state.join} दिन बाद A से जुड़ता है।`, `B ਸ਼ੁਰੂਆਤ ਤੋਂ ${state.join} ਦਿਨ ਬਾਅਦ A ਨਾਲ ਜੁੜਦਾ ਹੈ।`),
    targetLabel: target,
    iCandidates: [dayText(add(total, rational(1)), language), target, dayText(add(total, rational(2)), language)],
    iiCandidates: [dayText(add(total, rational(3)), language), target, dayText(add(total, rational(5)), language)],
    combinedCandidates: [target],
    calculationSteps: [
      text(language, "I gives both rates but not when the second rate begins, so the finish time is not fixed.", "I दोनों दरें देता है, लेकिन दूसरी दर कब शुरू होती है यह नहीं; इसलिए पूरा होने का समय तय नहीं है।", "I ਦੋਵੇਂ ਦਰਾਂ ਦਿੰਦਾ ਹੈ, ਪਰ ਦੂਜੀ ਦਰ ਕਦੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ ਇਹ ਨਹੀਂ; ਇਸ ਲਈ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਤੈਅ ਨਹੀਂ ਹੈ।"),
      text(language, "II gives the joining time but no work rates, so it is also insufficient alone.", "II जुड़ने का समय देता है, लेकिन कार्य-दरें नहीं; इसलिए यह भी अकेले पर्याप्त नहीं है।", "II ਜੁੜਨ ਦਾ ਸਮਾਂ ਦਿੰਦਾ ਹੈ, ਪਰ ਕੰਮ-ਦਰਾਂ ਨਹੀਂ; ਇਸ ਲਈ ਇਹ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।"),
      text(language, `Together: remaining work after ${state.join} days is \\(${toLatex(remaining)}\\), then A+B finish it at rate \\(${toLatex(jointRate)}\\); total time = ${target}.`, `दोनों से: ${state.join} दिन बाद शेष काम \\(${toLatex(remaining)}\\) है, फिर A+B इसे \\(${toLatex(jointRate)}\\) दर से पूरा करते हैं; कुल समय = ${target}।`, `ਦੋਵੇਂ ਨਾਲ: ${state.join} ਦਿਨ ਬਾਅਦ ਬਾਕੀ ਕੰਮ \\(${toLatex(remaining)}\\) ਹੈ, ਫਿਰ A+B ਇਸ ਨੂੰ \\(${toLatex(jointRate)}\\) ਦਰ ਨਾਲ ਪੂਰਾ ਕਰਦੇ ਹਨ; ਕੁੱਲ ਸਮਾਂ = ${target}।`),
    ],
    verification: `I lacks join time; II lacks rates; together uniquely gives ${target}.`,
    fingerprint: `staged:${state.a}:${state.b}:${state.join}:${total.numerator}/${total.denominator}`,
  };
}

function workforceState(seed: string, language: TmwLanguage): DsState {
  const state = pick([
    { workers: 12, days: 15, upper: 12 },
    { workers: 16, days: 18, upper: 15 },
    { workers: 20, days: 12, upper: 10 },
    { workers: 18, days: 16, upper: 14 },
  ] as const, seed, "cp013-workforce");
  const work = state.workers * state.days;
  return {
    stemLead: text(language, "All workers have equal efficiency and work equal hours per day. Can the exact number of workers required for a new schedule be determined?", "सभी कामगार समान दक्षता से और प्रतिदिन समान घंटे काम करते हैं। क्या नई समय-सारणी के लिए आवश्यक कामगारों की सही संख्या निर्धारित की जा सकती है?", "ਸਾਰੇ ਮਜ਼ਦੂਰ ਇੱਕੋ ਕੁਸ਼ਲਤਾ ਨਾਲ ਅਤੇ ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੀ ਨਵੀਂ ਸਮਾਂ-ਸਾਰਣੀ ਲਈ ਲੋੜੀਂਦੇ ਮਜ਼ਦੂਰਾਂ ਦੀ ਸਹੀ ਗਿਣਤੀ ਨਿਰਧਾਰਤ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ?"),
    statementI: text(language, `${state.workers} workers can complete the whole job in ${state.days} days.`, `${state.workers} कामगार पूरा काम ${state.days} दिनों में कर सकते हैं।`, `${state.workers} ਮਜ਼ਦੂਰ ਪੂਰਾ ਕੰਮ ${state.days} ਦਿਨਾਂ ਵਿੱਚ ਕਰ ਸਕਦੇ ਹਨ।`),
    statementII: text(language, `The new schedule must finish the same job in fewer than ${state.upper} days.`, `नई समय-सारणी में वही काम ${state.upper} दिनों से कम में पूरा होना चाहिए।`, `ਨਵੀਂ ਸਮਾਂ-ਸਾਰਣੀ ਵਿੱਚ ਉਹੀ ਕੰਮ ${state.upper} ਦਿਨਾਂ ਤੋਂ ਘੱਟ ਵਿੱਚ ਪੂਰਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`),
    targetLabel: "not unique",
    iCandidates: ["12 workers", "18 workers", "24 workers"],
    iiCandidates: ["18 workers", "20 workers", "24 workers"],
    combinedCandidates: [`${Math.floor(work / (state.upper - 1)) + 1} workers`, `${Math.floor(work / (state.upper - 2)) + 1} workers`],
    calculationSteps: [
      text(language, `I fixes total work at ${work} worker-days, but no new deadline is given.`, `I कुल काम ${work} worker-days तय करता है, लेकिन नई निश्चित समय-सीमा नहीं देता।`, `I ਕੁੱਲ ਕੰਮ ${work} worker-days ਤੈਅ ਕਰਦਾ ਹੈ, ਪਰ ਨਵੀਂ ਨਿਸ਼ਚਿਤ ਸਮਾਂ-ਸੀਮਾ ਨਹੀਂ ਦਿੰਦਾ।`),
      text(language, `II gives only the inequality new time < ${state.upper} days, not an exact duration.`, `II केवल असमानता नया समय < ${state.upper} दिन देता है, कोई निश्चित अवधि नहीं।`, `II ਸਿਰਫ਼ ਅਸਮਾਨਤਾ ਨਵਾਂ ਸਮਾਂ < ${state.upper} ਦਿਨ ਦਿੰਦਾ ਹੈ, ਕੋਈ ਨਿਸ਼ਚਿਤ ਮਿਆਦ ਨਹੀਂ।`),
      text(language, "Even together, several worker counts can satisfy the deadline, so the exact count cannot be determined.", "दोनों को मिलाने पर भी कई कामगार-संख्याएँ समय-सीमा पूरी कर सकती हैं, इसलिए सही संख्या निर्धारित नहीं होती।", "ਦੋਵੇਂ ਨੂੰ ਮਿਲਾਉਣ ਤੇ ਵੀ ਕਈ ਮਜ਼ਦੂਰ-ਗਿਣਤੀਆਂ ਸਮਾਂ-ਸੀਮਾ ਪੂਰੀ ਕਰ ਸਕਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਸਹੀ ਗਿਣਤੀ ਨਿਰਧਾਰਤ ਨਹੀਂ ਹੁੰਦੀ।"),
    ],
    verification: "Both statements leave more than one feasible crew size.",
    fingerprint: `workforce:${state.workers}:${state.days}:${state.upper}`,
  };
}

function heterogeneousState(seed: string, language: TmwLanguage): DsState {
  const state = pick([
    { men: 3, women: 5 },
    { men: 4, women: 6 },
    { men: 5, women: 8 },
    { men: 6, women: 9 },
  ] as const, seed, "cp013-heterogeneous");
  const ratio = `${state.women}:${state.men}`;
  return {
    stemLead: text(language, "Men and women have constant but possibly different individual efficiencies. Can the efficiency ratio of one man to one woman be determined?", "पुरुष और महिलाएँ स्थिर लेकिन संभवतः अलग व्यक्तिगत दक्षता से काम करते हैं। क्या एक पुरुष और एक महिला की दक्षता का अनुपात निर्धारित किया जा सकता है?", "ਮਰਦ ਅਤੇ ਔਰਤਾਂ ਸਥਿਰ ਪਰ ਸੰਭਵ ਤੌਰ ਤੇ ਵੱਖਰੀ ਵਿਅਕਤੀਗਤ ਕੁਸ਼ਲਤਾ ਨਾਲ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੀ ਇੱਕ ਮਰਦ ਅਤੇ ਇੱਕ ਔਰਤ ਦੀ ਕੁਸ਼ਲਤਾ ਦਾ ਅਨੁਪਾਤ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `${state.men} men complete the same amount of work in the same time as ${state.women} women.`, `${state.men} पुरुष उतना ही काम उतने ही समय में करते हैं जितना ${state.women} महिलाएँ।`, `${state.men} ਮਰਦ ਉਤਨਾ ਹੀ ਕੰਮ ਉਤਨੇ ਹੀ ਸਮੇਂ ਵਿੱਚ ਕਰਦੇ ਹਨ ਜਿੰਨਾ ${state.women} ਔਰਤਾਂ।`),
    statementII: text(language, "A mixed team of 2 men and 5 women completes one job in 8 days.", "2 पुरुष और 5 महिलाओं की मिश्रित टीम एक काम 8 दिनों में पूरा करती है।", "2 ਮਰਦ ਅਤੇ 5 ਔਰਤਾਂ ਦੀ ਮਿਲੀ-ਜੁਲੀ ਟੀਮ ਇੱਕ ਕੰਮ 8 ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੀ ਹੈ।"),
    targetLabel: ratio,
    iCandidates: [ratio],
    iiCandidates: ["1:1", ratio, "2:1"],
    combinedCandidates: [ratio],
    calculationSteps: [
      text(language, `From I, ${state.men}E_m=${state.women}E_w, so \\(E_m:E_w=${state.women}:${state.men}\\).`, `I से ${state.men}E_m=${state.women}E_w, इसलिए \\(E_m:E_w=${state.women}:${state.men}\\)।`, `I ਤੋਂ ${state.men}E_m=${state.women}E_w, ਇਸ ਲਈ \\(E_m:E_w=${state.women}:${state.men}\\)।`),
      text(language, "Thus Statement I alone fixes the required efficiency ratio.", "इसलिए कथन I अकेले ही आवश्यक दक्षता अनुपात तय कर देता है।", "ਇਸ ਲਈ ਕਥਨ I ਇਕੱਲਾ ਹੀ ਲੋੜੀਂਦਾ ਕੁਸ਼ਲਤਾ ਅਨੁਪਾਤ ਤੈਅ ਕਰ ਦਿੰਦਾ ਹੈ।"),
      text(language, "Statement II supplies only one mixed-team rate equation, so the two individual efficiencies cannot be separated.", "कथन II केवल एक मिश्रित टीम-दर समीकरण देता है, इसलिए दोनों व्यक्तिगत दक्षताएँ अलग-अलग तय नहीं हो सकतीं।", "ਕਥਨ II ਸਿਰਫ਼ ਇੱਕ ਮਿਲੀ-ਜੁਲੀ ਟੀਮ-ਦਰ ਸਮੀਕਰਨ ਦਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਦੋਵੇਂ ਵਿਅਕਤੀਗਤ ਕੁਸ਼ਲਤਾਵਾਂ ਵੱਖ-ਵੱਖ ਤੈਅ ਨਹੀਂ ਹੋ ਸਕਦੀਆਂ।"),
    ],
    verification: `I uniquely gives ratio ${ratio}; II leaves multiple ratios.`,
    fingerprint: `heterogeneous:${state.men}:${state.women}`,
  };
}

function wagesState(seed: string, language: TmwLanguage): DsState {
  const state = pick([
    { a: 3, b: 2, bPay: 2400 },
    { a: 5, b: 3, bPay: 1800 },
    { a: 4, b: 3, bPay: 2100 },
    { a: 7, b: 5, bPay: 2500 },
  ] as const, seed, "cp013-wages");
  const aPay = rational(state.bPay * state.a, state.b);
  const totalPay = add(aPay, rational(state.bPay));
  const target = `₹${toMixedLatex(aPay)}`;
  return {
    stemLead: text(language, "A and B are paid in proportion to their work contribution. Can A's exact payment be determined?", "A और B को उनके कार्य-योगदान के अनुपात में भुगतान मिलता है। क्या A का सही भुगतान निर्धारित किया जा सकता है?", "A ਅਤੇ B ਨੂੰ ਉਨ੍ਹਾਂ ਦੇ ਕੰਮ-ਯੋਗਦਾਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਭੁਗਤਾਨ ਮਿਲਦਾ ਹੈ। ਕੀ A ਦਾ ਸਹੀ ਭੁਗਤਾਨ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `The total payment pool is ₹${toMixedLatex(totalPay)}.`, `कुल भुगतान राशि ₹${toMixedLatex(totalPay)} है।`, `ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ ₹${toMixedLatex(totalPay)} ਹੈ।`),
    statementII: text(language, `A:B contribution = ${state.a}:${state.b}, and B receives ₹${state.bPay}.`, `A:B का योगदान = ${state.a}:${state.b} है और B को ₹${state.bPay} मिलते हैं।`, `A:B ਦਾ ਯੋਗਦਾਨ = ${state.a}:${state.b} ਹੈ ਅਤੇ B ਨੂੰ ₹${state.bPay} ਮਿਲਦੇ ਹਨ।`),
    targetLabel: target,
    iCandidates: ["₹2000", target, "₹4000"],
    iiCandidates: [target],
    combinedCandidates: [target],
    calculationSteps: [
      text(language, "I gives only the total pool; without a contribution ratio, A's share is not fixed.", "I केवल कुल राशि देता है; योगदान अनुपात के बिना A का हिस्सा तय नहीं है।", "I ਸਿਰਫ਼ ਕੁੱਲ ਰਕਮ ਦਿੰਦਾ ਹੈ; ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਤੋਂ ਬਿਨਾਂ A ਦਾ ਹਿੱਸਾ ਤੈਅ ਨਹੀਂ ਹੈ।"),
      text(language, `II gives A's payment directly from the ratio: \\(₹${state.bPay}\\times${state.a}/${state.b}=₹${toMixedLatex(aPay)}\\).`, `II अनुपात से A का भुगतान सीधे देता है: \\(₹${state.bPay}\\times${state.a}/${state.b}=₹${toMixedLatex(aPay)}\\)।`, `II ਅਨੁਪਾਤ ਤੋਂ A ਦਾ ਭੁਗਤਾਨ ਸਿੱਧਾ ਦਿੰਦਾ ਹੈ: \\(₹${state.bPay}\\times${state.a}/${state.b}=₹${toMixedLatex(aPay)}\\)।`),
      text(language, "Therefore Statement II alone is sufficient.", "अतः केवल कथन II पर्याप्त है।", "ਇਸ ਲਈ ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ।"),
    ],
    verification: `II uniquely gives A payment ${target}; I alone does not split the pool.`,
    fingerprint: `wages:${state.a}:${state.b}:${state.bPay}`,
  };
}

function pipesState(seed: string, language: TmwLanguage): DsState {
  const state = pick([
    { inlet: 12, leak: 18 },
    { inlet: 10, leak: 15 },
    { inlet: 8, leak: 24 },
    { inlet: 15, leak: 30 },
  ] as const, seed, "cp013-pipes");
  const netRate = subtract(reciprocal(rational(state.inlet)), reciprocal(rational(state.leak)));
  const total = reciprocal(netRate);
  const target = hoursText(total, language);
  return {
    stemLead: text(language, "An inlet fills a tank while a leak empties it. If both remain open, can the exact filling time be determined?", "एक inlet टंकी भरता है और leak उसे खाली करता है। यदि दोनों खुले रहें, तो क्या सही भरने का समय निर्धारित किया जा सकता है?", "ਇੱਕ inlet ਟੈਂਕ ਭਰਦਾ ਹੈ ਅਤੇ leak ਇਸ ਨੂੰ ਖਾਲੀ ਕਰਦਾ ਹੈ। ਜੇ ਦੋਵੇਂ ਖੁੱਲ੍ਹੇ ਰਹਿਣ, ਤਾਂ ਕੀ ਸਹੀ ਭਰਨ ਦਾ ਸਮਾਂ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `The inlet alone fills the tank in ${state.inlet} hours.`, `inlet अकेला टंकी को ${state.inlet} घंटे में भरता है।`, `inlet ਇਕੱਲਾ ਟੈਂਕ ਨੂੰ ${state.inlet} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ।`),
    statementII: text(language, `The leak alone empties a full tank in ${state.leak} hours.`, `leak अकेला भरी टंकी को ${state.leak} घंटे में खाली करता है।`, `leak ਇਕੱਲਾ ਭਰੇ ਟੈਂਕ ਨੂੰ ${state.leak} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ।`),
    targetLabel: target,
    iCandidates: [hoursText(rational(state.inlet), language), target, hoursText(rational(state.inlet * 3), language)],
    iiCandidates: [hoursText(rational(state.leak), language), target, hoursText(rational(state.leak * 2), language)],
    combinedCandidates: [target],
    calculationSteps: [
      text(language, "I gives the positive inlet rate but not the negative leak rate, so net filling time is unknown.", "I inlet की धनात्मक दर देता है, लेकिन leak की ऋणात्मक दर नहीं; इसलिए net भरने का समय अज्ञात है।", "I inlet ਦੀ ਧਨਾਤਮਕ ਦਰ ਦਿੰਦਾ ਹੈ, ਪਰ leak ਦੀ ਰਣਾਤਮਕ ਦਰ ਨਹੀਂ; ਇਸ ਲਈ net ਭਰਨ ਦਾ ਸਮਾਂ ਅਣਜਾਣ ਹੈ।"),
      text(language, "II gives the leak rate but not the inlet rate, so it is also insufficient alone.", "II leak की दर देता है, लेकिन inlet की दर नहीं; इसलिए यह भी अकेले पर्याप्त नहीं है।", "II leak ਦੀ ਦਰ ਦਿੰਦਾ ਹੈ, ਪਰ inlet ਦੀ ਦਰ ਨਹੀਂ; ਇਸ ਲਈ ਇਹ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।"),
      text(language, `Together, net rate = \\(${toLatex(reciprocal(rational(state.inlet)))}-${toLatex(reciprocal(rational(state.leak)))}=${toLatex(netRate)}\\), so filling time = ${target}.`, `दोनों से net दर = \\(${toLatex(reciprocal(rational(state.inlet)))}-${toLatex(reciprocal(rational(state.leak)))}=${toLatex(netRate)}\\), इसलिए भरने का समय = ${target}।`, `ਦੋਵੇਂ ਨਾਲ net ਦਰ = \\(${toLatex(reciprocal(rational(state.inlet)))}-${toLatex(reciprocal(rational(state.leak)))}=${toLatex(netRate)}\\), ਇਸ ਲਈ ਭਰਨ ਦਾ ਸਮਾਂ = ${target}।`),
    ],
    verification: `Together uniquely gives net fill time ${target}; each alone lacks one signed rate.`,
    fingerprint: `pipes:${state.inlet}:${state.leak}:${total.numerator}/${total.denominator}`,
  };
}

function variableState(seed: string, language: TmwLanguage): DsState {
  const delta = pick([2, 3, 4, 5] as const, seed, "cp013-variable");
  return {
    stemLead: text(language, "A worker's daily output follows an arithmetic progression. Can the exact total output during the first 5 days be determined?", "एक कामगार का दैनिक उत्पादन समान अंतर वाली अंकगणितीय श्रेणी में बदलता है। क्या पहले 5 दिनों का सही कुल उत्पादन निर्धारित किया जा सकता है?", "ਇੱਕ ਮਜ਼ਦੂਰ ਦਾ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਇੱਕੋ ਅੰਤਰ ਵਾਲੀ ਅੰਕਗਣਿਤ ਲੜੀ ਵਿੱਚ ਬਦਲਦਾ ਹੈ। ਕੀ ਪਹਿਲੇ 5 ਦਿਨਾਂ ਦਾ ਸਹੀ ਕੁੱਲ ਉਤਪਾਦਨ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `Daily output increases by ${delta} units each day.`, `दैनिक उत्पादन हर दिन ${delta} इकाइयों से बढ़ता है।`, `ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਹਰ ਦਿਨ ${delta} ਇਕਾਈਆਂ ਨਾਲ ਵਧਦਾ ਹੈ।`),
    statementII: text(language, `Day 5 output is ${4 * delta} units more than Day 1 output.`, `दिन 5 का उत्पादन दिन 1 से ${4 * delta} इकाइयाँ अधिक है।`, `ਦਿਨ 5 ਦਾ ਉਤਪਾਦਨ ਦਿਨ 1 ਨਾਲੋਂ ${4 * delta} ਇਕਾਈਆਂ ਵੱਧ ਹੈ।`),
    targetLabel: "not unique",
    iCandidates: ["70 units", "95 units", "120 units"],
    iiCandidates: ["70 units", "95 units", "120 units"],
    combinedCandidates: ["70 units", "95 units", "120 units"],
    calculationSteps: [
      text(language, `I determines only the common difference d=${delta}; the first-day output is still unknown.`, `I केवल समान अंतर d=${delta} तय करता है; पहले दिन का उत्पादन अभी भी अज्ञात है।`, `I ਸਿਰਫ਼ ਸਾਂਝਾ ਅੰਤਰ d=${delta} ਤੈਅ ਕਰਦਾ ਹੈ; ਪਹਿਲੇ ਦਿਨ ਦਾ ਉਤਪਾਦਨ ਹਾਲੇ ਵੀ ਅਣਜਾਣ ਹੈ।`),
      text(language, `II is equivalent to the same relation because Day 5 − Day 1 = 4d = ${4 * delta}; it does not determine Day 1 output either.`, `II भी उसी संबंध के बराबर है क्योंकि दिन 5 − दिन 1 = 4d = ${4 * delta}; यह भी दिन 1 का उत्पादन तय नहीं करता।`, `II ਵੀ ਉਸੇ ਸੰਬੰਧ ਦੇ ਬਰਾਬਰ ਹੈ ਕਿਉਂਕਿ ਦਿਨ 5 − ਦਿਨ 1 = 4d = ${4 * delta}; ਇਹ ਵੀ ਦਿਨ 1 ਦਾ ਉਤਪਾਦਨ ਤੈਅ ਨਹੀਂ ਕਰਦਾ।`),
      text(language, "Thus the two statements are redundant; even together they cannot determine the exact 5-day total.", "इसलिए दोनों कथन एक ही जानकारी देते हैं; दोनों मिलकर भी सही 5-दिन का कुल उत्पादन निर्धारित नहीं कर सकते।", "ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਇੱਕੋ ਜਾਣਕਾਰੀ ਦਿੰਦੇ ਹਨ; ਦੋਵੇਂ ਮਿਲ ਕੇ ਵੀ ਸਹੀ 5-ਦਿਨ ਦਾ ਕੁੱਲ ਉਤਪਾਦਨ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕਰ ਸਕਦੇ।"),
    ],
    verification: "Both statements determine only the common difference and leave the first term free.",
    fingerprint: `variable:d=${delta}`,
  };
}

function buildState(entry: Entry, seed: string, language: TmwLanguage): DsState {
  switch (entry.solveMode) {
    case "dataSufficiencyCombinedRates": return combinedRatesState(seed, language);
    case "dataSufficiencyEfficiencyRelation": return efficiencyState(seed, language);
    case "dataSufficiencyStagedParticipation": return stagedState(seed, language);
    case "dataSufficiencyWorkforceSchedule": return workforceState(seed, language);
    case "dataSufficiencyHeterogeneousWorkers": return heterogeneousState(seed, language);
    case "dataSufficiencyWageContribution": return wagesState(seed, language);
    case "dataSufficiencyPipesAndLeak": return pipesState(seed, language);
    case "dataSufficiencyVariableProductivity": return variableState(seed, language);
  }
}

function shuffledOptions(answer: DsClass, seed: string, language: TmwLanguage) {
  const correctIndex = seedNumber(seed, `cp013-correct-index:${language}`) % DS_OPTIONS.length;
  const others = DS_OPTIONS.filter((value) => value !== answer);
  const arranged = [...others];
  arranged.splice(correctIndex, 0, answer);
  return {
    correctIndex,
    options: arranged.map((value) => optionText(value, language)),
    optionAudit: arranged.map((value) => ({ text: optionText(value, language), value, misconceptionId: value === answer ? "CORRECT" : `WRONG_${value}` })),
  };
}

function candidateSetText(values: readonly string[]): string {
  return `{${values.join(", ")}}`;
}

export function runTmwCp013DataSufficiencyPipeline(input: { questionLanguageId: string; seed: string; language: TmwLanguage }) {
  const entry = entryFor(input.questionLanguageId);
  const state = buildState(entry, input.seed, input.language);
  const canonicalClass = classify(state);
  const optionSet = shuffledOptions(canonicalClass, `${input.seed}:${entry.qlId}`, input.language);
  const errors: string[] = [];
  if (canonicalClass !== entry.expectedClass) errors.push(`DS class mismatch: expected ${entry.expectedClass}, got ${canonicalClass}`);
  if (optionSet.options.length !== 4 || new Set(optionSet.options).size !== 4) errors.push("DS options must contain four unique choices");
  if (optionSet.optionAudit[optionSet.correctIndex]?.misconceptionId !== "CORRECT") errors.push("DS correct option position is inconsistent");
  const stem = `${state.stemLead} ${text(input.language, "Statement I:", "कथन I:", "ਕਥਨ I:")} ${state.statementI} ${text(input.language, "Statement II:", "कथन II:", "ਕਥਨ II:")} ${state.statementII}`;
  if (stem.trim().split(/\s+/u).filter(Boolean).length > 95) errors.push("DS stem exceeds 95 whitespace tokens");

  const explanation = {
    opening: text(input.language, "Test each statement independently before combining them. Sufficiency means the requested quantity is unique, not merely constrained.", "दोनों कथनों को मिलाने से पहले प्रत्येक कथन को अलग-अलग जाँचें। पर्याप्तता का अर्थ है कि माँगी गई मात्रा एक ही निश्चित मान दे, केवल सीमित न हो।", "ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਮਿਲਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਹਰ ਕਥਨ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚੋ। ਕਾਫ਼ੀ ਹੋਣ ਦਾ ਅਰਥ ਹੈ ਕਿ ਮੰਗੀ ਗਈ ਮਾਤਰਾ ਇੱਕੋ ਨਿਸ਼ਚਿਤ ਮੁੱਲ ਦੇਵੇ, ਸਿਰਫ਼ ਸੀਮਿਤ ਨਾ ਹੋਵੇ।"),
    givens: [
      text(input.language, `Statement I candidate set: ${candidateSetText(state.iCandidates)}.`, `कथन I से संभावित मान: ${candidateSetText(state.iCandidates)}।`, `ਕਥਨ I ਤੋਂ ਸੰਭਵ ਮੁੱਲ: ${candidateSetText(state.iCandidates)}।`),
      text(input.language, `Statement II candidate set: ${candidateSetText(state.iiCandidates)}.`, `कथन II से संभावित मान: ${candidateSetText(state.iiCandidates)}।`, `ਕਥਨ II ਤੋਂ ਸੰਭਵ ਮੁੱਲ: ${candidateSetText(state.iiCandidates)}।`),
    ],
    formula: "",
    steps: [...state.calculationSteps, text(input.language, `Together the candidate set is ${candidateSetText(state.combinedCandidates)}.`, `दोनों को मिलाने पर संभावित मान ${candidateSetText(state.combinedCandidates)} हैं।`, `ਦੋਵੇਂ ਨੂੰ ਮਿਲਾਉਣ ਤੇ ਸੰਭਵ ਮੁੱਲ ${candidateSetText(state.combinedCandidates)} ਹਨ।`)],
    shortcut: {
      title: text(input.language, "Data Sufficiency Rule", "Data Sufficiency नियम", "Data Sufficiency ਨਿਯਮ"),
      steps: [text(input.language, "Check I alone → reset → check II alone → combine only if both are individually insufficient.", "I अकेले जाँचें → फिर अलग से II अकेले जाँचें → केवल दोनों के अकेले अपर्याप्त होने पर उन्हें मिलाएँ।", "I ਇਕੱਲਾ ਜਾਂਚੋ → ਫਿਰ ਵੱਖਰੇ ਤੌਰ ਤੇ II ਇਕੱਲਾ ਜਾਂਚੋ → ਕੇਵਲ ਦੋਵੇਂ ਦੇ ਇਕੱਲੇ ਅਕਾਫ਼ੀ ਹੋਣ ਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ਮਿਲਾਓ।")],
    },
    commonTrap: {
      optionLabel: text(input.language, "Common trap", "सामान्य गलती", "ਆਮ ਗਲਤੀ"),
      optionText: optionSet.options.find((_option, index) => index !== optionSet.correctIndex)!,
      misconceptionId: "COMBINED_TOO_EARLY",
      explanation: text(input.language, "Do not combine the statements before deciding whether either one already determines the target uniquely.", "यह देखे बिना कथनों को न मिलाएँ कि क्या कोई एक कथन अकेले ही लक्ष्य को निश्चित करता है।", "ਇਹ ਵੇਖਣ ਤੋਂ ਪਹਿਲਾਂ ਕਥਨਾਂ ਨੂੰ ਨਾ ਮਿਲਾਓ ਕਿ ਕੀ ਕੋਈ ਇੱਕ ਕਥਨ ਇਕੱਲਾ ਹੀ ਲਕਸ਼ ਨੂੰ ਨਿਸ਼ਚਿਤ ਕਰਦਾ ਹੈ।"),
    },
    conclusion: optionText(canonicalClass, input.language),
  };

  const learnerText = [stem, ...optionSet.options, explanation.opening, ...explanation.givens, ...explanation.steps, explanation.conclusion].join(" ");
  if (/undefined|null|NaN|Infinity|\{\{|\$\{/.test(learnerText)) errors.push("DS learner text contains unresolved content");
  if ((learnerText.match(/\\\(/g) ?? []).length !== (learnerText.match(/\\\)/g) ?? []).length) errors.push("DS learner text has unbalanced MathJax");

  return {
    archetypeId: "TMW-001" as const,
    canonicalProblemId: TMW_CP_013_ID,
    questionLanguageId: entry.qlId,
    solveMode: entry.solveMode,
    language: input.language,
    seed: input.seed,
    difficulty: entry.difficulty,
    representation: "DATA_SUFFICIENCY" as const,
    answerSemantic: "DATA_SUFFICIENCY_CLASS" as const,
    stem,
    options: optionSet.options,
    optionAudit: optionSet.optionAudit,
    correctIndex: optionSet.correctIndex,
    canonicalAnswer: optionText(canonicalClass, input.language),
    canonicalClass,
    verifierAnswer: optionText(classify(state), input.language),
    hiddenState: state,
    explanation,
    learnerExplanationVersion: "TMW_DS_V1" as const,
    mathematicalFingerprint: `${entry.solveMode}|${state.fingerprint}|I=${state.iCandidates.join("/")}|II=${state.iiCandidates.join("/")}|B=${state.combinedCandidates.join("/")}`,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false as const,
  };
}
