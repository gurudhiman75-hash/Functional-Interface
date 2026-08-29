import type { AlgPermanentQlId } from "./allocation";
import type { AlgReviewLocale } from "./multilingual-review-v1";
import {
  generateAlgPermanentMultilingualReviewV2NativeFinal,
} from "./multilingual-review-v2-native-final";
import type { AlgPermanentMultilingualReviewV2Item } from "./multilingual-review-v2";

function lang(locale: AlgReviewLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function rewriteTransformedRootQuestion(item: AlgPermanentMultilingualReviewV2Item): string {
  if (item.prototypeId !== "ALG-CP010-CAND-011") return item.question;
  const match = item.englishQuestion.match(/^α and β are the roots of (.+)\. Form the monic quadratic whose roots are (.+) and (.+)\.$/);
  if (!match) return item.question;
  return lang(
    item.locale,
    `α और β, ${match[1]} के मूल हैं। ऐसा मोनिक द्विघात समीकरण बनाइए जिसके मूल ${match[2]} और ${match[3]} हों।`,
    `α ਅਤੇ β, ${match[1]} ਦੇ ਮੂਲ ਹਨ। ਅਜਿਹਾ ਮੋਨਿਕ ਦੋ-ਘਾਤੀ ਸਮੀਕਰਨ ਬਣਾਓ ਜਿਸ ਦੇ ਮੂਲ ${match[2]} ਅਤੇ ${match[3]} ਹੋਣ।`,
  );
}

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

function applyFinalEnglishRules(locale: AlgReviewLocale, text: string): string {
  let value = text;
  for (const [pattern, hi, pa] of FINAL_ENGLISH_RULES) {
    value = value.replace(pattern, locale === "hi-IN" ? hi : pa);
  }
  return value
    .replace(/\ba मोनिक\b/g, locale === "hi-IN" ? "एक मोनिक" : "ਇੱਕ ਮੋਨਿਕ")
    .replace(/\ba (?:द्विघात|ਦੋ-ਘਾਤੀ)\b/g, locale === "hi-IN" ? "एक द्विघात" : "ਇੱਕ ਦੋ-ਘਾਤੀ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function repairKnownGrammar(item: AlgPermanentMultilingualReviewV2Item, text: string): string {
  let value = text;
  const locale = item.locale;

  if (item.prototypeId === "ALG-CP010-CAND-006") {
    value = value
      .replace(/^के लिए मूल α और β,/gm, "मूल α और β के लिए,")
      .replace(/^ਲਈ ਮੂਲ α ਅਤੇ β,/gm, "ਮੂਲ α ਅਤੇ β ਲਈ,")
      .replace(/^इसलिए एक मोनिक द्विघात के साथ मूल योग (.+?) और गुणनफल (.+?) है (.+)\.$/gm,
        "अतः मूल-योग $1 और मूल-गुणनफल $2 वाला मोनिक द्विघात $3 है।")
      .replace(/^ਇਸ ਲਈ ਇੱਕ ਮੋਨਿਕ ਦੋ-ਘਾਤੀ ਨਾਲ ਮੂਲ ਜੋੜ (.+?) ਅਤੇ ਗੁਣਨਫਲ (.+?) ਹੈ (.+)\.$/gm,
        "ਇਸ ਲਈ ਮੂਲ-ਜੋੜ $1 ਅਤੇ ਮੂਲ-ਗੁਣਨਫਲ $2 ਵਾਲਾ ਮੋਨਿਕ ਦੋ-ਘਾਤੀ $3 ਹੈ।");
  }

  if (item.prototypeId.startsWith("ALG-CP010-")) {
    value = value
      .replace(/^दिया है: α और β हैं मूल का (.+)\.$/gm, "दिया है: α और β, $1 के मूल हैं।")
      .replace(/^ਦਿੱਤਾ ਹੈ: α ਅਤੇ β ਹਨ ਮੂਲ ਦਾ (.+)\.$/gm, "ਦਿੱਤਾ ਹੈ: α ਅਤੇ β, $1 ਦੇ ਮੂਲ ਹਨ।");
  }

  if (item.prototypeId === "ALG-CP010-CAND-011") {
    value = value
      .replace(/\bस्थानांतरण लें\b/g, "स्थानांतरण करें")
      .replace(/\bਸਥਾਨਾਂਤਰ ਲਓ\b/g, "ਸਥਾਨਾਂਤਰ ਕਰੋ");
  }

  if (item.prototypeId === "ALG-CP002-CAND-001") {
    value = value
      .replace(/\bsubtract\b/gi, locale === "hi-IN" ? "घटाएँ" : "ਘਟਾਓ");
  }
  if (item.prototypeId === "ALG-CP002-CAND-002") {
    value = value.replace(/\bsuitable\b/gi, locale === "hi-IN" ? "उपयुक्त" : "ਢੁਕਵੀਂ");
  }
  if (item.prototypeId === "ALG-CP010-CAND-005") {
    value = value.replace(/\bsymmetric\b/gi, locale === "hi-IN" ? "सममित" : "ਸਮਮਿਤ");
  }
  return value;
}

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
    // Unicode Indic blocks keep the core ISCII-derived letters, vowel signs and digits aligned.
    // This fallback is intentionally last: explicit Punjabi editorial rewrites run before it.
    if (cp >= 0x0900 && cp <= 0x096f) {
      result += String.fromCodePoint(cp + 0x0100);
      continue;
    }
    result += char;
  }
  return result;
}

function seal(locale: AlgReviewLocale, text: string): string {
  let value = applyFinalEnglishRules(locale, text);
  if (locale === "pa-IN") value = devanagariResidueToGurmukhi(value);
  return value
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
}

export function generateAlgPermanentMultilingualReviewV2Sealed(
  qlId: AlgPermanentQlId,
  seed: number,
  locale: AlgReviewLocale,
  requestedVariantIndex?: number,
): AlgPermanentMultilingualReviewV2Item {
  const item = generateAlgPermanentMultilingualReviewV2NativeFinal(qlId, seed, locale, requestedVariantIndex);
  const question = seal(locale, rewriteTransformedRootQuestion(item));
  const explanation = seal(locale, repairKnownGrammar(item, item.explanation));
  return { ...item, question, explanation };
}
