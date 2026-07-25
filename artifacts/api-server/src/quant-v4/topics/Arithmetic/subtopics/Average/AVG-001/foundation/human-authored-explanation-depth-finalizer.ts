import type { Avg001QuestionPackage } from "./types";

type Language = "en" | "hi" | "pa";

function languageOf(pkg: Avg001QuestionPackage): Language {
  return pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
}

function supportEnglish(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    if (mode === "findSumFromAverageAndCount") return "Multiply once; the product is the total represented by the average.";
    if (mode === "findAverageFromSumAndCount") return "Divide the complete total by the stated number of observations.";
    if (mode === "findCountFromSumAndAverage") return "The quotient gives how many observations share the stated total.";
    if (mode === "findMissingValueFromAverage") return "Build the required total first, then remove the known subtotal.";
    return "Apply the same increase or decrease directly to the old average.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "Because the count is odd, the central term sits exactly at the average.";
    if (mode === "findExtremeFromAverageAndCount") return "Use half the number of gaps to move from the average to the requested end.";
    if (mode === "findTermCountFromAverageAndExtreme") return "Count the equal gaps from the average to the given extreme, then include both sides.";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "Divide the half-span by the number of gaps on one side.";
    return "Pairing opposite terms leaves the same midpoint in every pair.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (/Removal|Leaving/i.test(mode)) return "The reduced group uses one fewer observation after the outgoing value is removed.";
    if (/Replacement/i.test(mode)) return "Only the total changes because replacement leaves the group size unchanged.";
    if (/OriginalCount/i.test(mode)) return "Compare the member's surplus or deficit with the change carried by each group place.";
    if (/Innings/i.test(mode)) return "Use the updated run total with the updated innings count.";
    return "The enlarged group uses one additional observation after the incoming value is added.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004") {
    if (/Speed/i.test(mode)) return "Weight each speed by the distance or time attached to that stage.";
    if (/Ratio/i.test(mode)) return "The group-size ratio is inverse to the two distances from the combined average.";
    return "Add the separate group totals before dividing by the combined count.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-005") {
    return "The correction changes the total by the correct entry minus the recorded entry.";
  }
  return "Subtract the known subgroup contribution from the full combined total when needed.";
}

function supportHindi(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    if (mode === "findSumFromAverageAndCount") return "एक बार गुणा करने पर औसत से दर्शाया गया कुल मिल जाता है।";
    if (mode === "findAverageFromSumAndCount") return "पूरे कुल को दी गई प्रेक्षण-संख्या से भाग दें।";
    if (mode === "findCountFromSumAndAverage") return "भागफल बताता है कि कुल कितने प्रेक्षणों में बाँटा गया है।";
    if (mode === "findMissingValueFromAverage") return "पहले आवश्यक कुल बनाएँ, फिर ज्ञात उप-कुल घटाएँ।";
    return "समान वृद्धि या कमी सीधे पुराने औसत पर लागू करें।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "पदों की संख्या विषम होने से केंद्रीय पद ठीक औसत पर होता है।";
    if (mode === "findExtremeFromAverageAndCount") return "औसत से माँगे गए छोर तक आधे अंतरालों के अनुसार बढ़ें।";
    if (mode === "findTermCountFromAverageAndExtreme") return "औसत से दिए छोर तक समान अंतराल गिनें और दोनों पक्ष शामिल करें।";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "आधे फैलाव को एक ओर के अंतरालों की संख्या से भाग दें।";
    return "विपरीत छोरों के प्रत्येक जोड़े का मध्यबिंदु समान रहता है।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (/Removal|Leaving/i.test(mode)) return "मान हटने के बाद छोटे समूह में एक प्रेक्षण कम रहता है।";
    if (/Replacement/i.test(mode)) return "बदलाव में केवल कुल बदलता है; समूह की संख्या वही रहती है।";
    if (/OriginalCount/i.test(mode)) return "सदस्य की अधिकता या कमी की तुलना प्रति स्थान औसत-परिवर्तन से करें।";
    if (/Innings/i.test(mode)) return "बदले कुल रन को बदली पारी-संख्या के साथ उपयोग करें।";
    return "नया मान जुड़ने के बाद बड़े समूह में एक प्रेक्षण अधिक होता है।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004") {
    if (/Speed/i.test(mode)) return "हर चाल को उससे जुड़ी दूरी या समय के अनुसार भार दें।";
    if (/Ratio/i.test(mode)) return "समूह-संख्या अनुपात संयुक्त औसत से दोनों दूरियों के व्युत्क्रमानुपाती होता है।";
    return "अलग समूहों के कुल जोड़कर संयुक्त संख्या से भाग दें।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-005") return "कुल में सुधार, सही प्रविष्टि और दर्ज प्रविष्टि के अंतर के बराबर है।";
  return "आवश्यक होने पर पूरे कुल में से ज्ञात उपसमूह का योगदान घटाएँ।";
}

function supportPunjabi(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    if (mode === "findSumFromAverageAndCount") return "ਇੱਕ ਵਾਰ ਗੁਣਾ ਕਰਨ ਨਾਲ ਔਸਤ ਵੱਲੋਂ ਦਰਸਾਇਆ ਕੁੱਲ ਮਿਲ ਜਾਂਦਾ ਹੈ।";
    if (mode === "findAverageFromSumAndCount") return "ਪੂਰੇ ਕੁੱਲ ਨੂੰ ਦਿੱਤੀ ਪ੍ਰੇਖਣ-ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।";
    if (mode === "findCountFromSumAndAverage") return "ਭਾਗਫਲ ਦੱਸਦਾ ਹੈ ਕਿ ਕੁੱਲ ਕਿੰਨੇ ਪ੍ਰੇਖਣਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ।";
    if (mode === "findMissingValueFromAverage") return "ਪਹਿਲਾਂ ਲੋੜੀਂਦਾ ਕੁੱਲ ਬਣਾਓ, ਫਿਰ ਜਾਣਿਆ ਉਪ-ਕੁੱਲ ਘਟਾਓ।";
    return "ਇੱਕੋ ਵਾਧਾ ਜਾਂ ਘਾਟ ਸਿੱਧਾ ਪੁਰਾਣੀ ਔਸਤ ਉੱਤੇ ਲਗਾਓ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "ਪਦਾਂ ਦੀ ਗਿਣਤੀ ਵਿਸ਼ਮ ਹੋਣ ਕਰਕੇ ਕੇਂਦਰੀ ਪਦ ਠੀਕ ਔਸਤ ਉੱਤੇ ਹੁੰਦਾ ਹੈ।";
    if (mode === "findExtremeFromAverageAndCount") return "ਔਸਤ ਤੋਂ ਮੰਗੇ ਸਿਰੇ ਤੱਕ ਅੱਧੇ ਅੰਤਰਾਲਾਂ ਅਨੁਸਾਰ ਵਧੋ।";
    if (mode === "findTermCountFromAverageAndExtreme") return "ਔਸਤ ਤੋਂ ਦਿੱਤੇ ਸਿਰੇ ਤੱਕ ਬਰਾਬਰ ਅੰਤਰਾਲ ਗਿਣੋ ਅਤੇ ਦੋਵੇਂ ਪਾਸੇ ਸ਼ਾਮਲ ਕਰੋ।";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "ਅੱਧੇ ਫੈਲਾਅ ਨੂੰ ਇੱਕ ਪਾਸੇ ਦੇ ਅੰਤਰਾਲਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।";
    return "ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਦੇ ਹਰ ਜੋੜੇ ਦਾ ਮੱਧ-ਬਿੰਦੂ ਇੱਕੋ ਰਹਿੰਦਾ ਹੈ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (/Removal|Leaving/i.test(mode)) return "ਮੁੱਲ ਹਟਣ ਤੋਂ ਬਾਅਦ ਛੋਟੇ ਸਮੂਹ ਵਿੱਚ ਇੱਕ ਪ੍ਰੇਖਣ ਘੱਟ ਰਹਿੰਦਾ ਹੈ।";
    if (/Replacement/i.test(mode)) return "ਬਦਲੀ ਵਿੱਚ ਸਿਰਫ਼ ਕੁੱਲ ਬਦਲਦਾ ਹੈ; ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਉਹੀ ਰਹਿੰਦੀ ਹੈ।";
    if (/OriginalCount/i.test(mode)) return "ਮੈਂਬਰ ਦੀ ਵਾਧੂ ਜਾਂ ਘੱਟ ਰਕਮ ਦੀ ਤੁਲਨਾ ਪ੍ਰਤੀ ਸਥਾਨ ਔਸਤ-ਬਦਲਾਅ ਨਾਲ ਕਰੋ।";
    if (/Innings/i.test(mode)) return "ਬਦਲੀਆਂ ਕੁੱਲ ਦੌੜਾਂ ਨੂੰ ਬਦਲੀ ਪਾਰੀ-ਗਿਣਤੀ ਨਾਲ ਵਰਤੋ।";
    return "ਨਵਾਂ ਮੁੱਲ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਵੱਡੇ ਸਮੂਹ ਵਿੱਚ ਇੱਕ ਪ੍ਰੇਖਣ ਵੱਧ ਹੁੰਦਾ ਹੈ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004") {
    if (/Speed/i.test(mode)) return "ਹਰ ਚਾਲ ਨੂੰ ਉਸ ਨਾਲ ਜੁੜੀ ਦੂਰੀ ਜਾਂ ਸਮੇਂ ਅਨੁਸਾਰ ਭਾਰ ਦਿਓ।";
    if (/Ratio/i.test(mode)) return "ਸਮੂਹ-ਗਿਣਤੀ ਅਨੁਪਾਤ ਸਾਂਝੀ ਔਸਤ ਤੋਂ ਦੋਵੇਂ ਦੂਰੀਆਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ।";
    return "ਵੱਖਰੇ ਸਮੂਹਾਂ ਦੇ ਕੁੱਲ ਜੋੜ ਕੇ ਸਾਂਝੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-005") return "ਕੁੱਲ ਦੀ ਸੋਧ ਸਹੀ ਅਤੇ ਦਰਜ ਮੁੱਲ ਦੇ ਫਰਕ ਦੇ ਬਰਾਬਰ ਹੁੰਦੀ ਹੈ।";
  return "ਲੋੜ ਪੈਣ ਉੱਤੇ ਪੂਰੇ ਕੁੱਲ ਵਿੱਚੋਂ ਜਾਣੇ ਉਪ-ਸਮੂਹ ਦਾ ਯੋਗਦਾਨ ਘਟਾਓ।";
}

function support(pkg: Avg001QuestionPackage, language: Language) {
  if (language === "hi") return supportHindi(pkg);
  if (language === "pa") return supportPunjabi(pkg);
  return supportEnglish(pkg);
}

export function finalizeAvg001ExplanationDepth(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.explanation.lines.length >= 5) return pkg;
  const language = languageOf(pkg);
  const lines = [...pkg.explanation.lines];
  lines.splice(Math.min(2, lines.length - 1), 0, support(pkg, language));
  return {
    ...pkg,
    explanation: { lines: lines.slice(0, 6) },
    traceability: {
      ...pkg.traceability,
      explanationDepthFinalizer: "AVG-001 five-to-six-line explanation finalizer v1",
    },
  };
}
