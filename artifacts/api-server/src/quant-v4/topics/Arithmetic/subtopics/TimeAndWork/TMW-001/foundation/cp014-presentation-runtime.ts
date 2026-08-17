import { add, divide, equals, multiply, rational, rationalKey, subtract, toLatex, toMixedLatex } from "./rational";
import { pick, seedNumber } from "./cp001-helpers";
import type { Rational, TmwLanguage } from "./types";

export const TMW_CP_014_ID = "TMW-CP-014" as const;

export const TMW_CP_014_SOLVE_MODES = [
  "tableWorkforceSchedule",
  "tableHeterogeneousContribution",
  "tablePipeOperatingSchedule",
  "caseletStageOneOutput",
  "caseletRemainingCompletionTime",
] as const;

export type TmwCp014SolveMode = (typeof TMW_CP_014_SOLVE_MODES)[number];

type Entry = Readonly<{
  qlId: string;
  solveMode: TmwCp014SolveMode;
  representation: "TABLE" | "CASELET";
  difficulty: "Medium" | "Hard";
}>;

type PresentationBlock =
  | Readonly<{ type: "table"; caption: string; columns: readonly string[]; rows: readonly (readonly string[])[] }>
  | Readonly<{ type: "caselet"; title: string; paragraphs: readonly string[] }>;

const ENTRIES: readonly Entry[] = [
  { qlId: "TMW-QL-224", solveMode: "tableWorkforceSchedule", representation: "TABLE", difficulty: "Medium" },
  { qlId: "TMW-QL-225", solveMode: "tableHeterogeneousContribution", representation: "TABLE", difficulty: "Medium" },
  { qlId: "TMW-QL-226", solveMode: "tablePipeOperatingSchedule", representation: "TABLE", difficulty: "Hard" },
  { qlId: "TMW-QL-227", solveMode: "caseletStageOneOutput", representation: "CASELET", difficulty: "Medium" },
  { qlId: "TMW-QL-228", solveMode: "caseletRemainingCompletionTime", representation: "CASELET", difficulty: "Hard" },
];

function entryFor(qlId: string): Entry {
  const entry = ENTRIES.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`Unknown TMW-CP-014 question language: ${qlId}`);
  return entry;
}

function text(language: TmwLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function valueText(value: Rational, unit: "days" | "worker-days" | "base-worker-days" | "work-units" | "tank-fraction", language: TmwLanguage): string {
  const number = value.denominator === 1 ? String(value.numerator) : `\\(${toMixedLatex(value)}\\)`;
  if (unit === "tank-fraction") return value.denominator === 1 ? number : `\\(${toLatex(value)}\\)`;
  const labels = {
    days: [equals(value, rational(1)) ? "day" : "days", "दिन", "ਦਿਨ"],
    "worker-days": ["worker-days", "कामगार-दिन", "ਮਜ਼ਦੂਰ-ਦਿਨ"],
    "base-worker-days": ["base-worker-days", "आधार-कामगार-दिन", "ਆਧਾਰ-ਮਜ਼ਦੂਰ-ਦਿਨ"],
    "work-units": ["work units", "कार्य इकाइयाँ", "ਕੰਮ ਇਕਾਈਆਂ"],
  } as const;
  const label = labels[unit][language === "en" ? 0 : language === "hi" ? 1 : 2];
  return `${number} ${label}`;
}

function buildOptions(answer: Rational, unit: Parameters<typeof valueText>[1], language: TmwLanguage, seed: string) {
  const candidates = [
    answer,
    multiply(answer, rational(2)),
    divide(answer, rational(2)),
    add(answer, rational(2)),
    add(answer, rational(3)),
  ];
  const unique: Rational[] = [];
  const seen = new Set<string>();
  for (const value of candidates) {
    const key = rationalKey(value);
    if (value.numerator <= 0 || seen.has(key)) continue;
    seen.add(key);
    unique.push(value);
    if (unique.length === 4) break;
  }
  if (unique.length !== 4) throw new Error("Could not build four unique CP014 options");
  const answerKey = rationalKey(answer);
  const distractors = unique.filter((value) => rationalKey(value) !== answerKey).slice(0, 3);
  const correctIndex = seedNumber(seed, `cp014-correct-index:${unit}:${language}`) % 4;
  const arranged = [...distractors];
  arranged.splice(correctIndex, 0, answer);
  return {
    correctIndex,
    options: arranged.map((value) => valueText(value, unit, language)),
    optionAudit: arranged.map((value) => ({
      text: valueText(value, unit, language),
      value,
      misconceptionId: rationalKey(value) === answerKey ? "CORRECT" : "PLAUSIBLE_SCALE_ERROR",
    })),
  };
}

function tableFallback(block: Extract<PresentationBlock, { type: "table" }>): string {
  const header = block.columns.join(" | ");
  const rows = block.rows.map((row) => row.join(" | ")).join("; ");
  return `${block.caption} [${header}] ${rows}.`;
}

function workforcePackage(entry: Entry, seed: string, language: TmwLanguage) {
  const state = pick([
    { w1: 12, d1: 6, w2: 18, d2: 4, target: 16 },
    { w1: 10, d1: 8, w2: 15, d2: 4, target: 20 },
    { w1: 14, d1: 5, w2: 21, d2: 5, target: 14 },
    { w1: 16, d1: 4, w2: 24, d2: 3, target: 17 },
  ] as const, seed, "cp014-workforce");
  const totalWorkerDays = add(multiply(rational(state.w1), rational(state.d1)), multiply(rational(state.w2), rational(state.d2)));
  const answer = divide(totalWorkerDays, rational(state.target));
  const block: PresentationBlock = {
    type: "table",
    caption: text(language, "Project schedule", "परियोजना समय-सारणी", "ਪ੍ਰੋਜੈਕਟ ਸਮਾਂ-ਸਾਰਣੀ"),
    columns: [text(language, "Stage", "चरण", "ਪੜਾਅ"), text(language, "Workers", "कामगार", "ਮਜ਼ਦੂਰ"), text(language, "Days", "दिन", "ਦਿਨ")],
    rows: [
      ["1", String(state.w1), String(state.d1)],
      ["2", String(state.w2), String(state.d2)],
    ],
  };
  const stem = `${text(language, "All workers have equal efficiency. The work completed in the two stages shown below is to be done by a fresh crew.", "सभी कामगार समान दक्षता वाले हैं। नीचे दिए दो चरणों में हुआ काम एक नई टीम को करना है।", "ਸਾਰੇ ਮਜ਼ਦੂਰ ਇੱਕੋ ਕੁਸ਼ਲਤਾ ਵਾਲੇ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੇ ਦੋ ਪੜਾਅਾਂ ਵਿੱਚ ਹੋਇਆ ਕੰਮ ਇੱਕ ਨਵੀਂ ਟੀਮ ਨੇ ਕਰਨਾ ਹੈ।")} ${tableFallback(block)} ${text(language, `How many days will ${state.target} workers take to do the same total work?`, `उसी कुल काम को ${state.target} कामगार कितने दिनों में करेंगे?`, `ਉਹੀ ਕੁੱਲ ਕੰਮ ${state.target} ਮਜ਼ਦੂਰ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਕਰਨਗੇ?`)}`;
  return {
    answer,
    unit: "days" as const,
    presentationBlocks: [block],
    stem,
    steps: [
      text(language, `Stage 1 work = ${state.w1}×${state.d1} = ${state.w1 * state.d1} worker-days.`, `चरण 1 का काम = ${state.w1}×${state.d1} = ${state.w1 * state.d1} कामगार-दिन।`, `ਪੜਾਅ 1 ਦਾ ਕੰਮ = ${state.w1}×${state.d1} = ${state.w1 * state.d1} ਮਜ਼ਦੂਰ-ਦਿਨ।`),
      text(language, `Stage 2 work = ${state.w2}×${state.d2} = ${state.w2 * state.d2} worker-days.`, `चरण 2 का काम = ${state.w2}×${state.d2} = ${state.w2 * state.d2} कामगार-दिन।`, `ਪੜਾਅ 2 ਦਾ ਕੰਮ = ${state.w2}×${state.d2} = ${state.w2 * state.d2} ਮਜ਼ਦੂਰ-ਦਿਨ।`),
      text(language, `Total work = ${toMixedLatex(totalWorkerDays)} worker-days, so time for ${state.target} workers = ${valueText(answer, "days", language)}.`, `कुल काम = ${toMixedLatex(totalWorkerDays)} कामगार-दिन, इसलिए ${state.target} कामगारों का समय = ${valueText(answer, "days", language)}।`, `ਕੁੱਲ ਕੰਮ = ${toMixedLatex(totalWorkerDays)} ਮਜ਼ਦੂਰ-ਦਿਨ, ਇਸ ਲਈ ${state.target} ਮਜ਼ਦੂਰਾਂ ਦਾ ਸਮਾਂ = ${valueText(answer, "days", language)}।`),
    ],
    fingerprint: `workforce-table:${state.w1}:${state.d1}:${state.w2}:${state.d2}:${state.target}`,
  };
}

function heterogeneousPackage(entry: Entry, seed: string, language: TmwLanguage) {
  const state = pick([
    { skilled: 4, skilledEff: 3, skilledDays: 5, helper: 6, helperEff: 1, helperDays: 5 },
    { skilled: 5, skilledEff: 2, skilledDays: 6, helper: 8, helperEff: 1, helperDays: 4 },
    { skilled: 3, skilledEff: 4, skilledDays: 4, helper: 10, helperEff: 1, helperDays: 3 },
    { skilled: 6, skilledEff: 3, skilledDays: 3, helper: 9, helperEff: 1, helperDays: 4 },
  ] as const, seed, "cp014-heterogeneous");
  const skilledContribution = state.skilled * state.skilledEff * state.skilledDays;
  const helperContribution = state.helper * state.helperEff * state.helperDays;
  const answer = rational(skilledContribution + helperContribution);
  const block: PresentationBlock = {
    type: "table",
    caption: text(language, "Crew contribution record", "दल योगदान रिकॉर्ड", "ਟੀਮ ਯੋਗਦਾਨ ਰਿਕਾਰਡ"),
    columns: [text(language, "Worker type", "कामगार प्रकार", "ਮਜ਼ਦੂਰ ਕਿਸਮ"), text(language, "Count", "संख्या", "ਗਿਣਤੀ"), text(language, "Relative efficiency", "सापेक्ष दक्षता", "ਸਾਪੇਖ ਕੁਸ਼ਲਤਾ"), text(language, "Days worked", "काम के दिन", "ਕੰਮ ਦੇ ਦਿਨ")],
    rows: [
      [text(language, "Skilled", "कुशल", "ਕੁਸ਼ਲ"), String(state.skilled), String(state.skilledEff), String(state.skilledDays)],
      [text(language, "Helper", "सहायक", "ਸਹਾਇਕ"), String(state.helper), String(state.helperEff), String(state.helperDays)],
    ],
  };
  const stem = `${text(language, "Take one helper's one-day output as 1 base work unit.", "एक सहायक के एक दिन के उत्पादन को 1 आधार कार्य इकाई मानें।", "ਇੱਕ ਸਹਾਇਕ ਦੇ ਇੱਕ ਦਿਨ ਦੇ ਉਤਪਾਦਨ ਨੂੰ 1 ਆਧਾਰ ਕੰਮ ਇਕਾਈ ਮੰਨੋ।")} ${tableFallback(block)} ${text(language, "What is the crew's total contribution?", "दल का कुल योगदान कितना है?", "ਟੀਮ ਦਾ ਕੁੱਲ ਯੋਗਦਾਨ ਕਿੰਨਾ ਹੈ?")}`;
  return {
    answer,
    unit: "base-worker-days" as const,
    presentationBlocks: [block],
    stem,
    steps: [
      text(language, `Skilled contribution = ${state.skilled}×${state.skilledEff}×${state.skilledDays} = ${skilledContribution}.`, `कुशल योगदान = ${state.skilled}×${state.skilledEff}×${state.skilledDays} = ${skilledContribution}।`, `ਕੁਸ਼ਲ ਯੋਗਦਾਨ = ${state.skilled}×${state.skilledEff}×${state.skilledDays} = ${skilledContribution}।`),
      text(language, `Helper contribution = ${state.helper}×${state.helperEff}×${state.helperDays} = ${helperContribution}.`, `सहायक योगदान = ${state.helper}×${state.helperEff}×${state.helperDays} = ${helperContribution}।`, `ਸਹਾਇਕ ਯੋਗਦਾਨ = ${state.helper}×${state.helperEff}×${state.helperDays} = ${helperContribution}।`),
      text(language, `Total contribution = ${skilledContribution}+${helperContribution} = ${valueText(answer, "base-worker-days", language)}.`, `कुल योगदान = ${skilledContribution}+${helperContribution} = ${valueText(answer, "base-worker-days", language)}।`, `ਕੁੱਲ ਯੋਗਦਾਨ = ${skilledContribution}+${helperContribution} = ${valueText(answer, "base-worker-days", language)}।`),
    ],
    fingerprint: `hetero-table:${state.skilled}:${state.skilledEff}:${state.skilledDays}:${state.helper}:${state.helperDays}`,
  };
}

function pipePackage(entry: Entry, seed: string, language: TmwLanguage) {
  const state = pick([
    { inlet: 12, outlet: 24, first: 3, second: 4 },
    { inlet: 10, outlet: 20, first: 2, second: 5 },
    { inlet: 8, outlet: 16, first: 2, second: 4 },
    { inlet: 15, outlet: 30, first: 5, second: 5 },
  ] as const, seed, "cp014-pipes");
  const inletRate = rational(1, state.inlet);
  const outletRate = rational(1, state.outlet);
  const firstWork = multiply(inletRate, rational(state.first));
  const netRate = subtract(inletRate, outletRate);
  const secondWork = multiply(netRate, rational(state.second));
  const answer = add(firstWork, secondWork);
  const block: PresentationBlock = {
    type: "table",
    caption: text(language, "Pipe operating schedule", "पाइप संचालन समय-सारणी", "ਪਾਈਪ ਚਲਾਉਣ ਦੀ ਸਮਾਂ-ਸਾਰਣੀ"),
    columns: [text(language, "Interval", "अवधि", "ਅਵਧੀ"), text(language, "Active pipes", "चालू पाइप", "ਚਾਲੂ ਪਾਈਪ"), text(language, "Duration", "समय", "ਸਮਾਂ")],
    rows: [
      ["1", text(language, "Inlet only", "केवल inlet", "ਕੇਵਲ inlet"), `${state.first} h`],
      ["2", text(language, "Inlet + outlet", "inlet + outlet", "inlet + outlet"), `${state.second} h`],
    ],
  };
  const stem = `${text(language, `An inlet alone fills a tank in ${state.inlet} hours and an outlet alone empties it in ${state.outlet} hours. The tank starts empty.`, `एक inlet अकेला टंकी को ${state.inlet} घंटे में भरता है और outlet अकेला उसे ${state.outlet} घंटे में खाली करता है। टंकी शुरुआत में खाली है।`, `ਇੱਕ inlet ਇਕੱਲਾ ਟੈਂਕ ਨੂੰ ${state.inlet} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ ਅਤੇ outlet ਇਕੱਲਾ ਇਸ ਨੂੰ ${state.outlet} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ। ਟੈਂਕ ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ।`)} ${tableFallback(block)} ${text(language, "What fraction of the tank is filled at the end of the schedule?", "समय-सारणी के अंत में टंकी का कितना भाग भरा है?", "ਸਮਾਂ-ਸਾਰਣੀ ਦੇ ਅੰਤ ਵਿੱਚ ਟੈਂਕ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਭਰਿਆ ਹੈ?")}`;
  return {
    answer,
    unit: "tank-fraction" as const,
    presentationBlocks: [block],
    stem,
    steps: [
      text(language, `Interval 1 fills \\(${state.first}/${state.inlet}=${toLatex(firstWork)}\\) of the tank.`, `अवधि 1 में टंकी का \\(${state.first}/${state.inlet}=${toLatex(firstWork)}\\) भाग भरता है।`, `ਅਵਧੀ 1 ਵਿੱਚ ਟੈਂਕ ਦਾ \\(${state.first}/${state.inlet}=${toLatex(firstWork)}\\) ਹਿੱਸਾ ਭਰਦਾ ਹੈ।`),
      text(language, `With both open, net rate = \\(1/${state.inlet}-1/${state.outlet}=${toLatex(netRate)}\\) tank per hour.`, `दोनों खुले होने पर net दर = \\(1/${state.inlet}-1/${state.outlet}=${toLatex(netRate)}\\) टंकी प्रति घंटा।`, `ਦੋਵੇਂ ਖੁੱਲ੍ਹੇ ਹੋਣ ਤੇ net ਦਰ = \\(1/${state.inlet}-1/${state.outlet}=${toLatex(netRate)}\\) ਟੈਂਕ ਪ੍ਰਤੀ ਘੰਟਾ।`),
      text(language, `Final filled fraction = \\(${toLatex(firstWork)}+${toLatex(secondWork)}=${toLatex(answer)}\\).`, `अंतिम भरा भाग = \\(${toLatex(firstWork)}+${toLatex(secondWork)}=${toLatex(answer)}\\)।`, `ਅੰਤਿਮ ਭਰਿਆ ਹਿੱਸਾ = \\(${toLatex(firstWork)}+${toLatex(secondWork)}=${toLatex(answer)}\\)।`),
    ],
    fingerprint: `pipe-table:${state.inlet}:${state.outlet}:${state.first}:${state.second}`,
  };
}

function caseletState(seed: string) {
  return pick([
    { total: 240, a: 12, b: 8, firstDays: 5 },
    { total: 300, a: 15, b: 10, firstDays: 6 },
    { total: 360, a: 18, b: 12, firstDays: 5 },
    { total: 280, a: 14, b: 7, firstDays: 5 },
  ] as const, seed, "cp014-shared-caselet");
}

function caseletPackage(entry: Entry, seed: string, language: TmwLanguage) {
  const state = caseletState(seed);
  const firstOutput = rational(state.a * state.firstDays);
  const remaining = subtract(rational(state.total), firstOutput);
  const jointRate = rational(state.a + state.b);
  const remainingDays = divide(remaining, jointRate);
  const isStageOne = entry.solveMode === "caseletStageOneOutput";
  const answer = isStageOne ? firstOutput : remainingDays;
  const unit = isStageOne ? "work-units" as const : "days" as const;
  const paragraph1 = text(language, `A project requires ${state.total} work units. Team A completes ${state.a} units per day and Team B completes ${state.b} units per day.`, `एक परियोजना में कुल ${state.total} कार्य इकाइयाँ हैं। टीम A प्रतिदिन ${state.a} और टीम B प्रतिदिन ${state.b} इकाइयाँ पूरी करती है।`, `ਇੱਕ ਪ੍ਰੋਜੈਕਟ ਵਿੱਚ ਕੁੱਲ ${state.total} ਕੰਮ ਇਕਾਈਆਂ ਹਨ। ਟੀਮ A ਹਰ ਦਿਨ ${state.a} ਅਤੇ ਟੀਮ B ਹਰ ਦਿਨ ${state.b} ਇਕਾਈਆਂ ਪੂਰੀ ਕਰਦੀ ਹੈ।`);
  const paragraph2 = text(language, `For the first ${state.firstDays} days, only Team A works. From the next day onward, both teams work together at their stated constant rates.`, `पहले ${state.firstDays} दिनों तक केवल टीम A काम करती है। अगले दिन से दोनों टीमें अपनी दी गई स्थिर दरों पर साथ काम करती हैं।`, `ਪਹਿਲੇ ${state.firstDays} ਦਿਨਾਂ ਤੱਕ ਕੇਵਲ ਟੀਮ A ਕੰਮ ਕਰਦੀ ਹੈ। ਅਗਲੇ ਦਿਨ ਤੋਂ ਦੋਵੇਂ ਟੀਮਾਂ ਆਪਣੀਆਂ ਦਿੱਤੀਆਂ ਸਥਿਰ ਦਰਾਂ ਤੇ ਇਕੱਠੇ ਕੰਮ ਕਰਦੀਆਂ ਹਨ।`);
  const block: PresentationBlock = {
    type: "caselet",
    title: text(language, "Project caselet", "परियोजना केसलेट", "ਪ੍ਰੋਜੈਕਟ ਕੇਸਲੈਟ"),
    paragraphs: [paragraph1, paragraph2],
  };
  const question = isStageOne
    ? text(language, `How many work units are completed at the end of Day ${state.firstDays}?`, `दिन ${state.firstDays} के अंत तक कितनी कार्य इकाइयाँ पूरी हो जाती हैं?`, `ਦਿਨ ${state.firstDays} ਦੇ ਅੰਤ ਤੱਕ ਕਿੰਨੀਆਂ ਕੰਮ ਇਕਾਈਆਂ ਪੂਰੀ ਹੋ ਜਾਂਦੀਆਂ ਹਨ?`)
    : text(language, `After Day ${state.firstDays}, how many more days are required to finish the project?`, `दिन ${state.firstDays} के बाद परियोजना पूरी करने में और कितने दिन लगेंगे?`, `ਦਿਨ ${state.firstDays} ਤੋਂ ਬਾਅਦ ਪ੍ਰੋਜੈਕਟ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ਹੋਰ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ?`);
  const stem = `${block.title}: ${paragraph1} ${paragraph2} ${question}`;
  return {
    answer,
    unit,
    presentationBlocks: [block],
    caseletGroupId: "TMW-CASELET-001",
    caseletStimulus: `${paragraph1} ${paragraph2}`,
    stem,
    steps: isStageOne
      ? [
        text(language, `Only Team A works for ${state.firstDays} days.`, `पहले ${state.firstDays} दिनों में केवल टीम A काम करती है।`, `ਪਹਿਲੇ ${state.firstDays} ਦਿਨਾਂ ਵਿੱਚ ਕੇਵਲ ਟੀਮ A ਕੰਮ ਕਰਦੀ ਹੈ।`),
        text(language, `Completed work = ${state.a}×${state.firstDays} = ${valueText(firstOutput, "work-units", language)}.`, `पूरा काम = ${state.a}×${state.firstDays} = ${valueText(firstOutput, "work-units", language)}।`, `ਪੂਰਾ ਕੰਮ = ${state.a}×${state.firstDays} = ${valueText(firstOutput, "work-units", language)}।`),
        text(language, "No rate from Team B is used before it joins.", "टीम B के जुड़ने से पहले उसकी दर का उपयोग नहीं होता।", "ਟੀਮ B ਦੇ ਜੁੜਨ ਤੋਂ ਪਹਿਲਾਂ ਉਸ ਦੀ ਦਰ ਵਰਤੀ ਨਹੀਂ ਜਾਂਦੀ।"),
      ]
      : [
        text(language, `Work done in the first ${state.firstDays} days = ${toMixedLatex(firstOutput)} units.`, `पहले ${state.firstDays} दिनों में किया काम = ${toMixedLatex(firstOutput)} इकाइयाँ।`, `ਪਹਿਲੇ ${state.firstDays} ਦਿਨਾਂ ਵਿੱਚ ਕੀਤਾ ਕੰਮ = ${toMixedLatex(firstOutput)} ਇਕਾਈਆਂ।`),
        text(language, `Remaining work = ${state.total}-${toMixedLatex(firstOutput)} = ${toMixedLatex(remaining)} units.`, `शेष काम = ${state.total}-${toMixedLatex(firstOutput)} = ${toMixedLatex(remaining)} इकाइयाँ।`, `ਬਾਕੀ ਕੰਮ = ${state.total}-${toMixedLatex(firstOutput)} = ${toMixedLatex(remaining)} ਇਕਾਈਆਂ।`),
        text(language, `Together the teams complete ${state.a + state.b} units/day, so additional time = ${valueText(remainingDays, "days", language)}.`, `दोनों टीमें मिलकर ${state.a + state.b} इकाइयाँ/दिन करती हैं, इसलिए अतिरिक्त समय = ${valueText(remainingDays, "days", language)}।`, `ਦੋਵੇਂ ਟੀਮਾਂ ਮਿਲ ਕੇ ${state.a + state.b} ਇਕਾਈਆਂ/ਦਿਨ ਕਰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਵਾਧੂ ਸਮਾਂ = ${valueText(remainingDays, "days", language)}।`),
      ],
    fingerprint: `caselet:${state.total}:${state.a}:${state.b}:${state.firstDays}`,
  };
}

function build(entry: Entry, seed: string, language: TmwLanguage) {
  switch (entry.solveMode) {
    case "tableWorkforceSchedule": return workforcePackage(entry, seed, language);
    case "tableHeterogeneousContribution": return heterogeneousPackage(entry, seed, language);
    case "tablePipeOperatingSchedule": return pipePackage(entry, seed, language);
    case "caseletStageOneOutput":
    case "caseletRemainingCompletionTime": return caseletPackage(entry, seed, language);
  }
}

export function runTmwCp014PresentationPipeline(input: { questionLanguageId: string; seed: string; language: TmwLanguage }) {
  const entry = entryFor(input.questionLanguageId);
  const built = build(entry, input.seed, input.language);
  const optionSet = buildOptions(built.answer, built.unit, input.language, `${input.seed}:${entry.qlId}`);
  const answerText = valueText(built.answer, built.unit, input.language);
  const errors: string[] = [];
  if (optionSet.options.length !== 4 || new Set(optionSet.options).size !== 4) errors.push("Presentation question must have four unique options");
  if (optionSet.options[optionSet.correctIndex] !== answerText) errors.push("Presentation correct option does not match answer");
  if (optionSet.optionAudit[optionSet.correctIndex]?.misconceptionId !== "CORRECT") errors.push("Presentation option audit mismatch");
  if (built.presentationBlocks.length !== 1) errors.push("Exactly one structured presentation block is required");
  const block = built.presentationBlocks[0]!;
  if (entry.representation === "TABLE" && (block.type !== "table" || block.rows.length < 2)) errors.push("Table representation is incomplete");
  if (entry.representation === "CASELET" && (block.type !== "caselet" || block.paragraphs.length < 2)) errors.push("Caselet representation is incomplete");
  if (built.stem.trim().split(/\s+/u).filter(Boolean).length > 125) errors.push("Presentation stem exceeds 125 whitespace tokens");
  const learner = [built.stem, ...built.steps, ...optionSet.options].join(" ");
  if (/undefined|null|NaN|Infinity|\{\{|\$\{/.test(learner)) errors.push("Presentation learner text contains unresolved content");
  if ((learner.match(/\\\(/g) ?? []).length !== (learner.match(/\\\)/g) ?? []).length) errors.push("Presentation learner text has unbalanced MathJax");

  return {
    archetypeId: "TMW-001" as const,
    canonicalProblemId: TMW_CP_014_ID,
    questionLanguageId: entry.qlId,
    solveMode: entry.solveMode,
    representation: entry.representation,
    language: input.language,
    seed: input.seed,
    difficulty: entry.difficulty,
    stem: built.stem,
    presentationBlocks: built.presentationBlocks,
    caseletGroupId: "caseletGroupId" in built ? built.caseletGroupId : null,
    caseletStimulus: "caseletStimulus" in built ? built.caseletStimulus : null,
    options: optionSet.options,
    optionAudit: optionSet.optionAudit,
    correctIndex: optionSet.correctIndex,
    solution: { answer: built.answer, answerType: built.unit, answerText },
    explanation: {
      opening: text(input.language, "Read the structured information first, then convert each row or stage into work contribution before combining it.", "पहले संरचित जानकारी पढ़ें, फिर प्रत्येक पंक्ति या चरण को कार्य-योगदान में बदलकर जोड़ें।", "ਪਹਿਲਾਂ ਸੰਰਚਿਤ ਜਾਣਕਾਰੀ ਪੜ੍ਹੋ, ਫਿਰ ਹਰ ਕਤਾਰ ਜਾਂ ਪੜਾਅ ਨੂੰ ਕੰਮ-ਯੋਗਦਾਨ ਵਿੱਚ ਬਦਲ ਕੇ ਜੋੜੋ।"),
      givens: [],
      formula: "",
      steps: built.steps,
      shortcut: { title: text(input.language, "Presentation shortcut", "Presentation shortcut", "Presentation shortcut"), steps: [text(input.language, "Work row by row; do not mix units across stages.", "हर पंक्ति अलग हल करें; चरणों के बीच इकाइयाँ न मिलाएँ।", "ਹਰ ਕਤਾਰ ਵੱਖ ਹੱਲ ਕਰੋ; ਪੜਾਅਾਂ ਵਿਚ ਇਕਾਈਆਂ ਨਾ ਮਿਲਾਓ।")] },
      commonTrap: { optionLabel: text(input.language, "Common trap", "सामान्य गलती", "ਆਮ ਗਲਤੀ"), optionText: optionSet.options.find((_option, index) => index !== optionSet.correctIndex)!, misconceptionId: "MISREAD_STRUCTURED_DATA", explanation: text(input.language, "A common error is to ignore one row/stage or combine raw counts before accounting for time, efficiency or direction.", "आम गलती किसी एक पंक्ति/चरण को छोड़ना या समय, दक्षता या दिशा को ध्यान में रखे बिना संख्याएँ जोड़ना है।", "ਆਮ ਗਲਤੀ ਕਿਸੇ ਇੱਕ ਕਤਾਰ/ਪੜਾਅ ਨੂੰ ਛੱਡਣਾ ਜਾਂ ਸਮਾਂ, ਕੁਸ਼ਲਤਾ ਜਾਂ ਦਿਸ਼ਾ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖੇ ਬਿਨਾਂ ਗਿਣਤੀਆਂ ਜੋੜਨਾ ਹੈ।") },
      conclusion: text(input.language, `Therefore, the required answer is ${answerText}.`, `अतः आवश्यक उत्तर ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉੱਤਰ ${answerText} ਹੈ।`),
    },
    learnerExplanationVersion: "TMW_PRESENTATION_V1" as const,
    mathematicalFingerprint: `${entry.solveMode}|${built.fingerprint}|answer=${rationalKey(built.answer)}`,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false as const,
  };
}
