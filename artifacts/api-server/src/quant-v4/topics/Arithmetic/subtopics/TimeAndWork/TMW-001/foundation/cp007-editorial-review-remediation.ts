import type {
  TmwCp007GeneratedQuestion,
  TmwCp007LearningShortcut,
  TmwCp007MisconceptionId,
  TmwCp007SolveMode,
} from "./cp007-types";
import { cp007Copy } from "./localization-cp007-language";
import type { TmwLocalizedLanguage } from "./localization-types";

interface TmwCp007LocalizedEditorialFields {
  stem: string;
  opening: string;
  givens: string[];
  workedSteps: string[];
  shortcut: TmwCp007LearningShortcut;
  trapExplanation: string;
  conclusion: string;
}

function pair(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function clean(text: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return text
      .replace(/प्रति-संसाधन दक्षता/g, "एक सदस्य की काम-दर")
      .replace(/प्रति-संसाधन दर/g, "एक सदस्य की काम-दर")
      .replace(/सक्रिय श्रेणियों/g, "काम कर रही श्रेणियों")
      .replace(/सक्रिय श्रेणी/g, "काम कर रही श्रेणी")
      .replace(/केवल सिरों की संख्या/g, "केवल सदस्यों की संख्या")
      .replace(/भारित दरों/g, "कुल काम-दरों")
      .replace(/भारित दर/g, "कुल काम-दर")
      .replace(/भारित योगदान/g, "कुल काम")
      .replace(/अभिलेख/g, "स्थिति");
  }
  return text
    .replace(/ਪ੍ਰਤੀ-ਸਰੋਤ ਦੱਖਤਾ/g, "ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ")
    .replace(/ਪ੍ਰਤੀ-ਸਰੋਤ ਦਰ/g, "ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ")
    .replace(/ਸਰਗਰਮ ਸ਼੍ਰੇਣੀਆਂ/g, "ਕੰਮ ਕਰ ਰਹੀਆਂ ਸ਼੍ਰੇਣੀਆਂ")
    .replace(/ਸਰਗਰਮ ਸ਼੍ਰੇਣੀ/g, "ਕੰਮ ਕਰ ਰਹੀ ਸ਼੍ਰੇਣੀ")
    .replace(/ਸਿਰਫ਼ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ/g, "ਕੇਵਲ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ")
    .replace(/ਭਾਰਿਤ ਦਰਾਂ/g, "ਕੁੱਲ ਕੰਮ-ਦਰਾਂ")
    .replace(/ਭਾਰਿਤ ਦਰ/g, "ਕੁੱਲ ਕੰਮ-ਦਰ")
    .replace(/ਭਾਰਿਤ ਯੋਗਦਾਨ/g, "ਕੁੱਲ ਕੰਮ")
    .replace(/ਅਭਿਲੇਖ|ਰਿਕਾਰਡ/g, "ਸਥਿਤੀ");
}

const OPENINGS: Record<TmwCp007SolveMode, readonly [string, string]> = {
  findTwoCategoryEfficiencyRatio: [
    "दोनों समूह समान काम समान समय में करते हैं, इसलिए उनकी कुल काम-दर बराबर होगी। एक सदस्य की दक्षता का अनुपात सदस्यों की संख्या के अनुपात का उलटा लें।",
    "ਦੋਵੇਂ ਸਮੂਹ ਇੱਕੋ ਕੰਮ ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੀ ਕੁੱਲ ਕੰਮ-ਦਰ ਬਰਾਬਰ ਹੋਵੇਗੀ। ਇੱਕ ਮੈਂਬਰ ਦੀ ਦੱਖਤਾ ਦਾ ਅਨੁਪਾਤ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਦੇ ਅਨੁਪਾਤ ਦਾ ਉਲਟ ਲਵੋ।",
  ],
  findThreeCategoryEfficiencyRatio: [
    "पहले दोनों जोड़ी-संबंधों से दक्षता अनुपात निकालें। फिर सामान्य श्रेणी का मान बराबर करके तीनों श्रेणियों का एक संयुक्त अनुपात लिखें।",
    "ਪਹਿਲਾਂ ਦੋਵੇਂ ਜੋੜੀ-ਸੰਬੰਧਾਂ ਤੋਂ ਦੱਖਤਾ ਅਨੁਪਾਤ ਕੱਢੋ। ਫਿਰ ਸਾਂਝੀ ਸ਼੍ਰੇਣੀ ਦਾ ਮੁੱਲ ਬਰਾਬਰ ਕਰਕੇ ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦਾ ਇੱਕ ਸਾਂਝਾ ਅਨੁਪਾਤ ਲਿਖੋ।",
  ],
  findMixedCrewCompletionTime: [
    "हर श्रेणी के सदस्यों की संख्या को उस श्रेणी के एक सदस्य की काम-दर से गुणा करें। सभी योगदान जोड़कर समूह की प्रतिदिन की दर निकालें और कुल काम को उससे भाग दें।",
    "ਹਰ ਸ਼੍ਰੇਣੀ ਦੇ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਉਸ ਸ਼੍ਰੇਣੀ ਦੇ ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ ਨਾਲ ਗੁਣਾ ਕਰੋ। ਸਾਰੇ ਯੋਗਦਾਨ ਜੋੜ ਕੇ ਸਮੂਹ ਦੀ ਹਰ ਦਿਨ ਦੀ ਦਰ ਕੱਢੋ ਅਤੇ ਕੁੱਲ ਕੰਮ ਨੂੰ ਇਸ ਨਾਲ ਭਾਗ ਦਿਓ।",
  ],
  findEquivalentCategoryCount: [
    "पहले दिए गए समूह की कुल काम-दर निकालें। उतनी ही क्षमता पाने के लिए उसे माँगी गई श्रेणी के एक सदस्य की काम-दर से भाग दें।",
    "ਪਹਿਲਾਂ ਦਿੱਤੇ ਸਮੂਹ ਦੀ ਕੁੱਲ ਕੰਮ-ਦਰ ਕੱਢੋ। ਉੱਨੀ ਹੀ ਸਮਰੱਥਾ ਲਈ ਇਸ ਨੂੰ ਮੰਗੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦੇ ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ।",
  ],
  findUnknownCategoryCountForTargetTime: [
    "लक्ष्य काम को उपलब्ध समय से भाग देकर आवश्यक कुल दर निकालें। ज्ञात समूह की दर घटाएँ और बची दर को जोड़ी जाने वाली श्रेणी की एक इकाई की दर से भाग दें।",
    "ਟੀਚੇ ਦੇ ਕੰਮ ਨੂੰ ਮਿਲੇ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਲੋੜੀਂਦੀ ਕੁੱਲ ਦਰ ਕੱਢੋ। ਜਾਣੇ ਸਮੂਹ ਦੀ ਦਰ ਘਟਾਓ ਅਤੇ ਬਚੀ ਦਰ ਨੂੰ ਜੋੜੀ ਜਾਣ ਵਾਲੀ ਸ਼੍ਰੇਣੀ ਦੀ ਇੱਕ ਇਕਾਈ ਦੀ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ।",
  ],
  findCrewCompositionFromTwoOutputFacts: [
    "दोनों श्रेणियों की संख्याएँ अज्ञात मानें। प्रत्येक काम की कुल दर से एक समीकरण बनाएँ; दूसरी स्थिति में बदली संख्या को सही रूप में रखकर दोनों समीकरण हल करें।",
    "ਦੋਵਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਅਣਜਾਣ ਮੰਨੋ। ਹਰ ਕੰਮ ਦੀ ਕੁੱਲ ਦਰ ਤੋਂ ਇੱਕ ਸਮੀਕਰਨ ਬਣਾਓ; ਦੂਜੀ ਸਥਿਤੀ ਵਿੱਚ ਬਦਲੀ ਗਿਣਤੀ ਸਹੀ ਰੱਖ ਕੇ ਦੋਵੇਂ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।",
  ],
  findCategoryRateFromWeightedCrewFacts: [
    "हर दी गई स्थिति में श्रेणीवार संख्या × एक इकाई की दर जोड़कर कुल दर का समीकरण बनाएँ। तीनों समीकरण साथ हल करके पूछी गई श्रेणी की दर चुनें।",
    "ਹਰ ਦਿੱਤੀ ਸਥਿਤੀ ਵਿੱਚ ਸ਼੍ਰੇਣੀਵਾਰ ਗਿਣਤੀ × ਇੱਕ ਇਕਾਈ ਦੀ ਦਰ ਜੋੜ ਕੇ ਕੁੱਲ ਦਰ ਦਾ ਸਮੀਕਰਨ ਬਣਾਓ। ਤਿੰਨੇ ਸਮੀਕਰਨ ਇਕੱਠੇ ਹੱਲ ਕਰਕੇ ਪੁੱਛੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦੀ ਦਰ ਚੁਣੋ।",
  ],
  findHeterogeneousGroupRate: [
    "हर श्रेणी का योगदान संख्या × एक सदस्य की काम-दर है। सभी श्रेणियों के योगदान जोड़ने पर पूरे समूह की काम-दर मिलेगी।",
    "ਹਰ ਸ਼੍ਰੇਣੀ ਦਾ ਯੋਗਦਾਨ ਗਿਣਤੀ × ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ ਹੈ। ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਯੋਗਦਾਨ ਜੋੜਨ ਨਾਲ ਪੂਰੇ ਸਮੂਹ ਦੀ ਕੰਮ-ਦਰ ਮਿਲੇਗੀ।",
  ],
  findCompletionAfterCategoryReplacement: [
    "पुराने और बदले समूह की कुल काम-दर अलग-अलग निकालें। काम समान है, इसलिए नया समय = पुराना समय × पुरानी दर ÷ नई दर।",
    "ਪੁਰਾਣੇ ਅਤੇ ਬਦਲੇ ਸਮੂਹ ਦੀ ਕੁੱਲ ਕੰਮ-ਦਰ ਵੱਖ-ਵੱਖ ਕੱਢੋ। ਕੰਮ ਇੱਕੋ ਹੈ, ਇਸ ਲਈ ਨਵਾਂ ਸਮਾਂ = ਪੁਰਾਣਾ ਸਮਾਂ × ਪੁਰਾਣੀ ਦਰ ÷ ਨਵੀਂ ਦਰ।",
  ],
  findMixedCrewOutput: [
    "पहले श्रेणीवार योगदान जोड़कर समूह की एक समय-इकाई की कुल दर निकालें। फिर इस दर को दिए गए समय से गुणा करें।",
    "ਪਹਿਲਾਂ ਸ਼੍ਰੇਣੀਵਾਰ ਯੋਗਦਾਨ ਜੋੜ ਕੇ ਸਮੂਹ ਦੀ ਇੱਕ ਸਮਾਂ-ਇਕਾਈ ਦੀ ਕੁੱਲ ਦਰ ਕੱਢੋ। ਫਿਰ ਇਸ ਦਰ ਨੂੰ ਦਿੱਤੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।",
  ],
  findEquivalentStandardResourceTime: [
    "हर श्रेणी के सदस्य-दिन को उसकी सापेक्ष काम-दर से गुणा करें। सभी योगदान जोड़कर उन्हें प्रश्न में माँगी गई मानक श्रेणी के समतुल्य संसाधन-समय में लिखें।",
    "ਹਰ ਸ਼੍ਰੇਣੀ ਦੇ ਮੈਂਬਰ-ਦਿਨਾਂ ਨੂੰ ਉਸ ਦੀ ਸਾਪੇਖ ਕੰਮ-ਦਰ ਨਾਲ ਗੁਣਾ ਕਰੋ। ਸਾਰੇ ਯੋਗਦਾਨ ਜੋੜ ਕੇ ਉਨ੍ਹਾਂ ਨੂੰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੀ ਮਿਆਰੀ ਸ਼੍ਰੇਣੀ ਦੇ ਬਰਾਬਰ ਸਰੋਤ-ਸਮੇਂ ਵਿੱਚ ਲਿਖੋ।",
  ],
  findMinimumIntegerCrewComposition: [
    "दोनों श्रेणियों की संख्याएँ धनात्मक पूर्णांक मानें और उनकी कुल दर को लक्ष्य दर के बराबर रखें। सभी सही जोड़ियों में सबसे कम कुल सदस्यों वाली जोड़ी चुनें।",
    "ਦੋਵਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਮੰਨੋ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਕੁੱਲ ਦਰ ਨੂੰ ਟੀਚੇ ਦੀ ਦਰ ਦੇ ਬਰਾਬਰ ਰੱਖੋ। ਸਾਰੀਆਂ ਸਹੀ ਜੋੜੀਆਂ ਵਿੱਚ ਸਭ ਤੋਂ ਘੱਟ ਕੁੱਲ ਮੈਂਬਰਾਂ ਵਾਲੀ ਜੋੜੀ ਚੁਣੋ।",
  ],
  findUnknownCategorySoloTime: [
    "मिश्रित समूह की दर उसके पूरे काम के समय से निकालें। ज्ञात सदस्य का योगदान घटाकर अज्ञात श्रेणी के एक सदस्य की दर निकालें और अकेले लगने वाले समय के लिए उसका उलटा लें।",
    "ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਦੀ ਦਰ ਉਸ ਦੇ ਪੂਰਾ ਕੰਮ ਕਰਨ ਦੇ ਸਮੇਂ ਤੋਂ ਕੱਢੋ। ਜਾਣੇ ਮੈਂਬਰ ਦਾ ਯੋਗਦਾਨ ਘਟਾ ਕੇ ਅਣਜਾਣ ਸ਼੍ਰੇਣੀ ਦੇ ਇੱਕ ਮੈਂਬਰ ਦੀ ਦਰ ਕੱਢੋ ਅਤੇ ਇਕੱਲੇ ਲੱਗਣ ਵਾਲੇ ਸਮੇਂ ਲਈ ਇਸ ਦਾ ਉਲਟ ਲਵੋ।",
  ],
  findCategoryContributionFraction: [
    "पूरे समूह में हर श्रेणी का योगदान संख्या × एक सदस्य की दर है। पूछी गई श्रेणी के योगदान को सभी श्रेणियों के कुल योगदान से भाग दें।",
    "ਪੂਰੇ ਸਮੂਹ ਵਿੱਚ ਹਰ ਸ਼੍ਰੇਣੀ ਦਾ ਯੋਗਦਾਨ ਗਿਣਤੀ × ਇੱਕ ਮੈਂਬਰ ਦੀ ਦਰ ਹੈ। ਪੁੱਛੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦੇ ਯੋਗਦਾਨ ਨੂੰ ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਕੁੱਲ ਯੋਗਦਾਨ ਨਾਲ ਭਾਗ ਦਿਓ।",
  ],
  compareTwoHeterogeneousCrews: [
    "दोनों समूहों की कुल काम-दर अलग-अलग निकालें: प्रत्येक श्रेणी की संख्या × उसकी एक सदस्य की दर जोड़ें। फिर समूह A और समूह B का अनुपात उसी क्रम में लिखें।",
    "ਦੋਵਾਂ ਸਮੂਹਾਂ ਦੀ ਕੁੱਲ ਕੰਮ-ਦਰ ਵੱਖ-ਵੱਖ ਕੱਢੋ: ਹਰ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ × ਉਸ ਦੇ ਇੱਕ ਮੈਂਬਰ ਦੀ ਦਰ ਜੋੜੋ। ਫਿਰ ਸਮੂਹ A ਅਤੇ ਸਮੂਹ B ਦਾ ਅਨੁਪਾਤ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖੋ।",
  ],
  findIntegerCrewCompositionUnderConstraints: [
    "पहली और दूसरी श्रेणी की संख्याएँ x और y मानें। कुल सदस्यों से x + y का समीकरण और कुल काम-दर से दूसरा समीकरण बनाकर दोनों हल करें।",
    "ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਦੀਆਂ ਗਿਣਤੀਆਂ x ਅਤੇ y ਮੰਨੋ। ਕੁੱਲ ਮੈਂਬਰਾਂ ਤੋਂ x + y ਦਾ ਸਮੀਕਰਨ ਅਤੇ ਕੁੱਲ ਕੰਮ-ਦਰ ਤੋਂ ਦੂਜਾ ਸਮੀਕਰਨ ਬਣਾਕੇ ਦੋਵੇਂ ਹੱਲ ਕਰੋ।",
  ],
};

function shortcut(
  mode: TmwCp007SolveMode,
  answerText: string,
  language: TmwLocalizedLanguage,
): TmwCp007LearningShortcut {
  const finish = pair(language, `अतः उत्तर ${answerText} है।`, `ਇਸ ਲਈ ਉੱਤਰ ${answerText} ਹੈ।`);
  const values: Record<TmwCp007SolveMode, readonly [string, string, string, string]> = {
    findTwoCategoryEfficiencyRatio: ["उलटा संख्या अनुपात", "ਉਲਟ ਗਿਣਤੀ ਅਨੁਪਾਤ", "दोनों कुल क्षमताएँ बराबर रखें और संख्या अनुपात को उलटें।", "ਦੋਵੇਂ ਕੁੱਲ ਸਮਰੱਥਾਵਾਂ ਬਰਾਬਰ ਰੱਖੋ ਅਤੇ ਗਿਣਤੀ ਅਨੁਪਾਤ ਨੂੰ ਉਲਟੋ।"],
    findThreeCategoryEfficiencyRatio: ["सामान्य श्रेणी बराबर करें", "ਸਾਂਝੀ ਸ਼੍ਰੇਣੀ ਬਰਾਬਰ ਕਰੋ", "दोनों जोड़ी-अनुपातों में सामान्य श्रेणी का मान समान करके तीन पद लिखें।", "ਦੋਵੇਂ ਜੋੜੀ-ਅਨੁਪਾਤਾਂ ਵਿੱਚ ਸਾਂਝੀ ਸ਼੍ਰੇਣੀ ਦਾ ਮੁੱਲ ਇੱਕੋ ਕਰਕੇ ਤਿੰਨ ਪਦ ਲਿਖੋ।"],
    findMixedCrewCompletionTime: ["कुल दर से समय", "ਕੁੱਲ ਦਰ ਤੋਂ ਸਮਾਂ", "श्रेणीवार संख्या × दर जोड़ें; फिर कुल काम ÷ समूह की दर करें।", "ਸ਼੍ਰੇਣੀਵਾਰ ਗਿਣਤੀ × ਦਰ ਜੋੜੋ; ਫਿਰ ਕੁੱਲ ਕੰਮ ÷ ਸਮੂਹ ਦੀ ਦਰ ਕਰੋ।"],
    findEquivalentCategoryCount: ["समान क्षमता रखें", "ਬਰਾਬਰ ਸਮਰੱਥਾ ਰੱਖੋ", "दिए समूह की कुल दर ÷ माँगी श्रेणी की एक इकाई की दर करें।", "ਦਿੱਤੇ ਸਮੂਹ ਦੀ ਕੁੱਲ ਦਰ ÷ ਮੰਗੀ ਸ਼੍ਰੇਣੀ ਦੀ ਇੱਕ ਇਕਾਈ ਦੀ ਦਰ ਕਰੋ।"],
    findUnknownCategoryCountForTargetTime: ["लक्ष्य दर की कमी", "ਟੀਚੇ ਦੀ ਦਰ ਦੀ ਘਾਟ", "काम ÷ समय से लक्ष्य दर निकालें, ज्ञात दर घटाएँ और बची दर को इकाई-दर से भाग दें।", "ਕੰਮ ÷ ਸਮੇਂ ਤੋਂ ਟੀਚੇ ਦੀ ਦਰ ਕੱਢੋ, ਜਾਣੀ ਦਰ ਘਟਾਓ ਅਤੇ ਬਚੀ ਦਰ ਨੂੰ ਇਕਾਈ-ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    findCrewCompositionFromTwoOutputFacts: ["दो दर समीकरण", "ਦੋ ਦਰ ਸਮੀਕਰਨ", "दोनों स्थितियों की काम-दर लिखकर बदली संख्या सहित समीकरण हल करें।", "ਦੋਵਾਂ ਸਥਿਤੀਆਂ ਦੀ ਕੰਮ-ਦਰ ਲਿਖ ਕੇ ਬਦਲੀ ਗਿਣਤੀ ਸਮੇਤ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।"],
    findCategoryRateFromWeightedCrewFacts: ["तीन स्थितियों के समीकरण", "ਤਿੰਨ ਸਥਿਤੀਆਂ ਦੇ ਸਮੀਕਰਨ", "हर स्थिति की श्रेणीवार दर जोड़कर तीन समीकरण साथ हल करें।", "ਹਰ ਸਥਿਤੀ ਦੀ ਸ਼੍ਰੇਣੀਵਾਰ ਦਰ ਜੋੜ ਕੇ ਤਿੰਨ ਸਮੀਕਰਨ ਇਕੱਠੇ ਹੱਲ ਕਰੋ।"],
    findHeterogeneousGroupRate: ["श्रेणीवार योगदान जोड़ें", "ਸ਼੍ਰੇਣੀਵਾਰ ਯੋਗਦਾਨ ਜੋੜੋ", "हर श्रेणी के लिए संख्या × इकाई-दर निकालकर सब जोड़ें।", "ਹਰ ਸ਼੍ਰੇਣੀ ਲਈ ਗਿਣਤੀ × ਇਕਾਈ-ਦਰ ਕੱਢ ਕੇ ਸਭ ਜੋੜੋ।"],
    findCompletionAfterCategoryReplacement: ["पुरानी दर से नई दर", "ਪੁਰਾਣੀ ਦਰ ਤੋਂ ਨਵੀਂ ਦਰ", "समान काम में समय को पुरानी दर ÷ नई दर से बदलें।", "ਇੱਕੋ ਕੰਮ ਵਿੱਚ ਸਮੇਂ ਨੂੰ ਪੁਰਾਣੀ ਦਰ ÷ ਨਵੀਂ ਦਰ ਨਾਲ ਬਦਲੋ।"],
    findMixedCrewOutput: ["कुल दर × समय", "ਕੁੱਲ ਦਰ × ਸਮਾਂ", "समूह की कुल दर निकालकर दी गई अवधि से गुणा करें।", "ਸਮੂਹ ਦੀ ਕੁੱਲ ਦਰ ਕੱਢ ਕੇ ਦਿੱਤੀ ਮਿਆਦ ਨਾਲ ਗੁਣਾ ਕਰੋ।"],
    findEquivalentStandardResourceTime: ["मानक संसाधन-समय", "ਮਿਆਰੀ ਸਰੋਤ-ਸਮਾਂ", "सभी श्रेणियों के दर-संशोधित सदस्य-दिन जोड़कर मानक इकाई में लिखें।", "ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਦਰ ਅਨੁਸਾਰ ਮੈਂਬਰ-ਦਿਨ ਜੋੜ ਕੇ ਮਿਆਰੀ ਇਕਾਈ ਵਿੱਚ ਲਿਖੋ।"],
    findMinimumIntegerCrewComposition: ["सबसे छोटी पूर्णांक जोड़ी", "ਸਭ ਤੋਂ ਛੋਟੀ ਪੂਰਨ-ਅੰਕ ਜੋੜੀ", "लक्ष्य दर पूरी करने वाली धनात्मक पूर्णांक जोड़ियों में न्यूनतम कुल चुनें।", "ਟੀਚੇ ਦੀ ਦਰ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਧਨਾਤਮਕ ਪੂਰਨ-ਅੰਕ ਜੋੜੀਆਂ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਕੁੱਲ ਚੁਣੋ।"],
    findUnknownCategorySoloTime: ["अज्ञात दर का उलटा", "ਅਣਜਾਣ ਦਰ ਦਾ ਉਲਟ", "समूह दर से ज्ञात योगदान घटाएँ, एक अज्ञात सदस्य की दर निकालें और उलटा लें।", "ਸਮੂਹ ਦੀ ਦਰ ਵਿੱਚੋਂ ਜਾਣਿਆ ਯੋਗਦਾਨ ਘਟਾਓ, ਇੱਕ ਅਣਜਾਣ ਮੈਂਬਰ ਦੀ ਦਰ ਕੱਢੋ ਅਤੇ ਉਲਟ ਲਵੋ।"],
    findCategoryContributionFraction: ["श्रेणी का काम ÷ कुल काम", "ਸ਼੍ਰੇਣੀ ਦਾ ਕੰਮ ÷ ਕੁੱਲ ਕੰਮ", "पूछी गई श्रेणी का संख्या × दर, पूरे समूह के संख्या × दर के योग से भाग दें।", "ਪੁੱਛੀ ਗਈ ਸ਼੍ਰੇਣੀ ਦਾ ਗਿਣਤੀ × ਦਰ, ਪੂਰੇ ਸਮੂਹ ਦੇ ਗਿਣਤੀ × ਦਰ ਦੇ ਜੋੜ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    compareTwoHeterogeneousCrews: ["दो समूहों की कुल दर", "ਦੋ ਸਮੂਹਾਂ ਦੀ ਕੁੱਲ ਦਰ", "दोनों समूहों की दर अलग निकालें और A:B क्रम बनाए रखें।", "ਦੋਵਾਂ ਸਮੂਹਾਂ ਦੀ ਦਰ ਵੱਖ ਕੱਢੋ ਅਤੇ A:B ਕ੍ਰਮ ਕਾਇਮ ਰੱਖੋ।"],
    findIntegerCrewCompositionUnderConstraints: ["कुल संख्या + कुल दर", "ਕੁੱਲ ਗਿਣਤੀ + ਕੁੱਲ ਦਰ", "x + y और दोनों श्रेणियों की कुल काम-दर के समीकरण साथ हल करें।", "x + y ਅਤੇ ਦੋਵਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਕੁੱਲ ਕੰਮ-ਦਰ ਦੇ ਸਮੀਕਰਨ ਇਕੱਠੇ ਹੱਲ ਕਰੋ।"],
  };
  const value = values[mode];
  return {
    title: language === "hi" ? value[0] : value[1],
    steps: [language === "hi" ? value[2] : value[3], finish],
  };
}

function trap(
  source: TmwCp007GeneratedQuestion,
  misconceptionId: Exclude<TmwCp007MisconceptionId, "CORRECT">,
  language: TmwLocalizedLanguage,
): string {
  if (misconceptionId === "PAIR_ORDER_REVERSED" && source.solveMode === "compareTwoHeterogeneousCrews") {
    return pair(language, "प्रश्न समूह A और समूह B का अनुपात पूछता है; इस विकल्प ने दोनों समूहों का क्रम उलट दिया है।", "ਪ੍ਰਸ਼ਨ ਸਮੂਹ A ਅਤੇ ਸਮੂਹ B ਦਾ ਅਨੁਪਾਤ ਪੁੱਛਦਾ ਹੈ; ਇਸ ਚੋਣ ਨੇ ਦੋਵੇਂ ਸਮੂਹਾਂ ਦਾ ਕ੍ਰਮ ਉਲਟ ਦਿੱਤਾ ਹੈ।");
  }
  const values: Record<Exclude<TmwCp007MisconceptionId, "CORRECT">, readonly [string, string]> = {
    CATEGORY_RATES_ASSUMED_EQUAL: [
      "अलग श्रेणियों की एक सदस्य की काम-दर अलग है; केवल सदस्यों की संख्या जोड़ने से सही कुल दर नहीं मिलती।",
      "ਵੱਖ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ ਵੱਖ ਹੈ; ਕੇਵਲ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਜੋੜਨ ਨਾਲ ਸਹੀ ਕੁੱਲ ਦਰ ਨਹੀਂ ਮਿਲਦੀ।",
    ],
    COUNT_RATIO_NOT_INVERTED: [
      "समान काम और समय में दक्षता अनुपात सदस्यों की संख्या के अनुपात का उलटा होता है; इस विकल्प ने संख्या अनुपात सीधे लिख दिया है।",
      "ਇੱਕੋ ਕੰਮ ਅਤੇ ਸਮੇਂ ਵਿੱਚ ਦੱਖਤਾ ਅਨੁਪਾਤ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਦੇ ਅਨੁਪਾਤ ਦਾ ਉਲਟ ਹੁੰਦਾ ਹੈ; ਇਸ ਚੋਣ ਨੇ ਗਿਣਤੀ ਅਨੁਪਾਤ ਸਿੱਧਾ ਲਿਖ ਦਿੱਤਾ ਹੈ।",
    ],
    CREW_RATE_NOT_SUMMED: [
      "समूह की कुल दर में हर काम कर रही श्रेणी का संख्या × इकाई-दर योगदान जोड़ना आवश्यक है; इस विकल्प में एक योगदान छूट गया है।",
      "ਸਮੂਹ ਦੀ ਕੁੱਲ ਦਰ ਵਿੱਚ ਹਰ ਕੰਮ ਕਰ ਰਹੀ ਸ਼੍ਰੇਣੀ ਦਾ ਗਿਣਤੀ × ਇਕਾਈ-ਦਰ ਯੋਗਦਾਨ ਜੋੜਨਾ ਲਾਜ਼ਮੀ ਹੈ; ਇਸ ਚੋਣ ਵਿੱਚ ਇੱਕ ਯੋਗਦਾਨ ਛੁੱਟ ਗਿਆ ਹੈ।",
    ],
    KNOWN_CATEGORY_OMITTED: [
      "ज्ञात श्रेणियों का योगदान पहले कुल दर में शामिल या उससे घटाना आवश्यक है; इस विकल्प ने ज्ञात योगदान छोड़ दिया है।",
      "ਜਾਣੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦਾ ਯੋਗਦਾਨ ਪਹਿਲਾਂ ਕੁੱਲ ਦਰ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰਨਾ ਜਾਂ ਇਸ ਵਿੱਚੋਂ ਘਟਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ; ਇਸ ਚੋਣ ਨੇ ਜਾਣਿਆ ਯੋਗਦਾਨ ਛੱਡ ਦਿੱਤਾ ਹੈ।",
    ],
    TOTAL_REPORTED_AS_REPLACEMENT: [
      "प्रश्न जोड़ी जाने वाली अतिरिक्त संख्या पूछता है; इस विकल्प ने अतिरिक्त संख्या के बजाय कोई कुल संख्या दी है।",
      "ਪ੍ਰਸ਼ਨ ਜੋੜੀ ਜਾਣ ਵਾਲੀ ਵਾਧੂ ਗਿਣਤੀ ਪੁੱਛਦਾ ਹੈ; ਇਸ ਚੋਣ ਨੇ ਵਾਧੂ ਗਿਣਤੀ ਦੀ ਥਾਂ ਕੋਈ ਕੁੱਲ ਗਿਣਤੀ ਦਿੱਤੀ ਹੈ।",
    ],
    REPLACEMENT_RATIO_REVERSED: [
      "समान काम में समय कुल दर के उलट बदलता है; इस विकल्प ने पुरानी और नई दर का अनुपात उलटा लगा दिया है।",
      "ਇੱਕੋ ਕੰਮ ਵਿੱਚ ਸਮਾਂ ਕੁੱਲ ਦਰ ਦੇ ਉਲਟ ਬਦਲਦਾ ਹੈ; ਇਸ ਚੋਣ ਨੇ ਪੁਰਾਣੀ ਅਤੇ ਨਵੀਂ ਦਰ ਦਾ ਅਨੁਪਾਤ ਉਲਟ ਲਾ ਦਿੱਤਾ ਹੈ।",
    ],
    TIME_RATE_INVERSION_MISSED: [
      "अज्ञात सदस्य की काम-दर मिलने के बाद अकेले लगने वाला समय उसका उलटा होता है; इस विकल्प ने अंतिम उलटा नहीं लिया।",
      "ਅਣਜਾਣ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਇਕੱਲੇ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ ਇਸ ਦਾ ਉਲਟ ਹੁੰਦਾ ਹੈ; ਇਸ ਚੋਣ ਨੇ ਆਖਰੀ ਉਲਟ ਨਹੀਂ ਲਿਆ।",
    ],
    CONTRIBUTION_USES_HEADCOUNT_ONLY: [
      "काम का हिस्सा केवल सदस्यों की संख्या से नहीं, संख्या × एक सदस्य की दर से मिलता है; इस विकल्प ने दक्षता को छोड़ दिया है।",
      "ਕੰਮ ਦਾ ਹਿੱਸਾ ਕੇਵਲ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਨਹੀਂ, ਗਿਣਤੀ × ਇੱਕ ਮੈਂਬਰ ਦੀ ਦਰ ਨਾਲ ਮਿਲਦਾ ਹੈ; ਇਸ ਚੋਣ ਨੇ ਦੱਖਤਾ ਛੱਡ ਦਿੱਤੀ ਹੈ।",
    ],
    PAIR_ORDER_REVERSED: [
      "उत्तर प्रश्न में दी गई पहली और दूसरी श्रेणी के क्रम में होना चाहिए; इस विकल्प ने दोनों पद बदल दिए हैं।",
      "ਉੱਤਰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ; ਇਸ ਚੋਣ ਨੇ ਦੋਵੇਂ ਪਦ ਬਦਲ ਦਿੱਤੇ ਹਨ।",
    ],
    INTEGER_CONSTRAINT_IGNORED: [
      "श्रेणियों की संख्या धनात्मक पूर्णांक होनी चाहिए और दी गई सीमा या न्यूनतम शर्त भी पूरी करनी चाहिए; इस विकल्प ने वह शर्त नहीं जाँची।",
      "ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਗਿਣਤੀ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ ਅਤੇ ਦਿੱਤੀ ਹੱਦ ਜਾਂ ਘੱਟੋ-ਘੱਟ ਸ਼ਰਤ ਵੀ ਪੂਰੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ; ਇਸ ਚੋਣ ਨੇ ਉਹ ਸ਼ਰਤ ਨਹੀਂ ਜਾਂਚੀ।",
    ],
    PLAUSIBLE_SCALE_ERROR: [
      "यह विकल्प सही विधि जैसा दिखता है, पर संख्या, दर, समय या काम में से किसी एक गुणक को गलत पैमाने पर उपयोग करता है।",
      "ਇਹ ਚੋਣ ਸਹੀ ਤਰੀਕੇ ਵਰਗੀ ਲੱਗਦੀ ਹੈ, ਪਰ ਗਿਣਤੀ, ਦਰ, ਸਮੇਂ ਜਾਂ ਕੰਮ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਗੁਣਕ ਨੂੰ ਗਲਤ ਪੈਮਾਨੇ ਉੱਤੇ ਵਰਤਦੀ ਹੈ।",
    ],
  };
  return values[misconceptionId][language === "hi" ? 0 : 1];
}

function conclusion(
  source: TmwCp007GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  const targetIndex = source.parameters.targetCategoryIndex ?? 1;
  const target = source.parameters.context.categories[targetIndex];
  const targetSingular = cp007Copy(target.singular, language);
  const targetPlural = cp007Copy(target.plural, language);
  switch (source.solveMode) {
    case "findTwoCategoryEfficiencyRatio":
    case "findThreeCategoryEfficiencyRatio":
      return pair(language, `अतः माँगा गया दक्षता अनुपात ${answerText} है।`, `ਇਸ ਲਈ ਮੰਗਿਆ ਦੱਖਤਾ ਅਨੁਪਾਤ ${answerText} ਹੈ।`);
    case "findMixedCrewCompletionTime":
      return pair(language, `अतः मिश्रित समूह पूरा काम ${answerText} में करेगा।`, `ਇਸ ਲਈ ਮਿਲਿਆ-ਜੁਲਿਆ ਸਮੂਹ ਪੂਰਾ ਕੰਮ ${answerText} ਵਿੱਚ ਕਰੇਗਾ।`);
    case "findEquivalentCategoryCount":
      return pair(language, `अतः बराबर क्षमता के लिए ${answerText} चाहिए।`, `ਇਸ ਲਈ ਬਰਾਬਰ ਸਮਰੱਥਾ ਲਈ ${answerText} ਚਾਹੀਦੇ ਹਨ।`);
    case "findUnknownCategoryCountForTargetTime":
      return pair(language, `अतः ${answerText} अतिरिक्त चाहिए।`, `ਇਸ ਲਈ ${answerText} ਵਾਧੂ ਚਾਹੀਦੇ ਹਨ।`);
    case "findCrewCompositionFromTwoOutputFacts":
    case "findMinimumIntegerCrewComposition":
    case "findIntegerCrewCompositionUnderConstraints":
      return pair(language, `अतः आवश्यक समूह ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸਮੂਹ ${answerText} ਹੈ।`);
    case "findCategoryRateFromWeightedCrewFacts":
    case "findHeterogeneousGroupRate":
      return pair(language, `अतः माँगी गई काम-दर ${answerText} है।`, `ਇਸ ਲਈ ਮੰਗੀ ਗਈ ਕੰਮ-ਦਰ ${answerText} ਹੈ।`);
    case "findCompletionAfterCategoryReplacement":
      return pair(language, `अतः बदला समूह काम ${answerText} में पूरा करेगा।`, `ਇਸ ਲਈ ਬਦਲਿਆ ਸਮੂਹ ਕੰਮ ${answerText} ਵਿੱਚ ਪੂਰਾ ਕਰੇਗਾ।`);
    case "findMixedCrewOutput":
      return pair(language, `अतः समूह का कुल उत्पादन ${answerText} होगा।`, `ਇਸ ਲਈ ਸਮੂਹ ਦਾ ਕੁੱਲ ਉਤਪਾਦਨ ${answerText} ਹੋਵੇਗਾ।`);
    case "findEquivalentStandardResourceTime":
      return pair(language, `अतः मिश्रित समूह का कुल समतुल्य योगदान ${answerText} है।`, `ਇਸ ਲਈ ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਦਾ ਕੁੱਲ ਬਰਾਬਰ ਯੋਗਦਾਨ ${answerText} ਹੈ।`);
    case "findUnknownCategorySoloTime":
      return pair(language, `अतः एक ${targetSingular} अकेले काम ${answerText} में करेगा।`, `ਇਸ ਲਈ ਇੱਕ ${targetSingular} ਇਕੱਲਾ ਕੰਮ ${answerText} ਵਿੱਚ ਕਰੇਗਾ।`);
    case "findCategoryContributionFraction":
      return pair(language, `अतः ${targetPlural} का हिस्सा ${answerText} है।`, `ਇਸ ਲਈ ${targetPlural} ਦਾ ਹਿੱਸਾ ${answerText} ਹੈ।`);
    case "compareTwoHeterogeneousCrews":
      return pair(language, `अतः समूह A : समूह B की काम-दर का अनुपात ${answerText} है।`, `ਇਸ ਲਈ ਸਮੂਹ A : ਸਮੂਹ B ਦੀ ਕੰਮ-ਦਰ ਦਾ ਅਨੁਪਾਤ ${answerText} ਹੈ।`);
  }
}

function givens(
  source: TmwCp007GeneratedQuestion,
  current: string[],
  language: TmwLocalizedLanguage,
): string[] {
  switch (source.solveMode) {
    case "findUnknownCategorySoloTime":
      return [
        pair(language, "मिश्रित समूह के पूरा काम करने का समय दिया गया है।", "ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਦੇ ਪੂਰਾ ਕੰਮ ਕਰਨ ਦਾ ਸਮਾਂ ਦਿੱਤਾ ਹੈ।"),
        pair(language, "पहली श्रेणी के एक सदस्य का अकेले काम करने का समय ज्ञात है; दूसरी श्रेणी के एक सदस्य का समय निकालना है।", "ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਦੇ ਇੱਕ ਮੈਂਬਰ ਦਾ ਇਕੱਲੇ ਕੰਮ ਕਰਨ ਦਾ ਸਮਾਂ ਜਾਣਿਆ ਹੈ; ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਦੇ ਇੱਕ ਮੈਂਬਰ ਦਾ ਸਮਾਂ ਕੱਢਣਾ ਹੈ।"),
      ];
    case "findMinimumIntegerCrewComposition":
      return [
        pair(language, "दोनों श्रेणियों के एक-एक सदस्य की काम-दर और लक्ष्य कुल दर दी गई है।", "ਦੋਵਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਇੱਕ-ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ ਅਤੇ ਟੀਚੇ ਦੀ ਕੁੱਲ ਦਰ ਦਿੱਤੀ ਹੈ।"),
        pair(language, "दोनों श्रेणियों की संख्या कम-से-कम एक और पूर्णांक होनी चाहिए।", "ਦੋਵਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਗਿਣਤੀ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਅਤੇ ਪੂਰਨ ਅੰਕ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।"),
      ];
    case "findIntegerCrewCompositionUnderConstraints":
      return [
        pair(language, "दोनों श्रेणियों के एक-एक सदस्य की काम-दर दी गई है।", "ਦੋਵਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਇੱਕ-ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ ਦਿੱਤੀ ਹੈ।"),
        pair(language, "कुल सदस्यों की संख्या और पूरे समूह की कुल काम-दर दी गई है।", "ਕੁੱਲ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਪੂਰੇ ਸਮੂਹ ਦੀ ਕੁੱਲ ਕੰਮ-ਦਰ ਦਿੱਤੀ ਹੈ।"),
      ];
    default:
      return current.map((text) => clean(text, language));
  }
}

export function remediateTmwCp007LocalizedEditorial(
  source: TmwCp007GeneratedQuestion,
  fields: TmwCp007LocalizedEditorialFields,
  answerText: string,
  language: TmwLocalizedLanguage,
): TmwCp007LocalizedEditorialFields {
  const misconceptionId = source.explanation.commonTrap.misconceptionId as Exclude<TmwCp007MisconceptionId, "CORRECT">;
  return {
    stem: clean(fields.stem, language),
    opening: OPENINGS[source.solveMode][language === "hi" ? 0 : 1],
    givens: givens(source, fields.givens, language),
    workedSteps: fields.workedSteps.map((text) => clean(text, language)),
    shortcut: shortcut(source.solveMode, answerText, language),
    trapExplanation: trap(source, misconceptionId, language),
    conclusion: conclusion(source, answerText, language),
  };
}
