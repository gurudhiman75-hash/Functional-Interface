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

function startCaseTime(question: Question, agent: "A" | "B"): string | null {
  const steps = Array.isArray(question.explanation?.steps) ? question.explanation.steps : [];
  const pattern = new RegExp(String.raw`T_\{[^=]*\b${agent}\b[^=]*\}=([^,]+)`);
  for (const step of steps) {
    const inner = /\\\(([\s\S]*?)\\\)/.exec(step)?.[1]?.trim();
    if (!inner) continue;
    const match = pattern.exec(inner);
    const value = match?.[1]?.trim();
    if (value && !/\\text\{/.test(value)) return `\\(${value}\\)`;
  }
  return null;
}

export function applyTmwCp005StartingAgentEditorialFix<T extends Question>(
  question: T,
  qlId: string,
  language: Language,
): T {
  if (
    qlId !== "TMW-QL-090" ||
    (question.canonicalProblemId ?? question.cpId) !== "TMW-CP-005" ||
    question.solveMode !== "findStartingAgentFromCompletionCondition" ||
    !question.learnerExplanation
  ) return question;

  const timeA = startCaseTime(question, "A");
  const timeB = startCaseTime(question, "B");
  const current = question.learnerExplanation;
  const solution = [
    timeA
      ? `${t(language, "If A starts, the calculated completion time is", "यदि A से शुरुआत हो, तो गणना से पूरा होने का समय", "ਜੇ A ਤੋਂ ਸ਼ੁਰੂ ਕੀਤਾ ਜਾਵੇ, ਤਾਂ ਗਣਨਾ ਅਨੁਸਾਰ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ")}: ${timeA}.`
      : t(language, "Check the complete schedule with A starting.", "A से शुरुआत वाला पूरा क्रम जाँचें।", "A ਤੋਂ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲਾ ਪੂਰਾ ਕ੍ਰਮ ਜਾਂਚੋ।"),
    timeB
      ? `${t(language, "If B starts, the calculated completion time is", "यदि B से शुरुआत हो, तो गणना से पूरा होने का समय", "ਜੇ B ਤੋਂ ਸ਼ੁਰੂ ਕੀਤਾ ਜਾਵੇ, ਤਾਂ ਗਣਨਾ ਅਨੁਸਾਰ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ")}: ${timeB}.`
      : t(language, "Check the complete schedule with B starting.", "B से शुरुआत वाला पूरा क्रम जाँचें।", "B ਤੋਂ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲਾ ਪੂਰਾ ਕ੍ਰਮ ਜਾਂਚੋ।"),
    t(
      language,
      "Compare both cases with the two conditions in the question: the stated completion time and who works in the final turn.",
      "दोनों स्थितियों को प्रश्न की दोनों शर्तों—दिए गए पूरा होने के समय और अंतिम बारी में काम करने वाले व्यक्ति—से मिलाएँ।",
      "ਦੋਵੇਂ ਹਾਲਤਾਂ ਨੂੰ ਪ੍ਰਸ਼ਨ ਦੀਆਂ ਦੋਵੇਂ ਸ਼ਰਤਾਂ—ਦਿੱਤੇ ਪੂਰਾ ਹੋਣ ਦੇ ਸਮੇਂ ਅਤੇ ਆਖਰੀ ਵਾਰੀ ਵਿੱਚ ਕੰਮ ਕਰਨ ਵਾਲੇ ਵਿਅਕਤੀ—ਨਾਲ ਮਿਲਾਓ।",
    ),
    current.answer,
  ];

  const learnerExplanation: TmwLearnerExplanationV2 = { ...current, solution };
  const errors = validateTmwLearnerExplanationV2(learnerExplanation);
  return {
    ...question,
    learnerExplanation,
    validation: {
      valid: Boolean(question.validation?.valid) && errors.length === 0,
      errors: [...(question.validation?.errors ?? []), ...errors.map((error) => `CP005 starting-agent editorial fix: ${error}`)],
    },
    publiclyPublishable: false,
  };
}
