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

function normalizeHindiConversionStem(stem: string): string {
  const match = /^(\d+) (?:घंटा|घंटे) में कुल उत्पादन (.+?) है। उसी दर से (\d+) (?:घंटा|घंटे) में कुल उत्पादन कितना होगा\?$/.exec(stem);
  if (!match) return stem;
  return `${match[1]} घंटे में उत्पादन = ${match[2]}। उसी दर से ${match[3]} घंटे में उत्पादन कितना होगा?`;
}

function normalizePunjabiConversionStem(stem: string): string {
  const match = /^(\d+) (?:ਘੰਟਾ|ਘੰਟੇ|ਘੰਟਿਆਂ) ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ (.+?) ਹੈ। ਉਸੇ ਦਰ ਨਾਲ (\d+) (?:ਘੰਟਾ|ਘੰਟੇ|ਘੰਟਿਆਂ) ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ\?$/.exec(stem);
  if (!match) return stem;
  const source = Number(match[1]);
  const target = Number(match[3]);
  const sourceTime = source === 1 ? "1 ਘੰਟੇ ਵਿੱਚ" : `${source} ਘੰਟਿਆਂ ਵਿੱਚ`;
  const targetTime = target === 1 ? "1 ਘੰਟੇ ਵਿੱਚ" : `${target} ਘੰਟਿਆਂ ਵਿੱਚ`;
  return `${sourceTime} ਉਤਪਾਦਨ = ${match[2]}। ਉਸੇ ਦਰ ਨਾਲ ${targetTime} ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
}

export function applyTmwCp001EditorialFieldCleanup<T extends CleanupQuestion>(
  question: T,
  qlId: string,
  language: TmwLocalizedLanguage,
): T {
  if (language === "hi") {
    let updated: CleanupQuestion = question;
    if (qlId === "TMW-QL-012") {
      updated = replaceAllFields(updated, [
        ["प्रति इकाई समय के उत्पादन", "प्रतिदिन उत्पादन"],
      ]);
    }
    if (qlId === "TMW-QL-015") {
      updated = {
        ...updated,
        stem: normalizeHindiConversionStem(updated.stem),
      };
    }
    return updated as T;
  }

  let updated: CleanupQuestion = question;
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
  if (replacements.length > 0) updated = replaceAllFields(updated, replacements);
  if (qlId === "TMW-QL-015") {
    updated = {
      ...updated,
      stem: normalizePunjabiConversionStem(updated.stem),
    };
  }

  return updated as T;
}
