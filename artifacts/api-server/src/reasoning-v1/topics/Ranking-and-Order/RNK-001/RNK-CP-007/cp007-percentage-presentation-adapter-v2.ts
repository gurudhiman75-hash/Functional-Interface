import { createHash } from "node:crypto";

import {
  RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_VERSION,
  buildRnkCp007PercentagePresentationBank,
  type RnkCp007PercentageAdapterLocale,
} from "./cp007-percentage-presentation-adapter-v1";

export const RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_V2_VERSION =
  "RNK_CP007_QL042_PERCENTAGE_PRESENTATION_ADAPTER_V2_NATIVE_GRAMMAR" as const;
export const RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_V2_AUTHORITY =
  "CATEGORY_COMPOSITION_PERCENTAGE_PRESENTATION_NATIVE_GRAMMAR_V2" as const;

type AnyQuestion = Record<string, any>;

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function polishEnglish(text: string): string {
  return text
    .replace(/(^|\.\s+)boys are/gu, "$1Boys are")
    .replace(/(^|\.\s+)girls are/gu, "$1Girls are");
}

function polishHindi(text: string): string {
  return text
    .replace(/जो लड़कियाँ में से है/gu, "जो लड़कियों में से एक है")
    .replace(/जो लड़के में से है/gu, "जो लड़कों में से एक है")
    .replace(/कितने लड़कियाँ/gu, "कितनी लड़कियाँ")
    .replace(/(\d+) लड़कियाँ पहले से आगे दिए गए हैं।/gu, "प्रश्न के अनुसार, $1 लड़कियाँ आगे हैं।")
    .replace(/(\d+) लड़के पहले से आगे दिए गए हैं।/gu, "प्रश्न के अनुसार, $1 लड़के आगे हैं।")
    .replace(/आगे लड़कियाँ =/gu, "आगे लड़कियों की संख्या =")
    .replace(/पीछे लड़कियाँ =/gu, "पीछे लड़कियों की संख्या =")
    .replace(/आगे लड़के =/gu, "आगे लड़कों की संख्या =")
    .replace(/पीछे लड़के =/gu, "पीछे लड़कों की संख्या =");
}

function polishPunjabi(text: string): string {
  return text
    .replace(/ਜੋ ਕੁੜੀਆਂ ਵਿੱਚੋਂ ਹੈ/gu, "ਜੋ ਕੁੜੀਆਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ")
    .replace(/ਜੋ ਮੁੰਡੇ ਵਿੱਚੋਂ ਹੈ/gu, "ਜੋ ਮੁੰਡਿਆਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ")
    .replace(/ਕਿੰਨੇ ਕੁੜੀਆਂ/gu, "ਕਿੰਨੀਆਂ ਕੁੜੀਆਂ")
    .replace(/(\d+) ਕੁੜੀਆਂ ਪਹਿਲਾਂ ਹੀ ਅੱਗੇ ਦਿੱਤੇ ਹਨ।/gu, "ਸਵਾਲ ਅਨੁਸਾਰ, $1 ਕੁੜੀਆਂ ਅੱਗੇ ਹਨ।")
    .replace(/(\d+) ਮੁੰਡੇ ਪਹਿਲਾਂ ਹੀ ਅੱਗੇ ਦਿੱਤੇ ਹਨ।/gu, "ਸਵਾਲ ਅਨੁਸਾਰ, $1 ਮੁੰਡੇ ਅੱਗੇ ਹਨ।")
    .replace(/ਅੱਗੇ ਕੁੜੀਆਂ =/gu, "ਅੱਗੇ ਵਾਲੀਆਂ ਕੁੜੀਆਂ ਦੀ ਗਿਣਤੀ =")
    .replace(/ਪਿੱਛੇ ਕੁੜੀਆਂ =/gu, "ਪਿੱਛੇ ਵਾਲੀਆਂ ਕੁੜੀਆਂ ਦੀ ਗਿਣਤੀ =")
    .replace(/ਅੱਗੇ ਮੁੰਡੇ =/gu, "ਅੱਗੇ ਵਾਲੇ ਮੁੰਡਿਆਂ ਦੀ ਗਿਣਤੀ =")
    .replace(/ਪਿੱਛੇ ਮੁੰਡੇ =/gu, "ਪਿੱਛੇ ਵਾਲੇ ਮੁੰਡਿਆਂ ਦੀ ਗਿਣਤੀ =");
}

function polish(text: string, locale: RnkCp007PercentageAdapterLocale): string {
  if (locale === "hi-IN") return polishHindi(text);
  if (locale === "pa-IN") return polishPunjabi(text);
  return polishEnglish(text);
}

function v2Question(question: AnyQuestion, locale: RnkCp007PercentageAdapterLocale): AnyQuestion {
  const stem = polish(String(question.stem), locale);
  const explanation = polish(String(question.explanation), locale);
  const v1 = question.percentagePresentation;
  const v2Fingerprint = sha256({
    version: RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_V2_VERSION,
    v1AdapterFingerprint: v1.adapterFingerprint,
    locale,
    stem,
    explanation,
  });

  return {
    ...question,
    stem,
    explanation,
    percentagePresentation: {
      ...v1,
      version: RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_V2_VERSION,
      authority: RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_V2_AUTHORITY,
      v1Version: RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_VERSION,
      v1AdapterFingerprint: v1.adapterFingerprint,
      nativeGrammarOverlay: true,
      adapterFingerprint: v2Fingerprint,
    },
  };
}

export function buildRnkCp007PercentagePresentationBankV2(
  locale: RnkCp007PercentageAdapterLocale,
): readonly AnyQuestion[] {
  return buildRnkCp007PercentagePresentationBank(locale).map((question) =>
    v2Question(question as AnyQuestion, locale));
}
