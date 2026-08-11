import type { BlrCp003FinalApprovedRecord } from "../cp003-final-approved-bank";
import type { BlrCp003TranslatedLocale } from "./cp003-language-pack";
import { localizedBlrCp003SharedPromptFinal } from "./cp003-passage-grammar-v2";

const residualEnglishFamilyVocabulary = /\b(?:married|unmarried|mother|father|son|daughter|children|child|siblings?|spouse|wife|husband|parents?|brother|sister|cousins?)\b/i;

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

function lastHindi(text: string): string {
  return text
    .replace(/^(.+) and (.+) are married and have three children\.$/, "$1 और $2 विवाहित हैं और उनकी तीन संतानें हैं।")
    .replace(/^(.+) is (.+)'s daughter, and (.+) is unmarried\.$/, "$1, $2 की पुत्री है और $3 अविवाहित है।")
    .replace(/^(.+) is (.+)'s father, whereas (.+) is unmarried\.$/, "$1, $2 के पिता हैं, जबकि $3 अविवाहित है।")
    .replace(/^(.+) is (.+)'s husband\.$/, "$1, $2 का पति है।")
    .replace(/^(.+) and (.+) are parents of (.+) and (.+); (.+) and (.+) are parents of (.+) and (.+)\.$/, "$1 और $2, $3 और $4 के माता-पिता हैं; $5 और $6, $7 और $8 के माता-पिता हैं।")
    .replace(/^(.+), (.+) and (.+) belong respectively to the three branches of (.+), (.+) and (.+)\.$/, "$1, $2 और $3 क्रमशः $4, $5 और $6 की तीन शाखाओं से संबंधित हैं।");
}

function lastPunjabi(text: string): string {
  return text
    .replace(/^(.+) and (.+) are married and have three children\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਤਿੰਨ ਸੰਤਾਨਾਂ ਹਨ।")
    .replace(/^(.+) is (.+)'s daughter, and (.+) is unmarried\.$/, "$1, $2 ਦੀ ਧੀ ਹੈ ਅਤੇ $3 ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+) is (.+)'s father, whereas (.+) is unmarried\.$/, "$1, $2 ਦੇ ਪਿਤਾ ਹਨ, ਜਦਕਿ $3 ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+) is (.+)'s husband\.$/, "$1, $2 ਦਾ ਪਤੀ ਹੈ।")
    .replace(/^(.+) and (.+) are parents of (.+) and (.+); (.+) and (.+) are parents of (.+) and (.+)\.$/, "$1 ਅਤੇ $2, $3 ਅਤੇ $4 ਦੇ ਮਾਤਾ-ਪਿਤਾ ਹਨ; $5 ਅਤੇ $6, $7 ਅਤੇ $8 ਦੇ ਮਾਤਾ-ਪਿਤਾ ਹਨ।")
    .replace(/^(.+), (.+) and (.+) belong respectively to the three branches of (.+), (.+) and (.+)\.$/, "$1, $2 ਅਤੇ $3 ਕ੍ਰਮਵਾਰ $4, $5 ਅਤੇ $6 ਦੀਆਂ ਤਿੰਨ ਸ਼ਾਖਾਵਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ।");
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=\.)\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function localizeLastSentence(
  record: BlrCp003FinalApprovedRecord,
  sentence: string,
  locale: BlrCp003TranslatedLocale,
): string {
  try {
    const translated = localizedBlrCp003SharedPromptFinal({ ...record, sharedPrompt: sentence }, locale);
    const protectedTranslated = protectNames(record, translated).protectedText;
    if (!residualEnglishFamilyVocabulary.test(protectedTranslated)) return translated;
  } catch {
    // Exact V3 fallback below handles sentences not covered by earlier grammar waves.
  }

  const { protectedText, restore } = protectNames(record, sentence);
  const translated = locale === "hi-IN" ? lastHindi(protectedText) : lastPunjabi(protectedText);
  if (translated === protectedText || residualEnglishFamilyVocabulary.test(translated)) {
    throw new Error(`Untranslated CP-003 ${locale} passage sentence: ${sentence}`);
  }
  return restore(translated);
}

export function localizedBlrCp003SharedPromptCompleteV3(
  record: BlrCp003FinalApprovedRecord,
  locale: BlrCp003TranslatedLocale,
): string {
  return splitSentences(record.sharedPrompt)
    .map((sentence) => localizeLastSentence(record, sentence, locale))
    .join(" ");
}
