import { required } from "./cp001-helpers";
import { toLatex } from "./rational";
import type {
  TmwCp007GeneratedQuestion,
  TmwCp007MisconceptionId,
  TmwCp007RuleId,
  TmwCp007SolveMode,
} from "./cp007-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp007Copy,
  cp007Group,
  cp007Number,
  cp007Rate,
  cp007Time,
} from "./localization-cp007-language";

function pair(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function inline(latex: string): string {
  return `\\(${latex}\\)`;
}

export function tmwCp007LocalizedOpening(
  ruleId: TmwCp007RuleId,
  language: TmwLocalizedLanguage,
): string {
  const values: Record<TmwCp007RuleId, [string, string]> = {
    TMW_CATEGORY_EQUIVALENCE: [
      "समान काम और समान समय में दोनों समूहों की कुल क्षमता बराबर होती है। इसलिए संख्या और प्रति-संसाधन दक्षता एक-दूसरे के विपरीत बदलती हैं।",
      "ਇੱਕੋ ਕੰਮ ਅਤੇ ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਦੋਵਾਂ ਸਮੂਹਾਂ ਦੀ ਕੁੱਲ ਸਮਰੱਥਾ ਬਰਾਬਰ ਹੁੰਦੀ ਹੈ। ਇਸ ਲਈ ਗਿਣਤੀ ਅਤੇ ਪ੍ਰਤੀ-ਸਰੋਤ ਦੱਖਤਾ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਬਦਲਦੇ ਹਨ।",
    ],
    TMW_WEIGHTED_CREW_RATE: [
      "हर श्रेणी की संख्या को उसकी व्यक्तिगत दक्षता से गुणा करें। सभी श्रेणियों के योगदान जोड़ने पर मिश्रित समूह की वास्तविक संयुक्त दर मिलती है।",
      "ਹਰ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਨੂੰ ਉਸ ਦੀ ਵਿਅਕਤੀਗਤ ਦੱਖਤਾ ਨਾਲ ਗੁਣਾ ਕਰੋ। ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਯੋਗਦਾਨ ਜੋੜਣ ਨਾਲ ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਦੀ ਅਸਲ ਸਾਂਝੀ ਦਰ ਮਿਲਦੀ ਹੈ।",
    ],
    TMW_HETEROGENEOUS_LINEAR_SYSTEM: [
      "अलग-अलग श्रेणियों की दरों या संख्याओं को अलग अज्ञात मानें। प्रत्येक उत्पादन तथ्य से एक समीकरण बनाकर सभी समीकरणों को साथ हल करें।",
      "ਵੱਖ-ਵੱਖ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਦਰ ਜਾਂ ਗਿਣਤੀ ਨੂੰ ਵੱਖ ਅਣਜਾਣ ਮੰਨੋ। ਹਰ ਉਤਪਾਦਨ ਤੱਥ ਤੋਂ ਇੱਕ ਸਮੀਕਰਨ ਬਣਾ ਕੇ ਸਾਰੇ ਸਮੀਕਰਨ ਇਕੱਠੇ ਹੱਲ ਕਰੋ।",
    ],
    TMW_CATEGORY_REPLACEMENT: [
      "बदले समूह की श्रेणीवार क्षमता फिर से जोड़ें। समान काम के लिए समय संयुक्त दर के व्युत्क्रमानुपाती होता है।",
      "ਬਦਲੇ ਸਮੂਹ ਦੀ ਸ਼੍ਰੇਣੀਵਾਰ ਸਮਰੱਥਾ ਮੁੜ ਜੋੜੋ। ਇੱਕੋ ਕੰਮ ਲਈ ਸਮਾਂ ਸਾਂਝੀ ਦਰ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ।",
    ],
    TMW_WEIGHTED_CONTRIBUTION: [
      "किसी श्रेणी का योगदान केवल उसकी संख्या नहीं है; संख्या और व्यक्तिगत दक्षता का गुणन लें। फिर उसे पूरे समूह के योगदान से तुलना करें।",
      "ਕਿਸੇ ਸ਼੍ਰੇਣੀ ਦਾ ਯੋਗਦਾਨ ਸਿਰਫ਼ ਉਸ ਦੀ ਗਿਣਤੀ ਨਹੀਂ ਹੈ; ਗਿਣਤੀ ਅਤੇ ਵਿਅਕਤੀਗਤ ਦੱਖਤਾ ਦਾ ਗੁਣਾ ਲਵੋ। ਫਿਰ ਇਸ ਦੀ ਪੂਰੇ ਸਮੂਹ ਦੇ ਯੋਗਦਾਨ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।",
    ],
    TMW_INTEGER_CREW_SEARCH: [
      "दोनों श्रेणियों की संख्याएँ धनात्मक पूर्णांक होनी चाहिए। क्षमता का समीकरण पूरा करने के बाद कुल संख्या या न्यूनतम संख्या की शर्त भी जाँचें।",
      "ਦੋਵਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ। ਸਮਰੱਥਾ ਦਾ ਸਮੀਕਰਨ ਪੂਰਾ ਕਰਨ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਗਿਣਤੀ ਜਾਂ ਘੱਟੋ-ਘੱਟ ਗਿਣਤੀ ਦੀ ਸ਼ਰਤ ਵੀ ਜਾਂਚੋ।",
    ],
  };
  return values[ruleId][language === "hi" ? 0 : 1];
}

function categoryRates(source: TmwCp007GeneratedQuestion, language: TmwLocalizedLanguage): string {
  return source.parameters.context.categories
    .map((category, index) => `${cp007Copy(category.singular, language)}: ${inline(`e_${String.fromCharCode(65 + index)}=${toLatex(category.efficiency)}`)}`)
    .join(language === "hi" ? "; " : "; ");
}

export function tmwCp007LocalizedGivens(
  source: TmwCp007GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string[] {
  const p = source.parameters;
  const base = [categoryRates(source, language)];
  switch (source.solveMode) {
    case "findTwoCategoryEfficiencyRatio":
      return [
        pair(language, `पहला समूह: ${cp007Group(p, p.crewA, language)}।`, `ਪਹਿਲਾ ਸਮੂਹ: ${cp007Group(p, p.crewA, language)}।`),
        pair(language, `दूसरा समूह: ${cp007Group(p, p.crewB, language)}; काम और समय समान।`, `ਦੂਜਾ ਸਮੂਹ: ${cp007Group(p, p.crewB, language)}; ਕੰਮ ਅਤੇ ਸਮਾਂ ਇੱਕੋ।`),
      ];
    case "findThreeCategoryEfficiencyRatio":
      return [
        pair(language, "पहली और दूसरी श्रेणी की समतुल्य क्षमता दी गई है।", "ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਦੀ ਬਰਾਬਰ ਸਮਰੱਥਾ ਦਿੱਤੀ ਹੈ।"),
        pair(language, "दूसरी और तीसरी श्रेणी की समतुल्य क्षमता भी दी गई है।", "ਦੂਜੀ ਅਤੇ ਤੀਜੀ ਸ਼੍ਰੇਣੀ ਦੀ ਬਰਾਬਰ ਸਮਰੱਥਾ ਵੀ ਦਿੱਤੀ ਹੈ।"),
      ];
    case "findMixedCrewCompletionTime":
    case "findHeterogeneousGroupRate":
    case "findMixedCrewOutput":
    case "findEquivalentStandardResourceTime":
    case "findCategoryContributionFraction":
      return [
        ...base,
        pair(language, `मिश्रित समूह: ${cp007Group(p, p.crewA, language)}।`, `ਮਿਲਿਆ-ਜੁਲਿਆ ਸਮੂਹ: ${cp007Group(p, p.crewA, language)}।`),
      ];
    case "findEquivalentCategoryCount":
      return [
        ...base,
        pair(language, `बदली जाने वाली क्षमता: ${cp007Group(p, p.crewA, language)}।`, `ਬਦਲੀ ਜਾਣ ਵਾਲੀ ਸਮਰੱਥਾ: ${cp007Group(p, p.crewA, language)}।`),
      ];
    case "findUnknownCategoryCountForTargetTime":
      return [
        ...base,
        pair(language, `ज्ञात समूह: ${cp007Group(p, p.crewA, language)}।`, `ਜਾਣਿਆ ਸਮੂਹ: ${cp007Group(p, p.crewA, language)}।`),
        pair(language, `लक्ष्य: ${cp007Number(p.workA)} ${cp007Copy(p.context.outputUnit, language)}, ${cp007Time(p, p.daysA, language)}।`, `ਟੀਚਾ: ${cp007Number(p.workA)} ${cp007Copy(p.context.outputUnit, language)}, ${cp007Time(p, p.daysA, language)}।`),
      ];
    case "findCrewCompositionFromTwoOutputFacts":
      return [
        pair(language, `पहला तथ्य: ${cp007Number(p.workA)} ${cp007Copy(p.context.outputUnit, language)} in ${cp007Time(p, p.daysA, language)}।`, `ਪਹਿਲਾ ਤੱਥ: ${cp007Number(p.workA)} ${cp007Copy(p.context.outputUnit, language)} ${cp007Time(p, p.daysA, language)} ਵਿੱਚ।`).replace(" in ", " "),
        pair(language, `दूसरा तथ्य: पहली श्रेणी दोगुनी; ${cp007Number(p.workB)} ${cp007Copy(p.context.outputUnit, language)} ${cp007Time(p, p.daysB, language)} में।`, `ਦੂਜਾ ਤੱਥ: ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਦੁੱਗਣੀ; ${cp007Number(p.workB)} ${cp007Copy(p.context.outputUnit, language)} ${cp007Time(p, p.daysB, language)} ਵਿੱਚ।`),
      ];
    case "findCategoryRateFromWeightedCrewFacts": {
      const groups = required(p.pairwiseCrews, "pairwiseCrews");
      const rates = required(p.pairwiseRates, "pairwiseRates");
      return groups.map((group, index) => pair(
        language,
        `अभिलेख ${index + 1}: ${cp007Group(p, group, language)} → ${cp007Rate(p, rates[index], language)}।`,
        `ਰਿਕਾਰਡ ${index + 1}: ${cp007Group(p, group, language)} → ${cp007Rate(p, rates[index], language)}।`,
      ));
    }
    case "findCompletionAfterCategoryReplacement":
      return [
        pair(language, `मूल समूह: ${cp007Group(p, p.crewA, language)}, ${cp007Time(p, p.daysA, language)}।`, `ਮੂਲ ਸਮੂਹ: ${cp007Group(p, p.crewA, language)}, ${cp007Time(p, p.daysA, language)}।`),
        pair(language, `बदला समूह: ${cp007Group(p, p.crewB, language)}।`, `ਬਦਲਿਆ ਸਮੂਹ: ${cp007Group(p, p.crewB, language)}।`),
      ];
    case "findMinimumIntegerCrewComposition":
      return [
        ...base,
        pair(language, `लक्ष्य संयुक्त दर: ${cp007Rate(p, required(p.targetCrewRate, "targetCrewRate"), language)}।`, `ਟੀਚਾ ਸਾਂਝੀ ਦਰ: ${cp007Rate(p, required(p.targetCrewRate, "targetCrewRate"), language)}।`),
      ];
    case "findUnknownCategorySoloTime":
      return [
        ...base,
        pair(language, `समूह: ${cp007Group(p, p.crewA, language)}, पूरा समय ${cp007Time(p, p.daysA, language)}।`, `ਸਮੂਹ: ${cp007Group(p, p.crewA, language)}, ਪੂਰਾ ਸਮਾਂ ${cp007Time(p, p.daysA, language)}।`),
      ];
    case "compareTwoHeterogeneousCrews":
      return [
        ...base,
        pair(language, `समूह A: ${cp007Group(p, p.crewA, language)}।`, `ਸਮੂਹ A: ${cp007Group(p, p.crewA, language)}।`),
        pair(language, `समूह B: ${cp007Group(p, p.crewB, language)}।`, `ਸਮੂਹ B: ${cp007Group(p, p.crewB, language)}।`),
      ];
    case "findIntegerCrewCompositionUnderConstraints":
      return [
        ...base,
        pair(language, `कुल सदस्य: ${cp007Number(required(p.totalCrewCount, "totalCrewCount"))}।`, `ਕੁੱਲ ਮੈਂਬਰ: ${cp007Number(required(p.totalCrewCount, "totalCrewCount"))}।`),
        pair(language, `लक्ष्य दर: ${cp007Rate(p, required(p.targetCrewRate, "targetCrewRate"), language)}।`, `ਟੀਚਾ ਦਰ: ${cp007Rate(p, required(p.targetCrewRate, "targetCrewRate"), language)}।`),
      ];
  }
}

const shortcutTitles: Record<TmwCp007SolveMode, [string, string]> = {
  findTwoCategoryEfficiencyRatio: ["उलटा संख्या अनुपात", "ਉਲਟ ਗਿਣਤੀ ਅਨੁਪਾਤ"],
  findThreeCategoryEfficiencyRatio: ["दो अनुपात जोड़ें", "ਦੋ ਅਨੁਪਾਤ ਜੋੜੋ"],
  findMixedCrewCompletionTime: ["भारित दर से समय", "ਭਾਰਿਤ ਦਰ ਤੋਂ ਸਮਾਂ"],
  findEquivalentCategoryCount: ["क्षमता बराबर रखें", "ਸਮਰੱਥਾ ਬਰਾਬਰ ਰੱਖੋ"],
  findUnknownCategoryCountForTargetTime: ["लक्ष्य दर में कमी", "ਟੀਚਾ ਦਰ ਦੀ ਘਾਟ"],
  findCrewCompositionFromTwoOutputFacts: ["दो समीकरण घटाएँ", "ਦੋ ਸਮੀਕਰਨ ਘਟਾਓ"],
  findCategoryRateFromWeightedCrewFacts: ["तीन दर समीकरण", "ਤਿੰਨ ਦਰ ਸਮੀਕਰਨ"],
  findHeterogeneousGroupRate: ["श्रेणीवार योगदान जोड़ें", "ਸ਼੍ਰੇਣੀਵਾਰ ਯੋਗਦਾਨ ਜੋੜੋ"],
  findCompletionAfterCategoryReplacement: ["नई दर का उलटा समय", "ਨਵੀਂ ਦਰ ਦਾ ਉਲਟ ਸਮਾਂ"],
  findMixedCrewOutput: ["संयुक्त दर × समय", "ਸਾਂਝੀ ਦਰ × ਸਮਾਂ"],
  findEquivalentStandardResourceTime: ["मानक श्रेणी में बदलें", "ਮਿਆਰੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਬਦਲੋ"],
  findMinimumIntegerCrewComposition: ["छोटी पूर्णांक खोज", "ਛੋਟੀ ਪੂਰਨ-ਅੰਕ ਖੋਜ"],
  findUnknownCategorySoloTime: ["अज्ञात दर का उलटा", "ਅਣਜਾਣ ਦਰ ਦਾ ਉਲਟ"],
  findCategoryContributionFraction: ["श्रेणी योगदान ÷ कुल", "ਸ਼੍ਰੇਣੀ ਯੋਗਦਾਨ ÷ ਕੁੱਲ"],
  compareTwoHeterogeneousCrews: ["दो भारित दरें", "ਦੋ ਭਾਰਿਤ ਦਰਾਂ"],
  findIntegerCrewCompositionUnderConstraints: ["कुल संख्या + भारित दर", "ਕੁੱਲ ਗਿਣਤੀ + ਭਾਰਿਤ ਦਰ"],
};

export function tmwCp007LocalizedShortcut(
  source: TmwCp007GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): { title: string; steps: string[] } {
  const title = `10-${language === "hi" ? "सेकंड" : "ਸਕਿੰਟ"} ${shortcutTitles[source.solveMode][language === "hi" ? 0 : 1]}`;
  const first = pair(
    language,
    "पहले हर श्रेणी की संख्या × उसकी व्यक्तिगत दक्षता लिखें; केवल सिरों की संख्या न जोड़ें।",
    "ਪਹਿਲਾਂ ਹਰ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ × ਉਸ ਦੀ ਵਿਅਕਤੀਗਤ ਦੱਖਤਾ ਲਿਖੋ; ਸਿਰਫ਼ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਨਾ ਜੋੜੋ।",
  );
  const modeStep: Record<TmwCp007SolveMode, [string, string]> = {
    findTwoCategoryEfficiencyRatio: ["समान क्षमता में दक्षता अनुपात संख्या अनुपात का उलटा है।", "ਬਰਾਬਰ ਸਮਰੱਥਾ ਵਿੱਚ ਦੱਖਤਾ ਅਨੁਪਾਤ ਗਿਣਤੀ ਅਨੁਪਾਤ ਦਾ ਉਲਟ ਹੈ।"],
    findThreeCategoryEfficiencyRatio: ["दो जोड़ी अनुपातों में सामान्य श्रेणी बराबर करके तीन पद जोड़ें।", "ਦੋ ਜੋੜੀ ਅਨੁਪਾਤਾਂ ਵਿੱਚ ਸਾਂਝੀ ਸ਼੍ਰੇਣੀ ਬਰਾਬਰ ਕਰਕੇ ਤਿੰਨ ਪਦ ਜੋੜੋ।"],
    findMixedCrewCompletionTime: ["कुल काम को संयुक्त दर से भाग दें।", "ਕੁੱਲ ਕੰਮ ਨੂੰ ਸਾਂਝੀ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    findEquivalentCategoryCount: ["स्रोत क्षमता को लक्ष्य श्रेणी की एक इकाई की दक्षता से भाग दें।", "ਸਰੋਤ ਸਮਰੱਥਾ ਨੂੰ ਟੀਚਾ ਸ਼੍ਰੇਣੀ ਦੀ ਇੱਕ ਇਕਾਈ ਦੀ ਦੱਖਤਾ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    findUnknownCategoryCountForTargetTime: ["लक्ष्य दर से ज्ञात समूह की दर घटाकर शेष को अज्ञात श्रेणी की दक्षता से भाग दें।", "ਟੀਚਾ ਦਰ ਵਿੱਚੋਂ ਜਾਣੇ ਸਮੂਹ ਦੀ ਦਰ ਘਟਾ ਕੇ ਬਾਕੀ ਨੂੰ ਅਣਜਾਣ ਸ਼੍ਰੇਣੀ ਦੀ ਦੱਖਤਾ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    findCrewCompositionFromTwoOutputFacts: ["दूसरा दर समीकरण पहले से घटाने पर पहली श्रेणी की संख्या सीधे मिलती है।", "ਦੂਜਾ ਦਰ ਸਮੀਕਰਨ ਪਹਿਲੇ ਵਿੱਚੋਂ ਘਟਾਉਣ ਨਾਲ ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਸਿੱਧੀ ਮਿਲਦੀ ਹੈ।"],
    findCategoryRateFromWeightedCrewFacts: ["तीनों अभिलेखों के समीकरण साथ हल करके लक्ष्य श्रेणी की दर चुनें।", "ਤਿੰਨਾਂ ਰਿਕਾਰਡਾਂ ਦੇ ਸਮੀਕਰਨ ਇਕੱਠੇ ਹੱਲ ਕਰਕੇ ਟੀਚਾ ਸ਼੍ਰੇਣੀ ਦੀ ਦਰ ਚੁਣੋ।"],
    findHeterogeneousGroupRate: ["सभी श्रेणी योगदानों का योग ही समूह की दर है।", "ਸਾਰੇ ਸ਼੍ਰੇਣੀ ਯੋਗਦਾਨਾਂ ਦਾ ਜੋੜ ਹੀ ਸਮੂਹ ਦੀ ਦਰ ਹੈ।"],
    findCompletionAfterCategoryReplacement: ["समान काम के लिए नया समय = पुराना समय × पुरानी दर ÷ नई दर।", "ਇੱਕੋ ਕੰਮ ਲਈ ਨਵਾਂ ਸਮਾਂ = ਪੁਰਾਣਾ ਸਮਾਂ × ਪੁਰਾਣੀ ਦਰ ÷ ਨਵੀਂ ਦਰ।"],
    findMixedCrewOutput: ["संयुक्त दर को काम की अवधि से गुणा करें।", "ਸਾਂਝੀ ਦਰ ਨੂੰ ਕੰਮ ਦੀ ਮਿਆਦ ਨਾਲ ਗੁਣਾ ਕਰੋ।"],
    findEquivalentStandardResourceTime: ["पूरे भारित योगदान को मानक श्रेणी की दक्षता से भाग दें।", "ਪੂਰੇ ਭਾਰਿਤ ਯੋਗਦਾਨ ਨੂੰ ਮਿਆਰੀ ਸ਼੍ਰੇਣੀ ਦੀ ਦੱਖਤਾ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    findMinimumIntegerCrewComposition: ["क्षमता पूरी करने वाले धनात्मक पूर्णांक जोड़ों में सबसे कम कुल संख्या चुनें।", "ਸਮਰੱਥਾ ਪੂਰੀ ਕਰਨ ਵਾਲੇ ਧਨਾਤਮਕ ਪੂਰਨ-ਅੰਕ ਜੋੜਿਆਂ ਵਿੱਚ ਸਭ ਤੋਂ ਘੱਟ ਕੁੱਲ ਗਿਣਤੀ ਚੁਣੋ।"],
    findUnknownCategorySoloTime: ["समूह दर से ज्ञात योगदान घटाएँ, प्रति-संसाधन दर निकालें और उसका उलटा लें।", "ਸਮੂਹ ਦਰ ਵਿੱਚੋਂ ਜਾਣਿਆ ਯੋਗਦਾਨ ਘਟਾਓ, ਪ੍ਰਤੀ-ਸਰੋਤ ਦਰ ਕੱਢੋ ਅਤੇ ਉਸ ਦਾ ਉਲਟ ਲਵੋ।"],
    findCategoryContributionFraction: ["लक्ष्य श्रेणी का संख्या × दक्षता, पूरे समूह के योग से भाग दें।", "ਟੀਚਾ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ × ਦੱਖਤਾ ਨੂੰ ਪੂਰੇ ਸਮੂਹ ਦੇ ਜੋੜ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    compareTwoHeterogeneousCrews: ["दोनों समूहों की भारित दरें अलग निकालकर उसी क्रम में अनुपात लिखें।", "ਦੋਵਾਂ ਸਮੂਹਾਂ ਦੀਆਂ ਭਾਰਿਤ ਦਰਾਂ ਵੱਖ ਕੱਢ ਕੇ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਅਨੁਪਾਤ ਲਿਖੋ।"],
    findIntegerCrewCompositionUnderConstraints: ["कुल संख्या और भारित दर के दो समीकरण हल करें; दोनों उत्तर पूर्णांक होने चाहिए।", "ਕੁੱਲ ਗਿਣਤੀ ਅਤੇ ਭਾਰਿਤ ਦਰ ਦੇ ਦੋ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ; ਦੋਵੇਂ ਉੱਤਰ ਪੂਰਨ ਅੰਕ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।"],
  };
  return {
    title,
    steps: [first, modeStep[source.solveMode][language === "hi" ? 0 : 1], pair(language, `अतः उत्तर ${answerText} है।`, `ਇਸ ਲਈ ਉੱਤਰ ${answerText} ਹੈ।`)],
  };
}

export function tmwCp007LocalizedTrapReason(
  misconceptionId: Exclude<TmwCp007MisconceptionId, "CORRECT">,
  language: TmwLocalizedLanguage,
): string {
  const values: Record<Exclude<TmwCp007MisconceptionId, "CORRECT">, [string, string]> = {
    CATEGORY_RATES_ASSUMED_EQUAL: ["यह विकल्प अलग श्रेणियों को समान दक्षता वाला मानकर केवल संख्या जोड़ देता है।", "ਇਹ ਚੋਣ ਵੱਖ ਸ਼੍ਰੇਣੀਆਂ ਨੂੰ ਇੱਕੋ ਦੱਖਤਾ ਵਾਲਾ ਮੰਨ ਕੇ ਸਿਰਫ਼ ਗਿਣਤੀ ਜੋੜ ਦਿੰਦੀ ਹੈ।"],
    COUNT_RATIO_NOT_INVERTED: ["समान काम और समय में दक्षता अनुपात संख्या अनुपात का उलटा होता है; यह विकल्प उसे सीधे लिख देता है।", "ਇੱਕੋ ਕੰਮ ਅਤੇ ਸਮੇਂ ਵਿੱਚ ਦੱਖਤਾ ਅਨੁਪਾਤ ਗਿਣਤੀ ਅਨੁਪਾਤ ਦਾ ਉਲਟ ਹੁੰਦਾ ਹੈ; ਇਹ ਚੋਣ ਇਸ ਨੂੰ ਸਿੱਧਾ ਲਿਖ ਦਿੰਦੀ ਹੈ।"],
    CREW_RATE_NOT_SUMMED: ["यह विकल्प समूह की किसी सक्रिय श्रेणी का योगदान संयुक्त दर में नहीं जोड़ता।", "ਇਹ ਚੋਣ ਸਮੂਹ ਦੀ ਕਿਸੇ ਸਰਗਰਮ ਸ਼੍ਰੇਣੀ ਦਾ ਯੋਗਦਾਨ ਸਾਂਝੀ ਦਰ ਵਿੱਚ ਨਹੀਂ ਜੋੜਦੀ।"],
    KNOWN_CATEGORY_OMITTED: ["अज्ञात श्रेणी निकालने से पहले ज्ञात श्रेणियों की क्षमता घटानी चाहिए; यह विकल्प ऐसा नहीं करता।", "ਅਣਜਾਣ ਸ਼੍ਰੇਣੀ ਕੱਢਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਣੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਸਮਰੱਥਾ ਘਟਾਉਣੀ ਚਾਹੀਦੀ ਹੈ; ਇਹ ਚੋਣ ਅਜਿਹਾ ਨਹੀਂ ਕਰਦੀ।"],
    TOTAL_REPORTED_AS_REPLACEMENT: ["प्रश्न अतिरिक्त या प्रतिस्थापन संख्या पूछता है, जबकि यह विकल्प संयुक्त कुल संख्या देता है।", "ਪ੍ਰਸ਼ਨ ਵਾਧੂ ਜਾਂ ਬਦਲੀ ਗਿਣਤੀ ਪੁੱਛਦਾ ਹੈ, ਜਦਕਿ ਇਹ ਚੋਣ ਸਾਂਝੀ ਕੁੱਲ ਗਿਣਤੀ ਦਿੰਦੀ ਹੈ।"],
    REPLACEMENT_RATIO_REVERSED: ["मजबूत श्रेणी की कम और कमजोर श्रेणी की अधिक इकाइयाँ चाहिए; इस विकल्प ने अनुपात की दिशा उलट दी है।", "ਮਜ਼ਬੂਤ ਸ਼੍ਰੇਣੀ ਦੀਆਂ ਘੱਟ ਅਤੇ ਕਮਜ਼ੋਰ ਸ਼੍ਰੇਣੀ ਦੀਆਂ ਵੱਧ ਇਕਾਈਆਂ ਚਾਹੀਦੀਆਂ ਹਨ; ਇਸ ਚੋਣ ਨੇ ਅਨੁਪਾਤ ਦੀ ਦਿਸ਼ਾ ਉਲਟ ਦਿੱਤੀ ਹੈ।"],
    TIME_RATE_INVERSION_MISSED: ["समान काम में समय दर के विपरीत बदलता है; यह विकल्प समय को दर के साथ सीधे बदलता है।", "ਇੱਕੋ ਕੰਮ ਵਿੱਚ ਸਮਾਂ ਦਰ ਦੇ ਉਲਟ ਬਦਲਦਾ ਹੈ; ਇਹ ਚੋਣ ਸਮੇਂ ਨੂੰ ਦਰ ਨਾਲ ਸਿੱਧਾ ਬਦਲਦੀ ਹੈ।"],
    CONTRIBUTION_USES_HEADCOUNT_ONLY: ["काम का हिस्सा संख्या × दक्षता से मिलता है; यह विकल्प केवल सदस्यों की संख्या देखता है।", "ਕੰਮ ਦਾ ਹਿੱਸਾ ਗਿਣਤੀ × ਦੱਖਤਾ ਨਾਲ ਮਿਲਦਾ ਹੈ; ਇਹ ਚੋਣ ਸਿਰਫ਼ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਵੇਖਦੀ ਹੈ।"],
    PAIR_ORDER_REVERSED: ["उत्तर प्रश्न में माँगे गए श्रेणी क्रम में होना चाहिए; इस विकल्प ने दोनों पद बदल दिए हैं।", "ਉੱਤਰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੇ ਸ਼੍ਰੇਣੀ ਕ੍ਰਮ ਵਿੱਚ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ; ਇਸ ਚੋਣ ਨੇ ਦੋਵੇਂ ਪਦ ਬਦਲ ਦਿੱਤੇ ਹਨ।"],
    INTEGER_CONSTRAINT_IGNORED: ["दोनों संख्याएँ सभी समीकरणों को ठीक पूरा करने वाली धनात्मक पूर्णांक होनी चाहिए; यह विकल्प शर्त तोड़ता है।", "ਦੋਵਾਂ ਗਿਣਤੀਆਂ ਸਾਰੇ ਸਮੀਕਰਨ ਠੀਕ ਪੂਰੇ ਕਰਨ ਵਾਲੇ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ; ਇਹ ਚੋਣ ਸ਼ਰਤ ਤੋੜਦੀ ਹੈ।"],
    PLAUSIBLE_SCALE_ERROR: ["यह विकल्प भारित दर या अनुपात में एक साधारण गुणन-भाग त्रुटि से बनता है।", "ਇਹ ਚੋਣ ਭਾਰਿਤ ਦਰ ਜਾਂ ਅਨੁਪਾਤ ਵਿੱਚ ਇੱਕ ਸਧਾਰਣ ਗੁਣਾ-ਭਾਗ ਗਲਤੀ ਨਾਲ ਬਣਦੀ ਹੈ।"],
  };
  return values[misconceptionId][language === "hi" ? 0 : 1];
}

export function tmwCp007LocalizedConclusion(
  source: TmwCp007GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  switch (source.solution.answerType) {
    case "RATIO":
    case "TRIPLE_RATIO":
      return pair(language, `अतः माँगा गया अनुपात ${answerText} है।`, `ਇਸ ਲਈ ਮੰਗਿਆ ਅਨੁਪਾਤ ${answerText} ਹੈ।`);
    case "COUNT_PAIR":
      return pair(language, `अतः समूह की संरचना ${answerText} है।`, `ਇਸ ਲਈ ਸਮੂਹ ਦੀ ਬਣਤਰ ${answerText} ਹੈ।`);
    case "COUNT":
      return pair(language, `अतः आवश्यक संख्या ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਗਿਣਤੀ ${answerText} ਹੈ।`);
    case "TIME":
      return pair(language, `अतः आवश्यक समय ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸਮਾਂ ${answerText} ਹੈ।`);
    case "RATE":
      return pair(language, `अतः माँगी गई दर ${answerText} है।`, `ਇਸ ਲਈ ਮੰਗੀ ਦਰ ${answerText} ਹੈ।`);
    case "WORK":
      return pair(language, `अतः कुल उत्पादन ${answerText} है।`, `ਇਸ ਲਈ ਕੁੱਲ ਉਤਪਾਦਨ ${answerText} ਹੈ।`);
    case "FRACTION":
      return pair(language, `अतः लक्ष्य श्रेणी का योगदान ${answerText} है।`, `ਇਸ ਲਈ ਟੀਚਾ ਸ਼੍ਰੇਣੀ ਦਾ ਯੋਗਦਾਨ ${answerText} ਹੈ।`);
    case "RESOURCE_TIME":
      return pair(language, `अतः समतुल्य संसाधन-समय ${answerText} है।`, `ਇਸ ਲਈ ਬਰਾਬਰ ਸਰੋਤ-ਸਮਾਂ ${answerText} ਹੈ।`);
  }
}
