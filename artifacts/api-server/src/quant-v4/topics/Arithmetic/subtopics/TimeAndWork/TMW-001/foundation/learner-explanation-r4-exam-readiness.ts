import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";

type R4Language = "en" | "hi" | "pa";

interface R4Question {
  canonicalProblemId?: string;
  cpId?: string;
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

function cp(question: R4Question): string {
  return question.canonicalProblemId ?? question.cpId ?? "";
}

function answerText(question: R4Question): string {
  return question.solution?.answerText?.trim() || question.answerText?.trim() || "the stated answer";
}

function mj(inner: string): string {
  return `\\(${inner.trim()}\\)`;
}

function hasProse(inner: string): boolean {
  return /[A-Za-z]{2,}/.test(inner.replace(/\\[A-Za-z]+/g, ""));
}

function humanizeMathChunk(chunk: string): string {
  const value = chunk.trim().replace(/^[,;]\s*/, "").replace(/\s*[,;]$/, "");
  if (!value) return "";
  if (/^[A-Za-z]{2,}$/.test(value)) return value;

  const implication = /^([\s\S]*?)\\Rightarrow\s*([\s\S]+)$/.exec(value);
  if (implication && hasProse(implication[2])) return `${mj(implication[1])} ⇒ ${implication[2].trim()}`;

  const stage = /^Stage\s+(\d+)\s*:\s*([\s\S]+)$/i.exec(value);
  if (stage) return `Stage ${stage[1]}: ${mj(stage[2])}`;

  const labelled = /^([^=]+)=([\s\S]+)$/.exec(value);
  if (labelled && hasProse(labelled[1])) return `${labelled[1].trim()} = ${mj(labelled[2])}`;

  return hasProse(value) ? value : mj(value);
}

/** Keep explanatory words outside MathJax. */
export function normalizeTmwR4MixedMath(value: string): string {
  return value.replace(/\\\(([\s\S]*?)\\\)/g, (_all, inner: string) => {
    const trimmed = inner.trim();
    if (!hasProse(trimmed)) return mj(trimmed);
    const chunks = trimmed.split(/[,;]\s*\\quad\s*/).map(humanizeMathChunk).filter(Boolean);
    return chunks.length > 1 ? chunks.join("; ") : humanizeMathChunk(trimmed);
  }).replace(/\s{2,}/g, " ").trim();
}

function firstMath(value: string): string | null {
  return /\\\(([\s\S]*?)\\\)/.exec(value)?.[1]?.trim() ?? null;
}

function usefulCalculation(inner: string): boolean {
  const clean = inner.replace(/\\(?:%|,|;)/g, "").trim();
  if (/^[-+]?\d+(?:\.\d+)?$/.test(clean)) return false;
  return /[=+\-*/:]|\\frac|\\times|\\div|\\cdot/.test(inner) || /\d/.test(inner);
}

function answerScalar(answer: string): string | null {
  const math = /\\\(([\s\S]*?\d[\s\S]*?)\\\)/.exec(answer)?.[1];
  if (math) return math.trim();
  const fraction = /\b(\d+)\s*\/\s*(\d+)\b/.exec(answer);
  if (fraction) return `\\frac{${fraction[1]}}{${fraction[2]}}`;
  const ratio = /\b(\d+)\s*:\s*(\d+)(?:\s*:\s*(\d+))?\b/.exec(answer);
  if (ratio) return ratio[3] ? `${ratio[1]}:${ratio[2]}:${ratio[3]}` : `${ratio[1]}:${ratio[2]}`;
  const percent = /(-?\d+(?:\.\d+)?)\s*%/.exec(answer);
  if (percent) return `${percent[1]}\\%`;
  return /(-?\d+(?:\.\d+)?)/.exec(answer.replace(/₹/g, ""))?.[1] ?? null;
}

function familyLeads(problemId: string, language: R4Language): readonly string[] {
  const sets: Record<string, [string[], string[], string[]]> = {
    "TMW-CP-001": [["Substitute the given values", "Simplify the calculation", "Use the result for the asked quantity"], ["दिए गए मान रखें", "गणना सरल करें", "परिणाम से पूछी गई राशि निकालें"], ["ਦਿੱਤੇ ਮੁੱਲ ਰੱਖੋ", "ਗਣਨਾ ਸੌਖੀ ਕਰੋ", "ਨਤੀਜੇ ਤੋਂ ਪੁੱਛੀ ਗਈ ਮਾਤਰਾ ਕੱਢੋ"]],
    "TMW-CP-002": [["Convert the relevant times to rates", "Combine the rates as required", "Convert the result to the asked quantity"], ["संबंधित समयों को दरों में बदलें", "आवश्यकतानुसार दरें जोड़ें या घटाएँ", "परिणाम को पूछी गई राशि में बदलें"], ["ਸੰਬੰਧਿਤ ਸਮਿਆਂ ਨੂੰ ਦਰਾਂ ਵਿੱਚ ਬਦਲੋ", "ਲੋੜ ਅਨੁਸਾਰ ਦਰਾਂ ਜੋੜੋ ਜਾਂ ਘਟਾਓ", "ਨਤੀਜੇ ਨੂੰ ਪੁੱਛੀ ਗਈ ਮਾਤਰਾ ਵਿੱਚ ਬਦਲੋ"]],
    "TMW-CP-003": [["Write the efficiency-time comparison", "Simplify the required ratio", "Convert it to the asked value"], ["दक्षता-समय की तुलना लिखें", "आवश्यक अनुपात सरल करें", "इसे पूछे गए मान में बदलें"], ["ਦੱਖਤਾ-ਸਮਾਂ ਤੁਲਨਾ ਲਿਖੋ", "ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ਸੌਖਾ ਕਰੋ", "ਇਸ ਨੂੰ ਪੁੱਛੇ ਗਏ ਮੁੱਲ ਵਿੱਚ ਬਦਲੋ"]],
    "TMW-CP-004": [["Calculate the work in the first stage", "Find the work left after the event", "Use the next-stage rate on the remainder"], ["पहले चरण का काम निकालें", "घटना के बाद बचा काम निकालें", "बचे काम पर अगले चरण की दर लगाएँ"], ["ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ ਕੱਢੋ", "ਘਟਨਾ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਕੰਮ ਕੱਢੋ", "ਬਚੇ ਕੰਮ ਉੱਤੇ ਅਗਲੇ ਪੜਾਅ ਦੀ ਦਰ ਲਗਾਓ"]],
    "TMW-CP-005": [["Calculate one full cycle's work", "Use complete cycles without crossing the finish", "Finish the remainder in the terminal turn"], ["एक पूरे चक्र का काम निकालें", "सीमा पार किए बिना पूरे चक्र लगाएँ", "अंतिम बचे काम को अंतिम बारी में पूरा करें"], ["ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦਾ ਕੰਮ ਕੱਢੋ", "ਹੱਦ ਪਾਰ ਕੀਤੇ ਬਿਨਾਂ ਪੂਰੇ ਚੱਕਰ ਲਗਾਓ", "ਅੰਤਿਮ ਬਚਿਆ ਕੰਮ ਆਖਰੀ ਵਾਰੀ ਵਿੱਚ ਪੂਰਾ ਕਰੋ"]],
    "TMW-CP-006": [["Write the equivalent resource-work relation", "Substitute the changed resource and time values", "Solve for the required quantity"], ["समतुल्य संसाधन-काम संबंध लिखें", "बदले संसाधन और समय के मान रखें", "आवश्यक राशि निकालें"], ["ਸਮਤੁੱਲ ਸਰੋਤ-ਕੰਮ ਸੰਬੰਧ ਲਿਖੋ", "ਬਦਲੇ ਸਰੋਤ ਅਤੇ ਸਮੇਂ ਦੇ ਮੁੱਲ ਰੱਖੋ", "ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਕੱਢੋ"]],
  };
  const selected = sets[problemId] ?? sets["TMW-CP-001"];
  return language === "hi" ? selected[1] : language === "pa" ? selected[2] : selected[0];
}

function r2Working(question: R4Question, language: R4Language, answer: string): string[] {
  const source = question.learnerExplanation?.solution?.slice(0, -1) ?? [];
  const expressions = source
    .map((step) => firstMath(step.replace(BOILERPLATE, "")))
    .filter((x): x is string => Boolean(x));
  const calculated = expressions.filter(usefulCalculation);
  const chosen = (calculated.length ? calculated : expressions.slice(-1)).slice(-3);
  const leads = familyLeads(cp(question), language);
  if (!chosen.length) return [`${leads[0]}: ${mj(answerScalar(answer) ?? "0")}.`];
  return chosen.map((expr, index) => `${leads[Math.min(index, leads.length - 1)]}: ${mj(expr)}.`);
}

function symbolLabel(symbol: string, problemId: string, language: R4Language): string {
  const base = symbol.replace(/_.+$/, "");
  const en: Record<string, string> = { e: "Efficiency", r: problemId === "TMW-CP-009" || problemId === "TMW-CP-010" ? "Net rate" : "Rate", t: "Stage time", T: "Time", L: "Tank level", C: "Contribution", P: "Payment", S: "Total" };
  const hi: Record<string, string> = { e: "दक्षता", r: "शुद्ध दर", t: "चरण का समय", T: "समय", L: "टैंक का स्तर", C: "योगदान", P: "भुगतान", S: "कुल" };
  const pa: Record<string, string> = { e: "ਦੱਖਤਾ", r: "ਸ਼ੁੱਧ ਦਰ", t: "ਪੜਾਅ ਦਾ ਸਮਾਂ", T: "ਸਮਾਂ", L: "ਟੈਂਕ ਦਾ ਪੱਧਰ", C: "ਯੋਗਦਾਨ", P: "ਭੁਗਤਾਨ", S: "ਕੁੱਲ" };
  return (language === "hi" ? hi : language === "pa" ? pa : en)[base] ?? symbol;
}

function cleanR3Step(step: string, question: R4Question, language: R4Language): string {
  const normalized = normalizeTmwR4MixedMath(step).trim();
  const mathOnly = /^\\\(([\s\S]*?)\\\)[.।]?$/.exec(normalized);
  if (!mathOnly) return normalized;
  const inner = mathOnly[1].trim();
  if ((inner.match(/\be\s*=/g) ?? []).length > 1) return "";
  const efficiencyRatio = /^e\s*:\s*e\s*=\s*([\s\S]+)$/.exec(inner);
  if (efficiencyRatio) {
    const label = language === "hi" ? "दक्षता अनुपात" : language === "pa" ? "ਦੱਖਤਾ ਅਨੁਪਾਤ" : "Efficiency ratio";
    return `${label}: ${mj(efficiencyRatio[1])}.`;
  }
  const lhs = /^([A-Za-z]|[rtePCLST]_[^=]+)\s*=\s*([\s\S]+)$/.exec(inner);
  if (lhs) return `${symbolLabel(lhs[1], cp(question), language)} = ${mj(lhs[2])}.`;
  return normalized;
}

function r3Working(question: R4Question, language: R4Language, answer: string): string[] {
  const source = question.learnerExplanation?.solution?.slice(0, -1) ?? [];
  const cleaned = source.map((step) => cleanR3Step(step, question, language)).filter(Boolean).slice(0, 4);
  if (cleaned.length) return cleaned;
  const lead = language === "hi" ? "ऊपर के संबंध से" : language === "pa" ? "ਉਪਰਲੇ ਸੰਬੰਧ ਤੋਂ" : "Using the relation above";
  const ending = language === "hi" ? "मिलता है" : language === "pa" ? "ਮਿਲਦਾ ਹੈ" : "is obtained";
  return [`${lead}, ${mj(answerScalar(answer) ?? "0")} ${ending}.`];
}

function refinedMethod(question: R4Question, language: R4Language): string {
  const current = normalizeTmwR4MixedMath(question.learnerExplanation?.method ?? "");
  const mode = question.solveMode ?? "";
  if (/findTwoCategoryEfficiencyRatio|findThreeCategoryEfficiencyRatio/.test(mode)) {
    return language === "hi"
      ? "समान काम और समान समय के लिए दोनों दलों की कुल क्षमता बराबर होती है; संख्या × व्यक्तिगत दक्षता की तुलना करें।"
      : language === "pa"
        ? "ਇੱਕੋ ਕੰਮ ਅਤੇ ਇੱਕੋ ਸਮੇਂ ਲਈ ਦੋਵੇਂ ਟੋਲੀਆਂ ਦੀ ਕੁੱਲ ਸਮਰੱਥਾ ਬਰਾਬਰ ਹੁੰਦੀ ਹੈ; ਗਿਣਤੀ × ਵਿਅਕਤੀਗਤ ਦੱਖਤਾ ਦੀ ਤੁਲਨਾ ਕਰੋ।"
        : "For the same work completed in the same time, the two crew capacities are equal; compare count × individual efficiency.";
  }
  if (mode === "findFillTimeFromPositiveInlets") {
    return language === "hi"
      ? "इनलेट की दरें जोड़ें और संयुक्त दर का व्युत्क्रम लेकर भरने का समय निकालें।"
      : language === "pa"
        ? "ਇਨਲੈੱਟ ਦਰਾਂ ਜੋੜੋ ਅਤੇ ਮਿਲੀ ਦਰ ਦਾ ਉਲਟ ਲੈ ਕੇ ਭਰਨ ਦਾ ਸਮਾਂ ਕੱਢੋ।"
        : "Add the inlet rates, then take the reciprocal of the combined rate to get the filling time.";
  }
  return current;
}

function cp011Answer(question: R4Question, language: R4Language, answer: string): string | null {
  if (cp(question) !== "TMW-CP-011") return null;
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
  const label = labels[question.solveMode ?? ""];
  if (!label) return null;
  const selected = language === "hi" ? label[1] : language === "pa" ? label[2] : label[0];
  if (language === "hi") return `अतः ${selected} ${answer} है।`;
  if (language === "pa") return `ਇਸ ਲਈ ${selected} ${answer} ਹੈ।`;
  return `Therefore, the ${selected} is ${answer}.`;
}

function fixedStem(question: R4Question, language: R4Language): string | undefined {
  if (!question.stem || language !== "en") return question.stem;
  return question.stem.replace(/\bcompletes 1 components per hour\b/g, "completes 1 component per hour");
}

export function applyTmw001LearnerExplanationR4ExamReadiness<T extends R4Question>(
  question: T,
  qlId: string,
  language: R4Language,
): T {
  const current = question.learnerExplanation;
  const ordinal = Number(/^TMW-QL-(\d{3})$/.exec(qlId)?.[1] ?? 0);
  if (!current || !ordinal || ordinal > 211) return question;

  const answer = normalizeTmwR4MixedMath(answerText(question));
  const finalAnswer = cp011Answer(question, language, answer) ?? normalizeTmwR4MixedMath(current.answer);
  const working = ordinal <= 127 ? r2Working(question, language, answer) : r3Working(question, language, answer);
  const learnerExplanation: TmwLearnerExplanationV2 = {
    method: refinedMethod(question, language),
    solution: [...working.slice(0, 4), finalAnswer],
    answer: finalAnswer,
  };

  const r4Errors = validateTmwLearnerExplanationV2(learnerExplanation);
  const visible = [learnerExplanation.method, ...learnerExplanation.solution, learnerExplanation.answer].join(" ");
  if (/After simplification, the required value is|Continue the calculation with the remaining quantity/i.test(visible)) {
    r4Errors.push("R4 learner explanation contains mechanical boilerplate");
  }
  const errors = [...(question.validation?.errors ?? []), ...r4Errors];

  return {
    ...question,
    stem: fixedStem(question, language),
    learnerExplanationVersion: "TMW_LEARNER_V2",
    learnerExplanation,
    validation: question.validation ? { ...question.validation, valid: errors.length === 0, errors } : question.validation,
  };
}
