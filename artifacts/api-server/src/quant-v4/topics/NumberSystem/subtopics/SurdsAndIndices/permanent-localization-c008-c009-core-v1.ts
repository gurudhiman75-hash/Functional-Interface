import type { SriLocalizedLocaleV1 } from "./permanent-localization-base-v1";

/**
 * Whole-template localization for finalized CP008/CP009 learner surfaces.
 * Captured mathematical expressions are reinserted byte-for-byte so the
 * permanent localization math-skeleton audit remains authoritative.
 */
export function localizeSriC008C009FinalizedSurfaceV1(
  text: string,
  locale: SriLocalizedLocaleV1,
): string | undefined {
  let match: RegExpMatchArray | null;

  match = text.match(/^Find the exact product of (.+) and its conjugate\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} और उसके संयुग्मी का सटीक गुणनफल ज्ञात कीजिए।`
    : `${match[1]} ਅਤੇ ਇਸ ਦੇ ਸੰਯੁਗਮੀ ਦਾ ਸਟੀਕ ਗੁਣਨਫਲ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^The factors are (.+) and its conjugate\.$/u);
  if (match) return locale === "hi-IN"
    ? `गुणनखंड ${match[1]} और उसका संयुग्मी हैं।`
    : `ਗੁਣਨਖੰਡ ${match[1]} ਅਤੇ ਇਸ ਦਾ ਸੰਯੁਗਮੀ ਹਨ।`;

  match = text.match(/^The two surd factors are (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `दोनों करणी गुणनखंड ${match[1]} और ${match[2]} हैं।`
    : `ਦੋਵੇਂ ਕਰਣੀ ਗੁਣਨਖੰਡ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;

  match = text.match(/^Find the exact product (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} का सटीक गुणनफल ज्ञात कीजिए।`
    : `${match[1]} ਦਾ ਸਟੀਕ ਗੁਣਨਫਲ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Multiply the surd sums (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `करणी योग ${match[1]} और ${match[2]} का गुणा कीजिए।`
    : `ਕਰਣੀ ਜੋੜ ${match[1]} ਅਤੇ ${match[2]} ਦਾ ਗੁਣਾ ਕਰੋ।`;

  match = text.match(/^Write (.+) in canonical surd form\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} को मानक करणी रूप में लिखिए।`
    : `${match[1]} ਨੂੰ ਮਿਆਰੀ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  match = text.match(/^Simplify (.+) into simplest surd form\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} को सरलतम करणी रूप में लिखिए।`
    : `${match[1]} ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  match = text.match(/^Write (.+) with a rational denominator\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} को परिमेय हर के साथ लिखिए।`
    : `${match[1]} ਨੂੰ ਪਰਿਮੇਯ ਹਰ ਨਾਲ ਲਿਖੋ।`;

  match = text.match(/^Find the (?:exact |simplest )?rationalised form of (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} का परिमेयकृत रूप ज्ञात कीजिए।`
    : `${match[1]} ਦਾ ਪਰਿਮੇਯਕ੍ਰਿਤ ਰੂਪ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Use the conjugate to rationalise (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `संयुग्मी का उपयोग करके ${match[1]} का परिमेयकरण कीजिए।`
    : `ਸੰਯੁਗਮੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰੋ।`;

  match = text.match(/^Use a conjugate to remove the radicals from the denominator of (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `संयुग्मी का उपयोग करके ${match[1]} के हर से करणियाँ हटाइए।`
    : `ਸੰਯੁਗਮੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਦੇ ਹਰ ਵਿੱਚੋਂ ਕਰਣੀਆਂ ਹਟਾਓ।`;

  match = text.match(/^Remove the radicals from the denominator of (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} के हर से करणियाँ हटाकर परिमेय कीजिए।`
    : `${match[1]} ਦੇ ਹਰ ਵਿੱਚੋਂ ਕਰਣੀਆਂ ਹਟਾ ਕੇ ਪਰਿਮੇਯ ਕਰੋ।`;

  match = text.match(/^Use the coefficient-bearing conjugate to simplify (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `गुणांक सहित संयुग्मी का उपयोग करके ${match[1]} को सरल कीजिए।`
    : `ਗੁਣਾਂਕ ਸਮੇਤ ਸੰਯੁਗਮੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`;

  match = text.match(/^Rationalise and combine (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} का परिमेयकरण करके पदों को मिलाइए।`
    : `${match[1]} ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰਕੇ ਪਦਾਂ ਨੂੰ ਮਿਲਾਓ।`;

  match = text.match(/^Write the sum (.+) as (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `योग ${match[1]} को ${match[2]} के रूप में लिखिए।`
    : `ਜੋੜ ${match[1]} ਨੂੰ ${match[2]} ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  if (text === "Distribute every term, replace (√r)^2 by r, then collect the rational and surd parts.") {
    return locale === "hi-IN"
      ? "प्रत्येक पद का वितरण कीजिए, (√r)^2 को r से बदलिए, फिर परिमेय और करणी भागों को मिलाइए।"
      : "ਹਰੇਕ ਪਦ ਨੂੰ ਵਿਸਥਾਰੋ, (√r)^2 ਨੂੰ r ਨਾਲ ਬਦਲੋ, ਫਿਰ ਪਰਿਮੇਯ ਅਤੇ ਕਰਣੀ ਭਾਗਾਂ ਨੂੰ ਇਕੱਠਾ ਕਰੋ।";
  }

  if (text === "Multiply numerator and denominator by the same square root; the denominator becomes the radicand.") {
    return locale === "hi-IN"
      ? "अंश और हर को उसी वर्गमूल से गुणा कीजिए; हर करणीगत संख्या के बराबर हो जाता है।"
      : "ਅੰਸ਼ ਅਤੇ ਹਰ ਨੂੰ ਉਸੇ ਵਰਗਮੂਲ ਨਾਲ ਗੁਣਾ ਕਰੋ; ਹਰ ਕਰਣੀਗਤ ਸੰਖਿਆ ਦੇ ਬਰਾਬਰ ਹੋ ਜਾਂਦਾ ਹੈ।";
  }

  if (text === "Multiply by the conjugate of the binomial denominator; its product with the denominator is a difference of squares.") {
    return locale === "hi-IN"
      ? "द्विपदी हर के संयुग्मी से अंश और हर दोनों को गुणा कीजिए; हर में वर्गों का अंतर प्राप्त होता है।"
      : "ਦੋਪਦੀ ਹਰ ਦੇ ਸੰਯੁਗਮੀ ਨਾਲ ਅੰਸ਼ ਅਤੇ ਹਰ ਦੋਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ; ਹਰ ਵਿੱਚ ਵਰਗਾਂ ਦਾ ਅੰਤਰ ਮਿਲਦਾ ਹੈ।";
  }

  if (text === "Multiply by the conjugate; (√a+√b)(√a-√b)=a-b.") {
    return locale === "hi-IN"
      ? "संयुग्मी से गुणा कीजिए; (√a+√b)(√a-√b)=a-b।"
      : "ਸੰਯੁਗਮੀ ਨਾਲ ਗੁਣਾ ਕਰੋ; (√a+√b)(√a-√b)=a-b।";
  }

  if (text === "Use the conjugate with the same coefficients; the denominator becomes p²a-q²b.") {
    return locale === "hi-IN"
      ? "समान गुणांकों वाले संयुग्मी का उपयोग कीजिए; हर p²a-q²b बन जाता है।"
      : "ਉਹੀ ਗੁਣਾਂਕਾਂ ਵਾਲੇ ਸੰਯੁਗਮੀ ਦੀ ਵਰਤੋਂ ਕਰੋ; ਹਰ p²a-q²b ਬਣ ਜਾਂਦਾ ਹੈ।";
  }

  if (text === "Rationalise each conjugate denominator, then collect rational and surd parts.") {
    return locale === "hi-IN"
      ? "प्रत्येक संयुग्मी हर का परिमेयकरण कीजिए, फिर परिमेय और करणी भागों को मिलाइए।"
      : "ਹਰੇਕ ਸੰਯੁਗਮੀ ਹਰ ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰੋ, ਫਿਰ ਪਰਿਮੇਯ ਅਤੇ ਕਰਣੀ ਭਾਗਾਂ ਨੂੰ ਇਕੱਠਾ ਕਰੋ।";
  }

  if (text === "Rationalise first, recover A and B exactly, then evaluate the requested coefficient expression.") {
    return locale === "hi-IN"
      ? "पहले परिमेयकरण करके A और B का सटीक मान ज्ञात कीजिए, फिर पूछे गए गुणांक व्यंजक का मान निकालिए।"
      : "ਪਹਿਲਾਂ ਪਰਿਮੇਯਕਰਨ ਕਰਕੇ A ਅਤੇ B ਦੇ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ, ਫਿਰ ਪੁੱਛੇ ਗਏ ਗੁਣਾਂਕ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੱਢੋ।";
  }

  if (text === "Rationalise, combine and simplify the expression.") {
    return locale === "hi-IN"
      ? "व्यंजक का परिमेयकरण कीजिए, पदों को मिलाइए और सरल कीजिए।"
      : "ਵਿਅੰਜਕ ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰੋ, ਪਦਾਂ ਨੂੰ ਮਿਲਾਓ ਅਤੇ ਸਰਲ ਕਰੋ।";
  }

  match = text.match(/^Rational part = (.+)$/u);
  if (match) return locale === "hi-IN" ? `परिमेय भाग = ${match[1]}` : `ਪਰਿਮੇਯ ਭਾਗ = ${match[1]}`;

  match = text.match(/^Surd coefficient = (.+)$/u);
  if (match) return locale === "hi-IN" ? `करणी गुणांक = ${match[1]}` : `ਕਰਣੀ ਗੁਣਾਂਕ = ${match[1]}`;

  match = text.match(/^Simplified result = (.+)$/u);
  if (match) return locale === "hi-IN" ? `सरल परिणाम = ${match[1]}` : `ਸਰਲ ਨਤੀਜਾ = ${match[1]}`;

  match = text.match(/^Exact simplified result = (.+)$/u);
  if (match) return locale === "hi-IN" ? `सटीक सरल परिणाम = ${match[1]}` : `ਸਟੀਕ ਸਰਲ ਨਤੀਜਾ = ${match[1]}`;

  match = text.match(/^Therefore the result is (rational|irrational)\.$/u);
  if (match) {
    const classification = match[1] === "rational"
      ? (locale === "hi-IN" ? "परिमेय" : "ਪਰਿਮੇਯ")
      : (locale === "hi-IN" ? "अपरिमेय" : "ਅਪਰਿਮੇਯ");
    return locale === "hi-IN"
      ? `इसलिए परिणाम ${classification} है।`
      : `ਇਸ ਲਈ ਨਤੀਜਾ ${classification} ਹੈ।`;
  }

  match = text.match(/^Conjugate: (.+)$/u);
  if (match) return locale === "hi-IN" ? `संयुग्मी: ${match[1]}` : `ਸੰਯੁਗਮੀ: ${match[1]}`;

  match = text.match(/^Denominator norm = (.+)$/u);
  if (match) return locale === "hi-IN" ? `हर का मान = ${match[1]}` : `ਹਰ ਦਾ ਮੁੱਲ = ${match[1]}`;

  match = text.match(/^Denominator after conjugation = (.+)$/u);
  if (match) return locale === "hi-IN"
    ? `संयुग्मी से गुणा करने के बाद हर = ${match[1]}`
    : `ਸੰਯੁਗਮੀ ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹਰ = ${match[1]}`;

  match = text.match(/^Common norm = (.+)$/u);
  if (match) return locale === "hi-IN" ? `साझा हर का मान = ${match[1]}` : `ਸਾਂਝੇ ਹਰ ਦਾ ਮੁੱਲ = ${match[1]}`;

  match = text.match(/^Determine whether (.+) simplifies to a rational or irrational number\.$/u);
  if (match) return locale === "hi-IN"
    ? `निर्धारित कीजिए कि ${match[1]} को सरल करने पर परिणाम परिमेय है या अपरिमेय।`
    : `ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ${match[1]} ਨੂੰ ਸਰਲ ਕਰਨ ਤੇ ਨਤੀਜਾ ਪਰਿਮੇਯ ਹੈ ਜਾਂ ਅਪਰਿਮੇਯ।`;

  match = text.match(/^What is the number type of the exact result of (.+)\?$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} के सटीक परिणाम का संख्या-प्रकार क्या है?`
    : `${match[1]} ਦੇ ਸਟੀਕ ਨਤੀਜੇ ਦੀ ਸੰਖਿਆ-ਕਿਸਮ ਕੀ ਹੈ?`;

  match = text.match(/^Classify the result of (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} के परिणाम का वर्गीकरण कीजिए।`
    : `${match[1]} ਦੇ ਨਤੀਜੇ ਦਾ ਵਰਗੀਕਰਨ ਕਰੋ।`;

  if (text === "Simplify exactly and classify the result.") {
    return locale === "hi-IN"
      ? "सटीक रूप से सरल कीजिए और परिणाम का वर्गीकरण कीजिए।"
      : "ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰੋ ਅਤੇ ਨਤੀਜੇ ਦਾ ਵਰਗੀਕਰਨ ਕਰੋ।";
  }

  if (text === "Combine the like surds; a non-zero square-free radical remains.") {
    return locale === "hi-IN"
      ? "समान करणी पदों को मिलाइए; एक शून्येतर वर्ग-मुक्त मूल शेष रहता है।"
      : "ਇੱਕੋ ਜਿਹੇ ਕਰਣੀ ਪਦਾਂ ਨੂੰ ਮਿਲਾਓ; ਇੱਕ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਵਰਗ-ਮੁਕਤ ਮੂਲ ਬਚਦਾ ਹੈ।";
  }

  if (text === "Use the conjugate identity; the radical terms cancel.") {
    return locale === "hi-IN"
      ? "संयुग्मी सर्वसमिका का उपयोग कीजिए; मूल वाले पद कट जाते हैं।"
      : "ਸੰਯੁਗਮੀ ਸਰਵਸਮਿਕਾ ਵਰਤੋ; ਮੂਲ ਵਾਲੇ ਪਦ ਕੱਟ ਜਾਂਦੇ ਹਨ।";
  }

  match = text.match(/^The fraction to rationalise is (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `परिमेयकरण किया जाने वाला भिन्न ${match[1]} है।`
    : `ਪਰਿਮੇਯਕਰਨ ਕੀਤਾ ਜਾਣ ਵਾਲਾ ਭਿੰਨ ${match[1]} ਹੈ।`;

  match = text.match(/^The conjugate-denominator sum is (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `संयुग्मी हरों वाला योग ${match[1]} है।`
    : `ਸੰਯੁਗਮੀ ਹਰਾਂ ਵਾਲਾ ਜੋੜ ${match[1]} ਹੈ।`;

  if (text === "Multiply by the cube root needed to complete a perfect cube in the denominator.") {
    return locale === "hi-IN"
      ? "हर में पूर्ण घन बनाने के लिए आवश्यक घनमूल से अंश और हर दोनों को गुणा कीजिए।"
      : "ਹਰ ਵਿੱਚ ਪੂਰਨ ਘਣ ਬਣਾਉਣ ਲਈ ਲੋੜੀਂਦੇ ਘਣਮੂਲ ਨਾਲ ਅੰਸ਼ ਅਤੇ ਹਰ ਦੋਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।";
  }

  match = text.match(/^Remove the cube root from the denominator of (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} के हर से घनमूल हटाकर परिमेय कीजिए।`
    : `${match[1]} ਦੇ ਹਰ ਵਿੱਚੋਂ ਘਣਮੂਲ ਹਟਾ ਕੇ ਪਰਿਮੇਯ ਕਰੋ।`;

  match = text.match(/^If rationalising (.+) gives (.+), find \(A,B\)\.$/u);
  if (match) return locale === "hi-IN"
    ? `यदि ${match[1]} का परिमेयकरण करने पर ${match[2]} मिलता है, तो (A,B) ज्ञात कीजिए।`
    : `ਜੇ ${match[1]} ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰਨ ਤੇ ${match[2]} ਮਿਲਦਾ ਹੈ, ਤਾਂ (A,B) ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Write (.+) after rationalisation\. Determine \(A,B\)\.$/u);
  if (match) return locale === "hi-IN"
    ? `परिमेयकरण के बाद ${match[1]} लिखिए और (A,B) निर्धारित कीजिए।`
    : `ਪਰਿਮੇਯਕਰਨ ਤੋਂ ਬਾਅਦ ${match[1]} ਲਿਖੋ ਅਤੇ (A,B) ਨਿਰਧਾਰਤ ਕਰੋ।`;

  match = text.match(/^After rationalising (.+), identify the rational coefficient A and surd coefficient B\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} का परिमेयकरण करने के बाद परिमेय गुणांक A और करणी गुणांक B पहचानिए।`
    : `${match[1]} ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰਨ ਤੋਂ ਬਾਅਦ ਪਰਿਮੇਯ ਗੁਣਾਂਕ A ਅਤੇ ਕਰਣੀ ਗੁਣਾਂਕ B ਪਛਾਣੋ।`;

  match = text.match(/^Find the ordered pair \(A,B\) when (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `जब ${match[1]}, तब क्रमित युग्म (A,B) ज्ञात कीजिए।`
    : `ਜਦੋਂ ${match[1]}, ਤਦ ਕ੍ਰਮਿਤ ਜੋੜਾ (A,B) ਪਤਾ ਕਰੋ।`;

  match = text.match(/^The rationalised coefficient form is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `परिमेयकृत गुणांक रूप ${match[1]} है।` : `ਪਰਿਮੇਯਕ੍ਰਿਤ ਗੁਣਾਂਕ ਰੂਪ ${match[1]} ਹੈ।`;

  match = text.match(/^The rationalised form of (.+) is (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} का परिमेयकृत रूप ${match[2]} है।`
    : `${match[1]} ਦਾ ਪਰਿਮੇਯਕ੍ਰਿਤ ਰੂਪ ${match[2]} ਹੈ।`;

  match = text.match(/^The rationalisation identity is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `परिमेयकरण की सर्वसमिका ${match[1]} है।` : `ਪਰਿਮੇਯਕਰਨ ਦੀ ਸਰਵਸਮਿਕਾ ${match[1]} ਹੈ।`;

  if (text === "Recover the two canonical coefficients." || text === "Recover the two standard-form coefficients.") {
    return locale === "hi-IN" ? "दोनों मानक गुणांक ज्ञात कीजिए।" : "ਦੋਵੇਂ ਮਿਆਰੀ ਗੁਣਾਂਕ ਪਤਾ ਕਰੋ।";
  }

  match = text.match(/^Rationalise with (?:the )?conjugate, then read the rational and surd coefficients from (?:canonical|standard) form\.$/u);
  if (match) return locale === "hi-IN"
    ? "संयुग्मी से परिमेयकरण कीजिए, फिर मानक रूप से परिमेय और करणी गुणांक पढ़िए।"
    : "ਸੰਯੁਗਮੀ ਨਾਲ ਪਰਿਮੇਯਕਰਨ ਕਰੋ, ਫਿਰ ਮਿਆਰੀ ਰੂਪ ਤੋਂ ਪਰਿਮੇਯ ਅਤੇ ਕਰਣੀ ਗੁਣਾਂਕ ਪੜ੍ਹੋ।";

  match = text.match(/^Norm = (.+)$/u);
  if (match) return locale === "hi-IN" ? `हर का मान = ${match[1]}` : `ਹਰ ਦਾ ਮੁੱਲ = ${match[1]}`;

  match = text.match(/^Rationalise (.+) and find (A[+-]B)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} का परिमेयकरण कीजिए और ${match[2]} ज्ञात कीजिए।`
    : `${match[1]} ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰੋ ਅਤੇ ${match[2]} ਪਤਾ ਕਰੋ।`;

  match = text.match(/^If (.+) after rationalisation, evaluate (A[+-]B)\.$/u);
  if (match) return locale === "hi-IN"
    ? `यदि परिमेयकरण के बाद ${match[1]}, तो ${match[2]} का मान ज्ञात कीजिए।`
    : `ਜੇ ਪਰਿਮੇਯਕਰਨ ਤੋਂ ਬਾਅਦ ${match[1]}, ਤਾਂ ${match[2]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Determine (A[+-]B) from the canonical rationalised form of (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[2]} के मानक परिमेयकृत रूप से ${match[1]} ज्ञात कीजिए।`
    : `${match[2]} ਦੇ ਮਿਆਰੀ ਪਰਿਮੇਯਕ੍ਰਿਤ ਰੂਪ ਤੋਂ ${match[1]} ਪਤਾ ਕਰੋ।`;

  match = text.match(/^After recovering A and B from (.+), calculate (A[+-]B)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} से A और B ज्ञात करने के बाद ${match[2]} का मान निकालिए।`
    : `${match[1]} ਤੋਂ A ਅਤੇ B ਪਤਾ ਕਰਨ ਤੋਂ ਬਾਅਦ ${match[2]} ਦਾ ਮੁੱਲ ਕੱਢੋ।`;

  match = text.match(/^The fraction used to recover A and B is (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `A और B ज्ञात करने के लिए प्रयुक्त भिन्न ${match[1]} है।`
    : `A ਅਤੇ B ਪਤਾ ਕਰਨ ਲਈ ਵਰਤਿਆ ਭਿੰਨ ${match[1]} ਹੈ।`;

  match = text.match(/^The rationalised form is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `परिमेयकृत रूप ${match[1]} है।` : `ਪਰਿਮੇਯਕ੍ਰਿਤ ਰੂਪ ${match[1]} ਹੈ।`;

  match = text.match(/^Recover A and B, then evaluate (A[+-]B)\.$/u);
  if (match) return locale === "hi-IN"
    ? `A और B ज्ञात कीजिए, फिर ${match[1]} का मान निकालिए।`
    : `A ਅਤੇ B ਪਤਾ ਕਰੋ, ਫਿਰ ${match[1]} ਦਾ ਮੁੱਲ ਕੱਢੋ।`;

  match = text.match(/^Let x=(.+)\. Find (.+) exactly\.$/u);
  if (match) return locale === "hi-IN"
    ? `मान लीजिए x=${match[1]}। ${match[2]} का सटीक मान ज्ञात कीजिए।`
    : `ਮੰਨੋ x=${match[1]}। ${match[2]} ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^If x=(.+), evaluate (.+) without decimal approximation\.$/u);
  if (match) return locale === "hi-IN"
    ? `यदि x=${match[1]}, तो ${match[2]} का मान दशमलव सन्निकटन के बिना ज्ञात कीजिए।`
    : `ਜੇ x=${match[1]}, ਤਾਂ ${match[2]} ਦਾ ਮੁੱਲ ਦਸ਼ਮਲਵ ਅਨੁਮਾਨ ਤੋਂ ਬਿਨਾਂ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Using the conjugate of (.+), find (.+) where x=(.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} के संयुग्मी का उपयोग करके ${match[2]} ज्ञात कीजिए, जहाँ x=${match[3]}।`
    : `${match[1]} ਦੇ ਸੰਯੁਗਮੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[2]} ਪਤਾ ਕਰੋ, ਜਿੱਥੇ x=${match[3]}।`;

  match = text.match(/^For x=(.+), determine the exact value of (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `x=${match[1]} के लिए ${match[2]} का सटीक मान ज्ञात कीजिए।`
    : `x=${match[1]} ਲਈ ${match[2]} ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^The value used for x is (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `x के लिए प्रयुक्त मान ${match[1]} है।`
    : `x ਲਈ ਵਰਤਿਆ ਮੁੱਲ ${match[1]} ਹੈ।`;

  if (text === "The conjugate has product 1 with x, so it is exactly 1/x; adding the pair cancels the surd.") {
    return locale === "hi-IN"
      ? "संयुग्मी का x के साथ गुणनफल 1 है, इसलिए वह ठीक 1/x है; दोनों को जोड़ने पर करणी पद कट जाते हैं।"
      : "ਸੰਯੁਗਮੀ ਦਾ x ਨਾਲ ਗੁਣਨਫਲ 1 ਹੈ, ਇਸ ਲਈ ਉਹ ਠੀਕ 1/x ਹੈ; ਦੋਵਾਂ ਨੂੰ ਜੋੜਣ ਤੇ ਕਰਣੀ ਪਦ ਕੱਟ ਜਾਂਦੇ ਹਨ।";
  }

  if (text === "Use the reciprocal-conjugate relation to evaluate the target.") {
    return locale === "hi-IN"
      ? "पूछे गए मान के लिए व्युत्क्रम-संयुग्मी संबंध का उपयोग कीजिए।"
      : "ਪੁੱਛੇ ਗਏ ਮੁੱਲ ਲਈ ਵਿਉਤਕ੍ਰਮ-ਸੰਯੁਗਮੀ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰੋ।";
  }

  return undefined;
}
