import type { SriLocalizedLocaleV1 } from "./permanent-localization-base-v1";
import { localizeSriC008C009FinalizedSurfaceV1 as localizeSriC008C009CoreV1 } from "./permanent-localization-c008-c009-core-v1";
import { localizeSriC010C012FinalizedSurfaceV1 } from "./permanent-localization-c010-c012-v1";

/**
 * Early finalized-surface localization authority for CP008-CP012.
 * CP008/CP009 remain byte-identical in the core module; later checkpoints
 * are delegated only when the proven core has no match.
 */
export function localizeSriC008C009FinalizedSurfaceV1(
  text: string,
  locale: SriLocalizedLocaleV1,
): string | undefined {
  const knownRadicand = text.match(/^Known radicand = (.+)\.$/u);
  if (knownRadicand) {
    return locale === "hi-IN"
      ? `ज्ञात करणीगत संख्या = ${knownRadicand[1]}।`
      : `ਜਾਣੀ ਕਰਣੀਗਤ ਸੰਖਿਆ = ${knownRadicand[1]}।`;
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
