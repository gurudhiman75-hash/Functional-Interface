import {
  generateStaQl004LocalizedQuestion,
  STA_QL004_LOCALIZATION_LIFECYCLE,
  type StaQl004LocalizedLifecycle,
  type StaQl004LocalizedQuestion,
} from "./localization-ql004.ts";
import type { StaLocalizedLocale } from "./localization-types.ts";

export const STA_QL004_LOCALIZATION_EDITORIAL_VERSION = "V2_NATIVE_EDITORIAL" as const;

const HINDI_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ["हर वस्तु को पहले से तेज़ दर्ज करते हैं", "हर वस्तु को पहले से तेज़ स्कैन करते हैं"],
  ["सबसे महँगा उपकरण हैं", "सबसे महँगे उपकरण हैं"],
  ["प्रस्तावित छाया-छत", "प्रस्तावित शेड"],
  ["छाया-छत के कारण", "शेड के कारण"],
  ["छाया-छत लगने", "शेड लगने"],
  ["सेवा केंद्र को कम अपॉइंटमेंट भूलने की उम्मीद है।", "सेवा केंद्र को उम्मीद है कि कम ग्राहक अपनी अपॉइंटमेंट भूलेंगे।"],
  ["सेवा केंद्र को कम बारी छूटने की उम्मीद है।", "सेवा केंद्र को उम्मीद है कि कम लोगों की बारी छूटेगी।"],
  ["बड़े स्क्रीन", "बड़ी स्क्रीन"],
  ["बसों के आने का वास्तविक समय", "बसों के आने का ताज़ा समय"],
  ["स्थिति-जाँच कॉल", "स्थिति पूछने वाली कॉल"],
  ["हर सेवा की कतार के लिए अलग फर्श-चिह्न हैं", "हर सेवा की कतार के लिए फर्श पर अलग-अलग निशान हैं"],
  ["फर्श-चिह्न", "फर्श के निशान"],
  ["दोहरे ग्राहक रिकॉर्ड", "एक ही ग्राहक के दो रिकॉर्ड"],
  ["दोहरी ग्राहक प्रविष्टियों", "एक ही ग्राहक की दो प्रविष्टियों"],
  ["नियमित काउंटर का संबंधित भार", "नियमित काउंटर की कतार का दबाव"],
  ["नियमित काउंटर की संबंधित कतार का कुछ भार", "नियमित काउंटर की कतार का कुछ दबाव"],
  ["अधूरे दस्तावेज-सेट कम आने की उम्मीद है।", "अधूरे दस्तावेजों वाले आवेदन कम आने की उम्मीद है।"],
  ["हर अधूरा दस्तावेज-सेट", "दस्तावेजों का हर अधूरा सेट"],
  ["काउंटर-चुनने की गलती रोकनी होगी", "गलत काउंटर चुनने से रोकना होगा"],
  ["इस व्यवस्था को सबसे अच्छा तरीका मानने जैसा मूल्य-निर्णय जरूरी नहीं है।", "दावे के लिए यह मानना जरूरी नहीं कि यही भंडार संभालने का सबसे अच्छा तरीका है।"],
];

const PUNJABI_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ["ਹਰ ਚੀਜ਼ ਨੂੰ ਪਹਿਲਾਂ ਨਾਲੋਂ ਤੇਜ਼ ਦਰਜ ਕਰਦੇ ਹਨ", "ਹਰ ਚੀਜ਼ ਨੂੰ ਪਹਿਲਾਂ ਨਾਲੋਂ ਤੇਜ਼ ਸਕੈਨ ਕਰਦੇ ਹਨ"],
  ["ਸਭ ਤੋਂ ਮਹਿੰਗਾ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਹਨ", "ਸਭ ਤੋਂ ਮਹਿੰਗੇ ਉਪਕਰਣ ਹਨ"],
  ["ਸੇਵਾ ਕੇਂਦਰ ਨੂੰ ਘੱਟ ਮੁਲਾਕਾਤਾਂ ਭੁੱਲੇ ਜਾਣ ਦੀ ਉਮੀਦ ਹੈ।", "ਸੇਵਾ ਕੇਂਦਰ ਨੂੰ ਉਮੀਦ ਹੈ ਕਿ ਘੱਟ ਗਾਹਕ ਆਪਣੀ ਮੁਲਾਕਾਤ ਭੁੱਲਣਗੇ।"],
  ["ਆਪਣੀ ਵਾਰੀ ਗੁਆਉਣ ਵਾਲੇ ਲੋਕ", "ਆਪਣੀ ਵਾਰੀ ਖੁੰਝਾਉਣ ਵਾਲੇ ਲੋਕ"],
  ["ਸੇਵਾ ਕੇਂਦਰ ਨੂੰ ਘੱਟ ਵਾਰੀਆਂ ਰਹਿ ਜਾਣ ਦੀ ਉਮੀਦ ਹੈ।", "ਸੇਵਾ ਕੇਂਦਰ ਨੂੰ ਉਮੀਦ ਹੈ ਕਿ ਘੱਟ ਲੋਕਾਂ ਦੀ ਵਾਰੀ ਖੁੰਝੇਗੀ।"],
  ["ਘੱਟ ਵਾਰੀਆਂ ਰਹਿ ਜਾਣ ਦੀ ਉਮੀਦ", "ਘੱਟ ਲੋਕਾਂ ਦੀ ਵਾਰੀ ਖੁੰਝਣ ਦੀ ਉਮੀਦ"],
  ["ਹਰ ਰਹਿ ਗਈ ਵਾਰੀ", "ਹਰ ਖੁੰਝੀ ਵਾਰੀ"],
  ["ਸਾਰੇ ਲੋਕਾਂ ਦੀ ਵਾਰੀ ਰਹਿ ਜਾਂਦੀ ਹੈ", "ਸਾਰੇ ਲੋਕਾਂ ਦੀ ਵਾਰੀ ਖੁੰਝਦੀ ਹੈ"],
  ["ਉਸੇ ਧਾਰਨਾ ਬਾਰੇ", "ਉਸੇ ਵਿਸ਼ੇ ਬਾਰੇ"],
  ["ਧਾਰਨਾ ਦੀ ਗਲਤ ਸਮਝ", "ਵਿਸ਼ੇ ਬਾਰੇ ਗਲਤ ਸਮਝ"],
  ["ਬੱਸਾਂ ਦੇ ਆਉਣ ਦਾ ਮੌਜੂਦਾ ਸਮਾਂ", "ਬੱਸਾਂ ਦੇ ਆਉਣ ਦਾ ਤਾਜ਼ਾ ਸਮਾਂ"],
  ["ਆਪਣੇ-ਆਪ ਵਰਤੇ ਜਾਣ ਵਾਲੇ ਪਿਕਅਪ ਲਾਕਰ", "ਸੈਲਫ-ਸਰਵਿਸ ਪਿਕਅਪ ਲਾਕਰ"],
  ["ਸਥਿਤੀ-ਜਾਣਕਾਰੀ ਵਾਲੀਆਂ ਕਾਲਾਂ", "ਸਥਿਤੀ ਪੁੱਛਣ ਵਾਲੀਆਂ ਕਾਲਾਂ"],
  ["ਵੱਖਰੇ ਫਰਸ਼ੀ ਨਿਸ਼ਾਨ", "ਫਰਸ਼ ਉੱਤੇ ਵੱਖਰੇ ਨਿਸ਼ਾਨ"],
  ["ਦੋਹਰੇ ਗਾਹਕ ਰਿਕਾਰਡ", "ਇੱਕੋ ਗਾਹਕ ਦੇ ਦੋ ਰਿਕਾਰਡ"],
  ["ਦੋਹਰੀਆਂ ਗਾਹਕ ਐਂਟਰੀਆਂ", "ਇੱਕੋ ਗਾਹਕ ਦੀਆਂ ਦੋ ਐਂਟਰੀਆਂ"],
  ["ਨਿਯਮਤ ਕਾਊਂਟਰ ਦਾ ਸੰਬੰਧਿਤ ਭਾਰ", "ਨਿਯਮਤ ਕਾਊਂਟਰ ਦੀ ਕਤਾਰ ਦਾ ਦਬਾਅ"],
  ["ਨਿਯਮਤ ਕਾਊਂਟਰ ਦੀ ਸੰਬੰਧਿਤ ਕਤਾਰ ਦਾ ਕੁਝ ਭਾਰ", "ਨਿਯਮਤ ਕਾਊਂਟਰ ਦੀ ਕਤਾਰ ਦਾ ਕੁਝ ਦਬਾਅ"],
  ["ਅਧੂਰੇ ਦਸਤਾਵੇਜ਼-ਸੈੱਟ ਘਟਣ ਦੀ ਉਮੀਦ ਹੈ।", "ਅਧੂਰੇ ਦਸਤਾਵੇਜ਼ਾਂ ਵਾਲੀਆਂ ਅਰਜ਼ੀਆਂ ਘਟਣ ਦੀ ਉਮੀਦ ਹੈ।"],
  ["ਹਰ ਅਧੂਰਾ ਦਸਤਾਵੇਜ਼-ਸੈੱਟ", "ਦਸਤਾਵੇਜ਼ਾਂ ਦਾ ਹਰ ਅਧੂਰਾ ਸੈੱਟ"],
  ["ਇੱਕੋ ਸਰਬਵਿਆਪੀ ਕਾਰਨ", "ਇੱਕੋ ਕਾਰਨ"],
  ["ਇਸ ਵਿਵਸਥਾ ਨੂੰ ਸਭ ਤੋਂ ਵਧੀਆ ਤਰੀਕਾ ਮੰਨਣ ਵਾਲਾ ਮੁੱਲ-ਫੈਸਲਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।", "ਇਹ ਮੰਨਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਿ ਇਹ ਭੰਡਾਰ ਸੰਭਾਲਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਤਰੀਕਾ ਹੈ।"],
  ["ਕਾਊਂਟਰ ਚੁਣਨ ਵਾਲੀ ਗਲਤੀ ਰੋਕਣੀ ਪਵੇਗੀ", "ਗਲਤ ਕਾਊਂਟਰ ਚੁਣਨ ਤੋਂ ਰੋਕਣਾ ਪਵੇਗਾ"],
];

export type StaQl004LocalizedLifecycleV2 = Omit<StaQl004LocalizedLifecycle, "ql004HindiPunjabiStatus"> & {
  readonly ql004HindiPunjabiStatus: "REVIEW_CANDIDATE_V2";
};

export type StaQl004LocalizedQuestionV2 = Omit<StaQl004LocalizedQuestion, "lifecycle"> & {
  readonly lifecycle: StaQl004LocalizedLifecycleV2;
};

export const STA_QL004_LOCALIZATION_LIFECYCLE_V2 = {
  ...STA_QL004_LOCALIZATION_LIFECYCLE,
  ql004HindiPunjabiStatus: "REVIEW_CANDIDATE_V2",
} as const satisfies StaQl004LocalizedLifecycleV2;

export function editorializeStaQl004LocalizedText(locale: StaLocalizedLocale, value: string): string {
  let result = value;
  const replacements = locale === "hi-IN" ? HINDI_REPLACEMENTS : PUNJABI_REPLACEMENTS;
  for (const [from, to] of replacements) result = result.replaceAll(from, to);
  return result;
}

export function generateStaQl004LocalizedQuestionV2(seed: string, locale: StaLocalizedLocale): StaQl004LocalizedQuestionV2 {
  const source = generateStaQl004LocalizedQuestion(seed, locale);
  return {
    ...source,
    statement: editorializeStaQl004LocalizedText(locale, source.statement),
    candidates: source.candidates.map((candidate) => ({
      ...candidate,
      text: editorializeStaQl004LocalizedText(locale, candidate.text),
    })) as unknown as StaQl004LocalizedQuestionV2["candidates"],
    explanation: editorializeStaQl004LocalizedText(locale, source.explanation),
    lifecycle: STA_QL004_LOCALIZATION_LIFECYCLE_V2,
  };
}
