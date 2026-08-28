import type { SriLocalizedLocaleV1 } from "./permanent-localization-base-v1";

/**
 * Narrow whole-template authority for residual CP006/CP008/CP010/CP011
 * surfaces demonstrated by the strict Phase-9 corpus audit.
 */
export function localizeSriEditorialC006C011SurfaceV1(
  text: string,
  locale: SriLocalizedLocaleV1,
): string | undefined {
  let match: RegExpMatchArray | null;

  // C006-C: common positive/negative exponent comparison.
  match = text.match(/^The two expressions have the same exponent (-?\d+)\. Compare (.+?) with (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दोनों व्यंजकों का घातांक ${match[1]} समान है। ${match[2]} और ${match[3]} की तुलना कीजिए।`
      : `ਦੋਵੇਂ ਵਿਅੰਜਕਾਂ ਦਾ ਘਾਤਾਂਕ ${match[1]} ਇੱਕੋ ਹੈ। ${match[2]} ਅਤੇ ${match[3]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`;
  }

  if (text === "The reciprocal comparison reverses the positive-base order.") {
    return locale === "hi-IN"
      ? "व्युत्क्रमों की तुलना में धनात्मक आधारों का क्रम उलट जाता है।"
      : "ਵਿਉਤਕ੍ਰਮਾਂ ਦੀ ਤੁਲਨਾ ਵਿੱਚ ਧਨਾਤਮਕ ਅਧਾਰਾਂ ਦਾ ਕ੍ਰਮ ਉਲਟ ਜਾਂਦਾ ਹੈ।";
  }

  // C006-G: labelled quantity-comparison surface.
  match = text.match(/^Which relation is correct for (A=.+?) and (B=.+?)\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} और ${match[2]} के बीच कौन-सा संबंध सही है?`
      : `${match[1]} ਅਤੇ ${match[2]} ਵਿਚਕਾਰ ਕਿਹੜਾ ਸੰਬੰਧ ਸਹੀ ਹੈ?`;
  }

  match = text.match(/^The two labelled quantities are (A=.+?) and (B=.+?)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दो नामित राशियाँ ${match[1]} और ${match[2]} हैं।`
      : `ਦੋ ਨਾਮਿਤ ਰਾਸ਼ੀਆਂ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  // C006-F: two index-law statements. Translate only prose wrappers; preserve
  // every displayed algebraic law byte-for-byte and in original order.
  match = text.match(/^For the following two index statements— I\. (.+?) II\. (.+?) —which option is correct\?$/u);
  if (match) {
    const first = localizeIndexLaw(match[1], locale);
    const second = localizeIndexLaw(match[2], locale);
    return locale === "hi-IN"
      ? `निम्न दो घातांक कथनों के लिए— I. ${first} II. ${second} —कौन-सा विकल्प सही है?`
      : `ਹੇਠਲੇ ਦੋ ਘਾਤਾਂਕ ਕਥਨਾਂ ਲਈ— I. ${first} II. ${second} —ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ?`;
  }

  match = text.match(/^Statement I: (.+?) Statement II: (.+?) Which conclusion is correct\?$/u);
  if (match) {
    const first = localizeIndexLaw(match[1], locale);
    const second = localizeIndexLaw(match[2], locale);
    return locale === "hi-IN"
      ? `कथन I: ${first} कथन II: ${second} सही निष्कर्ष कौन-सा है?`
      : `ਕਥਨ I: ${first} ਕਥਨ II: ${second} ਸਹੀ ਨਤੀਜਾ ਕਿਹੜਾ ਹੈ?`;
  }

  match = text.match(/^Consider I: (.+?) II: (.+?) Choose the correct truth combination\.$/u);
  if (match) {
    const first = localizeIndexLaw(match[1], locale);
    const second = localizeIndexLaw(match[2], locale);
    return locale === "hi-IN"
      ? `I पर विचार कीजिए: ${first} II: ${second} सही सत्यता-संयोजन चुनिए।`
      : `I ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: ${first} II: ${second} ਸਹੀ ਸੱਚਾਈ-ਸੰਯੋਗ ਚੁਣੋ।`;
  }

  match = text.match(/^The two displayed index statements are I\. (.+?) II\. (.+)\.$/u);
  if (match) {
    const first = localizeIndexLaw(match[1], locale);
    const second = localizeIndexLaw(match[2], locale);
    return locale === "hi-IN"
      ? `दिखाए गए दो घातांक कथन हैं— I. ${first} II. ${second}`
      : `ਦਿਖਾਏ ਗਏ ਦੋ ਘਾਤਾਂਕ ਕਥਨ ਹਨ— I. ${first} II. ${second}`;
  }

  match = text.match(/^The supplied information is Statement I: (.+?) Statement II: (.+)\.$/u);
  if (match) {
    const first = localizeIndexLaw(match[1], locale);
    const second = localizeIndexLaw(match[2], locale);
    return locale === "hi-IN"
      ? `दिए गए कथन हैं— कथन I: ${first} कथन II: ${second}`
      : `ਦਿੱਤੇ ਕਥਨ ਹਨ— ਕਥਨ I: ${first} ਕਥਨ II: ${second}`;
  }

  // C008-F: conjugate-product wording.
  match = text.match(/^Find the exact product of (.+?) and its conjugate\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} और उसके संयुग्मी का सटीक गुणनफल ज्ञात कीजिए।`
      : `${match[1]} ਅਤੇ ਉਸ ਦੇ ਸੰਯੁਗਮੀ ਦਾ ਸਟੀਕ ਗੁਣਨਫਲ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^The factors are (.+?) and its conjugate\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `गुणनखंड ${match[1]} और उसका संयुग्मी हैं।`
      : `ਗੁਣਨਖੰਡ ${match[1]} ਅਤੇ ਉਸ ਦਾ ਸੰਯੁਗਮੀ ਹਨ।`;
  }

  // C010-A/B denesting identities.
  if (text === "Match A=m+n and B=mn, then use √(A+2√B)=√m+√n.") {
    return locale === "hi-IN"
      ? "A=m+n और B=mn का मिलान कीजिए, फिर √(A+2√B)=√m+√n का उपयोग कीजिए।"
      : "A=m+n ਅਤੇ B=mn ਦਾ ਮਿਲਾਨ ਕਰੋ, ਫਿਰ √(A+2√B)=√m+√n ਦੀ ਵਰਤੋਂ ਕਰੋ।";
  }

  if (text === "Match A=m+n and B=mn, with m≥n, then use √(A−2√B)=√m−√n.") {
    return locale === "hi-IN"
      ? "A=m+n और B=mn का मिलान कीजिए, जहाँ m≥n, फिर √(A−2√B)=√m−√n का उपयोग कीजिए।"
      : "A=m+n ਅਤੇ B=mn ਦਾ ਮਿਲਾਨ ਕਰੋ, ਜਿੱਥੇ m≥n, ਫਿਰ √(A−2√B)=√m−√n ਦੀ ਵਰਤੋਂ ਕਰੋ।";
  }

  // C010-E: hidden denested radicand.
  match = text.match(/^The denested form of (.+?) is (.+?)\. Determine x\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} का सरल करणी रूप ${match[2]} है। x ज्ञात कीजिए।`
      : `${match[1]} ਦਾ ਸਰਲ ਕਰਣੀ ਰੂਪ ${match[2]} ਹੈ। x ਪਤਾ ਕਰੋ।`;
  }

  // C011-H source-saturation extraneous-root stems.
  match = text.match(/^Squaring (.+?) gives candidates (x=.+?) and (x=.+?)\. Which candidate is extraneous\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} का वर्ग करने पर ${match[2]} और ${match[3]} मान मिलते हैं। इनमें कौन-सा बाह्य मूल है?`
      : `${match[1]} ਦਾ ਵਰਗ ਕਰਨ ਤੇ ${match[2]} ਅਤੇ ${match[3]} ਮੁੱਲ ਮਿਲਦੇ ਹਨ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਬਾਹਰੀ ਮੂਲ ਹੈ?`;
  }

  match = text.match(/^For (.+?), the squared equation yields (.+?) and (.+?)\. Which value must be rejected\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} के लिए वर्ग किए समीकरण से ${match[2]} और ${match[3]} मिलते हैं। कौन-सा मान अस्वीकार करना है?`
      : `${match[1]} ਲਈ ਵਰਗ ਕੀਤੇ ਸਮੀਕਰਨ ਤੋਂ ${match[2]} ਅਤੇ ${match[3]} ਮਿਲਦੇ ਹਨ। ਕਿਹੜਾ ਮੁੱਲ ਰੱਦ ਕਰਨਾ ਹੈ?`;
  }

  match = text.match(/^After squaring (.+?), candidates (.+?), (.+?) appear\. Identify the extraneous root\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} का वर्ग करने के बाद ${match[2]} और ${match[3]} मान मिलते हैं। बाह्य मूल पहचानिए।`
      : `${match[1]} ਦਾ ਵਰਗ ਕਰਨ ਤੋਂ ਬਾਅਦ ${match[2]} ਅਤੇ ${match[3]} ਮੁੱਲ ਮਿਲਦੇ ਹਨ। ਬਾਹਰੀ ਮੂਲ ਪਛਾਣੋ।`;
  }

  match = text.match(/^Which candidate fails the original equation (.+?): (.+?) or (.+?)\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `मूल समीकरण ${match[1]} में ${match[2]} और ${match[3]} में से कौन-सा मान विफल होता है?`
      : `ਮੂਲ ਸਮੀਕਰਨ ${match[1]} ਵਿੱਚ ${match[2]} ਅਤੇ ${match[3]} ਵਿੱਚੋਂ ਕਿਹੜਾ ਮੁੱਲ ਅਸਫਲ ਹੁੰਦਾ ਹੈ?`;
  }

  return undefined;
}

function localizeIndexLaw(text: string, locale: SriLocalizedLocaleV1): string {
  let match: RegExpMatchArray | null;

  match = text.match(/^For a ≠ 0, (.+?)\.?$/u);
  if (match) return locale === "hi-IN" ? `a ≠ 0 के लिए, ${match[1]}।` : `a ≠ 0 ਲਈ, ${match[1]}।`;

  match = text.match(/^For real a,b and integer n, (.+?) whenever both sides are defined\.?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `वास्तविक a,b और पूर्णांक n के लिए, ${match[1]}, जब दोनों पक्ष परिभाषित हों।`
      : `ਵਾਸਤਵਿਕ a,b ਅਤੇ ਪੂਰਨ ਅੰਕ n ਲਈ, ${match[1]}, ਜਦੋਂ ਦੋਵੇਂ ਪਾਸੇ ਪਰਿਭਾਸ਼ਿਤ ਹੋਣ।`;
  }

  match = text.match(/^For all real a,b, (.+?)\.?$/u);
  if (match) return locale === "hi-IN" ? `सभी वास्तविक a,b के लिए, ${match[1]}।` : `ਸਭ ਵਾਸਤਵਿਕ a,b ਲਈ, ${match[1]}।`;

  return text;
}
