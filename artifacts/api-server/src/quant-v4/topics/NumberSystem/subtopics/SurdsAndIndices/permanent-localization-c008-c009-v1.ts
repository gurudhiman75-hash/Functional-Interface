import type { SriLocalizedLocaleV1 } from "./permanent-localization-base-v1";
import { localizeSriC008C009FinalizedSurfaceV1 as localizeSriC008C009CoreV1 } from "./permanent-localization-c008-c009-core-v1";
import { localizeSriC010C012FinalizedSurfaceV1 } from "./permanent-localization-c010-c012-v1";
import { localizeSriEditorialSurfaceV1 } from "./permanent-localization-editorial-v1";
import { localizeSriResidualSurfaceV1 } from "./permanent-localization-residual-v1";

/**
 * Early finalized-surface localization authority.
 * CP008/CP009 remain byte-identical in the core module; later checkpoint and
 * strict-audit residual surfaces are delegated before generic localization.
 */
export function localizeSriC008C009FinalizedSurfaceV1(
  text: string,
  locale: SriLocalizedLocaleV1,
): string | undefined {
  // C009-H has A+B before the fraction in English; retain that visible math order.
  const rationalisedCoefficientTarget = text.match(/^Determine A\+B from the rationalised form of (.+)\.$/u);
  if (rationalisedCoefficientTarget) {
    return locale === "hi-IN"
      ? `A+B का मान ${rationalisedCoefficientTarget[1]} के परिमेयकृत रूप से ज्ञात कीजिए।`
      : `A+B ਦਾ ਮੁੱਲ ${rationalisedCoefficientTarget[1]} ਦੇ ਪਰਿਮੇਯਕ੍ਰਿਤ ਰੂਪ ਤੋਂ ਪਤਾ ਕਰੋ।`;
  }

  const editorial = localizeSriEditorialSurfaceV1(text, locale);
  if (editorial) return editorial;

  // C012-E strict residuals exposed after all earlier families cleared in run #70.
  const simplifyThenFind = text.match(/^First simplify the surd, then find (.+)\.$/u);
  if (simplifyThenFind) {
    return locale === "hi-IN"
      ? `पहले करणी को सरल कीजिए, फिर ${simplifyThenFind[1]} ज्ञात कीजिए।`
      : `ਪਹਿਲਾਂ ਕਰਣੀ ਨੂੰ ਸਰਲ ਕਰੋ, ਫਿਰ ${simplifyThenFind[1]} ਪਤਾ ਕਰੋ।`;
  }

  const mixedSurdIndex = text.match(/^The mixed surd-index expression is (.+)\.$/u);
  if (mixedSurdIndex) {
    return locale === "hi-IN"
      ? `मिश्रित करणी-घातांक व्यंजक ${mixedSurdIndex[1]} है।`
      : `ਮਿਸ਼ਰਤ ਕਰਣੀ-ਘਾਤਾਂਕ ਵਿਅੰਜਕ ${mixedSurdIndex[1]} ਹੈ।`;
  }

  const residual = localizeSriResidualSurfaceV1(text, locale);
  if (residual) return residual;

  const knownRadicand = text.match(/^Known radicand = (.+)\.$/u);
  if (knownRadicand) {
    return locale === "hi-IN"
      ? `ज्ञात करणीगत संख्या = ${knownRadicand[1]}।`
      : `ਜਾਣੀ ਕਰਣੀਗਤ ਸੰਖਿਆ = ${knownRadicand[1]}।`;
  }

  const orderedPair = text.match(/^Find the ordered pair \(A,B\) when (.+)\.$/u);
  if (orderedPair) {
    return locale === "hi-IN"
      ? `(A,B) क्रमित युग्म ज्ञात कीजिए, जब ${orderedPair[1]}।`
      : `(A,B) ਕ੍ਰਮਿਤ ਜੋੜਾ ਪਤਾ ਕਰੋ, ਜਦੋਂ ${orderedPair[1]}।`;
  }

  const truthSet = text.match(/^Truth set: (.+)\.$/u);
  if (truthSet) {
    const value = localizeTruthSetValue(truthSet[1], locale);
    if (value) {
      return locale === "hi-IN"
        ? `सत्य कथन: ${value}।`
        : `ਸੱਚ ਕਥਨ: ${value}।`;
    }
  }

  const originalCheck = text.match(/^Original-equation check: (.+)\.$/u);
  if (originalCheck) {
    const reason = localizeRadicalCandidateReason(originalCheck[1], locale);
    if (reason) return locale === "hi-IN" ? `मूल समीकरण की जाँच: ${reason}।` : `ਮੂਲ ਸਮੀਕਰਨ ਦੀ ਜਾਂਚ: ${reason}।`;
  }

  const candidateCheck = text.match(/^For x=(.+): (.+)\.$/u);
  if (candidateCheck) {
    const reason = localizeRadicalCandidateReason(candidateCheck[2], locale);
    if (reason) return locale === "hi-IN" ? `x=${candidateCheck[1]} के लिए: ${reason}।` : `x=${candidateCheck[1]} ਲਈ: ${reason}।`;
  }

  const rejectCandidate = text.match(/^Reject x=(.+)\.$/u);
  if (rejectCandidate) {
    return locale === "hi-IN" ? `x=${rejectCandidate[1]} को अस्वीकार कीजिए।` : `x=${rejectCandidate[1]} ਨੂੰ ਰੱਦ ਕਰੋ।`;
  }

  return localizeSriC008C009CoreV1(text, locale)
    ?? localizeSriC010C012FinalizedSurfaceV1(text, locale);
}

function localizeTruthSetValue(text: string, locale: SriLocalizedLocaleV1): string | undefined {
  if (text === "Both I and II") return locale === "hi-IN" ? "I और II दोनों" : "I ਅਤੇ II ਦੋਵੇਂ";
  if (text === "Only I") return locale === "hi-IN" ? "केवल I" : "ਕੇਵਲ I";
  if (text === "Only II") return locale === "hi-IN" ? "केवल II" : "ਕੇਵਲ II";
  if (text === "Neither I nor II") return locale === "hi-IN" ? "न I, न II" : "ਨਾ I, ਨਾ II";
  return undefined;
}

function localizeRadicalCandidateReason(text: string, locale: SriLocalizedLocaleV1): string | undefined {
  if (text === "radicand is negative in the original equation") {
    return locale === "hi-IN"
      ? "मूल समीकरण में करणीगत संख्या ऋणात्मक है"
      : "ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਕਰਣੀਗਤ ਸੰਖਿਆ ਰਿਣਾਤਮਕ ਹੈ";
  }
  if (text === "principal square root cannot equal a negative right-hand side") {
    return locale === "hi-IN"
      ? "मुख्य वर्गमूल ऋणात्मक दाएँ पक्ष के बराबर नहीं हो सकता"
      : "ਮੁੱਖ ਵਰਗਮੂਲ ਰਿਣਾਤਮਕ ਸੱਜੇ ਪਾਸੇ ਦੇ ਬਰਾਬਰ ਨਹੀਂ ਹੋ ਸਕਦਾ";
  }
  if (text === "candidate fails substitution into the original equation") {
    return locale === "hi-IN"
      ? "मान को मूल समीकरण में रखने पर समानता पूरी नहीं होती"
      : "ਮੁੱਲ ਨੂੰ ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਰੱਖਣ ਤੇ ਬਰਾਬਰੀ ਪੂਰੀ ਨਹੀਂ ਹੁੰਦੀ";
  }
  if (text === "candidate satisfies the original radical equation") {
    return locale === "hi-IN"
      ? "मान मूल करणी समीकरण को संतुष्ट करता है"
      : "ਮੁੱਲ ਮੂਲ ਕਰਣੀ ਸਮੀਕਰਨ ਨੂੰ ਪੂਰਾ ਕਰਦਾ ਹੈ";
  }
  return undefined;
}
