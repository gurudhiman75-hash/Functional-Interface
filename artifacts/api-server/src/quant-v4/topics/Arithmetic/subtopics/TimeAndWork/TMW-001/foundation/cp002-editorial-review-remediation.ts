import type { TmwCp002Parameters } from "./cp002-types";
import type { TmwLocalizedLanguage } from "./localization-types";

interface ReviewedQuestion {
  parameters: TmwCp002Parameters;
  stem: string;
  solution: {
    answerText: string;
    [key: string]: unknown;
  };
  explanation: {
    opening: string;
    shortcut: {
      title: string;
      steps: string[];
    };
    commonTrap: {
      explanation: string;
      [key: string]: unknown;
    };
    conclusion: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

type AgentLabels = { first: string; second: string };

function labels(
  agentNoun: string,
  language: TmwLocalizedLanguage,
): AgentLabels {
  const noun = language === "hi"
    ? ({
      operator: "ऑपरेटर",
      technician: "तकनीशियन",
      machine: "मशीन",
      crew: "दल",
      clerk: "क्लर्क",
    } as Record<string, string>)[agentNoun] ?? "सदस्य"
    : ({
      operator: "ਆਪਰੇਟਰ",
      technician: "ਟੈਕਨੀਸ਼ੀਅਨ",
      machine: "ਮਸ਼ੀਨ",
      crew: "ਟੀਮ",
      clerk: "ਕਲਰਕ",
    } as Record<string, string>)[agentNoun] ?? "ਮੈਂਬਰ";
  return { first: `${noun} A`, second: `${noun} B` };
}

function replaceAllFields(
  question: ReviewedQuestion,
  replacements: ReadonlyArray<readonly [string, string]>,
): ReviewedQuestion {
  const apply = (value: string): string => {
    let result = value;
    for (const [from, to] of replacements) result = result.replaceAll(from, to);
    return result;
  };
  return {
    ...question,
    stem: apply(question.stem),
    explanation: {
      ...question.explanation,
      opening: apply(question.explanation.opening),
      shortcut: {
        ...question.explanation.shortcut,
        title: apply(question.explanation.shortcut.title),
        steps: question.explanation.shortcut.steps.map(apply),
      },
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: apply(question.explanation.commonTrap.explanation),
      },
      conclusion: apply(question.explanation.conclusion),
    },
  };
}

function clarifyUnknownConstructiveAgent(
  question: ReviewedQuestion,
  language: TmwLocalizedLanguage,
): ReviewedQuestion {
  const { first, second } = labels(question.parameters.context.agentNoun, language);
  if (language === "hi") {
    const stem = question.stem.replace(
      "दोनों के काम करने और यह प्रक्रिया जारी रहने पर",
      `${first} और ${second} के साथ काम करने तथा यह प्रक्रिया जारी रहने पर`,
    );
    const opening = "अज्ञात सदस्य की दर = शुद्ध दर + वापस जाने वाली दर − ज्ञात सदस्य की दर।";
    return {
      ...question,
      stem,
      explanation: {
        ...question.explanation,
        opening,
        shortcut: {
          ...question.explanation.shortcut,
          title: "10-सेकंड अज्ञात सकारात्मक दर",
          steps: [
            `शुद्ध दर में वापस जाने वाली दर जोड़ें और ज्ञात सदस्य की दर घटाएँ; बची दर का उलटा ${question.solution.answerText} है।`,
          ],
        },
      },
    };
  }

  const stem = question.stem.replace(
    "ਦੋਵਾਂ ਦੇ ਕੰਮ ਕਰਨ ਅਤੇ ਇਹ ਪ੍ਰਕਿਰਿਆ ਜਾਰੀ ਰਹਿਣ ਉੱਤੇ",
    `${first} ਅਤੇ ${second} ਦੇ ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਅਤੇ ਇਹ ਪ੍ਰਕਿਰਿਆ ਜਾਰੀ ਰਹਿਣ ਉੱਤੇ`,
  );
  const opening = "ਅਣਜਾਣ ਮੈਂਬਰ ਦੀ ਦਰ = ਸ਼ੁੱਧ ਦਰ + ਵਾਪਸ ਜਾਣ ਵਾਲੀ ਦਰ − ਜਾਣੇ ਮੈਂਬਰ ਦੀ ਦਰ।";
  return {
    ...question,
    stem,
    explanation: {
      ...question.explanation,
      opening,
      shortcut: {
        ...question.explanation.shortcut,
        title: "10-ਸਕਿੰਟ ਅਣਜਾਣ ਸਕਾਰਾਤਮਕ ਦਰ",
        steps: [
          `ਸ਼ੁੱਧ ਦਰ ਵਿੱਚ ਵਾਪਸ ਜਾਣ ਵਾਲੀ ਦਰ ਜੋੜੋ ਅਤੇ ਜਾਣੇ ਮੈਂਬਰ ਦੀ ਦਰ ਘਟਾਓ; ਬਚੀ ਦਰ ਦਾ ਉਲਟ ${question.solution.answerText} ਹੈ।`,
        ],
      },
    },
  };
}

function clarifyDestructiveProcessQuestion(
  question: ReviewedQuestion,
  language: TmwLocalizedLanguage,
): ReviewedQuestion {
  if (language === "hi") {
    return {
      ...question,
      stem: question.stem.replace(
        "वापस भेजने वाली प्रक्रिया अकेले पूरे काम के बराबर काम को कितने समय में वापस भेजेगी?",
        "यदि केवल यही प्रक्रिया चले, तो पूरे काम के बराबर काम को वापस भेजने में कितना समय लगेगा?",
      ),
      explanation: {
        ...question.explanation,
        conclusion: question.explanation.conclusion.replace(
          "वापस भेजने वाली प्रक्रिया अकेले पूरे काम जितना काम",
          "केवल यह प्रक्रिया पूरे काम के बराबर काम",
        ),
      },
    };
  }
  return {
    ...question,
    stem: question.stem.replace(
      "ਵਾਪਸ ਭੇਜਣ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਇਕੱਲੀ ਪੂਰੇ ਕੰਮ ਦੇ ਬਰਾਬਰ ਕੰਮ ਨੂੰ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਵਾਪਸ ਭੇਜੇਗੀ?",
      "ਜੇ ਸਿਰਫ਼ ਇਹੀ ਪ੍ਰਕਿਰਿਆ ਚੱਲੇ, ਤਾਂ ਪੂਰੇ ਕੰਮ ਦੇ ਬਰਾਬਰ ਕੰਮ ਨੂੰ ਵਾਪਸ ਭੇਜਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?",
    ),
    explanation: {
      ...question.explanation,
      conclusion: question.explanation.conclusion.replace(
        "ਵਾਪਸ ਭੇਜਣ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਇਕੱਲੀ ਪੂਰੇ ਕੰਮ ਜਿੰਨਾ ਕੰਮ",
        "ਸਿਰਫ਼ ਇਹ ਪ੍ਰਕਿਰਿਆ ਪੂਰੇ ਕੰਮ ਦੇ ਬਰਾਬਰ ਕੰਮ",
      ),
    },
  };
}

function fixCountAgreement(
  question: ReviewedQuestion,
  language: TmwLocalizedLanguage,
): ReviewedQuestion {
  const escapedAnswer = question.solution.answerText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = language === "hi"
    ? new RegExp(`(${escapedAnswer}) है।`, "g")
    : new RegExp(`(${escapedAnswer}) ਹੈ।`, "g");
  const replacement = language === "hi" ? "$1 हैं।" : "$1 ਹਨ।";
  const apply = (value: string): string => value.replace(pattern, replacement);
  return {
    ...question,
    explanation: {
      ...question.explanation,
      shortcut: {
        ...question.explanation.shortcut,
        steps: question.explanation.shortcut.steps.map(apply),
      },
      conclusion: apply(question.explanation.conclusion),
    },
  };
}

export function applyTmwCp002EditorialReviewRemediation<
  T extends ReviewedQuestion,
>(
  question: T,
  qlId: string,
  language: TmwLocalizedLanguage,
): T {
  let updated: ReviewedQuestion = question;

  if (language === "pa") {
    const replacements: Array<readonly [string, string]> = [];
    if (["TMW-QL-023", "TMW-QL-026", "TMW-QL-033"].includes(qlId)) {
      replacements.push(["ਪਤਾ ਦਰ", "ਜਾਣੀ ਦਰ"]);
    }
    if (qlId === "TMW-QL-023") {
      replacements.push(["ਪਤਾ ਮੈਂਬਰਾਂ", "ਜਾਣੇ ਮੈਂਬਰਾਂ"]);
    }
    if (qlId === "TMW-QL-025") {
      replacements.push(["ਸਾਹਮਣੀ ਜੋੜੀ-ਦਰ", "ਬਾਕੀ ਜੋੜੀ-ਦਰ"]);
    }
    if (replacements.length > 0) updated = replaceAllFields(updated, replacements);
  }

  if (qlId === "TMW-QL-028") {
    updated = clarifyDestructiveProcessQuestion(updated, language);
  }
  if (qlId === "TMW-QL-029") {
    updated = clarifyUnknownConstructiveAgent(updated, language);
  }
  if (qlId === "TMW-QL-030") {
    updated = fixCountAgreement(updated, language);
  }
  if (qlId === "TMW-QL-032") {
    updated = replaceAllFields(updated, language === "hi"
      ? [["सभी दैनिक उत्पादन दरें", "सभी उत्पादन दरें"]]
      : [["ਸਾਰੀਆਂ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਦਰਾਂ", "ਸਾਰੀਆਂ ਉਤਪਾਦਨ ਦਰਾਂ"]]);
  }

  return updated as T;
}
