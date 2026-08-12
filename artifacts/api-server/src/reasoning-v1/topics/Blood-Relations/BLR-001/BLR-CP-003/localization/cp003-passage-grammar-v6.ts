import type { BlrCp003FinalApprovedRecord } from "../cp003-final-approved-bank";
import type { BlrCp003TranslatedLocale } from "./cp003-language-pack";
import { localizedBlrCp003SharedPromptCompleteV5 } from "./cp003-passage-grammar-v5";

function protectNames(
  record: BlrCp003FinalApprovedRecord,
  text: string,
): { protectedText: string; restore: (value: string) => string } {
  const entries = [...record.proceduralLogic.nodes]
    .filter((node) => node.label)
    .sort((a, b) => b.label.length - a.label.length)
    .map((node) => ({ token: `⟦${node.id}⟧`, label: node.label }));
  let protectedText = text;
  for (const { token, label } of entries) protectedText = protectedText.split(label).join(token);
  return {
    protectedText,
    restore(value: string): string {
      let restored = value;
      for (const { token, label } of entries) restored = restored.split(token).join(label);
      return restored;
    },
  };
}

function hasResidualEnglish(text: string): boolean {
  return /\b[A-Za-z]{2,}\b/u.test(text.replace(/⟦[^⟧]+⟧/gu, " "));
}

function sixthWaveHindi(text: string): string {
  return text
    .replace(/^(.+) is the son of (.+) and (.+), not of (.+)\.$/, "$1, $2 और $3 का पुत्र है, $4 का नहीं।")
    .replace(/^(.+)'s sister (.+) is married to (.+); (.+) and (.+) have a daughter, (.+)\.$/, "$2, $1 की बहन है और उसका विवाह $3 से हुआ है; $4 और $5 की एक पुत्री $6 है।")
    .replace(/^(.+) is married to (.+), and (.+) to (.+)\.$/, "$1 का विवाह $2 से और $3 का विवाह $4 से हुआ है।");
}

function sixthWavePunjabi(text: string): string {
  return text
    .replace(/^(.+) is the son of (.+) and (.+), not of (.+)\.$/, "$1, $2 ਅਤੇ $3 ਦਾ ਪੁੱਤਰ ਹੈ, $4 ਦਾ ਨਹੀਂ।")
    .replace(/^(.+)'s sister (.+) is married to (.+); (.+) and (.+) have a daughter, (.+)\.$/, "$2, $1 ਦੀ ਭੈਣ ਹੈ ਅਤੇ ਉਸ ਦਾ ਵਿਆਹ $3 ਨਾਲ ਹੋਇਆ ਹੈ; $4 ਅਤੇ $5 ਦੀ ਇੱਕ ਧੀ $6 ਹੈ।")
    .replace(/^(.+) is married to (.+), and (.+) to (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਅਤੇ $3 ਦਾ ਵਿਆਹ $4 ਨਾਲ ਹੋਇਆ ਹੈ।");
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=\.)\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function localizeSixthWaveSentence(
  record: BlrCp003FinalApprovedRecord,
  sentence: string,
  locale: BlrCp003TranslatedLocale,
): string {
  try {
    return localizedBlrCp003SharedPromptCompleteV5({ ...record, sharedPrompt: sentence }, locale);
  } catch {
    const { protectedText, restore } = protectNames(record, sentence);
    const translated = locale === "hi-IN"
      ? sixthWaveHindi(protectedText)
      : sixthWavePunjabi(protectedText);
    if (translated === protectedText || hasResidualEnglish(translated)) {
      throw new Error(`Untranslated CP-003 ${locale} passage sentence: ${sentence}`);
    }
    return restore(translated);
  }
}

export function localizedBlrCp003SharedPromptCompleteV6(
  record: BlrCp003FinalApprovedRecord,
  locale: BlrCp003TranslatedLocale,
): string {
  return splitSentences(record.sharedPrompt)
    .map((sentence) => localizeSixthWaveSentence(record, sentence, locale))
    .join(" ");
}
