import {
  validateTmwLearnerExplanationV2,
  type TmwLearnerExplanationV2,
} from "./learner-explanation-contract";
import { normalizeTmwLearnerDisplayTextR2 } from "./learner-explanation-r2-cp001-cp006";
import type { TmwLocalizedLanguage } from "./localization-types";

export type TmwR3LearnerLanguage = "en" | TmwLocalizedLanguage;

interface R3LearnerQuestion {
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  solveMode?: string;
  answerText?: string;
  solution?: {
    answerText?: string;
    workedLatex?: string[];
  };
  explanation?: {
    opening?: string;
    steps?: string[];
    conclusion?: string;
  };
  validation?: {
    valid: boolean;
    errors: string[];
  };
  publiclyPublishable?: boolean;
}

const R3_MIN_QL = 128;
const R3_MAX_QL = 211;

function qlOrdinal(qlId: string): number | null {
  const match = /^TMW-QL-(\d{3})$/.exec(qlId);
  return match ? Number(match[1]) : null;
}

export function tmwR3SolvedAnswerText(question: R3LearnerQuestion): string {
  return question.solution?.answerText?.trim()
    || question.answerText?.trim()
    || "the stated answer";
}

function cleanLearnerText(value: string): string {
  return normalizeTmwLearnerDisplayTextR2(value)
    .replace(/_\{[^}]*[A-Za-z\u0900-\u097F\u0A00-\u0A7F][^}]*\}/gu, "")
    .replace(/_[A-Za-z\u0900-\u097F\u0A00-\u0A7F]+/gu, "")
    .replace(/\\text\{([^{}]+)\}/gu, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function hasUnsafeNotation(value: string): boolean {
  return /_\{[^}]*[A-Za-z\u0900-\u097F\u0A00-\u0A7F][^}]*\}/u.test(value)
    || /_[A-Za-z\u0900-\u097F\u0A00-\u0A7F]+/u.test(value)
    || /\\text\{/u.test(value);
}

function cpId(question: R3LearnerQuestion): string {
  return question.canonicalProblemId ?? question.cpId ?? "";
}

function methodLead(question: R3LearnerQuestion, language: TmwR3LearnerLanguage): string {
  const cp = cpId(question);
  const mode = question.solveMode ?? "";

  if (cp === "TMW-CP-007") {
    if (/Equivalent|Replacement|UnknownCategory|Composition|WeightedCrewFacts/i.test(mode)) {
      return language === "hi"
        ? "हर श्रेणी की संख्या × प्रति-सदस्य दर से क्षमता बनाकर आवश्यक अज्ञात निकालें"
        : language === "pa"
          ? "ਹਰ ਸ਼੍ਰੇਣੀ ਲਈ ਗਿਣਤੀ × ਪ੍ਰਤੀ-ਸਦੱਸ ਦਰ ਨਾਲ ਸਮਰੱਥਾ ਬਣਾਕੇ ਲੋੜੀਂਦਾ ਅਣਜਾਣ ਕੱਢੋ"
          : "Convert each category to count × unit-rate capacity, then solve the required unknown";
    }
    return language === "hi"
      ? "हर श्रेणी का संख्या × दर योगदान जोड़कर मिश्रित समूह की कुल दर निकालें"
      : language === "pa"
        ? "ਹਰ ਸ਼੍ਰੇਣੀ ਦਾ ਗਿਣਤੀ × ਦਰ ਯੋਗਦਾਨ ਜੋੜ ਕੇ ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਦੀ ਕੁੱਲ ਦਰ ਕੱਢੋ"
        : "Add count × rate for every category to obtain the mixed-group capacity";
  }

  if (cp === "TMW-CP-008") {
    if (/Residual/i.test(mode)) {
      return language === "hi"
        ? "पहले दिए गए भुगतान जोड़ें और कुल भुगतान में से घटाएँ"
        : language === "pa"
          ? "ਪਹਿਲਾਂ ਦਿੱਤੇ ਭੁਗਤਾਨ ਜੋੜੋ ਅਤੇ ਕੁੱਲ ਭੁਗਤਾਨ ਵਿੱਚੋਂ ਘਟਾਓ"
          : "Add the known payments and subtract them from the total pool";
    }
    if (/PieceRate/i.test(mode)) {
      return language === "hi"
        ? "स्वीकृत उत्पादन को प्रति इकाई भुगतान से गुणा करें"
        : language === "pa"
          ? "ਮੰਨਿਆ ਉਤਪਾਦਨ ਪ੍ਰਤੀ ਇਕਾਈ ਭੁਗਤਾਨ ਨਾਲ ਗੁਣਾ ਕਰੋ"
          : "Multiply accepted output by the payment per unit";
    }
    return language === "hi"
      ? "हर व्यक्ति का वास्तविक योगदान निकालकर उसी अनुपात में भुगतान बाँटें"
      : language === "pa"
        ? "ਹਰ ਵਿਅਕਤੀ ਦਾ ਅਸਲ ਯੋਗਦਾਨ ਕੱਢ ਕੇ ਉਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਭੁਗਤਾਨ ਵੰਡੋ"
        : "Find each actual contribution and divide the payment in that ratio";
  }

  if (cp === "TMW-CP-009") {
    if (/Feasibility|Boundary/i.test(mode)) {
      return language === "hi"
        ? "शुद्ध भराव या निकासी दर निकालकर सीमा तक का समय उपलब्ध समय से तुलना करें"
        : language === "pa"
          ? "ਸ਼ੁੱਧ ਭਰਨ ਜਾਂ ਨਿਕਾਸੀ ਦਰ ਕੱਢ ਕੇ ਹੱਦ ਤੱਕ ਦਾ ਸਮਾਂ ਉਪਲਬਧ ਸਮੇਂ ਨਾਲ ਤੁਲਨਾ ਕਰੋ"
          : "Find the signed net flow, then compare the boundary time with the available time";
    }
    return language === "hi"
      ? "भरने की दरों को धनात्मक और निकासी की दरों को ऋणात्मक लेकर शुद्ध दर बनाएँ"
      : language === "pa"
        ? "ਭਰਨ ਦੀਆਂ ਦਰਾਂ ਧਨਾਤਮਕ ਅਤੇ ਨਿਕਾਸੀ ਦੀਆਂ ਦਰਾਂ ਰਿਣਾਤਮਕ ਲੈ ਕੇ ਸ਼ੁੱਧ ਦਰ ਬਣਾਓ"
        : "Treat inflows as positive and outflows as negative to form the net pipe rate";
  }

  if (cp === "TMW-CP-010") {
    if (/Cycle|Alternating|Arbitrary/i.test(mode)) {
      return language === "hi"
        ? "एक पूरा चक्र निकालें, सुरक्षित पूरे चक्र लगाएँ और अंतिम अधूरा भाग अलग हल करें"
        : language === "pa"
          ? "ਇੱਕ ਪੂਰਾ ਚੱਕਰ ਕੱਢੋ, ਸੁਰੱਖਿਅਤ ਪੂਰੇ ਚੱਕਰ ਲਗਾਓ ਅਤੇ ਆਖਰੀ ਅਧੂਰਾ ਹਿੱਸਾ ਵੱਖ ਹੱਲ ਕਰੋ"
          : "Find one full cycle, use only safe complete cycles, then solve the terminal part";
    }
    return language === "hi"
      ? "हर खुलने-बंद होने की घटना पर समय-रेखा को चरणों में बाँटकर स्तर आगे बढ़ाएँ"
      : language === "pa"
        ? "ਹਰ ਖੁੱਲ੍ਹਣ-ਬੰਦ ਹੋਣ ਦੀ ਘਟਨਾ ਤੇ ਸਮਾਂ-ਰੇਖਾ ਨੂੰ ਪੜਾਵਾਂ ਵਿੱਚ ਵੰਡ ਕੇ ਪੱਧਰ ਅੱਗੇ ਲੈ ਜਾਓ"
        : "Split the timeline at each pipe event and carry the exact level from stage to stage";
  }

  if (cp === "TMW-CP-011") {
    if (/Geometric|Multiplier/i.test(mode)) {
      return language === "hi"
        ? "दैनिक गुणक को क्रमशः लगाकर दर-श्रृंखला या उसका कुल निकालें"
        : language === "pa"
          ? "ਰੋਜ਼ਾਨਾ ਗੁਣਕ ਨੂੰ ਲਗਾਤਾਰ ਲਗਾ ਕੇ ਦਰ-ਲੜੀ ਜਾਂ ਉਸ ਦਾ ਕੁੱਲ ਕੱਢੋ"
          : "Apply the daily multiplier successively and total the resulting rate sequence";
    }
    if (/Switch|Threshold/i.test(mode)) {
      return language === "hi"
        ? "दर बदलने से पहले और बाद के उत्पादन को दो अलग चरणों में जोड़ें"
        : language === "pa"
          ? "ਦਰ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦਾ ਉਤਪਾਦਨ ਦੋ ਵੱਖ ਪੜਾਵਾਂ ਵਿੱਚ ਜੋੜੋ"
          : "Treat output before and after the rate switch as two separate stages";
    }
    if (/VaryingCrew|Combined|Signed/i.test(mode)) {
      return language === "hi"
        ? "हर दिन का उत्पादन अलग निकालें और सही चिन्ह के साथ सभी दिनों को जोड़ें"
        : language === "pa"
          ? "ਹਰ ਦਿਨ ਦਾ ਉਤਪਾਦਨ ਵੱਖ ਕੱਢੋ ਅਤੇ ਸਹੀ ਨਿਸ਼ਾਨ ਨਾਲ ਸਾਰੇ ਦਿਨ ਜੋੜੋ"
          : "Calculate each day's output separately and combine the daily totals with the correct sign";
    }
    return language === "hi"
      ? "पहली दर और समान दैनिक बदलाव से दर-श्रृंखला बनाकर आवश्यक कुल या अज्ञात निकालें"
      : language === "pa"
        ? "ਪਹਿਲੀ ਦਰ ਅਤੇ ਇੱਕੋ ਰੋਜ਼ਾਨਾ ਬਦਲਾਅ ਨਾਲ ਦਰ-ਲੜੀ ਬਣਾਕੇ ਲੋੜੀਂਦਾ ਕੁੱਲ ਜਾਂ ਅਣਜਾਣ ਕੱਢੋ"
        : "Build the daily-rate sequence from the first rate and constant change, then solve the required quantity";
  }

  return language === "hi"
    ? "प्रश्न के अनुसार दर, समय और काम के संबंध का उपयोग करें"
    : language === "pa"
      ? "ਸਵਾਲ ਅਨੁਸਾਰ ਦਰ, ਸਮਾਂ ਅਤੇ ਕੰਮ ਦਾ ਸੰਬੰਧ ਵਰਤੋ"
      : "Use the rate, time and work relation required by the question";
}

function answerLine(
  question: R3LearnerQuestion,
  qlId: string,
  language: TmwR3LearnerLanguage,
): string {
  const answer = cleanLearnerText(tmwR3SolvedAnswerText(question));
  const mode = question.solveMode ?? "";

  const choose = (en: string, hi: string, pa: string): string => language === "hi" ? hi : language === "pa" ? pa : en;

  if (qlId === "TMW-QL-150") return choose(`Therefore, the ratio of days worked is ${answer}.`, `अतः काम किए गए दिनों का अनुपात ${answer} है।`, `ਇਸ ਲਈ ਕੰਮ ਕੀਤੇ ਦਿਨਾਂ ਦਾ ਅਨੁਪਾਤ ${answer} ਹੈ।`);
  if (qlId === "TMW-QL-160") return choose(`Therefore, the net fraction changed is ${answer}.`, `अतः शुद्ध परिवर्तन ${answer} है।`, `ਇਸ ਲਈ ਸ਼ੁੱਧ ਬਦਲਾਅ ${answer} ਹੈ।`);
  if (qlId === "TMW-QL-174") return choose(`Therefore, the correct boundary decision is ${answer}.`, `अतः सीमा संबंधी सही निष्कर्ष ${answer} है।`, `ਇਸ ਲਈ ਹੱਦ ਬਾਰੇ ਸਹੀ ਨਤੀਜਾ ${answer} ਹੈ।`);
  if (qlId === "TMW-QL-189") return choose(`Therefore, the number of complete cycles is ${answer}.`, `अतः पूरे चक्रों की संख्या ${answer} है।`, `ਇਸ ਲਈ ਪੂਰੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`);
  if (qlId === "TMW-QL-192") return choose(`Therefore, the required switch time is ${answer}.`, `अतः आवश्यक स्विच का समय ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੇ ਸਵਿੱਚ ਦਾ ਸਮਾਂ ${answer} ਹੈ।`);
  if (qlId === "TMW-QL-195" || qlId === "TMW-QL-199") return choose(`Therefore, the first-day output is ${answer}.`, `अतः पहले दिन का उत्पादन ${answer} है।`, `ਇਸ ਲਈ ਪਹਿਲੇ ਦਿਨ ਦਾ ਉਤਪਾਦਨ ${answer} ਹੈ।`);
  if (qlId === "TMW-QL-208") return choose(`Therefore, the additional daily rate required is ${answer}.`, `अतः आवश्यक अतिरिक्त दैनिक दर ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਵਾਧੂ ਰੋਜ਼ਾਨਾ ਦਰ ${answer} ਹੈ।`);

  if (/Payment|Bonus|Wage|Money/i.test(mode)) return choose(`Therefore, the required payment is ${answer}.`, `अतः आवश्यक भुगतान ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਭੁਗਤਾਨ ${answer} ਹੈ।`);
  if (/Ratio/i.test(mode)) return choose(`Therefore, the required ratio is ${answer}.`, `अतः आवश्यक अनुपात ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ${answer} ਹੈ।`);
  if (/Count|Composition/i.test(mode)) return choose(`Therefore, the required count is ${answer}.`, `अतः आवश्यक संख्या ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`);
  if (/Rate|Adjustment/i.test(mode)) return choose(`Therefore, the required rate is ${answer}.`, `अतः आवश्यक दर ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਦਰ ${answer} ਹੈ।`);
  if (/Fraction/i.test(mode)) return choose(`Therefore, the required fraction is ${answer}.`, `अतः आवश्यक भाग ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਹਿੱਸਾ ${answer} ਹੈ।`);
  if (/Feasibility|Decision|Outcome/i.test(mode)) return choose(`Therefore, the correct decision is ${answer}.`, `अतः सही निष्कर्ष ${answer} है।`, `ਇਸ ਲਈ ਸਹੀ ਨਤੀਜਾ ${answer} ਹੈ।`);
  if (/Time|Completion|Solo|Switch/i.test(mode)) return choose(`Therefore, the required time is ${answer}.`, `अतः आवश्यक समय ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸਮਾਂ ${answer} ਹੈ।`);
  if (/Output|Work/i.test(mode)) return choose(`Therefore, the required output is ${answer}.`, `अतः आवश्यक उत्पादन ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉਤਪਾਦਨ ${answer} ਹੈ।`);
  return choose(`Therefore, the answer is ${answer}.`, `अतः उत्तर ${answer} है।`, `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`);
}

function numericMathStep(value: string): boolean {
  return /\\\([\s\S]*\d[\s\S]*\\\)/.test(value);
}

function candidateCalculationSteps(question: R3LearnerQuestion): string[] {
  const legacy = Array.isArray(question.explanation?.steps) ? question.explanation!.steps! : [];
  const solved = Array.isArray(question.solution?.workedLatex) ? question.solution!.workedLatex! : [];
  const combined = [...legacy, ...solved]
    .map(cleanLearnerText)
    .filter(Boolean)
    .filter((step) => !/Independent .* invariant|verified for/i.test(step))
    .filter((step) => numericMathStep(step));
  return [...new Set(combined)].slice(0, 4);
}

function fallbackCalculation(question: R3LearnerQuestion, language: TmwR3LearnerLanguage): string {
  const answer = cleanLearnerText(tmwR3SolvedAnswerText(question));
  const math = answer.match(/\\\([^)]*\d[^)]*\\\)/)?.[0]
    ?? answer.match(/-?\d+(?:\.\d+)?(?:\s*:\s*\d+)?/)?.[0]
    ?? "0";
  const shown = math.startsWith("\\(") ? math : `\\(${math}\\)`;
  if (language === "hi") return `गणना से आवश्यक मान ${shown} मिलता है।`;
  if (language === "pa") return `ਗਣਨਾ ਤੋਂ ਲੋੜੀਂਦਾ ਮੁੱਲ ${shown} ਮਿਲਦਾ ਹੈ।`;
  return `The calculation gives the required value ${shown}.`;
}

function buildLearnerExplanation(
  question: R3LearnerQuestion,
  qlId: string,
  language: TmwR3LearnerLanguage,
): TmwLearnerExplanationV2 {
  const calculations = candidateCalculationSteps(question);
  const working = calculations.length ? calculations : [fallbackCalculation(question, language)];
  return {
    method: `${methodLead(question, language)}.`,
    solution: [...working.slice(0, 4), answerLine(question, qlId, language)],
    answer: answerLine(question, qlId, language),
  };
}

function learnerPolicyErrors(
  learner: TmwLearnerExplanationV2,
  language: TmwR3LearnerLanguage,
): string[] {
  const errors = validateTmwLearnerExplanationV2(learner);
  const visible = [learner.method, ...learner.solution, learner.answer].join(" ");
  if (/10[- ]Second|10[- ]सेकंड|10[- ]ਸੈਕਿੰਡ/i.test(visible)) errors.push("Learner V2 contains a generic 10-second claim");
  if (hasUnsafeNotation(visible)) errors.push("Learner V2 contains an unexplained word-based or localized subscript");
  if (/\bGivens\b|दिए गए मान:|ਦਿੱਤੇ ਮੁੱਲ:/i.test(visible)) errors.push("Learner V2 exposes a separate givens block");
  if (!learner.solution.slice(0, -1).some(numericMathStep)) errors.push("Learner V2 has no concrete calculation before the answer");
  if (learner.method.length > 280) errors.push("Learner V2 method is too long");
  if (learner.solution.some((step) => step.length > 320)) errors.push("Learner V2 contains an overlong solution step");
  if (language === "hi" && !/[\u0900-\u097F]/.test(visible)) errors.push("Hindi learner V2 has no Devanagari text");
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(visible)) errors.push("Punjabi learner V2 has no Gurmukhi text");
  return errors;
}

export function applyTmw001LearnerExplanationR3Cp007To011<T extends R3LearnerQuestion>(
  question: T,
  qlId: string,
  language: TmwR3LearnerLanguage,
): T & {
  learnerExplanationVersion?: "TMW_LEARNER_V2";
  learnerExplanation?: TmwLearnerExplanationV2;
} {
  const ordinal = qlOrdinal(qlId);
  if (ordinal === null || ordinal < R3_MIN_QL || ordinal > R3_MAX_QL) return question;

  const learnerExplanation = buildLearnerExplanation(question, qlId, language);
  const learnerErrors = learnerPolicyErrors(learnerExplanation, language);
  const existingErrors = question.validation?.errors ?? [];
  const combinedErrors = [...existingErrors, ...learnerErrors];

  return {
    ...question,
    learnerExplanationVersion: "TMW_LEARNER_V2",
    learnerExplanation,
    validation: question.validation
      ? {
        ...question.validation,
        valid: combinedErrors.length === 0,
        errors: combinedErrors,
      }
      : question.validation,
  };
}
