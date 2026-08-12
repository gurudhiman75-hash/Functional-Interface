import { add, divide, multiply, reciprocal, subtract, toLatex } from "./rational";
import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";
import type { TmwCp007Parameters, TmwCp007Solution, TmwCp007SolveMode } from "./cp007-types";
import type { Rational } from "./types";

type Language = "en" | "hi" | "pa";

interface Cp007OptionAudit {
  text: string;
  [key: string]: unknown;
}

interface Cp007Question {
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  solveMode?: TmwCp007SolveMode | string;
  stem?: string;
  parameters?: TmwCp007Parameters;
  solution?: TmwCp007Solution;
  options?: string[];
  optionAudit?: Cp007OptionAudit[];
  correctIndex?: number;
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

function t(language: Language, en: string, hi: string, pa: string): string {
  return language === "hi" ? hi : language === "pa" ? pa : en;
}

function math(value: string): string {
  return `\\(${value}\\)`;
}

function step(label: string, expression: string): string {
  return `${label}: ${math(expression)}.`;
}

function crewRate(parameters: TmwCp007Parameters, crew: TmwCp007Parameters["crewA"]): Rational {
  return crew.reduce(
    (sum, count, index) => add(sum, multiply(count, parameters.context.categories[index].efficiency)),
    { numerator: 0, denominator: 1 },
  );
}

function crewTerms(parameters: TmwCp007Parameters, crew: TmwCp007Parameters["crewA"]): string {
  const terms = crew
    .map((count, index) => count.numerator === 0
      ? null
      : `${toLatex(count)}\\times${toLatex(parameters.context.categories[index].efficiency)}`)
    .filter((value): value is string => Boolean(value));
  return terms.join("+");
}

function fixNumberAgreement(text: string, language: Language): string {
  if (language === "hi") {
    return text
      .replace(/\b1 फाइलें\b/g, "1 फाइल")
      .replace(/\b1 पुर्ज़े\b/g, "1 पुर्ज़ा")
      .replace(/\b1 बोतलें\b/g, "1 बोतल")
      .replace(/\b1 प्रतियाँ\b/g, "1 प्रति")
      .replace(/\b1 कार्य-इकाइयाँ\b/g, "1 कार्य-इकाई");
  }
  if (language === "pa") {
    return text
      .replace(/\b1 ਫਾਈਲਾਂ\b/g, "1 ਫਾਈਲ")
      .replace(/\b1 ਪੁਰਜ਼ੇ\b/g, "1 ਪੁਰਜ਼ਾ")
      .replace(/\b1 ਬੋਤਲਾਂ\b/g, "1 ਬੋਤਲ")
      .replace(/\b1 ਕਾਪੀਆਂ\b/g, "1 ਕਾਪੀ")
      .replace(/\b1 ਕੰਮ-ਇਕਾਈਆਂ\b/g, "1 ਕੰਮ-ਇਕਾਈ");
  }
  return text;
}

function fixStem(stem: string, qlId: string, language: Language): string {
  let fixed = stem;
  if (language === "hi") {
    fixed = fixed
      .replace(/उत्पादन स्थिति बताते हैं कि/g, "दिए गए उत्पादन संबंध बताते हैं कि")
      .replace(/तीनों श्रेणियों की एक सदस्य की काम-दर/g, "तीनों श्रेणियों के एक-एक सदस्य की काम-दर")
      .replace(/तीन उत्पादन स्थिति हैं/g, "तीन उत्पादन स्थितियाँ हैं")
      .replace(/प्रति-संसाधन दक्षताओं/g, "व्यक्तिगत दक्षताओं")
      .replace(/([\p{L}-]+) का ऑर्डर को/gu, "$1 के ऑर्डर को")
      .replace(/([\p{L}-]+) का ऑर्डर पर/gu, "$1 के ऑर्डर पर");

    if (qlId === "TMW-QL-132") {
      fixed = fixed
        .replace(/कितने अतिरिक्त ([^?]*मशीनें) चाहिए/g, "कितनी अतिरिक्त $1 चाहिए")
        .replace(/कितने अतिरिक्त ([^?]*लाइनें) चाहिए/g, "कितनी अतिरिक्त $1 चाहिए");
    }
    if (qlId === "TMW-QL-138" && /मशीन/.test(fixed)) {
      fixed = fixed.replace(/काम करते हैं/g, "काम करती हैं");
    }
    if (qlId === "TMW-QL-140" && /मशीन/.test(fixed)) {
      fixed = fixed
        .replace(/(एक [^।]*मशीन अकेले वही काम [^।]+) करता है/g, "$1 करती है")
        .replace(/(एक [^।]*मशीन अकेले कितना समय) लेगा/g, "$1 लेगी");
    }
    if (qlId === "TMW-QL-141" && /मशीनें/.test(fixed)) {
      fixed = fixed.replace(/मशीनें कुल काम का कितना भाग करते हैं/g, "मशीनें कुल काम का कितना भाग करती हैं");
    }
  } else if (language === "pa") {
    fixed = fixed
      .replace(/ਉਤਪਾਦਨ ਸਥਿਤੀ ਦੱਸਦੇ ਹਨ ਕਿ/g, "ਦਿੱਤੇ ਉਤਪਾਦਨ ਸੰਬੰਧ ਦੱਸਦੇ ਹਨ ਕਿ")
      .replace(/ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ/g, "ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਇੱਕ-ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ")
      .replace(/ਤਿੰਨ ਉਤਪਾਦਨ ਸਥਿਤੀ ਹਨ/g, "ਤਿੰਨ ਉਤਪਾਦਨ ਸਥਿਤੀਆਂ ਹਨ")
      .replace(/ਪ੍ਰਤੀ-ਸਰੋਤ ਦੱਖਤਾ/g, "ਵਿਅਕਤੀਗਤ ਦੱਖਤਾ")
      .replace(/([\p{L}-]+) ਦਾ ਆਰਡਰ ਉੱਤੇ/gu, "$1 ਦੇ ਆਰਡਰ ਉੱਤੇ");

    if (qlId === "TMW-QL-138" && /ਮਸ਼ੀਨ/.test(fixed)) {
      fixed = fixed.replace(/ਕੰਮ ਕਰਦੇ ਹਨ/g, "ਕੰਮ ਕਰਦੀਆਂ ਹਨ");
    }
    if (qlId === "TMW-QL-141" && /ਮਸ਼ੀਨਾਂ/.test(fixed)) {
      fixed = fixed.replace(/ਮਸ਼ੀਨਾਂ ਕੁੱਲ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਕਰਦੇ ਹਨ/g, "ਮਸ਼ੀਨਾਂ ਕੁੱਲ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਕਰਦੀਆਂ ਹਨ");
    }
  }
  return fixNumberAgreement(fixed, language);
}

function methodFor(mode: string, language: Language): string {
  switch (mode) {
    case "findTwoCategoryEfficiencyRatio": return t(language,
      "Because the two groups do equal work in equal time, invert their counts to obtain the individual-rate ratio",
      "दोनों समूह समान काम समान समय में करते हैं, इसलिए सदस्यों की संख्याओं का उलटा अनुपात लेकर व्यक्तिगत काम-दर का अनुपात निकालें",
      "ਦੋਵੇਂ ਸਮੂਹ ਇੱਕੋ ਕੰਮ ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਉਲਟ ਅਨੁਪਾਤ ਲੈ ਕੇ ਵਿਅਕਤੀਗਤ ਕੰਮ-ਦਰ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ");
    case "findThreeCategoryEfficiencyRatio": return t(language,
      "Convert both equivalence statements into pairwise individual-rate ratios, then align the common middle category",
      "दोनों समतुल्यता संबंधों से जोड़ीवार व्यक्तिगत काम-दर अनुपात निकालें और बीच वाली समान श्रेणी को मिलाकर तीनों का अनुपात बनाएं",
      "ਦੋਵੇਂ ਸਮਤੁਲਤਾ ਸੰਬੰਧਾਂ ਤੋਂ ਜੋੜੀਵਾਰ ਵਿਅਕਤੀਗਤ ਕੰਮ-ਦਰ ਅਨੁਪਾਤ ਕੱਢੋ ਅਤੇ ਵਿਚਕਾਰਲੀ ਸਾਂਝੀ ਸ਼੍ਰੇਣੀ ਨੂੰ ਮਿਲਾ ਕੇ ਤਿੰਨਾਂ ਦਾ ਅਨੁਪਾਤ ਬਣਾਓ");
    case "findMixedCrewCompletionTime": return t(language,
      "Add count × individual rate for every category to get the crew rate, then divide total work by that rate",
      "हर श्रेणी के लिए संख्या × व्यक्तिगत दर जोड़कर समूह की कुल दर निकालें, फिर कुल काम को इस दर से भाग दें",
      "ਹਰ ਸ਼੍ਰੇਣੀ ਲਈ ਗਿਣਤੀ × ਵਿਅਕਤੀਗਤ ਦਰ ਜੋੜ ਕੇ ਸਮੂਹ ਦੀ ਕੁੱਲ ਦਰ ਕੱਢੋ, ਫਿਰ ਕੁੱਲ ਕੰਮ ਨੂੰ ਇਸ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ");
    case "findEquivalentCategoryCount": return t(language,
      "Find the source group's total capacity and divide it by one target resource's rate",
      "मूल समूह की कुल क्षमता निकालें और उसे मांगी गई श्रेणी के एक सदस्य की दर से भाग दें",
      "ਮੂਲ ਸਮੂਹ ਦੀ ਕੁੱਲ ਸਮਰੱਥਾ ਕੱਢੋ ਅਤੇ ਇਸ ਨੂੰ ਮੰਗੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦੇ ਇੱਕ ਮੈਂਬਰ ਦੀ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ");
    case "findUnknownCategoryCountForTargetTime": return t(language,
      "Find the rate required by the deadline, subtract the existing crew rate, then convert the missing rate into extra resources",
      "समय-सीमा के लिए आवश्यक कुल दर निकालें, वर्तमान समूह की दर घटाएं और बची दर को अतिरिक्त सदस्यों की संख्या में बदलें",
      "ਸਮਾਂ-ਸੀਮਾ ਲਈ ਲੋੜੀਂਦੀ ਕੁੱਲ ਦਰ ਕੱਢੋ, ਮੌਜੂਦਾ ਸਮੂਹ ਦੀ ਦਰ ਘਟਾਓ ਅਤੇ ਬਚੀ ਦਰ ਨੂੰ ਵਾਧੂ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਬਦਲੋ");
    case "findCrewCompositionFromTwoOutputFacts": return t(language,
      "Convert both output records to crew rates; their difference isolates the category whose count changed, then recover the other count",
      "दोनों उत्पादन स्थितियों को समूह-दर में बदलें; दरों का अंतर बदली हुई श्रेणी की संख्या देता है, फिर दूसरी श्रेणी की संख्या निकालें",
      "ਦੋਵੇਂ ਉਤਪਾਦਨ ਸਥਿਤੀਆਂ ਨੂੰ ਸਮੂਹ-ਦਰ ਵਿੱਚ ਬਦਲੋ; ਦਰਾਂ ਦਾ ਫਰਕ ਬਦਲੀ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਦਿੰਦਾ ਹੈ, ਫਿਰ ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਕੱਢੋ");
    case "findCategoryRateFromWeightedCrewFacts": return t(language,
      "Solve the three crew-rate records together to obtain the three individual rates, then read the requested category's rate",
      "तीनों समूह-दर स्थितियों को साथ हल करके तीनों व्यक्तिगत दरें निकालें और मांगी गई श्रेणी की दर चुनें",
      "ਤਿੰਨਾਂ ਸਮੂਹ-ਦਰ ਸਥਿਤੀਆਂ ਨੂੰ ਇਕੱਠੇ ਹੱਲ ਕਰਕੇ ਤਿੰਨਾਂ ਵਿਅਕਤੀਗਤ ਦਰਾਂ ਕੱਢੋ ਅਤੇ ਮੰਗੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦੀ ਦਰ ਚੁਣੋ");
    case "findHeterogeneousGroupRate": return t(language,
      "Multiply each category's count by its individual rate and add the contributions",
      "हर श्रेणी की संख्या को उसकी व्यक्तिगत दर से गुणा करें और सभी योगदान जोड़ें",
      "ਹਰ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਨੂੰ ਉਸ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ਨਾਲ ਗੁਣਾ ਕਰੋ ਅਤੇ ਸਾਰੇ ਯੋਗਦਾਨ ਜੋੜੋ");
    case "findCompletionAfterCategoryReplacement": return t(language,
      "Use the original crew to recover total work, then divide that work by the replacement crew's rate",
      "मूल समूह की दर से कुल काम निकालें, फिर उसी काम को बदले हुए समूह की दर से भाग दें",
      "ਮੂਲ ਸਮੂਹ ਦੀ ਦਰ ਤੋਂ ਕੁੱਲ ਕੰਮ ਕੱਢੋ, ਫਿਰ ਉਸੇ ਕੰਮ ਨੂੰ ਬਦਲੇ ਹੋਏ ਸਮੂਹ ਦੀ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ");
    case "findMixedCrewOutput": return t(language,
      "Find the mixed crew's total rate and multiply it by the stated working time",
      "मिश्रित समूह की कुल दर निकालें और उसे दिए गए कार्य-समय से गुणा करें",
      "ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਦੀ ਕੁੱਲ ਦਰ ਕੱਢੋ ਅਤੇ ਇਸ ਨੂੰ ਦਿੱਤੇ ਕੰਮ-ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰੋ");
    case "findEquivalentStandardResourceTime": return t(language,
      "Convert the crew's total contribution over the stated time into equivalent units of the chosen standard resource",
      "दिए गए समय में पूरे समूह के कुल योगदान को चुने गए मानक सदस्य के समतुल्य संसाधन-समय में बदलें",
      "ਦਿੱਤੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰੇ ਸਮੂਹ ਦੇ ਕੁੱਲ ਯੋਗਦਾਨ ਨੂੰ ਚੁਣੇ ਮਿਆਰੀ ਮੈਂਬਰ ਦੇ ਸਮਤੁੱਲ ਸਰੋਤ-ਸਮੇਂ ਵਿੱਚ ਬਦਲੋ");
    case "findMinimumIntegerCrewComposition": return t(language,
      "Check positive integer pairs in increasing total crew size and stop at the first pair that exactly matches the target rate",
      "धनात्मक पूर्णांक जोड़ियों को कुल सदस्यों की बढ़ती संख्या में जांचें और लक्ष्य दर से ठीक मेल खाने वाली पहली जोड़ी चुनें",
      "ਧਨਾਤਮਕ ਪੂਰਨ-ਅੰਕ ਜੋੜੀਆਂ ਨੂੰ ਕੁੱਲ ਮੈਂਬਰਾਂ ਦੀ ਵਧਦੀ ਗਿਣਤੀ ਵਿੱਚ ਜਾਂਚੋ ਅਤੇ ਟੀਚੇ ਦੀ ਦਰ ਨਾਲ ਠੀਕ ਮਿਲਣ ਵਾਲੀ ਪਹਿਲੀ ਜੋੜੀ ਚੁਣੋ");
    case "findUnknownCategorySoloTime": return t(language,
      "Convert the combined completion time to a crew rate, subtract known-category contributions, then invert the target member's rate",
      "संयुक्त समय को समूह-दर में बदलें, ज्ञात श्रेणियों का योगदान घटाएं और मांगी गई श्रेणी की प्रति-सदस्य दर का व्युत्क्रम लें",
      "ਸਾਂਝੇ ਸਮੇਂ ਨੂੰ ਸਮੂਹ-ਦਰ ਵਿੱਚ ਬਦਲੋ, ਜਾਣੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦਾ ਯੋਗਦਾਨ ਘਟਾਓ ਅਤੇ ਮੰਗੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦੀ ਪ੍ਰਤੀ-ਮੈਂਬਰ ਦਰ ਦਾ ਉਲਟ ਲਵੋ");
    case "findCategoryContributionFraction": return t(language,
      "Divide the target category's weighted contribution by the total contribution of the whole crew",
      "मांगी गई श्रेणी के भारित योगदान को पूरे समूह के कुल योगदान से भाग दें",
      "ਮੰਗੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦੇ ਭਾਰਿਤ ਯੋਗਦਾਨ ਨੂੰ ਪੂਰੇ ਸਮੂਹ ਦੇ ਕੁੱਲ ਯੋਗਦਾਨ ਨਾਲ ਭਾਗ ਦਿਓ");
    case "compareTwoHeterogeneousCrews": return t(language,
      "Find each crew's weighted total rate separately and then form their ratio in the requested order",
      "दोनों समूहों की भारित कुल दर अलग-अलग निकालें और फिर मांगे गए क्रम में उनका अनुपात बनाएं",
      "ਦੋਵੇਂ ਸਮੂਹਾਂ ਦੀ ਭਾਰਿਤ ਕੁੱਲ ਦਰ ਵੱਖ-ਵੱਖ ਕੱਢੋ ਅਤੇ ਫਿਰ ਮੰਗੇ ਕ੍ਰਮ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦਾ ਅਨੁਪਾਤ ਬਣਾਓ");
    case "findIntegerCrewCompositionUnderConstraints": return t(language,
      "Start from the total headcount at the lower rate; each replacement by the higher-rate category adds a fixed amount, which reveals both counts",
      "कुल सदस्यों को पहले कम दर वाली श्रेणी मानें; हर सदस्य को अधिक दर वाली श्रेणी से बदलने पर जितनी दर बढ़ती है, उससे दोनों संख्याएं निकालें",
      "ਕੁੱਲ ਮੈਂਬਰਾਂ ਨੂੰ ਪਹਿਲਾਂ ਘੱਟ ਦਰ ਵਾਲੀ ਸ਼੍ਰੇਣੀ ਮੰਨੋ; ਹਰ ਮੈਂਬਰ ਨੂੰ ਵੱਧ ਦਰ ਵਾਲੀ ਸ਼੍ਰੇਣੀ ਨਾਲ ਬਦਲਣ ਤੇ ਜਿੰਨੀ ਦਰ ਵਧਦੀ ਹੈ, ਉਸ ਤੋਂ ਦੋਵੇਂ ਗਿਣਤੀਆਂ ਕੱਢੋ");
    default: return t(language, "Use weighted category rates to solve the required quantity", "श्रेणीवार भारित दरों से मांगी गई राशि निकालें", "ਸ਼੍ਰੇਣੀਵਾਰ ਭਾਰਿਤ ਦਰਾਂ ਨਾਲ ਮੰਗੀ ਮਾਤਰਾ ਕੱਢੋ");
  }
}

function answerLine(question: Cp007Question, language: Language): string {
  const answer = fixNumberAgreement(question.solution?.answerText ?? "", language);
  return t(language, `Therefore, the answer is ${answer}.`, `अतः उत्तर है: ${answer}।`, `ਇਸ ਲਈ ਉੱਤਰ ਹੈ: ${answer}।`);
}

function workingFor(question: Cp007Question, language: Language): string[] {
  const p = question.parameters;
  const s = question.solution;
  const mode = question.solveMode ?? "";
  if (!p || !s) return [];
  const a = s.answerValues;

  switch (mode) {
    case "findTwoCategoryEfficiencyRatio": {
      const source = p.sourceCategoryIndex ?? 0;
      const replacement = p.replacementCategoryIndex ?? 1;
      const sourceCount = p.crewA[source];
      const replacementCount = p.crewB[replacement];
      return [step(t(language, "Individual-rate ratio is the inverse count ratio", "व्यक्तिगत दरों का अनुपात सदस्यों की संख्या के अनुपात का उलटा है", "ਵਿਅਕਤੀਗਤ ਦਰਾਂ ਦਾ ਅਨੁਪਾਤ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਦੇ ਅਨੁਪਾਤ ਦਾ ਉਲਟ ਹੈ"), `${toLatex(replacementCount)}:${toLatex(sourceCount)}=${toLatex(a[0])}:${toLatex(a[1])}`)];
    }
    case "findThreeCategoryEfficiencyRatio": return [
      step(t(language, "First equivalence gives the first-to-second rate ratio", "पहला समतुल्यता संबंध पहली और दूसरी श्रेणी की दरों का अनुपात देता है", "ਪਹਿਲਾ ਸਮਤੁਲਤਾ ਸੰਬੰਧ ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਦੀਆਂ ਦਰਾਂ ਦਾ ਅਨੁਪਾਤ ਦਿੰਦਾ ਹੈ"), `${toLatex(a[0])}:${toLatex(a[1])}`),
      step(t(language, "Second equivalence gives the second-to-third rate ratio", "दूसरा समतुल्यता संबंध दूसरी और तीसरी श्रेणी की दरों का अनुपात देता है", "ਦੂਜਾ ਸਮਤੁਲਤਾ ਸੰਬੰਧ ਦੂਜੀ ਅਤੇ ਤੀਜੀ ਸ਼੍ਰੇਣੀ ਦੀਆਂ ਦਰਾਂ ਦਾ ਅਨੁਪਾਤ ਦਿੰਦਾ ਹੈ"), `${toLatex(a[1])}:${toLatex(a[2])}`),
      step(t(language, "Combining the common middle category", "समान बीच वाली श्रेणी को मिलाने पर", "ਸਾਂਝੀ ਵਿਚਕਾਰਲੀ ਸ਼੍ਰੇਣੀ ਨੂੰ ਮਿਲਾਉਣ ਤੇ"), `${toLatex(a[0])}:${toLatex(a[1])}:${toLatex(a[2])}`),
    ];
    case "findMixedCrewCompletionTime": {
      const rate = crewRate(p, p.crewA);
      return [
        step(t(language, "Crew rate", "समूह की कुल दर", "ਸਮੂਹ ਦੀ ਕੁੱਲ ਦਰ"), `${crewTerms(p, p.crewA)}=${toLatex(rate)}`),
        step(t(language, "Completion time = total work ÷ crew rate", "पूरा होने का समय = कुल काम ÷ समूह की दर", "ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ = ਕੁੱਲ ਕੰਮ ÷ ਸਮੂਹ ਦੀ ਦਰ"), `\frac{${toLatex(p.workA)}}{${toLatex(rate)}}=${toLatex(a[0])}`),
      ];
    }
    case "findEquivalentCategoryCount": {
      const source = p.sourceCategoryIndex ?? 0;
      const target = p.replacementCategoryIndex ?? 1;
      const capacity = multiply(p.crewA[source], p.context.categories[source].efficiency);
      return [
        step(t(language, "Source-group capacity", "मूल समूह की क्षमता", "ਮੂਲ ਸਮੂਹ ਦੀ ਸਮਰੱਥਾ"), `${toLatex(p.crewA[source])}\times${toLatex(p.context.categories[source].efficiency)}=${toLatex(capacity)}`),
        step(t(language, "Equivalent target count", "समतुल्य मांगी गई संख्या", "ਸਮਤੁੱਲ ਮੰਗੀ ਗਿਣਤੀ"), `\frac{${toLatex(capacity)}}{${toLatex(p.context.categories[target].efficiency)}}=${toLatex(a[0])}`),
      ];
    }
    case "findUnknownCategoryCountForTargetTime": {
      const required = divide(p.workA, p.daysA);
      const known = crewRate(p, p.crewA);
      const missing = subtract(required, known);
      const target = p.targetCategoryIndex ?? 2;
      return [
        step(t(language, "Rate required by the deadline", "समय-सीमा के लिए आवश्यक कुल दर", "ਸਮਾਂ-ਸੀਮਾ ਲਈ ਲੋੜੀਂਦੀ ਕੁੱਲ ਦਰ"), `\frac{${toLatex(p.workA)}}{${toLatex(p.daysA)}}=${toLatex(required)}`),
        step(t(language, "Current crew rate", "वर्तमान समूह की दर", "ਮੌਜੂਦਾ ਸਮੂਹ ਦੀ ਦਰ"), `${crewTerms(p, p.crewA)}=${toLatex(known)}`),
        step(t(language, "Rate still missing", "अभी भी आवश्यक अतिरिक्त दर", "ਹਾਲੇ ਵੀ ਲੋੜੀਂਦੀ ਵਾਧੂ ਦਰ"), `${toLatex(required)}-${toLatex(known)}=${toLatex(missing)}`),
        step(t(language, "Extra resources required", "आवश्यक अतिरिक्त सदस्य", "ਲੋੜੀਂਦੇ ਵਾਧੂ ਮੈਂਬਰ"), `\frac{${toLatex(missing)}}{${toLatex(p.context.categories[target].efficiency)}}=${toLatex(a[0])}`),
      ];
    }
    case "findCrewCompositionFromTwoOutputFacts": {
      const firstRate = divide(p.workA, p.daysA);
      const secondRate = divide(p.workB, p.daysB);
      const increase = subtract(secondRate, firstRate);
      const first = p.targetCategoryIndex ?? 0;
      const second = p.replacementCategoryIndex ?? 1;
      const secondCount = divide(subtract(firstRate, multiply(a[0], p.context.categories[first].efficiency)), p.context.categories[second].efficiency);
      return [
        step(t(language, "First recorded crew rate", "पहली स्थिति की समूह-दर", "ਪਹਿਲੀ ਸਥਿਤੀ ਦੀ ਸਮੂਹ-ਦਰ"), `\frac{${toLatex(p.workA)}}{${toLatex(p.daysA)}}=${toLatex(firstRate)}`),
        step(t(language, "Second recorded crew rate", "दूसरी स्थिति की समूह-दर", "ਦੂਜੀ ਸਥਿਤੀ ਦੀ ਸਮੂਹ-ਦਰ"), `\frac{${toLatex(p.workB)}}{${toLatex(p.daysB)}}=${toLatex(secondRate)}`),
        step(t(language, "Extra rate created by doubling the first category", "पहली श्रेणी को दोगुना करने से बढ़ी दर", "ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਨੂੰ ਦੁੱਗਣਾ ਕਰਨ ਨਾਲ ਵਧੀ ਦਰ"), `${toLatex(secondRate)}-${toLatex(firstRate)}=${toLatex(increase)}`),
        step(t(language, "Recovered counts", "दोनों श्रेणियों की प्राप्त संख्याएं", "ਦੋਵੇਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀਆਂ ਮਿਲੀਆਂ ਗਿਣਤੀਆਂ"), `${toLatex(a[0])},\ ${toLatex(secondCount)}`),
      ];
    }
    case "findCategoryRateFromWeightedCrewFacts": {
      const rates = p.context.categories.map((category) => category.efficiency);
      const records = (p.pairwiseCrews ?? []).slice(0, 3).map((crew, index) => {
        const total = p.pairwiseRates?.[index] ?? crewRate(p, crew);
        return step(t(language, `Check record ${index + 1}`, `स्थिति ${index + 1} की जांच`, `ਸਥਿਤੀ ${index + 1} ਦੀ ਜਾਂਚ`), `${crewTerms(p, crew)}=${toLatex(total)}`);
      });
      return [
        step(t(language, "Solving the three crew records gives the individual rates", "तीनों समूह-दर स्थितियों को हल करने पर व्यक्तिगत दरें मिलती हैं", "ਤਿੰਨਾਂ ਸਮੂਹ-ਦਰ ਸਥਿਤੀਆਂ ਨੂੰ ਹੱਲ ਕਰਨ ਤੇ ਵਿਅਕਤੀਗਤ ਦਰਾਂ ਮਿਲਦੀਆਂ ਹਨ"), `${rates.map(toLatex).join(",\ ")}`),
        ...records.slice(0, 3),
      ];
    }
    case "findHeterogeneousGroupRate": {
      const rate = crewRate(p, p.crewA);
      return [step(t(language, "Combined group rate", "समूह की संयुक्त दर", "ਸਮੂਹ ਦੀ ਸਾਂਝੀ ਦਰ"), `${crewTerms(p, p.crewA)}=${toLatex(rate)}`)];
    }
    case "findCompletionAfterCategoryReplacement": {
      const oldRate = crewRate(p, p.crewA);
      const work = multiply(oldRate, p.daysA);
      const newRate = crewRate(p, p.crewB);
      return [
        step(t(language, "Original crew rate", "मूल समूह की दर", "ਮੂਲ ਸਮੂਹ ਦੀ ਦਰ"), `${crewTerms(p, p.crewA)}=${toLatex(oldRate)}`),
        step(t(language, "Total work", "कुल काम", "ਕੁੱਲ ਕੰਮ"), `${toLatex(oldRate)}\times${toLatex(p.daysA)}=${toLatex(work)}`),
        step(t(language, "Replacement crew rate", "बदले हुए समूह की दर", "ਬਦਲੇ ਹੋਏ ਸਮੂਹ ਦੀ ਦਰ"), `${crewTerms(p, p.crewB)}=${toLatex(newRate)}`),
        step(t(language, "New completion time", "नया पूरा होने का समय", "ਨਵਾਂ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ"), `\frac{${toLatex(work)}}{${toLatex(newRate)}}=${toLatex(a[0])}`),
      ];
    }
    case "findMixedCrewOutput": {
      const rate = crewRate(p, p.crewA);
      const output = multiply(rate, p.daysA);
      return [
        step(t(language, "Combined group rate", "समूह की संयुक्त दर", "ਸਮੂਹ ਦੀ ਸਾਂਝੀ ਦਰ"), `${crewTerms(p, p.crewA)}=${toLatex(rate)}`),
        step(t(language, "Total output", "कुल उत्पादन", "ਕੁੱਲ ਉਤਪਾਦਨ"), `${toLatex(rate)}\times${toLatex(p.daysA)}=${toLatex(output)}`),
      ];
    }
    case "findEquivalentStandardResourceTime": {
      const rate = crewRate(p, p.crewA);
      const contribution = multiply(rate, p.daysA);
      const target = p.targetCategoryIndex ?? 0;
      return [
        step(t(language, "Crew rate in common efficiency units", "समान दक्षता इकाइयों में समूह की दर", "ਸਾਂਝੀਆਂ ਦੱਖਤਾ ਇਕਾਈਆਂ ਵਿੱਚ ਸਮੂਹ ਦੀ ਦਰ"), `${crewTerms(p, p.crewA)}=${toLatex(rate)}`),
        step(t(language, "Total contribution over the stated time", "दिए समय में कुल योगदान", "ਦਿੱਤੇ ਸਮੇਂ ਵਿੱਚ ਕੁੱਲ ਯੋਗਦਾਨ"), `${toLatex(rate)}\times${toLatex(p.daysA)}=${toLatex(contribution)}`),
        step(t(language, "Equivalent standard-resource time", "समतुल्य मानक-संसाधन समय", "ਸਮਤੁੱਲ ਮਿਆਰੀ-ਸਰੋਤ ਸਮਾਂ"), `\frac{${toLatex(contribution)}}{${toLatex(p.context.categories[target].efficiency)}}=${toLatex(a[0])}`),
      ];
    }
    case "findMinimumIntegerCrewComposition": {
      const first = p.targetCategoryIndex ?? 0;
      const second = p.replacementCategoryIndex ?? 1;
      const totalCount = add(a[0], a[1]);
      return [
        step(t(language, "Target combined rate", "लक्ष्य संयुक्त दर", "ਟੀਚੇ ਦੀ ਸਾਂਝੀ ਦਰ"), `${toLatex(p.targetCrewRate ?? { numerator: 0, denominator: 1 })}`),
        step(t(language, "First positive integer combination that reaches it exactly", "इसे ठीक प्राप्त करने वाली पहली धनात्मक पूर्णांक जोड़ी", "ਇਸ ਨੂੰ ਠੀਕ ਪ੍ਰਾਪਤ ਕਰਨ ਵਾਲੀ ਪਹਿਲੀ ਧਨਾਤਮਕ ਪੂਰਨ-ਅੰਕ ਜੋੜੀ"), `${toLatex(a[0])}\times${toLatex(p.context.categories[first].efficiency)}+${toLatex(a[1])}\times${toLatex(p.context.categories[second].efficiency)}=${toLatex(p.targetCrewRate ?? { numerator: 0, denominator: 1 })}`),
        step(t(language, "Minimum total crew size", "न्यूनतम कुल सदस्य", "ਘੱਟੋ-ਘੱਟ ਕੁੱਲ ਮੈਂਬਰ"), `${toLatex(a[0])}+${toLatex(a[1])}=${toLatex(totalCount)}`),
      ];
    }
    case "findUnknownCategorySoloTime": {
      const target = p.targetCategoryIndex ?? 1;
      const combinedRate = divide(p.workA, p.daysA);
      const known = p.crewA.reduce((sum, count, index) => index === target ? sum : add(sum, multiply(count, p.context.categories[index].efficiency)), { numerator: 0, denominator: 1 });
      const targetGroupRate = subtract(combinedRate, known);
      const perTarget = divide(targetGroupRate, p.crewA[target]);
      return [
        step(t(language, "Combined crew rate", "संयुक्त समूह-दर", "ਸਾਂਝੀ ਸਮੂਹ-ਦਰ"), `\frac{${toLatex(p.workA)}}{${toLatex(p.daysA)}}=${toLatex(combinedRate)}`),
        step(t(language, "Contribution of the known categories", "ज्ञात श्रेणियों का योगदान", "ਜਾਣੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦਾ ਯੋਗਦਾਨ"), `${toLatex(known)}`),
        step(t(language, "Per-member rate of the target category", "मांगी गई श्रेणी की प्रति-सदस्य दर", "ਮੰਗੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦੀ ਪ੍ਰਤੀ-ਮੈਂਬਰ ਦਰ"), `\frac{${toLatex(targetGroupRate)}}{${toLatex(p.crewA[target])}}=${toLatex(perTarget)}`),
        step(t(language, "Solo time is the reciprocal of that rate", "अकेले लगने वाला समय उस दर का व्युत्क्रम है", "ਇਕੱਲੇ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ ਉਸ ਦਰ ਦਾ ਉਲਟ ਹੈ"), `${toLatex(reciprocal(perTarget))}`),
      ];
    }
    case "findCategoryContributionFraction": {
      const target = p.targetCategoryIndex ?? 0;
      const contribution = multiply(p.crewA[target], p.context.categories[target].efficiency);
      const total = crewRate(p, p.crewA);
      const fraction = divide(contribution, total);
      return [
        step(t(language, "Target category contribution", "मांगी गई श्रेणी का योगदान", "ਮੰਗੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦਾ ਯੋਗਦਾਨ"), `${toLatex(p.crewA[target])}\times${toLatex(p.context.categories[target].efficiency)}=${toLatex(contribution)}`),
        step(t(language, "Total crew contribution", "पूरे समूह का कुल योगदान", "ਪੂਰੇ ਸਮੂਹ ਦਾ ਕੁੱਲ ਯੋਗਦਾਨ"), `${crewTerms(p, p.crewA)}=${toLatex(total)}`),
        step(t(language, "Required fraction", "आवश्यक भाग", "ਲੋੜੀਂਦਾ ਹਿੱਸਾ"), `\frac{${toLatex(contribution)}}{${toLatex(total)}}=${toLatex(fraction)}`),
      ];
    }
    case "compareTwoHeterogeneousCrews": {
      const rateA = crewRate(p, p.crewA);
      const rateB = crewRate(p, p.crewB);
      return [
        step(t(language, "Group A rate", "समूह A की दर", "ਸਮੂਹ A ਦੀ ਦਰ"), `${crewTerms(p, p.crewA)}=${toLatex(rateA)}`),
        step(t(language, "Group B rate", "समूह B की दर", "ਸਮੂਹ B ਦੀ ਦਰ"), `${crewTerms(p, p.crewB)}=${toLatex(rateB)}`),
        step(t(language, "Rate ratio A:B", "दर अनुपात A:B", "ਦਰ ਅਨੁਪਾਤ A:B"), `${toLatex(rateA)}:${toLatex(rateB)}=${toLatex(a[0])}:${toLatex(a[1])}`),
      ];
    }
    case "findIntegerCrewCompositionUnderConstraints": {
      const first = p.targetCategoryIndex ?? 0;
      const second = p.replacementCategoryIndex ?? 1;
      const totalCount = p.totalCrewCount ?? add(a[0], a[1]);
      const targetRate = p.targetCrewRate ?? crewRate(p, p.crewA);
      const lowBaseline = multiply(totalCount, p.context.categories[second].efficiency);
      const extraNeeded = subtract(targetRate, lowBaseline);
      const gainPerReplacement = subtract(p.context.categories[first].efficiency, p.context.categories[second].efficiency);
      const firstCount = divide(extraNeeded, gainPerReplacement);
      const secondCount = subtract(totalCount, firstCount);
      return [
        step(t(language, "Rate if all members were from the lower-rate category", "यदि सभी सदस्य कम दर वाली श्रेणी के हों तो कुल दर", "ਜੇ ਸਾਰੇ ਮੈਂਬਰ ਘੱਟ ਦਰ ਵਾਲੀ ਸ਼੍ਰੇਣੀ ਦੇ ਹੋਣ ਤਾਂ ਕੁੱਲ ਦਰ"), `${toLatex(totalCount)}\times${toLatex(p.context.categories[second].efficiency)}=${toLatex(lowBaseline)}`),
        step(t(language, "Extra rate needed to reach the target", "लक्ष्य तक पहुंचने के लिए अतिरिक्त दर", "ਟੀਚੇ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਵਾਧੂ ਦਰ"), `${toLatex(targetRate)}-${toLatex(lowBaseline)}=${toLatex(extraNeeded)}`),
        step(t(language, "Each replacement adds", "हर एक बदलाव से दर बढ़ती है", "ਹਰ ਇੱਕ ਬਦਲਾਅ ਨਾਲ ਦਰ ਵਧਦੀ ਹੈ"), `${toLatex(p.context.categories[first].efficiency)}-${toLatex(p.context.categories[second].efficiency)}=${toLatex(gainPerReplacement)}`),
        step(t(language, "Required counts", "आवश्यक दोनों संख्याएं", "ਲੋੜੀਂਦੀਆਂ ਦੋਵੇਂ ਗਿਣਤੀਆਂ"), `${toLatex(firstCount)},\ ${toLatex(secondCount)}`),
      ];
    }
    default: return [];
  }
}

export function applyTmwCp007MultilingualEditorialReview<T extends Cp007Question>(
  question: T,
  qlId: string,
  language: Language,
): T {
  if ((question.canonicalProblemId ?? question.cpId) !== "TMW-CP-007" || !question.learnerExplanation) return question;

  const stem = fixStem(question.stem ?? "", qlId, language);
  const solution = question.solution
    ? { ...question.solution, answerText: fixNumberAgreement(question.solution.answerText, language) }
    : question.solution;
  const options = question.options?.map((option) => fixNumberAgreement(option, language));
  const optionAudit = question.optionAudit?.map((option) => ({ ...option, text: fixNumberAgreement(option.text, language) }));
  const working = workingFor({ ...question, solution }, language);
  const answer = answerLine({ ...question, solution }, language);
  const learnerExplanation: TmwLearnerExplanationV2 = {
    ...question.learnerExplanation,
    method: methodFor(question.solveMode ?? "", language),
    solution: [...working, answer].slice(0, 5),
    answer,
  };
  const learnerErrors = validateTmwLearnerExplanationV2(learnerExplanation);
  const learnerText = [learnerExplanation.method, ...learnerExplanation.solution, learnerExplanation.answer].join(" ");
  const editorialErrors: string[] = [];
  if (working.length < 1) editorialErrors.push("CP007 multilingual editorial review: no worked explanation was rendered");
  if (/\\text\{|\bsource capacity\b|\btarget contribution\b|\btotal contribution\b|\bleast feasible\b|\bcomponents per\b|\bcopies per\b|(?:^|[^A-Za-z])(?:R_\d|e_[A-Za-z]|r_[A-Za-z]|n_[A-Za-z]|T_[A-Za-z]|xe|ye)(?:[^A-Za-z]|$)/i.test(learnerText)) {
    editorialErrors.push("CP007 multilingual editorial review: internal solver notation or English trace remains");
  }

  return {
    ...question,
    stem,
    solution,
    options,
    optionAudit,
    learnerExplanation,
    validation: {
      valid: Boolean(question.validation?.valid) && learnerErrors.length === 0 && editorialErrors.length === 0,
      errors: [
        ...(question.validation?.errors ?? []),
        ...learnerErrors.map((error) => `CP007 multilingual editorial review: ${error}`),
        ...editorialErrors,
      ],
    },
    publiclyPublishable: false,
  };
}
