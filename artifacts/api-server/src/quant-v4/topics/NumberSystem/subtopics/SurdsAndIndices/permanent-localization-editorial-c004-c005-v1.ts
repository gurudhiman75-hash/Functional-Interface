import type { SriLocalizedLocaleV1 } from "./permanent-localization-base-v1";

/**
 * Whole-template editorial localization for CP004 runtime variants and the
 * CP005-H derived-target shell exposed by strict Phase-9 validation.
 * Captured mathematical fragments are emitted unchanged and in source order.
 */
export function localizeSriEditorialC004C005SurfaceV1(
  text: string,
  locale: SriLocalizedLocaleV1,
): string | undefined {
  let match: RegExpMatchArray | null;

  // C004-D: combine two supplied relations.
  match = text.match(/^If (.+?) and (.+?), find (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `यदि ${match[1]} और ${match[2]}, तो ${match[3]} ज्ञात कीजिए।`
      : `ਜੇ ${match[1]} ਅਤੇ ${match[2]}, ਤਾਂ ${match[3]} ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^The supplied condition is (.+?) and (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिए गए संबंध ${match[1]} और ${match[2]} हैं।`
      : `ਦਿੱਤੇ ਸੰਬੰਧ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  // C004-E: recover n from X/Y power definitions.
  match = text.match(/^Let (X = .+?) and (Y = .+?)\. If (Y = X\^n), find n\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `मान लीजिए ${match[1]} और ${match[2]}। यदि ${match[3]}, तो n ज्ञात कीजिए।`
      : `ਮੰਨੋ ${match[1]} ਅਤੇ ${match[2]}। ਜੇ ${match[3]}, ਤਾਂ n ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^For (X=.+?) and (Y=.+?), determine n when (Y=X\^n)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} और ${match[2]} के लिए, जब ${match[3]} हो तब n ज्ञात कीजिए।`
      : `${match[1]} ਅਤੇ ${match[2]} ਲਈ, ਜਦੋਂ ${match[3]} ਹੋਵੇ ਤਾਂ n ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Given (X=.+?) and (Y=.+?), find the exponent n in (Y=X\^n)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया है ${match[1]} और ${match[2]}। ${match[3]} में घातांक n ज्ञात कीजिए।`
      : `ਦਿੱਤਾ ਹੈ ${match[1]} ਅਤੇ ${match[2]}। ${match[3]} ਵਿੱਚ ਘਾਤਾਂਕ n ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^The supplied relations are (X = .+?) and (Y = .+?); (Y = X\^n)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिए गए संबंध ${match[1]} और ${match[2]} हैं; साथ ही ${match[3]}।`
      : `ਦਿੱਤੇ ਸੰਬੰਧ ${match[1]} ਅਤੇ ${match[2]} ਹਨ; ਨਾਲ ਹੀ ${match[3]}।`;
  }

  match = text.match(/^The supplied relation is (X=.+?) and (Y=.+?)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया संबंध ${match[1]} और ${match[2]} है।`
      : `ਦਿੱਤਾ ਸੰਬੰਧ ${match[1]} ਅਤੇ ${match[2]} ਹੈ।`;
  }

  match = text.match(/^Compare exponents after writing (X\^n) with the same base\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} को समान आधार में लिखने के बाद घातांकों की तुलना कीजिए।`
      : `${match[1]} ਨੂੰ ਇੱਕੋ ਅਧਾਰ ਵਿੱਚ ਲਿਖਣ ਤੋਂ ਬਾਅਦ ਘਾਤਾਂਕਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।`;
  }

  // C004-F: recover k from transformed power value.
  match = text.match(/^Given (.+?) while (.+?), determine k\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} दिया है, जबकि ${match[2]}। k ज्ञात कीजिए।`
      : `${match[1]} ਦਿੱਤਾ ਹੈ, ਜਦਕਿ ${match[2]}। k ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^The values (.+?) and (.+?) are known\. What is k\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} और ${match[2]} के मान दिए हैं। k का मान क्या है?`
      : `${match[1]} ਅਤੇ ${match[2]} ਦੇ ਮੁੱਲ ਦਿੱਤੇ ਹਨ। k ਦਾ ਮੁੱਲ ਕੀ ਹੈ?`;
  }

  match = text.match(/^The supplied values are (.+?) and (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिए गए मान ${match[1]} और ${match[2]} हैं।`
      : `ਦਿੱਤੇ ਮੁੱਲ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  // C004-G: recover k-factor and apply it once more.
  match = text.match(/^Given (.+?) and (.+?), evaluate (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया है ${match[1]} और ${match[2]}। ${match[3]} का मान ज्ञात कीजिए।`
      : `ਦਿੱਤਾ ਹੈ ${match[1]} ਅਤੇ ${match[2]}। ${match[3]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Using the two relations (.+?) and (.+?), determine (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दोनों संबंध ${match[1]} और ${match[2]} का उपयोग करके ${match[3]} ज्ञात कीजिए।`
      : `ਦੋਵੇਂ ਸੰਬੰਧ ${match[1]} ਅਤੇ ${match[2]} ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[3]} ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^The supplied relation is the two relations (.+?) and (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिए गए दो संबंध ${match[1]} और ${match[2]} हैं।`
      : `ਦਿੱਤੇ ਦੋ ਸੰਬੰਧ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  // C005-H: explanation-state keeps both equation and derived target visible.
  match = text.match(/^The given equation is (.+?) and then evaluate (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया समीकरण ${match[1]} है और फिर ${match[2]} का मान ज्ञात करना है।`
      : `ਦਿੱਤਾ ਸਮੀਕਰਨ ${match[1]} ਹੈ ਅਤੇ ਫਿਰ ${match[2]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰਨਾ ਹੈ।`;
  }

  return undefined;
}
