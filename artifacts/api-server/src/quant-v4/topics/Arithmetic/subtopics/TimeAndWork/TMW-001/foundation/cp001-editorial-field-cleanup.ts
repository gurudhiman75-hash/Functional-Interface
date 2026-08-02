import type { TmwLocalizedLanguage } from "./localization-types";

interface CleanupQuestion {
  stem: string;
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

function replaceAllFields(
  question: CleanupQuestion,
  replacements: ReadonlyArray<readonly [string, string]>,
): CleanupQuestion {
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

export function applyTmwCp001EditorialFieldCleanup<T extends CleanupQuestion>(
  question: T,
  qlId: string,
  language: TmwLocalizedLanguage,
): T {
  if (language === "hi") {
    if (qlId === "TMW-QL-012") {
      return replaceAllFields(question, [
        ["प्रति इकाई समय के उत्पादन", "प्रतिदिन उत्पादन"],
      ]) as T;
    }
    return question;
  }

  const replacements: Array<readonly [string, string]> = [];
  if (qlId === "TMW-QL-012") {
    replacements.push(["ਪ੍ਰਤੀ ਇਕਾਈ ਸਮੇਂ ਦੇ ਉਤਪਾਦਨ", "ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ"]);
  }
  if (qlId === "TMW-QL-013") {
    replacements.push(["ਪਤਾ ਹਿੱਸੇ ਨੂੰ", "ਦਿੱਤੇ ਹਿੱਸੇ ਨੂੰ"]);
  }
  if (qlId === "TMW-QL-014") {
    replacements.push([
      "ਅਧੂਰੇ ਕੰਮ ਦੇ ਸਮੇਂ ਨੂੰ",
      "ਦਿੱਤੇ ਹਿੱਸੇ ਲਈ ਲੱਗੇ ਸਮੇਂ ਨੂੰ",
    ]);
  }
  if (qlId === "TMW-QL-017") {
    replacements.push(["ਇੱਕੋ ਦਰ ਤੇ", "ਇੱਕੋ ਦਰ 'ਤੇ"]);
  }
  if (qlId === "TMW-QL-019" || qlId === "TMW-QL-020") {
    replacements.push(["ਆਮ ਤੌਰ ਤੇ", "ਆਮ ਤੌਰ 'ਤੇ"]);
  }

  return replacements.length > 0
    ? replaceAllFields(question, replacements) as T
    : question;
}
