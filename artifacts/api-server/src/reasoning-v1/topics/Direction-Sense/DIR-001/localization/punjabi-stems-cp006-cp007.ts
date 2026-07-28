import { asR, codeMapTextPa, codedChainPa, directionPa, evidenceChainPa, metresPa, namePa, placePa, sidePa, sunTimePa, turnPa, type R } from "./punjabi-foundation";

export function renderPunjabiStem023To035(english: R): string | null {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  switch (qlId) {
    case "DIR-QL-023":
      return `ਦਿਸ਼ਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਵਿੱਚ ${codeMapTextPa(s.codeMap)}। ਦਿੱਤੇ ਕਥਨ ਹਨ: ${codedChainPa(s.relations ?? [])}। ${namePa(s.query.subject)}, ${namePa(s.query.reference)} ਦੇ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-024":
      return `ਦਿਸ਼ਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਵਿੱਚ ${codeMapTextPa(s.codeMap)}। ਦਿੱਤੇ ਕਥਨ ਹਨ: ${codedChainPa(s.relations ?? [])}। ${namePa(s.query.reference)} ਦੇ ${directionPa(s.query.direction)} ਵੱਲ ਕੌਣ ਹੈ?`;
    case "DIR-QL-025":
      return `ਚਿੰਨ੍ਹ @, #, % ਅਤੇ & ਵਿੱਚੋਂ ਹਰ ਇੱਕ ਉੱਤਰ, ਪੂਰਬ, ਦੱਖਣ ਜਾਂ ਪੱਛਮ ਵਿੱਚੋਂ ਇੱਕ ਦਿਸ਼ਾ ਦੱਸਦਾ ਹੈ। ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਹੈ: ${(s.evidence ?? []).map((e: R) => `“${evidenceChainPa(e)}” ਦਾ ਨਤੀਜਾ ${directionPa(e.resultDirection)} ਹੈ`).join("; ")}। ਕਿਹੜਾ ਚਿੰਨ੍ਹ ${directionPa(s.targetDirection)} ਦੱਸਦਾ ਹੈ?`;
    case "DIR-QL-026":
      return `ਦਿਸ਼ਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਵਿੱਚ ${codeMapTextPa(s.codeMap)}। ਕਿਹੜਾ ਕਥਨ ਦੱਸਦਾ ਹੈ ਕਿ ${namePa(s.targetRelation.subject)}, ${namePa(s.targetRelation.reference)} ਦੇ ${directionPa(s.targetRelation.direction)} ਵੱਲ ਹੈ?`;
    case "DIR-QL-027":
      return `ਦਿਸ਼ਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਵਿੱਚ ${codeMapTextPa(s.codeMap)}। ਲੜੀ “${codedChainPa(s.relations ?? [])}” ਨੂੰ ਪੜ੍ਹੋ। ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਸਹੀ ਹੈ?`;
    case "DIR-QL-028":
      return `ਦਿਸ਼ਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਵਿੱਚ ${codeMapTextPa(s.codeMap)}। ਲੜੀ “${codedChainPa(s.relations ?? [], s.hiddenIndex)}” ਵਿੱਚ ? ਦੀ ਥਾਂ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਆਵੇਗਾ, ਤਾਂ ਜੋ ${namePa(s.targetRelation.subject)}, ${namePa(s.targetRelation.reference)} ਦੇ ${directionPa(s.targetRelation.direction)} ਵੱਲ ਹੋਵੇ?`;
    case "DIR-QL-029":
      return `ਚਾਲਾਂ ਦੇ ਚਿੰਨ੍ਹਾਂ ਦੇ ਇਸ ਨਿਯਮ ਵਿੱਚ ${codeMapTextPa(s.codeMap, true)}। ਚਾਲ ਬਿੰਦੂ O ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ: ${s.steps.map((step: R) => `${step.symbol} ${metresPa(step.distance)}`).join(", ਫਿਰ ")}। ਅੰਤਿਮ ਥਾਂ ਬਿੰਦੂ O ਦੇ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-030":
      return `${sunTimePa(s.period, s.variation ?? english.seed)} ਸਾਫ਼ ਮੌਸਮ ਵਿੱਚ ${s.target === "SUN" ? "ਸੂਰਜ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਦਿੱਸੇਗਾ" : "ਖੜ੍ਹੇ ਖੰਭੇ ਦੀ ਪਰਛਾਂਵਾਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਪਵੇਗੀ"}?`;
    case "DIR-QL-031":
      return `${sunTimePa(s.period, s.variation ?? english.seed)} ${placePa(s.place)} ਵਿੱਚ ${namePa(s.name)} ਦੀ ਪਰਛਾਂਵਾਂ ਬਿਲਕੁਲ ${sidePa(s.side)} ਪਈ। ${namePa(s.name)} ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ?`;
    case "DIR-QL-032":
      return `${sunTimePa(s.period, s.variation ?? english.seed)} ${placePa(s.place)} ਵਿੱਚ ${namePa(s.name)} ਦਾ ਮੂੰਹ ${directionPa(s.facing)} ਵੱਲ ਸੀ। ਪਰਛਾਂਵਾਂ ਕਿਸ ਪਾਸੇ ਪਵੇਗੀ?`;
    case "DIR-QL-033":
      return `ਸਾਫ਼ ਮੌਸਮ ਵਿੱਚ ${placePa(s.place)} ਵਿੱਚ ${namePa(s.name)} ਦਾ ਮੂੰਹ ${directionPa(s.facing)} ਵੱਲ ਸੀ ਅਤੇ ਪਰਛਾਂਵਾਂ ਬਿਲਕੁਲ ${sidePa(s.side)} ਪਈ। ਇਹ ਘਟਨਾ ਸਵੇਰ ਦੀ ਸੀ ਜਾਂ ਸ਼ਾਮ ਦੀ?`;
    case "DIR-QL-034":
      return `${sunTimePa(s.period, s.variation ?? english.seed)} ${placePa(s.place)} ਵਿੱਚ ${namePa(s.name)} ਦੀ ਪਰਛਾਂਵਾਂ ਬਿਲਕੁਲ ${sidePa(s.side)} ਪਈ। ਇਸ ਤੋਂ ਬਾਅਦ ਹੁਕਮ ਹਨ: ${(s.turns ?? []).map((t: string) => turnPa(t)).join(", ਫਿਰ ")}। ਹੁਣ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-035": {
      const facingRelation = s.relation === "SAME_DIRECTION"
        ? `${namePa(s.secondName)} ਦਾ ਮੂੰਹ ਵੀ ${namePa(s.firstName)} ਵਾਲੀ ਹੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ।`
        : `${namePa(s.secondName)} ਦਾ ਮੂੰਹ ${namePa(s.firstName)} ਦੇ ਮੂੰਹ ਤੋਂ ਉਲਟੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ।`;
      return `${sunTimePa(s.period, s.variation ?? english.seed)} ${placePa(s.place)} ਵਿੱਚ ${namePa(s.firstName)} ਅਤੇ ${namePa(s.secondName)} ਖੜ੍ਹੇ ਸਨ। ${namePa(s.firstName)} ਦੀ ਪਰਛਾਂਵਾਂ ${sidePa(s.side)} ਪਈ। ${facingRelation} ${namePa(s.secondName)} ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਸੀ?`;
    }
    default: return null;
  }
}
