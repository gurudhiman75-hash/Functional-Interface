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

type DsClass =
  | "I_ONLY"
  | "II_ONLY"
  | "EITHER_ALONE"
  | "TOGETHER_ONLY"
  | "EVEN_TOGETHER_INSUFFICIENT";

type Entry = Readonly<{
  qlId: string;
  solveMode: TmwCp013SolveMode;
  expectedClass: DsClass;
  difficulty: "Medium" | "Hard";
}>;

type DsState = Readonly<{
  stemLead: string;
  statementI: string;
  statementII: string;
  targetLabel: string;
  iUnique: boolean;
  iiUnique: boolean;
  combinedUnique: boolean;
  iReason: string;
  iiReason: string;
  combinedReason: string;
  calculationSteps: readonly string[];
  verification: string;
  fingerprint: string;
}>;

const ENTRIES: readonly Entry[] = [
  { qlId: "TMW-QL-216", solveMode: "dataSufficiencyCombinedRates", expectedClass: "I_ONLY", difficulty: "Medium" },
  { qlId: "TMW-QL-217", solveMode: "dataSufficiencyEfficiencyRelation", expectedClass: "II_ONLY", difficulty: "Medium" },
  { qlId: "TMW-QL-218", solveMode: "dataSufficiencyStagedParticipation", expectedClass: "TOGETHER_ONLY", difficulty: "Hard" },
  { qlId: "TMW-QL-219", solveMode: "dataSufficiencyWorkforceSchedule", expectedClass: "EVEN_TOGETHER_INSUFFICIENT", difficulty: "Medium" },
  { qlId: "TMW-QL-220", solveMode: "dataSufficiencyHeterogeneousWorkers", expectedClass: "EITHER_ALONE", difficulty: "Medium" },
  { qlId: "TMW-QL-221", solveMode: "dataSufficiencyWageContribution", expectedClass: "II_ONLY", difficulty: "Medium" },
  { qlId: "TMW-QL-222", solveMode: "dataSufficiencyPipesAndLeak", expectedClass: "TOGETHER_ONLY", difficulty: "Hard" },
  { qlId: "TMW-QL-223", solveMode: "dataSufficiencyVariableProductivity", expectedClass: "EVEN_TOGETHER_INSUFFICIENT", difficulty: "Hard" },
];

const DS_OPTIONS: readonly DsClass[] = [
  "I_ONLY",
  "II_ONLY",
  "EITHER_ALONE",
  "TOGETHER_ONLY",
  "EVEN_TOGETHER_INSUFFICIENT",
];

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
  const unit = language === "en" ? (equals(value, rational(1)) ? "hour" : "hours") : language === "hi" ? (equals(value, rational(1)) ? "घंटा" : "घंटे") : (equals(value, rational(1)) ? "ਘੰਟਾ" : "ਘੰਟੇ");
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
    EITHER_ALONE: [
      "Either Statement I alone or Statement II alone is sufficient.",
      "कथन I अकेले या कथन II अकेले—दोनों में से कोई भी पर्याप्त है।",
      "ਕਥਨ I ਇਕੱਲਾ ਜਾਂ ਕਥਨ II ਇਕੱਲਾ—ਦੋਵਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਕਾਫ਼ੀ ਹੈ।",
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
  if (state.iUnique && state.iiUnique) return "EITHER_ALONE";
  if (state.iUnique && !state.iiUnique) return "I_ONLY";
  if (!state.iUnique && state.iiUnique) return "II_ONLY";
  if (!state.iUnique && !state.iiUnique && state.combinedUnique) return "TOGETHER_ONLY";
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
    iUnique: true,
    iiUnique: false,
    combinedUnique: true,
    iReason: text(language, `I gives B's rate exactly, so B's solo time is ${target}.`, `I से B की दर ठीक-ठीक मिलती है, इसलिए B का अकेले का समय ${target} है।`, `I ਤੋਂ B ਦੀ ਦਰ ਠੀਕ-ਠੀਕ ਮਿਲਦੀ ਹੈ, ਇਸ ਲਈ B ਦਾ ਇਕੱਲੇ ਦਾ ਸਮਾਂ ${target} ਹੈ।`),
    iiReason: text(language, "II gives only an inequality, so many solo times for B remain possible.", "II केवल एक असमानता देता है, इसलिए B के अकेले समय के कई मान संभव हैं।", "II ਸਿਰਫ਼ ਇੱਕ ਅਸਮਾਨਤਾ ਦਿੰਦਾ ਹੈ, ਇਸ ਲਈ B ਦੇ ਇਕੱਲੇ ਸਮੇਂ ਦੇ ਕਈ ਮੁੱਲ ਸੰਭਵ ਹਨ।"),
    combinedReason: text(language, "Combining is unnecessary because Statement I already fixes the target uniquely.", "दोनों को मिलाना आवश्यक नहीं है, क्योंकि कथन I अकेले ही लक्ष्य तय कर देता है।", "ਦੋਵੇਂ ਨੂੰ ਮਿਲਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ, ਕਿਉਂਕਿ ਕਥਨ I ਇਕੱਲਾ ਹੀ ਲਕਸ਼ ਤੈਅ ਕਰ ਦਿੰਦਾ ਹੈ।"),
    calculationSteps: [
      text(language, `From I, B's rate = \\(${toLatex(reciprocal(rational(state.together)))}-${toLatex(reciprocal(rational(state.a)))}=${toLatex(rateB)}\\).`, `I से B की दर = \\(${toLatex(reciprocal(rational(state.together)))}-${toLatex(reciprocal(rational(state.a)))}=${toLatex(rateB)}\\)।`, `I ਤੋਂ B ਦੀ ਦਰ = \\(${toLatex(reciprocal(rational(state.together)))}-${toLatex(reciprocal(rational(state.a)))}=${toLatex(rateB)}\\)।`),
      text(language, `Hence B alone takes ${target}.`, `अतः B अकेला ${target} लेता है।`, `ਇਸ ਲਈ B ਇਕੱਲਾ ${target} ਲੈਂਦਾ ਹੈ।`),
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
    stemLead: text(language, "A and B do the same kind of work. Can the efficiency ratio A:B be determined?", "A और B एक ही प्रकार का काम करते हैं। क्या दक्षता अनुपात A:B निर्धारित किया जा सकता है?", "A ਅਤੇ B ਇੱਕੋ ਕਿਸਮ ਦਾ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੀ ਕੁਸ਼ਲਤਾ ਅਨੁਪਾਤ A:B ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `Together they complete one job in ${state.together} days.`, `दोनों मिलकर एक काम ${state.together} दिनों में पूरा करते हैं।`, `ਦੋਵੇਂ ਮਿਲ ਕੇ ਇੱਕ ਕੰਮ ${state.together} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ।`),
    statementII: text(language, `A is ${state.percent}% more efficient than B.`, `A, B से ${state.percent}% अधिक दक्ष है।`, `A, B ਨਾਲੋਂ ${state.percent}% ਵੱਧ ਕੁਸ਼ਲ ਹੈ।`),
    targetLabel: state.ratio,
    iUnique: false,
    iiUnique: true,
    combinedUnique: true,
    iReason: text(language, "I fixes only the sum of the two rates, not their ratio.", "I केवल दोनों दरों का योग तय करता है, उनका अनुपात नहीं।", "I ਸਿਰਫ਼ ਦੋਵੇਂ ਦਰਾਂ ਦਾ ਜੋੜ ਤੈਅ ਕਰਦਾ ਹੈ, ਉਨ੍ਹਾਂ ਦਾ ਅਨੁਪਾਤ ਨਹੀਂ।"),
    iiReason: text(language, `II gives A:B = ${100 + state.percent}:100 = ${state.ratio}, so the ratio is unique.`, `II से A:B = ${100 + state.percent}:100 = ${state.ratio} मिलता है, इसलिए अनुपात निश्चित है।`, `II ਤੋਂ A:B = ${100 + state.percent}:100 = ${state.ratio} ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਅਨੁਪਾਤ ਨਿਸ਼ਚਿਤ ਹੈ।`),
    combinedReason: text(language, "Combining is unnecessary because Statement II already fixes the target uniquely.", "दोनों को मिलाना आवश्यक नहीं है, क्योंकि कथन II अकेले ही लक्ष्य तय कर देता है।", "ਦੋਵੇਂ ਨੂੰ ਮਿਲਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ, ਕਿਉਂਕਿ ਕਥਨ II ਇਕੱਲਾ ਹੀ ਲਕਸ਼ ਤੈਅ ਕਰ ਦਿੰਦਾ ਹੈ।"),
    calculationSteps: [
      text(language, `From II, A:B efficiency = ${100 + state.percent}:100 = ${state.ratio}.`, `II से A:B दक्षता = ${100 + state.percent}:100 = ${state.ratio}।`, `II ਤੋਂ A:B ਕੁਸ਼ਲਤਾ = ${100 + state.percent}:100 = ${state.ratio}।`),
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
  const total = add(rational(state.join), divide(remaining, jointRate));
  const target = dayText(total, language);
  return {
    stemLead: text(language, "A starts a job alone and B joins later. Can the total completion time be determined?", "A काम अकेले शुरू करता है और B बाद में जुड़ता है। क्या कुल पूरा होने का समय निर्धारित किया जा सकता है?", "A ਕੰਮ ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ B ਬਾਅਦ ਵਿੱਚ ਜੁੜਦਾ ਹੈ। ਕੀ ਕੁੱਲ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `A alone takes ${state.a} days and B alone takes ${state.b} days.`, `A अकेला ${state.a} दिन और B अकेला ${state.b} दिन लेता है।`, `A ਇਕੱਲਾ ${state.a} ਦਿਨ ਅਤੇ B ਇਕੱਲਾ ${state.b} ਦਿਨ ਲੈਂਦਾ ਹੈ।`),
    statementII: text(language, `B joins A after ${state.join} days from the start.`, `B शुरुआत के ${state.join} दिन बाद A से जुड़ता है।`, `B ਸ਼ੁਰੂਆਤ ਤੋਂ ${state.join} ਦਿਨ ਬਾਅਦ A ਨਾਲ ਜੁੜਦਾ ਹੈ।`),
    targetLabel: target,
    iUnique: false,
    iiUnique: false,
    combinedUnique: true,
    iReason: text(language, "I gives both work rates, but not when B starts working.", "I दोनों कार्य-दरें देता है, लेकिन B कब काम शुरू करता है यह नहीं।", "I ਦੋਵੇਂ ਕੰਮ-ਦਰਾਂ ਦਿੰਦਾ ਹੈ, ਪਰ B ਕਦੋਂ ਕੰਮ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਇਹ ਨਹੀਂ।"),
    iiReason: text(language, "II gives the joining time, but no work rates.", "II जुड़ने का समय देता है, लेकिन कार्य-दरें नहीं।", "II ਜੁੜਨ ਦਾ ਸਮਾਂ ਦਿੰਦਾ ਹੈ, ਪਰ ਕੰਮ-ਦਰਾਂ ਨਹੀਂ।"),
    combinedReason: text(language, `Together the rates and joining time are known, so the total time is uniquely ${target}.`, `दोनों कथनों से दरें और जुड़ने का समय मिलते हैं, इसलिए कुल समय निश्चित रूप से ${target} है।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਤੋਂ ਦਰਾਂ ਅਤੇ ਜੁੜਨ ਦਾ ਸਮਾਂ ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਕੁੱਲ ਸਮਾਂ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ${target} ਹੈ।`),
    calculationSteps: [
      text(language, `After ${state.join} days, remaining work = \\(${toLatex(remaining)}\\).`, `${state.join} दिन बाद शेष काम = \\(${toLatex(remaining)}\\)।`, `${state.join} ਦਿਨ ਬਾਅਦ ਬਾਕੀ ਕੰਮ = \\(${toLatex(remaining)}\\)।`),
      text(language, `A+B rate = \\(${toLatex(jointRate)}\\), giving total time ${target}.`, `A+B की दर = \\(${toLatex(jointRate)}\\), जिससे कुल समय ${target} मिलता है।`, `A+B ਦੀ ਦਰ = \\(${toLatex(jointRate)}\\), ਜਿਸ ਨਾਲ ਕੁੱਲ ਸਮਾਂ ${target} ਮਿਲਦਾ ਹੈ।`),
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
    stemLead: text(language, "All workers have equal efficiency and work equal hours per day. Can the exact number of workers assigned to a new schedule be determined?", "सभी कामगार समान दक्षता से और प्रतिदिन समान घंटे काम करते हैं। क्या नई समय-सारणी में लगाए गए कामगारों की सही संख्या निर्धारित की जा सकती है?", "ਸਾਰੇ ਮਜ਼ਦੂਰ ਇੱਕੋ ਕੁਸ਼ਲਤਾ ਨਾਲ ਅਤੇ ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੀ ਨਵੀਂ ਸਮਾਂ-ਸਾਰਣੀ ਵਿੱਚ ਲਗਾਏ ਮਜ਼ਦੂਰਾਂ ਦੀ ਸਹੀ ਗਿਣਤੀ ਨਿਰਧਾਰਤ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ?"),
    statementI: text(language, `${state.workers} workers complete the whole job in ${state.days} days.`, `${state.workers} कामगार पूरा काम ${state.days} दिनों में पूरा करते हैं।`, `${state.workers} ਮਜ਼ਦੂਰ ਪੂਰਾ ਕੰਮ ${state.days} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ।`),
    statementII: text(language, `The new team finishes the same job in fewer than ${state.upper} days.`, `नई टीम वही काम ${state.upper} दिनों से कम में पूरा करती है।`, `ਨਵੀਂ ਟੀਮ ਉਹੀ ਕੰਮ ${state.upper} ਦਿਨਾਂ ਤੋਂ ਘੱਟ ਵਿੱਚ ਪੂਰਾ ਕਰਦੀ ਹੈ।`),
    targetLabel: "not unique",
    iUnique: false,
    iiUnique: false,
    combinedUnique: false,
    iReason: text(language, `I fixes total work at ${work} worker-days, but says nothing about the new team's duration.`, `I कुल काम ${work} कामगार-दिन तय करता है, लेकिन नई टीम की अवधि नहीं बताता।`, `I ਕੁੱਲ ਕੰਮ ${work} ਮਜ਼ਦੂਰ-ਦਿਨ ਤੈਅ ਕਰਦਾ ਹੈ, ਪਰ ਨਵੀਂ ਟੀਮ ਦੀ ਮਿਆਦ ਨਹੀਂ ਦੱਸਦਾ।`),
    iiReason: text(language, `II gives only the inequality time < ${state.upper} days and no total-work value.`, `II केवल असमानता समय < ${state.upper} दिन देता है और कुल काम नहीं बताता।`, `II ਸਿਰਫ਼ ਅਸਮਾਨਤਾ ਸਮਾਂ < ${state.upper} ਦਿਨ ਦਿੰਦਾ ਹੈ ਅਤੇ ਕੁੱਲ ਕੰਮ ਨਹੀਂ ਦੱਸਦਾ।`),
    combinedReason: text(language, "Even together, several different worker counts can satisfy the stated time bound, so the assigned count is not unique.", "दोनों कथनों को मिलाने पर भी कई अलग कामगार-संख्याएँ दी गई समय-सीमा पूरी कर सकती हैं, इसलिए लगाई गई संख्या निश्चित नहीं होती।", "ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਮਿਲਾਉਣ ਤੇ ਵੀ ਕਈ ਵੱਖਰੀਆਂ ਮਜ਼ਦੂਰ-ਗਿਣਤੀਆਂ ਦਿੱਤੀ ਸਮਾਂ-ਸੀਮਾ ਪੂਰੀ ਕਰ ਸਕਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਲਗਾਈ ਗਿਣਤੀ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੁੰਦੀ।"),
    calculationSteps: [
      text(language, `From I, total work = ${state.workers}×${state.days} = ${work} worker-days.`, `I से कुल काम = ${state.workers}×${state.days} = ${work} कामगार-दिन।`, `I ਤੋਂ ਕੁੱਲ ਕੰਮ = ${state.workers}×${state.days} = ${work} ਮਜ਼ਦੂਰ-ਦਿਨ।`),
      text(language, `With only time < ${state.upper}, more than one crew size is possible; no exact assigned count follows.`, `केवल समय < ${state.upper} होने से एक से अधिक टीम-संख्याएँ संभव हैं; सही लगाई गई संख्या नहीं मिलती।`, `ਕੇਵਲ ਸਮਾਂ < ${state.upper} ਹੋਣ ਨਾਲ ਇੱਕ ਤੋਂ ਵੱਧ ਟੀਮ-ਗਿਣਤੀਆਂ ਸੰਭਵ ਹਨ; ਸਹੀ ਲਗਾਈ ਗਿਣਤੀ ਨਹੀਂ ਮਿਲਦੀ।`),
    ],
    verification: "Both statements still allow multiple assigned crew sizes.",
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
    statementII: text(language, `One man alone completes a fixed job in ${state.men} days, while one woman alone completes the same job in ${state.women} days.`, `एक पुरुष अकेला एक निश्चित काम ${state.men} दिनों में और एक महिला अकेली वही काम ${state.women} दिनों में पूरा करती है।`, `ਇੱਕ ਮਰਦ ਇਕੱਲਾ ਇੱਕ ਨਿਸ਼ਚਿਤ ਕੰਮ ${state.men} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ ਇੱਕ ਔਰਤ ਇਕੱਲੀ ਉਹੀ ਕੰਮ ${state.women} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੀ ਹੈ।`),
    targetLabel: ratio,
    iUnique: true,
    iiUnique: true,
    combinedUnique: true,
    iReason: text(language, `I gives ${state.men}E_m=${state.women}E_w, so the ratio is ${ratio}.`, `I से ${state.men}E_m=${state.women}E_w, इसलिए अनुपात ${ratio} है।`, `I ਤੋਂ ${state.men}E_m=${state.women}E_w, ਇਸ ਲਈ ਅਨੁਪਾਤ ${ratio} ਹੈ।`),
    iiReason: text(language, `II gives efficiency ratio as inverse time ratio ${state.women}:${state.men} = ${ratio}.`, `II से दक्षता अनुपात समय-अनुपात के व्युत्क्रम के रूप में ${state.women}:${state.men} = ${ratio} मिलता है।`, `II ਤੋਂ ਕੁਸ਼ਲਤਾ ਅਨੁਪਾਤ ਸਮਾਂ-ਅਨੁਪਾਤ ਦੇ ਉਲਟ ਵਜੋਂ ${state.women}:${state.men} = ${ratio} ਮਿਲਦਾ ਹੈ।`),
    combinedReason: text(language, "Each statement already fixes the same ratio independently; combining them is unnecessary.", "दोनों में से प्रत्येक कथन अकेले वही अनुपात तय करता है; उन्हें मिलाना आवश्यक नहीं है।", "ਦੋਵਾਂ ਵਿੱਚੋਂ ਹਰ ਕਥਨ ਇਕੱਲਾ ਉਹੀ ਅਨੁਪਾਤ ਤੈਅ ਕਰਦਾ ਹੈ; ਉਨ੍ਹਾਂ ਨੂੰ ਮਿਲਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।"),
    calculationSteps: [
      text(language, `From I: \\(${state.men}E_m=${state.women}E_w\\Rightarrow E_m:E_w=${ratio}\\).`, `I से: \\(${state.men}E_m=${state.women}E_w\\Rightarrow E_m:E_w=${ratio}\\)।`, `I ਤੋਂ: \\(${state.men}E_m=${state.women}E_w\\Rightarrow E_m:E_w=${ratio}\\)।`),
      text(language, `From II: efficiency is inversely proportional to solo time, so \\(E_m:E_w=${state.women}:${state.men}=${ratio}\\).`, `II से: दक्षता अकेले समय के व्युत्क्रमानुपाती है, इसलिए \\(E_m:E_w=${state.women}:${state.men}=${ratio}\\)।`, `II ਤੋਂ: ਕੁਸ਼ਲਤਾ ਇਕੱਲੇ ਸਮੇਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ, ਇਸ ਲਈ \\(E_m:E_w=${state.women}:${state.men}=${ratio}\\)।`),
    ],
    verification: `I and II independently give ratio ${ratio}.`,
    fingerprint: `heterogeneous:${state.men}:${state.women}:${ratio}`,
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
    stemLead: text(language, "A and B are paid in proportion to their work contributions. Can A's exact payment be determined?", "A और B को उनके कार्य-योगदान के अनुपात में भुगतान मिलता है। क्या A का सही भुगतान निर्धारित किया जा सकता है?", "A ਅਤੇ B ਨੂੰ ਉਨ੍ਹਾਂ ਦੇ ਕੰਮ-ਯੋਗਦਾਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਭੁਗਤਾਨ ਮਿਲਦਾ ਹੈ। ਕੀ A ਦਾ ਸਹੀ ਭੁਗਤਾਨ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `The total payment pool is ₹${toMixedLatex(totalPay)}.`, `कुल भुगतान राशि ₹${toMixedLatex(totalPay)} है।`, `ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ ₹${toMixedLatex(totalPay)} ਹੈ।`),
    statementII: text(language, `A:B contribution = ${state.a}:${state.b}, and B receives ₹${state.bPay}.`, `A:B का योगदान ${state.a}:${state.b} है और B को ₹${state.bPay} मिलते हैं।`, `A:B ਦਾ ਯੋਗਦਾਨ ${state.a}:${state.b} ਹੈ ਅਤੇ B ਨੂੰ ₹${state.bPay} ਮਿਲਦੇ ਹਨ।`),
    targetLabel: target,
    iUnique: false,
    iiUnique: true,
    combinedUnique: true,
    iReason: text(language, "I gives only the total pool; without a contribution ratio, A's share is not fixed.", "I केवल कुल राशि देता है; योगदान अनुपात के बिना A का हिस्सा तय नहीं है।", "I ਸਿਰਫ਼ ਕੁੱਲ ਰਕਮ ਦਿੰਦਾ ਹੈ; ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਤੋਂ ਬਿਨਾਂ A ਦਾ ਹਿੱਸਾ ਤੈਅ ਨਹੀਂ ਹੈ।"),
    iiReason: text(language, `II fixes A's payment from the ratio and B's payment, giving ${target}.`, `II योगदान अनुपात और B के भुगतान से A का भुगतान ${target} तय कर देता है।`, `II ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਅਤੇ B ਦੇ ਭੁਗਤਾਨ ਤੋਂ A ਦਾ ਭੁਗਤਾਨ ${target} ਤੈਅ ਕਰ ਦਿੰਦਾ ਹੈ।`),
    combinedReason: text(language, "Combining is unnecessary because Statement II already fixes A's payment.", "दोनों को मिलाना आवश्यक नहीं है, क्योंकि कथन II अकेले ही A का भुगतान तय कर देता है।", "ਦੋਵੇਂ ਨੂੰ ਮਿਲਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ, ਕਿਉਂਕਿ ਕਥਨ II ਇਕੱਲਾ ਹੀ A ਦਾ ਭੁਗਤਾਨ ਤੈਅ ਕਰ ਦਿੰਦਾ ਹੈ।"),
    calculationSteps: [
      text(language, `From II, A's payment = \\(₹${state.bPay}\\times${state.a}/${state.b}=₹${toMixedLatex(aPay)}\\).`, `II से A का भुगतान = \\(₹${state.bPay}\\times${state.a}/${state.b}=₹${toMixedLatex(aPay)}\\)।`, `II ਤੋਂ A ਦਾ ਭੁਗਤਾਨ = \\(₹${state.bPay}\\times${state.a}/${state.b}=₹${toMixedLatex(aPay)}\\)।`),
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
  const inletRate = reciprocal(rational(state.inlet));
  const leakRate = reciprocal(rational(state.leak));
  const netRate = subtract(inletRate, leakRate);
  const total = reciprocal(netRate);
  const target = hoursText(total, language);
  return {
    stemLead: text(language, "A filling pipe fills a tank while a leak empties it. If both remain open, can the exact filling time be determined?", "एक भराव पाइप टंकी भरता है और एक रिसाव उसे खाली करता है। यदि दोनों खुले रहें, तो क्या सही भरने का समय निर्धारित किया जा सकता है?", "ਇੱਕ ਭਰਾਵ ਪਾਈਪ ਟੈਂਕ ਭਰਦਾ ਹੈ ਅਤੇ ਇੱਕ ਰਿਸਾਅ ਇਸ ਨੂੰ ਖਾਲੀ ਕਰਦਾ ਹੈ। ਜੇ ਦੋਵੇਂ ਖੁੱਲ੍ਹੇ ਰਹਿਣ, ਤਾਂ ਕੀ ਸਹੀ ਭਰਨ ਦਾ ਸਮਾਂ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `The filling pipe alone fills the tank in ${state.inlet} hours.`, `भराव पाइप अकेला टंकी को ${state.inlet} घंटे में भरता है।`, `ਭਰਾਵ ਪਾਈਪ ਇਕੱਲਾ ਟੈਂਕ ਨੂੰ ${state.inlet} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ।`),
    statementII: text(language, `The leak alone empties a full tank in ${state.leak} hours.`, `रिसाव अकेला भरी टंकी को ${state.leak} घंटे में खाली करता है।`, `ਰਿਸਾਅ ਇਕੱਲਾ ਭਰੇ ਟੈਂਕ ਨੂੰ ${state.leak} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ।`),
    targetLabel: target,
    iUnique: false,
    iiUnique: false,
    combinedUnique: true,
    iReason: text(language, "I gives the filling rate but not the leak rate, so the net rate is unknown.", "I भरने की दर देता है, लेकिन रिसाव की दर नहीं; इसलिए शुद्ध दर अज्ञात है।", "I ਭਰਨ ਦੀ ਦਰ ਦਿੰਦਾ ਹੈ, ਪਰ ਰਿਸਾਅ ਦੀ ਦਰ ਨਹੀਂ; ਇਸ ਲਈ ਸ਼ੁੱਧ ਦਰ ਅਣਜਾਣ ਹੈ।"),
    iiReason: text(language, "II gives the leak rate but not the filling rate, so the net rate is unknown.", "II रिसाव की दर देता है, लेकिन भरने की दर नहीं; इसलिए शुद्ध दर अज्ञात है।", "II ਰਿਸਾਅ ਦੀ ਦਰ ਦਿੰਦਾ ਹੈ, ਪਰ ਭਰਨ ਦੀ ਦਰ ਨਹੀਂ; ਇਸ ਲਈ ਸ਼ੁੱਧ ਦਰ ਅਣਜਾਣ ਹੈ।"),
    combinedReason: text(language, `Together the signed rates give a unique net filling time of ${target}.`, `दोनों कथनों से धनात्मक भराव-दर और ऋणात्मक रिसाव-दर मिलती हैं, इसलिए शुद्ध भरने का समय निश्चित रूप से ${target} है।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਤੋਂ ਧਨਾਤਮਕ ਭਰਾਵ-ਦਰ ਅਤੇ ਰਣਾਤਮਕ ਰਿਸਾਅ-ਦਰ ਮਿਲਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਸ਼ੁੱਧ ਭਰਨ ਦਾ ਸਮਾਂ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ${target} ਹੈ।`),
    calculationSteps: [
      text(language, `Net rate = \\(${toLatex(inletRate)}-${toLatex(leakRate)}=${toLatex(netRate)}\\).`, `शुद्ध दर = \\(${toLatex(inletRate)}-${toLatex(leakRate)}=${toLatex(netRate)}\\)।`, `ਸ਼ੁੱਧ ਦਰ = \\(${toLatex(inletRate)}-${toLatex(leakRate)}=${toLatex(netRate)}\\)।`),
      text(language, `Therefore the tank fills in ${target}.`, `अतः टंकी ${target} में भरती है।`, `ਇਸ ਲਈ ਟੈਂਕ ${target} ਵਿੱਚ ਭਰਦਾ ਹੈ।`),
    ],
    verification: `Together uniquely gives net fill time ${target}; each alone lacks one signed rate.`,
    fingerprint: `pipes:${state.inlet}:${state.leak}:${total.numerator}/${total.denominator}`,
  };
}

function variableState(seed: string, language: TmwLanguage): DsState {
  const delta = pick([2, 3, 4, 5] as const, seed, "cp013-variable");
  return {
    stemLead: text(language, "A worker's daily output forms an arithmetic progression. Can the exact total output during the first 5 days be determined?", "एक कामगार का दैनिक उत्पादन अंकगणितीय श्रेणी में है। क्या पहले 5 दिनों का सही कुल उत्पादन निर्धारित किया जा सकता है?", "ਇੱਕ ਮਜ਼ਦੂਰ ਦਾ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਅੰਕਗਣਿਤ ਲੜੀ ਵਿੱਚ ਹੈ। ਕੀ ਪਹਿਲੇ 5 ਦਿਨਾਂ ਦਾ ਸਹੀ ਕੁੱਲ ਉਤਪਾਦਨ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"),
    statementI: text(language, `Daily output increases by ${delta} units each day.`, `दैनिक उत्पादन हर दिन ${delta} इकाइयों से बढ़ता है।`, `ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਹਰ ਦਿਨ ${delta} ਇਕਾਈਆਂ ਨਾਲ ਵਧਦਾ ਹੈ।`),
    statementII: text(language, `Day 5 output is ${4 * delta} units more than Day 1 output.`, `दिन 5 का उत्पादन दिन 1 से ${4 * delta} इकाइयाँ अधिक है।`, `ਦਿਨ 5 ਦਾ ਉਤਪਾਦਨ ਦਿਨ 1 ਨਾਲੋਂ ${4 * delta} ਇਕਾਈਆਂ ਵੱਧ ਹੈ।`),
    targetLabel: "not unique",
    iUnique: false,
    iiUnique: false,
    combinedUnique: false,
    iReason: text(language, `I fixes only the common difference d=${delta}; Day 1 output is still unknown.`, `I केवल समान अंतर d=${delta} तय करता है; दिन 1 का उत्पादन अभी भी अज्ञात है।`, `I ਸਿਰਫ਼ ਸਾਂਝਾ ਅੰਤਰ d=${delta} ਤੈਅ ਕਰਦਾ ਹੈ; ਦਿਨ 1 ਦਾ ਉਤਪਾਦਨ ਹਾਲੇ ਵੀ ਅਣਜਾਣ ਹੈ।`),
    iiReason: text(language, `II gives Day 5 − Day 1 = ${4 * delta} = 4d, so it also fixes only d, not Day 1 output.`, `II दिन 5 − दिन 1 = ${4 * delta} = 4d देता है, इसलिए यह भी केवल d तय करता है, दिन 1 का उत्पादन नहीं।`, `II ਦਿਨ 5 − ਦਿਨ 1 = ${4 * delta} = 4d ਦਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਵੀ ਸਿਰਫ਼ d ਤੈਅ ਕਰਦਾ ਹੈ, ਦਿਨ 1 ਦਾ ਉਤਪਾਦਨ ਨਹੀਂ।`),
    combinedReason: text(language, "The two statements are redundant; together they still do not give the first term, so the 5-day total is not unique.", "दोनों कथन एक ही जानकारी देते हैं; मिलाकर भी पहला पद नहीं मिलता, इसलिए 5-दिन का कुल उत्पादन निश्चित नहीं है।", "ਦੋਵੇਂ ਕਥਨ ਇੱਕੋ ਜਾਣਕਾਰੀ ਦਿੰਦੇ ਹਨ; ਮਿਲਾ ਕੇ ਵੀ ਪਹਿਲਾ ਪਦ ਨਹੀਂ ਮਿਲਦਾ, ਇਸ ਲਈ 5-ਦਿਨ ਦਾ ਕੁੱਲ ਉਤਪਾਦਨ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ।"),
    calculationSteps: [
      text(language, `For an AP, Day 5 − Day 1 = 4d; both statements give d=${delta}.`, `अंकगणितीय श्रेणी में दिन 5 − दिन 1 = 4d; दोनों कथन d=${delta} ही देते हैं।`, `ਅੰਕਗਣਿਤ ਲੜੀ ਵਿੱਚ ਦਿਨ 5 − ਦਿਨ 1 = 4d; ਦੋਵੇਂ ਕਥਨ d=${delta} ਹੀ ਦਿੰਦੇ ਹਨ।`),
      text(language, "Without Day 1 output, several different 5-day totals are possible.", "दिन 1 का उत्पादन न मिलने से कई अलग 5-दिन के कुल संभव हैं।", "ਦਿਨ 1 ਦਾ ਉਤਪਾਦਨ ਨਾ ਮਿਲਣ ਕਰਕੇ ਕਈ ਵੱਖਰੇ 5-ਦਿਨ ਦੇ ਕੁੱਲ ਸੰਭਵ ਹਨ।"),
    ],
    verification: `Both statements only fix d=${delta}; first term remains free.`,
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
  const correctIndex = seedNumber(seed, "cp013-five-way-correct-index") % DS_OPTIONS.length;
  const others = DS_OPTIONS.filter((value) => value !== answer);
  const arranged = [...others];
  arranged.splice(correctIndex, 0, answer);
  return {
    correctIndex,
    classes: arranged,
    options: arranged.map((value) => optionText(value, language)),
    optionAudit: arranged.map((value) => ({
      text: optionText(value, language),
      value,
      misconceptionId: value === answer ? "CORRECT" : `WRONG_${value}`,
    })),
  };
}

function sufficiencyWord(value: boolean, language: TmwLanguage): string {
  return value
    ? text(language, "SUFFICIENT", "पर्याप्त", "ਕਾਫ਼ੀ")
    : text(language, "NOT SUFFICIENT", "अपर्याप्त", "ਅਕਾਫ਼ੀ");
}

function trapClass(answer: DsClass): DsClass {
  switch (answer) {
    case "I_ONLY": return "TOGETHER_ONLY";
    case "II_ONLY": return "TOGETHER_ONLY";
    case "EITHER_ALONE": return "I_ONLY";
    case "TOGETHER_ONLY": return "EITHER_ALONE";
    case "EVEN_TOGETHER_INSUFFICIENT": return "TOGETHER_ONLY";
  }
}

function trapExplanation(answer: DsClass, language: TmwLanguage): string {
  switch (answer) {
    case "I_ONLY":
      return text(language, "A common mistake is to combine the statements even though Statement I already determines the target and Statement II does not.", "सामान्य गलती दोनों कथनों को मिला देना है, जबकि कथन I अकेले ही लक्ष्य तय करता है और कथन II नहीं करता।", "ਆਮ ਗਲਤੀ ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਮਿਲਾ ਦੇਣਾ ਹੈ, ਜਦਕਿ ਕਥਨ I ਇਕੱਲਾ ਹੀ ਲਕਸ਼ ਤੈਅ ਕਰਦਾ ਹੈ ਅਤੇ ਕਥਨ II ਨਹੀਂ ਕਰਦਾ।");
    case "II_ONLY":
      return text(language, "A common mistake is to combine the statements even though Statement II already determines the target and Statement I does not.", "सामान्य गलती दोनों कथनों को मिला देना है, जबकि कथन II अकेले ही लक्ष्य तय करता है और कथन I नहीं करता।", "ਆਮ ਗਲਤੀ ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਮਿਲਾ ਦੇਣਾ ਹੈ, ਜਦਕਿ ਕਥਨ II ਇਕੱਲਾ ਹੀ ਲਕਸ਼ ਤੈਅ ਕਰਦਾ ਹੈ ਅਤੇ ਕਥਨ I ਨਹੀਂ ਕਰਦਾ।");
    case "EITHER_ALONE":
      return text(language, "Do not stop after finding one sufficient statement; the other statement must also be checked independently, because both are sufficient here.", "एक कथन पर्याप्त मिलते ही न रुकें; दूसरे कथन को भी अलग से जाँचना जरूरी है, क्योंकि यहाँ दोनों कथन अपने-अपने दम पर पर्याप्त हैं।", "ਇੱਕ ਕਥਨ ਕਾਫ਼ੀ ਮਿਲਦੇ ਹੀ ਨਾ ਰੁਕੋ; ਦੂਜੇ ਕਥਨ ਨੂੰ ਵੀ ਵੱਖਰੇ ਤੌਰ ਤੇ ਜਾਂਚਣਾ ਜ਼ਰੂਰੀ ਹੈ, ਕਿਉਂਕਿ ਇੱਥੇ ਦੋਵੇਂ ਕਥਨ ਆਪਣੇ-ਆਪ ਕਾਫ਼ੀ ਹਨ।");
    case "TOGETHER_ONLY":
      return text(language, "Do not assume that a useful-looking statement is sufficient by itself; here each statement misses one required piece and only the pair fixes the target.", "किसी उपयोगी दिखने वाले कथन को अकेले पर्याप्त न मानें; यहाँ हर कथन में एक जरूरी जानकारी कम है और केवल दोनों मिलकर लक्ष्य तय करते हैं।", "ਕਿਸੇ ਲਾਭਦਾਇਕ ਦਿਖਦੇ ਕਥਨ ਨੂੰ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਾ ਮੰਨੋ; ਇੱਥੇ ਹਰ ਕਥਨ ਵਿੱਚ ਇੱਕ ਲੋੜੀਂਦੀ ਜਾਣਕਾਰੀ ਘੱਟ ਹੈ ਅਤੇ ਕੇਵਲ ਦੋਵੇਂ ਮਿਲ ਕੇ ਲਕਸ਼ ਤੈਅ ਕਰਦੇ ਹਨ।");
    case "EVEN_TOGETHER_INSUFFICIENT":
      return text(language, "Do not assume that two statements must become sufficient when combined; if multiple target values still remain possible, the data are insufficient.", "यह न मानें कि दो कथन मिलकर अवश्य पर्याप्त हो जाएंगे; यदि लक्ष्य के कई मान अभी भी संभव हैं, तो डेटा अपर्याप्त है।", "ਇਹ ਨਾ ਮੰਨੋ ਕਿ ਦੋ ਕਥਨ ਮਿਲ ਕੇ ਜ਼ਰੂਰ ਕਾਫ਼ੀ ਹੋ ਜਾਣਗੇ; ਜੇ ਲਕਸ਼ ਦੇ ਕਈ ਮੁੱਲ ਹਾਲੇ ਵੀ ਸੰਭਵ ਹਨ, ਤਾਂ ਡਾਟਾ ਅਕਾਫ਼ੀ ਹੈ।");
  }
}

export function runTmwCp013DataSufficiencyPipeline(input: { questionLanguageId: string; seed: string; language: TmwLanguage }) {
  const entry = entryFor(input.questionLanguageId);
  const state = buildState(entry, input.seed, input.language);
  const canonicalClass = classify(state);
  const optionSet = shuffledOptions(canonicalClass, `${input.seed}:${entry.qlId}`, input.language);
  const errors: string[] = [];

  if (canonicalClass !== entry.expectedClass) errors.push(`DS class mismatch: expected ${entry.expectedClass}, got ${canonicalClass}`);
  if (optionSet.options.length !== 5 || new Set(optionSet.options).size !== 5) errors.push("DS options must contain five unique banking-style choices");
  if (optionSet.optionAudit[optionSet.correctIndex]?.misconceptionId !== "CORRECT") errors.push("DS correct option position is inconsistent");

  const stem = `${state.stemLead} ${text(input.language, "Statement I:", "कथन I:", "ਕਥਨ I:")} ${state.statementI} ${text(input.language, "Statement II:", "कथन II:", "ਕਥਨ II:")} ${state.statementII}`;
  if (stem.trim().split(/\s+/u).filter(Boolean).length > 105) errors.push("DS stem exceeds 105 whitespace tokens");

  const iCheck = text(input.language, `Statement I alone: ${state.iReason} → ${sufficiencyWord(state.iUnique, input.language)}.`, `केवल कथन I: ${state.iReason} → ${sufficiencyWord(state.iUnique, input.language)}।`, `ਕੇਵਲ ਕਥਨ I: ${state.iReason} → ${sufficiencyWord(state.iUnique, input.language)}।`);
  const iiCheck = text(input.language, `Statement II alone: ${state.iiReason} → ${sufficiencyWord(state.iiUnique, input.language)}.`, `केवल कथन II: ${state.iiReason} → ${sufficiencyWord(state.iiUnique, input.language)}।`, `ਕੇਵਲ ਕਥਨ II: ${state.iiReason} → ${sufficiencyWord(state.iiUnique, input.language)}।`);
  const togetherCheck = text(input.language, `Using both statements: ${state.combinedReason} → ${sufficiencyWord(state.combinedUnique, input.language)}.`, `दोनों कथनों से: ${state.combinedReason} → ${sufficiencyWord(state.combinedUnique, input.language)}।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਨਾਲ: ${state.combinedReason} → ${sufficiencyWord(state.combinedUnique, input.language)}।`);
  const conclusion = optionText(canonicalClass, input.language);
  const wrongClass = trapClass(canonicalClass);

  const explanation = {
    opening: text(input.language, "Data sufficiency is a decision problem: check Statement I alone, reset, check Statement II alone, and combine only when needed. A statement is sufficient only if it fixes one unique answer to the question asked.", "डेटा-पर्याप्तता में निर्णय करना है: पहले कथन I को अकेले जाँचें, फिर नई शुरुआत करके कथन II को अकेले जाँचें और जरूरत होने पर ही दोनों को मिलाएँ। कोई कथन तभी पर्याप्त है जब वह पूछे गए प्रश्न का एक निश्चित उत्तर तय करे।", "ਡਾਟਾ-ਪੂਰਤਾ ਵਿੱਚ ਫੈਸਲਾ ਕਰਨਾ ਹੈ: ਪਹਿਲਾਂ ਕਥਨ I ਨੂੰ ਇਕੱਲਾ ਜਾਂਚੋ, ਫਿਰ ਨਵੀਂ ਸ਼ੁਰੂਆਤ ਕਰਕੇ ਕਥਨ II ਨੂੰ ਇਕੱਲਾ ਜਾਂਚੋ ਅਤੇ ਲੋੜ ਹੋਣ ਤੇ ਹੀ ਦੋਵੇਂ ਨੂੰ ਮਿਲਾਓ। ਕੋਈ ਕਥਨ ਤਦੋਂ ਹੀ ਕਾਫ਼ੀ ਹੈ ਜਦੋਂ ਉਹ ਪੁੱਛੇ ਸਵਾਲ ਦਾ ਇੱਕ ਨਿਸ਼ਚਿਤ ਜਵਾਬ ਤੈਅ ਕਰੇ।"),
    givens: [iCheck, iiCheck],
    formula: "",
    steps: [...state.calculationSteps, togetherCheck],
    shortcut: {
      title: text(input.language, "Data-Sufficiency Decision Rule", "डेटा-पर्याप्तता निर्णय नियम", "ਡਾਟਾ-ਪੂਰਤਾ ਫੈਸਲਾ ਨਿਯਮ"),
      steps: [
        text(input.language, "1. Test Statement I alone; do not use Statement II.", "1. केवल कथन I जाँचें; कथन II का उपयोग न करें।", "1. ਕੇਵਲ ਕਥਨ I ਜਾਂਚੋ; ਕਥਨ II ਨਾ ਵਰਤੋ।"),
        text(input.language, "2. Reset and test Statement II alone; do not carry information from I.", "2. नई शुरुआत करके केवल कथन II जाँचें; कथन I की जानकारी साथ न लें।", "2. ਨਵੀਂ ਸ਼ੁਰੂਆਤ ਕਰਕੇ ਕੇਵਲ ਕਥਨ II ਜਾਂਚੋ; ਕਥਨ I ਦੀ ਜਾਣਕਾਰੀ ਨਾਲ ਨਾ ਲਵੋ।"),
        text(input.language, "3. If neither is sufficient alone, combine them and check whether the target becomes unique.", "3. यदि कोई भी अकेले पर्याप्त न हो, तभी दोनों को मिलाकर देखें कि लक्ष्य का एक निश्चित मान मिलता है या नहीं।", "3. ਜੇ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਾ ਹੋਵੇ, ਤਦੋਂ ਹੀ ਦੋਵੇਂ ਨੂੰ ਮਿਲਾ ਕੇ ਵੇਖੋ ਕਿ ਲਕਸ਼ ਦਾ ਇੱਕ ਨਿਸ਼ਚਿਤ ਮੁੱਲ ਮਿਲਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।"),
      ],
    },
    commonTrap: {
      optionLabel: text(input.language, "Common trap", "सामान्य गलती", "ਆਮ ਗਲਤੀ"),
      optionText: optionText(wrongClass, input.language),
      misconceptionId: `WRONG_${wrongClass}`,
      explanation: trapExplanation(canonicalClass, input.language),
    },
    conclusion,
  };

  const learnerExplanation = {
    method: text(input.language, "Use the standard five-way banking data-sufficiency test: I alone → reset → II alone → both together only if needed.", "मानक पाँच-विकल्प बैंकिंग डेटा-पर्याप्तता परीक्षण अपनाएँ: I अकेले → नई शुरुआत → II अकेले → जरूरत होने पर दोनों साथ।", "ਮਿਆਰੀ ਪੰਜ-ਵਿਕਲਪ ਬੈਂਕਿੰਗ ਡਾਟਾ-ਪੂਰਤਾ ਜਾਂਚ ਵਰਤੋ: I ਇਕੱਲਾ → ਨਵੀਂ ਸ਼ੁਰੂਆਤ → II ਇਕੱਲਾ → ਲੋੜ ਹੋਵੇ ਤਾਂ ਦੋਵੇਂ ਇਕੱਠੇ।"),
    solution: [iCheck, iiCheck, ...state.calculationSteps, togetherCheck],
    answer: conclusion,
  };

  const learnerText = [
    stem,
    ...optionSet.options,
    explanation.opening,
    ...explanation.givens,
    ...explanation.steps,
    ...explanation.shortcut.steps,
    explanation.commonTrap.explanation,
    conclusion,
    learnerExplanation.method,
    ...learnerExplanation.solution,
    learnerExplanation.answer,
  ].join(" ");

  if (/undefined|null|NaN|Infinity|\{\{|\$\{/.test(learnerText)) errors.push("DS learner text contains unresolved content");
  if ((learnerText.match(/\\\(/g) ?? []).length !== (learnerText.match(/\\\)/g) ?? []).length) errors.push("DS learner text has unbalanced MathJax");
  for (const math of learnerText.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    if (/[\u0900-\u097F\u0A00-\u0A7F]/u.test(math[1] ?? "")) errors.push("Localized prose leaked inside MathJax");
  }

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
    canonicalAnswer: conclusion,
    canonicalClass,
    verifierAnswer: optionText(classify(state), input.language),
    hiddenState: state,
    explanation,
    learnerExplanation,
    learnerExplanationVersion: "TMW_DS_V2" as const,
    mathematicalFingerprint: `${entry.solveMode}|${state.fingerprint}|class=${canonicalClass}`,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false as const,
  };
}