import { advancedJourneyPa, asR, codeMapTextPa, codedChainPa, codedMovementJourneyPa, directionPa, evidenceChainPa, namePa, placePa, sidePa, sunTimePa, type R } from "./punjabi-foundation";

export function renderPunjabiStem023To035(english: R): string | null {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  switch (qlId) {
    case "DIR-QL-023":
      return `ਦਿਸ਼ਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਅਨੁਸਾਰ ${codeMapTextPa(s.codeMap)}। ਦਿੱਤੇ ਕਥਨ ਹਨ: ${codedChainPa(s.relations ?? [])}। ${namePa(s.query.subject)}, ${namePa(s.query.reference)} ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-024":
      return `ਦਿਸ਼ਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਅਨੁਸਾਰ ${codeMapTextPa(s.codeMap)}। ਦਿੱਤੇ ਕਥਨ ਹਨ: ${codedChainPa(s.relations ?? [])}। ${namePa(s.query.reference)} ਤੋਂ ${directionPa(s.query.direction)} ਵੱਲ ਕੌਣ ਹੈ?`;
    case "DIR-QL-025":
      return `ਚਿੰਨ੍ਹ @, #, % ਅਤੇ & ਵਿੱਚੋਂ ਹਰ ਇੱਕ ਉੱਤਰ, ਪੂਰਬ, ਦੱਖਣ ਜਾਂ ਪੱਛਮ ਵਿੱਚੋਂ ਇੱਕ ਦਿਸ਼ਾ ਦੱਸਦਾ ਹੈ। ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਹੈ: ${(s.evidence ?? []).map((e: R) => `“${evidenceChainPa(e)}” ਦਾ ਨਤੀਜਾ ${directionPa(e.resultDirection)} ਹੈ`).join("; ")}। ਕਿਹੜਾ ਚਿੰਨ੍ਹ ${directionPa(s.targetDirection)} ਦਿਸ਼ਾ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`;
    case "DIR-QL-026":
      return `ਦਿਸ਼ਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਅਨੁਸਾਰ ${codeMapTextPa(s.codeMap)}। ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਦੱਸਦਾ ਹੈ ਕਿ ${namePa(s.targetRelation.subject)}, ${namePa(s.targetRelation.reference)} ਤੋਂ ${directionPa(s.targetRelation.direction)} ਵੱਲ ਹੈ?`;
    case "DIR-QL-027":
      return `ਦਿਸ਼ਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਅਨੁਸਾਰ ${codeMapTextPa(s.codeMap)}। ਲੜੀ “${codedChainPa(s.relations ?? [])}” ਨੂੰ ਪੜ੍ਹੋ ਅਤੇ ਦੱਸੋ ਕਿ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਸਹੀ ਹੈ।`;
    case "DIR-QL-028":
      return `ਦਿਸ਼ਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਅਨੁਸਾਰ ${codeMapTextPa(s.codeMap)}। ਲੜੀ “${codedChainPa(s.relations ?? [], s.hiddenIndex)}” ਵਿੱਚ ? ਦੀ ਥਾਂ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਆਵੇਗਾ, ਤਾਂ ਜੋ ${namePa(s.targetRelation.subject)}, ${namePa(s.targetRelation.reference)} ਤੋਂ ${directionPa(s.targetRelation.direction)} ਵੱਲ ਹੋਵੇ?`;
    case "DIR-QL-029":
      return `ਚਾਲ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਅਨੁਸਾਰ ${codeMapTextPa(s.codeMap, true)}। ${codedMovementJourneyPa(s.steps ?? [])} ਅੰਤਿਮ ਬਿੰਦੂ, ਬਿੰਦੂ O ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-030":
      return `${sunTimePa(s.period, s.variation ?? english.seed)} ਸਾਫ਼ ਮੌਸਮ ਵਿੱਚ ${s.target === "SUN" ? "ਸੂਰਜ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਦਿੱਸੇਗਾ" : "ਖੜ੍ਹੇ ਖੰਭੇ ਦੀ ਪਰਛਾਂਵਾਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਪਵੇਗੀ"}?`;
    case "DIR-QL-031":
      return `${sunTimePa(s.period, s.variation ?? english.seed)} ${placePa(s.place)} ਵਿੱਚ ${namePa(s.name)} ਦੀ ਪਰਛਾਂਵਾਂ ਬਿਲਕੁਲ ${sidePa(s.side)} ਪਈ। ${namePa(s.name)} ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ?`;
    case "DIR-QL-032":
      return `${sunTimePa(s.period, s.variation ?? english.seed)} ${placePa(s.place)} ਵਿੱਚ ${namePa(s.name)} ਦਾ ਮੂੰਹ ${directionPa(s.facing)} ਦਿਸ਼ਾ ਵੱਲ ਸੀ। ਉਸ ਦੀ ਪਰਛਾਂਵਾਂ ਕਿਸ ਪਾਸੇ ਪਵੇਗੀ?`;
    case "DIR-QL-033":
      return `ਸਾਫ਼ ਮੌਸਮ ਵਿੱਚ ${placePa(s.place)} ਵਿੱਚ ${namePa(s.name)} ਦਾ ਮੂੰਹ ${directionPa(s.facing)} ਦਿਸ਼ਾ ਵੱਲ ਸੀ ਅਤੇ ਪਰਛਾਂਵਾਂ ਬਿਲਕੁਲ ${sidePa(s.side)} ਪਈ। ਇਹ ਘਟਨਾ ਸਵੇਰ ਦੀ ਸੀ ਜਾਂ ਸ਼ਾਮ ਦੀ?`;
    case "DIR-QL-034": {
      const operations = (s.turns ?? []).map((turn: string) => ({ kind: "TURN", turn }));
      return `${sunTimePa(s.period, s.variation ?? english.seed)} ${placePa(s.place)} ਵਿੱਚ ${namePa(s.name)} ਦੀ ਪਰਛਾਂਵਾਂ ਬਿਲਕੁਲ ${sidePa(s.side)} ਪਈ। ${advancedJourneyPa(operations, s.name)} ਹੁਣ ${namePa(s.name)} ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    }
    case "DIR-QL-035": {
      const facingRelation = s.relation === "SAME_DIRECTION"
        ? `${namePa(s.secondName)} ਦਾ ਮੂੰਹ ਵੀ ${namePa(s.firstName)} ਵਾਲੀ ਹੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ।`
        : `${namePa(s.secondName)} ਦਾ ਮੂੰਹ ${namePa(s.firstName)} ਦੇ ਮੂੰਹ ਤੋਂ ਉਲਟੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ।`;
      return `${sunTimePa(s.period, s.variation ?? english.seed)} ${placePa(s.place)} ਵਿੱਚ ${namePa(s.firstName)} ਅਤੇ ${namePa(s.secondName)} ਖੜ੍ਹੇ ਸਨ। ${namePa(s.firstName)} ਦੀ ਪਰਛਾਂਵਾਂ ${sidePa(s.side)} ਪਈ। ${facingRelation} ${namePa(s.secondName)} ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ?`;
    }
    default: return null;
  }
}
