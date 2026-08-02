import type { TmwLocalizedLanguage } from "./localization-types";

interface ReviewedQuestion {
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
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

function updateShortcut(
  question: ReviewedQuestion,
  opening: string,
): ReviewedQuestion {
  const answer = question.solution.answerText;
  const suffix = question.explanation.shortcut.steps[0]?.includes("ਇਸ ਨਾਲ")
    ? ` ਇਸ ਨਾਲ ਉੱਤਰ ${answer} ਮਿਲਦਾ ਹੈ।`
    : ` इससे उत्तर ${answer} मिलता है।`;
  return {
    ...question,
    explanation: {
      ...question.explanation,
      opening,
      shortcut: {
        ...question.explanation.shortcut,
        steps: [`${opening}${suffix}`],
      },
    },
  };
}

function remediateHindi(
  question: ReviewedQuestion,
  qlId: string,
): ReviewedQuestion {
  switch (qlId) {
    case "TMW-QL-003":
      return {
        ...question,
        stem: question.stem.replace(
          "कार्य-दर प्रति दिन 4 आवेदन है",
          "कार्य-दर 4 आवेदन प्रतिदिन है",
        ),
      };
    case "TMW-QL-006":
      return {
        ...question,
        explanation: {
          ...question.explanation,
          commonTrap: {
            ...question.explanation.commonTrap,
            explanation:
              "विकल्प A (काम का \\(\\frac{1}{5}\\) भाग) 3 दिनों में होने वाला काम दिखाता है, जबकि प्रश्न 2 दिनों में होने वाला काम पूछता है।",
          },
        },
      };
    case "TMW-QL-012":
      return updateShortcut(
        question,
        "कुल उत्पादन के लिए प्रतिदिन उत्पादन को दिनों की संख्या से गुणा करें।",
      );
    case "TMW-QL-015": {
      const updated = {
        ...question,
        stem:
          "6 घंटे में 72 बोतलें भरी जाती हैं। उसी दर से 3 घंटे में कितनी बोतलें भरी जाएँगी?",
      };
      return updateShortcut(
        updated,
        "पहले एक घंटे में भरी जाने वाली बोतलों की संख्या निकालें, फिर उसे 3 से गुणा करें।",
      );
    }
    default:
      return question;
  }
}

function remediatePunjabi(
  question: ReviewedQuestion,
  qlId: string,
): ReviewedQuestion {
  switch (qlId) {
    case "TMW-QL-003":
      return {
        ...question,
        stem: question.stem.replace(
          "ਕੰਮ ਦੀ ਦਰ ਪ੍ਰਤੀ ਦਿਨ 4 ਅਰਜ਼ੀਆਂ ਹੈ",
          "ਕੰਮ ਦੀ ਦਰ 4 ਅਰਜ਼ੀਆਂ ਪ੍ਰਤੀ ਦਿਨ ਹੈ",
        ),
      };
    case "TMW-QL-006":
      return {
        ...question,
        explanation: {
          ...question.explanation,
          commonTrap: {
            ...question.explanation.commonTrap,
            explanation:
              "ਚੋਣ A (ਕੰਮ ਦਾ \\(\\frac{1}{5}\\) ਹਿੱਸਾ) 3 ਦਿਨਾਂ ਵਿੱਚ ਹੋਣ ਵਾਲਾ ਕੰਮ ਦਿਖਾਉਂਦੀ ਹੈ, ਜਦਕਿ ਸਵਾਲ 2 ਦਿਨਾਂ ਵਿੱਚ ਹੋਣ ਵਾਲਾ ਕੰਮ ਪੁੱਛਦਾ ਹੈ।",
          },
        },
      };
    case "TMW-QL-007":
    case "TMW-QL-011":
      return {
        ...question,
        stem: question.stem.replace(
          "ਕੰਮ ਦਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ",
          "ਕੰਮ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ",
        ),
      };
    case "TMW-QL-012":
      return updateShortcut(
        question,
        "ਕੁੱਲ ਉਤਪਾਦਨ ਲਈ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਨੂੰ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰੋ।",
      );
    case "TMW-QL-013":
      return updateShortcut(
        question,
        question.explanation.opening.replace(
          "ਪਤਾ ਹਿੱਸੇ ਨੂੰ",
          "ਦਿੱਤੇ ਹਿੱਸੇ ਨੂੰ",
        ),
      );
    case "TMW-QL-014":
      return updateShortcut(
        question,
        "ਕੰਮ ਦੇ ਦਿੱਤੇ ਹਿੱਸੇ ਲਈ ਲੱਗੇ ਸਮੇਂ ਨੂੰ ਉਸ ਹਿੱਸੇ ਦੇ ਭਿੰਨ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਪੂਰਾ ਸਮਾਂ ਕੱਢੋ।",
      );
    case "TMW-QL-015": {
      const updated = {
        ...question,
        stem:
          "6 ਘੰਟਿਆਂ ਵਿੱਚ 72 ਬੋਤਲਾਂ ਭਰੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਉਸੇ ਦਰ ਨਾਲ 3 ਘੰਟਿਆਂ ਵਿੱਚ ਕਿੰਨੀਆਂ ਬੋਤਲਾਂ ਭਰੀਆਂ ਜਾਣਗੀਆਂ?",
      };
      return updateShortcut(
        updated,
        "ਪਹਿਲਾਂ ਇੱਕ ਘੰਟੇ ਵਿੱਚ ਭਰੀਆਂ ਜਾਣ ਵਾਲੀਆਂ ਬੋਤਲਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਉਸ ਨੂੰ 3 ਨਾਲ ਗੁਣਾ ਕਰੋ।",
      );
    }
    case "TMW-QL-017":
      return updateShortcut(
        question,
        question.explanation.opening.replace("ਇੱਕੋ ਦਰ ਤੇ", "ਇੱਕੋ ਦਰ 'ਤੇ"),
      );
    case "TMW-QL-019":
    case "TMW-QL-020":
      return {
        ...question,
        stem: question.stem.replace("ਆਮ ਤੌਰ ਤੇ", "ਆਮ ਤੌਰ 'ਤੇ"),
      };
    default:
      return question;
  }
}

export function applyTmwCp001EditorialReviewRemediation<
  T extends ReviewedQuestion,
>(
  question: T,
  qlId: string,
  language: TmwLocalizedLanguage,
): T {
  const updated = language === "hi"
    ? remediateHindi(question, qlId)
    : remediatePunjabi(question, qlId);
  return updated as T;
}
