import { asR, coordinateText, directionHi, personName, relativeOperations, turnSequence, type R } from "./hindi-foundation";

export function renderHindiStem001To010(english: R): string | null {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  const n = personName(s.person ?? s.name ?? s.subject);
  switch (qlId) {
    case "DIR-QL-001":
      return `${n} का मुख प्रारंभ में ${directionHi(s.initialFacing)} की ओर है। इसके बाद निर्देश हैं: ${turnSequence(s.turns ?? [])}। अंत में मुख किस दिशा में होगा?`;
    case "DIR-QL-002":
      return `${n} के लिए निर्देश हैं: ${turnSequence(s.turns ?? [])}। इन निर्देशों के बाद मुख ${directionHi(s.finalFacing)} की ओर है। प्रारंभ में मुख किस दिशा में था?`;
    case "DIR-QL-003":
      return `${n} का मुख पहले ${directionHi(s.initialFacing)} की ओर था और बाद में ${directionHi(s.finalFacing)} की ओर हो गया। इस परिवर्तन के लिए कौन-सा निर्देश सही है?`;
    case "DIR-QL-004": {
      const reverse = s.queryReference === "START_FROM_FINAL";
      return `${n} की यात्रा एक बिंदु से शुरू होती है; आरंभिक मुख ${directionHi(s.initialFacing)} की ओर है। मार्ग: ${relativeOperations(s.operations ?? [])}। ${reverse ? "आरंभिक बिंदु अंतिम स्थान के" : "अंतिम स्थान आरंभिक बिंदु के"} किस दिशा में है?`;
    }
    case "DIR-QL-005":
      return `${n} की यात्रा एक बिंदु से शुरू होती है; आरंभिक मुख ${directionHi(s.initialFacing)} की ओर है। मार्ग: ${relativeOperations(s.operations ?? [])}। अंतिम स्थान आरंभिक बिंदु के किस दिशा में है और अंत में मुख किस दिशा में है?`;
    case "DIR-QL-006":
      return `${n} की यात्रा एक बिंदु से शुरू होती है; आरंभिक मुख ${directionHi(s.initialFacing)} की ओर है। मार्ग: ${relativeOperations(s.operations ?? [])}। आरंभिक और अंतिम बिंदु के बीच न्यूनतम दूरी कितनी है?`;
    case "DIR-QL-007": {
      const reverse = s.queryReference === "START_FROM_FINAL";
      return `${n} की यात्रा एक बिंदु से शुरू होती है; आरंभिक मुख ${directionHi(s.initialFacing)} की ओर है। मार्ग: ${relativeOperations(s.operations ?? [])}। ${reverse ? "आरंभिक बिंदु अंतिम स्थान से" : "अंतिम स्थान आरंभिक बिंदु से"} किस दिशा में और कितनी न्यूनतम दूरी पर है?`;
    }
    case "DIR-QL-008":
      return `${n} की यात्रा एक बिंदु से शुरू होती है; आरंभिक मुख ${directionHi(s.initialFacing)} की ओर है। मार्ग: ${relativeOperations(s.operations ?? [])}। क्रमशः कुल चली गई दूरी और आरंभिक बिंदु से न्यूनतम दूरी कितनी है?`;
    case "DIR-QL-009":
      return `${n} की यात्रा एक बिंदु से शुरू होती है; आरंभिक मुख ${directionHi(s.initialFacing)} की ओर है। मार्ग: ${relativeOperations(s.operations ?? [], s.unknownMoveNumber)}। अंत में स्थान आरंभिक बिंदु से ${coordinateText(s.targetEndpoint)} है। अज्ञात चाल की दूरी कितनी थी?`;
    case "DIR-QL-010":
      return `${n} की यात्रा एक बिंदु से शुरू होती है; आरंभिक मुख ${directionHi(s.initialFacing)} की ओर है। मार्ग: ${relativeOperations(s.operations ?? [])}। आरंभिक और अंतिम बिंदु के बीच न्यूनतम दूरी ज्ञात कीजिए। ${s.displayMode === "RADICAL" ? "उत्तर को सरल करणी रूप में दीजिए।" : "उत्तर को एक दशमलव स्थान तक दीजिए।"}`;
    default: return null;
  }
}
