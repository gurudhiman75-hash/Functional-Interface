import type { AuditCaselet, AuditChild, AuditOption } from "../saturation/corpus.ts";
import { SEA001_LOCALIZATION_AUTHORITY, SEA001_LOCALIZATION_HUMAN_REVIEW_BLOCKER, type Sea001TranslatedLocale, sea001CanonicalParityFingerprint } from "./readiness.ts";
import { localizeSea001Names } from "./name-pack.ts";

export type Sea001LocalizedReviewCaselet = AuditCaselet & {
  readonly locale: Sea001TranslatedLocale;
  readonly canonicalLocale: "en-IN";
  readonly canonicalCaseletId: string;
  readonly canonicalParityFingerprint: string;
  readonly localizationAuthority: typeof SEA001_LOCALIZATION_AUTHORITY;
  readonly localizationStatus: "EXECUTABLE_REVIEW_REQUIRED";
  readonly humanLanguageReviewRequired: true;
  readonly activeEditorialBlockers: readonly [typeof SEA001_LOCALIZATION_HUMAN_REVIEW_BLOCKER];
  readonly productDeliveryUnlocked: false;
  readonly productionStagingApproved: false;
};

type Pair = readonly [en: string, hi: string, pa: string];

const ORDINALS: Readonly<Record<string, readonly [string, string]>> = Object.freeze({
  first: ["पहला", "ਪਹਿਲਾ"],
  second: ["दूसरा", "ਦੂਜਾ"],
  third: ["तीसरा", "ਤੀਜਾ"],
  fourth: ["चौथा", "ਚੌਥਾ"],
  fifth: ["पाँचवाँ", "ਪੰਜਵਾਂ"],
  sixth: ["छठा", "ਛੇਵਾਂ"],
  seventh: ["सातवाँ", "ਸੱਤਵਾਂ"],
  eighth: ["आठवाँ", "ਅੱਠਵਾਂ"],
  ninth: ["नौवाँ", "ਨੌਵਾਂ"],
  tenth: ["दसवाँ", "ਦਸਵਾਂ"],
});

const ORDINAL_NUMBERS: Readonly<Record<string, readonly [string, string]>> = Object.freeze({
  "1st": ORDINALS.first!,
  "2nd": ORDINALS.second!,
  "3rd": ORDINALS.third!,
  "4th": ORDINALS.fourth!,
  "5th": ORDINALS.fifth!,
  "6th": ORDINALS.sixth!,
  "7th": ORDINALS.seventh!,
  "8th": ORDINALS.eighth!,
  "9th": ORDINALS.ninth!,
  "10th": ORDINALS.tenth!,
});

const CARDINAL_WORDS: Readonly<Record<string, string>> = Object.freeze({
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
});

const PHRASES: readonly Pair[] = [
  ["They are not necessarily seated in the same order as listed.", "उनका बैठने का क्रम सूची में दिए क्रम जैसा होना जरूरी नहीं है।", "ਉਹ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਿ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਹੀ ਬੈਠੇ ਹੋਣ।"],
  ["are sitting around a circular table. Some face the centre and the others face outward.", "एक गोल मेज के चारों ओर बैठे हैं। कुछ केंद्र की ओर और बाकी बाहर की ओर मुख किए हैं।", "ਗੋਲ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਬੈਠੇ ਹਨ। ਕੁਝ ਕੇਂਦਰ ਵੱਲ ਅਤੇ ਬਾਕੀ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।"],
  ["are sitting in a straight row. Some face north and the others face south.", "एक सीधी पंक्ति में बैठे हैं। कुछ उत्तर और बाकी दक्षिण की ओर मुख किए हैं।", "ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ। ਕੁਝ ਉੱਤਰ ਅਤੇ ਬਾਕੀ ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।"],
  ["are sitting in a straight row, all facing north.", "एक सीधी पंक्ति में बैठे हैं और सभी उत्तर की ओर मुख किए हैं।", "ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ ਅਤੇ ਸਭ ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।"],
  ["are sitting in a straight row, all facing south.", "एक सीधी पंक्ति में बैठे हैं और सभी दक्षिण की ओर मुख किए हैं।", "ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ ਅਤੇ ਸਭ ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।"],
  ["are sitting around a circular table, facing the centre, but not necessarily in the same order.", "एक गोल मेज के चारों ओर केंद्र की ओर मुख करके बैठे हैं, लेकिन उनका क्रम दिया हुआ क्रम होना जरूरी नहीं है।", "ਗੋਲ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ, ਪਰ ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਦਿੱਤੇ ਕ੍ਰਮ ਵਰਗਾ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।"],
  ["are sitting around a circular table, facing outward, but not necessarily in the same order.", "एक गोल मेज के चारों ओर बाहर की ओर मुख करके बैठे हैं, लेकिन उनका क्रम दिया हुआ क्रम होना जरूरी नहीं है।", "ਗੋਲ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ, ਪਰ ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਦਿੱਤੇ ਕ੍ਰਮ ਵਰਗਾ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।"],
  ["A door is shown at the top of the diagram.", "चित्र के ऊपर एक दरवाज़ा दिखाया गया है।", "ਚਿੱਤਰ ਦੇ ਉੱਪਰ ਇੱਕ ਦਰਵਾਜ਼ਾ ਦਿਖਾਇਆ ਗਿਆ ਹੈ।"],
  ["An entrance is shown at the top of the diagram.", "चित्र के ऊपर एक प्रवेश-द्वार दिखाया गया है।", "ਚਿੱਤਰ ਦੇ ਉੱਪਰ ਇੱਕ ਪ੍ਰਵੇਸ਼-ਦੁਆਰ ਦਿਖਾਇਆ ਗਿਆ ਹੈ।"],
  ["A stage is shown at the top of the diagram.", "चित्र के ऊपर एक मंच दिखाया गया है।", "ਚਿੱਤਰ ਦੇ ਉੱਪਰ ਇੱਕ ਮੰਚ ਦਿਖਾਇਆ ਗਿਆ ਹੈ।"],

  ["Put anyone anywhere to start your circle.", "गोल व्यवस्था शुरू करने के लिए किसी एक व्यक्ति को कहीं भी रख लें।", "ਗੋਲ ਬੈਠਕ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਿਸੇ ਇੱਕ ਵਿਅਕਤੀ ਨੂੰ ਕਿਤੇ ਵੀ ਰੱਖ ਲਵੋ।"],
  ["Turning the whole circle does not make a new answer.", "पूरे गोल को घुमाने से नई व्यवस्था नहीं बनती।", "ਪੂਰੇ ਗੋਲ ਨੂੰ ਘੁਮਾਉਣ ਨਾਲ ਨਵੀਂ ਵਿਵਸਥਾ ਨਹੀਂ ਬਣਦੀ।"],
  ["Start the circle from this fixed seat.", "गोल व्यवस्था इस तय सीट से शुरू करें।", "ਗੋਲ ਬੈਠਕ ਇਸ ਨਿਰਧਾਰਤ ਸੀਟ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।"],
  ["Start the circle from the seat shown nearest the door.", "गोल व्यवस्था दरवाज़े के सबसे पास दिखाई गई सीट से शुरू करें।", "ਗੋਲ ਬੈਠਕ ਦਰਵਾਜ਼ੇ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਦਿਖਾਈ ਸੀਟ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।"],
  ["Start the circle from the seat shown nearest the entrance.", "गोल व्यवस्था प्रवेश-द्वार के सबसे पास दिखाई गई सीट से शुरू करें।", "ਗੋਲ ਬੈਠਕ ਪ੍ਰਵੇਸ਼-ਦੁਆਰ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਦਿਖਾਈ ਸੀਟ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।"],
  ["Start the circle from the seat shown nearest the stage.", "गोल व्यवस्था मंच के सबसे पास दिखाई गई सीट से शुरू करें।", "ਗੋਲ ਬੈਠਕ ਮੰਚ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਦਿਖਾਈ ਸੀਟ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।"],
  ["Everyone faces the centre.", "सभी केंद्र की ओर मुख किए हैं।", "ਸਭ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।"],
  ["Everyone faces outward.", "सभी बाहर की ओर मुख किए हैं।", "ਸਭ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।"],
  ["Everyone faces north.", "सभी उत्तर की ओर मुख किए हैं।", "ਸਭ ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।"],
  ["Everyone faces south.", "सभी दक्षिण की ओर मुख किए हैं।", "ਸਭ ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।"],
  ["Not everyone faces the same way.", "सभी एक ही दिशा में मुख नहीं किए हैं।", "ਸਭ ਇੱਕੋ ਦਿਸ਼ਾ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਨਹੀਂ ਬੈਠੇ ਹਨ।"],
  ["So left means clockwise and right means anticlockwise.", "इसलिए बायाँ = घड़ी की दिशा और दायाँ = घड़ी की विपरीत दिशा।", "ਇਸ ਲਈ ਖੱਬਾ = ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਅਤੇ ਸੱਜਾ = ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ।"],
  ["So left means anticlockwise and right means clockwise.", "इसलिए बायाँ = घड़ी की विपरीत दिशा और दायाँ = घड़ी की दिशा।", "ਇਸ ਲਈ ਖੱਬਾ = ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਅਤੇ ਸੱਜਾ = ਘੜੀ ਦੀ ਦਿਸ਼ਾ।"],
  ["If the person faces the centre, left means clockwise.", "यदि व्यक्ति केंद्र की ओर मुख किए है, तो उसका बायाँ घड़ी की दिशा में होगा।", "ਜੇ ਵਿਅਕਤੀ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠਾ ਹੈ, ਤਾਂ ਉਸਦਾ ਖੱਬਾ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੋਵੇਗਾ।"],
  ["If the person faces outward, left means anticlockwise.", "यदि व्यक्ति बाहर की ओर मुख किए है, तो उसका बायाँ घड़ी की विपरीत दिशा में होगा।", "ਜੇ ਵਿਅਕਤੀ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠਾ ਹੈ, ਤਾਂ ਉਸਦਾ ਖੱਬਾ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੋਵੇਗਾ।"],
  ["If that person faces north, left is our left.", "यदि वह व्यक्ति उत्तर की ओर मुख किए है, तो उसका बायाँ हमारी बाईं ओर होगा।", "ਜੇ ਉਹ ਵਿਅਕਤੀ ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠਾ ਹੈ, ਤਾਂ ਉਸਦਾ ਖੱਬਾ ਸਾਡੀ ਖੱਬੀ ਪਾਸੇ ਹੋਵੇਗਾ।"],
  ["If that person faces south, left is our right.", "यदि वह व्यक्ति दक्षिण की ओर मुख किए है, तो उसका बायाँ हमारी दाईं ओर होगा।", "ਜੇ ਉਹ ਵਿਅਕਤੀ ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠਾ ਹੈ, ਤਾਂ ਉਸਦਾ ਖੱਬਾ ਸਾਡੀ ਸੱਜੀ ਪਾਸੇ ਹੋਵੇਗਾ।"],
  ["For every left/right clue, first see whether that person faces the centre or outward.", "हर बायाँ/दायाँ वाले संकेत में पहले देखें कि संबंधित व्यक्ति केंद्र की ओर है या बाहर की ओर।", "ਹਰ ਖੱਬੇ/ਸੱਜੇ ਵਾਲੇ ਸੰਕੇਤ ਵਿੱਚ ਪਹਿਲਾਂ ਵੇਖੋ ਕਿ ਸੰਬੰਧਿਤ ਵਿਅਕਤੀ ਕੇਂਦਰ ਵੱਲ ਹੈ ਜਾਂ ਬਾਹਰ ਵੱਲ।"],
  ["For a left/right clue, first see which way the person after 'of' is facing.", "बायाँ/दायाँ वाले संकेत में पहले उस व्यक्ति की दिशा देखें जिसके संदर्भ में स्थान पूछा गया है।", "ਖੱਬੇ/ਸੱਜੇ ਵਾਲੇ ਸੰਕੇਤ ਵਿੱਚ ਪਹਿਲਾਂ ਉਸ ਵਿਅਕਤੀ ਦੀ ਦਿਸ਼ਾ ਵੇਖੋ ਜਿਸਦੇ ਸਬੰਧ ਵਿੱਚ ਸਥਾਨ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
  ["For an if/otherwise clue, do not guess.", "यदि/अन्यथा वाले संकेत में अनुमान न लगाएँ।", "ਜੇ/ਨਹੀਂ ਤਾਂ ਵਾਲੇ ਸੰਕੇਤ ਵਿੱਚ ਅਨੁਮਾਨ ਨਾ ਲਗਾਓ।"],
  ["Keep both possibilities until another clue tells us which one is true.", "दोनों संभावनाएँ रखें; अगला संकेत बताएगा कौन-सी सही है।", "ਦੋਵੇਂ ਸੰਭਾਵਨਾਵਾਂ ਰੱਖੋ; ਅਗਲਾ ਸੰਕੇਤ ਦੱਸੇਗਾ ਕਿਹੜੀ ਸਹੀ ਹੈ।"],
  ["If two or three ways are possible, keep them for a moment.", "यदि 2 या 3 व्यवस्थाएँ संभव हों, तो उन्हें कुछ समय के लिए रखें।", "ਜੇ 2 ਜਾਂ 3 ਵਿਵਸਥਾਵਾਂ ਸੰਭਵ ਹੋਣ, ਤਾਂ ਉਨ੍ਹਾਂ ਨੂੰ ਕੁਝ ਸਮੇਂ ਲਈ ਰੱਖੋ।"],
  ["If two or three places are possible, keep them for a moment.", "यदि 2 या 3 स्थान संभव हों, तो उन्हें कुछ समय के लिए रखें।", "ਜੇ 2 ਜਾਂ 3 ਥਾਵਾਂ ਸੰਭਵ ਹੋਣ, ਤਾਂ ਉਨ੍ਹਾਂ ਨੂੰ ਕੁਝ ਸਮੇਂ ਲਈ ਰੱਖੋ।"],
  ["A later clue will show which one is correct.", "आगे का संकेत बताएगा कि कौन-सी व्यवस्था सही है।", "ਅੱਗੇ ਵਾਲਾ ਸੰਕੇਤ ਦੱਸੇਗਾ ਕਿ ਕਿਹੜੀ ਵਿਵਸਥਾ ਸਹੀ ਹੈ।"],
  ["A later clue will decide the correct one.", "आगे का संकेत सही संभावना तय करेगा।", "ਅੱਗੇ ਵਾਲਾ ਸੰਕੇਤ ਸਹੀ ਸੰਭਾਵਨਾ ਤੈਅ ਕਰੇਗਾ।"],
  ["As soon as a later clue does not fit one case, cross that case out.", "जैसे ही कोई आगे का संकेत किसी स्थिति में न बैठे, उस स्थिति को काट दें।", "ਜਿਵੇਂ ਹੀ ਅੱਗੇ ਵਾਲਾ ਕੋਈ ਸੰਕੇਤ ਕਿਸੇ ਸਥਿਤੀ ਨਾਲ ਨਾ ਮਿਲੇ, ਉਸ ਸਥਿਤੀ ਨੂੰ ਕੱਟ ਦਿਓ।"],
  ["After all the clues are used, only one arrangement fits.", "सभी संकेत लगाने के बाद केवल एक व्यवस्था सही बचती है।", "ਸਾਰੇ ਸੰਕੇਤ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਸਿਰਫ਼ ਇੱਕ ਵਿਵਸਥਾ ਸਹੀ ਬਚਦੀ ਹੈ।"],
  ["Keep it and fill the empty seats.", "इसे रखें और खाली सीटें भरें।", "ਇਸਨੂੰ ਰੱਖੋ ਅਤੇ ਖਾਲੀ ਸੀਟਾਂ ਭਰੋ।"],
  ["Keep those seats and fill the blanks.", "इन सीटों को तय रखें और बाकी खाली स्थान भरें।", "ਇਨ੍ਹਾਂ ਸੀਟਾਂ ਨੂੰ ਪੱਕਾ ਰੱਖੋ ਅਤੇ ਬਾਕੀ ਖਾਲੀ ਥਾਵਾਂ ਭਰੋ।"],
  ["Keep marking seats as you fill them.", "सीटें भरते समय उन्हें चिन्हित करते जाएँ।", "ਸੀਟਾਂ ਭਰਦੇ ਸਮੇਂ ਉਨ੍ਹਾਂ ਨੂੰ ਨਿਸ਼ਾਨ ਲਗਾਉਂਦੇ ਜਾਓ।"],
  ["Keep marking the seats as you fill them.", "सीटें भरते समय उन्हें चिन्हित करते जाएँ।", "ਸੀਟਾਂ ਭਰਦੇ ਸਮੇਂ ਉਨ੍ਹਾਂ ਨੂੰ ਨਿਸ਼ਾਨ ਲਗਾਉਂਦੇ ਜਾਓ।"],
  ["If only one seat is left for someone, put that person there.", "यदि किसी व्यक्ति के लिए केवल एक सीट बची है, तो उसे वहीं रखें।", "ਜੇ ਕਿਸੇ ਵਿਅਕਤੀ ਲਈ ਸਿਰਫ਼ ਇੱਕ ਸੀਟ ਬਚਦੀ ਹੈ, ਤਾਂ ਉਸਨੂੰ ਉੱਥੇ ਰੱਖੋ।"],
  ["Now take the clues one by one:", "अब संकेत एक-एक करके लगाएँ:", "ਹੁਣ ਸੰਕੇਤ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਲਗਾਓ:"],
  ["Now fill the empty seats:", "अब खाली सीटें भरें:", "ਹੁਣ ਖਾਲੀ ਸੀਟਾਂ ਭਰੋ:"],
  ["Now fill the rest of the row:", "अब पंक्ति की बाकी सीटें भरें:", "ਹੁਣ ਕਤਾਰ ਦੀਆਂ ਬਾਕੀ ਸੀਟਾਂ ਭਰੋ:"],
  ["So the final row is:", "अंतिम पंक्ति:", "ਅੰਤਿਮ ਕਤਾਰ:"],
  ["So the final circle is:", "अंतिम गोल व्यवस्था:", "ਅੰਤਿਮ ਗੋਲ ਵਿਵਸਥਾ:"],
  ["So the final clockwise order is:", "अंतिम घड़ी-दिशा क्रम:", "ਅੰਤਿਮ ਘੜੀ-ਦਿਸ਼ਾ ਕ੍ਰਮ:"],
  ["Only Case", "केवल स्थिति", "ਸਿਰਫ਼ ਸਥਿਤੀ"],
  ["Case", "स्थिति", "ਸਥਿਤੀ"],
  ["Clue", "संकेत", "ਸੰਕੇਤ"],
  ["Step", "चरण", "ਕਦਮ"],
  ["Person:", "व्यक्ति:", "ਵਿਅਕਤੀ:"],
  ["Seat:", "सीट:", "ਸੀਟ:"],
  ["Facing:", "मुख-दिशा:", "ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ:"],

  ["All persons face the centre, so left means clockwise.", "सभी केंद्र की ओर मुख किए हैं, इसलिए बायाँ घड़ी की दिशा में होगा।", "ਸਭ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ, ਇਸ ਲਈ ਖੱਬਾ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੋਵੇਗਾ।"],
  ["Everyone faces outward, so left means anticlockwise.", "सभी बाहर की ओर मुख किए हैं, इसलिए बायाँ घड़ी की विपरीत दिशा में होगा।", "ਸਭ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ, ਇਸ ਲਈ ਖੱਬਾ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੋਵੇਗਾ।"],
  ["For neighbours, facing does not matter.", "पड़ोसी सीटों के लिए मुख-दिशा से फर्क नहीं पड़ता।", "ਨਾਲ ਵਾਲੀਆਂ ਸੀਟਾਂ ਲਈ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਨਾਲ ਫਰਕ ਨਹੀਂ ਪੈਂਦਾ।"],
  ["The question already says clockwise, so facing does not matter here.", "प्रश्न में घड़ी की दिशा पहले से दी है, इसलिए यहाँ मुख-दिशा से फर्क नहीं पड़ता।", "ਸਵਾਲ ਵਿੱਚ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਪਹਿਲਾਂ ਹੀ ਦਿੱਤੀ ਹੈ, ਇਸ ਲਈ ਇੱਥੇ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਨਾਲ ਫਰਕ ਨਹੀਂ ਪੈਂਦਾ।"],
  ["Count only the people in between", "केवल बीच के लोगों को गिनें", "ਸਿਰਫ਼ ਵਿਚਕਾਰਲੇ ਲੋਕਾਂ ਨੂੰ ਗਿਣੋ"],
  ["Count only the seats between", "केवल बीच की सीटें गिनें", "ਸਿਰਫ਼ ਵਿਚਕਾਰਲੀਆਂ ਸੀਟਾਂ ਗਿਣੋ"],
  ["Count only the seats asked for", "केवल पूछी गई सीटें गिनें", "ਸਿਰਫ਼ ਪੁੱਛੀਆਂ ਗਈਆਂ ਸੀਟਾਂ ਗਿਣੋ"],
  ["Counting clockwise", "घड़ी की दिशा में गिनने पर", "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਗਿਣਣ 'ਤੇ"],
  ["Moving two seats clockwise", "घड़ी की दिशा में 2 सीट आगे जाने पर", "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ 2 ਸੀਟਾਂ ਅੱਗੇ ਜਾਣ 'ਤੇ"],
  ["Moving two seats anticlockwise", "घड़ी की विपरीत दिशा में 2 सीट आगे जाने पर", "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ 2 ਸੀਟਾਂ ਅੱਗੇ ਜਾਣ 'ਤੇ"],
  ["Moving two seats in that direction", "उस दिशा में 2 सीट आगे जाने पर", "ਉਸ ਦਿਸ਼ਾ ਵਿੱਚ 2 ਸੀਟਾਂ ਅੱਗੇ ਜਾਣ 'ਤੇ"],
  ["Start from", "से शुरू करें", "ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ"],
  ["You reach", "आप पहुँचते हैं", "ਤੁਸੀਂ ਪਹੁੰਚਦੇ ਹੋ"],
  ["reaches", "पर पहुँचते हैं", "'ਤੇ ਪਹੁੰਚਦੇ ਹੋ"],
  ["where", "जहाँ", "ਜਿੱਥੇ"],
  ["is seated", "बैठा/बैठी है", "ਬੈਠਾ/ਬੈਠੀ ਹੈ"],
  ["sits there", "वहीं बैठा/बैठी है", "ਉੱਥੇ ਹੀ ਬੈਠਾ/ਬੈਠੀ ਹੈ"],
  ["sits nearby, but not in the seat asked about.", "पास बैठा/बैठी है, लेकिन पूछी गई सीट पर नहीं।", "ਨੇੜੇ ਬੈਠਾ/ਬੈਠੀ ਹੈ, ਪਰ ਪੁੱਛੀ ਗਈ ਸੀਟ 'ਤੇ ਨਹੀਂ।"],

  ["This moves one seat too far.", "यह 1 सीट ज़्यादा आगे चला जाता है।", "ਇਹ 1 ਸੀਟ ਜ਼ਿਆਦਾ ਅੱਗੇ ਚਲਾ ਜਾਂਦਾ ਹੈ।"],
  ["This stops one seat early.", "यह 1 सीट पहले रुक जाता है।", "ਇਹ 1 ਸੀਟ ਪਹਿਲਾਂ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  ["This stops after one seat.", "यह केवल 1 सीट बाद रुक जाता है।", "ਇਹ ਸਿਰਫ਼ 1 ਸੀਟ ਬਾਅਦ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  ["This stops one seat too early.", "यह 1 सीट बहुत जल्दी रुक जाता है।", "ਇਹ 1 ਸੀਟ ਬਹੁਤ ਜਲਦੀ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  ["This stops after the immediate seat.", "यह ठीक अगली सीट पर ही रुक जाता है।", "ਇਹ ਬਿਲਕੁਲ ਅਗਲੀ ਸੀਟ 'ਤੇ ਹੀ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  ["This wrongly counts the person named in the question.", "यह प्रश्न में दिए व्यक्ति को भी गलत तरीके से गिन लेता है।", "ਇਹ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੇ ਵਿਅਕਤੀ ਨੂੰ ਵੀ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਗਿਣ ਲੈਂਦਾ ਹੈ।"],
  ["This wrongly counts one of the named people.", "यह दिए गए लोगों में से एक को भी गलत तरीके से गिन लेता है।", "ਇਹ ਦਿੱਤੇ ਲੋਕਾਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਵੀ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਗਿਣ ਲੈਂਦਾ ਹੈ।"],
  ["This wrongly counts both named people.", "यह दोनों दिए गए व्यक्तियों को भी गलत तरीके से गिन लेता है।", "ਇਹ ਦੋਵੇਂ ਦਿੱਤੇ ਵਿਅਕਤੀਆਂ ਨੂੰ ਵੀ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਗਿਣ ਲੈਂਦਾ ਹੈ।"],
  ["This counts both named named person as well as the persons between them.", "यह दोनों दिए व्यक्तियों के साथ बीच के लोगों को भी गिनता है।", "ਇਹ ਦੋਵੇਂ ਦਿੱਤੇ ਵਿਅਕਤੀਆਂ ਦੇ ਨਾਲ ਵਿਚਕਾਰਲੇ ਲੋਕਾਂ ਨੂੰ ਵੀ ਗਿਣਦਾ ਹੈ।"],
  ["This includes both named persons.", "यह दोनों दिए व्यक्तियों को शामिल कर लेता है।", "ਇਹ ਦੋਵੇਂ ਦਿੱਤੇ ਵਿਅਕਤੀਆਂ ਨੂੰ ਸ਼ਾਮਲ ਕਰ ਲੈਂਦਾ ਹੈ।"],
  ["This includes the person named in the question.", "यह प्रश्न में दिए व्यक्ति को भी शामिल कर लेता है।", "ਇਹ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੇ ਵਿਅਕਤੀ ਨੂੰ ਵੀ ਸ਼ਾਮਲ ਕਰ ਲੈਂਦਾ ਹੈ।"],
  ["This selects the other neighbour.", "यह दूसरे पड़ोसी को चुनता है।", "ਇਹ ਦੂਜੇ ਨਾਲ ਬੈਠੇ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਦਾ ਹੈ।"],
  ["This selects a neighbour.", "यह पड़ोसी व्यक्ति को चुनता है।", "ਇਹ ਨਾਲ ਬੈਠੇ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਦਾ ਹੈ।"],
  ["This selects the immediate left person instead.", "यह इसके बजाय ठीक बाईं ओर वाले व्यक्ति को चुनता है।", "ਇਹ ਇਸਦੀ ਬਜਾਏ ਬਿਲਕੁਲ ਖੱਬੇ ਪਾਸੇ ਵਾਲੇ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਦਾ ਹੈ।"],
  ["A person cannot be their own neighbour.", "कोई व्यक्ति स्वयं अपना पड़ोसी नहीं हो सकता।", "ਕੋਈ ਵਿਅਕਤੀ ਆਪਣਾ ਆਪ ਗੁਆਂਢੀ ਨਹੀਂ ਹੋ ਸਕਦਾ।"],
  ["Both persons were selected from the same side.", "दोनों व्यक्ति एक ही ओर से चुन लिए गए हैं।", "ਦੋਵੇਂ ਵਿਅਕਤੀ ਇੱਕੋ ਪਾਸੇ ਤੋਂ ਚੁਣ ਲਏ ਗਏ ਹਨ।"],
  ["Both persons were selected from one side.", "दोनों व्यक्ति एक ही ओर से चुन लिए गए हैं।", "ਦੋਵੇਂ ਵਿਅਕਤੀ ਇੱਕੋ ਪਾਸੇ ਤੋਂ ਚੁਣ ਲਏ ਗਏ ਹਨ।"],
  ["Both persons were selected from the clockwise side.", "दोनों व्यक्ति घड़ी की दिशा वाली ओर से चुन लिए गए हैं।", "ਦੋਵੇਂ ਵਿਅਕਤੀ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਾਲੇ ਪਾਸੇ ਤੋਂ ਚੁਣ ਲਏ ਗਏ ਹਨ।"],
  ["Both persons were selected from the anticlockwise side.", "दोनों व्यक्ति घड़ी की विपरीत दिशा वाली ओर से चुन लिए गए हैं।", "ਦੋਵੇਂ ਵਿਅਕਤੀ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਾਲੇ ਪਾਸੇ ਤੋਂ ਚੁਣ ਲਏ ਗਏ ਹਨ।"],
  ["This counts in the other direction around the circle.", "यह गोल में उलटी दिशा में गिनता है।", "ਇਹ ਗੋਲ ਵਿੱਚ ਉਲਟੀ ਦਿਸ਼ਾ ਵੱਲ ਗਿਣਦਾ ਹੈ।"],
  ["This goes the wrong way around the circle.", "यह गोल में गलत दिशा में जाता है।", "ਇਹ ਗੋਲ ਵਿੱਚ ਗਲਤ ਦਿਸ਼ਾ ਵੱਲ ਜਾਂਦਾ ਹੈ।"],
  ["This reverses left and right for that person's facing.", "यह उस व्यक्ति की मुख-दिशा के अनुसार बायाँ और दायाँ उलट देता है।", "ਇਹ ਉਸ ਵਿਅਕਤੀ ਦੇ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਖੱਬਾ ਅਤੇ ਸੱਜਾ ਉਲਟ ਕਰ ਦਿੰਦਾ ਹੈ।"],
  ["This uses the wrong facing for", "यह गलत मुख-दिशा मानता है:", "ਇਹ ਗਲਤ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਮੰਨਦਾ ਹੈ:"],
  ["This treats", "यह", "ਇਹ"],
  ["as facing outward instead of the centre.", "को केंद्र की जगह बाहर की ओर मान लेता है।", "ਨੂੰ ਕੇਂਦਰ ਦੀ ਥਾਂ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਮੰਨ ਲੈਂਦਾ ਹੈ।"],
  ["as facing the centre instead of outward.", "को बाहर की जगह केंद्र की ओर मान लेता है।", "ਨੂੰ ਬਾਹਰ ਦੀ ਥਾਂ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਮੰਨ ਲੈਂਦਾ ਹੈ।"],
  ["This keeps", "यह", "ਇਹ"],
  ["original facing instead of changing it.", "की पुरानी मुख-दिशा ही रखता है, बदलता नहीं।", "ਦੀ ਪੁਰਾਣੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਹੀ ਰੱਖਦਾ ਹੈ, ਬਦਲਦਾ ਨਹੀਂ।"],
  ["This moves two seats rather than one.", "यह 1 की जगह 2 सीट चलता है।", "ਇਹ 1 ਦੀ ਥਾਂ 2 ਸੀਟਾਂ ਚਲਦਾ ਹੈ।"],
  ["This stops at the immediate right instead of moving two seats.", "यह 2 सीट जाने के बजाय ठीक दाईं सीट पर रुक जाता है।", "ਇਹ 2 ਸੀਟਾਂ ਜਾਣ ਦੀ ਬਜਾਏ ਬਿਲਕੁਲ ਸੱਜੀ ਸੀਟ 'ਤੇ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  ["This stops after one seat instead of two.", "यह 2 की जगह 1 सीट बाद रुक जाता है।", "ਇਹ 2 ਦੀ ਥਾਂ 1 ਸੀਟ ਬਾਅਦ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  ["This skips the immediate clockwise person.", "यह घड़ी की दिशा में ठीक अगले व्यक्ति को छोड़ देता है।", "ਇਹ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਬਿਲਕੁਲ ਅਗਲੇ ਵਿਅਕਤੀ ਨੂੰ ਛੱਡ ਦਿੰਦਾ ਹੈ।"],
  ["This skips the immediate neighbour on the other side.", "यह दूसरी ओर के ठीक पड़ोसी को छोड़ देता है।", "ਇਹ ਦੂਜੇ ਪਾਸੇ ਦੇ ਬਿਲਕੁਲ ਨਾਲ ਬੈਠੇ ਵਿਅਕਤੀ ਨੂੰ ਛੱਡ ਦਿੰਦਾ ਹੈ।"],
  ["This skips the person sitting immediately next to them on one side.", "यह एक ओर ठीक साथ बैठे व्यक्ति को छोड़ देता है।", "ਇਹ ਇੱਕ ਪਾਸੇ ਬਿਲਕੁਲ ਨਾਲ ਬੈਠੇ ਵਿਅਕਤੀ ਨੂੰ ਛੱਡ ਦਿੰਦਾ ਹੈ।"],
  ["This skips both immediate seats.", "यह दोनों ठीक पास वाली सीटें छोड़ देता है।", "ਇਹ ਦੋਵੇਂ ਬਿਲਕੁਲ ਨਾਲ ਵਾਲੀਆਂ ਸੀਟਾਂ ਛੱਡ ਦਿੰਦਾ ਹੈ।"],
  ["This moves anticlockwise instead of clockwise.", "यह घड़ी की दिशा की जगह घड़ी की विपरीत दिशा में चलता है।", "ਇਹ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਦੀ ਥਾਂ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਚਲਦਾ ਹੈ।"],
  ["This moves one seat beyond the opposite seat.", "यह सामने वाली सीट से 1 सीट आगे चला जाता है।", "ਇਹ ਸਾਹਮਣੇ ਵਾਲੀ ਸੀਟ ਤੋਂ 1 ਸੀਟ ਅੱਗੇ ਚਲਾ ਜਾਂਦਾ ਹੈ।"],
  ["This moves one seat beyond the opposite position.", "यह सामने वाले स्थान से 1 सीट आगे चला जाता है।", "ਇਹ ਸਾਹਮਣੇ ਵਾਲੀ ਥਾਂ ਤੋਂ 1 ਸੀਟ ਅੱਗੇ ਚਲਾ ਜਾਂਦਾ ਹੈ।"],
  ["This chooses the person at the opposite end of the row.", "यह पंक्ति के दूसरे छोर वाले व्यक्ति को चुनता है।", "ਇਹ ਕਤਾਰ ਦੇ ਦੂਜੇ ਸਿਰੇ ਵਾਲੇ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਦਾ ਹੈ।"],
  ["This chooses the occupant one seat away from the left end.", "यह बाएँ छोर से 1 सीट दूर बैठे व्यक्ति को चुनता है।", "ਇਹ ਖੱਬੇ ਸਿਰੇ ਤੋਂ 1 ਸੀਟ ਦੂਰ ਬੈਠੇ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਦਾ ਹੈ।"],
  ["This moves away from the requested end before reading the occupant.", "यह पूछे गए छोर से दूर जाकर व्यक्ति पढ़ता है।", "ਇਹ ਪੁੱਛੇ ਗਏ ਸਿਰੇ ਤੋਂ ਦੂਰ ਜਾ ਕੇ ਵਿਅਕਤੀ ਪੜ੍ਹਦਾ ਹੈ।"],
  ["This gives the wrong seat number.", "यह गलत सीट संख्या देता है।", "ਇਹ ਗਲਤ ਸੀਟ ਨੰਬਰ ਦਿੰਦਾ ਹੈ।"],
  ["This is one more than the number of intervening persons.", "यह बीच के लोगों की सही संख्या से 1 अधिक है।", "ਇਹ ਵਿਚਕਾਰਲੇ ਲੋਕਾਂ ਦੀ ਸਹੀ ਗਿਣਤੀ ਤੋਂ 1 ਵੱਧ ਹੈ।"],
  ["This is one less than the number of intervening persons.", "यह बीच के लोगों की सही संख्या से 1 कम है।", "ਇਹ ਵਿਚਕਾਰਲੇ ਲੋਕਾਂ ਦੀ ਸਹੀ ਗਿਣਤੀ ਤੋਂ 1 ਘੱਟ ਹੈ।"],
  ["This misses one person between the named person.", "यह बीच के 1 व्यक्ति को छोड़ देता है।", "ਇਹ ਵਿਚਕਾਰਲੇ 1 ਵਿਅਕਤੀ ਨੂੰ ਛੱਡ ਦਿੰਦਾ ਹੈ।"],
  ["The two extreme ends of a straight row are not adjacent to each other.", "सीधी पंक्ति के दोनों अंतिम छोर एक-दूसरे के पड़ोसी नहीं होते।", "ਸਿੱਧੀ ਕਤਾਰ ਦੇ ਦੋਵੇਂ ਅੰਤਲੇ ਸਿਰੇ ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਨਹੀਂ ਹੁੰਦੇ।"],
  ["These two people really do sit next to each other, so this statement is true. The question asks for the false statement.", "ये दोनों सच में साथ बैठे हैं, इसलिए यह कथन सही है। प्रश्न गलत कथन पूछता है।", "ਇਹ ਦੋਵੇਂ ਅਸਲ ਵਿੱਚ ਨਾਲ ਬੈਠੇ ਹਨ, ਇਸ ਲਈ ਇਹ ਕਥਨ ਸਹੀ ਹੈ। ਸਵਾਲ ਗਲਤ ਕਥਨ ਪੁੱਛਦਾ ਹੈ।"],
  ["This statement is true because the two persons occupy consecutive seats; the question asks for the false statement.", "यह कथन सही है क्योंकि दोनों व्यक्ति लगातार सीटों पर हैं; प्रश्न गलत कथन पूछता है।", "ਇਹ ਕਥਨ ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਦੋਵੇਂ ਵਿਅਕਤੀ ਲਗਾਤਾਰ ਸੀਟਾਂ 'ਤੇ ਹਨ; ਸਵਾਲ ਗਲਤ ਕਥਨ ਪੁੱਛਦਾ ਹੈ।"],
  ["This reverses the correct sequence.", "यह सही क्रम को उलट देता है।", "ਇਹ ਸਹੀ ਕ੍ਰਮ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ।"],

  ["clockwise", "घड़ी की दिशा में", "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ"],
  ["anticlockwise", "घड़ी की विपरीत दिशा में", "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ"],
  ["facing the centre", "केंद्र की ओर मुख किए", "ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ"],
  ["faces the centre", "केंद्र की ओर मुख किए है", "ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਹੈ"],
  ["face the centre", "केंद्र की ओर मुख किए हैं", "ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਹਨ"],
  ["facing outward", "बाहर की ओर मुख किए", "ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ"],
  ["faces outward", "बाहर की ओर मुख किए है", "ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਹੈ"],
  ["face outward", "बाहर की ओर मुख किए हैं", "ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਹਨ"],
  ["faces north", "उत्तर की ओर मुख किए है", "ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਹੈ"],
  ["faces south", "दक्षिण की ओर मुख किए है", "ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਹੈ"],
  ["facing north", "उत्तर की ओर मुख किए", "ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ"],
  ["facing south", "दक्षिण की ओर मुख किए", "ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ"],
  ["immediately to the left of", "के ठीक बाईं ओर", "ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਪਾਸੇ"],
  ["immediately to the right of", "के ठीक दाईं ओर", "ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਪਾਸੇ"],
  ["to the left of", "के बाईं ओर", "ਦੇ ਖੱਬੇ ਪਾਸੇ"],
  ["to the right of", "के दाईं ओर", "ਦੇ ਸੱਜੇ ਪਾਸੇ"],
  ["immediately clockwise from", "से घड़ी की दिशा में अगली सीट पर", "ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅਗਲੀ ਸੀਟ 'ਤੇ"],
  ["sits opposite", "के ठीक सामने है", "ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਹੈ"],
  ["sits next to", "के साथ वाली सीट पर है", "ਦੇ ਨਾਲ ਵਾਲੀ ਸੀਟ 'ਤੇ ਹੈ"],
  ["sits adjacent to", "के साथ वाली सीट पर है", "ਦੇ ਨਾਲ ਵਾਲੀ ਸੀਟ 'ਤੇ ਹੈ"],
  ["does not sit next to", "के साथ वाली सीट पर नहीं है", "ਦੇ ਨਾਲ ਵਾਲੀ ਸੀਟ 'ਤੇ ਨਹੀਂ ਹੈ"],
  ["does not sit adjacent to", "के साथ वाली सीट पर नहीं है", "ਦੇ ਨਾਲ ਵਾਲੀ ਸੀਟ 'ਤੇ ਨਹੀਂ ਹੈ"],
  ["sits at one of the extreme ends", "दोनों अंतिम छोरों में से किसी एक पर है", "ਦੋਵੇਂ ਅੰਤਲੇ ਸਿਰਿਆਂ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ 'ਤੇ ਹੈ"],
  ["sits at the extreme left end", "सबसे बाएँ छोर पर है", "ਸਭ ਤੋਂ ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਹੈ"],
  ["sits at the left end", "बाएँ छोर पर है", "ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਹੈ"],
  ["sits at the right end", "दाएँ छोर पर है", "ਸੱਜੇ ਸਿਰੇ 'ਤੇ ਹੈ"],
  ["sits in a middle seat", "बीच की किसी सीट पर है", "ਵਿਚਕਾਰਲੀ ਕਿਸੇ ਸੀਟ 'ਤੇ ਹੈ"],
  ["sits at the seat nearest the door", "दरवाज़े के सबसे पास वाली सीट पर है", "ਦਰਵਾਜ਼ੇ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਵਾਲੀ ਸੀਟ 'ਤੇ ਹੈ"],
  ["sits at the seat nearest the entrance", "प्रवेश-द्वार के सबसे पास वाली सीट पर है", "ਪ੍ਰਵੇਸ਼-ਦੁਆਰ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਵਾਲੀ ਸੀਟ 'ਤੇ ਹੈ"],
  ["sits at the seat nearest the stage", "मंच के सबसे पास वाली सीट पर है", "ਮੰਚ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਵਾਲੀ ਸੀਟ 'ਤੇ ਹੈ"],
  ["Exactly", "ठीक", "ਠੀਕ"],
  ["persons sit between", "व्यक्ति बीच में बैठे हैं", "ਵਿਅਕਤੀ ਵਿਚਕਾਰ ਬੈਠੇ ਹਨ"],
  ["person sits between", "व्यक्ति बीच में बैठा है", "ਵਿਅਕਤੀ ਵਿਚਕਾਰ ਬੈਠਾ ਹੈ"],
  ["when counted", "गिनने पर", "ਗਿਣਣ 'ਤੇ"],
  ["from the left end", "बाएँ छोर से", "ਖੱਬੇ ਸਿਰੇ ਤੋਂ"],
  ["from the right end", "दाएँ छोर से", "ਸੱਜੇ ਸਿਰੇ ਤੋਂ"],
  ["left end", "बायाँ छोर", "ਖੱਬਾ ਸਿਰਾ"],
  ["right end", "दायाँ छोर", "ਸੱਜਾ ਸਿਰਾ"],
  ["extreme ends", "अंतिम छोर", "ਅੰਤਲੇ ਸਿਰੇ"],
  ["middle seat", "बीच की सीट", "ਵਿਚਕਾਰਲੀ ਸੀਟ"],
  ["opposite seat", "सामने वाली सीट", "ਸਾਹਮਣੇ ਵਾਲੀ ਸੀਟ"],
  ["opposite position", "सामने वाला स्थान", "ਸਾਹਮਣੇ ਵਾਲੀ ਥਾਂ"],
  ["opposite end", "दूसरा छोर", "ਦੂਜਾ ਸਿਰਾ"],
  ["neighbours", "पड़ोसी", "ਨਾਲ ਬੈਠੇ ਵਿਅਕਤੀ"],
  ["neighbour", "पड़ोसी", "ਨਾਲ ਬੈਠਾ ਵਿਅਕਤੀ"],
  ["adjacent", "पास-पास", "ਨਾਲ-ਨਾਲ"],
  ["between", "बीच में", "ਵਿਚਕਾਰ"],
  ["left", "बायाँ", "ਖੱਬਾ"],
  ["right", "दायाँ", "ਸੱਜਾ"],
  ["centre", "केंद्र", "ਕੇਂਦਰ"],
  ["outward", "बाहर की ओर", "ਬਾਹਰ ਵੱਲ"],
  ["north", "उत्तर", "ਉੱਤਰ"],
  ["south", "दक्षिण", "ਦੱਖਣ"],
  ["row", "पंक्ति", "ਕਤਾਰ"],
  ["circle", "गोल व्यवस्था", "ਗੋਲ ਵਿਵਸਥਾ"],
  ["seats", "सीटें", "ਸੀਟਾਂ"],
  ["seat", "सीट", "ਸੀਟ"],
  ["persons", "व्यक्ति", "ਵਿਅਕਤੀ"],
  ["person", "व्यक्ति", "ਵਿਅਕਤੀ"],
  ["question", "प्रश्न", "ਸਵਾਲ"],
  ["statement", "कथन", "ਕਥਨ"],
  ["option", "विकल्प", "ਵਿਕਲਪ"],
  ["answer", "उत्तर", "ਉੱਤਰ"],
  ["correct", "सही", "ਸਹੀ"],
  ["wrong", "गलत", "ਗਲਤ"],
];

function localeValue(locale: Sea001TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function replaceLiteralAll(text: string, from: string, to: string): string {
  return text.split(from).join(to);
}

function localizeOrdinals(text: string, locale: Sea001TranslatedLocale): string {
  let output = text;
  for (const [token, values] of Object.entries(ORDINAL_NUMBERS)) {
    output = replaceLiteralAll(output, token, localeValue(locale, values[0], values[1]));
  }
  for (const [token, values] of Object.entries(ORDINALS)) {
    output = output.replace(new RegExp(`\\b${token}\\b`, "gi"), localeValue(locale, values[0], values[1]));
  }
  return output;
}

function localizeCardinalWords(text: string): string {
  let output = text;
  for (const [token, value] of Object.entries(CARDINAL_WORDS)) {
    output = output.replace(new RegExp(`\\b${token}\\b`, "gi"), value);
  }
  return output;
}

function localizePhraseSurface(text: string, locale: Sea001TranslatedLocale): string {
  let output = localizeSea001Names(text, locale);
  output = localizeOrdinals(output, locale);
  output = localizeCardinalWords(output);
  for (const [en, hi, pa] of [...PHRASES].sort((left, right) => right[0].length - left[0].length)) {
    output = replaceLiteralAll(output, en, localeValue(locale, hi, pa));
  }
  return output;
}

function polishLocalizedText(text: string, locale: Sea001TranslatedLocale): string {
  let output = text;
  if (locale === "hi-IN") {
    output = output
      .replaceAll("sits ", "")
      .replaceAll(" sits", "")
      .replaceAll(" is ", " है ")
      .replaceAll(" are ", " हैं ")
      .replaceAll(" and ", " और ")
      .replaceAll(" or ", " या ")
      .replaceAll(" if ", " यदि ")
      .replaceAll(" otherwise", " अन्यथा")
      .replaceAll(" then ", " तब ")
      .replaceAll(" so ", " इसलिए ")
      .replaceAll("So: ", "इसलिए: ")
      .replaceAll("So ", "इसलिए ")
      .replaceAll("Then ", "फिर ")
      .replaceAll("Now ", "अब ")
      .replaceAll("First ", "पहले ")
      .replaceAll("Start ", "शुरू करें ")
      .replaceAll("Put ", "रखें ")
      .replaceAll("Draw ", "बनाएँ ")
      .replaceAll("Keep ", "रखें ")
      .replaceAll("Count ", "गिनें ")
      .replaceAll("Moving ", "चलने पर ")
      .replaceAll("Counting ", "गिनने पर ")
      .replaceAll("This ", "यह ")
      .replaceAll("The ", "")
      .replaceAll("Who ", "कौन ")
      .replaceAll("How many ", "कितने ")
      .replaceAll("Which ", "कौन-सा ")
      .replaceAll("What ", "क्या ")
      .replaceAll("with respect to", "के सापेक्ष")
      .replaceAll("will sit", "बैठेगा/बैठेगी")
      .replaceAll("sit", "बैठें")
      .replaceAll("sitting", "बैठे")
      .replaceAll("facing", "मुख-दिशा")
      .replaceAll("faces", "मुख किए है")
      .replaceAll("face", "मुख किए हैं")
      .replaceAll("immediately", "ठीक")
      .replaceAll("direction", "दिशा")
      .replaceAll("same", "एक ही")
      .replaceAll("other", "दूसरा")
      .replaceAll("people", "लोग")
      .replaceAll("way", "तरीका")
      .replaceAll("place", "स्थान")
      .replaceAll("places", "स्थान")
      .replaceAll("possible", "संभव")
      .replaceAll("only", "केवल")
      .replaceAll("there", "वहाँ")
      .replaceAll("here", "यहाँ")
      .replaceAll("next", "अगला")
      .replaceAll("around", "चारों ओर")
      .replaceAll("table", "मेज")
      .replaceAll("same order", "एक ही क्रम")
      .replaceAll("order", "क्रम")
      .replaceAll("listed", "सूचीबद्ध")
      .replaceAll("true", "सही")
      .replaceAll("false", "गलत")
      .replaceAll("result", "परिणाम")
      .replaceAll("final", "अंतिम");
  } else {
    output = output
      .replaceAll("sits ", "")
      .replaceAll(" sits", "")
      .replaceAll(" is ", " ਹੈ ")
      .replaceAll(" are ", " ਹਨ ")
      .replaceAll(" and ", " ਅਤੇ ")
      .replaceAll(" or ", " ਜਾਂ ")
      .replaceAll(" if ", " ਜੇ ")
      .replaceAll(" otherwise", " ਨਹੀਂ ਤਾਂ")
      .replaceAll(" then ", " ਤਾਂ ")
      .replaceAll(" so ", " ਇਸ ਲਈ ")
      .replaceAll("So: ", "ਇਸ ਲਈ: ")
      .replaceAll("So ", "ਇਸ ਲਈ ")
      .replaceAll("Then ", "ਫਿਰ ")
      .replaceAll("Now ", "ਹੁਣ ")
      .replaceAll("First ", "ਪਹਿਲਾਂ ")
      .replaceAll("Start ", "ਸ਼ੁਰੂ ਕਰੋ ")
      .replaceAll("Put ", "ਰੱਖੋ ")
      .replaceAll("Draw ", "ਬਣਾਓ ")
      .replaceAll("Keep ", "ਰੱਖੋ ")
      .replaceAll("Count ", "ਗਿਣੋ ")
      .replaceAll("Moving ", "ਚੱਲਣ 'ਤੇ ")
      .replaceAll("Counting ", "ਗਿਣਣ 'ਤੇ ")
      .replaceAll("This ", "ਇਹ ")
      .replaceAll("The ", "")
      .replaceAll("Who ", "ਕੌਣ ")
      .replaceAll("How many ", "ਕਿੰਨੇ ")
      .replaceAll("Which ", "ਕਿਹੜਾ ")
      .replaceAll("What ", "ਕੀ ")
      .replaceAll("with respect to", "ਦੇ ਸਬੰਧ ਵਿੱਚ")
      .replaceAll("will sit", "ਬੈਠੇਗਾ/ਬੈਠੇਗੀ")
      .replaceAll("sit", "ਬੈਠੋ")
      .replaceAll("sitting", "ਬੈਠੇ")
      .replaceAll("facing", "ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ")
      .replaceAll("faces", "ਮੂੰਹ ਕਰਕੇ ਹੈ")
      .replaceAll("face", "ਮੂੰਹ ਕਰਕੇ ਹਨ")
      .replaceAll("immediately", "ਬਿਲਕੁਲ")
      .replaceAll("direction", "ਦਿਸ਼ਾ")
      .replaceAll("same", "ਇੱਕੋ")
      .replaceAll("other", "ਦੂਜਾ")
      .replaceAll("people", "ਲੋਕ")
      .replaceAll("way", "ਤਰੀਕਾ")
      .replaceAll("place", "ਥਾਂ")
      .replaceAll("places", "ਥਾਵਾਂ")
      .replaceAll("possible", "ਸੰਭਵ")
      .replaceAll("only", "ਸਿਰਫ਼")
      .replaceAll("there", "ਉੱਥੇ")
      .replaceAll("here", "ਇੱਥੇ")
      .replaceAll("next", "ਅਗਲਾ")
      .replaceAll("around", "ਆਲੇ-ਦੁਆਲੇ")
      .replaceAll("table", "ਮੇਜ਼")
      .replaceAll("same order", "ਇੱਕੋ ਕ੍ਰਮ")
      .replaceAll("order", "ਕ੍ਰਮ")
      .replaceAll("listed", "ਸੂਚੀਬੱਧ")
      .replaceAll("true", "ਸਹੀ")
      .replaceAll("false", "ਗਲਤ")
      .replaceAll("result", "ਨਤੀਜਾ")
      .replaceAll("final", "ਅੰਤਿਮ");
  }
  return output.replace(/ {2,}/g, " ").replace(/ \./g, ".").trim();
}

export function localizeSea001LearnerText(text: string, locale: Sea001TranslatedLocale): string {
  return polishLocalizedText(localizePhraseSurface(text, locale), locale);
}

function localizeOption(option: AuditOption, locale: Sea001TranslatedLocale): AuditOption {
  return {
    ...option,
    display: localizeSea001LearnerText(option.display, locale),
    explanation: localizeSea001LearnerText(option.explanation, locale),
  };
}

function localizeChild(child: AuditChild, locale: Sea001TranslatedLocale): AuditChild {
  return {
    ...child,
    text: localizeSea001LearnerText(child.text, locale),
    explanation: localizeSea001LearnerText(child.explanation, locale),
    options: child.options.map((option) => localizeOption(option, locale)),
  };
}

export function localizeSea001ReviewCaselet(caselet: AuditCaselet, locale: Sea001TranslatedLocale): Sea001LocalizedReviewCaselet {
  const canonicalParityFingerprint = sea001CanonicalParityFingerprint(caselet);
  const localizedDiagramText = caselet.diagramText ? localizeSea001Names(caselet.diagramText, locale) : caselet.diagramText;
  const localizedDiagram = caselet.diagram
    ? { ...caselet.diagram, text: caselet.diagram.text ? localizeSea001Names(caselet.diagram.text, locale) : caselet.diagram.text }
    : caselet.diagram;
  return {
    ...caselet,
    locale,
    canonicalLocale: "en-IN",
    canonicalCaseletId: caselet.caseletId,
    canonicalParityFingerprint,
    localizationAuthority: SEA001_LOCALIZATION_AUTHORITY,
    localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
    humanLanguageReviewRequired: true,
    activeEditorialBlockers: [SEA001_LOCALIZATION_HUMAN_REVIEW_BLOCKER],
    productDeliveryUnlocked: false,
    productionStagingApproved: false,
    setupText: localizeSea001LearnerText(caselet.setupText, locale),
    clueTexts: caselet.clueTexts.map((clue) => localizeSea001LearnerText(clue, locale)),
    sharedExplanation: localizeSea001LearnerText(caselet.sharedExplanation, locale),
    diagramText: localizedDiagramText,
    diagram: localizedDiagram,
    children: caselet.children.map((child) => localizeChild(child, locale)),
  };
}

export function sea001LocalizedLearnerSurface(caselet: AuditCaselet): string {
  return [
    caselet.setupText,
    ...caselet.clueTexts,
    caselet.sharedExplanation,
    caselet.diagramText ?? caselet.diagram?.text ?? "",
    ...caselet.children.flatMap((child) => [
      child.text,
      child.explanation,
      ...child.options.flatMap((option) => [option.display, option.explanation]),
    ]),
  ].join("\n");
}
