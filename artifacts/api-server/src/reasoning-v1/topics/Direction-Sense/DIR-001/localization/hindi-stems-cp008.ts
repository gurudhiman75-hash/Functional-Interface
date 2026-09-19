import { absoluteSteps, advancedOperations, asR, coordinateText, directionHi, metres, nameHi, placeHi, relationSentence, turnHi, type R } from "./hindi-foundation";

export function renderHindiStem036To044(english: R): string | null {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  switch (qlId) {
    case "DIR-QL-036":
      return `${(s.visibleRelations ?? []).map((r: R) => relationSentence(r)).join(" ")} चौथा कथन ${nameHi(s.missingTo)} को ${nameHi(s.missingFrom)} से ठीक ${metres(s.missingDistance)} दूर रखकर एक संगत बंद विन्यास पूरा करता है। ${nameHi(s.missingTo)}, ${nameHi(s.missingFrom)} के किस दिशा में होना चाहिए?`;
    case "DIR-QL-037":
      return `${(s.anchorRelations ?? []).map((r: R) => relationSentence(r, false)).join(" ")} अब चार अतिरिक्त कथन देखिए: ${(s.relations ?? []).map((r: R, i: number) => `(${i + 1}) ${relationSentence(r, false)}`).join(" ")} इनमें ठीक एक कथन पूरे विन्यास से मेल नहीं खाता। असंगत कथन कौन-सा है?`;
    case "DIR-QL-038":
      return `${placeHi(s.place)} में ${nameHi(s.subject)} का मार्ग एक चिह्नित बिंदु से शुरू होता है। मार्ग: ${(s.legs ?? []).map((leg: R) => leg.direction === "UNKNOWN" ? `${metres(leg.distance)} अज्ञात दिशा में` : `${metres(leg.distance)} ${directionHi(leg.direction)} की ओर`).join(", फिर ")}। अंतिम स्थान आरंभिक बिंदु से ${coordinateText(s.target)} है। अज्ञात चाल किस दिशा में थी?`;
    case "DIR-QL-039":
      return `${placeHi(s.place)} में ${nameHi(s.subject)} का मुख आरंभ में ${directionHi(s.initialFacing)} की ओर था। पहले ${metres(s.firstDistance)} सीधे चलने के बाद अगला दिशा-निर्देश नहीं बताया गया। फिर ${metres(s.secondDistance)} सीधे चलना, ${turnHi(s.knownTurn)} और ${metres(s.thirdDistance)} सीधे चलना होता है। अंतिम स्थान आरंभिक बिंदु से ${coordinateText(s.target)} है। छूटा हुआ निर्देश क्या है?`;
    case "DIR-QL-040":
      return `${nameHi(s.subject)} की यात्रा ${placeHi(s.place)} में एक चिह्नित बिंदु से शुरू होती है। मार्ग: ${advancedOperations(s.operations ?? [])}। अंतिम स्थान आरंभिक बिंदु से ${coordinateText(s.target)} है। प्रारंभ में मुख किस दिशा में था?`;
    case "DIR-QL-041":
      return `${(s.relations ?? []).map((r: R) => relationSentence(r)).join(" ")} एक व्यक्ति ${nameHi(s.startEntity)} से चलकर ${absoluteSteps(s.movements ?? [])} जाता है। उसका अंतिम स्थान ${nameHi(s.referenceEntity)} से किस दिशा में और कितनी न्यूनतम दूरी पर है?`;
    case "DIR-QL-042":
      return `${placeHi(s.place)} में ${nameHi(s.subject)} की यात्रा चौकी ${s.checkpoint} से शुरू होती है; आरंभिक मुख ${directionHi(s.initialFacing)} की ओर है। मार्ग: ${advancedOperations(s.operations ?? [])}। अंतिम स्थान चौकी के किस दिशा में है?`;
    case "DIR-QL-043":
      return `${placeHi(s.place)} में ${nameHi(s.subject)} की यात्रा चौकी ${s.checkpoint} से शुरू होती है; आरंभिक मुख ${directionHi(s.initialFacing)} की ओर है। मार्ग: ${advancedOperations(s.operations ?? [])}। अंतिम स्थान और चौकी के बीच न्यूनतम दूरी कितनी है?`;
    case "DIR-QL-044":
      return `चित्र दो स्थान-संबंध दर्शाता है। इसके अतिरिक्त, ${relationSentence(s.textRelation)} चित्र और लिखित कथन दोनों का उपयोग करके बताइए कि ${nameHi(s.queryTo)} ${nameHi(s.queryFrom)} के किस दिशा में है?`;
    default: return null;
  }
}
