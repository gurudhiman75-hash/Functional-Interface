import { asR, directionHi, nameHi, pathsBlock, relationSentence, startsDescription, type R } from "./hindi-foundation";

export function renderHindiStem011To022(english: R): string | null {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  switch (qlId) {
    case "DIR-QL-011":
      return `${(s.relations ?? []).map((r: R) => relationSentence(r)).join(" ")} ${nameHi(s.query.subject)} ${nameHi(s.query.reference)} के किस दिशा में है?`;
    case "DIR-QL-012":
      return `${(s.relations ?? []).map((r: R) => relationSentence(r)).join(" ")} ${nameHi(s.query.subject)} ${nameHi(s.query.reference)} से किस दिशा में और कितनी न्यूनतम दूरी पर है?`;
    case "DIR-QL-013":
      return `${(s.relations ?? []).map((r: R) => relationSentence(r)).join(" ")} ${nameHi(s.query.reference)} के ${directionHi(s.query.direction)} में कौन है?`;
    case "DIR-QL-014":
      return `${(s.relations ?? []).map((r: R) => relationSentence(r)).join(" ")} कौन-से तीन व्यक्ति एक सीधी रेखा में खड़े हैं?`;
    case "DIR-QL-015":
      return `${(s.relations ?? []).map((r: R) => relationSentence(r)).join(" ")} कौन-सा युग्म एक ही स्थान पर खड़ा है?`;
    case "DIR-QL-016":
      return `${startsDescription(s.paths ?? [])} ${pathsBlock(s.paths ?? [])} ${nameHi(s.query.subject)} का अंतिम स्थान ${nameHi(s.query.reference)} के अंतिम स्थान से किस दिशा में है?`;
    case "DIR-QL-017":
      return `${startsDescription(s.paths ?? [])} ${pathsBlock(s.paths ?? [])} ${nameHi(s.query.left)} और ${nameHi(s.query.right)} के अंतिम स्थानों के बीच न्यूनतम दूरी कितनी है?`;
    case "DIR-QL-018":
      return `${startsDescription(s.paths ?? [])} ${pathsBlock(s.paths ?? [])} ${nameHi(s.query.subject)} का अंतिम स्थान ${nameHi(s.query.reference)} के अंतिम स्थान से किस दिशा में और कितनी न्यूनतम दूरी पर है?`;
    case "DIR-QL-019":
      return `${startsDescription(s.paths ?? [])} ${pathsBlock(s.paths ?? [])} ${nameHi(s.query.reference)} के अंतिम स्थान से ${directionHi(s.query.direction)} में किसका अंतिम स्थान है?`;
    case "DIR-QL-020":
      return `${startsDescription(s.paths ?? [])} ${pathsBlock(s.paths ?? [])} ${directionHi(s.query.extremumDirection)} दिशा में सबसे दूर किसका अंतिम स्थान है?`;
    case "DIR-QL-021":
      return `${startsDescription(s.paths ?? [])} ${pathsBlock(s.paths ?? [])} बिंदु ${s.query.referencePoint} से ${s.query.comparison === "NEAREST" ? "सबसे निकट" : "सबसे दूर"} किसका अंतिम स्थान है?`;
    case "DIR-QL-022":
      return `${startsDescription(s.paths ?? [])} ${pathsBlock(s.paths ?? [])} कौन-सा युग्म एक ही अंतिम स्थान पर पहुँचता है?`;
    default: return null;
  }
}
