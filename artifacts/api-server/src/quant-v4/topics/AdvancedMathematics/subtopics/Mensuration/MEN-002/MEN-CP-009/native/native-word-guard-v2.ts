import type { MenCp009NativeV2Language } from "./editorial-v2";

const HINDI_WORDS: Array<[RegExp, string]> = [
  [/\bsurface\b/gi, "सतह"],
  [/\bvolume\b/gi, "आयतन"],
  [/\bradius\b/gi, "त्रिज्या"],
  [/\bdiameter\b/gi, "व्यास"],
  [/\bratio\b/gi, "अनुपात"],
  [/\bincrease\b/gi, "वृद्धि"],
  [/\bnew\b/gi, "नया"],
  [/\bcost\b/gi, "लागत"],
  [/\brate\b/gi, "दर"],
  [/\barea\b/gi, "क्षेत्रफल"],
  [/\bsphere\b/gi, "गोला"],
  [/\bhemisphere\b/gi, "अर्धगोला"],
  [/\brequired\b/gi, "आवश्यक"],
  [/\breduce\b/gi, "सरल करें"],
  [/\bcancel\b/gi, "समान पद काटें"],
  [/\bcommon\b/gi, "समान"],
  [/\bdividing\b/gi, "भाग देने पर"],
  [/\bdivide\b/gi, "भाग दें"],
  [/\bmatch\b/gi, "मिलाएँ"],
  [/\bgives\b/gi, "मिलता है"],
  [/\btherefore\b/gi, "इसलिए"],
  [/\bhere\b/gi, "यहाँ"],
  [/\bputting\b/gi, "रखने पर"],
  [/\bsubstitute\b/gi, "मान रखें"],
  [/\bsolving\b/gi, "हल करने पर"],
  [/\bwrite\b/gi, "लिखें"],
  [/\bformula\b/gi, "सूत्र"],
  [/\bgiven\b/gi, "दिया हुआ"],
  [/\bwith\b/gi, "के साथ"],
  [/\bper\b/gi, "प्रति"],
  [/\band\b/gi, "और"],
  [/\bthe\b/gi, ""],
];

const PUNJABI_WORDS: Array<[RegExp, string]> = [
  [/\bsurface\b/gi, "ਸਤਹ"],
  [/\bvolume\b/gi, "ਆਇਤਨ"],
  [/\bradius\b/gi, "ਅਰਧ-ਵਿਆਸ"],
  [/\bdiameter\b/gi, "ਵਿਆਸ"],
  [/\bratio\b/gi, "ਅਨੁਪਾਤ"],
  [/\bincrease\b/gi, "ਵਾਧਾ"],
  [/\bnew\b/gi, "ਨਵਾਂ"],
  [/\bcost\b/gi, "ਲਾਗਤ"],
  [/\brate\b/gi, "ਦਰ"],
  [/\barea\b/gi, "ਖੇਤਰਫਲ"],
  [/\bsphere\b/gi, "ਗੋਲਾ"],
  [/\bhemisphere\b/gi, "ਅਰਧ-ਗੋਲਾ"],
  [/\brequired\b/gi, "ਲੋੜੀਂਦਾ"],
  [/\breduce\b/gi, "ਸਧਾਰਨ ਕਰੋ"],
  [/\bcancel\b/gi, "ਸਾਂਝੇ ਪਦ ਕੱਟੋ"],
  [/\bcommon\b/gi, "ਸਾਂਝਾ"],
  [/\bdividing\b/gi, "ਭਾਗ ਦੇਣ ਤੇ"],
  [/\bdivide\b/gi, "ਭਾਗ ਦਿਓ"],
  [/\bmatch\b/gi, "ਮਿਲਾਓ"],
  [/\bgives\b/gi, "ਮਿਲਦਾ ਹੈ"],
  [/\btherefore\b/gi, "ਇਸ ਲਈ"],
  [/\bhere\b/gi, "ਇੱਥੇ"],
  [/\bputting\b/gi, "ਰੱਖਣ ਤੇ"],
  [/\bsubstitute\b/gi, "ਮੁੱਲ ਰੱਖੋ"],
  [/\bsolving\b/gi, "ਹੱਲ ਕਰਨ ਤੇ"],
  [/\bwrite\b/gi, "ਲਿਖੋ"],
  [/\bformula\b/gi, "ਸੂਤਰ"],
  [/\bgiven\b/gi, "ਦਿੱਤਾ ਹੋਇਆ"],
  [/\bwith\b/gi, "ਦੇ ਨਾਲ"],
  [/\bper\b/gi, "ਪ੍ਰਤੀ"],
  [/\band\b/gi, "ਅਤੇ"],
  [/\bthe\b/gi, ""],
];

function naturalizeRootInstruction(
  value: string,
  language: MenCp009NativeV2Language,
) {
  if (/^So take the square root of both terms of /i.test(value)) {
    const tail = value.replace(/^So take the square root of both terms of /i, "");
    return language === "hi"
      ? `अब ${tail.replace(/\.$/, "")} के दोनों पदों का वर्गमूल लें।`
      : `ਹੁਣ ${tail.replace(/\.$/, "")} ਦੇ ਦੋਵੇਂ ਪਦਾਂ ਦਾ ਵਰਗਮੂਲ ਲਓ।`;
  }
  if (/^So take the cube root of both terms of /i.test(value)) {
    const tail = value.replace(/^So take the cube root of both terms of /i, "");
    return language === "hi"
      ? `अब ${tail.replace(/\.$/, "")} के दोनों पदों का घनमूल लें।`
      : `ਹੁਣ ${tail.replace(/\.$/, "")} ਦੇ ਦੋਵੇਂ ਪਦਾਂ ਦਾ ਘਣਮੂਲ ਲਓ।`;
  }
  return value;
}

export function applyMenCp009NativeWordGuardV2(
  value: string,
  language: MenCp009NativeV2Language,
) {
  const replacements = language === "hi" ? HINDI_WORDS : PUNJABI_WORDS;
  const naturalized = naturalizeRootInstruction(value, language);
  return replacements.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    naturalized,
  ).replace(/\s+/g, " ").trim();
}
