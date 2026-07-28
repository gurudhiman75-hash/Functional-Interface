import { absoluteStepsPa, advancedOperationsPa, asR, coordinateTextPa, directionPa, metresPa, namePa, placePa, relationSentencePa, turnPa, type R } from "./punjabi-foundation";

export function renderPunjabiStem036To044(english: R): string | null {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  switch (qlId) {
    case "DIR-QL-036":
      return `${(s.visibleRelations ?? []).map((r: R) => relationSentencePa(r)).join(" ")} ਚੌਥਾ ਕਥਨ ${namePa(s.missingTo)} ਨੂੰ ${namePa(s.missingFrom)} ਤੋਂ ਬਿਲਕੁਲ ${metresPa(s.missingDistance)} ਦੂਰ ਰੱਖ ਕੇ ਇੱਕ ਪੂਰਾ ਬੰਦ ਨਕਸ਼ਾ ਬਣਾਉਂਦਾ ਹੈ। ${namePa(s.missingTo)} ਨੂੰ ${namePa(s.missingFrom)} ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?`;
    case "DIR-QL-037":
      return `${(s.anchorRelations ?? []).map((r: R) => relationSentencePa(r, false)).join(" ")} ਹੁਣ ਇਹ ਚਾਰ ਹੋਰ ਕਥਨ ਵੇਖੋ: ${(s.relations ?? []).map((r: R, i: number) => `(${i + 1}) ${relationSentencePa(r, false)}`).join(" ")} ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਸਿਰਫ਼ ਇੱਕ ਕਥਨ ਪੂਰੇ ਨਕਸ਼ੇ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ। ਗਲਤ ਕਥਨ ਕਿਹੜਾ ਹੈ?`;
    case "DIR-QL-038":
      return `${placePa(s.place)} ਵਿੱਚ ${namePa(s.subject)} ਦਾ ਰਸਤਾ ਇੱਕ ਨਿਸ਼ਾਨ ਲੱਗੇ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ। ਰਸਤਾ: ${(s.legs ?? []).map((leg: R) => leg.direction === "UNKNOWN" ? `${metresPa(leg.distance)} ਅਣਜਾਣ ਦਿਸ਼ਾ ਵੱਲ` : `${metresPa(leg.distance)} ${directionPa(leg.direction)} ਵੱਲ`).join(", ਫਿਰ ")}। ਅੰਤਿਮ ਥਾਂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(s.target)} ਹੈ। ਅਣਜਾਣ ਚਾਲ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ?`;
    case "DIR-QL-039":
      return `${placePa(s.place)} ਵਿੱਚ ${namePa(s.subject)} ਦਾ ਮੂੰਹ ਸ਼ੁਰੂ ਵਿੱਚ ${directionPa(s.initialFacing)} ਵੱਲ ਸੀ। ਪਹਿਲਾਂ ${metresPa(s.firstDistance)} ਸਿੱਧਾ ਤੁਰਨ ਤੋਂ ਬਾਅਦ ਅਗਲਾ ਮੋੜ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਫਿਰ ${metresPa(s.secondDistance)} ਸਿੱਧਾ ਤੁਰਨਾ, ${turnPa(s.knownTurn)} ਅਤੇ ${metresPa(s.thirdDistance)} ਸਿੱਧਾ ਤੁਰਨਾ ਹੈ। ਅੰਤਿਮ ਥਾਂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(s.target)} ਹੈ। ਛੱਡਿਆ ਗਿਆ ਹੁਕਮ ਕੀ ਸੀ?`;
    case "DIR-QL-040":
      return `${namePa(s.subject)} ਦੀ ਯਾਤਰਾ ${placePa(s.place)} ਵਿੱਚ ਇੱਕ ਨਿਸ਼ਾਨ ਲੱਗੇ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ। ਰਸਤਾ: ${advancedOperationsPa(s.operations ?? [])}। ਅੰਤਿਮ ਥਾਂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(s.target)} ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ?`;
    case "DIR-QL-041":
      return `${(s.relations ?? []).map((r: R) => relationSentencePa(r)).join(" ")} ਚਾਲ ${namePa(s.startEntity)} ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ: ${absoluteStepsPa(s.movements ?? [])}। ਅੰਤਿਮ ਥਾਂ ${namePa(s.referenceEntity)} ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਅਤੇ ਕਿੰਨੀ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਉੱਤੇ ਹੈ?`;
    case "DIR-QL-042":
      return `${placePa(s.place)} ਵਿੱਚ ${namePa(s.subject)} ਦੀ ਯਾਤਰਾ ਚੌਕੀ ${s.checkpoint} ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ ਅਤੇ ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ। ਰਸਤਾ: ${advancedOperationsPa(s.operations ?? [])}। ਅੰਤਿਮ ਥਾਂ ਚੌਕੀ ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-043":
      return `${placePa(s.place)} ਵਿੱਚ ${namePa(s.subject)} ਦੀ ਯਾਤਰਾ ਚੌਕੀ ${s.checkpoint} ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ ਅਤੇ ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ। ਰਸਤਾ: ${advancedOperationsPa(s.operations ?? [])}। ਅੰਤਿਮ ਥਾਂ ਅਤੇ ਚੌਕੀ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`;
    case "DIR-QL-044":
      return `ਚਿੱਤਰ ਦੋ ਥਾਵਾਂ ਦੇ ਆਪਸੀ ਸੰਬੰਧ ਦਿਖਾਉਂਦਾ ਹੈ। ਇਸ ਤੋਂ ਇਲਾਵਾ, ${relationSentencePa(s.textRelation)} ਚਿੱਤਰ ਅਤੇ ਲਿਖੇ ਕਥਨ ਦੋਵਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਦੱਸੋ ਕਿ ${namePa(s.queryTo)}, ${namePa(s.queryFrom)} ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    default: return null;
  }
}
