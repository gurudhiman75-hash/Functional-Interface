import { asR, codeMapText, codedChain, directionHi, evidenceChain, metres, nameHi, placeHi, sideHi, sunTime, turnHi, type R } from "./hindi-foundation";

export function renderHindiStem023To035(english: R): string | null {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  switch (qlId) {
    case "DIR-QL-023":
      return `एक दिशा-संकेत प्रणाली में ${codeMapText(s.codeMap)}। संकेतित कथन हैं: ${codedChain(s.relations ?? [])}। ${nameHi(s.query.subject)} ${nameHi(s.query.reference)} के किस दिशा में है?`;
    case "DIR-QL-024":
      return `एक दिशा-संकेत प्रणाली में ${codeMapText(s.codeMap)}। संकेतित कथन हैं: ${codedChain(s.relations ?? [])}। ${nameHi(s.query.reference)} के ${directionHi(s.query.direction)} में कौन है?`;
    case "DIR-QL-025":
      return `चिह्न @, #, % और & एक-से-एक व्यवस्था में उत्तर, पूर्व, दक्षिण और पश्चिम दिशाओं को दर्शाते हैं। प्रमाण हैं: ${(s.evidence ?? []).map((e: R) => `“${evidenceChain(e)}” का परिणाम ${directionHi(e.resultDirection)} है`).join("; ")}। कौन-सा चिह्न ${directionHi(s.targetDirection)} को दर्शाता है?`;
    case "DIR-QL-026":
      return `एक दिशा-संकेत प्रणाली में ${codeMapText(s.codeMap)}। कौन-सा संकेतित कथन बताता है कि ${nameHi(s.targetRelation.subject)} ${nameHi(s.targetRelation.reference)} के ${directionHi(s.targetRelation.direction)} में है?`;
    case "DIR-QL-027":
      return `एक दिशा-संकेत प्रणाली में ${codeMapText(s.codeMap)}। संकेतित शृंखला “${codedChain(s.relations ?? [])}” को पढ़िए। निम्नलिखित में से कौन-सा निष्कर्ष सही है?`;
    case "DIR-QL-028":
      return `एक दिशा-संकेत प्रणाली में ${codeMapText(s.codeMap)}। शृंखला “${codedChain(s.relations ?? [], s.hiddenIndex)}” में ? के स्थान पर कौन-सा चिह्न आएगा, ताकि ${nameHi(s.targetRelation.subject)} ${nameHi(s.targetRelation.reference)} के ${directionHi(s.targetRelation.direction)} में हो?`;
    case "DIR-QL-029":
      return `एक संकेतित चाल प्रणाली में ${codeMapText(s.codeMap, true)}। व्यक्ति बिंदु O से शुरू करके ${s.steps.map((step: R) => `${step.symbol} ${metres(step.distance)}`).join(", फिर ")} चलता है। अंतिम स्थान बिंदु O के किस दिशा में है?`;
    case "DIR-QL-030":
      return `${sunTime(s.period, s.variation ?? english.seed)} साफ मौसम में ${s.target === "SUN" ? "सूर्य किस दिशा में दिखाई देगा" : "एक खड़े खंभे की छाया किस दिशा में पड़ेगी"}?`;
    case "DIR-QL-031":
      return `${sunTime(s.period, s.variation ?? english.seed)} ${placeHi(s.place)} में ${nameHi(s.name)} की छाया ठीक ${sideHi(s.side)} पड़ी। ${nameHi(s.name)} का मुख किस दिशा की ओर था?`;
    case "DIR-QL-032":
      return `${sunTime(s.period, s.variation ?? english.seed)} ${placeHi(s.place)} में ${nameHi(s.name)} का मुख ${directionHi(s.facing)} की ओर था। छाया किस ओर पड़ेगी?`;
    case "DIR-QL-033":
      return `साफ मौसम में ${placeHi(s.place)} में ${nameHi(s.name)} का मुख ${directionHi(s.facing)} की ओर था और छाया ठीक ${sideHi(s.side)} पड़ी। यह घटना सुबह हुई थी या शाम को?`;
    case "DIR-QL-034":
      return `${sunTime(s.period, s.variation ?? english.seed)} ${placeHi(s.place)} में ${nameHi(s.name)} की छाया ठीक ${sideHi(s.side)} पड़ी। इसके बाद निर्देश हैं: ${(s.turns ?? []).map((t: string) => turnHi(t)).join(", फिर ")}। अब मुख किस दिशा में है?`;
    case "DIR-QL-035":
      return `${sunTime(s.period, s.variation ?? english.seed)} ${placeHi(s.place)} में ${nameHi(s.firstName)} और ${nameHi(s.secondName)} खड़े थे। ${nameHi(s.firstName)} की छाया ${sideHi(s.side)} पड़ी। ${nameHi(s.secondName)} का मुख ${nameHi(s.firstName)} के ${s.relation === "SAME_DIRECTION" ? "समान दिशा" : "विपरीत दिशा"} में था। ${nameHi(s.secondName)} का मुख किस दिशा की ओर था?`;
    default: return null;
  }
}
