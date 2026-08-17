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

function legacySteps(question: Question): string[] {
  return Array.isArray(question.explanation?.steps) ? question.explanation.steps : [];
}

function solvedValue(question: Question, symbol: "r_x"): string | null {
  const pattern = new RegExp(String.raw`(?:^|,\s*\\quad\s*)${symbol}=([^,]+)`);
  for (const step of legacySteps(question)) {
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

function firstInlineMath(line: string | undefined): string | null {
  return line ? /\\\(([\s\S]*?)\\\)/.exec(line)?.[0] ?? null : null;
}

function relabelInverseBase(current: TmwLearnerExplanationV2, language: Language): string[] {
  const turns = firstInlineMath(current.solution[0]);
  const known = firstInlineMath(current.solution[1]);
  const remaining = firstInlineMath(current.solution[2]);
  return [
    turns
      ? `${t(language, "Number of active turns for B", "B की कुल काम वाली बारियाँ", "B ਦੀਆਂ ਕੁੱਲ ਕੰਮ ਵਾਲੀਆਂ ਵਾਰੀਆਂ")}: ${turns}.`
      : current.solution[0],
    known
      ? `${t(language, "Work completed by A", "A द्वारा किया गया काम", "A ਵੱਲੋਂ ਕੀਤਾ ਗਿਆ ਕੰਮ")}: ${known}.`
      : current.solution[1],
    remaining
      ? `${t(language, "Work remaining for B", "B के लिए बचा काम", "B ਲਈ ਬਚਿਆ ਕੰਮ")}: ${remaining}.`
      : current.solution[2],
  ].filter((line): line is string => Boolean(line));
}

function inverseMethod(mode: string, language: Language): string {
  if (mode === "findUnknownTimeFromAlternatingCompletion") {
    return t(
      language,
      "Use the alternating schedule to find how much work is left for B. Divide by B's active turns to get B's rate, then take its reciprocal to get B's solo time.",
      "बारी-बारी वाले क्रम से B के लिए बचा काम निकालें। इसे B की काम वाली बारियों से भाग देकर B की दर पाएँ, फिर उसका व्युत्क्रम लेकर B का अकेले का समय निकालें।",
      "ਵਾਰੀ-ਵਾਰੀ ਵਾਲੇ ਕ੍ਰਮ ਤੋਂ B ਲਈ ਬਚਿਆ ਕੰਮ ਕੱਢੋ। ਇਸ ਨੂੰ B ਦੀਆਂ ਕੰਮ ਵਾਲੀਆਂ ਵਾਰੀਆਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ B ਦੀ ਦਰ ਕੱਢੋ, ਫਿਰ ਉਸ ਦਾ ਉਲਟ ਲੈ ਕੇ B ਦਾ ਇਕੱਲੇ ਦਾ ਸਮਾਂ ਕੱਢੋ।",
    );
  }
  if (mode === "findRequiredCycleRateForDeadline") {
    return t(
      language,
      "Use the deadline schedule to find how much work A completes and how many turns B gets. The remaining work divided by B's turns gives B's required rate.",
      "समय-सीमा तक A द्वारा किया गया काम और B को मिलने वाली बारियों की संख्या निकालें। बचे काम को B की बारियों से भाग देने पर B की आवश्यक दर मिलती है।",
      "ਸਮਾਂ-ਸੀਮਾ ਤੱਕ A ਵੱਲੋਂ ਕੀਤਾ ਕੰਮ ਅਤੇ B ਨੂੰ ਮਿਲਣ ਵਾਲੀਆਂ ਵਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ। ਬਚੇ ਕੰਮ ਨੂੰ B ਦੀਆਂ ਵਾਰੀਆਂ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ B ਦੀ ਲੋੜੀਂਦੀ ਦਰ ਮਿਲਦੀ ਹੈ।",
    );
  }
  return t(
    language,
    "Use the alternating schedule to find how much work A completes and how many turns B gets. Divide the work left for B by B's turns to get B's rate.",
    "बारी-बारी वाले क्रम से A द्वारा किया गया काम और B को मिलने वाली बारियों की संख्या निकालें। B के लिए बचे काम को B की बारियों से भाग देकर B की दर पाएँ।",
    "ਵਾਰੀ-ਵਾਰੀ ਵਾਲੇ ਕ੍ਰਮ ਤੋਂ A ਵੱਲੋਂ ਕੀਤਾ ਕੰਮ ਅਤੇ B ਨੂੰ ਮਿਲਣ ਵਾਲੀਆਂ ਵਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ। B ਲਈ ਬਚੇ ਕੰਮ ਨੂੰ B ਦੀਆਂ ਵਾਰੀਆਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ B ਦੀ ਦਰ ਕੱਢੋ।",
  );
}

function concreteRemainingWork(question: Question): string | null {
  for (const step of legacySteps(question)) {
    const inner = /\\\(([\s\S]*?)\\\)/.exec(step)?.[1]?.trim();
    if (!inner) continue;
    const match = /W_\{remaining\}=([^,]+)/.exec(inner);
    const rhs = match?.[1]?.trim();
    if (!rhs || /W_|\bn\b|\?|\\text\{/.test(rhs)) continue;
    return `\\(${rhs}\\)`;
  }
  return null;
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
  const baseWorking = relabelInverseBase(current, language);
  const answerValue = finalAnswerValue(current.answer);
  const rate = mode === "findUnknownTimeFromAlternatingCompletion"
    ? solvedValue(question, "r_x")
    : answerValue;
  const soloTime = mode === "findUnknownTimeFromAlternatingCompletion" ? answerValue : null;

  const decisive = mode === "findUnknownTimeFromAlternatingCompletion"
    ? `${t(
        language,
        "Divide B's remaining work by B's active turns to get B's rate, then take the reciprocal for B's solo time",
        "B के बचे काम को B की काम वाली बारियों से भाग देकर B की दर निकालें, फिर उसका व्युत्क्रम लेकर B के अकेले का समय पाएँ",
        "B ਦੇ ਬਚੇ ਕੰਮ ਨੂੰ B ਦੀਆਂ ਕੰਮ ਵਾਲੀਆਂ ਵਾਰੀਆਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ B ਦੀ ਦਰ ਕੱਢੋ, ਫਿਰ ਉਸ ਦਾ ਉਲਟ ਲੈ ਕੇ B ਦੇ ਇਕੱਲੇ ਦਾ ਸਮਾਂ ਕੱਢੋ",
      )}: ${rate ?? ""}${rate && soloTime ? "; " : ""}${soloTime ?? ""}.`
    : `${t(language, "Required work rate of B", "B की आवश्यक कार्य-दर", "B ਦੀ ਲੋੜੀਂਦੀ ਕੰਮ-ਦਰ")}: ${rate ?? ""}.`;

  const learnerExplanation: TmwLearnerExplanationV2 = {
    ...current,
    method: inverseMethod(mode, language),
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

export function applyTmwCp005RemainingWorkEditorialFix<T extends Question>(
  question: T,
  qlId: string,
  language: Language,
): T {
  if (
    qlId !== "TMW-QL-088" ||
    (question.canonicalProblemId ?? question.cpId) !== "TMW-CP-005" ||
    question.solveMode !== "findRemainingWorkAfterFullCycles" ||
    !question.learnerExplanation
  ) return question;

  const remaining = concreteRemainingWork(question);
  const current = question.learnerExplanation;
  const solution = [...current.solution];
  if (remaining && solution.length >= 2) {
    solution.splice(
      solution.length - 1,
      0,
      `${t(
        language,
        "Remaining work = whole work − completed work",
        "बचा काम = पूरा काम − किया गया काम",
        "ਬਚਿਆ ਕੰਮ = ਸਾਰਾ ਕੰਮ − ਕੀਤਾ ਗਿਆ ਕੰਮ",
      )}: ${remaining}.`,
    );
  }

  const deduplicated = solution.filter((line, index) => {
    if (index === solution.length - 1) return true;
    if (/Subtract from the whole work|इसे पूरे काम में से घटाएँ|ਇਸ ਨੂੰ ਪੂਰੇ ਕੰਮ ਵਿੱਚੋਂ ਘਟਾਓ/i.test(line)) return false;
    return true;
  });
  const learnerExplanation: TmwLearnerExplanationV2 = { ...current, solution: deduplicated.slice(0, 5) };
  const errors = validateTmwLearnerExplanationV2(learnerExplanation);

  return {
    ...question,
    learnerExplanation,
    validation: {
      valid: Boolean(question.validation?.valid) && Boolean(remaining) && errors.length === 0,
      errors: [
        ...(question.validation?.errors ?? []),
        ...(!remaining ? ["CP005 remaining-work editorial fix: concrete remaining-work equation missing"] : []),
        ...errors.map((error) => `CP005 remaining-work editorial fix: ${error}`),
      ],
    },
    publiclyPublishable: false,
  };
}
