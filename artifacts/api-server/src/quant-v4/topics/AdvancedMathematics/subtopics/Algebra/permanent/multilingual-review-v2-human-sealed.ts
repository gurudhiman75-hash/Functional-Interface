import type { AlgPermanentQlId } from "./allocation";
import type { AlgReviewLocale } from "./multilingual-review-v1";
import {
  generateAlgPermanentMultilingualReviewV2HumanEditorial,
} from "./multilingual-review-v2-human-editorial";
import type { AlgPermanentMultilingualReviewV2Item } from "./multilingual-review-v2";

const FINAL_ENGLISH_RULES: ReadonlyArray<readonly [RegExp, string, string]> = [
  [/\band\b/gi, "और", "ਅਤੇ"],
  [/\bare\b/gi, "हैं", "ਹਨ"],
  [/\bof\b/gi, "के", "ਦੇ"],
  [/\broots\b/gi, "मूल", "ਮੂਲ"],
  [/\broot\b/gi, "मूल", "ਮੂਲ"],
  [/\bthe\b/gi, "", ""],
  [/\bshift\b/gi, "स्थानांतरण", "ਸਥਾਨਾਂਤਰ"],
  [/\bsigns\b/gi, "चिन्ह", "ਚਿੰਨ੍ਹ"],
  [/\bsign\b/gi, "चिन्ह", "ਚਿੰਨ੍ਹ"],
  [/\bsimplifying\b/gi, "सरल करने पर", "ਸਰਲ ਕਰਨ ਤੇ"],
  [/\bsubtract\b/gi, "घटाएँ", "ਘਟਾਓ"],
  [/\bsuitable\b/gi, "उपयुक्त", "ਢੁਕਵੀਂ"],
  [/\bsymmetric\b/gi, "सममित", "ਸਮਮਿਤ"],
  [/\btake\b/gi, "लें", "ਲਓ"],
  [/\bthere\b/gi, "वहाँ", "ਉੱਥੇ"],
  [/\bused\b/gi, "उपयोग किया", "ਵਰਤਿਆ"],
  [/\busing\b/gi, "उपयोग करने पर", "ਵਰਤਣ ਤੇ"],
  [/\buse\b/gi, "उपयोग करें", "ਵਰਤੋ"],
];

function devanagariResidueToGurmukhi(text: string): string {
  let result = "";
  for (const char of text) {
    const cp = char.codePointAt(0)!;
    if (cp === 0x0964) {
      result += ".";
      continue;
    }
    if (cp === 0x0965) {
      result += "..";
      continue;
    }
    if (cp >= 0x0900 && cp <= 0x096f) {
      result += String.fromCodePoint(cp + 0x0100);
      continue;
    }
    result += char;
  }
  return result;
}

function seal(locale: AlgReviewLocale, text: string): string {
  let value = text;
  for (const [pattern, hi, pa] of FINAL_ENGLISH_RULES) {
    value = value.replace(pattern, locale === "hi-IN" ? hi : pa);
  }
  value = value
    .replace(/\ba मोनिक\b/g, locale === "hi-IN" ? "एक मोनिक" : "ਇੱਕ ਮੋਨਿਕ")
    .replace(/\ba (?:द्विघात|ਦੋ-ਘਾਤੀ)\b/g, locale === "hi-IN" ? "एक द्विघात" : "ਇੱਕ ਦੋ-ਘਾਤੀ");
  if (locale === "pa-IN") value = devanagariResidueToGurmukhi(value);
  return value
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
}

export function generateAlgPermanentMultilingualReviewV2HumanSealed(
  qlId: AlgPermanentQlId,
  seed: number,
  locale: AlgReviewLocale,
  requestedVariantIndex?: number,
): AlgPermanentMultilingualReviewV2Item {
  const item = generateAlgPermanentMultilingualReviewV2HumanEditorial(qlId, seed, locale, requestedVariantIndex ?? 0);
  return Object.freeze({
    ...item,
    question: seal(locale, item.question),
    explanation: seal(locale, item.explanation),
  });
}
