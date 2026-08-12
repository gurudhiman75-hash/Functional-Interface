import { add, compare, divide, equals, multiply, rational, rationalKey, reciprocal, subtract, toLatex, toMixedLatex } from "./rational";
import { pick, seedNumber } from "./cp001-helpers";
import type { Rational, TmwLanguage } from "./types";

export const TMW_CP_012_ID = "TMW-CP-012" as const;

export const TMW_CP_012_SOLVE_MODES = [
  "findExcludedIndividualTimeFromAllTogetherAndSubgroup",
  "findNewCombinedTimeAfterMemberEfficiencyIncrease",
  "findTimeSavedAfterMemberEfficiencyIncrease",
  "findDelayAfterMemberEfficiencyDecrease",
] as const;

export type TmwCp012SolveMode = (typeof TMW_CP_012_SOLVE_MODES)[number];

type MisconceptionId =
  | "CORRECT"
  | "SUBTRACT_TIMES_INSTEAD_OF_RATES"
  | "SUBGROUP_TIME_REPORTED"
  | "ALL_TOGETHER_TIME_REPORTED"
  | "WHOLE_TEAM_PERCENT_CHANGED"
  | "PERCENT_APPLIED_DIRECTLY_TO_TIME"
  | "ORIGINAL_TIME_REPORTED"
  | "CHANGED_TIME_REPORTED"
  | "PLAUSIBLE_SCALE_ERROR";

interface Entry {
  qlId: string;
  solveMode: TmwCp012SolveMode;
  difficulty: "Medium" | "Hard";
}

interface CoverageParameters {
  subgroupTime?: Rational;
  allTogetherTime?: Rational;
  excludedTime?: Rational;
  efficiencyA?: Rational;
  efficiencyB?: Rational;
  originalCombinedTime?: Rational;
  changePercent?: Rational;
  changeDirection?: "INCREASE" | "DECREASE";
  changedCombinedTime?: Rational;
}

interface OptionAudit {
  text: string;
  value: Rational;
  misconceptionId: MisconceptionId;
}

const ENTRIES: readonly Entry[] = [
  { qlId: "TMW-QL-212", solveMode: "findExcludedIndividualTimeFromAllTogetherAndSubgroup", difficulty: "Medium" },
  { qlId: "TMW-QL-213", solveMode: "findNewCombinedTimeAfterMemberEfficiencyIncrease", difficulty: "Hard" },
  { qlId: "TMW-QL-214", solveMode: "findTimeSavedAfterMemberEfficiencyIncrease", difficulty: "Hard" },
  { qlId: "TMW-QL-215", solveMode: "findDelayAfterMemberEfficiencyDecrease", difficulty: "Hard" },
];

const subgroupStates = [
  { subgroup: 10, excluded: 15 },
  { subgroup: 12, excluded: 24 },
  { subgroup: 15, excluded: 30 },
  { subgroup: 8, excluded: 24 },
] as const;

const increaseStates = [
  { a: 2, b: 1, original: 12, percent: 50 },
  { a: 1, b: 1, original: 12, percent: 50 },
  { a: 4, b: 1, original: 15, percent: 25 },
  { a: 3, b: 2, original: 10, percent: 50 },
] as const;

const decreaseStates = [
  { a: 2, b: 1, original: 12, percent: 50 },
  { a: 1, b: 1, original: 12, percent: 50 },
  { a: 4, b: 1, original: 10, percent: 50 },
  { a: 3, b: 2, original: 10, percent: 50 },
] as const;

function entryFor(qlId: string): Entry {
  const entry = ENTRIES.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`Unknown TMW-CP-012 question language: ${qlId}`);
  return entry;
}

function positive(value: Rational): boolean {
  return compare(value, rational(0)) > 0;
}

function timeText(value: Rational, language: TmwLanguage): string {
  const unit = language === "en" ? (equals(value, rational(1)) ? "day" : "days") : language === "hi" ? "दिन" : "ਦਿਨ";
  if (value.denominator === 1) return `${value.numerator} ${unit}`;
  return `\\(${toMixedLatex(value)}\\) ${unit}`;
}

function languageText(language: TmwLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function buildParameters(entry: Entry, seed: string): CoverageParameters {
  if (entry.solveMode === "findExcludedIndividualTimeFromAllTogetherAndSubgroup") {
    const state = pick(subgroupStates, seed, "cp012-subgroup-state");
    const subgroupTime = rational(state.subgroup);
    const excludedTime = rational(state.excluded);
    const allTogetherTime = reciprocal(add(reciprocal(subgroupTime), reciprocal(excludedTime)));
    return { subgroupTime, allTogetherTime, excludedTime };
  }

  const state = entry.solveMode === "findDelayAfterMemberEfficiencyDecrease"
    ? pick(decreaseStates, seed, `cp012-efficiency-state:${entry.solveMode}`)
    : pick(increaseStates, seed, `cp012-efficiency-state:${entry.solveMode}`);
  const efficiencyA = rational(state.a);
  const efficiencyB = rational(state.b);
  const originalCombinedTime = rational(state.original);
  const changePercent = rational(state.percent);
  const direction = entry.solveMode === "findDelayAfterMemberEfficiencyDecrease" ? "DECREASE" as const : "INCREASE" as const;
  const multiplier = direction === "INCREASE" ? rational(100 + state.percent, 100) : rational(100 - state.percent, 100);
  const originalUnits = add(efficiencyA, efficiencyB);
  const changedUnits = add(multiply(efficiencyA, multiplier), efficiencyB);
  const changedCombinedTime = divide(multiply(originalCombinedTime, originalUnits), changedUnits);
  return {
    efficiencyA,
    efficiencyB,
    originalCombinedTime,
    changePercent,
    changeDirection: direction,
    changedCombinedTime,
  };
}

function solve(entry: Entry, p: CoverageParameters): Rational {
  switch (entry.solveMode) {
    case "findExcludedIndividualTimeFromAllTogetherAndSubgroup":
      return p.excludedTime!;
    case "findNewCombinedTimeAfterMemberEfficiencyIncrease":
      return p.changedCombinedTime!;
    case "findTimeSavedAfterMemberEfficiencyIncrease":
      return subtract(p.originalCombinedTime!, p.changedCombinedTime!);
    case "findDelayAfterMemberEfficiencyDecrease":
      return subtract(p.changedCombinedTime!, p.originalCombinedTime!);
  }
}

function stem(entry: Entry, p: CoverageParameters, language: TmwLanguage): string {
  if (entry.solveMode === "findExcludedIndividualTimeFromAllTogetherAndSubgroup") {
    const all = timeText(p.allTogetherTime!, language);
    const subgroup = timeText(p.subgroupTime!, language);
    return languageText(
      language,
      `A, B and C together complete a job in ${all}. A and B together complete the same job in ${subgroup}. In how many days can C alone complete it?`,
      `A, B और C मिलकर एक काम ${all} में पूरा करते हैं। A और B मिलकर वही काम ${subgroup} में पूरा करते हैं। C अकेला यह काम कितने दिनों में पूरा करेगा?`,
      `A, B ਅਤੇ C ਮਿਲ ਕੇ ਇੱਕ ਕੰਮ ${all} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। A ਅਤੇ B ਮਿਲ ਕੇ ਉਹੀ ਕੰਮ ${subgroup} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। C ਇਕੱਲਾ ਇਹ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰੇਗਾ?`,
    );
  }

  const original = timeText(p.originalCombinedTime!, language);
  const a = p.efficiencyA!.numerator;
  const b = p.efficiencyB!.numerator;
  const percent = p.changePercent!.numerator;
  const isDecrease = p.changeDirection === "DECREASE";
  const changeEn = isDecrease ? `${percent}% less efficient` : `${percent}% more efficient`;
  const changeHi = isDecrease ? `${percent}% कम दक्ष` : `${percent}% अधिक दक्ष`;
  const changePa = isDecrease ? `${percent}% ਘੱਟ ਕੁਸ਼ਲ` : `${percent}% ਵੱਧ ਕੁਸ਼ਲ`;
  const targetEn = entry.solveMode === "findNewCombinedTimeAfterMemberEfficiencyIncrease"
    ? "How long will they now take together?"
    : entry.solveMode === "findTimeSavedAfterMemberEfficiencyIncrease"
      ? "How much time will be saved?"
      : "By how much will completion be delayed?";
  const targetHi = entry.solveMode === "findNewCombinedTimeAfterMemberEfficiencyIncrease"
    ? "अब दोनों मिलकर काम कितने समय में पूरा करेंगे?"
    : entry.solveMode === "findTimeSavedAfterMemberEfficiencyIncrease"
      ? "कितना समय बचेगा?"
      : "काम पूरा होने में कितनी देरी होगी?";
  const targetPa = entry.solveMode === "findNewCombinedTimeAfterMemberEfficiencyIncrease"
    ? "ਹੁਣ ਦੋਵੇਂ ਮਿਲ ਕੇ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਕਰਨਗੇ?"
    : entry.solveMode === "findTimeSavedAfterMemberEfficiencyIncrease"
      ? "ਕਿੰਨਾ ਸਮਾਂ ਬਚੇਗਾ?"
      : "ਕੰਮ ਪੂਰਾ ਹੋਣ ਵਿੱਚ ਕਿੰਨੀ ਦੇਰੀ ਹੋਵੇਗੀ?";

  return languageText(
    language,
    `A and B together complete a job in ${original}. Their efficiencies are in the ratio ${a}:${b}. From the start, A becomes ${changeEn}, while B's efficiency is unchanged. ${targetEn}`,
    `A और B मिलकर एक काम ${original} में पूरा करते हैं। उनकी दक्षताओं का अनुपात ${a}:${b} है। शुरुआत से A ${changeHi} हो जाता है, जबकि B की दक्षता समान रहती है। ${targetHi}`,
    `A ਅਤੇ B ਮਿਲ ਕੇ ਇੱਕ ਕੰਮ ${original} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਕੁਸ਼ਲਤਾ ਦਾ ਅਨੁਪਾਤ ${a}:${b} ਹੈ। ਸ਼ੁਰੂ ਤੋਂ A ${changePa} ਹੋ ਜਾਂਦਾ ਹੈ, ਜਦਕਿ B ਦੀ ਕੁਸ਼ਲਤਾ ਨਹੀਂ ਬਦਲਦੀ। ${targetPa}`,
  );
}

function candidateDistractors(entry: Entry, p: CoverageParameters, answer: Rational): Array<{ value: Rational; misconceptionId: MisconceptionId }> {
  if (entry.solveMode === "findExcludedIndividualTimeFromAllTogetherAndSubgroup") {
    return [
      { value: p.subgroupTime!, misconceptionId: "SUBGROUP_TIME_REPORTED" },
      { value: p.allTogetherTime!, misconceptionId: "ALL_TOGETHER_TIME_REPORTED" },
      { value: add(p.subgroupTime!, p.allTogetherTime!), misconceptionId: "SUBTRACT_TIMES_INSTEAD_OF_RATES" },
    ];
  }
  const original = p.originalCombinedTime!;
  const changed = p.changedCombinedTime!;
  const percent = p.changePercent!;
  if (entry.solveMode === "findNewCombinedTimeAfterMemberEfficiencyIncrease") {
    return [
      { value: original, misconceptionId: "ORIGINAL_TIME_REPORTED" },
      { value: divide(original, add(rational(1), divide(percent, rational(100)))), misconceptionId: "WHOLE_TEAM_PERCENT_CHANGED" },
      { value: multiply(original, subtract(rational(1), divide(percent, rational(100)))), misconceptionId: "PERCENT_APPLIED_DIRECTLY_TO_TIME" },
    ];
  }
  if (entry.solveMode === "findTimeSavedAfterMemberEfficiencyIncrease") {
    return [
      { value: multiply(original, divide(percent, rational(100))), misconceptionId: "PERCENT_APPLIED_DIRECTLY_TO_TIME" },
      { value: changed, misconceptionId: "CHANGED_TIME_REPORTED" },
      { value: subtract(original, divide(original, add(rational(1), divide(percent, rational(100))))), misconceptionId: "WHOLE_TEAM_PERCENT_CHANGED" },
    ];
  }
  return [
    { value: original, misconceptionId: "ORIGINAL_TIME_REPORTED" },
    { value: changed, misconceptionId: "CHANGED_TIME_REPORTED" },
    { value: divide(original, subtract(rational(1), divide(percent, rational(100)))), misconceptionId: "WHOLE_TEAM_PERCENT_CHANGED" },
  ];
}

function buildOptions(entry: Entry, p: CoverageParameters, answer: Rational, seed: string, language: TmwLanguage): { optionAudit: OptionAudit[]; correctIndex: number } {
  const seen = new Set([rationalKey(answer)]);
  const distractors: Array<{ value: Rational; misconceptionId: MisconceptionId }> = [];
  for (const candidate of candidateDistractors(entry, p, answer)) {
    const key = rationalKey(candidate.value);
    if (positive(candidate.value) && !seen.has(key)) {
      seen.add(key);
      distractors.push(candidate);
    }
  }
  for (const scale of [2, 3, 4, 5, 6]) {
    if (distractors.length >= 3) break;
    const value = multiply(answer, rational(scale));
    const key = rationalKey(value);
    if (!seen.has(key)) {
      seen.add(key);
      distractors.push({ value, misconceptionId: "PLAUSIBLE_SCALE_ERROR" });
    }
  }
  if (distractors.length < 3) throw new Error(`Could not build unique CP012 distractors for ${entry.qlId}`);

  const correct: OptionAudit = { text: timeText(answer, language), value: answer, misconceptionId: "CORRECT" };
  const incorrect = distractors.slice(0, 3).map((item) => ({ ...item, text: timeText(item.value, language) }));
  const correctIndex = seedNumber(seed, `cp012-correct-index:${entry.qlId}:${language}`) % 4;
  const optionAudit = [...incorrect];
  optionAudit.splice(correctIndex, 0, correct);
  return { optionAudit, correctIndex };
}

function explanation(entry: Entry, p: CoverageParameters, answer: Rational, language: TmwLanguage, optionAudit: OptionAudit[]) {
  const answerDisplay = timeText(answer, language);
  const trap = optionAudit.find((option) => option.misconceptionId !== "CORRECT")!;

  if (entry.solveMode === "findExcludedIndividualTimeFromAllTogetherAndSubgroup") {
    const allRate = reciprocal(p.allTogetherTime!);
    const subgroupRate = reciprocal(p.subgroupTime!);
    const excludedRate = subtract(allRate, subgroupRate);
    return {
      opening: languageText(language, "Convert completion times into work rates, then subtract the subgroup rate from the all-together rate.", "पूरा करने के समय को कार्य-दर में बदलें, फिर तीनों की संयुक्त दर में से A+B की दर घटाएँ।", "ਕੰਮ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮੇਂ ਨੂੰ ਕੰਮ-ਦਰ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਤਿੰਨਾਂ ਦੀ ਸਾਂਝੀ ਦਰ ਵਿੱਚੋਂ A+B ਦੀ ਦਰ ਘਟਾਓ।"),
      formula: "\\(r_C=r_{ABC}-r_{AB}\\)",
      givens: [
        languageText(language, `A+B+C time = ${timeText(p.allTogetherTime!, language)}.`, `A+B+C का समय = ${timeText(p.allTogetherTime!, language)}।`, `A+B+C ਦਾ ਸਮਾਂ = ${timeText(p.allTogetherTime!, language)}।`),
        languageText(language, `A+B time = ${timeText(p.subgroupTime!, language)}.`, `A+B का समय = ${timeText(p.subgroupTime!, language)}।`, `A+B ਦਾ ਸਮਾਂ = ${timeText(p.subgroupTime!, language)}।`),
      ],
      steps: [
        languageText(language, `Rate of A+B+C = \\(${toLatex(allRate)}\\) of the work per day.`, `A+B+C की दर = \\(${toLatex(allRate)}\\) काम प्रति दिन।`, `A+B+C ਦੀ ਦਰ = \\(${toLatex(allRate)}\\) ਕੰਮ ਪ੍ਰਤੀ ਦਿਨ।`),
        languageText(language, `Rate of A+B = \\(${toLatex(subgroupRate)}\\), so C's rate = \\(${toLatex(allRate)}-${toLatex(subgroupRate)}=${toLatex(excludedRate)}\\).`, `A+B की दर = \\(${toLatex(subgroupRate)}\\), इसलिए C की दर = \\(${toLatex(allRate)}-${toLatex(subgroupRate)}=${toLatex(excludedRate)}\\)।`, `A+B ਦੀ ਦਰ = \\(${toLatex(subgroupRate)}\\), ਇਸ ਲਈ C ਦੀ ਦਰ = \\(${toLatex(allRate)}-${toLatex(subgroupRate)}=${toLatex(excludedRate)}\\)।`),
        languageText(language, `Therefore C alone takes the reciprocal: ${answerDisplay}.`, `इसलिए C अकेला दर का व्युत्क्रम लेकर ${answerDisplay} में काम पूरा करेगा।`, `ਇਸ ਲਈ C ਇਕੱਲਾ ਦਰ ਦਾ ਉਲਟ ਲੈ ਕੇ ${answerDisplay} ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਕਰੇਗਾ।`),
      ],
      shortcut: {
        title: languageText(language, "10-Second Rate Subtraction", "10-Second दर घटाव", "10-Second ਦਰ ਘਟਾਓ"),
        steps: [languageText(language, "Use 1/(all-together time) − 1/(subgroup time), then invert.", "1/(तीनों का समय) − 1/(A+B का समय) निकालकर उसका व्युत्क्रम लें।", "1/(ਤਿੰਨਾਂ ਦਾ ਸਮਾਂ) − 1/(A+B ਦਾ ਸਮਾਂ) ਕੱਢ ਕੇ ਉਸਦਾ ਉਲਟ ਲਓ।")],
      },
      commonTrap: {
        optionLabel: languageText(language, "Common trap", "सामान्य गलती", "ਆਮ ਗਲਤੀ"),
        optionText: trap.text,
        misconceptionId: trap.misconceptionId,
        explanation: languageText(language, "This comes from combining completion times directly instead of subtracting work rates.", "यह काम की दरों को घटाने के बजाय पूरा करने के समयों पर सीधे क्रिया करने से मिलता है।", "ਇਹ ਕੰਮ-ਦਰਾਂ ਨੂੰ ਘਟਾਉਣ ਦੀ ਬਜਾਏ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮਿਆਂ ਉੱਤੇ ਸਿੱਧੀ ਕ੍ਰਿਆ ਕਰਨ ਨਾਲ ਮਿਲਦਾ ਹੈ।"),
      },
      conclusion: languageText(language, `C alone completes the work in ${answerDisplay}.`, `C अकेला काम ${answerDisplay} में पूरा करता है।`, `C ਇਕੱਲਾ ਕੰਮ ${answerDisplay} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ।`),
    };
  }

  const a = p.efficiencyA!;
  const b = p.efficiencyB!;
  const original = p.originalCombinedTime!;
  const changed = p.changedCombinedTime!;
  const percent = p.changePercent!;
  const multiplier = p.changeDirection === "INCREASE"
    ? add(rational(1), divide(percent, rational(100)))
    : subtract(rational(1), divide(percent, rational(100)));
  const originalUnits = add(a, b);
  const changedA = multiply(a, multiplier);
  const changedUnits = add(changedA, b);
  const totalWorkUnits = multiply(original, originalUnits);
  const impactWord = entry.solveMode === "findTimeSavedAfterMemberEfficiencyIncrease" ? "saved" : entry.solveMode === "findDelayAfterMemberEfficiencyDecrease" ? "delay" : "new time";

  return {
    opening: languageText(language, "Use relative efficiency units. The total work stays fixed; only A's share of the team rate changes.", "सापेक्ष दक्षता इकाइयों का उपयोग करें। कुल काम समान रहता है; केवल टीम-दर में A का हिस्सा बदलता है।", "ਸਾਪੇਖ ਕੁਸ਼ਲਤਾ ਇਕਾਈਆਂ ਵਰਤੋ। ਕੁੱਲ ਕੰਮ ਉਹੀ ਰਹਿੰਦਾ ਹੈ; ਸਿਰਫ਼ ਟੀਮ-ਦਰ ਵਿੱਚ A ਦਾ ਹਿੱਸਾ ਬਦਲਦਾ ਹੈ।"),
    formula: "\\(T_{new}=T_0\\,\\frac{E_A+E_B}{E_A' + E_B}\\)",
    givens: [
      languageText(language, `Original team time = ${timeText(original, language)}; efficiency ratio A:B = ${a.numerator}:${b.numerator}.`, `मूल संयुक्त समय = ${timeText(original, language)}; दक्षता अनुपात A:B = ${a.numerator}:${b.numerator}।`, `ਮੂਲ ਸਾਂਝਾ ਸਮਾਂ = ${timeText(original, language)}; ਕੁਸ਼ਲਤਾ ਅਨੁਪਾਤ A:B = ${a.numerator}:${b.numerator}।`),
      languageText(language, `A changes by ${percent.numerator}%; B is unchanged.`, `A की दक्षता ${percent.numerator}% बदलती है; B की दक्षता समान है।`, `A ਦੀ ਕੁਸ਼ਲਤਾ ${percent.numerator}% ਬਦਲਦੀ ਹੈ; B ਦੀ ਕੁਸ਼ਲਤਾ ਉਹੀ ਰਹਿੰਦੀ ਹੈ।`),
    ],
    steps: [
      languageText(language, `Take A:B efficiency as ${a.numerator}:${b.numerator}. Total work = \\(${toLatex(original)}\\times${toLatex(originalUnits)}=${toLatex(totalWorkUnits)}\\) efficiency-days.`, `A:B की दक्षता ${a.numerator}:${b.numerator} मानें। कुल काम = \\(${toLatex(original)}\\times${toLatex(originalUnits)}=${toLatex(totalWorkUnits)}\\) दक्षता-दिन।`, `A:B ਦੀ ਕੁਸ਼ਲਤਾ ${a.numerator}:${b.numerator} ਮੰਨੋ। ਕੁੱਲ ਕੰਮ = \\(${toLatex(original)}\\times${toLatex(originalUnits)}=${toLatex(totalWorkUnits)}\\) ਕੁਸ਼ਲਤਾ-ਦਿਨ।`),
      languageText(language, `A's changed efficiency = \\(${toLatex(a)}\\times${toLatex(multiplier)}=${toLatex(changedA)}\\); new team efficiency = \\(${toLatex(changedUnits)}\\).`, `A की बदली दक्षता = \\(${toLatex(a)}\\times${toLatex(multiplier)}=${toLatex(changedA)}\\); नई टीम-दक्षता = \\(${toLatex(changedUnits)}\\)।`, `A ਦੀ ਬਦਲੀ ਕੁਸ਼ਲਤਾ = \\(${toLatex(a)}\\times${toLatex(multiplier)}=${toLatex(changedA)}\\); ਨਵੀਂ ਟੀਮ-ਕੁਸ਼ਲਤਾ = \\(${toLatex(changedUnits)}\\)।`),
      languageText(language, `New completion time = \\(${toLatex(totalWorkUnits)}\\div${toLatex(changedUnits)}=${toLatex(changed)}\\) days.`, `नया पूरा करने का समय = \\(${toLatex(totalWorkUnits)}\\div${toLatex(changedUnits)}=${toLatex(changed)}\\) दिन।`, `ਨਵਾਂ ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ = \\(${toLatex(totalWorkUnits)}\\div${toLatex(changedUnits)}=${toLatex(changed)}\\) ਦਿਨ।`),
      ...(entry.solveMode === "findNewCombinedTimeAfterMemberEfficiencyIncrease" ? [] : [
        languageText(language, `Compare with the original time: required ${impactWord} = ${answerDisplay}.`, `मूल समय से तुलना करने पर आवश्यक अंतर = ${answerDisplay}।`, `ਮੂਲ ਸਮੇਂ ਨਾਲ ਤੁਲਨਾ ਕਰਨ ਤੇ ਲੋੜੀਂਦਾ ਅੰਤਰ = ${answerDisplay}।`),
      ]),
    ],
    shortcut: {
      title: languageText(language, "10-Second Efficiency-Unit Method", "10-Second दक्षता-इकाई विधि", "10-Second ਕੁਸ਼ਲਤਾ-ਇਕਾਈ ਵਿਧੀ"),
      steps: [languageText(language, "Keep total-work units fixed: old time × old team units = new time × new team units.", "कुल कार्य-इकाइयाँ स्थिर रखें: पुराना समय × पुरानी टीम-दक्षता = नया समय × नई टीम-दक्षता।", "ਕੁੱਲ ਕੰਮ-ਇਕਾਈਆਂ ਸਥਿਰ ਰੱਖੋ: ਪੁਰਾਣਾ ਸਮਾਂ × ਪੁਰਾਣੀ ਟੀਮ-ਕੁਸ਼ਲਤਾ = ਨਵਾਂ ਸਮਾਂ × ਨਵੀਂ ਟੀਮ-ਕੁਸ਼ਲਤਾ।")],
    },
    commonTrap: {
      optionLabel: languageText(language, "Common trap", "सामान्य गलती", "ਆਮ ਗਲਤੀ"),
      optionText: trap.text,
      misconceptionId: trap.misconceptionId,
      explanation: languageText(language, "This treats A's percentage change as if it applied to the whole team's rate or directly to the completion time.", "यह A की दक्षता में प्रतिशत बदलाव को पूरी टीम की दर या सीधे पूरा करने के समय पर लागू मान लेता है।", "ਇਹ A ਦੀ ਕੁਸ਼ਲਤਾ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਨੂੰ ਪੂਰੀ ਟੀਮ ਦੀ ਦਰ ਜਾਂ ਸਿੱਧੇ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮੇਂ ਉੱਤੇ ਲਾਗੂ ਮੰਨ ਲੈਂਦਾ ਹੈ।"),
    },
    conclusion: languageText(language, `Therefore, the required ${impactWord} is ${answerDisplay}.`, `अतः आवश्यक उत्तर ${answerDisplay} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉੱਤਰ ${answerDisplay} ਹੈ।`),
  };
}

function verify(entry: Entry, p: CoverageParameters, answer: Rational): boolean {
  if (entry.solveMode === "findExcludedIndividualTimeFromAllTogetherAndSubgroup") {
    return equals(
      add(reciprocal(p.subgroupTime!), reciprocal(answer)),
      reciprocal(p.allTogetherTime!),
    );
  }
  const changed = p.changedCombinedTime!;
  if (entry.solveMode === "findNewCombinedTimeAfterMemberEfficiencyIncrease") return equals(answer, changed);
  if (entry.solveMode === "findTimeSavedAfterMemberEfficiencyIncrease") return equals(add(answer, changed), p.originalCombinedTime!);
  return equals(subtract(changed, p.originalCombinedTime!), answer);
}

function balanced(value: string): boolean {
  return (value.match(/\\\(/g) ?? []).length === (value.match(/\\\)/g) ?? []).length;
}

export function runTmwCp012CoverageClosurePipeline(input: { questionLanguageId: string; seed: string; language: TmwLanguage }) {
  const entry = entryFor(input.questionLanguageId);
  const parameters = buildParameters(entry, input.seed);
  const answer = solve(entry, parameters);
  const questionStem = stem(entry, parameters, input.language);
  const optionSet = buildOptions(entry, parameters, answer, input.seed, input.language);
  const learnerExplanation = explanation(entry, parameters, answer, input.language, optionSet.optionAudit);
  const answerText = optionSet.optionAudit[optionSet.correctIndex]!.text;
  const errors: string[] = [];

  if (!verify(entry, parameters, answer)) errors.push("Independent CP012 verifier disagrees with canonical answer");
  if (!positive(answer)) errors.push("Answer must be positive");
  if (optionSet.optionAudit.length !== 4 || new Set(optionSet.optionAudit.map((option) => option.text)).size !== 4) errors.push("Options must contain four unique choices");
  if (optionSet.optionAudit[optionSet.correctIndex]?.misconceptionId !== "CORRECT") errors.push("Correct option position is inconsistent");
  if (answerText !== timeText(answer, input.language)) errors.push("Answer text does not match the canonical value");
  const learnerText = [questionStem, ...optionSet.optionAudit.map((option) => option.text), learnerExplanation.opening, learnerExplanation.formula, ...learnerExplanation.givens, ...learnerExplanation.steps, ...learnerExplanation.shortcut.steps, learnerExplanation.commonTrap.explanation, learnerExplanation.conclusion].join(" ");
  if (!balanced(learnerText)) errors.push("Learner text has unbalanced inline MathJax");
  if (/undefined|null|NaN|Infinity|\{\{|\$\{/.test(learnerText)) errors.push("Learner text contains an unresolved value");
  if (questionStem.trim().split(/\s+/u).filter(Boolean).length > 70) errors.push("Coverage-closure stem exceeds 70 whitespace tokens");

  const formulaLatex = entry.solveMode === "findExcludedIndividualTimeFromAllTogetherAndSubgroup"
    ? "r_C=r_{ABC}-r_{AB}"
    : "T_{new}=T_0\\frac{E_A+E_B}{E_A'+E_B}";

  return {
    archetypeId: "TMW-001" as const,
    canonicalProblemId: TMW_CP_012_ID,
    questionLanguageId: entry.qlId,
    solveMode: entry.solveMode,
    language: input.language,
    seed: input.seed,
    difficulty: entry.difficulty,
    parameters,
    solution: {
      answer,
      answerType: "TIME" as const,
      formulaLatex,
      workedLatex: learnerExplanation.steps,
      answerText,
    },
    stem: questionStem,
    options: optionSet.optionAudit.map((option) => option.text),
    optionAudit: optionSet.optionAudit,
    correctIndex: optionSet.correctIndex,
    explanation: learnerExplanation,
    learnerExplanationVersion: "TMW_COVERAGE_V1" as const,
    mathematicalFingerprint: `${entry.solveMode}|${Object.values(parameters).filter((value): value is Rational => Boolean(value && typeof value === "object" && "numerator" in value && "denominator" in value)).map(rationalKey).join("|")}`,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false as const,
  };
}
