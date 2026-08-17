import type { TmwLocalizedLanguage } from "./localization-types";

export type TmwR3Language = "en" | TmwLocalizedLanguage;

interface R3Question {
  stem?: string;
  options?: string[];
  optionAudit?: Array<{ text?: string; [key: string]: unknown }>;
  answerText?: string;
  solution?: { answerText?: string; [key: string]: unknown };
  explanation?: {
    conclusion?: string;
    commonTrap?: { optionText?: string; explanation?: string; [key: string]: unknown };
    [key: string]: unknown;
  };
}

function answerText(question: R3Question): string {
  return question.solution?.answerText?.trim()
    || question.answerText?.trim()
    || "the stated answer";
}

function replaceConclusion<T extends R3Question>(question: T, conclusion: string): T {
  if (!question.explanation) return question;
  return {
    ...question,
    explanation: {
      ...question.explanation,
      conclusion,
    },
  };
}

function localizedConclusion(
  question: R3Question,
  language: TmwR3Language,
  english: (answer: string) => string,
  hindi: (answer: string) => string,
  punjabi: (answer: string) => string,
): string {
  const answer = answerText(question);
  if (language === "hi") return hindi(answer);
  if (language === "pa") return punjabi(answer);
  return english(answer);
}

function mapQuestionText<T extends R3Question>(question: T, mapper: (value: string) => string): T {
  return {
    ...question,
    stem: question.stem === undefined ? undefined : mapper(question.stem),
    options: question.options?.map(mapper),
    optionAudit: question.optionAudit?.map((option) => ({
      ...option,
      text: option.text === undefined ? undefined : mapper(option.text),
    })),
    answerText: question.answerText === undefined ? undefined : mapper(question.answerText),
    solution: question.solution
      ? {
        ...question.solution,
        answerText: question.solution.answerText === undefined ? undefined : mapper(question.solution.answerText),
      }
      : question.solution,
    explanation: question.explanation
      ? {
        ...question.explanation,
        conclusion: question.explanation.conclusion === undefined
          ? undefined
          : mapper(question.explanation.conclusion),
        commonTrap: question.explanation.commonTrap
          ? {
            ...question.explanation.commonTrap,
            optionText: question.explanation.commonTrap.optionText === undefined
              ? undefined
              : mapper(question.explanation.commonTrap.optionText),
            explanation: question.explanation.commonTrap.explanation === undefined
              ? undefined
              : mapper(question.explanation.commonTrap.explanation),
          }
          : question.explanation.commonTrap,
      }
      : question.explanation,
  } as T;
}

function remediateQl130<T extends R3Question>(question: T, language: TmwR3Language): T {
  return replaceConclusion(question, localizedConclusion(
    question,
    language,
    (answer) => `Therefore, the mixed group completes the work in ${answer}.`,
    (answer) => `अतः मिश्रित समूह काम ${answer} में पूरा करेगा।`,
    (answer) => `ਇਸ ਲਈ ਮਿਲਿਆ-ਜੁਲਿਆ ਸਮੂਹ ਕੰਮ ${answer} ਵਿੱਚ ਪੂਰਾ ਕਰੇਗਾ।`,
  ));
}

function remediateQl136<T extends R3Question>(question: T, language: TmwR3Language): T {
  return replaceConclusion(question, localizedConclusion(
    question,
    language,
    (answer) => `Therefore, after the stated replacement, the work is completed in ${answer}.`,
    (answer) => `अतः दिए गए प्रतिस्थापन के बाद काम ${answer} में पूरा होगा।`,
    (answer) => `ਇਸ ਲਈ ਦਿੱਤੀ ਬਦਲੀ ਤੋਂ ਬਾਅਦ ਕੰਮ ${answer} ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ।`,
  ));
}

function remediateQl140<T extends R3Question>(question: T, language: TmwR3Language): T {
  return replaceConclusion(question, localizedConclusion(
    question,
    language,
    (answer) => `Therefore, the required solo completion time is ${answer}.`,
    (answer) => `अतः अकेले पूरा काम करने का आवश्यक समय ${answer} है।`,
    (answer) => `ਇਸ ਲਈ ਇਕੱਲੇ ਪੂਰਾ ਕੰਮ ਕਰਨ ਲਈ ਲੋੜੀਂਦਾ ਸਮਾਂ ${answer} ਹੈ।`,
  ));
}

function remediateQl150<T extends R3Question>(question: T, language: TmwR3Language): T {
  return replaceConclusion(question, localizedConclusion(
    question,
    language,
    (answer) => `Therefore, the required ratio of days worked is ${answer}.`,
    (answer) => `अतः काम किए गए दिनों का आवश्यक अनुपात ${answer} है।`,
    (answer) => `ਇਸ ਲਈ ਕੰਮ ਕੀਤੇ ਦਿਨਾਂ ਦਾ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ${answer} ਹੈ।`,
  ));
}

function remediateQl160<T extends R3Question>(question: T, language: TmwR3Language): T {
  return replaceConclusion(question, localizedConclusion(
    question,
    language,
    (answer) => `Therefore, the net fraction changed in the stated time is ${answer}.`,
    (answer) => `अतः दी गई अवधि में टंकी में शुद्ध परिवर्तन ${answer} है।`,
    (answer) => `ਇਸ ਲਈ ਦਿੱਤੇ ਸਮੇਂ ਵਿੱਚ ਟੈਂਕੀ ਦਾ ਸ਼ੁੱਧ ਬਦਲਾਅ ${answer} ਹੈ।`,
  ));
}

function remediateQl174<T extends R3Question>(question: T, language: TmwR3Language): T {
  const mapped = mapQuestionText(question, (value) => {
    if (language === "hi") return value.replace(/खाली नहीं जाएगी/g, "खाली नहीं होगी");
    if (language === "pa") return value.replace(/ਖਾਲੀ ਨਹੀਂ ਜਾਵੇਗੀ/g, "ਖਾਲੀ ਨਹੀਂ ਹੋਵੇਗੀ");
    return value.replace(/will not go empty/gi, "will not become empty");
  });
  return replaceConclusion(mapped, localizedConclusion(
    mapped,
    language,
    (answer) => `Therefore, ${answer}.`,
    (answer) => `अतः ${answer}।`,
    (answer) => `ਇਸ ਲਈ ${answer}।`,
  ));
}

function remediateQl189<T extends R3Question>(question: T, language: TmwR3Language): T {
  return replaceConclusion(question, localizedConclusion(
    question,
    language,
    (answer) => `Therefore, the number of complete cycles before the final partial cycle is ${answer}.`,
    (answer) => `अतः अंतिम अपूर्ण चक्र से पहले पूरे चक्रों की संख्या ${answer} है।`,
    (answer) => `ਇਸ ਲਈ ਆਖਰੀ ਅਧੂਰੇ ਚੱਕਰ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`,
  ));
}

function remediateQl192<T extends R3Question>(question: T, language: TmwR3Language): T {
  return replaceConclusion(question, localizedConclusion(
    question,
    language,
    (answer) => `Therefore, the required switch time is ${answer}.`,
    (answer) => `अतः आवश्यक स्विच का समय ${answer} है।`,
    (answer) => `ਇਸ ਲਈ ਲੋੜੀਂਦੇ ਸਵਿੱਚ ਦਾ ਸਮਾਂ ${answer} ਹੈ।`,
  ));
}

function remediateFirstDayRate<T extends R3Question>(question: T, language: TmwR3Language): T {
  return replaceConclusion(question, localizedConclusion(
    question,
    language,
    (answer) => `Therefore, the required first-day output is ${answer}.`,
    (answer) => `अतः पहले दिन का आवश्यक उत्पादन ${answer} है।`,
    (answer) => `ਇਸ ਲਈ ਪਹਿਲੇ ਦਿਨ ਦਾ ਲੋੜੀਂਦਾ ਉਤਪਾਦਨ ${answer} ਹੈ।`,
  ));
}

function remediateQl208<T extends R3Question>(question: T, language: TmwR3Language): T {
  return replaceConclusion(question, localizedConclusion(
    question,
    language,
    (answer) => `Therefore, the additional daily rate required is ${answer}.`,
    (answer) => `अतः आवश्यक अतिरिक्त दैनिक दर ${answer} है।`,
    (answer) => `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਵਾਧੂ ਰੋਜ਼ਾਨਾ ਦਰ ${answer} ਹੈ।`,
  ));
}

/**
 * Final-boundary editorial remediation for the remaining R3 audit findings.
 * It runs after R1 critical fixes and all legacy localisation/presentation waves.
 */
export function applyTmw001EditorialRemediationR3Cp007To011<T extends R3Question>(
  question: T,
  qlId: string,
  language: TmwR3Language,
): T {
  switch (qlId) {
    case "TMW-QL-130": return remediateQl130(question, language);
    case "TMW-QL-136": return remediateQl136(question, language);
    case "TMW-QL-140": return remediateQl140(question, language);
    case "TMW-QL-150": return remediateQl150(question, language);
    case "TMW-QL-160": return remediateQl160(question, language);
    case "TMW-QL-174": return remediateQl174(question, language);
    case "TMW-QL-189": return remediateQl189(question, language);
    case "TMW-QL-192": return remediateQl192(question, language);
    case "TMW-QL-195": return remediateFirstDayRate(question, language);
    case "TMW-QL-199": return remediateFirstDayRate(question, language);
    case "TMW-QL-208": return remediateQl208(question, language);
    default: return question;
  }
}
