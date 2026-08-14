import type { AuditCaselet, AuditChild, AuditOption } from "../saturation/corpus.ts";
import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { localizedSea001Name, SEA001_REVIEW_CANONICAL_NAMES } from "./name-pack.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";

const NAME_PATTERN = [...SEA001_REVIEW_CANONICAL_NAMES]
  .sort((a, b) => b.length - a.length)
  .map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");
const NAME_RE = new RegExp(`\\b(?:${NAME_PATTERN})\\b`, "g");

function tr(locale: Sea001TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function nativeName(value: string, locale: Sea001TranslatedLocale): string {
  return localizedSea001Name(value, locale);
}

function namesIn(text: string): readonly string[] {
  return [...text.matchAll(new RegExp(NAME_RE.source, "g"))].map((match) => match[0]!);
}

function localizeNames(text: string, locale: Sea001TranslatedLocale): string {
  return text.replace(new RegExp(NAME_RE.source, "g"), (value) => nativeName(value, locale));
}

function relationPhrase(raw: string, locale: Sea001TranslatedLocale): string {
  const normalized = raw.trim().toLowerCase();
  const ordinalHi: Readonly<Record<string, string>> = {
    immediately: "ठीक",
    first: "पहले",
    second: "दूसरे",
    third: "तीसरे",
    fourth: "चौथे",
    fifth: "पाँचवें",
    sixth: "छठे",
    seventh: "सातवें",
    eighth: "आठवें",
  };
  const ordinalPa: Readonly<Record<string, string>> = {
    immediately: "ਬਿਲਕੁਲ",
    first: "ਪਹਿਲੇ",
    second: "ਦੂਜੇ",
    third: "ਤੀਜੇ",
    fourth: "ਚੌਥੇ",
    fifth: "ਪੰਜਵੇਂ",
    sixth: "ਛੇਵੇਂ",
    seventh: "ਸੱਤਵੇਂ",
    eighth: "ਅੱਠਵੇਂ",
  };
  const match = normalized.match(/^(immediately|first|second|third|fourth|fifth|sixth|seventh|eighth) to the (left|right)$/);
  if (!match) throw new Error(`SEA-001 explanation parity: unsupported relation phrase ${raw}`);
  const side = match[2] === "left"
    ? tr(locale, "बाईं ओर", "ਖੱਬੇ ਪਾਸੇ")
    : tr(locale, "दाईं ओर", "ਸੱਜੇ ਪਾਸੇ");
  if (match[1] === "immediately") return tr(locale, `ठीक ${side}`, `ਬਿਲਕੁਲ ${side}`);
  const ordinal = locale === "hi-IN" ? ordinalHi[match[1]!] : ordinalPa[match[1]!];
  return `${side} ${ordinal} स्थान पर`;
}

function extractNativeActions(candidate: Sea001LocalizedReviewCaselet, locale: Sea001TranslatedLocale): readonly string[] {
  const marker = locale === "hi-IN" ? "करें:" : "ਕਰੋ:";
  const actions = candidate.sharedExplanation
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith(marker))
    .map((line) => line.slice(marker.length).trim());
  if (actions.length !== candidate.clueTexts.length) {
    throw new Error(`${candidate.canonicalCaseletId}: explanation parity expected ${candidate.clueTexts.length} native clue actions, got ${actions.length}`);
  }
  return actions;
}

const FIXED_SHARED: Readonly<Record<string, readonly [string, string]>> = Object.freeze({
  "Now take the clues one by one:": ["अब संकेतों को एक-एक करके लगाएँ:", "ਹੁਣ ਸੰਕੇਤਾਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਲਗਾਓ:"],
  "After all the clues are used, only one arrangement fits.": ["सभी संकेत लगाने के बाद केवल एक व्यवस्था संभव रहती है।", "ਸਾਰੇ ਸੰਕੇਤ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਸਿਰਫ਼ ਇੱਕ ਵਿਵਸਥਾ ਸੰਭਵ ਰਹਿੰਦੀ ਹੈ।"],
  "So the final row is:": ["अतः अंतिम पंक्ति है:", "ਇਸ ਲਈ ਅੰਤਿਮ ਕਤਾਰ ਹੈ:"],
  "So the final clockwise order is:": ["अतः घड़ी की दिशा में अंतिम क्रम है:", "ਇਸ ਲਈ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅੰਤਿਮ ਕ੍ਰਮ ਹੈ:"],
  "So the final circle is:": ["अतः अंतिम गोल व्यवस्था है:", "ਇਸ ਲਈ ਅੰਤਿਮ ਗੋਲ ਵਿਵਸਥਾ ਹੈ:"],
  "Sometimes a clue gives two or three possible places. Draw only the seats you know and leave the rest blank.": ["कभी-कभी किसी संकेत से दो या तीन स्थान संभव होते हैं। केवल तय सीटें बनाइए और बाकी जगह खाली छोड़िए।", "ਕਈ ਵਾਰ ਕਿਸੇ ਸੰਕੇਤ ਨਾਲ ਦੋ ਜਾਂ ਤਿੰਨ ਥਾਵਾਂ ਸੰਭਵ ਹੁੰਦੀਆਂ ਹਨ। ਸਿਰਫ਼ ਤੈਅ ਸੀਟਾਂ ਬਣਾਓ ਅਤੇ ਬਾਕੀ ਥਾਵਾਂ ਖਾਲੀ ਛੱਡੋ।"],
  "If two or three ways are possible, keep them for a moment. A later clue will show which one is correct.": ["यदि दो या तीन तरीके संभव हों, उन्हें अभी बनाए रखें। आगे का संकेत बताएगा कि कौन-सा सही है।", "ਜੇ ਦੋ ਜਾਂ ਤਿੰਨ ਤਰੀਕੇ ਸੰਭਵ ਹੋਣ, ਉਨ੍ਹਾਂ ਨੂੰ ਹਾਲੇ ਰੱਖੋ। ਅਗਲਾ ਸੰਕੇਤ ਦੱਸੇਗਾ ਕਿ ਕਿਹੜਾ ਸਹੀ ਹੈ।"],
  "If two or three places are possible, keep them for a moment. A later clue will decide the correct one.": ["यदि दो या तीन स्थान संभव हों, उन्हें अभी बनाए रखें। आगे का संकेत सही स्थान तय करेगा।", "ਜੇ ਦੋ ਜਾਂ ਤਿੰਨ ਥਾਵਾਂ ਸੰਭਵ ਹੋਣ, ਉਨ੍ਹਾਂ ਨੂੰ ਹਾਲੇ ਰੱਖੋ। ਅਗਲਾ ਸੰਕੇਤ ਸਹੀ ਥਾਂ ਤੈਅ ਕਰੇਗਾ।"],
  "Keep marking seats as you fill them. If only one seat is left for someone, put that person there.": ["सीटें भरते समय उन्हें चिन्हित करते जाएँ। यदि किसी व्यक्ति के लिए केवल एक सीट बचे, उसे वहीं रखें।", "ਸੀਟਾਂ ਭਰਦੇ ਸਮੇਂ ਉਨ੍ਹਾਂ ਨੂੰ ਨਿਸ਼ਾਨ ਲਗਾਉਂਦੇ ਜਾਓ। ਜੇ ਕਿਸੇ ਵਿਅਕਤੀ ਲਈ ਸਿਰਫ਼ ਇੱਕ ਸੀਟ ਬਚੇ, ਉਸਨੂੰ ਉੱਥੇ ਰੱਖੋ।"],
  "Keep marking the seats as you fill them. If only one seat is left for someone, put that person there.": ["सीटें भरते समय उन्हें चिन्हित करते जाएँ। यदि किसी व्यक्ति के लिए केवल एक सीट बचे, उसे वहीं रखें।", "ਸੀਟਾਂ ਭਰਦੇ ਸਮੇਂ ਉਨ੍ਹਾਂ ਨੂੰ ਨਿਸ਼ਾਨ ਲਗਾਉਂਦੇ ਜਾਓ। ਜੇ ਕਿਸੇ ਵਿਅਕਤੀ ਲਈ ਸਿਰਫ਼ ਇੱਕ ਸੀਟ ਬਚੇ, ਉਸਨੂੰ ਉੱਥੇ ਰੱਖੋ।"],
  "Now fill the rest of the row:": ["अब पंक्ति की बाकी सीटें भरें:", "ਹੁਣ ਕਤਾਰ ਦੀਆਂ ਬਾਕੀ ਸੀਟਾਂ ਭਰੋ:"],
  "Now fill the empty seats:": ["अब खाली सीटें भरें:", "ਹੁਣ ਖਾਲੀ ਸੀਟਾਂ ਭਰੋ:"],
  "Start with the clue that fixes a seat or joins two people. If two places are possible, keep both until another clue decides.": ["उस संकेत से शुरू करें जो कोई सीट तय करता है या दो व्यक्तियों को जोड़ता है। यदि दो स्थान संभव हों, दोनों को तब तक रखें जब तक दूसरा संकेत फैसला न कर दे।", "ਉਸ ਸੰਕੇਤ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ ਜੋ ਕੋਈ ਸੀਟ ਤੈਅ ਕਰਦਾ ਹੈ ਜਾਂ ਦੋ ਵਿਅਕਤੀਆਂ ਨੂੰ ਜੋੜਦਾ ਹੈ। ਜੇ ਦੋ ਥਾਵਾਂ ਸੰਭਵ ਹੋਣ, ਦੋਵੇਂ ਨੂੰ ਉਦੋਂ ਤੱਕ ਰੱਖੋ ਜਦੋਂ ਤੱਕ ਹੋਰ ਸੰਕੇਤ ਫੈਸਲਾ ਨਾ ਕਰ ਦੇਵੇ।"],
  "If a clue gives two possible ways, keep both for a moment. As soon as a later clue does not fit one case, cross that case out.": ["यदि किसी संकेत से दो तरीके संभव हों, दोनों को अभी रखें। आगे का कोई संकेत जिस स्थिति में फिट न हो, उस स्थिति को काट दें।", "ਜੇ ਕਿਸੇ ਸੰਕੇਤ ਨਾਲ ਦੋ ਤਰੀਕੇ ਸੰਭਵ ਹੋਣ, ਦੋਵੇਂ ਨੂੰ ਹਾਲੇ ਰੱਖੋ। ਅਗਲਾ ਸੰਕੇਤ ਜਿਸ ਸਥਿਤੀ ਵਿੱਚ ਫਿੱਟ ਨਾ ਹੋਵੇ, ਉਸ ਸਥਿਤੀ ਨੂੰ ਕੱਟ ਦਿਓ।"],
  "For an if/otherwise clue, do not guess. Keep both possibilities until another clue tells us which one is true.": ["यदि/अन्यथा वाले संकेत में अनुमान न लगाएँ। दोनों संभावनाएँ तब तक रखें जब तक दूसरा संकेत न बता दे कि कौन-सी सही है।", "ਜੇ/ਨਹੀਂ ਤਾਂ ਵਾਲੇ ਸੰਕੇਤ ਵਿੱਚ ਅਨੁਮਾਨ ਨਾ ਲਗਾਓ। ਦੋਵੇਂ ਸੰਭਾਵਨਾਵਾਂ ਉਦੋਂ ਤੱਕ ਰੱਖੋ ਜਦੋਂ ਤੱਕ ਹੋਰ ਸੰਕੇਤ ਨਾ ਦੱਸ ਦੇਵੇ ਕਿ ਕਿਹੜੀ ਸਹੀ ਹੈ।"],
  "This clue only says that the two people sit together, so try both orders around the circle:": ["यह संकेत केवल बताता है कि दोनों व्यक्ति साथ बैठे हैं, इसलिए गोल में दोनों संभावित क्रम आज़माएँ:", "ਇਹ ਸੰਕੇਤ ਸਿਰਫ਼ ਦੱਸਦਾ ਹੈ ਕਿ ਦੋਵੇਂ ਵਿਅਕਤੀ ਨਾਲ ਬੈਠੇ ਹਨ, ਇਸ ਲਈ ਗੋਲ ਵਿੱਚ ਦੋਵੇਂ ਸੰਭਵ ਕ੍ਰਮ ਅਜ਼ਮਾਓ:"],
});

function fixedShared(block: string, locale: Sea001TranslatedLocale): string | undefined {
  const pair = FIXED_SHARED[block];
  return pair ? (locale === "hi-IN" ? pair[0] : pair[1]) : undefined;
}

function translateIntro(block: string, locale: Sea001TranslatedLocale): string | undefined {
  if (block === "Everyone faces north. Number the seats from left to right. A person's left is towards the left side of your page, and right is towards the right side.") {
    return tr(locale,
      "सभी उत्तर की ओर मुख किए हैं। सीटों को बाएँ से दाएँ क्रमांक दें। किसी व्यक्ति का बायाँ आपके पृष्ठ के बाएँ और दायाँ आपके पृष्ठ के दाएँ ओर होगा।",
      "ਸਾਰੇ ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ਸੀਟਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਨੰਬਰ ਦਿਓ। ਕਿਸੇ ਵਿਅਕਤੀ ਦਾ ਖੱਬਾ ਤੁਹਾਡੇ ਪੰਨੇ ਦੇ ਖੱਬੇ ਅਤੇ ਸੱਜਾ ਤੁਹਾਡੇ ਪੰਨੇ ਦੇ ਸੱਜੇ ਪਾਸੇ ਹੋਵੇਗਾ।");
  }
  if (block === "Everyone faces south. Number the seats from left to right. Because they face you, a person's left is towards the right side of your page, and right is towards the left side.") {
    return tr(locale,
      "सभी दक्षिण की ओर मुख किए हैं। सीटों को बाएँ से दाएँ क्रमांक दें। क्योंकि वे आपकी ओर मुख किए हैं, किसी व्यक्ति का बायाँ आपके पृष्ठ के दाएँ और दायाँ आपके पृष्ठ के बाएँ ओर होगा।",
      "ਸਾਰੇ ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ਸੀਟਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਨੰਬਰ ਦਿਓ। ਕਿਉਂਕਿ ਉਹ ਤੁਹਾਡੀ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ, ਕਿਸੇ ਵਿਅਕਤੀ ਦਾ ਖੱਬਾ ਤੁਹਾਡੇ ਪੰਨੇ ਦੇ ਸੱਜੇ ਅਤੇ ਸੱਜਾ ਤੁਹਾਡੇ ਪੰਨੇ ਦੇ ਖੱਬੇ ਪਾਸੇ ਹੋਵੇਗਾ।");
  }
  if (block === "Number the seats 1, 2, 3... from left to right.") {
    return tr(locale, "सीटों को बाएँ से दाएँ 1, 2, 3... क्रमांक दें।", "ਸੀਟਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ 1, 2, 3... ਨੰਬਰ ਦਿਓ।");
  }
  if (block === "Not everyone faces the same way. For a left/right clue, first see which way the person after 'of' is facing. If that person faces north, left is our left. If that person faces south, left is our right.") {
    return tr(locale,
      "सभी एक ही दिशा में मुख नहीं किए हैं। बाएँ/दाएँ वाले संकेत में पहले देखें कि जिस व्यक्ति के संदर्भ में पूछा गया है, वह किस दिशा में मुख किए है। वह उत्तर की ओर हो तो उसका बायाँ हमारा बायाँ है; दक्षिण की ओर हो तो उसका बायाँ हमारा दायाँ है।",
      "ਸਭ ਦਾ ਮੂੰਹ ਇੱਕੋ ਦਿਸ਼ਾ ਵੱਲ ਨਹੀਂ ਹੈ। ਖੱਬੇ/ਸੱਜੇ ਵਾਲੇ ਸੰਕੇਤ ਵਿੱਚ ਪਹਿਲਾਂ ਵੇਖੋ ਕਿ ਜਿਸ ਵਿਅਕਤੀ ਦੇ ਹਵਾਲੇ ਨਾਲ ਗੱਲ ਕੀਤੀ ਗਈ ਹੈ, ਉਸਦਾ ਮੂੰਹ ਕਿਸ ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ਉਹ ਉੱਤਰ ਵੱਲ ਹੋਵੇ ਤਾਂ ਉਸਦਾ ਖੱਬਾ ਸਾਡਾ ਖੱਬਾ ਹੈ; ਦੱਖਣ ਵੱਲ ਹੋਵੇ ਤਾਂ ਉਸਦਾ ਖੱਬਾ ਸਾਡਾ ਸੱਜਾ ਹੈ।");
  }
  if (block === "Everyone faces the centre. So left means clockwise and right means anticlockwise.") {
    return tr(locale, "सभी केंद्र की ओर मुख किए हैं। इसलिए बायाँ घड़ी की दिशा और दायाँ घड़ी की विपरीत दिशा होगा।", "ਸਾਰੇ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ। ਇਸ ਲਈ ਖੱਬਾ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਅਤੇ ਸੱਜਾ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਹੋਵੇਗਾ।");
  }
  if (block === "Everyone faces outward. So left means anticlockwise and right means clockwise.") {
    return tr(locale, "सभी बाहर की ओर मुख किए हैं। इसलिए बायाँ घड़ी की विपरीत दिशा और दायाँ घड़ी की दिशा होगा।", "ਸਾਰੇ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ। ਇਸ ਲਈ ਖੱਬਾ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਅਤੇ ਸੱਜਾ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਹੋਵੇਗਾ।");
  }
  if (block === "For every left/right clue, first see whether that person faces the centre or outward. If the person faces the centre, left means clockwise. If the person faces outward, left means anticlockwise.") {
    return tr(locale,
      "हर बाएँ/दाएँ वाले संकेत में पहले देखें कि संबंधित व्यक्ति केंद्र की ओर मुख किए है या बाहर की ओर। केंद्र की ओर मुख हो तो बायाँ घड़ी की दिशा है; बाहर की ओर मुख हो तो बायाँ घड़ी की विपरीत दिशा है।",
      "ਹਰ ਖੱਬੇ/ਸੱਜੇ ਵਾਲੇ ਸੰਕੇਤ ਵਿੱਚ ਪਹਿਲਾਂ ਵੇਖੋ ਕਿ ਸੰਬੰਧਿਤ ਵਿਅਕਤੀ ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਹੈ ਜਾਂ ਬਾਹਰ ਵੱਲ। ਕੇਂਦਰ ਵੱਲ ਹੋਵੇ ਤਾਂ ਖੱਬਾ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਹੈ; ਬਾਹਰ ਵੱਲ ਹੋਵੇ ਤਾਂ ਖੱਬਾ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਹੈ।");
  }
  let match = block.match(/^Put ([A-Z][a-z]+) anywhere to start your circle\. Turning the whole circle does not make a new answer\.$/);
  if (match) {
    const person = nativeName(match[1]!, locale);
    return tr(locale, `${person} को कहीं भी रखकर गोल बनाना शुरू करें। पूरे गोल को घुमाने से नई व्यवस्था नहीं बनती।`, `${person} ਨੂੰ ਕਿਤੇ ਵੀ ਰੱਖ ਕੇ ਗੋਲ ਬਣਾਉਣਾ ਸ਼ੁਰੂ ਕਰੋ। ਪੂਰੇ ਗੋਲ ਨੂੰ ਘੁਮਾਉਣ ਨਾਲ ਨਵੀਂ ਵਿਵਸਥਾ ਨਹੀਂ ਬਣਦੀ।`);
  }
  match = block.match(/^Start the circle from the seat shown nearest the (entrance|stage|door)\.$/);
  if (match) {
    const place = match[1] === "stage"
      ? tr(locale, "मंच", "ਮੰਚ")
      : match[1] === "entrance"
        ? tr(locale, "प्रवेश-द्वार", "ਦਾਖਲਾ")
        : tr(locale, "दरवाज़े", "ਦਰਵਾਜ਼ੇ");
    return tr(locale, `${place} के सबसे पास दिखाई गई सीट से गोल बनाना शुरू करें।`, `${place} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਦਿਖਾਈ ਗਈ ਸੀਟ ਤੋਂ ਗੋਲ ਬਣਾਉਣਾ ਸ਼ੁਰੂ ਕਰੋ।`);
  }
  return undefined;
}

function translateDiagram(block: string, locale: Sea001TranslatedLocale): string {
  let output = localizeNames(block, locale);
  if (output.includes("\nPerson:") || output.startsWith("Seat:")) {
    return output
      .replace(/^Seat:/gm, tr(locale, "सीट:", "ਸੀਟ:"))
      .replace(/^Person:/gm, tr(locale, "व्यक्ति:", "ਵਿਅਕਤੀ:"))
      .replace(/^Facing:/gm, tr(locale, "मुख-दिशा:", "ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ:"));
  }
  return output
    .replace(/\(clockwise, all facing outward\)/g, tr(locale, "(घड़ी की दिशा; सभी बाहर की ओर मुख किए हैं)", "(ਘੜੀ ਦੀ ਦਿਸ਼ਾ; ਸਾਰੇ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ)"))
    .replace(/\(clockwise; ↘ centre, ↗ outward\)/g, tr(locale, "(घड़ी की दिशा; ↘ केंद्र की ओर, ↗ बाहर की ओर)", "(ਘੜੀ ਦੀ ਦਿਸ਼ਾ; ↘ ਕੇਂਦਰ ਵੱਲ, ↗ ਬਾਹਰ ਵੱਲ)"))
    .replace(/\(clockwise\)/g, tr(locale, "(घड़ी की दिशा)", "(ਘੜੀ ਦੀ ਦਿਸ਼ਾ)"));
}

function translateCaseLine(line: string, locale: Sea001TranslatedLocale): string | undefined {
  let match = line.match(/^Case (\d+) ❌ — this clue does not fit, so this case is wrong\.$/);
  if (match) return tr(locale, `स्थिति ${match[1]} ❌ — यह संकेत यहाँ फिट नहीं होता, इसलिए यह स्थिति गलत है।`, `ਸਥਿਤੀ ${match[1]} ❌ — ਇਹ ਸੰਕੇਤ ਇੱਥੇ ਫਿੱਟ ਨਹੀਂ ਹੁੰਦਾ, ਇਸ ਲਈ ਇਹ ਸਥਿਤੀ ਗਲਤ ਹੈ।`);
  match = line.match(/^Case (\d+) ✅ — this clue works here\.$/);
  if (match) return tr(locale, `स्थिति ${match[1]} ✅ — यह संकेत यहाँ सही बैठता है।`, `ਸਥਿਤੀ ${match[1]} ✅ — ਇਹ ਸੰਕੇਤ ਇੱਥੇ ਸਹੀ ਬੈਠਦਾ ਹੈ।`);
  match = line.match(/^Case (\d+): ([A-Z][a-z]+) faces (north|south)\.$/);
  if (match) {
    const person = nativeName(match[2]!, locale);
    const facing = match[3] === "north" ? tr(locale, "उत्तर की ओर", "ਉੱਤਰ ਵੱਲ") : tr(locale, "दक्षिण की ओर", "ਦੱਖਣ ਵੱਲ");
    return tr(locale, `स्थिति ${match[1]}: ${person} का मुख ${facing} है।`, `ਸਥਿਤੀ ${match[1]}: ${person} ਦਾ ਮੂੰਹ ${facing} ਹੈ।`);
  }
  match = line.match(/^Case (\d+) ❌ — if ([A-Z][a-z]+) faces (north|south), \2's (left|right) is towards our (left|right)\. From the (left|right) end, ([A-Z][a-z]+) would fall outside the row\. So this case is wrong\.$/);
  if (match) {
    const [, no, rawPerson, rawFacing, rel, pageSide, end, rawSubject] = match;
    const person = nativeName(rawPerson!, locale), subject = nativeName(rawSubject!, locale);
    const facing = rawFacing === "north" ? tr(locale, "उत्तर", "ਉੱਤਰ") : tr(locale, "दक्षिण", "ਦੱਖਣ");
    const relN = rel === "left" ? tr(locale, "बायाँ", "ਖੱਬਾ") : tr(locale, "दायाँ", "ਸੱਜਾ");
    const pageN = pageSide === "left" ? tr(locale, "बाईं ओर", "ਖੱਬੇ ਪਾਸੇ") : tr(locale, "दाईं ओर", "ਸੱਜੇ ਪਾਸੇ");
    const endN = end === "left" ? tr(locale, "बाएँ", "ਖੱਬੇ") : tr(locale, "दाएँ", "ਸੱਜੇ");
    return tr(locale,
      `स्थिति ${no} ❌ — यदि ${person} का मुख ${facing} की ओर हो, तो उसका ${relN} हमारी ${pageN} पड़ता है। ${endN} छोर से ${subject} पंक्ति के बाहर चला जाएगा। इसलिए यह स्थिति गलत है।`,
      `ਸਥਿਤੀ ${no} ❌ — ਜੇ ${person} ਦਾ ਮੂੰਹ ${facing} ਵੱਲ ਹੋਵੇ, ਤਾਂ ਉਸਦਾ ${relN} ਸਾਡੇ ${pageN} ਪੈਂਦਾ ਹੈ। ${endN} ਸਿਰੇ ਤੋਂ ${subject} ਕਤਾਰ ਤੋਂ ਬਾਹਰ ਚਲਾ ਜਾਵੇਗਾ। ਇਸ ਲਈ ਇਹ ਸਥਿਤੀ ਗਲਤ ਹੈ।`);
  }
  match = line.match(/^Case (\d+) ✅ — if ([A-Z][a-z]+) faces (north|south), \2's (left|right) is towards our (left|right)\. ([A-Z][a-z]+) can sit in the next seat inside the row\.$/);
  if (match) {
    const [, no, rawPerson, rawFacing, rel, pageSide, rawSubject] = match;
    const person = nativeName(rawPerson!, locale), subject = nativeName(rawSubject!, locale);
    const facing = rawFacing === "north" ? tr(locale, "उत्तर", "ਉੱਤਰ") : tr(locale, "दक्षिण", "ਦੱਖਣ");
    const relN = rel === "left" ? tr(locale, "बायाँ", "ਖੱਬਾ") : tr(locale, "दायाँ", "ਸੱਜਾ");
    const pageN = pageSide === "left" ? tr(locale, "बाईं ओर", "ਖੱਬੇ ਪਾਸੇ") : tr(locale, "दाईं ओर", "ਸੱਜੇ ਪਾਸੇ");
    return tr(locale,
      `स्थिति ${no} ✅ — यदि ${person} का मुख ${facing} की ओर हो, तो उसका ${relN} हमारी ${pageN} पड़ता है। ${subject} पंक्ति के अंदर अगली सीट पर बैठ सकता है।`,
      `ਸਥਿਤੀ ${no} ✅ — ਜੇ ${person} ਦਾ ਮੂੰਹ ${facing} ਵੱਲ ਹੋਵੇ, ਤਾਂ ਉਸਦਾ ${relN} ਸਾਡੇ ${pageN} ਪੈਂਦਾ ਹੈ। ${subject} ਕਤਾਰ ਦੇ ਅੰਦਰ ਅਗਲੀ ਸੀਟ 'ਤੇ ਬੈਠ ਸਕਦਾ ਹੈ।`);
  }
  match = line.match(/^Case (\d+): (.+)$/);
  if (match) return `${tr(locale, "स्थिति", "ਸਥਿਤੀ")} ${match[1]}: ${translateDiagram(match[2]!, locale)}`;
  return undefined;
}

function translateSharedBlock(
  source: AuditCaselet,
  candidate: Sea001LocalizedReviewCaselet,
  actions: readonly string[],
  block: string,
  locale: Sea001TranslatedLocale,
  state: { lastClueIndex: number | null },
): string {
  const fixed = fixedShared(block, locale);
  if (fixed) return fixed;
  const intro = translateIntro(block, locale);
  if (intro) return intro;

  let match = block.match(/^Start by using clues (\d+) to (\d+):$/);
  if (match) return tr(locale, `पहले संकेत ${match[1]} से ${match[2]} तक लगाएँ:`, `ਪਹਿਲਾਂ ਸੰਕੇਤ ${match[1]} ਤੋਂ ${match[2]} ਤੱਕ ਲਗਾਓ:`);
  match = block.match(/^At this point, there are (\d+) possible ways:$/);
  if (match) return tr(locale, `इस समय ${match[1]} संभावित तरीके हैं:`, `ਇਸ ਸਮੇਂ ${match[1]} ਸੰਭਵ ਤਰੀਕੇ ਹਨ:`);
  match = block.match(/^This gives (\d+) possible ways:$/);
  if (match) return tr(locale, `इससे ${match[1]} संभावित तरीके बनते हैं:`, `ਇਸ ਨਾਲ ${match[1]} ਸੰਭਵ ਤਰੀਕੇ ਬਣਦੇ ਹਨ:`);

  const clueMatch = block.match(/^(Start with clue|Now use clue|Clue|Step) (\d+): (.+)$/)
    ?? block.match(/^(\d+)\. (.+)$/);
  if (clueMatch) {
    const isNumbered = /^\d+\./.test(block);
    const rawNo = isNumbered ? clueMatch[1]! : clueMatch[2]!;
    const clueIndex = Number(rawNo) - 1;
    const localizedClue = candidate.clueTexts[clueIndex];
    if (!localizedClue) throw new Error(`${source.caseletId}: explanation parity cannot resolve clue ${rawNo}`);
    state.lastClueIndex = clueIndex;
    if (isNumbered) return `${rawNo}. ${localizedClue}`;
    const prefix = clueMatch[1]!;
    const localizedPrefix = prefix === "Start with clue"
      ? tr(locale, "संकेत", "ਸੰਕੇਤ")
      : prefix === "Now use clue"
        ? tr(locale, "अब संकेत", "ਹੁਣ ਸੰਕੇਤ")
        : prefix === "Step"
          ? tr(locale, "चरण", "ਕਦਮ")
          : tr(locale, "संकेत", "ਸੰਕੇਤ");
    return `${localizedPrefix} ${rawNo}: ${localizedClue}`;
  }

  if (block.startsWith("So: ")) {
    if (state.lastClueIndex === null) throw new Error(`${source.caseletId}: explanation parity action has no preceding clue`);
    const action = actions[state.lastClueIndex];
    if (!action) throw new Error(`${source.caseletId}: explanation parity missing action for clue ${state.lastClueIndex + 1}`);
    return `${tr(locale, "इसलिए", "ਇਸ ਲਈ")}: ${action}`;
  }

  const caseLines = block.split("\n").map((line) => translateCaseLine(line, locale));
  if (caseLines.every(Boolean)) return caseLines.join("\n");

  match = block.match(/^Only Case (\d+) is left\. Keep it and fill the empty seats\.$/);
  if (match) return tr(locale, `अब केवल स्थिति ${match[1]} बचती है। इसे बनाए रखें और खाली सीटें भरें।`, `ਹੁਣ ਸਿਰਫ਼ ਸਥਿਤੀ ${match[1]} ਬਚਦੀ ਹੈ। ਇਸਨੂੰ ਰੱਖੋ ਅਤੇ ਖਾਲੀ ਸੀਟਾਂ ਭਰੋ।`);
  match = block.match(/^Only Case (\d+) is left\. Keep those seats and fill the blanks\.$/);
  if (match) return tr(locale, `अब केवल स्थिति ${match[1]} बचती है। उन सीटों को बनाए रखें और खाली जगहें भरें।`, `ਹੁਣ ਸਿਰਫ਼ ਸਥਿਤੀ ${match[1]} ਬਚਦੀ ਹੈ। ਉਹਨਾਂ ਸੀਟਾਂ ਨੂੰ ਰੱਖੋ ਅਤੇ ਖਾਲੀ ਥਾਵਾਂ ਭਰੋ।`);
  match = block.match(/^We do not yet know which way ([A-Z][a-z]+) faces, so try both:$/);
  if (match) {
    const person = nativeName(match[1]!, locale);
    return tr(locale, `अभी ${person} की मुख-दिशा तय नहीं है, इसलिए दोनों स्थितियाँ आज़माएँ:`, `ਹਾਲੇ ${person} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਤੈਅ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਦੋਵੇਂ ਸਥਿਤੀਆਂ ਅਜ਼ਮਾਓ:`);
  }
  match = block.match(/^So ([A-Z][a-z]+) must face (north|south)\.$/);
  if (match) {
    const person = nativeName(match[1]!, locale);
    const facing = match[2] === "north" ? tr(locale, "उत्तर की ओर", "ਉੱਤਰ ਵੱਲ") : tr(locale, "दक्षिण की ओर", "ਦੱਖਣ ਵੱਲ");
    return tr(locale, `इसलिए ${person} का मुख ${facing} होना चाहिए।`, `ਇਸ ਲਈ ${person} ਦਾ ਮੂੰਹ ${facing} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`);
  }
  match = block.match(/^Clues (.+?) put these people together in this clockwise order: (.+?)\. Write them together in your circle\.$/);
  if (match) {
    const seq = localizeNames(match[2]!, locale);
    return tr(locale,
      `संकेत ${match[1]} इन व्यक्तियों को घड़ी की दिशा में इस क्रम में जोड़ते हैं: ${seq}। इन्हें गोल में साथ लिखें।`,
      `ਸੰਕੇਤ ${match[1]} ਇਨ੍ਹਾਂ ਵਿਅਕਤੀਆਂ ਨੂੰ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਇਸ ਕ੍ਰਮ ਵਿੱਚ ਜੋੜਦੇ ਹਨ: ${seq}। ਇਨ੍ਹਾਂ ਨੂੰ ਗੋਲ ਵਿੱਚ ਇਕੱਠੇ ਲਿਖੋ।`);
  }
  if (block === "Try this group in the empty seats. If one place makes the forbidden pair sit next to each other, that place is wrong. Use the other place.") {
    return tr(locale,
      "इस समूह को खाली सीटों में आज़माएँ। यदि किसी स्थान पर निषिद्ध जोड़ी साथ बैठ जाती है, वह स्थान गलत है। दूसरा स्थान लें।",
      "ਇਸ ਸਮੂਹ ਨੂੰ ਖਾਲੀ ਸੀਟਾਂ ਵਿੱਚ ਅਜ਼ਮਾਓ। ਜੇ ਕਿਸੇ ਥਾਂ 'ਤੇ ਮਨਾਹੀ ਵਾਲਾ ਜੋੜਾ ਨਾਲ ਬੈਠ ਜਾਂਦਾ ਹੈ, ਉਹ ਥਾਂ ਗਲਤ ਹੈ। ਦੂਜੀ ਥਾਂ ਲਵੋ।");
  }

  if (block.startsWith("Seat:") || block.includes("\nPerson:") || /^(\d+:|[A-Z][a-z]+[↘↗]?\s*→)/.test(block)) {
    return translateDiagram(block, locale);
  }

  throw new Error(`${source.caseletId}: explanation parity unsupported shared block: ${block}`);
}

function translateSharedExplanation(
  source: AuditCaselet,
  candidate: Sea001LocalizedReviewCaselet,
  locale: Sea001TranslatedLocale,
): string {
  const actions = extractNativeActions(candidate, locale);
  const sourceBlocks = source.sharedExplanation.split("\n\n").map((block) => block.trim()).filter(Boolean);
  const state: { lastClueIndex: number | null } = { lastClueIndex: null };
  const localizedBlocks = sourceBlocks.map((block) => translateSharedBlock(source, candidate, actions, block, locale, state));
  if (localizedBlocks.length !== sourceBlocks.length) {
    throw new Error(`${source.caseletId}: explanation parity changed shared block count`);
  }
  return localizedBlocks.join("\n\n");
}

function translateCorrectExplanation(child: AuditChild, locale: Sea001TranslatedLocale): string {
  const text = child.explanation;
  const people = namesIn(text).map((value) => nativeName(value, locale));
  const nums = [...text.matchAll(/\b\d+\b/g)].map((match) => match[0]!);
  switch (child.queryContractId) {
    case "SEA-QC-001":
      return tr(locale, `${people[0]} सीट ${nums[0]} पर है, जो बाएँ छोर की सीट है।`, `${people[0]} ਸੀਟ ${nums[0]} 'ਤੇ ਹੈ, ਜੋ ਖੱਬੇ ਸਿਰੇ ਵਾਲੀ ਸੀਟ ਹੈ।`);
    case "SEA-QC-002":
      return tr(locale, `${people[0]} को बाएँ छोर से गिनने पर वह सीट ${nums[0]} पर है, इसलिए उत्तर ${nums.at(-1)} है।`, `${people[0]} ਨੂੰ ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਗਿਣਣ 'ਤੇ ਉਹ ਸੀਟ ${nums[0]} 'ਤੇ ਹੈ, ਇਸ ਲਈ ਉੱਤਰ ${nums.at(-1)} ਹੈ।`);
    case "SEA-QC-003": {
      if (/All persons face the centre/.test(text)) return tr(locale, `सभी केंद्र की ओर मुख किए हैं, इसलिए बायाँ घड़ी की दिशा है। ${people[0]} से घड़ी की दिशा में दो सीट आगे जाने पर ${people[1]} मिलता है।`, `ਸਾਰੇ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ ਖੱਬਾ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਹੈ। ${people[0]} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਦੋ ਸੀਟਾਂ ਅੱਗੇ ਜਾਣ 'ਤੇ ${people[1]} ਮਿਲਦਾ ਹੈ।`);
      if (/Everyone faces outward/.test(text)) return tr(locale, `सभी बाहर की ओर मुख किए हैं, इसलिए बायाँ घड़ी की विपरीत दिशा है। ${people[0]} से घड़ी की विपरीत दिशा में दो सीट आगे जाने पर ${people[1]} मिलता है।`, `ਸਾਰੇ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ ਖੱਬਾ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਹੈ। ${people[0]} ਤੋਂ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਦੋ ਸੀਟਾਂ ਅੱਗੇ ਜਾਣ 'ਤੇ ${people[1]} ਮਿਲਦਾ ਹੈ।`);
      const rawFacing = text.includes("faces north") ? "north" : text.includes("faces south") ? "south" : text.includes("faces the centre") ? "centre" : text.includes("faces outward") ? "outward" : undefined;
      if (!rawFacing) break;
      const facing = rawFacing === "north" ? tr(locale, "उत्तर की ओर", "ਉੱਤਰ ਵੱਲ") : rawFacing === "south" ? tr(locale, "दक्षिण की ओर", "ਦੱਖਣ ਵੱਲ") : rawFacing === "centre" ? tr(locale, "केंद्र की ओर", "ਕੇਂਦਰ ਵੱਲ") : tr(locale, "बाहर की ओर", "ਬਾਹਰ ਵੱਲ");
      if (/count two seats to the right/.test(text)) return tr(locale, `${people[0]} का मुख ${facing} है। उसकी दिशा के अनुसार दाईं ओर दो सीट गिनने पर ${people.at(-1)} मिलता है।`, `${people[0]} ਦਾ ਮੂੰਹ ${facing} ਹੈ। ਉਸਦੀ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਸੱਜੇ ਪਾਸੇ ਦੋ ਸੀਟਾਂ ਗਿਣਣ 'ਤੇ ${people.at(-1)} ਮਿਲਦਾ ਹੈ।`);
      const side = /left is/.test(text) ? tr(locale, "बायाँ", "ਖੱਬਾ") : tr(locale, "दायाँ", "ਸੱਜਾ");
      const physical = /towards the left end/.test(text) ? tr(locale, "पंक्ति के बाएँ छोर की ओर", "ਕਤਾਰ ਦੇ ਖੱਬੇ ਸਿਰੇ ਵੱਲ") : /towards the right end/.test(text) ? tr(locale, "पंक्ति के दाएँ छोर की ओर", "ਕਤਾਰ ਦੇ ਸੱਜੇ ਸਿਰੇ ਵੱਲ") : /clockwise/.test(text) && !/anticlockwise/.test(text) ? tr(locale, "घड़ी की दिशा में", "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ") : tr(locale, "घड़ी की विपरीत दिशा में", "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ");
      return tr(locale, `${people[0]} का मुख ${facing} है। इसलिए उसका ${side} ${physical} है। उस दिशा में दो सीट आगे जाने पर ${people.at(-1)} मिलता है।`, `${people[0]} ਦਾ ਮੂੰਹ ${facing} ਹੈ। ਇਸ ਲਈ ਉਸਦਾ ${side} ${physical} ਹੈ। ਉਸ ਦਿਸ਼ਾ ਵਿੱਚ ਦੋ ਸੀਟਾਂ ਅੱਗੇ ਜਾਣ 'ਤੇ ${people.at(-1)} ਮਿਲਦਾ ਹੈ।`);
    }
    case "SEA-QC-004":
      return tr(locale, `${people[0]} से घड़ी की दिशा में दो सीट गिनें। ${people[1]} मिलता है। प्रश्न में दिशा पहले से दी है, इसलिए यहाँ मुख-दिशा का असर नहीं पड़ता।`, `${people[0]} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਦੋ ਸੀਟਾਂ ਗਿਣੋ। ${people[1]} ਮਿਲਦਾ ਹੈ। ਸਵਾਲ ਵਿੱਚ ਦਿਸ਼ਾ ਪਹਿਲਾਂ ਹੀ ਦਿੱਤੀ ਹੈ, ਇਸ ਲਈ ਇੱਥੇ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਦਾ ਅਸਰ ਨਹੀਂ ਪੈਂਦਾ।`);
    case "SEA-QC-005": {
      const facing = text.includes("faces north") ? tr(locale, "उत्तर की ओर", "ਉੱਤਰ ਵੱਲ") : text.includes("faces south") ? tr(locale, "दक्षिण की ओर", "ਦੱਖਣ ਵੱਲ") : text.includes("faces the centre") ? tr(locale, "केंद्र की ओर", "ਕੇਂਦਰ ਵੱਲ") : tr(locale, "बाहर की ओर", "ਬਾਹਰ ਵੱਲ");
      if (/Applying that person's right direction by one seat/.test(text)) return tr(locale, `${people[0]} का मुख ${facing} है। उसकी दाईं दिशा में एक सीट जाने पर ${people[1]} मिलता है।`, `${people[0]} ਦਾ ਮੂੰਹ ${facing} ਹੈ। ਉਸਦੀ ਸੱਜੀ ਦਿਸ਼ਾ ਵਿੱਚ ਇੱਕ ਸੀਟ ਜਾਣ 'ਤੇ ${people[1]} ਮਿਲਦਾ ਹੈ।`);
      const dir = /towards the left end/.test(text) ? tr(locale, "पंक्ति के बाएँ छोर की ओर", "ਕਤਾਰ ਦੇ ਖੱਬੇ ਸਿਰੇ ਵੱਲ") : /towards the right end/.test(text) ? tr(locale, "पंक्ति के दाएँ छोर की ओर", "ਕਤਾਰ ਦੇ ਸੱਜੇ ਸਿਰੇ ਵੱਲ") : /anticlockwise/.test(text) ? tr(locale, "घड़ी की विपरीत दिशा में", "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ") : tr(locale, "घड़ी की दिशा में", "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ");
      return tr(locale, `${people[0]} का मुख ${facing} है। इसलिए उसका दायाँ ${dir} है, जहाँ ${people.at(-1)} है।`, `${people[0]} ਦਾ ਮੂੰਹ ${facing} ਹੈ। ਇਸ ਲਈ ਉਸਦਾ ਸੱਜਾ ${dir} ਹੈ, ਜਿੱਥੇ ${people.at(-1)} ਹੈ।`);
    }
    case "SEA-QC-006":
      return text.includes("For neighbours")
        ? tr(locale, `${people[0]} और ${people[1]}, ${people[2]} के दोनों साथ वाली सीटों पर हैं। पड़ोसी तय करने में मुख-दिशा का असर नहीं पड़ता।`, `${people[0]} ਅਤੇ ${people[1]}, ${people[2]} ਦੇ ਦੋਵੇਂ ਨਾਲ ਵਾਲੀਆਂ ਸੀਟਾਂ 'ਤੇ ਹਨ। ਨੇੜਲੇ ਵਿਅਕਤੀ ਤੈਅ ਕਰਨ ਵਿੱਚ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਦਾ ਅਸਰ ਨਹੀਂ ਪੈਂਦਾ।`)
        : tr(locale, `${people[0]} और ${people[1]}, ${people[2]} के दोनों साथ वाली सीटों पर हैं।`, `${people[0]} ਅਤੇ ${people[1]}, ${people[2]} ਦੇ ਦੋਵੇਂ ਨਾਲ ਵਾਲੀਆਂ ਸੀਟਾਂ 'ਤੇ ਹਨ।`);
    case "SEA-QC-008":
      if (text.startsWith("Count only")) return tr(locale, `${people[0]} और ${people[1]} के बीच की सीटें ही गिनें। संख्या ${nums[0]} है।`, `${people[0]} ਅਤੇ ${people[1]} ਦੇ ਵਿਚਕਾਰ ਵਾਲੀਆਂ ਸੀਟਾਂ ਹੀ ਗਿਣੋ। ਗਿਣਤੀ ${nums[0]} ਹੈ।`);
      return tr(locale, `${people[0]} और ${people[1]} के बीच दूरी ${nums[0]} सीट है, इसलिए ${nums[1]} − ${nums[2]} = ${nums[3]} व्यक्ति उनके बीच बैठते हैं।`, `${people[0]} ਅਤੇ ${people[1]} ਵਿਚਕਾਰ ਦੂਰੀ ${nums[0]} ਸੀਟਾਂ ਹੈ, ਇਸ ਲਈ ${nums[1]} − ${nums[2]} = ${nums[3]} ਵਿਅਕਤੀ ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ਬੈਠਦੇ ਹਨ।`);
    case "SEA-QC-009":
      return tr(locale, `घड़ी की दिशा में गिनने पर दूसरा व्यक्ति ${nums[0]} सीट आगे है। केवल बीच के व्यक्तियों को गिनें, इसलिए उत्तर ${nums[1]} है।`, `ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਗਿਣਣ 'ਤੇ ਦੂਜਾ ਵਿਅਕਤੀ ${nums[0]} ਸੀਟਾਂ ਅੱਗੇ ਹੈ। ਸਿਰਫ਼ ਵਿਚਕਾਰ ਵਾਲੇ ਵਿਅਕਤੀਆਂ ਨੂੰ ਗਿਣੋ, ਇਸ ਲਈ ਉੱਤਰ ${nums[1]} ਹੈ।`);
    case "SEA-QC-010":
      return tr(locale, `${nums[0]} सीटों के गोल में सामने वाली सीट आधे गोल पर, यानी ${nums[1]} सीट दूर होती है। वहाँ ${people[0]} है।`, `${nums[0]} ਸੀਟਾਂ ਦੇ ਗੋਲ ਵਿੱਚ ਸਾਹਮਣੇ ਵਾਲੀ ਸੀਟ ਅੱਧੇ ਗੋਲ 'ਤੇ, ਅਰਥਾਤ ${nums[1]} ਸੀਟਾਂ ਦੂਰ ਹੁੰਦੀ ਹੈ। ਉੱਥੇ ${people[0]} ਹੈ।`);
    case "SEA-QC-015": {
      const facing = text.includes("faces north") ? tr(locale, "उत्तर की ओर", "ਉੱਤਰ ਵੱਲ") : tr(locale, "दक्षिण की ओर", "ਦੱਖਣ ਵੱਲ");
      const relationMatch = text.match(/So [A-Z][a-z]+ is (.+?) of [A-Z][a-z]+\.$/) ?? text.match(/is (second to the (?:left|right))\.$/);
      if (!relationMatch) break;
      const relation = relationPhrase(relationMatch[1]!, locale);
      if (people.length >= 3 && nums.length) return tr(locale, `${people[0]} का मुख ${facing} है। ${people[1]} की ओर से देखें तो ${people[2]} ${nums[0]} सीट की दूरी पर है। इसलिए ${people[2]}, ${people.at(-1)} के ${relation} है।`, `${people[0]} ਦਾ ਮੂੰਹ ${facing} ਹੈ। ${people[1]} ਦੀ ਪਾਸੇ ਤੋਂ ਵੇਖੋ ਤਾਂ ${people[2]} ${nums[0]} ਸੀਟਾਂ ਦੀ ਦੂਰੀ 'ਤੇ ਹੈ। ਇਸ ਲਈ ${people[2]}, ${people.at(-1)} ਦੇ ${relation} ਹੈ।`);
      return tr(locale, `${people[0]} का मुख ${facing} है। उसकी ओर से देखने पर ${people[1]} ${relation} है।`, `${people[0]} ਦਾ ਮੂੰਹ ${facing} ਹੈ। ਉਸਦੀ ਪਾਸੇ ਤੋਂ ਵੇਖਣ 'ਤੇ ${people[1]} ${relation} ਹੈ।`);
    }
    case "SEA-QC-016":
      return tr(locale, `${people[0]} और ${people[1]} अंतिम पंक्ति में साथ बैठे हैं, इसलिए यह कथन सही है।`, `${people[0]} ਅਤੇ ${people[1]} ਅੰਤਿਮ ਕਤਾਰ ਵਿੱਚ ਨਾਲ ਬੈਠੇ ਹਨ, ਇਸ ਲਈ ਇਹ ਕਥਨ ਸਹੀ ਹੈ।`);
    case "SEA-QC-017":
      return tr(locale, `${people[0]}, ${people[1]} और ${people[2]} के बीच है। इसलिए ${people[3]} और ${people[4]} साथ नहीं बैठे; यही कथन गलत है।`, `${people[0]}, ${people[1]} ਅਤੇ ${people[2]} ਦੇ ਵਿਚਕਾਰ ਹੈ। ਇਸ ਲਈ ${people[3]} ਅਤੇ ${people[4]} ਨਾਲ ਨਹੀਂ ਬੈਠੇ; ਇਹੀ ਕਥਨ ਗਲਤ ਹੈ।`);
    case "SEA-QC-019":
      return tr(locale, `${people[0]} और ${people[1]} के बीच ठीक एक व्यक्ति है, जबकि बाकी तीन जोड़ियाँ पास-पास हैं। इसलिए यही अलग जोड़ी है।`, `${people[0]} ਅਤੇ ${people[1]} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ਇੱਕ ਵਿਅਕਤੀ ਹੈ, ਜਦਕਿ ਬਾਕੀ ਤਿੰਨ ਜੋੜੇ ਨਾਲ-ਨਾਲ ਹਨ। ਇਸ ਲਈ ਇਹੀ ਵੱਖਰਾ ਜੋੜਾ ਹੈ।`);
    case "SEA-QC-020":
      return text.startsWith("Starting")
        ? tr(locale, `${people[0]} के ठीक बाद घड़ी की दिशा में अगले तीन व्यक्ति ${people[1]}, ${people[2]}, ${people[3]} हैं।`, `${people[0]} ਤੋਂ ਬਿਲਕੁਲ ਬਾਅਦ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅਗਲੇ ਤਿੰਨ ਵਿਅਕਤੀ ${people[1]}, ${people[2]}, ${people[3]} ਹਨ।`)
        : tr(locale, `अंतिम पंक्ति को बाएँ छोर से पढ़ने पर पहले तीन व्यक्ति ${people[0]} → ${people[1]} → ${people[2]} हैं।`, `ਅੰਤਿਮ ਕਤਾਰ ਨੂੰ ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਪੜ੍ਹਣ 'ਤੇ ਪਹਿਲੇ ਤਿੰਨ ਵਿਅਕਤੀ ${people[0]} → ${people[1]} → ${people[2]} ਹਨ।`);
    case "SEA-QC-021":
      return tr(locale, `${people[0]} बाएँ छोर की सीट छोड़ता है और अदला-बदली में ${people[1]} वहाँ आ जाता है। इसलिए बाद में बाएँ छोर पर ${people[2]} है।`, `${people[0]} ਖੱਬੇ ਸਿਰੇ ਵਾਲੀ ਸੀਟ ਛੱਡਦਾ ਹੈ ਅਤੇ ਅਦਲਾ-ਬਦਲੀ ਵਿੱਚ ${people[1]} ਉੱਥੇ ਆ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ਬਾਅਦ ਵਿੱਚ ਖੱਬੇ ਸਿਰੇ 'ਤੇ ${people[2]} ਹੈ।`);
    case "SEA-QC-022": {
      const original = text.includes("originally faces the centre") ? tr(locale, "केंद्र की ओर", "ਕੇਂਦਰ ਵੱਲ") : tr(locale, "बाहर की ओर", "ਬਾਹਰ ਵੱਲ");
      const after = text.includes("faces outward") ? tr(locale, "बाहर की ओर", "ਬਾਹਰ ਵੱਲ") : tr(locale, "केंद्र की ओर", "ਕੇਂਦਰ ਵੱਲ");
      const leftDir = text.includes("left is anticlockwise") ? tr(locale, "घड़ी की विपरीत दिशा", "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ") : tr(locale, "घड़ी की दिशा", "ਘੜੀ ਦੀ ਦਿਸ਼ਾ");
      return tr(locale, `${people[0]} पहले ${original} मुख किए है; सभी की मुख-दिशा बदलने पर उसका मुख ${after} हो जाता है। नई दिशा में बायाँ ${leftDir} है, इसलिए बाईं ओर दूसरा व्यक्ति ${people.at(-1)} है।`, `${people[0]} ਦਾ ਮੂੰਹ ਪਹਿਲਾਂ ${original} ਹੈ; ਸਭ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਬਦਲਣ 'ਤੇ ਉਸਦਾ ਮੂੰਹ ${after} ਹੋ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਦਿਸ਼ਾ ਵਿੱਚ ਖੱਬਾ ${leftDir} ਹੈ, ਇਸ ਲਈ ਖੱਬੇ ਪਾਸੇ ਦੂਜਾ ਵਿਅਕਤੀ ${people.at(-1)} ਹੈ।`);
    }
  }
  throw new Error(`SEA-001 explanation parity unsupported correct explanation ${child.queryContractId}: ${text}`);
}

const EXACT_WRONG: Readonly<Record<string, readonly [string, string]>> = Object.freeze({
  "This moves one seat too far.": ["यह एक सीट अधिक आगे चला जाता है।", "ਇਹ ਇੱਕ ਸੀਟ ਵੱਧ ਅੱਗੇ ਚਲਾ ਜਾਂਦਾ ਹੈ।"],
  "This wrongly counts the person named in the question.": ["इसमें प्रश्न में दिए व्यक्ति को भी गलत तरीके से गिन लिया गया है।", "ਇਸ ਵਿੱਚ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੇ ਵਿਅਕਤੀ ਨੂੰ ਵੀ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਗਿਣ ਲਿਆ ਗਿਆ ਹੈ।"],
  "This stops one seat early.": ["यह एक सीट पहले रुक जाता है।", "ਇਹ ਇੱਕ ਸੀਟ ਪਹਿਲਾਂ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  "This wrongly counts one of the named people.": ["इसमें दिए गए दो व्यक्तियों में से एक को भी गलत तरीके से गिन लिया गया है।", "ਇਸ ਵਿੱਚ ਦਿੱਤੇ ਦੋ ਵਿਅਕਤੀਆਂ ਵਿੱਚੋਂ ਇੱਕ ਨੂੰ ਵੀ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਗਿਣ ਲਿਆ ਗਿਆ ਹੈ।"],
  "A person cannot be their own neighbour.": ["कोई व्यक्ति स्वयं अपना पड़ोसी नहीं हो सकता।", "ਕੋਈ ਵਿਅਕਤੀ ਖੁਦ ਆਪਣਾ ਨੇੜਲਾ ਵਿਅਕਤੀ ਨਹੀਂ ਹੋ ਸਕਦਾ।"],
  "Both persons were selected from the same side.": ["दोनों व्यक्तियों को एक ही ओर से चुन लिया गया है।", "ਦੋਵੇਂ ਵਿਅਕਤੀਆਂ ਨੂੰ ਇੱਕੋ ਪਾਸੇ ਤੋਂ ਚੁਣ ਲਿਆ ਗਿਆ ਹੈ।"],
  "Both persons were selected from one side.": ["दोनों व्यक्तियों को एक ही ओर से चुन लिया गया है।", "ਦੋਵੇਂ ਵਿਅਕਤੀਆਂ ਨੂੰ ਇੱਕੋ ਪਾਸੇ ਤੋਂ ਚੁਣ ਲਿਆ ਗਿਆ ਹੈ।"],
  "This selects a neighbour.": ["यह सामने वाले व्यक्ति के बजाय पड़ोसी को चुनता है।", "ਇਹ ਸਾਹਮਣੇ ਵਾਲੇ ਵਿਅਕਤੀ ਦੀ ਥਾਂ ਨੇੜਲੇ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਦਾ ਹੈ।"],
  "This selects the other neighbour.": ["यह सामने वाले व्यक्ति के बजाय दूसरे पड़ोसी को चुनता है।", "ਇਹ ਸਾਹਮਣੇ ਵਾਲੇ ਵਿਅਕਤੀ ਦੀ ਥਾਂ ਦੂਜੇ ਨੇੜਲੇ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਦਾ ਹੈ।"],
  "This stops after one seat.": ["यह केवल एक सीट के बाद रुक जाता है।", "ਇਹ ਸਿਰਫ਼ ਇੱਕ ਸੀਟ ਤੋਂ ਬਾਅਦ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  "This counts in the other direction around the circle.": ["यह गोल में मांगी गई दिशा के बजाय दूसरी दिशा में गिनता है।", "ਇਹ ਗੋਲ ਵਿੱਚ ਪੁੱਛੀ ਦਿਸ਼ਾ ਦੀ ਥਾਂ ਦੂਜੀ ਦਿਸ਼ਾ ਵਿੱਚ ਗਿਣਦਾ ਹੈ।"],
  "This moves one seat beyond the opposite seat.": ["यह सामने वाली सीट से एक सीट आगे चला जाता है।", "ਇਹ ਸਾਹਮਣੇ ਵਾਲੀ ਸੀਟ ਤੋਂ ਇੱਕ ਸੀਟ ਅੱਗੇ ਚਲਾ ਜਾਂਦਾ ਹੈ।"],
  "This reverses left and right for that person's facing.": ["यह उस व्यक्ति की मुख-दिशा के अनुसार बाएँ और दाएँ को उलट देता है।", "ਇਹ ਉਸ ਵਿਅਕਤੀ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ।"],
  "This is one less than the number of intervening persons.": ["यह बीच में बैठे व्यक्तियों की सही संख्या से एक कम है।", "ਇਹ ਵਿਚਕਾਰ ਬੈਠੇ ਵਿਅਕਤੀਆਂ ਦੀ ਸਹੀ ਗਿਣਤੀ ਤੋਂ ਇੱਕ ਘੱਟ ਹੈ।"],
  "This counts both named named person as well as the persons between them.": ["यह बीच के व्यक्तियों के साथ दोनों दिए व्यक्तियों को भी गिन लेता है।", "ਇਹ ਵਿਚਕਾਰ ਵਾਲੇ ਵਿਅਕਤੀਆਂ ਨਾਲ ਦੋਵੇਂ ਦਿੱਤੇ ਵਿਅਕਤੀਆਂ ਨੂੰ ਵੀ ਗਿਣ ਲੈਂਦਾ ਹੈ।"],
  "This is one more than the number of intervening persons.": ["यह बीच में बैठे व्यक्तियों की सही संख्या से एक अधिक है।", "ਇਹ ਵਿਚਕਾਰ ਬੈਠੇ ਵਿਅਕਤੀਆਂ ਦੀ ਸਹੀ ਗਿਣਤੀ ਤੋਂ ਇੱਕ ਵੱਧ ਹੈ।"],
  "This moves one seat too far from the person named in the question.": ["यह प्रश्न में दिए व्यक्ति से एक सीट अधिक आगे चला जाता है।", "ਇਹ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੇ ਵਿਅਕਤੀ ਤੋਂ ਇੱਕ ਸੀਟ ਵੱਧ ਅੱਗੇ ਚਲਾ ਜਾਂਦਾ ਹੈ।"],
  "This stops at the immediate right instead of moving two seats.": ["यह दो सीट चलने के बजाय ठीक दाईं वाली सीट पर रुक जाता है।", "ਇਹ ਦੋ ਸੀਟਾਂ ਜਾਣ ਦੀ ਥਾਂ ਬਿਲਕੁਲ ਸੱਜੀ ਸੀਟ 'ਤੇ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  "This moves away from the requested end before reading the occupant.": ["यह मांगे गए छोर की सीट पढ़ने से पहले उससे दूर चला जाता है।", "ਇਹ ਪੁੱਛੇ ਗਏ ਸਿਰੇ ਦੀ ਸੀਟ ਪੜ੍ਹਣ ਤੋਂ ਪਹਿਲਾਂ ਉਸ ਤੋਂ ਦੂਰ ਚਲਾ ਜਾਂਦਾ ਹੈ।"],
  "This chooses the occupant one seat away from the left end.": ["यह बाएँ छोर के बजाय उससे एक सीट दूर बैठे व्यक्ति को चुनता है।", "ਇਹ ਖੱਬੇ ਸਿਰੇ ਦੀ ਥਾਂ ਉਸ ਤੋਂ ਇੱਕ ਸੀਟ ਦੂਰ ਬੈਠੇ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਦਾ ਹੈ।"],
  "This chooses the person at the opposite end of the row.": ["यह मांगे गए बाएँ छोर के बजाय पंक्ति के दूसरे छोर वाले व्यक्ति को चुनता है।", "ਇਹ ਪੁੱਛੇ ਖੱਬੇ ਸਿਰੇ ਦੀ ਥਾਂ ਕਤਾਰ ਦੇ ਦੂਜੇ ਸਿਰੇ ਵਾਲੇ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਦਾ ਹੈ।"],
  "This stops after one seat instead of two.": ["यह दो सीट चलने के बजाय एक सीट के बाद रुक जाता है।", "ਇਹ ਦੋ ਸੀਟਾਂ ਜਾਣ ਦੀ ਥਾਂ ਇੱਕ ਸੀਟ ਤੋਂ ਬਾਅਦ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  "This skips the person sitting immediately next to them on one side.": ["यह एक ओर ठीक साथ बैठे व्यक्ति को छोड़ देता है।", "ਇਹ ਇੱਕ ਪਾਸੇ ਬਿਲਕੁਲ ਨਾਲ ਬੈਠੇ ਵਿਅਕਤੀ ਨੂੰ ਛੱਡ ਦਿੰਦਾ ਹੈ।"],
  "Everyone faces the centre, so left is clockwise and right is anticlockwise. This option uses the opposite side.": ["सभी केंद्र की ओर मुख किए हैं, इसलिए बायाँ घड़ी की दिशा और दायाँ घड़ी की विपरीत दिशा है। यह विकल्प उलटी ओर चला जाता है।", "ਸਾਰੇ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ ਖੱਬਾ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਅਤੇ ਸੱਜਾ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਹੈ। ਇਹ ਵਿਕਲਪ ਉਲਟੇ ਪਾਸੇ ਚਲਾ ਜਾਂਦਾ ਹੈ।"],
  "Everyone faces outward, so left is anticlockwise. This option uses the wrong side.": ["सभी बाहर की ओर मुख किए हैं, इसलिए बायाँ घड़ी की विपरीत दिशा है। यह विकल्प गलत ओर चला जाता है।", "ਸਾਰੇ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ ਖੱਬਾ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਹੈ। ਇਹ ਵਿਕਲਪ ਗਲਤ ਪਾਸੇ ਚਲਾ ਜਾਂਦਾ ਹੈ।"],
  "This wrongly counts both named people.": ["यह दिए गए दोनों व्यक्तियों को भी गलत तरीके से गिन लेता है।", "ਇਹ ਦਿੱਤੇ ਦੋਵੇਂ ਵਿਅਕਤੀਆਂ ਨੂੰ ਵੀ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਗਿਣ ਲੈਂਦਾ ਹੈ।"],
  "This selects the immediate left person instead.": ["यह मांगे गए व्यक्ति के बजाय ठीक बाईं ओर वाले व्यक्ति को चुनता है।", "ਇਹ ਪੁੱਛੇ ਵਿਅਕਤੀ ਦੀ ਥਾਂ ਬਿਲਕੁਲ ਖੱਬੇ ਪਾਸੇ ਵਾਲੇ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਦਾ ਹੈ।"],
  "This moves two seats rather than one.": ["यह एक सीट के बजाय दो सीट चल देता है।", "ਇਹ ਇੱਕ ਸੀਟ ਦੀ ਥਾਂ ਦੋ ਸੀਟਾਂ ਚਲਾ ਜਾਂਦਾ ਹੈ।"],
  "This skips the immediate neighbour on the other side.": ["यह दूसरी ओर के ठीक पड़ोसी को छोड़ देता है।", "ਇਹ ਦੂਜੇ ਪਾਸੇ ਦੇ ਬਿਲਕੁਲ ਨੇੜਲੇ ਵਿਅਕਤੀ ਨੂੰ ਛੱਡ ਦਿੰਦਾ ਹੈ।"],
  "This skips both immediate seats.": ["यह दोनों ठीक साथ वाली सीटों को छोड़ देता है।", "ਇਹ ਦੋਵੇਂ ਬਿਲਕੁਲ ਨਾਲ ਵਾਲੀਆਂ ਸੀਟਾਂ ਨੂੰ ਛੱਡ ਦਿੰਦਾ ਹੈ।"],
  "Both persons were selected from the clockwise side.": ["दोनों व्यक्तियों को घड़ी की दिशा वाली एक ही ओर से चुन लिया गया है।", "ਦੋਵੇਂ ਵਿਅਕਤੀਆਂ ਨੂੰ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਾਲੇ ਇੱਕੋ ਪਾਸੇ ਤੋਂ ਚੁਣ ਲਿਆ ਗਿਆ ਹੈ।"],
  "Both persons were selected from the anticlockwise side.": ["दोनों व्यक्तियों को घड़ी की विपरीत दिशा वाली एक ही ओर से चुन लिया गया है।", "ਦੋਵੇਂ ਵਿਅਕਤੀਆਂ ਨੂੰ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਾਲੇ ਇੱਕੋ ਪਾਸੇ ਤੋਂ ਚੁਣ ਲਿਆ ਗਿਆ ਹੈ।"],
  "This goes the wrong way around the circle.": ["यह गोल में गलत दिशा में चलता है।", "ਇਹ ਗੋਲ ਵਿੱਚ ਗਲਤ ਦਿਸ਼ਾ ਵੱਲ ਚਲਦਾ ਹੈ।"],
  "This stops one seat too early.": ["यह सही सीट से एक सीट पहले रुक जाता है।", "ਇਹ ਸਹੀ ਸੀਟ ਤੋਂ ਇੱਕ ਸੀਟ ਪਹਿਲਾਂ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  "This misses one person between the named person.": ["यह बीच में बैठे एक व्यक्ति को गिनने से छोड़ देता है।", "ਇਹ ਵਿਚਕਾਰ ਬੈਠੇ ਇੱਕ ਵਿਅਕਤੀ ਨੂੰ ਗਿਣਣ ਤੋਂ ਛੱਡ ਦਿੰਦਾ ਹੈ।"],
  "This stops after the immediate seat.": ["यह ठीक अगली सीट पर ही रुक जाता है।", "ਇਹ ਬਿਲਕੁਲ ਅਗਲੀ ਸੀਟ 'ਤੇ ਹੀ ਰੁਕ ਜਾਂਦਾ ਹੈ।"],
  "This moves anticlockwise instead of clockwise.": ["यह घड़ी की दिशा के बजाय घड़ी की विपरीत दिशा में चलता है।", "ਇਹ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਦੀ ਥਾਂ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਚਲਦਾ ਹੈ।"],
  "These two people really do sit next to each other, so this statement is true. The question asks for the false statement.": ["ये दोनों वास्तव में साथ बैठे हैं, इसलिए यह कथन सही है। प्रश्न गलत कथन पूछता है।", "ਇਹ ਦੋਵੇਂ ਵਾਸਤਵ ਵਿੱਚ ਨਾਲ ਬੈਠੇ ਹਨ, ਇਸ ਲਈ ਇਹ ਕਥਨ ਸਹੀ ਹੈ। ਸਵਾਲ ਗਲਤ ਕਥਨ ਪੁੱਛਦਾ ਹੈ।"],
  "This includes both named persons.": ["यह दोनों दिए व्यक्तियों को भी गिनता है।", "ਇਹ ਦੋਵੇਂ ਦਿੱਤੇ ਵਿਅਕਤੀਆਂ ਨੂੰ ਵੀ ਗਿਣਦਾ ਹੈ।"],
  "This skips the immediate clockwise person.": ["यह घड़ी की दिशा में ठीक अगले व्यक्ति को छोड़ देता है।", "ਇਹ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਬਿਲਕੁਲ ਅਗਲੇ ਵਿਅਕਤੀ ਨੂੰ ਛੱਡ ਦਿੰਦਾ ਹੈ।"],
  "This includes the person named in the question.": ["यह प्रश्न में दिए व्यक्ति को भी क्रम में शामिल कर लेता है।", "ਇਹ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੇ ਵਿਅਕਤੀ ਨੂੰ ਵੀ ਕ੍ਰਮ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰ ਲੈਂਦਾ ਹੈ।"],
  "This moves one seat beyond the opposite position.": ["यह सामने वाली स्थिति से एक सीट आगे चला जाता है।", "ਇਹ ਸਾਹਮਣੇ ਵਾਲੀ ਸਥਿਤੀ ਤੋਂ ਇੱਕ ਸੀਟ ਅੱਗੇ ਚਲਾ ਜਾਂਦਾ ਹੈ।"],
  "This statement is true because the two persons occupy consecutive seats; the question asks for the false statement.": ["यह कथन सही है क्योंकि दोनों व्यक्ति लगातार सीटों पर बैठे हैं; प्रश्न गलत कथन पूछता है।", "ਇਹ ਕਥਨ ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਦੋਵੇਂ ਵਿਅਕਤੀ ਲਗਾਤਾਰ ਸੀਟਾਂ 'ਤੇ ਬੈਠੇ ਹਨ; ਸਵਾਲ ਗਲਤ ਕਥਨ ਪੁੱਛਦਾ ਹੈ।"],
  "This gives the wrong seat number.": ["यह गलत सीट क्रमांक देता है।", "ਇਹ ਗਲਤ ਸੀਟ ਨੰਬਰ ਦਿੰਦਾ ਹੈ।"],
  "This reverses the correct sequence.": ["यह सही क्रम को उलट देता है।", "ਇਹ ਸਹੀ ਕ੍ਰਮ ਨੂੰ ਉਲਟ ਦਿੰਦਾ ਹੈ।"],
  "the person named in the question cannot be their own immediate-right neighbour.": ["प्रश्न में दिया व्यक्ति स्वयं अपना ठीक-दायाँ पड़ोसी नहीं हो सकता।", "ਸਵਾਲ ਵਿੱਚ ਦਿੱਤਾ ਵਿਅਕਤੀ ਖੁਦ ਆਪਣਾ ਬਿਲਕੁਲ-ਸੱਜਾ ਨੇੜਲਾ ਵਿਅਕਤੀ ਨਹੀਂ ਹੋ ਸਕਦਾ।"],
  "This moves two seats instead of stopping at the immediate seat.": ["यह ठीक अगली सीट पर रुकने के बजाय दो सीट चलता है।", "ਇਹ ਬਿਲਕੁਲ ਅਗਲੀ ਸੀਟ 'ਤੇ ਰੁਕਣ ਦੀ ਥਾਂ ਦੋ ਸੀਟਾਂ ਚਲਦਾ ਹੈ।"],
  "This follows the person named in the question's left instead of right.": ["यह प्रश्न में दिए व्यक्ति के दाएँ के बजाय बाएँ ओर चलता है।", "ਇਹ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੇ ਵਿਅਕਤੀ ਦੇ ਸੱਜੇ ਦੀ ਥਾਂ ਖੱਬੇ ਪਾਸੇ ਜਾਂਦਾ ਹੈ।"],
  "This counts the person's position from the opposite end.": ["यह व्यक्ति की स्थिति को मांगे गए छोर के बजाय दूसरे छोर से गिनता है।", "ਇਹ ਵਿਅਕਤੀ ਦੀ ਸਥਿਤੀ ਨੂੰ ਪੁੱਛੇ ਸਿਰੇ ਦੀ ਥਾਂ ਦੂਜੇ ਸਿਰੇ ਤੋਂ ਗਿਣਦਾ ਹੈ।"],
  "This selects another solved-row occupant rather than the person moved into the left-end seat.": ["यह अदला-बदली के बाद बाएँ छोर पर आए व्यक्ति के बजाय पंक्ति के किसी दूसरे व्यक्ति को चुनता है।", "ਇਹ ਅਦਲਾ-ਬਦਲੀ ਤੋਂ ਬਾਅਦ ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਆਏ ਵਿਅਕਤੀ ਦੀ ਥਾਂ ਕਤਾਰ ਦੇ ਕਿਸੇ ਹੋਰ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਦਾ ਹੈ।"],
  "This counts only one seat instead of two.": ["यह दो सीट के बजाय केवल एक सीट गिनता है।", "ਇਹ ਦੋ ਸੀਟਾਂ ਦੀ ਥਾਂ ਸਿਰਫ਼ ਇੱਕ ਸੀਟ ਗਿਣਦਾ ਹੈ।"],
  "This counts one seat too far.": ["यह एक सीट अधिक गिनता है।", "ਇਹ ਇੱਕ ਸੀਟ ਵੱਧ ਗਿਣਦਾ ਹੈ।"],
  "This reads the same three seats in the reverse order.": ["यह उन्हीं तीन सीटों को उलटे क्रम में पढ़ता है।", "ਇਹ ਉਹੀ ਤਿੰਨ ਸੀਟਾਂ ਨੂੰ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹਦਾ ਹੈ।"],
  "This starts one seat after the left end.": ["यह बाएँ छोर से एक सीट बाद शुरू करता है।", "ਇਹ ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਇੱਕ ਸੀਟ ਬਾਅਦ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ।"],
  "This interchanges the second and third occupants.": ["यह दूसरे और तीसरे व्यक्ति का क्रम आपस में बदल देता है।", "ਇਹ ਦੂਜੇ ਅਤੇ ਤੀਜੇ ਵਿਅਕਤੀ ਦਾ ਕ੍ਰਮ ਆਪਸ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ।"],
  "This leaves the original left-end occupant in place and does not apply the exchange.": ["यह मूल बाएँ-छोर वाले व्यक्ति को वहीं रहने देता है और अदला-बदली लागू नहीं करता।", "ਇਹ ਮੂਲ ਖੱਬੇ-ਸਿਰੇ ਵਾਲੇ ਵਿਅਕਤੀ ਨੂੰ ਉੱਥੇ ਹੀ ਰਹਿਣ ਦਿੰਦਾ ਹੈ ਅਤੇ ਅਦਲਾ-ਬਦਲੀ ਲਾਗੂ ਨਹੀਂ ਕਰਦਾ।"],
});

function translateWrongExplanation(option: AuditOption, locale: Sea001TranslatedLocale): string {
  const exact = EXACT_WRONG[option.explanation];
  if (exact) return locale === "hi-IN" ? exact[0] : exact[1];
  const text = option.explanation;
  const people = namesIn(text).map((value) => nativeName(value, locale));
  let match = text.match(/^Counting as the question asks reaches ([A-Z][a-z]+), not ([A-Z][a-z]+)\.$/);
  if (match) return tr(locale, `प्रश्न के अनुसार गिनने पर ${nativeName(match[1]!, locale)} मिलता है, ${nativeName(match[2]!, locale)} नहीं।`, `ਸਵਾਲ ਅਨੁਸਾਰ ਗਿਣਣ 'ਤੇ ${nativeName(match[1]!, locale)} ਮਿਲਦਾ ਹੈ, ${nativeName(match[2]!, locale)} ਨਹੀਂ।`);
  match = text.match(/^([A-Z][a-z]+) sits nearby, but not in the seat asked about\.$/);
  if (match) return tr(locale, `${nativeName(match[1]!, locale)} पास की सीट पर है, लेकिन पूछी गई सीट पर नहीं।`, `${nativeName(match[1]!, locale)} ਨੇੜਲੀ ਸੀਟ 'ਤੇ ਹੈ, ਪਰ ਪੁੱਛੀ ਗਈ ਸੀਟ 'ਤੇ ਨਹੀਂ।`);
  match = text.match(/^This uses the wrong facing for ([A-Z][a-z]+)\.$/);
  if (match) return tr(locale, `इसमें ${nativeName(match[1]!, locale)} की गलत मुख-दिशा ली गई है।`, `ਇਸ ਵਿੱਚ ${nativeName(match[1]!, locale)} ਦੀ ਗਲਤ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਲਈ ਗਈ ਹੈ।`);
  match = text.match(/^This keeps ([A-Z][a-z]+)'s original facing instead of changing it\.$/);
  if (match) return tr(locale, `यह ${nativeName(match[1]!, locale)} की मुख-दिशा बदलने के बजाय उसकी मूल दिशा ही रखता है।`, `ਇਹ ${nativeName(match[1]!, locale)} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਬਦਲਣ ਦੀ ਥਾਂ ਉਸਦੀ ਮੂਲ ਦਿਸ਼ਾ ਹੀ ਰੱਖਦਾ ਹੈ।`);
  match = text.match(/^This treats ([A-Z][a-z]+) as facing outward instead of the centre\.$/);
  if (match) return tr(locale, `यह ${nativeName(match[1]!, locale)} को केंद्र की ओर के बजाय बाहर की ओर मुख किया मानता है।`, `ਇਹ ${nativeName(match[1]!, locale)} ਨੂੰ ਕੇਂਦਰ ਵੱਲ ਦੀ ਥਾਂ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕੀਤਾ ਮੰਨਦਾ ਹੈ।`);
  match = text.match(/^This treats ([A-Z][a-z]+) as facing the centre instead of outward\.$/);
  if (match) return tr(locale, `यह ${nativeName(match[1]!, locale)} को बाहर की ओर के बजाय केंद्र की ओर मुख किया मानता है।`, `ਇਹ ${nativeName(match[1]!, locale)} ਨੂੰ ਬਾਹਰ ਵੱਲ ਦੀ ਥਾਂ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕੀਤਾ ਮੰਨਦਾ ਹੈ।`);
  match = text.match(/^([A-Z][a-z]+) and ([A-Z][a-z]+) sit next to each other, so this pair follows the same 'sitting next to' pattern and is not the odd pair\.$/);
  if (match) return tr(locale, `${people[0]} और ${people[1]} पास-पास हैं, इसलिए यह जोड़ी बाकी पास-पास बैठी जोड़ियों जैसा ही संबंध रखती है और अलग जोड़ी नहीं है।`, `${people[0]} ਅਤੇ ${people[1]} ਨਾਲ-ਨਾਲ ਹਨ, ਇਸ ਲਈ ਇਹ ਜੋੜਾ ਬਾਕੀ ਨਾਲ-ਨਾਲ ਜੋੜਿਆਂ ਵਰਗਾ ਹੀ ਸਬੰਧ ਰੱਖਦਾ ਹੈ ਅਤੇ ਵੱਖਰਾ ਜੋੜਾ ਨਹੀਂ ਹੈ।`);
  match = text.match(/^The correct pair is ([A-Z][a-z]+) and ([A-Z][a-z]+)\. ([A-Z][a-z]+) and ([A-Z][a-z]+) are not the two people asked for\.$/);
  if (match) return tr(locale, `सही जोड़ी ${people[0]} और ${people[1]} है। ${people[2]} और ${people[3]} वे दो व्यक्ति नहीं हैं जो प्रश्न में पूछे गए हैं।`, `ਸਹੀ ਜੋੜਾ ${people[0]} ਅਤੇ ${people[1]} ਹੈ। ${people[2]} ਅਤੇ ${people[3]} ਉਹ ਦੋ ਵਿਅਕਤੀ ਨਹੀਂ ਹਨ ਜੋ ਸਵਾਲ ਵਿੱਚ ਪੁੱਛੇ ਗਏ ਹਨ।`);
  match = text.match(/^The answer is (\d+)\. Counting the seats asked for does not give (\d+)\.$/);
  if (match) return tr(locale, `सही उत्तर ${match[1]} है। मांगी गई सीटें गिनने पर ${match[2]} नहीं मिलता।`, `ਸਹੀ ਉੱਤਰ ${match[1]} ਹੈ। ਪੁੱਛੀਆਂ ਸੀਟਾਂ ਗਿਣਣ 'ਤੇ ${match[2]} ਨਹੀਂ ਮਿਲਦਾ।`);
  match = text.match(/^The two extreme ends of a straight row are not adjacent to each other\.$/);
  if (match) return tr(locale, "सीधी पंक्ति के दोनों छोर एक-दूसरे के पड़ोसी नहीं होते।", "ਸਿੱਧੀ ਕਤਾਰ ਦੇ ਦੋਵੇਂ ਸਿਰੇ ਇੱਕ-ਦੂਜੇ ਦੇ ਨੇੜਲੇ ਨਹੀਂ ਹੁੰਦੇ।");
  match = text.match(/^([A-Z][a-z]+) lies between these two persons, so the statement is false\.$/);
  if (match) return tr(locale, `${people[0]} इन दोनों के बीच है, इसलिए कथन गलत है।`, `${people[0]} ਇਨ੍ਹਾਂ ਦੋਵਾਂ ਦੇ ਵਿਚਕਾਰ ਹੈ, ਇਸ ਲਈ ਕਥਨ ਗਲਤ ਹੈ।`);
  match = text.match(/^([A-Z][a-z]+) sits between ([A-Z][a-z]+) and ([A-Z][a-z]+), so they are not adjacent\.$/);
  if (match) return tr(locale, `${people[0]}, ${people[1]} और ${people[2]} के बीच है, इसलिए वे दोनों पास-पास नहीं हैं।`, `${people[0]}, ${people[1]} ਅਤੇ ${people[2]} ਦੇ ਵਿਚਕਾਰ ਹੈ, ਇਸ ਲਈ ਉਹ ਦੋਵੇਂ ਨਾਲ-ਨਾਲ ਨਹੀਂ ਹਨ।`);
  match = text.match(/^The correct position is (.+?)\. (.+?) counts in the wrong direction or by the wrong number of seats\.$/);
  if (match) return tr(locale, `सही स्थिति ${relationPhrase(match[1]!, locale)} है। ${relationPhrase(match[2]!, locale)} लेने पर दिशा या सीटों की संख्या गलत हो जाती है।`, `ਸਹੀ ਸਥਿਤੀ ${relationPhrase(match[1]!, locale)} ਹੈ। ${relationPhrase(match[2]!, locale)} ਲੈਣ 'ਤੇ ਦਿਸ਼ਾ ਜਾਂ ਸੀਟਾਂ ਦੀ ਗਿਣਤੀ ਗਲਤ ਹੋ ਜਾਂਦੀ ਹੈ।`);
  throw new Error(`SEA-001 explanation parity unsupported wrong-option explanation: ${text}`);
}

export interface Sea001ExplanationParityDiagnostics {
  readonly sharedEnglishBlocks: number;
  readonly sharedLocalizedBlocks: number;
  readonly childExplanations: number;
  readonly optionRationales: number;
}

export function applySea001CanonicalExplanationParity(
  source: AuditCaselet,
  candidate: Sea001LocalizedReviewCaselet,
  locale: Sea001TranslatedLocale,
): Sea001LocalizedReviewCaselet {
  const sharedExplanation = translateSharedExplanation(source, candidate, locale);
  const children = candidate.children.map((child, childIndex) => {
    const sourceChild = source.children[childIndex];
    if (!sourceChild) throw new Error(`${source.caseletId}: explanation parity missing source child ${childIndex}`);
    const explanation = translateCorrectExplanation(sourceChild, locale);
    const options = child.options.map((option, optionIndex) => {
      const sourceOption = sourceChild.options[optionIndex];
      if (!sourceOption) throw new Error(`${source.caseletId}: explanation parity missing source option ${childIndex}/${optionIndex}`);
      return {
        ...option,
        explanation: sourceOption.isCorrect ? explanation : translateWrongExplanation(sourceOption, locale),
      };
    });
    return { ...child, explanation, options };
  });
  const result = { ...candidate, sharedExplanation, children };
  const diagnostics = sea001ExplanationParityDiagnostics(source, result);
  if (diagnostics.sharedEnglishBlocks !== diagnostics.sharedLocalizedBlocks) {
    throw new Error(`${source.caseletId}: explanation parity changed shared explanation block count`);
  }
  if (diagnostics.childExplanations !== source.children.length) {
    throw new Error(`${source.caseletId}: explanation parity child count mismatch`);
  }
  if (diagnostics.optionRationales !== source.children.reduce((sum, child) => sum + child.options.length, 0)) {
    throw new Error(`${source.caseletId}: explanation parity option-rationale count mismatch`);
  }
  return result;
}

export function sea001ExplanationParityDiagnostics(
  source: AuditCaselet,
  candidate: Sea001LocalizedReviewCaselet,
): Sea001ExplanationParityDiagnostics {
  return {
    sharedEnglishBlocks: source.sharedExplanation.split("\n\n").map((block) => block.trim()).filter(Boolean).length,
    sharedLocalizedBlocks: candidate.sharedExplanation.split("\n\n").map((block) => block.trim()).filter(Boolean).length,
    childExplanations: candidate.children.filter((child) => child.explanation.trim().length > 0).length,
    optionRationales: candidate.children.reduce((sum, child) => sum + child.options.filter((option) => option.explanation.trim().length > 0).length, 0),
  };
}
