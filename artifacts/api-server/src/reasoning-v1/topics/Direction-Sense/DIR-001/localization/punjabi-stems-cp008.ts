import { absoluteJourneyPa, absoluteLegJourneyPa, advancedJourneyPa, asR, canonicalTurnLinkPa, coordinateTextPa, directionPa, metresPa, namePa, personGenderPa, placePa, relationSentencePa, walkVerbPa, type R } from "./punjabi-foundation";

const startsWalkingPa = (person: unknown): string => personGenderPa(person) === "F"
  ? "ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦੀ ਹੈ"
  : "ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ";

export function renderPunjabiStem036To044(english: R): string | null {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  switch (qlId) {
    case "DIR-QL-036":
      return `${(s.visibleRelations ?? []).map((r: R) => relationSentencePa(r)).join(" ")} ਚੌਥਾ ਕਥਨ ${namePa(s.missingTo)} ਨੂੰ ${namePa(s.missingFrom)} ਤੋਂ ਬਿਲਕੁਲ ${metresPa(s.missingDistance)} ਦੂਰ ਰੱਖ ਕੇ ਪੂਰਾ ਬੰਦ ਨਕਸ਼ਾ ਬਣਾਉਂਦਾ ਹੈ। ${namePa(s.missingTo)} ਨੂੰ ${namePa(s.missingFrom)} ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?`;
    case "DIR-QL-037":
      return `${(s.anchorRelations ?? []).map((r: R) => relationSentencePa(r, false)).join(" ")} ਹੁਣ ਇਹ ਚਾਰ ਹੋਰ ਕਥਨ ਵੇਖੋ: ${(s.relations ?? []).map((r: R, i: number) => `(${i + 1}) ${relationSentencePa(r, false)}`).join(" ")} ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਸਿਰਫ਼ ਇੱਕ ਕਥਨ ਪੂਰੇ ਨਕਸ਼ੇ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ। ਗਲਤ ਕਥਨ ਕਿਹੜਾ ਹੈ?`;
    case "DIR-QL-038":
      return `${placePa(s.place)} ਵਿੱਚ ${namePa(s.subject)} ਇੱਕ ਨਿਸ਼ਾਨ ਲੱਗੇ ਬਿੰਦੂ ਤੋਂ ${startsWalkingPa(s.subject)}। ${absoluteLegJourneyPa(s.legs ?? [], s.subject)} ਅੰਤਿਮ ਬਿੰਦੂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(s.target)} ਹੈ। ਜਿਸ ਚਾਲ ਦੀ ਦਿਸ਼ਾ ਨਹੀਂ ਦਿੱਤੀ ਗਈ, ਉਹ ਕਿਹੜੀ ਸੀ?`;
    case "DIR-QL-039": {
      const n = namePa(s.subject);
      const walk = walkVerbPa(s.subject);
      return `${placePa(s.place)} ਵਿੱਚ ${n} ਦਾ ਮੂੰਹ ਸ਼ੁਰੂ ਵਿੱਚ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਸੀ। ${n} ਪਹਿਲਾਂ ${metresPa(s.firstDistance)} ਸਿੱਧਾ ${walk}। ਇਸ ਤੋਂ ਬਾਅਦ ਲਿਆ ਗਿਆ ਮੋੜ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ। ਫਿਰ ਉਹ ${metresPa(s.secondDistance)} ਸਿੱਧਾ ${walk}। ਅੰਤ ਵਿੱਚ ਉਹ ${canonicalTurnLinkPa(s.knownTurn)} ${metresPa(s.thirdDistance)} ਹੋਰ ${walk}। ਅੰਤਿਮ ਬਿੰਦੂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(s.target)} ਹੈ। ਵਿਚਕਾਰ ਛੱਡਿਆ ਗਿਆ ਮੋੜ ਕਿਹੜਾ ਸੀ?`;
    }
    case "DIR-QL-040":
      return `${placePa(s.place)} ਵਿੱਚ ${namePa(s.subject)} ਇੱਕ ਨਿਸ਼ਾਨ ਲੱਗੇ ਬਿੰਦੂ ਤੋਂ ${startsWalkingPa(s.subject)}। ${advancedJourneyPa(s.operations ?? [], s.subject)} ਅੰਤਿਮ ਬਿੰਦੂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(s.target)} ਹੈ। ਦੱਸੋ, ਸ਼ੁਰੂ ਵਿੱਚ ਉਸ ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ?`;
    case "DIR-QL-041": {
      const person = { name: "ਵਿਅਕਤੀ", pronoun: "He" };
      return `${(s.relations ?? []).map((r: R) => relationSentencePa(r)).join(" ")} ਇੱਕ ਵਿਅਕਤੀ ${namePa(s.startEntity)} ਤੋਂ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${absoluteJourneyPa(s.movements ?? [], person)} ਉਸ ਦਾ ਅੰਤਿਮ ਬਿੰਦੂ ${namePa(s.referenceEntity)} ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਅਤੇ ਕਿੰਨੀ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਉੱਤੇ ਹੈ?`;
    }
    case "DIR-QL-042":
      return `${placePa(s.place)} ਵਿੱਚ ${namePa(s.subject)} ਚੌਕੀ ${s.checkpoint} ਤੋਂ ${startsWalkingPa(s.subject)} ਅਤੇ ਸ਼ੁਰੂ ਵਿੱਚ ਉਸ ਦਾ ਮੂੰਹ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ${advancedJourneyPa(s.operations ?? [], s.subject)} ਅੰਤਿਮ ਬਿੰਦੂ ਚੌਕੀ ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-043":
      return `${placePa(s.place)} ਵਿੱਚ ${namePa(s.subject)} ਚੌਕੀ ${s.checkpoint} ਤੋਂ ${startsWalkingPa(s.subject)} ਅਤੇ ਸ਼ੁਰੂ ਵਿੱਚ ਉਸ ਦਾ ਮੂੰਹ ${directionPa(s.initialFacing)} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ${advancedJourneyPa(s.operations ?? [], s.subject)} ਅੰਤਿਮ ਬਿੰਦੂ ਅਤੇ ਚੌਕੀ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`;
    case "DIR-QL-044":
      return `ਚਿੱਤਰ ਦੋ ਬਿੰਦੂਆਂ ਦੇ ਆਪਸੀ ਸੰਬੰਧ ਦਿਖਾਉਂਦਾ ਹੈ। ਇਸ ਤੋਂ ਇਲਾਵਾ, ${relationSentencePa(s.textRelation)} ਚਿੱਤਰ ਅਤੇ ਲਿਖੇ ਕਥਨ ਦੋਵਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਦੱਸੋ ਕਿ ${namePa(s.queryTo)}, ${namePa(s.queryFrom)} ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    default: return null;
  }
}
