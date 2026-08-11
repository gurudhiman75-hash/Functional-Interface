import type { BlrCp003FinalApprovedRecord } from "../cp003-final-approved-bank";
import type { BlrCp003TranslatedLocale } from "./cp003-language-pack";
import { localizedBlrCp003SharedPromptCompleteV4 } from "./cp003-passage-grammar-v4";

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
  const withoutNameTokens = text.replace(/⟦[^⟧]+⟧/gu, " ");
  return /\b[A-Za-z]{2,}\b/u.test(withoutNameTokens);
}

function fifthWaveHindi(text: string): string {
  return text
    .replace(/^(.+) is married to (.+) and their son is (.+)\.$/, "$1 का विवाह $2 से हुआ है और उनका पुत्र $3 है।")
    .replace(/^(.+) is married to (.+); their children are (.+), (.+), (.+) and (.+)\.$/, "$1 का विवाह $2 से हुआ है; उनकी संतानें $3, $4, $5 और $6 हैं।")
    .replace(/^(.+) is married to (.+); their daughter is (.+)\.$/, "$1 का विवाह $2 से हुआ है; उनकी पुत्री $3 है।")
    .replace(/^(.+) is neither (.+)'s sibling nor (.+)'s child; he is the son of (.+) and (.+)\.$/, "$1 न $2 का भाई-बहन है और न $3 की संतान; वह $4 और $5 का पुत्र है।")
    .replace(/^(.+) is married to (.+), while (.+) is married to (.+)\.$/, "$1 का विवाह $2 से हुआ है, जबकि $3 का विवाह $4 से हुआ है।")
    .replace(/^(.+) is married to (.+); their children are (.+), (.+) and (.+)\.$/, "$1 का विवाह $2 से हुआ है; उनकी संतानें $3, $4 और $5 हैं।")
    .replace(/^(.+), sister of (.+) and (.+), is unmarried\.$/, "$1, $2 और $3 की बहन है और अविवाहित है।")
    .replace(/^(.+), the other sister of (.+), is unmarried\.$/, "$1, $2 की दूसरी बहन है और अविवाहित है।")
    .replace(/^(.+)'s brother (.+) is unmarried, while (.+) is married to (.+)\.$/, "$2, $1 का भाई है और अविवाहित है, जबकि $3 का विवाह $4 से हुआ है।")
    .replace(/^Their daughter (.+) is married to (.+) and has (.+) and (.+)\.$/, "उनकी पुत्री $1 का विवाह $2 से हुआ है और $1 तथा $2 की संतानें $3 और $4 हैं।")
    .replace(/^(.+) is married to (.+), (.+) to (.+), and (.+) to (.+)\.$/, "$1 का विवाह $2 से, $3 का विवाह $4 से और $5 का विवाह $6 से हुआ है।")
    .replace(/^(.+) is married to (.+) and has (.+)\.$/, "$1 का विवाह $2 से हुआ है और उनकी संतान $3 है।");
}

function fifthWavePunjabi(text: string): string {
  return text
    .replace(/^(.+) is married to (.+) and their son is (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਪੁੱਤਰ $3 ਹੈ।")
    .replace(/^(.+) is married to (.+); their children are (.+), (.+), (.+) and (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ; ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਤਾਨਾਂ $3, $4, $5 ਅਤੇ $6 ਹਨ।")
    .replace(/^(.+) is married to (.+); their daughter is (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ; ਉਨ੍ਹਾਂ ਦੀ ਧੀ $3 ਹੈ।")
    .replace(/^(.+) is neither (.+)'s sibling nor (.+)'s child; he is the son of (.+) and (.+)\.$/, "$1 ਨਾ $2 ਦਾ ਭਰਾ-ਭੈਣ ਹੈ ਅਤੇ ਨਾ $3 ਦੀ ਸੰਤਾਨ; ਉਹ $4 ਅਤੇ $5 ਦਾ ਪੁੱਤਰ ਹੈ।")
    .replace(/^(.+) is married to (.+), while (.+) is married to (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ, ਜਦਕਿ $3 ਦਾ ਵਿਆਹ $4 ਨਾਲ ਹੋਇਆ ਹੈ।")
    .replace(/^(.+) is married to (.+); their children are (.+), (.+) and (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ; ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਤਾਨਾਂ $3, $4 ਅਤੇ $5 ਹਨ।")
    .replace(/^(.+), sister of (.+) and (.+), is unmarried\.$/, "$1, $2 ਅਤੇ $3 ਦੀ ਭੈਣ ਹੈ ਅਤੇ ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+), the other sister of (.+), is unmarried\.$/, "$1, $2 ਦੀ ਦੂਜੀ ਭੈਣ ਹੈ ਅਤੇ ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+)'s brother (.+) is unmarried, while (.+) is married to (.+)\.$/, "$2, $1 ਦਾ ਭਰਾ ਹੈ ਅਤੇ ਅਵਿਵਾਹਿਤ ਹੈ, ਜਦਕਿ $3 ਦਾ ਵਿਆਹ $4 ਨਾਲ ਹੋਇਆ ਹੈ।")
    .replace(/^Their daughter (.+) is married to (.+) and has (.+) and (.+)\.$/, "ਉਨ੍ਹਾਂ ਦੀ ਧੀ $1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ $1 ਅਤੇ $2 ਦੀਆਂ ਸੰਤਾਨਾਂ $3 ਅਤੇ $4 ਹਨ।")
    .replace(/^(.+) is married to (.+), (.+) to (.+), and (.+) to (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ, $3 ਦਾ ਵਿਆਹ $4 ਨਾਲ ਅਤੇ $5 ਦਾ ਵਿਆਹ $6 ਨਾਲ ਹੋਇਆ ਹੈ।")
    .replace(/^(.+) is married to (.+) and has (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਸੰਤਾਨ $3 ਹੈ।");
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=\.)\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function localizeFifthWaveSentence(
  record: BlrCp003FinalApprovedRecord,
  sentence: string,
  locale: BlrCp003TranslatedLocale,
): string {
  try {
    const prior = localizedBlrCp003SharedPromptCompleteV4({ ...record, sharedPrompt: sentence }, locale);
    const { protectedText } = protectNames(record, prior);
    if (!hasResidualEnglish(protectedText)) return prior;
  } catch {
    // Exact V5 fallback below handles templates still outside V1-V4 coverage.
  }

  const { protectedText, restore } = protectNames(record, sentence);
  const translated = locale === "hi-IN"
    ? fifthWaveHindi(protectedText)
    : fifthWavePunjabi(protectedText);
  if (translated === protectedText || hasResidualEnglish(translated)) {
    throw new Error(`Untranslated CP-003 ${locale} passage sentence: ${sentence}`);
  }
  return restore(translated);
}

export function localizedBlrCp003SharedPromptCompleteV5(
  record: BlrCp003FinalApprovedRecord,
  locale: BlrCp003TranslatedLocale,
): string {
  return splitSentences(record.sharedPrompt)
    .map((sentence) => localizeFifthWaveSentence(record, sentence, locale))
    .join(" ");
}
