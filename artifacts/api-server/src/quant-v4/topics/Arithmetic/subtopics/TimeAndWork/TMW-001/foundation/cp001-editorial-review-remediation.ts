import type { TmwLocalizedLanguage } from "./localization-types";
import type {
  TmwCp001Parameters,
  TmwCp001SolveMode,
} from "./types";

interface ReviewedQuestion {
  solveMode: TmwCp001SolveMode;
  parameters: TmwCp001Parameters;
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
      optionLabel: string;
      optionText: string;
      misconceptionId: string;
      explanation: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

function wholeNumber(value: { numerator: number; denominator: number }): number {
  return value.numerator / value.denominator;
}

function updateShortcut(
  question: ReviewedQuestion,
  opening: string,
  language: TmwLocalizedLanguage,
): ReviewedQuestion {
  const answer = question.solution.answerText;
  const suffix = language === "pa"
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

function secondQuantityTrapReason(
  question: ReviewedQuestion,
  language: TmwLocalizedLanguage,
): string | undefined {
  if (question.explanation.commonTrap.misconceptionId !== "SECOND_QUANTITY_REPORTED") {
    return undefined;
  }

  const days = wholeNumber(question.parameters.time);
  if (language === "hi") {
    switch (question.solveMode) {
      case "findWorkFromRateAndTime":
      case "findOutputFromUnitRateAndTime":
        return `यह ${days - 1} दिनों का उत्पादन है, जबकि प्रश्न ${days} दिनों का कुल उत्पादन पूछता है।`;
      case "findRateFromWorkAndTime":
      case "findRequiredRateForTargetCompletion":
        return "यह उपलब्ध दिनों की संख्या को ही दैनिक दर मानता है; सही दर कुल काम को उपलब्ध समय से भाग देकर मिलती है।";
      case "findTimeFromWorkAndRate":
        return "यह कार्य-दर की संख्या को ही दिन मानता है; सही समय कुल काम को कार्य-दर से भाग देकर मिलता है।";
      case "findOneUnitWorkFromCompletionTime":
        return "इसमें दिए गए कुल दिनों के स्थान पर दो दिन अधिक संख्या को हर में रखा गया है।";
      case "findFractionCompletedInGivenTime":
        return `यह प्रश्न में दिए ${days} दिनों के बजाय बदली हुई अवधि का काम दिखाता है; सही भाग एक दिन के काम को ${days} से गुणा करके मिलेगा।`;
      case "findRemainingFractionAfterTime":
        return `यह केवल एक दिन के बाद बचा काम दिखाता है, जबकि प्रश्न ${days} दिनों के बाद बाकी काम पूछता है।`;
      case "compareWorkCompletedAtEqualTime":
        return "यह केवल दूसरे व्यक्ति का कुल उत्पादन है, जबकि प्रश्न दोनों के उत्पादन का अंतर पूछता है।";
      case "compareTimeForDifferentWorkAtSameRate":
        return "यह कम काम को पूरा करने का समय है, जबकि प्रश्न दोनों समयों का अंतर पूछता है।";
      default:
        return "यह प्रश्न में दी दूसरी मात्रा को उत्तर मानता है, जबकि माँगी गई मात्रा अलग गणना से निकलती है।";
    }
  }

  switch (question.solveMode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime":
      return `ਇਹ ${days - 1} ਦਿਨਾਂ ਦਾ ਉਤਪਾਦਨ ਹੈ, ਜਦਕਿ ਸਵਾਲ ${days} ਦਿਨਾਂ ਦਾ ਕੁੱਲ ਉਤਪਾਦਨ ਪੁੱਛਦਾ ਹੈ।`;
    case "findRateFromWorkAndTime":
    case "findRequiredRateForTargetCompletion":
      return "ਇਹ ਉਪਲਬਧ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਹੀ ਰੋਜ਼ਾਨਾ ਦਰ ਮੰਨਦਾ ਹੈ; ਸਹੀ ਦਰ ਕੁੱਲ ਕੰਮ ਨੂੰ ਉਪਲਬਧ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲਦੀ ਹੈ।";
    case "findTimeFromWorkAndRate":
      return "ਇਹ ਕੰਮ ਦੀ ਦਰ ਦੀ ਗਿਣਤੀ ਨੂੰ ਹੀ ਦਿਨ ਮੰਨਦਾ ਹੈ; ਸਹੀ ਸਮਾਂ ਕੁੱਲ ਕੰਮ ਨੂੰ ਕੰਮ ਦੀ ਦਰ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲਦਾ ਹੈ।";
    case "findOneUnitWorkFromCompletionTime":
      return "ਇਸ ਵਿੱਚ ਦਿੱਤੇ ਕੁੱਲ ਦਿਨਾਂ ਦੀ ਥਾਂ ਦੋ ਦਿਨ ਵੱਧ ਗਿਣਤੀ ਨੂੰ ਹਰ ਵਿੱਚ ਰੱਖਿਆ ਗਿਆ ਹੈ।";
    case "findFractionCompletedInGivenTime":
      return `ਇਹ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੇ ${days} ਦਿਨਾਂ ਦੀ ਥਾਂ ਬਦਲੀ ਹੋਈ ਮਿਆਦ ਦਾ ਕੰਮ ਦਿਖਾਉਂਦਾ ਹੈ; ਸਹੀ ਹਿੱਸਾ ਇੱਕ ਦਿਨ ਦੇ ਕੰਮ ਨੂੰ ${days} ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਮਿਲੇਗਾ।`;
    case "findRemainingFractionAfterTime":
      return `ਇਹ ਸਿਰਫ਼ ਇੱਕ ਦਿਨ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਕੰਮ ਦਿਖਾਉਂਦਾ ਹੈ, ਜਦਕਿ ਸਵਾਲ ${days} ਦਿਨਾਂ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਕੰਮ ਪੁੱਛਦਾ ਹੈ।`;
    case "compareWorkCompletedAtEqualTime":
      return "ਇਹ ਸਿਰਫ਼ ਦੂਜੇ ਵਿਅਕਤੀ ਦਾ ਕੁੱਲ ਉਤਪਾਦਨ ਹੈ, ਜਦਕਿ ਸਵਾਲ ਦੋਵਾਂ ਦੇ ਉਤਪਾਦਨ ਦਾ ਫਰਕ ਪੁੱਛਦਾ ਹੈ।";
    case "compareTimeForDifferentWorkAtSameRate":
      return "ਇਹ ਘੱਟ ਕੰਮ ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ ਹੈ, ਜਦਕਿ ਸਵਾਲ ਦੋਵਾਂ ਸਮਿਆਂ ਦਾ ਫਰਕ ਪੁੱਛਦਾ ਹੈ।";
    default:
      return "ਇਹ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੀ ਦੂਜੀ ਮਾਤਰਾ ਨੂੰ ਜਵਾਬ ਮੰਨਦਾ ਹੈ, ਜਦਕਿ ਮੰਗੀ ਮਾਤਰਾ ਵੱਖਰੀ ਗਿਣਤੀ ਨਾਲ ਨਿਕਲਦੀ ਹੈ।";
  }
}

function applyTrapReview(
  question: ReviewedQuestion,
  language: TmwLocalizedLanguage,
): ReviewedQuestion {
  const reason = secondQuantityTrapReason(question, language);
  if (!reason) return question;
  const trap = question.explanation.commonTrap;
  const explanation = language === "hi"
    ? `${trap.optionLabel} (${trap.optionText}) इस कारण गलत है: ${reason}`
    : `${trap.optionLabel} (${trap.optionText}) ਇਸ ਕਾਰਨ ਗਲਤ ਹੈ: ${reason}`;
  return {
    ...question,
    explanation: {
      ...question.explanation,
      commonTrap: {
        ...trap,
        explanation,
      },
    },
  };
}

function naturalizeHindiRateStem(stem: string): string {
  return stem.replace(
    /कार्य-दर प्रति दिन (\d+) ([^।]+) है।/,
    "कार्य-दर $1 $2 प्रतिदिन है।",
  );
}

function naturalizePunjabiRateStem(stem: string): string {
  return stem.replace(
    /ਕੰਮ ਦੀ ਦਰ ਪ੍ਰਤੀ ਦਿਨ (\d+) ([^।]+) ਹੈ।/,
    "ਕੰਮ ਦੀ ਦਰ $1 $2 ਪ੍ਰਤੀ ਦਿਨ ਹੈ।",
  );
}

function naturalizeHindiConversionStem(stem: string): string {
  const match = /^(\d+) घंटे में कुल उत्पादन (.+?) है। उसी दर से (\d+) घंटे में कुल उत्पादन कितना होगा\?$/.exec(stem);
  if (!match) return stem;
  return `${match[1]} घंटे में उत्पादन = ${match[2]}। उसी दर से ${match[3]} घंटे में उत्पादन कितना होगा?`;
}

function naturalizePunjabiConversionStem(stem: string): string {
  const match = /^(\d+) ਘੰਟੇ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ (.+?) ਹੈ। ਉਸੇ ਦਰ ਨਾਲ (\d+) ਘੰਟੇ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ\?$/.exec(stem);
  if (!match) return stem;
  const sourceHours = Number(match[1]);
  const targetHours = Number(match[3]);
  const sourcePhrase = sourceHours === 1 ? "1 ਘੰਟੇ ਵਿੱਚ" : `${sourceHours} ਘੰਟਿਆਂ ਵਿੱਚ`;
  const targetPhrase = targetHours === 1 ? "1 ਘੰਟੇ ਵਿੱਚ" : `${targetHours} ਘੰਟਿਆਂ ਵਿੱਚ`;
  return `${sourcePhrase} ਉਤਪਾਦਨ = ${match[2]}। ਉਸੇ ਦਰ ਨਾਲ ${targetPhrase} ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
}

function remediateHindi(
  question: ReviewedQuestion,
  qlId: string,
): ReviewedQuestion {
  switch (qlId) {
    case "TMW-QL-003":
      return {
        ...question,
        stem: naturalizeHindiRateStem(question.stem),
      };
    case "TMW-QL-012":
      return updateShortcut(
        question,
        "कुल उत्पादन के लिए प्रतिदिन उत्पादन को दिनों की संख्या से गुणा करें।",
        "hi",
      );
    case "TMW-QL-015": {
      const targetHours = wholeNumber(question.parameters.targetDuration ?? question.parameters.time);
      const updated = {
        ...question,
        stem: naturalizeHindiConversionStem(question.stem),
      };
      return updateShortcut(
        updated,
        `पहले एक घंटे का उत्पादन निकालें, फिर उसे ${targetHours} से गुणा करें।`,
        "hi",
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
        stem: naturalizePunjabiRateStem(question.stem),
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
        "pa",
      );
    case "TMW-QL-013":
      return updateShortcut(
        question,
        question.explanation.opening.replace(
          "ਪਤਾ ਹਿੱਸੇ ਨੂੰ",
          "ਦਿੱਤੇ ਹਿੱਸੇ ਨੂੰ",
        ),
        "pa",
      );
    case "TMW-QL-014":
      return updateShortcut(
        question,
        "ਕੰਮ ਦੇ ਦਿੱਤੇ ਹਿੱਸੇ ਲਈ ਲੱਗੇ ਸਮੇਂ ਨੂੰ ਉਸ ਹਿੱਸੇ ਦੇ ਭਿੰਨ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਪੂਰਾ ਸਮਾਂ ਕੱਢੋ।",
        "pa",
      );
    case "TMW-QL-015": {
      const targetHours = wholeNumber(question.parameters.targetDuration ?? question.parameters.time);
      const updated = {
        ...question,
        stem: naturalizePunjabiConversionStem(question.stem),
      };
      return updateShortcut(
        updated,
        `ਪਹਿਲਾਂ ਇੱਕ ਘੰਟੇ ਦਾ ਉਤਪਾਦਨ ਕੱਢੋ, ਫਿਰ ਉਸ ਨੂੰ ${targetHours} ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
        "pa",
      );
    }
    case "TMW-QL-017":
      return updateShortcut(
        question,
        question.explanation.opening.replace("ਇੱਕੋ ਦਰ ਤੇ", "ਇੱਕੋ ਦਰ 'ਤੇ"),
        "pa",
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
  const worded = language === "hi"
    ? remediateHindi(question, qlId)
    : remediatePunjabi(question, qlId);
  return applyTrapReview(worded, language) as T;
}
