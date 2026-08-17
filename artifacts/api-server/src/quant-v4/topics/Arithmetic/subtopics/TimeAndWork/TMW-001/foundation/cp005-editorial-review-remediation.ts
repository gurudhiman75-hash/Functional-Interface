import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";

type Cp005Language = "en" | "hi" | "pa";

interface Cp005Question {
  canonicalProblemId?: string;
  cpId?: string;
  solveMode?: string;
  explanation?: { steps?: string[] };
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

function text(language: Cp005Language, en: string, hi: string, pa: string): string {
  return language === "hi" ? hi : language === "pa" ? pa : en;
}

function legacySteps(question: Cp005Question): string[] {
  return Array.isArray(question.explanation?.steps) ? question.explanation.steps : [];
}

function mathInner(step: string): string | null {
  return /\\\(([\s\S]*?)\\\)/.exec(step)?.[1]?.trim() ?? null;
}

function cleanedSegments(inner: string): string[] {
  return inner
    .replace(/\\quad\s*\\text\{[^}]*\}/g, "")
    .split(/,\s*\\quad\s*/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function rhsOfSegment(segment: string): string {
  const index = segment.indexOf("=");
  return index >= 0 ? segment.slice(index + 1).trim() : segment.trim();
}

function equation(question: Cp005Question, stepPattern: RegExp, segmentPattern?: RegExp): string | null {
  for (const step of legacySteps(question)) {
    const inner = mathInner(step);
    if (!inner || !stepPattern.test(inner)) continue;
    const segments = cleanedSegments(inner);
    const segment = segmentPattern ? segments.find((part) => segmentPattern.test(part)) : segments[0];
    if (!segment) continue;
    const rhs = rhsOfSegment(segment);
    if (rhs && !/\\text\{/.test(rhs)) return `\\(${rhs}\\)`;
  }
  return null;
}

function combine(label: string, ...values: Array<string | null>): string | null {
  const present = values.filter((value): value is string => Boolean(value));
  return present.length ? `${label}: ${present.join("; ")}.` : null;
}

function finalize(question: Cp005Question, working: Array<string | null>): TmwLearnerExplanationV2 | null {
  const current = question.learnerExplanation;
  if (!current) return null;
  const compact = working.filter((step): step is string => Boolean(step)).slice(0, 4);
  if (compact.length < 1) return current;
  return {
    ...current,
    solution: [...compact, current.answer].slice(0, 5),
  };
}

function standardCycleWorking(question: Cp005Question, language: Cp005Language): Array<string | null> {
  const cycle = equation(question, /W_\{cycle\}=.*\\times/);
  const full = equation(question, /W_\{full\\ cycles\}=/, /W_\{full\\ cycles\}=/);
  const remaining = equation(question, /W_\{remaining\\ after\\ full\\ cycles\}=/);
  const before = equation(question, /W_\{before\\ final\\ turn\}=/);
  const left = equation(question, /W_\{left\\ for\\ (?:final|next)\\ worker\}=/);
  const finalTime = equation(question, /t_\{final\}=/);
  const total = equation(question, /^T=/);

  return [
    combine(text(language, "Work in one complete cycle", "एक पूरे चक्र में हुआ काम", "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਵਿੱਚ ਹੋਇਆ ਕੰਮ"), cycle),
    combine(
      text(language, "After the complete cycles", "पूरे चक्रों के बाद", "ਪੂਰੇ ਚੱਕਰਾਂ ਤੋਂ ਬਾਅਦ"),
      full,
      remaining,
    ),
    combine(
      text(language, "Handle the terminal turn in the stated order", "अंतिम बारी को दिए क्रम में पूरा करें", "ਆਖਰੀ ਵਾਰੀ ਨੂੰ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਪੂਰਾ ਕਰੋ"),
      before,
      left,
      finalTime,
    ),
    combine(text(language, "Total elapsed time", "कुल बीता समय", "ਕੁੱਲ ਬੀਤਿਆ ਸਮਾਂ"), total),
  ];
}

function inverseWorking(question: Cp005Question, language: Cp005Language, includeSoloTime: boolean): Array<string | null> {
  const activeTurns = equation(question, /t_x=/);
  const knownWork = equation(question, /W_\{known\}=/);
  const remaining = equation(question, /W_\{remaining\}=/);
  const rate = equation(question, /r_x=/);
  const soloTime = equation(question, /T_x=/);

  return [
    combine(text(language, "Active turns of the unknown worker", "अज्ञात कर्मी की कुल काम की बारियाँ", "ਅਣਜਾਣ ਕਰਮਚਾਰੀ ਦੀਆਂ ਕੁੱਲ ਕੰਮ ਵਾਲੀਆਂ ਵਾਰੀਆਂ"), activeTurns),
    combine(text(language, "Work already completed by the known worker", "ज्ञात कर्मी द्वारा किया गया काम", "ਜਾਣੇ ਕਰਮਚਾਰੀ ਵੱਲੋਂ ਕੀਤਾ ਗਿਆ ਕੰਮ"), knownWork),
    combine(text(language, "Work left for the unknown worker", "अज्ञात कर्मी के लिए बचा काम", "ਅਣਜਾਣ ਕਰਮਚਾਰੀ ਲਈ ਬਚਿਆ ਕੰਮ"), remaining),
    combine(
      includeSoloTime
        ? text(language, "First find the rate, then take its reciprocal for solo time", "पहले दर निकालें, फिर उसका व्युत्क्रम लेकर अकेले का समय पाएँ", "ਪਹਿਲਾਂ ਦਰ ਕੱਢੋ, ਫਿਰ ਉਸ ਦਾ ਉਲਟ ਲੈ ਕੇ ਇਕੱਲੇ ਦਾ ਸਮਾਂ ਕੱਢੋ")
        : text(language, "Required rate", "आवश्यक कार्य-दर", "ਲੋੜੀਂਦੀ ਕੰਮ-ਦਰ"),
      rate,
      includeSoloTime ? soloTime : null,
    ),
  ];
}

function startingAgentWorking(question: Cp005Question, language: Cp005Language): Array<string | null> {
  const startA = equation(question, /T_\{\\text\{start with [^}]*A\}\}=/);
  const startB = equation(question, /T_\{\\text\{start with [^}]*B\}\}=/);
  return [
    combine(text(language, "If A starts, the computed completion time is", "यदि A से शुरुआत हो, तो गणना से कुल समय", "ਜੇ A ਤੋਂ ਸ਼ੁਰੂ ਕੀਤਾ ਜਾਵੇ, ਤਾਂ ਗਣਨਾ ਅਨੁਸਾਰ ਕੁੱਲ ਸਮਾਂ"), startA),
    combine(text(language, "If B starts, the computed completion time is", "यदि B से शुरुआत हो, तो गणना से कुल समय", "ਜੇ B ਤੋਂ ਸ਼ੁਰੂ ਕੀਤਾ ਜਾਵੇ, ਤਾਂ ਗਣਨਾ ਅਨੁਸਾਰ ਕੁੱਲ ਸਮਾਂ"), startB),
    text(
      language,
      "Match these two cases with both conditions in the question: the stated total time and the stated final turn.",
      "अब दोनों स्थितियों को प्रश्न की दोनों शर्तों—दिए कुल समय और दी गई अंतिम बारी—से मिलाएँ।",
      "ਹੁਣ ਦੋਵੇਂ ਹਾਲਤਾਂ ਨੂੰ ਪ੍ਰਸ਼ਨ ਦੀਆਂ ਦੋਵੇਂ ਸ਼ਰਤਾਂ—ਦਿੱਤੇ ਕੁੱਲ ਸਮੇਂ ਅਤੇ ਦਿੱਤੀ ਆਖਰੀ ਵਾਰੀ—ਨਾਲ ਮਿਲਾਓ।",
    ),
  ];
}

function terminalAgentWorking(question: Cp005Question, language: Cp005Language): Array<string | null> {
  const cycle = equation(question, /W_\{cycle\}=.*\\times/);
  const remaining = equation(question, /W_\{remaining\\ after\\ full\\ cycles\}=/);
  const before = equation(question, /W_\{before\\ final\\ turn\}=/);
  const left = equation(question, /W_\{left\\ for\\ (?:next|final)\\ worker\}=/);
  const needed = equation(question, /t_\{needed\}=/);
  return [
    combine(text(language, "Work in one complete cycle", "एक पूरे चक्र में हुआ काम", "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਵਿੱਚ ਹੋਇਆ ਕੰਮ"), cycle),
    combine(text(language, "Work left after the complete cycles", "पूरे चक्रों के बाद बचा काम", "ਪੂਰੇ ਚੱਕਰਾਂ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਕੰਮ"), remaining),
    combine(text(language, "Follow the next turns in order", "अब अगली बारियों को क्रम से देखें", "ਹੁਣ ਅਗਲੀਆਂ ਵਾਰੀਆਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਵੇਖੋ"), before, left),
    combine(text(language, "Time needed in the turn that finishes the work", "जिस बारी में काम पूरा होगा, उसमें आवश्यक समय", "ਜਿਸ ਵਾਰੀ ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਹੋਵੇਗਾ, ਉਸ ਵਿੱਚ ਲੋੜੀਂਦਾ ਸਮਾਂ"), needed),
  ];
}

function fixedCycleQuantityWorking(question: Cp005Question, language: Cp005Language, remainingMode: boolean): Array<string | null> {
  const cycle = equation(question, /W_\{cycle\}=.*\\times/);
  const done = equation(question, /W(?:_\{done\})?=/, /W(?:_\{done\})?=/);
  const remaining = equation(question, /W_\{remaining\}=/);
  return [
    combine(text(language, "Work in one complete cycle", "एक पूरे चक्र में हुआ काम", "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਵਿੱਚ ਹੋਇਆ ਕੰਮ"), cycle),
    combine(text(language, "Work completed in the stated number of cycles", "दिए गए पूरे चक्रों में पूरा काम", "ਦਿੱਤੇ ਪੂਰੇ ਚੱਕਰਾਂ ਵਿੱਚ ਪੂਰਾ ਕੰਮ"), done),
    remainingMode
      ? combine(text(language, "Subtract from the whole work", "इसे पूरे काम में से घटाएँ", "ਇਸ ਨੂੰ ਪੂਰੇ ਕੰਮ ਵਿੱਚੋਂ ਘਟਾਓ"), remaining)
      : null,
  ];
}

function targetCycleWorking(question: Cp005Question, language: Cp005Language): Array<string | null> {
  const cycle = equation(question, /W_\{cycle\}=.*\\times/);
  const target = equation(question, /W_\{target\}=/, /W_\{target\}=/);
  const count = equation(question, /^n=/);
  return [
    combine(text(language, "Work in one complete cycle", "एक पूरे चक्र में हुआ काम", "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਵਿੱਚ ਹੋਇਆ ਕੰਮ"), cycle),
    combine(text(language, "Target work", "लक्षित काम", "ਟੀਚੇ ਵਾਲਾ ਕੰਮ"), target),
    combine(text(language, "Target work ÷ work per cycle", "लक्षित काम ÷ एक चक्र का काम", "ਟੀਚੇ ਵਾਲਾ ਕੰਮ ÷ ਇੱਕ ਚੱਕਰ ਦਾ ਕੰਮ"), count),
  ];
}

function exactBoundaryWorking(question: Cp005Question, language: Cp005Language): Array<string | null> {
  const cycle = equation(question, /W_\{cycle\}=.*\\times/);
  const count = equation(question, /^n=/);
  const total = equation(question, /^T=/);
  return [
    combine(text(language, "Work in one complete cycle", "एक पूरे चक्र में हुआ काम", "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਵਿੱਚ ਹੋਇਆ ਕੰਮ"), cycle),
    combine(text(language, "Number of complete cycles needed", "आवश्यक पूरे चक्रों की संख्या", "ਲੋੜੀਂਦੇ ਪੂਰੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ"), count),
    combine(text(language, "Cycle count × time per cycle", "चक्रों की संख्या × एक चक्र का समय", "ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ × ਇੱਕ ਚੱਕਰ ਦਾ ਸਮਾਂ"), total),
  ];
}

function machineOutputWorking(question: Cp005Question, language: Cp005Language): Array<string | null> {
  const q1 = equation(question, /Q_1=/);
  const q2 = equation(question, /Q_2=/);
  const cycle = equation(question, /Q_\{cycle\}=/);
  const total = equation(question, /^Q=/);
  return [
    combine(text(language, "Output of machine A in its turn", "मशीन A की बारी का उत्पादन", "ਮਸ਼ੀਨ A ਦੀ ਵਾਰੀ ਦਾ ਉਤਪਾਦਨ"), q1),
    combine(text(language, "Output of machine B in its turn", "मशीन B की बारी का उत्पादन", "ਮਸ਼ੀਨ B ਦੀ ਵਾਰੀ ਦਾ ਉਤਪਾਦਨ"), q2),
    combine(text(language, "Output in one complete cycle", "एक पूरे चक्र का उत्पादन", "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦਾ ਉਤਪਾਦਨ"), cycle),
    combine(text(language, "Multiply by the number of repetitions", "चक्रों की संख्या से गुणा करें", "ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰੋ"), total),
  ];
}

function renderWorking(question: Cp005Question, language: Cp005Language): Array<string | null> {
  switch (question.solveMode) {
    case "findTerminalAgent":
      return terminalAgentWorking(question, language);
    case "findStartingAgentFromCompletionCondition":
      return startingAgentWorking(question, language);
    case "findUnknownRateFromAlternatingCompletion":
    case "findRequiredCycleRateForDeadline":
      return inverseWorking(question, language, false);
    case "findUnknownTimeFromAlternatingCompletion":
      return inverseWorking(question, language, true);
    case "findWorkAfterGivenNumberOfCycles":
      return fixedCycleQuantityWorking(question, language, false);
    case "findRemainingWorkAfterFullCycles":
      return fixedCycleQuantityWorking(question, language, true);
    case "findCycleCountToReachSpecifiedFraction":
      return targetCycleWorking(question, language);
    case "findExactBoundaryCompletion":
      return exactBoundaryWorking(question, language);
    case "findOutputUnderPeriodicMachineSchedule":
      return machineOutputWorking(question, language);
    default:
      return standardCycleWorking(question, language);
  }
}

export function applyTmwCp005EditorialReviewRemediation<T extends Cp005Question>(
  question: T,
  qlId: string,
  language: Cp005Language,
): T {
  const ordinal = Number(/^TMW-QL-(\d{3})$/.exec(qlId)?.[1] ?? 0);
  if (ordinal < 82 || ordinal > 105 || (question.canonicalProblemId ?? question.cpId) !== "TMW-CP-005") return question;

  const learnerExplanation = finalize(question, renderWorking(question, language));
  if (!learnerExplanation) return question;
  const editorialErrors = validateTmwLearnerExplanationV2(learnerExplanation);
  const priorErrors = question.validation?.errors ?? [];
  return {
    ...question,
    learnerExplanation,
    validation: {
      valid: Boolean(question.validation?.valid) && editorialErrors.length === 0,
      errors: [...priorErrors, ...editorialErrors.map((error) => `CP005 editorial review: ${error}`)],
    },
    publiclyPublishable: false,
  };
}
