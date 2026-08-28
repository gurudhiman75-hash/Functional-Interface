import type { SriLocalizedLocaleV1 } from "./permanent-localization-base-v1";

/**
 * Exact residual learner-surface fixes demonstrated by the strict Phase-9 audit.
 * Captured mathematical fragments are emitted unchanged and in source order.
 */
export function localizeSriResidualSurfaceV1(
  text: string,
  locale: SriLocalizedLocaleV1,
): string | undefined {
  let match: RegExpMatchArray | null;

  // CP006-G quantity comparison labels and generated given surfaces.
  if (text === "Quantity A is greater") return locale === "hi-IN" ? "राशि A बड़ी है" : "ਰਾਸ਼ੀ A ਵੱਡੀ ਹੈ";
  if (text === "Quantity B is greater") return locale === "hi-IN" ? "राशि B बड़ी है" : "ਰਾਸ਼ੀ B ਵੱਡੀ ਹੈ";
  if (text === "Quantity A and Quantity B are equal") return locale === "hi-IN" ? "राशि A और राशि B बराबर हैं" : "ਰਾਸ਼ੀ A ਅਤੇ ਰਾਸ਼ੀ B ਬਰਾਬਰ ਹਨ";
  match = text.match(/^The quantities to compare are Quantity A = (.+?) (?:and|with) Quantity B = (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `तुलना की जाने वाली राशियाँ A = ${match[1]} और B = ${match[2]} हैं।`
    : `ਤੁਲਨਾ ਲਈ ਰਾਸ਼ੀਆਂ A = ${match[1]} ਅਤੇ B = ${match[2]} ਹਨ।`;
  match = text.match(/^Quantity A is (.+?) and Quantity B is (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `राशि A ${match[1]} है और राशि B ${match[2]} है।`
    : `ਰਾਸ਼ੀ A ${match[1]} ਹੈ ਅਤੇ ਰਾਸ਼ੀ B ${match[2]} ਹੈ।`;

  // CP011-C: must precede generic exact-order rules.
  match = text.match(/^Determine the exact order of the different-index radicals (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `भिन्न-घातांक करणियों ${match[1]} और ${match[2]} का सटीक क्रम निर्धारित कीजिए।`
    : `ਵੱਖਰੇ-ਘਾਤਾਂਕ ਕਰਣੀਆਂ ${match[1]} ਅਤੇ ${match[2]} ਦਾ ਸਟੀਕ ਕ੍ਰਮ ਨਿਰਧਾਰਤ ਕਰੋ।`;

  // CP011-D/E exact-bound stems and explanation-state surfaces.
  match = text.match(/^Without decimals, bound (.+) by consecutive integers\.$/u);
  if (match) return locale === "hi-IN"
    ? `दशमलव के बिना ${match[1]} को क्रमागत पूर्णांकों से सीमाबद्ध कीजिए।`
    : `ਦਸ਼ਮਲਵ ਤੋਂ ਬਿਨਾਂ ${match[1]} ਨੂੰ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਨਾਲ ਸੀਮਿਤ ਕਰੋ।`;
  match = text.match(/^Locate (.+) between two consecutive integers\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} को दो क्रमागत पूर्णांकों के बीच स्थित कीजिए।`
    : `${match[1]} ਨੂੰ ਦੋ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਵਿਚਕਾਰ ਸਥਿਤ ਕਰੋ।`;
  match = text.match(/^Locate (.+) between consecutive integers without decimals\.$/u);
  if (match) return locale === "hi-IN"
    ? `दशमलव के बिना ${match[1]} को क्रमागत पूर्णांकों के बीच स्थित कीजिए।`
    : `ਦਸ਼ਮਲਵ ਤੋਂ ਬਿਨਾਂ ${match[1]} ਨੂੰ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਵਿਚਕਾਰ ਸਥਿਤ ਕਰੋ।`;
  match = text.match(/^Bound the irrational quantity (.+) exactly by consecutive integers\.$/u);
  if (match) return locale === "hi-IN"
    ? `अपरिमेय राशि ${match[1]} को क्रमागत पूर्णांकों से सटीक रूप से सीमाबद्ध कीजिए।`
    : `ਅਪਰਿਮੇਯ ਰਾਸ਼ੀ ${match[1]} ਨੂੰ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਨਾਲ ਸਟੀਕ ਤੌਰ ਤੇ ਸੀਮਿਤ ਕਰੋ।`;
  match = text.match(/^The (?:root|radical) to bound is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `सीमाबद्ध की जाने वाली करणी ${match[1]} है।` : `ਸੀਮਿਤ ਕੀਤੀ ਜਾਣ ਵਾਲੀ ਕਰਣੀ ${match[1]} ਹੈ।`;
  match = text.match(/^The quantity to bound is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `सीमाबद्ध की जाने वाली राशि ${match[1]} है।` : `ਸੀਮਿਤ ਕੀਤੀ ਜਾਣ ਵਾਲੀ ਰਾਸ਼ੀ ${match[1]} ਹੈ।`;
  match = text.match(/^The irrational quantity to bound is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `सीमाबद्ध की जाने वाली अपरिमेय राशि ${match[1]} है।` : `ਸੀਮਿਤ ਕੀਤੀ ਜਾਣ ਵਾਲੀ ਅਪਰਿਮੇਯ ਰਾਸ਼ੀ ${match[1]} ਹੈ।`;

  // CP011-H extraneous-root explanation shells.
  if (text === "Neither") return locale === "hi-IN" ? "कोई नहीं" : "ਕੋਈ ਨਹੀਂ";
  match = text.match(/^The squared equation gives the two candidates (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `वर्ग किए समीकरण से दो मान ${match[1]} और ${match[2]} मिलते हैं।`
    : `ਵਰਗ ਕੀਤੇ ਸਮੀਕਰਨ ਤੋਂ ਦੋ ਮੁੱਲ ${match[1]} ਅਤੇ ${match[2]} ਮਿਲਦੇ ਹਨ।`;
  if (text === "Substitute both candidates into the unsquared equation; a principal square root cannot equal a negative right-hand side.") {
    return locale === "hi-IN"
      ? "दोनों मानों को बिना वर्ग वाले मूल समीकरण में रखिए; मुख्य वर्गमूल ऋणात्मक दाएँ पक्ष के बराबर नहीं हो सकता।"
      : "ਦੋਵੇਂ ਮੁੱਲਾਂ ਨੂੰ ਬਿਨਾਂ ਵਰਗ ਵਾਲੇ ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਰੱਖੋ; ਮੁੱਖ ਵਰਗਮੂਲ ਰਿਣਾਤਮਕ ਸੱਜੇ ਪਾਸੇ ਦੇ ਬਰਾਬਰ ਨਹੀਂ ਹੋ ਸਕਦਾ।";
  }

  // CP011-J positive two-surd-sum comparison family.
  match = text.match(/^Without decimal approximation, which is greater: (.+) or (.+)\?$/u);
  if (match) return locale === "hi-IN"
    ? `दशमलव सन्निकटन के बिना बताइए, ${match[1]} और ${match[2]} में कौन बड़ा है?`
    : `ਦਸ਼ਮਲਵ ਅਨੁਮਾਨ ਤੋਂ ਬਿਨਾਂ ਦੱਸੋ, ${match[1]} ਅਤੇ ${match[2]} ਵਿੱਚੋਂ ਕਿਹੜਾ ਵੱਡਾ ਹੈ?`;
  match = text.match(/^Compare the positive surd sums (.+) and (.+) by exact arithmetic\.$/u);
  if (match) return locale === "hi-IN"
    ? `धनात्मक करणी-योगों ${match[1]} और ${match[2]} की सटीक गणना से तुलना कीजिए।`
    : `ਧਨਾਤਮਕ ਕਰਣੀ-ਜੋੜਾਂ ${match[1]} ਅਤੇ ${match[2]} ਦੀ ਸਟੀਕ ਗਣਨਾ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।`;
  if (text === "Both expressions are positive sums of two square roots with equal radicand sums.") {
    return locale === "hi-IN"
      ? "दोनों व्यंजक दो-दो वर्गमूलों के धनात्मक योग हैं और उनकी करणीगत संख्याओं के योग समान हैं।"
      : "ਦੋਵੇਂ ਵਿਅੰਜਕ ਦੋ-ਦੋ ਵਰਗਮੂਲਾਂ ਦੇ ਧਨਾਤਮਕ ਜੋੜ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਕਰਣੀਗਤ ਸੰਖਿਆਵਾਂ ਦੇ ਜੋੜ ਇੱਕੋ ਹਨ।";
  }
  match = text.match(/^Both squared expressions have rational part (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दोनों वर्ग किए व्यंजकों का परिमेय भाग ${match[1]} है।` : `ਦੋਵੇਂ ਵਰਗ ਕੀਤੇ ਵਿਅੰਜਕਾਂ ਦਾ ਪਰਿਮੇਯ ਭਾਗ ${match[1]} ਹੈ।`;
  match = text.match(/^First cross-term radicand: (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `पहले मिश्र पद की करणीगत संख्या: ${match[1]}।` : `ਪਹਿਲੇ ਮਿਸ਼ਰਤ ਪਦ ਦੀ ਕਰਣੀਗਤ ਸੰਖਿਆ: ${match[1]}।`;
  match = text.match(/^Second cross-term radicand: (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दूसरे मिश्र पद की करणीगत संख्या: ${match[1]}।` : `ਦੂਜੇ ਮਿਸ਼ਰਤ ਪਦ ਦੀ ਕਰਣੀਗਤ ਸੰਖਿਆ: ${match[1]}।`;

  // CP012-A radical -> rational-index simplification surfaces.
  match = text.match(/^Find the exact simplified form of (.+) using rational exponents\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} का परिमेय घातांकों से सटीक सरल रूप ज्ञात कीजिए।`
    : `${match[1]} ਦਾ ਪਰਿਮੇਯ ਘਾਤਾਂਕਾਂ ਨਾਲ ਸਟੀਕ ਸਰਲ ਰੂਪ ਪਤਾ ਕਰੋ।`;
  match = text.match(/^The radical to simplify is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `सरल की जाने वाली करणी ${match[1]} है।` : `ਸਰਲ ਕੀਤੀ ਜਾਣ ਵਾਲੀ ਕਰਣੀ ${match[1]} ਹੈ।`;
  match = text.match(/^The perfect (\d+)(?:st|nd|rd|th)-power part contributes (.+) outside the radical\.$/u);
  if (match) return locale === "hi-IN"
    ? `पूर्ण ${match[1]}वीं घात वाला भाग करणी के बाहर ${match[2]} देता है।`
    : `ਪੂਰਨ ${match[1]}ਵੀਂ ਘਾਤ ਵਾਲਾ ਭਾਗ ਕਰਣੀ ਤੋਂ ਬਾਹਰ ${match[2]} ਦਿੰਦਾ ਹੈ।`;

  // CP012-B exact fractional-index -> radical surfaces, including saturation override.
  match = text.match(/^Convert the fractional index (.+) to a root before evaluating it\.$/u);
  if (match) return locale === "hi-IN"
    ? `भिन्नात्मक घातांक ${match[1]} को मान निकालने से पहले करणी रूप में बदलिए।`
    : `ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ${match[1]} ਨੂੰ ਮੁੱਲ ਕੱਢਣ ਤੋਂ ਪਹਿਲਾਂ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਬਦਲੋ।`;
  match = text.match(/^The base is a perfect (square|cube|fourth power), and the exponent (.+) is already in lowest terms\.$/u);
  if (match) {
    const powerHi = match[1] === "square" ? "पूर्ण वर्ग" : match[1] === "cube" ? "पूर्ण घन" : "पूर्ण चौथी घात";
    const powerPa = match[1] === "square" ? "ਪੂਰਨ ਵਰਗ" : match[1] === "cube" ? "ਪੂਰਨ ਘਣ" : "ਪੂਰਨ ਚੌਥੀ ਘਾਤ";
    return locale === "hi-IN"
      ? `आधार ${powerHi} है और घातांक ${match[2]} पहले से लघुतम रूप में है।`
      : `ਅਧਾਰ ${powerPa} ਹੈ ਅਤੇ ਘਾਤਾਂਕ ${match[2]} ਪਹਿਲਾਂ ਹੀ ਘੱਟਤਮ ਰੂਪ ਵਿੱਚ ਹੈ।`;
  }

  // CP012-C equivalent radical/index representation family.
  if (text === "Cannot be compared exactly") return locale === "hi-IN" ? "सटीक तुलना नहीं की जा सकती" : "ਸਟੀਕ ਤੁਲਨਾ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ";
  match = text.match(/^Are (.+) and (.+) equal, or is one greater\?$/u);
  if (match) return locale === "hi-IN"
    ? `क्या ${match[1]} और ${match[2]} बराबर हैं, या इनमें एक बड़ा है?`
    : `ਕੀ ${match[1]} ਅਤੇ ${match[2]} ਬਰਾਬਰ ਹਨ, ਜਾਂ ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਇੱਕ ਵੱਡਾ ਹੈ?`;
  match = text.match(/^Determine the relation between (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} और ${match[2]} के बीच संबंध निर्धारित कीजिए।`
    : `${match[1]} ਅਤੇ ${match[2]} ਵਿਚਕਾਰ ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਕਰੋ।`;
  match = text.match(/^The two exact representations are (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `दो सटीक निरूपण ${match[1]} और ${match[2]} हैं।`
    : `ਦੋ ਸਟੀਕ ਨਿਰੂਪਣ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  if (text === "Compare the radical and fractional-index representations exactly.") {
    return locale === "hi-IN"
      ? "करणी और भिन्नात्मक-घातांक निरूपणों की सटीक तुलना कीजिए।"
      : "ਕਰਣੀ ਅਤੇ ਭਿੰਨਾਤਮਕ-ਘਾਤਾਂਕ ਨਿਰੂਪਣਾਂ ਦੀ ਸਟੀਕ ਤੁਲਨਾ ਕਰੋ।";
  }

  return undefined;
}
