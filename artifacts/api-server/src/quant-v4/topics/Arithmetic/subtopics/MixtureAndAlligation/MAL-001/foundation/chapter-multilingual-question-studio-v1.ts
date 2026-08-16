export type Mal001LocalizedLanguage = "hi" | "pa";

export const MAL_001_MULTILINGUAL_QUESTION_STUDIO_V1 = Object.freeze({
  localizationId: "MAL-001-HI-PA-QUESTION-STUDIO-V1",
  packageId: "MAL-001",
  languages: ["hi", "pa"] as const,
  mathematicalAuthorityLanguage: "en" as const,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

type Replacement = readonly [string | RegExp, string];

const PHRASES: Record<Mal001LocalizedLanguage, readonly Replacement[]> = {
  hi: [
    ["Method 1 — Simple Method", "विधि 1 — सरल विधि"],
    ["Method 2 — Alligation Cross", "विधि 2 — एलिगेशन क्रॉस"],
    ["Simple Method", "सरल विधि"],
    ["Alligation Cross", "एलिगेशन क्रॉस"],
    ["What is", "क्या है"],
    ["What are", "क्या हैं"],
    ["How much", "कितनी मात्रा"],
    ["How many", "कितने"],
    ["In what ratio", "किस अनुपात में"],
    ["At what rate", "किस दर पर"],
    ["What quantity", "कितनी मात्रा"],
    ["what quantity", "कितनी मात्रा"],
    ["what ratio", "कौन-सा अनुपात"],
    ["what percentage", "कितना प्रतिशत"],
    ["in that order", "उसी क्रम में"],
    ["in the same order", "उसी क्रम में"],
    ["in the order asked", "पूछे गए क्रम में"],
    ["per litre", "प्रति लीटर"],
    ["per kg", "प्रति किग्रा"],
    ["cost price", "क्रय मूल्य"],
    ["average price", "औसत मूल्य"],
    ["average-value equation", "औसत-मूल्य समीकरण"],
    ["weighted-average cost", "भारित औसत लागत"],
    ["profit percentage", "लाभ प्रतिशत"],
    ["final concentration", "अंतिम सांद्रता"],
    ["initial concentration", "प्रारंभिक सांद्रता"],
    ["original total quantity", "मूल कुल मात्रा"],
    ["total quantity", "कुल मात्रा"],
    ["original quantity", "मूल मात्रा"],
    ["final quantity", "अंतिम मात्रा"],
    ["required quantity", "आवश्यक मात्रा"],
    ["well-mixed contents", "अच्छी तरह मिले मिश्रण"],
    ["well-mixed mixture", "अच्छी तरह मिले मिश्रण"],
    ["well-mixed liquid", "अच्छी तरह मिले द्रव"],
    ["well-mixed", "अच्छी तरह मिला"],
    ["pure water", "शुद्ध पानी"],
    ["pure milk", "शुद्ध दूध"],
    ["pure fruit juice", "शुद्ध फलों का रस"],
    ["pure rose syrup", "शुद्ध गुलाब शरबत"],
    ["pure orange juice", "शुद्ध संतरे का रस"],
    ["pure ghee", "शुद्ध घी"],
    ["premium-grade rice", "प्रीमियम चावल"],
    ["standard-grade rice", "मानक चावल"],
    ["high-grade wheat", "उच्च-ग्रेड गेहूँ"],
    ["standard wheat", "मानक गेहूँ"],
    ["select wheat", "चुना हुआ गेहूँ"],
    ["regular tea leaves", "सामान्य चाय पत्ती"],
    ["premium tea leaves", "प्रीमियम चाय पत्ती"],
    ["house-blend beans", "हाउस-ब्लेंड कॉफी बीन्स"],
    ["estate beans", "एस्टेट कॉफी बीन्स"],
    ["regular oil", "सामान्य तेल"],
    ["premium oil", "प्रीमियम तेल"],
    ["cold-pressed oil", "कोल्ड-प्रेस्ड तेल"],
    ["mustard oil", "सरसों का तेल"],
    ["coconut oil", "नारियल तेल"],
    ["red lentils", "लाल दाल"],
    ["yellow lentils", "पीली दाल"],
    ["green lentils", "हरी दाल"],
    ["Assam tea", "असम चाय"],
    ["Darjeeling tea", "दार्जिलिंग चाय"],
    ["fruit concentrate", "फलों का कंसन्ट्रेट"],
    ["syrup concentrate", "शरबत कंसन्ट्रेट"],
    ["acid solution", "अम्ल घोल"],
    ["alcohol solution", "अल्कोहल घोल"],
    ["salt-water solution", "नमक-पानी का घोल"],
    ["alcohol-water mixture", "अल्कोहल-पानी का मिश्रण"],
    ["spirit-water mixture", "स्पिरिट-पानी का मिश्रण"],
    ["milk-water mixture", "दूध-पानी का मिश्रण"],
    ["fruit juice-water mixture", "फल-रस और पानी का मिश्रण"],
    ["dissolved solute", "घुला हुआ विलेय"],
    ["dry matter", "शुष्क पदार्थ"],
    ["same concentration", "समान सांद्रता"],
    ["same quantity", "समान मात्रा"],
    ["one ratio part", "अनुपात का एक भाग"],
    ["ratio parts", "अनुपात के भाग"],
    ["one part", "एक भाग"],
    ["target ratio", "लक्षित अनुपात"],
    ["initial ratio", "प्रारंभिक अनुपात"],
    ["final ratio", "अंतिम अनुपात"],
    ["new ratio", "नया अनुपात"],
    ["starting volume", "प्रारंभिक आयतन"],
    ["final volume", "अंतिम आयतन"],
    ["total volume", "कुल आयतन"],
    ["retained fraction", "बचा हुआ अंश"],
    ["cumulative retained fraction", "कुल बचा हुआ अंश"],
    ["original component", "मूल घटक"],
    ["original solution", "मूल घोल"],
    ["original syrup", "मूल शरबत"],
    ["amount added", "जोड़ी गई मात्रा"],
    ["amount removed", "निकाली गई मात्रा"],
    ["amount of water", "पानी की मात्रा"],
    ["amount of dry matter", "शुष्क पदार्थ की मात्रा"],
    ["free water", "बिना लागत का पानी"],
    ["mixture's average cost", "मिश्रण की औसत लागत"],
    ["mixture's average price", "मिश्रण का औसत मूल्य"],
    ["the mixture is sold", "मिश्रण बेचा जाता है"],
    ["the mixture is valued", "मिश्रण का मूल्य"],
    ["is sold at", "पर बेचा जाता है"],
    ["is added", "जोड़ा जाता है"],
    ["is removed", "निकाला जाता है"],
    ["are removed", "निकाले जाते हैं"],
    ["are transferred", "स्थानांतरित किए जाते हैं"],
    ["is transferred", "स्थानांतरित किया जाता है"],
    ["is moved", "स्थानांतरित किया जाता है"],
    ["are moved", "स्थानांतरित किए जाते हैं"],
    ["is replaced", "से वापस भरा जाता है"],
    ["and replaced with", "और उसकी जगह"],
    ["and refilling the same amount with", "और उतनी ही मात्रा से वापस भरने पर"],
    ["without replacement", "बिना वापस भरे"],
    ["after every removal", "हर निकासी के बाद"],
    ["After mixing", "मिलाने के बाद"],
    ["after mixing", "मिलाने के बाद"],
    ["After drying", "सुखाने के बाद"],
    ["after drying", "सुखाने के बाद"],
    ["On evaporation of water", "पानी के वाष्पीकरण पर"],
    ["only water evaporates", "केवल पानी वाष्पित होता है"],
    ["remains unchanged", "अपरिवर्तित रहती है"],
    ["remains", "बची रहती है"],
    ["is present", "उपस्थित है"],
    ["was present initially", "शुरू में मौजूद था"],
    ["should be added", "जोड़ा जाना चाहिए"],
    ["must be added", "जोड़ना होगा"],
    ["should be removed", "निकाला जाना चाहिए"],
    ["must be removed", "निकालना होगा"],
    ["must be mixed with", "के साथ मिलाना होगा"],
    ["should be mixed", "मिलाया जाना चाहिए"],
    ["must be moved", "स्थानांतरित करना होगा"],
    ["should be replaced", "बदला जाना चाहिए"],
    ["needed to obtain", "प्राप्त करने के लिए आवश्यक है"],
    ["to produce a mixture worth", "मूल्य का मिश्रण बनाने के लिए"],
    ["to make the ratio", "अनुपात को"],
    ["to change the concentration to", "सांद्रता को बदलकर"],
    ["to reach", "तक पहुँचाने के लिए"],
    ["to earn", "कमाने के लिए"],
    ["to obtain", "प्राप्त करने के लिए"],
    ["to water", "से पानी"],
    ["of water", "पानी का"],
    ["of acid", "अम्ल का"],
    ["of salt", "नमक का"],
    ["of alcohol", "अल्कोहल का"],
    ["of solution", "घोल का"],
    ["of the vessel", "पात्र का"],
    ["of the mixture", "मिश्रण का"],
    ["of the final mixture", "अंतिम मिश्रण का"],
    ["of the original", "मूल का"],
    ["of pure", "शुद्ध"],
    ["in each operation", "हर क्रिया में"],
    ["in each of", "प्रत्येक"],
    ["each time", "हर बार"],
    ["Every time", "हर बार"],
    ["successive", "क्रमिक"],
    ["respectively", "क्रमशः"],
    ["finally", "अंत में"],
    ["initially", "शुरू में"],
    ["First,", "पहले,"],
    ["First", "पहले"],
    ["Next,", "फिर,"],
    ["Then", "फिर"],
    ["After", "बाद में"],
    ["Given that", "दिया है कि"],
    ["Given the", "दिया गया"],
    ["Therefore", "अतः"],
    ["Hence", "इसलिए"],
    ["So", "अतः"],
    ["Let", "मान लें"],
    ["Find", "ज्ञात करें"],
    ["Calculate", "गणना करें"],
    ["Form", "बनाएँ"],
    ["Write", "लिखें"],
    ["Solve", "हल करें"],
    ["Expand", "विस्तार करें"],
    ["Rearrange", "पुनर्व्यवस्थित करें"],
    ["Update", "नई मात्रा निकालें"],
    ["Add", "जोड़ें"],
    ["Subtract", "घटाएँ"],
    ["Multiply", "गुणा करें"],
    ["Divide", "भाग दें"],
    ["Because", "क्योंकि"],
    ["Since", "चूँकि"],
  ],
  pa: [
    ["Method 1 — Simple Method", "ਤਰੀਕਾ 1 — ਸਧਾਰਣ ਤਰੀਕਾ"],
    ["Method 2 — Alligation Cross", "ਤਰੀਕਾ 2 — ਐਲੀਗੇਸ਼ਨ ਕ੍ਰਾਸ"],
    ["Simple Method", "ਸਧਾਰਣ ਤਰੀਕਾ"],
    ["Alligation Cross", "ਐਲੀਗੇਸ਼ਨ ਕ੍ਰਾਸ"],
    ["What is", "ਕੀ ਹੈ"],
    ["What are", "ਕੀ ਹਨ"],
    ["How much", "ਕਿੰਨੀ ਮਾਤਰਾ"],
    ["How many", "ਕਿੰਨੇ"],
    ["In what ratio", "ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ"],
    ["At what rate", "ਕਿਹੜੀ ਦਰ 'ਤੇ"],
    ["What quantity", "ਕਿੰਨੀ ਮਾਤਰਾ"],
    ["what quantity", "ਕਿੰਨੀ ਮਾਤਰਾ"],
    ["what ratio", "ਕਿਹੜਾ ਅਨੁਪਾਤ"],
    ["what percentage", "ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ"],
    ["in that order", "ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ"],
    ["in the same order", "ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ"],
    ["in the order asked", "ਪੁੱਛੇ ਕ੍ਰਮ ਵਿੱਚ"],
    ["per litre", "ਪ੍ਰਤੀ ਲੀਟਰ"],
    ["per kg", "ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ"],
    ["cost price", "ਖਰੀਦ ਮੁੱਲ"],
    ["average price", "ਔਸਤ ਮੁੱਲ"],
    ["average-value equation", "ਔਸਤ-ਮੁੱਲ ਸਮੀਕਰਨ"],
    ["weighted-average cost", "ਭਾਰਿਤ ਔਸਤ ਲਾਗਤ"],
    ["profit percentage", "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ"],
    ["final concentration", "ਅੰਤਿਮ ਸੰਘਣਾਪਣ"],
    ["initial concentration", "ਸ਼ੁਰੂਆਤੀ ਸੰਘਣਾਪਣ"],
    ["original total quantity", "ਮੂਲ ਕੁੱਲ ਮਾਤਰਾ"],
    ["total quantity", "ਕੁੱਲ ਮਾਤਰਾ"],
    ["original quantity", "ਮੂਲ ਮਾਤਰਾ"],
    ["final quantity", "ਅੰਤਿਮ ਮਾਤਰਾ"],
    ["required quantity", "ਲੋੜੀਂਦੀ ਮਾਤਰਾ"],
    ["well-mixed contents", "ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ"],
    ["well-mixed mixture", "ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ"],
    ["well-mixed liquid", "ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ"],
    ["well-mixed", "ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਿਆ"],
    ["pure water", "ਸ਼ੁੱਧ ਪਾਣੀ"],
    ["pure milk", "ਸ਼ੁੱਧ ਦੁੱਧ"],
    ["pure fruit juice", "ਸ਼ੁੱਧ ਫਲਾਂ ਦਾ ਰਸ"],
    ["pure rose syrup", "ਸ਼ੁੱਧ ਗੁਲਾਬ ਸ਼ਰਬਤ"],
    ["pure orange juice", "ਸ਼ੁੱਧ ਸੰਤਰੇ ਦਾ ਰਸ"],
    ["pure ghee", "ਸ਼ੁੱਧ ਘਿਉ"],
    ["premium-grade rice", "ਪ੍ਰੀਮੀਅਮ ਚੌਲ"],
    ["standard-grade rice", "ਮਿਆਰੀ ਚੌਲ"],
    ["high-grade wheat", "ਉੱਚ-ਗ੍ਰੇਡ ਕਣਕ"],
    ["standard wheat", "ਮਿਆਰੀ ਕਣਕ"],
    ["select wheat", "ਚੁਣੀ ਹੋਈ ਕਣਕ"],
    ["regular tea leaves", "ਆਮ ਚਾਹ ਪੱਤੀ"],
    ["premium tea leaves", "ਪ੍ਰੀਮੀਅਮ ਚਾਹ ਪੱਤੀ"],
    ["house-blend beans", "ਹਾਊਸ-ਬਲੈਂਡ ਕੌਫੀ ਬੀਨਜ਼"],
    ["estate beans", "ਐਸਟੇਟ ਕੌਫੀ ਬੀਨਜ਼"],
    ["regular oil", "ਆਮ ਤੇਲ"],
    ["premium oil", "ਪ੍ਰੀਮੀਅਮ ਤੇਲ"],
    ["cold-pressed oil", "ਕੋਲਡ-ਪ੍ਰੈੱਸਡ ਤੇਲ"],
    ["mustard oil", "ਸਰੋਂ ਦਾ ਤੇਲ"],
    ["coconut oil", "ਨਾਰੀਅਲ ਤੇਲ"],
    ["red lentils", "ਲਾਲ ਦਾਲ"],
    ["yellow lentils", "ਪੀਲੀ ਦਾਲ"],
    ["green lentils", "ਹਰੀ ਦਾਲ"],
    ["Assam tea", "ਅਸਾਮ ਚਾਹ"],
    ["Darjeeling tea", "ਦਾਰਜੀਲਿੰਗ ਚਾਹ"],
    ["fruit concentrate", "ਫਲਾਂ ਦਾ ਕਨਸਨਟ੍ਰੇਟ"],
    ["syrup concentrate", "ਸ਼ਰਬਤ ਕਨਸਨਟ੍ਰੇਟ"],
    ["acid solution", "ਤੇਜ਼ਾਬੀ ਘੋਲ"],
    ["alcohol solution", "ਅਲਕੋਹਲ ਘੋਲ"],
    ["salt-water solution", "ਨਮਕ-ਪਾਣੀ ਦਾ ਘੋਲ"],
    ["alcohol-water mixture", "ਅਲਕੋਹਲ-ਪਾਣੀ ਮਿਸ਼ਰਣ"],
    ["spirit-water mixture", "ਸਪਿਰਿਟ-ਪਾਣੀ ਮਿਸ਼ਰਣ"],
    ["milk-water mixture", "ਦੁੱਧ-ਪਾਣੀ ਮਿਸ਼ਰਣ"],
    ["fruit juice-water mixture", "ਫਲ-ਰਸ ਅਤੇ ਪਾਣੀ ਦਾ ਮਿਸ਼ਰਣ"],
    ["dissolved solute", "ਘੁਲਿਆ ਹੋਇਆ ਵਿੱਲੇਯ"],
    ["dry matter", "ਸੁੱਕਾ ਪਦਾਰਥ"],
    ["same concentration", "ਇੱਕੋ ਸੰਘਣਾਪਣ"],
    ["same quantity", "ਇੱਕੋ ਮਾਤਰਾ"],
    ["one ratio part", "ਅਨੁਪਾਤ ਦਾ ਇੱਕ ਹਿੱਸਾ"],
    ["ratio parts", "ਅਨੁਪਾਤ ਦੇ ਹਿੱਸੇ"],
    ["one part", "ਇੱਕ ਹਿੱਸਾ"],
    ["target ratio", "ਟੀਚਾ ਅਨੁਪਾਤ"],
    ["initial ratio", "ਸ਼ੁਰੂਆਤੀ ਅਨੁਪਾਤ"],
    ["final ratio", "ਅੰਤਿਮ ਅਨੁਪਾਤ"],
    ["new ratio", "ਨਵਾਂ ਅਨੁਪਾਤ"],
    ["starting volume", "ਸ਼ੁਰੂਆਤੀ ਆਇਤਨ"],
    ["final volume", "ਅੰਤਿਮ ਆਇਤਨ"],
    ["total volume", "ਕੁੱਲ ਆਇਤਨ"],
    ["retained fraction", "ਬਚਿਆ ਅੰਸ਼"],
    ["cumulative retained fraction", "ਕੁੱਲ ਬਚਿਆ ਅੰਸ਼"],
    ["original component", "ਮੂਲ ਘਟਕ"],
    ["original solution", "ਮੂਲ ਘੋਲ"],
    ["original syrup", "ਮੂਲ ਸ਼ਰਬਤ"],
    ["amount added", "ਜੋੜੀ ਮਾਤਰਾ"],
    ["amount removed", "ਕੱਢੀ ਮਾਤਰਾ"],
    ["amount of water", "ਪਾਣੀ ਦੀ ਮਾਤਰਾ"],
    ["amount of dry matter", "ਸੁੱਕੇ ਪਦਾਰਥ ਦੀ ਮਾਤਰਾ"],
    ["free water", "ਬਿਨਾਂ ਲਾਗਤ ਵਾਲਾ ਪਾਣੀ"],
    ["mixture's average cost", "ਮਿਸ਼ਰਣ ਦੀ ਔਸਤ ਲਾਗਤ"],
    ["mixture's average price", "ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ"],
    ["the mixture is sold", "ਮਿਸ਼ਰਣ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ"],
    ["the mixture is valued", "ਮਿਸ਼ਰਣ ਦਾ ਮੁੱਲ"],
    ["is sold at", "'ਤੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ"],
    ["is added", "ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ"],
    ["is removed", "ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ"],
    ["are removed", "ਕੱਢੇ ਜਾਂਦੇ ਹਨ"],
    ["are transferred", "ਟ੍ਰਾਂਸਫਰ ਕੀਤੇ ਜਾਂਦੇ ਹਨ"],
    ["is transferred", "ਟ੍ਰਾਂਸਫਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ"],
    ["is moved", "ਟ੍ਰਾਂਸਫਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ"],
    ["are moved", "ਟ੍ਰਾਂਸਫਰ ਕੀਤੇ ਜਾਂਦੇ ਹਨ"],
    ["is replaced", "ਦੀ ਥਾਂ ਮੁੜ ਭਰਿਆ ਜਾਂਦਾ ਹੈ"],
    ["and replaced with", "ਅਤੇ ਉਸ ਦੀ ਥਾਂ"],
    ["and refilling the same amount with", "ਅਤੇ ਉੱਨੀ ਹੀ ਮਾਤਰਾ ਨਾਲ ਮੁੜ ਭਰਨ 'ਤੇ"],
    ["without replacement", "ਬਿਨਾਂ ਮੁੜ ਭਰੇ"],
    ["after every removal", "ਹਰ ਵਾਰ ਕੱਢਣ ਤੋਂ ਬਾਅਦ"],
    ["After mixing", "ਮਿਲਾਉਣ ਤੋਂ ਬਾਅਦ"],
    ["after mixing", "ਮਿਲਾਉਣ ਤੋਂ ਬਾਅਦ"],
    ["After drying", "ਸੁਕਾਉਣ ਤੋਂ ਬਾਅਦ"],
    ["after drying", "ਸੁਕਾਉਣ ਤੋਂ ਬਾਅਦ"],
    ["On evaporation of water", "ਪਾਣੀ ਦੇ ਬਾਫ਼ ਬਣਨ 'ਤੇ"],
    ["only water evaporates", "ਕੇਵਲ ਪਾਣੀ ਬਾਫ਼ ਬਣਦਾ ਹੈ"],
    ["remains unchanged", "ਬਦਲਦੀ ਨਹੀਂ"],
    ["remains", "ਬਚੀ ਰਹਿੰਦੀ ਹੈ"],
    ["is present", "ਮੌਜੂਦ ਹੈ"],
    ["was present initially", "ਸ਼ੁਰੂ ਵਿੱਚ ਮੌਜੂਦ ਸੀ"],
    ["should be added", "ਜੋੜਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ"],
    ["must be added", "ਜੋੜਨਾ ਪਵੇਗਾ"],
    ["should be removed", "ਕੱਢਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ"],
    ["must be removed", "ਕੱਢਣਾ ਪਵੇਗਾ"],
    ["must be mixed with", "ਨਾਲ ਮਿਲਾਉਣਾ ਪਵੇਗਾ"],
    ["should be mixed", "ਮਿਲਾਇਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ"],
    ["must be moved", "ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ"],
    ["should be replaced", "ਬਦਲਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ"],
    ["needed to obtain", "ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਲੋੜੀਂਦੀ ਹੈ"],
    ["to produce a mixture worth", "ਮੁੱਲ ਦਾ ਮਿਸ਼ਰਣ ਬਣਾਉਣ ਲਈ"],
    ["to make the ratio", "ਅਨੁਪਾਤ ਨੂੰ"],
    ["to change the concentration to", "ਸੰਘਣਾਪਣ ਨੂੰ ਬਦਲ ਕੇ"],
    ["to reach", "ਤੱਕ ਪਹੁੰਚਾਉਣ ਲਈ"],
    ["to earn", "ਕਮਾਉਣ ਲਈ"],
    ["to obtain", "ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ"],
    ["to water", "ਤੋਂ ਪਾਣੀ"],
    ["of water", "ਪਾਣੀ ਦਾ"],
    ["of acid", "ਤੇਜ਼ਾਬ ਦਾ"],
    ["of salt", "ਨਮਕ ਦਾ"],
    ["of alcohol", "ਅਲਕੋਹਲ ਦਾ"],
    ["of solution", "ਘੋਲ ਦਾ"],
    ["of the vessel", "ਭਾਂਡੇ ਦਾ"],
    ["of the mixture", "ਮਿਸ਼ਰਣ ਦਾ"],
    ["of the final mixture", "ਅੰਤਿਮ ਮਿਸ਼ਰਣ ਦਾ"],
    ["of the original", "ਮੂਲ ਦਾ"],
    ["of pure", "ਸ਼ੁੱਧ"],
    ["in each operation", "ਹਰ ਕਿਰਿਆ ਵਿੱਚ"],
    ["in each of", "ਹਰ ਇੱਕ"],
    ["each time", "ਹਰ ਵਾਰ"],
    ["Every time", "ਹਰ ਵਾਰ"],
    ["successive", "ਲਗਾਤਾਰ"],
    ["respectively", "ਕ੍ਰਮਵਾਰ"],
    ["finally", "ਅਖੀਰ ਵਿੱਚ"],
    ["initially", "ਸ਼ੁਰੂ ਵਿੱਚ"],
    ["First,", "ਪਹਿਲਾਂ,"],
    ["First", "ਪਹਿਲਾਂ"],
    ["Next,", "ਫਿਰ,"],
    ["Then", "ਫਿਰ"],
    ["After", "ਬਾਅਦ ਵਿੱਚ"],
    ["Given that", "ਦਿੱਤਾ ਹੈ ਕਿ"],
    ["Given the", "ਦਿੱਤਾ ਗਿਆ"],
    ["Therefore", "ਇਸ ਲਈ"],
    ["Hence", "ਇਸ ਲਈ"],
    ["So", "ਇਸ ਲਈ"],
    ["Let", "ਮੰਨ ਲਓ"],
    ["Find", "ਪਤਾ ਕਰੋ"],
    ["Calculate", "ਗਣਨਾ ਕਰੋ"],
    ["Form", "ਬਣਾਓ"],
    ["Write", "ਲਿਖੋ"],
    ["Solve", "ਹੱਲ ਕਰੋ"],
    ["Expand", "ਖੋਲ੍ਹੋ"],
    ["Rearrange", "ਮੁੜ ਵਿਵਸਥਿਤ ਕਰੋ"],
    ["Update", "ਨਵੀਂ ਮਾਤਰਾ ਕੱਢੋ"],
    ["Add", "ਜੋੜੋ"],
    ["Subtract", "ਘਟਾਓ"],
    ["Multiply", "ਗੁਣਾ ਕਰੋ"],
    ["Divide", "ਭਾਗ ਦਿਓ"],
    ["Because", "ਕਿਉਂਕਿ"],
    ["Since", "ਕਿਉਂਕਿ"],
  ],
};

const WORDS: Record<Mal001LocalizedLanguage, Readonly<Record<string, string>>> = {
  hi: {
    a: "एक", an: "एक", the: "", of: "का", and: "और", or: "या", with: "के साथ", from: "से", to: "को", in: "में", at: "पर", by: "से", for: "के लिए", as: "के रूप में", into: "में", on: "पर", only: "केवल", same: "समान", different: "अलग", every: "हर", each: "प्रत्येक", once: "एक बार", again: "फिर", back: "वापस", above: "ऊपर", below: "नीचे", left: "बचा", behind: "पीछे", together: "साथ", respectively: "क्रमशः",
    mixture: "मिश्रण", mixtures: "मिश्रण", solution: "घोल", liquid: "द्रव", contents: "मिश्रण", component: "घटक", ingredient: "घटक", ingredients: "घटक", grade: "ग्रेड", grades: "ग्रेड", item: "वस्तु", items: "वस्तुएँ", batch: "बैच", sample: "नमूना", vessel: "पात्र", vessels: "पात्र", container: "पात्र", tank: "टंकी", can: "डिब्बा",
    quantity: "मात्रा", quantities: "मात्राएँ", amount: "मात्रा", total: "कुल", average: "औसत", value: "मूल्य", price: "मूल्य", cost: "लागत", rate: "दर", ratio: "अनुपात", proportion: "अनुपात", part: "भाग", parts: "भाग", fraction: "अंश", percentage: "प्रतिशत", percent: "प्रतिशत", concentration: "सांद्रता", volume: "आयतन", capacity: "क्षमता", mass: "भार", moisture: "नमी", profit: "लाभ", revenue: "बिक्री राशि", selling: "विक्रय", target: "लक्षित", required: "आवश्यक", known: "ज्ञात", unknown: "अज्ञात", original: "मूल", initial: "प्रारंभिक", final: "अंतिम", new: "नया", remaining: "शेष", retained: "बचा हुआ", pure: "शुद्ध", free: "बिना लागत", equal: "समान", fixed: "निश्चित", strict: "सख्त",
    litre: "लीटर", litres: "लीटर", kg: "किग्रा", ml: "मिलीलीटर", unit: "इकाई", units: "इकाइयाँ", operation: "क्रिया", operations: "क्रियाएँ", replacement: "प्रतिस्थापन", replacements: "प्रतिस्थापन", removal: "निकासी", stage: "चरण", stages: "चरण", process: "प्रक्रिया", check: "जाँच", order: "क्रम", answer: "उत्तर", equation: "समीकरण", terms: "पद", difference: "अंतर", differences: "अंतर", denominator: "हर", root: "मूल", square: "वर्ग", crossing: "पार होना",
    water: "पानी", milk: "दूध", oil: "तेल", rice: "चावल", wheat: "गेहूँ", barley: "जौ", tea: "चाय", coffee: "कॉफी", beans: "बीन्स", lentils: "दाल", copper: "ताँबा", zinc: "जस्ता", diesel: "डीजल", kerosene: "मिट्टी का तेल", petrol: "पेट्रोल", ethanol: "एथेनॉल", syrup: "शरबत", solvent: "विलायक", acid: "अम्ल", alcohol: "अल्कोहल", salt: "नमक", spirit: "स्पिरिट", glycerin: "ग्लिसरीन", cement: "सीमेंट", sand: "रेत", juice: "रस", fruit: "फल", ghee: "घी", vanaspati: "वनस्पति", chicory: "चिकोरी", concentrate: "कंसन्ट्रेट", solute: "विलेय", matter: "पदार्थ", dry: "सूखा", wet: "गीला", fresh: "ताज़ा", dried: "सूखा",
    regular: "सामान्य", premium: "प्रीमियम", standard: "मानक", select: "चुना हुआ", high: "उच्च", lower: "निम्न", adulterated: "मिलावटी", added: "जोड़ा", removed: "निकाला", mixed: "मिलाया", blended: "मिलाया", transferred: "स्थानांतरित", moved: "स्थानांतरित", replaced: "बदला", refilling: "वापस भरना", restored: "वापस भरा", drawn: "निकाला", sent: "भेजा", swapped: "अदला-बदली", evaporates: "वाष्पित होता है", evaporation: "वाष्पीकरण", drying: "सुखाना", rises: "बढ़ती है", becomes: "हो जाता है", became: "हो गया", exceed: "से अधिक हो", reach: "पहुँचे", earn: "कमाएँ", earns: "कमाता है", gives: "देता है", obtain: "प्राप्त करें", obtains: "प्राप्त करता है", produce: "बनाएँ", prepares: "तैयार करता है", combines: "मिलाता है", contains: "में है", contain: "में हैं", has: "में है", holds: "में है", starts: "शुरू होता है", records: "दर्ज करता है", uses: "उपयोग करता है", buys: "खरीदता है", sells: "बेचता है", mixes: "मिलाता है", adds: "जोड़ता है", adulterates: "मिलावट करता है", transfers: "स्थानांतरित करता है", return: "वापस करें", returns: "वापस करता है", left: "बचा", remains: "बचा रहता है", present: "मौजूद", needed: "आवश्यक", needed: "आवश्यक", required: "आवश्यक", worth: "मूल्य का", priced: "मूल्य वाले", costing: "लागत वाले", valued: "मूल्यांकित", sold: "बेचा", initially: "शुरू में", finally: "अंत में",
    what: "क्या", how: "कितना", many: "कितने", much: "कितनी मात्रा", which: "कौन-सा", will: "होगा", should: "चाहिए", must: "होगा", is: "है", are: "हैं", was: "था", were: "थे", be: "हो", being: "होते हुए", it: "यह", its: "इसका", their: "उनकी", both: "दोनों", two: "दो", three: "तीन", one: "एक", first: "पहला", last: "अंतिम", next: "अगला", after: "बाद", before: "पहले", then: "फिर", if: "यदि", so: "अतः", that: "कि", this: "यह", these: "ये", those: "वे", given: "दिया", using: "उपयोग करके", use: "उपयोग करें", let: "मान लें", find: "ज्ञात करें", calculate: "गणना करें", form: "बनाएँ", write: "लिखें", solve: "हल करें", set: "बराबर रखें", multiply: "गुणा करें", divide: "भाग दें", add: "जोड़ें", subtract: "घटाएँ", compare: "तुलना करें", increase: "बढ़ाएँ", change: "बदलें", take: "लें", taken: "निकाला", out: "बाहर", without: "बिना", still: "अभी भी", more: "अधिक", less: "कम", higher: "अधिक", lower: "कम", dearer: "महँगा", cheaper: "सस्ता", actual: "वास्तविक", stated: "दिया गया", shown: "दिखाया गया", opposite: "विपरीत", single: "एक", complete: "पूरा", uniformly: "समान रूप से", simultaneously: "एक साथ", successive: "क्रमिक",
    distributor: "वितरक", roaster: "रोस्टर", seller: "विक्रेता", wholesaler: "थोक विक्रेता", merchant: "व्यापारी", dealer: "व्यापारी", vendor: "विक्रेता", dairyman: "दूध विक्रेता", storekeeper: "दुकानदार", student: "विद्यार्थी", grain: "अनाज", dairy: "डेयरी", drink: "पेय", beverage: "पेय", apple: "सेब", orange: "संतरा", rose: "गुलाब", assam: "असम", darjeeling: "दार्जिलिंग", estate: "एस्टेट", house: "हाउस", blend: "ब्लेंड", pressed: "प्रेस्ड",
  },
  pa: {
    a: "ਇੱਕ", an: "ਇੱਕ", the: "", of: "ਦਾ", and: "ਅਤੇ", or: "ਜਾਂ", with: "ਨਾਲ", from: "ਤੋਂ", to: "ਨੂੰ", in: "ਵਿੱਚ", at: "'ਤੇ", by: "ਨਾਲ", for: "ਲਈ", as: "ਵਜੋਂ", into: "ਵਿੱਚ", on: "'ਤੇ", only: "ਕੇਵਲ", same: "ਇੱਕੋ", different: "ਵੱਖਰੀ", every: "ਹਰ", each: "ਹਰੇਕ", once: "ਇੱਕ ਵਾਰ", again: "ਫਿਰ", back: "ਵਾਪਸ", above: "ਉੱਪਰ", below: "ਹੇਠਾਂ", left: "ਬਚਿਆ", behind: "ਪਿੱਛੇ", together: "ਇਕੱਠੇ", respectively: "ਕ੍ਰਮਵਾਰ",
    mixture: "ਮਿਸ਼ਰਣ", mixtures: "ਮਿਸ਼ਰਣ", solution: "ਘੋਲ", liquid: "ਤਰਲ", contents: "ਮਿਸ਼ਰਣ", component: "ਘਟਕ", ingredient: "ਘਟਕ", ingredients: "ਘਟਕ", grade: "ਗ੍ਰੇਡ", grades: "ਗ੍ਰੇਡ", item: "ਵਸਤੂ", items: "ਵਸਤੂਆਂ", batch: "ਬੈਚ", sample: "ਨਮੂਨਾ", vessel: "ਭਾਂਡਾ", vessels: "ਭਾਂਡੇ", container: "ਭਾਂਡਾ", tank: "ਟੈਂਕ", can: "ਡੱਬਾ",
    quantity: "ਮਾਤਰਾ", quantities: "ਮਾਤਰਾਵਾਂ", amount: "ਮਾਤਰਾ", total: "ਕੁੱਲ", average: "ਔਸਤ", value: "ਮੁੱਲ", price: "ਮੁੱਲ", cost: "ਲਾਗਤ", rate: "ਦਰ", ratio: "ਅਨੁਪਾਤ", proportion: "ਅਨੁਪਾਤ", part: "ਹਿੱਸਾ", parts: "ਹਿੱਸੇ", fraction: "ਅੰਸ਼", percentage: "ਪ੍ਰਤੀਸ਼ਤ", percent: "ਪ੍ਰਤੀਸ਼ਤ", concentration: "ਸੰਘਣਾਪਣ", volume: "ਆਇਤਨ", capacity: "ਸਮਰੱਥਾ", mass: "ਭਾਰ", moisture: "ਨਮੀ", profit: "ਲਾਭ", revenue: "ਵਿਕਰੀ ਰਕਮ", selling: "ਵਿਕਰੀ", target: "ਟੀਚਾ", required: "ਲੋੜੀਂਦੀ", known: "ਪਤਾ", unknown: "ਅਣਜਾਣ", original: "ਮੂਲ", initial: "ਸ਼ੁਰੂਆਤੀ", final: "ਅੰਤਿਮ", new: "ਨਵਾਂ", remaining: "ਬਾਕੀ", retained: "ਬਚਿਆ", pure: "ਸ਼ੁੱਧ", free: "ਬਿਨਾਂ ਲਾਗਤ", equal: "ਬਰਾਬਰ", fixed: "ਨਿਰਧਾਰਤ", strict: "ਸਖ਼ਤ",
    litre: "ਲੀਟਰ", litres: "ਲੀਟਰ", kg: "ਕਿਲੋਗ੍ਰਾਮ", ml: "ਮਿਲੀਲੀਟਰ", unit: "ਇਕਾਈ", units: "ਇਕਾਈਆਂ", operation: "ਕਿਰਿਆ", operations: "ਕਿਰਿਆਵਾਂ", replacement: "ਬਦਲੀ", replacements: "ਬਦਲੀਆਂ", removal: "ਕੱਢਣਾ", stage: "ਪੜਾਅ", stages: "ਪੜਾਅ", process: "ਪ੍ਰਕਿਰਿਆ", check: "ਜਾਂਚ", order: "ਕ੍ਰਮ", answer: "ਉੱਤਰ", equation: "ਸਮੀਕਰਨ", terms: "ਪਦ", difference: "ਫਰਕ", differences: "ਫਰਕ", denominator: "ਹਰ", root: "ਮੂਲ", square: "ਵਰਗ", crossing: "ਪਾਰ ਹੋਣਾ",
    water: "ਪਾਣੀ", milk: "ਦੁੱਧ", oil: "ਤੇਲ", rice: "ਚੌਲ", wheat: "ਕਣਕ", barley: "ਜੌਂ", tea: "ਚਾਹ", coffee: "ਕੌਫੀ", beans: "ਬੀਨਜ਼", lentils: "ਦਾਲ", copper: "ਤਾਂਬਾ", zinc: "ਜ਼ਿੰਕ", diesel: "ਡੀਜ਼ਲ", kerosene: "ਮਿੱਟੀ ਦਾ ਤੇਲ", petrol: "ਪੈਟਰੋਲ", ethanol: "ਈਥਨਾਲ", syrup: "ਸ਼ਰਬਤ", solvent: "ਘੋਲਕ", acid: "ਤੇਜ਼ਾਬ", alcohol: "ਅਲਕੋਹਲ", salt: "ਨਮਕ", spirit: "ਸਪਿਰਿਟ", glycerin: "ਗਲਿਸਰੀਨ", cement: "ਸੀਮੈਂਟ", sand: "ਰੇਤ", juice: "ਰਸ", fruit: "ਫਲ", ghee: "ਘਿਉ", vanaspati: "ਵਨਸਪਤੀ", chicory: "ਚਿਕੋਰੀ", concentrate: "ਕਨਸਨਟ੍ਰੇਟ", solute: "ਵਿੱਲੇਯ", matter: "ਪਦਾਰਥ", dry: "ਸੁੱਕਾ", wet: "ਗਿੱਲਾ", fresh: "ਤਾਜ਼ਾ", dried: "ਸੁੱਕਾ",
    regular: "ਆਮ", premium: "ਪ੍ਰੀਮੀਅਮ", standard: "ਮਿਆਰੀ", select: "ਚੁਣਿਆ", high: "ਉੱਚ", lower: "ਹੇਠਲਾ", adulterated: "ਮਿਲਾਵਟੀ", added: "ਜੋੜਿਆ", removed: "ਕੱਢਿਆ", mixed: "ਮਿਲਾਇਆ", blended: "ਮਿਲਾਇਆ", transferred: "ਟ੍ਰਾਂਸਫਰ", moved: "ਟ੍ਰਾਂਸਫਰ", replaced: "ਬਦਲਿਆ", refilling: "ਮੁੜ ਭਰਨਾ", restored: "ਮੁੜ ਭਰਿਆ", drawn: "ਕੱਢਿਆ", sent: "ਭੇਜਿਆ", swapped: "ਅਦਲਾ-ਬਦਲੀ", evaporates: "ਬਾਫ਼ ਬਣਦਾ ਹੈ", evaporation: "ਬਾਫ਼ ਬਣਨਾ", drying: "ਸੁਕਾਉਣਾ", rises: "ਵਧਦਾ ਹੈ", becomes: "ਹੋ ਜਾਂਦਾ ਹੈ", became: "ਹੋ ਗਿਆ", exceed: "ਤੋਂ ਵੱਧ ਹੋਵੇ", reach: "ਪਹੁੰਚੇ", earn: "ਕਮਾਓ", earns: "ਕਮਾਉਂਦਾ ਹੈ", gives: "ਦਿੰਦਾ ਹੈ", obtain: "ਪ੍ਰਾਪਤ ਕਰੋ", obtains: "ਪ੍ਰਾਪਤ ਕਰਦਾ ਹੈ", produce: "ਬਣਾਓ", prepares: "ਤਿਆਰ ਕਰਦਾ ਹੈ", combines: "ਮਿਲਾਉਂਦਾ ਹੈ", contains: "ਵਿੱਚ ਹੈ", contain: "ਵਿੱਚ ਹਨ", has: "ਵਿੱਚ ਹੈ", holds: "ਵਿੱਚ ਹੈ", starts: "ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ", records: "ਦਰਜ ਕਰਦਾ ਹੈ", uses: "ਵਰਤਦਾ ਹੈ", buys: "ਖਰੀਦਦਾ ਹੈ", sells: "ਵੇਚਦਾ ਹੈ", mixes: "ਮਿਲਾਉਂਦਾ ਹੈ", adds: "ਜੋੜਦਾ ਹੈ", adulterates: "ਮਿਲਾਵਟ ਕਰਦਾ ਹੈ", transfers: "ਟ੍ਰਾਂਸਫਰ ਕਰਦਾ ਹੈ", return: "ਵਾਪਸ ਕਰੋ", returns: "ਵਾਪਸ ਕਰਦਾ ਹੈ", left: "ਬਚਿਆ", remains: "ਬਚਿਆ ਰਹਿੰਦਾ ਹੈ", present: "ਮੌਜੂਦ", needed: "ਲੋੜੀਂਦੀ", worth: "ਮੁੱਲ ਦਾ", priced: "ਮੁੱਲ ਵਾਲਾ", costing: "ਲਾਗਤ ਵਾਲਾ", valued: "ਮੁੱਲ ਵਾਲਾ", sold: "ਵੇਚਿਆ", initially: "ਸ਼ੁਰੂ ਵਿੱਚ", finally: "ਅਖੀਰ ਵਿੱਚ",
    what: "ਕੀ", how: "ਕਿੰਨਾ", many: "ਕਿੰਨੇ", much: "ਕਿੰਨੀ ਮਾਤਰਾ", which: "ਕਿਹੜਾ", will: "ਹੋਵੇਗਾ", should: "ਚਾਹੀਦਾ", must: "ਪਵੇਗਾ", is: "ਹੈ", are: "ਹਨ", was: "ਸੀ", were: "ਸਨ", be: "ਹੋਵੇ", being: "ਹੁੰਦੇ ਹੋਏ", it: "ਇਹ", its: "ਇਸਦਾ", their: "ਉਨ੍ਹਾਂ ਦੀ", both: "ਦੋਵੇਂ", two: "ਦੋ", three: "ਤਿੰਨ", one: "ਇੱਕ", first: "ਪਹਿਲਾ", last: "ਅੰਤਿਮ", next: "ਅਗਲਾ", after: "ਬਾਅਦ", before: "ਪਹਿਲਾਂ", then: "ਫਿਰ", if: "ਜੇ", so: "ਇਸ ਲਈ", that: "ਕਿ", this: "ਇਹ", these: "ਇਹ", those: "ਉਹ", given: "ਦਿੱਤਾ", using: "ਵਰਤ ਕੇ", use: "ਵਰਤੋ", let: "ਮੰਨ ਲਓ", find: "ਪਤਾ ਕਰੋ", calculate: "ਗਣਨਾ ਕਰੋ", form: "ਬਣਾਓ", write: "ਲਿਖੋ", solve: "ਹੱਲ ਕਰੋ", set: "ਬਰਾਬਰ ਰੱਖੋ", multiply: "ਗੁਣਾ ਕਰੋ", divide: "ਭਾਗ ਦਿਓ", add: "ਜੋੜੋ", subtract: "ਘਟਾਓ", compare: "ਤੁਲਨਾ ਕਰੋ", increase: "ਵਧਾਓ", change: "ਬਦਲੋ", take: "ਲਓ", taken: "ਕੱਢਿਆ", out: "ਬਾਹਰ", without: "ਬਿਨਾਂ", still: "ਹਾਲੇ ਵੀ", more: "ਵੱਧ", less: "ਘੱਟ", higher: "ਵੱਧ", lower: "ਘੱਟ", dearer: "ਮਹਿੰਗਾ", cheaper: "ਸਸਤਾ", actual: "ਅਸਲ", stated: "ਦਿੱਤਾ", shown: "ਦਿਖਾਇਆ", opposite: "ਉਲਟ", single: "ਇੱਕ", complete: "ਪੂਰਾ", uniformly: "ਇਕਸਾਰ", simultaneously: "ਇੱਕੋ ਸਮੇਂ", successive: "ਲਗਾਤਾਰ",
    distributor: "ਵਿਤਰਕ", roaster: "ਰੋਸਟਰ", seller: "ਵਿਕਰੇਤਾ", wholesaler: "ਥੋਕ ਵਿਕਰੇਤਾ", merchant: "ਵਪਾਰੀ", dealer: "ਵਪਾਰੀ", vendor: "ਵਿਕਰੇਤਾ", dairyman: "ਦੁੱਧ ਵਿਕਰੇਤਾ", storekeeper: "ਦੁਕਾਨਦਾਰ", student: "ਵਿਦਿਆਰਥੀ", grain: "ਅਨਾਜ", dairy: "ਡੇਅਰੀ", drink: "ਪੇਅ", beverage: "ਪੇਅ", apple: "ਸੇਬ", orange: "ਸੰਤਰਾ", rose: "ਗੁਲਾਬ", assam: "ਅਸਾਮ", darjeeling: "ਦਾਰਜੀਲਿੰਗ", estate: "ਐਸਟੇਟ", house: "ਹਾਊਸ", blend: "ਬਲੈਂਡ", pressed: "ਪ੍ਰੈੱਸਡ",
  },
};

function replacePhrases(value: string, language: Mal001LocalizedLanguage): string {
  return PHRASES[language].reduce((text, [pattern, replacement]) =>
    typeof pattern === "string"
      ? text.split(pattern).join(replacement)
      : text.replace(pattern, replacement), value);
}

function replaceWords(value: string, language: Mal001LocalizedLanguage): string {
  const words = WORDS[language];
  return value.replace(/\b[A-Za-z][A-Za-z'-]*\b/gu, (token) => {
    if (/^[A-CVxyq]$/u.test(token)) return token;
    const translated = words[token.toLowerCase()];
    return translated ?? token;
  });
}

function localizePlain(value: string, language: Mal001LocalizedLanguage): string {
  return replaceWords(replacePhrases(value, language), language)
    .replace(/\s{2,}/gu, " ")
    .replace(/\s+([,.?;:])/gu, "$1")
    .trim();
}

function localizeAlligationMarker(marker: string, language: Mal001LocalizedLanguage): string {
  const match = /^\[\[EXAMTREE_ALLIGATION_SVG_V1:([^\]]+)\]\]$/u.exec(marker);
  if (!match) return marker;
  try {
    const payload = JSON.parse(Buffer.from(match[1]!, "base64").toString("utf8"));
    const walk = (value: unknown): unknown => {
      if (typeof value === "string") return localizePlain(value, language);
      if (Array.isArray(value)) return value.map(walk);
      if (value && typeof value === "object") {
        return Object.fromEntries(
          Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, walk(entry)]),
        );
      }
      return value;
    };
    const localized = walk(payload);
    return `[[EXAMTREE_ALLIGATION_SVG_V1:${Buffer.from(JSON.stringify(localized), "utf8").toString("base64")}]]`;
  } catch {
    return marker;
  }
}

export function localizeMal001Text(
  value: string,
  language: Mal001LocalizedLanguage,
): string {
  const markers: string[] = [];
  const protectedValue = value.replace(/\[\[EXAMTREE_ALLIGATION_SVG_V1:[^\]]+\]\]/gu, (marker) => {
    const index = markers.push(marker) - 1;
    return `§§ALLIGATION_${index}§§`;
  });
  const localized = localizePlain(protectedValue, language);
  return localized.replace(/§§ALLIGATION_(\d+)§§/gu, (_match, indexText) =>
    localizeAlligationMarker(markers[Number(indexText)] ?? "", language));
}

function localizeOptionalHelp(value: unknown, language: Mal001LocalizedLanguage): unknown {
  if (typeof value === "string") return localizeMal001Text(value, language);
  if (Array.isArray(value)) return value.map((entry) => localizeOptionalHelp(entry, language));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        localizeOptionalHelp(entry, language),
      ]),
    );
  }
  return value;
}

export function applyMal001QuestionStudioLocalization<T extends Record<string, any>>(
  question: T,
  language: Mal001LocalizedLanguage,
): T {
  const options = question.options.map((option: string) => localizeMal001Text(option, language));
  const answer = localizeMal001Text(question.answer, language);
  const explanation = question.explanation && typeof question.explanation === "object"
    ? localizeOptionalHelp(question.explanation, language)
    : question.explanation;
  const reasoningGraph = question.reasoningGraph?.nodes
    ? {
        ...question.reasoningGraph,
        nodes: question.reasoningGraph.nodes.map((node: Record<string, any>) => ({
          ...node,
          text: localizeMal001Text(String(node.text ?? ""), language),
        })),
      }
    : question.reasoningGraph;
  const locale = language === "hi" ? "hi-IN" : "pa-IN";
  const releaseId = `MAL-001-${language.toUpperCase()}-QUESTION-STUDIO-V1`;
  const checks = Array.isArray(question.validation?.checks)
    ? [
        ...question.validation.checks,
        {
          name: "MULTILINGUAL_QUESTION_STUDIO_PARITY",
          passed: options.length === 4 && new Set(options).size === 4 && options[question.correctIndex] === answer,
          message: `${language} learner surface preserves the English mathematical answer and option ownership.`,
        },
      ]
    : question.validation?.checks;

  return {
    ...question,
    stem: localizeMal001Text(question.stem, language),
    options,
    answer,
    language,
    locale,
    explanationId: `${question.questionLanguageId}-${language.toUpperCase()}-QUESTION-STUDIO-V1`,
    explanation,
    reasoningGraph,
    reviewStatus: "APPROVED_MULTILINGUAL_QUESTION_STUDIO",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    validation: question.validation
      ? {
          ...question.validation,
          valid: question.validation.valid !== false && options[question.correctIndex] === answer,
          ok: question.validation.ok !== false && options[question.correctIndex] === answer,
          checks,
        }
      : question.validation,
    traceability: {
      ...(question.traceability ?? {}),
      releaseId,
      approvedLanguage: language,
      locale,
      mathematicalAuthorityLanguage: "en",
      localizationId: MAL_001_MULTILINGUAL_QUESTION_STUDIO_V1.localizationId,
      questionStudioConnected: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  } as T;
}
