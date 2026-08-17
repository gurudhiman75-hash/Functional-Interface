import {
  SAP_LOCALIZATION_LIFECYCLE,
  SAP_LOCALIZATION_VERSION,
  type SapLocalizationValidation,
  type SapTranslationLanguage,
} from "./types";

const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const PROTECTED_MATH = /\\\([\s\S]*?\\\)/gu;

function preserveMath(text: string, language: SapTranslationLanguage) {
  const localizedMathText = text.replace(
    /\\text\{\s*of\s*\}/giu,
    language === "hi" ? "\\text{ का }" : "\\text{ ਦਾ }",
  );
  const math: string[] = [];
  const masked = localizedMathText.replace(PROTECTED_MATH, (value) => {
    const token = `§MATH${math.length}§`;
    math.push(value);
    return token;
  });
  return {
    masked,
    restore(value: string) {
      return value.replace(/§MATH(\d+)§/gu, (_match, index) => math[Number(index)] ?? "");
    },
  };
}

function phraseReplace(text: string, pairs: readonly (readonly [string, string])[]) {
  let out = text;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}

const HI_PHRASES = [
  ["What is the exact value of", "का सटीक मान क्या है"],
  ["Give the answer in lowest terms", "उत्तर को न्यूनतम रूप में लिखिए"],
  ["Give the answer as a reduced fraction", "उत्तर को सरल भिन्न के रूप में लिखिए"],
  ["Give the answer as a decimal", "उत्तर दशमलव में लिखिए"],
  ["using the correct fraction operations", "सही भिन्न संक्रियाओं का उपयोग करके"],
  ["Find the simplified value of the following fraction expression", "निम्न भिन्न व्यंजक का सरल मान ज्ञात कीजिए"],
  ["Simplify the following expression and give the answer in lowest terms", "निम्न व्यंजक को सरल कीजिए और उत्तर न्यूनतम रूप में लिखिए"],
  ["Complete the exact fraction equality", "सटीक भिन्न समानता को पूरा कीजिए"],
  ["Which value makes the following fraction equality true", "कौन-सा मान निम्न भिन्न समानता को सत्य बनाता है"],
  ["Choose the correct relation between A and B", "A और B के बीच सही संबंध चुनिए"],
  ["select the equivalent fraction in lowest terms", "न्यूनतम रूप में समतुल्य भिन्न चुनिए"],
  ["Which is the first step that changes the value of the expression", "कौन-सा पहला चरण व्यंजक का मान बदल देता है"],
  ["Which is the first incorrect step", "पहला गलत चरण कौन-सा है"],
  ["Identify the earliest incorrect step", "सबसे पहला गलत चरण पहचानिए"],
  ["Which option shows the correct grouping of", "कौन-सा विकल्प सही समूहबद्ध रूप दिखाता है"],
  ["Which of the following is a valid first step in simplifying", "निम्न में से कौन-सा सरल करने का सही पहला चरण है"],
  ["Without changing the grouping, compare", "समूहबद्धता बदले बिना तुलना कीजिए"],
  ["After replacing", "को प्रतिस्थापित करने के बाद"],
  ["what value is obtained", "कौन-सा मान प्राप्त होता है"],
  ["Find the percentage represented by", "से दर्शाया गया प्रतिशत ज्ञात कीजिए"],
  ["where m and n are positive numbers", "जहाँ m और n धनात्मक संख्याएँ हैं"],
  ["Which relation between A and B must be true", "A और B के बीच कौन-सा संबंध अवश्य सत्य है"],
  ["Ignoring decimal points", "दशमलव बिंदुओं को अस्थायी रूप से हटाकर"],
  ["Which option places the decimal point correctly for", "कौन-सा विकल्प दशमलव बिंदु को सही स्थान पर रखता है"],
  ["A student records the following working for", "एक विद्यार्थी ने इसके लिए निम्न हल लिखा"],
  ["A student evaluates", "एक विद्यार्थी इसका मान निकालता है"],
  ["Which non-negative integer exponent makes", "कौन-सा गैर-ऋणात्मक पूर्णांक घातांक"],
  ["true", "सत्य बनाता है"],
  ["If x has exact fourth root", "यदि x का सटीक चौथा मूल"],
  ["find x", "x ज्ञात कीजिए"],
  ["Choose the correct comparison between", "के बीच सही तुलना चुनिए"],
  ["by extracting the common factor before dividing", "भाग देने से पहले सार्व गुणनखंड निकालकर"],
  ["without expanding both factorials completely", "दोनों फैक्टोरियल को पूरा फैलाए बिना"],
  ["without multiplying large numbers first", "पहले बड़ी संख्याओं का गुणा किए बिना"],
  ["by compressing the repeated block first", "दोहराए गए खंड को पहले संक्षिप्त करके"],
  ["which first step most directly avoids unnecessary large multiplication", "कौन-सा पहला चरण अनावश्यक बड़े गुणा से सबसे सीधे बचाता है"],
  ["Which statement is correct", "कौन-सा कथन सही है"],
  ["Which simplification statement is correct", "कौन-सा सरलीकरण कथन सही है"],
  ["Which candidate value of x makes", "x का कौन-सा प्रत्याशी मान"],
  ["exactly true", "को ठीक-ठीक सत्य बनाता है"],
  ["Which option is correct", "कौन-सा विकल्प सही है"],
  ["Can x be determined uniquely", "क्या x को एकमात्र रूप से निर्धारित किया जा सकता है"],
  ["Round every displayed term", "हर दिए गए पद को पूर्णांकित कीजिए"],
  ["round every displayed term", "हर दिए गए पद को पूर्णांकित कीजिए"],
  ["to the nearest thousand", "निकटतम हजार तक"],
  ["to the nearest hundred", "निकटतम सौ तक"],
  ["to the nearest ten", "निकटतम दस तक"],
  ["to the nearest integer", "निकटतम पूर्णांक तक"],
  ["to the nearest whole number", "निकटतम पूर्णांक तक"],
  ["to 1 decimal place", "1 दशमलव स्थान तक"],
  ["to 2 decimal places", "2 दशमलव स्थान तक"],
  ["to 3 significant figures", "3 सार्थक अंकों तक"],
  ["if a value is exactly halfway, round away from zero", "यदि मान ठीक आधे पर हो तो शून्य से दूर की ओर पूर्णांकित करें"],
  ["which digit decides whether the number rounds up or down", "कौन-सा अंक तय करता है कि संख्या ऊपर या नीचे पूर्णांकित होगी"],
  ["Which is the correct representation of", "का सही पूर्णांकित रूप कौन-सा है"],
  ["Which range of integer values", "पूर्णांक मानों की कौन-सी सीमा"],
  ["Which interval contains exactly all possible original values", "कौन-सा अंतराल सभी संभावित मूल मानों को ठीक-ठीक समाहित करता है"],
  ["What is the least integer that", "सबसे छोटा पूर्णांक कौन-सा है जो"],
  ["What is the greatest integer that", "सबसे बड़ा पूर्णांक कौन-सा है जो"],
  ["Which digit can replace", "कौन-सा अंक इसके स्थान पर आ सकता है"],
  ["What is the absolute rounding error", "पूर्णांकन की निरपेक्ष त्रुटि क्या है"],
  ["What is the maximum possible absolute rounding error", "अधिकतम संभावित निरपेक्ष पूर्णांकन त्रुटि क्या है"],
  ["What is the relative rounding error", "सापेक्ष पूर्णांकन त्रुटि क्या है"],
  ["written as a fraction of the original value", "मूल मान के भिन्न के रूप में"],
  ["Which diagnosis is correct", "कौन-सा निदान सही है"],
  ["Before evaluating", "गणना करने से पहले"],
  ["before doing the arithmetic", "गणना करने से पहले"],
  ["For this estimate", "इस अनुमान के लिए"],
  ["For a quick sum estimate", "त्वरित योग अनुमान के लिए"],
  ["Which pair should replace the two numbers", "इन दोनों संख्याओं के स्थान पर कौन-सी जोड़ी लेनी चाहिए"],
  ["First round every displayed term", "पहले हर दिए गए पद को पूर्णांकित कीजिए"],
  ["For estimation, first replace", "अनुमान के लिए पहले प्रतिस्थापित कीजिए"],
  ["Round all displayed terms", "सभी दिए गए पदों को पूर्णांकित कीजिए"],
  ["round both terms", "दोनों पदों को पूर्णांकित कीजिए"],
  ["If the estimated sum is", "यदि अनुमानित योग"],
  ["If the estimated difference is", "यदि अनुमानित अंतर"],
  ["what is the rounded value of", "तो इसका पूर्णांकित मान क्या है"],
  ["Which option is closest to the resulting estimate", "कौन-सा विकल्प प्राप्त अनुमान के सबसे निकट है"],
  ["Which interval must contain their exact sum", "कौन-से अंतराल में उनका सटीक योग अवश्य होगा"],
  ["Which interval must contain the exact value of the first number minus the second", "कौन-से अंतराल में पहली संख्या में से दूसरी घटाने का सटीक मान अवश्य होगा"],
  ["Compared with the exact sum", "सटीक योग की तुलना में"],
  ["is this estimate an overestimate or an underestimate", "क्या यह अनुमान अधिक है या कम"],
  ["Round every addend", "हर जोड़ पद को पूर्णांकित कीजिए"],
  ["Estimate after rounding each factor", "हर गुणनखंड को पूर्णांकित करने के बाद अनुमान लगाइए"],
  ["Using nearest whole number rounded values", "निकटतम पूर्णांक वाले मानों का उपयोग करके"],
  ["Using the rounded values", "पूर्णांकित मानों का उपयोग करके"],
  ["Find", "ज्ञात कीजिए"],
  ["approximately", "लगभग"],
  ["Approximately what percent of", "लगभग कितने प्रतिशत"],
  ["Using cancellation and nearest-ten values", "काट-छाँट और निकटतम-दस मानों का उपयोग करके"],
  ["Using rounded values", "पूर्णांकित मानों का उपयोग करके"],
  ["What rounded value should replace", "कौन-सा पूर्णांकित मान इसके स्थान पर होना चाहिए"],
  ["What rounded divisor should replace", "कौन-सा पूर्णांकित भाजक इसके स्थान पर होना चाहिए"],
  ["Which option is nearest to", "कौन-सा विकल्प इसके सबसे निकट है"],
  ["Compare the two approximate ratios", "दोनों अनुमानित अनुपातों की तुलना कीजिए"],
  ["Which interval must contain their exact product", "कौन-से अंतराल में उनका सटीक गुणनफल अवश्य होगा"],
  ["Which interval must contain the exact quotient", "कौन-से अंतराल में सटीक भागफल अवश्य होगा"],
  ["What is the error", "त्रुटि क्या है"],
  ["Which is the safer estimate using nearest hundreds", "निकटतम सैकड़ों का उपयोग करते हुए अधिक सुरक्षित अनुमान कौन-सा है"],
  ["Without doing the full multiplication", "पूरा गुणा किए बिना"],
  ["decide whether the estimated product is an overestimate or an underestimate", "बताइए कि अनुमानित गुणनफल अधिक अनुमान है या कम अनुमान"],
  ["Between which two consecutive integers does", "किन दो क्रमागत पूर्णांकों के बीच"],
  ["is nearest to which integer", "किस पूर्णांक के सबसे निकट है"],
  ["What is the greatest integer less than", "से छोटा सबसे बड़ा पूर्णांक क्या है"],
  ["Which fraction best estimates", "कौन-सा भिन्न सबसे अच्छा अनुमान देता है"],
  ["by taking each square root to the nearest integer", "हर वर्गमूल को निकटतम पूर्णांक मानकर"],
  ["Take", "लीजिए"],
  ["Which value below", "से कम कौन-सा मान"],
  ["has a square root nearest to", "का वर्गमूल इसके सबसे निकट है"],
  ["A number is", "एक संख्या"],
  ["less than an integer", "एक पूर्णांक से कम है"],
  ["After squaring the rounded value", "पूर्णांकित मान का वर्ग करने पर"],
  ["Which option could be the original number", "मूल संख्या कौन-सा विकल्प हो सकती है"],
  ["Which option is nearest to", "कौन-सा विकल्प इसके सबसे निकट है"],
  ["If A =", "यदि A ="],
  ["compare A and B", "A और B की तुलना कीजिए"],
  ["Which correction is appropriate", "कौन-सा सुधार उचित है"],
  ["Which option is closest to the value of", "कौन-सा विकल्प इसके मान के सबसे निकट है"],
  ["The value of", "का मान"],
  ["is nearest to which multiple of 10", "10 के किस गुणज के सबसे निकट है"],
  ["The exact value of an arithmetic expression is", "एक अंकगणितीय व्यंजक का सटीक मान"],
  ["while a quick estimate gives", "जबकि त्वरित अनुमान"],
  ["What is the absolute error", "निरपेक्ष त्रुटि क्या है"],
  ["An expression has exact value", "एक व्यंजक का सटीक मान"],
  ["but it was estimated as", "है, पर उसका अनुमान"],
  ["What is the percentage error in the estimate", "अनुमान में प्रतिशत त्रुटि क्या है"],
  ["This estimate is best described as", "इस अनुमान का सही वर्णन है"],
  ["Two estimates are", "दो अनुमान हैं"],
  ["A positive number", "एक धनात्मक संख्या"],
  ["Which is the tightest interval that must contain", "सबसे कड़ा अंतराल कौन-सा है जिसमें"],
  ["Which option is within", "कौन-सा विकल्प"],
  ["of the exact value", "सटीक मान की सीमा के भीतर है"],
  ["is known to lie between", "के बीच होना ज्ञात है"],
  ["Which option is guaranteed to be the nearest for every value in this interval", "इस अंतराल के हर मान के लिए कौन-सा विकल्प निश्चित रूप से सबसे निकट है"],
  ["is known only to lie between", "केवल इतना ज्ञात है कि वह इनके बीच है"],
  ["What can be concluded", "क्या निष्कर्ष निकाला जा सकता है"],
  ["What approximate value should come in place of", "इसके स्थान पर लगभग कौन-सा मान आएगा"],
  ["What approximate value should replace", "इसके स्थान पर लगभग कौन-सा मान होना चाहिए"],
  ["For integer", "पूर्णांक के लिए"],
  ["which option makes", "कौन-सा विकल्प"],
  ["lie within", "को सीमा के भीतर रखता है"],
  ["An approximate calculation requires integer", "एक अनुमानित गणना में पूर्णांक"],
  ["How many integer values of", "इसके कितने पूर्णांक मान"],
  ["are admissible", "स्वीकार्य हैं"],
  ["must lie in the approximation band", "अनुमान सीमा में होना चाहिए"],
  ["How should the outcome be classified", "परिणाम को कैसे वर्गीकृत किया जाना चाहिए"],
  ["is rounded to the nearest integer before evaluating", "की गणना से पहले निकटतम पूर्णांक तक पूर्णांकित किया जाता है"],
  ["The approximate result is", "अनुमानित परिणाम"],
  ["Which is the exact interval of possible values for the original x", "मूल x के संभावित मानों का सटीक अंतराल कौन-सा है"],
  ["Simplify", "सरल कीजिए"],
  ["Evaluate", "मान ज्ञात कीजिए"],
  ["Estimate", "अनुमान लगाइए"],
  ["Round", "पूर्णांकित कीजिए"],
  ["Which", "कौन-सा"],
  ["What", "क्या"],
] as const;

const PA_PHRASES = [
  ["What is the exact value of", "ਦਾ ਸਟੀਕ ਮੁੱਲ ਕੀ ਹੈ"],
  ["Give the answer in lowest terms", "ਉੱਤਰ ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਰੂਪ ਵਿੱਚ ਲਿਖੋ"],
  ["Give the answer as a reduced fraction", "ਉੱਤਰ ਨੂੰ ਸਰਲ ਭਿੰਨ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ"],
  ["Give the answer as a decimal", "ਉੱਤਰ ਦਸ਼ਮਲਵ ਵਿੱਚ ਲਿਖੋ"],
  ["using the correct fraction operations", "ਸਹੀ ਭਿੰਨ ਕਿਰਿਆਵਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ"],
  ["Find the simplified value of the following fraction expression", "ਹੇਠਾਂ ਦਿੱਤੇ ਭਿੰਨ-ਵਿਆੰਜਕ ਦਾ ਸਰਲ ਮੁੱਲ ਕੱਢੋ"],
  ["Simplify the following expression and give the answer in lowest terms", "ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਆੰਜਕ ਨੂੰ ਸਰਲ ਕਰੋ ਅਤੇ ਉੱਤਰ ਸਭ ਤੋਂ ਸਰਲ ਰੂਪ ਵਿੱਚ ਲਿਖੋ"],
  ["Complete the exact fraction equality", "ਸਟੀਕ ਭਿੰਨ-ਸਮਾਨਤਾ ਪੂਰੀ ਕਰੋ"],
  ["Which value makes the following fraction equality true", "ਕਿਹੜਾ ਮੁੱਲ ਹੇਠਾਂ ਦਿੱਤੀ ਭਿੰਨ-ਸਮਾਨਤਾ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ"],
  ["Choose the correct relation between A and B", "A ਅਤੇ B ਵਿਚਕਾਰ ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ"],
  ["select the equivalent fraction in lowest terms", "ਸਭ ਤੋਂ ਸਰਲ ਰੂਪ ਵਾਲੀ ਸਮਤੁੱਲ ਭਿੰਨ ਚੁਣੋ"],
  ["Which is the first step that changes the value of the expression", "ਕਿਹੜਾ ਪਹਿਲਾ ਕਦਮ ਵਿਆੰਜਕ ਦਾ ਮੁੱਲ ਬਦਲ ਦਿੰਦਾ ਹੈ"],
  ["Which is the first incorrect step", "ਪਹਿਲਾ ਗਲਤ ਕਦਮ ਕਿਹੜਾ ਹੈ"],
  ["Identify the earliest incorrect step", "ਸਭ ਤੋਂ ਪਹਿਲਾ ਗਲਤ ਕਦਮ ਪਛਾਣੋ"],
  ["Which option shows the correct grouping of", "ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਸਮੂਹਬੰਦੀ ਦਿਖਾਉਂਦਾ ਹੈ"],
  ["Which of the following is a valid first step in simplifying", "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਸਰਲ ਕਰਨ ਦਾ ਸਹੀ ਪਹਿਲਾ ਕਦਮ ਕਿਹੜਾ ਹੈ"],
  ["Without changing the grouping, compare", "ਸਮੂਹਬੰਦੀ ਬਦਲੇ ਬਿਨਾਂ ਤੁਲਨਾ ਕਰੋ"],
  ["After replacing", "ਨੂੰ ਬਦਲਣ ਤੋਂ ਬਾਅਦ"],
  ["what value is obtained", "ਕਿਹੜਾ ਮੁੱਲ ਮਿਲਦਾ ਹੈ"],
  ["Find the percentage represented by", "ਦੁਆਰਾ ਦਰਸਾਇਆ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ"],
  ["where m and n are positive numbers", "ਜਿੱਥੇ m ਅਤੇ n ਧਨਾਤਮਕ ਸੰਖਿਆਵਾਂ ਹਨ"],
  ["Which relation between A and B must be true", "A ਅਤੇ B ਵਿਚਕਾਰ ਕਿਹੜਾ ਸੰਬੰਧ ਲਾਜ਼ਮੀ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ"],
  ["Ignoring decimal points", "ਦਸ਼ਮਲਵ ਬਿੰਦੂਆਂ ਨੂੰ ਅਸਥਾਈ ਤੌਰ 'ਤੇ ਹਟਾ ਕੇ"],
  ["Which option places the decimal point correctly for", "ਕਿਹੜਾ ਵਿਕਲਪ ਦਸ਼ਮਲਵ ਬਿੰਦੂ ਨੂੰ ਸਹੀ ਥਾਂ ਰੱਖਦਾ ਹੈ"],
  ["A student records the following working for", "ਇੱਕ ਵਿਦਿਆਰਥੀ ਨੇ ਇਸ ਲਈ ਹੇਠਾਂ ਦਿੱਤਾ ਹੱਲ ਲਿਖਿਆ"],
  ["A student evaluates", "ਇੱਕ ਵਿਦਿਆਰਥੀ ਇਸ ਦਾ ਮੁੱਲ ਕੱਢਦਾ ਹੈ"],
  ["Which non-negative integer exponent makes", "ਕਿਹੜਾ ਗੈਰ-ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਘਾਤ"],
  ["true", "ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ"],
  ["If x has exact fourth root", "ਜੇ x ਦਾ ਸਟੀਕ ਚੌਥਾ ਮੂਲ"],
  ["find x", "x ਕੱਢੋ"],
  ["Choose the correct comparison between", "ਵਿਚਕਾਰ ਸਹੀ ਤੁਲਨਾ ਚੁਣੋ"],
  ["by extracting the common factor before dividing", "ਭਾਗ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸਾਂਝਾ ਗੁਣਨਖੰਡ ਕੱਢ ਕੇ"],
  ["without expanding both factorials completely", "ਦੋਵੇਂ ਫੈਕਟੋਰੀਅਲ ਪੂਰੇ ਖੋਲ੍ਹੇ ਬਿਨਾਂ"],
  ["without multiplying large numbers first", "ਪਹਿਲਾਂ ਵੱਡੀਆਂ ਸੰਖਿਆਵਾਂ ਦਾ ਗੁਣਾ ਕੀਤੇ ਬਿਨਾਂ"],
  ["by compressing the repeated block first", "ਦੁਹਰਾਏ ਬਲਾਕ ਨੂੰ ਪਹਿਲਾਂ ਸੰਖੇਪ ਕਰਕੇ"],
  ["which first step most directly avoids unnecessary large multiplication", "ਕਿਹੜਾ ਪਹਿਲਾ ਕਦਮ ਬੇਲੋੜੇ ਵੱਡੇ ਗੁਣਾ ਤੋਂ ਸਭ ਤੋਂ ਸਿੱਧਾ ਬਚਾਉਂਦਾ ਹੈ"],
  ["Which statement is correct", "ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ"],
  ["Which simplification statement is correct", "ਕਿਹੜਾ ਸਰਲੀਕਰਨ ਕਥਨ ਸਹੀ ਹੈ"],
  ["Which candidate value of x makes", "x ਦਾ ਕਿਹੜਾ ਸੰਭਾਵੀ ਮੁੱਲ"],
  ["exactly true", "ਨੂੰ ਬਿਲਕੁਲ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ"],
  ["Which option is correct", "ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ"],
  ["Can x be determined uniquely", "ਕੀ x ਨੂੰ ਇਕੋ ਮੁੱਲ ਵਜੋਂ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ"],
  ["Round every displayed term", "ਹਰ ਦਿੱਤੇ ਪਦ ਨੂੰ ਰਾਊਂਡ ਕਰੋ"],
  ["round every displayed term", "ਹਰ ਦਿੱਤੇ ਪਦ ਨੂੰ ਰਾਊਂਡ ਕਰੋ"],
  ["to the nearest thousand", "ਸਭ ਤੋਂ ਨੇੜਲੇ ਹਜ਼ਾਰ ਤੱਕ"],
  ["to the nearest hundred", "ਸਭ ਤੋਂ ਨੇੜਲੇ ਸੌ ਤੱਕ"],
  ["to the nearest ten", "ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਸ ਤੱਕ"],
  ["to the nearest integer", "ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ"],
  ["to the nearest whole number", "ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ"],
  ["to 1 decimal place", "1 ਦਸ਼ਮਲਵ ਸਥਾਨ ਤੱਕ"],
  ["to 2 decimal places", "2 ਦਸ਼ਮਲਵ ਸਥਾਨਾਂ ਤੱਕ"],
  ["to 3 significant figures", "3 ਮਹੱਤਵਪੂਰਨ ਅੰਕਾਂ ਤੱਕ"],
  ["if a value is exactly halfway, round away from zero", "ਜੇ ਮੁੱਲ ਬਿਲਕੁਲ ਅੱਧ ਵਿਚ ਹੋਵੇ ਤਾਂ ਸਿਫ਼ਰ ਤੋਂ ਦੂਰ ਵੱਲ ਰਾਊਂਡ ਕਰੋ"],
  ["which digit decides whether the number rounds up or down", "ਕਿਹੜਾ ਅੰਕ ਫ਼ੈਸਲਾ ਕਰਦਾ ਹੈ ਕਿ ਸੰਖਿਆ ਉੱਪਰ ਜਾਂ ਹੇਠਾਂ ਰਾਊਂਡ ਹੋਵੇਗੀ"],
  ["Which is the correct representation of", "ਦਾ ਸਹੀ ਰਾਊਂਡ ਕੀਤਾ ਰੂਪ ਕਿਹੜਾ ਹੈ"],
  ["Which range of integer values", "ਪੂਰਨ ਅੰਕ ਮੁੱਲਾਂ ਦੀ ਕਿਹੜੀ ਹੱਦ"],
  ["Which interval contains exactly all possible original values", "ਕਿਹੜਾ ਅੰਤਰਾਲ ਸਾਰੇ ਸੰਭਵ ਮੂਲ ਮੁੱਲਾਂ ਨੂੰ ਬਿਲਕੁਲ ਸਮੇਟਦਾ ਹੈ"],
  ["What is the least integer that", "ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਅੰਕ ਕਿਹੜਾ ਹੈ ਜੋ"],
  ["What is the greatest integer that", "ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ ਕਿਹੜਾ ਹੈ ਜੋ"],
  ["Which digit can replace", "ਕਿਹੜਾ ਅੰਕ ਇਸ ਦੀ ਥਾਂ ਲੈ ਸਕਦਾ ਹੈ"],
  ["What is the absolute rounding error", "ਰਾਊਂਡਿੰਗ ਦੀ ਨਿਰਪੇਖ ਗਲਤੀ ਕੀ ਹੈ"],
  ["What is the maximum possible absolute rounding error", "ਵੱਧ ਤੋਂ ਵੱਧ ਸੰਭਵ ਨਿਰਪੇਖ ਰਾਊਂਡਿੰਗ ਗਲਤੀ ਕੀ ਹੈ"],
  ["What is the relative rounding error", "ਸਾਪੇਖ ਰਾਊਂਡਿੰਗ ਗਲਤੀ ਕੀ ਹੈ"],
  ["written as a fraction of the original value", "ਮੂਲ ਮੁੱਲ ਦੇ ਭਿੰਨ ਵਜੋਂ"],
  ["Which diagnosis is correct", "ਕਿਹੜੀ ਵਿਆਖਿਆ ਸਹੀ ਹੈ"],
  ["Before evaluating", "ਗਣਨਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ"],
  ["before doing the arithmetic", "ਗਣਨਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ"],
  ["For this estimate", "ਇਸ ਅੰਦਾਜ਼ੇ ਲਈ"],
  ["For a quick sum estimate", "ਤੇਜ਼ ਜੋੜ ਅੰਦਾਜ਼ੇ ਲਈ"],
  ["Which pair should replace the two numbers", "ਇਨ੍ਹਾਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦੀ ਥਾਂ ਕਿਹੜੀ ਜੋੜੀ ਲੈਣੀ ਚਾਹੀਦੀ ਹੈ"],
  ["First round every displayed term", "ਪਹਿਲਾਂ ਹਰ ਦਿੱਤੇ ਪਦ ਨੂੰ ਰਾਊਂਡ ਕਰੋ"],
  ["For estimation, first replace", "ਅੰਦਾਜ਼ੇ ਲਈ ਪਹਿਲਾਂ ਬਦਲੋ"],
  ["Round all displayed terms", "ਸਾਰੇ ਦਿੱਤੇ ਪਦਾਂ ਨੂੰ ਰਾਊਂਡ ਕਰੋ"],
  ["round both terms", "ਦੋਵੇਂ ਪਦਾਂ ਨੂੰ ਰਾਊਂਡ ਕਰੋ"],
  ["If the estimated sum is", "ਜੇ ਅੰਦਾਜ਼ਿਤ ਜੋੜ"],
  ["If the estimated difference is", "ਜੇ ਅੰਦਾਜ਼ਿਤ ਅੰਤਰ"],
  ["what is the rounded value of", "ਤਾਂ ਇਸ ਦਾ ਰਾਊਂਡ ਕੀਤਾ ਮੁੱਲ ਕੀ ਹੈ"],
  ["Which option is closest to the resulting estimate", "ਕਿਹੜਾ ਵਿਕਲਪ ਮਿਲੇ ਅੰਦਾਜ਼ੇ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ"],
  ["Which interval must contain their exact sum", "ਕਿਹੜੇ ਅੰਤਰਾਲ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦਾ ਸਟੀਕ ਜੋੜ ਲਾਜ਼ਮੀ ਹੋਵੇਗਾ"],
  ["Which interval must contain the exact value of the first number minus the second", "ਕਿਹੜੇ ਅੰਤਰਾਲ ਵਿੱਚ ਪਹਿਲੀ ਸੰਖਿਆ ਵਿਚੋਂ ਦੂਜੀ ਘਟਾਉਣ ਦਾ ਸਟੀਕ ਮੁੱਲ ਲਾਜ਼ਮੀ ਹੋਵੇਗਾ"],
  ["Compared with the exact sum", "ਸਟੀਕ ਜੋੜ ਨਾਲ ਤੁਲਨਾ ਕਰਨ ਤੇ"],
  ["is this estimate an overestimate or an underestimate", "ਕੀ ਇਹ ਅੰਦਾਜ਼ਾ ਵੱਧ ਹੈ ਜਾਂ ਘੱਟ"],
  ["Round every addend", "ਹਰ ਜੋੜ ਪਦ ਨੂੰ ਰਾਊਂਡ ਕਰੋ"],
  ["Estimate after rounding each factor", "ਹਰ ਗੁਣਨਖੰਡ ਨੂੰ ਰਾਊਂਡ ਕਰਨ ਤੋਂ ਬਾਅਦ ਅੰਦਾਜ਼ਾ ਲਗਾਓ"],
  ["Using nearest whole number rounded values", "ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਵਾਲੇ ਮੁੱਲ ਵਰਤ ਕੇ"],
  ["Using the rounded values", "ਰਾਊਂਡ ਕੀਤੇ ਮੁੱਲ ਵਰਤ ਕੇ"],
  ["Approximately what percent of", "ਲਗਭਗ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ"],
  ["Using cancellation and nearest-ten values", "ਕਟੌਤੀ ਅਤੇ ਸਭ ਤੋਂ ਨੇੜਲੇ-ਦਸ ਮੁੱਲ ਵਰਤ ਕੇ"],
  ["Using rounded values", "ਰਾਊਂਡ ਕੀਤੇ ਮੁੱਲ ਵਰਤ ਕੇ"],
  ["What rounded value should replace", "ਕਿਹੜਾ ਰਾਊਂਡ ਕੀਤਾ ਮੁੱਲ ਇਸ ਦੀ ਥਾਂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ"],
  ["What rounded divisor should replace", "ਕਿਹੜਾ ਰਾਊਂਡ ਕੀਤਾ ਭਾਜਕ ਇਸ ਦੀ ਥਾਂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ"],
  ["Which option is nearest to", "ਕਿਹੜਾ ਵਿਕਲਪ ਇਸ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ"],
  ["Compare the two approximate ratios", "ਦੋਵੇਂ ਅੰਦਾਜ਼ਿਤ ਅਨੁਪਾਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ"],
  ["Which interval must contain their exact product", "ਕਿਹੜੇ ਅੰਤਰਾਲ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦਾ ਸਟੀਕ ਗੁਣਨਫਲ ਲਾਜ਼ਮੀ ਹੋਵੇਗਾ"],
  ["Which interval must contain the exact quotient", "ਕਿਹੜੇ ਅੰਤਰਾਲ ਵਿੱਚ ਸਟੀਕ ਭਾਗਫਲ ਲਾਜ਼ਮੀ ਹੋਵੇਗਾ"],
  ["What is the error", "ਗਲਤੀ ਕੀ ਹੈ"],
  ["Which is the safer estimate using nearest hundreds", "ਸਭ ਤੋਂ ਨੇੜਲੇ ਸੈਂਕੜੇ ਵਰਤ ਕੇ ਵੱਧ ਸੁਰੱਖਿਅਤ ਅੰਦਾਜ਼ਾ ਕਿਹੜਾ ਹੈ"],
  ["Without doing the full multiplication", "ਪੂਰਾ ਗੁਣਾ ਕੀਤੇ ਬਿਨਾਂ"],
  ["decide whether the estimated product is an overestimate or an underestimate", "ਦੱਸੋ ਕਿ ਅੰਦਾਜ਼ਿਤ ਗੁਣਨਫਲ ਵੱਧ ਅੰਦਾਜ਼ਾ ਹੈ ਜਾਂ ਘੱਟ"],
  ["Between which two consecutive integers does", "ਕਿਹੜੇ ਦੋ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਵਿਚਕਾਰ"],
  ["is nearest to which integer", "ਕਿਹੜੇ ਪੂਰਨ ਅੰਕ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ"],
  ["What is the greatest integer less than", "ਤੋਂ ਛੋਟਾ ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ ਕੀ ਹੈ"],
  ["Which fraction best estimates", "ਕਿਹੜੀ ਭਿੰਨ ਸਭ ਤੋਂ ਵਧੀਆ ਅੰਦਾਜ਼ਾ ਦਿੰਦੀ ਹੈ"],
  ["by taking each square root to the nearest integer", "ਹਰ ਵਰਗਮੂਲ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲਾ ਪੂਰਨ ਅੰਕ ਮੰਨ ਕੇ"],
  ["Which value below", "ਤੋਂ ਘੱਟ ਕਿਹੜਾ ਮੁੱਲ"],
  ["has a square root nearest to", "ਦਾ ਵਰਗਮੂਲ ਇਸ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ"],
  ["A number is", "ਇੱਕ ਸੰਖਿਆ"],
  ["less than an integer", "ਇੱਕ ਪੂਰਨ ਅੰਕ ਤੋਂ ਘੱਟ ਹੈ"],
  ["After squaring the rounded value", "ਰਾਊਂਡ ਕੀਤੇ ਮੁੱਲ ਦਾ ਵਰਗ ਕਰਨ ਤੋਂ ਬਾਅਦ"],
  ["Which option could be the original number", "ਮੂਲ ਸੰਖਿਆ ਕਿਹੜਾ ਵਿਕਲਪ ਹੋ ਸਕਦੀ ਹੈ"],
  ["If A =", "ਜੇ A ="],
  ["compare A and B", "A ਅਤੇ B ਦੀ ਤੁਲਨਾ ਕਰੋ"],
  ["Which correction is appropriate", "ਕਿਹੜੀ ਸੋਧ ਢੁੱਕਵੀਂ ਹੈ"],
  ["Which option is closest to the value of", "ਕਿਹੜਾ ਵਿਕਲਪ ਇਸ ਮੁੱਲ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ"],
  ["The exact value of an arithmetic expression is", "ਇੱਕ ਅੰਕਗਣਿਤ ਵਿਆੰਜਕ ਦਾ ਸਟੀਕ ਮੁੱਲ"],
  ["while a quick estimate gives", "ਜਦਕਿ ਤੇਜ਼ ਅੰਦਾਜ਼ਾ"],
  ["What is the absolute error", "ਨਿਰਪੇਖ ਗਲਤੀ ਕੀ ਹੈ"],
  ["An expression has exact value", "ਇੱਕ ਵਿਆੰਜਕ ਦਾ ਸਟੀਕ ਮੁੱਲ"],
  ["but it was estimated as", "ਹੈ, ਪਰ ਇਸ ਦਾ ਅੰਦਾਜ਼ਾ"],
  ["What is the percentage error in the estimate", "ਅੰਦਾਜ਼ੇ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਗਲਤੀ ਕੀ ਹੈ"],
  ["This estimate is best described as", "ਇਸ ਅੰਦਾਜ਼ੇ ਦਾ ਸਹੀ ਵਰਣਨ ਹੈ"],
  ["Two estimates are", "ਦੋ ਅੰਦਾਜ਼ੇ ਹਨ"],
  ["A positive number", "ਇੱਕ ਧਨਾਤਮਕ ਸੰਖਿਆ"],
  ["Which is the tightest interval that must contain", "ਸਭ ਤੋਂ ਤੰਗ ਅੰਤਰਾਲ ਕਿਹੜਾ ਹੈ ਜਿਸ ਵਿੱਚ"],
  ["Which option is within", "ਕਿਹੜਾ ਵਿਕਲਪ"],
  ["of the exact value", "ਸਟੀਕ ਮੁੱਲ ਦੀ ਹੱਦ ਵਿੱਚ ਹੈ"],
  ["is known to lie between", "ਦੇ ਵਿਚਕਾਰ ਹੋਣਾ ਪਤਾ ਹੈ"],
  ["Which option is guaranteed to be the nearest for every value in this interval", "ਇਸ ਅੰਤਰਾਲ ਦੇ ਹਰ ਮੁੱਲ ਲਈ ਕਿਹੜਾ ਵਿਕਲਪ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ"],
  ["is known only to lie between", "ਸਿਰਫ਼ ਇੰਨਾ ਪਤਾ ਹੈ ਕਿ ਇਹ ਇਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ਹੈ"],
  ["What can be concluded", "ਕੀ ਨਤੀਜਾ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ"],
  ["What approximate value should come in place of", "ਇਸ ਦੀ ਥਾਂ ਲਗਭਗ ਕਿਹੜਾ ਮੁੱਲ ਆਵੇਗਾ"],
  ["What approximate value should replace", "ਇਸ ਦੀ ਥਾਂ ਲਗਭਗ ਕਿਹੜਾ ਮੁੱਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ"],
  ["For integer", "ਪੂਰਨ ਅੰਕ ਲਈ"],
  ["which option makes", "ਕਿਹੜਾ ਵਿਕਲਪ"],
  ["lie within", "ਨੂੰ ਹੱਦ ਵਿੱਚ ਰੱਖਦਾ ਹੈ"],
  ["An approximate calculation requires integer", "ਇੱਕ ਅੰਦਾਜ਼ੀ ਗਣਨਾ ਵਿੱਚ ਪੂਰਨ ਅੰਕ"],
  ["How many integer values of", "ਇਸ ਦੇ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ ਮੁੱਲ"],
  ["are admissible", "ਮੰਨਣਯੋਗ ਹਨ"],
  ["must lie in the approximation band", "ਅੰਦਾਜ਼ਾ-ਹੱਦ ਵਿੱਚ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ"],
  ["How should the outcome be classified", "ਨਤੀਜੇ ਨੂੰ ਕਿਵੇਂ ਵਰਗੀਕ੍ਰਿਤ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ"],
  ["is rounded to the nearest integer before evaluating", "ਦੀ ਗਣਨਾ ਤੋਂ ਪਹਿਲਾਂ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਰਾਊਂਡ ਕੀਤਾ ਜਾਂਦਾ ਹੈ"],
  ["The approximate result is", "ਅੰਦਾਜ਼ਿਤ ਨਤੀਜਾ"],
  ["Which is the exact interval of possible values for the original x", "ਮੂਲ x ਦੇ ਸੰਭਵ ਮੁੱਲਾਂ ਦਾ ਸਟੀਕ ਅੰਤਰਾਲ ਕਿਹੜਾ ਹੈ"],
  ["Simplify", "ਸਰਲ ਕਰੋ"],
  ["Evaluate", "ਮੁੱਲ ਕੱਢੋ"],
  ["Estimate", "ਅੰਦਾਜ਼ਾ ਲਗਾਓ"],
  ["Round", "ਰਾਊਂਡ ਕਰੋ"],
  ["Which", "ਕਿਹੜਾ"],
  ["What", "ਕੀ"],
] as const;

const HI_WORDS: Record<string, string> = {
  "the": "", "a": "एक", "an": "एक", "is": "है", "are": "हैं", "was": "था", "were": "थे",
  "and": "और", "or": "या", "of": "का", "to": "तक", "from": "से", "in": "में", "with": "के साथ",
  "by": "से", "for": "के लिए", "as": "के रूप में", "before": "पहले", "after": "बाद", "then": "फिर",
  "this": "यह", "that": "वह", "these": "ये", "those": "वे", "each": "प्रत्येक", "every": "हर",
  "both": "दोनों", "only": "केवल", "must": "अवश्य", "should": "चाहिए", "can": "सकता", "cannot": "नहीं किया जा सकता",
  "value": "मान", "values": "मान", "exact": "सटीक", "exactly": "ठीक-ठीक", "approximate": "लगभग",
  "estimate": "अनुमान", "estimated": "अनुमानित", "estimation": "अनुमान", "expression": "व्यंजक", "term": "पद", "terms": "पद",
  "number": "संख्या", "numbers": "संख्याएँ", "integer": "पूर्णांक", "integers": "पूर्णांक", "positive": "धनात्मक",
  "negative": "ऋणात्मक", "fraction": "भिन्न", "fractions": "भिन्न", "decimal": "दशमलव", "percentage": "प्रतिशत",
  "percent": "प्रतिशत", "ratio": "अनुपात", "ratios": "अनुपात", "product": "गुणनफल", "quotient": "भागफल", "sum": "योग",
  "difference": "अंतर", "root": "मूल", "square": "वर्ग", "cube": "घन", "power": "घात", "exponent": "घातांक",
  "factor": "गुणनखंड", "factors": "गुणनखंड", "factorial": "फैक्टोरियल", "numerator": "अंश", "denominator": "हर",
  "common": "साझा", "bracket": "कोष्ठक", "grouping": "समूहबद्धता", "operation": "संक्रिया", "operations": "संक्रियाएँ",
  "addition": "जोड़", "subtraction": "घटाव", "multiplication": "गुणा", "division": "भाग", "arithmetic": "अंकगणित",
  "first": "पहला", "final": "अंतिम", "correct": "सही", "incorrect": "गलत", "valid": "वैध", "invalid": "अवैध",
  "step": "चरण", "steps": "चरण", "option": "विकल्प", "options": "विकल्प", "answer": "उत्तर", "check": "जाँच",
  "therefore": "अतः", "hence": "इसलिए", "so": "इसलिए", "gives": "देता है", "give": "दीजिए", "get": "मिलता है",
  "obtained": "प्राप्त", "represented": "दर्शाया", "simplified": "सरल", "reduced": "सरल",
  "nearest": "निकटतम", "rounded": "पूर्णांकित", "rounding": "पूर्णांकन", "rounds": "पूर्णांकित होता है", "round": "पूर्णांकित करें",
  "digit": "अंक", "digits": "अंक", "place": "स्थान", "places": "स्थान", "whole": "पूर्णांक", "half": "आधा",
  "interval": "अंतराल", "range": "सीमा", "possible": "संभावित", "original": "मूल", "error": "त्रुटि", "errors": "त्रुटियाँ",
  "absolute": "निरपेक्ष", "relative": "सापेक्ष", "maximum": "अधिकतम", "minimum": "न्यूनतम", "least": "सबसे छोटा",
  "greatest": "सबसे बड़ा", "below": "नीचे", "between": "के बीच", "within": "के भीतर", "outside": "बाहर",
  "higher": "ऊँचा", "lower": "नीचा", "overestimate": "अधिक अनुमान", "underestimate": "कम अनुमान", "comparison": "तुलना",
  "compare": "तुलना करें", "relation": "संबंध", "statement": "कथन", "statements": "कथन", "route": "विधि", "routes": "विधियाँ",
  "student": "विद्यार्थी", "method": "विधि", "result": "परिणाम", "outcome": "परिणाम", "calculation": "गणना",
  "calculated": "गणना किया", "evaluate": "मान निकालें", "evaluating": "मान निकालते समय", "simplify": "सरल करें",
  "multiply": "गुणा करें", "multiplied": "गुणा किया", "divide": "भाग दें", "dividing": "भाग देते समय", "add": "जोड़ें",
  "subtract": "घटाएँ", "cancel": "काटें", "cancellation": "काट-छाँट", "reduce": "सरल करें", "replace": "प्रतिस्थापित करें",
  "replacing": "प्रतिस्थापित करते हुए", "using": "उपयोग करके", "use": "उपयोग करें", "take": "लीजिए", "taking": "लेते हुए",
  "known": "ज्ञात", "concluded": "निष्कर्ष", "conclusion": "निष्कर्ष", "classified": "वर्गीकृत", "unique": "एकमात्र",
  "multiple": "एक से अधिक", "impossible": "असंभव", "admissible": "स्वीकार्य", "sufficient": "पर्याप्त", "insufficient": "अपर्याप्त",
  "alone": "अकेला", "together": "मिलकर", "equal": "समान", "equals": "बराबर", "equivalent": "समतुल्य",
  "same": "समान", "different": "भिन्न", "larger": "बड़ा", "smaller": "छोटा", "closer": "अधिक निकट", "closest": "सबसे निकट",
  "away": "दूर", "zero": "शून्य", "non": "गैर", "principal": "मुख्य", "consecutive": "क्रमागत",
  "approximately": "लगभग", "quick": "त्वरित", "safer": "अधिक सुरक्षित", "directly": "सीधे", "unnecessary": "अनावश्यक",
  "large": "बड़ा", "small": "छोटा", "complete": "पूरा", "completely": "पूरी तरह", "shown": "दिखाया गया", "displayed": "दिया गया",
  "working": "हल", "recorded": "लिखा", "reported": "बताया", "described": "वर्णित", "correction": "सुधार", "appropriate": "उचित",
  "diagnosis": "निदान", "safe": "सुरक्षित", "tightest": "सबसे कड़ा", "guaranteed": "निश्चित",
  "left": "बायाँ", "right": "दायाँ", "increasing": "बढ़ते", "order": "क्रम", "inclusive": "समेत", "recurring": "आवर्ती",
  "significant": "सार्थक", "figures": "अंक", "hundreds": "सैकड़ा", "tens": "दहाई", "units": "इकाई",
  "thousands": "हजार", "hundred": "सौ", "ten": "दस", "thousand": "हजार", "hundredths": "सौवाँ", "midpoint": "मध्यबिंदु",
  "reciprocal": "व्युत्क्रम", "structural": "संरचनात्मक", "shortcut": "शॉर्टकट", "block": "खंड",
  "premature": "समय से पहले", "changed": "बदल दिया", "because": "क्योंकि", "while": "जबकि",
  "where": "जहाँ", "when": "जब", "if": "यदि", "let": "मान लीजिए", "be": "हो", "becomes": "बनता है", "become": "बनते हैं",
};

const PA_WORDS: Record<string, string> = {
  "the": "", "a": "ਇੱਕ", "an": "ਇੱਕ", "is": "ਹੈ", "are": "ਹਨ", "was": "ਸੀ", "were": "ਸਨ",
  "and": "ਅਤੇ", "or": "ਜਾਂ", "of": "ਦਾ", "to": "ਤੱਕ", "from": "ਤੋਂ", "in": "ਵਿੱਚ", "with": "ਨਾਲ",
  "by": "ਨਾਲ", "for": "ਲਈ", "as": "ਵਜੋਂ", "before": "ਪਹਿਲਾਂ", "after": "ਬਾਅਦ", "then": "ਫਿਰ",
  "this": "ਇਹ", "that": "ਉਹ", "these": "ਇਹ", "those": "ਉਹ", "each": "ਹਰ", "every": "ਹਰ",
  "both": "ਦੋਵੇਂ", "only": "ਕੇਵਲ", "must": "ਲਾਜ਼ਮੀ", "should": "ਚਾਹੀਦਾ", "can": "ਸਕਦਾ", "cannot": "ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
  "value": "ਮੁੱਲ", "values": "ਮੁੱਲ", "exact": "ਸਟੀਕ", "exactly": "ਬਿਲਕੁਲ", "approximate": "ਲਗਭਗ",
  "estimate": "ਅੰਦਾਜ਼ਾ", "estimated": "ਅੰਦਾਜ਼ਿਤ", "estimation": "ਅੰਦਾਜ਼ਾ", "expression": "ਵਿਆੰਜਕ", "term": "ਪਦ", "terms": "ਪਦ",
  "number": "ਸੰਖਿਆ", "numbers": "ਸੰਖਿਆਵਾਂ", "integer": "ਪੂਰਨ ਅੰਕ", "integers": "ਪੂਰਨ ਅੰਕ", "positive": "ਧਨਾਤਮਕ",
  "negative": "ਰਿਣਾਤਮਕ", "fraction": "ਭਿੰਨ", "fractions": "ਭਿੰਨਾਂ", "decimal": "ਦਸ਼ਮਲਵ", "percentage": "ਪ੍ਰਤੀਸ਼ਤ",
  "percent": "ਪ੍ਰਤੀਸ਼ਤ", "ratio": "ਅਨੁਪਾਤ", "ratios": "ਅਨੁਪਾਤ", "product": "ਗੁਣਨਫਲ", "quotient": "ਭਾਗਫਲ", "sum": "ਜੋੜ",
  "difference": "ਅੰਤਰ", "root": "ਮੂਲ", "square": "ਵਰਗ", "cube": "ਘਣ", "power": "ਘਾਤ", "exponent": "ਘਾਤ",
  "factor": "ਗੁਣਨਖੰਡ", "factors": "ਗੁਣਨਖੰਡ", "factorial": "ਫੈਕਟੋਰੀਅਲ", "numerator": "ਅੰਸ਼", "denominator": "ਹਰ",
  "common": "ਸਾਂਝਾ", "bracket": "ਬਰੈਕਟ", "grouping": "ਸਮੂਹਬੰਦੀ", "operation": "ਕਿਰਿਆ", "operations": "ਕਿਰਿਆਵਾਂ",
  "addition": "ਜੋੜ", "subtraction": "ਘਟਾਓ", "multiplication": "ਗੁਣਾ", "division": "ਭਾਗ", "arithmetic": "ਅੰਕਗਣਿਤ",
  "first": "ਪਹਿਲਾ", "final": "ਅੰਤਿਮ", "correct": "ਸਹੀ", "incorrect": "ਗਲਤ", "valid": "ਵੈਧ", "invalid": "ਅਵੈਧ",
  "step": "ਕਦਮ", "steps": "ਕਦਮ", "option": "ਵਿਕਲਪ", "options": "ਵਿਕਲਪ", "answer": "ਉੱਤਰ", "check": "ਜਾਂਚ",
  "therefore": "ਇਸ ਲਈ", "hence": "ਇਸ ਲਈ", "so": "ਇਸ ਲਈ", "gives": "ਦਿੰਦਾ ਹੈ", "give": "ਦਿਓ", "get": "ਮਿਲਦਾ ਹੈ",
  "obtained": "ਮਿਲਿਆ", "represented": "ਦਰਸਾਇਆ", "simplified": "ਸਰਲ", "reduced": "ਸਰਲ",
  "nearest": "ਸਭ ਤੋਂ ਨੇੜਲਾ", "rounded": "ਰਾਊਂਡ ਕੀਤਾ", "rounding": "ਰਾਊਂਡਿੰਗ", "rounds": "ਰਾਊਂਡ ਹੁੰਦਾ ਹੈ", "round": "ਰਾਊਂਡ ਕਰੋ",
  "digit": "ਅੰਕ", "digits": "ਅੰਕ", "place": "ਸਥਾਨ", "places": "ਸਥਾਨ", "whole": "ਪੂਰਨ ਅੰਕ", "half": "ਅੱਧਾ",
  "interval": "ਅੰਤਰਾਲ", "range": "ਹੱਦ", "possible": "ਸੰਭਵ", "original": "ਮੂਲ", "error": "ਗਲਤੀ", "errors": "ਗਲਤੀਆਂ",
  "absolute": "ਨਿਰਪੇਖ", "relative": "ਸਾਪੇਖ", "maximum": "ਵੱਧ ਤੋਂ ਵੱਧ", "minimum": "ਘੱਟ ਤੋਂ ਘੱਟ", "least": "ਸਭ ਤੋਂ ਛੋਟਾ",
  "greatest": "ਸਭ ਤੋਂ ਵੱਡਾ", "below": "ਹੇਠਾਂ", "between": "ਵਿਚਕਾਰ", "within": "ਹੱਦ ਵਿੱਚ", "outside": "ਬਾਹਰ",
  "higher": "ਵੱਡਾ", "lower": "ਛੋਟਾ", "overestimate": "ਵੱਧ ਅੰਦਾਜ਼ਾ", "underestimate": "ਘੱਟ ਅੰਦਾਜ਼ਾ", "comparison": "ਤੁਲਨਾ",
  "compare": "ਤੁਲਨਾ ਕਰੋ", "relation": "ਸੰਬੰਧ", "statement": "ਕਥਨ", "statements": "ਕਥਨ", "route": "ਵਿਧੀ", "routes": "ਵਿਧੀਆਂ",
  "student": "ਵਿਦਿਆਰਥੀ", "method": "ਵਿਧੀ", "result": "ਨਤੀਜਾ", "outcome": "ਨਤੀਜਾ", "calculation": "ਗਣਨਾ",
  "calculated": "ਗਣਨਾ ਕੀਤੀ", "evaluate": "ਮੁੱਲ ਕੱਢੋ", "evaluating": "ਮੁੱਲ ਕੱਢਦੇ ਸਮੇਂ", "simplify": "ਸਰਲ ਕਰੋ",
  "multiply": "ਗੁਣਾ ਕਰੋ", "multiplied": "ਗੁਣਾ ਕੀਤਾ", "divide": "ਭਾਗ ਕਰੋ", "dividing": "ਭਾਗ ਕਰਦੇ ਸਮੇਂ", "add": "ਜੋੜੋ",
  "subtract": "ਘਟਾਓ", "cancel": "ਕਾਟੋ", "cancellation": "ਕਟੌਤੀ", "reduce": "ਸਰਲ ਕਰੋ", "replace": "ਬਦਲੋ",
  "replacing": "ਬਦਲ ਕੇ", "using": "ਵਰਤ ਕੇ", "use": "ਵਰਤੋ", "take": "ਲਵੋ", "taking": "ਲੈਂਦੇ ਹੋਏ",
  "known": "ਪਤਾ", "concluded": "ਨਤੀਜਾ", "conclusion": "ਨਤੀਜਾ", "classified": "ਵਰਗੀਕ੍ਰਿਤ", "unique": "ਇਕੋ",
  "multiple": "ਇੱਕ ਤੋਂ ਵੱਧ", "impossible": "ਅਸੰਭਵ", "admissible": "ਮੰਨਣਯੋਗ", "sufficient": "ਕਾਫ਼ੀ", "insufficient": "ਅਕਾਫ਼ੀ",
  "alone": "ਇਕੱਲਾ", "together": "ਇਕੱਠੇ", "equal": "ਬਰਾਬਰ", "equals": "ਬਰਾਬਰ", "equivalent": "ਸਮਤੁੱਲ",
  "same": "ਇੱਕੋ", "different": "ਵੱਖਰੇ", "larger": "ਵੱਡਾ", "smaller": "ਛੋਟਾ", "closer": "ਹੋਰ ਨੇੜੇ", "closest": "ਸਭ ਤੋਂ ਨੇੜੇ",
  "away": "ਦੂਰ", "zero": "ਸਿਫ਼ਰ", "non": "ਗੈਰ", "principal": "ਮੁੱਖ", "consecutive": "ਲਗਾਤਾਰ",
  "approximately": "ਲਗਭਗ", "quick": "ਤੇਜ਼", "safer": "ਵੱਧ ਸੁਰੱਖਿਅਤ", "directly": "ਸਿੱਧੇ", "unnecessary": "ਬੇਲੋੜਾ",
  "large": "ਵੱਡਾ", "small": "ਛੋਟਾ", "complete": "ਪੂਰਾ", "completely": "ਪੂਰੀ ਤਰ੍ਹਾਂ", "shown": "ਦਿਖਾਇਆ", "displayed": "ਦਿੱਤਾ",
  "working": "ਹੱਲ", "recorded": "ਲਿਖਿਆ", "reported": "ਦੱਸਿਆ", "described": "ਵਰਣਨ", "correction": "ਸੋਧ", "appropriate": "ਢੁੱਕਵਾਂ",
  "diagnosis": "ਵਿਆਖਿਆ", "safe": "ਸੁਰੱਖਿਅਤ", "tightest": "ਸਭ ਤੋਂ ਤੰਗ", "guaranteed": "ਯਕੀਨੀ",
  "left": "ਖੱਬਾ", "right": "ਸੱਜਾ", "increasing": "ਵੱਧਦੇ", "order": "ਕ੍ਰਮ", "inclusive": "ਸਮੇਤ", "recurring": "ਦੁਹਰਾਉਂਦਾ",
  "significant": "ਮਹੱਤਵਪੂਰਨ", "figures": "ਅੰਕ", "hundreds": "ਸੈਂਕੜੇ", "tens": "ਦਹਾਈ", "units": "ਇਕਾਈ",
  "thousands": "ਹਜ਼ਾਰ", "hundred": "ਸੌ", "ten": "ਦਸ", "thousand": "ਹਜ਼ਾਰ", "midpoint": "ਮੱਧ-ਬਿੰਦੂ",
  "reciprocal": "ਉਲਟ ਭਿੰਨ", "structural": "ਸੰਰਚਨਾਤਮਕ", "shortcut": "ਛੋਟਾ ਤਰੀਕਾ", "block": "ਬਲਾਕ",
  "premature": "ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ", "changed": "ਬਦਲ ਦਿੱਤਾ", "because": "ਕਿਉਂਕਿ", "while": "ਜਦਕਿ",
  "where": "ਜਿੱਥੇ", "when": "ਜਦੋਂ", "if": "ਜੇ", "let": "ਮੰਨੋ", "be": "ਹੋਵੇ", "becomes": "ਬਣਦਾ ਹੈ", "become": "ਬਣਦੇ ਹਨ",
};

function localizeCommonSentences(text: string, language: SapTranslationLanguage) {
  let out = text;
  const hi = language === "hi";
  const rules: readonly [RegExp, (...args: any[]) => string][] = [
    [/^Therefore, the exact value is (.+)\.$/u, (_m, value) => hi ? `अतः सटीक मान ${value} है।` : `ਇਸ ਲਈ ਸਟੀਕ ਮੁੱਲ ${value} ਹੈ।`],
    [/^Therefore, the simplified value is (.+)\.$/u, (_m, value) => hi ? `अतः सरल मान ${value} है।` : `ਇਸ ਲਈ ਸਰਲ ਮੁੱਲ ${value} ਹੈ।`],
    [/^Therefore, the required answer is (.+)\.$/u, (_m, value) => hi ? `अतः आवश्यक उत्तर ${value} है।` : `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉੱਤਰ ${value} ਹੈ।`],
    [/^Therefore, the required value is (.+)\.$/u, (_m, value) => hi ? `अतः आवश्यक मान ${value} है।` : `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਮੁੱਲ ${value} ਹੈ।`],
    [/^Therefore, the estimate is (.+)\.$/u, (_m, value) => hi ? `अतः अनुमान ${value} है।` : `ਇਸ ਲਈ ਅੰਦਾਜ਼ਾ ${value} ਹੈ।`],
    [/^Therefore, (.+) is the correct choice\.$/u, (_m, value) => hi ? `अतः सही विकल्प ${value} है।` : `ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ${value} ਹੈ।`],
    [/^The correct choice is (.+)\.$/u, (_m, value) => hi ? `सही विकल्प ${value} है।` : `ਸਹੀ ਵਿਕਲਪ ${value} ਹੈ।`],
    [/^The correct option is (.+)\.$/u, (_m, value) => hi ? `सही विकल्प ${value} है।` : `ਸਹੀ ਵਿਕਲਪ ${value} ਹੈ।`],
    [/^Answer: (.+)\.$/u, (_m, value) => hi ? `उत्तर: ${value}।` : `ਉੱਤਰ: ${value}।`],
    [/^Check: (.+)$/u, (_m, value) => hi ? `जाँच: ${value}` : `ਜਾਂਚ: ${value}`],
    [/^Step (\d+): Multiply (.+) by (.+) to get (.+)\.$/u, (_m, n, a, b, c) => hi ? `चरण ${n}: ${a} को ${b} से गुणा करने पर ${c} मिलता है।` : `ਕਦਮ ${n}: ${a} ਨੂੰ ${b} ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ${c} ਮਿਲਦਾ ਹੈ।`],
    [/^Step (\d+): Divide (.+) by (.+) to get (.+)\.$/u, (_m, n, a, b, c) => hi ? `चरण ${n}: ${a} को ${b} से भाग देने पर ${c} मिलता है।` : `ਕਦਮ ${n}: ${a} ਨੂੰ ${b} ਨਾਲ ਭਾਗ ਕਰਨ ਤੇ ${c} ਮਿਲਦਾ ਹੈ।`],
    [/^Step (\d+): Add (.+) and (.+) to get (.+)\.$/u, (_m, n, a, b, c) => hi ? `चरण ${n}: ${a} और ${b} जोड़ने पर ${c} मिलता है।` : `ਕਦਮ ${n}: ${a} ਅਤੇ ${b} ਜੋੜਨ ਤੇ ${c} ਮਿਲਦਾ ਹੈ।`],
    [/^Step (\d+): Subtract (.+) from (.+) to get (.+)\.$/u, (_m, n, a, b, c) => hi ? `चरण ${n}: ${b} में से ${a} घटाने पर ${c} मिलता है।` : `ਕਦਮ ${n}: ${b} ਵਿਚੋਂ ${a} ਘਟਾਉਣ ਤੇ ${c} ਮਿਲਦਾ ਹੈ।`],
    [/^Step (\d+): Evaluate (.+); this gives (.+)\.$/u, (_m, n, a, c) => hi ? `चरण ${n}: ${a} का मान निकालने पर ${c} मिलता है।` : `ਕਦਮ ${n}: ${a} ਦਾ ਮੁੱਲ ਕੱਢਣ ਤੇ ${c} ਮਿਲਦਾ ਹੈ।`],
    [/^Step (\d+): (.+)$/u, (_m, n, rest) => hi ? `चरण ${n}: ${rest}` : `ਕਦਮ ${n}: ${rest}`],
    [/^Left = (.+)$/u, (_m, rest) => hi ? `बायाँ पक्ष = ${rest}` : `ਖੱਬਾ ਪਾਸਾ = ${rest}`],
    [/^Right = (.+)$/u, (_m, rest) => hi ? `दायाँ पक्ष = ${rest}` : `ਸੱਜਾ ਪਾਸਾ = ${rest}`],
  ];
  for (const [pattern, replacement] of rules) out = out.replace(pattern, replacement as any);
  return out;
}

function replaceWords(text: string, lexicon: Record<string, string>) {
  return text.replace(/[A-Za-z]+(?:'[A-Za-z]+)?/gu, (word) => {
    const replacement = lexicon[word.toLowerCase()];
    return replacement === undefined ? word : replacement;
  });
}

function tidyLocalizedText(text: string) {
  return text
    .replace(/\s{2,}/gu, " ")
    .replace(/\s+([,.;:?!।])/gu, "$1")
    .replace(/([([{])\s+/gu, "$1")
    .replace(/\s+([)\]}])/gu, "$1")
    .trim();
}

export function translateSapLearnerText(text: string, language: SapTranslationLanguage): string {
  if (!text.trim()) return text;
  const { masked, restore } = preserveMath(text, language);
  let localized = localizeCommonSentences(masked, language);
  localized = phraseReplace(localized, language === "hi" ? HI_PHRASES : PA_PHRASES);
  localized = replaceWords(localized, language === "hi" ? HI_WORDS : PA_WORDS);
  return tidyLocalizedText(restore(localized));
}

function localizeOptions(options: readonly string[], language: SapTranslationLanguage) {
  return options.map((option) => translateSapLearnerText(option, language));
}

function validateLocalization(base: any, localized: any, language: SapTranslationLanguage): SapLocalizationValidation {
  const errors: string[] = [];
  const learnerText = [localized.stem, ...localized.options, ...(localized.explanation?.lines ?? [])].join("\n");
  const scriptPresent = language === "hi" ? DEVANAGARI.test(learnerText) : GURMUKHI.test(learnerText);
  const optionOrderPreserved = localized.options.length === base.options.length;
  const correctIndexPreserved = localized.correctIndex === base.correctIndex;
  const answerBindingPreserved = localized.options[localized.correctIndex] === localized.answer;
  const mathematicalStatePreserved =
    localized.canonicalProblemId === base.canonicalProblemId &&
    localized.questionLanguageId === base.questionLanguageId &&
    localized.difficultyBand === base.difficultyBand &&
    localized.traceability?.sourceSeed === base.traceability?.sourceSeed;

  if (!scriptPresent) errors.push(`Required ${language} script is absent from learner-facing content.`);
  if (!optionOrderPreserved) errors.push("Localized option count/order contract changed.");
  if (!correctIndexPreserved) errors.push("Localized correctIndex changed.");
  if (!answerBindingPreserved) errors.push("Localized answer no longer matches the keyed option.");
  if (!mathematicalStatePreserved) errors.push("Localized package changed canonical mathematical state.");
  if (/\b(?:undefined|TODO|TBD|PLACEHOLDER)\b/iu.test(learnerText)) errors.push("Placeholder text leaked into localized learner content.");
  if (learnerText.includes("[object Object]")) errors.push("Object serialization leaked into localized learner content.");

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    language,
    scriptPresent,
    optionOrderPreserved,
    correctIndexPreserved,
    answerBindingPreserved,
    mathematicalStatePreserved,
  });
}

export function localizeSapQuestionPackage(base: any, language: SapTranslationLanguage) {
  const options = Object.freeze(localizeOptions(base.options, language));
  const correctIndex = base.correctIndex;
  const answer = options[correctIndex];
  const explanationLines = Object.freeze(
    (base.explanation?.lines ?? []).map((line: unknown) => translateSapLearnerText(String(line ?? ""), language)),
  );
  const locale = language === "hi" ? "hi-IN" : "pa-IN";
  const localized = {
    ...base,
    stem: translateSapLearnerText(base.stem, language),
    options,
    correctIndex,
    answer,
    language,
    locale,
    explanationId: `${base.questionLanguageId}-EXP-${language.toUpperCase()}`,
    questionId: `${base.questionId}-${language}`,
    reviewStatus: SAP_LOCALIZATION_LIFECYCLE.status,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    explanation: Object.freeze({ lines: explanationLines }),
    traceability: Object.freeze({
      ...(base.traceability ?? {}),
      localizationVersion: SAP_LOCALIZATION_VERSION,
      localizationLanguage: language,
      canonicalEnglishQuestionId: base.questionId,
      canonicalEnglishAnswer: base.answer,
      canonicalEnglishOptions: Object.freeze([...base.options]),
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
  };
  const localizationValidation = validateLocalization(base, localized, language);
  return Object.freeze({
    ...localized,
    localizationValidation,
    validation: Object.freeze({
      ok: Boolean(base.validation?.ok) && localizationValidation.ok,
      errors: Object.freeze([...(base.validation?.errors ?? []), ...localizationValidation.errors]),
    }),
  });
}
