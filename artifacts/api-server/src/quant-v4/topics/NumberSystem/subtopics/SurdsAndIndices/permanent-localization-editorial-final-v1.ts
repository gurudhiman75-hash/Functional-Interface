import type { SriLocalizedLocaleV1 } from "./permanent-localization-base-v1";

/**
 * Final narrow whole-template authority for residual learner-facing prose
 * exposed only after the semantic/parity corpus was fully green.
 * Mathematical captures are emitted unchanged and in source order.
 */
export function localizeSriEditorialFinalSurfaceV1(
  text: string,
  locale: SriLocalizedLocaleV1,
): string | undefined {
  let match: RegExpMatchArray | null;

  // C004-F derived explanation shell: X while Y.
  match = text.match(/^The supplied (?:relation|condition) is (?:Given )?(.+?) while (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिए गए संबंध ${match[1]} और ${match[2]} हैं।`
      : `ਦਿੱਤੇ ਸੰਬੰਧ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  // C005-F quadratic-in-a^x stems and derived equation shell.
  match = text.match(/^If (\(.+?\)\^2 - .+? = 0), find the integer x\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `यदि ${match[1]}, तो पूर्णांक x ज्ञात कीजिए।`
      : `ਜੇ ${match[1]}, ਤਾਂ ਪੂਰਨ ਅੰਕ x ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Solve (.+?) for integer x\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} को हल कीजिए, जहाँ x पूर्णांक है।`
      : `${match[1]} ਨੂੰ ਹੱਲ ਕਰੋ, ਜਿੱਥੇ x ਪੂਰਨ ਅੰਕ ਹੈ।`;
  }

  match = text.match(/^Using (y=.+?), determine the integer x satisfying (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} का उपयोग करके वह पूर्णांक x ज्ञात कीजिए जो ${match[2]} को संतुष्ट करता है।`
      : `${match[1]} ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਉਹ ਪੂਰਨ ਅੰਕ x ਪਤਾ ਕਰੋ ਜੋ ${match[2]} ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਦਾ ਹੈ।`;
  }

  match = text.match(/^The given equation is (.+?) for integer x\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया समीकरण ${match[1]} है, जहाँ x पूर्णांक है।`
      : `ਦਿੱਤਾ ਸਮੀਕਰਨ ${match[1]} ਹੈ, ਜਿੱਥੇ x ਪੂਰਨ ਅੰਕ ਹੈ।`;
  }

  // C005-G derived common-exponent explanation shells.
  match = text.match(/^The supplied information is (?:For )?(.+?), the common (.+?)-exponent is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दी गई जानकारी में ${match[1]} है और समान ${match[2]}-घातांक ${match[3]} है।`
      : `ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਵਿੱਚ ${match[1]} ਹੈ ਅਤੇ ਸਾਂਝਾ ${match[2]}-ਘਾਤਾਂਕ ${match[3]} ਹੈ।`;
  }

  match = text.match(/^The supplied relation is (?:If |Given )?(.+?) and (?:their |the )common exponent on base (.+?) is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया संबंध ${match[1]} है और आधार ${match[2]} पर समान घातांक ${match[3]} है।`
      : `ਦਿੱਤਾ ਸੰਬੰਧ ${match[1]} ਹੈ ਅਤੇ ਅਧਾਰ ${match[2]} ਉੱਤੇ ਸਾਂਝਾ ਘਾਤਾਂਕ ${match[3]} ਹੈ।`;
  }

  // C006-D exact comparison/classification stems and derived given shells.
  match = text.match(/^Compare exactly: (.+?) versus (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} और ${match[2]} की सटीक तुलना कीजिए।`
      : `${match[1]} ਅਤੇ ${match[2]} ਦੀ ਸਟੀਕ ਤੁਲਨਾ ਕਰੋ।`;
  }

  match = text.match(/^Classify the relation between (.+?) and (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} और ${match[2]} के बीच संबंध निर्धारित कीजिए।`
      : `${match[1]} ਅਤੇ ${match[2]} ਵਿਚਕਾਰ ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਕਰੋ।`;
  }

  match = text.match(/^The quantities to compare are (.+?) versus (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `तुलना की जाने वाली राशियाँ ${match[1]} और ${match[2]} हैं।`
      : `ਤੁਲਨਾ ਲਈ ਰਾਸ਼ੀਆਂ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  match = text.match(/^The powers to compare are (.+?) and (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `तुलना की जाने वाली घातें ${match[1]} और ${match[2]} हैं।`
      : `ਤੁਲਨਾ ਲਈ ਘਾਤਾਂ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  // C007-F representation-conversion derived shell.
  match = text.match(/^The radical form to convert is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `बदला जाने वाला मूल रूप ${match[1]} है।`
      : `ਬਦਲਿਆ ਜਾਣ ਵਾਲਾ ਮੂਲ ਰੂਪ ${match[1]} ਹੈ।`;
  }

  // C008-F conjugate-product derived shell.
  match = text.match(/^The conjugate product is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `संयुग्मी गुणनफल ${match[1]} है।`
      : `ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ ${match[1]} ਹੈ।`;
  }

  // C009-B/C/D/E direct fraction-only rationalisation stems. Do not capture
  // longer C009 method sentences such as "Rationalise each..." or
  // "Rationalise with the conjugate..."; those belong to the proven core.
  match = text.match(/^Rationalise (.+)\.$/u);
  if (match && match[1]!.startsWith("\\frac{")) {
    return locale === "hi-IN"
      ? `${match[1]} का हर परिमेय कीजिए।`
      : `${match[1]} ਦਾ ਹਰ ਪਰਿਮੇਯ ਕਰੋ।`;
  }

  // C009-F derived simplification shell.
  match = text.match(/^The expression to simplify is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `सरल किया जाने वाला व्यंजक ${match[1]} है।`
      : `ਸਰਲ ਕੀਤਾ ਜਾਣ ਵਾਲਾ ਵਿਅੰਜਕ ${match[1]} ਹੈ।`;
  }

  // C009-I multi-sentence stem -> derived supplied-information shell.
  match = text.match(/^The supplied information is Let x=(.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया है x=${match[1]}।`
      : `ਦਿੱਤਾ ਹੈ x=${match[1]}।`;
  }

  // C011-B/C exact-comparison derived shells. Keep qualifiers outside the
  // captured mathematical operands so no English prose is carried through.
  match = text.match(/^The quantities to compare are the positive surds (.+?) and (.+?) by exact arithmetic\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `सटीक गणना से तुलना की जाने वाली धनात्मक करणियाँ ${match[1]} और ${match[2]} हैं।`
      : `ਸਟੀਕ ਗਣਨਾ ਨਾਲ ਤੁਲਨਾ ਲਈ ਧਨਾਤਮਕ ਕਰਣੀਆਂ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  match = text.match(/^The quantities to compare are the different-index radicals (.+?) and (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `तुलना की जाने वाली भिन्न-घातांक करणियाँ ${match[1]} और ${match[2]} हैं।`
      : `ਤੁਲਨਾ ਲਈ ਵੱਖਰੇ-ਘਾਤਾਂਕ ਕਰਣੀਆਂ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  // C011-C different-index radical generic derived shell.
  match = text.match(/^The (?:radicals|quantities) to compare are (.+?) and (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `तुलना की जाने वाली करणियाँ ${match[1]} और ${match[2]} हैं।`
      : `ਤੁਲਨਾ ਲਈ ਕਰਣੀਆਂ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  // C011-G Solve ... for bounded x -> derived equation shell.
  match = text.match(/^The given equation is (.+?) for (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया समीकरण ${match[1]} है, जहाँ ${match[2]}।`
      : `ਦਿੱਤਾ ਸਮੀਕਰਨ ${match[1]} ਹੈ, ਜਿੱਥੇ ${match[2]}।`;
  }

  // C011-I multi-sentence truth-set stem -> supplied-information shell.
  match = text.match(/^The supplied information is (.+?), consider (?:the )?statements: (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} के लिए इन कथनों पर विचार कीजिए: ${match[2]}।`
      : `${match[1]} ਲਈ ਇਨ੍ਹਾਂ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: ${match[2]}।`;
  }

  return undefined;
}
