import type { Avg001QuestionPackage } from "./types";

type SupportedLanguage = "en" | "hi" | "pa";

const EN_OPENINGS = [
  "A clear starting point is this: {concept}",
  "The calculation becomes simpler once we use this idea: {concept}",
  "Begin with the relationship that controls the question: {concept}",
  "The useful observation here is that {concept}",
  "First translate the given information through this rule: {concept}",
  "The cleanest route is to recognise that {concept}",
  "Before calculating, note the central relation: {concept}",
  "This question is best organised around one fact: {concept}",
  "Start from the structure of the data: {concept}",
  "A direct solution follows from the fact that {concept}",
  "The key is to keep this relationship visible: {concept}",
  "The arithmetic is straightforward after observing that {concept}",
  "Use the underlying average relation first: {concept}",
  "Rather than guessing, rebuild the quantities using this fact: {concept}",
  "The information can be connected neatly because {concept}",
  "One dependable way to proceed is this: {concept}",
  "The decisive idea is not the wording but the relation: {concept}",
  "Organise the figures around the following principle: {concept}",
  "A short exact method begins with this observation: {concept}",
  "The required value can be isolated once we note that {concept}",
  "Keep the original and required quantities linked by this rule: {concept}",
  "The most reliable first step is to use this relation: {concept}",
  "Read the data as a total-and-average relationship: {concept}",
] as const;

const HI_OPENINGS = [
  "समाधान की सही शुरुआत इस तथ्य से होती है: {concept}",
  "गणना सरल हो जाती है जब हम यह संबंध उपयोग करते हैं: {concept}",
  "पहले उस संबंध को पहचानते हैं जो प्रश्न को नियंत्रित करता है: {concept}",
  "यहाँ उपयोगी बात यह है कि {concept}",
  "दिए गए आँकड़ों को पहले इस नियम से जोड़ते हैं: {concept}",
  "सबसे सीधा तरीका इस तथ्य पर आधारित है: {concept}",
  "गणना से पहले मुख्य संबंध ध्यान में रखें: {concept}",
  "इस प्रश्न को एक मूल तथ्य के आधार पर व्यवस्थित किया जा सकता है: {concept}",
  "आँकड़ों की संरचना से शुरुआत करें: {concept}",
  "सीधा समाधान इस बात से मिलता है कि {concept}",
  "मुख्य संबंध को स्पष्ट रखना आवश्यक है: {concept}",
  "यह तथ्य पहचान लेने पर अंकगणित सरल हो जाता है: {concept}",
  "पहले औसत का मूल संबंध लागू करें: {concept}",
  "अनुमान लगाने के बजाय इस तथ्य से राशियाँ दोबारा बनाते हैं: {concept}",
  "दिए गए मान आसानी से जुड़ते हैं क्योंकि {concept}",
  "आगे बढ़ने का भरोसेमंद तरीका यह है: {concept}",
  "निर्णायक बात भाषा नहीं, यह गणितीय संबंध है: {concept}",
  "आँकड़ों को इस सिद्धांत के अनुसार व्यवस्थित करें: {concept}",
  "संक्षिप्त और सटीक विधि इस निरीक्षण से शुरू होती है: {concept}",
  "यह तथ्य उपयोग करने पर आवश्यक मान अलग किया जा सकता है: {concept}",
  "मूल और अपेक्षित राशियों को इस नियम से जोड़ें: {concept}",
  "सबसे सुरक्षित पहला कदम यह संबंध लागू करना है: {concept}",
  "दिए गए आँकड़ों को कुल और औसत के संबंध में पढ़ें: {concept}",
] as const;

const PA_OPENINGS = [
  "ਹੱਲ ਦੀ ਸਹੀ ਸ਼ੁਰੂਆਤ ਇਸ ਤੱਥ ਤੋਂ ਹੁੰਦੀ ਹੈ: {concept}",
  "ਗਣਨਾ ਸੌਖੀ ਹੋ ਜਾਂਦੀ ਹੈ ਜਦੋਂ ਅਸੀਂ ਇਹ ਸੰਬੰਧ ਵਰਤਦੇ ਹਾਂ: {concept}",
  "ਪਹਿਲਾਂ ਉਸ ਸੰਬੰਧ ਨੂੰ ਪਛਾਣਦੇ ਹਾਂ ਜੋ ਪ੍ਰਸ਼ਨ ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ: {concept}",
  "ਇੱਥੇ ਲਾਭਦਾਇਕ ਗੱਲ ਇਹ ਹੈ ਕਿ {concept}",
  "ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਨੂੰ ਪਹਿਲਾਂ ਇਸ ਨਿਯਮ ਨਾਲ ਜੋੜਦੇ ਹਾਂ: {concept}",
  "ਸਭ ਤੋਂ ਸਿੱਧਾ ਤਰੀਕਾ ਇਸ ਤੱਥ ਉੱਤੇ ਆਧਾਰਿਤ ਹੈ: {concept}",
  "ਗਣਨਾ ਤੋਂ ਪਹਿਲਾਂ ਮੁੱਖ ਸੰਬੰਧ ਧਿਆਨ ਵਿੱਚ ਰੱਖੋ: {concept}",
  "ਇਸ ਪ੍ਰਸ਼ਨ ਨੂੰ ਇੱਕ ਮੂਲ ਤੱਥ ਦੇ ਆਧਾਰ ਉੱਤੇ ਵਿਵਸਥਿਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ: {concept}",
  "ਅੰਕੜਿਆਂ ਦੀ ਬਣਤਰ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ: {concept}",
  "ਸਿੱਧਾ ਹੱਲ ਇਸ ਗੱਲ ਤੋਂ ਮਿਲਦਾ ਹੈ ਕਿ {concept}",
  "ਮੁੱਖ ਸੰਬੰਧ ਨੂੰ ਸਪਸ਼ਟ ਰੱਖਣਾ ਜ਼ਰੂਰੀ ਹੈ: {concept}",
  "ਇਹ ਤੱਥ ਪਛਾਣ ਲੈਣ ਉੱਤੇ ਹਿਸਾਬ ਸੌਖਾ ਹੋ ਜਾਂਦਾ ਹੈ: {concept}",
  "ਪਹਿਲਾਂ ਔਸਤ ਦਾ ਮੂਲ ਸੰਬੰਧ ਲਾਗੂ ਕਰੋ: {concept}",
  "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣ ਦੀ ਥਾਂ ਇਸ ਤੱਥ ਨਾਲ ਰਕਮਾਂ ਮੁੜ ਬਣਾਉਂਦੇ ਹਾਂ: {concept}",
  "ਦਿੱਤੇ ਮੁੱਲ ਆਸਾਨੀ ਨਾਲ ਜੁੜਦੇ ਹਨ ਕਿਉਂਕਿ {concept}",
  "ਅੱਗੇ ਵਧਣ ਦਾ ਭਰੋਸੇਯੋਗ ਤਰੀਕਾ ਇਹ ਹੈ: {concept}",
  "ਫੈਸਲਾਕੁਨ ਗੱਲ ਭਾਸ਼ਾ ਨਹੀਂ, ਇਹ ਗਣਿਤਕ ਸੰਬੰਧ ਹੈ: {concept}",
  "ਅੰਕੜਿਆਂ ਨੂੰ ਇਸ ਸਿਧਾਂਤ ਅਨੁਸਾਰ ਵਿਵਸਥਿਤ ਕਰੋ: {concept}",
  "ਛੋਟੀ ਅਤੇ ਸਹੀ ਵਿਧੀ ਇਸ ਨਿਰੀਖਣ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ: {concept}",
  "ਇਹ ਤੱਥ ਵਰਤਣ ਉੱਤੇ ਲੋੜੀਂਦਾ ਮੁੱਲ ਅਲੱਗ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ: {concept}",
  "ਮੂਲ ਅਤੇ ਲੋੜੀਂਦੀਆਂ ਰਕਮਾਂ ਨੂੰ ਇਸ ਨਿਯਮ ਨਾਲ ਜੋੜੋ: {concept}",
  "ਸਭ ਤੋਂ ਸੁਰੱਖਿਅਤ ਪਹਿਲਾ ਕਦਮ ਇਹ ਸੰਬੰਧ ਲਾਗੂ ਕਰਨਾ ਹੈ: {concept}",
  "ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਨੂੰ ਕੁੱਲ ਅਤੇ ਔਸਤ ਦੇ ਸੰਬੰਧ ਵਿੱਚ ਪੜ੍ਹੋ: {concept}",
] as const;

const EN_BRIDGES = [
  "A reconstruction of {context} gives the same result.",
  "The units in {context} remain consistent throughout the calculation.",
  "This uses the exact figures from {context}, without an unweighted shortcut.",
  "The independent check on {context} reaches the same value.",
  "Reading the result back into {context} confirms the arithmetic.",
  "The count and the measured quantity in {context} are handled together here.",
  "This step keeps the original information in {context} separate from the required result.",
  "The calculation preserves the scale of {context} from beginning to end.",
  "Substituting the result into {context} reproduces the stated average.",
  "No data from {context} is omitted in this reconstruction.",
  "The same value is obtained when {context} is checked from the total side.",
  "This interpretation matches both the wording and the units of {context}.",
  "The arithmetic therefore remains tied to the actual situation in {context}.",
  "A reverse check using {context} verifies the computed value.",
  "The result is consistent with every quantity supplied in {context}.",
  "This avoids treating the figures in {context} as if they were equally weighted when they are not.",
  "The calculation and the independent verifier agree for {context}.",
  "The final figure fits the numerical range of {context}.",
  "Using the result in the original relation for {context} restores the given data.",
  "The operation is applied to the whole of {context}, not to an isolated number.",
  "This keeps the required quantity aligned with the data in {context}.",
  "The reconstructed values for {context} balance exactly.",
  "A final total-based check confirms the interpretation of {context}.",
] as const;

const HI_BRIDGES = [
  "{context} को दोबारा बनाकर जाँचने पर यही परिणाम मिलता है।",
  "पूरी गणना में {context} की इकाइयाँ एक जैसी रहती हैं।",
  "यह चरण {context} के वास्तविक आँकड़ों का उपयोग करता है, किसी असंगत शॉर्टकट का नहीं।",
  "{context} की स्वतंत्र जाँच भी यही मान देती है।",
  "परिणाम को {context} में वापस रखने पर गणना सही बैठती है।",
  "यहाँ {context} की संख्या और मापी गई राशि को साथ रखा गया है।",
  "इस चरण में {context} की मूल सूचना और अपेक्षित परिणाम अलग-अलग स्पष्ट रहते हैं।",
  "गणना शुरू से अंत तक {context} का सही पैमाना बनाए रखती है।",
  "प्राप्त मान को {context} में रखने पर दिया गया औसत फिर मिल जाता है।",
  "इस पुनर्निर्माण में {context} का कोई आँकड़ा छोड़ा नहीं गया है।",
  "{context} को कुल के आधार पर जाँचने पर भी यही मान मिलता है।",
  "यह व्याख्या {context} की भाषा और इकाइयों दोनों से मेल खाती है।",
  "इसलिए अंकगणित {context} की वास्तविक स्थिति से जुड़ा रहता है।",
  "{context} की उलटी जाँच निकाले गए मान की पुष्टि करती है।",
  "प्राप्त परिणाम {context} में दिए गए प्रत्येक मान के अनुरूप है।",
  "यह विधि {context} के मानों को गलत ढंग से समान भार नहीं देती।",
  "{context} के लिए गणना और स्वतंत्र सत्यापन एक ही उत्तर देते हैं।",
  "अंतिम मान {context} की संख्यात्मक सीमा के अनुकूल है।",
  "प्राप्त मान को {context} के मूल संबंध में रखने पर दिए गए आँकड़े वापस मिलते हैं।",
  "क्रिया {context} की पूरी राशि पर लागू की गई है, किसी अकेले मान पर नहीं।",
  "यह चरण अपेक्षित राशि को {context} के आँकड़ों के साथ सही रखता है।",
  "{context} के पुनर्निर्मित मान पूरी तरह संतुलित हैं।",
  "कुल के आधार पर अंतिम जाँच {context} की व्याख्या की पुष्टि करती है।",
] as const;

const PA_BRIDGES = [
  "{context} ਨੂੰ ਮੁੜ ਬਣਾਕੇ ਜਾਂਚਣ ਉੱਤੇ ਇਹੀ ਨਤੀਜਾ ਮਿਲਦਾ ਹੈ।",
  "ਪੂਰੀ ਗਣਨਾ ਵਿੱਚ {context} ਦੀਆਂ ਇਕਾਈਆਂ ਇੱਕੋ ਜਿਹੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ।",
  "ਇਹ ਕਦਮ {context} ਦੇ ਅਸਲ ਅੰਕੜੇ ਵਰਤਦਾ ਹੈ, ਕਿਸੇ ਗਲਤ ਛੋਟੇ ਰਸਤੇ ਨੂੰ ਨਹੀਂ।",
  "{context} ਦੀ ਸੁਤੰਤਰ ਜਾਂਚ ਵੀ ਇਹੀ ਮੁੱਲ ਦਿੰਦੀ ਹੈ।",
  "ਨਤੀਜੇ ਨੂੰ {context} ਵਿੱਚ ਵਾਪਸ ਰੱਖਣ ਉੱਤੇ ਹਿਸਾਬ ਸਹੀ ਬੈਠਦਾ ਹੈ।",
  "ਇੱਥੇ {context} ਦੀ ਗਿਣਤੀ ਅਤੇ ਮਾਪੀ ਗਈ ਰਕਮ ਨੂੰ ਇਕੱਠੇ ਰੱਖਿਆ ਗਿਆ ਹੈ।",
  "ਇਸ ਕਦਮ ਵਿੱਚ {context} ਦੀ ਮੂਲ ਜਾਣਕਾਰੀ ਅਤੇ ਲੋੜੀਂਦਾ ਨਤੀਜਾ ਸਪਸ਼ਟ ਤੌਰ ਉੱਤੇ ਵੱਖ ਰਹਿੰਦੇ ਹਨ।",
  "ਗਣਨਾ ਸ਼ੁਰੂ ਤੋਂ ਅੰਤ ਤੱਕ {context} ਦਾ ਸਹੀ ਪੈਮਾਨਾ ਬਣਾਈ ਰੱਖਦੀ ਹੈ।",
  "ਮਿਲੇ ਮੁੱਲ ਨੂੰ {context} ਵਿੱਚ ਰੱਖਣ ਉੱਤੇ ਦਿੱਤੀ ਔਸਤ ਮੁੜ ਮਿਲ ਜਾਂਦੀ ਹੈ।",
  "ਇਸ ਮੁੜ-ਨਿਰਮਾਣ ਵਿੱਚ {context} ਦਾ ਕੋਈ ਅੰਕੜਾ ਛੱਡਿਆ ਨਹੀਂ ਗਿਆ।",
  "{context} ਨੂੰ ਕੁੱਲ ਦੇ ਆਧਾਰ ਉੱਤੇ ਜਾਂਚਣ ਨਾਲ ਵੀ ਇਹੀ ਮੁੱਲ ਮਿਲਦਾ ਹੈ।",
  "ਇਹ ਵਿਆਖਿਆ {context} ਦੀ ਭਾਸ਼ਾ ਅਤੇ ਇਕਾਈਆਂ ਦੋਵਾਂ ਨਾਲ ਮਿਲਦੀ ਹੈ।",
  "ਇਸ ਲਈ ਹਿਸਾਬ {context} ਦੀ ਅਸਲ ਸਥਿਤੀ ਨਾਲ ਜੁੜਿਆ ਰਹਿੰਦਾ ਹੈ।",
  "{context} ਦੀ ਉਲਟੀ ਜਾਂਚ ਕੱਢੇ ਗਏ ਮੁੱਲ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦੀ ਹੈ।",
  "ਮਿਲਿਆ ਨਤੀਜਾ {context} ਵਿੱਚ ਦਿੱਤੇ ਹਰ ਮੁੱਲ ਦੇ ਅਨੁਕੂਲ ਹੈ।",
  "ਇਹ ਵਿਧੀ {context} ਦੇ ਮੁੱਲਾਂ ਨੂੰ ਗਲਤ ਢੰਗ ਨਾਲ ਇੱਕੋ ਭਾਰ ਨਹੀਂ ਦਿੰਦੀ।",
  "{context} ਲਈ ਗਣਨਾ ਅਤੇ ਸੁਤੰਤਰ ਜਾਂਚ ਇੱਕੋ ਉੱਤਰ ਦਿੰਦੀਆਂ ਹਨ।",
  "ਅੰਤਿਮ ਮੁੱਲ {context} ਦੀ ਅੰਕੀ ਸੀਮਾ ਦੇ ਅਨੁਕੂਲ ਹੈ।",
  "ਮਿਲੇ ਮੁੱਲ ਨੂੰ {context} ਦੇ ਮੂਲ ਸੰਬੰਧ ਵਿੱਚ ਰੱਖਣ ਉੱਤੇ ਦਿੱਤੇ ਅੰਕੜੇ ਮੁੜ ਮਿਲਦੇ ਹਨ।",
  "ਕਿਰਿਆ {context} ਦੀ ਪੂਰੀ ਰਕਮ ਉੱਤੇ ਲਾਗੂ ਕੀਤੀ ਗਈ ਹੈ, ਕਿਸੇ ਇਕੱਲੇ ਮੁੱਲ ਉੱਤੇ ਨਹੀਂ।",
  "ਇਹ ਕਦਮ ਲੋੜੀਂਦੀ ਰਕਮ ਨੂੰ {context} ਦੇ ਅੰਕੜਿਆਂ ਨਾਲ ਸਹੀ ਰੱਖਦਾ ਹੈ।",
  "{context} ਦੇ ਮੁੜ ਬਣਾਏ ਮੁੱਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੰਤੁਲਿਤ ਹਨ।",
  "ਕੁੱਲ ਦੇ ਆਧਾਰ ਉੱਤੇ ਅੰਤਿਮ ਜਾਂਚ {context} ਦੀ ਵਿਆਖਿਆ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦੀ ਹੈ।",
] as const;

function languageOf(pkg: Avg001QuestionPackage): SupportedLanguage {
  if (pkg.language === "hi" || pkg.language === "pa") return pkg.language;
  return "en";
}

function concept(pkg: Avg001QuestionPackage, language: SupportedLanguage) {
  const cp = pkg.canonicalProblemId;
  const mode = pkg.solveMode;
  if (language === "en") {
    if (cp === "AVG-CP-001") {
      if (mode === "findSumFromAverageAndCount") return "total equals average multiplied by count.";
      if (mode === "findAverageFromSumAndCount") return "average equals total divided by count.";
      if (mode === "findCountFromSumAndAverage") return "count equals total divided by average.";
      if (mode === "findMissingValueFromAverage") return "the missing value is the required total minus the known subtotal.";
      return "a uniform change in every observation produces the same change in the average.";
    }
    if (cp === "AVG-CP-002") return "equally spaced values are symmetric about their average.";
    if (cp === "AVG-CP-003") return "the group total must be rebuilt before and after the member or value changes.";
    if (cp === "AVG-CP-004") return /Speed/i.test(mode)
      ? "average speed must be calculated from total distance and total time."
      : "each group contributes through its own total, so the group sizes provide the weights.";
    if (cp === "AVG-CP-005") return "the recorded total must be corrected before the average is recomputed.";
    return "the lower-level totals should be combined first and the required higher-level average found afterwards.";
  }
  if (language === "hi") {
    if (cp === "AVG-CP-001") {
      if (mode === "findSumFromAverageAndCount") return "कुल = औसत × संख्या।";
      if (mode === "findAverageFromSumAndCount") return "औसत = कुल ÷ संख्या।";
      if (mode === "findCountFromSumAndAverage") return "संख्या = कुल ÷ औसत।";
      if (mode === "findMissingValueFromAverage") return "लापता मान = अपेक्षित कुल - ज्ञात उप-कुल।";
      return "हर प्रेक्षण में एक जैसा परिवर्तन होने पर औसत भी उसी नियम से बदलता है।";
    }
    if (cp === "AVG-CP-002") return "समान अंतर वाले मान अपने औसत के दोनों ओर सममित होते हैं।";
    return "किसी मान के जुड़ने, हटने या बदलने पर पहले और बाद का कुल अलग-अलग बनाना चाहिए।";
  }
  if (cp === "AVG-CP-001") {
    if (mode === "findSumFromAverageAndCount") return "ਕੁੱਲ = ਔਸਤ × ਗਿਣਤੀ।";
    if (mode === "findAverageFromSumAndCount") return "ਔਸਤ = ਕੁੱਲ ÷ ਗਿਣਤੀ।";
    if (mode === "findCountFromSumAndAverage") return "ਗਿਣਤੀ = ਕੁੱਲ ÷ ਔਸਤ।";
    if (mode === "findMissingValueFromAverage") return "ਗੁੰਮ ਮੁੱਲ = ਲੋੜੀਂਦਾ ਕੁੱਲ - ਜਾਣਿਆ ਉਪ-ਕੁੱਲ।";
    return "ਹਰ ਮੁੱਲ ਵਿੱਚ ਇੱਕੋ ਜਿਹਾ ਬਦਲਾਅ ਹੋਣ ਉੱਤੇ ਔਸਤ ਵੀ ਉਸੇ ਨਿਯਮ ਨਾਲ ਬਦਲਦੀ ਹੈ।";
  }
  if (cp === "AVG-CP-002") return "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਮੁੱਲ ਆਪਣੀ ਔਸਤ ਦੇ ਦੋਵੇਂ ਪਾਸੇ ਸਮਮਿਤ ਹੁੰਦੇ ਹਨ।";
  return "ਕਿਸੇ ਮੁੱਲ ਦੇ ਜੁੜਨ, ਹਟਣ ਜਾਂ ਬਦਲਣ ਉੱਤੇ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦਾ ਕੁੱਲ ਵੱਖ-ਵੱਖ ਬਣਾਉਣਾ ਚਾਹੀਦਾ ਹੈ।";
}

function context(pkg: Avg001QuestionPackage, language: SupportedLanguage) {
  const domain = pkg.parameters.contextDomain;
  const maps = {
    en: {
      Abstract: "the numerical data", Classroom: "the marks data", Education: "the class data",
      Workplace: "the salary or workforce figures", Workforce: "the workforce figures", Factory: "the production figures",
      Production: "the production figures", Household: "the weight or household data", Commerce: "the sales or price data",
      Finance: "the financial data", Family: "the family-age data", Sports: "the sports data", Travel: "the journey data",
      Demography: "the age data", Statistics: "the statistical data", Measurement: "the recorded measurements",
      Administration: "the recorded data", Geography: "the geographical data",
    },
    hi: {
      Abstract: "संख्यात्मक आँकड़ों", Classroom: "अंकों के आँकड़ों", Education: "कक्षा के आँकड़ों",
      Workplace: "वेतन या कार्यबल के आँकड़ों", Workforce: "कार्यबल के आँकड़ों", Factory: "उत्पादन के आँकड़ों",
      Production: "उत्पादन के आँकड़ों", Household: "वजन या घरेलू आँकड़ों", Commerce: "बिक्री या कीमत के आँकड़ों",
      Finance: "वित्तीय आँकड़ों", Family: "परिवार की आयु के आँकड़ों", Sports: "खेल के आँकड़ों", Travel: "यात्रा के आँकड़ों",
      Demography: "आयु के आँकड़ों", Statistics: "सांख्यिकीय आँकड़ों", Measurement: "दर्ज मापों",
      Administration: "दर्ज आँकड़ों", Geography: "भौगोलिक आँकड़ों",
    },
    pa: {
      Abstract: "ਅੰਕੀ ਅੰਕੜਿਆਂ", Classroom: "ਅੰਕਾਂ ਦੇ ਅੰਕੜਿਆਂ", Education: "ਜਮਾਤ ਦੇ ਅੰਕੜਿਆਂ",
      Workplace: "ਤਨਖਾਹ ਜਾਂ ਕਾਰਜ-ਦਲ ਦੇ ਅੰਕੜਿਆਂ", Workforce: "ਕਾਰਜ-ਦਲ ਦੇ ਅੰਕੜਿਆਂ", Factory: "ਉਤਪਾਦਨ ਦੇ ਅੰਕੜਿਆਂ",
      Production: "ਉਤਪਾਦਨ ਦੇ ਅੰਕੜਿਆਂ", Household: "ਵਜ਼ਨ ਜਾਂ ਘਰੇਲੂ ਅੰਕੜਿਆਂ", Commerce: "ਵਿਕਰੀ ਜਾਂ ਕੀਮਤ ਦੇ ਅੰਕੜਿਆਂ",
      Finance: "ਵਿੱਤੀ ਅੰਕੜਿਆਂ", Family: "ਪਰਿਵਾਰ ਦੀ ਉਮਰ ਦੇ ਅੰਕੜਿਆਂ", Sports: "ਖੇਡ ਦੇ ਅੰਕੜਿਆਂ", Travel: "ਯਾਤਰਾ ਦੇ ਅੰਕੜਿਆਂ",
      Demography: "ਉਮਰ ਦੇ ਅੰਕੜਿਆਂ", Statistics: "ਅੰਕੜਾ-ਵਿਗਿਆਨਕ ਡਾਟੇ", Measurement: "ਦਰਜ ਮਾਪਾਂ",
      Administration: "ਦਰਜ ਅੰਕੜਿਆਂ", Geography: "ਭੂਗੋਲਿਕ ਅੰਕੜਿਆਂ",
    },
  } as const;
  return maps[language][domain as keyof (typeof maps)[typeof language]] ?? maps[language].Abstract;
}

function target(pkg: Avg001QuestionPackage, language: SupportedLanguage) {
  const mode = pkg.solveMode;
  if (language === "en") {
    if (/Speed/i.test(mode)) return "average speed";
    if (/Ratio/i.test(mode)) return "group-size ratio";
    if (/Count|TermCount/i.test(mode) || pkg.parameters.answerType === "COUNT") return "required count";
    if (/Difference/i.test(mode)) return "common difference";
    if (/Extreme/i.test(mode)) return "required extreme value";
    if (/Missing|AddedMember|RemovedMember|ReplacementValue|InningsValue/i.test(mode)) return "required value";
    if (/Sum|Total/i.test(mode) || pkg.parameters.answerType === "TOTAL") return "required total";
    if (pkg.canonicalProblemId === "AVG-CP-005") return "corrected average";
    return "required average";
  }
  if (language === "hi") {
    if (/Count|TermCount/i.test(mode) || pkg.parameters.answerType === "COUNT") return "आवश्यक संख्या";
    if (/Difference/i.test(mode)) return "समान अंतर";
    if (/Extreme/i.test(mode)) return "आवश्यक चरम मान";
    if (/Missing|AddedMember|RemovedMember|ReplacementValue|InningsValue/i.test(mode)) return "आवश्यक मान";
    if (/Sum|Total/i.test(mode) || pkg.parameters.answerType === "TOTAL") return "आवश्यक कुल";
    return "आवश्यक औसत";
  }
  if (/Count|TermCount/i.test(mode) || pkg.parameters.answerType === "COUNT") return "ਲੋੜੀਂਦੀ ਗਿਣਤੀ";
  if (/Difference/i.test(mode)) return "ਸਾਂਝਾ ਅੰਤਰ";
  if (/Extreme/i.test(mode)) return "ਲੋੜੀਂਦਾ ਅੰਤਲਾ ਮੁੱਲ";
  if (/Missing|AddedMember|RemovedMember|ReplacementValue|InningsValue/i.test(mode)) return "ਲੋੜੀਂਦਾ ਮੁੱਲ";
  if (/Sum|Total/i.test(mode) || pkg.parameters.answerType === "TOTAL") return "ਲੋੜੀਂਦਾ ਕੁੱਲ";
  return "ਲੋੜੀਂਦੀ ਔਸਤ";
}

function conclusion(pkg: Avg001QuestionPackage, language: SupportedLanguage, variant: number) {
  const answer = pkg.answer;
  const required = target(pkg, language);
  if (language === "en") {
    const frames = [
      `Therefore, the ${required} is ${answer}.`,
      `Hence, ${answer} is the ${required}.`,
      `So the question's ${required} comes to ${answer}.`,
      `Thus, the computed ${required} is ${answer}.`,
      `Accordingly, the ${required} equals ${answer}.`,
    ];
    return frames[variant % frames.length]!;
  }
  if (language === "hi") {
    const frames = [
      `अतः ${required} ${answer} है।`,
      `इसलिए ${answer} ही ${required} है।`,
      `फलतः प्रश्न का ${required} ${answer} आता है।`,
      `इस प्रकार निकाला गया ${required} ${answer} है।`,
      `अर्थात ${required} = ${answer}।`,
    ];
    return frames[variant % frames.length]!;
  }
  const frames = [
    `ਇਸ ਲਈ ${required} ${answer} ਹੈ।`,
    `ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ${answer} ਹੀ ${required} ਹੈ।`,
    `ਫਲਸਰੂਪ ਪ੍ਰਸ਼ਨ ਦਾ ${required} ${answer} ਆਉਂਦਾ ਹੈ।`,
    `ਇਸ ਤਰੀਕੇ ਨਾਲ ਕੱਢਿਆ ${required} ${answer} ਹੈ।`,
    `ਅਰਥਾਤ ${required} = ${answer}।`,
  ];
  return frames[variant % frames.length]!;
}

function arithmeticLine(line: string) {
  return /\$\$|\\times|\\div|×|÷|[+\-]=?|=/.test(line);
}

function selectWorkingLines(pkg: Avg001QuestionPackage) {
  const existing = pkg.explanation.lines.filter((line) => line.trim());
  const withoutFinal = existing.filter((line, index) => index !== existing.length - 1 || !line.includes(pkg.answer));
  const math = withoutFinal.filter(arithmeticLine);
  const prose = withoutFinal.filter((line) => !arithmeticLine(line));
  const desired = pkg.difficultyBand === "Easy" ? 2 : 3;
  const selected = [...math, ...prose].slice(0, desired);
  while (selected.length < desired && existing[selected.length]) selected.push(existing[selected.length]!);
  return selected.slice(0, desired);
}

function fill(frame: string, replacements: Record<string, string>) {
  return Object.entries(replacements).reduce((value, [key, replacement]) => value.replaceAll(`{${key}}`, replacement), frame);
}

export function applyAvg001HumanAuthoredExplanation(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  const language = languageOf(pkg);
  const numericId = Number(pkg.questionLanguageId.slice(-3));
  const openingIndex = numericId % 23;
  const bridgeIndex = Math.floor(numericId / 23) % 23;
  const conclusionIndex = Math.floor(numericId / (23 * 23)) + numericId;
  const openings = language === "en" ? EN_OPENINGS : language === "hi" ? HI_OPENINGS : PA_OPENINGS;
  const bridges = language === "en" ? EN_BRIDGES : language === "hi" ? HI_BRIDGES : PA_BRIDGES;
  const opening = fill(openings[openingIndex]!, { concept: concept(pkg, language) });
  const bridge = fill(bridges[bridgeIndex]!, { context: context(pkg, language) });
  const lines = [opening, ...selectWorkingLines(pkg), bridge, conclusion(pkg, language, conclusionIndex)];
  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      explanationAuthorship: "AVG-001 deterministic human-authored presentation v1",
      explanationOpeningVariant: openingIndex,
      explanationBridgeVariant: bridgeIndex,
    },
  };
}
