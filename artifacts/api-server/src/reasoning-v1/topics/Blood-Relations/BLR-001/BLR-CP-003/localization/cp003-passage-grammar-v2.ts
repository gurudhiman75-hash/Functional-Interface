import type { BlrCp003FinalApprovedRecord } from "../cp003-final-approved-bank";
import type { BlrCp003TranslatedLocale } from "./cp003-language-pack";
import { localizedBlrCp003SharedPromptComplete } from "./cp003-passage-grammar";

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

function secondWaveHindi(text: string): string {
  return text
    .replace(/^(.+) and (.+) are their sons, while (.+) is their daughter\.$/, "$1 और $2 उनके पुत्र हैं, जबकि $3 उनकी पुत्री है।")
    .replace(/^(.+) is (.+)'s daughter, (.+) is (.+)'s son, and (.+) is (.+)'s son\.$/, "$1, $2 की पुत्री है; $3, $4 का पुत्र है; और $5, $6 का पुत्र है।")
    .replace(/^(.+) is (.+)'s mother, and (.+) is (.+)'s father\.$/, "$1, $2 की माता है और $3, $4 के पिता हैं।")
    .replace(/^(.+)'s maternal cousin (.+) is the daughter of (.+)\.$/, "$2, $1 की मातृ कज़िन है और $3 की पुत्री है।")
    .replace(/^(.+), (.+)'s daughter-in-law, has one son, (.+)\.$/, "$1, $2 की बहू है और उसका एक पुत्र $3 है।")
    .replace(/^(.+), (.+)'s daughter-in-law, has one daughter, (.+)\.$/, "$1, $2 की बहू है और उसकी एक पुत्री $3 है।")
    .replace(/^(.+) is (.+)'s son-in-law, and (.+) is (.+)'s daughter-in-law\.$/, "$1, $2 का दामाद है और $3, $4 की बहू है।")
    .replace(/^(.+) is the son and (.+) the daughter of (.+)'s paternal aunt (.+)\.$/, "$1 पुत्र और $2 पुत्री हैं; दोनों $3 की बुआ $4 की संतानें हैं।")
    .replace(/^(.+) is (.+)'s husband, while (.+) is (.+)'s husband\.$/, "$1, $2 का पति है, जबकि $3, $4 का पति है।")
    .replace(/^(.+) and (.+) are parents of (.+), while (.+) and (.+) are parents of (.+)\.$/, "$1 और $2, $3 के माता-पिता हैं; जबकि $4 और $5, $6 के माता-पिता हैं।")
    .replace(/^(.+)'s wife is (.+), (.+)'s husband is (.+), and (.+)'s wife is (.+)\.$/, "$1 की पत्नी $2 है, $3 के पति $4 हैं और $5 की पत्नी $6 है।");
}

function secondWavePunjabi(text: string): string {
  return text
    .replace(/^(.+) and (.+) are their sons, while (.+) is their daughter\.$/, "$1 ਅਤੇ $2 ਉਨ੍ਹਾਂ ਦੇ ਪੁੱਤਰ ਹਨ, ਜਦਕਿ $3 ਉਨ੍ਹਾਂ ਦੀ ਧੀ ਹੈ।")
    .replace(/^(.+) is (.+)'s daughter, (.+) is (.+)'s son, and (.+) is (.+)'s son\.$/, "$1, $2 ਦੀ ਧੀ ਹੈ; $3, $4 ਦਾ ਪੁੱਤਰ ਹੈ; ਅਤੇ $5, $6 ਦਾ ਪੁੱਤਰ ਹੈ।")
    .replace(/^(.+) is (.+)'s mother, and (.+) is (.+)'s father\.$/, "$1, $2 ਦੀ ਮਾਤਾ ਹੈ ਅਤੇ $3, $4 ਦੇ ਪਿਤਾ ਹਨ।")
    .replace(/^(.+)'s maternal cousin (.+) is the daughter of (.+)\.$/, "$2, $1 ਦੀ ਮਾਤਰੀ ਕਜ਼ਨ ਹੈ ਅਤੇ $3 ਦੀ ਧੀ ਹੈ।")
    .replace(/^(.+), (.+)'s daughter-in-law, has one son, (.+)\.$/, "$1, $2 ਦੀ ਨੂੰਹ ਹੈ ਅਤੇ ਉਸ ਦਾ ਇੱਕ ਪੁੱਤਰ $3 ਹੈ।")
    .replace(/^(.+), (.+)'s daughter-in-law, has one daughter, (.+)\.$/, "$1, $2 ਦੀ ਨੂੰਹ ਹੈ ਅਤੇ ਉਸ ਦੀ ਇੱਕ ਧੀ $3 ਹੈ।")
    .replace(/^(.+) is (.+)'s son-in-law, and (.+) is (.+)'s daughter-in-law\.$/, "$1, $2 ਦਾ ਜਵਾਈ ਹੈ ਅਤੇ $3, $4 ਦੀ ਨੂੰਹ ਹੈ।")
    .replace(/^(.+) is the son and (.+) the daughter of (.+)'s paternal aunt (.+)\.$/, "$1 ਪੁੱਤਰ ਅਤੇ $2 ਧੀ ਹਨ; ਦੋਵੇਂ $3 ਦੀ ਭੂਆ $4 ਦੀਆਂ ਸੰਤਾਨਾਂ ਹਨ।")
    .replace(/^(.+) is (.+)'s husband, while (.+) is (.+)'s husband\.$/, "$1, $2 ਦਾ ਪਤੀ ਹੈ, ਜਦਕਿ $3, $4 ਦਾ ਪਤੀ ਹੈ।")
    .replace(/^(.+) and (.+) are parents of (.+), while (.+) and (.+) are parents of (.+)\.$/, "$1 ਅਤੇ $2, $3 ਦੇ ਮਾਤਾ-ਪਿਤਾ ਹਨ; ਜਦਕਿ $4 ਅਤੇ $5, $6 ਦੇ ਮਾਤਾ-ਪਿਤਾ ਹਨ।")
    .replace(/^(.+)'s wife is (.+), (.+)'s husband is (.+), and (.+)'s wife is (.+)\.$/, "$1 ਦੀ ਪਤਨੀ $2 ਹੈ, $3 ਦੇ ਪਤੀ $4 ਹਨ ਅਤੇ $5 ਦੀ ਪਤਨੀ $6 ਹੈ।");
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=\.)\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function localizeSecondWaveSentence(
  record: BlrCp003FinalApprovedRecord,
  sentence: string,
  locale: BlrCp003TranslatedLocale,
): string {
  try {
    return localizedBlrCp003SharedPromptComplete({ ...record, sharedPrompt: sentence }, locale);
  } catch {
    const { protectedText, restore } = protectNames(record, sentence);
    const translated = locale === "hi-IN"
      ? secondWaveHindi(protectedText)
      : secondWavePunjabi(protectedText);
    if (translated === protectedText) {
      throw new Error(`Untranslated CP-003 ${locale} passage sentence: ${sentence}`);
    }
    return restore(translated);
  }
}

export function localizedBlrCp003SharedPromptFinal(
  record: BlrCp003FinalApprovedRecord,
  locale: BlrCp003TranslatedLocale,
): string {
  return splitSentences(record.sharedPrompt)
    .map((sentence) => localizeSecondWaveSentence(record, sentence, locale))
    .join(" ");
}
