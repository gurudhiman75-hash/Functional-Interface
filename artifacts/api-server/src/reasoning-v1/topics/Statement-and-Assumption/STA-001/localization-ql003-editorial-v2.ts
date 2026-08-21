import {
  generateStaQl003LocalizedQuestion,
  STA_QL003_LOCALIZATION_LIFECYCLE,
  type StaQl003LocalizedLifecycle,
  type StaQl003LocalizedQuestion,
} from "./localization-ql003.ts";
import type { StaLocalizedLocale } from "./localization-types.ts";

export const STA_QL003_LOCALIZATION_EDITORIAL_VERSION = "V2_NATIVE_EDITORIAL" as const;

const HINDI_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ["अलर्ट-सेवा माइग्रेशन", "अलर्ट सेवा के माइग्रेशन"],
  ["डेस्क 3 पर पहचान-पत्र बदलने का काम किया जा सकता है।", "डेस्क 3 पर नया पहचान-पत्र जारी किया जा सकता है।"],
  ["नया पहचान-पत्र बनवाने की प्रक्रिया डेस्क 3 पर हो सकती है।", "नया पहचान-पत्र डेस्क 3 से जारी कराया जा सकता है।"],
  ["सूची-जाँच के कारण पुस्तकालय काउंटर बंद रहने के दौरान", "पुस्तकालय के रिकॉर्ड की जाँच के कारण काउंटर बंद रहने के दौरान"],
  ["आज सूची-जाँच के कारण काउंटर बंद है", "आज पुस्तकालय के रिकॉर्ड की जाँच के कारण काउंटर बंद है"],
  ["संग्रह सूचना", "प्रमाणपत्र लेने की सूचना"],
  ["प्रमाणपत्र संबंधी काम वाले आवेदक", "प्रमाणपत्र संबंधी काम कराने वाले आवेदक"],
  ["विंडो 9 पर प्रमाणपत्र संबंधी सेवा मिल सकती है।", "विंडो 9 पर प्रमाणपत्र संबंधी काम किया जा सकता है।"],
  ["छूटे दस्तावेज स्वीकार कर सकता है।", "बाकी दस्तावेज अपलोड स्वीकार कर सकता है।"],
  ["छूटा हुआ दस्तावेज अपलोड", "बाकी दस्तावेज अपलोड"],
];

const PUNJABI_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ["ਅਲਰਟ-ਸੇਵਾ ਮਾਈਗ੍ਰੇਸ਼ਨ", "ਅਲਰਟ ਸੇਵਾ ਦੀ ਮਾਈਗ੍ਰੇਸ਼ਨ"],
  ["ਡੈਸਕ 3 ਉੱਤੇ ਪਛਾਣ-ਪੱਤਰ ਬਦਲਣ ਦਾ ਕੰਮ ਹੋ ਸਕਦਾ ਹੈ।", "ਡੈਸਕ 3 ਉੱਤੇ ਨਵਾਂ ਪਛਾਣ-ਪੱਤਰ ਜਾਰੀ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।"],
  ["ਨਵਾਂ ਪਛਾਣ-ਪੱਤਰ ਬਣਵਾਉਣ ਦੀ ਕਾਰਵਾਈ ਡੈਸਕ 3 ਉੱਤੇ ਹੋ ਸਕਦੀ ਹੈ।", "ਨਵਾਂ ਪਛਾਣ-ਪੱਤਰ ਡੈਸਕ 3 ਤੋਂ ਜਾਰੀ ਕਰਵਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।"],
  ["ਸਰਟੀਫਿਕੇਟ ਸੇਵਾ ਵਾਲੇ ਅਰਜ਼ੀਦਾਰ", "ਸਰਟੀਫਿਕੇਟ ਨਾਲ ਜੁੜਿਆ ਕੰਮ ਕਰਵਾਉਣ ਵਾਲੇ ਅਰਜ਼ੀਦਾਰ"],
  ["ਵਿੰਡੋ 9 ਉੱਤੇ ਸਰਟੀਫਿਕੇਟ ਸੇਵਾ ਮਿਲ ਸਕਦੀ ਹੈ।", "ਵਿੰਡੋ 9 ਉੱਤੇ ਸਰਟੀਫਿਕੇਟ ਨਾਲ ਜੁੜਿਆ ਕੰਮ ਹੋ ਸਕਦਾ ਹੈ।"],
  ["ਸੋਧ ਪੋਰਟਲ ਅੱਜ ਰਾਤ 10 ਵਜੇ ਤੱਕ ਰਹਿ ਗਏ ਦਸਤਾਵੇਜ਼ ਲੈ ਸਕਦਾ ਹੈ।", "ਸੋਧ ਪੋਰਟਲ ਅੱਜ ਰਾਤ 10 ਵਜੇ ਤੱਕ ਬਾਕੀ ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ ਸਵੀਕਾਰ ਕਰ ਸਕਦਾ ਹੈ।"],
  ["ਅੱਜ ਰਹਿ ਗਿਆ ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ", "ਅੱਜ ਬਾਕੀ ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ"],
];

export type StaQl003LocalizedLifecycleV2 = Omit<StaQl003LocalizedLifecycle, "ql003HindiPunjabiStatus"> & {
  readonly ql003HindiPunjabiStatus: "REVIEW_CANDIDATE_V2";
};

export type StaQl003LocalizedQuestionV2 = Omit<StaQl003LocalizedQuestion, "lifecycle"> & {
  readonly lifecycle: StaQl003LocalizedLifecycleV2;
};

export const STA_QL003_LOCALIZATION_LIFECYCLE_V2 = {
  ...STA_QL003_LOCALIZATION_LIFECYCLE,
  ql003HindiPunjabiStatus: "REVIEW_CANDIDATE_V2",
} as const satisfies StaQl003LocalizedLifecycleV2;

export function editorializeStaQl003LocalizedText(locale: StaLocalizedLocale, value: string): string {
  let result = value;
  const replacements = locale === "hi-IN" ? HINDI_REPLACEMENTS : PUNJABI_REPLACEMENTS;
  for (const [from, to] of replacements) result = result.replaceAll(from, to);
  return result;
}

export function generateStaQl003LocalizedQuestionV2(seed: string, locale: StaLocalizedLocale): StaQl003LocalizedQuestionV2 {
  const source = generateStaQl003LocalizedQuestion(seed, locale);
  return {
    ...source,
    statement: editorializeStaQl003LocalizedText(locale, source.statement),
    candidates: source.candidates.map((candidate) => ({
      ...candidate,
      text: editorializeStaQl003LocalizedText(locale, candidate.text),
    })) as unknown as StaQl003LocalizedQuestionV2["candidates"],
    explanation: editorializeStaQl003LocalizedText(locale, source.explanation),
    lifecycle: STA_QL003_LOCALIZATION_LIFECYCLE_V2,
  };
}
