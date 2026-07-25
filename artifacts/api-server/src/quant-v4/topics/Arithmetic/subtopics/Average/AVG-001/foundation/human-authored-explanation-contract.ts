import type { Avg001QuestionPackage } from "./types";

type Language = "en" | "hi" | "pa";

export const AVG_001_EXPLANATION_CONTRACT =
  "AVG-001 concise context-authored explanation contract v1";

const EN_OPENINGS = [
  "Begin with this fact: {concept}",
  "Use this relation: {concept}",
  "The key idea is simple: {concept}",
  "Start from this relationship: {concept}",
  "The calculation rests on this: {concept}",
  "Connect the figures through this: {concept}",
  "A direct solution uses this: {concept}",
  "First note this: {concept}",
  "This rule governs the calculation: {concept}",
  "Keep this fact in view: {concept}",
  "Use the data with this principle: {concept}",
  "The numbers are linked by this: {concept}",
  "A clean solution starts here: {concept}",
  "The decisive relation is: {concept}",
  "Work from this fact: {concept}",
  "The arithmetic follows this rule: {concept}",
  "Frame the calculation this way: {concept}",
  "Use this as the starting point: {concept}",
  "The method depends on this: {concept}",
  "The useful observation is: {concept}",
  "Organise the data around this: {concept}",
  "The shortest valid route is: {concept}",
  "Here is the controlling fact: {concept}",
] as const;

const HI_OPENINGS = [
  "इस तथ्य से शुरू करें: {concept}",
  "यह संबंध उपयोग करें: {concept}",
  "मुख्य विचार सरल है: {concept}",
  "इस संबंध से शुरुआत करें: {concept}",
  "गणना इस तथ्य पर टिकी है: {concept}",
  "आँकड़ों को इस नियम से जोड़ें: {concept}",
  "सीधा हल इस विचार से मिलता है: {concept}",
  "पहले यह ध्यान दें: {concept}",
  "यही नियम गणना चलाता है: {concept}",
  "इस तथ्य को ध्यान में रखें: {concept}",
  "दिए मानों पर यह सिद्धांत लगाएँ: {concept}",
  "संख्याएँ इस संबंध से जुड़ी हैं: {concept}",
  "साफ हल यहाँ से शुरू होता है: {concept}",
  "निर्णायक संबंध यह है: {concept}",
  "इस तथ्य के आधार पर चलें: {concept}",
  "गणना इस नियम का पालन करती है: {concept}",
  "गणना को इस तरह लिखें: {concept}",
  "इसे शुरुआती बिंदु बनाएँ: {concept}",
  "विधि इस तथ्य पर निर्भर है: {concept}",
  "उपयोगी निरीक्षण यह है: {concept}",
  "आँकड़ों को इस विचार के अनुसार रखें: {concept}",
  "सबसे सीधा सही तरीका है: {concept}",
  "गणना को नियंत्रित करने वाला तथ्य है: {concept}",
] as const;

const PA_OPENINGS = [
  "ਇਸ ਤੱਥ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ: {concept}",
  "ਇਹ ਸੰਬੰਧ ਵਰਤੋ: {concept}",
  "ਮੁੱਖ ਵਿਚਾਰ ਸੌਖਾ ਹੈ: {concept}",
  "ਇਸ ਸੰਬੰਧ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ: {concept}",
  "ਗਣਨਾ ਇਸ ਤੱਥ ਉੱਤੇ ਟਿਕੀ ਹੈ: {concept}",
  "ਅੰਕੜਿਆਂ ਨੂੰ ਇਸ ਨਿਯਮ ਨਾਲ ਜੋੜੋ: {concept}",
  "ਸਿੱਧਾ ਹੱਲ ਇਸ ਵਿਚਾਰ ਨਾਲ ਮਿਲਦਾ ਹੈ: {concept}",
  "ਪਹਿਲਾਂ ਇਹ ਧਿਆਨ ਦਿਓ: {concept}",
  "ਇਹੀ ਨਿਯਮ ਗਣਨਾ ਚਲਾਉਂਦਾ ਹੈ: {concept}",
  "ਇਸ ਤੱਥ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖੋ: {concept}",
  "ਦਿੱਤੇ ਮੁੱਲਾਂ ਉੱਤੇ ਇਹ ਸਿਧਾਂਤ ਲਗਾਓ: {concept}",
  "ਸੰਖਿਆਵਾਂ ਇਸ ਸੰਬੰਧ ਨਾਲ ਜੁੜੀਆਂ ਹਨ: {concept}",
  "ਸਾਫ਼ ਹੱਲ ਇੱਥੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ: {concept}",
  "ਫੈਸਲਾਕੁਨ ਸੰਬੰਧ ਇਹ ਹੈ: {concept}",
  "ਇਸ ਤੱਥ ਦੇ ਆਧਾਰ ਉੱਤੇ ਚਲੋ: {concept}",
  "ਗਣਨਾ ਇਸ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਦੀ ਹੈ: {concept}",
  "ਗਣਨਾ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਲਿਖੋ: {concept}",
  "ਇਸ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਬਣਾਓ: {concept}",
  "ਵਿਧੀ ਇਸ ਤੱਥ ਉੱਤੇ ਨਿਰਭਰ ਹੈ: {concept}",
  "ਲਾਭਦਾਇਕ ਨਿਰੀਖਣ ਇਹ ਹੈ: {concept}",
  "ਅੰਕੜਿਆਂ ਨੂੰ ਇਸ ਵਿਚਾਰ ਅਨੁਸਾਰ ਰੱਖੋ: {concept}",
  "ਸਭ ਤੋਂ ਸਿੱਧਾ ਸਹੀ ਤਰੀਕਾ ਹੈ: {concept}",
  "ਗਣਨਾ ਨੂੰ ਚਲਾਉਣ ਵਾਲਾ ਤੱਥ ਹੈ: {concept}",
] as const;

const EN_CONCLUSION_FRAMES = [
  "Therefore, {content}",
  "Hence, {content}",
  "Thus, {content}",
  "So, {content}",
  "Therefore, the calculation gives {content}",
  "Hence, after simplification, {content}",
  "Thus, after substitution, {content}",
  "So, evaluating the expression gives {content}",
  "Therefore, we obtain {content}",
  "Hence, the resulting statement is that {content}",
  "Thus, the figures show that {content}",
  "So, the computed value confirms that {content}",
  "Therefore, the final calculation shows that {content}",
  "Hence, the arithmetic establishes that {content}",
  "Thus, the evaluated value means that {content}",
  "So, the data leads to the conclusion that {content}",
  "Therefore, the simplified result tells us that {content}",
  "Hence, the completed calculation shows that {content}",
  "Thus, the final value confirms that {content}",
] as const;

const HI_CONCLUSION_FRAMES = [
  "अतः {content}",
  "इसलिए {content}",
  "इस प्रकार {content}",
  "फलतः {content}",
  "अतः गणना से {content}",
  "इसलिए सरल करने पर {content}",
  "इस प्रकार मान रखने पर {content}",
  "फलतः व्यंजक का मान निकालने पर {content}",
  "अतः हमें मिलता है कि {content}",
  "इसलिए परिणाम बताता है कि {content}",
  "इस प्रकार आँकड़े दिखाते हैं कि {content}",
  "फलतः निकाला गया मान पुष्टि करता है कि {content}",
  "अतः अंतिम गणना से स्पष्ट है कि {content}",
  "इसलिए अंकगणित से सिद्ध होता है कि {content}",
  "इस प्रकार प्राप्त मान का अर्थ है कि {content}",
  "फलतः दिए गए आँकड़ों से निष्कर्ष है कि {content}",
  "अतः सरल परिणाम बताता है कि {content}",
  "इसलिए पूरी गणना दिखाती है कि {content}",
  "इस प्रकार अंतिम मान पुष्टि करता है कि {content}",
] as const;

const PA_CONCLUSION_FRAMES = [
  "ਇਸ ਲਈ {content}",
  "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ {content}",
  "ਫਲਸਰੂਪ {content}",
  "ਇਸ ਲਈ ਗਣਨਾ ਤੋਂ {content}",
  "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਸਰਲ ਕਰਨ ਉੱਤੇ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਮੁੱਲ ਰੱਖਣ ਉੱਤੇ {content}",
  "ਫਲਸਰੂਪ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੱਢਣ ਉੱਤੇ {content}",
  "ਇਸ ਲਈ ਸਾਨੂੰ ਮਿਲਦਾ ਹੈ ਕਿ {content}",
  "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਨਤੀਜਾ ਦੱਸਦਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਅੰਕੜੇ ਦਿਖਾਉਂਦੇ ਹਨ ਕਿ {content}",
  "ਫਲਸਰੂਪ ਕੱਢਿਆ ਮੁੱਲ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਲਈ ਅੰਤਿਮ ਗਣਨਾ ਤੋਂ ਸਪਸ਼ਟ ਹੈ ਕਿ {content}",
  "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਹਿਸਾਬ ਸਾਬਤ ਕਰਦਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਪ੍ਰਾਪਤ ਮੁੱਲ ਦਾ ਅਰਥ ਹੈ ਕਿ {content}",
  "ਫਲਸਰੂਪ ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਤੋਂ ਨਤੀਜਾ ਹੈ ਕਿ {content}",
  "ਇਸ ਲਈ ਸਰਲ ਨਤੀਜਾ ਦੱਸਦਾ ਹੈ ਕਿ {content}",
  "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਪੂਰੀ ਗਣਨਾ ਦਿਖਾਉਂਦੀ ਹੈ ਕਿ {content}",
  "ਇਸ ਪ੍ਰਕਾਰ ਅੰਤਿਮ ਮੁੱਲ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ ਕਿ {content}",
] as const;

function languageOf(pkg: Avg001QuestionPackage): Language {
  return pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
}

function conceptEnglish(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    if (mode === "findSumFromAverageAndCount") return "the total is the average multiplied by the number of observations.";
    if (mode === "findAverageFromSumAndCount") return "the average is the total divided by the number of observations.";
    if (mode === "findCountFromSumAndAverage") return "the number of observations is the total divided by the average.";
    if (mode === "findMissingValueFromAverage") return "the missing value is the required total minus the known subtotal.";
    return "a uniform change in every observation changes the average by the same amount.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "the middle term of an odd equally spaced set equals its average.";
    if (mode === "findExtremeFromAverageAndCount") return "equally spaced terms extend symmetrically on both sides of their average.";
    if (mode === "findTermCountFromAverageAndExtreme") return "the distance from the average to an extreme term gives the number of equal gaps.";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "the half-span is divided by the number of equal gaps.";
    return "the average of equally spaced terms lies halfway between the first and last terms.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (mode === "findOriginalCountFromJoiningMemberShift" || mode === "findOriginalCountFromLeavingMemberShift") {
      return "the change in average spreads the gain or loss across the original group size.";
    }
    if (mode === "findInningsValueOrNewCricketAverage") {
      return pkg.parameters.answerType === "AVERAGE"
        ? "the previous run total and next score must be combined before division by the new innings count."
        : "the required runs equal the target run total minus the current runs.";
    }
    if (mode === "findAddedMemberValueFromShift" || mode === "findRemovedMemberValueFromShift" || mode === "findReplacementValueFromShift") {
      return "the changed value comes from the difference between the old and new totals.";
    }
    if (mode === "findNewAverageAfterRemoval") return "subtract the removed value from the old total before dividing by the remaining count.";
    if (mode === "findNewAverageAfterReplacement") return "replace the old value inside the old total while the count stays unchanged.";
    return "convert the old average into an old total before adding the new value.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004") {
    return /Speed/i.test(mode)
      ? "average speed must use total distance divided by total time."
      : "each group total contributes according to its member count, so the group sizes act as weights.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-005") {
    return "the recorded total must be corrected before the average is recalculated.";
  }
  return "the group totals and member counts must form the combined total before the final average is taken.";
}

function conceptHindi(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    if (mode === "findSumFromAverageAndCount") return "कुल, औसत और संख्या के गुणनफल के बराबर होता है।";
    if (mode === "findAverageFromSumAndCount") return "औसत, कुल को संख्या से भाग देकर मिलता है।";
    if (mode === "findCountFromSumAndAverage") return "संख्या, कुल को औसत से भाग देकर मिलती है।";
    if (mode === "findMissingValueFromAverage") return "लापता मान, आवश्यक कुल में से ज्ञात उप-कुल घटाकर मिलता है।";
    return "हर मान में समान परिवर्तन होने पर औसत भी उतना ही बदलता है।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "विषम संख्या वाले समान-अंतर क्रम का मध्य पद उसके औसत के बराबर होता है।";
    if (mode === "findExtremeFromAverageAndCount") return "समान-अंतर पद औसत के दोनों ओर सममित होते हैं।";
    if (mode === "findTermCountFromAverageAndExtreme") return "औसत से चरम पद तक की दूरी समान अंतरालों की संख्या देती है।";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "आधे फैलाव को समान अंतरालों की संख्या से भाग दिया जाता है।";
    return "समान-अंतर पदों का औसत पहले और अंतिम पद के ठीक बीच में होता है।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (mode === "findOriginalCountFromJoiningMemberShift" || mode === "findOriginalCountFromLeavingMemberShift") return "औसत का परिवर्तन मूल समूह की संख्या पर फैलता है।";
    if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
      ? "पुराने कुल रन में अगला स्कोर जोड़कर नई पारी-संख्या से भाग दिया जाता है।"
      : "आवश्यक रन, लक्षित कुल रन में से वर्तमान कुल रन घटाकर मिलते हैं।";
    if (mode === "findAddedMemberValueFromShift" || mode === "findRemovedMemberValueFromShift" || mode === "findReplacementValueFromShift") return "बदला मान पुराने और नए कुल के अंतर से मिलता है।";
    if (mode === "findNewAverageAfterRemoval") return "हटाया मान पुराने कुल से घटाकर शेष संख्या से भाग दिया जाता है।";
    if (mode === "findNewAverageAfterReplacement") return "पुराने कुल में मान बदला जाता है, जबकि संख्या वही रहती है।";
    return "नया मान जोड़ने से पहले पुराने औसत को पुराने कुल में बदला जाता है।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004") return /Speed/i.test(mode)
    ? "औसत चाल कुल दूरी को कुल समय से भाग देकर मिलती है।"
    : "हर समूह का कुल उसकी सदस्य-संख्या के अनुसार भार देता है।";
  if (pkg.canonicalProblemId === "AVG-CP-005") return "औसत दोबारा निकालने से पहले दर्ज कुल को सुधारना पड़ता है।";
  return "अंतिम औसत से पहले समूहों के कुल और सदस्य-संख्याएँ जोड़ी जाती हैं।";
}

function conceptPunjabi(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    if (mode === "findSumFromAverageAndCount") return "ਕੁੱਲ, ਔਸਤ ਅਤੇ ਗਿਣਤੀ ਦੇ ਗੁਣਨਫਲ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।";
    if (mode === "findAverageFromSumAndCount") return "ਔਸਤ, ਕੁੱਲ ਨੂੰ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲਦੀ ਹੈ।";
    if (mode === "findCountFromSumAndAverage") return "ਗਿਣਤੀ, ਕੁੱਲ ਨੂੰ ਔਸਤ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲਦੀ ਹੈ।";
    if (mode === "findMissingValueFromAverage") return "ਗੁੰਮ ਮੁੱਲ, ਲੋੜੀਂਦੇ ਕੁੱਲ ਵਿੱਚੋਂ ਜਾਣਿਆ ਉਪ-ਕੁੱਲ ਘਟਾ ਕੇ ਮਿਲਦਾ ਹੈ।";
    return "ਹਰ ਮੁੱਲ ਵਿੱਚ ਇੱਕੋ ਬਦਲਾਅ ਹੋਣ ਉੱਤੇ ਔਸਤ ਵੀ ਉਤਨੀ ਹੀ ਬਦਲਦੀ ਹੈ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "ਵਿਸ਼ਮ ਗਿਣਤੀ ਵਾਲੇ ਬਰਾਬਰ-ਅੰਤਰ ਕ੍ਰਮ ਦਾ ਮੱਧਲਾ ਪਦ ਉਸ ਦੀ ਔਸਤ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।";
    if (mode === "findExtremeFromAverageAndCount") return "ਬਰਾਬਰ-ਅੰਤਰ ਪਦ ਔਸਤ ਦੇ ਦੋਵੇਂ ਪਾਸੇ ਸਮਮਿਤ ਹੁੰਦੇ ਹਨ।";
    if (mode === "findTermCountFromAverageAndExtreme") return "ਔਸਤ ਤੋਂ ਅੰਤਲੇ ਪਦ ਤੱਕ ਦੀ ਦੂਰੀ ਬਰਾਬਰ ਅੰਤਰਾਲਾਂ ਦੀ ਗਿਣਤੀ ਦਿੰਦੀ ਹੈ।";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "ਅੱਧੇ ਫੈਲਾਅ ਨੂੰ ਬਰਾਬਰ ਅੰਤਰਾਲਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।";
    return "ਬਰਾਬਰ-ਅੰਤਰ ਪਦਾਂ ਦੀ ਔਸਤ ਪਹਿਲੇ ਅਤੇ ਆਖਰੀ ਪਦ ਦੇ ਠੀਕ ਵਿਚਕਾਰ ਹੁੰਦੀ ਹੈ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (mode === "findOriginalCountFromJoiningMemberShift" || mode === "findOriginalCountFromLeavingMemberShift") return "ਔਸਤ ਦਾ ਬਦਲਾਅ ਮੂਲ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਉੱਤੇ ਫੈਲਦਾ ਹੈ।";
    if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
      ? "ਪੁਰਾਣੀਆਂ ਕੁੱਲ ਦੌੜਾਂ ਵਿੱਚ ਅਗਲਾ ਸਕੋਰ ਜੋੜ ਕੇ ਨਵੀਂ ਪਾਰੀ-ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।"
      : "ਲੋੜੀਂਦੀਆਂ ਦੌੜਾਂ, ਟੀਚੇ ਦੇ ਕੁੱਲ ਵਿੱਚੋਂ ਮੌਜੂਦਾ ਕੁੱਲ ਘਟਾ ਕੇ ਮਿਲਦੀਆਂ ਹਨ।";
    if (mode === "findAddedMemberValueFromShift" || mode === "findRemovedMemberValueFromShift" || mode === "findReplacementValueFromShift") return "ਬਦਲਿਆ ਮੁੱਲ ਪੁਰਾਣੇ ਅਤੇ ਨਵੇਂ ਕੁੱਲ ਦੇ ਫਰਕ ਤੋਂ ਮਿਲਦਾ ਹੈ।";
    if (mode === "findNewAverageAfterRemoval") return "ਹਟਾਇਆ ਮੁੱਲ ਪੁਰਾਣੇ ਕੁੱਲ ਵਿੱਚੋਂ ਘਟਾ ਕੇ ਬਾਕੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।";
    if (mode === "findNewAverageAfterReplacement") return "ਪੁਰਾਣੇ ਕੁੱਲ ਵਿੱਚ ਮੁੱਲ ਬਦਲਦਾ ਹੈ, ਜਦਕਿ ਗਿਣਤੀ ਉਹੀ ਰਹਿੰਦੀ ਹੈ।";
    return "ਨਵਾਂ ਮੁੱਲ ਜੋੜਨ ਤੋਂ ਪਹਿਲਾਂ ਪੁਰਾਣੀ ਔਸਤ ਨੂੰ ਪੁਰਾਣੇ ਕੁੱਲ ਵਿੱਚ ਬਦਲਿਆ ਜਾਂਦਾ ਹੈ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004") return /Speed/i.test(mode)
    ? "ਔਸਤ ਚਾਲ ਕੁੱਲ ਦੂਰੀ ਨੂੰ ਕੁੱਲ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲਦੀ ਹੈ।"
    : "ਹਰ ਸਮੂਹ ਦਾ ਕੁੱਲ ਉਸ ਦੀ ਮੈਂਬਰ-ਗਿਣਤੀ ਅਨੁਸਾਰ ਭਾਰ ਦਿੰਦਾ ਹੈ।";
  if (pkg.canonicalProblemId === "AVG-CP-005") return "ਔਸਤ ਮੁੜ ਕੱਢਣ ਤੋਂ ਪਹਿਲਾਂ ਦਰਜ ਕੁੱਲ ਨੂੰ ਠੀਕ ਕਰਨਾ ਪੈਂਦਾ ਹੈ।";
  return "ਅੰਤਿਮ ਔਸਤ ਤੋਂ ਪਹਿਲਾਂ ਸਮੂਹਾਂ ਦੇ ਕੁੱਲ ਅਤੇ ਮੈਂਬਰ-ਗਿਣਤੀਆਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।";
}

function concept(pkg: Avg001QuestionPackage, language: Language) {
  if (language === "hi") return conceptHindi(pkg);
  if (language === "pa") return conceptPunjabi(pkg);
  return conceptEnglish(pkg);
}

function isEquation(line: string) {
  return /\$\$/.test(line);
}

function answerToken(pkg: Avg001QuestionPackage) {
  return String(pkg.answer).replaceAll(",", "").match(/-?\d+(?:\.\d+)?(?::-?\d+(?:\.\d+)?)?/)?.[0]
    ?? String(pkg.answer).replaceAll(",", "").trim();
}

function calculatesAnswer(pkg: Avg001QuestionPackage, line: string) {
  const answer = answerToken(pkg);
  const compact = line.replaceAll(",", "").replaceAll(" ", "").replaceAll("₹", "");
  const marker = `=${answer}`;
  let index = compact.indexOf(marker);
  while (index >= 0) {
    const next = compact[index + marker.length] ?? "";
    if (!/[0-9.:]/.test(next)) return true;
    index = compact.indexOf(marker, index + 1);
  }
  return false;
}

function wordCount(line: string) {
  return line.replace(/[^A-Za-z]+/g, " ").trim().split(/\s+/).filter(Boolean).length;
}

function fallbackMethod(pkg: Avg001QuestionPackage, language: Language) {
  const mode = pkg.solveMode;
  if (language === "hi") {
    if (pkg.canonicalProblemId === "AVG-CP-001") return "दिए औसत और संख्या से आवश्यक कुल या मान निकालें।";
    if (pkg.canonicalProblemId === "AVG-CP-002") return "पहले औसत से दोनों छोर या मध्य पद का संबंध लिखें।";
    if (pkg.canonicalProblemId === "AVG-CP-003") return /Removal|Leaving/i.test(mode)
      ? "पुराने कुल से हटाया मान घटाएँ और नई संख्या से भाग दें।"
      : "पुराने कुल में परिवर्तन करके नई संख्या के अनुसार औसत निकालें।";
    if (pkg.canonicalProblemId === "AVG-CP-004") return /Speed/i.test(mode)
      ? "हर चरण की दूरी और समय जोड़कर पूरी यात्रा का अनुपात लें।"
      : "पहले हर समूह का कुल निकालें, फिर कुल सदस्य-संख्या से भाग दें।";
    if (pkg.canonicalProblemId === "AVG-CP-005") return "गलत और सही प्रविष्टि के अंतर से दर्ज कुल को ठीक करें।";
    return "ज्ञात समूहों के कुल जोड़कर लापता समूह की राशि अलग करें।";
  }
  if (language === "pa") {
    if (pkg.canonicalProblemId === "AVG-CP-001") return "ਦਿੱਤੀ ਔਸਤ ਅਤੇ ਗਿਣਤੀ ਤੋਂ ਲੋੜੀਂਦਾ ਕੁੱਲ ਜਾਂ ਮੁੱਲ ਕੱਢੋ।";
    if (pkg.canonicalProblemId === "AVG-CP-002") return "ਪਹਿਲਾਂ ਔਸਤ ਨਾਲ ਦੋਵੇਂ ਸਿਰਿਆਂ ਜਾਂ ਮੱਧਲੇ ਪਦ ਦਾ ਸੰਬੰਧ ਲਿਖੋ।";
    if (pkg.canonicalProblemId === "AVG-CP-003") return /Removal|Leaving/i.test(mode)
      ? "ਪੁਰਾਣੇ ਕੁੱਲ ਵਿੱਚੋਂ ਹਟਾਇਆ ਮੁੱਲ ਘਟਾਓ ਅਤੇ ਨਵੀਂ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।"
      : "ਪੁਰਾਣੇ ਕੁੱਲ ਵਿੱਚ ਬਦਲਾਅ ਕਰਕੇ ਨਵੀਂ ਗਿਣਤੀ ਅਨੁਸਾਰ ਔਸਤ ਕੱਢੋ।";
    if (pkg.canonicalProblemId === "AVG-CP-004") return /Speed/i.test(mode)
      ? "ਹਰ ਪੜਾਅ ਦੀ ਦੂਰੀ ਅਤੇ ਸਮਾਂ ਜੋੜ ਕੇ ਪੂਰੀ ਯਾਤਰਾ ਦਾ ਅਨੁਪਾਤ ਲਓ।"
      : "ਪਹਿਲਾਂ ਹਰ ਸਮੂਹ ਦਾ ਕੁੱਲ ਕੱਢੋ, ਫਿਰ ਕੁੱਲ ਮੈਂਬਰ-ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।";
    if (pkg.canonicalProblemId === "AVG-CP-005") return "ਗਲਤ ਅਤੇ ਸਹੀ ਦਰਜ ਮੁੱਲ ਦੇ ਫਰਕ ਨਾਲ ਦਰਜ ਕੁੱਲ ਨੂੰ ਠੀਕ ਕਰੋ।";
    return "ਜਾਣੇ ਸਮੂਹਾਂ ਦੇ ਕੁੱਲ ਜੋੜ ਕੇ ਗੁੰਮ ਸਮੂਹ ਦੀ ਰਕਮ ਅਲੱਗ ਕਰੋ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-001") return "Use the given average and count to isolate the required total or value.";
  if (pkg.canonicalProblemId === "AVG-CP-002") return "Relate the average to the two extremes or to the middle term.";
  if (pkg.canonicalProblemId === "AVG-CP-003") return /Removal|Leaving/i.test(mode)
    ? "Subtract the outgoing value from the old total, then divide by the new count."
    : "Adjust the old total for the change, then use the revised count.";
  if (pkg.canonicalProblemId === "AVG-CP-004") return /Speed/i.test(mode)
    ? "Add the stage distances and times before taking the journey-wide ratio."
    : "Find each group total first, then divide by the combined member count.";
  if (pkg.canonicalProblemId === "AVG-CP-005") return "Correct the recorded total by the difference between the wrong and correct entries.";
  return "Combine the known group totals and isolate the contribution of the missing group.";
}

function polishMethod(line: string, language: Language) {
  if (language === "hi") {
    return line
      .replace("पुराना मापों के कुल", "मापों का पुराना कुल")
      .replace("पुराने औसत माप को मापों के कुल", "पुराने औसत माप से मापों का कुल")
      .replace("पुराने अंकों का औसत से कुल अंकों", "पुराने औसत अंक से कुल अंक")
      .replaceAll("जाने वाला कर्मचारी का", "जाने वाले कर्मचारी का")
      .replaceAll("जाने वाला व्यक्ति का", "जाने वाले व्यक्ति का")
      .replaceAll("जाने वाला एक दिन की बिक्री", "हटाए गए दिन की बिक्री")
      .replaceAll("एक एक दिन की बिक्री", "एक दिन की बिक्री")
      .replaceAll("कुल बिक्री बदलता है", "कुल बिक्री बदलती है");
  }
  if (language === "pa") {
    return line
      .replace("ਪੁਰਾਣਾ ਮਾਪਾਂ ਦੇ ਕੁੱਲ", "ਮਾਪਾਂ ਦਾ ਪੁਰਾਣਾ ਕੁੱਲ")
      .replace("ਪੁਰਾਣੀ ਔਸਤ ਮਾਪ ਨੂੰ ਮਾਪਾਂ ਦੇ ਕੁੱਲ", "ਪੁਰਾਣੀ ਔਸਤ ਮਾਪ ਤੋਂ ਮਾਪਾਂ ਦਾ ਕੁੱਲ")
      .replace("ਪੁਰਾਣੀ ਅੰਕਾਂ ਦੀ ਔਸਤ ਤੋਂ ਕੁੱਲ ਅੰਕਾਂ", "ਪੁਰਾਣੀ ਔਸਤ ਅੰਕ ਤੋਂ ਕੁੱਲ ਅੰਕ")
      .replaceAll("ਜਾਣ ਵਾਲਾ ਕਰਮਚਾਰੀ ਦੀ", "ਜਾਣ ਵਾਲੇ ਕਰਮਚਾਰੀ ਦੀ")
      .replaceAll("ਜਾਣ ਵਾਲਾ ਵਿਅਕਤੀ ਦਾ", "ਜਾਣ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ")
      .replaceAll("ਜਾਣ ਵਾਲਾ ਇੱਕ ਦਿਨ ਦੀ ਵਿਕਰੀ", "ਹਟਾਏ ਦਿਨ ਦੀ ਵਿਕਰੀ")
      .replaceAll("ਇੱਕ ਇੱਕ ਦਿਨ ਦੀ ਵਿਕਰੀ", "ਇੱਕ ਦਿਨ ਦੀ ਵਿਕਰੀ")
      .replaceAll("ਕੁੱਲ ਵਿਕਰੀ ਬਦਲਦਾ ਹੈ", "ਕੁੱਲ ਵਿਕਰੀ ਬਦਲਦੀ ਹੈ");
  }
  return line.replaceAll("one one day's sales", "one day's sales");
}

function stripConclusionPrefix(value: string, language: Language) {
  const trimmed = value.trim();
  if (language === "en") {
    return trimmed.replace(/^(?:(?:Therefore|Hence|Thus|So|Accordingly),?\s*|(?:From the calculation|We therefore get|This gives|The final step gives|The calculation yields|The required result is|The answer is|After simplification, we get|On evaluation, we obtain|The resulting value is|The computed result is|This confirms|The question therefore gives|The final value is):?\s*)/i, "");
  }
  if (language === "hi") {
    return trimmed.replace(/^(?:अतः|इसलिए|इस प्रकार|फलतः|परिणामस्वरूप|गणना से|यहाँ से मिलता है:|इससे प्राप्त होता है:|अंतिम चरण देता है:|गणना का परिणाम है:|आवश्यक परिणाम है:|उत्तर है:|सरल करने पर मिलता है:|मान रखने पर मिलता है:|प्राप्त मान है:|निकाला गया परिणाम है:|इससे पुष्टि होती है:|प्रश्न का उत्तर है:|अंतिम मान है:)\s*/, "");
  }
  return trimmed.replace(/^(?:ਇਸ ਲਈ|ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ|ਇਸ ਪ੍ਰਕਾਰ|ਫਲਸਰੂਪ|ਨਤੀਜੇ ਵਜੋਂ|ਗਣਨਾ ਤੋਂ|ਇੱਥੋਂ ਮਿਲਦਾ ਹੈ:|ਇਸ ਨਾਲ ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ:|ਅੰਤਿਮ ਕਦਮ ਦਿੰਦਾ ਹੈ:|ਗਣਨਾ ਦਾ ਨਤੀਜਾ ਹੈ:|ਲੋੜੀਂਦਾ ਨਤੀਜਾ ਹੈ:|ਉੱਤਰ ਹੈ:|ਸਰਲ ਕਰਨ ਉੱਤੇ ਮਿਲਦਾ ਹੈ:|ਮੁੱਲ ਰੱਖਣ ਉੱਤੇ ਮਿਲਦਾ ਹੈ:|ਪ੍ਰਾਪਤ ਮੁੱਲ ਹੈ:|ਕੱਢਿਆ ਗਿਆ ਨਤੀਜਾ ਹੈ:|ਇਸ ਨਾਲ ਪੁਸ਼ਟੀ ਹੁੰਦੀ ਹੈ:|ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਹੈ:|ਅੰਤਿਮ ਮੁੱਲ ਹੈ:)\s*/, "");
}

function answerUnit(pkg: Avg001QuestionPackage, language: Language) {
  const unitless = pkg.parameters.answerType === "COUNT" || pkg.parameters.answerType === "RATIO";
  if (unitless) return { prefix: "", suffix: "" };
  const stem = pkg.stem;
  if (stem.includes("₹")) return { prefix: "₹", suffix: "" };
  if (language === "hi") {
    if (/किग्रा|किलोग्राम/.test(stem)) return { prefix: "", suffix: " किग्रा" };
    if (/इकाइयाँ|इकाई/.test(stem)) return { prefix: "", suffix: " इकाइयाँ" };
    if (/अंक/.test(stem)) return { prefix: "", suffix: " अंक" };
    if (/किमी\/घंटा/.test(stem)) return { prefix: "", suffix: " किमी/घंटा" };
    if (/किमी/.test(stem)) return { prefix: "", suffix: " किमी" };
    if (/रन/.test(stem)) return { prefix: "", suffix: " रन" };
    if (/वर्ष|साल/.test(stem)) return { prefix: "", suffix: " वर्ष" };
  } else if (language === "pa") {
    if (/ਕਿਲੋਗ੍ਰਾਮ|ਕਿਗ੍ਰਾ/.test(stem)) return { prefix: "", suffix: " ਕਿਲੋਗ੍ਰਾਮ" };
    if (/ਇਕਾਈਆਂ|ਇਕਾਈ/.test(stem)) return { prefix: "", suffix: " ਇਕਾਈਆਂ" };
    if (/ਅੰਕ/.test(stem)) return { prefix: "", suffix: " ਅੰਕ" };
    if (/ਕਿਮੀ\/ਘੰਟਾ/.test(stem)) return { prefix: "", suffix: " ਕਿਮੀ/ਘੰਟਾ" };
    if (/ਕਿਮੀ/.test(stem)) return { prefix: "", suffix: " ਕਿਮੀ" };
    if (/ਦੌੜਾਂ|ਰਨ/.test(stem)) return { prefix: "", suffix: " ਦੌੜਾਂ" };
    if (/ਸਾਲ/.test(stem)) return { prefix: "", suffix: " ਸਾਲ" };
  } else {
    if (/\bkg\b|kilogram/i.test(stem)) return { prefix: "", suffix: " kg" };
    if (/\bunits?\b/i.test(stem)) return { prefix: "", suffix: " units" };
    if (/\bmarks?\b/i.test(stem)) return { prefix: "", suffix: " marks" };
    if (/\bkm\/h\b|kilometres? per hour|kilometers? per hour/i.test(stem)) return { prefix: "", suffix: " km/h" };
    if (/\bkm\b|kilomet/i.test(stem)) return { prefix: "", suffix: " km" };
    if (/\bruns?\b|innings|batter|batting|cricketer/i.test(stem)) return { prefix: "", suffix: " runs" };
    if (/\bage\b|\byears?\b/i.test(stem)) return { prefix: "", suffix: " years" };
  }
  return { prefix: "", suffix: "" };
}

function replaceAnswer(content: string, pkg: Avg001QuestionPackage, language: Language) {
  const clean = content.replace(/[.।]+$/, "").trim();
  const answer = answerToken(pkg);
  const unit = answerUnit(pkg, language);
  const hasPrefix = unit.prefix && clean.includes(unit.prefix);
  const hasSuffix = unit.suffix && clean.toLowerCase().includes(unit.suffix.trim().toLowerCase());
  const display = `${hasPrefix ? "" : unit.prefix}${String(pkg.answer)}${hasSuffix ? "" : unit.suffix}`;
  let replaced = false;
  const next = clean.replace(/-?\d[\d,]*(?:\.\d+)?(?::-?\d[\d,]*(?:\.\d+)?)?/g, (token) => {
    if (replaced || token.replaceAll(",", "") !== answer) return token;
    replaced = true;
    return display;
  });
  if (replaced) return next;
  if (language === "hi") return `${next} ${display}`.trim();
  if (language === "pa") return `${next} ${display}`.trim();
  return `${next} ${display}`.trim();
}

function conclusion(pkg: Avg001QuestionPackage, language: Language, original: string, index: number) {
  const content = replaceAnswer(stripConclusionPrefix(original, language), pkg, language);
  const frames = language === "hi" ? HI_CONCLUSION_FRAMES : language === "pa" ? PA_CONCLUSION_FRAMES : EN_CONCLUSION_FRAMES;
  return `${frames[index]!.replace("{content}", content)}${language === "en" ? "." : "।"}`;
}

function selectMethod(pkg: Avg001QuestionPackage, language: Language, lines: string[]) {
  const candidates = lines
    .slice(1, -1)
    .filter((line) => !isEquation(line))
    .map((line) => polishMethod(line.trim(), language))
    .filter(Boolean)
    .filter((line) => !/^(?:Start|Begin|Use the given data|The first useful step|The calculation|The direct route|Before substituting)/i.test(line));
  const selected = candidates[0];
  if (!selected) return fallbackMethod(pkg, language);
  if (language === "en" && wordCount(selected) > 22) return fallbackMethod(pkg, language);
  return selected;
}

function selectEquations(pkg: Avg001QuestionPackage, lines: string[]) {
  const equations = lines.filter(isEquation);
  if (equations.length <= 2) return equations;
  const decisiveIndex = equations.findLastIndex((line) => calculatesAnswer(pkg, line));
  if (decisiveIndex < 0) return equations.slice(-2);
  const decisive = equations[decisiveIndex]!;
  const support = equations.find((line, index) => index !== decisiveIndex && !calculatesAnswer(pkg, line));
  return support ? [support, decisive] : equations.slice(Math.max(0, decisiveIndex - 1), decisiveIndex + 1);
}

export function applyAvg001ExplanationContract(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const language = languageOf(pkg);
  const id = Math.max(0, Number(pkg.questionLanguageId.slice(-3)) - 1);
  const openingIndex = id % EN_OPENINGS.length;
  const conclusionIndex = Math.floor(id / EN_OPENINGS.length) % EN_CONCLUSION_FRAMES.length;
  const openings = language === "hi" ? HI_OPENINGS : language === "pa" ? PA_OPENINGS : EN_OPENINGS;
  const existing = pkg.explanation.lines.map((line) => line.trim()).filter(Boolean);
  const originalConclusion = [...existing].reverse().find((line) => !isEquation(line)) ?? String(pkg.answer);
  const method = selectMethod(pkg, language, existing);
  const equations = selectEquations(pkg, existing);
  const lines = [
    openings[openingIndex]!.replace("{concept}", concept(pkg, language)),
    method,
    ...equations,
    conclusion(pkg, language, originalConclusion, conclusionIndex),
  ].filter(Boolean).slice(0, 6);

  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      explanationAuthorship: "AVG-001 deterministic human-authored presentation v2",
      explanationOpeningVariant: openingIndex,
      explanationConclusionVariant: conclusionIndex,
      explanationContract: AVG_001_EXPLANATION_CONTRACT,
    },
  };
}
