import type {
  Rap001Explanation,
  Rap001Parameters,
  Rap001SolverResult,
  Rap001TaskKind,
} from "./types";
import { renderLocalizedRap001Explanation as renderStructuralLocalizedExplanation } from "./localized-explanation-renderer";

type LocalizedLanguage = "hi" | "pa";
type Narratives = readonly [string, string, string, string];

const HI = {
  linkage: [
    "दिए गए अनुपात लिखें।",
    "साझा पद को बराबर करें।",
    "अब अनुपातों को जोड़ें।",
    "मिले हुए अनुपात को सरल करें।",
  ],
  normalization: [
    "दोनों राशियों को पूर्ण संख्या के रूप में लिखें।",
    "हर पद पर एक ही गुणक लगाएँ।",
    "गुणा करने पर नया अनुपात मिलता है।",
    "साझा गुणक से भाग देकर सरल करें।",
  ],
  scaling: [
    "दिया गया अनुपात लिखें।",
    "एक अनुपात भाग का मान निकालें।",
    "दूसरी संख्या के भागों से गुणा करें।",
    "गणना पूरी करें।",
  ],
  partition: [
    "अनुपात के कुल भाग जोड़ें।",
    "एक भाग का मान निकालें।",
    "मांगे गए हिस्से के भागों से गुणा करें।",
    "हिस्से की राशि निकालें।",
  ],
  difference: [
    "कुल अनुपात भाग जोड़ें।",
    "एक भाग का मान निकालें।",
    "दो हिस्सों के भागों का अंतर लें।",
    "अंतर की राशि निकालें।",
  ],
  reversePartition: [
    "दो हिस्सों के भागों का अंतर लें।",
    "इस अंतर से एक भाग का मान निकालें।",
    "अब कुल अनुपात भाग जोड़ें।",
    "कुल राशि निकालें।",
  ],
  salary: [
    "खर्च और बचत के भाग जोड़ें।",
    "एक भाग का मूल्य निकालें।",
    "बचत वाले भागों से गुणा करें।",
    "मासिक बचत निकालें।",
  ],
  stateChange: [
    "शुरुआती संख्याओं को अनुपात के रूप में मानें।",
    "बदलाव के बाद वाला अनुपात लिखें।",
    "समीकरण बनाकर हल करें।",
    "मांगी गई शुरुआती संख्या निकालें।",
  ],
  income: [
    "आय और खर्च के अनुपात लिखें।",
    "दोनों की बचत बराबर रखें।",
    "दोनों समीकरण हल करें।",
    "मांगी गई आय निकालें।",
  ],
  mean: [
    "मध्य अनुपाती को x मानें।",
    "a:x = x:b का संबंध लिखें।",
    "x का वर्ग दोनों संख्याओं के गुणनफल के बराबर होगा।",
    "वर्गमूल लेकर उत्तर निकालें।",
  ],
  third: [
    "तीसरे अनुपाती को x मानें।",
    "a:b = b:x का संबंध लिखें।",
    "क्रॉस गुणा करें।",
    "x का मान निकालें।",
  ],
  fourth: [
    "चौथे अनुपाती को x मानें।",
    "a:b = c:x का संबंध लिखें।",
    "क्रॉस गुणा करें।",
    "x का मान निकालें।",
  ],
  direct: [
    "सीधे अनुपात का संबंध लिखें।",
    "दोनों स्थितियों का अनुपात बराबर रखें।",
    "दिए गए मान रखें।",
    "नया मान निकालें।",
  ],
  inverse: [
    "उल्टे अनुपात में गुणनफल स्थिर रहता है।",
    "दोनों स्थितियों का गुणनफल बराबर रखें।",
    "दिए गए मान रखें।",
    "नया मान निकालें।",
  ],
  coins: [
    "सिक्कों की संख्या को अनुपात के अनुसार मानें।",
    "हर प्रकार के सिक्कों का मूल्य लिखें।",
    "कुल मूल्य का समीकरण बनाएं।",
    "मांगे गए सिक्कों की संख्या निकालें।",
  ],
  weighted: [
    "अनुपात के अनुसार एक इकाई मानें।",
    "दिए गए भार या अंकों का समीकरण बनाएं।",
    "एक इकाई का मान निकालें।",
    "मांगी गई मात्रा निकालें।",
  ],
  mixture: [
    "शुरुआती मिश्रण का अनुपात लिखें।",
    "मिलाई गई मात्रा के बाद नया अनुपात लिखें।",
    "समीकरण बनाकर हल करें।",
    "मांगी गई मात्रा निकालें।",
  ],
  replacement: [
    "हर बार बची हुई मूल मात्रा का भाग लिखें।",
    "दोनों चरणों के बचे हुए भागों को गुणा करें।",
    "अंत में बची मूल मात्रा निकालें।",
    "दोनों द्रवों का अंतिम अनुपात बनाएं।",
  ],
  concentration: [
    "घोल की कुल मात्रा निकालें।",
    "अम्ल की मात्रा को कुल मात्रा से भाग दें।",
    "प्रतिशत के लिए 100 से गुणा करें।",
    "मान सरल करें।",
  ],
} as const satisfies Record<string, Narratives>;

const PA = {
  linkage: [
    "ਦਿੱਤੇ ਅਨੁਪਾਤ ਲਿਖੋ।",
    "ਸਾਂਝੇ ਪਦ ਨੂੰ ਬਰਾਬਰ ਕਰੋ।",
    "ਹੁਣ ਅਨੁਪਾਤ ਜੋੜੋ।",
    "ਮਿਲੇ ਅਨੁਪਾਤ ਨੂੰ ਸਰਲ ਕਰੋ।",
  ],
  normalization: [
    "ਦੋਵੇਂ ਰਾਸ਼ੀਆਂ ਨੂੰ ਪੂਰਨ ਸੰਖਿਆ ਵਿੱਚ ਲਿਖੋ।",
    "ਹਰ ਪਦ ਨੂੰ ਇੱਕੋ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰੋ।",
    "ਗੁਣਾ ਕਰਨ ਨਾਲ ਨਵਾਂ ਅਨੁਪਾਤ ਮਿਲਦਾ ਹੈ।",
    "ਸਾਂਝੇ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਸਰਲ ਕਰੋ।",
  ],
  scaling: [
    "ਦਿੱਤਾ ਅਨੁਪਾਤ ਲਿਖੋ।",
    "ਇੱਕ ਅਨੁਪਾਤੀ ਭਾਗ ਦਾ ਮੁੱਲ ਕੱਢੋ।",
    "ਦੂਜੀ ਗਿਣਤੀ ਦੇ ਭਾਗਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।",
    "ਗਿਣਤੀ ਪੂਰੀ ਕਰੋ।",
  ],
  partition: [
    "ਅਨੁਪਾਤ ਦੇ ਕੁੱਲ ਭਾਗ ਜੋੜੋ।",
    "ਇੱਕ ਭਾਗ ਦਾ ਮੁੱਲ ਕੱਢੋ।",
    "ਮੰਗੇ ਹਿੱਸੇ ਦੇ ਭਾਗਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।",
    "ਹਿੱਸੇ ਦੀ ਰਕਮ ਕੱਢੋ।",
  ],
  difference: [
    "ਕੁੱਲ ਅਨੁਪਾਤੀ ਭਾਗ ਜੋੜੋ।",
    "ਇੱਕ ਭਾਗ ਦਾ ਮੁੱਲ ਕੱਢੋ।",
    "ਦੋ ਹਿੱਸਿਆਂ ਦੇ ਭਾਗਾਂ ਦਾ ਅੰਤਰ ਲਵੋ।",
    "ਅੰਤਰ ਦੀ ਰਕਮ ਕੱਢੋ।",
  ],
  reversePartition: [
    "ਦੋ ਹਿੱਸਿਆਂ ਦੇ ਭਾਗਾਂ ਦਾ ਅੰਤਰ ਲਵੋ।",
    "ਇਸ ਅੰਤਰ ਤੋਂ ਇੱਕ ਭਾਗ ਦਾ ਮੁੱਲ ਕੱਢੋ।",
    "ਹੁਣ ਕੁੱਲ ਅਨੁਪਾਤੀ ਭਾਗ ਜੋੜੋ।",
    "ਕੁੱਲ ਰਕਮ ਕੱਢੋ।",
  ],
  salary: [
    "ਖਰਚ ਅਤੇ ਬਚਤ ਦੇ ਭਾਗ ਜੋੜੋ।",
    "ਇੱਕ ਭਾਗ ਦਾ ਮੁੱਲ ਕੱਢੋ।",
    "ਬਚਤ ਵਾਲੇ ਭਾਗਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।",
    "ਮਹੀਨਾਵਾਰ ਬਚਤ ਕੱਢੋ।",
  ],
  stateChange: [
    "ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀਆਂ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਰੂਪ ਵਿੱਚ ਮੰਨੋ।",
    "ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਵਾਲਾ ਅਨੁਪਾਤ ਲਿਖੋ।",
    "ਸਮੀਕਰਨ ਬਣਾਕੇ ਹੱਲ ਕਰੋ।",
    "ਮੰਗੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ ਕੱਢੋ।",
  ],
  income: [
    "ਆਮਦਨ ਅਤੇ ਖਰਚ ਦੇ ਅਨੁਪਾਤ ਲਿਖੋ।",
    "ਦੋਵਾਂ ਦੀ ਬਚਤ ਬਰਾਬਰ ਰੱਖੋ।",
    "ਦੋਵੇਂ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।",
    "ਮੰਗੀ ਆਮਦਨ ਕੱਢੋ।",
  ],
  mean: [
    "ਮੱਧ ਅਨੁਪਾਤੀ ਨੂੰ x ਮੰਨੋ।",
    "a:x = x:b ਦਾ ਸੰਬੰਧ ਲਿਖੋ।",
    "x ਦਾ ਵਰਗ ਦੋ ਸੰਖਿਆਵਾਂ ਦੇ ਗੁਣਨਫਲ ਦੇ ਬਰਾਬਰ ਹੈ।",
    "ਵਰਗਮੂਲ ਲੈ ਕੇ ਉੱਤਰ ਕੱਢੋ।",
  ],
  third: [
    "ਤੀਜੇ ਅਨੁਪਾਤੀ ਨੂੰ x ਮੰਨੋ।",
    "a:b = b:x ਦਾ ਸੰਬੰਧ ਲਿਖੋ।",
    "ਕ੍ਰਾਸ ਗੁਣਾ ਕਰੋ।",
    "x ਦਾ ਮੁੱਲ ਕੱਢੋ।",
  ],
  fourth: [
    "ਚੌਥੇ ਅਨੁਪਾਤੀ ਨੂੰ x ਮੰਨੋ।",
    "a:b = c:x ਦਾ ਸੰਬੰਧ ਲਿਖੋ।",
    "ਕ੍ਰਾਸ ਗੁਣਾ ਕਰੋ।",
    "x ਦਾ ਮੁੱਲ ਕੱਢੋ।",
  ],
  direct: [
    "ਸਿੱਧੇ ਅਨੁਪਾਤ ਦਾ ਸੰਬੰਧ ਲਿਖੋ।",
    "ਦੋਵੇਂ ਹਾਲਤਾਂ ਦੇ ਅਨੁਪਾਤ ਬਰਾਬਰ ਰੱਖੋ।",
    "ਦਿੱਤੇ ਮੁੱਲ ਰੱਖੋ।",
    "ਨਵਾਂ ਮੁੱਲ ਕੱਢੋ।",
  ],
  inverse: [
    "ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਗੁਣਨਫਲ ਸਥਿਰ ਰਹਿੰਦਾ ਹੈ।",
    "ਦੋਵੇਂ ਹਾਲਤਾਂ ਦੇ ਗੁਣਨਫਲ ਬਰਾਬਰ ਰੱਖੋ।",
    "ਦਿੱਤੇ ਮੁੱਲ ਰੱਖੋ।",
    "ਨਵਾਂ ਮੁੱਲ ਕੱਢੋ।",
  ],
  coins: [
    "ਸਿੱਕਿਆਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਅਨੁਪਾਤ ਅਨੁਸਾਰ ਮੰਨੋ।",
    "ਹਰ ਕਿਸਮ ਦੇ ਸਿੱਕਿਆਂ ਦਾ ਮੁੱਲ ਲਿਖੋ।",
    "ਕੁੱਲ ਮੁੱਲ ਦਾ ਸਮੀਕਰਨ ਬਣਾਓ।",
    "ਮੰਗੇ ਸਿੱਕਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।",
  ],
  weighted: [
    "ਅਨੁਪਾਤ ਅਨੁਸਾਰ ਇੱਕ ਇਕਾਈ ਮੰਨੋ।",
    "ਦਿੱਤੇ ਭਾਰ ਜਾਂ ਅੰਕਾਂ ਦਾ ਸਮੀਕਰਨ ਬਣਾਓ।",
    "ਇੱਕ ਇਕਾਈ ਦਾ ਮੁੱਲ ਕੱਢੋ।",
    "ਮੰਗੀ ਮਾਤਰਾ ਕੱਢੋ।",
  ],
  mixture: [
    "ਸ਼ੁਰੂਆਤੀ ਮਿਸ਼ਰਣ ਦਾ ਅਨੁਪਾਤ ਲਿਖੋ।",
    "ਮਿਲਾਈ ਮਾਤਰਾ ਤੋਂ ਬਾਅਦ ਵਾਲਾ ਅਨੁਪਾਤ ਲਿਖੋ।",
    "ਸਮੀਕਰਨ ਬਣਾਕੇ ਹੱਲ ਕਰੋ।",
    "ਮੰਗੀ ਮਾਤਰਾ ਕੱਢੋ।",
  ],
  replacement: [
    "ਹਰ ਵਾਰ ਬਚੀ ਮੂਲ ਮਾਤਰਾ ਦਾ ਭਾਗ ਲਿਖੋ।",
    "ਦੋਵੇਂ ਪੜਾਅ ਦੇ ਬਚੇ ਭਾਗ ਗੁਣਾ ਕਰੋ।",
    "ਅੰਤ ਵਿੱਚ ਬਚੀ ਮੂਲ ਮਾਤਰਾ ਕੱਢੋ।",
    "ਦੋਵੇਂ ਤਰਲਾਂ ਦਾ ਅੰਤਿਮ ਅਨੁਪਾਤ ਬਣਾਓ।",
  ],
  concentration: [
    "ਘੋਲ ਦੀ ਕੁੱਲ ਮਾਤਰਾ ਕੱਢੋ।",
    "ਤੇਜ਼ਾਬ ਦੀ ਮਾਤਰਾ ਨੂੰ ਕੁੱਲ ਮਾਤਰਾ ਨਾਲ ਭਾਗ ਦਿਓ।",
    "ਪ੍ਰਤੀਸ਼ਤ ਲਈ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।",
    "ਮੁੱਲ ਸਰਲ ਕਰੋ।",
  ],
} as const satisfies Record<string, Narratives>;

function narrativeSet(language: LocalizedLanguage, taskKind: Rap001TaskKind): Narratives {
  const table = language === "hi" ? HI : PA;
  switch (taskKind) {
    case "simpleLinkage":
    case "ratioTreeLinkage": return table.linkage;
    case "ratioNormalization":
    case "decimalNormalization": return table.normalization;
    case "scalingByComponent": return table.scaling;
    case "basicPartition": return table.partition;
    case "shareDifference": return table.difference;
    case "reversePartition": return table.reversePartition;
    case "salaryDistribution": return table.salary;
    case "twoStateAddition":
    case "twoStateSubtraction":
    case "twoStateTransfer":
    case "multiStageTransformation": return table.stateChange;
    case "incomeExpenditureSystem": return table.income;
    case "meanProportional": return table.mean;
    case "thirdProportional": return table.third;
    case "fourthProportional": return table.fourth;
    case "directVariation": return table.direct;
    case "inverseVariation": return table.inverse;
    case "coinCounting":
    case "multiDenominationMapping": return table.coins;
    case "weightedMapping":
    case "weightedMarks": return table.weighted;
    case "binaryMixture":
    case "mixtureComponentFinding":
    case "threeComponentMixture": return table.mixture;
    case "variableReplacementRatio": return table.replacement;
    case "acidConcentration": return table.concentration;
    default: return table.stateChange;
  }
}

function replaceNarrative(line: string, narrative: string) {
  const mathIndex = line.indexOf("\n\n$$");
  return mathIndex >= 0 ? `${narrative}${line.slice(mathIndex)}` : narrative;
}

export function renderSimpleLocalizedRap001Explanation(
  parameters: Rap001Parameters,
  solver: Rap001SolverResult,
): Rap001Explanation {
  const language = parameters.language as LocalizedLanguage;
  const explanation = renderStructuralLocalizedExplanation(parameters, solver);
  const narratives = narrativeSet(language, parameters.taskKind);
  const lines = explanation.lines.map((line, index) => {
    if (index < 4) return replaceNarrative(line, narratives[index]!);
    return language === "hi" ? line.replace(/^अतः/, "इसलिए") : line;
  });
  return { ...explanation, lines };
}
