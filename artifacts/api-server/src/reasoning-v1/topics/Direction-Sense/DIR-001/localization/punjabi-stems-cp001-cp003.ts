import { asR, coordinateTextPa, directionPa, personNamePa, relativeOperationsPa, turnSequencePa, type R } from "./punjabi-foundation";

export function renderPunjabiStem001To010(english: R): string | null {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  const n = personNamePa(s.person ?? s.name ?? s.subject);
  switch (qlId) {
    case "DIR-QL-001":
      return `${n} ਦਾ ਮੂੰਹ ਸ਼ੁਰੂ ਵਿੱਚ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ। ਇਸ ਤੋਂ ਬਾਅਦ ਹੁਕਮ ਹਨ: ${turnSequencePa(s.turns ?? [])}। ਅੰਤ ਵਿੱਚ ਉਸ ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੋਵੇਗਾ?`;
    case "DIR-QL-002":
      return `${n} ਲਈ ਹੁਕਮ ਹਨ: ${turnSequencePa(s.turns ?? [])}। ਇਹ ਹੁਕਮ ਮੰਨਣ ਤੋਂ ਬਾਅਦ ਮੂੰਹ ${directionPa(s.finalFacing)} ਵੱਲ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ?`;
    case "DIR-QL-003":
      return `${n} ਦਾ ਮੂੰਹ ਪਹਿਲਾਂ ${directionPa(s.initialFacing)} ਵੱਲ ਸੀ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ${directionPa(s.finalFacing)} ਵੱਲ ਹੋ ਗਿਆ। ਇਹ ਬਦਲਾਅ ਕਰਨ ਲਈ ਕਿਹੜਾ ਹੁਕਮ ਠੀਕ ਹੈ?`;
    case "DIR-QL-004": {
      const reverse = s.queryReference === "START_FROM_FINAL";
      return `${n} ਦੀ ਯਾਤਰਾ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ; ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ। ਰਸਤਾ: ${relativeOperationsPa(s.operations ?? [])}। ${reverse ? "ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਅੰਤਿਮ ਥਾਂ ਤੋਂ" : "ਅੰਤਿਮ ਥਾਂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ"} ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    }
    case "DIR-QL-005":
      return `${n} ਦੀ ਯਾਤਰਾ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ; ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ। ਰਸਤਾ: ${relativeOperationsPa(s.operations ?? [])}। ਅੰਤਿਮ ਥਾਂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ ਅਤੇ ਅੰਤ ਵਿੱਚ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-006":
      return `${n} ਦੀ ਯਾਤਰਾ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ; ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ। ਰਸਤਾ: ${relativeOperationsPa(s.operations ?? [])}। ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`;
    case "DIR-QL-007": {
      const reverse = s.queryReference === "START_FROM_FINAL";
      return `${n} ਦੀ ਯਾਤਰਾ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ; ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ। ਰਸਤਾ: ${relativeOperationsPa(s.operations ?? [])}। ${reverse ? "ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਅੰਤਿਮ ਥਾਂ ਤੋਂ" : "ਅੰਤਿਮ ਥਾਂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ"} ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਅਤੇ ਕਿੰਨੀ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਉੱਤੇ ਹੈ?`;
    }
    case "DIR-QL-008":
      return `${n} ਦੀ ਯਾਤਰਾ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ; ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ। ਰਸਤਾ: ${relativeOperationsPa(s.operations ?? [])}। ਕ੍ਰਮਵਾਰ ਕੁੱਲ ਤੈਅ ਕੀਤੀ ਦੂਰੀ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`;
    case "DIR-QL-009":
      return `${n} ਦੀ ਯਾਤਰਾ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ; ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ। ਰਸਤਾ: ${relativeOperationsPa(s.operations ?? [], s.unknownMoveNumber)}। ਅੰਤਿਮ ਥਾਂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(s.targetEndpoint)} ਹੈ। ਅਣਜਾਣ ਚਾਲ ਦੀ ਦੂਰੀ ਕਿੰਨੀ ਸੀ?`;
    case "DIR-QL-010":
      return `${n} ਦੀ ਯਾਤਰਾ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ; ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ। ਰਸਤਾ: ${relativeOperationsPa(s.operations ?? [])}। ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਕੱਢੋ। ${s.displayMode === "RADICAL" ? "ਉੱਤਰ ਨੂੰ ਸਰਲ ਕਰਨੀ ਰੂਪ ਵਿੱਚ ਦਿਓ।" : "ਉੱਤਰ ਨੂੰ ਇੱਕ ਦਸ਼ਮਲਵ ਸਥਾਨ ਤੱਕ ਦਿਓ।"}`;
    default: return null;
  }
}
