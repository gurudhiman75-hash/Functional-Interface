import {
  validateTmwLearnerExplanationV2,
  type TmwLearnerExplanationV2,
} from "./learner-explanation-contract";
import type { Tmw001ChapterLanguage } from "./chapter-localized-runtime";

interface R4Question {
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  solveMode?: string;
  stem?: string;
  answerText?: string;
  solution?: { answerText?: string };
  learnerExplanationVersion?: string;
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

const BOILERPLATE = /^(?:Substitute the .*?|Write the .*?|Convert the .*?|Find the .*?|Continue the calculation with the remaining quantity|After simplification, the required value is)\s*:\s*/i;
const PROSE_IN_MATH = /[A-Za-z]{2,}/;

function solvedAnswer(question: R4Question): string {
  return question.solution?.answerText?.trim()
    || question.answerText?.trim()
    || question.learnerExplanation?.answer?.replace(/^.*?\bis\s+/i, "").replace(/[.।]+$/u, "").trim()
    || "the stated answer";
}

function cpId(question: R4Question): string {
  return question.canonicalProblemId ?? question.cpId ?? "";
}

function math(inner: string): string {
  return `\\(${inner.trim()}\\)`;
}

function latexCommandsRemoved(inner: string): string {
  return inner.replace(/\\[A-Za-z]+/g, "");
}

function containsProseInsideMath(inner: string): boolean {
  return PROSE_IN_MATH.test(latexCommandsRemoved(inner));
}

function humanizeMathChunk(chunk: string): string {
  const value = chunk.trim().replace(/^[,;]\s*/, "").replace(/\s*[,;]$/, "");
  if (!value) return "";

  if (/^[A-Za-z]{2,}$/.test(value)) return value;

  const implication = value.match(/^([\s\S]*?)\\Rightarrow\s*([\s\S]+)$/);
  if (implication && containsProseInsideMath(implication[2])) {
    return `${math(implication[1])} ⇒ ${implication[2].trim()}`;
  }

  const stage = value.match(/^Stage\s+(\d+)\s*:\s*([\s\S]+)$/i);
  if (stage) return `Stage ${stage[1]}: ${math(stage[2])}`;

  const labelled = value.match(/^([^=]+)=([\s\S]+)$/);
  if (labelled && containsProseInsideMath(labelled[1])) {
    return `${labelled[1].trim()} = ${math(labelled[2])}`;
  }

  if (containsProseInsideMath(value)) return value;
  return math(value);
}

/** Move explanatory words outside MathJax while keeping actual formulae in MathJax. */
export function normalizeTmwR4MixedMath(value: string): string {
  return value.replace(/\\\(([\s\S]*?)\\\)/g, (_full, inner: string) => {
    const trimmed = inner.trim();
    if (!containsProseInsideMath(trimmed)) return math(trimmed);

    const chunks = trimmed.split(/[,;]\s*\\quad\s*/).map(humanizeMathChunk).filter(Boolean);
    if (chunks.length > 1) return chunks.join("; ");
    return humanizeMathChunk(trimmed);
  }).replace(/\s{2,}/g, " ").trim();
}

function firstMathInner(value: string): string | null {
  const match = /\\\(([\s\S]*?)\\\)/.exec(value);
  return match ? match[1].trim() : null;
}

function isBareGiven(inner: string): boolean {
  const noCommands = inner.replace(/\\(?:%|,|;)/g, "").trim();
  return /^[-+]?\d+(?:\.\d+)?(?:\\%)?$/.test(noCommands)
    || /^\\frac\{\d+\}\{\d+\}$/.test(noCommands);
}

function answerScalar(answer: string): string | null {
  const mathMatch = /\\\(([\s\S]*?\d[\s\S]*?)\\\)/.exec(answer);
  if (mathMatch) return mathMatch[1].trim();
  const fraction = /\b(\d+)\s*\/\s*(\d+)\b/.exec(answer);
  if (fraction) return `\\frac{${fraction[1]}}{${fraction[2]}}`;
  const ratio = /\b(\d+)\s*:\s*(\d+)(?:\s*:\s*(\d+))?\b/.exec(answer);
  if (ratio) return ratio[3] ? `${ratio[1]}:${ratio[2]}:${ratio[3]}` : `${ratio[1]}:${ratio[2]}`;
  const percent = /(-?\d+(?:\.\d+)?)\s*%/.exec(answer);
  if (percent) return `${percent[1]}\\%`;
  const number = /(-?\d+(?:\.\d+)?)/.exec(answer.replace(/₹/g, ""));
  return number?.[1] ?? null;
}

function appendAnswerIfUseful(inner: string, answer: string): string {
  if (/=/.test(inner)) return inner;
  const scalar = answerScalar(answer);
  if (!scalar) return inner;
  if (inner.trim() === scalar.trim()) return inner;
  return `${inner}=${scalar}`;
}

function r2Leads(cp: string, language: Tmw001ChapterLanguage): readonly string[] {
  const byCp: Record<string, { en: string[]; hi: string[]; pa: string[] }> = {
    "TMW-CP-001": {
      en: ["Substitute the given values", "Simplify the rate-time calculation", "Compare with the original case"],
      hi: ["दिए गए मान रखें", "दर-समय की गणना सरल करें", "मूल स्थिति से तुलना करें"],
      pa: ["ਦਿੱਤੇ ਮੁੱਲ ਰੱਖੋ", "ਦਰ-ਸਮਾਂ ਗਣਨਾ ਸੌਖੀ ਕਰੋ", "ਮੂਲ ਹਾਲਤ ਨਾਲ ਤੁਲਨਾ ਕਰੋ"],
    },
    "TMW-CP-002": {
      en: ["Convert the relevant times to rates", "Combine the rates as required", "Convert the result to the asked quantity"],
      hi: ["संबंधित समयों को दरों में बदलें", "आवश्यकतानुसार दरें जोड़ें या घटाएँ", "परिणाम को पूछी गई राशि में बदलें"],
      pa: ["ਸੰਬੰਧਿਤ ਸਮਿਆਂ ਨੂੰ ਦਰਾਂ ਵਿੱਚ ਬਦਲੋ", "ਲੋੜ ਅਨੁਸਾਰ ਦਰਾਂ ਜੋੜੋ ਜਾਂ ਘਟਾਓ", "ਨਤੀਜੇ ਨੂੰ ਪੁੱਛੀ ਗਈ ਮਾਤਰਾ ਵਿੱਚ ਬਦਲੋ"],
    },
    "TMW-CP-003": {
      en: ["Write the efficiency-time comparison", "Simplify the required ratio", "Convert the ratio to the asked value"],
      hi: ["दक्षता-समय की तुलना लिखें", "आवश्यक अनुपात सरल करें", "अनुपात को पूछे गए मान में बदलें"],
      pa: ["ਦੱਖਤਾ-ਸਮਾਂ ਤੁਲਨਾ ਲਿਖੋ", "ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ਸੌਖਾ ਕਰੋ", "ਅਨੁਪਾਤ ਨੂੰ ਪੁੱਛੇ ਗਏ ਮੁੱਲ ਵਿੱਚ ਬਦਲੋ"],
    },
    "TMW-CP-004": {
      en: ["Calculate the work in the first stage", "Find the work left after the event", "Use the next-stage rate on the remainder"],
      hi: ["पहले चरण का काम निकालें", "घटना के बाद बचा काम निकालें", "बचे काम पर अगले चरण की दर लगाएँ"],
      pa: ["ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ ਕੱਢੋ", "ਘਟਨਾ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਕੰਮ ਕੱਢੋ", "ਬਚੇ ਕੰਮ ਉੱਤੇ ਅਗਲੇ ਪੜਾਅ ਦੀ ਦਰ ਲਗਾਓ"],
    },
    "TMW-CP-005": {
      en: ["Calculate one full cycle's work", "Use complete cycles without crossing the finish", "Finish the remainder in the terminal turn"],
      hi: ["एक पूरे चक्र का काम निकालें", "सीमा पार किए बिना पूरे चक्र लगाएँ", "अंतिम बचे काम को अंतिम बारी में पूरा करें"],
      pa: ["ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦਾ ਕੰਮ ਕੱਢੋ", "ਹੱਦ ਪਾਰ ਕੀਤੇ ਬਿਨਾਂ ਪੂਰੇ ਚੱਕਰ ਲਗਾਓ", "ਅੰਤਿਮ ਬਚਿਆ ਕੰਮ ਆਖਰੀ ਵਾਰੀ ਵਿੱਚ ਪੂਰਾ ਕਰੋ"],
    },
    "TMW-CP-006": {
      en: ["Write the equivalent resource-work relation", "Substitute the changed resource and time values", "Solve for the required quantity"],
      hi: ["समतुल्य संसाधन-काम संबंध लिखें", "बदले संसाधन और समय के मान रखें", "आवश्यक राशि निकालें"],
      pa: ["ਸਮਤੁੱਲ ਸਰੋਤ-ਕੰਮ ਸੰਬੰਧ ਲਿਖੋ", "ਬਦਲੇ ਸਰੋਤ ਅਤੇ ਸਮੇਂ ਦੇ ਮੁੱਲ ਰੱਖੋ", "ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਕੱਢੋ"],
    },
  };
  const set = byCp[cp] ?? byCp["TMW-CP-001"];
  return language === "hi" ? set.hi : language === "pa" ? set.pa : set.en;
}

function buildR2Working(question: R4Question, language: Tmw001ChapterLanguage, answer: string): string[] {
  const current = question.learnerExplanation?.solution ?? [];
  const rawWorking = current.slice(0, -1);
  const expressions = rawWorking
    .map((step) => firstMathInner(step.replace(BOILERPLATE, "")))
    .filter((value): value is string => Boolean(value));

  const nonBare = expressions.filter((value) => !isBareGiven(value));
  const chosen = (nonBare.length ? nonBare : expressions).slice(-3);
  const leads = r2Leads(cpId(question), language);

  if (chosen.length === 0) {
    const scalar = answerScalar(answer) ?? "0";
    const lead = language === "hi" ? "गणना से" : language === "pa" ? "ਗਣਨਾ ਤੋਂ" : "The calculation gives";
    return [`${lead} ${math(scalar)}.`];
  }

  return chosen.map((inner, index) => {
    const withAnswer = index === chosen.length - 1 ? appendAnswerIfUseful(inner, answer) : inner;
    return `${leads[Math.min(index, leads.length - 1)]}: ${math(withAnswer)}.`;
  });
}

function symbolLabel(symbol: string, cp: string, language: Tmw001ChapterLanguage): string {
  const key = symbol.replace(/_[\s\S]*$/, "").replace(/\\Delta\s*/, "Δ");
  const labels: Record<string, [string, string, string]> = {
    e: ["Efficiency", "दक्षता", "ਦੱਖਤਾ"],
    r: [cp === "TMW-CP-009" || cp === "TMW-CP-010" ? "Net rate" : "Rate", "शुद्ध दर", "ਸ਼ੁੱਧ ਦਰ"],
    t: ["Stage time", "चरण का समय", "ਪੜਾਅ ਦਾ ਸਮਾਂ"],
    T: ["Time", "समय", "ਸਮਾਂ"],
    L: ["Tank level", "टैंक का स्तर", "ਟੈਂਕ ਦਾ ਪੱਧਰ"],
    C: ["Contribution", "योगदान", "ਯੋਗਦਾਨ"],
    P: ["Payment", "भुगतान", "ਭੁਗਤਾਨ"],
    S: ["Total", "कुल", "ਕੁੱਲ"],
  };
  const entry = labels[key];
  if (!entry) return symbol;
  return language === "hi" ? entry[1] : language === "pa" ? entry[2] : entry[0];
}

function humanizeSymbolicStep(step: string, cp: string, language: Tmw001ChapterLanguage): string {
  let value = normalizeTmwR4MixedMath(step).trim();

  const mathOnly = /^\\\(([\s\S]*?)\\\)[.。।]?$/.exec(value);
  if (!mathOnly) return value;
  const inner = mathOnly[1].trim();

  if ((inner.match(/\be\s*=/g) ?? []).length > 1 && !/[+\-\/:]/.test(inner.replace(/e\s*=\s*\d+/g, ""))) {
    return "";
  }

  const ratio = /^e\s*:\s*e\s*=\s*([\s\S]+)$/.exec(inner);
  if (ratio) {
    const label = language === "hi" ? "दक्षता अनुपात" : language === "pa" ? "ਦੱਖਤਾ ਅਨੁਪਾਤ" : "Efficiency ratio";
    return `${label}: ${math(ratio[1])}.`;
  }

  const lhs = /^([A-Za-z]|[rtePCLST]_[^=]+)\s*=\s*([\s\S]+)$/.exec(inner);
  if (lhs) return `${symbolLabel(lhs[1], cp, language)} = ${math(lhs[2])}.`;

  return value;
}

function buildR3Working(question: R4Question, language: Tmw001ChapterLanguage, answer: string): string[] {
  const current = question.learnerExplanation?.solution ?? [];
  const cp = cpId(question);
  const working = current.slice(0, -1)
    .map((step) => humanizeSymbolicStep(step, cp, language))
    .map((step) => step.replace(/\s{2,}/g, " ").trim())
    .filter(Boolean)
    .filter((step) => !/After simplification|Continue the calculation/i.test(step));

  if (working.length) return working.slice(0, 4);
  const scalar = answerScalar(answer) ?? "0";
  const lead = language === "hi" ? "ऊपर के संबंध से" : language === "pa" ? "ਉਪਰਲੇ ਸੰਬੰਧ ਤੋਂ" : "Using the relation above";
  return [`${lead}, ${math(scalar)} मिलता है।`.replace(" मिलता है।", language === "hi" ? " मिलता है।" : language === "pa" ? " ਮਿਲਦਾ ਹੈ।" : " is obtained.")];
}

function refinedMethod(question: R4Question, language: Tmw001ChapterLanguage): string {
  const current = normalizeTmwR4MixedMath(question.learnerExplanation?.method ?? "");
  const mode = question.solveMode ?? "";

  const choose = (en: string, hi: string, pa: string): string => language === "hi" ? hi : language === "pa" ? pa : en;

  if (/findTwoCategoryEfficiencyRatio|findThreeCategoryEfficiencyRatio/.test(mode)) {
    return choose(
      "For the same work completed in the same time, the two crew capacities are equal; compare count × individual efficiency.",
      "समान काम और समान समय के लिए दोनों दलों की कुल क्षमता बराबर होती है; संख्या × व्यक्तिगत दक्षता की तुलना करें।",
      "ਇੱਕੋ ਕੰਮ ਅਤੇ ਇੱਕੋ ਸਮੇਂ ਲਈ ਦੋਵੇਂ ਟੋਲੀਆਂ ਦੀ ਕੁੱਲ ਸਮਰੱਥਾ ਬਰਾਬਰ ਹੁੰਦੀ ਹੈ; ਗਿਣਤੀ × ਵਿਅਕਤੀਗਤ ਦੱਖਤਾ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    );
  }
  if (mode === "findFillTimeFromPositiveInlets") {
    return choose(
      "Add the inlet rates, then take the reciprocal of the combined rate to get the filling time.",
      "इनलेट की दरें जोड़ें और संयुक्त दर का व्युत्क्रम लेकर भरने का समय निकालें।",
      "ਇਨਲੈੱਟ ਦਰਾਂ ਜੋੜੋ ਅਤੇ ਮਿਲੀ ਦਰ ਦਾ ਉਲਟ ਲੈ ਕੇ ਭਰਨ ਦਾ ਸਮਾਂ ਕੱਢੋ।",
    );
  }
  return current;
}

function cp011Answer(question: R4Question, language: Tmw001ChapterLanguage, answer: string): string | null {
  if (cpId(question) !== "TMW-CP-011") return null;
  const mode = question.solveMode ?? "";
  const choose = (en: string, hi: string, pa: string): string => language === "hi" ? hi : language === "pa" ? pa : en;

  const labels: Record<string, [string, string, string]> = {
    findOutputFromArithmeticDailyRates: ["total output", "कुल उत्पादन", "ਕੁੱਲ ਉਤਪਾਦਨ"],
    findCompletionTimeFromArithmeticDailyRates: ["completion time", "पूरा होने का समय", "ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ"],
    findInitialRateFromArithmeticTotal: ["first-day output", "पहले दिन का उत्पादन", "ਪਹਿਲੇ ਦਿਨ ਦਾ ਉਤਪਾਦਨ"],
    findDailyChangeFromArithmeticTotal: ["daily change", "दैनिक बदलाव", "ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ"],
    findOutputFromGeometricDailyRates: ["total output", "कुल उत्पादन", "ਕੁੱਲ ਉਤਪਾਦਨ"],
    findCompletionTimeFromGeometricDailyRates: ["completion time", "पूरा होने का समय", "ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ"],
    findInitialRateFromGeometricTotal: ["first-day output", "पहले दिन का उत्पादन", "ਪਹਿਲੇ ਦਿਨ ਦਾ ਉਤਪਾਦਨ"],
    findMultiplierFromGeometricTotal: ["daily multiplier", "दैनिक गुणक", "ਰੋਜ਼ਾਨਾ ਗੁਣਕ"],
    findCompletionTimeAfterThresholdRateSwitch: ["completion time", "पूरा होने का समय", "ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ"],
    findUnknownThresholdDay: ["switch day", "दर बदलने का दिन", "ਦਰ ਬਦਲਣ ਦਾ ਦਿਨ"],
    findUnknownPostThresholdRate: ["post-switch rate", "बदलाव के बाद की दर", "ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਦੀ ਦਰ"],
    findOutputWithVaryingCrewByDay: ["total output", "कुल उत्पादन", "ਕੁੱਲ ਉਤਪਾਦਨ"],
    findCombinedVariableAgentOutput: ["total output", "कुल उत्पादन", "ਕੁੱਲ ਉਤਪਾਦਨ"],
    findSignedNetVariableOutput: ["net output", "शुद्ध उत्पादन", "ਸ਼ੁੱਧ ਉਤਪਾਦਨ"],
    findCompletionTimeFromExplicitRateTable: ["completion time", "पूरा होने का समय", "ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ"],
    findRequiredDailyAdjustmentForDeadline: ["additional daily rate required", "आवश्यक अतिरिक्त दैनिक दर", "ਲੋੜੀਂਦੀ ਵਾਧੂ ਰੋਜ਼ਾਨਾ ਦਰ"],
    findOutputAfterThresholdRateSwitch: ["total output", "कुल उत्पादन", "ਕੁੱਲ ਉਤਪਾਦਨ"],
    findCompletionTimeWithVaryingCrewByDay: ["completion time", "पूरा होने का समय", "ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ"],
    findPostThresholdRateChange: ["daily rate change", "दैनिक दर में बदलाव", "ਰੋਜ਼ਾਨਾ ਦਰ ਵਿੱਚ ਬਦਲਾਅ"],
  };
  const label = labels[mode];
  if (!label) return null;
  const selected = language === "hi" ? label[1] : language === "pa" ? label[2] : label[0];
  return choose(
    `Therefore, the ${selected} is ${answer}.`,
    `अतः ${selected} ${answer} है।`,
    `ਇਸ ਲਈ ${selected} ${answer} ਹੈ।`,
  );
}

function fixStem(question: R4Question, language: Tmw001ChapterLanguage): string | undefined {
  if (!question.stem) return question.stem;
  if (language !== "en") return question.stem;
  return question.stem.replace(/\bcompletes 1 components per hour\b/g, "completes 1 component per hour");
}

function policyErrors(learner: TmwLearnerExplanationV2): string[] {
  const errors = validateTmwLearnerExplanationV2(learner);
  const visible = [learner.method, ...learner.solution, learner.answer].join(" ");
  if (/After simplification, the required value is|Continue the calculation with the remaining quantity/i.test(visible)) {
    errors.push("R4 learner explanation contains mechanical R2 boilerplate");
  }
  return errors;
}

export function applyTmw001LearnerExplanationR4ExamReadiness<T extends R4Question>(
  question: T,
  qlId: string,
  language: Tmw001ChapterLanguage,
): T & { learnerExplanationVersion?: "TMW_LEARNER_V2"; learnerExplanation?: TmwLearnerExplanationV2 } {
  const current = question.learnerExplanation;
  if (!current) return question;

  const answer = normalizeTmwR4MixedMath(solvedAnswer(question));
  const ordinal = Number(/^TMW-QL-(\d{3})$/.exec(qlId)?.[1] ?? 0);
  if (!ordinal || ordinal > 211) return question;

  const answerLine = cp011Answer(question, language, answer)
    ?? normalizeTmwR4MixedMath(current.answer);
  const working = ordinal <= 127
    ? buildR2Working(question, language, answer)
    : buildR3Working(question, language, answer);

  const learnerExplanation: TmwLearnerExplanationV2 = {
    method: refinedMethod(question, language),
    solution: [...working.slice(0, 4), answerLine],
    answer: answerLine,
  };

  const r4Errors = policyErrors(learnerExplanation);
  const existingErrors = question.validation?.errors ?? [];
  const combinedErrors = [...existingErrors, ...r4Errors];

  return {
    ...question,
    stem: fixStem(question, language),
    learnerExplanationVersion: "TMW_LEARNER_V2",
    learnerExplanation,
    validation: question.validation
      ? { ...question.validation, valid: combinedErrors.length === 0, errors: combinedErrors }
      : question.validation,
  };
}
