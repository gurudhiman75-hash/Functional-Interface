import type { Avg001QuestionPackage } from "./types";

type SupportedLanguage = "en" | "hi" | "pa";

type ConclusionFrame = {
  prefix: string;
  capitalize: boolean;
};

const EN_OPENINGS = [
  "Start with the basic relation: {concept}",
  "The first useful step is to note that {concept}",
  "This question becomes direct once we use the fact that {concept}",
  "Use the given data through this relation: {concept}",
  "The calculation should begin from this idea: {concept}",
  "A reliable way to organise the figures is to remember that {concept}",
  "The relevant average rule here is simple: {concept}",
  "Before substituting the numbers, observe that {concept}",
  "The data can be connected by noting that {concept}",
  "The solution follows naturally from the fact that {concept}",
  "First convert the information using this principle: {concept}",
  "The required quantity can be isolated because {concept}",
  "A clean calculation starts with the observation that {concept}",
  "The important relation in this case is that {concept}",
  "To avoid a shortcut error, begin with the fact that {concept}",
  "The figures are easiest to handle after noting that {concept}",
  "The exact method uses this relation: {concept}",
  "Read the given values with this rule in mind: {concept}",
  "The arithmetic is organised around one fact: {concept}",
  "The direct route is to apply the relation that {concept}",
  "The quantities in the question are linked because {concept}",
  "Begin by expressing the data through this fact: {concept}",
  "The calculation is controlled by the following idea: {concept}",
] as const;

const HI_OPENINGS = [
  "मूल संबंध से शुरुआत करें: {concept}",
  "पहला उपयोगी कदम यह ध्यान देना है कि {concept}",
  "यह प्रश्न सीधा हो जाता है जब हम यह तथ्य उपयोग करते हैं कि {concept}",
  "दिए गए आँकड़ों को इस संबंध से जोड़ें: {concept}",
  "गणना की शुरुआत इस विचार से होनी चाहिए: {concept}",
  "आँकड़ों को व्यवस्थित करने का भरोसेमंद तरीका यह याद रखना है कि {concept}",
  "यहाँ औसत का उपयोगी नियम सरल है: {concept}",
  "मान रखने से पहले ध्यान दें कि {concept}",
  "दिए गए आँकड़े इस तथ्य से जुड़ते हैं कि {concept}",
  "समाधान स्वाभाविक रूप से इस तथ्य से निकलता है कि {concept}",
  "पहले सूचना को इस सिद्धांत के अनुसार लिखें: {concept}",
  "आवश्यक राशि अलग की जा सकती है क्योंकि {concept}",
  "साफ गणना इस निरीक्षण से शुरू होती है कि {concept}",
  "इस प्रश्न का महत्वपूर्ण संबंध यह है कि {concept}",
  "गलत शॉर्टकट से बचने के लिए पहले यह तथ्य उपयोग करें कि {concept}",
  "इन मानों को सँभालना आसान हो जाता है जब हम ध्यान देते हैं कि {concept}",
  "सटीक विधि इस संबंध का उपयोग करती है: {concept}",
  "दिए गए मानों को इस नियम के अनुसार पढ़ें: {concept}",
  "पूरी गणना एक तथ्य पर आधारित है: {concept}",
  "सीधा तरीका उस संबंध को लागू करना है जिसमें {concept}",
  "प्रश्न की राशियाँ आपस में जुड़ी हैं क्योंकि {concept}",
  "आँकड़ों को पहले इस तथ्य के रूप में लिखें: {concept}",
  "गणना को नियंत्रित करने वाला विचार यह है: {concept}",
] as const;

const PA_OPENINGS = [
  "ਮੂਲ ਸੰਬੰਧ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ: {concept}",
  "ਪਹਿਲਾ ਲਾਭਦਾਇਕ ਕਦਮ ਇਹ ਧਿਆਨ ਦੇਣਾ ਹੈ ਕਿ {concept}",
  "ਇਹ ਪ੍ਰਸ਼ਨ ਸਿੱਧਾ ਹੋ ਜਾਂਦਾ ਹੈ ਜਦੋਂ ਅਸੀਂ ਇਹ ਤੱਥ ਵਰਤਦੇ ਹਾਂ ਕਿ {concept}",
  "ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਨੂੰ ਇਸ ਸੰਬੰਧ ਨਾਲ ਜੋੜੋ: {concept}",
  "ਗਣਨਾ ਦੀ ਸ਼ੁਰੂਆਤ ਇਸ ਵਿਚਾਰ ਤੋਂ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ: {concept}",
  "ਅੰਕੜਿਆਂ ਨੂੰ ਵਿਵਸਥਿਤ ਕਰਨ ਦਾ ਭਰੋਸੇਯੋਗ ਤਰੀਕਾ ਇਹ ਯਾਦ ਰੱਖਣਾ ਹੈ ਕਿ {concept}",
  "ਇੱਥੇ ਔਸਤ ਦਾ ਲਾਭਦਾਇਕ ਨਿਯਮ ਸੌਖਾ ਹੈ: {concept}",
  "ਮੁੱਲ ਰੱਖਣ ਤੋਂ ਪਹਿਲਾਂ ਧਿਆਨ ਦਿਓ ਕਿ {concept}",
  "ਦਿੱਤੇ ਅੰਕੜੇ ਇਸ ਤੱਥ ਨਾਲ ਜੁੜਦੇ ਹਨ ਕਿ {concept}",
  "ਹੱਲ ਕੁਦਰਤੀ ਤੌਰ ਉੱਤੇ ਇਸ ਤੱਥ ਤੋਂ ਨਿਕਲਦਾ ਹੈ ਕਿ {concept}",
  "ਪਹਿਲਾਂ ਜਾਣਕਾਰੀ ਨੂੰ ਇਸ ਸਿਧਾਂਤ ਅਨੁਸਾਰ ਲਿਖੋ: {concept}",
  "ਲੋੜੀਂਦੀ ਰਕਮ ਅਲੱਗ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ ਕਿਉਂਕਿ {concept}",
  "ਸਾਫ ਗਣਨਾ ਇਸ ਨਿਰੀਖਣ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ ਕਿ {concept}",
  "ਇਸ ਪ੍ਰਸ਼ਨ ਦਾ ਮਹੱਤਵਪੂਰਨ ਸੰਬੰਧ ਇਹ ਹੈ ਕਿ {concept}",
  "ਗਲਤ ਛੋਟੇ ਰਸਤੇ ਤੋਂ ਬਚਣ ਲਈ ਪਹਿਲਾਂ ਇਹ ਤੱਥ ਵਰਤੋ ਕਿ {concept}",
  "ਇਨ੍ਹਾਂ ਮੁੱਲਾਂ ਨੂੰ ਸੰਭਾਲਣਾ ਸੌਖਾ ਹੋ ਜਾਂਦਾ ਹੈ ਜਦੋਂ ਅਸੀਂ ਧਿਆਨ ਦਿੰਦੇ ਹਾਂ ਕਿ {concept}",
  "ਸਹੀ ਵਿਧੀ ਇਸ ਸੰਬੰਧ ਨੂੰ ਵਰਤਦੀ ਹੈ: {concept}",
  "ਦਿੱਤੇ ਮੁੱਲਾਂ ਨੂੰ ਇਸ ਨਿਯਮ ਅਨੁਸਾਰ ਪੜ੍ਹੋ: {concept}",
  "ਪੂਰੀ ਗਣਨਾ ਇੱਕ ਤੱਥ ਉੱਤੇ ਆਧਾਰਿਤ ਹੈ: {concept}",
  "ਸਿੱਧਾ ਤਰੀਕਾ ਉਸ ਸੰਬੰਧ ਨੂੰ ਲਾਗੂ ਕਰਨਾ ਹੈ ਜਿਸ ਵਿੱਚ {concept}",
  "ਪ੍ਰਸ਼ਨ ਦੀਆਂ ਰਕਮਾਂ ਆਪਸ ਵਿੱਚ ਜੁੜੀਆਂ ਹਨ ਕਿਉਂਕਿ {concept}",
  "ਅੰਕੜਿਆਂ ਨੂੰ ਪਹਿਲਾਂ ਇਸ ਤੱਥ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ: {concept}",
  "ਗਣਨਾ ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਨ ਵਾਲਾ ਵਿਚਾਰ ਇਹ ਹੈ: {concept}",
] as const;

const EN_CONCLUSIONS: readonly ConclusionFrame[] = [
  { prefix: "Therefore, ", capitalize: false },
  { prefix: "Hence, ", capitalize: false },
  { prefix: "Thus, ", capitalize: false },
  { prefix: "So, ", capitalize: false },
  { prefix: "Accordingly, ", capitalize: false },
  { prefix: "From the calculation, ", capitalize: false },
  { prefix: "We therefore get: ", capitalize: true },
  { prefix: "This gives: ", capitalize: true },
  { prefix: "The final step gives: ", capitalize: true },
  { prefix: "The calculation yields: ", capitalize: true },
  { prefix: "The required result is: ", capitalize: true },
  { prefix: "The answer is: ", capitalize: true },
  { prefix: "After simplification, we get: ", capitalize: true },
  { prefix: "On evaluation, we obtain: ", capitalize: true },
  { prefix: "The resulting value is: ", capitalize: true },
  { prefix: "The computed result is: ", capitalize: true },
  { prefix: "This confirms: ", capitalize: true },
  { prefix: "The question therefore gives: ", capitalize: true },
  { prefix: "The final value is: ", capitalize: true },
];

const HI_CONCLUSIONS: readonly ConclusionFrame[] = [
  { prefix: "अतः ", capitalize: false },
  { prefix: "इसलिए ", capitalize: false },
  { prefix: "इस प्रकार ", capitalize: false },
  { prefix: "फलतः ", capitalize: false },
  { prefix: "परिणामस्वरूप ", capitalize: false },
  { prefix: "गणना से ", capitalize: false },
  { prefix: "यहाँ से मिलता है: ", capitalize: false },
  { prefix: "इससे प्राप्त होता है: ", capitalize: false },
  { prefix: "अंतिम चरण देता है: ", capitalize: false },
  { prefix: "गणना का परिणाम है: ", capitalize: false },
  { prefix: "आवश्यक परिणाम है: ", capitalize: false },
  { prefix: "उत्तर है: ", capitalize: false },
  { prefix: "सरल करने पर मिलता है: ", capitalize: false },
  { prefix: "मान रखने पर मिलता है: ", capitalize: false },
  { prefix: "प्राप्त मान है: ", capitalize: false },
  { prefix: "निकाला गया परिणाम है: ", capitalize: false },
  { prefix: "इससे पुष्टि होती है: ", capitalize: false },
  { prefix: "प्रश्न का उत्तर है: ", capitalize: false },
  { prefix: "अंतिम मान है: ", capitalize: false },
];

const PA_CONCLUSIONS: readonly ConclusionFrame[] = [
  { prefix: "ਇਸ ਲਈ ", capitalize: false },
  { prefix: "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ", capitalize: false },
  { prefix: "ਇਸ ਪ੍ਰਕਾਰ ", capitalize: false },
  { prefix: "ਫਲਸਰੂਪ ", capitalize: false },
  { prefix: "ਨਤੀਜੇ ਵਜੋਂ ", capitalize: false },
  { prefix: "ਗਣਨਾ ਤੋਂ ", capitalize: false },
  { prefix: "ਇੱਥੋਂ ਮਿਲਦਾ ਹੈ: ", capitalize: false },
  { prefix: "ਇਸ ਨਾਲ ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ: ", capitalize: false },
  { prefix: "ਅੰਤਿਮ ਕਦਮ ਦਿੰਦਾ ਹੈ: ", capitalize: false },
  { prefix: "ਗਣਨਾ ਦਾ ਨਤੀਜਾ ਹੈ: ", capitalize: false },
  { prefix: "ਲੋੜੀਂਦਾ ਨਤੀਜਾ ਹੈ: ", capitalize: false },
  { prefix: "ਉੱਤਰ ਹੈ: ", capitalize: false },
  { prefix: "ਸਰਲ ਕਰਨ ਉੱਤੇ ਮਿਲਦਾ ਹੈ: ", capitalize: false },
  { prefix: "ਮੁੱਲ ਰੱਖਣ ਉੱਤੇ ਮਿਲਦਾ ਹੈ: ", capitalize: false },
  { prefix: "ਪ੍ਰਾਪਤ ਮੁੱਲ ਹੈ: ", capitalize: false },
  { prefix: "ਕੱਢਿਆ ਗਿਆ ਨਤੀਜਾ ਹੈ: ", capitalize: false },
  { prefix: "ਇਸ ਨਾਲ ਪੁਸ਼ਟੀ ਹੁੰਦੀ ਹੈ: ", capitalize: false },
  { prefix: "ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਹੈ: ", capitalize: false },
  { prefix: "ਅੰਤਿਮ ਮੁੱਲ ਹੈ: ", capitalize: false },
];

function languageOf(pkg: Avg001QuestionPackage): SupportedLanguage {
  return pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
}

function conceptEnglish(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    if (mode === "findSumFromAverageAndCount") return "the total is the average multiplied by the number of observations.";
    if (mode === "findAverageFromSumAndCount") return "the average is the total divided by the number of observations.";
    if (mode === "findCountFromSumAndAverage") return "the number of observations is the total divided by the average.";
    if (mode === "findMissingValueFromAverage") return "the missing value is the required total minus the known subtotal.";
    return "a uniform change in every observation changes the average by the same rule.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "the middle value of an odd equally spaced set is its average.";
    if (mode === "findExtremeFromAverageAndCount") return "equally spaced values extend symmetrically on both sides of their average.";
    if (mode === "findTermCountFromAverageAndExtreme") return "the distance from the average to an end value gives the number of equal steps.";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "the span from the average to an end value is divided into equal steps.";
    return "the average of equally spaced values lies halfway between the first and last values.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (mode === "findOriginalCountFromJoiningMemberShift" || mode === "findOriginalCountFromLeavingMemberShift") return "the change in average spreads the gain or loss across the original group size.";
    if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
      ? "the previous run total and the next score must be combined before dividing by the new innings count."
      : "the required next score is the target run total minus the current run total.";
    if (mode === "findAddedMemberValueFromShift" || mode === "findRemovedMemberValueFromShift" || mode === "findReplacementValueFromShift") return "the changed value is obtained from the difference between the old and new totals.";
    return "each average should first be converted into a total before the group is changed.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004") {
    return /Speed/i.test(mode)
      ? "average speed must be based on total distance divided by total time."
      : "each group contributes its own total, so the group sizes act as weights.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-005") return "the recorded total must be corrected before the average is recalculated.";
  return "the lower-level totals must be combined before the higher-level average is found.";
}

function conceptHindi(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    if (mode === "findSumFromAverageAndCount") return "कुल पाने के लिए औसत को प्रेक्षणों की संख्या से गुणा किया जाता है।";
    if (mode === "findAverageFromSumAndCount") return "औसत पाने के लिए कुल को प्रेक्षणों की संख्या से भाग दिया जाता है।";
    if (mode === "findCountFromSumAndAverage") return "प्रेक्षणों की संख्या कुल को औसत से भाग देकर मिलती है।";
    if (mode === "findMissingValueFromAverage") return "लापता मान अपेक्षित कुल में से ज्ञात उप-कुल घटाकर मिलता है।";
    return "हर प्रेक्षण में एक जैसा परिवर्तन होने पर औसत भी उसी नियम से बदलता है।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "विषम संख्या वाले समान-अंतर समूह का मध्य मान उसके औसत के बराबर होता है।";
    if (mode === "findExtremeFromAverageAndCount") return "समान-अंतर मान औसत के दोनों ओर सममित रूप से फैले होते हैं।";
    if (mode === "findTermCountFromAverageAndExtreme") return "औसत से अंतिम मान तक की दूरी समान चरणों की संख्या बताती है।";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "औसत से अंतिम मान तक का फैलाव समान चरणों में बाँटा जाता है।";
    return "समान-अंतर मानों का औसत पहले और अंतिम मान के ठीक बीच में होता है।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (mode === "findOriginalCountFromJoiningMemberShift" || mode === "findOriginalCountFromLeavingMemberShift") return "औसत में परिवर्तन का प्रभाव मूल समूह की संख्या पर फैलता है।";
    if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
      ? "पुराने कुल रन में अगली पारी का स्कोर जोड़कर नई पारी-संख्या से भाग दिया जाता है।"
      : "अगली पारी का आवश्यक स्कोर लक्षित कुल रन और वर्तमान कुल रन का अंतर होता है।";
    if (mode === "findAddedMemberValueFromShift" || mode === "findRemovedMemberValueFromShift" || mode === "findReplacementValueFromShift") return "बदला हुआ मान पुराने और नए कुल के अंतर से मिलता है।";
    return "समूह में परिवर्तन करने से पहले प्रत्येक औसत को कुल में बदलना चाहिए।";
  }
  return "दिए गए औसत को संबंधित संख्या के साथ जोड़कर सही कुल बनाया जाता है।";
}

function conceptPunjabi(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    if (mode === "findSumFromAverageAndCount") return "ਕੁੱਲ ਲੱਭਣ ਲਈ ਔਸਤ ਨੂੰ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।";
    if (mode === "findAverageFromSumAndCount") return "ਔਸਤ ਲੱਭਣ ਲਈ ਕੁੱਲ ਨੂੰ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।";
    if (mode === "findCountFromSumAndAverage") return "ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਕੁੱਲ ਨੂੰ ਔਸਤ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲਦੀ ਹੈ।";
    if (mode === "findMissingValueFromAverage") return "ਗੁੰਮ ਮੁੱਲ ਲੋੜੀਂਦੇ ਕੁੱਲ ਵਿੱਚੋਂ ਜਾਣਿਆ ਉਪ-ਕੁੱਲ ਘਟਾ ਕੇ ਮਿਲਦਾ ਹੈ।";
    return "ਹਰ ਮੁੱਲ ਵਿੱਚ ਇੱਕੋ ਜਿਹਾ ਬਦਲਾਅ ਹੋਣ ਉੱਤੇ ਔਸਤ ਵੀ ਉਸੇ ਨਿਯਮ ਨਾਲ ਬਦਲਦੀ ਹੈ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "ਵਿਸਮ ਗਿਣਤੀ ਵਾਲੇ ਬਰਾਬਰ-ਅੰਤਰ ਸਮੂਹ ਦਾ ਮੱਧਲਾ ਮੁੱਲ ਉਸ ਦੀ ਔਸਤ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।";
    if (mode === "findExtremeFromAverageAndCount") return "ਬਰਾਬਰ-ਅੰਤਰ ਮੁੱਲ ਔਸਤ ਦੇ ਦੋਵੇਂ ਪਾਸੇ ਸਮਮਿਤ ਤੌਰ ਉੱਤੇ ਫੈਲੇ ਹੁੰਦੇ ਹਨ।";
    if (mode === "findTermCountFromAverageAndExtreme") return "ਔਸਤ ਤੋਂ ਅੰਤਲੇ ਮੁੱਲ ਤੱਕ ਦੀ ਦੂਰੀ ਬਰਾਬਰ ਕਦਮਾਂ ਦੀ ਗਿਣਤੀ ਦੱਸਦੀ ਹੈ।";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "ਔਸਤ ਤੋਂ ਅੰਤਲੇ ਮੁੱਲ ਤੱਕ ਦਾ ਫੈਲਾਅ ਬਰਾਬਰ ਕਦਮਾਂ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।";
    return "ਬਰਾਬਰ-ਅੰਤਰ ਮੁੱਲਾਂ ਦੀ ਔਸਤ ਪਹਿਲੇ ਅਤੇ ਆਖਰੀ ਮੁੱਲ ਦੇ ਠੀਕ ਵਿਚਕਾਰ ਹੁੰਦੀ ਹੈ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (mode === "findOriginalCountFromJoiningMemberShift" || mode === "findOriginalCountFromLeavingMemberShift") return "ਔਸਤ ਵਿੱਚ ਬਦਲਾਅ ਦਾ ਪ੍ਰਭਾਵ ਮੂਲ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਉੱਤੇ ਫੈਲਦਾ ਹੈ।";
    if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE"
      ? "ਪੁਰਾਣੀਆਂ ਕੁੱਲ ਦੌੜਾਂ ਵਿੱਚ ਅਗਲੀ ਪਾਰੀ ਦਾ ਸਕੋਰ ਜੋੜ ਕੇ ਨਵੀਂ ਪਾਰੀ-ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।"
      : "ਅਗਲੀ ਪਾਰੀ ਦਾ ਲੋੜੀਂਦਾ ਸਕੋਰ ਲਕਸ਼ਿਤ ਕੁੱਲ ਦੌੜਾਂ ਅਤੇ ਮੌਜੂਦਾ ਕੁੱਲ ਦੌੜਾਂ ਦਾ ਅੰਤਰ ਹੁੰਦਾ ਹੈ।";
    if (mode === "findAddedMemberValueFromShift" || mode === "findRemovedMemberValueFromShift" || mode === "findReplacementValueFromShift") return "ਬਦਲਿਆ ਹੋਇਆ ਮੁੱਲ ਪੁਰਾਣੇ ਅਤੇ ਨਵੇਂ ਕੁੱਲ ਦੇ ਅੰਤਰ ਤੋਂ ਮਿਲਦਾ ਹੈ।";
    return "ਸਮੂਹ ਵਿੱਚ ਬਦਲਾਅ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹਰ ਔਸਤ ਨੂੰ ਕੁੱਲ ਵਿੱਚ ਬਦਲਣਾ ਚਾਹੀਦਾ ਹੈ।";
  }
  return "ਦਿੱਤੀ ਔਸਤ ਨੂੰ ਸੰਬੰਧਿਤ ਗਿਣਤੀ ਨਾਲ ਜੋੜ ਕੇ ਸਹੀ ਕੁੱਲ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ।";
}

function concept(pkg: Avg001QuestionPackage, language: SupportedLanguage) {
  if (language === "hi") return conceptHindi(pkg);
  if (language === "pa") return conceptPunjabi(pkg);
  return conceptEnglish(pkg);
}

function stripConclusionPrefix(value: string, language: SupportedLanguage) {
  const trimmed = value.trim();
  if (language === "en") return trimmed.replace(/^(?:Therefore|So|Hence|Thus),?\s*/i, "");
  if (language === "hi") return trimmed.replace(/^(?:अतः|इसलिए|फलतः|इस प्रकार|अर्थात)\s*/, "");
  return trimmed.replace(/^(?:ਇਸ ਲਈ|ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ|ਫਲਸਰੂਪ|ਇਸ ਪ੍ਰਕਾਰ|ਅਰਥਾਤ)\s*/, "");
}

function capitalizeFirst(value: string) {
  return value ? `${value[0]!.toUpperCase()}${value.slice(1)}` : value;
}

function conclusion(pkg: Avg001QuestionPackage, language: SupportedLanguage, originalFinal: string, index: number) {
  const content = stripConclusionPrefix(originalFinal, language);
  const frames = language === "en" ? EN_CONCLUSIONS : language === "hi" ? HI_CONCLUSIONS : PA_CONCLUSIONS;
  const frame = frames[index]!;
  return `${frame.prefix}${frame.capitalize ? capitalizeFirst(content) : content}`;
}

function fill(template: string, replacement: string) {
  return template.replace("{concept}", replacement);
}

export function applyAvg001HumanAuthoredExplanation(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  const language = languageOf(pkg);
  const numericId = Number(pkg.questionLanguageId.slice(-3));
  const zeroBasedId = Math.max(0, numericId - 1);
  const openingIndex = zeroBasedId % 23;
  const conclusionIndex = Math.floor(zeroBasedId / 23) % 19;
  const openings = language === "en" ? EN_OPENINGS : language === "hi" ? HI_OPENINGS : PA_OPENINGS;
  const existing = pkg.explanation.lines.filter((line) => line.trim());
  const originalFinal = existing.at(-1) ?? pkg.answer;
  const working = existing.length > 1 ? existing.slice(0, -1) : existing;
  const lines = [
    fill(openings[openingIndex]!, concept(pkg, language)),
    ...working,
    conclusion(pkg, language, originalFinal, conclusionIndex),
  ].slice(0, 8);

  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      explanationAuthorship: "AVG-001 deterministic human-authored presentation v2",
      explanationOpeningVariant: openingIndex,
      explanationConclusionVariant: conclusionIndex,
    },
  };
}
