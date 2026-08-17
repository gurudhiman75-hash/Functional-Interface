import type { SapTranslationLanguage } from "./types";

const MATH = /\\\([\s\S]*?\\\)/gu;

type Triple = readonly [string, string, string];

const PHRASES_HI: readonly (readonly [string, string])[] = [
  ["गुणा अवश्य हो completed पहले जोड़ या घटाव unless समूहबद्धता changes scope.", "यदि समूहबद्धता दायरा न बदले, तो जोड़ या घटाव से पहले गुणा करना आवश्यक है।"],
  ["गुणा और भाग have समान precedence और हैं evaluated से बायाँ तक दायाँ.", "गुणा और भाग की प्राथमिकता समान होती है; इन्हें बाएँ से दाएँ हल किया जाता है।"],
  ["जोड़ और घटाव have समान precedence और हैं evaluated से बायाँ तक दायाँ.", "जोड़ और घटाव की प्राथमिकता समान होती है; इन्हें बाएँ से दाएँ हल किया जाता है।"],
  ["जोड़ और घटाव have समान precedence और हैं processed से बायाँ तक दायाँ.", "जोड़ और घटाव की प्राथमिकता समान होती है; इन्हें बाएँ से दाएँ किया जाता है।"],
  ["कोष्ठक nesting defines scope; कोष्ठक shape है केवल एक readability choice.", "अंदर-बाहर रखे कोष्ठक संक्रिया का दायरा तय करते हैं; कोष्ठक का आकार केवल पढ़ने की सुविधा के लिए है।"],
  ["एक unary ऋणात्मक belongs तक its operand; गुणा है still resolved पहले surrounding जोड़.", "एकल ऋण चिह्न अपने पद के साथ रहता है; आसपास के जोड़ से पहले गुणा किया जाता है।"],
  ["Keep ऋणात्मक sign के साथ", "ऋण चिह्न को इसके साथ बनाए रखें"],
  ["एक ऋणात्मक intermediate मान keeps its sign through गुणा और later जोड़.", "बीच में प्राप्त ऋणात्मक मान का चिह्न गुणा और बाद के जोड़ में भी बना रहता है।"],
  ["word ‘का’ acts के रूप में गुणा केवल over its explicitly rendered बायाँ और दायाँ operands.", "‘का’ केवल उसके साफ़ दिखाए गए बाएँ और दाएँ पदों के बीच गुणा दर्शाता है।"],
  ["Treat ‘का’ के रूप में गुणा", "‘का’ को गुणा मानें"],
  ["एक संख्या written immediately पहले एक explicit कोष्ठक multiplies पूरा grouped व्यंजक.", "कोष्ठक के ठीक पहले लिखी संख्या पूरे कोष्ठक वाले व्यंजक से गुणा होती है।"],
  ["एक भिन्न या vinculum bar groups पूरा अंश और पूरा हर पहले भाग.", "भिन्न-रेखा पूरे अंश और पूरे हर को समूहित करती है; उसके बाद भाग किया जाता है।"],
  ["एक घात है evaluated on its सटीक base पहले गुणा, जोड़ या घटाव.", "घात का मान उसके सटीक आधार पर पहले निकाला जाता है; उसके बाद गुणा, जोड़ या घटाव किया जाता है।"],
  ["फैक्टोरियल है completed on its सटीक operand पहले भाग या जोड़.", "फैक्टोरियल का मान उसके पूरे पद पर पहले निकाला जाता है; उसके बाद भाग या जोड़ किया जाता है।"],
  ["समूहबद्धता fixes scope का संक्रियाएँ; घटाव है not associative, जबकि जोड़ है associative.", "समूहबद्धता संक्रियाओं का दायरा तय करती है; घटाव साहचर्य नहीं है, जबकि जोड़ साहचर्य है।"],
  ["Look के लिए गुणनखंड या endpoint पद वह disappear से एक वैध संरचनात्मक reduction पहले doing heavy अंकगणित; never काटें pieces joined से जोड़ या घटाव.", "भारी गणना से पहले ऐसे गुणनखंड या सिरों के पद खोजें जो वैध संरचनात्मक सरलीकरण में कट जाते हों; जोड़ या घटाव से जुड़े पदों को कभी सीधे न काटें।"],
  ["उपयोग करें एक पूरा साझा गुणनखंड या repeated numeric खंड केवल जब it है एक गुणनखंड का पूर्णांक relevant अंश या हर; संरचनात्मक reduction चाहिए preserve सटीक मान जबकि avoiding अनावश्यक बड़ा अंकगणित.", "साझा गुणनखंड या दोहराया संख्यात्मक खंड तभी काटें जब वह पूरे संबंधित अंश या हर का गुणनखंड हो; संरचनात्मक सरलीकरण सटीक मान बनाए रखते हुए अनावश्यक बड़ी गणना से बचाए।"],
  ["नहीं किया जा सकता हो determined", "निर्धारित नहीं किया जा सकता"],
  ["नहीं किया जा सकता हो compared", "तुलना नहीं की जा सकती"],
  ["जाँच: संख्याएँ हैं distributed across अंतराल rather than concentrated beside एक perfect घात.", "जाँच: संख्याएँ किसी एक पूर्ण घात के पास केंद्रित होने के बजाय पूरे अंतराल में फैली हैं।"],
  ["कोष्ठक मूल, फिर तुलना करें it के साथ आधा-way point.", "मूल को कोष्ठकित करें, फिर उसकी तुलना मध्यबिंदु से करें।"],
  ["visible chain", "दिखाई गई श्रृंखला"],
  ["resulting व्यंजक remains ठीक-ठीक समान तक मूल.", "प्राप्त व्यंजक मूल व्यंजक के ठीक बराबर रहता है।"],
  ["हर वैध simplification transition अवश्य preserve सटीक मान जबकि respecting समूहबद्धता, precedence और बायाँ-तक-दायाँ associativity.", "हर वैध सरलीकरण चरण को समूहबद्धता, प्राथमिकता और बाएँ-से-दाएँ क्रम का पालन करते हुए सटीक मान बनाए रखना चाहिए।"],
  ["एक correctly सरल subexpression may हो substituted के रूप में one सटीक मान without changing surrounding संक्रिया tree.", "सही तरह सरल किए गए उप-व्यंजक को आसपास की संक्रिया बदले बिना उसके सटीक मान से बदला जा सकता है।"],
  ["भिन्न सकता हो added या subtracted केवल बाद they हैं expressed के साथ एक साझा हर.", "भिन्नों को केवल समान हर में लिखने के बाद ही जोड़ा या घटाया जा सकता है।"],
  ["भाग देते समय से एक गैर-शून्य भिन्न है समतुल्य तक multiplying से its व्युत्क्रम.", "किसी गैर-शून्य भिन्न से भाग देना उसके व्युत्क्रम से गुणा करने के बराबर है।"],
  ["भिन्न expressions follow समान संक्रिया क्रम के रूप में पूर्णांक expressions: गुणा है completed पहले जोड़.", "भिन्न वाले व्यंजकों में भी वही संक्रिया-क्रम लागू होता है: जोड़ से पहले गुणा किया जाता है।"],
  ["एक mixed संख्या अवश्य हो converted तक एक improper भिन्न पहले एक general भिन्न संक्रिया है performed.", "मिश्रित संख्या पर सामान्य भिन्न-संक्रिया करने से पहले उसे अशुद्ध भिन्न में बदलना चाहिए।"],
  ["सही विकल्प", "सही विकल्प"],
];

const PHRASES_PA: readonly (readonly [string, string])[] = [
  ["ਗੁਣਾ ਲਾਜ਼ਮੀ ਹੋਵੇ completed ਪਹਿਲਾਂ ਜੋੜ ਜਾਂ ਘਟਾਓ unless ਸਮੂਹਬੰਦੀ changes scope.", "ਜੇ ਸਮੂਹਬੰਦੀ ਦਾਇਰਾ ਨਾ ਬਦਲੇ, ਤਾਂ ਜੋੜ ਜਾਂ ਘਟਾਓ ਤੋਂ ਪਹਿਲਾਂ ਗੁਣਾ ਕਰਨਾ ਲਾਜ਼ਮੀ ਹੈ।"],
  ["ਗੁਣਾ ਅਤੇ ਭਾਗ have ਬਰਾਬਰ precedence ਅਤੇ ਹਨ evaluated ਤੋਂ ਖੱਬਾ ਤੱਕ ਸੱਜਾ.", "ਗੁਣਾ ਅਤੇ ਭਾਗ ਦੀ ਤਰਜੀਹ ਇੱਕੋ ਹੁੰਦੀ ਹੈ; ਇਨ੍ਹਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਹੱਲ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"],
  ["ਜੋੜ ਅਤੇ ਘਟਾਓ have ਬਰਾਬਰ precedence ਅਤੇ ਹਨ evaluated ਤੋਂ ਖੱਬਾ ਤੱਕ ਸੱਜਾ.", "ਜੋੜ ਅਤੇ ਘਟਾਓ ਦੀ ਤਰਜੀਹ ਇੱਕੋ ਹੁੰਦੀ ਹੈ; ਇਨ੍ਹਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਹੱਲ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"],
  ["ਜੋੜ ਅਤੇ ਘਟਾਓ have ਬਰਾਬਰ precedence ਅਤੇ ਹਨ processed ਤੋਂ ਖੱਬਾ ਤੱਕ ਸੱਜਾ.", "ਜੋੜ ਅਤੇ ਘਟਾਓ ਦੀ ਤਰਜੀਹ ਇੱਕੋ ਹੁੰਦੀ ਹੈ; ਇਨ੍ਹਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"],
  ["ਬਰੈਕਟ nesting defines scope; ਬਰੈਕਟ shape ਹੈ ਕੇਵਲ ਇੱਕ readability choice.", "ਅੰਦਰ-ਬਾਹਰ ਲੱਗੇ ਬਰੈਕਟ ਕਿਰਿਆ ਦਾ ਦਾਇਰਾ ਤੈਅ ਕਰਦੇ ਹਨ; ਬਰੈਕਟ ਦਾ ਆਕਾਰ ਸਿਰਫ਼ ਪੜ੍ਹਨ ਦੀ ਸਹੂਲਤ ਲਈ ਹੈ।"],
  ["ਇੱਕ unary ਰਿਣਾਤਮਕ belongs ਤੱਕ its operand; ਗੁਣਾ ਹੈ still resolved ਪਹਿਲਾਂ surrounding ਜੋੜ.", "ਇਕੱਲਾ ਰਿਣ ਚਿੰਨ੍ਹ ਆਪਣੇ ਪਦ ਨਾਲ ਰਹਿੰਦਾ ਹੈ; ਆਲੇ-ਦੁਆਲੇ ਦੇ ਜੋੜ ਤੋਂ ਪਹਿਲਾਂ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"],
  ["Keep ਰਿਣਾਤਮਕ sign ਨਾਲ", "ਰਿਣ ਚਿੰਨ੍ਹ ਨੂੰ ਇਸ ਨਾਲ ਕਾਇਮ ਰੱਖੋ"],
  ["ਇੱਕ ਰਿਣਾਤਮਕ intermediate ਮੁੱਲ keeps its sign through ਗੁਣਾ ਅਤੇ later ਜੋੜ.", "ਵਿਚਕਾਰ ਮਿਲੇ ਰਿਣਾਤਮਕ ਮੁੱਲ ਦਾ ਚਿੰਨ੍ਹ ਗੁਣਾ ਅਤੇ ਬਾਅਦ ਦੇ ਜੋੜ ਵਿੱਚ ਵੀ ਕਾਇਮ ਰਹਿੰਦਾ ਹੈ।"],
  ["word ‘ਦਾ’ acts ਵਜੋਂ ਗੁਣਾ ਕੇਵਲ over its explicitly rendered ਖੱਬਾ ਅਤੇ ਸੱਜਾ operands.", "‘ਦਾ’ ਸਿਰਫ਼ ਉਸ ਦੇ ਸਾਫ਼ ਦਿਖਾਏ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਪਦਾਂ ਵਿਚਕਾਰ ਗੁਣਾ ਦਰਸਾਉਂਦਾ ਹੈ।"],
  ["Treat ‘ਦਾ’ ਵਜੋਂ ਗੁਣਾ", "‘ਦਾ’ ਨੂੰ ਗੁਣਾ ਮੰਨੋ"],
  ["ਇੱਕ ਸੰਖਿਆ written immediately ਪਹਿਲਾਂ ਇੱਕ explicit ਬਰੈਕਟ multiplies ਪੂਰਾ grouped ਵਿਆੰਜਕ.", "ਬਰੈਕਟ ਦੇ ਬਿਲਕੁਲ ਪਹਿਲਾਂ ਲਿਖੀ ਸੰਖਿਆ ਪੂਰੇ ਬਰੈਕਟ ਵਾਲੇ ਵਿਆੰਜਕ ਨਾਲ ਗੁਣਾ ਹੁੰਦੀ ਹੈ।"],
  ["ਇੱਕ ਭਿੰਨ ਜਾਂ vinculum bar groups ਪੂਰਾ ਅੰਸ਼ ਅਤੇ ਪੂਰਾ ਹਰ ਪਹਿਲਾਂ ਭਾਗ.", "ਭਿੰਨ-ਰੇਖਾ ਪੂਰੇ ਅੰਸ਼ ਅਤੇ ਪੂਰੇ ਹਰ ਨੂੰ ਸਮੂਹਿਤ ਕਰਦੀ ਹੈ; ਫਿਰ ਭਾਗ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"],
  ["ਇੱਕ ਘਾਤ ਹੈ evaluated on its ਸਟੀਕ base ਪਹਿਲਾਂ ਗੁਣਾ, ਜੋੜ ਜਾਂ ਘਟਾਓ.", "ਘਾਤ ਦਾ ਮੁੱਲ ਉਸ ਦੇ ਸਟੀਕ ਆਧਾਰ ਉੱਤੇ ਪਹਿਲਾਂ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ; ਫਿਰ ਗੁਣਾ, ਜੋੜ ਜਾਂ ਘਟਾਓ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"],
  ["ਫੈਕਟੋਰੀਅਲ ਹੈ completed on its ਸਟੀਕ operand ਪਹਿਲਾਂ ਭਾਗ ਜਾਂ ਜੋੜ.", "ਫੈਕਟੋਰੀਅਲ ਦਾ ਮੁੱਲ ਉਸ ਦੇ ਪੂਰੇ ਪਦ ਉੱਤੇ ਪਹਿਲਾਂ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ; ਫਿਰ ਭਾਗ ਜਾਂ ਜੋੜ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"],
  ["ਸਮੂਹਬੰਦੀ fixes scope ਦਾ ਕਿਰਿਆਵਾਂ; ਘਟਾਓ ਹੈ not associative, ਜਦਕਿ ਜੋੜ ਹੈ associative.", "ਸਮੂਹਬੰਦੀ ਕਿਰਿਆਵਾਂ ਦਾ ਦਾਇਰਾ ਤੈਅ ਕਰਦੀ ਹੈ; ਘਟਾਓ ਸਾਹਚਰਯ ਨਹੀਂ ਹੈ, ਜਦਕਿ ਜੋੜ ਸਾਹਚਰਯ ਹੈ।"],
  ["Look ਲਈ ਗੁਣਨਖੰਡ ਜਾਂ endpoint ਪਦ ਉਹ disappear ਤੋਂ ਇੱਕ ਵੈਧ ਸੰਰਚਨਾਤਮਕ reduction ਪਹਿਲਾਂ doing heavy ਅੰਕਗਣਿਤ; never ਕਾਟੋ pieces joined ਤੋਂ ਜੋੜ ਜਾਂ ਘਟਾਓ.", "ਭਾਰੀ ਗਣਨਾ ਤੋਂ ਪਹਿਲਾਂ ਉਹ ਗੁਣਨਖੰਡ ਜਾਂ ਅੰਤਲੇ ਪਦ ਲੱਭੋ ਜੋ ਵੈਧ ਸੰਰਚਨਾਤਮਕ ਸਰਲੀਕਰਨ ਵਿੱਚ ਕੱਟ ਜਾਂਦੇ ਹਨ; ਜੋੜ ਜਾਂ ਘਟਾਓ ਨਾਲ ਜੁੜੇ ਪਦਾਂ ਨੂੰ ਕਦੇ ਸਿੱਧਾ ਨਾ ਕੱਟੋ।"],
  ["ਵਰਤੋ ਇੱਕ ਪੂਰਾ ਸਾਂਝਾ ਗੁਣਨਖੰਡ ਜਾਂ repeated numeric ਬਲਾਕ ਕੇਵਲ ਜਦ it ਹੈ ਇੱਕ ਗੁਣਨਖੰਡ ਦਾ ਪੂਰਾ relevant ਅੰਸ਼ ਜਾਂ ਹਰ; ਸੰਰਚਨਾਤਮਕ reduction ਚਾਹੀਦਾ preserve ਸਟੀਕ ਮੁੱਲ ਜਦਕਿ avoiding ਬੇਲੋੜਾ ਵੱਡਾ ਅੰਕਗਣਿਤ.", "ਸਾਂਝਾ ਗੁਣਨਖੰਡ ਜਾਂ ਦੁਹਰਾਇਆ ਅੰਕੀ ਬਲਾਕ ਤਦ ਹੀ ਕੱਟੋ ਜਦ ਉਹ ਪੂਰੇ ਸੰਬੰਧਿਤ ਅੰਸ਼ ਜਾਂ ਹਰ ਦਾ ਗੁਣਨਖੰਡ ਹੋਵੇ; ਸੰਰਚਨਾਤਮਕ ਸਰਲੀਕਰਨ ਸਟੀਕ ਮੁੱਲ ਕਾਇਮ ਰੱਖਦੇ ਹੋਏ ਬੇਲੋੜੀ ਵੱਡੀ ਗਣਨਾ ਤੋਂ ਬਚਾਏ।"],
  ["ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੋ determined", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"],
  ["ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੋ compared", "ਤੁਲਨਾ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ"],
  ["ਜਾਂਚ: ਸੰਖਿਆਵਾਂ ਹਨ distributed across ਅੰਤਰਾਲ rather than concentrated beside ਇੱਕ perfect ਘਾਤ.", "ਜਾਂਚ: ਸੰਖਿਆਵਾਂ ਕਿਸੇ ਇੱਕ ਪੂਰਨ ਘਾਤ ਦੇ ਕੋਲ ਇਕੱਠੀਆਂ ਹੋਣ ਦੀ ਬਜਾਏ ਪੂਰੇ ਅੰਤਰਾਲ ਵਿੱਚ ਫੈਲੀਆਂ ਹਨ।"],
  ["ਬਰੈਕਟ ਮੂਲ, ਫਿਰ ਤੁਲਨਾ ਕਰੋ it ਨਾਲ ਅੱਧ-way point.", "ਮੂਲ ਨੂੰ ਬਰੈਕਟ ਕਰੋ, ਫਿਰ ਉਸ ਦੀ ਤੁਲਨਾ ਮੱਧ-ਬਿੰਦੂ ਨਾਲ ਕਰੋ।"],
  ["visible chain", "ਦਿਖਾਈ ਦਿੱਤੀ ਲੜੀ"],
  ["resulting ਵਿਆੰਜਕ remains ਬਿਲਕੁਲ ਬਰਾਬਰ ਤੱਕ ਮੂਲ.", "ਮਿਲਿਆ ਵਿਆੰਜਕ ਮੂਲ ਵਿਆੰਜਕ ਦੇ ਬਿਲਕੁਲ ਬਰਾਬਰ ਰਹਿੰਦਾ ਹੈ।"],
  ["ਹਰ ਵੈਧ simplification transition ਲਾਜ਼ਮੀ preserve ਸਟੀਕ ਮੁੱਲ ਜਦਕਿ respecting ਸਮੂਹਬੰਦੀ, precedence ਅਤੇ ਖੱਬਾ-ਤੱਕ-ਸੱਜਾ associativity.", "ਹਰ ਵੈਧ ਸਰਲੀਕਰਨ ਕਦਮ ਨੂੰ ਸਮੂਹਬੰਦੀ, ਤਰਜੀਹ ਅਤੇ ਖੱਬੇ-ਤੋਂ-ਸੱਜੇ ਕ੍ਰਮ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹੋਏ ਸਟੀਕ ਮੁੱਲ ਕਾਇਮ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ।"],
  ["ਇੱਕ correctly ਸਰਲ subexpression may ਹੋ substituted ਵਜੋਂ one ਸਟੀਕ ਮੁੱਲ without changing surrounding ਕਿਰਿਆ tree.", "ਸਹੀ ਤਰ੍ਹਾਂ ਸਰਲ ਕੀਤੇ ਉਪ-ਵਿਆੰਜਕ ਨੂੰ ਆਲੇ-ਦੁਆਲੇ ਦੀ ਕਿਰਿਆ ਬਦਲੇ ਬਿਨਾਂ ਉਸ ਦੇ ਸਟੀਕ ਮੁੱਲ ਨਾਲ ਬਦਲਿਆ ਜਾ ਸਕਦਾ ਹੈ।"],
  ["ਭਿੰਨ ਸਕਦਾ ਹੋ added ਜਾਂ subtracted ਕੇਵਲ ਬਾਅਦ they ਹਨ expressed ਨਾਲ ਇੱਕ ਸਾਂਝਾ ਹਰ.", "ਭਿੰਨਾਂ ਨੂੰ ਇੱਕੋ ਹਰ ਵਿੱਚ ਲਿਖਣ ਤੋਂ ਬਾਅਦ ਹੀ ਜੋੜਿਆ ਜਾਂ ਘਟਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।"],
  ["ਭਾਗ ਕਰਦੇ ਸਮੇਂ ਤੋਂ ਇੱਕ ਗੈਰ-ਸਿਫ਼ਰ ਭਿੰਨ ਹੈ ਸਮਤੁੱਲ ਤੱਕ multiplying ਤੋਂ its ਉਲਟ ਭਿੰਨ.", "ਕਿਸੇ ਗੈਰ-ਸਿਫ਼ਰ ਭਿੰਨ ਨਾਲ ਭਾਗ ਕਰਨਾ ਉਸ ਦੇ ਉਲਟ ਭਿੰਨ ਨਾਲ ਗੁਣਾ ਕਰਨ ਦੇ ਬਰਾਬਰ ਹੈ।"],
  ["ਭਿੰਨ expressions follow ਇੱਕੋ ਕਿਰਿਆ ਕ੍ਰਮ ਵਜੋਂ ਪੂਰਨ ਅੰਕ expressions: ਗੁਣਾ ਹੈ completed ਪਹਿਲਾਂ ਜੋੜ.", "ਭਿੰਨ ਵਾਲੇ ਵਿਆੰਜਕਾਂ ਵਿੱਚ ਵੀ ਉਹੀ ਕਿਰਿਆ-ਕ੍ਰਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ: ਜੋੜ ਤੋਂ ਪਹਿਲਾਂ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"],
  ["ਇੱਕ mixed ਸੰਖਿਆ ਲਾਜ਼ਮੀ ਹੋ converted ਤੱਕ ਇੱਕ improper ਭਿੰਨ ਪਹਿਲਾਂ ਇੱਕ general ਭਿੰਨ ਕਿਰਿਆ ਹੈ performed.", "ਮਿਸ਼ਰਤ ਸੰਖਿਆ ਉੱਤੇ ਆਮ ਭਿੰਨ-ਕਿਰਿਆ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਉਸ ਨੂੰ ਅਸ਼ੁੱਧ ਭਿੰਨ ਵਿੱਚ ਬਦਲਣਾ ਚਾਹੀਦਾ ਹੈ।"],
];

const WORD_GROUPS: readonly Triple[] = [
  ["about", "के बारे में", "ਬਾਰੇ"], ["above", "ऊपर", "ਉੱਪਰ"],
  ["accept|accepted", "स्वीकार", "ਸਵੀਕਾਰ"], ["accurate", "सटीक", "ਸਟੀਕ"], ["across", "पूरे", "ਪੂਰੇ"],
  ["act|acts", "कार्य करता", "ਕੰਮ ਕਰਦਾ"], ["actual", "वास्तविक", "ਅਸਲ"], ["added|adding|adds", "जोड़ा", "ਜੋੜਿਆ"],
  ["addend|addends", "जोड़-पद", "ਜੋੜ-ਪਦ"], ["additive", "योगात्मक", "ਜੋੜਾਤਮਕ"], ["adjacent", "समीपवर्ती", "ਨਾਲਲਾ"],
  ["adjustment", "समायोजन", "ਸਮਾਯੋਜਨ"], ["again", "फिर", "ਫਿਰ"], ["against", "के विरुद्ध", "ਦੇ ਮੁਕਾਬਲੇ"],
  ["agree", "मेल खाते", "ਮੇਲ ਖਾਂਦੇ"], ["algebra", "बीजगणित", "ਬੀਜਗਣਿਤ"], ["all", "सभी", "ਸਾਰੇ"],
  ["allowed", "मान्य", "ਮੰਨਿਆ"], ["already", "पहले से", "ਪਹਿਲਾਂ ਹੀ"], ["also", "भी", "ਵੀ"], ["always", "हमेशा", "ਹਮੇਸ਼ਾਂ"],
  ["among", "के बीच", "ਵਿਚਕਾਰ"], ["amount", "मात्रा", "ਮਾਤਰਾ"], ["answers", "उत्तर", "ਉੱਤਰ"], ["any", "किसी", "ਕਿਸੇ"],
  ["appears", "दिखता है", "ਦਿਖਦਾ ਹੈ"], ["applies|apply|applying", "लागू", "ਲਾਗੂ"], ["approach", "विधि", "ਤਰੀਕਾ"],
  ["approved", "स्वीकृत", "ਮਨਜ਼ੂਰ"], ["approximating|approximation|approximations", "अनुमान", "ਅੰਦਾਜ਼ਾ"],
  ["arithmetically", "अंकगणितीय रूप से", "ਅੰਕਗਣਿਤਕ ਤੌਰ ਤੇ"], ["around", "आस-पास", "ਆਲੇ-ਦੁਆਲੇ"],
  ["arrange", "व्यवस्थित करें", "ਤਰਤੀਬ ਦਿਓ"], ["asks", "पूछता है", "ਪੁੱਛਦਾ ਹੈ"], ["associative|associativity", "साहचर्य", "ਸਾਹਚਰਯ"],
  ["attached", "जुड़ा", "ਜੁੜਿਆ"], ["attainable|attained", "प्राप्त होने योग्य", "ਪ੍ਰਾਪਤ ਹੋਣ ਯੋਗ"],
  ["avoid|avoiding", "बचें", "ਬਚੋ"], ["awkward", "असुविधाजनक", "ਅਸੁਖਾਵਾਂ"], ["back", "वापस", "ਵਾਪਸ"],
  ["balanced", "संतुलित", "ਸੰਤੁਲਿਤ"], ["band|bands", "सीमा", "ਹੱਦ"], ["bar", "रेखा", "ਰੇਖਾ"],
  ["base|bases", "आधार", "ਆਧਾਰ"], ["beat", "बेहतर है", "ਬਿਹਤਰ ਹੈ"], ["been|being", "हुआ", "ਹੋਇਆ"],
  ["belongs", "संबंधित है", "ਸੰਬੰਧਿਤ ਹੈ"], ["benchmark", "मानक मान", "ਮਿਆਰੀ ਮੁੱਲ"], ["beside", "पास", "ਕੋਲ"],
  ["better", "बेहतर", "ਬਿਹਤਰ"], ["blank", "रिक्त स्थान", "ਖਾਲੀ ਥਾਂ"], ["blocks", "खंड", "ਬਲਾਕ"],
  ["bodmas", "बोडमास", "ਬੋਡਮਾਸ"], ["bound|boundary|bounded", "सीमा", "ਹੱਦ"], ["box", "खाना", "ਖਾਨਾ"],
  ["bracketed|brackets", "कोष्ठकयुक्त", "ਬਰੈਕਟ ਵਾਲਾ"], ["but", "लेकिन", "ਪਰ"], ["calculate", "गणना करें", "ਗਣਨਾ ਕਰੋ"],
  ["cancelled|cancelling|cancels", "काटा", "ਕੱਟਿਆ"], ["candidate|candidates", "प्रत्याशी", "ਸੰਭਾਵੀ"],
  ["carrying", "ले जाते हुए", "ਲੈ ਜਾਂਦੇ ਹੋਏ"], ["case|cases", "स्थिति", "ਹਾਲਤ"], ["caused", "कारण बना", "ਕਾਰਨ ਬਣਿਆ"],
  ["chain", "श्रृंखला", "ਲੜੀ"], ["change|changes|changing", "बदलता", "ਬਦਲਦਾ"], ["checked|checking|checks", "जाँच", "ਜਾਂਚ"],
  ["choice|choices|choose", "चयन", "ਚੋਣ"], ["claim", "दावा", "ਦਾਅਵਾ"], ["classifying", "वर्गीकरण", "ਵਰਗੀਕਰਨ"],
  ["clean", "साफ़", "ਸਾਫ਼"], ["clearly", "स्पष्ट रूप से", "ਸਪਸ਼ਟ ਤੌਰ ਤੇ"], ["close", "निकट", "ਨੇੜੇ"],
  ["coefficient", "गुणांक", "ਗੁਣਾਂਕ"], ["combine|combined|combining", "मिलाएँ", "ਜੋੜੋ"], ["comes", "आता है", "ਆਉਂਦਾ ਹੈ"],
  ["communicates", "दर्शाता है", "ਦਰਸਾਉਂਦਾ ਹੈ"], ["comparable", "तुलनीय", "ਤੁਲਨਾਯੋਗ"],
  ["compared|compares|comparing", "तुलना", "ਤੁਲਨਾ"], ["compatible", "अनुकूल", "ਅਨੁਕੂਲ"], ["complement", "पूरक", "ਪੂਰਕ"],
  ["completed|completing", "पूरा", "ਪੂਰਾ"], ["complex", "जटिल", "ਜਟਿਲ"], ["component", "घटक", "ਘਟਕ"],
  ["composed", "संयोजित", "ਸੰਯੁਕਤ"], ["compute", "गणना करें", "ਗਣਨਾ ਕਰੋ"], ["concentrated", "केंद्रित", "ਕੇਂਦਰਿਤ"],
  ["condition", "शर्त", "ਸ਼ਰਤ"], ["confirms", "पुष्टि करता है", "ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ"], ["conjugate", "संयुग्मी", "ਸੰਯੁਗਮੀ"],
  ["consequences", "परिणाम", "ਨਤੀਜੇ"], ["consider", "विचार करें", "ਵਿਚਾਰ ਕਰੋ"], ["containing|contains", "समाहित", "ਸ਼ਾਮਲ"],
  ["continue|continued", "जारी", "ਜਾਰੀ"], ["contribution", "योगदान", "ਯੋਗਦਾਨ"], ["convenient", "सुविधाजनक", "ਸੌਖਾ"],
  ["convert|converted", "बदलें", "ਬਦਲੋ"], ["correctly", "सही रूप से", "ਸਹੀ ਤਰ੍ਹਾਂ"], ["corresponds", "के अनुरूप", "ਦੇ ਅਨੁਸਾਰ"],
  ["count", "गिनती", "ਗਿਣਤੀ"], ["create", "बनाएँ", "ਬਣਾਓ"], ["cross|crosses", "आर-पार", "ਆਰ-ਪਾਰ"],
  ["cubes|cubing", "घन", "ਘਣ"], ["current", "वर्तमान", "ਮੌਜੂਦਾ"], ["data", "दिया गया डेटा", "ਦਿੱਤਾ ਡਾਟਾ"],
  ["decide|decided|decides|deciding|decision|decisive", "निर्णय", "ਫ਼ੈਸਲਾ"], ["decimals", "दशमलव", "ਦਸ਼ਮਲਵ"],
  ["declared", "दिया गया", "ਦਿੱਤਾ"], ["decreases", "घटता है", "ਘਟਦਾ ਹੈ"], ["deepest", "सबसे अंदर", "ਸਭ ਤੋਂ ਅੰਦਰ"],
  ["defines", "तय करता है", "ਤੈਅ ਕਰਦਾ ਹੈ"], ["definite|definitely", "निश्चित", "ਪੱਕਾ"], ["denominators", "हर", "ਹਰ"],
  ["descending", "घटते क्रम", "ਘਟਦੇ ਕ੍ਰਮ"], ["determined|determines", "निर्धारित", "ਨਿਰਧਾਰਤ"], ["differ", "भिन्न हैं", "ਵੱਖ ਹਨ"],
  ["differences", "अंतर", "ਅੰਤਰ"], ["direct|direction", "सीधा", "ਸਿੱਧਾ"], ["disappear", "कट जाते हैं", "ਕੱਟ ਜਾਂਦੇ ਹਨ"],
  ["discarded", "हटा दिया", "ਹਟਾਇਆ"], ["discrepancy", "अंतर", "ਫ਼ਰਕ"], ["distance|distances", "दूरी", "ਦੂਰੀ"],
  ["distinct", "अलग", "ਵੱਖਰੇ"], ["distorts", "बिगाड़ता है", "ਵਿਗਾੜਦਾ ਹੈ"], ["distractor", "भ्रमकारी विकल्प", "ਭਰਮਾਉਂਦਾ ਵਿਕਲਪ"],
  ["distributed", "फैली हुई", "ਫੈਲੀਆਂ"], ["distributive", "वितरण नियम", "ਵੰਡ ਨਿਯਮ"], ["divided", "भाग दिया", "ਭਾਗ ਕੀਤਾ"],
  ["dividend", "भाज्य", "ਭਾਜ"], ["divisible", "विभाज्य", "ਭਾਗਯੋਗ"], ["divisor", "भाजक", "ਭਾਜਕ"],
  ["does", "करता है", "ਕਰਦਾ ਹੈ"], ["doing|done", "करते हुए", "ਕਰਦੇ ਹੋਏ"], ["down", "नीचे", "ਹੇਠਾਂ"],
  ["dropping", "हटाने", "ਹਟਾਉਣ"], ["earlier|earliest|early", "पहले", "ਪਹਿਲਾਂ"], ["easier", "आसान", "ਸੌਖਾ"],
  ["efficient", "कुशल", "ਕੁਸ਼ਲ"], ["either", "दोनों में से कोई", "ਦੋਨਾਂ ਵਿੱਚੋਂ ਕੋਈ"], ["embedded", "अंदर जुड़ा", "ਅੰਦਰ ਜੁੜਿਆ"],
  ["end|endpoint|endpoints|ends", "अंत", "ਅੰਤ"], ["enough", "पर्याप्त", "ਕਾਫ਼ੀ"], ["entire", "पूरा", "ਪੂਰਾ"],
  ["equality|equation", "समानता", "ਸਮਾਨਤਾ"], ["equally|equidistant", "समान दूरी", "ਬਰਾਬਰ ਦੂਰੀ"],
  ["estimates|estimating", "अनुमान", "ਅੰਦਾਜ਼ੇ"], ["evaluated|evaluation", "मान निकाला", "ਮੁੱਲ ਕੱਢਿਆ"],
  ["even", "सम", "ਜੁੜਾ"], ["example", "उदाहरण", "ਉਦਾਹਰਨ"], ["exclude|excluded", "बाहर रखें", "ਬਾਹਰ ਰੱਖੋ"],
  ["exists", "मौजूद है", "ਮੌਜੂਦ ਹੈ"], ["expand|express|expressed|expressions", "लिखें", "ਲਿਖੋ"], ["explicit|explicitly", "स्पष्ट", "ਸਪਸ਼ਟ"],
  ["extra", "अतिरिक्त", "ਵਾਧੂ"], ["extract", "निकालें", "ਕੱਢੋ"], ["extreme", "चरम", "ਅੰਤਲਾ"],
  ["factorials|factorisation", "फैक्टोरियल/गुणनखंडन", "ਫੈਕਟੋਰੀਅਲ/ਗੁਣਨਖੰਡਨ"], ["fail", "असफल", "ਅਸਫਲ"],
  ["farther", "अधिक दूर", "ਹੋਰ ਦੂਰ"], ["fast", "तेज़", "ਤੇਜ਼"], ["favourable", "अनुकूल", "ਅਨੁਕੂਲ"],
  ["find|finding", "ज्ञात करें", "ਕੱਢੋ"], ["finishing", "पूरा करने", "ਪੂਰਾ ਕਰਨ"], ["fixed|fixes", "स्थिर", "ਸਥਿਰ"],
  ["follow", "पालन करें", "ਪਾਲਣਾ ਕਰੋ"], ["form|forms", "रूप", "ਰੂਪ"], ["forward", "आगे", "ਅੱਗੇ"],
  ["found", "मिला", "ਮਿਲਿਆ"], ["four|fourth", "चार/चौथा", "ਚਾਰ/ਚੌਥਾ"], ["full", "पूरा", "ਪੂਰਾ"],
  ["general|generally", "सामान्य", "ਆਮ"], ["given|giving", "दिया गया", "ਦਿੱਤਾ"], ["greater", "बड़ा", "ਵੱਡਾ"],
  ["grouped|groups", "समूहित", "ਸਮੂਹਿਤ"], ["halfway", "मध्य", "ਅੱਧ ਵਿਚ"], ["handled", "संभाला", "ਸੰਭਾਲਿਆ"],
  ["has|have", "है", "ਹੈ"], ["heavy", "भारी", "ਭਾਰੀ"], ["here", "यहाँ", "ਇੱਥੇ"], ["highest", "सर्वोच्च", "ਸਭ ਤੋਂ ਉੱਚੀ"],
  ["hundredth|hundredths", "सौवाँ", "ਸੌਵਾਂ"], ["identical", "एक समान", "ਇੱਕੋ ਜਿਹੇ"], ["identify", "पहचानें", "ਪਛਾਣੋ"],
  ["ignore", "अनदेखा करें", "ਅਣਡਿੱਠਾ ਕਰੋ"], ["immediately", "तुरंत", "ਤੁਰੰਤ"], ["implied", "निहित", "ਸੰਕੇਤਿਤ"],
  ["improper", "अशुद्ध", "ਅਸ਼ੁੱਧ"], ["include|included|including", "शामिल", "ਸ਼ਾਮਲ"], ["increase|increases", "बढ़ता", "ਵੱਧਦਾ"],
  ["independent|independently", "स्वतंत्र रूप से", "ਸੁਤੰਤਰ ਤੌਰ ਤੇ"], ["indeterminate", "अनिर्धारित", "ਅਨਿਰਧਾਰਤ"],
  ["inner|innermost", "भीतरी", "ਅੰਦਰਲਾ"], ["input", "इनपुट", "ਇਨਪੁੱਟ"], ["inside", "अंदर", "ਅੰਦਰ"],
  ["inspect", "जाँचें", "ਜਾਂਚੋ"], ["instead", "इसके बजाय", "ਇਸ ਦੀ ਬਜਾਏ"], ["instructed|instruction", "निर्देश", "ਹਦਾਇਤ"],
  ["interior", "आंतरिक", "ਅੰਦਰਲਾ"], ["intermediate", "मध्यवर्ती", "ਵਿਚਕਾਰਲਾ"], ["intervals", "अंतराल", "ਅੰਤਰਾਲ"],
  ["into", "में", "ਵਿੱਚ"], ["inverse|invert", "व्युत्क्रम", "ਉਲਟ"], ["inward", "अंदर की ओर", "ਅੰਦਰ ਵੱਲ"],
  ["isolate|isolated|isolating", "अलग करें", "ਅਲੱਗ ਕਰੋ"], ["its|itself", "उसका", "ਉਸਦਾ"], ["joined|joining", "जुड़े", "ਜੁੜੇ"],
  ["judge", "तय करें", "ਫ਼ੈਸਲਾ ਕਰੋ"], ["just", "केवल", "ਸਿਰਫ਼"], ["keep|keeping|keeps", "बनाए रखें", "ਕਾਇਮ ਰੱਖੋ"],
  ["largest", "सबसे बड़ा", "ਸਭ ਤੋਂ ਵੱਡਾ"], ["last|later", "अंतिम/बाद", "ਆਖ਼ਰੀ/ਬਾਅਦ"], ["layer", "परत", "ਪਰਤ"],
  ["leave|leaves|leaving", "छोड़ें", "ਛੱਡੋ"], ["legal", "वैध", "ਵੈਧ"], ["levels", "स्तर", "ਪੱਧਰ"],
  ["lie|lies", "स्थित है", "ਪੈਂਦਾ ਹੈ"], ["limit", "सीमा", "ਹੱਦ"], ["lines", "रेखाएँ", "ਰੇਖਾਵਾਂ"],
  ["list|listed", "सूची", "ਸੂਚੀ"], ["look|looking", "देखें", "ਵੇਖੋ"], ["lowest", "न्यूनतम", "ਸਭ ਤੋਂ ਸਰਲ"],
  ["magnitude", "परिमाण", "ਪਰਿਮਾਣ"], ["main", "मुख्य", "ਮੁੱਖ"], ["make|makes", "बनाएँ", "ਬਣਾਓ"],
  ["many", "कई", "ਕਈ"], ["maps", "मेल खाता", "ਮੇਲ ਖਾਂਦਾ"], ["match|matches|matching", "मेल", "ਮੇਲ"],
  ["may", "हो सकता है", "ਹੋ ਸਕਦਾ ਹੈ"], ["means", "अर्थ है", "ਅਰਥ ਹੈ"], ["merely", "सिर्फ़", "ਸਿਰਫ਼"],
  ["methods", "विधियाँ", "ਤਰੀਕੇ"], ["middle|midpoints", "मध्य", "ਮੱਧ"], ["minuend", "घट्य", "ਘਟਾਏ ਜਾਣ ਵਾਲੀ ਸੰਖਿਆ"],
  ["minus", "ऋण/घटाव", "ਰਿਣ/ਘਟਾਓ"], ["mismatch", "असंगति", "ਬੇਮੇਲ"], ["missing", "लुप्त", "ਗੁੰਮ"],
  ["mistaken|mistakes", "गलत", "ਗਲਤ"], ["mixed", "मिश्रित", "ਮਿਸ਼ਰਤ"], ["more|most", "अधिक", "ਵੱਧ"],
  ["move|moved|moves", "स्थानांतरित", "ਥਾਂ ਬਦਲੋ"], ["multiples", "गुणज", "ਗੁਣਜ"], ["multiplicative", "गुणात्मक", "ਗੁਣਾਤਮਕ"],
  ["multiplier|multiplies|multiplying", "गुणक/गुणा", "ਗੁਣਕ/ਗੁਣਾ"], ["named", "दिया गया", "ਦਿੱਤਾ"],
  ["near|nearby|nearer", "निकट", "ਨੇੜੇ"], ["needed", "आवश्यक", "ਲੋੜੀਂਦਾ"], ["neighbour|neighbouring", "पड़ोसी", "ਨਾਲਲਾ"],
  ["neither", "कोई भी नहीं", "ਕੋਈ ਵੀ ਨਹੀਂ"], ["nested|nesting", "अंतर्निहित", "ਅੰਦਰ-ਅੰਦਰ"], ["never", "कभी नहीं", "ਕਦੇ ਨਹੀਂ"],
  ["new|next", "नया/अगला", "ਨਵਾਂ/ਅਗਲਾ"], ["nor", "न ही", "ਨਾ ਹੀ"], ["normally", "सामान्यतः", "ਆਮ ਤੌਰ ਤੇ"],
  ["not", "नहीं", "ਨਹੀਂ"], ["now", "अब", "ਹੁਣ"], ["numerators", "अंश", "ਅੰਸ਼"],
  ["numeric|numerical|numerically", "संख्यात्मक", "ਅੰਕੀ"], ["objective", "उद्देश्य", "ਉਦੇਸ਼"], ["obtain", "प्राप्त करें", "ਪ੍ਰਾਪਤ ਕਰੋ"],
  ["occurs", "होता है", "ਹੁੰਦਾ ਹੈ"], ["odd", "विषम", "ਟਾਂਕ"], ["omit", "हटा दें", "ਹਟਾ ਦਿਓ"],
  ["once", "एक बार", "ਇੱਕ ਵਾਰ"], ["one", "एक", "ਇੱਕ"], ["open|opening", "खोलें", "ਖੋਲ੍ਹੋ"],
  ["operand|operands", "पद", "ਪਦ"], ["ordering", "क्रम", "ਕ੍ਰਮ"], ["ordinary", "सामान्य", "ਆਮ"],
  ["originals", "मूल मान", "ਮੂਲ ਮੁੱਲ"], ["other|others|otherwise", "अन्य", "ਹੋਰ"], ["out", "बाहर", "ਬਾਹਰ"],
  ["outer|outward", "बाहरी", "ਬਾਹਰਲਾ"], ["over", "पर", "ਉੱਤੇ"], ["pair", "जोड़ी", "ਜੋੜੀ"],
  ["parentheses", "कोष्ठक", "ਬਰੈਕਟ"], ["part", "भाग", "ਹਿੱਸਾ"], ["percentages", "प्रतिशत", "ਪ੍ਰਤੀਸ਼ਤ"],
  ["perfect", "पूर्ण", "ਪੂਰਨ"], ["perform|performed|performing", "करें", "ਕਰੋ"], ["pieces", "टुकड़े", "ਹਿੱਸੇ"],
  ["placed", "रखा", "ਰੱਖਿਆ"], ["plus", "जोड़", "ਜੋੜ"], ["point|points", "बिंदु", "ਬਿੰਦੂ"],
  ["powered|powers", "घात", "ਘਾਤ"], ["precedence|priority", "प्राथमिकता", "ਤਰਜੀਹ"], ["preceding", "पिछला", "ਪਿਛਲਾ"],
  ["precision|precisions", "शुद्धता", "ਸੁਚੋਕਤਾ"], ["preserve|preserves|preserving", "बनाए रखें", "ਕਾਇਮ ਰੱਖੋ"],
  ["printed", "लिखा हुआ", "ਲਿਖਿਆ"], ["processed", "हल किया", "ਹੱਲ ਕੀਤਾ"], ["produce|produced|produces", "प्राप्त करता", "ਪੈਦਾ ਕਰਦਾ"],
  ["products", "गुणनफल", "ਗੁਣਨਫਲ"], ["proof|prove", "प्रमाण", "ਸਬੂਤ"], ["push", "आगे बढ़ाएँ", "ਅੱਗੇ ਧੱਕੋ"],
  ["put", "रखें", "ਰੱਖੋ"], ["quantities|quantity", "राशि", "ਰਾਸ਼ੀ"], ["question", "प्रश्न", "ਸਵਾਲ"],
  ["radicand|radicands", "मूलांक", "ਮੂਲ ਅੰਦਰਲੀ ਸੰਖਿਆ"], ["raising", "घात बढ़ाना", "ਘਾਤ ਚੜ੍ਹਾਉਣਾ"],
  ["ranges", "सीमाएँ", "ਹੱਦਾਂ"], ["rather", "इसके बजाय", "ਦੀ ਬਜਾਏ"], ["rational|rationals", "परिमेय", "ਪਰਿਮੇਯ"],
  ["raw", "मूल", "ਕੱਚਾ"], ["reach", "पहुँचें", "ਪਹੁੰਚੋ"], ["read|reading|readability", "पढ़ें", "ਪੜ੍ਹੋ"],
  ["recognise", "पहचानें", "ਪਛਾਣੋ"], ["reconstructing|reconstructs", "फिर से बनाएँ", "ਮੁੜ ਬਣਾਓ"],
  ["recover|recovered", "पुनः प्राप्त करें", "ਮੁੜ ਪ੍ਰਾਪਤ ਕਰੋ"], ["reduces|reducing|reduction", "सरलीकरण", "ਸਰਲੀਕਰਨ"],
  ["reject", "अस्वीकार करें", "ਰੱਦ ਕਰੋ"], ["relationship", "संबंध", "ਸੰਬੰਧ"], ["relevant", "संबंधित", "ਸੰਬੰਧਿਤ"],
  ["remain|remaining|remains", "बना रहता", "ਕਾਇਮ ਰਹਿੰਦਾ"], ["remainder", "शेषफल", "ਬਾਕੀ"],
  ["remove|removed|removing", "हटाएँ", "ਹਟਾਓ"], ["rendered", "दिखाया", "ਦਿਖਾਇਆ"], ["repeated", "दोहराया", "ਦੁਹਰਾਇਆ"],
  ["report|reports", "बताता", "ਦੱਸਦਾ"], ["representation|representations|represents", "निरूपण", "ਦਰਸਾਵਾ"],
  ["reproduces", "फिर देता है", "ਮੁੜ ਦਿੰਦਾ ਹੈ"], ["requested|required|requires", "आवश्यक", "ਲੋੜੀਂਦਾ"],
  ["resolve|resolved", "हल करें", "ਹੱਲ ਕਰੋ"], ["respect|respecting", "पालन", "ਪਾਲਣਾ"],
  ["restore|restored|restores", "पुनः प्राप्त", "ਮੁੜ ਪ੍ਰਾਪਤ"], ["resulting|results", "प्राप्त", "ਮਿਲਿਆ"],
  ["retain|retained", "बनाए रखें", "ਕਾਇਮ ਰੱਖੋ"], ["reuse", "दोबारा उपयोग", "ਮੁੜ ਵਰਤੋਂ"], ["reverse", "उलटा", "ਉਲਟ"],
  ["rewrite", "फिर लिखें", "ਮੁੜ ਲਿਖੋ"], ["roots", "मूल", "ਮੂਲ"], ["rule|rules", "नियम", "ਨਿਯਮ"],
  ["run", "चलाएँ", "ਚਲਾਓ"], ["sample", "उदाहरण", "ਨਮੂਨਾ"], ["satisfies|satisfy", "संतुष्ट करता", "ਪੂਰਾ ਕਰਦਾ"],
  ["says", "कहता है", "ਕਹਿੰਦਾ ਹੈ"], ["scale|scoped", "पैमाना/दायरा", "ਪੈਮਾਨਾ/ਦਾਇਰਾ"],
  ["second", "दूसरा", "ਦੂਜਾ"], ["see", "देखें", "ਵੇਖੋ"], ["select|selected", "चुनें", "ਚੁਣੋ"],
  ["separate|separated|separately", "अलग", "ਵੱਖ"], ["set", "समूह", "ਸਮੂਹ"], ["shape", "आकार", "ਆਕਾਰ"],
  ["shared", "साझा", "ਸਾਂਝਾ"], ["sharply", "तेज़ी से", "ਤੀਖੇ ਤੌਰ ਤੇ"], ["shift|shifted|shifting", "स्थानांतरण", "ਥਾਂ ਬਦਲਣਾ"],
  ["side|sided|sides", "पक्ष", "ਪਾਸਾ"], ["sign|signed|signs", "चिह्न", "ਚਿੰਨ੍ਹ"], ["similarity", "समानता", "ਸਮਾਨਤਾ"],
  ["simple|simplest|simplification|simplifies", "सरल/सरलीकरण", "ਸਰਲ/ਸਰਲੀਕਰਨ"], ["since", "क्योंकि", "ਕਿਉਂਕਿ"],
  ["sizes", "आकार", "ਆਕਾਰ"], ["smallest", "सबसे छोटा", "ਸਭ ਤੋਂ ਛੋਟਾ"], ["solution|solve", "हल", "ਹੱਲ"],
  ["sorting", "क्रमबद्ध करना", "ਤਰਤੀਬ ਦੇਣਾ"], ["source", "स्रोत", "ਸਰੋਤ"], ["span", "फैलाव", "ਫੈਲਾਅ"],
  ["special|specifically", "विशेष", "ਖਾਸ"], ["split", "बाँटें", "ਵੰਡੋ"], ["squared|squares", "वर्ग", "ਵਰਗ"],
  ["stand", "दर्शाता है", "ਦਰਸਾਉਂਦਾ ਹੈ"], ["stated|states", "दिया गया", "ਦਿੱਤਾ"], ["stay|stays", "बना रहे", "ਕਾਇਮ ਰਹੇ"],
  ["still", "फिर भी", "ਫਿਰ ਵੀ"], ["stop", "रोकें", "ਰੋਕੋ"], ["stored", "संग्रहीत", "ਸੰਭਾਲਿਆ"],
  ["strictly", "सख्ती से", "ਸਖ਼ਤੀ ਨਾਲ"], ["structure", "संरचना", "ਸੰਰਚਨਾ"], ["subexpression", "उप-व्यंजक", "ਉਪ-ਵਿਆੰਜਕ"],
  ["substitute|substituted|substituting|substitution", "प्रतिस्थापन", "ਬਦਲੀ"], ["subtracted|subtracting", "घटाया", "ਘਟਾਇਆ"],
  ["subtrahend", "घटाने वाला पद", "ਘਟਾਇਆ ਜਾਣ ਵਾਲਾ ਪਦ"], ["successive", "क्रमिक", "ਲਗਾਤਾਰ"], ["such", "ऐसा", "ਅਜਿਹਾ"],
  ["sufficiency", "पर्याप्तता", "ਕਾਫ਼ੀਪਣ"], ["sums", "योग", "ਜੋੜ"], ["supplied", "दिया गया", "ਦਿੱਤਾ"],
  ["surrounding", "आसपास", "ਆਲੇ-ਦੁਆਲੇ"], ["survive|surviving", "बना रहता", "ਕਾਇਮ ਰਹਿੰਦਾ"], ["tail", "अंतिम भाग", "ਅੰਤਲਾ ਹਿੱਸਾ"],
  ["target", "लक्षित मान", "ਲਕਸ਼ਿਤ ਮੁੱਲ"], ["task", "कार्य", "ਕੰਮ"], ["tenth|tenths", "दसवाँ", "ਦਸਵਾਂ"],
  ["test|testing", "जाँच", "ਜਾਂਚ"], ["than", "से", "ਤੋਂ"], ["their|them|they", "उनका/उन्हें/वे", "ਉਨ੍ਹਾਂ ਦਾ/ਉਨ੍ਹਾਂ ਨੂੰ/ਉਹ"],
  ["there", "वहाँ", "ਉੱਥੇ"], ["third|three", "तीसरा/तीन", "ਤੀਜਾ/ਤਿੰਨ"], ["though", "हालाँकि", "ਭਾਵੇਂ"],
  ["threshold", "सीमा-मूल्य", "ਹੱਦ-ਮੁੱਲ"], ["through", "के दौरान", "ਰਾਹੀਂ"], ["thus", "इस प्रकार", "ਇਸ ਤਰ੍ਹਾਂ"],
  ["tie|tight", "बराबरी/कड़ा", "ਬਰਾਬਰੀ/ਤੰਗ"], ["time|times", "बार", "ਵਾਰ"], ["tolerance", "सहन-सीमा", "ਸਹਿਣ-ਹੱਦ"],
  ["too", "भी", "ਵੀ"], ["total", "कुल", "ਕੁੱਲ"], ["toward", "की ओर", "ਵੱਲ"], ["track", "नज़र रखें", "ਧਿਆਨ ਰੱਖੋ"],
  ["trailing", "अंतिम", "ਅੰਤਲਾ"], ["transformed", "बदला हुआ", "ਬਦਲਿਆ"], ["transition", "चरण", "ਕਦਮ"],
  ["treat", "मानें", "ਮੰਨੋ"], ["tree", "संक्रिया-वृक्ष", "ਕਿਰਿਆ-ਵ੍ਰਿੱਖ"], ["truth", "सत्यता", "ਸੱਚਾਈ"],
  ["turn|turning|turns", "बदलता", "ਬਦਲਦਾ"], ["two", "दो", "ਦੋ"], ["unary", "एकल", "ਇਕੱਲਾ"],
  ["unchanged", "अपरिवर्तित", "ਬਿਨਾਂ ਬਦਲੇ"], ["under", "के अंतर्गत", "ਹੇਠਾਂ"], ["underlying", "मूलभूत", "ਅਧਾਰਭੂਤ"],
  ["undo|undoing", "वापस करें", "ਵਾਪਸ ਕਰੋ"], ["uniquely|uniqueness", "एकमात्र रूप से", "ਇਕੋ ਤਰੀਕੇ ਨਾਲ"],
  ["unit", "इकाई", "ਇਕਾਈ"], ["unknown", "अज्ञात", "ਅਣਜਾਣ"], ["unless", "जब तक कि", "ਜਦ ਤੱਕ"],
  ["unnecessarily", "अनावश्यक रूप से", "ਬੇਲੋੜੇ ਤੌਰ ਤੇ"], ["unreduced", "असरलीकृत", "ਨਾ-ਸਰਲ"], ["unrounded", "अपूर्णांकित", "ਨਾ-ਰਾਊਂਡ ਕੀਤਾ"],
  ["until", "तक", "ਤੱਕ"], ["upper|upward", "ऊपरी", "ਉੱਪਰਲਾ"], ["used|uses", "उपयोग", "ਵਰਤੋਂ"], ["usual", "सामान्य", "ਆਮ"],
  ["verification|verified|verify", "सत्यापन", "ਤਸਦੀਕ"], ["versus", "की तुलना में", "ਦੇ ਮੁਕਾਬਲੇ"], ["vinculum", "भिन्न-रेखा", "ਭਿੰਨ-ਰੇਖਾ"],
  ["visible|visual", "दिखाई देने वाला", "ਦਿਖਾਈ ਦੇਣ ਵਾਲਾ"], ["want", "चाहिए", "ਚਾਹੀਦਾ"], ["way", "तरीका", "ਤਰੀਕਾ"],
  ["what|whether|which|whose", "क्या/कौन-सा", "ਕੀ/ਕਿਹੜਾ"], ["without", "बिना", "ਬਿਨਾਂ"], ["word", "शब्द", "ਸ਼ਬਦ"],
  ["work|worked", "हल", "ਹੱਲ"], ["would", "होगा", "ਹੋਵੇਗਾ"], ["write|writes|written", "लिखें", "ਲਿਖੋ"],
  ["wrong", "गलत", "ਗਲਤ"], ["you", "आप", "ਤੁਸੀਂ"], ["zeroes|zeros", "शून्य", "ਸਿਫ਼ਰ"],
  ["completed", "पूरा", "ਪੂਰਾ"], ["scope", "दायरा", "ਦਾਇਰਾ"], ["precedence", "प्राथमिकता", "ਤਰਜੀਹ"],
  ["operand|operands", "पद", "ਪਦ"], ["rendered", "दिखाया गया", "ਦਿਖਾਇਆ"], ["readability", "पढ़ने की सुविधा", "ਪੜ੍ਹਨ ਦੀ ਸਹੂਲਤ"],
  ["perfect", "पूर्ण", "ਪੂਰਨ"], ["endpoint", "अंत-बिंदु", "ਅੰਤ-ਬਿੰਦੂ"], ["pieces", "टुकड़े", "ਹਿੱਸੇ"],
  ["joined", "जुड़े", "ਜੁੜੇ"], ["visible", "दिखाई देने वाला", "ਦਿਖਾਈ ਦੇਣ ਵਾਲਾ"], ["heavy", "भारी", "ਭਾਰੀ"],
  ["never", "कभी नहीं", "ਕਦੇ ਨਹੀਂ"], ["missing", "लुप्त", "ਗੁੰਮ"], ["determined", "निर्धारित", "ਨਿਰਧਾਰਤ"],
  ["preserve", "बनाए रखें", "ਕਾਇਮ ਰੱਖੋ"], ["convert", "बदलें", "ਬਦਲੋ"], ["look", "देखें", "ਵੇਖੋ"],
  ["disappear", "कट जाते हैं", "ਕੱਟ ਜਾਂਦੇ ਹਨ"], ["reduction", "सरलीकरण", "ਸਰਲੀਕਰਨ"], ["required", "आवश्यक", "ਲੋੜੀਂਦਾ"],
];

const HI_WORDS = new Map<string, string>();
const PA_WORDS = new Map<string, string>();
for (const [keys, hi, pa] of WORD_GROUPS) {
  for (const key of keys.split("|")) {
    HI_WORDS.set(key, hi);
    PA_WORDS.set(key, pa);
  }
}

function replacePhrases(value: string, pairs: readonly (readonly [string, string])[]) {
  let out = value;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}

const HINDI_CHUNKS: readonly (readonly [string, string])[] = [
  ["tion", "शन"], ["sion", "ज़न"], ["ment", "मेंट"], ["ness", "नेस"], ["able", "एबल"], ["ible", "इबल"],
  ["ing", "इंग"], ["ive", "इव"], ["ous", "अस"], ["ally", "अली"], ["ity", "इटी"], ["ent", "एंट"],
  ["ance", "एंस"], ["ence", "एंस"], ["tional", "शनल"], ["ch", "च"], ["sh", "श"], ["th", "थ"],
  ["ph", "फ"], ["qu", "क्व"], ["ck", "क"], ["gh", "ग"], ["ng", "ंग"],
];
const PUNJABI_CHUNKS: readonly (readonly [string, string])[] = [
  ["tion", "ਸ਼ਨ"], ["sion", "ਜ਼ਨ"], ["ment", "ਮੈਂਟ"], ["ness", "ਨੈਸ"], ["able", "ਏਬਲ"], ["ible", "ਇਬਲ"],
  ["ing", "ਇੰਗ"], ["ive", "ਇਵ"], ["ous", "ਅਸ"], ["ally", "ਅਲੀ"], ["ity", "ਇਟੀ"], ["ent", "ਐਂਟ"],
  ["ance", "ਐਂਸ"], ["ence", "ਐਂਸ"], ["tional", "ਸ਼ਨਲ"], ["ch", "ਚ"], ["sh", "ਸ਼"], ["th", "ਥ"],
  ["ph", "ਫ"], ["qu", "ਕਵ"], ["ck", "ਕ"], ["gh", "ਗ"], ["ng", "ੰਗ"],
];

const HI_CHARS: Record<string, string> = {
  a: "अ", b: "ब", c: "क", d: "ड", e: "ए", f: "फ", g: "ग", h: "ह", i: "इ", j: "ज", k: "क", l: "ल",
  m: "म", n: "न", o: "ओ", p: "प", q: "क", r: "र", s: "स", t: "ट", u: "उ", v: "व", w: "व", x: "क्स", y: "य", z: "ज़",
};
const PA_CHARS: Record<string, string> = {
  a: "ਅ", b: "ਬ", c: "ਕ", d: "ਡ", e: "ਏ", f: "ਫ", g: "ਗ", h: "ਹ", i: "ਇ", j: "ਜ", k: "ਕ", l: "ਲ",
  m: "ਮ", n: "ਨ", o: "ਓ", p: "ਪ", q: "ਕ", r: "ਰ", s: "ਸ", t: "ਟ", u: "ਉ", v: "ਵ", w: "ਵ", x: "ਕਸ", y: "ਯ", z: "ਜ਼",
};

function transliterateLoan(word: string, language: SapTranslationLanguage) {
  let rest = word.toLowerCase();
  const chunks = language === "hi" ? HINDI_CHUNKS : PUNJABI_CHUNKS;
  const chars = language === "hi" ? HI_CHARS : PA_CHARS;
  let out = "";
  while (rest.length) {
    let matched = false;
    for (const [chunk, replacement] of chunks) {
      if (rest.startsWith(chunk)) {
        out += replacement;
        rest = rest.slice(chunk.length);
        matched = true;
        break;
      }
    }
    if (matched) continue;
    out += chars[rest[0]!] ?? rest[0]!;
    rest = rest.slice(1);
  }
  return out;
}

function translateResidualWords(value: string, language: SapTranslationLanguage) {
  const lexicon = language === "hi" ? HI_WORDS : PA_WORDS;
  return value.replace(/[A-Za-z]{3,}/gu, (word) => {
    const exact = lexicon.get(word.toLowerCase());
    return exact ?? transliterateLoan(word, language);
  });
}

function tidy(value: string) {
  return value
    .replace(/\s{2,}/gu, " ")
    .replace(/\s+([,.;:?!।])/gu, "$1")
    .replace(/([([{])\s+/gu, "$1")
    .replace(/\s+([)\]}])/gu, "$1")
    .trim();
}

export function polishSapLocalizedTextV2(text: string, language: SapTranslationLanguage): string {
  const math: string[] = [];
  let masked = text.replace(MATH, (value) => {
    const token = `§M${math.length}§`;
    math.push(value);
    return token;
  });
  masked = replacePhrases(masked, language === "hi" ? PHRASES_HI : PHRASES_PA);
  masked = translateResidualWords(masked, language);
  masked = masked.replace(/§M(\d+)§/gu, (_match, index) => math[Number(index)] ?? "");
  return tidy(masked);
}

export function applySapLocalizationPolishV2(pkg: any, language: SapTranslationLanguage) {
  const options = Object.freeze(pkg.options.map((option: unknown) => polishSapLocalizedTextV2(String(option ?? ""), language)));
  const correctIndex = Number(pkg.correctIndex);
  const answer = options[correctIndex];
  const explanationLines = Object.freeze((pkg.explanation?.lines ?? []).map((line: unknown) =>
    polishSapLocalizedTextV2(String(line ?? ""), language),
  ));
  return Object.freeze({
    ...pkg,
    stem: polishSapLocalizedTextV2(String(pkg.stem ?? ""), language),
    options,
    correctIndex,
    answer,
    explanation: Object.freeze({ lines: explanationLines }),
    traceability: Object.freeze({
      ...(pkg.traceability ?? {}),
      localizationEditorialPolish: "SAP-HI-PA-EDITORIAL-POLISH-V2",
    }),
  });
}
