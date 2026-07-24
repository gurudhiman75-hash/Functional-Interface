import type { Rap002Explanation, Rap002Parameters, Rap002SolverResult } from "./types";

type Language = "hi" | "pa";
type Family = "alignment" | "reverse" | "change" | "partition" | "inverse" | "comparison" | "election";

function family(task: string): Family {
  if (["chainAlignment", "extendedChainAlignment", "missingChainRatio"].includes(task)) return "alignment";
  if (["reverseMiddleFinding", "reverseEndpointFinding", "constrainedReverseChain"].includes(task)) return "reverse";
  if (["successiveRatioChange", "transferTracking", "reconstructOriginalRatio"].includes(task)) return "change";
  if (["nestedPartition", "conditionalDistribution", "weightedNestedPartition", "incomeExpenditureSavings"].includes(task)) return "partition";
  if (["inverseChainWork", "inverseChainSpeed", "combinedInverseChain", "sdtTimeRatioFromSpeedDistance", "sdtRaceLead"].includes(task)) return "inverse";
  if (["chainOrdering", "chainInequality", "chainEquivalence"].includes(task)) return "comparison";
  return "election";
}

const HI: Record<Family, readonly [string, string]> = {
  alignment: ["साझा पद को बराबर करके अनुपातों को जोड़ें।", "अब मिले हुए अनुपात को सरल करें।"],
  reverse: ["पहले पूरी अनुपात श्रृंखला बनाएं।", "दिए गए कुल या अंतर से एक भाग का मान निकालें।"],
  change: ["शुरुआती संख्याओं को अनुपात के रूप में मानें।", "जोड़, घटाव या स्थानांतरण के बाद नया अनुपात बनाएं।"],
  partition: ["पहले मुख्य हिस्से को दिए अनुपात में बांटें।", "फिर चुने हुए हिस्से को दूसरे अनुपात में बांटें।"],
  inverse: ["समान काम या दूरी में समय, दर के उल्टे अनुपात में होता है।", "स्थिर गुणनफल का उपयोग करके मांगा गया मान निकालें।"],
  comparison: ["सभी अनुपातों को एक ही पैमाने पर लाएं।", "अब बराबर किए गए पदों की तुलना करें।"],
  election: ["कुल मतों से डाले गए और फिर वैध मत निकालें।", "वैध मतों को उम्मीदवारों के अनुपात में बांटें।"],
};

const PA: Record<Family, readonly [string, string]> = {
  alignment: ["ਸਾਂਝੇ ਪਦ ਨੂੰ ਬਰਾਬਰ ਕਰਕੇ ਅਨੁਪਾਤ ਜੋੜੋ।", "ਹੁਣ ਮਿਲੇ ਅਨੁਪਾਤ ਨੂੰ ਸਰਲ ਕਰੋ।"],
  reverse: ["ਪਹਿਲਾਂ ਪੂਰੀ ਅਨੁਪਾਤ ਲੜੀ ਬਣਾਓ।", "ਦਿੱਤੇ ਕੁੱਲ ਜਾਂ ਅੰਤਰ ਤੋਂ ਇੱਕ ਭਾਗ ਦਾ ਮੁੱਲ ਕੱਢੋ।"],
  change: ["ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀਆਂ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਰੂਪ ਵਿੱਚ ਮੰਨੋ।", "ਜੋੜ, ਘਟਾਅ ਜਾਂ ਤਬਦੀਲੀ ਤੋਂ ਬਾਅਦ ਨਵਾਂ ਅਨੁਪਾਤ ਬਣਾਓ।"],
  partition: ["ਪਹਿਲਾਂ ਮੁੱਖ ਹਿੱਸਾ ਦਿੱਤੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ।", "ਫਿਰ ਚੁਣੇ ਹਿੱਸੇ ਨੂੰ ਦੂਜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ।"],
  inverse: ["ਇੱਕੋ ਕੰਮ ਜਾਂ ਦੂਰੀ ਲਈ ਸਮਾਂ, ਦਰ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ।", "ਸਥਿਰ ਗੁਣਨਫਲ ਨਾਲ ਮੰਗਿਆ ਮੁੱਲ ਕੱਢੋ।"],
  comparison: ["ਸਾਰੇ ਅਨੁਪਾਤ ਇੱਕੋ ਪੈਮਾਨੇ ਉੱਤੇ ਲਿਆਓ।", "ਹੁਣ ਬਰਾਬਰ ਕੀਤੇ ਪਦਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।"],
  election: ["ਕੁੱਲ ਵੋਟਾਂ ਤੋਂ ਪਈਆਂ ਅਤੇ ਫਿਰ ਵੈਧ ਵੋਟਾਂ ਕੱਢੋ।", "ਵੈਧ ਵੋਟਾਂ ਨੂੰ ਉਮੀਦਵਾਰਾਂ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ।"],
};

function neutralizeLabels(value: string) {
  return value
    .replace(/\b(?:Partner|Group|Team|Car|Candidate|Company|Unit)\s+([A-D])\b/gi, "$1")
    .replace(/\b([A-D])'s\b/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanAnswer(value: string | number) {
  return neutralizeLabels(
    String(value)
      .replaceAll("$$", "")
      .replace(/\\text\{([^}]*)\}/g, "$1"),
  );
}

function cleanMath(line: string) {
  const cleaned = neutralizeLabels(
    line
      .replace(/\\text\{[^}]*\}\s*=/g, "")
      .replace(/\\text\{[^}]*\}/g, "")
      .replace(/\$\$\s*\$\$/g, ""),
  );
  return cleaned === "$$$$" ? "" : cleaned;
}

function localizedLogicValue(raw: string, language: Language) {
  const normalized = raw.toLowerCase().replace(/\s+/g, " ").trim();
  if (normalized === "equivalent") return language === "hi" ? "समतुल्य" : "ਬਰਾਬਰ";
  if (normalized === "not equivalent") return language === "hi" ? "समतुल्य नहीं" : "ਬਰਾਬਰ ਨਹੀਂ";
  return raw;
}

function conclusion(parameters: Rap002Parameters, solver: Rap002SolverResult, language: Language) {
  const rawValue = cleanAnswer(solver.answer);
  const value = parameters.answerType === "LOGIC" ? localizedLogicValue(rawValue, language) : rawValue;
  const task = parameters.taskKind;
  if (language === "hi") {
    if (task === "chainOrdering") return `इसलिए सही घटता क्रम ${value} है।`;
    if (task === "chainInequality") return `इसलिए बड़ी राशि ${value} है।`;
    if (task === "chainEquivalence") return `इसलिए दोनों अनुपात ${value} हैं।`;
    if (parameters.answerType === "RATIO") return `इसलिए मांगा गया अनुपात ${value} है।`;
    if (parameters.answerType === "COUNT") return `इसलिए मांगी गई संख्या ${value} है।`;
    return `इसलिए उत्तर ${value} है।`;
  }
  if (task === "chainOrdering") return `ਇਸ ਲਈ ਸਹੀ ਘਟਦਾ ਕ੍ਰਮ ${value} ਹੈ।`;
  if (task === "chainInequality") return `ਇਸ ਲਈ ਵੱਡੀ ਰਾਸ਼ੀ ${value} ਹੈ।`;
  if (task === "chainEquivalence") return `ਇਸ ਲਈ ਦੋਵੇਂ ਅਨੁਪਾਤ ${value} ਹਨ।`;
  if (parameters.answerType === "RATIO") return `ਇਸ ਲਈ ਮੰਗਿਆ ਅਨੁਪਾਤ ${value} ਹੈ।`;
  if (parameters.answerType === "COUNT") return `ਇਸ ਲਈ ਮੰਗੀ ਗਿਣਤੀ ${value} ਹੈ।`;
  return `ਇਸ ਲਈ ਉੱਤਰ ${value} ਹੈ।`;
}

export function renderLocalizedRap002Explanation(
  parameters: Rap002Parameters,
  solver: Rap002SolverResult,
  explanation: Rap002Explanation,
): Rap002Explanation {
  if (parameters.language === "en") return explanation;
  const language = parameters.language as Language;
  const narratives = (language === "hi" ? HI : PA)[family(parameters.taskKind)];
  const mathLines = explanation.lines
    .filter((line) => line.includes("$$"))
    .map(cleanMath)
    .filter((line) => line.length > 0);
  const usefulMath = [...new Set(mathLines)].slice(0, 4);
  const lines = [narratives[0], ...usefulMath.slice(0, 2), narratives[1], ...usefulMath.slice(2), conclusion(parameters, solver, language)];
  return { ...explanation, lines };
}
