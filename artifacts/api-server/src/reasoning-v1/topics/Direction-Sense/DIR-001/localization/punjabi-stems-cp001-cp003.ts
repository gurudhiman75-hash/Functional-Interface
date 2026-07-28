import { asR, coordinateTextPa, directionPa, personNamePa, relativeJourneyPa, turnNarrativePa, type R } from "./punjabi-foundation";

export function renderPunjabiStem001To010(english: R): string | null {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  const person = s.person ?? s.name ?? s.subject;
  const n = personNamePa(person);
  switch (qlId) {
    case "DIR-QL-001":
      return `${n} ਦਾ ਮੂੰਹ ਸ਼ੁਰੂ ਵਿੱਚ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ${turnNarrativePa(s.turns ?? [], person)} ਹੁਣ ਉਸ ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-002":
      return `${turnNarrativePa(s.turns ?? [], person)} ਇਹ ਸਾਰੇ ਮੋੜ ਲੈਣ ਤੋਂ ਬਾਅਦ ${n} ਦਾ ਮੂੰਹ ${directionPa(s.finalFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ਦੱਸੋ, ਸ਼ੁਰੂ ਵਿੱਚ ਉਸ ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ?`;
    case "DIR-QL-003":
      return `${n} ਦਾ ਮੂੰਹ ਪਹਿਲਾਂ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਸੀ ਅਤੇ ਮੋੜ ਲੈਣ ਤੋਂ ਬਾਅਦ ${directionPa(s.finalFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੋ ਗਿਆ। ਇਹ ਬਦਲਾਅ ਕਰਨ ਲਈ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਮੋੜ ਲਿਆ ਗਿਆ?`;
    case "DIR-QL-004": {
      const reverse = s.queryReference === "START_FROM_FINAL";
      return `${n} ਦਾ ਮੂੰਹ ਸ਼ੁਰੂ ਵਿੱਚ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ${relativeJourneyPa(s.operations ?? [], person)} ਦੱਸੋ, ${reverse ? "ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਅੰਤਿਮ ਬਿੰਦੂ ਤੋਂ" : "ਅੰਤਿਮ ਬਿੰਦੂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ"} ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    }
    case "DIR-QL-005":
      return `${n} ਦਾ ਮੂੰਹ ਸ਼ੁਰੂ ਵਿੱਚ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ${relativeJourneyPa(s.operations ?? [], person)} ਦੱਸੋ, ਅੰਤਿਮ ਬਿੰਦੂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ ਅਤੇ ਅੰਤ ਵਿੱਚ ${n} ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-006":
      return `${n} ਦਾ ਮੂੰਹ ਸ਼ੁਰੂ ਵਿੱਚ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ${relativeJourneyPa(s.operations ?? [], person)} ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`;
    case "DIR-QL-007": {
      const reverse = s.queryReference === "START_FROM_FINAL";
      return `${n} ਦਾ ਮੂੰਹ ਸ਼ੁਰੂ ਵਿੱਚ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ${relativeJourneyPa(s.operations ?? [], person)} ${reverse ? "ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਅੰਤਿਮ ਬਿੰਦੂ ਤੋਂ" : "ਅੰਤਿਮ ਬਿੰਦੂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ"} ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਅਤੇ ਕਿੰਨੀ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਉੱਤੇ ਹੈ?`;
    }
    case "DIR-QL-008":
      return `${n} ਦਾ ਮੂੰਹ ਸ਼ੁਰੂ ਵਿੱਚ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ${relativeJourneyPa(s.operations ?? [], person)} ਕ੍ਰਮਵਾਰ ਕੁੱਲ ਤੈਅ ਕੀਤੀ ਦੂਰੀ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਅੰਤਿਮ ਬਿੰਦੂ ਦੀ ਸਿੱਧੀ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`;
    case "DIR-QL-009":
      return `${n} ਦਾ ਮੂੰਹ ਸ਼ੁਰੂ ਵਿੱਚ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ${relativeJourneyPa(s.operations ?? [], person, s.unknownMoveNumber)} ਅੰਤਿਮ ਬਿੰਦੂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(s.targetEndpoint)} ਹੈ। ਜਿਸ ਚਾਲ ਦੀ ਦੂਰੀ ਨਹੀਂ ਦਿੱਤੀ ਗਈ, ਉਹ ਕਿੰਨੀ ਸੀ?`;
    case "DIR-QL-010":
      return `${n} ਦਾ ਮੂੰਹ ਸ਼ੁਰੂ ਵਿੱਚ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ${relativeJourneyPa(s.operations ?? [], person)} ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਕੱਢੋ। ${s.displayMode === "RADICAL" ? "ਉੱਤਰ ਨੂੰ ਸਰਲ ਕਰਨੀ ਰੂਪ ਵਿੱਚ ਦਿਓ।" : "ਉੱਤਰ ਨੂੰ ਇੱਕ ਦਸ਼ਮਲਵ ਸਥਾਨ ਤੱਕ ਦਿਓ।"}`;
    default: return null;
  }
}
