import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";

export type TmwCp012DsLanguage = "en" | "hi" | "pa";
export type TmwCp012DsClass = "I_ALONE" | "II_ALONE" | "BOTH_TOGETHER" | "EVEN_TOGETHER_INSUFFICIENT";

export const TMW_CP_012_DS_QLS = [
  { qlId: "TMW-QL-215", solveMode: "dataSufficiencyCombinedWork", answerType: "DATA_SUFFICIENCY_CLASS", difficulty: "Medium" },
  { qlId: "TMW-QL-216", solveMode: "dataSufficiencyEfficiencyRelation", answerType: "DATA_SUFFICIENCY_CLASS", difficulty: "Medium" },
  { qlId: "TMW-QL-217", solveMode: "dataSufficiencyWorkforceDaysHours", answerType: "DATA_SUFFICIENCY_CLASS", difficulty: "Medium" },
  { qlId: "TMW-QL-218", solveMode: "dataSufficiencyStagedWork", answerType: "DATA_SUFFICIENCY_CLASS", difficulty: "Hard" },
  { qlId: "TMW-QL-219", solveMode: "dataSufficiencyPipesLeak", answerType: "DATA_SUFFICIENCY_CLASS", difficulty: "Medium" },
  { qlId: "TMW-QL-220", solveMode: "dataSufficiencyContributionWages", answerType: "DATA_SUFFICIENCY_CLASS", difficulty: "Medium" },
] as const;

type DsEntry = typeof TMW_CP_012_DS_QLS[number];
type Scenario = 0 | 1 | 2 | 3;

type RenderedDs = {
  stem: string;
  method: string;
  reasons: readonly [string, string, string];
  parameters: Record<string, unknown>;
};

const CLASS_BY_SCENARIO: readonly TmwCp012DsClass[] = [
  "I_ALONE",
  "II_ALONE",
  "BOTH_TOGETHER",
  "EVEN_TOGETHER_INSUFFICIENT",
];

const CLASS_TEXT: Record<TmwCp012DsLanguage, Record<TmwCp012DsClass, string>> = {
  en: {
    I_ALONE: "Statement I alone is sufficient",
    II_ALONE: "Statement II alone is sufficient",
    BOTH_TOGETHER: "Both statements together are sufficient, but neither alone is sufficient",
    EVEN_TOGETHER_INSUFFICIENT: "Even both statements together are insufficient",
  },
  hi: {
    I_ALONE: "केवल कथन I पर्याप्त है",
    II_ALONE: "केवल कथन II पर्याप्त है",
    BOTH_TOGETHER: "दोनों कथन साथ में पर्याप्त हैं, पर कोई भी अकेला पर्याप्त नहीं है",
    EVEN_TOGETHER_INSUFFICIENT: "दोनों कथन साथ में भी पर्याप्त नहीं हैं",
  },
  pa: {
    I_ALONE: "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ",
    II_ALONE: "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ",
    BOTH_TOGETHER: "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ",
    EVEN_TOGETHER_INSUFFICIENT: "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ",
  },
};

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function integer(seed: string, min: number, max: number): number {
  return min + (hashSeed(seed) % (max - min + 1));
}

function scenarioFor(qlId: string, seed: string): Scenario {
  return (hashSeed(`${qlId}:${seed}:scenario`) % 4) as Scenario;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a), y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

function ratio(a: number, b: number): string {
  const g = gcd(a, b);
  return `${a / g}:${b / g}`;
}

function shuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  let state = hashSeed(seed) || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function dsInstruction(language: TmwCp012DsLanguage): string {
  if (language === "hi") return "निर्णय करें कि प्रश्न का निश्चित उत्तर पाने के लिए कौन-सा कथन पर्याप्त है।";
  if (language === "pa") return "ਫੈਸਲਾ ਕਰੋ ਕਿ ਪ੍ਰਸ਼ਨ ਦਾ ਨਿਸ਼ਚਿਤ ਉੱਤਰ ਲੱਭਣ ਲਈ ਕਿਹੜਾ ਕਥਨ ਕਾਫ਼ੀ ਹੈ।";
  return "Decide which statement is sufficient to answer the question uniquely.";
}

function genericMethod(language: TmwCp012DsLanguage): string {
  if (language === "hi") return "पहले कथन I को अकेले जाँचें, फिर कथन II को अकेले, और जरूरत होने पर दोनों को साथ लेकर देखें।";
  if (language === "pa") return "ਪਹਿਲਾਂ ਕਥਨ I ਨੂੰ ਇਕੱਲਾ ਜਾਂਚੋ, ਫਿਰ ਕਥਨ II ਨੂੰ ਇਕੱਲਾ, ਅਤੇ ਲੋੜ ਪੈਣ ਉੱਤੇ ਦੋਵੇਂ ਨੂੰ ਇਕੱਠੇ ਜਾਂਚੋ।";
  return "Test Statement I alone, then Statement II alone, and only then combine them if necessary.";
}

function scenarioReasons(language: TmwCp012DsLanguage, scenario: Scenario, formulaHint: string): readonly [string, string, string] {
  if (language === "hi") {
    if (scenario === 0) return [
      `कथन I आवश्यक सटीक मात्रा देता है; ${formulaHint} से उत्तर निश्चित हो जाता है।`,
      "कथन II केवल तुलना/दिशा बताता है, इसलिए कई मान संभव रहते हैं।",
      "कथन I अकेले ही पर्याप्त है; कथन II जोड़ने की जरूरत नहीं है।",
    ];
    if (scenario === 1) return [
      "कथन I केवल तुलना/दिशा बताता है, इसलिए कई मान संभव रहते हैं।",
      `कथन II आवश्यक सटीक मात्रा देता है; ${formulaHint} से उत्तर निश्चित हो जाता है।`,
      "कथन II अकेले ही पर्याप्त है; कथन I जोड़ने की जरूरत नहीं है।",
    ];
    if (scenario === 2) return [
      "कथन I एक आवश्यक मात्रा देता है, लेकिन दूसरी मात्रा अभी अज्ञात रहती है।",
      "कथन II दूसरी आवश्यक मात्रा देता है, लेकिन पहली मात्रा अकेले इससे नहीं मिलती।",
      `दोनों कथनों को साथ लेने पर सभी आवश्यक मात्राएँ मिल जाती हैं और ${formulaHint} से एक निश्चित उत्तर मिलता है।`,
    ];
    return [
      "कथन I केवल अनुपात/तुलना देता है; पूर्ण पैमाना तय नहीं होता।",
      "कथन II भी केवल गुणात्मक या अधूरी जानकारी देता है।",
      "दोनों को साथ लेने पर भी एक से अधिक मान संभव हैं, इसलिए निश्चित उत्तर नहीं मिलता।",
    ];
  }
  if (language === "pa") {
    if (scenario === 0) return [
      `ਕਥਨ I ਲੋੜੀਂਦੀ ਸਹੀ ਮਾਤਰਾ ਦਿੰਦਾ ਹੈ; ${formulaHint} ਨਾਲ ਉੱਤਰ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ।`,
      "ਕਥਨ II ਕੇਵਲ ਤੁਲਨਾ/ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਕਈ ਮੁੱਲ ਸੰਭਵ ਰਹਿੰਦੇ ਹਨ।",
      "ਕਥਨ I ਇਕੱਲਾ ਹੀ ਕਾਫ਼ੀ ਹੈ; ਕਥਨ II ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।",
    ];
    if (scenario === 1) return [
      "ਕਥਨ I ਕੇਵਲ ਤੁਲਨਾ/ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਕਈ ਮੁੱਲ ਸੰਭਵ ਰਹਿੰਦੇ ਹਨ।",
      `ਕਥਨ II ਲੋੜੀਂਦੀ ਸਹੀ ਮਾਤਰਾ ਦਿੰਦਾ ਹੈ; ${formulaHint} ਨਾਲ ਉੱਤਰ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ।`,
      "ਕਥਨ II ਇਕੱਲਾ ਹੀ ਕਾਫ਼ੀ ਹੈ; ਕਥਨ I ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।",
    ];
    if (scenario === 2) return [
      "ਕਥਨ I ਇੱਕ ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਦਿੰਦਾ ਹੈ, ਪਰ ਦੂਜੀ ਮਾਤਰਾ ਅਜੇ ਅਣਜਾਣ ਰਹਿੰਦੀ ਹੈ।",
      "ਕਥਨ II ਦੂਜੀ ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਦਿੰਦਾ ਹੈ, ਪਰ ਪਹਿਲੀ ਮਾਤਰਾ ਇਸ ਨਾਲ ਇਕੱਲੀ ਨਹੀਂ ਮਿਲਦੀ।",
      `ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੈਣ ਉੱਤੇ ਸਾਰੀਆਂ ਲੋੜੀਂਦੀਆਂ ਮਾਤਰਾਂ ਮਿਲ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ ${formulaHint} ਨਾਲ ਇੱਕ ਨਿਸ਼ਚਿਤ ਉੱਤਰ ਮਿਲਦਾ ਹੈ।`,
    ];
    return [
      "ਕਥਨ I ਕੇਵਲ ਅਨੁਪਾਤ/ਤੁਲਨਾ ਦਿੰਦਾ ਹੈ; ਪੂਰਾ ਪੈਮਾਨਾ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੁੰਦਾ।",
      "ਕਥਨ II ਵੀ ਕੇਵਲ ਗੁਣਾਤਮਕ ਜਾਂ ਅਧੂਰੀ ਜਾਣਕਾਰੀ ਦਿੰਦਾ ਹੈ।",
      "ਦੋਵੇਂ ਇਕੱਠੇ ਲੈਣ ਉੱਤੇ ਵੀ ਇੱਕ ਤੋਂ ਵੱਧ ਮੁੱਲ ਸੰਭਵ ਹਨ, ਇਸ ਲਈ ਨਿਸ਼ਚਿਤ ਉੱਤਰ ਨਹੀਂ ਮਿਲਦਾ।",
    ];
  }
  if (scenario === 0) return [
    `Statement I supplies the missing exact quantity, so ${formulaHint} gives a unique answer.`,
    "Statement II gives only a comparison or direction, so several values remain possible.",
    "Statement I is already sufficient; Statement II is not needed.",
  ];
  if (scenario === 1) return [
    "Statement I gives only a comparison or direction, so several values remain possible.",
    `Statement II supplies the missing exact quantity, so ${formulaHint} gives a unique answer.`,
    "Statement II is already sufficient; Statement I is not needed.",
  ];
  if (scenario === 2) return [
    "Statement I supplies one required quantity but leaves another unknown.",
    "Statement II supplies the other required quantity but does not determine the first one by itself.",
    `Together the statements supply every required quantity, so ${formulaHint} gives a unique answer.`,
  ];
  return [
    "Statement I gives only a ratio or comparison; it does not fix the absolute scale.",
    "Statement II is also qualitative or incomplete.",
    "Even together, the statements allow more than one numerical answer.",
  ];
}

function combinedWork(entry: DsEntry, seed: string, language: TmwCp012DsLanguage, scenario: Scenario): RenderedDs {
  const a = 10 + 2 * integer(`${seed}:a`, 0, 4);
  const b = a + 4 + 2 * integer(`${seed}:b`, 0, 4);
  const effRatio = ratio(b, a);
  const base = scenario <= 1
    ? (language === "en" ? `A alone completes a work in ${a} days.` : language === "hi" ? `A अकेला एक काम ${a} दिन में पूरा करता है।` : `A ਇਕੱਲਾ ਇੱਕ ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ।`)
    : (language === "en" ? "A and B work at constant individual rates on the same job." : language === "hi" ? "A और B एक ही काम पर स्थिर व्यक्तिगत दर से काम करते हैं।" : "A ਅਤੇ B ਇੱਕੋ ਕੰਮ ਉੱਤੇ ਸਥਿਰ ਵਿਅਕਤੀਗਤ ਦਰ ਨਾਲ ਕੰਮ ਕਰਦੇ ਹਨ।");
  const exactB = language === "en" ? `B alone completes the work in ${b} days.` : language === "hi" ? `B अकेला काम ${b} दिन में पूरा करता है।` : `B ਇਕੱਲਾ ਕੰਮ ${b} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ।`;
  const weak = language === "en" ? "B is less efficient than A." : language === "hi" ? "B, A से कम कुशल है।" : "B, A ਨਾਲੋਂ ਘੱਟ ਕੁਸ਼ਲ ਹੈ।";
  const exactA = language === "en" ? `A alone completes the work in ${a} days.` : language === "hi" ? `A अकेला काम ${a} दिन में पूरा करता है।` : `A ਇਕੱਲਾ ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ।`;
  const ratioOnly = language === "en" ? `The efficiency ratio A:B is ${effRatio}.` : language === "hi" ? `A:B की कार्यक्षमता का अनुपात ${effRatio} है।` : `A:B ਦੀ ਕੁਸ਼ਲਤਾ ਦਾ ਅਨੁਪਾਤ ${effRatio} ਹੈ।`;
  const statements = scenario === 0 ? [exactB, weak] : scenario === 1 ? [weak, exactB] : scenario === 2 ? [exactA, exactB] : [ratioOnly, weak];
  const question = language === "en" ? "Can the time taken by A and B together be determined?" : language === "hi" ? "क्या A और B द्वारा मिलकर लिया गया समय निश्चित किया जा सकता है?" : "ਕੀ A ਅਤੇ B ਵੱਲੋਂ ਮਿਲ ਕੇ ਲਿਆ ਸਮਾਂ ਨਿਸ਼ਚਿਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?";
  const formula = language === "en" ? "adding the two reciprocal work rates" : language === "hi" ? "दोनों की व्युत्क्रम कार्य-दरों को जोड़ने" : "ਦੋਵੇਂ ਦੀਆਂ ਉਲਟੀ ਕੰਮ-ਦਰਾਂ ਜੋੜਣ";
  return { stem: `${base} ${question} ${dsInstruction(language)} ${language === "en" ? "Statement I" : language === "hi" ? "कथन I" : "ਕਥਨ I"}: ${statements[0]} ${language === "en" ? "Statement II" : language === "hi" ? "कथन II" : "ਕਥਨ II"}: ${statements[1]}`, method: genericMethod(language), reasons: scenarioReasons(language, scenario, formula), parameters: { family: entry.solveMode, scenario, aTime: a, bTime: b, efficiencyRatio: effRatio } };
}

function efficiencyRelation(entry: DsEntry, seed: string, language: TmwCp012DsLanguage, scenario: Scenario): RenderedDs {
  const a = 8 + 2 * integer(`${seed}:a`, 0, 5);
  const b = a + 4 + 2 * integer(`${seed}:b`, 0, 4);
  const effRatio = ratio(b, a);
  const base = scenario <= 1
    ? (language === "en" ? `B alone completes a work in ${b} days.` : language === "hi" ? `B अकेला एक काम ${b} दिन में पूरा करता है।` : `B ਇਕੱਲਾ ਇੱਕ ਕੰਮ ${b} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ।`)
    : (language === "en" ? "A and B have constant work rates." : language === "hi" ? "A और B की कार्य-दरें स्थिर हैं।" : "A ਅਤੇ B ਦੀਆਂ ਕੰਮ-ਦਰਾਂ ਸਥਿਰ ਹਨ।");
  const exactRatio = language === "en" ? `The efficiency ratio A:B is ${effRatio}.` : language === "hi" ? `A:B की कार्यक्षमता का अनुपात ${effRatio} है।` : `A:B ਦੀ ਕੁਸ਼ਲਤਾ ਦਾ ਅਨੁਪਾਤ ${effRatio} ਹੈ।`;
  const weak = language === "en" ? "A is more efficient than B." : language === "hi" ? "A, B से अधिक कुशल है।" : "A, B ਨਾਲੋਂ ਵੱਧ ਕੁਸ਼ਲ ਹੈ।";
  const exactB = language === "en" ? `B alone takes ${b} days.` : language === "hi" ? `B अकेला ${b} दिन लेता है।` : `B ਇਕੱਲਾ ${b} ਦਿਨ ਲੈਂਦਾ ਹੈ।`;
  const statements = scenario === 0 ? [exactRatio, weak] : scenario === 1 ? [weak, exactRatio] : scenario === 2 ? [exactB, exactRatio] : [exactRatio, weak];
  const question = language === "en" ? "Can A's individual completion time be determined?" : language === "hi" ? "क्या A का अकेले काम पूरा करने का समय निश्चित किया जा सकता है?" : "ਕੀ A ਦਾ ਇਕੱਲੇ ਕੰਮ ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ ਨਿਸ਼ਚਿਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?";
  const formula = language === "en" ? "the inverse relation between efficiency and time" : language === "hi" ? "कार्यक्षमता और समय के व्युत्क्रम संबंध" : "ਕੁਸ਼ਲਤਾ ਅਤੇ ਸਮੇਂ ਦੇ ਉਲਟ ਸੰਬੰਧ";
  return { stem: `${base} ${question} ${dsInstruction(language)} ${language === "en" ? "Statement I" : language === "hi" ? "कथन I" : "ਕਥਨ I"}: ${statements[0]} ${language === "en" ? "Statement II" : language === "hi" ? "कथन II" : "ਕਥਨ II"}: ${statements[1]}`, method: genericMethod(language), reasons: scenarioReasons(language, scenario, formula), parameters: { family: entry.solveMode, scenario, aTime: a, bTime: b, efficiencyRatio: effRatio } };
}

function workforce(entry: DsEntry, seed: string, language: TmwCp012DsLanguage, scenario: Scenario): RenderedDs {
  const workers = 18 + 3 * integer(`${seed}:m`, 0, 4);
  const oldDays = 12 + integer(`${seed}:od`, 0, 6);
  const newDays = 8 + integer(`${seed}:nd`, 0, 3);
  const oldHours = 6 + integer(`${seed}:oh`, 0, 2);
  const newHours = 8 + integer(`${seed}:nh`, 0, 2);
  const baseCommon = language === "en" ? `${workers} equally efficient workers complete a fixed job in ${oldDays} days. The same job must now be completed in ${newDays} days.` : language === "hi" ? `${workers} समान कुशल श्रमिक एक निश्चित काम ${oldDays} दिन में पूरा करते हैं। वही काम अब ${newDays} दिन में पूरा करना है।` : `${workers} ਇਕੋ ਜਿਹੇ ਕੁਸ਼ਲ ਮਜ਼ਦੂਰ ਇੱਕ ਨਿਸ਼ਚਿਤ ਕੰਮ ${oldDays} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਉਹੀ ਕੰਮ ਹੁਣ ${newDays} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਨਾ ਹੈ।`;
  const base = scenario === 0 ? `${baseCommon} ${language === "en" ? `The new shift is ${newHours} hours/day.` : language === "hi" ? `नई पाली ${newHours} घंटे/दिन है।` : `ਨਵੀਂ ਸ਼ਿਫ਼ਟ ${newHours} ਘੰਟੇ/ਦਿਨ ਹੈ।`}` : scenario === 1 ? `${baseCommon} ${language === "en" ? `The old shift is ${oldHours} hours/day.` : language === "hi" ? `पुरानी पाली ${oldHours} घंटे/दिन है।` : `ਪੁਰਾਣੀ ਸ਼ਿਫ਼ਟ ${oldHours} ਘੰਟੇ/ਦਿਨ ਹੈ।`}` : baseCommon;
  const exactOld = language === "en" ? `The old shift was ${oldHours} hours/day.` : language === "hi" ? `पुरानी पाली ${oldHours} घंटे/दिन थी।` : `ਪੁਰਾਣੀ ਸ਼ਿਫ਼ਟ ${oldHours} ਘੰਟੇ/ਦਿਨ ਸੀ।`;
  const exactNew = language === "en" ? `The new shift is ${newHours} hours/day.` : language === "hi" ? `नई पाली ${newHours} घंटे/दिन है।` : `ਨਵੀਂ ਸ਼ਿਫ਼ਟ ${newHours} ਘੰਟੇ/ਦਿਨ ਹੈ।`;
  const weak = language === "en" ? "The new shift is longer than the old shift." : language === "hi" ? "नई पाली पुरानी पाली से लंबी है।" : "ਨਵੀਂ ਸ਼ਿਫ਼ਟ ਪੁਰਾਣੀ ਸ਼ਿਫ਼ਟ ਨਾਲੋਂ ਲੰਮੀ ਹੈ।";
  const range = language === "en" ? "Both shifts are between 6 and 10 hours/day." : language === "hi" ? "दोनों पालियाँ 6 से 10 घंटे/दिन के बीच हैं।" : "ਦੋਵੇਂ ਸ਼ਿਫ਼ਟਾਂ 6 ਤੋਂ 10 ਘੰਟੇ/ਦਿਨ ਦੇ ਵਿਚਕਾਰ ਹਨ।";
  const statements = scenario === 0 ? [exactOld, weak] : scenario === 1 ? [weak, exactNew] : scenario === 2 ? [exactOld, exactNew] : [weak, range];
  const question = language === "en" ? "Can the required new number of workers be determined?" : language === "hi" ? "क्या आवश्यक नई श्रमिक संख्या निश्चित की जा सकती है?" : "ਕੀ ਲੋੜੀਂਦੀ ਨਵੀਂ ਮਜ਼ਦੂਰ ਗਿਣਤੀ ਨਿਸ਼ਚਿਤ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ?";
  const formula = language === "en" ? "workers × days × hours = constant work" : language === "hi" ? "श्रमिक × दिन × घंटे = स्थिर काम" : "ਮਜ਼ਦੂਰ × ਦਿਨ × ਘੰਟੇ = ਨਿਸ਼ਚਿਤ ਕੰਮ";
  return { stem: `${base} ${question} ${dsInstruction(language)} ${language === "en" ? "Statement I" : language === "hi" ? "कथन I" : "ਕਥਨ I"}: ${statements[0]} ${language === "en" ? "Statement II" : language === "hi" ? "कथन II" : "ਕਥਨ II"}: ${statements[1]}`, method: genericMethod(language), reasons: scenarioReasons(language, scenario, formula), parameters: { family: entry.solveMode, scenario, workers, oldDays, newDays, oldHours, newHours } };
}

function stagedWork(entry: DsEntry, seed: string, language: TmwCp012DsLanguage, scenario: Scenario): RenderedDs {
  const a = 12 + 2 * integer(`${seed}:a`, 0, 4);
  const b = 8 + 2 * integer(`${seed}:b`, 0, 4);
  const delay = 2 + integer(`${seed}:delay`, 0, Math.max(1, Math.min(4, a - 3)));
  const base = scenario <= 1
    ? (language === "en" ? `A alone can finish a job in ${a} days, and B joins after ${delay} days.` : language === "hi" ? `A अकेला काम ${a} दिन में पूरा कर सकता है और B ${delay} दिन बाद जुड़ता है।` : `A ਇਕੱਲਾ ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦਾ ਹੈ ਅਤੇ B ${delay} ਦਿਨਾਂ ਬਾਅਦ ਜੁੜਦਾ ਹੈ।`)
    : (language === "en" ? `A alone can finish a job in ${a} days.` : language === "hi" ? `A अकेला काम ${a} दिन में पूरा कर सकता है।` : `A ਇਕੱਲਾ ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦਾ ਹੈ।`);
  const exactB = language === "en" ? `B alone can finish the job in ${b} days.` : language === "hi" ? `B अकेला काम ${b} दिन में पूरा कर सकता है।` : `B ਇਕੱਲਾ ਕੰਮ ${b} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦਾ ਹੈ।`;
  const exactDelay = language === "en" ? `B joins exactly ${delay} days after A starts.` : language === "hi" ? `B, A के शुरू करने के ठीक ${delay} दिन बाद जुड़ता है।` : `B, A ਦੇ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਠੀਕ ${delay} ਦਿਨਾਂ ਬਾਅਦ ਜੁੜਦਾ ਹੈ।`;
  const weakB = language === "en" ? "B is more efficient than A." : language === "hi" ? "B, A से अधिक कुशल है।" : "B, A ਨਾਲੋਂ ਵੱਧ ਕੁਸ਼ਲ ਹੈ।";
  const weakDelay = language === "en" ? "B joins sometime after A has started." : language === "hi" ? "B, A के शुरू करने के कुछ समय बाद जुड़ता है।" : "B, A ਦੇ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਕੁਝ ਸਮੇਂ ਬਾਅਦ ਜੁੜਦਾ ਹੈ।";
  const statements = scenario === 0 ? [exactB, weakB] : scenario === 1 ? [weakB, exactB] : scenario === 2 ? [exactB, exactDelay] : [weakB, weakDelay];
  const question = language === "en" ? "Can the total completion time be determined?" : language === "hi" ? "क्या काम पूरा होने का कुल समय निश्चित किया जा सकता है?" : "ਕੀ ਕੰਮ ਪੂਰਾ ਹੋਣ ਦਾ ਕੁੱਲ ਸਮਾਂ ਨਿਸ਼ਚਿਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?";
  const formula = language === "en" ? "work done before joining plus the later combined rate" : language === "hi" ? "जुड़ने से पहले किए काम और बाद की संयुक्त दर" : "ਜੁੜਨ ਤੋਂ ਪਹਿਲਾਂ ਹੋਇਆ ਕੰਮ ਅਤੇ ਬਾਅਦ ਦੀ ਮਿਲੀ-ਜੁਲੀ ਦਰ";
  return { stem: `${base} ${question} ${dsInstruction(language)} ${language === "en" ? "Statement I" : language === "hi" ? "कथन I" : "ਕਥਨ I"}: ${statements[0]} ${language === "en" ? "Statement II" : language === "hi" ? "कथन II" : "ਕਥਨ II"}: ${statements[1]}`, method: genericMethod(language), reasons: scenarioReasons(language, scenario, formula), parameters: { family: entry.solveMode, scenario, aTime: a, bTime: b, joinDelay: delay } };
}

function pipesLeak(entry: DsEntry, seed: string, language: TmwCp012DsLanguage, scenario: Scenario): RenderedDs {
  const inlet = 8 + 2 * integer(`${seed}:inlet`, 0, 5);
  const leak = inlet * (2 + integer(`${seed}:leak`, 0, 2));
  const base = scenario <= 1
    ? (language === "en" ? `An inlet alone fills a tank in ${inlet} hours.` : language === "hi" ? `एक भराव पाइप अकेली टंकी को ${inlet} घंटे में भरती है।` : `ਇੱਕ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਇਕੱਲੀ ਟੈਂਕੀ ਨੂੰ ${inlet} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦੀ ਹੈ।`)
    : (language === "en" ? "An inlet and a leak operate simultaneously on a tank." : language === "hi" ? "एक भराव पाइप और एक रिसाव टंकी पर एक साथ काम करते हैं।" : "ਇੱਕ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਅਤੇ ਇੱਕ ਰਿਸਾਅ ਟੈਂਕੀ ਉੱਤੇ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ।");
  const exactLeak = language === "en" ? `The leak alone empties a full tank in ${leak} hours.` : language === "hi" ? `रिसाव अकेला पूरी टंकी को ${leak} घंटे में खाली करता है।` : `ਰਿਸਾਅ ਇਕੱਲਾ ਭਰੀ ਟੈਂਕੀ ਨੂੰ ${leak} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ।`;
  const exactInlet = language === "en" ? `The inlet alone fills the tank in ${inlet} hours.` : language === "hi" ? `भराव पाइप अकेली टंकी को ${inlet} घंटे में भरती है।` : `ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਇਕੱਲੀ ਟੈਂਕੀ ਨੂੰ ${inlet} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦੀ ਹੈ।`;
  const weak = language === "en" ? "The leak empties more slowly than the inlet fills." : language === "hi" ? "रिसाव की खाली करने की दर भराव दर से धीमी है।" : `ਰਿਸਾਅ ਦੀ ਖਾਲੀ ਕਰਨ ਦੀ ਦਰ ਭਰਨ ਦੀ ਦਰ ਨਾਲੋਂ ਹੌਲੀ ਹੈ।`;
  const ratioOnly = language === "en" ? "The inlet's filling rate is twice the leak's emptying rate." : language === "hi" ? "भराव दर, रिसाव की खाली करने की दर की दोगुनी है।" : "ਭਰਨ ਦੀ ਦਰ, ਰਿਸਾਅ ਦੀ ਖਾਲੀ ਕਰਨ ਦੀ ਦਰ ਦੀ ਦੁੱਗਣੀ ਹੈ।";
  const statements = scenario === 0 ? [exactLeak, weak] : scenario === 1 ? [weak, exactLeak] : scenario === 2 ? [exactInlet, exactLeak] : [ratioOnly, weak];
  const question = language === "en" ? "Can the net time to fill the tank with both open be determined?" : language === "hi" ? "क्या दोनों खुले होने पर टंकी भरने का शुद्ध समय निश्चित किया जा सकता है?" : "ਕੀ ਦੋਵੇਂ ਖੁੱਲ੍ਹੇ ਹੋਣ ਉੱਤੇ ਟੈਂਕੀ ਭਰਨ ਦਾ ਸ਼ੁੱਧ ਸਮਾਂ ਨਿਸ਼ਚਿਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?";
  const formula = language === "en" ? "inlet rate minus leak rate" : language === "hi" ? "भराव दर में से रिसाव दर घटाने" : "ਭਰਨ ਦੀ ਦਰ ਵਿੱਚੋਂ ਰਿਸਾਅ ਦਰ ਘਟਾਉਣ";
  return { stem: `${base} ${question} ${dsInstruction(language)} ${language === "en" ? "Statement I" : language === "hi" ? "कथन I" : "ਕਥਨ I"}: ${statements[0]} ${language === "en" ? "Statement II" : language === "hi" ? "कथन II" : "ਕਥਨ II"}: ${statements[1]}`, method: genericMethod(language), reasons: scenarioReasons(language, scenario, formula), parameters: { family: entry.solveMode, scenario, inletTime: inlet, leakTime: leak } };
}

function wages(entry: DsEntry, seed: string, language: TmwCp012DsLanguage, scenario: Scenario): RenderedDs {
  const eA = 2 + integer(`${seed}:ea`, 0, 3);
  const eB = 1 + integer(`${seed}:eb`, 0, Math.max(0, eA - 2));
  const dA = 3 + integer(`${seed}:da`, 0, 3);
  const dB = 2 + integer(`${seed}:db`, 0, 2);
  const pool = 840 + 420 * integer(`${seed}:pool`, 0, 4);
  const eff = ratio(eA, eB);
  const days = ratio(dA, dB);
  const base = scenario <= 1
    ? (language === "en" ? `A and B share ₹${pool} in proportion to work contribution and they work the same number of days.` : language === "hi" ? `A और B ₹${pool} को कार्य-योगदान के अनुपात में बाँटते हैं और दोनों समान दिनों तक काम करते हैं।` : `A ਅਤੇ B ₹${pool} ਨੂੰ ਕੰਮ-ਯੋਗਦਾਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਦੇ ਹਨ ਅਤੇ ਦੋਵੇਂ ਇੱਕੋ ਜਿਹੇ ਦਿਨ ਕੰਮ ਕਰਦੇ ਹਨ।`)
    : (language === "en" ? `A and B share ₹${pool} in proportion to work contribution.` : language === "hi" ? `A और B ₹${pool} को कार्य-योगदान के अनुपात में बाँटते हैं।` : `A ਅਤੇ B ₹${pool} ਨੂੰ ਕੰਮ-ਯੋਗਦਾਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਦੇ ਹਨ।`);
  const exactEff = language === "en" ? `Their efficiency ratio A:B is ${eff}.` : language === "hi" ? `उनकी कार्यक्षमता का अनुपात A:B = ${eff} है।` : `ਉਨ੍ਹਾਂ ਦੀ ਕੁਸ਼ਲਤਾ ਦਾ ਅਨੁਪਾਤ A:B = ${eff} ਹੈ।`;
  const exactDays = language === "en" ? `Their days-worked ratio A:B is ${days}.` : language === "hi" ? `उनके काम किए दिनों का अनुपात A:B = ${days} है।` : `ਉਨ੍ਹਾਂ ਦੇ ਕੰਮ ਕੀਤੇ ਦਿਨਾਂ ਦਾ ਅਨੁਪਾਤ A:B = ${days} ਹੈ।`;
  const weakEff = language === "en" ? "A is more efficient than B." : language === "hi" ? "A, B से अधिक कुशल है।" : "A, B ਨਾਲੋਂ ਵੱਧ ਕੁਸ਼ਲ ਹੈ।";
  const weakDays = language === "en" ? "A works more days than B." : language === "hi" ? "A, B से अधिक दिन काम करता है।" : "A, B ਨਾਲੋਂ ਵੱਧ ਦਿਨ ਕੰਮ ਕਰਦਾ ਹੈ।";
  const statements = scenario === 0 ? [exactEff, weakEff] : scenario === 1 ? [weakEff, exactEff] : scenario === 2 ? [exactEff, exactDays] : [weakEff, weakDays];
  const question = language === "en" ? "Can A's exact share be determined?" : language === "hi" ? "क्या A का सटीक हिस्सा निश्चित किया जा सकता है?" : "ਕੀ A ਦਾ ਸਹੀ ਹਿੱਸਾ ਨਿਸ਼ਚਿਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?";
  const formula = language === "en" ? "contribution = efficiency × days worked" : language === "hi" ? "योगदान = कार्यक्षमता × काम किए दिन" : "ਯੋਗਦਾਨ = ਕੁਸ਼ਲਤਾ × ਕੰਮ ਕੀਤੇ ਦਿਨ";
  return { stem: `${base} ${question} ${dsInstruction(language)} ${language === "en" ? "Statement I" : language === "hi" ? "कथन I" : "ਕਥਨ I"}: ${statements[0]} ${language === "en" ? "Statement II" : language === "hi" ? "कथन II" : "ਕਥਨ II"}: ${statements[1]}`, method: genericMethod(language), reasons: scenarioReasons(language, scenario, formula), parameters: { family: entry.solveMode, scenario, efficiencyRatio: eff, daysRatio: days, totalWages: pool } };
}

function render(entry: DsEntry, seed: string, language: TmwCp012DsLanguage, scenario: Scenario): RenderedDs {
  switch (entry.qlId) {
    case "TMW-QL-215": return combinedWork(entry, seed, language, scenario);
    case "TMW-QL-216": return efficiencyRelation(entry, seed, language, scenario);
    case "TMW-QL-217": return workforce(entry, seed, language, scenario);
    case "TMW-QL-218": return stagedWork(entry, seed, language, scenario);
    case "TMW-QL-219": return pipesLeak(entry, seed, language, scenario);
    case "TMW-QL-220": return wages(entry, seed, language, scenario);
  }
}

export function runTmwCp012DataSufficiencyPipeline(input: { questionLanguageId: string; seed: string; language: TmwCp012DsLanguage }): any {
  const entry = TMW_CP_012_DS_QLS.find((item) => item.qlId === input.questionLanguageId);
  if (!entry) throw new Error(`Unknown CP-012 data-sufficiency QL: ${input.questionLanguageId}`);
  const scenario = scenarioFor(entry.qlId, input.seed);
  const canonicalClass = CLASS_BY_SCENARIO[scenario];
  const rendered = render(entry, input.seed, input.language, scenario);
  const optionTexts = Object.values(CLASS_TEXT[input.language]);
  const options = shuffle(optionTexts, `${entry.qlId}:${input.seed}:${input.language}:options`);
  const answerText = CLASS_TEXT[input.language][canonicalClass];
  const correctIndex = options.indexOf(answerText);
  const learner: TmwLearnerExplanationV2 = {
    method: rendered.method,
    solution: [
      `${input.language === "en" ? "Statement I" : input.language === "hi" ? "कथन I" : "ਕਥਨ I"}: ${rendered.reasons[0]}`,
      `${input.language === "en" ? "Statement II" : input.language === "hi" ? "कथन II" : "ਕਥਨ II"}: ${rendered.reasons[1]}`,
      `${input.language === "en" ? "Together" : input.language === "hi" ? "दोनों साथ" : "ਦੋਵੇਂ ਇਕੱਠੇ"}: ${rendered.reasons[2]}`,
    ],
    answer: input.language === "en" ? `Therefore, ${answerText}.` : input.language === "hi" ? `अतः ${answerText}।` : `ਇਸ ਲਈ ${answerText}।`,
  };
  const errors = [...validateTmwLearnerExplanationV2(learner)];
  if (!rendered.stem.includes("I") || !rendered.stem.includes("II")) errors.push("Both DS statements are not explicit");
  if (options.length !== 4 || new Set(options).size !== 4) errors.push("DS options are not four unique classes");
  if (correctIndex < 0 || options[correctIndex] !== answerText) errors.push("DS correct option is not aligned");

  return {
    archetypeId: "TMW-001",
    canonicalProblemId: "TMW-CP-012",
    questionLanguageId: entry.qlId,
    solveMode: entry.solveMode,
    answerType: entry.answerType,
    answerSemantic: "DATA_SUFFICIENCY_CLASS",
    representation: "DATA_SUFFICIENCY",
    difficulty: entry.difficulty,
    language: input.language,
    seed: input.seed,
    stem: rendered.stem,
    parameters: rendered.parameters,
    solution: { answerText, answerKey: canonicalClass },
    answerText,
    options,
    correctIndex,
    learnerExplanationVersion: "TMW_LEARNER_V2",
    learnerExplanation: learner,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
