import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";

type Language = "en" | "hi" | "pa";

interface Question {
  canonicalProblemId?: string;
  cpId?: string;
  solveMode?: string;
  explanation?: { steps?: string[] };
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

function t(language: Language, en: string, hi: string, pa: string): string {
  return language === "hi" ? hi : language === "pa" ? pa : en;
}

function solvedValue(question: Question, symbol: "r_x"): string | null {
  const steps = Array.isArray(question.explanation?.steps) ? question.explanation.steps : [];
  const pattern = new RegExp(String.raw`(?:^|,\s*\\quad\s*)${symbol}=([^,]+)`);
  for (const step of steps) {
    const inner = /\\\(([\s\S]*?)\\\)/.exec(step)?.[1]?.trim();
    if (!inner) continue;
    const match = pattern.exec(inner);
    const value = match?.[1]?.trim();
    if (!value || value === "?" || /\\text\{/.test(value)) continue;
    return `\\(${value}\\)`;
  }
  return null;
}

function finalAnswerValue(answer: string): string | null {
  const inline = /\\\(([\s\S]*?)\\\)/.exec(answer)?.[1]?.trim();
  if (inline) return `\\(${inline}\\)`;
  const fraction = /(-?\d+)\s*\/\s*(\d+)/.exec(answer);
  if (fraction) return `\\(\\frac{${fraction[1]}}{${fraction[2]}}\\)`;
  const number = /(-?\d+(?:\.\d+)?)/.exec(answer)?.[1];
  return number ? `\\(${number}\\)` : null;
}

export function applyTmwCp005InverseEditorialFix<T extends Question>(
  question: T,
  qlId: string,
  language: Language,
): T {
  const mode = question.solveMode ?? "";
  if (
    !["TMW-QL-091", "TMW-QL-092", "TMW-QL-105"].includes(qlId) ||
    (question.canonicalProblemId ?? question.cpId) !== "TMW-CP-005" ||
    ![
      "findUnknownRateFromAlternatingCompletion",
      "findUnknownTimeFromAlternatingCompletion",
      "findRequiredCycleRateForDeadline",
    ].includes(mode) ||
    !question.learnerExplanation
  ) return question;

  const current = question.learnerExplanation;
  const baseWorking = current.solution.slice(0, 3);
  const answerValue = finalAnswerValue(current.answer);
  const rate = mode === "findUnknownTimeFromAlternatingCompletion"
    ? solvedValue(question, "r_x")
    : answerValue;
  const soloTime = mode === "findUnknownTimeFromAlternatingCompletion" ? answerValue : null;

  const decisive = mode === "findUnknownTimeFromAlternatingCompletion"
    ? `${t(
        language,
        "Divide the remaining work by the unknown worker's active turns to get the rate, then take the reciprocal for the solo time",
        "बचे काम को अज्ञात कर्मी की काम वाली बारियों से भाग देकर दर निकालें, फिर उसका व्युत्क्रम लेकर अकेले का समय पाएँ",
        "ਬਚੇ ਕੰਮ ਨੂੰ ਅਣਜਾਣ ਕਰਮਚਾਰੀ ਦੀਆਂ ਕੰਮ ਵਾਲੀਆਂ ਵਾਰੀਆਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਦਰ ਕੱਢੋ, ਫਿਰ ਉਸ ਦਾ ਉਲਟ ਲੈ ਕੇ ਇਕੱਲੇ ਦਾ ਸਮਾਂ ਕੱਢੋ",
      )}: ${rate ?? ""}${rate && soloTime ? "; " : ""}${soloTime ?? ""}.`
    : `${t(language, "Required work rate", "आवश्यक कार्य-दर", "ਲੋੜੀਂਦੀ ਕੰਮ-ਦਰ")}: ${rate ?? ""}.`;

  const learnerExplanation: TmwLearnerExplanationV2 = {
    ...current,
    solution: [...baseWorking, decisive, current.answer],
  };
  const errors = validateTmwLearnerExplanationV2(learnerExplanation);

  return {
    ...question,
    learnerExplanation,
    validation: {
      valid: Boolean(question.validation?.valid) && errors.length === 0 && Boolean(rate) && (mode !== "findUnknownTimeFromAlternatingCompletion" || Boolean(soloTime)),
      errors: [
        ...(question.validation?.errors ?? []),
        ...errors.map((error) => `CP005 inverse editorial fix: ${error}`),
        ...(!rate ? ["CP005 inverse editorial fix: solved rate missing"] : []),
        ...(mode === "findUnknownTimeFromAlternatingCompletion" && !soloTime ? ["CP005 inverse editorial fix: solved solo time missing"] : []),
      ],
    },
    publiclyPublishable: false,
  };
}
