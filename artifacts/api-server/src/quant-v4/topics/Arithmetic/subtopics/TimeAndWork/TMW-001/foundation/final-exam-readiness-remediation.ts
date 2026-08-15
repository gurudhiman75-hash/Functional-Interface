type Language = "en" | "hi" | "pa";
type Rational = { numerator: number; denominator: number };
type ExamAffinity = "CORE" | "STANDARD" | "ADVANCED" | "ENRICHMENT" | "SPECIAL_FORMAT";
type ConceptFamily =
  | "WORK_RATE_FOUNDATIONS"
  | "COMBINED_RATES"
  | "EFFICIENCY"
  | "STAGED_JOIN_LEAVE"
  | "ALTERNATING_CYCLES"
  | "WORKFORCE_SCALING"
  | "HETEROGENEOUS_CREWS"
  | "WORK_WAGES"
  | "PIPES_SIMULTANEOUS"
  | "PIPES_STAGED_CYCLES"
  | "VARIABLE_PRODUCTIVITY"
  | "DATA_SUFFICIENCY"
  | "STRUCTURED_TABLE"
  | "STRUCTURED_CASELET";
type DistractorQuality = "MISCONCEPTION_DERIVED" | "MISCONCEPTION_FIRST" | "MIXED_GENERIC";
type DsClass = "I_ONLY" | "II_ONLY" | "TOGETHER_ONLY" | "EITHER_ALONE" | "EVEN_TOGETHER_INSUFFICIENT";

const DS_CLASSES: readonly DsClass[] = [
  "I_ONLY",
  "II_ONLY",
  "TOGETHER_ONLY",
  "EITHER_ALONE",
  "EVEN_TOGETHER_INSUFFICIENT",
];

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

function rat(numerator: number, denominator = 1): Rational {
  if (denominator === 0) throw new Error("TMW final remediation received a zero denominator");
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: Math.abs(denominator) / divisor };
}

function asRat(value: any): Rational {
  return rat(Number(value?.numerator ?? 0), Number(value?.denominator ?? 1));
}

function add(a: Rational, b: Rational): Rational {
  return rat(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
}
function subtract(a: Rational, b: Rational): Rational {
  return rat(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
}
function multiply(a: Rational, b: Rational): Rational {
  return rat(a.numerator * b.numerator, a.denominator * b.denominator);
}
function divide(a: Rational, b: Rational): Rational {
  return rat(a.numerator * b.denominator, a.denominator * b.numerator);
}
function compare(a: Rational, b: Rational): number {
  return a.numerator * b.denominator - b.numerator * a.denominator;
}
function key(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}
function positive(value: Rational): boolean {
  return compare(value, rat(0)) > 0;
}

function numberText(value: Rational): string {
  if (value.denominator === 1) return String(value.numerator);
  const whole = Math.trunc(value.numerator / value.denominator);
  const remainder = Math.abs(value.numerator - whole * value.denominator);
  if (whole !== 0 && remainder !== 0) return `\\(${whole}\\frac{${remainder}}{${value.denominator}}\\)`;
  return `\\(\\frac{${value.numerator}}{${value.denominator}}\\)`;
}

function timeText(value: Rational, language: Language, unit = "day"): string {
  if (unit === "hour") {
    const label = language === "en" ? (value.numerator === value.denominator ? "hour" : "hours") : language === "hi" ? "घंटे" : "ਘੰਟੇ";
    return `${numberText(value)} ${label}`;
  }
  const label = language === "en" ? (value.numerator === value.denominator ? "day" : "days") : language === "hi" ? "दिन" : "ਦਿਨ";
  return `${numberText(value)} ${label}`;
}

function workUnitText(value: Rational, language: Language, base = false): string {
  const label = base
    ? language === "en" ? "base work units" : language === "hi" ? "आधार कार्य इकाइयाँ" : "ਆਧਾਰ ਕੰਮ ਇਕਾਈਆਂ"
    : language === "en" ? "work units" : language === "hi" ? "कार्य इकाइयाँ" : "ਕੰਮ ਇਕਾਈਆਂ";
  return `${numberText(value)} ${label}`;
}

function local(language: Language, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function normalizeVisibleText(value: string, language: Language): string {
  if (language === "hi") {
    return value.replace(/कार्यक्षमता|कार्य-क्षमता/gu, "दक्षता");
  }
  if (language === "pa") {
    return value.replace(/ਕਾਰਗੁਜ਼ਾਰੀ|ਦੱਖਤਾ/gu, "ਕੁਸ਼ਲਤਾ");
  }
  return value;
}

function deepVisibleMap(value: any, language: Language): any {
  if (typeof value === "string") return normalizeVisibleText(value, language);
  if (Array.isArray(value)) return value.map((item) => deepVisibleMap(item, language));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, deepVisibleMap(item, language)]));
  }
  return value;
}

function normalizeLearnerVisibleFields(question: any, language: Language): any {
  const copy = { ...question };
  for (const field of ["stem", "options", "optionAudit", "answerText", "canonicalAnswer", "verifierAnswer", "explanation", "learnerExplanation", "presentationBlocks", "caseletStimulus", "structuredQuestionText"] as const) {
    if (copy[field] !== undefined && copy[field] !== null) copy[field] = deepVisibleMap(copy[field], language);
  }
  if (copy.solution) {
    copy.solution = {
      ...copy.solution,
      answerText: typeof copy.solution.answerText === "string" ? normalizeVisibleText(copy.solution.answerText, language) : copy.solution.answerText,
    };
  }
  return copy;
}

function dsOptionText(value: DsClass, language: Language): string {
  const map: Record<DsClass, readonly [string, string, string]> = {
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
    EITHER_ALONE: [
      "Either Statement I alone or Statement II alone is sufficient.",
      "कथन I अकेला या कथन II अकेला, दोनों में से कोई भी लक्ष्य निर्धारित करने के लिए पर्याप्त है।",
      "ਕਥਨ I ਇਕੱਲਾ ਜਾਂ ਕਥਨ II ਇਕੱਲਾ, ਦੋਵਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਲਕਸ਼ ਨਿਰਧਾਰਤ ਕਰਨ ਲਈ ਕਾਫ਼ੀ ਹੈ।",
    ],
    EVEN_TOGETHER_INSUFFICIENT: [
      "Even both statements together are not sufficient.",
      "दोनों कथन मिलकर भी पर्याप्त नहीं हैं।",
      "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ।",
    ],
  };
  const selected = map[value];
  return local(language, selected[0], selected[1], selected[2]);
}

function arrangeDsOptions(correct: DsClass, seed: string, qlId: string, language: Language) {
  const correctIndex = stableHash(`${seed}:${qlId}:${language}:ds-five-position`) % 5;
  const wrong = DS_CLASSES.filter((value) => value !== correct);
  const classes = [...wrong];
  classes.splice(correctIndex, 0, correct);
  return {
    correctIndex,
    options: classes.map((value) => dsOptionText(value, language)),
    optionAudit: classes.map((value) => ({
      text: dsOptionText(value, language),
      value,
      misconceptionId: value === correct ? "CORRECT" : "WRONG_SUFFICIENCY_CLASS",
    })),
  };
}

function dsTrap(question: any, language: Language): any {
  const trapIndex = question.options.findIndex((_option: string, index: number) => index !== question.correctIndex);
  const optionText = question.options[trapIndex];
  return {
    optionLabel: local(language, `Option ${"ABCDE"[trapIndex]}`, `विकल्प ${"ABCDE"[trapIndex]}`, `ਵਿਕਲਪ ${"ABCDE"[trapIndex]}`),
    optionText,
    misconceptionId: "WRONG_SUFFICIENCY_CLASS",
    explanation: local(
      language,
      `Choosing ${optionText} comes from combining the statements too early or failing to reset before testing the second statement. Test I alone, then II alone, before combining them.`,
      `${optionText} चुनना अक्सर दोनों कथनों को बहुत जल्दी मिलाने या कथन II को अलग से नई शुरुआत करके न जाँचने से होता है। पहले I अकेला, फिर II अकेला जाँचें।`,
      `${optionText} ਚੁਣਨਾ ਅਕਸਰ ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਬਹੁਤ ਜਲਦੀ ਜੋੜਣ ਜਾਂ ਕਥਨ II ਨੂੰ ਵੱਖਰੇ ਤੌਰ ਤੇ ਨਵੀਂ ਸ਼ੁਰੂਆਤ ਨਾਲ ਨਾ ਜਾਂਚਣ ਕਰਕੇ ਹੁੰਦਾ ਹੈ। ਪਹਿਲਾਂ I ਇਕੱਲਾ, ਫਿਰ II ਇਕੱਲਾ ਜਾਂਚੋ।`,
    ),
  };
}

function upgradeExistingDataSufficiency(question: any, qlId: string, language: Language): any {
  if (question.canonicalProblemId !== "TMW-CP-013") return question;
  if (qlId === "TMW-QL-223") return buildEitherAloneVariableProductivity(question, qlId, language);
  const correct = question.classValue as DsClass;
  if (!DS_CLASSES.includes(correct)) return question;
  const arranged = arrangeDsOptions(correct, question.seed, qlId, language);
  const updated = {
    ...question,
    ...arranged,
    canonicalAnswer: dsOptionText(correct, language),
    verifierAnswer: dsOptionText(correct, language),
    dataSufficiencyOptionCount: 5,
    dataSufficiencyClasses: [...DS_CLASSES],
  };
  return {
    ...updated,
    explanation: {
      ...updated.explanation,
      shortcut: {
        title: local(language, "Five-Outcome Data-Sufficiency Rule", "पाँच-परिणाम डेटा-पर्याप्तता नियम", "ਪੰਜ-ਨਤੀਜਾ ਡਾਟਾ-ਪੂਰਤਾ ਨਿਯਮ"),
        steps: [
          local(language, "Test Statement I alone and record whether it fixes one unique target value.", "कथन I को अकेले जाँचें और देखें कि क्या लक्ष्य का एक ही निश्चित मान मिलता है।", "ਕਥਨ I ਨੂੰ ਇਕੱਲਾ ਜਾਂਚੋ ਅਤੇ ਵੇਖੋ ਕਿ ਕੀ ਲਕਸ਼ ਦਾ ਇੱਕੋ ਨਿਸ਼ਚਿਤ ਮੁੱਲ ਮਿਲਦਾ ਹੈ।"),
          local(language, "Reset the question and test Statement II alone; if each statement works independently, choose the either-alone outcome.", "प्रश्न को फिर से शुरू करके कथन II अकेला जाँचें; यदि दोनों कथन अलग-अलग पर्याप्त हों तो 'कोई भी अकेला पर्याप्त' वाला परिणाम चुनें।", "ਸਵਾਲ ਨੂੰ ਮੁੜ ਸ਼ੁਰੂ ਕਰਕੇ ਕਥਨ II ਇਕੱਲਾ ਜਾਂਚੋ; ਜੇ ਦੋਵੇਂ ਕਥਨ ਵੱਖ-ਵੱਖ ਕਾਫ਼ੀ ਹੋਣ ਤਾਂ 'ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ' ਵਾਲਾ ਨਤੀਜਾ ਚੁਣੋ।"),
          local(language, "Combine the statements only if neither one is sufficient on its own.", "दोनों कथनों को केवल तभी मिलाएँ जब कोई भी अकेले पर्याप्त न हो।", "ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਸਿਰਫ਼ ਤਦੋਂ ਜੋੜੋ ਜਦੋਂ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਾ ਹੋਵੇ।"),
        ],
      },
      commonTrap: dsTrap(updated, language),
    },
  };
}

function buildEitherAloneVariableProductivity(question: any, qlId: string, language: Language): any {
  const states = [
    { day1: 10, increase: 2, day2: 12, total3: 36 },
    { day1: 12, increase: 3, day2: 15, total3: 45 },
    { day1: 8, increase: 2, day2: 10, total3: 30 },
    { day1: 15, increase: 5, day2: 20, total3: 60 },
  ] as const;
  const state = states[stableHash(`${question.seed}:${qlId}:either-alone-state`) % states.length];
  const correct: DsClass = "EITHER_ALONE";
  const arranged = arrangeDsOptions(correct, question.seed, qlId, language);
  const stem = local(
    language,
    `A worker's daily output changes by the same amount each day. Can the Day 1 output be determined?\nStatement I: On Day 2 the worker completes ${state.day2} units, and output increases by ${state.increase} units each day.\nStatement II: The worker completes ${state.total3} units in the first 3 days, and output increases by ${state.increase} units each day.`,
    `एक कामगार का दैनिक उत्पादन हर दिन समान मात्रा से बदलता है। क्या पहले दिन का उत्पादन निर्धारित किया जा सकता है?\nकथन I: दूसरे दिन कामगार ${state.day2} इकाइयाँ पूरा करता है और उत्पादन हर दिन ${state.increase} इकाइयों से बढ़ता है।\nकथन II: पहले 3 दिनों में कामगार कुल ${state.total3} इकाइयाँ पूरा करता है और उत्पादन हर दिन ${state.increase} इकाइयों से बढ़ता है।`,
    `ਇੱਕ ਮਜ਼ਦੂਰ ਦਾ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਹਰ ਦਿਨ ਇੱਕੋ ਮਾਤਰਾ ਨਾਲ ਬਦਲਦਾ ਹੈ। ਕੀ ਪਹਿਲੇ ਦਿਨ ਦਾ ਉਤਪਾਦਨ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?\nਕਥਨ I: ਦੂਜੇ ਦਿਨ ਮਜ਼ਦੂਰ ${state.day2} ਇਕਾਈਆਂ ਪੂਰੀਆਂ ਕਰਦਾ ਹੈ ਅਤੇ ਉਤਪਾਦਨ ਹਰ ਦਿਨ ${state.increase} ਇਕਾਈਆਂ ਨਾਲ ਵਧਦਾ ਹੈ।\nਕਥਨ II: ਪਹਿਲੇ 3 ਦਿਨਾਂ ਵਿੱਚ ਮਜ਼ਦੂਰ ਕੁੱਲ ${state.total3} ਇਕਾਈਆਂ ਪੂਰੀਆਂ ਕਰਦਾ ਹੈ ਅਤੇ ਉਤਪਾਦਨ ਹਰ ਦਿਨ ${state.increase} ਇਕਾਈਆਂ ਨਾਲ ਵਧਦਾ ਹੈ।`,
  );
  const canonicalAnswer = dsOptionText(correct, language);
  const updated = {
    ...question,
    solveMode: "dataSufficiencyVariableProductivity",
    representation: "DATA_SUFFICIENCY",
    language,
    stem,
    hiddenState: {
      day1Output: state.day1,
      dailyIncrease: state.increase,
      day2Output: state.day2,
      totalFirstThreeDays: state.total3,
    },
    classValue: correct,
    canonicalAnswer,
    verifierAnswer: canonicalAnswer,
    answerSemantic: "DATA_SUFFICIENCY_CLASS",
    ...arranged,
    dataSufficiencyOptionCount: 5,
    dataSufficiencyClasses: [...DS_CLASSES],
    learnerExplanationVersion: "TMW_DS_V1",
    mathematicalFingerprint: `dataSufficiencyVariableProductivity|either:${state.day1}:${state.increase}:${state.day2}:${state.total3}`,
    validation: { valid: true, errors: [] },
    publiclyPublishable: false,
  };
  return {
    ...updated,
    explanation: {
      opening: local(language, "Test the two statements independently; do not carry information from one statement into the other.", "दोनों कथनों को अलग-अलग जाँचें; एक कथन की जानकारी दूसरे में न मिलाएँ।", "ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚੋ; ਇੱਕ ਕਥਨ ਦੀ ਜਾਣਕਾਰੀ ਦੂਜੇ ਵਿੱਚ ਨਾ ਮਿਲਾਓ।"),
      givens: [
        local(language, "Target: Day 1 output.", "लक्ष्य: पहले दिन का उत्पादन।", "ਲਕਸ਼: ਪਹਿਲੇ ਦਿਨ ਦਾ ਉਤਪਾਦਨ।"),
        local(language, `The daily increase is ${state.increase} units in each statement.`, `दोनों कथनों में दैनिक बढ़ोतरी ${state.increase} इकाइयाँ है।`, `ਦੋਵੇਂ ਕਥਨਾਂ ਵਿੱਚ ਰੋਜ਼ਾਨਾ ਵਾਧਾ ${state.increase} ਇਕਾਈਆਂ ਹੈ।`),
      ],
      formula: "\\(a_2=a_1+d,\\qquad S_3=a_1+(a_1+d)+(a_1+2d)\\)",
      steps: [
        local(language, `From Statement I: Day 1 = ${state.day2} − ${state.increase} = ${state.day1} units, so I alone is sufficient.`, `कथन I से: पहला दिन = ${state.day2} − ${state.increase} = ${state.day1} इकाइयाँ, इसलिए I अकेला पर्याप्त है।`, `ਕਥਨ I ਤੋਂ: ਪਹਿਲਾ ਦਿਨ = ${state.day2} − ${state.increase} = ${state.day1} ਇਕਾਈਆਂ, ਇਸ ਲਈ I ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।`),
        local(language, `From Statement II: 3a + 3(${state.increase}) = ${state.total3}, so a = ${state.day1}; II alone is also sufficient.`, `कथन II से: 3a + 3(${state.increase}) = ${state.total3}, इसलिए a = ${state.day1}; II अकेला भी पर्याप्त है।`, `ਕਥਨ II ਤੋਂ: 3a + 3(${state.increase}) = ${state.total3}, ਇਸ ਲਈ a = ${state.day1}; II ਇਕੱਲਾ ਵੀ ਕਾਫ਼ੀ ਹੈ।`),
        local(language, "Because each statement independently fixes the same target value, choose the either-statement-alone outcome.", "क्योंकि दोनों कथन अलग-अलग लक्ष्य का एक निश्चित मान देते हैं, इसलिए 'कोई भी कथन अकेला पर्याप्त' परिणाम चुनें।", "ਕਿਉਂਕਿ ਦੋਵੇਂ ਕਥਨ ਵੱਖ-ਵੱਖ ਲਕਸ਼ ਦਾ ਇੱਕ ਨਿਸ਼ਚਿਤ ਮੁੱਲ ਦਿੰਦੇ ਹਨ, ਇਸ ਲਈ 'ਕੋਈ ਵੀ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ' ਨਤੀਜਾ ਚੁਣੋ।"),
      ],
      shortcut: {
        title: local(language, "Either-Alone Check", "कोई-भी-अकेला जाँच", "ਕੋਈ-ਵੀ-ਇਕੱਲਾ ਜਾਂਚ"),
        steps: [
          local(language, "Solve I completely, reset, and solve II completely.", "I को पूरा हल करें, फिर नई शुरुआत करके II को पूरा हल करें।", "I ਨੂੰ ਪੂਰਾ ਹੱਲ ਕਰੋ, ਫਿਰ ਨਵੀਂ ਸ਼ੁਰੂਆਤ ਕਰਕੇ II ਨੂੰ ਪੂਰਾ ਹੱਲ ਕਰੋ।"),
          local(language, "If both independently determine the target, select the either-alone option.", "यदि दोनों अलग-अलग लक्ष्य निर्धारित करें, तो कोई-भी-अकेला वाला विकल्प चुनें।", "ਜੇ ਦੋਵੇਂ ਵੱਖ-ਵੱਖ ਲਕਸ਼ ਨਿਰਧਾਰਤ ਕਰਨ, ਤਾਂ ਕੋਈ-ਵੀ-ਇਕੱਲਾ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।"),
        ],
      },
      commonTrap: dsTrap(updated, language),
      conclusion: canonicalAnswer,
    },
  };
}

const CP005_COMPLETION_MODES = new Set([
  "findCompletionTimeForTwoAgentAlternationStartingA",
  "findCompletionTimeForTwoAgentAlternationStartingB",
  "findCompletionTimeForMultiDayCycle",
  "findCompletionTimeForThreeAgentCycle",
  "findCompletionDayAndTerminalFraction",
  "findCompletionWhenHelperWorksEveryNthDay",
  "findCompletionWhenAgentRestsEveryNthDay",
  "findCompletionWithWeekendOrHolidayPattern",
  "findCompletionWithUnequalShiftDurations",
  "findCompletionWithTwoDaysOnOneDayOffPattern",
  "findCompletionWithPeriodicNegativeWork",
  "findCompletionWithRepeatedJoinLeaveCycle",
  "findTimeFromArbitraryCyclePhase",
  "findExactBoundaryCompletion",
  "findCompletionWithinCycleSegment",
]);

function remediateCp005Options(question: any, language: Language): any {
  if (question.canonicalProblemId !== "TMW-CP-005" || !CP005_COMPLETION_MODES.has(question.solveMode)) return question;
  const answer = asRat(question.solution?.answer);
  const cycle = Array.isArray(question.parameters?.cycle) ? question.parameters.cycle : [];
  if (!positive(answer) || cycle.length === 0 || !Number.isInteger(question.correctIndex)) return question;
  const cycleDuration = cycle.reduce((total: Rational, segment: any) => add(total, asRat(segment.duration)), rat(0));
  const terminalDuration = asRat(cycle.at(-1)?.duration ?? rat(1));
  const candidatePool: Array<{ value: Rational; misconceptionId: string }> = [
    { value: subtract(answer, cycleDuration), misconceptionId: "FINAL_CYCLE_OMITTED" },
    { value: add(answer, cycleDuration), misconceptionId: "CYCLE_LENGTH_CONFUSED" },
    { value: subtract(answer, terminalDuration), misconceptionId: "PARTIAL_SEGMENT_IGNORED" },
    { value: add(answer, terminalDuration), misconceptionId: "FULL_FINAL_SEGMENT_ASSUMED" },
  ];
  const seen = new Set([key(answer)]);
  const wrong: Array<{ value: Rational; misconceptionId: string }> = [];
  for (const candidate of candidatePool) {
    if (!positive(candidate.value) || seen.has(key(candidate.value))) continue;
    seen.add(key(candidate.value));
    wrong.push(candidate);
    if (wrong.length === 3) break;
  }
  for (const scale of [2, 3, 4]) {
    if (wrong.length >= 3) break;
    const value = multiply(answer, rat(scale));
    if (!seen.has(key(value))) {
      seen.add(key(value));
      wrong.push({ value, misconceptionId: "PLAUSIBLE_SCALE_ERROR" });
    }
  }
  if (wrong.length !== 3) return question;
  const unit = question.parameters?.timeUnit === "hour" ? "hour" : "day";
  const correct = { text: question.solution.answerText, value: answer, misconceptionId: "CORRECT" };
  const options = wrong.map((item) => ({ ...item, text: timeText(item.value, language, unit) }));
  options.splice(question.correctIndex, 0, correct);
  const updated = { ...question, options: options.map((item) => item.text), optionAudit: options };
  const trapIndex = options.findIndex((item, index) => index !== question.correctIndex && item.misconceptionId !== "CORRECT");
  return {
    ...updated,
    explanation: updated.explanation ? {
      ...updated.explanation,
      commonTrap: {
        ...(updated.explanation.commonTrap ?? {}),
        optionLabel: `Option ${"ABCD"[trapIndex]}`,
        optionText: options[trapIndex].text,
        misconceptionId: options[trapIndex].misconceptionId,
        explanation: local(
          language,
          `${options[trapIndex].text} results from mishandling a whole cycle or the terminal partial turn; preserve complete cycles and solve only the final required segment.`,
          `${options[trapIndex].text} पूरे चक्र या अंतिम आंशिक बारी को गलत संभालने से मिलता है; पूरे चक्र सुरक्षित रखें और केवल अंतिम आवश्यक भाग अलग निकालें।`,
          `${options[trapIndex].text} ਪੂਰੇ ਚੱਕਰ ਜਾਂ ਆਖਰੀ ਅਧੂਰੀ ਵਾਰੀ ਨੂੰ ਗਲਤ ਸੰਭਾਲਣ ਨਾਲ ਮਿਲਦਾ ਹੈ; ਪੂਰੇ ਚੱਕਰ ਠੀਕ ਰੱਖੋ ਅਤੇ ਸਿਰਫ਼ ਆਖਰੀ ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਵੱਖ ਕੱਢੋ।`,
        ),
      },
    } : updated.explanation,
  };
}

function rebuildStructuredOptions(question: any, language: Language): any {
  if (question.canonicalProblemId !== "TMW-CP-014" || question.questionLanguageId === "TMW-QL-226") return question;
  const block = question.presentationBlocks?.[0];
  const answer = asRat(question.solution?.answer);
  if (!block || !positive(answer) || !Number.isInteger(question.correctIndex)) return question;
  const candidates: Array<{ value: Rational; misconceptionId: string }> = [];
  const qlId = question.questionLanguageId;

  if (qlId === "TMW-QL-224" && block.type === "table") {
    const rows = block.rows ?? [];
    if (rows.length >= 2) {
      const w1 = Number(rows[0][1]), d1 = Number(rows[0][2]), w2 = Number(rows[1][1]), d2 = Number(rows[1][2]);
      const total = rat(w1 * d1 + w2 * d2);
      const targetWorkers = divide(total, answer);
      candidates.push(
        { value: divide(rat(w1 * d1), targetWorkers), misconceptionId: "STAGE_TWO_OMITTED" },
        { value: divide(rat(w2 * d2), targetWorkers), misconceptionId: "STAGE_ONE_OMITTED" },
        { value: divide(total, rat(w1 + w2, 2)), misconceptionId: "AVERAGE_WORKFORCE_USED" },
      );
    }
  } else if (qlId === "TMW-QL-225" && block.type === "table") {
    const rows = block.rows ?? [];
    if (rows.length >= 2) {
      const c1 = Number(rows[0][1]), e1 = Number(rows[0][2]), d1 = Number(rows[0][3]);
      const c2 = Number(rows[1][1]), e2 = Number(rows[1][2]), d2 = Number(rows[1][3]);
      candidates.push(
        { value: rat(c1 * d1 + c2 * d2), misconceptionId: "EFFICIENCY_IGNORED" },
        { value: rat(c1 * e1 * d1), misconceptionId: "HELPER_ROW_OMITTED" },
        { value: rat(c2 * e2 * d2), misconceptionId: "SKILLED_ROW_OMITTED" },
      );
    }
  } else if ((qlId === "TMW-QL-227" || qlId === "TMW-QL-228") && block.type === "caselet") {
    const combined = (block.paragraphs ?? []).join(" ");
    const numbers = [...combined.matchAll(/\d+/g)].map((match) => Number(match[0]));
    if (numbers.length >= 4) {
      const [total, a, b, firstDays] = numbers;
      const firstOutput = rat(a * firstDays);
      const remaining = subtract(rat(total), firstOutput);
      if (qlId === "TMW-QL-227") {
        candidates.push(
          { value: rat((a + b) * firstDays), misconceptionId: "B_JOINED_TOO_EARLY" },
          { value: rat(b * firstDays), misconceptionId: "WRONG_TEAM_USED" },
          { value: remaining, misconceptionId: "REMAINING_REPORTED_AS_COMPLETED" },
        );
      } else {
        candidates.push(
          { value: divide(rat(total), rat(a + b)), misconceptionId: "INITIAL_STAGE_IGNORED" },
          { value: divide(remaining, rat(a)), misconceptionId: "B_JOIN_IGNORED" },
          { value: divide(remaining, rat(b)), misconceptionId: "A_CONTINUATION_IGNORED" },
        );
      }
    }
  }

  const seen = new Set([key(answer)]);
  const wrong: Array<{ value: Rational; misconceptionId: string }> = [];
  for (const candidate of candidates) {
    if (!positive(candidate.value) || seen.has(key(candidate.value))) continue;
    seen.add(key(candidate.value));
    wrong.push(candidate);
  }
  for (const scale of [2, 3, 4, 5]) {
    if (wrong.length >= 3) break;
    const value = multiply(answer, rat(scale));
    if (positive(value) && !seen.has(key(value))) {
      seen.add(key(value));
      wrong.push({ value, misconceptionId: "PLAUSIBLE_SCALE_ERROR" });
    }
  }
  if (wrong.length < 3) return question;
  const formatter = (value: Rational): string => {
    if (qlId === "TMW-QL-224" || qlId === "TMW-QL-228") return timeText(value, language, "day");
    if (qlId === "TMW-QL-225") return workUnitText(value, language, true);
    return workUnitText(value, language, false);
  };
  const audit = wrong.slice(0, 3).map((item) => ({ ...item, text: formatter(item.value) }));
  audit.splice(question.correctIndex, 0, { text: question.solution.answerText, value: answer, misconceptionId: "CORRECT" });
  const trapIndex = audit.findIndex((item, index) => index !== question.correctIndex && item.misconceptionId !== "CORRECT");
  return {
    ...question,
    options: audit.map((item) => item.text),
    optionAudit: audit,
    explanation: {
      ...question.explanation,
      commonTrap: {
        ...question.explanation?.commonTrap,
        optionLabel: `Option ${"ABCD"[trapIndex]}`,
        optionText: audit[trapIndex].text,
        misconceptionId: audit[trapIndex].misconceptionId,
        explanation: local(
          language,
          `Choosing ${audit[trapIndex].text} comes from dropping a row or stage, applying a team too early, or combining raw counts before the required rate/efficiency adjustment.`,
          `${audit[trapIndex].text} चुनना किसी पंक्ति/चरण को छोड़ने, किसी टीम को समय से पहले लागू करने या आवश्यक दर/दक्षता समायोजन से पहले कच्ची संख्याएँ जोड़ने से होता है।`,
          `${audit[trapIndex].text} ਚੁਣਨਾ ਕਿਸੇ ਕਤਾਰ/ਪੜਾਅ ਨੂੰ ਛੱਡਣ, ਕਿਸੇ ਟੀਮ ਨੂੰ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਲਾਗੂ ਕਰਨ ਜਾਂ ਲੋੜੀਂਦੀ ਦਰ/ਕੁਸ਼ਲਤਾ ਸੋਧ ਤੋਂ ਪਹਿਲਾਂ ਕੱਚੀਆਂ ਗਿਣਤੀਆਂ ਜੋੜਣ ਨਾਲ ਹੁੰਦਾ ਹੈ।`,
        ),
      },
    },
  };
}

function structuredPrompt(stem: string): string {
  const match = /([^.!?।\n]*\?)\s*$/u.exec(stem.trim());
  return match?.[1]?.trim() || stem.trim();
}

function addStructuredRenderingContract(question: any): any {
  if (question.canonicalProblemId !== "TMW-CP-014") return question;
  return {
    ...question,
    structuredQuestionText: structuredPrompt(String(question.stem ?? "")),
    structuredRenderingContract: {
      mode: "STRUCTURED_PRIMARY_WITH_TEXT_FALLBACK",
      structuredField: "presentationBlocks",
      fallbackField: "stem",
      structuredPromptField: "structuredQuestionText",
      renderTogether: false,
    },
  };
}

function conceptFamily(question: any): ConceptFamily {
  switch (question.canonicalProblemId) {
    case "TMW-CP-001": return "WORK_RATE_FOUNDATIONS";
    case "TMW-CP-002": return "COMBINED_RATES";
    case "TMW-CP-003": return "EFFICIENCY";
    case "TMW-CP-004": return "STAGED_JOIN_LEAVE";
    case "TMW-CP-005": return "ALTERNATING_CYCLES";
    case "TMW-CP-006": return "WORKFORCE_SCALING";
    case "TMW-CP-007": return "HETEROGENEOUS_CREWS";
    case "TMW-CP-008": return "WORK_WAGES";
    case "TMW-CP-009": return "PIPES_SIMULTANEOUS";
    case "TMW-CP-010": return "PIPES_STAGED_CYCLES";
    case "TMW-CP-011": return "VARIABLE_PRODUCTIVITY";
    case "TMW-CP-012": return /ExcludedIndividual/i.test(question.solveMode ?? "") ? "COMBINED_RATES" : "EFFICIENCY";
    case "TMW-CP-013": return "DATA_SUFFICIENCY";
    case "TMW-CP-014": return question.representation === "CASELET" ? "STRUCTURED_CASELET" : "STRUCTURED_TABLE";
    default: return "WORK_RATE_FOUNDATIONS";
  }
}

function examAffinity(question: any): ExamAffinity {
  const cp = question.canonicalProblemId;
  const mode = String(question.solveMode ?? "");
  if (cp === "TMW-CP-013" || cp === "TMW-CP-014") return "SPECIAL_FORMAT";
  if (cp === "TMW-CP-001" || cp === "TMW-CP-002" || cp === "TMW-CP-006" || cp === "TMW-CP-009") {
    if (cp === "TMW-CP-006" && /Dimensional|ChangedDimensions|BatchWorkerAdditions/i.test(mode)) return "ADVANCED";
    return "CORE";
  }
  if (cp === "TMW-CP-010") {
    return /AutomaticLevelControl|ArbitraryCycle|ScheduleAdjustment/i.test(mode) ? "ENRICHMENT" : "ADVANCED";
  }
  if (cp === "TMW-CP-011") {
    return /Geometric|Multiplier/i.test(mode) ? "ENRICHMENT" : "ADVANCED";
  }
  if (cp === "TMW-CP-005") {
    if (/Weekend|Holiday|UnequalShift|PeriodicNegative|ArbitraryCycle|RequiredCycle|StartingAgent|OutputUnderPeriodic/i.test(mode)) return "ENRICHMENT";
    if (/ThreeAgent|MultiDay|Helper|Rests|RepeatedJoinLeave/i.test(mode)) return "ADVANCED";
    return "STANDARD";
  }
  if (cp === "TMW-CP-007" && /IntegerCrew|Composition|WeightedCrewFacts/i.test(mode)) return "ADVANCED";
  return "STANDARD";
}

function distractorQuality(question: any): DistractorQuality {
  const wrong = (question.optionAudit ?? []).filter((option: any) => option.misconceptionId !== "CORRECT");
  const generic = wrong.filter((option: any) => option.misconceptionId === "PLAUSIBLE_SCALE_ERROR").length;
  if (generic === 0) return "MISCONCEPTION_DERIVED";
  if (generic === 1) return "MISCONCEPTION_FIRST";
  return "MIXED_GENERIC";
}

function profiles(affinity: ExamAffinity): string[] {
  if (affinity === "CORE" || affinity === "STANDARD") return ["SSC", "BANK_PRE", "BANK_MAINS", "PUNJAB_STATE"];
  if (affinity === "ADVANCED") return ["SSC", "BANK_MAINS", "PUNJAB_STATE"];
  if (affinity === "ENRICHMENT") return ["BANK_MAINS"];
  return ["BANK_MAINS"];
}

function addSelectionMetadata(question: any): any {
  const family = conceptFamily(question);
  const affinity = examAffinity(question);
  const quality = distractorQuality(question);
  const baseWeight: Record<ExamAffinity, number> = {
    CORE: 1,
    STANDARD: 0.75,
    ADVANCED: 0.35,
    ENRICHMENT: 0.15,
    SPECIAL_FORMAT: 0.5,
  };
  const selectionWeight = Number((baseWeight[affinity] * (quality === "MIXED_GENERIC" ? 0.8 : 1)).toFixed(3));
  return {
    ...question,
    conceptFamily: family,
    diversityKey: `${family}:${question.solveMode ?? question.questionLanguageId}`,
    examReadiness: {
      examAffinity: affinity,
      selectionWeight,
      recommendedProfiles: profiles(affinity),
      distractorQuality: quality,
    },
  };
}

function addPublicExplanationContract(question: any): any {
  const publicExplanation = question.learnerExplanation ?? question.explanation;
  return {
    ...question,
    studentFacingExplanation: publicExplanation,
    explanationContract: {
      publicField: "studentFacingExplanation",
      legacyField: question.learnerExplanation ? "explanation" : null,
      legacyVisibility: question.learnerExplanation ? "INTERNAL_ONLY" : "NOT_APPLICABLE",
    },
  };
}

export function applyTmw001FinalExamReadinessRemediation(
  question: any,
  qlId: string,
  language: Language,
): any {
  let current = upgradeExistingDataSufficiency(question, qlId, language);
  current = remediateCp005Options(current, language);
  current = rebuildStructuredOptions(current, language);
  current = addStructuredRenderingContract(current);
  current = normalizeLearnerVisibleFields(current, language);
  current = addSelectionMetadata(current);
  current = addPublicExplanationContract(current);
  return current;
}
